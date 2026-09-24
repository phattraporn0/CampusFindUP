import { supabase, requireRole } from './supabaseClient.js';

await requireRole(['user']);

const section = document.getElementById('autoMatchSection');
const message = document.getElementById('autoMatchMessage');
const card = document.getElementById('autoMatchCard');
const image = document.getElementById('autoMatchImage');
const description = document.getElementById('autoMatchDescription');
const details = document.getElementById('autoMatchDetails');
const openButton = document.getElementById('autoMatchOpenBtn');
const lostId = new URLSearchParams(window.location.search).get('lost_id');

function normalizeText(value) {
    return String(value ?? '')
        .normalize('NFKC')
        .toLocaleLowerCase()
        .replace(/[\s\p{P}\p{S}]+/gu, '');
}

function normalizeMatchingItem(item = {}, type = '') {
    return {
        category: item.category ?? '',
        subcategory: item.subcategory ?? '',
        itemName: item.item_name ?? '',
        brand: item.brand ?? '',
        color: item.color ?? '',
        material: item.material ?? '',
        description: item.description ?? '',
        distinctiveFeature: item.distinctive_feature ?? (type === 'lost' ? item.details ?? '' : ''),
        location: item.location ?? '',
        date: type === 'lost' ? (item.lost_date ?? '') : (item.found_date ?? ''),
        time: type === 'lost' ? (item.lost_time ?? '') : (item.found_time ?? ''),
        imageUrl: item.image_url ?? '',
        status: item.status ?? '',
        id: item.id ?? ''
    };
}

function buildSemanticText(item = {}) {
    return [
        ['item_name', item.itemName],
        ['brand', item.brand],
        ['color', item.color],
        ['material', item.material],
        ['description', item.description],
        ['distinctive_feature', item.distinctiveFeature]
    ]
        .filter(([, value]) => String(value ?? '').trim() !== '')
        .map(([label, value]) => `${label}: ${String(value).trim()}`)
        .join(' ');
}

function hasSameValue(left, right) {
    const normalizedLeft = normalizeText(left);
    const normalizedRight = normalizeText(right);
    return Boolean(normalizedLeft && normalizedRight && normalizedLeft === normalizedRight);
}

function hasStructuredConflict(lost, found) {
    const categoryProvided = normalizeText(lost.category) && normalizeText(found.category);
    const subcategoryProvided = normalizeText(lost.subcategory) && normalizeText(found.subcategory);

    if (categoryProvided && !hasSameValue(lost.category, found.category)) return true;
    if (subcategoryProvided && !hasSameValue(lost.subcategory, found.subcategory)) return true;

    return false;
}

function isValidEmbedding(embedding) {
    return Array.isArray(embedding)
        && embedding.length === 384
        && embedding.every((value) => typeof value === 'number' && Number.isFinite(value));
}

function scoreMatch(lost, found) {
    const lostText = normalizeText([
        lost.itemName,
        lost.brand,
        lost.color,
        lost.material,
        lost.description,
        lost.distinctiveFeature
    ].join(' '));
    const foundText = normalizeText([
        found.itemName,
        found.brand,
        found.color,
        found.material,
        found.description,
        found.distinctiveFeature
    ].join(' '));
    const lostLocation = normalizeText(lost.location);
    const foundLocation = normalizeText(found.location);
    let score = 0;

    if (hasSameValue(lost.category, found.category)) score += 35;
    if (hasSameValue(lost.subcategory, found.subcategory)) score += 10;
    if (hasSameValue(lost.brand, found.brand)) score += 5;
    if (hasSameValue(lost.color, found.color)) score += 5;
    if (hasSameValue(lost.material, found.material)) score += 5;
    if (lostText && foundText && (lostText.includes(foundText) || foundText.includes(lostText))) score += 45;
    else if (lostText && foundText && [...lostText].some((char) => char.length > 0 && foundText.includes(char))) score += 15;
    if (lostLocation && foundLocation && (lostLocation.includes(foundLocation) || foundLocation.includes(lostLocation))) score += 15;
    if (hasSameValue(lost.date, found.date)) score += 5;
    if (hasSameValue(lost.time, found.time)) score += 3;
    return score;
}

