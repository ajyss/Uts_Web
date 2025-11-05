// Login validasi
function initLogin() {
  const form = document.getElementById('loginForm');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const email = form.email.value.trim();
    const password = form.password.value.trim();
    const user = dataPengguna.find(u => u.email === email && u.password === password);
    if (user) {
      alert(`Selamat datang, ${user.nama}!`);
      localStorage.setItem('loggedUser', JSON.stringify(user));
      window.location.href = 'dashboard.html';
    } else {
      alert('Email atau password salah');
    }
  });
}

// Greeting di dashboard
function initDashboard() {
  const greetingEl = document.getElementById('greeting');
  if (!greetingEl) return;
  const user = JSON.parse(localStorage.getItem('loggedUser'));
  if (!user) {
    alert('Silakan login terlebih dahulu');
    window.location.href = 'login.html';
    return;
  }
  const hour = new Date().getHours();
  let greeting = 'Selamat Sore';
  if (hour < 12) greeting = 'Selamat Pagi';
  else if (hour < 18) greeting = 'Selamat Siang';
  greetingEl.textContent = `${greeting}, ${user.nama}!`;
}

// Menampilkan katalog buku di stok.html
function initStok() {
  const tbody = document.getElementById('katalogBody');
  if (!tbody) return;
  dataKatalogBuku.forEach(book => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><img src="${book.cover}" alt="Cover ${book.namaBarang}" width="50" /></td>
      <td>${book.kodeBarang}</td>
      <td>${book.namaBarang}</td>
      <td>${book.jenisBarang}</td>
      <td>${book.edisi}</td>
      <td>${book.stok}</td>
      <td>${book.harga}</td>
    `;
    tbody.appendChild(tr);
  });
}

// Inisialisasi umum
document.addEventListener('DOMContentLoaded', () => {
  initLogin();
  initDashboard();
  initStok();
});