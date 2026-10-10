function renderSidebar(){
  const el=document.getElementById('sidebar'); if(!el) return;
  const a=el.dataset.active, d='dashboard', t=['tentang','ℹ️','Tentang Aplikasi'];
  let R={
    siswa:['Aryawangi','Siswa X TKJ 2','👨‍🎓',[[d,'📊','Dashboard'],['materi','📖','Materi'],['proyek','📋','Proyek'],['nilai','🏆','Nilai'],t]],
    guru:['Bapak Wahyu','Guru DPK TKJ','👨‍🏫',[[d,'📊','Dashboard'],['materi','📖','Materi'],['proyek','📋','Proyek'],['penilaian','✅','Penilaian'],t]],
    admin:['Administrator','Pengelola sistem','🛠️',[[d,'📊','Dashboard'],['guru','👨‍🏫','Data Guru'],['kelas','🏫','Data Kelas'],['siswa','👨‍🎓','Data Siswa'],['materi','📖','Materi'],['proyek','📋','Proyek'],t]]
  }[el.dataset.role||'siswa'];
  if(!el.dataset.role&&sessionStorage.getItem('kelompok')==='kontrol')R=['Dewi Lestari','Siswa X TKJ 1 · Kontrol','👨‍🎓',[['tes','📝','Tes'],['nilai','🏆','Nilai'],t]];
  el.className='w-64 bg-gradient-to-br from-blue-600 to-indigo-700 text-white min-h-screen p-6 hidden md:block';
  el.innerHTML=`<div class="text-center mb-8"><div class="w-16 h-16 bg-white rounded-full mx-auto mb-3 flex items-center justify-center text-2xl shadow-lg">${R[2]}</div><h3 class="font-semibold text-lg">${R[0]}</h3><p class="text-sm opacity-75">${R[1]}</p></div><nav class="space-y-2">`+
  R[3].map(i=>`<a href="${i[0]}.html" class="flex items-center space-x-3 p-3 rounded-lg ${i[0]===a?'bg-white bg-opacity-20 shadow-inner':'hover:bg-white hover:bg-opacity-10'} transition"><span>${i[1]}</span><span>${i[2]}</span></a>`).join('')+
  '<a href="../index.html" class="flex items-center space-x-3 p-3 rounded-lg hover:bg-white hover:bg-opacity-10 transition"><span>🚪</span><span>Logout</span></a></nav>';
}
function handleLogin(e){
  e.preventDefault();
  const u=e.target.querySelector('input[type=text]').value.toLowerCase();
  const b=e.target.querySelector('button'); b.innerText='Memproses...';
  const to=u.startsWith('admin')?'admin/dashboard.html':u.startsWith('guru')?'guru/dashboard.html':u.startsWith('kontrol')?'siswa/tes.html':'siswa/dashboard.html';
  sessionStorage.setItem('kelompok',u.startsWith('kontrol')?'kontrol':'eksperimen');
  setTimeout(()=>location.href=to,600);
}
function checkQuiz(){
  const s=document.querySelector('input[name=quiz]:checked'), r=document.getElementById('quizResult');
  r.classList.remove('hidden');
  if(!s){r.className='mt-4 p-4 rounded-lg bg-yellow-50 text-yellow-700 text-sm';r.textContent='Pilih satu jawaban dulu.';return;}
  const ok=s.value==='b';
  r.className='mt-4 p-4 rounded-lg text-sm '+(ok?'bg-green-50 text-green-700':'bg-red-50 text-red-700');
  r.textContent=ok?'Benar! digitalRead(pin) dipakai untuk membaca input digital.':'Belum tepat. Coba ingat lagi fungsi untuk membaca sensor.';
}
function handleSubmit(e){
  e.preventDefault();
  const b=e.target.querySelector('button'); b.innerText='Mengirim...';
  setTimeout(()=>{b.innerText='Terkirim';b.disabled=true;b.classList.replace('bg-blue-600','bg-green-600');
  document.getElementById('status').textContent='Menunggu Penilaian';alert('Tugas terkirim. Status: Menunggu Penilaian.');},800);
}
renderSidebar();
const TAHAP=['Orientasi masalah','Perencanaan proyek','Pelaksanaan proyek','Monitoring proyek','Presentasi dan evaluasi'];
const CFG={
 materi:{title:'Kelola materi',desc:'Tambah, ubah, atau hapus materi pembelajaran',warn:'Hapus materi ini secara permanen?',
  fields:[{k:'judul',l:'Judul materi'},{k:'pert',l:'Pertemuan',t:'number'},{k:'tahap',l:'Tahap PjBL',opts:TAHAP},{k:'lvl',l:'Level kognitif',opts:['C1-C2','C3-C4','C4-C6']}],
  rows:[{judul:'Pengenalan Mikrokontroler',pert:1,tahap:TAHAP[0],lvl:'C1-C2'},{judul:'Input dan Output Digital',pert:5,tahap:TAHAP[2],lvl:'C3-C4'}]},
 proyek:{title:'Kelola proyek',desc:'Atur proyek PjBL dan batas waktu pengumpulan',warn:'Hapus proyek ini? Jika sudah ada submission siswa, data tersebut ikut terhapus.',
  fields:[{k:'judul',l:'Judul proyek'},{k:'batas',l:'Batas waktu',t:'date'},{k:'desk',l:'Deskripsi dan kebutuhan alat',t:'textarea'}],
  rows:[{judul:'Smart Home Controller',batas:'2026-12-25',desk:'Kendali lampu otomatis. Alat: Arduino Uno, sensor, relay, LED.'}]},
 guru:{title:'Data guru',desc:'Kelola akun guru',msg:'Akun dibuat. Username dan password awal dibuat otomatis.',warn:'Hapus akun guru ini? Pastikan tidak ada kelas, materi, atau proyek aktif yang terkait.',
  fields:[{k:'nama',l:'Nama'},{k:'nip',l:'NIP'},{k:'email',l:'Email',t:'email'},{k:'mapel',l:'Mata pelajaran'}],
  rows:[{nama:'Wahyu',nip:'198000000000000000',email:'wahyu@sekolah.sch.id',mapel:'DPK TKJ'}]},
 siswa:{title:'Data siswa',desc:'Kelola akun peserta didik',msg:'Akun dibuat. Username dan password awal dibuat otomatis.',warn:'Hapus akun siswa ini? Jawaban kuis, submission, dan nilainya ikut terhapus.',
  fields:[{k:'nama',l:'Nama'},{k:'nis',l:'NIS'},{k:'kelas',l:'Kelas',opts:['X TKJ 1','X TKJ 2']}],
  rows:[{nama:'Aryawangi',nis:'2024001',kelas:'X TKJ 2'},{nama:'Budi Santoso',nis:'2024002',kelas:'X TKJ 2'}]}
};
function renderCrud(id,c){
 const el=document.getElementById(id), rows=c.rows, today=new Date().toISOString().slice(0,10); let ed=-1;
 const inp=f=>f.t==='toggle'?`<label class="flex items-center gap-2 pt-1"><input type="checkbox" name="${f.k}" class="w-5 h-5"> ${f.tl}</label>`:f.t==='textarea'?`<textarea name="${f.k}" required rows="2" class="w-full px-3 py-2 border rounded-lg"></textarea>`:f.opts?`<select name="${f.k}" class="w-full px-3 py-2 border rounded-lg bg-white">${f.opts.map(o=>`<option>${o}</option>`).join('')}</select>`:`<input name="${f.k}" type="${f.t||'text'}" required class="w-full px-3 py-2 border rounded-lg">`;
 function draw(){
  el.innerHTML=`<div class="flex justify-between items-center mb-6"><div><h1 class="text-3xl font-bold text-gray-800">${c.title}</h1><p class="text-gray-500">${c.desc}</p></div><button id="add" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm">Tambah</button></div>
  <div id="frm" class="hidden bg-white rounded-xl shadow p-5 mb-6 max-w-3xl"><form class="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">${c.fields.map(f=>`<div class="${f.t==='textarea'?'md:col-span-2':''}"><label class="block text-xs font-bold text-gray-500 mb-1">${f.l}</label>${inp(f)}</div>`).join('')}<p id="err" class="md:col-span-2 text-red-600 text-xs"></p><div class="md:col-span-2 flex gap-2"><button class="bg-blue-600 text-white px-4 py-2 rounded-lg">Simpan</button><button type="button" id="cancel" class="px-4 py-2 border rounded-lg">Batal</button></div></form></div>
  <div class="bg-white rounded-xl shadow overflow-x-auto"><table class="w-full text-sm"><thead class="bg-gray-50 text-left text-gray-500"><tr>${c.fields.map(f=>`<th class="p-3">${f.l}</th>`).join('')}<th></th></tr></thead><tbody class="divide-y">${rows.map((r,i)=>`<tr>${c.fields.map(f=>`<td class="p-3">${r[f.k]}</td>`).join('')}<td class="p-3 text-right whitespace-nowrap"><button data-e="${i}" class="text-blue-600 mr-3">Ubah</button><button data-d="${i}" class="text-red-600">Hapus</button></td></tr>`).join('')}</tbody></table></div>`;
  const frm=el.querySelector('#frm'), form=frm.querySelector('form');
  el.querySelector('#add').onclick=()=>{ed=-1;form.reset();frm.classList.remove('hidden');};
  el.querySelector('#cancel').onclick=()=>frm.classList.add('hidden');
  el.querySelectorAll('[data-e]').forEach(b=>b.onclick=()=>{ed=+b.dataset.e;frm.classList.remove('hidden');c.fields.forEach(f=>f.t==='toggle'?form.elements[f.k].checked=rows[ed][f.k]===f.on:form.elements[f.k].value=rows[ed][f.k]);});
  el.querySelectorAll('[data-d]').forEach(b=>b.onclick=()=>{if(confirm(c.warn)){rows.splice(+b.dataset.d,1);draw();}});
  form.onsubmit=e=>{e.preventDefault();const o=Object.fromEntries(new FormData(form));c.fields.forEach(f=>{if(f.t==='toggle')o[f.k]=form.elements[f.k].checked?f.on:f.off;});
   if(c.fields.some(f=>f.t==='date'&&o[f.k]<today)){form.querySelector('#err').textContent='Batas waktu tidak boleh sebelum hari ini.';return;}
   if(ed>=0)rows[ed]=o;else{rows.push(o);if(c.msg)alert(c.msg);} draw();};
 }
 draw();
}
CFG.materi.fields[3].opts=['C1-C2','C2-C3','C3-C4','C4-C6'];
CFG.materi.rows.splice(0,CFG.materi.rows.length,
 {judul:'Pengenalan Mikrokontroler',pert:1,tahap:TAHAP[0],lvl:'C1-C2'},
 {judul:'Pengenalan Arduino Uno',pert:2,tahap:TAHAP[0],lvl:'C1-C2'},
 {judul:'Instalasi Arduino IDE',pert:3,tahap:TAHAP[0],lvl:'C2-C3'},
 {judul:'Struktur Dasar Program Arduino',pert:4,tahap:TAHAP[1],lvl:'C2-C3'},
 {judul:'Input dan Output Digital',pert:5,tahap:TAHAP[2],lvl:'C3-C4'},
 {judul:'Sensor dan Aktuator',pert:6,tahap:TAHAP[2],lvl:'C3-C4'},
 {judul:'Project Arduino Sederhana',pert:7,tahap:TAHAP[3],lvl:'C4-C6'},
 {judul:'Presentasi dan Evaluasi',pert:8,tahap:TAHAP[4],lvl:'C4-C6'});
