import React from 'react';
import { Plus } from 'lucide-react';
import type { FBOrder } from '../../types';

interface FBProps {
  fbOrders: FBOrder[];
  setFbOrders: React.Dispatch<React.SetStateAction<FBOrder[]>>;
  handleDeliverFBOrder: (id: number) => void;
}

export default function FoodBeverageManagement({ 
  fbOrders, 
  setFbOrders, 
  handleDeliverFBOrder 
}: FBProps) {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-3xs text-left">
      <div className="border-b pb-4 mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-bold text-[#1E3A5F]">Layanan Makanan & Minuman Kamar (F&B Orders)</h2>
          <p className="text-xs text-gray-500">Mencatat dan mengonfirmasi pesanan room service makanan dari kamar tamu.</p>
        </div>
        <button
          onClick={() => {
            const room = prompt('Masukkan Nomor Kamar:');
            const item = prompt('Masukkan Nama Makanan/Minuman:');
            if (room && item) {
              setFbOrders(prev => [...prev, { id: prev.length + 1, roomNum: parseInt(room), item, qty: 1, price: 45000, status: 'Pending' }]);
            }
          }}
          className="px-3 py-1.5 bg-[#1E3A5F] text-white text-xs font-bold rounded-lg flex items-center space-x-1 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Buat Order Makanan</span>
        </button>
      </div>

      <div className="space-y-3">
        {fbOrders.map(ord => (
          <div key={ord.id} className="p-4 rounded-xl border border-gray-200 flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-[#1E3A5F]">Kamar {ord.roomNum}</p>
              <p className="text-xs text-gray-700 mt-1 font-semibold">{ord.item} (x{ord.qty})</p>
              <p className="text-[10px] text-gray-555 mt-0.5">Biaya: Rp {ord.price.toLocaleString('id-ID')} (Masuk tagihan akhir kamar)</p>
              <span className={`inline-block mt-2 px-2 py-0.5 rounded text-[9px] font-bold border ${
                ord.status === 'Pending' ? 'bg-red-50 text-red-600 border-red-200' : 
                ord.status === 'On Progress' ? 'bg-blue-50 text-blue-600 border-blue-200' : 
                'bg-gray-100 text-gray-400 border-gray-200'
              }`}>
                Status: {ord.status}
              </span>
            </div>
            <div>
              {ord.status !== 'Delivered' ? (
                <button
                  onClick={() => handleDeliverFBOrder(ord.id)}
                  className="px-3 py-1.5 bg-[#22C55E] text-white text-xs font-bold rounded-lg hover:bg-green-600 cursor-pointer"
                >
                  Tandai Dikirim
                </button>
              ) : (
                <span className="text-xs text-gray-400 font-bold">✓ Terkirim ke Kamar</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