async function findBestMatch() {
    if (!lostId) return;
    section.style.display = 'block';

    const { data: lostItem, error: lostError } = await supabase
        .from('lost_items')
        .select('item_name, category, subcategory, brand, color, material, description, details, distinctive_feature, location, lost_date, lost_time, embedding')
        .eq('id', lostId)
        .single();
    if (lostError || !lostItem) {
        message.textContent = 'ไม่สามารถโหลดข้อมูลแจ้งของหายเพื่อค้นหารายการที่ตรงกันได้';
        return;
    }

    let similarityMap = new Map();
    if (isValidEmbedding(lostItem.embedding)) {
        const { data: rpcData, error: rpcError } = await supabase.rpc('match_found_items', {
            query_embedding: lostItem.embedding,
            match_count: 10
        });

        if (rpcError) {
            console.warn('Semantic matching RPC failed. Using heuristic matching fallback.', rpcError.message);
        } else if (!Array.isArray(rpcData)) {
            console.warn('Semantic matching RPC returned invalid data. Using heuristic matching fallback.');
        } else {
            const usableRpcData = rpcData.filter((row) => {
                if (!row || !row.id) return false;
                return typeof row.similarity === 'number' && Number.isFinite(row.similarity);
            });

            if (usableRpcData.length > 0) {
                similarityMap = new Map(
                    usableRpcData.map((row) => [row.id, row.similarity])
                );
            } else {
                console.warn('Semantic matching RPC returned no usable candidates. Using heuristic matching fallback.');
            }
        }
    }

    let { data: foundItems, error: foundError } = await supabase
        .from('found_items_public')
        .select('id, category, subcategory, item_name, brand, color, material, description, distinctive_feature, location, found_date, found_time, image_url, status')
        .in('status', ['waiting', 'claimed']);
    if (foundError) {
        ({ data: foundItems, error: foundError } = await supabase
            .from('found_items_public')
            .select('id, category, description, location, found_date, image_url, status')
            .in('status', ['waiting', 'claimed']));
    }
    if (foundError) {
        message.textContent = 'ยังไม่สามารถค้นหารายการสิ่งของที่พบได้';
        return;
    }

    const normalizedLostItem = normalizeMatchingItem(lostItem, 'lost');
    const scoreCandidates = (items, prioritizeSimilarity = false) => (items || [])
        .map((item) => {
            const normalizedFoundItem = normalizeMatchingItem(item, 'found');
            return {
                item: normalizedFoundItem,
                score: scoreMatch(normalizedLostItem, normalizedFoundItem),
                similarity: similarityMap.get(item.id) ?? null
            };
        })
        .filter(({ item }) => !hasStructuredConflict(normalizedLostItem, item))
        .sort((a, b) => {
            if (prioritizeSimilarity && b.similarity !== a.similarity) {
                return b.similarity - a.similarity;
            }
            if (b.score !== a.score) return b.score - a.score;
            return (b.similarity ?? -Infinity) - (a.similarity ?? -Infinity);
        });

    const semanticCandidates = similarityMap.size > 0
        ? (foundItems || []).filter((item) => similarityMap.has(item.id))
        : [];
    let rankedCandidates = semanticCandidates.length > 0
        ? scoreCandidates(semanticCandidates, true)
        : scoreCandidates(foundItems);
    let best = rankedCandidates[0];

    if (!best || best.score < 35) {
        message.textContent = 'ตอนนี้ยังไม่พบรายการสิ่งของที่ตรงกัน ระบบจะแนะนำรายการใหม่เมื่อมีการแจ้งพบของ';
        return;
    }

    const item = best.item;
    message.textContent = `พบรายการที่อาจตรงกัน (ความตรงกัน ${best.score}%)`;
    description.textContent = item.description || 'ไม่ระบุรายละเอียด';
    details.textContent = `หมวดหมู่: ${item.category || '-'} · ประเภทย่อย: ${item.subcategory || '-'} · สถานที่พบ: ${item.location || '-'} · สถานะ: ${item.status === 'claimed' ? 'พร้อมให้ยืนยันความเป็นเจ้าของ' : 'รอเจ้าหน้าที่รับฝาก'}`;
    if (item.status === 'waiting') {
        details.textContent += ' · ต้องรอเจ้าหน้าที่รักษาความปลอดภัยยืนยันการรับฝากก่อน จึงจะยืนยันความเป็นเจ้าของและเคลมได้';
    }
    if (item.imageUrl) {
        image.src = item.imageUrl;
        image.style.display = 'block';
    }
    card.style.display = 'block';
    openButton.addEventListener('click', () => {
        localStorage.setItem('selectedFoundItemId', item.id);
        window.location.href = 'lost-item-detail.html';
    });
}

findBestMatch();
