import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { ContractUpgradeBanner } from '../components/ContractUpgradeBanner';

describe('ContractUpgradeBanner Component', () => {
  it('returns null when isUpgraded is false', () => {
    const html = renderToString(
      React.createElement(ContractUpgradeBanner, {
        isUpgraded: false,
      })
    );
    expect(html).toBe('');
  });

  it('renders upgrade notice with version and truncated WASM hash', () => {
    const dummyHash = '11223344556677889900aabbccddeeff11223344556677889900aabbccddeeff';
    const html = renderToString(
      React.createElement(ContractUpgradeBanner, {
        isUpgraded: true,
        protocolVersion: 21,
        newWasmHash: dummyHash,
        onViewDetails: vi.fn(),
      })
    );

    expect(html).toContain('Contract Upgraded (v21)');
    expect(html).toContain('11223344...ddeeff');
    expect(html).toContain('Release Notes');
    expect(html).toContain('Dismiss upgrade banner');
  });

  it('hides dismiss button when allowDismiss is false', () => {
    const html = renderToString(
      React.createElement(ContractUpgradeBanner, {
        isUpgraded: true,
        allowDismiss: false,
      })
    );

    expect(html).not.toContain('Dismiss upgrade banner');
  });
});
