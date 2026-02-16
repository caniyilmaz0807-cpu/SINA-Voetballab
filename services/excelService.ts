import { AppData, ClubName, Month } from "../types";
import { CLUBS, MONTHS } from "../constants";

declare var XLSX: any;

export const parseExcelData = async (file: File): Promise<Partial<AppData>> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const wb = XLSX.read(data, { type: 'array' });

        // Helper to get raw data
        const getVal = (sheet: any, colChar: string, row: number) => {
           const cell = sheet[colChar + row];
           return cell ? cell.v : null;
        };
        
        // 1. Opkomst
        const ws1 = wb.Sheets['Opkomst'];
        const parsedClubs: any = {};
        
        // Initialize structure
        CLUBS.forEach(c => {
            parsedClubs[c] = {};
            MONTHS.forEach(m => {
                parsedClubs[c][m] = { expected: null, actual: null, trajectories: null };
            });
        });

        if (ws1) {
            CLUBS.forEach((club, i) => {
                MONTHS.forEach((m, j) => {
                    const col = String.fromCharCode(67 + j); // C=67
                    const exp = getVal(ws1, col, 5 + i);
                    const act = getVal(ws1, col, 16 + i);
                    
                    parsedClubs[club][m].expected = exp;
                    parsedClubs[club][m].actual = act;
                });
            });
        }

        // 2. Nabellen
        const ws2 = wb.Sheets['Nabellen'];
        if (ws2) {
            CLUBS.forEach((club, i) => {
                MONTHS.forEach((m, j) => {
                    const col = String.fromCharCode(67 + j);
                    const traj = getVal(ws2, col, 5 + i);
                    parsedClubs[club][m].trajectories = traj;
                });
            });
        }

        // 3. Tevredenheid
        const ws3 = wb.Sheets['Tevredenheid'];
        const satisfaction = {
            cyclus1: { score: null, processed: false, shared: false },
            cyclus2: { score: null, processed: false, shared: false }
        };

        if (ws3) {
            satisfaction.cyclus1.score = getVal(ws3, 'B', 5);
            satisfaction.cyclus2.score = getVal(ws3, 'C', 5);

            const v1 = getVal(ws3, 'B', 6);
            const v2 = getVal(ws3, 'C', 6);
            satisfaction.cyclus1.processed = (typeof v1 === 'string' && v1.toUpperCase() === 'JA');
            satisfaction.cyclus2.processed = (typeof v2 === 'string' && v2.toUpperCase() === 'JA');

            const g1 = getVal(ws3, 'B', 7);
            const g2 = getVal(ws3, 'C', 7);
            satisfaction.cyclus1.shared = (typeof g1 === 'string' && g1.toUpperCase() === 'JA');
            satisfaction.cyclus2.shared = (typeof g2 === 'string' && g2.toUpperCase() === 'JA');
        }

        resolve({ clubs: parsedClubs, satisfaction });
      } catch (err) {
        reject(err);
      }
    };
    reader.readAsArrayBuffer(file);
  });
};

export const exportExcelData = (data: AppData) => {
    // We need to reconstruct the 3 sheets
    const wb = XLSX.utils.book_new();

    // -- Sheet 1: Opkomst --
    // Header rows and structure are a bit complex to map exactly to the input template cell-by-cell without a template,
    // but we will create a readable structure that matches the logic.
    
    const opkomstData: (string | number)[][] = [
        ["", "Opkomst Data Joshua", "", "", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", "", "", "", ""],
        ["", "VERWACHT", ...MONTHS],
        ["", "", ...MONTHS.map(() => "")], // spacer
    ];

    // Verwacht Rows
    CLUBS.forEach(club => {
        const row = [club, "", ...MONTHS.map(m => data.clubs[club][m].expected || "")];
        opkomstData.push(row);
    });

    opkomstData.push(["", "", ...MONTHS.map(() => "")]); // spacer
    opkomstData.push(["", "DAADWERKELIJK", ...MONTHS]);

    // Actual Rows
    CLUBS.forEach(club => {
        const row = [club, "", ...MONTHS.map(m => data.clubs[club][m].actual || "")];
        opkomstData.push(row);
    });

    const ws1 = XLSX.utils.aoa_to_sheet(opkomstData);
    XLSX.utils.book_append_sheet(wb, ws1, "Opkomst");

    // -- Sheet 2: Nabellen --
    const nabellenData: (string | number)[][] = [
        ["", "Nabellen Trajecten", "", "", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", "", "", "", ""],
        ["", "Trajecten", ...MONTHS],
    ];

    CLUBS.forEach(club => {
        const row = [club, "", ...MONTHS.map(m => data.clubs[club][m].trajectories || "")];
        nabellenData.push(row);
    });

    const ws2 = XLSX.utils.aoa_to_sheet(nabellenData);
    XLSX.utils.book_append_sheet(wb, ws2, "Nabellen");

    // -- Sheet 3: Tevredenheid --
    const tevredenheidData: (string | number)[][] = [
        ["", "Tevredenheid", ""],
        ["", "", ""],
        ["", "Cyclus 1", "Cyclus 2"],
        ["", "", ""],
        ["Score", data.satisfaction.cyclus1.score || "", data.satisfaction.cyclus2.score || ""],
        ["Survey Verwerkt (JA/NEE)", data.satisfaction.cyclus1.processed ? "JA" : "NEE", data.satisfaction.cyclus2.processed ? "JA" : "NEE"],
        ["Gedeeld (JA/NEE)", data.satisfaction.cyclus1.shared ? "JA" : "NEE", data.satisfaction.cyclus2.shared ? "JA" : "NEE"],
    ];

    const ws3 = XLSX.utils.aoa_to_sheet(tevredenheidData);
    XLSX.utils.book_append_sheet(wb, ws3, "Tevredenheid");

    XLSX.writeFile(wb, "Joshua_Dashboard_Export.xlsx");
};