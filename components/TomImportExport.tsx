
import React, { useRef } from 'react';
import { Upload, Download } from 'lucide-react';
import { parseTomExcel, exportTomExcel } from '../services/tomExcelService';
import { TomAppData, UserRole } from '../types';

interface Props {
  onDataLoaded: (data: Partial<TomAppData>) => void;
  fullData: TomAppData;
  userRole: UserRole;
}

const TomImportExport: React.FC<Props> = ({ onDataLoaded, fullData, userRole }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isAdmin = userRole === 'admin';

  if (!isAdmin) {
    return null;
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      try {
        const parsed = await parseTomExcel(e.target.files[0]);
        onDataLoaded(parsed);
        alert("Data Tom succesvol geladen ✓");
      } catch (error) {
        console.error(error);
        alert("Fout bij laden Excel. Controleer het formaat.");
      }
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="flex space-x-3 w-full md:w-auto justify-end no-print">
      {/* Import Button */}
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

      {/* Export Button */}
      <button 
        onClick={() => exportTomExcel(fullData)}
        className="flex items-center justify-center space-x-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg shadow-sm transition-colors text-sm font-medium flex-1 md:flex-initial"
      >
        <Download size={16} />
        <span className="hidden sm:inline">Excel Exporteren</span>
        <span className="sm:hidden">Export</span>
      </button>
    </div>
  );
};

export default TomImportExport;
