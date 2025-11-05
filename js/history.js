// Order History Management
let orderHistory = JSON.parse(localStorage.getItem('orderHistory') || '[]');

function addToHistory(orderData) {
  // Generate timestamp
  orderData.timestamp = new Date().toISOString();
  
  // Add status tracking
  orderData.tracking = {
    status: 'Pesanan Diterima',
    updates: [{
      timestamp: new Date().toISOString(),
      status: 'Pesanan Diterima',
      detail: 'Pesanan telah masuk ke sistem'
    }]
  };
  
  // Add to history
  orderHistory.push(orderData);
  localStorage.setItem('orderHistory', JSON.stringify(orderHistory));
}

function getOrderByDO(doNumber) {
  return orderHistory.find(order => order.doNumber === doNumber);
}

function acceptOrder(doNumber) {
  const order = getOrderByDO(doNumber);
  if (order) {
    // Update status to Sedang Diproses after accepting
    updateOrderStatus(doNumber, 'Sedang Diproses');
  }
}

function updateOrderStatus(doNumber, newStatus) {
  const order = getOrderByDO(doNumber);
  if (order) {
    // Generate detail message based on status
    let detail;
    switch(newStatus) {
      case 'Sedang Diproses':
        detail = 'Pesanan telah diterima dan sedang diproses oleh tim kami';
        break;
      case 'Dalam Pengiriman':
        detail = 'Pesanan dalam proses pengiriman ke alamat tujuan';
        break;
      case 'Selesai':
        detail = 'Pesanan telah selesai dan diterima pelanggan';
        break;
      default:
        detail = 'Status pesanan diperbarui';
    }

    order.tracking.status = newStatus;
    order.tracking.updates.push({
      timestamp: new Date().toISOString(),
      status: newStatus,
      detail: detail
    });
    
    // Save to localStorage
    localStorage.setItem('orderHistory', JSON.stringify(orderHistory));
    
    // Re-render history list
    renderOrderHistory();
    return true;
  }
  return false;
}

// Inisialisasi saat file dimuat
document.addEventListener('DOMContentLoaded', () => {
  // Load data from localStorage
  orderHistory = JSON.parse(localStorage.getItem('orderHistory') || '[]');
  // Render if we're on history page
  if (document.querySelector('#historyList')) {
    renderOrderHistory();
  }
});

function renderOrderHistory() {
  console.log('Rendering history...', orderHistory); // Debug log
  const container = document.querySelector('#historyList');
  if (!container) return;

  // Clear loading message
  container.innerHTML = '';

  if (orderHistory.length === 0) {
    container.innerHTML = '<div class="empty-state"><p>Belum ada riwayat pesanan</p></div>';
    return;
  }

  // Admin bisa update status
  const user = JSON.parse(sessionStorage.getItem('currentUser') || '{}');
  const isAdmin = user.role === 'Admin';

  // Sort by timestamp descending (newest first)
  const sortedHistory = [...orderHistory].sort((a, b) => 
    new Date(b.timestamp) - new Date(a.timestamp)
  );

  container.innerHTML = '';
  sortedHistory.forEach(order => {
    const div = document.createElement('div');
    div.className = 'history-item';
    
    // Status options untuk admin
    const statusOptions = isAdmin ? 
      order.tracking.status === 'Pesanan Diterima' ?
        `<button class="btn primary" onclick="acceptOrder('${order.doNumber}')">Terima Pesanan</button>` :
        `<select class="status-select" onchange="updateOrderStatus('${order.doNumber}', this.value)">
          <option value="Sedang Diproses" ${order.tracking.status === 'Sedang Diproses' ? 'selected' : ''}>Sedang Diproses</option>
          <option value="Dalam Pengiriman" ${order.tracking.status === 'Dalam Pengiriman' ? 'selected' : ''}>Dalam Pengiriman</option>
          <option value="Selesai" ${order.tracking.status === 'Selesai' ? 'selected' : ''}>Selesai</option>
        </select>`
      : `<span class="status">${order.tracking.status}</span>`;

    div.innerHTML = `
      <div class="history-header">
        <h4>DO: ${order.doNumber}</h4>
        ${statusOptions}
      </div>
      <p><strong>${order.nama}</strong> • ${new Date(order.timestamp).toLocaleString()}</p>
      <p>${order.alamat}</p>
      <div class="history-items">
        ${order.items.map(item => `
          <div class="cart-item">
            <div>${item.nama} x ${item.qty}</div>
            <div>${item.harga}</div>
          </div>
        `).join('')}
      </div>
      <div class="history-total">
        <strong>Total:</strong> ${formatRupiah(order.total)}
      </div>
      <div class="history-updates">
        ${order.tracking.updates.map(update => `
          <div class="update-item">
            <div class="update-time">${new Date(update.timestamp).toLocaleString()}</div>
            <div class="update-status">${update.status}</div>
            <div class="update-detail">${update.detail}</div>
          </div>
        `).join('')}
      </div>
    `;
    container.appendChild(div);
  });
}

// Format Rupiah helper
function formatRupiah(angka) {
  const reverse = angka.toString().split('').reverse().join('');
  const ribuan = reverse.match(/\d{1,3}/g);
  const formatted = ribuan.join('.').split('').reverse().join('');
  return 'Rp ' + formatted;
}