// FAQ Data - Steam Help Style
let faqData = [];

// State
let currentView = 'home'; // 'home', 'topic', 'detail'
let currentTopicId = null;
let currentQuestionId = null;

// DOM Elements
const categoriesEl = document.getElementById('faq-categories');
const topicViewEl = document.getElementById('faq-topic-view');
const detailViewEl = document.getElementById('faq-detail-view');
const popularEl = document.getElementById('faq-popular');
const contactEl = document.getElementById('faq-contact');
const breadcrumbEl = document.getElementById('faq-breadcrumb');
const searchInput = document.getElementById('faq-search');
const searchResults = document.getElementById('search-results');

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
    await fetchFaqData();
    if (faqData.length > 0) {
        renderHome();
        setupSearch();
    }
});

async function fetchFaqData() {
    try {
        const response = await fetch(`${window.ENV.API_URL}/faqs`);
        const result = await response.json();
        if (result.status === 'success') {
            faqData = result.data;
        }
    } catch (error) {
        console.error('Error fetching FAQs:', error);
        categoriesEl.innerHTML = '<p class="text-danger">Không thể tải dữ liệu FAQ.</p>';
    }
}

// Setup Search
function setupSearch() {
    let debounceTimer;
    
    searchInput.addEventListener('input', (e) => {
        clearTimeout(debounceTimer);
        const query = e.target.value.trim().toLowerCase();
        
        if (query.length < 2) {
            searchResults.classList.remove('active');
            return;
        }
        
        debounceTimer = setTimeout(() => {
            const results = searchFaqs(query);
            renderSearchResults(results);
        }, 300);
    });
    
    searchInput.addEventListener('focus', () => {
        if (searchInput.value.trim().length >= 2) {
            searchResults.classList.add('active');
        }
    });
    
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.faq-search-wrapper')) {
            searchResults.classList.remove('active');
        }
    });
}

function searchFaqs(query) {
    const results = [];
    
    for (const topic of faqData) {
        for (const q of topic.questions) {
            if (q.title.toLowerCase().includes(query) || 
                q.answer.toLowerCase().includes(query)) {
                results.push({
                    ...q,
                    topicId: topic.id,
                    topicName: topic.name
                });
            }
        }
    }
    
    return results.slice(0, 8);
}

function renderSearchResults(results) {
    if (results.length === 0) {
        searchResults.innerHTML = '<div class="faq-search-item"><div class="faq-search-item-title">Không tìm thấy kết quả</div></div>';
    } else {
        searchResults.innerHTML = results.map(r => `
            <div class="faq-search-item" onclick="showDetail(${r.id}); searchResults.classList.remove('active');">
                <div class="faq-search-item-title">${r.title}</div>
                <div class="faq-search-item-topic"><i class="bi bi-folder2"></i> ${r.topicName}</div>
            </div>
        `).join('');
    }
    searchResults.classList.add('active');
}

// Render Home View
function renderHome() {
    currentView = 'home';
    currentTopicId = null;
    currentQuestionId = null;
    
    // Show/hide sections
    categoriesEl.style.display = 'grid';
    topicViewEl.style.display = 'none';
    detailViewEl.style.display = 'none';
    popularEl.style.display = 'block';
    contactEl.style.display = 'block';
    
    // Breadcrumb
    breadcrumbEl.innerHTML = `
        <a href="#" onclick="goHome(); return false;">
            <i class="bi bi-house-fill"></i> Trợ giúp
        </a>
    `;
    
    // Render categories
    categoriesEl.innerHTML = faqData.map(topic => `
        <div class="faq-category-card" onclick="showTopic('${topic.id}')">
            <i class="bi ${topic.icon} faq-category-icon"></i>
            <div class="faq-category-name">${topic.name}</div>
            <div class="faq-category-count">${topic.questions.length} bài viết</div>
        </div>
    `).join('');
    
    // Render popular questions (first 5 from all topics)
    const popularQuestions = [];
    for (const topic of faqData) {
        for (const q of topic.questions.slice(0, 2)) {
            popularQuestions.push({ ...q, topicId: topic.id, topicName: topic.name });
        }
    }
    
    document.getElementById('popular-list').innerHTML = popularQuestions.slice(0, 5).map(q => `
        <div class="faq-question-item" onclick="showDetail(${q.id})">
            <i class="bi bi-file-text"></i>
            <span class="faq-question-text">${q.title}</span>
            <i class="bi bi-chevron-right faq-question-arrow"></i>
        </div>
    `).join('');
}

