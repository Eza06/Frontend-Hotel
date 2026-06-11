import { UserCheck } from 'lucide-react';
import type { CheckInGuest } from '../../types';

interface CheckInProps {
  checkins: CheckInGuest[];
  handleCheckInAction: (id: number, roomNum: number) => void;
}

export default function CheckInManagement({ checkins, handleCheckInAction }: CheckInProps) {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-3xs text-left">
      <div className="border-b pb-4 mb-6">
        <h2 className="text-lg font-bold text-[#1E3A5F]">Daftar Tamu Masuk (Check-In Waiting List)</h2>
        <p className="text-xs text-gray-500">Daftar tamu terdaftar yang dijadwalkan masuk hari ini.</p>
      </div>
      <div className="space-y-4">
        {checkins.map(ci => (
          <div key={ci.id} className="p-4 rounded-xl border border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-sm font-extrabold text-[#1E3A5F]">{ci.name}</p>
              <p className="text-xs text-gray-500 font-semibold mt-1">
                Kamar yang dialokasikan: <span className="font-bold text-[#1E3A5F]">Kamar {ci.roomNum}</span> ({ci.roomType})
              </p>
              <p className="text-[10px] text-gray-400 mt-0.5">Jadwal Tiba: {ci.time} • Status: {ci.status}</p>
            </div>
            <div>
              {ci.status === 'Checked In' ? (
                <span className="px-3 py-1.5 bg-green-50 text-green-700 text-xs font-bold rounded-lg border border-green-200 inline-block">
                  ✓ Selesai Check-In
                </span>
              ) : (
                <button
                  onClick={() => handleCheckInAction(ci.id, ci.roomNum)}
                  className="px-4 py-2 bg-[#1E3A5F] hover:bg-[#1E3A5F]/90 text-white text-xs font-bold rounded-lg cursor-pointer transition-all flex items-center space-x-1.5"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>Verifikasi & Check-In Tamu</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
