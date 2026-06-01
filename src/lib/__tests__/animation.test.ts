import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = join(process.cwd());
const indexHtml = readFileSync(join(ROOT, 'index.html'), 'utf8');

// ── engineFlow animation speed constants ─────────────────────────────────────
// speedMul controls Pulses animation speed per motion mode.
// Tuned down (calm:0.1, flow:0.5, alive:1.0) to reduce visual noise.

describe('engineFlow speedMul constants', () => {
  it('uses calm=0.1 for calm mode (slowed down from 0.5)', () => {
    expect(indexHtml).toMatch(/speedMul\s*=\s*motionMode\s*===\s*'calm'\s*\?\s*0\.1/);
  });

  it('uses flow=0.5 for flow mode (slowed down from 1)', () => {
    expect(indexHtml).toMatch(/motionMode\s*===\s*'flow'\s*\?\s*0\.5/);
  });

  it('uses alive=1.0 for alive mode (slowed down from 1.7)', () => {
    expect(indexHtml).toMatch(/motionMode\s*===\s*'flow'\s*\?\s*0\.5\s*:\s*1\.0/);
  });

  it('old values (0.5/1/1.7) not active (must be commented out)', () => {
    // Active (uncommented) speedMul line must not contain the old values
    const lines = indexHtml.split('\n');
    const activeSpeedMul = lines.find(
      (l) => !l.trimStart().startsWith('//') && l.includes('speedMul') && l.includes('motionMode')
    );
    expect(activeSpeedMul).toBeDefined();
    expect(activeSpeedMul).not.toMatch(/0\.5\s*:\s*motionMode/); // old calm=0.5
    expect(activeSpeedMul).not.toMatch(/:\s*1\.7/);              // old alive=1.7
  });
});
