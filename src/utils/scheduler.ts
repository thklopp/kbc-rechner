import { ScheduledMatch, Team, TournamentSettings, TeamMatchSchedule, Category, MatchOverride, LabelsConfig, CategoryConfig } from '../types';
import { DEFAULT_LABELS, DEFAULT_CATEGORIES } from './defaultData';

/**
 * Converts "HH:mm" to minutes from midnight
 */
export function timeToMinutes(timeStr: string): number {
  const parts = timeStr.split(':');
  if (parts.length < 2) return 0;
  const hours = parseInt(parts[0], 10) || 0;
  const minutes = parseInt(parts[1], 10) || 0;
  return hours * 60 + minutes;
}

/**
 * Converts minutes from midnight back to "HH:mm"
 */
export function minutesToTime(totalMinutes: number): string {
  const normalized = Math.max(0, Math.floor(totalMinutes));
  const hours = Math.floor(normalized / 60) % 24;
  const minutes = normalized % 60;
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

/**
 * Adds minutes to an "HH:mm" time string
 */
export function addMinutes(timeStr: string, minutesToAdd: number): string {
  return minutesToTime(timeToMinutes(timeStr) + minutesToAdd);
}

/**
 * Format duration in minutes to human readable German string
 * e.g. 125 -> "2 Std. 05 Min." or 45 -> "45 Min."
 */
export function formatDurationGerman(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} Min.`;
  }
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (mins === 0) {
    return `${hrs} Std.`;
  }
  return `${hrs} Std. ${mins.toString().padStart(2, '0')} Min.`;
}

/**
 * Generates the Saturday group stage matches (24 matches)
 * Rule: Single pitch, alternating in 2-game blocks
 */
export function generateSaturdayMatches(
  teams: Team[],
  settings: TournamentSettings,
  labels: LabelsConfig = DEFAULT_LABELS,
  categories: { cat1: CategoryConfig; cat2: CategoryConfig } = DEFAULT_CATEGORIES
): ScheduledMatch[] {
  const matches: ScheduledMatch[] = [];

  const getTeam = (cat: Category, grp: 'A' | 'B', seed: number): Team => {
    const found = teams.find(t => t.category === cat && t.group === grp && t.seed === seed);
    if (found) return found;
    return {
      id: `${cat}-${grp.toLowerCase()}${seed}`,
      name: `${cat === 'maedchen' ? categories.cat1.code : categories.cat2.code} ${grp}${seed}`,
      category: cat,
      group: grp,
      seed,
    };
  };

  // Group match pairings definitions for a 4-team group (teams 1, 2, 3, 4):
  // Round 1: 1 vs 2, 3 vs 4
  // Round 2: 1 vs 3, 2 vs 4
  // Round 3: 4 vs 1, 2 vs 3
  const groupRounds = [
    { seed1: 1, seed2: 2 },
    { seed1: 3, seed2: 4 },
    { seed1: 1, seed2: 3 },
    { seed1: 2, seed2: 4 },
    { seed1: 4, seed2: 1 },
    { seed1: 2, seed2: 3 },
  ];

  let currentTime = settings.saturdayStartTime;
  let matchNumber = 1;

  // We have 6 cycles: each cycle has 2 cat1 games + 2 cat2 games = 4 games
  // 6 * 4 = 24 matches in total!
  for (let cycle = 0; cycle < 6; cycle++) {
    const roundDef = groupRounds[cycle];
    const blockNumberM = cycle * 2 + 1;
    const blockNumberJ = cycle * 2 + 2;

    // --- Block A: 2 cat1 Games (Group A then Group B) ---
    // Game 1 of Block: cat1 Gruppe A
    const mA_t1 = getTeam('maedchen', 'A', roundDef.seed1);
    const mA_t2 = getTeam('maedchen', 'A', roundDef.seed2);
    const m1_end = addMinutes(currentTime, settings.matchDurationMinutes);

    const isLunchAfter1 = settings.saturdayLunchEnabled && matchNumber === settings.saturdayLunchAfterMatch;
    const break1 = settings.breakDurationMinutes + (isLunchAfter1 ? settings.saturdayLunchDurationMinutes : 0);

    matches.push({
      id: `sat-m-${matchNumber}`,
      matchNumber,
      dayNumber: 1,
      dayName: 'Samstag',
      blockNumber: blockNumberM,
      category: 'maedchen',
      roundType: 'group',
      roundLabel: labels.groupA || 'Gruppe A',
      group: 'A',
      team1: { id: mA_t1.id, name: mA_t1.name },
      team2: { id: mA_t2.id, name: mA_t2.name },
      startTime: currentTime,
      endTime: m1_end,
      pitch: settings.pitchName,
      breakAfterMinutes: break1,
      isLunchBreakAfter: isLunchAfter1,
      lunchDurationMinutes: isLunchAfter1 ? settings.saturdayLunchDurationMinutes : undefined,
    });
    currentTime = addMinutes(m1_end, break1);
    matchNumber++;

    // Game 2 of Block: cat1 Gruppe B
    const mB_t1 = getTeam('maedchen', 'B', roundDef.seed1);
    const mB_t2 = getTeam('maedchen', 'B', roundDef.seed2);
    const m2_end = addMinutes(currentTime, settings.matchDurationMinutes);

    const isLunchAfter2 = settings.saturdayLunchEnabled && matchNumber === settings.saturdayLunchAfterMatch;
    const break2 = settings.breakDurationMinutes + (isLunchAfter2 ? settings.saturdayLunchDurationMinutes : 0);

    matches.push({
      id: `sat-m-${matchNumber}`,
      matchNumber,
      dayNumber: 1,
      dayName: 'Samstag',
      blockNumber: blockNumberM,
      category: 'maedchen',
      roundType: 'group',
      roundLabel: labels.groupB || 'Gruppe B',
      group: 'B',
      team1: { id: mB_t1.id, name: mB_t1.name },
      team2: { id: mB_t2.id, name: mB_t2.name },
      startTime: currentTime,
      endTime: m2_end,
      pitch: settings.pitchName,
      breakAfterMinutes: break2,
      isLunchBreakAfter: isLunchAfter2,
      lunchDurationMinutes: isLunchAfter2 ? settings.saturdayLunchDurationMinutes : undefined,
    });
    currentTime = addMinutes(m2_end, break2);
    matchNumber++;

    // --- Block B: 2 cat2 Games (Group A then Group B) ---
    // Game 1 of Block: cat2 Gruppe A
    const jA_t1 = getTeam('jungs', 'A', roundDef.seed1);
    const jA_t2 = getTeam('jungs', 'A', roundDef.seed2);
    const j1_end = addMinutes(currentTime, settings.matchDurationMinutes);

    const isLunchAfter3 = settings.saturdayLunchEnabled && matchNumber === settings.saturdayLunchAfterMatch;
    const break3 = settings.breakDurationMinutes + (isLunchAfter3 ? settings.saturdayLunchDurationMinutes : 0);

    matches.push({
      id: `sat-m-${matchNumber}`,
      matchNumber,
      dayNumber: 1,
      dayName: 'Samstag',
      blockNumber: blockNumberJ,
      category: 'jungs',
      roundType: 'group',
      roundLabel: labels.groupA || 'Gruppe A',
      group: 'A',
      team1: { id: jA_t1.id, name: jA_t1.name },
      team2: { id: jA_t2.id, name: jA_t2.name },
      startTime: currentTime,
      endTime: j1_end,
      pitch: settings.pitchName,
      breakAfterMinutes: break3,
      isLunchBreakAfter: isLunchAfter3,
      lunchDurationMinutes: isLunchAfter3 ? settings.saturdayLunchDurationMinutes : undefined,
    });
    currentTime = addMinutes(j1_end, break3);
    matchNumber++;

    // Game 2 of Block: cat2 Gruppe B
    const jB_t1 = getTeam('jungs', 'B', roundDef.seed1);
    const jB_t2 = getTeam('jungs', 'B', roundDef.seed2);
    const j2_end = addMinutes(currentTime, settings.matchDurationMinutes);

    const isLunchAfter4 = settings.saturdayLunchEnabled && matchNumber === settings.saturdayLunchAfterMatch;
    const break4 = settings.breakDurationMinutes + (isLunchAfter4 ? settings.saturdayLunchDurationMinutes : 0);

    matches.push({
      id: `sat-m-${matchNumber}`,
      matchNumber,
      dayNumber: 1,
      dayName: 'Samstag',
      blockNumber: blockNumberJ,
      category: 'jungs',
      roundType: 'group',
      roundLabel: labels.groupB || 'Gruppe B',
      group: 'B',
      team1: { id: jB_t1.id, name: jB_t1.name },
      team2: { id: jB_t2.id, name: jB_t2.name },
      startTime: currentTime,
      endTime: j2_end,
      pitch: settings.pitchName,
      breakAfterMinutes: break4,
      isLunchBreakAfter: isLunchAfter4,
      lunchDurationMinutes: isLunchAfter4 ? settings.saturdayLunchDurationMinutes : undefined,
    });
    currentTime = addMinutes(j2_end, break4);
    matchNumber++;
  }

  return matches;
}

/**
 * Generates Sunday Final and Placement matches (16 matches or 8 matches)
 * Rule: Single pitch, alternating in 2-game blocks
 */
export function generateSundayMatches(
  settings: TournamentSettings,
  labels: LabelsConfig = DEFAULT_LABELS,
  categories: { cat1: CategoryConfig; cat2: CategoryConfig } = DEFAULT_CATEGORIES
): ScheduledMatch[] {
  const matches: ScheduledMatch[] = [];
  let currentTime = settings.sundayStartTime;
  let matchNumber = 25; // Continuous match numbering from Saturday (24) or relative

  interface SundayBlockDef {
    category: Category;
    blockNumber: number;
    match1: {
      roundType: ScheduledMatch['roundType'];
      roundLabel: string;
      team1Label: string;
      team2Label: string;
    };
    match2: {
      roundType: ScheduledMatch['roundType'];
      roundLabel: string;
      team1Label: string;
      team2Label: string;
    };
  }

  const fullBlocks: SundayBlockDef[] = [
    // Block 1: cat1 Halbfinals Plätze 5-8
    {
      category: 'maedchen',
      blockNumber: 1,
      match1: {
        roundType: 'semi_placement',
        roundLabel: labels.semiFinalPlacement1 || 'Halbfinale Plätze 5–8 (HF-T1)',
        team1Label: `3. ${labels.groupA || 'Gruppe A'}`,
        team2Label: `4. ${labels.groupB || 'Gruppe B'}`,
      },
      match2: {
        roundType: 'semi_placement',
        roundLabel: labels.semiFinalPlacement2 || 'Halbfinale Plätze 5–8 (HF-T2)',
        team1Label: `3. ${labels.groupB || 'Gruppe B'}`,
        team2Label: `4. ${labels.groupA || 'Gruppe A'}`,
      },
    },
    // Block 2: cat2 Halbfinals Plätze 5-8
    {
      category: 'jungs',
      blockNumber: 2,
      match1: {
        roundType: 'semi_placement',
        roundLabel: labels.semiFinalPlacement1 || 'Halbfinale Plätze 5–8 (HF-T1)',
        team1Label: `3. ${labels.groupA || 'Gruppe A'}`,
        team2Label: `4. ${labels.groupB || 'Gruppe B'}`,
      },
      match2: {
        roundType: 'semi_placement',
        roundLabel: labels.semiFinalPlacement2 || 'Halbfinale Plätze 5–8 (HF-T2)',
        team1Label: `3. ${labels.groupB || 'Gruppe B'}`,
        team2Label: `4. ${labels.groupA || 'Gruppe A'}`,
      },
    },
    // Block 3: cat1 Halbfinals Plätze 1-4 (Championship Semis)
    {
      category: 'maedchen',
      blockNumber: 3,
      match1: {
        roundType: 'semi_championship',
        roundLabel: labels.semiFinalChampionship1 || 'Halbfinale 1 (HF 1)',
        team1Label: `1. ${labels.groupA || 'Gruppe A'}`,
        team2Label: `2. ${labels.groupB || 'Gruppe B'}`,
      },
      match2: {
        roundType: 'semi_championship',
        roundLabel: labels.semiFinalChampionship2 || 'Halbfinale 2 (HF 2)',
        team1Label: `1. ${labels.groupB || 'Gruppe B'}`,
        team2Label: `2. ${labels.groupA || 'Gruppe A'}`,
      },
    },
    // Block 4: cat2 Halbfinals Plätze 1-4 (Championship Semis)
    {
      category: 'jungs',
      blockNumber: 4,
      match1: {
        roundType: 'semi_championship',
        roundLabel: labels.semiFinalChampionship1 || 'Halbfinale 1 (HF 1)',
        team1Label: `1. ${labels.groupA || 'Gruppe A'}`,
        team2Label: `2. ${labels.groupB || 'Gruppe B'}`,
      },
      match2: {
        roundType: 'semi_championship',
        roundLabel: labels.semiFinalChampionship2 || 'Halbfinale 2 (HF 2)',
        team1Label: `1. ${labels.groupB || 'Gruppe B'}`,
        team2Label: `2. ${labels.groupA || 'Gruppe A'}`,
      },
    },
    // Block 5: cat1 Platzierungsspiele 7 & 5
    {
      category: 'maedchen',
      blockNumber: 5,
      match1: {
        roundType: 'placement',
        roundLabel: labels.matchForPlace7 || 'Spiel um Platz 7',
        team1Label: `Verlierer HF-T1 (${categories.cat1.code})`,
        team2Label: `Verlierer HF-T2 (${categories.cat1.code})`,
      },
      match2: {
        roundType: 'placement',
        roundLabel: labels.matchForPlace5 || 'Spiel um Platz 5',
        team1Label: `Sieger HF-T1 (${categories.cat1.code})`,
        team2Label: `Sieger HF-T2 (${categories.cat1.code})`,
      },
    },
    // Block 6: cat2 Platzierungsspiele 7 & 5
    {
      category: 'jungs',
      blockNumber: 6,
      match1: {
        roundType: 'placement',
        roundLabel: labels.matchForPlace7 || 'Spiel um Platz 7',
        team1Label: `Verlierer HF-T1 (${categories.cat2.code})`,
        team2Label: `Verlierer HF-T2 (${categories.cat2.code})`,
      },
      match2: {
        roundType: 'placement',
        roundLabel: labels.matchForPlace5 || 'Spiel um Platz 5',
        team1Label: `Sieger HF-T1 (${categories.cat2.code})`,
        team2Label: `Sieger HF-T2 (${categories.cat2.code})`,
      },
    },
    // Block 7: cat1 Platz 3 & Großes Finale
    {
      category: 'maedchen',
      blockNumber: 7,
      match1: {
        roundType: 'placement',
        roundLabel: labels.matchForPlace3 || 'Spiel um Platz 3 (Kleines Finale)',
        team1Label: `Verlierer HF 1 (${categories.cat1.code})`,
        team2Label: `Verlierer HF 2 (${categories.cat1.code})`,
      },
      match2: {
        roundType: 'final',
        roundLabel: labels.grandFinal || 'Großes Finale (Platz 1)',
        team1Label: `Sieger HF 1 (${categories.cat1.code})`,
        team2Label: `Sieger HF 2 (${categories.cat1.code})`,
      },
    },
    // Block 8: cat2 Platz 3 & Großes Finale
    {
      category: 'jungs',
      blockNumber: 8,
      match1: {
        roundType: 'placement',
        roundLabel: labels.matchForPlace3 || 'Spiel um Platz 3 (Kleines Finale)',
        team1Label: `Verlierer HF 1 (${categories.cat2.code})`,
        team2Label: `Verlierer HF 2 (${categories.cat2.code})`,
      },
      match2: {
        roundType: 'final',
        roundLabel: labels.grandFinal || 'Großes Finale (Platz 1)',
        team1Label: `Sieger HF 1 (${categories.cat2.code})`,
        team2Label: `Sieger HF 2 (${categories.cat2.code})`,
      },
    },
  ];

  const blocksToProcess = settings.sundayFormat === 'top4_8'
    ? fullBlocks.filter(b => b.blockNumber >= 3 && (b.blockNumber === 3 || b.blockNumber === 4 || b.blockNumber === 7 || b.blockNumber === 8))
    : fullBlocks;

  let sundayRelativeMatch = 1;

  for (const block of blocksToProcess) {
    // Game 1 of Block
    const m1_end = addMinutes(currentTime, settings.matchDurationMinutes);
    const isLunch1 = settings.sundayLunchEnabled && sundayRelativeMatch === settings.sundayLunchAfterMatch;
    const break1 = settings.breakDurationMinutes + (isLunch1 ? settings.sundayLunchDurationMinutes : 0);

    matches.push({
      id: `sun-m-${matchNumber}`,
      matchNumber,
      dayNumber: 2,
      dayName: 'Sonntag',
      blockNumber: block.blockNumber,
      category: block.category,
      roundType: block.match1.roundType,
      roundLabel: block.match1.roundLabel,
      team1: {
        name: block.match1.team1Label,
        placeholderLabel: block.match1.team1Label,
        isPlaceholder: true,
      },
      team2: {
        name: block.match1.team2Label,
        placeholderLabel: block.match1.team2Label,
        isPlaceholder: true,
      },
      startTime: currentTime,
      endTime: m1_end,
      pitch: settings.pitchName,
      breakAfterMinutes: break1,
      isLunchBreakAfter: isLunch1,
      lunchDurationMinutes: isLunch1 ? settings.sundayLunchDurationMinutes : undefined,
    });
    currentTime = addMinutes(m1_end, break1);
    matchNumber++;
    sundayRelativeMatch++;

    // Game 2 of Block
    const m2_end = addMinutes(currentTime, settings.matchDurationMinutes);
    const isLunch2 = settings.sundayLunchEnabled && sundayRelativeMatch === settings.sundayLunchAfterMatch;
    const break2 = settings.breakDurationMinutes + (isLunch2 ? settings.sundayLunchDurationMinutes : 0);

    matches.push({
      id: `sun-m-${matchNumber}`,
      matchNumber,
      dayNumber: 2,
      dayName: 'Sonntag',
      blockNumber: block.blockNumber,
      category: block.category,
      roundType: block.match2.roundType,
      roundLabel: block.match2.roundLabel,
      team1: {
        name: block.match2.team1Label,
        placeholderLabel: block.match2.team1Label,
        isPlaceholder: true,
      },
      team2: {
        name: block.match2.team2Label,
        placeholderLabel: block.match2.team2Label,
        isPlaceholder: true,
      },
      startTime: currentTime,
      endTime: m2_end,
      pitch: settings.pitchName,
      breakAfterMinutes: break2,
      isLunchBreakAfter: isLunch2,
      lunchDurationMinutes: isLunch2 ? settings.sundayLunchDurationMinutes : undefined,
    });
    currentTime = addMinutes(m2_end, break2);
    matchNumber++;
    sundayRelativeMatch++;
  }

  return matches;
}

/**
 * Generates all matches for Saturday and Sunday
 */
export function generateFullSchedule(
  teams: Team[],
  settings: TournamentSettings,
  matchOverrides?: Record<number, MatchOverride>,
  labels: LabelsConfig = DEFAULT_LABELS,
  categories: { cat1: CategoryConfig; cat2: CategoryConfig } = DEFAULT_CATEGORIES
): {
  saturdayMatches: ScheduledMatch[];
  sundayMatches: ScheduledMatch[];
  allMatches: ScheduledMatch[];
  stats: {
    totalMatchesSaturday: number;
    totalMatchesSunday: number;
    totalMatchesOverall: number;
    saturdayStartTime: string;
    saturdayEndTime: string;
    sundayStartTime: string;
    sundayEndTime: string;
    ceremonyStartTime: string;
    totalDurationMinutesSat: number;
    totalDurationMinutesSun: number;
  };
} {
  let saturdayMatches = generateSaturdayMatches(teams, settings, labels, categories);
  let sundayMatches = generateSundayMatches(settings, labels, categories);

  // Apply overrides if any exist
  if (matchOverrides && Object.keys(matchOverrides).length > 0) {
    const applyOverride = (m: ScheduledMatch): ScheduledMatch => {
      const override = matchOverrides[m.matchNumber];
      if (!override) return m;
      return {
        ...m,
        startTime: override.startTime || m.startTime,
        endTime: override.endTime || m.endTime,
        pitch: override.pitch || m.pitch,
        customNote: override.customNote || m.customNote,
        isCustomized: true,
      };
    };

    saturdayMatches = saturdayMatches.map(applyOverride);
    sundayMatches = sundayMatches.map(applyOverride);
  }

  const allMatches = [...saturdayMatches, ...sundayMatches];

  const saturdayEndTime = saturdayMatches.length > 0 
    ? saturdayMatches[saturdayMatches.length - 1].endTime 
    : settings.saturdayStartTime;

  const sundayEndTime = sundayMatches.length > 0 
    ? sundayMatches[sundayMatches.length - 1].endTime 
    : settings.sundayStartTime;

  const ceremonyStartTime = addMinutes(sundayEndTime, settings.ceremonyBufferMinutes);

  const totalDurationMinutesSat = timeToMinutes(saturdayEndTime) - timeToMinutes(settings.saturdayStartTime);
  const totalDurationMinutesSun = timeToMinutes(sundayEndTime) - timeToMinutes(settings.sundayStartTime);

  return {
    saturdayMatches,
    sundayMatches,
    allMatches,
    stats: {
      totalMatchesSaturday: saturdayMatches.length,
      totalMatchesSunday: sundayMatches.length,
      totalMatchesOverall: allMatches.length,
      saturdayStartTime: settings.saturdayStartTime,
      saturdayEndTime,
      sundayStartTime: settings.sundayStartTime,
      sundayEndTime,
      ceremonyStartTime,
      totalDurationMinutesSat: Math.max(0, totalDurationMinutesSat),
      totalDurationMinutesSun: Math.max(0, totalDurationMinutesSun),
    },
  };
}

/**
 * Calculates a specific team's Saturday match schedule and rest pauses
 */
export function getTeamSchedule(
  teamId: string,
  saturdayMatches: ScheduledMatch[]
): TeamMatchSchedule[] {
  const teamMatches = saturdayMatches.filter(
    m => m.team1.id === teamId || m.team2.id === teamId
  );

  const results: TeamMatchSchedule[] = [];

  for (let i = 0; i < teamMatches.length; i++) {
    const m = teamMatches[i];
    const isTeam1 = m.team1.id === teamId;
    const opponentName = isTeam1 ? m.team2.name : m.team1.name;

    let restTimeBeforeMinutes: number | undefined = undefined;
    if (i > 0) {
      const prevMatch = teamMatches[i - 1];
      restTimeBeforeMinutes = timeToMinutes(m.startTime) - timeToMinutes(prevMatch.endTime);
    }

    let restTimeAfterMinutes: number | undefined = undefined;
    if (i < teamMatches.length - 1) {
      const nextMatch = teamMatches[i + 1];
      restTimeAfterMinutes = timeToMinutes(nextMatch.startTime) - timeToMinutes(m.endTime);
    }

    results.push({
      matchNumber: m.matchNumber,
      dayName: m.dayName,
      roundLabel: m.roundLabel,
      opponentName,
      startTime: m.startTime,
      endTime: m.endTime,
      pitch: m.pitch,
      restTimeBeforeMinutes,
      restTimeAfterMinutes,
    });
  }

  return results;
}

/**
 * Exports tournament schedule as CSV string
 */
export function exportToCSV(
  allMatches: ScheduledMatch[],
  tournamentName: string,
  categories: { cat1: CategoryConfig; cat2: CategoryConfig } = DEFAULT_CATEGORIES
): string {
  const header = ['Spiel-Nr.', 'Tag', 'Uhrzeit Beginn', 'Uhrzeit Ende', 'Kategorie', 'Gruppe / Runde', 'Team 1', 'Team 2', 'Spielfeld'];
  const rows = allMatches.map(m => [
    m.matchNumber.toString(),
    m.dayName,
    m.startTime,
    m.endTime,
    m.category === 'maedchen' ? categories.cat1.code : categories.cat2.code,
    m.roundLabel,
    `"${m.team1.name.replace(/"/g, '""')}"`,
    `"${m.team2.name.replace(/"/g, '""')}"`,
    `"${m.pitch.replace(/"/g, '""')}"`,
  ]);

  return [header.join(';'), ...rows.map(r => r.join(';'))].join('\r\n');
}