CFG.proyek.rows.push(
 {judul:'Lampu LED Berkedip',batas:'2026-10-30',desk:'Latihan output digital. Alat: Arduino Uno, LED, resistor.'},
 {judul:'Lampu Lalu Lintas Mini',batas:'2027-01-10',desk:'Simulasi lampu lalu lintas tiga warna. Alat: Arduino Uno, 3 LED, resistor.'});
CFG.guru.rows.push(
 {nama:'Siti Rahmawati',nip:'198500000000000001',email:'siti@sekolah.sch.id',mapel:'Jaringan Dasar'},
 {nama:'Dedi Prasetyo',nip:'199000000000000002',email:'dedi@sekolah.sch.id',mapel:'Administrasi Sistem Jaringan'});
CFG.siswa.rows.push(
 {nama:'Siti Aminah',nis:'2024003',kelas:'X TKJ 2'},{nama:'Rizky Pratama',nis:'2024004',kelas:'X TKJ 2'},
 {nama:'Dewi Lestari',nis:'2024005',kelas:'X TKJ 1'},{nama:'Fajar Nugroho',nis:'2024006',kelas:'X TKJ 1'},
 {nama:'Nadia Putri',nis:'2024007',kelas:'X TKJ 1'},{nama:'Bagas Saputra',nis:'2024008',kelas:'X TKJ 2'});
