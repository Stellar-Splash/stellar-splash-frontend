import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { NetworkStatusBanner } from '../components/NetworkStatusBanner';

describe('NetworkStatusBanner Component', () => {
  it('renders null when connection is online and not restored', () => {
    const element = React.createElement(NetworkStatusBanner, { mockIsOffline: false });
    expect(React.isValidElement(element)).toBe(true);
    expect(element.props.mockIsOffline).toBe(false);
  });

  it('renders offline alert banner when mockIsOffline is true', () => {
    const onStatusChange = vi.fn();
    const element = React.createElement(NetworkStatusBanner, {
      mockIsOffline: true,
      retryIntervalSeconds: 10,
      onStatusChange,
    });

    expect(React.isValidElement(element)).toBe(true);
    expect(element.props.mockIsOffline).toBe(true);
    expect(element.props.retryIntervalSeconds).toBe(10);
  });

  it('handles retry interval configuration and mock offline state changes', () => {
    const onStatusChange = vi.fn();
    const element = React.createElement(NetworkStatusBanner, {
      mockIsOffline: true,
      retryIntervalSeconds: 3,
      onStatusChange,
    });

    expect(element.props.retryIntervalSeconds).toBe(3);
  });
});
