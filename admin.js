/* FinSense AI Admin Panel Interactions */

document.addEventListener('DOMContentLoaded', () => {
    const userSearchInput = document.getElementById('userSearchInput');
    if (userSearchInput) {
        userSearchInput.addEventListener('keyup', () => {
            const filter = userSearchInput.value.toLowerCase();
            const rows = document.querySelectorAll('#usersTable tbody tr');
            rows.forEach(row => {
                const text = row.textContent.toLowerCase();
                row.style.display = text.includes(filter) ? '' : 'none';
            });
        });
    }
});

function confirmDeleteUser(userId, userName) {
    if (typeof Swal !== 'undefined') {
        Swal.fire({
            title: 'Delete User Account?',
            text: `Are you sure you want to delete ${userName}? This action cannot be undone.`,
            icon: 'warning', showCancelButton: true,
            confirmButtonColor: '#f43f5e', cancelButtonColor: '#64748b',
            confirmButtonText: 'Yes, Delete', background: '#0b1736', color: '#fff'
        }).then((result) => {
            if (result.isConfirmed) {
                FS.deleteUser(userId);
                FS.logActivity(null, 'User Deleted', `Admin deleted user #${userId} (${userName})`);
                renderAdminPage();
                showToast('success', 'User account deleted successfully.');
            }
        });
    } else if (confirm(`Delete user ${userName}?`)) {
        FS.deleteUser(userId);
        renderAdminPage();
    }
}

function confirmDeleteScheme(schemeId, schemeName) {
    if (typeof Swal !== 'undefined') {
        Swal.fire({
            title: 'Delete Government Scheme?',
            text: `Delete "${schemeName}"?`,
            icon: 'warning', showCancelButton: true,
            confirmButtonColor: '#f43f5e', cancelButtonColor: '#64748b',
            confirmButtonText: 'Yes, Delete', background: '#0b1736', color: '#fff'
        }).then((result) => {
            if (result.isConfirmed) {
                FS.deleteScheme(schemeId);
                renderAdminPage();
                showToast('success', 'Scheme deleted successfully.');
            }
        });
    } else if (confirm(`Delete scheme ${schemeName}?`)) {
        FS.deleteScheme(schemeId);
        renderAdminPage();
    }
}
