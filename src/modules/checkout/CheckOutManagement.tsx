import { UserX } from 'lucide-react';
import type { CheckOutGuest } from '../../types';

interface CheckOutProps {
  checkouts: CheckOutGuest[];
  handleCheckOutAction: (id: number, roomNum: number) => void;
}

export default function CheckOutManagement({ checkouts, handleCheckOutAction }: CheckOutProps) {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-3xs text-left">
      <div className="border-b pb-4 mb-6">
        <h2 className="text-lg font-bold text-[#1E3A5F]">Daftar Tamu Keluar (Check-Out List)</h2>
        <p className="text-xs text-gray-500">Kelola proses checkout, invoice, dan tagihan kamar tamu.</p>
      </div>
      <div className="space-y-4">
        {checkouts.map(co => (
          <div key={co.id} className="p-4 rounded-xl border border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-sm font-extrabold text-[#1E3A5F]">{co.name}</p>
              <p className="text-xs text-gray-500 font-semibold mt-1">
                Menempati: <span className="font-bold text-[#1E3A5F]">Kamar {co.roomNum}</span> • Total Tagihan: <span className="font-bold text-red-600">Rp {co.balance.toLocaleString('id-ID')}</span>
              </p>
              <p className="text-[10px] text-gray-400 mt-0.5">Rencana Keluar: {co.time}</p>
            </div>
            <div>
              {co.status === 'Checked Out' ? (
                <span className="px-3 py-1.5 bg-gray-100 text-gray-400 text-xs font-bold rounded-lg border border-gray-200 inline-block">
                  ✓ Selesai Check-Out (Kamar Kotor)
                </span>
              ) : (
                <button
                  onClick={() => handleCheckOutAction(co.id, co.roomNum)}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg cursor-pointer transition-all flex items-center space-x-1.5"
                >
                  <UserX className="w-4 h-4" />
                  <span>Proses Checkout & Bayar</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
