
export type ClubName = 
  | "Foresters" | "ADO'20" | "Odin'59" | "HSV Heiloo"
  | "SV Hillegom" | "RKVV DEM" | "BVC Bloemendaal"
  | "FC Velsennoord" | "Sporting Adrichem";

export type TomClubName = 
  | "Foresters" | "ADO'20" | "Odin'59" | "HSV Heiloo" | "Club 5 (nieuw)";

export type Month = "Sep" | "Okt" | "Nov" | "Dec" | "Jan" | "Feb" | "Mrt" | "Apr" | "Mei";

export type CycleOption = "Cyclus 1" | "Cyclus 2" | "Seizoen";

export type UserRole = 'admin' | 'joshua' | 'tom';

// --- Joshua Types ---
export interface MonthlyStats {
  expected: number | null;
  actual: number | null;
  trajectories: number | null;
}

export interface CycleStats {
  score: number | null;
  processed: boolean; // survey_verwerkt_3wkn
  shared: boolean; // gedeeld_met_pm_cm
}

export interface AppData {
  clubs: {
    [key in ClubName]: {
      [key in Month]: MonthlyStats;
    };
  };
  satisfaction: {
    cyclus1: CycleStats;
    cyclus2: CycleStats;
  };
  lastUpdated?: string;
}

export interface DashboardMetrics {
  totalBonus: number;
  attendancePct: number;
  totalTrajectories: number;
  satisfactionMet: boolean; // For display badge
  satisfactionBonus: number;
  pillar1Bonus: number;
  pillar2Bonus: number;
  pillar3Bonus: number;
}

// --- Tom Types ---
export interface TomMonthlyStats {
  expected: number | null;
  actual: number | null;
  visits: number | null;
}

export interface TomGrowthStats {
  previous: number | null;
  current: number | null;
}

export interface TomAppData {
  clubs: {
    [key in TomClubName]: {
      [key in Month]: TomMonthlyStats;
    }
  };
  growth: {
    [key in TomClubName]: {
      cyclus1: TomGrowthStats;
      cyclus2: TomGrowthStats;
    }
  };
  lastUpdated?: string;
}

export interface TomMetrics {
  totalBonus: number;
  pillar1: {
    totalBonus: number;
    avgAttendancePct: number;
    clubDetails: { [key in TomClubName]: { pct: number, rate: number, bonus: number } };
  };
  pillar2: {
    totalBonus: number;
    totalVisits: number;
  };
  pillar3: {
    totalBonus: number;
    avgGrowthPct: number;
    clubDetails: { [key in TomClubName]: { growthPct: number, bonus: number } };
  };
}
