import { AppData, CycleOption, DashboardMetrics, Month } from "../types";
import { CLUBS, CYCLUS_1_MONTHS, CYCLUS_2_MONTHS, MONTHS } from "../constants";

export const getMonthsForCycle = (cycle: CycleOption): Month[] => {
  if (cycle === "Cyclus 1") return CYCLUS_1_MONTHS;
  if (cycle === "Cyclus 2") return CYCLUS_2_MONTHS;
  return MONTHS;
};

export const calculateMetrics = (data: AppData, cycle: CycleOption): DashboardMetrics => {
  const months = getMonthsForCycle(cycle);

  // --- Pillar 1: Planning ---
  let totalExpected = 0;
  let totalActual = 0;
  let pillar1Bonus = 0;

  // We need to calculate Pillar 1 strictly per cycle rules.
  // Rule: >= 75% over the WHOLE cycle.
  const calculateCycleP1 = (monthsList: Month[]) => {
    let cExpected = 0;
    let cActual = 0;
    CLUBS.forEach(club => {
      monthsList.forEach(m => {
        const stats = data.clubs[club][m];
        cExpected += Number(stats.expected || 0);
        cActual += Number(stats.actual || 0);
      });
    });
    
    const pct = cExpected > 0 ? cActual / cExpected : 0;
    // Bonus is only paid if pct >= 0.75
    // Bonus = Total Actual * 0.50
    return pct >= 0.75 ? cActual * 0.50 : 0;
  };

  if (cycle === "Seizoen") {
     pillar1Bonus = calculateCycleP1(CYCLUS_1_MONTHS) + calculateCycleP1(CYCLUS_2_MONTHS);
     // For display purposes, calculate total percentages
     CLUBS.forEach(club => {
        MONTHS.forEach(m => {
             totalExpected += Number(data.clubs[club][m].expected || 0);
             totalActual += Number(data.clubs[club][m].actual || 0);
        });
     });
  } else {
     CLUBS.forEach(club => {
        months.forEach(m => {
             totalExpected += Number(data.clubs[club][m].expected || 0);
             totalActual += Number(data.clubs[club][m].actual || 0);
        });
     });
     const pct = totalExpected > 0 ? totalActual / totalExpected : 0;
     pillar1Bonus = pct >= 0.75 ? totalActual * 0.50 : 0;
  }
  
  const attendancePct = totalExpected > 0 ? (totalActual / totalExpected) * 100 : 0;


  // --- Pillar 2: Nabellen ---
  let totalTrajectories = 0;
  CLUBS.forEach(club => {
    months.forEach(m => {
      totalTrajectories += Number(data.clubs[club][m].trajectories || 0);
    });
  });
  const pillar2Bonus = totalTrajectories * 10;

  // --- Pillar 3: Satisfaction ---
  let pillar3Bonus = 0;
  let satisfactionMet = false;

  const checkSat = (cData: any) => {
    return (Number(cData.score) >= 8 && cData.processed && cData.shared);
  };

  if (cycle === "Cyclus 1" || cycle === "Seizoen") {
    if (checkSat(data.satisfaction.cyclus1)) {
      pillar3Bonus += 100;
      if (cycle === "Cyclus 1") satisfactionMet = true;
    }
  }
  if (cycle === "Cyclus 2" || cycle === "Seizoen") {
    if (checkSat(data.satisfaction.cyclus2)) {
      pillar3Bonus += 100;
      if (cycle === "Cyclus 2") satisfactionMet = true;
    }
  }

  // If season, satisfactionMet is true if BOTH are met? Or either? 
  // Let's say mostly for display on the small card.
  if (cycle === "Seizoen") {
      satisfactionMet = checkSat(data.satisfaction.cyclus1) && checkSat(data.satisfaction.cyclus2);
  }

  return {
    totalBonus: pillar1Bonus + pillar2Bonus + pillar3Bonus,
    attendancePct,
    totalTrajectories,
    satisfactionMet,
    satisfactionBonus: pillar3Bonus,
    pillar1Bonus,
    pillar2Bonus,
    pillar3Bonus
  };
};

export const formatCurrency = (val: number) => {
  return new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(val);
};

export const formatNumber = (val: number) => {
    return new Intl.NumberFormat('nl-NL').format(val);
};