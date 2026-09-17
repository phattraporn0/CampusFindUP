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

function normalize(value) {
    return String(value || '').toLowerCase().replace(/[\s\p{P}\p{S}]+/gu, '');
}

function scoreMatch(lost, found) {
    const lostText = normalize(`${lost.item_name} ${lost.description}`);
    const foundText = normalize(`${found.description}`);
    const lostLocation = normalize(lost.location);
    const foundLocation = normalize(found.location);
    let score = 0;

    if (lost.category && found.category && normalize(lost.category) === normalize(found.category)) score += 35;
    if (lostText && foundText && (lostText.includes(foundText) || foundText.includes(lostText))) score += 45;
    else if (lostText && foundText && [...lostText].some((char) => char.length > 0 && foundText.includes(char))) score += 15;
    if (lostLocation && foundLocation && (lostLocation.includes(foundLocation) || foundLocation.includes(lostLocation))) score += 15;
    if (lost.lost_date && found.found_date && lost.lost_date === found.found_date) score += 5;
    return score;
}

async function findBestMatch() {
    if (!lostId) return;
    section.style.display = 'block';

    const { data: lostItem, error: lostError } = await supabase
        .from('lost_items')
        .select('item_name, category, description, location, lost_date')
        .eq('id', lostId)
        .single();
    if (lostError || !lostItem) {
        message.textContent = 'ไม่สามารถโหลดข้อมูลแจ้งของหายเพื่อค้นหารายการที่ตรงกันได้';
        return;
    }

    const { data: foundItems, error: foundError } = await supabase
        .from('found_items_public')
        .select('id, category, description, location, found_date, image_url, status')
        .in('status', ['waiting', 'claimed']);
    if (foundError) {
        message.textContent = 'ยังไม่สามารถค้นหารายการสิ่งของที่พบได้';
        return;
    }

    const best = (foundItems || [])
        .map((item) => ({ item, score: scoreMatch(lostItem, item) }))
        .sort((a, b) => b.score - a.score)[0];

    if (!best || best.score < 35) {
        message.textContent = 'ตอนนี้ยังไม่พบรายการสิ่งของที่ตรงกัน ระบบจะแนะนำรายการใหม่เมื่อมีการแจ้งพบของ';
        return;
    }

    const item = best.item;
    message.textContent = `พบรายการที่อาจตรงกัน (ความตรงกัน ${best.score}%)`;
    description.textContent = item.description || 'ไม่ระบุรายละเอียด';
    details.textContent = `หมวดหมู่: ${item.category || '-'} · สถานที่พบ: ${item.location || '-'} · สถานะ: ${item.status === 'claimed' ? 'พร้อมให้ยืนยันความเป็นเจ้าของ' : 'รอเจ้าหน้าที่รับฝาก'}`;
    if (item.status === 'waiting') {
        details.textContent += ' · ต้องรอเจ้าหน้าที่รักษาความปลอดภัยยืนยันการรับฝากก่อน จึงจะยืนยันความเป็นเจ้าของและเคลมได้';
    }
    if (item.image_url) {
        image.src = item.image_url;
        image.style.display = 'block';
    }
    card.style.display = 'block';
    openButton.addEventListener('click', () => {
        localStorage.setItem('selectedFoundItemId', item.id);
        window.location.href = 'lost-item-detail.html';
    });
}

findBestMatch();
