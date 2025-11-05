// Utility
function qs(sel){return document.querySelector(sel)}
function qsa(sel){return document.querySelectorAll(sel)}

// --- AUTH / LOGIN ---
function handleLogin(e){
  e.preventDefault();
  const email = qs('#email').value.trim();
  const password = qs('#password').value.trim();
  const user = dataPengguna.find(u=>u.email===email && u.password===password);
  if(!user){
    alert('email/password yang anda masukkan salah');
    return false;
  }
  sessionStorage.setItem('currentUser', JSON.stringify(user));
  location.href = 'dashboard.html';
  return false;
}

function logout(){
  sessionStorage.removeItem('currentUser');
  location.href = 'login.html';
}

// Modal helpers
function openModal(id){
  const m = qs('#'+id);
  if(m) m.setAttribute('aria-hidden','false');
}
function closeModal(id){
  const m = qs('#'+id);
  if(m) m.setAttribute('aria-hidden','true');
}

function handleLupa(){
  const email = qs('#lupaEmail').value.trim();
  if(!email) return alert('Masukkan email');
  alert('Instruksi reset telah dikirim (simulasi) ke ' + email);
  closeModal('modalLupa');
}

function handleDaftar(){
  const nama = qs('#daftarNama').value.trim();
  const email = qs('#daftarEmail').value.trim();
  const pw = qs('#daftarPassword').value.trim();
  if(!nama||!email||!pw) return alert('Lengkapi semua field');
  // sederhana: push ke dataPengguna (runtime)
  const id = dataPengguna.length+1;
  dataPengguna.push({id,nama,email,password:pw,role:'User'});
  alert('Akun berhasil dibuat (simulasi). Silakan login.');
  closeModal('modalDaftar');
}

// --- DASHBOARD ---
function renderGreeting(){
  const now = new Date();
  const h = now.getHours();
  let s='';
  if(h<11) s='Selamat Pagi';
  else if(h<15) s='Selamat Siang';
  else s='Selamat Sore';
  const user = JSON.parse(sessionStorage.getItem('currentUser')||'null');
  qs('#greeting') && (qs('#greeting').textContent = `${s}, ${user?user.nama.split(' ')[0]:'Tamu'}`);
}

function renderSummary(){
  const totalBuku = dataKatalogBuku.length;
  const totalStok = dataKatalogBuku.reduce((a,b)=>a+b.stok,0);
  qs('#ringkasan') && (qs('#ringkasan').innerHTML = `Terdapat <strong>${totalBuku}</strong> judul buku dengan total stok <strong>${totalStok}</strong>.`);
}

// --- KATALOG / STOK ---
function populateJenisFilter(){
  const allJenis = new Set(dataKatalogBuku.map(b=>b.jenisBarang));
  const filterStok = qs('#jenisFilter');
  const filterCheckout = qs('#jenisFilterCheckout');
  
  // Clear existing options, keep 'Semua Jenis'
  if(filterStok) filterStok.querySelectorAll('option:not([value=""])').forEach(opt=>opt.remove());
  if(filterCheckout) filterCheckout.querySelectorAll('option:not([value=""])').forEach(opt=>opt.remove());

  allJenis.forEach(jenis => {
    const opt1 = document.createElement('option');
    opt1.value = jenis;
    opt1.textContent = jenis;
    if(filterStok) filterStok.appendChild(opt1.cloneNode(true));

    const opt2 = document.createElement('option');
    opt2.value = jenis;
    opt2.textContent = jenis;
    if(filterCheckout) filterCheckout.appendChild(opt2.cloneNode(true));
  });
}

function renderCatalog(targetId='catalogGrid'){
  const target = qs('#'+targetId);
  if(!target) return;
  target.innerHTML = '';

  const filterEl = targetId === 'catalogGrid' ? qs('#jenisFilter') : qs('#jenisFilterCheckout');
  const selectedJenis = filterEl ? filterEl.value : '';
  
  let filteredCatalog = dataKatalogBuku;
  if(selectedJenis) {
    filteredCatalog = dataKatalogBuku.filter(b => b.jenisBarang === selectedJenis);
  }

  filteredCatalog.forEach((b,idx)=>{
    // Cari index asli di dataKatalogBuku untuk fungsi edit/addToCart
    const originalIndex = dataKatalogBuku.findIndex(item => item.kodeBarang === b.kodeBarang);

    const div = document.createElement('div');
    div.className = 'catalog-item';
    
    // Tambahkan event click untuk Modal Detail
    div.setAttribute('onclick', `showDetail(${originalIndex}, '${targetId}')`);

    const actionButtons = targetId === 'catalogGrid' ? 
        `<button class="btn" onclick="event.stopPropagation(); editStock(${originalIndex})">Edit</button>` :
        `<button class="btn primary" onclick="event.stopPropagation(); addToCart(${originalIndex})">Beli</button>`;

    div.innerHTML = `
      <img src="${b.cover}" onerror="this.src='https://via.placeholder.com/300x200?text=Cover'" alt="${b.namaBarang}">
      <h4>${b.namaBarang}</h4>
      <p class="muted">${b.jenisBarang} • Edisi ${b.edisi}</p>
      <p>Stok: <strong>${b.stok}</strong></p>
      <p>Harga: <strong>${b.harga}</strong></p>
      <div style="display:flex;gap:.5rem;margin-top:.5rem">
        ${actionButtons}
      </div>
    `;
    target.appendChild(div);
  });
}

