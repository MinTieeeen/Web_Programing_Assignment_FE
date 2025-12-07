// FAQ Data
let faqData = [];

// State
let currentTopicId = null;

// DOM Elements
const topicListEl = document.getElementById('topic-list');
const dynamicContentEl = document.getElementById('faq-dynamic-content');
const searchInput = document.getElementById('faq-search');
const searchResults = document.getElementById('search-results');

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
    await fetchFaqData();
    if (faqData.length > 0) {
        setupSearch();
        // Default to first topic
        if (!currentTopicId && faqData[0]) {
            switchTopic(faqData[0].id);
        }
    }
});

async function fetchFaqData() {
    try {
        const response = await fetch(`${window.ENV.API_URL}/faqs`);
        const result = await response.json();
        if (result.status === 'success') {
            faqData = result.data;
            renderSidebar();
        }
    } catch (error) {
        console.error('Error fetching FAQs:', error);
        if(dynamicContentEl) dynamicContentEl.innerHTML = '<p class="text-danger">Không thể tải dữ liệu FAQ.</p>';
    }
}

// ------------------- SIDEBAR LOGIC -------------------
function renderSidebar() {
    if (!topicListEl) return;
    
    topicListEl.innerHTML = faqData.map(topic => `
        <li class="topic-item">
            <button class="topic-link ${topic.id === currentTopicId ? 'active' : ''}" 
                    onclick="switchTopic('${topic.id}')">
                <i class="bi ${topic.icon} topic-icon"></i>
                ${topic.name}
            </button>
        </li>
    `).join('');
}

function switchTopic(topicId) {
    currentTopicId = topicId;
    renderSidebar(); // Re-render to update active state
    renderTopicQuestions(topicId);
}

// ------------------- CONTENT LOGIC -------------------

// Render List of Questions for a Topic
function renderTopicQuestions(topicId) {
    if (!dynamicContentEl) return;
    
    const topic = faqData.find(t => t.id === topicId);
    if (!topic) return;

    dynamicContentEl.innerHTML = `
        <div class="animation-fade-in">
            <h2 class="question-group-title">${topic.name}</h2>
            
            <div class="faq-list">
                ${topic.questions.map(q => `
                    <div class="faq-question-item" onclick="showDetail(${q.id})">
                        <i class="bi bi-file-text me-3 text-primary"></i>
                        <span class="faq-question-text">${q.title}</span>
                        <i class="bi bi-chevron-right faq-question-arrow"></i>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

// Render Detail View
function showDetail(questionId) {
    if (!dynamicContentEl) return;
    
    // Find question and its topic
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

    // Update Sidebar to show we are in this topic
    if (currentTopicId !== topic.id) {
        currentTopicId = topic.id;
        renderSidebar();
    }

    // Related questions (Random 3 from same topic excluding current)
    const related = topic.questions
        .filter(q => q.id != question.id)
        .slice(0, 3);

    dynamicContentEl.innerHTML = `
        <div class="animation-fade-up">
            <a href="#" class="back-btn" onclick="renderTopicQuestions('${topic.id}'); return false;">
                <i class="bi bi-arrow-left me-2"></i> Quay lại ${topic.name}
            </a>
            
            <div class="faq-detail-card">
                <h1 class="faq-detail-title">${question.title}</h1>
                <div class="faq-detail-content">
                    ${question.answer}
                </div>
            </div>

            ${related.length > 0 ? `
                <div class="related-section">
                    <h3 class="related-title">
                        <i class="bi bi-stars text-warning"></i> Câu hỏi liên quan
                    </h3>
                    <div class="faq-list">
                        ${related.map(q => `
                            <div class="faq-question-item" onclick="showDetail(${q.id})">
                                <span class="faq-question-text">${q.title}</span>
                                <i class="bi bi-arrow-right-short faq-question-arrow"></i>
                            </div>
                        `).join('')}
                    </div>
                </div>
            ` : ''}
        </div>
    `;
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ------------------- SEARCH LOGIC -------------------
function setupSearch() {
    let debounceTimer;
    
    if (!searchInput) return;

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
    
    // Hide when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.faq-search-wrapper') && searchResults) {
            searchResults.classList.remove('active');
        }
    });

    searchInput.addEventListener('focus', () => {
         if (searchInput.value.length >= 2) searchResults.classList.add('active');
    });
}

function searchFaqs(query) {
    const results = [];
    for (const topic of faqData) {
        for (const q of topic.questions) {
            if (q.title.toLowerCase().includes(query) || q.answer.toLowerCase().includes(query)) {
                results.push({ ...q, topicName: topic.name });
            }
        }
    }
    return results.slice(0, 6);
}

function renderSearchResults(results) {
    if (!searchResults) return;

    if (results.length === 0) {
        searchResults.innerHTML = '<div class="faq-search-item text-muted">Không tìm thấy kết quả</div>';
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

// Make globally available
window.showDetail = showDetail;
window.switchTopic = switchTopic;
window.renderTopicQuestions = renderTopicQuestions;
