
import React, { useRef } from 'react';
import { Upload, Download } from 'lucide-react';
import { parseExcelData, exportExcelData } from '../services/excelService';
import { AppData, UserRole } from '../types';

interface ImportExportProps {
  onDataLoaded: (data: Partial<AppData>) => void;
  fullData: AppData;
  userRole: UserRole;
}

const ImportExport: React.FC<ImportExportProps> = ({ onDataLoaded, fullData, userRole }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isAdmin = userRole === 'admin';

  if (!isAdmin) {
    return null;
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      try {
        const parsed = await parseExcelData(e.target.files[0]);
        onDataLoaded(parsed);
        alert("Data succesvol geladen ✓");
      } catch (error) {
        console.error(error);
        alert("Fout bij laden Excel. Controleer het formaat.");
      }
      // Reset input
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="flex space-x-3 w-full md:w-auto justify-end no-print">
      {/* Import Button - Only for Admin */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        className="hidden" 
        accept=".xlsx, .xls"
      />
      
      <button 
        onClick={() => fileInputRef.current?.click()}
        className="flex items-center justify-center space-x-2 bg-[#E3000B] hover:bg-red-700 text-white px-4 py-2 rounded-lg shadow-sm transition-colors text-sm font-medium flex-1 md:flex-initial"
      >
        <Upload size={16} />
        <span className="hidden sm:inline">Excel Importeren</span>
        <span className="sm:hidden">Import</span>
      </button>

      {/* Export Button - Only for Admin */}
      <button 
        onClick={() => exportExcelData(fullData)}
        className="flex items-center justify-center space-x-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg shadow-sm transition-colors text-sm font-medium flex-1 md:flex-initial"
      >
        <Download size={16} />
        <span className="hidden sm:inline">Excel Exporteren</span>
        <span className="sm:hidden">Export</span>
      </button>
    </div>
  );
};

export default ImportExport;
