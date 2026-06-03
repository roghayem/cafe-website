// ============================================
// WAIT FOR DOM TO LOAD
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    
    // ============================================
    // DOM ELEMENTS
    // ============================================
    let navbar = document.querySelector('.navbar');
    let searchForm = document.querySelector('.search-form');
    let cartContainer = document.querySelector('.cart-items-container');
    let menuBtn = document.querySelector('#menu-btn');
    let searchBtn = document.querySelector('#search-btn');
    let cartBtn = document.querySelector('#cart-btn');
    let closeCart = document.querySelector('.close-cart');
    
    // ============================================
    // SEARCH FUNCTIONALITY - FIXED
    // ============================================
    if (searchBtn && searchForm) {
        searchBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            searchForm.classList.toggle('active');
            if (navbar) navbar.classList.remove('active');
            if (cartContainer) cartContainer.classList.remove('active');
            
            // Focus on search input when opened
            if (searchForm.classList.contains('active')) {
                const searchInput = searchForm.querySelector('#search-box');
                if (searchInput) searchInput.focus();
            }
        });
    }
    
    // Close search when clicking outside
    document.addEventListener('click', function(e) {
        if (searchForm && searchForm.classList.contains('active')) {
            if (!searchForm.contains(e.target) && e.target !== searchBtn) {
                searchForm.classList.remove('active');
            }
        }
    });
    
    // Search functionality
    const searchBox = document.querySelector('#search-box');
    if (searchBox) {
        searchBox.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            console.log('Searching for:', searchTerm);
            // You can add product filtering here
            if (searchTerm.length > 2) {
                highlightSearchResults(searchTerm);
            } else {
                clearHighlights();
            }
        });
    }
    
    function highlightSearchResults(term) {
        const items = document.querySelectorAll('.box h3, .box p, .content h3');
        items.forEach(item => {
            const text = item.innerText.toLowerCase();
            if (text.includes(term)) {
                item.style.backgroundColor = 'rgba(238, 209, 172, 0.3)';
                item.closest('.box')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            } else {
                item.style.backgroundColor = 'transparent';
            }
        });
    }
    
    function clearHighlights() {
        const items = document.querySelectorAll('.box h3, .box p, .content h3');
        items.forEach(item => {
            item.style.backgroundColor = 'transparent';
        });
    }
    
    // ============================================
    // MENU BUTTON TOGGLE - FIXED
    // ============================================
    if (menuBtn && navbar) {
        menuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            navbar.classList.toggle('active');
            if (searchForm) searchForm.classList.remove('active');
            if (cartContainer) cartContainer.classList.remove('active');
        });
    }
    
    // ============================================
    // CART BUTTON TOGGLE - FIXED
    // ============================================
    if (cartBtn && cartContainer) {
        cartBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            cartContainer.classList.toggle('active');
            if (navbar) navbar.classList.remove('active');
            if (searchForm) searchForm.classList.remove('active');
        });
    }
    
    // ============================================
    // CLOSE CART - FIXED
    // ============================================
    if (closeCart && cartContainer) {
        closeCart.addEventListener('click', () => {
            cartContainer.classList.remove('active');
        });
    }
    
    // Close cart when clicking outside
    document.addEventListener('click', function(e) {
        if (cartContainer && cartContainer.classList.contains('active')) {
            if (!cartContainer.contains(e.target) && e.target !== cartBtn) {
                cartContainer.classList.remove('active');
            }
        }
    });
    
    // Close navbar when clicking outside
    document.addEventListener('click', function(e) {
        if (navbar && navbar.classList.contains('active')) {
            if (!navbar.contains(e.target) && e.target !== menuBtn) {
                navbar.classList.remove('active');
            }
        }
    });
    
    // ============================================
    // CLOSE MODALS ON SCROLL
    // ============================================
    window.addEventListener('scroll', () => {
        if (navbar) navbar.classList.remove('active');
        if (searchForm) searchForm.classList.remove('active');
        if (cartContainer) cartContainer.classList.remove('active');
    });
    
    // ============================================
    // ADD TO CART FUNCTIONALITY - FIXED
    // ============================================
    let cartCount = 0;
    const cartCountElement = document.querySelector('.cart-count');
    const cartItemsList = document.querySelector('.cart-items-list');
    const totalAmountElement = document.querySelector('.total-amount');
    
    // Function to update empty cart message
    function updateEmptyCartMessage() {
        const items = document.querySelectorAll('.cart-item');
        const emptyMessage = document.querySelector('.empty-cart-message');
        
        if (items.length === 0) {
            if (!emptyMessage) {
                const message = document.createElement('div');
                message.className = 'empty-cart-message';
                message.innerText = 'Your cart is empty';
                if (cartItemsList) cartItemsList.appendChild(message);
            }
        } else {
            if (emptyMessage) emptyMessage.remove();
        }
    }
    
    function addItemToCart(name, price) {
        if (!cartItemsList) return;
        
        // Remove empty message if exists
        const emptyMessage = document.querySelector('.empty-cart-message');
        if (emptyMessage) emptyMessage.remove();
        
        const cartItem = document.createElement('div');
        cartItem.classList.add('cart-item');
        cartItem.innerHTML = `
            <i class="fas fa-times remove-item"></i>
            <img src="https://placehold.co/60x60/6b4423/white?text=Coffee" alt="product">
            <div class="content">
                <h3>${name}</h3>
                <div class="price">$${parseFloat(price).toFixed(2)}</div>
            </div>
        `;
        
        cartItemsList.appendChild(cartItem);
        
        // Add remove functionality
        const removeBtn = cartItem.querySelector('.remove-item');
        removeBtn.addEventListener('click', () => {
            cartItem.remove();
            updateCartCount();
            updateTotalAmount();
            updateEmptyCartMessage();
            showNotification(`${name} removed from cart!`, 'error');
        });
        
        updateCartCount();
        updateTotalAmount();
        updateEmptyCartMessage();
    }
    
    function updateCartCount() {
        const items = document.querySelectorAll('.cart-item');
        cartCount = items.length;
        if (cartCountElement) {
            cartCountElement.innerText = cartCount;
            if (cartCount === 0) {
                cartCountElement.style.opacity = '0.5';
            } else {
                cartCountElement.style.opacity = '1';
            }
        }
    }
    
    function updateTotalAmount() {
        const items = document.querySelectorAll('.cart-item');
        let total = 0;
        items.forEach(item => {
            const priceText = item.querySelector('.price').innerText;
            const price = parseFloat(priceText.replace('$', ''));
            total += price;
        });
        if (totalAmountElement) {
            totalAmountElement.innerText = `$${total.toFixed(2)}`;
        }
    }
    
    // Add to cart buttons
    const addToCartBtns = document.querySelectorAll('.add-to-cart, .add-to-cart-icon');
    
    if (addToCartBtns.length > 0) {
        addToCartBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                let box = btn.closest('.box');
                if (!box) {
                    box = btn.closest('.box');
                }
                
                if (box) {
                    const itemNameElement = box.querySelector('h3');
                    const itemName = itemNameElement ? itemNameElement.innerText : 'Product';
                    
                    const priceElement = box.querySelector('.price');
                    let itemPrice = 15.99;
                    if (priceElement) {
                        const priceText = priceElement.innerText;
                        const match = priceText.match(/\d+\.?\d*/);
                        if (match) itemPrice = parseFloat(match[0]);
                    }
                    
                    addItemToCart(itemName, itemPrice);
                    showNotification(`${itemName} added to cart!`, 'success');
                    
                    // Open cart to show items
                    if (cartContainer) cartContainer.classList.add('active');
                    setTimeout(() => {
                        if (cartContainer) cartContainer.classList.remove('active');
                    }, 2000);
                }
            });
        });
    }
    
    // ============================================
    // NOTIFICATION FUNCTION - IMPROVED
    // ============================================
    function showNotification(message, type = 'success') {
        const existingNotification = document.querySelector('.custom-notification');
        if (existingNotification) existingNotification.remove();
        
        const notification = document.createElement('div');
        notification.className = 'custom-notification';
        const bgColor = type === 'success' ? '#4caf50' : '#ff4444';
        notification.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: ${bgColor};
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            z-index: 10000;
            animation: slideIn 0.3s ease;
            font-family: 'Poppins', sans-serif;
            font-size: 14px;
            box-shadow: 0 3px 10px rgba(0,0,0,0.2);
        `;
        notification.innerText = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 2000);
    }
    
    // ============================================
    // SMOOTH SCROLLING FOR NAVIGATION LINKS
    // ============================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href && href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    const headerOffset = 80;
                    const elementPosition = target.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                    
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                    
                    if (navbar) navbar.classList.remove('active');
                }
            }
        });
    });
    
    // ============================================
    // INITIALIZE
    // ============================================
    updateCartCount();
    updateTotalAmount();
    updateEmptyCartMessage();
    
    // Add animation styles if not exists
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            @keyframes slideOut {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
});
