import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://haxbpgjnsyygoatagrmf.supabase.co';
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhheGJwZ2puc3l5Z29hdGFncm1mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ4MjM2ODksImV4cCI6MjA4MDM5OTY4OX0.fDbMuoxxErs0c8O0oHul4-Evf9epaOg-b_U0Ds9j1rI';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export interface LeaderboardEntry {
  id: number;
  player_name: string;
  time_ms: number;
  time_display: string;
  created_at: string;
}

/**
 * Submit a score to the leaderboard
 */
export async function submitScore(
  playerName: string,
  timeMs: number,
  timeDisplay: string,
): Promise<{ success: boolean; rank: number | null }> {
  const { error } = await supabase.from('leaderboard').insert({
    player_name: playerName,
    time_ms: timeMs,
    time_display: timeDisplay,
  });

  if (error) {
    console.error('Error submitting score:', error);
    return { success: false, rank: null };
  }

  // Get the player's rank
  const rank = await getPlayerRank(timeMs);
  return { success: true, rank };
}

/**
 * Get top scores from the leaderboard
 */
export async function getTopScores(limit = 5): Promise<LeaderboardEntry[]> {
  const { data, error } = await supabase
    .from('leaderboard')
    .select('*')
    .order('time_ms', { ascending: true })
    .limit(limit);

  if (error) {
    console.error('Error fetching leaderboard:', error);
    return [];
  }

  return data ?? [];
}

/**
 * Get player's rank based on their time
 */
async function getPlayerRank(timeMs: number): Promise<number | null> {
  const { count, error } = await supabase
    .from('leaderboard')
    .select('*', { count: 'exact', head: true })
    .lt('time_ms', timeMs);

  if (error) {
    console.error('Error getting rank:', error);
    return null;
  }

  return (count ?? 0) + 1;
}
