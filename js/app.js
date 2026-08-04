/* ==========================================================
   FinSense AI - Core Application Engine (Pure JavaScript)
   Replaces the original Flask + SQLite + Scikit-Learn backend.
   All data is persisted client-side in the browser's localStorage.
   ========================================================== */

const FS = (() => {

    const KEYS = {
        USERS: 'fs_users',
        ADMIN: 'fs_admin',
        SCHEMES: 'fs_schemes',
        PREDICTIONS: 'fs_predictions',
        LOGS: 'fs_activity_logs',
        CONTACTS: 'fs_contact_messages',
        SESSION: 'fs_session',
        SEEDED: 'fs_seeded_v1'
    };

    // ---------------------------------------------------------
    // Low level storage helpers
    // ---------------------------------------------------------
    function read(key, fallback) {
        try {
            const raw = localStorage.getItem(key);
            return raw ? JSON.parse(raw) : fallback;
        } catch (e) {
            return fallback;
        }
    }
    function write(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    }
    function nextId(collection) {
        return collection.reduce((max, item) => Math.max(max, item.id || 0), 0) + 1;
    }
    // Simple reversible-free obfuscation for demo passwords (NOT real security).
    function hashPassword(pw) {
        return btoa(unescape(encodeURIComponent('finsense::' + pw)));
    }
    function checkPassword(pw, hash) {
        return hashPassword(pw) === hash;
    }

    // ---------------------------------------------------------
    // Seed data (mirrors the original models_db.py seed_database())
    // ---------------------------------------------------------
    function seedIfNeeded() {
        if (read(KEYS.SEEDED, false)) return;

        if (!read(KEYS.ADMIN)) {
            write(KEYS.ADMIN, {
                username: 'admin',
                email: 'admin@finsense.ai',
                password_hash: hashPassword('admin123'),
                role: 'admin'
            });
        }

        if (!read(KEYS.USERS)) {
            write(KEYS.USERS, []);
        }

        if (!read(KEYS.SCHEMES)) {
            const schemes = [
                {
                    scheme_name: "PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)",
                    category: "Agriculture", target_occupation: "Farmer",
                    max_income_limit: 500000.0, max_land_limit: 10.0,
                    financial_benefit: "₹6,000 / year in 3 installments",
                    eligibility_criteria: "Small and marginal landholder farmers with cultivable land.",
                    description: "Direct income support scheme providing ₹6000 per year in 3 equal installments to small & marginal farmer families.",
                    official_url: "https://pmkisan.gov.in", active_status: true
                },
                {
                    scheme_name: "PMFBY (Pradhan Mantri Fasal Bima Yojana)",
                    category: "Insurance", target_occupation: "Farmer",
                    max_income_limit: 1000000.0, max_land_limit: 50.0,
                    financial_benefit: "Comprehensive Crop Insurance Cover against yields loss",
                    eligibility_criteria: "All farmers growing notified crops in notified areas including tenant farmers.",
                    description: "Financial support to farmers suffering crop loss/damage arising out of natural calamities, pests & diseases.",
                    official_url: "https://pmfby.gov.in", active_status: true
                },
                {
                    scheme_name: "KCC (Kisan Credit Card Scheme)",
                    category: "Credit / Loan", target_occupation: "Farmer",
                    max_income_limit: 1000000.0, max_land_limit: 100.0,
                    financial_benefit: "Concessional credit at 4% interest rate up to ₹3 Lakhs",
                    eligibility_criteria: "Farmers - individual/joint borrowers, Tenant farmers, Sharecroppers, SHGs.",
                    description: "Provides timely access to credit for agricultural needs, post-harvest expenses, and farm maintenance.",
                    official_url: "https://myscheme.gov.in", active_status: true
                },
                {
                    scheme_name: "Pradhan Mantri MUDRA Yojana (PMMY)",
                    category: "MSME Loan", target_occupation: "Business / Self-Employed",
                    max_income_limit: 1200000.0, max_land_limit: 0.0,
                    financial_benefit: "Collateral-free loan up to ₹10 Lakhs (Shishu, Kishore, Tarun)",
                    eligibility_criteria: "Non-Corporate, Non-Farm Small/Micro enterprises in manufacturing, trading, or service sector.",
                    description: "Provides loans up to 10 lakh to non-corporate, non-farm micro/small enterprises.",
                    official_url: "https://mudra.org.in", active_status: true
                },
                {
                    scheme_name: "Atal Pension Yojana (APY)",
                    category: "Pension / Savings", target_occupation: "All Occupations",
                    max_income_limit: 600000.0, max_land_limit: 0.0,
                    financial_benefit: "Guaranteed pension of ₹1,000 to ₹5,000 / month post age 60",
                    eligibility_criteria: "Unorganized sector workers aged between 18 to 40 years holding a savings bank account.",
                    description: "Government-backed pension scheme targeting unorganized sector workers for post-retirement security.",
                    official_url: "https://npscra.nsdl.co.in", active_status: true
                },
                {
                    scheme_name: "PMJJBY (Pradhan Mantri Jeevan Jyoti Bima Yojana)",
                    category: "Insurance", target_occupation: "All Occupations",
                    max_income_limit: 800000.0, max_land_limit: 0.0,
                    financial_benefit: "₹2,000,000 Life Insurance Cover for ₹436 / year",
                    eligibility_criteria: "Savings bank account holders aged 18 to 50 years.",
                    description: "Renewable one-year term life insurance cover offering 2 Lakhs on death due to any reason.",
                    official_url: "https://financialservices.gov.in", active_status: true
                },
                {
                    scheme_name: "PMSBY (Pradhan Mantri Suraksha Bima Yojana)",
                    category: "Insurance", target_occupation: "All Occupations",
                    max_income_limit: 800000.0, max_land_limit: 0.0,
                    financial_benefit: "Accidental Death & Disability Cover up to ₹2 Lakhs for ₹20 / year",
                    eligibility_criteria: "Bank account holders aged 18 to 70 years.",
                    description: "Accident insurance scheme providing 2 Lakh cover for accidental death or total disability.",
                    official_url: "https://financialservices.gov.in", active_status: true
                },
                {
                    scheme_name: "Stand-Up India Scheme",
                    category: "Business / Loan", target_occupation: "Entrepreneur",
                    max_income_limit: 2500000.0, max_land_limit: 0.0,
                    financial_benefit: "Bank loans between ₹10 Lakhs and ₹1 Crore for SC/ST and Women",
                    eligibility_criteria: "SC/ST and/or Woman entrepreneurs aged above 18 years for Greenfield enterprise.",
                    description: "Facilitates bank loans between 10 lakh and 1 Crore to at least one SC/ST and one woman borrower per bank branch.",
                    official_url: "https://standupmitra.in", active_status: true
                },
                {
                    scheme_name: "Startup India Seed Fund Scheme (SISFS)",
                    category: "Business / Startup", target_occupation: "Entrepreneur",
                    max_income_limit: 5000000.0, max_land_limit: 0.0,
                    financial_benefit: "Financial assistance up to ₹20 Lakhs grant & ₹50 Lakhs debt",
                    eligibility_criteria: "DPIIT recognized startups incorporated not more than 2 years prior to application.",
                    description: "Provides financial assistance to startups for proof of concept, prototype development, product trials, and market entry.",
                    official_url: "https://startupindia.gov.in", active_status: true
                }
            ].map((s, idx) => ({ id: idx + 1, ...s }));
            write(KEYS.SCHEMES, schemes);
        }

        if (!read(KEYS.PREDICTIONS)) write(KEYS.PREDICTIONS, []);
        if (!read(KEYS.LOGS)) write(KEYS.LOGS, []);
        if (!read(KEYS.CONTACTS)) write(KEYS.CONTACTS, []);

        write(KEYS.SEEDED, true);
    }

    // ---------------------------------------------------------
    // Activity Logging
    // ---------------------------------------------------------
    function logActivity(user_id, action, details) {
        const logs = read(KEYS.LOGS, []);
        logs.unshift({
            id: nextId(logs),
            user_id: user_id || null,
            action, details: details || '',
            created_at: new Date().toISOString()
        });
        write(KEYS.LOGS, logs.slice(0, 200));
    }

    // ---------------------------------------------------------
    // Session / Auth
    // ---------------------------------------------------------
    function getSession() { return read(KEYS.SESSION, null); }
    function setSession(session) { write(KEYS.SESSION, session); }
    function clearSession() { localStorage.removeItem(KEYS.SESSION); }

    function findUserByIdentity(identity) {
        const users = read(KEYS.USERS, []);
        return users.find(u => u.email === identity || u.mobile === identity);
    }

    function registerUser(data) {
        const users = read(KEYS.USERS, []);
        if (users.some(u => u.email === data.email || u.mobile === data.mobile)) {
            return { ok: false, error: 'Email or Mobile already registered! Please sign in.' };
        }
        const user = {
            id: nextId(users),
            full_name: data.full_name,
            age: parseInt(data.age || 30, 10),
            gender: data.gender,
            mobile: data.mobile,
            email: data.email,
            password_hash: hashPassword(data.password),
            address: data.address || '',
            district: data.district || '',
            state: data.state || '',
            occupation: data.occupation,
            annual_income: parseFloat(data.annual_income || 0),
            family_members: parseInt(data.family_members || 1, 10),
            education: data.education || '',
            role: 'user',
            created_at: new Date().toISOString()
        };
        users.push(user);
        write(KEYS.USERS, users);
        logActivity(user.id, 'User Registration', `Registered ${user.full_name}`);
        return { ok: true, user };
    }

    function login(role, identity, password) {
        if (role === 'admin') {
            const admin = read(KEYS.ADMIN);
            if (admin && (admin.email === identity || admin.username === identity) && checkPassword(password, admin.password_hash)) {
                setSession({ role: 'admin', admin_username: admin.username });
                logActivity(null, 'Admin Login', `Admin ${admin.username} logged in.`);
                return { ok: true };
            }
            return { ok: false, error: 'Invalid Admin Credentials!' };
        } else {
            const user = findUserByIdentity(identity);
            if (user && checkPassword(password, user.password_hash)) {
                setSession({ role: 'user', user_id: user.id, user_name: user.full_name });
                logActivity(user.id, 'User Login', `User ${user.full_name} logged in.`);
                return { ok: true };
            }
            return { ok: false, error: 'Invalid Email/Mobile or Password!' };
        }
    }

    function logout() {
        const s = getSession();
        if (s && s.role === 'user') logActivity(s.user_id, 'User Logout', '');
        clearSession();
    }

    function requireUser() {
        const s = getSession();
        if (!s || s.role !== 'user') {
            window.location.href = 'login.html';
            return null;
        }
        return getUser(s.user_id);
    }

    function requireAdmin() {
        const s = getSession();
        if (!s || s.role !== 'admin') {
            window.location.href = 'login.html?admin=true';
            return null;
        }
        return s;
    }

    function getUser(id) {
        return read(KEYS.USERS, []).find(u => u.id === id);
    }
    function updateUser(id, patch) {
        const users = read(KEYS.USERS, []);
        const idx = users.findIndex(u => u.id === id);
        if (idx === -1) return null;
        users[idx] = { ...users[idx], ...patch };
        write(KEYS.USERS, users);
        return users[idx];
    }
    function deleteUser(id) {
        write(KEYS.USERS, read(KEYS.USERS, []).filter(u => u.id !== id));
        write(KEYS.PREDICTIONS, read(KEYS.PREDICTIONS, []).filter(p => p.user_id !== id));
    }
    function getAllUsers() { return read(KEYS.USERS, []); }

    function forgotPassword(identity) {
        const user = findUserByIdentity(identity);
        if (!user) return { ok: false, error: 'No registered account found with that email/mobile.' };
        const otp = String(Math.floor(100000 + Math.random() * 900000));
        updateUser(user.id, { reset_otp: otp });
        return { ok: true, otp };
    }

    // ---------------------------------------------------------
    // ML Engine (port of ml_engine.py heuristic fallback logic)
    // ---------------------------------------------------------
    function runMlPredictions(a) {
        const age = parseInt(a.age || 30, 10);
        const occupation = a.occupation || 'Farmer';
        const annual_income = parseFloat(a.annual_income || 200000);
        const monthly_expenses = parseFloat(a.monthly_expenses || 10000);
        const savings = parseFloat(a.savings || 20000);
        const existing_debt = parseFloat(a.existing_debt || 0);
        const credit_score = parseInt(a.credit_score || 650, 10);
        const land_size = parseFloat(a.land_size_acres || 0.0);
        const livestock = parseInt(a.livestock_count || 0, 10);
        const rainfall = a.rainfall_condition || 'Normal';
        const economic_cycle = a.economic_cycle || 'Stable / Moderate';

        const dti_ratio = existing_debt / (annual_income + 1e-5);
        const eti_ratio = (monthly_expenses * 12) / (annual_income + 1e-5);

        let risk_level;
        let confidence = 88.5;
        if (dti_ratio > 0.6 || credit_score < 550 || rainfall === 'Deficit / Drought') {
            risk_level = 'High';
        } else if (dti_ratio > 0.3 || credit_score < 680) {
            risk_level = 'Moderate';
        } else {
            risk_level = 'Low';
        }

        const risk_score = Math.round(Math.min(99.0, Math.max(5.0,
            (dti_ratio * 40) + (eti_ratio * 30) + ((850 - credit_score) / 850 * 30))) * 100) / 100;

        const loan_eligibility_score = Math.round(Math.min(98.0, Math.max(15.0,
            (credit_score / 850.0 * 50) + (Math.min(1.0, savings / (annual_income + 1)) * 30) + 20)) * 100) / 100;

        const insurance_need_score = Math.round(Math.min(99.0, Math.max(20.0,
            35 + (land_size > 0 ? 15 : 0) + (livestock > 0 ? 15 : 0) + (occupation === 'Farmer' ? 20 : 0))) * 100) / 100;

        const risk_tolerance = a.risk_level || 'Medium';
        let investment_category;
        if (risk_level === 'High' || risk_tolerance === 'Low') {
            investment_category = 'Capital Preservation (Fixed Deposits & Gold Loans)';
        } else if (occupation === 'Farmer') {
            investment_category = 'Agri-Growth & Crop Liquidity Portfolio';
        } else if (annual_income > 800000 && risk_level === 'Low') {
            investment_category = 'Balanced Equity & Government Pension Schemes';
        } else {
            investment_category = 'Stable Savings & Hybrid Mutual Funds';
        }

        const parts = [];
        parts.push(`Based on your profile as a ${occupation} earning ₹${Math.round(annual_income).toLocaleString('en-IN')}/yr in ${economic_cycle} conditions:`);
        if (occupation === 'Farmer') {
            parts.push(`• Farming Risk: With ${land_size} acres of land during ${rainfall} rainfall conditions, crop yield risks are factoring heavily into your ${risk_level} financial risk index.`);
        }
        if (dti_ratio > 0.4) {
            parts.push(`• Debt Exposure: Your existing debt of ₹${Math.round(existing_debt).toLocaleString('en-IN')} represents ${(dti_ratio * 100).toFixed(1)}% of annual income. Prioritizing debt consolidation is strongly recommended.`);
        } else {
            parts.push(`• Debt Management: Healthy debt-to-income ratio. You have high capacity for affordable credit schemes.`);
        }
        parts.push(`• Credit & Savings: Credit score of ${credit_score} grants a ${loan_eligibility_score}% loan approval probability. Insurance recommendation confidence is at ${confidence.toFixed(1)}%.`);

        return {
            age, occupation, annual_income, monthly_expenses, savings, existing_debt, credit_score,
            land_size_acres: land_size, livestock_count: livestock, rainfall_condition: rainfall, economic_cycle,
            risk_level, risk_score, loan_eligibility_score, insurance_need_score, investment_category,
            prediction_confidence: Math.round(confidence * 10) / 10,
            ai_explanation: parts.join('\n')
        };
    }

    // ---------------------------------------------------------
    // Recommendation Engine (port of recommendation_engine.py)
    // ---------------------------------------------------------
    function generateFinancialRecommendations(a, predictions) {
        const age = parseInt(a.age || 30, 10);
        const occupation = a.occupation || 'Farmer';
        const annual_income = parseFloat(a.annual_income || 200000);
        const land_size = parseFloat(a.land_size_acres || 0.0);
        const livestock = parseInt(a.livestock_count || 0, 10);
        const crop_type = a.crop_type || 'Paddy';
        const crop_season = a.crop_season || 'Kharif';
        const rainfall = a.rainfall_condition || 'Normal';
        const loan_score = predictions.loan_eligibility_score;
        const risk_level = predictions.risk_level;

        const banking_products = [];

        if (occupation === 'Farmer' || land_size > 0) {
            banking_products.push({
                category: 'Agriculture Loan', product_name: 'Kisan Credit Card (KCC) Agri Loan',
                provider_name: 'NABARD / State Bank of India', interest_rate: '4.0% p.a. (Subvention applied)',
                max_amount: Math.min(300000.0, Math.max(50000.0, land_size * 40000.0)),
                tenure: '12 - 36 Months', eligibility_match: Math.min(98, Math.round(loan_score + 10)),
                badge: 'Top Agri Choice',
                description: 'Concessional crop production loan with interest subvention for seasonal cultivation.'
            });
            banking_products.push({
                category: 'Crop / Agri Gold Loan', product_name: 'Agri Gold Collateral Loan',
                provider_name: 'Canara Bank / Punjab National Bank', interest_rate: '7.2% p.a.',
                max_amount: 5000000, tenure: '12 Months',
                eligibility_match: Math.min(96, Math.round(loan_score + 5)), badge: 'Instant Liquidity',
                description: 'Quick loan against gold ornaments for urgent farm inputs during crop season.'
            });
        }
        if (occupation === 'Self-Employed / Business' || occupation === 'Entrepreneur') {
            banking_products.push({
                category: 'MSME / Business Loan', product_name: 'MUDRA Entrepreneur Credit Loan',
                provider_name: 'Bank of Baroda / SIDBI', interest_rate: '8.5% p.a.',
                max_amount: 1000000, tenure: '60 Months',
                eligibility_match: Math.min(95, Math.round(loan_score)), badge: 'Collateral Free',
                description: 'Working capital loan for micro enterprises under Shishu, Kishore, and Tarun categories.'
            });
        }
        if (annual_income >= 300000 && risk_level !== 'High') {
            banking_products.push({
                category: 'Personal Loan', product_name: 'Express Personal Flexi Loan',
                provider_name: 'HDFC Bank / ICICI Bank', interest_rate: '10.5% p.a.',
                max_amount: Math.min(1500000.0, annual_income * 2.5), tenure: '12 - 60 Months',
                eligibility_match: Math.min(92, Math.round(loan_score)), badge: 'Pre-Approved',
                description: 'Unsecured personal loan for emergency expenditures and household needs.'
            });
            banking_products.push({
                category: 'Home Loan', product_name: 'Pradhan Mantri Awas Home Credit',
                provider_name: 'SBI Home Loans / LIC Housing', interest_rate: '8.4% p.a.',
                max_amount: Math.min(5000000.0, annual_income * 5.0), tenure: '120 - 240 Months',
                eligibility_match: Math.min(90, Math.round(loan_score - 5)), badge: 'Subsidy Eligible',
                description: 'Low-interest affordable housing loan with credit-linked subsidy scheme benefits.'
            });
        }
        banking_products.push({
            category: 'Savings & FD', product_name: 'High Yield Agri-Savings & Fixed Deposit',
            provider_name: 'Post Office / Regional Rural Banks', interest_rate: '7.5% p.a. (FD) / 4.0% (Savings)',
            max_amount: null, tenure: '12 - 60 Months', eligibility_match: 99, badge: 'Guaranteed Return',
            description: 'Zero balance savings account with capital protection fixed deposit yields.'
        });

        const insurance_plans = [];
        if (occupation === 'Farmer' || land_size > 0) {
            insurance_plans.push({
                insurance_type: 'Crop Insurance', plan_name: 'Pradhan Mantri Fasal Bima Yojana (PMFBY)',
                provider: 'AIC of India / Bajaj Allianz General',
                sum_insured: Math.max(50000.0, land_size * 35000.0),
                annual_premium: Math.max(1000.0, land_size * 700.0),
                match_score: rainfall === 'Deficit / Drought' ? 98 : 92, badge: 'Crucial for Monsoon',
                features: `Comprehensive yield loss cover for ${crop_type} crop in ${crop_season} season due to drought or flood.`
            });
        }
        if (livestock > 0) {
            insurance_plans.push({
                insurance_type: 'Livestock Insurance', plan_name: 'Pashudhan Bima Yojana',
                provider: 'New India Assurance / ICICI Lombard',
                sum_insured: livestock * 45000, annual_premium: livestock * 900,
                match_score: 95, badge: 'Cattle Protection',
                features: 'Full market value protection against disease, mortality, and accidental loss of livestock.'
            });
        }
        insurance_plans.push({
            insurance_type: 'Health Insurance', plan_name: 'Ayushman Bharat & Comprehensive Family Health Shield',
            provider: 'National Insurance / Star Health', sum_insured: 500000, annual_premium: 4500,
            match_score: 96, badge: 'Essential',
            features: 'Cashless hospitalization cover for up to 5 family members at empanelled hospitals.'
        });
        insurance_plans.push({
            insurance_type: 'Life Insurance', plan_name: 'PMJJBY Life Term Shield', provider: 'LIC of India',
            sum_insured: 200000, annual_premium: 436, match_score: 94, badge: 'Low Cost',
            features: 'Renewable 1-year term life cover payable to nominee on death due to any cause.'
        });

        const schemesList = read(KEYS.SCHEMES, []).filter(s => s.active_status);
        const matched_schemes = schemesList.map(scheme => {
            let match_score = 50;
            const reasons = [];
            if (scheme.target_occupation === 'Farmer' && (occupation === 'Farmer' || land_size > 0)) {
                match_score += 30; reasons.push('Matches your agricultural occupation');
            } else if (scheme.target_occupation === 'All Occupations') {
                match_score += 20; reasons.push('Universal eligibility scheme');
            } else if (occupation.includes(scheme.target_occupation)) {
                match_score += 25; reasons.push(`Targeted for ${occupation}`);
            }
            if (scheme.max_income_limit && annual_income <= scheme.max_income_limit) {
                match_score += 15; reasons.push(`Income within threshold (< ₹${scheme.max_income_limit.toLocaleString('en-IN')})`);
            } else {
                match_score -= 10;
            }
            if (scheme.max_land_limit && land_size <= scheme.max_land_limit) {
                match_score += 10;
            } else if (scheme.max_land_limit && scheme.max_land_limit > 0 && land_size > scheme.max_land_limit) {
                match_score -= 25;
            }
            const final_match = Math.min(99, Math.max(25, match_score));
            return {
                id: scheme.id, scheme_name: scheme.scheme_name, category: scheme.category,
                financial_benefit: scheme.financial_benefit, eligibility_criteria: scheme.eligibility_criteria,
                description: scheme.description, official_url: scheme.official_url,
                match_score: final_match, is_eligible: final_match >= 65,
                reasons: reasons.length ? reasons.join(', ') : 'General Eligibility'
            };
        }).sort((x, y) => y.match_score - x.match_score);

        return { banking_products, insurance_plans, matched_schemes };
    }

    // ---------------------------------------------------------
    // Predictions
    // ---------------------------------------------------------
    function savePrediction(user_id, assessmentData, predictionResult, recs) {
        const preds = read(KEYS.PREDICTIONS, []);
        const record = {
            id: nextId(preds),
            user_id,
            ...predictionResult,
            location_state: assessmentData.location_state || '',
            gender: assessmentData.gender || '',
            crop_type: assessmentData.crop_type || 'None',
            crop_season: assessmentData.crop_season || 'Year-Round',
            banking_products: recs.banking_products,
            insurance_plans: recs.insurance_plans,
            matched_schemes: recs.matched_schemes,
            created_at: new Date().toISOString()
        };
        preds.unshift(record);
        write(KEYS.PREDICTIONS, preds);
        return record;
    }
    function getPredictionsForUser(user_id) {
        return read(KEYS.PREDICTIONS, []).filter(p => p.user_id === user_id);
    }
    function getPrediction(id) {
        return read(KEYS.PREDICTIONS, []).find(p => p.id === id);
    }
    function getAllPredictions() { return read(KEYS.PREDICTIONS, []); }

    // ---------------------------------------------------------
    // Government Schemes (admin CRUD)
    // ---------------------------------------------------------
    function getSchemes() { return read(KEYS.SCHEMES, []); }
    function addScheme(data) {
        const schemes = read(KEYS.SCHEMES, []);
        schemes.push({
            id: nextId(schemes),
            scheme_name: data.scheme_name, category: data.category,
            target_occupation: data.target_occupation, max_income_limit: null, max_land_limit: null,
            financial_benefit: data.financial_benefit, eligibility_criteria: data.eligibility_criteria,
            description: data.description, official_url: data.official_url, active_status: true
        });
        write(KEYS.SCHEMES, schemes);
    }
    function deleteScheme(id) {
        write(KEYS.SCHEMES, read(KEYS.SCHEMES, []).filter(s => s.id !== id));
    }

    function getLogs() { return read(KEYS.LOGS, []); }
    function getContacts() { return read(KEYS.CONTACTS, []); }
    function addContact(data) {
        const contacts = read(KEYS.CONTACTS, []);
        contacts.unshift({ id: nextId(contacts), ...data, status: 'unread', created_at: new Date().toISOString() });
        write(KEYS.CONTACTS, contacts);
    }

    // ---------------------------------------------------------
    // Exports (CSV / PDF) - all generated client-side
    // ---------------------------------------------------------
    function downloadBlob(content, filename, mime) {
        const blob = new Blob([content], { type: mime });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = filename;
        document.body.appendChild(a); a.click(); document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    function exportPredictionsCsv() {
        const preds = getAllPredictions();
        const rows = [['Prediction ID', 'User ID', 'User Name', 'Occupation', 'Annual Income', 'Land Size', 'Risk Level', 'Loan Score', 'Confidence']];
        preds.forEach(p => {
            const u = getUser(p.user_id);
            rows.push([p.id, p.user_id, u ? u.full_name : 'N/A', p.occupation, p.annual_income, p.land_size_acres, p.risk_level, p.loan_eligibility_score, p.prediction_confidence]);
        });
        const csv = rows.map(r => r.map(v => `"${String(v ?? '').replace(/"/g, '""')}"`).join(',')).join('\n');
        downloadBlob(csv, 'FinSense_Predictions_Report.csv', 'text/csv');
    }

    function exportPredictionPdf(pred) {
        const user = getUser(pred.user_id);
        if (typeof window.jspdf === 'undefined') {
            alert('PDF library failed to load. Please check your connection.');
            return;
        }
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({ unit: 'pt', format: 'letter' });
        const margin = 40; let y = 50;

        doc.setFontSize(18); doc.setTextColor(11, 23, 54);
        doc.text('FinSense AI - Financial & Insurance Recommendation Report', margin, y);
        y += 20;
        doc.setFontSize(10); doc.setTextColor(30, 41, 59);
        doc.text(`Report ID: #${pred.id} | Generated: ${new Date(pred.created_at).toLocaleString()}`, margin, y);
        y += 25;

        doc.setFontSize(13); doc.setTextColor(99, 102, 241);
        doc.text('User & Assessment Profile', margin, y); y += 18;
        doc.setFontSize(10); doc.setTextColor(15, 23, 42);
        const profileLines = [
            `User Name: ${user ? user.full_name : 'N/A'}      Age / Gender: ${pred.age} / ${pred.gender}`,
            `Occupation: ${pred.occupation}      Annual Income: Rs. ${Number(pred.annual_income).toLocaleString('en-IN')}`,
            `Land Size: ${pred.land_size_acres} Acres      Crop / Season: ${pred.crop_type} (${pred.crop_season})`,
            `Location State: ${pred.location_state}      Rainfall Condition: ${pred.rainfall_condition}`
        ];
        profileLines.forEach(line => { doc.text(line, margin, y); y += 16; });
        y += 10;

        doc.setFontSize(13); doc.setTextColor(99, 102, 241);
        doc.text('Machine Learning Risk & Loan Metrics', margin, y); y += 18;
        doc.setFontSize(10); doc.setTextColor(15, 23, 42);
        const metricLines = [
            `Financial Risk Index: ${pred.risk_level} Risk (${pred.risk_score}/100)`,
            `Loan Approval Confidence: ${pred.loan_eligibility_score}%`,
            `Insurance Need Index: ${pred.insurance_need_score}%`,
            `Investment Strategy: ${pred.investment_category}`,
            `Prediction Confidence: ${pred.prediction_confidence}% Score`
        ];
        metricLines.forEach(line => { doc.text(line, margin, y); y += 16; });
        y += 10;

        doc.setFontSize(13); doc.setTextColor(99, 102, 241);
        doc.text('AI Decision Explanation', margin, y); y += 18;
        doc.setFontSize(10); doc.setTextColor(15, 23, 42);
        const explanationLines = doc.splitTextToSize(pred.ai_explanation.replace(/\n/g, '  |  '), 520);
        doc.text(explanationLines, margin, y);

        doc.save(`FinSense_Report_${pred.id}.pdf`);
    }

    seedIfNeeded();

    return {
        seedIfNeeded, getSession, setSession, clearSession, login, logout,
        registerUser, requireUser, requireAdmin, getUser, updateUser, deleteUser, getAllUsers,
        forgotPassword, runMlPredictions, generateFinancialRecommendations,
        savePrediction, getPredictionsForUser, getPrediction, getAllPredictions,
        getSchemes, addScheme, deleteScheme, getLogs, getContacts, addContact,
        logActivity, exportPredictionsCsv, exportPredictionPdf
    };
})();
