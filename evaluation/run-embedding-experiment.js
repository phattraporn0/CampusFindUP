const fs = require("node:fs");
const path = require("node:path");

const DATASET_PATH = path.join(__dirname, "evaluation-dataset.json");
const SMOKE_TEST_MODEL = "intfloat/multilingual-e5-small";
const SMOKE_TEST_TEXT = "query: ชื่อสิ่งของ: โทรศัพท์มือถือ\nสี: ดำ";
const SMOKE_TEST_DIMENSION = 384;
const PAIRWISE_TEST_IDS = [
  "TC-001", "TC-002", "TC-003", "TC-004", "TC-005",
  "TC-006", "TC-007", "TC-008", "TC-009", "TC-010",
  "TC-011", "TC-012", "TC-013", "TC-014", "TC-015",
  "TC-016", "TC-017", "TC-018", "TC-019", "TC-020"
];

const MATCHING_FIELDS = [
  ["item_name", "ชื่อสิ่งของ"],
  ["brand", "ยี่ห้อ"],
  ["color", "สี"],
  ["material", "วัสดุ"],
  ["description", "รายละเอียด"],
  ["distinctive_feature", "จุดสังเกต"],
];

const ALLOWED_GROUPS = new Set([
  "Positive",
  "Hard Negative",
  "Ambiguous",
  "Thai Language Robustness",
  "Structured vs Semantic Conflict",
]);

const ALLOWED_RELATIONSHIPS = new Set([
  "Highly Similar",
  "Similar",
  "Uncertain",
  "Different",
]);

// Candidate configuration only. No model is loaded or selected as a winner.
const MODEL_CANDIDATES = [
  { name: "intfloat/multilingual-e5-small", provider: "not-configured", prefix: "model-specific" },
  { name: "intfloat/multilingual-e5-base", provider: "not-configured", prefix: "model-specific" },
  { name: "sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2", provider: "not-configured", prefix: "none-unless-model-requires" },
  { name: "nondevs/simcse-model-thai-v0", provider: "not-configured", prefix: "none-unless-model-requires" },
  { name: "LaBSE", provider: "not-configured", prefix: "none-unless-model-requires" },
];

function loadDataset(datasetPath = DATASET_PATH) {
  if (!fs.existsSync(datasetPath)) {
    throw new Error("Dataset file not found: " + datasetPath);
  }

  let parsed;
  try {
    parsed = JSON.parse(fs.readFileSync(datasetPath, "utf8"));
  } catch (error) {
    throw new Error("Dataset JSON could not be parsed: " + error.message);
  }

  if (!Array.isArray(parsed)) {
    throw new Error("Dataset must be a JSON array.");
  }

  return parsed;
}

function validateDataset(dataset) {
  const ids = new Set();
  const errors = [];

  dataset.forEach((testCase, index) => {
    const location = "dataset[" + index + "]";
    const id = testCase && testCase.test_case_id ? testCase.test_case_id : location;

    if (typeof (testCase && testCase.test_case_id) !== "string" || !testCase.test_case_id.trim()) {
      errors.push(location + ".test_case_id is required.");
    } else if (ids.has(testCase.test_case_id)) {
      errors.push("Duplicate test_case_id: " + testCase.test_case_id);
    } else {
      ids.add(testCase.test_case_id);
    }

    if (!ALLOWED_GROUPS.has(testCase && testCase.group)) {
      errors.push(id + ".group is invalid or missing.");
    }

    if (!ALLOWED_RELATIONSHIPS.has(testCase && testCase.expected_relationship)) {
      errors.push(id + ".expected_relationship is invalid or missing.");
    }

    if (typeof (testCase && testCase.reason) !== "string" || !testCase.reason.trim()) {
      errors.push(id + ".reason is required.");
    }

    ["lost", "found"].forEach((side) => {
      if (!testCase || !testCase[side] || typeof testCase[side] !== "object") {
        errors.push(id + "." + side + " is required.");
        return;
      }

      MATCHING_FIELDS.forEach(([field]) => {
        if (typeof testCase[side][field] !== "string") {
          errors.push(id + "." + side + "." + field + " must be a string.");
        }
      });
    });
  });

  if (errors.length > 0) {
    throw new Error("Dataset validation failed:\n- " + errors.join("\n- "));
  }
}

