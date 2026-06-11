interface SettingsProps {
  onReset: () => void;
}

export default function SettingsManagement({ onReset }: SettingsProps) {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-3xs text-left max-w-lg mx-auto">
      <div className="border-b pb-4 mb-6">
        <h2 className="text-lg font-bold text-[#1E3A5F]">Pengaturan Simulasi HMS</h2>
        <p className="text-xs text-gray-500">Kustomisasi parameter simulasi laboratorium sekolah.</p>
      </div>
      <div className="space-y-4 text-xs font-semibold text-[#1E3A5F]">
        <div>
          <label className="block mb-1 font-bold">MODE SIMULASI</label>
          <select className="w-full p-2.5 border border-gray-300 rounded-lg">
            <option>Mode Pembelajaran Mandiri (Default)</option>
            <option>Mode Ujian Praktik Sekolah</option>
          </select>
        </div>
        <div>
          <label className="block mb-1 font-bold">RESET DATABASE SIMULASI</label>
          <button 
            onClick={() => {
              if (confirm('Apakah Anda yakin ingin menyetel ulang database simulasi ke pengaturan demo awal?')) {
                onReset();
                alert('Database berhasil di-reset!');
              }
            }}
            type="button"
            className="mt-1 w-full py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg cursor-pointer transition-all"
          >
            KEMBALIKAN KE MOCK DEMO AWAL (78 TERISI, 32 KOSONG)
          </button>
        </div>
      </div>
    </div>
  );
}
