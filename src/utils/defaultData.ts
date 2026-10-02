import { Team, TournamentSettings, TournamentConfigFile, LabelsConfig } from '../types';
import rawConfig from '../config/tournament_config.json';

export const DEFAULT_CONFIG = rawConfig as unknown as TournamentConfigFile;

export const DEFAULT_SETTINGS: TournamentSettings = DEFAULT_CONFIG.tournament;
export const DEFAULT_TEAMS: Team[] = DEFAULT_CONFIG.teams;
export const NEUTRAL_TEAMS: Team[] = DEFAULT_CONFIG.neutralTeams;
export const DEFAULT_CATEGORIES = DEFAULT_CONFIG.categories;
export const DEFAULT_LABELS: LabelsConfig = DEFAULT_CONFIG.labels;
export const DEFAULT_UI_TEXTS = DEFAULT_CONFIG.uiTexts;
export const DEFAULT_RULES = DEFAULT_CONFIG.rules;
