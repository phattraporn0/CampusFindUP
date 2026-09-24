import { InferenceClient } from "npm:@huggingface/inference";

const MODEL = "intfloat/multilingual-e5-small";
const VECTOR_DIMENSION = 384;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function jsonResponse(body: Record<string, unknown>, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  });
}

function getVector(response: unknown): unknown {
  if (!Array.isArray(response)) return response;
  if (response.length === 1 && Array.isArray(response[0])) return response[0];
  return response;
}

function validateVector(response: unknown): number[] {
  const vector = getVector(response);

  if (!Array.isArray(vector)) {
    throw new Error("Hugging Face returned a response that is not a vector.");
  }

  if (vector.length !== VECTOR_DIMENSION) {
    throw new Error(`Unexpected embedding dimension: ${vector.length}.`);
  }

  if (vector.some((value) => typeof value !== "number" || !Number.isFinite(value))) {
    throw new Error("Embedding contains a non-finite or non-numeric value.");
  }

  return vector as number[];
}

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (request.method !== "POST") {
    return jsonResponse({ success: false, error: "Method must be POST." }, 405);
  }

  const token = Deno.env.get("HF_TOKEN");
  if (!token) {
    return jsonResponse({ success: false, error: "HF_TOKEN is not configured." }, 500);
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ success: false, error: "Request body must be valid JSON." }, 400);
  }

  if (!body || typeof body !== "object") {
    return jsonResponse({ success: false, error: "Request body must be a JSON object." }, 400);
  }

  const { text, type } = body as { text?: unknown; type?: unknown };

  if (typeof text !== "string" || text.trim().length === 0) {
    return jsonResponse({ success: false, error: "text must be a non-empty string." }, 400);
  }

  if (type !== "query" && type !== "passage") {
    return jsonResponse({ success: false, error: 'type must be "query" or "passage".' }, 400);
  }

  const input = `${type}: ${text.trim()}`;

  try {
    const client = new InferenceClient(token);
    const response = await client.featureExtraction({
      model: MODEL,
      inputs: input,
      normalize: true,
    });
    const embedding = validateVector(response);

    return jsonResponse({
      success: true,
      dimension: VECTOR_DIMENSION,
      embedding,
    });
  } catch {
    return jsonResponse(
      { success: false, error: "Hugging Face embedding request failed." },
      502,
    );
  }
});
