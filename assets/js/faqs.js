// FAQ Data
let faqData = [];

// State
let currentTopicId = 'general';
let currentQuestionId = null;

// DOM Elements
const topicListEl = document.getElementById('topic-list');
const faqContentEl = document.getElementById('faq-content');
const faqTitleEl = document.getElementById('faq-title');
const faqSubtitleEl = document.getElementById('faq-subtitle');

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
    await fetchFaqData();
    if (faqData.length > 0) {
        // Set default topic if general not found
        if (!faqData.find(t => t.id === 'general')) {
            currentTopicId = faqData[0].id;
        }
        renderTopics();
        renderQuestions(currentTopicId);
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
        faqContentEl.innerHTML = '<p class="text-danger">Không thể tải dữ liệu FAQ.</p>';
    }
}

// Render Topics Sidebar
function renderTopics() {
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

// Switch Topic
function switchTopic(topicId) {
    currentTopicId = topicId;
    currentQuestionId = null;
    renderTopics();
    renderQuestions(topicId);
}

// Render Questions List
function renderQuestions(topicId) {
    const topic = faqData.find(t => t.id === topicId);
    if (!topic) return;

    // Update Header
    faqTitleEl.textContent = topic.name;
    faqSubtitleEl.textContent = `Danh sách câu hỏi về ${topic.name}`;

    // Render List
    faqContentEl.innerHTML = `
        <div class="question-list">
            ${topic.questions.map(q => `
                <div class="question-card" onclick="showDetail(${q.id})">
                    <h3 class="question-title">
                        ${q.title}
                        <i class="bi bi-chevron-right question-arrow"></i>
                    </h3>
                </div>
            `).join('')}
        </div>
    `;
}

// Show Question Detail
function showDetail(questionId) {
    // Find question across all topics
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

    // Get related questions (random 3 from same topic, excluding current)
    const related = topic.questions
        .filter(q => q.id != question.id)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);

    // Render Detail View
    faqContentEl.innerHTML = `
        <div class="detail-view">
            <a href="#" class="back-btn" onclick="switchTopic('${topic.id}'); return false;">
                <i class="bi bi-arrow-left me-2"></i> Quay lại ${topic.name}
            </a>
            
            <div class="detail-card">
                <h2 class="detail-question">${question.title}</h2>
                <div class="detail-answer">
                    ${question.answer}
                </div>
                <div class="detail-meta">
                    <span><i class="bi bi-folder me-2"></i>${topic.name}</span>
                    <span><i class="bi bi-clock me-2"></i>Cập nhật: Hôm nay</span>
                </div>
            </div>

            ${related.length > 0 ? `
                <div class="related-section">
                    <h3 class="related-title">Câu hỏi liên quan</h3>
                    <div class="question-list">
                        ${related.map(q => `
                            <div class="question-card" onclick="showDetail(${q.id})">
                                <h3 class="question-title">
                                    ${q.title}
                                    <i class="bi bi-chevron-right question-arrow"></i>
                                </h3>
                            </div>
                        `).join('')}
                    </div>
                </div>
            ` : ''}
        </div>
    `;
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}
