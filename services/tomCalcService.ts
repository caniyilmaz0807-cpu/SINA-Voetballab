
import { CycleOption, Month, TomAppData, TomClubName, TomMetrics } from "../types";
import { CYCLUS_1_MONTHS, CYCLUS_2_MONTHS, MONTHS, TOM_CLUBS } from "../constants";

export const getMonthsForCycle = (cycle: CycleOption): Month[] => {
  if (cycle === "Cyclus 1") return CYCLUS_1_MONTHS;
  if (cycle === "Cyclus 2") return CYCLUS_2_MONTHS;
  return MONTHS;
};

export const calculateTomMetrics = (data: TomAppData, cycle: CycleOption): TomMetrics => {
  const months = getMonthsForCycle(cycle);

  // --- Pillar 1: Attendance (Opkomst) ---
  // Staffels per club: <70% = €0, 70-79% = €0.35, 80-89% = €0.65, >=90% = €1.00
  let p1TotalBonus = 0;
  let totalAttendanceSum = 0; // for weighted avg
  let totalExpectedSum = 0;
  const p1ClubDetails: any = {};

  TOM_CLUBS.forEach(club => {
    let cExpected = 0;
    let cActual = 0;
    months.forEach(m => {
      cExpected += Number(data.clubs[club][m].expected || 0);
      cActual += Number(data.clubs[club][m].actual || 0);
    });

    const pct = cExpected > 0 ? cActual / cExpected : 0;
    let rate = 0;

    if (pct >= 0.90) rate = 1.00;
    else if (pct >= 0.80) rate = 0.65;
    else if (pct >= 0.70) rate = 0.35;
    else rate = 0.00;

    const clubBonus = cActual * rate;
    p1TotalBonus += clubBonus;

    p1ClubDetails[club] = {
      pct: pct * 100,
      rate,
      bonus: clubBonus
    };

    totalExpectedSum += cExpected;
    totalAttendanceSum += cActual;
  });

  const avgAttendancePct = totalExpectedSum > 0 ? (totalAttendanceSum / totalExpectedSum) * 100 : 0;

  // --- Pillar 2: Visits (Bezoeken) ---
  // €15 per visit
  let totalVisits = 0;
  TOM_CLUBS.forEach(club => {
    months.forEach(m => {
      totalVisits += Number(data.clubs[club][m].visits || 0);
    });
  });
  const p2TotalBonus = totalVisits * 15;


  // --- Pillar 3: Growth (Groei) ---
  // Calculated per cycle.
  // < -10% = -€25
  // -10% to 5% = €0
  // 5% to 10% = €50
  // 10% to 20% = €100
  // > 20% = €150
  let p3TotalBonus = 0;
  let totalGrowthPctSum = 0;
  let growthCount = 0;
  const p3ClubDetails: any = {};

  const calculateGrowthForCycle = (cycleKey: 'cyclus1' | 'cyclus2') => {
    let bonus = 0;
    TOM_CLUBS.forEach(club => {
      const prev = Number(data.growth[club][cycleKey].previous || 0);
      const curr = Number(data.growth[club][cycleKey].current || 0);
      
      // Only calculate if input is present (prev > 0)
      if (prev > 0) {
        const growth = (curr - prev) / prev;
        let cBonus = 0;

        if (growth < -0.10) cBonus = -25;
        else if (growth < 0.05) cBonus = 0;
        else if (growth < 0.10) cBonus = 50;
        else if (growth < 0.20) cBonus = 100;
        else cBonus = 150;

        bonus += cBonus;
        
        // Populate details (cumulative if 'Seizoen' is selected, simplifies display logic to show latest active or avg)
        if (!p3ClubDetails[club]) {
            p3ClubDetails[club] = { growthPct: growth * 100, bonus: cBonus };
        } else {
            // For season view, we might need to be smarter, but let's sum bonuses and avg pct for now
            p3ClubDetails[club].bonus += cBonus;
            p3ClubDetails[club].growthPct = (p3ClubDetails[club].growthPct + (growth * 100)) / 2;
        }
        
        totalGrowthPctSum += (growth * 100);
        growthCount++;
      } else {
         if (!p3ClubDetails[club]) p3ClubDetails[club] = { growthPct: 0, bonus: 0 };
      }
    });
    return bonus;
  };

  if (cycle === "Seizoen") {
    p3TotalBonus += calculateGrowthForCycle('cyclus1');
    p3TotalBonus += calculateGrowthForCycle('cyclus2');
  } else if (cycle === "Cyclus 1") {
    p3TotalBonus += calculateGrowthForCycle('cyclus1');
  } else {
    p3TotalBonus += calculateGrowthForCycle('cyclus2');
  }

  const avgGrowthPct = growthCount > 0 ? totalGrowthPctSum / growthCount : 0;

  return {
    totalBonus: p1TotalBonus + p2TotalBonus + p3TotalBonus,
    pillar1: {
      totalBonus: p1TotalBonus,
      avgAttendancePct,
      clubDetails: p1ClubDetails
    },
    pillar2: {
      totalBonus: p2TotalBonus,
      totalVisits
    },
    pillar3: {
      totalBonus: p3TotalBonus,
      avgGrowthPct,
      clubDetails: p3ClubDetails
    }
  };
};
