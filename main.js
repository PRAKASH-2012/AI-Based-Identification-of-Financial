/* FinSense AI Main JS */

document.addEventListener('DOMContentLoaded', () => {
    if (typeof AOS !== 'undefined') {
        AOS.init({ duration: 800, easing: 'ease-in-out', once: true });
    }

    const toggleButtons = document.querySelectorAll('.toggle-password');
    toggleButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const targetId = btn.getAttribute('data-target');
            const input = document.getElementById(targetId);
            if (input) {
                const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
                input.setAttribute('type', type);
                btn.querySelector('i').classList.toggle('fa-eye');
                btn.querySelector('i').classList.toggle('fa-eye-slash');
            }
        });
    });
});

// Helper SweetAlert Toast
function showToast(icon, title) {
    if (typeof Swal !== 'undefined') {
        Swal.fire({
            toast: true, position: 'top-end', icon: icon, title: title,
            showConfirmButton: false, timer: 3500, background: '#0b1736', color: '#fff'
        });
    }
}

// Auto-dismiss any Bootstrap alerts injected dynamically
function flashMessage(message, category) {
    const container = document.getElementById('flash-container');
    if (!container) { showToast(category === 'error' ? 'error' : category, message); return; }
    const cls = category === 'error' ? 'danger' : category;
    const div = document.createElement('div');
    div.className = `alert alert-${cls} alert-dismissible fade show glass-card border-0 text-white d-flex align-items-center gap-2 mb-3`;
    div.innerHTML = `<i class="fa-solid fa-circle-info fs-5 text-${cls}"></i><div>${escapeHtml(message)}</div>
        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="alert"></button>`;
    container.appendChild(div);
    setTimeout(() => { try { new bootstrap.Alert(div).close(); } catch (e) { div.remove(); } }, 5000);
}
