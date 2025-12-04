document.addEventListener('DOMContentLoaded', async () => {
    const API_URL = window.ENV ? window.ENV.API_URL : 'http://localhost/BTL_LTW/BTL_LTW_BE';
    const carouselInner = document.getElementById('featured-carousel-inner');
    const shelvesContainer = document.getElementById('game-shelves-container');
    const searchInput = document.getElementById('global-search');
    const filterBtns = document.querySelectorAll('.filter-btn');

    let allGames = [];
    let categories = ['RPG', 'Action', 'Adventure', 'Indie', 'Simulation', 'Strategy', 'Sports', 'Horror', 'FPS', 'MOBA']; // Fallback list
    let spotlightIndex = 0; // Track current spotlight position

    // --- 1. Fetch Data ---
    console.log('Fetching games from:', API_URL);
    try {
        let response;
        try {
            response = await fetch(`${API_URL}/games`);
        } catch (e) {
            console.warn('Primary API failed, trying fallback...');
            if (window.ENV && window.ENV.API_URL_ALT) {
                response = await fetch(`${window.ENV.API_URL_ALT}/games`);
            } else {
                throw e;
            }
        }

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        
        if (data.status === 'success' && data.data) {
            allGames = data.data.map(game => normalizeGameData(game));
            initPage();
        } else {
            throw new Error('Invalid data format');
        }
    } catch (error) {
        console.error('Error fetching games:', error);
        shelvesContainer.innerHTML = `
            <div class="text-center text-white mt-5">
                <h3>Không thể tải dữ liệu game.</h3>
                <p class="text-white-50">Vui lòng kiểm tra kết nối server hoặc thử lại sau.<br>
                <small>${error.message}</small></p>
            </div>`;
    }

    function normalizeGameData(game) {
        return {
            id: game.id || game.gid,
            name: game.name || game.title,
            price: Number(game.price) || 0,
            image: game.image_url || game.image || '../assets/images/default-game.jpg',
            category: game.category_name || game.category || 'Unknown',
            tags: typeof game.tags === 'string' ? game.tags.split(',') : (Array.isArray(game.tags) ? game.tags : []),
            description: game.description || 'No description available',
            rating: game.rating || 0
        };
    }

    // --- 2. Initialize Page ---
    function initPage() {
        renderFeaturedCarousel();
        renderShelves();
        setupSearch();
        setupFilters();
    }

    // --- 3. Render Featured Carousel (Hero) ---
    function renderFeaturedCarousel() {
        // Pick 5 random games for featured
        const featuredGames = [...allGames].sort(() => 0.5 - Math.random()).slice(0, 5);
        
        // Use the new hero-carousel ID
        const heroContainer = document.getElementById('hero-carousel');
        if (!heroContainer) return;

        // Generate Slides (Split Layout)
        const slidesHtml = featuredGames.map((game, index) => `
            <div class="carousel-item ${index === 0 ? 'active' : ''}">
                <div class="featured-item-content">
                    <div class="featured-img-col">
                        <img src="${game.image}" class="featured-main-img" alt="${game.name}" onerror="this.src='../assets/images/default-game.jpg'">
                    </div>
                    <div class="featured-info-col">
                        <h2 class="featured-game-title">${game.name}</h2>
                        <div class="featured-game-meta">
                            ${game.tags.slice(0, 3).map(tag => `<span class="featured-tag">${tag}</span>`).join('')}
                        </div>
                        <p class="featured-desc">${game.description}</p>
                        <span class="featured-price">${game.price === 0 ? 'Miễn phí' : new Intl.NumberFormat('vi-VN').format(game.price) + ' đ'}</span>
                        <a href="detail.html?id=${game.id}" class="btn-featured-buy">
                            <i class="bi bi-cart-plus"></i> Xem chi tiết
                        </a>
                    </div>
                </div>
            </div>
        `).join('');

        heroContainer.innerHTML = `
            <div class="container">
                <h2 class="section-title">Nổi bật & Đề xuất</h2>
                <div id="heroCarouselFade" class="carousel slide carousel-fade" data-bs-ride="carousel" data-bs-interval="5000">
                    <div class="carousel-inner">
                        ${slidesHtml}
                    </div>
                    <button class="carousel-control-prev hero-control-prev" type="button" data-bs-target="#heroCarouselFade" data-bs-slide="prev">
                        <i class="bi bi-chevron-left"></i>
                    </button>
                    <button class="carousel-control-next hero-control-next" type="button" data-bs-target="#heroCarouselFade" data-bs-slide="next">
                        <i class="bi bi-chevron-right"></i>
                    </button>
                </div>
            </div>
        `;
    }

    // --- 4. Render Shelves & Sections ---

    function renderShelves() {
        shelvesContainer.innerHTML = ''; // Clear existing

        // Shuffle allGames for randomness
        allGames.sort(() => Math.random() - 0.5);

        // 1. Spotlight Section: New Releases (Bento Grid)
        renderSpotlightShelf('Mới phát hành');

        // 2. Standard Shelves
        const categoryTitles = {
            'Action': 'Hành động kịch tính',
            'RPG': 'Nhập vai lôi cuốn',
            'Adventure': 'Phiêu lưu kỳ thú',
            'Indie': 'Indie độc đáo',
            'Strategy': 'Chiến thuật đỉnh cao',
            'Sports': 'Thể thao sôi động',
            'Simulation': 'Mô phỏng chân thực',
            'Horror': 'Kinh dị rùng rợn'
        };

        const categories = [...new Set(allGames.map(g => g.category))].filter(c => c && c !== 'Unknown').slice(0, 3);
        categories.forEach(cat => {
            const games = allGames.filter(g => g.category === cat).slice(0, 5);
            const displayTitle = categoryTitles[cat] || cat; // Use mapped title or original
            if (games.length > 0) renderShelf(displayTitle, games);
        });
    }

    function renderSpotlightShelf(title) {
        // Get 5 games based on current index
        const totalGames = allGames.length;
        const gamesToShow = [];
        for (let i = 0; i < 5; i++) {
            gamesToShow.push(allGames[(spotlightIndex + i) % totalGames]);
        }

        const mainGame = gamesToShow[0];
        const sideGames = gamesToShow.slice(1, 5);

        // Check if section already exists to update content only
        let section = document.getElementById('spotlight-section');
        if (!section) {
            section = document.createElement('section');
            section.id = 'spotlight-section';
            section.className = 'spotlight-section container';
            shelvesContainer.appendChild(section);
        }
        
        section.innerHTML = `
            <div class="spotlight-header">
                <h3 class="spotlight-title">${title}</h3>
                <div class="spotlight-nav">
                    <button class="spotlight-nav-btn" id="spotlight-prev"><i class="bi bi-chevron-left"></i></button>
                    <button class="spotlight-nav-btn" id="spotlight-next"><i class="bi bi-chevron-right"></i></button>
                </div>
            </div>
            
            <div class="bento-grid fade-in-animation">
                <!-- Main Card (Left) -->
                <div class="bento-main" onclick="window.location.href='detail.html?id=${mainGame.id}'">
                    <img src="${mainGame.image}" class="bento-main-img" alt="${mainGame.name}" onerror="this.src='../assets/images/default-game.jpg'">
                    <div class="bento-main-overlay">
                        <div class="bento-main-meta">
                            <span class="bento-tag">${mainGame.category}</span>
                            <span class="bento-tag">${mainGame.tags[0] || 'Hot'}</span>
                        </div>
                        <h3 class="bento-main-title">${mainGame.name}</h3>
                        <p class="bento-main-desc">${mainGame.description}</p>
                        <div class="bento-main-footer">
                            <span class="bento-price">${mainGame.price === 0 ? 'Miễn phí' : new Intl.NumberFormat('vi-VN').format(mainGame.price) + 'đ'}</span>
                            <span class="btn-bento-action">Xem ngay</span>
                        </div>
                    </div>
                </div>

                <!-- Side Grid (Right) -->
                <div class="bento-side">
                    ${sideGames.map(game => `
                        <div class="bento-item" onclick="window.location.href='detail.html?id=${game.id}'">
                            <img src="${game.image}" class="bento-item-img" alt="${game.name}" onerror="this.src='../assets/images/default-game.jpg'">
                            <div class="bento-item-overlay">
                                <h4 class="bento-item-title">${game.name}</h4>
                                <span class="bento-item-price">${game.price === 0 ? 'Miễn phí' : new Intl.NumberFormat('vi-VN').format(game.price) + 'đ'}</span>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        // Attach Event Listeners with Animation
        const prevBtn = document.getElementById('spotlight-prev');
        const nextBtn = document.getElementById('spotlight-next');
        const gridContainer = section.querySelector('.bento-grid');

        const handleNav = (direction) => {
            // 1. Add fade-out class
            gridContainer.classList.remove('fade-in-animation');
            gridContainer.classList.add('fade-out-animation');

            // 2. Wait for animation to finish (300ms matches CSS)
            setTimeout(() => {
                // 3. Update Index
                if (direction === 'next') {
                    spotlightIndex = (spotlightIndex + 5) % totalGames;
                } else {
                    spotlightIndex = (spotlightIndex - 5 + totalGames) % totalGames;
                }
                
                // 4. Re-render (this will create new DOM with fade-in-animation class)
                renderSpotlightShelf(title);
            }, 300);
        };

        prevBtn.addEventListener('click', () => handleNav('prev'));
        nextBtn.addEventListener('click', () => handleNav('next'));
    }

    function createSideGridCard(game) {
        return `
            <div class="side-grid-card" onclick="window.location.href='detail.html?id=${game.id}'">
                <img src="${game.image}" class="side-grid-img" alt="${game.name}" onerror="this.src='../assets/images/default-game.jpg'">
                <div class="side-grid-overlay">
                    <h4 class="side-grid-title">${game.name}</h4>
                    <span class="side-grid-price ${game.price === 0 ? 'free' : ''}">
                        ${game.price === 0 ? 'Miễn phí' : new Intl.NumberFormat('vi-VN').format(game.price) + ' đ'}
                    </span>
                </div>
            </div>
        `;
    }

    function renderShelf(title, games) {
        const shelfSection = document.createElement('section');
        shelfSection.className = 'game-shelf mb-5 container';
        
        shelfSection.innerHTML = `
            <div class="shelf-header">
                <h3 class="shelf-title">${title}</h3>
                <a href="#" class="view-more-link">Xem tất cả</a>
            </div>
            <div class="shelf-scroll-container">
                <div class="shelf-scroll-track" style="display: flex; gap: 20px;">
                    ${games.map(game => createShelfCard(game)).join('')}
                </div>
            </div>
        `;
        
        shelvesContainer.appendChild(shelfSection);
    }

    function createShelfCard(game) {
        return `
            <div class="game-card" style="width: 220px; flex-shrink: 0;">
                <div class="game-img-wrapper">
                    <a href="detail.html?id=${game.id}">
                        <img src="${game.image}" alt="${game.name}" class="game-img" loading="lazy" onerror="this.src='../assets/images/default-game.jpg'">
                    </a>
                    <div class="game-overlay"></div>
                </div>
                <div class="game-body">
                    <div class="game-tags">
                        <span class="game-tag">${game.category}</span>
                    </div>
                    <h3 class="game-title" title="${game.name}" style="font-size: 1rem;">
                        <a href="detail.html?id=${game.id}" class="text-white text-decoration-none">${game.name}</a>
                    </h3>
                    <div class="game-price-row">
                        <span class="game-price ${game.price === 0 ? 'free' : ''}" style="font-size: 1rem;">
                            ${game.price === 0 ? 'Miễn phí' : new Intl.NumberFormat('vi-VN').format(game.price) + ' đ'}
                        </span>
                        <a href="detail.html?id=${game.id}" class="btn-buy-card" style="padding: 4px 10px; font-size: 0.8rem;">
                            Mua
                        </a>
                    </div>
                </div>
            </div>
        `;
    }

    // Removed old renderShelf, renderBigCardShelf as they are replaced by renderSmartGrid


    // --- 5. Search & Filter Logic ---
    function setupSearch() {
        searchInput.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase();
            if (term.length < 2) {
                renderShelves(); // Reset if empty
                return;
            }

            const filtered = allGames.filter(g => g.name.toLowerCase().includes(term));
            renderSearchResults(filtered, `Kết quả tìm kiếm: "${term}"`);
        });
    }

    function setupFilters() {
        const categoryToggleBtn = document.getElementById('category-toggle-btn');
        const categoryPanel = document.getElementById('category-panel');
        const allBtn = document.querySelector('[data-filter="all"]');

        // 1. Populate Category Panel
        const uniqueCategories = [...new Set(allGames.map(g => g.category))].filter(c => c && c !== 'Unknown');
        
        // Map for display names
        const categoryTitles = {
            'Action': 'Hành động',
            'RPG': 'Nhập vai',
            'Adventure': 'Phiêu lưu',
            'Indie': 'Indie',
            'Strategy': 'Chiến thuật',
            'Sports': 'Thể thao',
            'Simulation': 'Mô phỏng',
            'Horror': 'Kinh dị',
            'FPS': 'Bắn súng',
            'MOBA': 'MOBA'
        };

        categoryPanel.innerHTML = uniqueCategories.map(cat => `
            <div class="category-tag-item" data-category="${cat}">
                ${categoryTitles[cat] || cat}
            </div>
        `).join('');

        // 2. Toggle Panel
        categoryToggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            categoryPanel.classList.toggle('active');
        });

        // Close panel when clicking outside
        document.addEventListener('click', (e) => {
            if (!categoryPanel.contains(e.target) && !categoryToggleBtn.contains(e.target)) {
                categoryPanel.classList.remove('active');
            }
        });

        // 3. Handle Category Click
        categoryPanel.querySelectorAll('.category-tag-item').forEach(item => {
            item.addEventListener('click', () => {
                const category = item.dataset.category;
                
                // Update UI
                document.querySelectorAll('.category-tag-item').forEach(i => i.classList.remove('active'));
                item.classList.add('active');
                allBtn.classList.remove('active');
                categoryToggleBtn.classList.add('active');
                categoryPanel.classList.remove('active'); // Close panel

                // Filter Games
                const filtered = allGames.filter(g => g.category === category);
                renderSearchResults(filtered, `Thể loại: ${categoryTitles[category] || category}`);
            });
        });

        // 4. Handle "All" Button
        allBtn.addEventListener('click', () => {
            renderShelves();
            allBtn.classList.add('active');
            categoryToggleBtn.classList.remove('active');
            document.querySelectorAll('.category-tag-item').forEach(i => i.classList.remove('active'));
        });
    }

    function renderSearchResults(games, title) {
        shelvesContainer.innerHTML = '';
        
        const section = document.createElement('section');
        section.className = 'container mb-5';
        section.innerHTML = `
            <h3 class="shelf-title mb-4">${title} <span class="text-muted fs-6">(${games.length} game)</span></h3>
            <div class="games-grid">
                ${games.map(game => createShelfCard(game)).join('')}
            </div>
        `;
        shelvesContainer.appendChild(section);
    }


});
