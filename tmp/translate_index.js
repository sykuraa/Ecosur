const fs = require('fs');
const path = require('path');

const targetFile = 'd:\\Masa ngoding lagi sih\\Ngoding Ecosur 2\\user\\index.html';
let content = fs.readFileSync(targetFile, 'utf8');

const replacements = [
  ['Komunitas Renang Resmi President University.', 'The Official Swimming Community of President University.'],
  ['Bangun prestasimu di dalam dan luar kolam renang bersama kami.', 'Build your achievements in and out of the pool with us.'],
  ['Bergabung Sekarang', 'Join Now'],
  ['Prestasi</h4', 'Achievements</h4'],
  ['Mencetak juara di tingkat nasional dan internasional.', 'Producing champions at national and international levels.'],
  ['Komunitas Kuat</h4', 'Strong Community</h4'],
  ['Lebih dari sebuah klub, kami adalah keluarga mahasiswa pecinta air.', 'More than just a club, we are a family of students who love the water.'],
  ['Program Terpadu</h4', 'Integrated Programs</h4'],
  ['Silabus latihan akurat untuk tingkat pemula hingga atlet.', 'Accurate training syllabus for beginners to athletes.'],
  ['Tentang <span class="text-gradient">SwimmerClub</span>', 'About <span class="text-gradient">SwimmerClub</span>'],
  ['Lebih dari sekadar berenang, kami adalah sebuah keluarga.', 'More than just swimming, we are a family.'],
  ['Sejarah Kami</h2', 'Our History</h2'],
  ['Berdiri sejak beberapa tahun lalu, SwimmerClub President University awalnya hanya perkumpulan kecil mahasiswa. Kini, kami telah berkembang menjadi divisi elit yang menaungi ratusan atlet dan penggiat renang amatir maupun profesional di dalam kampus.', 'Established a few years ago, SwimmerClub President University started as a small gathering of students. Today, we have grown into an elite division nurturing hundreds of athletes and swimming enthusiasts on campus.'],
  ['Visi & Misi</h2', 'Vision & Mission</h2'],
  ['<strong>Visi:</strong> Mencetak mahasiswa yang sehat jasmani serta meraih medali di kancah nasional.', '<strong>Vision:</strong> To be the best platform in cultivating physically fit students and achieving medals on the national stage.'],
  ['<strong>Misi 1:</strong> Latihan rutin mingguan yang terstruktur.', '<strong>Mission 1:</strong> To conduct structured weekly training sessions.'],
  ['<strong>Misi 2:</strong> Berpartisipasi aktif dalam kejuaraan antar universitas.', '<strong>Mission 2:</strong> To actively participate in inter-university championships.'],
  ['<strong>Misi 3:</strong> Membangun rasa kekeluargaan.', '<strong>Mission 3:</strong> To build a sense of kinship.'],
  ['SwimmerClub dalam Angka</h3', 'SwimmerClub in Numbers</h3'],
  ['Total Anggota', 'Total Members'],
  ['Prestasi Diraih', 'Achievements'],
  ['Event Tahunan', 'Annual Events'],
  ['Pelatih Ahli', 'Expert Coaches'],
  ['Galeri <span class="text-gradient">Prestasi</span>', 'Achievement <span class="text-gradient">Gallery</span>'],
  ['Momen emas yang berhasil kami ukir bersama.', 'Golden moments we\'ve carved out together.'],
  ['Lihat Detail', 'View Details'],
  ['Program <span class="text-gradient">& Jadwal</span>', 'Programs <span class="text-gradient">& Schedules</span>'],
  ['Agenda kegiatan yang dirancang khusus untuk seluruh member SwimmerClub.', 'Specially designed agendas for all SwimmerClub members.'],
  ['Latihan spesial yang diadakan setiap 6 bulan sekali ini membawa para member keluar dari zona nyaman—langsung ke perairan terbuka seperti laut atau pantai. Berbeda dari latihan di kolam, Open Water Training memberikan tantangan baru dalam hal adaptasi arus, jarak pandang, serta kontrol ritme renang.', 'This special training, held every 6 months, takes members out of their comfort zone—straight to open waters like the sea or beach. Unlike pool training, Open Water Training introduces new challenges in adapting to currents, visibility, and rhythm control.'],
  ['Selain meningkatkan kemampuan teknis, program ini juga menjadi momen yang paling dinanti karena menghadirkan pengalaman yang lebih bebas, seru, dan berkesan. Tidak hanya berlatih, kegiatan ini juga memperkuat kebersamaan antar member dalam suasana yang lebih santai dan menyenangkan.', 'Beyond improving technical skills, this program is highly anticipated as it offers a freer, more exciting, and memorable experience. It\'s not just about training; it strengthens camaraderie among members in a relaxed and fun environment.'],
  ['Jadwal Latihan Rutin', 'Regular Training Schedule'],
  ['Latihan rutin diadakan 3 kali dalam seminggu untuk menjaga konsistensi dan meningkatkan kemampuan setiap member. Setiap sesi mencakup pemanasan, latihan teknik, latihan utama, hingga pendinginan, dengan fokus pada teknik, endurance, dan speed.', 'Regular training is held 3 times a week to maintain consistency and improve every member\'s skills. Each session covers warm-ups, technical drills, main sets, and cool-downs, focusing on technique, endurance, and speed.'],
  ['Jadwal Latihan', 'Training Schedule'],
  ['Rabu Sore — 16.00 – Selesai', 'Wednesday Afternoon — 16.00 – End'],
  ['Sabtu Sore — 15.30 – Selesai', 'Saturday Afternoon — 15.30 – End'],
  ['Minggu Pagi — 07.00 – Selesai', 'Sunday Morning — 07.00 – End'],
  ['Program Bulanan', 'Monthly Program'],
  ['Kompetisi internal diadakan setiap bulan sebagai ajang evaluasi dan meningkatkan semangat kompetitif antar member. Format lomba sederhana seperti sprint 50m atau 100m, dengan suasana santai namun tetap menantang. Selain mengukur perkembangan, program ini juga membangun sportivitas dan kebersamaan. Pemenang akan mendapatkan hadiah menarik dari coach atau manajemen.', 'Internal competitions are held monthly to evaluate and boost the competitive spirit among members. Races feature simple formats like 50m or 100m sprints, maintaining a relaxed yet challenging atmosphere. Aside from measuring progress, this program builds sportsmanship and unity. Winners receive exciting surprise rewards from the coaches or management.'],
  ['Apa Kata <span class="text-gradient">Mereka?</span>', 'Community <span class="text-gradient">Pulse</span>'],
  ['Kesan dan pesan dari para anggota SwimmerClub.', 'Impressions and messages from SwimmerClub members.'],
  ['Suara Komunitas', 'What People Say'],
  ['"Wah, keren banget! Komunitas yang luar biasa seru dan mendukung penuh untuk perkembangan teknik berenangku dari nol."', '"Wow, this is incredibly cool! An outstandingly fun community that fully supports my swimming progress from zero."'],
  ['Kirim Pesanmu', 'Send Your Shoutout'],
  ['Nama Lengkap', 'Full Name'],
  ['Kontak / IG (Opsional)', 'Contact / IG (Optional)'],
  ['Tulis sesuatu untuk SwimmerClub...', 'Write something for SwimmerClub...'],
  ['Kirim Shoutout', 'Send Shoutout'],
  ['Detail Prestasi', 'Achievement Details'],
  ['Judul Prestasi', 'Achievement Title'],
  ['Tanggal', 'Date'],
  ['Tempat Event', 'Event Venue'],
  ['Deskripsi Event', 'Event Description'],
  ['Deskripsi rinci mengenai acara yang diikuti, jalannya pertandingan, hingga hasil yang memuaskan.', 'Detailed description of the event attended, the course of the match, and the satisfying results.'],
  ['Juara Umum POMNAS 2025', 'POMNAS Overall Champion 2025'],
  ['12 - 15 Agustus 2025', 'August 12 - 15, 2025'],
  ['Kolam Atletik Gelora Bung Karno, Jakarta', 'Gelora Bung Karno Aquatic Center, Jakarta'],
  ['Kompetisi mahasiswa nasional tahunan. Tim SwimmerClub PU berhasil memborong 3 medali emas pada kategori renang gaya bebas jarak jauh dan gaya punggung.', 'Annual national university competition. SwimmerClub PU team successfully swept 3 gold medals in long-distance freestyle and backstroke categories.'],
  ['Latihan Rutin Bersama', 'Joint Routine Training'],
  ['Setiap Akhir Pekan', 'Every Weekend'],
  ['President University Pool Deck', 'President University Pool Deck'],
  ['Sesi latihan intensif mingguan di kolam utama kampus. Latihan mencakup peningkatan daya tahan tubuh dan perbaikan teknik loncat indah (diving).', 'Weekly intensive training sessions in the main campus pool. Training covers stamina building and form perfection.'],
  ['Kejuaraan renang internal se-angkatan untuk memperebutkan piala bergilir Rektor PU. Dihadiri lebih dari 300 mahasiswa sebagai pendukung.', 'Internal university swimming competition to win the Rector rotating trophy. Attended by more than 300 students as supporters.'],
  ['Karantina Atlet PON', 'Athlete Quarantine for PON'],
  ['Januari - Maret 2026', 'January - March 2026'],
  ['Pusat Pelatihan Nasional Bandung', 'National Training Center, Bandung'],
  ['Program khusus asrama bagi atlet mahasiwa terpilih untuk menjalani pemusatan latihan intensif menjelang Pekan Olahraga Nasional.', 'Special boarding program for selected student athletes to undergo intensive training ahead of the National Sports Week.']
];

for (const [indo, eng] of replacements) {
    // Global replacement for basic strings, or single replacement
    content = content.replace(new RegExp(indo.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), eng);
}

// Inject the Splash Screen HTML right after the <body... tag
if (!content.includes('id="splash-screen"')) {
    const splashHTML = `
  <!-- Splash Screen -->
  <div id="splash-screen" class="splash-screen">
    <div class="swimmer-animation">
      <i class="fas fa-swimmer"></i>
    </div>
    <div class="splash-logo position-absolute">SwimmerClub</div>
  </div>
`;
    content = content.replace(/<body[^>]*>/i, match => match + '\n' + splashHTML);
}

fs.writeFileSync(targetFile, content);
console.log('Translations applied to index.html successfully!');
