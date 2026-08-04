/* FinSense AI - Shared UI Chrome (navbar / footer), replaces base.html templating */

function renderNavbar(activePage) {
    const session = FS.getSession();
    let rightLinks = '';

    if (session && session.role === 'user') {
        const user = FS.getUser(session.user_id);
        rightLinks = `
            <li class="nav-item"><a class="nav-link" href="dashboard.html"><i class="fa-solid fa-chart-pie me-1"></i> Dashboard</a></li>
            <li class="nav-item"><a class="nav-link" href="assessment.html"><i class="fa-solid fa-clipboard-list me-1"></i> Financial Assessment</a></li>
            <li class="nav-item dropdown ms-lg-2">
                <a class="nav-link dropdown-toggle d-flex align-items-center gap-2" href="#" data-bs-toggle="dropdown">
                    <div class="stat-icon p-1 text-white fs-6" style="width: 32px; height: 32px;"><i class="fa-solid fa-user"></i></div>
                    <span>${escapeHtml(user ? user.full_name : session.user_name || 'User')}</span>
                </a>
                <ul class="dropdown-menu dropdown-menu-end glass-card border-0 shadow">
                    <li><a class="dropdown-item text-white" href="profile.html"><i class="fa-solid fa-id-card me-2 text-info"></i> My Profile</a></li>
                    <li><hr class="dropdown-divider bg-secondary"></li>
                    <li><a class="dropdown-item text-danger" href="#" onclick="doLogout(); return false;"><i class="fa-solid fa-right-from-bracket me-2"></i> Logout</a></li>
                </ul>
            </li>`;
    } else if (session && session.role === 'admin') {
        rightLinks = `
            <li class="nav-item"><a class="nav-link" href="admin.html"><i class="fa-solid fa-user-shield me-1"></i> Admin Panel</a></li>
            <li class="nav-item ms-lg-2">
                <a class="btn btn-outline-danger btn-sm px-3" href="#" onclick="doLogout(); return false;"><i class="fa-solid fa-right-from-bracket me-1"></i> Admin Logout</a>
            </li>`;
    } else {
        rightLinks = `
            <li class="nav-item"><a class="nav-link" href="index.html#how-it-works">How It Works</a></li>
            <li class="nav-item"><a class="nav-link" href="index.html#schemes">Schemes</a></li>
            <li class="nav-item"><a class="nav-link" href="index.html#contact">Contact</a></li>
            <li class="nav-item ms-lg-3"><a class="btn btn-outline-glass px-4" href="login.html">Sign In</a></li>
            <li class="nav-item ms-lg-2"><a class="btn btn-primary-custom px-4" href="register.html">Get Started</a></li>`;
    }

    document.getElementById('app-navbar').innerHTML = `
    <nav class="navbar navbar-expand-lg glass-nav sticky-top py-3">
        <div class="container">
            <a class="navbar-brand d-flex align-items-center gap-2" href="index.html">
                <i class="fa-solid fa-brain brand-gradient fs-3"></i>
                <span>Fin<span class="brand-gradient">Sense AI</span></span>
            </a>
            <button class="navbar-toggler border-0 text-white" type="button" data-bs-toggle="collapse" data-bs-target="#navbarContent">
                <i class="fa-solid fa-bars fs-4"></i>
            </button>
            <div class="collapse navbar-collapse" id="navbarContent">
                <ul class="navbar-nav ms-auto mb-2 mb-lg-0 align-items-lg-center gap-lg-2">
                    <li class="nav-item"><a class="nav-link" href="index.html"><i class="fa-solid fa-house me-1"></i> Home</a></li>
                    ${rightLinks}
                </ul>
            </div>
        </div>
    </nav>`;
}

function renderFooter() {
    document.getElementById('app-footer').innerHTML = `
    <footer>
        <div class="container">
            <div class="row g-4 mb-4">
                <div class="col-lg-4">
                    <a class="navbar-brand d-flex align-items-center gap-2 mb-3" href="#">
                        <i class="fa-solid fa-brain brand-gradient fs-3"></i>
                        <span>Fin<span class="brand-gradient">Sense AI</span></span>
                    </a>
                    <p class="text-muted small">Intelligent Financial & Insurance Recommendation Engine based on Demography, Occupation, and Economic/Farming Cycles. Built for Smart India Hackathon (SIH1760).</p>
                </div>
                <div class="col-lg-2 col-6">
                    <h6 class="text-white mb-3">Navigation</h6>
                    <ul class="list-unstyled small">
                        <li class="mb-2"><a href="index.html">Home</a></li>
                        <li class="mb-2"><a href="login.html">User Login</a></li>
                        <li class="mb-2"><a href="register.html">Register</a></li>
                        <li class="mb-2"><a href="login.html?admin=true">Admin Portal</a></li>
                    </ul>
                </div>
                <div class="col-lg-3 col-6">
                    <h6 class="text-white mb-3">Key Modules</h6>
                    <ul class="list-unstyled small">
                        <li class="mb-2"><a href="#">Crop & Agri Loans</a></li>
                        <li class="mb-2"><a href="#">Pradhan Mantri Schemes</a></li>
                        <li class="mb-2"><a href="#">Fasal Bima Yield Insurance</a></li>
                        <li class="mb-2"><a href="#">ML Risk Score Predictor</a></li>
                    </ul>
                </div>
                <div class="col-lg-3">
                    <h6 class="text-white mb-3">Emergency & Support</h6>
                    <p class="text-muted small"><i class="fa-solid fa-headset me-2 text-cyan"></i> 1800-FIN-SENSE (Toll Free)</p>
                    <p class="text-muted small"><i class="fa-solid fa-envelope me-2 text-cyan"></i> support@finsense.ai</p>
                    <div class="d-flex gap-3 text-white fs-5 mt-3">
                        <a href="#"><i class="fa-brands fa-twitter"></i></a>
                        <a href="#"><i class="fa-brands fa-linkedin"></i></a>
                        <a href="#"><i class="fa-brands fa-github"></i></a>
                    </div>
                </div>
            </div>
            <hr class="border-secondary my-3">
            <div class="d-flex flex-column flex-md-row justify-content-between align-items-center small text-muted">
                <div>&copy; 2026 FinSense AI. Smart India Hackathon Project SIH1760. All rights reserved.</div>
                <div>Designed with Bootstrap 5 & Vanilla JavaScript</div>
            </div>
        </div>
    </footer>`;
}

function doLogout() {
    FS.logout();
    window.location.href = 'index.html';
}

function escapeHtml(str) {
    if (str === null || str === undefined) return '';
    return String(str)
        .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}

function inr(n) {
    if (n === null || n === undefined || isNaN(n)) return '—';
    return '₹' + Number(n).toLocaleString('en-IN', { maximumFractionDigits: 0 });
}

function renderChrome(activePage) {
    renderNavbar(activePage);
    renderFooter();
}