function normalizeFieldValue(value) {
  if (value === null || value === undefined) return "";

  return String(value)
    .normalize("NFKC")
    .trim()
    .replace(/\s+/gu, " ");
}

function buildMatchingText(item) {
  if (!item || typeof item !== "object") {
    throw new Error("Cannot build Matching Text from an invalid item.");
  }

  const lines = MATCHING_FIELDS
    .map(([field, label]) => {
      const value = normalizeFieldValue(item[field]);
      return value ? label + ": " + value : "";
    })
    .filter(Boolean);

  if (lines.length === 0) {
    throw new Error("Matching Text is empty because all input fields are empty.");
  }

  return lines.join("\n");
}

function preparePair(testCase) {
  return {
    test_case_id: testCase.test_case_id,
    group: testCase.group,
    expected_relationship: testCase.expected_relationship,
    lost_text: buildMatchingText(testCase.lost),
    found_text: buildMatchingText(testCase.found),
  };
}

function validateVector(vector, label) {
  if (!Array.isArray(vector) || vector.length === 0) {
    throw new Error(label + " is not a non-empty numeric vector.");
  }

  if (vector.some((value) => typeof value !== "number" || !Number.isFinite(value))) {
    throw new Error(label + " contains a non-finite or non-numeric value.");
  }

  if (vector.every((value) => value === 0)) {
    throw new Error(label + " is a zero vector.");
  }
}

function cosineSimilarity(left, right) {
  validateVector(left, "Left vector");
  validateVector(right, "Right vector");

  if (left.length !== right.length) {
    throw new Error("Vector dimension mismatch: " + left.length + " !== " + right.length);
  }

  let dotProduct = 0;
  let leftNormSquared = 0;
  let rightNormSquared = 0;

  for (let index = 0; index < left.length; index += 1) {
    dotProduct += left[index] * right[index];
    leftNormSquared += left[index] ** 2;
    rightNormSquared += right[index] ** 2;
  }

  const denominator = Math.sqrt(leftNormSquared) * Math.sqrt(rightNormSquared);
  if (denominator === 0) {
    throw new Error("Cosine Similarity cannot be calculated for a zero vector.");
  }

  return dotProduct / denominator;
}

function createExperimentResult(pair, model, similarity) {
  if (typeof similarity !== "number" || !Number.isFinite(similarity)) {
    throw new Error("Experiment result contains an invalid cosine similarity.");
  }

  return {
    test_case_id: pair.test_case_id,
    group: pair.group,
    expected_relationship: pair.expected_relationship,
    lost_text: pair.lost_text,
    found_text: pair.found_text,
    cosine_similarity: similarity,
    model,
  };
}

function getSafeErrorMessage(error) {
  const message = error instanceof Error ? error.message : String(error);
  const token = process.env.HF_TOKEN;
  return token ? message.split(token).join("[REDACTED]") : message;
}

function extractSingleVector(response) {
  if (!Array.isArray(response)) {
    throw new Error("Hugging Face response is not an array.");
  }

  const vector = response.length === 1 && Array.isArray(response[0]) ? response[0] : response;
  validateVector(vector, "Embedding vector");
  return vector;
}

async function generateEmbedding(text, model = SMOKE_TEST_MODEL) {
  const token = process.env.HF_TOKEN;
  if (!token) {
    throw new Error("HF_TOKEN is missing. Set HF_TOKEN before running the smoke test.");
  }

  const { InferenceClient } = require("@huggingface/inference");
  const client = new InferenceClient(token);
  const response = await client.featureExtraction({
    model,
    inputs: text,
    normalize: true,
  });

  return extractSingleVector(response);
}

