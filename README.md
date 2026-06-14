# 🏨 Hotel Management System (HMS) - Frontend Architecture & Review

A modern, desktop-first Enterprise Hotel Operations Dashboard built with **React 19**, **TypeScript**, **Tailwind CSS**, and **Lucide Icons**.

---

## 🔑 Kredensial Akun Demo (Uji Coba & Presentasi)
Untuk memudahkan demonstrasi alur kerja multi-role, gunakan akun-akun demo berikut di halaman Login:

| Peran (Role) | NIP | Kata Sandi | Nama Demo | Ruang Lingkup Fitur Utama |
| :--- | :--- | :--- | :--- | :--- |
| **Administrator** | `NIP-ADMIN` | `admin123` | Budi Santoso | Full control, Master Data, Room Map, guest management, and analytics. |
| **Hotel Manager** | `NIP-MGR` | `mgr123` | Hendra Wijaya | Ringkasan operasional bisnis, laporan keuangan, dan verifikasi dokumen. |
| **Front Office** | `NIP-FO` | `fo123` | Siti Rahma | Reservation & booking, check-in, check-out, room & floor map. |
| **Housekeeping** | `NIP-HK` | `hk123` | Agus Saputra | Start/Stop shift, cleaning tasks list, room ready trigger, and maintenance reports. |
| **Customer Service** | `NIP-CS` | `cs123` | Rina Lestari | Guest requests inbox, live ticketing queue, categorical statistics, and quick resolve. |

---

## 🛠️ Peta Struktur Modul UI
*   `src/modules/auth/Login.tsx` - Autentikasi multi-role.
*   `src/modules/dashboard/Dashboard.tsx` - Entry-point kondisional yang membagi rendering dashboard berdasarkan *user role*.
*   `src/modules/housekeeping/`
    *   `HousekeepingManagement.tsx` - Halaman manajemen housekeeping bagi **Admin & Supervisor** (distribusi beban kerja, status staff, dan log riwayat).
    *   `HousekeepingDashboard.tsx` - Lembar kerja operasional bagi **Staf Housekeeper** di lapangan.
*   `src/modules/customer-service/`
    *   `CustomerServiceManagement.tsx` - Manajemen lengkap tiket, log kustom, filter prioritas, dan ekspor CSV.
    *   `CustomerServiceDashboard.tsx` - Dasbor ringkas bagi **Staf Customer Service** untuk melacak request aktif secara real-time.

---

## 🔍 Analisis Senior Developer: Ketidakselarasan Alur & Solusi Produksi

Saat ini, sistem dirancang untuk kebutuhan **presentasi & prototipe interaktif (Frontend-only Mockup)**. Berdasarkan peninjauan arsitektur (*code review*), terdapat beberapa celah sinkronisasi (*synchronization gaps*) antara ruang kerja Admin/Supervisor dengan Staf Lapangan yang perlu dijembatani sebelum masuk ke tahap produksi (*production-ready*).

### 1. Masalah Isolasi State (State Isolation Gap)
*   **Temuan:** Status shift staf (`isWorking`), daftar tugas pembersihan, dan log riwayat pembersihan dikelola menggunakan state lokal (`useState`) di dalam masing-masing komponen:
    *   Supervisor mengalokasikan kamar di `HousekeepingManagement.tsx`.
    *   Staf Housekeeper melihat penugasan dari mock list terisolasi di `HousekeepingDashboard.tsx`.
*   **Dampak:** Perubahan penugasan yang dilakukan oleh Supervisor di halaman Admin tidak langsung muncul di layar Staf Housekeeper, dan sebaliknya.
*   **Solusi Produksi:** Pindahkan data penugasan tugas ke database relasional dengan skema terpusat. Gunakan state manager global seperti **Zustand** atau react-query (**TanStack Query**) untuk melakukan sinkronisasi data server secara otomatis.

### 2. Inkonsistensi Tipe Data Status Kamar & Tugas
*   **Temuan:**
    *   Status kamar global (`Room.status`) bernilai: `'available' | 'occupied' | 'dirty' | 'maintenance'`.
    *   Status siklus hidup pembersihan di dashboard staf bernilai: `'Assigned' | 'In Progress' | 'Completed'`.
*   **Dampak:** Transisi status kamar kotor (`dirty`) menjadi siap digunakan (`available`) tidak memiliki relasi entitas tugas (*task model*) yang jelas di tingkat database.
*   **Solusi Produksi:** Buat tabel relasional khusus **Task Assignment** pada Backend:
    ```typescript
    interface HousekeepingTask {
      id: string;
      roomNumber: string;
      housekeeperNip: string;
      status: 'Assigned' | 'In_Progress' | 'Completed';
      assignedAt: string;
      completedAt?: string;
    }
    ```

### 3. Komunikasi Real-time (Push Notifications)
*   **Temuan:** Saat ini, pembagian rata kamar kotor (*Even Workload Distribution*) oleh admin memerlukan interaksi manual staf untuk memvalidasi pembersihan.
*   **Dampak:** Staf di lapangan harus terus-menerus me-refresh halaman untuk melihat apakah ada tugas kamar kotor baru yang dibebankan kepada mereka.
*   **Solusi Produksi:** Implementasikan protokol komunikasi dua arah seperti **WebSockets (Socket.io / Laravel Echo)** atau **Server-Sent Events (SSE)**. Ketika Admin mengklik tombol "Bagi Rata Beban Kerja", server akan mengirimkan *payload socket* yang memicu pembaruan state instan dan memunculkan notifikasi suara/pop-up di aplikasi staf Housekeeper.

### 4. Integrasi Lintas Departemen (CS & Housekeeping/Maintenance)
*   **Temuan:** Tiket layanan dari Customer Service (misalnya, keluhan *"Kamar mandi bocor"* atau *"Minta bantal tambahan"*) terisolasi di modul CS.
*   **Dampak:** Staf Housekeeping atau tim teknisi (*Maintenance*) tidak mendapatkan pemberitahuan bahwa mereka perlu mengantarkan barang atau memperbaiki fasilitas kamar tersebut.
*   **Solusi Produksi:** Terapkan **Sistem Event Dispatcher** di backend:
    *   *Event:* `CSRequestCreated` (Kategori: *Amenities* / *Maintenance*)
    *   *Listener:* Secara otomatis membuat baris baru di tabel `HousekeepingTasks` atau `MaintenanceReports` dengan relasi nomor kamar yang bersangkutan sehingga staf terkait langsung melihat tugas tersebut di dasbor mereka.

---

## 🚀 Langkah Pengembangan Selanjutnya
1.  **Koneksi API (Axios/Fetch):** Ubah seluruh data mock di `mockData.ts` dan state lokal komponen dengan pengambilan data dari API Endpoint nyata.
2.  **Manajemen State Global:** Gunakan Context API atau Zustand untuk membagi state `loggedInUser` dan trigger pembaruan status kamar secara real-time.
3.  **Keamanan Sesi & Route Guard:** Integrasikan token JWT (JSON Web Token) dari backend untuk memvalidasi hak akses role sebelum merender menu navigasi di frontend.
