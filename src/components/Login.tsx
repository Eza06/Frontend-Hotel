import React, { useState } from 'react';
import { 
  Lock, 
  User as UserIcon, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  HelpCircle, 
  Smartphone, 
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import type { User } from '../types';

export const DEMO_ACCOUNTS: User[] = [
  { nip: 'NIP-ADMIN', name: 'Budi Santoso', role: 'Administrator', pass: 'admin123' },
  { nip: 'NIP-FO', name: 'Siti Rahma', role: 'Front Office Supervisor', pass: 'fo123' },
  { nip: 'NIP-MGR', name: 'Hendra Wijaya', role: 'Hotel Manager', pass: 'mgr123' }
];

interface LoginProps {
  onLoginSuccess: (user: User) => void;
}

export default function Login({ onLoginSuccess }: LoginProps) {
  const [nip, setNip] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showForgotModal, setShowForgotModal] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    
    if (!nip || !password) {
      setErrorMessage('NIP dan Kata Sandi wajib diisi.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const match = DEMO_ACCOUNTS.find(
        acc => acc.nip.toUpperCase() === nip.toUpperCase().trim() && acc.pass === password
      );

      setIsSubmitting(false);

      if (match) {
        onLoginSuccess(match);
      } else {
        setErrorMessage('NIP atau Kata Sandi salah. Gunakan akun demo di sebelah kanan.');
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-white text-[#1E3A5F] flex flex-col md:flex-row font-sans overflow-x-hidden selection:bg-[#1E3A5F] selection:text-white">
      
      {/* Left Column: School branding & Info overlay */}
      <div className="md:w-1/2 bg-[#1E3A5F] text-white flex flex-col justify-between p-8 md:p-12 relative overflow-hidden shrink-0">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid-login" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid-login)" />
          </svg>
        </div>
        
        {/* Top left branding */}
        <div className="flex items-center space-x-3 z-10">
          <div className="w-12 h-12 bg-white text-[#1E3A5F] rounded-xl flex items-center justify-center shadow-lg font-bold shrink-0">
            <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 22C12 22 20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M9 14V17H15V14M12 8V10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M7 11V17H17V11H7Z" fill="currentColor" />
            </svg>
          </div>
          <div>
            <div className="font-extrabold tracking-wide text-lg text-white leading-tight">SMA PERHOTELAN</div>
            <div className="text-[10px] font-semibold text-gray-300 uppercase tracking-widest leading-none">Hotel Simulation System</div>
          </div>
        </div>

        {/* Center Info Text */}
        <div className="my-12 md:my-auto max-w-lg z-10">
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#22C55E]/15 border border-[#22C55E]/30 text-[#22C55E] text-xs font-bold uppercase tracking-wider mb-6 shadow-2xs">
            <span className="w-2 h-2 bg-[#22C55E] rounded-full mr-2 animate-pulse"></span>
            Sistem Simulasi Aktif
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white leading-tight mb-4">
            Portal Operasional Staf
          </h2>
          <p className="text-gray-200 text-sm md:text-base leading-relaxed font-light">
            Platform simulasi operasional hotel yang dirancang untuk mendukung pembelajaran reservasi, layanan tamu, housekeeping, dan manajemen hotel secara terintegrasi.
          </p>
        </div>

        <div className="text-xs text-gray-400 font-light mt-8 md:mt-0 z-10">
          © 2026 SMA PERHOTELAN. Untuk Kebutuhan Pembelajaran Internal.
        </div>
      </div>

      {/* Right Column: Clean Login Form */}
      <div className="md:w-1/2 bg-white flex flex-col justify-center px-6 py-12 md:px-16 lg:px-24 xl:px-32 relative">
        <div className="max-w-md w-full mx-auto">
          {/* Header */}
          <div className="mb-8 text-left">
            <div className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Staff Authentication</div>
            <h3 className="text-2xl md:text-3xl font-extrabold text-[#1E3A5F]">Selamat datang kembali</h3>
            <p className="text-gray-500 text-xs mt-1">Harap masuk untuk mengakses ruang kerja sesuai tugas Anda.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {errorMessage && (
              <div className="p-3.5 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3 text-red-700 text-xs">
                <ShieldAlert className="w-5 h-5 shrink-0 text-red-500" />
                <div>
                  <span className="font-bold">Masalah Masuk Sistem:</span>
                  <p className="mt-0.5">{errorMessage}</p>
                </div>
              </div>
            )}

            <div>
              <label htmlFor="nip" className="block text-xs font-bold uppercase tracking-wider text-[#1E3A5F] mb-2">
                NIP / ID Karyawan
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <UserIcon className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  id="nip"
                  name="nip"
                  value={nip}
                  onChange={(e) => setNip(e.target.value)}
                  placeholder="Contoh: NIP-FO"
                  className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]/20 focus:border-[#1E3A5F] transition-all bg-[#F5F7FA] text-gray-800"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-bold uppercase tracking-wider text-[#1E3A5F] mb-2">
                Kata Sandi
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan kata sandi Anda"
                  className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]/20 focus:border-[#1E3A5F] transition-all bg-[#F5F7FA] text-gray-800"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center text-gray-600 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                  className="w-4 h-4 rounded-md border-gray-300 text-[#1E3A5F] focus:ring-[#1E3A5F]/30 focus:ring-offset-0 mr-2 bg-gray-50 cursor-pointer"
                />
                Tetap masuk untuk shift ini
              </label>
              <button 
                type="button"
                onClick={() => setShowForgotModal(true)}
                className="font-bold text-[#1E3A5F] hover:underline focus:outline-none"
              >
                Lupa kata sandi?
              </button>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-lg bg-[#1E3A5F] text-white font-bold text-sm tracking-wide shadow-md hover:bg-[#1E3A5F]/90 transition-all cursor-pointer"
            >
              {isSubmitting ? (
                <span>MENGHUBUNGKAN...</span>
              ) : (
                <>
                  <span>MASUK KE WORKSPACE</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Help Contact */}
          <div className="mt-8 pt-6 border-t border-gray-100 text-left">
            <div className="flex items-start space-x-3 text-xs text-gray-500">
              <HelpCircle className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-gray-700">Butuh bantuan masuk?</span>
                <p className="mt-0.5">Silakan hubungi Administrator simulasi.</p>
                <div className="mt-2 flex items-center space-x-1.5 font-bold text-[#1E3A5F] hover:text-[#1E3A5F]/80">
                  <Smartphone className="w-3.5 h-3.5" />
                  <a href="https://wa.me/6281234567890" target="_blank" rel="noreferrer">
                    WhatsApp: 0812-3456-7890
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center text-[10px] text-gray-400 flex items-center justify-center space-x-1">
            <span>🔒 Enkripsi 256-bit</span>
            <span>•</span>
            <span>Sesi berakhir dalam 8 jam</span>
            <span>•</span>
            <span>Akses terawasi</span>
          </div>
        </div>
      </div>

      {/* Demo Helper Box */}
      <div className="fixed bottom-4 right-4 max-w-sm w-full bg-white border border-gray-200 p-4 rounded-xl shadow-xl z-50 text-left hidden lg:block">
        <div className="flex items-start space-x-2.5">
          <CheckCircle2 className="w-5 h-5 text-[#22C55E] shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="text-xs font-bold text-[#1E3A5F]">Papan Uji Akun Simulasi</h4>
            <p className="text-[10px] text-gray-500 mt-0.5 leading-relaxed">
              Klik salah satu akun di bawah untuk mengisi form login secara instan:
            </p>
            <div className="mt-3 space-y-1.5">
              {DEMO_ACCOUNTS.map((acc, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setNip(acc.nip);
                    setPassword(acc.pass);
                    setErrorMessage('');
                  }}
                  className="w-full text-left px-2 py-1 rounded bg-[#F5F7FA] hover:bg-[#1E3A5F]/5 border border-gray-200 hover:border-[#1E3A5F]/20 text-[10px] flex items-center justify-between transition-colors cursor-pointer group"
                >
                  <span className="font-semibold text-[#1E3A5F] font-mono">{acc.nip}</span>
                  <span className="text-gray-400 group-hover:text-[#1E3A5F] transition-colors">{acc.role}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl border border-gray-100 max-w-md w-full p-6 text-left relative">
            <h4 className="text-lg font-bold text-[#1E3A5F] mb-2">Lupa Kata Sandi?</h4>
            <p className="text-sm text-gray-600 mb-4 leading-relaxed">
              Untuk alasan keamanan simulasi, silakan hubungi guru pendamping atau administrator laboratorium hotel.
            </p>
            <div className="bg-[#F5F7FA] p-3.5 rounded-lg mb-6 border border-gray-200">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Kontak Administrator</span>
              <p className="text-sm font-bold text-[#1E3A5F] mt-1 flex items-center space-x-1.5">
                <Smartphone className="w-4 h-4 text-[#1E3A5F]" />
                <span>WhatsApp: 0812-3456-7890</span>
              </p>
            </div>
            <button
              onClick={() => setShowForgotModal(false)}
              className="w-full py-2 bg-[#1E3A5F] text-white rounded-lg text-sm font-bold cursor-pointer"
            >
              Tutup Dialog
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