/**
 * Exports tournament schedule as formatted text for WhatsApp/Email sharing
 */
export function exportToShareText(
  allMatches: ScheduledMatch[],
  stats: ReturnType<typeof generateFullSchedule>['stats'],
  settings: TournamentSettings,
  categories: { cat1: CategoryConfig; cat2: CategoryConfig } = DEFAULT_CATEGORIES
): string {
  const satMatches = allMatches.filter(m => m.dayNumber === 1);
  const sunMatches = allMatches.filter(m => m.dayNumber === 2);

  let text = `🏑 *${settings.tournamentName.toUpperCase()}* 🏑\n`;
  text += `📍 Spielfeld: ${settings.pitchName}\n`;
  text += `⏱ Spielzeit: ${settings.matchDurationMinutes} Min. | Pause: ${settings.breakDurationMinutes} Min.\n\n`;

  text += `📅 *SAMSTAG (Gruppenspiele - 24 Spiele)*\n`;
  text += `Start: ${stats.saturdayStartTime} Uhr | Ende: ca. ${stats.saturdayEndTime} Uhr\n\n`;

  let currentBlock = 0;
  for (const m of satMatches) {
    if (m.blockNumber !== currentBlock) {
      currentBlock = m.blockNumber;
      const catText = m.category === 'maedchen' ? `${categories.cat1.emoji} ${categories.cat1.code}-Block` : `${categories.cat2.emoji} ${categories.cat2.code}-Block`;
      text += `--- ${catText} ---\n`;
    }
    text += `Spiel ${m.matchNumber.toString().padStart(2, ' ')} | ${m.startTime} - ${m.endTime} Uhr | [${m.roundLabel}] ${m.team1.name} vs. ${m.team2.name}\n`;
    if (m.isLunchBreakAfter) {
      text += `🍴 Mittagspause (${m.lunchDurationMinutes} Min.)\n`;
    }
  }

  text += `\n📅 *SONNTAG (Final- & Platzierungsspiele)*\n`;
  text += `Start: ${stats.sundayStartTime} Uhr | Ende: ca. ${stats.sundayEndTime} Uhr\n`;
  text += `🏆 Geplante Siegerehrung: ca. ${stats.ceremonyStartTime} Uhr\n\n`;

  currentBlock = 0;
  for (const m of sunMatches) {
    if (m.blockNumber !== currentBlock) {
      currentBlock = m.blockNumber;
      const catText = m.category === 'maedchen' ? `${categories.cat1.emoji} ${categories.cat1.code}` : `${categories.cat2.emoji} ${categories.cat2.code}`;
      text += `--- ${catText} ---\n`;
    }
    text += `Spiel ${m.matchNumber.toString().padStart(2, ' ')} | ${m.startTime} - ${m.endTime} Uhr | ${m.roundLabel}: ${m.team1.name} vs. ${m.team2.name}\n`;
    if (m.isLunchBreakAfter) {
      text += `🍴 Mittagspause (${m.lunchDurationMinutes} Min.)\n`;
    }
  }

  return text;
}
