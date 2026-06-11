import { X, LogOut, Shield } from 'lucide-react';
import type { User } from '../../types';

interface ProfileSlideOutProps {
  isOpen: boolean;
  onClose: () => void;
  loggedInUser: User;
  onLogout: () => void;
}

export default function ProfileSlideOut({ isOpen, onClose, loggedInUser, onLogout }: ProfileSlideOutProps) {
  return (
    <>
      {/* Overlay backdrop */}
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 bg-black/40 z-40 transition-opacity duration-300"
        />
      )}

      {/* Slideout panel */}
      <div className={`fixed top-0 right-0 h-full w-80 bg-white shadow-2xl border-l border-gray-200 z-50 transform transition-transform duration-300 ease-in-out text-left flex flex-col justify-between ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div>
          {/* Header */}
          <div className="p-5 border-b border-gray-150 flex items-center justify-between bg-[#1E3A5F] text-white">
            <h3 className="text-sm font-extrabold tracking-wider uppercase">Profil Karyawan</h3>
            <button 
              onClick={onClose}
              className="text-white hover:text-gray-300 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User Details */}
          <div className="p-6 space-y-6">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-[#1E3A5F]/10 text-[#1E3A5F] flex items-center justify-center font-extrabold text-2xl border-2 border-[#1E3A5F]">
                {loggedInUser.name.charAt(0)}
              </div>
              <h4 className="text-base font-extrabold text-[#1E3A5F] mt-3">{loggedInUser.name}</h4>
              <span className="px-2.5 py-0.5 bg-[#1E3A5F]/10 text-[#1E3A5F] rounded-full text-[10px] font-bold uppercase tracking-wider mt-1.5 border border-[#1E3A5F]/20">
                {loggedInUser.role}
              </span>
            </div>

            <div className="pt-4 border-t border-gray-100 space-y-3">
              <div className="text-xs">
                <span className="font-bold text-gray-400 uppercase tracking-wider block">NIP Karyawan</span>
                <span className="font-semibold text-gray-700 font-mono mt-0.5 block">{loggedInUser.nip}</span>
              </div>
              <div className="text-xs">
                <span className="font-bold text-gray-400 uppercase tracking-wider block">Departemen Simulasi</span>
                <span className="font-semibold text-gray-700 mt-0.5 block flex items-center space-x-1.5">
                  <Shield className="w-3.5 h-3.5 text-[#1E3A5F]" />
                  <span>{loggedInUser.role.replace(' Supervisor', '').replace(' Specialist', '')}</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer with Logout */}
        <div className="p-5 border-t border-gray-100 bg-[#F5F7FA]">
          <button
            onClick={() => {
              onClose();
              onLogout();
            }}
            className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-xs tracking-wider uppercase transition-colors shadow-2xs cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Keluar dari Workspace</span>
          </button>
        </div>
      </div>
    </>
  );
}
