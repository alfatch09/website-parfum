document.addEventListener('DOMContentLoaded', function () {
    const cartContainer = document.getElementById('cart-items');
    const totalPriceEl = document.getElementById('total-amount'); // Sesuai dengan HTML
    const checkoutBtn = document.getElementById('checkout-btn');
    const selectAll = document.getElementById('select-all');
    const selectAllBtn = document.getElementById('select-all-btn');
    const deleteBtn = document.querySelector('.delete-btn'); // Tombol hapus semua
    let selectedCount = 0;
    let totalPrice = 0;

    // Fungsi untuk menampilkan item di keranjang
    function displayCartItems() {
        const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
        cartContainer.innerHTML = ''; // Kosongkan kontainer keranjang

        if (cartItems.length === 0) {
            cartContainer.innerHTML = '<p>Keranjang belanja Anda kosong.</p>';
            checkoutBtn.disabled = true;
            selectAll.checked = false;
            selectAllBtn.textContent = `Pilih Semua (0)`;
            return;
        }

        cartItems.forEach((item, index) => {
            const cartItem = document.createElement('div');
            cartItem.classList.add('cart-item');
            cartItem.innerHTML = `
                <input type="checkbox" class="item-checkbox" data-index="${index}" data-price="${item.price}">
                <img src="${item.image}" alt="${item.name}" width="50">
                <div>
                    <p>${item.name}</p>
                    <p>Rp ${item.price.toLocaleString()}</p>
                </div>
                <button class="remove-item-btn" data-index="${index}">Hapus</button>
            `;
            cartContainer.appendChild(cartItem);
        });

        updateTotal(); // Hitung total harga

        // Tambahkan event listener untuk tombol hapus
        document.querySelectorAll('.remove-item-btn').forEach(button => {
            button.addEventListener('click', function () {
                const index = parseInt(this.getAttribute('data-index'));
                removeItemFromCart(index);
            });
        });

        // Tambahkan event listener untuk checkbox
        document.querySelectorAll('.item-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', updateTotal);
        });
    }

    // Fungsi untuk menghapus item dari keranjang berdasarkan index
    function removeItemFromCart(index) {
        let cartItems = JSON.parse(localStorage.getItem('cart')) || [];
        cartItems.splice(index, 1); // Hapus item berdasarkan index
        localStorage.setItem('cart', JSON.stringify(cartItems));
        displayCartItems(); // Perbarui tampilan keranjang
    }

    // Fungsi untuk menghitung total harga
    function updateTotal() {
        let total = 0;
        let checkedItems = document.querySelectorAll('.item-checkbox:checked');
        selectedCount = checkedItems.length;
        
        checkedItems.forEach(item => {
            total += parseInt(item.getAttribute('data-price'));
        });

        totalPrice = total;
        totalPriceEl.textContent = `Rp ${totalPrice.toLocaleString()}`;
        checkoutBtn.disabled = selectedCount === 0;
        selectAllBtn.textContent = `Pilih Semua (${selectedCount})`;

        // Perbarui status checkbox "Pilih Semua"
        let allChecked = document.querySelectorAll('.item-checkbox').length === selectedCount;
        selectAll.checked = allChecked;
    }

    // Fungsi untuk memilih semua checkbox
    selectAll.addEventListener('change', function () {
        document.querySelectorAll('.item-checkbox').forEach(checkbox => {
            checkbox.checked = selectAll.checked;
        });
        updateTotal();
    });

    // Fungsi untuk menghapus item yang dipilih
    deleteBtn.addEventListener('click', function () {
        let cartItems = JSON.parse(localStorage.getItem('cart')) || [];
        let remainingItems = cartItems.filter((item, index) => {
            return !document.querySelector(`.item-checkbox[data-index="${index}"]`).checked;
        });

        localStorage.setItem('cart', JSON.stringify(remainingItems));
        displayCartItems();
    });

    // Fungsi untuk checkout
    checkoutBtn.addEventListener('click', function () {
        if (selectedCount > 0) {
            alert("Checkout berhasil!");
            // Hapus hanya item yang terpilih dari localStorage
            let cartItems = JSON.parse(localStorage.getItem('cart')) || [];
            let remainingItems = cartItems.filter((item, index) => {
                return !document.querySelector(`.item-checkbox[data-index="${index}"]`).checked;
            });

            localStorage.setItem('cart', JSON.stringify(remainingItems));
            displayCartItems();
        } else {
            alert("Pilih minimal satu produk untuk checkout.");
        }
    });

    // Hamburger menu functionality
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    // Tampilkan item saat halaman dimuat
    displayCartItems();
});
