import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { StellarExpertLink } from '../components/StellarExpertLink';

describe('StellarExpertLink Component', () => {
  const sampleTx = 'a1b2c3d4e5f60718293a4b5c6d7e8f90123456789abcdef0123456789abcdef0';
  const sampleAddress = 'GCKAZD66N6E64B44J7K3XW6P2W3V7QOXWCV7T4KQL3ZPL2GB6V2A73VU';
  const sampleContract = 'CACHWJEZY6JN36VFACWRQ7FP4T5EPRRRNBVLOSFHXTJHETZY36JD7QYJ';

  it('renders correct explorer URL for transaction', () => {
    const html = renderToString(
      React.createElement(StellarExpertLink, { type: 'tx', id: sampleTx })
    );

    expect(html).toContain(`https://stellar.expert/explorer/testnet/tx/${sampleTx}`);
    expect(html).toContain('a1b2c3...bcdef0'); // Shortened
  });

  it('renders correct explorer URL for account', () => {
    const html = renderToString(
      React.createElement(StellarExpertLink, { type: 'account', id: sampleAddress })
    );

    expect(html).toContain(`https://stellar.expert/explorer/testnet/account/${sampleAddress}`);
    expect(html).toContain('GCKAZD...2A73VU');
  });

  it('renders correct explorer URL for contract', () => {
    const html = renderToString(
      React.createElement(StellarExpertLink, { type: 'contract', id: sampleContract })
    );

    expect(html).toContain(`https://stellar.expert/explorer/testnet/contract/${sampleContract}`);
    expect(html).toContain('CACHWJ...JD7QYJ');
  });

  it('renders custom label without shortening when provided', () => {
    const html = renderToString(
      React.createElement(StellarExpertLink, {
        type: 'contract',
        id: sampleContract,
        label: 'View Vault Contract',
      })
    );

    expect(html).toContain('View Vault Contract');
  });
});
