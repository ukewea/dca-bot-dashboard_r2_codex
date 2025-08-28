import { describe, it, expect } from 'vitest';
import { parseNdjson } from './ndjson';

describe('parseNdjson', () => {
  it('parses valid lines and ignores blanks', () => {
    const text = '\n{"a":1}\n\n{"b":2}\n';
    const out = parseNdjson(text) as any[];
    expect(out.length).toBe(2);
    expect(out[0].a).toBe(1);
    expect(out[1].b).toBe(2);
  });

  it('tolerates a malformed trailing line', () => {
    const text = '{"a":1}\n{"b":2}\n{"c":3';
    const out = parseNdjson(text) as any[];
    expect(out.length).toBe(2);
  });
});