CFG.kelas={title:'Data kelas',desc:'Kelola kelas dan kelompok penelitian (eksperimen atau kontrol)',warn:'Hapus kelas ini? Siswa di kelas ini akan kehilangan keterkaitan kelas.',
 fields:[{k:'nama',l:'Nama kelas'},{k:'kelompok',l:'Kelompok',opts:['Eksperimen','Kontrol']},{k:'guru',l:'Guru pengampu'},{k:'mapel',l:'Mata pelajaran'},{k:'jml',l:'Jumlah siswa',t:'number'}],
 rows:[{nama:'X TKJ 1',kelompok:'Kontrol',guru:'Wahyu',mapel:'DPK TKJ',jml:30},{nama:'X TKJ 2',kelompok:'Eksperimen',guru:'Wahyu',mapel:'DPK TKJ',jml:30}]};
CFG.siswa.fields[2].opts=['X TKJ 1 (Kontrol)','X TKJ 2 (Eksperimen)'];
CFG.siswa.rows.forEach(r=>r.kelas=r.kelas==='X TKJ 1'?'X TKJ 1 (Kontrol)':'X TKJ 2 (Eksperimen)');

CFG.kelas={title:'Data kelas',desc:'Kelola kelas sebagai pembeda kelompok belajar',warn:'Hapus kelas ini? Siswa di kelas ini akan kehilangan keterkaitan kelas.',
 fields:[{k:'nama',l:'Nama kelas'},{k:'guru',l:'Guru pengampu'},{k:'mapel',l:'Mata pelajaran'},{k:'jml',l:'Jumlah siswa',t:'number'}],
 rows:[{nama:'X TKJ 1',guru:'Wahyu',mapel:'DPK TKJ',jml:30},{nama:'X TKJ 2',guru:'Wahyu',mapel:'DPK TKJ',jml:30}]};
