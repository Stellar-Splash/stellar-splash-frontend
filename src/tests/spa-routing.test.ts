import { describe, it, expect } from 'vitest';

export interface RouteMatch {
  matched: boolean;
  view: string;
  params: Record<string, string>;
}

export function matchSpaRoute(pathname: string): RouteMatch {
  if (pathname === '/' || pathname === '') {
    return { matched: true, view: 'landing', params: {} };
  }
  if (pathname === '/leaderboard') {
    return { matched: true, view: 'leaderboard', params: {} };
  }
  if (pathname === '/arbitration' || pathname === '/disputes') {
    return { matched: true, view: 'disputes', params: {} };
  }
  const tournamentMatch = pathname.match(/^\/tournament\/(\d+)$/);
  if (tournamentMatch) {
    return { matched: true, view: 'tournament-detail', params: { id: tournamentMatch[1] } };
  }
  const replayMatch = pathname.match(/^\/replay\/([a-zA-Z0-9_-]+)$/);
  if (replayMatch) {
    return { matched: true, view: 'replay-viewer', params: { replayId: replayMatch[1] } };
  }
  return { matched: false, view: 'not-found', params: {} };
}

describe('SPA Route Pattern Matcher', () => {
  it('matches root / landing page', () => {
    const res = matchSpaRoute('/');
    expect(res.matched).toBe(true);
    expect(res.view).toBe('landing');
  });

  it('matches /leaderboard', () => {
    const res = matchSpaRoute('/leaderboard');
    expect(res.matched).toBe(true);
    expect(res.view).toBe('leaderboard');
  });

  it('matches /tournament/:id with numeric parameter', () => {
    const res = matchSpaRoute('/tournament/42');
    expect(res.matched).toBe(true);
    expect(res.view).toBe('tournament-detail');
    expect(res.params.id).toBe('42');
  });

  it('matches /replay/:replayId with slug parameter', () => {
    const res = matchSpaRoute('/replay/match_xyz_99');
    expect(res.matched).toBe(true);
    expect(res.view).toBe('replay-viewer');
    expect(res.params.replayId).toBe('match_xyz_99');
  });

  it('returns not-found for unmapped paths', () => {
    const res = matchSpaRoute('/unknown/subpath');
    expect(res.matched).toBe(false);
    expect(res.view).toBe('not-found');
  });
});

