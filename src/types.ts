export type Category = 'maedchen' | 'jungs';

export interface Team {
  id: string;
  name: string;
  category: Category;
  group: 'A' | 'B';
  seed: number; // 1, 2, 3, 4
}

export interface TournamentSettings {
  tournamentName: string;
  pitchName: string;
  saturdayStartTime: string; // e.g. "10:00"
  sundayStartTime: string;   // e.g. "09:00"
  matchDurationMinutes: number; // default 20
  breakDurationMinutes: number; // default 5
  
  // Saturday lunch break
  saturdayLunchEnabled: boolean;
  saturdayLunchAfterMatch: number; // default 12 (halftime of Saturday)
  saturdayLunchDurationMinutes: number; // default 30
  
  // Sunday lunch break
  sundayLunchEnabled: boolean;
  sundayLunchAfterMatch: number; // default 8 (after semifinals)
  sundayLunchDurationMinutes: number; // default 30
  
  // Sunday ceremony
  ceremonyBufferMinutes: number; // default 15 min after last game
  
  // Sunday format: full placement 1-8 (16 games) or top 4 only (8 games)
  sundayFormat: 'full_16' | 'top4_8';
}

export interface CategoryConfig {
  id: Category;
  code: string;
  name: string;
  emoji: string;
  description: string;
}

export interface LabelsConfig {
  groupA: string;
  groupB: string;
  semiFinalChampionship1: string;
  semiFinalChampionship2: string;
  semiFinalPlacement1: string;
  semiFinalPlacement2: string;
  matchForPlace7: string;
  matchForPlace5: string;
  matchForPlace3: string;
  grandFinal: string;
  ceremony: string;
  lunchNotice: string;
  blockPacingNotice?: string;
  saturdayTitle?: string;
  sundayTitle?: string;
  blockRotationNotice?: string;
  restTimeNotice?: string;
}

export interface UiTextsConfig {
  tabSchedule?: string;
  tabGroups?: string;
  tabSundayBracket?: string;
  tabTeamSchedule?: string;
  tabTeams?: string;
  btnSettings?: string;
  btnExport?: string;
  btnJson?: string;
  btnPrint?: string;
  allDays?: string;
  allCategories?: string;
}

export interface TournamentRulesConfig {
  teamsPerGroup: number;
  groupCount: number;
  matchesPerBlock: number;
  minRestMinutes: number;
  pointsForWin: number;
  pointsForDraw: number;
  pointsForLoss: number;
}

export interface TournamentConfigFile {
  version: string;
  meta: {
    title: string;
    description: string;
    updatedAt?: string;
    author?: string;
  };
  tournament: TournamentSettings;
  rules?: TournamentRulesConfig;
  categories: {
    cat1: CategoryConfig;
    cat2: CategoryConfig;
  };
  labels: LabelsConfig;
  uiTexts?: UiTextsConfig;
  teams: Team[];
  neutralTeams: Team[];
}

export interface ScheduledMatch {
  id: string;
  matchNumber: number; // 1 to 24 (or 1 to 40)
  dayNumber: 1 | 2; // 1 = Saturday, 2 = Sunday
  dayName: 'Samstag' | 'Sonntag';
  blockNumber: number; // 1, 2, 3...
  category: Category;
  roundType: 'group' | 'semi_championship' | 'semi_placement' | 'final' | 'placement';
  roundLabel: string; // e.g. "Gruppe A", "Halbfinale 1", "Spiel um Platz 3"
  group?: 'A' | 'B';
  team1: {
    id?: string;
    name: string;
    placeholderLabel?: string;
    isPlaceholder?: boolean;
  };
  team2: {
    id?: string;
    name: string;
    placeholderLabel?: string;
    isPlaceholder?: boolean;
  };
  startTime: string; // "10:00"
  endTime: string;   // "10:20"
  pitch: string;
  breakAfterMinutes: number;
  isLunchBreakAfter?: boolean;
  lunchDurationMinutes?: number;
  customNote?: string;
  isCustomized?: boolean;
}

export interface MatchOverride {
  startTime?: string;
  endTime?: string;
  pitch?: string;
  customNote?: string;
}

export interface TournamentProject {
  version: number;
  exportedAt: string;
  settings: TournamentSettings;
  teams: Team[];
  matchOverrides?: Record<number, MatchOverride>;
}

export interface TeamMatchSchedule {
  matchNumber: number;
  dayName: 'Samstag' | 'Sonntag';
  roundLabel: string;
  opponentName: string;
  startTime: string;
  endTime: string;
  pitch: string;
  restTimeBeforeMinutes?: number;
  restTimeAfterMinutes?: number;
}
