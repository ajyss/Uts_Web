// Data storage handler
function getOrdersFromStorage() {
    return JSON.parse(localStorage.getItem('orders') || '[]');
}

function saveOrderToStorage(orders) {
    localStorage.setItem('orders', JSON.stringify(orders));
}

// Add new order to history and tracking
function addToHistory(orderData) {
    const orders = getOrdersFromStorage();
    
    // Add current date and status
    orderData.tanggalKirim = new Date().toISOString().split('T')[0];
    orderData.status = 'Pesanan Diterima';
    orderData.ekspedisi = 'JNE'; // Bisa random atau dari form
    
    // Add to orders history
    orders.unshift(orderData);
    saveOrderToStorage(orders);
    
    // Add to tracking data
    window.dataTracking[orderData.doNumber] = {
        nomorDO: orderData.doNumber,
        nama: orderData.nama,
        status: orderData.status,
        ekspedisi: orderData.ekspedisi,
        tanggalKirim: orderData.tanggalKirim,
        paket: `PKT${Math.floor(Math.random()*9000)+1000}`,
        total: window.formatRupiah(orderData.total),
        perjalanan: [
            {
                waktu: new Date().toLocaleString('id-ID'),
                keterangan: `Pesanan diterima dari ${orderData.nama}`
            }
        ]
    };
}

// Render history table
function renderHistory() {
    const tbody = document.querySelector("#tblHistory tbody");
    if (!tbody) return;

    const orders = getOrdersFromStorage();
    
    if (orders.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center text-muted">Belum ada transaksi</td></tr>';
        return;
    }

    tbody.innerHTML = '';
    orders.forEach((order, i) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${i + 1}</td>
            <td><a href="tracking.html?do=${order.doNumber}" class="btn link">${order.doNumber}</a></td>
            <td>${order.nama}</td>
            <td>${order.email}</td>
            <td>${order.metode || 'Transfer'}</td>
            <td>${new Date(order.tanggalKirim).toLocaleDateString('id-ID')}</td>
        `;
        tbody.appendChild(tr);
    });
}

// Handle parameter tracking
function initTracking() {
    const params = new URLSearchParams(window.location.search);
    const doNumber = params.get('do');
    if (doNumber && document.getElementById('searchDO')) {
        document.getElementById('searchDO').value = doNumber;
        handleTracking();
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    renderHistory();
    initTracking();
});