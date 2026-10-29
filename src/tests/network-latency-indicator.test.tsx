import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import {
  NetworkLatencyIndicator,
  getLatencyTier,
  getLatencyColor,
} from '../components/NetworkLatencyIndicator';

describe('NetworkLatencyIndicator Component', () => {
  it('correctly categorizes latency into performance tiers', () => {
    expect(getLatencyTier(35, true)).toBe('OPTIMAL');
    expect(getLatencyTier(150, true)).toBe('NORMAL');
    expect(getLatencyTier(350, true)).toBe('DEGRADED');
    expect(getLatencyTier(750, true)).toBe('CRITICAL');
    expect(getLatencyTier(45, false)).toBe('OFFLINE');
  });

  it('maps tiers to expected color codes', () => {
    expect(getLatencyColor('OPTIMAL')).toBe('#10b981');
    expect(getLatencyColor('NORMAL')).toBe('#06b6d4');
    expect(getLatencyColor('DEGRADED')).toBe('#f59e0b');
    expect(getLatencyColor('CRITICAL')).toBe('#ef4444');
    expect(getLatencyColor('OFFLINE')).toBe('#ef4444');
  });

  it('renders status element with formatted latency string', () => {
    const html = renderToString(
      <NetworkLatencyIndicator latencyMs={62} endpointName="Horizon Testnet" />
    );

    expect(html).toContain('role="status"');
    expect(html).toContain('latency-optimal');
    expect(html).toContain('Horizon Testnet:');
    expect(html).toContain('62ms');
  });

  it('renders offline status when isOnline is false', () => {
    const html = renderToString(
      <NetworkLatencyIndicator latencyMs={0} isOnline={false} endpointName="Engine API" />
    );

    expect(html).toContain('latency-offline');
    expect(html).toContain('Offline');
  });
});