function showDetail(idx, callerId){
  const buku = dataKatalogBuku[idx];
  qs('#detailNama').textContent = buku.namaBarang;
  qs('#detailKode').textContent = buku.kodeBarang;
  qs('#detailJenis').textContent = buku.jenisBarang;
  qs('#detailEdisi').textContent = buku.edisi;
  qs('#detailStok').textContent = buku.stok;
  qs('#detailHarga').textContent = buku.harga;
  qs('#detailCover').src = buku.cover;
  qs('#detailCover').onerror = function(){this.src='https://via.placeholder.com/300x200?text=Cover'};

  // Tambahkan index buku ke tombol Add to Cart di modal (hanya di checkout)
  const btnCart = qs('#detailAddToCart');
  if(btnCart){
    btnCart.setAttribute('onclick', `addToCartFromModal(${idx})`);
    // Sembunyikan jika di halaman Stok (catalogGrid)
    btnCart.style.display = callerId === 'catalogForCheckout' ? 'inline-block' : 'none';
  }

  openModal('modalDetail');
}

function handleAddStock(e){
  e.preventDefault();
  const kode = qs('#newKode').value.trim();
  const nama = qs('#newNama').value.trim();
  const jenis = qs('#newJenis').value.trim();
  const edisi = qs('#newEdisi').value.trim()||'-';
  const stok = parseInt(qs('#newStok').value,10)||0;
  const harga = qs('#newHarga').value.trim();
  const cover = qs('#newCover').value.trim()||'img/placeholder.jpg';
  dataKatalogBuku.push({kodeBarang:kode,namaBarang:nama,jenisBarang:jenis,edisi:edisi,stok:stok,harga:harga,cover:cover});
  alert('Stok baru berhasil ditambahkan');
  populateJenisFilter(); // Update filter setelah tambah stok
  renderCatalog('catalogGrid');
  renderCatalog('catalogForCheckout');
  qs('#addStockForm').reset();
  return false;
}

function editStock(idx){
  const buku = dataKatalogBuku[idx];
  const newStok = prompt(`Ubah stok untuk ${buku.namaBarang}`, buku.stok);
  if(newStok!==null){
    const n = parseInt(newStok,10);
    if(!isNaN(n)) { 
      buku.stok = n; 
      renderCatalog('catalogGrid'); 
      renderCatalog('catalogForCheckout'); 
      alert('Stok berhasil diubah'); 
    }
  }
}

// --- CART / CHECKOUT ---
let cart = JSON.parse(sessionStorage.getItem('cart')||'[]');

function addToCart(idx){
  const book = dataKatalogBuku[idx];
  const found = cart.find(c=>c.kode===book.kodeBarang);
  if(found) found.qty++;
  else cart.push({kode:book.kodeBarang,nama:book.namaBarang,harga:book.harga,qty:1});
  sessionStorage.setItem('cart',JSON.stringify(cart));
  renderCart();
  alert('Buku ditambahkan ke keranjang');
}

function addToCartFromModal(idx){
    addToCart(idx);
    closeModal('modalDetail');
}


function renderCart(){
  const el = qs('#cartList');
  if(!el) return;
  el.innerHTML = '';
  if(cart.length===0){ el.innerHTML = '<p class="muted">Keranjang kosong</p>'; return }
  
  let total = 0;

  cart.forEach((c,i)=>{
    // Hapus 'Rp ' dan titik ribuan untuk perhitungan total
    const hargaBersih = parseInt(c.harga.replace('Rp ','').replace(/\./g,''));
    total += hargaBersih * c.qty;

    const div = document.createElement('div');
    div.className = 'cart-item';
    div.innerHTML = `
        <div style="flex-grow:1;margin-right:0.5rem">
            ${c.nama} <span class="muted">(${c.harga})</span> x ${c.qty}
        </div>
        <div>
            <button class="btn" onclick="dec(${i})">-</button>
            <button class="btn" onclick="inc(${i})">+</button>
        </div>
    `;
    el.appendChild(div);
  });
  
  // Tampilkan total
  const divTotal = document.createElement('div');
  divTotal.className = 'cart-item';
  divTotal.style.marginTop = '10px';
  divTotal.style.fontWeight = 'bold';
  divTotal.innerHTML = `
      <div>Total Pembelian</div>
      <div>${formatRupiah(total)}</div>
  `;
  el.appendChild(divTotal);

}
function inc(i){
  // Pastikan stok tersedia sebelum menambah
  const kode = cart[i].kode;
  const book = dataKatalogBuku.find(b => b.kodeBarang === kode);
  if (book && cart[i].qty < book.stok) {
    cart[i].qty++; 
    saveCart();
  } else {
    alert(`Stok ${book.namaBarang} hanya tersisa ${book.stok}!`);
  }
}

