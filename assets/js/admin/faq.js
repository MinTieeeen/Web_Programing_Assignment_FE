/**
 * FAQ Management Logic
 * Connects to Backend API
 */

const API_BASE_URL = 'http://localhost/BTL_LTW/BTL_LTW_BE';
let faqs = [];

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    renderFaqs(); // Fetch and render
    initializeEventListeners();
});

function initializeEventListeners() {
    document.getElementById('searchFaq').addEventListener('input', renderFaqsTable);
}

// Fetch and Render
async function renderFaqs() {
    try {
        const response = await fetch(`${API_BASE_URL}/faqs?raw=true`);
        const result = await response.json();
        
        if (result.status === 'success') {
            faqs = result.data;
            renderStats();
            renderFaqsTable();
        } else {
            console.error('Failed to fetch FAQs:', result.message);
            Toast.error('Không thể tải danh sách câu hỏi');
        }
    } catch (error) {
        console.error('Error fetching FAQs:', error);
        Toast.error('Lỗi kết nối đến máy chủ');
    }
}

// Render Stats
function renderStats() {
    document.getElementById('totalFaqs').textContent = faqs.length;
}

// Render Table
function renderFaqsTable() {
    const tbody = document.querySelector('#faqTable tbody');
    if (!tbody) return;

    const searchTerm = document.getElementById('searchFaq').value.toLowerCase();

    const filteredFaqs = faqs.filter(faq => {
        return faq.question.toLowerCase().includes(searchTerm) || 
               faq.answer.toLowerCase().includes(searchTerm) ||
               faq.topic_name.toLowerCase().includes(searchTerm);
    });

    tbody.innerHTML = filteredFaqs.map(faq => `
        <tr>
            <td><span class="text-muted">#${faq.id}</span></td>
            <td>
                <div class="d-flex align-items-center">
                    <span class="avatar avatar-xs me-2 rounded bg-secondary-lt">
                        <i class="bi ${faq.topic_icon}"></i>
                    </span>
                    <div class="font-weight-medium text-wrap" style="max-width: 300px;">${faq.question}</div>
                </div>
                <div class="text-muted small mt-1">Chủ đề: ${faq.topic_name}</div>
            </td>
            <td>
                <div class="text-muted text-truncate" style="max-width: 400px;" title="${faq.answer}">
                    ${faq.answer}
                </div>
            </td>
            <td>
                <button class="btn btn-sm btn-outline-primary" onclick="viewFaq(${faq.id})">
                    Chỉnh sửa
                </button>
                <button class="btn btn-sm btn-outline-danger" onclick="deleteFaq(${faq.id})">
                    Xóa
                </button>
            </td>
        </tr>
    `).join('');
    
    if (filteredFaqs.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="4" class="text-center py-4">
                    <div class="empty">
                        <div class="empty-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><circle cx="12" cy="12" r="9" /><line x1="9" y1="10" x2="9.01" y2="10" /><line x1="15" y1="10" x2="15.01" y2="10" /><path d="M9.5 15.25a3.5 3.5 0 0 1 5 0" /></svg>
                        </div>
                        <p class="empty-title">Không tìm thấy câu hỏi nào</p>
                    </div>
                </td>
            </tr>
        `;
    }
}

// Helper: Toggle Custom Topic Inputs
window.toggleTopicInput = function(mode) {
    const select = document.getElementById(mode === 'add' ? 'faqTopic' : 'editFaqTopic');
    const customGroup = document.getElementById(`customTopicGroup_${mode}`);
    const inputs = customGroup.querySelectorAll('input');
    
    if (select.value.startsWith('other')) {
        customGroup.classList.remove('d-none');
        inputs.forEach(input => input.required = true);
    } else {
        customGroup.classList.add('d-none');
        inputs.forEach(input => input.required = false);
    }
}

// Save New FAQ
window.saveFaq = async function() {
    const select = document.getElementById('faqTopic');
    let topicKey, topicName, topicIcon;

    if (select.value.startsWith('other')) {
        topicKey = document.getElementById('newTopicKey_add').value;
        topicName = document.getElementById('newTopicName_add').value;
        topicIcon = document.getElementById('newTopicIcon_add').value;
        if (!topicKey || !topicName) {
            alert('Vui lòng nhập thông tin chủ đề mới.');
            return;
        }
    } else {
        [topicKey, topicName, topicIcon] = select.value.split('|');
    }

    const question = document.getElementById('faqQuestion').value;
    const answer = document.getElementById('faqAnswer').value;
    
    if (!question || !answer) {
        alert('Vui lòng điền đầy đủ câu hỏi và câu trả lời.');
        return;
    }

    const payload = {
        topic_key: topicKey,
        topic_name: topicName,
        topic_icon: topicIcon,
        question: question,
        answer: answer
    };

    try {
        const response = await fetch(`${API_BASE_URL}/admin/faqs`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });
        const result = await response.json();

        if (result.status === 'success') {
            Toast.success('Thêm câu hỏi thành công');
            const modal = bootstrap.Modal.getInstance(document.getElementById('addFaqModal'));
            modal.hide();
            document.getElementById('addFaqForm').reset();
            renderFaqs(); // Refresh list
        } else {
            Toast.error('Lỗi: ' + result.message);
        }
    } catch (error) {
        console.error('Error saving FAQ:', error);
        Toast.error('Có lỗi xảy ra khi lưu dữ liệu.');
    }
}

// View FAQ for Editing
window.viewFaq = function(id) {
    const faq = faqs.find(f => f.id == id);
    if (!faq) {
        console.error('FAQ not found with id:', id);
        return;
    }
    
    document.getElementById('editFaqId').value = faq.id;
    document.getElementById('editFaqQuestion').value = faq.question;
    document.getElementById('editFaqAnswer').value = faq.answer;
    
    // Set topic
    const select = document.getElementById('editFaqTopic');
    const knownOption = Array.from(select.options).find(opt => opt.value.startsWith(faq.topic_key));
    
    if (knownOption) {
        select.value = knownOption.value;
        toggleTopicInput('edit');
    } else {
        select.value = 'other|Khác|bi-question-circle';
        toggleTopicInput('edit');
        document.getElementById('newTopicKey_edit').value = faq.topic_key;
        document.getElementById('newTopicName_edit').value = faq.topic_name;
        document.getElementById('newTopicIcon_edit').value = faq.topic_icon;
    }
    
    const modal = new bootstrap.Modal(document.getElementById('editFaqModal'));
    modal.show();
}

// Update FAQ
window.updateFaq = async function() {
    const id = document.getElementById('editFaqId').value;
    const select = document.getElementById('editFaqTopic');
    let topicKey, topicName, topicIcon;

    if (select.value.startsWith('other')) {
        topicKey = document.getElementById('newTopicKey_edit').value;
        topicName = document.getElementById('newTopicName_edit').value;
        topicIcon = document.getElementById('newTopicIcon_edit').value;
    } else {
        [topicKey, topicName, topicIcon] = select.value.split('|');
    }

    const question = document.getElementById('editFaqQuestion').value;
    const answer = document.getElementById('editFaqAnswer').value;

    const payload = {
        topic_key: topicKey,
        topic_name: topicName,
        topic_icon: topicIcon,
        question: question,
        answer: answer
    };

    try {
        const response = await fetch(`${API_BASE_URL}/admin/faqs/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });
        const result = await response.json();

        if (result.status === 'success') {
            Toast.success('Cập nhật thành công');
            const modal = bootstrap.Modal.getInstance(document.getElementById('editFaqModal'));
            modal.hide();
            renderFaqs();
        } else {
            Toast.error('Lỗi: ' + result.message);
        }
    } catch (error) {
        console.error('Error updating FAQ:', error);
        Toast.error('Có lỗi xảy ra khi cập nhật.');
    }
}

// Delete FAQ
window.deleteFaq = async function(id) {
    if (!confirm('Bạn có chắc chắn muốn xóa câu hỏi này?')) return;

    try {
        const response = await fetch(`${API_BASE_URL}/admin/faqs/${id}`, {
            method: 'DELETE'
        });
        const result = await response.json();

        if (result.status === 'success') {
            Toast.success('Xóa câu hỏi thành công');
            renderFaqs();
        } else {
            Toast.error('Lỗi: ' + result.message);
        }
    } catch (error) {
        console.error('Error deleting FAQ:', error);
        Toast.error('Có lỗi xảy ra khi xóa dữ liệu.');
    }
}
