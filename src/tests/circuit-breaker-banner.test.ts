import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { CircuitBreakerBanner } from '../components/CircuitBreakerBanner';

describe('CircuitBreakerBanner Component', () => {
  it('renders nothing when isPaused is false', () => {
    const html = renderToString(
      React.createElement(CircuitBreakerBanner, { isPaused: false })
    );
    expect(html).toBe('');
  });

  it('renders warning banner with pause explanation when isPaused is true', () => {
    const html = renderToString(
      React.createElement(CircuitBreakerBanner, {
        isPaused: true,
        reason: 'Emergency security audit in progress.',
        contractId: 'CACHWJEZY6JN36VFACWRQ7FP4T5EPRRRNBVLOSFHXTJHETZY36JD7QYJ',
      })
    );

    expect(html).toContain('Circuit Breaker Active');
    expect(html).toContain('Emergency security audit in progress.');
    expect(html).toContain('CACHWJ...JD7QYJ');
  });

  it('renders status action button when onViewStatus handler is attached', () => {
    const onStatusMock = vi.fn();
    const html = renderToString(
      React.createElement(CircuitBreakerBanner, {
        isPaused: true,
        onViewStatus: onStatusMock,
      })
    );

    expect(html).toContain('System Status');
  });

  it('renders dismiss button when allowDismiss is true', () => {
    const html = renderToString(
      React.createElement(CircuitBreakerBanner, {
        isPaused: true,
        allowDismiss: true,
      })
    );

    expect(html).toContain('aria-label="Dismiss banner"');
  });
});