function dec(i){
  cart[i].qty--; 
  if(cart[i].qty<=0) cart.splice(i,1); 
  saveCart();
}

function saveCart(){
  sessionStorage.setItem('cart',JSON.stringify(cart)); 
  renderCart();
}

function clearCart(){
  cart=[];
  saveCart();
}

function handleCheckout(e){
  e.preventDefault();
  const nama = qs('#custNama').value.trim();
  const email = qs('#custEmail').value.trim();
  const alamat = qs('#custAlamat').value.trim();
  const metode = qs('#custBayar').value;
  
  if(!nama||!email||!alamat) return alert('Lengkapi data pemesan');
  if(cart.length===0) return alert('Keranjang kosong');
  
  // Hitung total
  const total = cart.reduce((sum, item) => {
    const hargaBersih = parseInt(item.harga.replace('Rp ','').replace(/\./g,''));
    return sum + (hargaBersih * item.qty);
  }, 0);

  // Generate nomor DO
  const doNum = '2023' + String(Math.floor(Math.random()*9000)+1000);

  // Kurangi stok buku
  cart.forEach(item => {
    const book = dataKatalogBuku.find(b => b.kodeBarang === item.kode);
    if(book) {
      book.stok -= item.qty;
    }
  });

  // Buat data order
  const orderData = {
    doNumber: doNum,
    nama,
    email,
    alamat,
    metode,
    items: [...cart],
    total
  };
  
  try {
    // Simpan ke history dan tracking
    addToHistory(orderData);
    
    alert(`Pemesanan berhasil!\nNomor DO: ${doNum}\nTotal: ${formatRupiah(total)}\n\nAnda akan diarahkan ke halaman tracking.`);
    clearCart();
    qs('#checkoutForm').reset();
    
    // Redirect ke tracking dengan nomor DO
    location.href = `tracking.html?do=${doNum}`;
  } catch(err) {
    console.error('Error saving order:', err);
    alert('Terjadi kesalahan saat menyimpan pesanan. Silakan coba lagi.');
  }
  
  // Perbarui tampilan katalog setelah stok berkurang
  renderCatalog('catalogGrid');
  renderCatalog('catalogForCheckout');
}

// Format Rupiah
function formatRupiah(angka){
    var reverse = angka.toString().split('').reverse().join(''),
    ribuan  = reverse.match(/\d{1,3}/g);
    ribuan  = ribuan.join('.').split('').reverse().join('');
    return 'Rp ' + ribuan;
}

// --- TRACKING ---
function handleTracking(){
  const no = qs('#searchDO').value.trim();
  const out = qs('#trackingResult');
  out.innerHTML = '';
  if(!no) return alert('Masukkan nomor DO');
  const data = getOrderByDO(no);
  if(!data) return out.innerHTML = '<p class="muted">Data tidak ditemukan untuk nomor tersebut.</p>';
  const box = document.createElement('div');
  box.innerHTML = `
    <div class="history-item">
      <div class="history-header">
        <h4>DO: ${data.doNumber}</h4>
        <span class="status">${data.tracking.status}</span>
      </div>
      <p><strong>${data.nama}</strong> • ${new Date(data.timestamp).toLocaleString()}</p>
      <p>${data.alamat}</p>
      <div class="history-items">
        ${data.items.map(item => `
          <div class="cart-item">
            <div>${item.nama} x ${item.qty}</div>
            <div>${item.harga}</div>
          </div>
        `).join('')}
      </div>
      <div class="history-total">
        <strong>Total:</strong> ${formatRupiah(data.total)}
      </div>
      <div class="history-updates">
        ${data.tracking.updates.map(update => `
          <div class="update-item">
            <div class="update-time">${new Date(update.timestamp).toLocaleString()}</div>
            <div class="update-status">${update.status}</div>
            <div class="update-detail">${update.detail}</div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
  out.appendChild(box);
}

// --- Init per halaman ---
(function init(){
  // Check auth
  const user = JSON.parse(sessionStorage.getItem('currentUser')||'null');
  if(!user && location.pathname.endsWith('login.html')===false) location.href = 'login.html';
  if(user && location.pathname.endsWith('login.html')) location.href = 'dashboard.html';

  // render greeting on dashboard if present
  try{ renderGreeting(); renderSummary(); }catch(e){}
  
  // show username on stok/checkout
  if(user){
    qs('#userName') && (qs('#userName').textContent = user.nama);
    qs('#userName2') && (qs('#userName2').textContent = user.nama);
  }

  // Init filter dan katalog
  populateJenisFilter();
  renderCatalog('catalogGrid');
  renderCatalog('catalogForCheckout');
  renderCart();
  
  // Render history jika ada
  try { renderOrderHistory(); } catch(e) {}
})();