async function runSmokeTest() {
  try {
    const vector = await generateEmbedding(SMOKE_TEST_TEXT, SMOKE_TEST_MODEL);

    if (vector.length !== SMOKE_TEST_DIMENSION) {
      throw new Error(
        "Unexpected vector dimension: " + vector.length + " (expected " + SMOKE_TEST_DIMENSION + ").",
      );
    }

    console.log("Smoke Test: PASS");
    console.log("Model: " + SMOKE_TEST_MODEL);
    console.log("Dimension: " + vector.length);
    console.log("Vector received: true");
    return { status: "PASS", model: SMOKE_TEST_MODEL, dimension: vector.length, vector_received: true };
  } catch (error) {
    console.error("Smoke Test: FAIL");
    console.error("Model: " + SMOKE_TEST_MODEL);
    console.error("Reason: " + getSafeErrorMessage(error));
    process.exitCode = 1;
    return { status: "FAIL", model: SMOKE_TEST_MODEL, vector_received: false };
  }
}

const QUERY_PREFIX = "query: ";
const PASSAGE_PREFIX = "passage: ";

function addQueryPrefix(matchingText) {
  return QUERY_PREFIX + matchingText;
}

function addPassagePrefix(matchingText) {
  return PASSAGE_PREFIX + matchingText;
}

async function runPairwiseTest() {
  const dataset = loadDataset();
  validateDataset(dataset);

  const selectedCases = PAIRWISE_TEST_IDS.map((testCaseId) => {
    const testCase = dataset.find((candidate) => candidate.test_case_id === testCaseId);
    if (!testCase) {
      throw new Error("Required test case was not found: " + testCaseId);
    }
    return preparePair(testCase);
  });

  for (const pair of selectedCases) {
    console.log("Running: " + pair.test_case_id);
    const lostText = addQueryPrefix(pair.lost_text);
    const foundText = addPassagePrefix(pair.found_text);  
    const lostVector = await generateEmbedding(lostText, SMOKE_TEST_MODEL);
    const foundVector = await generateEmbedding(foundText, SMOKE_TEST_MODEL);

    if (lostVector.length !== SMOKE_TEST_DIMENSION || foundVector.length !== SMOKE_TEST_DIMENSION) {
      throw new Error(
        "Unexpected vector dimension for " + pair.test_case_id + "; expected " + SMOKE_TEST_DIMENSION + ".",
      );
    }

    const similarity = cosineSimilarity(lostVector, foundVector);
    console.log("Test ID: " + pair.test_case_id);
    console.log("Ground Truth: " + pair.expected_relationship);
    console.log("Cosine Similarity: " + similarity);
    console.log("Vector Dimension: " + lostVector.length);
  }
}

async function runModelExperiment() {
  throw new Error("Experiment is blocked: configure an approved Embedding Provider/Adapter before generating results.");
}

function runPrototypeCheck() {
  const dataset = loadDataset();
  validateDataset(dataset);
  const preparedPairs = dataset.map(preparePair);

  return {
    status: "prototype-only",
    dataset: path.relative(process.cwd(), DATASET_PATH),
    pair_count: preparedPairs.length,
    model_candidates: MODEL_CANDIDATES.map((model) => model.name),
    embedding_generated: false,
    api_called: false,
    results_written: false,
    note: "No Embedding Provider/SDK/API is configured. Only Dataset validation and Matching Text preparation were performed.",
  };
}

if (require.main === module) {
  runPairwiseTest().catch((error) => {
    console.error("Pairwise Embedding Test: FAIL");
    console.error("Reason: " + getSafeErrorMessage(error));
    process.exitCode = 1;
  });
}

module.exports = {
  MODEL_CANDIDATES,
  MATCHING_FIELDS,
  SMOKE_TEST_MODEL,
  SMOKE_TEST_TEXT,
  PAIRWISE_TEST_IDS,
  buildMatchingText,
  cosineSimilarity,
  createExperimentResult,
  generateEmbedding,
  loadDataset,
  preparePair,
  runModelExperiment,
  runPairwiseTest,
  runPrototypeCheck,
  runSmokeTest,
  validateDataset,
};