CFG.siswa.fields=[{k:'nama',l:'Nama'},{k:'nis',l:'NIS'},{k:'kelas',l:'Kelas',opts:['X TKJ 1','X TKJ 2']},
 {k:'kelompok',l:'Kelompok penelitian',t:'toggle',tl:'Eksperimen (akses penuh LMS). Nonaktif = Kontrol (hanya tes)',on:'Eksperimen',off:'Kontrol'}];
CFG.siswa.rows.splice(0,CFG.siswa.rows.length,
 {nama:'Aryawangi',nis:'2024001',kelas:'X TKJ 2',kelompok:'Eksperimen'},{nama:'Budi Santoso',nis:'2024002',kelas:'X TKJ 2',kelompok:'Eksperimen'},
 {nama:'Siti Aminah',nis:'2024003',kelas:'X TKJ 2',kelompok:'Eksperimen'},{nama:'Rizky Pratama',nis:'2024004',kelas:'X TKJ 2',kelompok:'Eksperimen'},
 {nama:'Dewi Lestari',nis:'2024005',kelas:'X TKJ 1',kelompok:'Kontrol'},{nama:'Fajar Nugroho',nis:'2024006',kelas:'X TKJ 1',kelompok:'Kontrol'},
 {nama:'Nadia Putri',nis:'2024007',kelas:'X TKJ 1',kelompok:'Kontrol'},{nama:'Bagas Saputra',nis:'2024008',kelas:'X TKJ 2',kelompok:'Eksperimen'});
(function(){
 const sb=document.getElementById('sidebar');
 if(!sb||sb.dataset.role||sessionStorage.getItem('kelompok')!=='kontrol') return;
 const p=location.pathname.split('/').pop().replace('.html','');
 if(!['tes','nilai','tentang'].includes(p)){location.replace('tes.html');return;}
 if(p==='nilai'){document.querySelectorAll('tbody tr').forEach(r=>{if(/Proyek|formatif|Nilai akhir/.test(r.textContent))r.remove();});document.querySelectorAll('main > div.p-5').forEach(d=>d.remove());}
})();
