import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { RateLimitAlert } from '../components/RateLimitAlert';

describe('RateLimitAlert Component', () => {
  it('returns null when isRateLimited is false', () => {
    const html = renderToString(
      React.createElement(RateLimitAlert, {
        isRateLimited: false,
      })
    );
    expect(html).toBe('');
  });

  it('renders rate limit alert with endpoint and initial seconds remaining', () => {
    const html = renderToString(
      React.createElement(RateLimitAlert, {
        isRateLimited: true,
        retryAfterSeconds: 45,
        endpoint: 'Horizon Testnet RPC',
      })
    );

    expect(html).toContain('HTTP 429 Too Many Requests');
    expect(html).toContain('Horizon Testnet RPC');
    expect(html).toContain('Resuming in 45s');
    expect(html).toContain('Dismiss rate limit alert');
  });

  it('hides dismiss button when allowDismiss is false', () => {
    const html = renderToString(
      React.createElement(RateLimitAlert, {
        isRateLimited: true,
        allowDismiss: false,
      })
    );

    expect(html).not.toContain('Dismiss rate limit alert');
    expect(html).toContain('HTTP 429 Too Many Requests');
  });
});
