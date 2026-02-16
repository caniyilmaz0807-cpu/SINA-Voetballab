
import { ClubName, Month, TomAppData, TomClubName } from "./types";

export const CLUBS: ClubName[] = [
  "Foresters", "ADO'20", "Odin'59", "HSV Heiloo",
  "SV Hillegom", "RKVV DEM", "BVC Bloemendaal",
  "FC Velsennoord", "Sporting Adrichem"
];

export const TOM_CLUBS: TomClubName[] = [
  "Foresters", "ADO'20", "Odin'59", "HSV Heiloo", "Club 5 (nieuw)"
];

export const MONTHS: Month[] = ["Sep", "Okt", "Nov", "Dec", "Jan", "Feb", "Mrt", "Apr", "Mei"];

export const CYCLUS_1_MONTHS: Month[] = ["Sep", "Okt", "Nov", "Dec"];
export const CYCLUS_2_MONTHS: Month[] = ["Jan", "Feb", "Mrt", "Apr", "Mei"];

export const COLORS = {
  primary: "#E3000B", // SINA Rood
  dark: "#2D2D2D",
  lightGray: "#F2F2F2",
  white: "#FFFFFF",
  success: "#2ECC71",
  warning: "#F39C12",
  danger: "#E74C3C",
  accent: "#3498DB"
};

// Joshua's Initial Data
export const INITIAL_DATA: any = {
  clubs: {},
  satisfaction: {
    cyclus1: { score: null, processed: false, shared: false },
    cyclus2: { score: null, processed: false, shared: false }
  },
  lastUpdated: new Date().toISOString()
};

CLUBS.forEach(club => {
  INITIAL_DATA.clubs[club] = {};
  MONTHS.forEach(month => {
    INITIAL_DATA.clubs[club][month] = { expected: null, actual: null, trajectories: null };
  });
});

// Tom's Initial Data
export const TOM_INITIAL_DATA: TomAppData = {
  clubs: {} as any,
  growth: {} as any,
  lastUpdated: new Date().toISOString()
};

TOM_CLUBS.forEach(club => {
  TOM_INITIAL_DATA.clubs[club] = {} as any;
  MONTHS.forEach(month => {
    TOM_INITIAL_DATA.clubs[club][month] = { expected: null, actual: null, visits: null };
  });

  TOM_INITIAL_DATA.growth[club] = {
    cyclus1: { previous: null, current: null },
    cyclus2: { previous: null, current: null }
  };
});
