const CART_STORAGE_KEY = 'nextplay_cart';

window.Cart = {
    // Get all items (Sync - LocalStorage only)
    getItems: function () {
        const cartJson = localStorage.getItem(CART_STORAGE_KEY);
        return cartJson ? JSON.parse(cartJson) : [];
    },

    // Fetch items (Async - API or LocalStorage)
    async fetchItems() {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            try {
                let apiUrl = window.API_URL || 'http://localhost/BTL_LTW/BTL_LTW_BE';
                if (apiUrl.includes(':8000')) apiUrl = 'http://localhost/BTL_LTW/BTL_LTW_BE';

                const response = await fetch(`${apiUrl}/wishlists/Cart/games`, {
                    credentials: 'include'
                });
                const result = await response.json();
                if (result.status === 'success' && result.data && result.data.games) {
                    // Map API response to cart item format
                    console.log(result.data.games);
                    return result.data.games.map(game => ({
                        id: game.Gid,
                        name: game.name,
                        price: parseFloat(game.price),
                        image: game.thumbnail || '../assets/images/game_placeholder.jpg',
                        quantity: 1
                    }));
                }
                return [];
            } catch (error) {
                console.error('Error fetching cart items:', error);
                return [];
            }
        } else {
            return this.getItems();
        }
    },

    // Save items
    saveItems: function (items) {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
        this.updateCartCount();
    },

    // Get total price
    getTotal: function () {
        const items = this.getItems();
        return items.reduce((total, item) => total + item.price, 0);
    },

    // Add item
    async addItem(game) {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            // User is logged in, use API
            try {
                let apiUrl = window.API_URL || 'http://localhost/BTL_LTW/BTL_LTW_BE';
                // if (apiUrl.includes(':8000')) apiUrl = 'http://localhost/BTL_LTW/BTL_LTW_BE';

                const response = await fetch(`${apiUrl}/wishlists/Cart/games`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ game_id: game.id }),
                    credentials: 'include'
                });
                const result = await response.json();
                if (result.status === 'success') {
                    this.updateCartCount();
                    alert('Đã thêm vào giỏ hàng (DB)!');
                } else {
                    alert('Lỗi khi thêm vào giỏ hàng: ' + result.message);
                }
            } catch (error) {
                console.error('Error adding to cart:', error);
                alert('Lỗi kết nối!');
            }
        } else {
            // Guest user
            let items = this.getItems();
            const existingItem = items.find(item => item.id === game.id);

            if (existingItem) {
                alert('Game này đã có trong giỏ hàng của bạn!');
            } else {
                items.push({
                    id: game.id,
                    name: game.name,
                    price: game.price,
                    image: game.image,
                    quantity: 1
                });
                this.saveItems(items);
                alert('Đã thêm vào giỏ hàng thành công!');
            }
        }
    },

    // Remove item from cart
    async removeItem(productId) {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            try {
                let apiUrl = window.API_URL || 'http://localhost/BTL_LTW/BTL_LTW_BE';
                if (apiUrl.includes(':8000')) apiUrl = 'http://localhost/BTL_LTW/BTL_LTW_BE';

                const response = await fetch(`${apiUrl}/wishlists/Cart/games/${productId}`, {
                    method: 'DELETE',
                    credentials: 'include'
                });
                const result = await response.json();
                if (result.status === 'success') {
                    this.updateCartCount();
                    if (window.location.pathname.includes('cart')) {
                        location.reload();
                    }
                } else {
                    alert('Lỗi khi xóa khỏi giỏ hàng: ' + result.message);
                }
            } catch (error) {
                console.error('Error removing from cart:', error);
                alert('Lỗi kết nối!');
            }
        } else {
            let items = this.getItems();
            items = items.filter(item => item.id !== productId);
            this.saveItems(items);
            if (window.location.pathname.includes('cart')) {
                location.reload();
            }
        }
    },

    // Update Header Badge
    async updateCartCount() {
        const countSpan = document.getElementById('cart-count');
        if (!countSpan) return;

        const userStr = localStorage.getItem('user');
        let count = 0;

        if (userStr) {
            try {
                let apiUrl = window.API_URL || 'http://localhost/BTL_LTW/BTL_LTW_BE';
                // if (apiUrl.includes(':8000')) apiUrl = 'http://localhost/BTL_LTW/BTL_LTW_BE';

                const response = await fetch(`${apiUrl}/wishlists/Cart/games`, {
                    credentials: 'include'
                });

                if (response.status === 401) {
                    console.warn('Session expired. Clearing local user data.');
                    localStorage.removeItem('user');
                    if (window.updateHeaderLoginStatus) {
                        window.updateHeaderLoginStatus();
                    }
                    return;
                }

                const result = await response.json();
                if (result.status === 'success' && result.data && result.data.games) {
                    count = result.data.games.length;
                }
            } catch (error) {
                console.error('Error fetching cart count:', error);
            }
        } else {
            const items = this.getItems();
            count = items.length;
        }

        countSpan.textContent = count;
        countSpan.style.display = count > 0 ? 'flex' : 'none';
    },

    // Fetch User Balance
    async fetchUserBalance() {
        const userStr = localStorage.getItem('user');
        if (!userStr) return;

        const user = JSON.parse(userStr);
        try {
            let apiUrl = window.API_URL || 'http://localhost/BTL_LTW/BTL_LTW_BE';
            // if (apiUrl.includes(':8000')) apiUrl = 'http://localhost/BTL_LTW/BTL_LTW_BE';

            const response = await fetch(`${apiUrl}/users/${user.uid}`, {
                credentials: 'include'
            });

            if (response.status === 401) {
                console.warn('Session expired (balance check). Clearing local user data.');
                localStorage.removeItem('user');
                if (window.updateHeaderLoginStatus) {
                    window.updateHeaderLoginStatus();
                }
                return;
            }

            const result = await response.json();
            if (result.status === 'success') {
                const balanceElement = document.getElementById('user-balance');
                if (balanceElement) {
                    const balance = parseFloat(result.data.balance || 0);
                    balanceElement.textContent = new Intl.NumberFormat('vi-VN').format(balance) + ' đ';
                    this.currentBalance = balance; // Store for local check if needed
                }
            }
        } catch (error) {
            console.error('Error fetching user balance:', error);
        }
    },

    // Checkout
    async checkout() {
        const userStr = localStorage.getItem('user');
        if (!userStr) {
            alert('Vui lòng đăng nhập để thanh toán!');
            window.location.href = '../auth/login.html';
            return;
        }

        if (!confirm('Bạn có chắc chắn muốn thanh toán?')) {
            return;
        }

        try {
            // 1. Get cart items to get Game IDs
            let apiUrl = window.API_URL || 'http://localhost/BTL_LTW/BTL_LTW_BE';
            // if (apiUrl.includes(':8000')) apiUrl = 'http://localhost/BTL_LTW/BTL_LTW_BE';

            const cartResponse = await fetch(`${apiUrl}/wishlists/Cart/games`, {
                credentials: 'include'
            });
            const cartResult = await cartResponse.json();

            if (cartResult.status !== 'success' || !cartResult.data || !cartResult.data.games || cartResult.data.games.length === 0) {
                alert('Giỏ hàng trống!');
                return;
            }

            const gameIds = cartResult.data.games.map(item => item.Gid);

            // 2. Call Payment API
            const response = await fetch(`${apiUrl}/payments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    wishlist_name: 'Cart',
                    game_ids: gameIds
                }),
                credentials: 'include'
            });
            const result = await response.json();

            if (result.status === 'success') {
                alert(`Thanh toán thành công!`);
                this.updateCartCount();
                if (window.location.pathname.includes('cart')) {
                    location.reload();
                }
            } else if (response.status === 402) {
                // Insufficient balance
                const needed = new Intl.NumberFormat('vi-VN').format(result.data.needed_amount) + ' đ';
                const current = new Intl.NumberFormat('vi-VN').format(result.data.current_balance) + ' đ';
                alert(`Số dư không đủ!\nSố dư hiện tại: ${current}\nCần thêm: ${needed}`);
            } else {
                alert('Thanh toán thất bại: ' + (result.message || 'Lỗi không xác định'));
            }
        } catch (error) {
            console.error('Checkout error:', error);
            alert('Lỗi kết nối khi thanh toán!');
        }
    }
};

// Initialize cart count on load
document.addEventListener('DOMContentLoaded', () => {
    if (window.Cart) {
        if (window.Cart.updateCartCount) {
            window.Cart.updateCartCount();
        }
        if (window.Cart.fetchUserBalance) {
            window.Cart.fetchUserBalance();
        }
    }
});
