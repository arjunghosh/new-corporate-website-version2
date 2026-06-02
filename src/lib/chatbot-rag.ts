import type { KnowledgeChunk } from './chatbot-knowledge';

export type EmbeddedChunk = { id: string; embedding: number[] };

export type SearchResult = KnowledgeChunk & { score: number };

export function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  const denom = Math.sqrt(normA) * Math.sqrt(normB);
  if (denom === 0) return 0;
  return dot / denom;
}

export function searchKnowledge(
  queryEmbedding: number[],
  embeddings: EmbeddedChunk[],
  chunks: KnowledgeChunk[],
  k: number,
): SearchResult[] {
  const chunkMap = new Map(chunks.map((c) => [c.id, c]));

  return embeddings
    .map((e) => {
      const chunk = chunkMap.get(e.id);
      if (!chunk) return null;
      return { ...chunk, score: cosineSimilarity(queryEmbedding, e.embedding) };
    })
    .filter((r): r is SearchResult => r !== null)
    .sort((a, b) => b.score - a.score)
    .slice(0, k);
}
