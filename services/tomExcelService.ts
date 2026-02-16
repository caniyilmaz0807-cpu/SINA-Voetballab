
import { TomAppData, TomClubName } from "../types";
import { TOM_CLUBS, MONTHS } from "../constants";

declare var XLSX: any;

export const parseTomExcel = async (file: File): Promise<Partial<TomAppData>> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const wb = XLSX.read(data, { type: 'array' });
        
        const getVal = (sheet: any, colChar: string, row: number) => {
            const cell = sheet[colChar + row];
            return cell ? cell.v : null;
        };

        const nc = 5; // number of clubs
        const parsedClubs: any = {};
        const parsedGrowth: any = {};
        
        TOM_CLUBS.forEach(c => {
            parsedClubs[c] = {};
            parsedGrowth[c] = {
                cyclus1: { previous: null, current: null },
                cyclus2: { previous: null, current: null }
            };
            MONTHS.forEach(m => {
                parsedClubs[c][m] = { expected: null, actual: null, visits: null };
            });
        });

        // 1. Opkomst
        const ws1 = wb.Sheets['Opkomst'];
        if (ws1) {
            const daadwStart = 5 + nc + 3; // Row 13 if clubs are 5-9
            TOM_CLUBS.forEach((club, i) => {
                MONTHS.forEach((m, j) => {
                    const col = String.fromCharCode(67 + j); // C=67
                    const exp = getVal(ws1, col, 5 + i);
                    const act = getVal(ws1, col, 12 + i); // Corrected row based on prompt desc (12-16)
                    
                    if (parsedClubs[club][m]) {
                        parsedClubs[club][m].expected = exp;
                        parsedClubs[club][m].actual = act;
                    }
                });
            });
        }

        // 2. Clubbezoeken
        const ws2 = wb.Sheets['Clubbezoeken'];
        if (ws2) {
            TOM_CLUBS.forEach((club, i) => {
                MONTHS.forEach((m, j) => {
                    const col = String.fromCharCode(67 + j);
                    const visits = getVal(ws2, col, 5 + i);
                    if (parsedClubs[club][m]) {
                        parsedClubs[club][m].visits = visits;
                    }
                });
            });
        }

        // 3. Groei
        const ws3 = wb.Sheets['Groei'];
        if (ws3) {
            const c2Start = 6 + nc + 2; // Row 13
            TOM_CLUBS.forEach((club, i) => {
                 parsedGrowth[club].cyclus1.previous = getVal(ws3, 'B', 6 + i);
                 parsedGrowth[club].cyclus1.current = getVal(ws3, 'C', 6 + i);
                 
                 parsedGrowth[club].cyclus2.previous = getVal(ws3, 'B', 13 + i);
                 parsedGrowth[club].cyclus2.current = getVal(ws3, 'C', 13 + i);
            });
        }

        resolve({ clubs: parsedClubs, growth: parsedGrowth });

      } catch (err) {
        reject(err);
      }
    };
    reader.readAsArrayBuffer(file);
  });
};

export const exportTomExcel = (data: TomAppData) => {
    const wb = XLSX.utils.book_new();

    // Sheet 1: Opkomst
    const opkomstData: (string | number)[][] = [
        ["", "Opkomst Data Tom", ...MONTHS.map(() => "")],
        ["", "", ...MONTHS.map(() => "")],
        ["", "VERWACHT", ...MONTHS],
    ];
    // Spacer
    opkomstData.push(["", "", ...MONTHS.map(() => "")]);
    
    TOM_CLUBS.forEach(club => {
        opkomstData.push([club, "", ...MONTHS.map(m => data.clubs[club][m].expected || "")]);
    });

    opkomstData.push(["", "", ...MONTHS.map(() => "")]);
    opkomstData.push(["", "DAADWERKELIJK", ...MONTHS]);
    opkomstData.push(["", "", ...MONTHS.map(() => "")]);

    TOM_CLUBS.forEach(club => {
        opkomstData.push([club, "", ...MONTHS.map(m => data.clubs[club][m].actual || "")]);
    });
    
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(opkomstData), "Opkomst");

    // Sheet 2: Clubbezoeken
    const visitsData: (string | number)[][] = [
        ["", "Clubbezoeken", ...MONTHS],
        ["", "", ...MONTHS.map(() => "")],
    ];
    TOM_CLUBS.forEach(club => {
        visitsData.push([club, "", ...MONTHS.map(m => data.clubs[club][m].visits || "")]);
    });
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(visitsData), "Clubbezoeken");

    // Sheet 3: Groei
    const growthData: (string | number)[][] = [
        ["", "Groei & Retentie", ""],
        ["", "", ""],
        ["CYCLUS 1", "Vorige", "Huidige"],
    ];
    TOM_CLUBS.forEach(club => {
        growthData.push([club, data.growth[club].cyclus1.previous || "", data.growth[club].cyclus1.current || ""]);
    });
    
    growthData.push(["", "", ""]);
    growthData.push(["CYCLUS 2", "Vorige", "Huidige"]);
    
    TOM_CLUBS.forEach(club => {
        growthData.push([club, data.growth[club].cyclus2.previous || "", data.growth[club].cyclus2.current || ""]);
    });

    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(growthData), "Groei");

    XLSX.writeFile(wb, "Tom_Dashboard_Export.xlsx");
};
