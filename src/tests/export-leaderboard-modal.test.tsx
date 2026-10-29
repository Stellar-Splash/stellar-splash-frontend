import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import {
  ExportLeaderboardModal,
  generateLeaderboardCsv,
  LeaderboardExportRow,
} from '../components/ExportLeaderboardModal';

describe('ExportLeaderboardModal Component & CSV Serializer', () => {
  const sampleRows: LeaderboardExportRow[] = [
    {
      rank: 1,
      playerWallet: 'GA2C5RFPE6GCKMY3US5PAB6UZLKIGAHWKXX2GAKVOOUMVQHGASVMOROB',
      score: 14250,
      accuracy: 98.4,
      status: 'VERIFIED',
      attestationHash: 'abc1234567890abcdef',
    },
    {
      rank: 2,
      playerWallet: 'GB7B2W55CDAF7KAZQ7QD3W577G5C2WCK73X42O4WJ4P7G7D8',
      score: 12100,
      accuracy: 94.2,
      status: 'VERIFIED',
    },
  ];

  it('correctly formats leaderboard data into RFC-compliant CSV text', () => {
    const csv = generateLeaderboardCsv(sampleRows);
    const lines = csv.split('\n');

    expect(lines[0]).toBe('Rank,PlayerWallet,Score,AccuracyPct,Status,AttestationHash');
    expect(lines[1]).toBe(
      '1,GA2C5RFPE6GCKMY3US5PAB6UZLKIGAHWKXX2GAKVOOUMVQHGASVMOROB,14250,98.4,VERIFIED,abc1234567890abcdef'
    );
    expect(lines[2]).toBe(
      '2,GB7B2W55CDAF7KAZQ7QD3W577G5C2WCK73X42O4WJ4P7G7D8,12100,94.2,VERIFIED,'
    );
  });

  it('renders modal dialog when isOpen is true', () => {
    const html = renderToString(
      <ExportLeaderboardModal
        isOpen={true}
        onClose={vi.fn()}
        tournamentId="tourn-99"
        tournamentTitle="Stellar Arena Masters"
        rows={sampleRows}
      />
    );

    expect(html).toContain('role="dialog"');
    expect(html).toContain('Export Tournament Standings');
    expect(html).toContain('Stellar Arena Masters (#tourn-99) • 2 participants');
    expect(html).toContain('CSV Spreadsheet');
    expect(html).toContain('JSON Machine-Readable');
    expect(html).toContain('Download CSV');
  });

  it('returns null when isOpen is false', () => {
    const html = renderToString(
      <ExportLeaderboardModal
        isOpen={false}
        onClose={vi.fn()}
        tournamentId="tourn-99"
      />
    );

    expect(html).toBe('');
  });
});
