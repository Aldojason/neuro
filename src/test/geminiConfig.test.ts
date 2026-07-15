import { describe, it, expect } from 'vitest';
import { GEMINI_CONFIG } from '../config/gemini';

describe('Gemini configuration', () => {
  it('does not expose a hardcoded API key in the client bundle', () => {
    expect(GEMINI_CONFIG.apiKey).toBeUndefined();
  });

  it('routes requests through a server-side proxy endpoint', () => {
    expect(GEMINI_CONFIG.apiEndpoint).toBe('/api/gemini');
  });
});
