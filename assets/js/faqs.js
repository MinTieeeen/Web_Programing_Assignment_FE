// FAQ Data
const faqData = [
    {
        id: 'general',
        name: 'Chung',
        icon: 'bi-info-circle',
        questions: [
            {
                id: 1,
                title: 'NextPlay là gì?',
                answer: 'NextPlay là nền tảng phân phối game trực tuyến hàng đầu, nơi bạn có thể tìm thấy hàng ngàn tựa game hấp dẫn từ các nhà phát hành nổi tiếng trên thế giới. Chúng tôi cung cấp trải nghiệm mua sắm an toàn, nhanh chóng và tiện lợi.'
            },
            {
                id: 2,
                title: 'Làm thế nào để tạo tài khoản?',
                answer: 'Để tạo tài khoản, bạn chỉ cần nhấp vào nút "Đăng ký" ở góc trên bên phải màn hình. Điền đầy đủ thông tin yêu cầu như tên đăng nhập, email và mật khẩu. Sau khi đăng ký, bạn có thể đăng nhập và bắt đầu sử dụng dịch vụ ngay lập tức.'
            },
            {
                id: 3,
                title: 'NextPlay có miễn phí không?',
                answer: 'Việc tạo tài khoản và duyệt web trên NextPlay là hoàn toàn miễn phí. Tuy nhiên, để tải và chơi các tựa game trả phí, bạn cần phải mua chúng. Chúng tôi cũng cung cấp nhiều tựa game miễn phí (Free-to-Play) để bạn trải nghiệm.'
            }
        ]
    },
    {
        id: 'account',
        name: 'Tài khoản & Bảo mật',
        icon: 'bi-shield-lock',
        questions: [
            {
                id: 4,
                title: 'Tôi quên mật khẩu, phải làm sao?',
                answer: 'Đừng lo lắng! Bạn có thể nhấp vào liên kết "Quên mật khẩu" tại trang đăng nhập. Nhập email đã đăng ký và chúng tôi sẽ gửi hướng dẫn đặt lại mật khẩu cho bạn.'
            },
            {
                id: 5,
                title: 'Làm thế nào để đổi mật khẩu?',
                answer: 'Sau khi đăng nhập, hãy truy cập vào trang "Hồ sơ cá nhân". Tại đó, bạn sẽ tìm thấy tùy chọn "Đổi mật khẩu". Bạn cần nhập mật khẩu hiện tại và mật khẩu mới để hoàn tất quá trình.'
            },
            {
                id: 6,
                title: 'Tài khoản của tôi có được bảo mật không?',
                answer: 'Chúng tôi cam kết bảo mật thông tin cá nhân của bạn. NextPlay sử dụng các công nghệ mã hóa tiên tiến để bảo vệ dữ liệu người dùng. Chúng tôi không bao giờ chia sẻ thông tin của bạn với bên thứ ba trái phép.'
            }
        ]
    },
    {
        id: 'payment',
        name: 'Thanh toán',
        icon: 'bi-credit-card',
        questions: [
            {
                id: 7,
                title: 'NextPlay chấp nhận những phương thức thanh toán nào?',
                answer: 'Hiện tại, chúng tôi hỗ trợ thanh toán qua thẻ tín dụng/ghi nợ (Visa, Mastercard), ví điện tử (Momo, ZaloPay) và chuyển khoản ngân hàng. Hệ thống nạp tiền của chúng tôi hoạt động 24/7.'
            },
            {
                id: 8,
                title: 'Làm sao để nạp tiền vào tài khoản?',
                answer: 'Truy cập vào trang "Hồ sơ cá nhân" và chọn nút "Nạp tiền". Chọn phương thức thanh toán mong muốn và nhập số tiền. Số dư sẽ được cập nhật ngay sau khi giao dịch thành công.'
            },
            {
                id: 9,
                title: 'Tôi có thể hoàn tiền không?',
                answer: 'Chính sách hoàn tiền của chúng tôi cho phép hoàn tiền trong vòng 14 ngày kể từ ngày mua nếu bạn chơi chưa quá 2 giờ. Vui lòng liên hệ bộ phận hỗ trợ để được giải quyết.'
            }
        ]
    },
    {
        id: 'technical',
        name: 'Kỹ thuật & Cài đặt',
        icon: 'bi-pc-display',
        questions: [
            {
                id: 10,
                title: 'Cấu hình tối thiểu để chơi game là gì?',
                answer: 'Mỗi tựa game có yêu cầu cấu hình khác nhau. Bạn có thể xem chi tiết cấu hình tối thiểu và đề nghị tại trang chi tiết của từng game.'
            },
            {
                id: 11,
                title: 'Tôi gặp lỗi khi tải game, phải làm sao?',
                answer: 'Vui lòng kiểm tra kết nối internet và dung lượng ổ cứng của bạn. Nếu vấn đề vẫn tiếp diễn, hãy thử khởi động lại ứng dụng hoặc liên hệ với đội ngũ hỗ trợ kỹ thuật của chúng tôi.'
            }
        ]
    }
];

// State
let currentTopicId = 'general';
let currentQuestionId = null;

// DOM Elements
const topicListEl = document.getElementById('topic-list');
const faqContentEl = document.getElementById('faq-content');
const faqTitleEl = document.getElementById('faq-title');
const faqSubtitleEl = document.getElementById('faq-subtitle');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    renderTopics();
    renderQuestions(currentTopicId);
});

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
        const q = t.questions.find(item => item.id === questionId);
        if (q) {
            question = q;
            topic = t;
            break;
        }
    }

    if (!question) return;

    // Get related questions (random 3 from same topic, excluding current)
    const related = topic.questions
        .filter(q => q.id !== question.id)
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