// Show Topic
function showTopic(topicId) {
    const topic = faqData.find(t => t.id === topicId);
    if (!topic) return;
    
    currentView = 'topic';
    currentTopicId = topicId;
    currentQuestionId = null;
    
    // Show/hide sections
    categoriesEl.style.display = 'none';
    topicViewEl.style.display = 'block';
    detailViewEl.style.display = 'none';
    popularEl.style.display = 'none';
    contactEl.style.display = 'block';
    
    // Breadcrumb
    breadcrumbEl.innerHTML = `
        <a href="#" onclick="goHome(); return false;">
            <i class="bi bi-house-fill"></i> Trợ giúp
        </a>
        <span>›</span>
        <a href="#" onclick="showTopic('${topic.id}'); return false;">${topic.name}</a>
    `;
    
    // Update header
    document.getElementById('topic-icon').className = `bi ${topic.icon} faq-topic-icon`;
    document.getElementById('topic-title').textContent = topic.name;
    document.getElementById('topic-desc').textContent = `${topic.questions.length} bài viết trong chủ đề này`;
    
    // Render questions
    document.getElementById('questions-list').innerHTML = topic.questions.map(q => `
        <div class="faq-question-item" onclick="showDetail(${q.id})">
            <i class="bi bi-file-text"></i>
            <span class="faq-question-text">${q.title}</span>
            <i class="bi bi-chevron-right faq-question-arrow"></i>
        </div>
    `).join('');
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Show Detail
function showDetail(questionId) {
    let question = null;
    let topic = null;
    
    for (const t of faqData) {
        const q = t.questions.find(item => item.id == questionId);
        if (q) {
            question = q;
            topic = t;
            break;
        }
    }
    
    if (!question) return;
    
    currentView = 'detail';
    currentQuestionId = questionId;
    currentTopicId = topic.id;
    
    // Show/hide sections
    categoriesEl.style.display = 'none';
    topicViewEl.style.display = 'none';
    detailViewEl.style.display = 'block';
    popularEl.style.display = 'none';
    contactEl.style.display = 'block';
    
    // Breadcrumb
    breadcrumbEl.innerHTML = `
        <a href="#" onclick="goHome(); return false;">
            <i class="bi bi-house-fill"></i> Trợ giúp
        </a>
        <span>›</span>
        <a href="#" onclick="showTopic('${topic.id}'); return false;">${topic.name}</a>
        <span>›</span>
        <span style="color: var(--faq-text-muted);">${question.title.substring(0, 30)}...</span>
    `;
    
    // Render article
    document.getElementById('article-title').textContent = question.title;
    document.getElementById('article-content').innerHTML = `<p>${question.answer}</p>`;
    document.getElementById('article-category').textContent = topic.name;
    
    // Related questions
    const related = topic.questions
        .filter(q => q.id != question.id)
        .slice(0, 3);
    
    if (related.length > 0) {
        document.getElementById('faq-related').style.display = 'block';
        document.getElementById('related-list').innerHTML = related.map(q => `
            <div class="faq-question-item" onclick="showDetail(${q.id})">
                <i class="bi bi-file-text"></i>
                <span class="faq-question-text">${q.title}</span>
                <i class="bi bi-chevron-right faq-question-arrow"></i>
            </div>
        `).join('');
    } else {
        document.getElementById('faq-related').style.display = 'none';
    }
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Go Home
function goHome() {
    renderHome();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}
