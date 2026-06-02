import { describe, it, expect } from 'vitest';
import { cosineSimilarity, searchKnowledge } from '../chatbot-rag';
import { knowledgeChunks } from '../chatbot-knowledge';

// ── cosineSimilarity ─────────────────────────────────────────────────────

describe('cosineSimilarity', () => {
  it('returns 1.0 for identical vectors', () => {
    const v = [1, 0, 0];
    expect(cosineSimilarity(v, v)).toBeCloseTo(1.0);
  });

  it('returns 0.0 for orthogonal vectors', () => {
    expect(cosineSimilarity([1, 0], [0, 1])).toBeCloseTo(0.0);
  });

  it('returns -1.0 for opposite vectors', () => {
    expect(cosineSimilarity([1, 0], [-1, 0])).toBeCloseTo(-1.0);
  });

  it('returns 0 for zero vector (no division by zero)', () => {
    expect(cosineSimilarity([0, 0, 0], [1, 2, 3])).toBe(0);
  });

  it('handles float vectors correctly', () => {
    const a = [0.6, 0.8];
    const b = [0.6, 0.8];
    expect(cosineSimilarity(a, b)).toBeCloseTo(1.0);
  });
});

// ── knowledgeChunks structure ────────────────────────────────────────────

describe('knowledgeChunks', () => {
  it('has at least 15 chunks', () => {
    expect(knowledgeChunks.length).toBeGreaterThanOrEqual(15);
  });

  it('every chunk has a non-empty id string', () => {
    for (const chunk of knowledgeChunks) {
      expect(typeof chunk.id).toBe('string');
      expect(chunk.id.length).toBeGreaterThan(0);
    }
  });

  it('every chunk has text with meaningful content (>30 chars)', () => {
    for (const chunk of knowledgeChunks) {
      expect(typeof chunk.text).toBe('string');
      expect(chunk.text.length).toBeGreaterThan(30);
    }
  });

  it('all chunk ids are unique', () => {
    const ids = knowledgeChunks.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('all chunks mention Flexilytics or a related topic', () => {
    const relevant = knowledgeChunks.filter(
      (c) =>
        c.text.toLowerCase().includes('flexilytics') ||
        c.text.toLowerCase().includes('context') ||
        c.text.toLowerCase().includes('ai') ||
        c.text.toLowerCase().includes('data'),
    );
    expect(relevant.length).toBe(knowledgeChunks.length);
  });
});

// ── searchKnowledge ──────────────────────────────────────────────────────

describe('searchKnowledge', () => {
  const mockEmbeddings = [
    { id: 'alpha', embedding: [1, 0, 0] },
    { id: 'beta', embedding: [0, 1, 0] },
    { id: 'gamma', embedding: [0.9, 0.1, 0] },
    { id: 'delta', embedding: [0, 0, 1] },
  ];
  const mockChunks = [
    { id: 'alpha', text: 'about alpha topic' },
    { id: 'beta', text: 'about beta topic' },
    { id: 'gamma', text: 'about gamma topic' },
    { id: 'delta', text: 'about delta topic' },
  ];

  it('returns top k chunks ranked by cosine similarity', () => {
    const results = searchKnowledge([1, 0, 0], mockEmbeddings, mockChunks, 2);
    expect(results).toHaveLength(2);
    expect(results[0].id).toBe('alpha');
    expect(results[1].id).toBe('gamma');
  });

  it('results are ordered descending by similarity', () => {
    const results = searchKnowledge([1, 0, 0], mockEmbeddings, mockChunks, 4);
    const sims = results.map((r) => r.score);
    for (let i = 1; i < sims.length; i++) {
      expect(sims[i]).toBeLessThanOrEqual(sims[i - 1]);
    }
  });

  it('returns all chunks when k exceeds pool size', () => {
    const results = searchKnowledge([1, 0, 0], mockEmbeddings, mockChunks, 100);
    expect(results).toHaveLength(4);
  });

  it('returns empty array when embeddings pool is empty', () => {
    const results = searchKnowledge([1, 0, 0], [], [], 3);
    expect(results).toHaveLength(0);
  });

  it('includes id, text, and score in each result', () => {
    const [r] = searchKnowledge([1, 0, 0], mockEmbeddings, mockChunks, 1);
    expect(r).toHaveProperty('id');
    expect(r).toHaveProperty('text');
    expect(r).toHaveProperty('score');
    expect(typeof r.score).toBe('number');
  });
});
