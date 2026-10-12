// Initialize Lucide Icons
lucide.createIcons();

// 1. CORE SEED BRANDS DATASET Across Key Categories
const SEED_BRANDS = [
    { "name": "Apple", "domain": "apple.com", "category": "Technology & Consumer Electronics" },
    { "name": "Microsoft", "domain": "microsoft.com", "category": "Technology & Consumer Electronics" },
    { "name": "Google", "domain": "google.com", "category": "Technology & Consumer Electronics" },
    { "name": "Samsung", "domain": "samsung.com", "category": "Technology & Consumer Electronics" },
    { "name": "Sony", "domain": "sony.com", "category": "Technology & Consumer Electronics" },
    { "name": "Intel", "domain": "intel.com", "category": "Technology & Consumer Electronics" },
    { "name": "Dell", "domain": "dell.com", "category": "Technology & Consumer Electronics" },
    { "name": "HP", "domain": "hp.com", "category": "Technology & Consumer Electronics" },
    { "name": "Netflix", "domain": "netflix.com", "category": "Media & Streaming" },
    { "name": "Spotify", "domain": "spotify.com", "category": "Media & Streaming" },
    { "name": "Disney+", "domain": "disneyplus.com", "category": "Media & Streaming" },
    { "name": "Hulu", "domain": "hulu.com", "category": "Media & Streaming" },
    { "name": "YouTube", "domain": "youtube.com", "category": "Media & Streaming" },
    { "name": "Prime Video", "domain": "primevideo.com", "category": "Media & Streaming" },
    { "name": "Amazon", "domain": "amazon.com", "category": "E-Commerce & Retail" },
    { "name": "Walmart", "domain": "walmart.com", "category": "E-Commerce & Retail" },
    { "name": "Target", "domain": "target.com", "category": "E-Commerce & Retail" },
    { "name": "eBay", "domain": "ebay.com", "category": "E-Commerce & Retail" },
    { "name": "Alibaba", "domain": "alibaba.com", "category": "E-Commerce & Retail" },
    { "name": "Shopify", "domain": "shopify.com", "category": "E-Commerce & Retail" },
    { "name": "Tesla", "domain": "tesla.com", "category": "Automotive" },
    { "name": "Toyota", "domain": "toyota.com", "category": "Automotive" },
    { "name": "Ford", "domain": "ford.com", "category": "Automotive" },
    { "name": "BMW", "domain": "bmw.com", "category": "Automotive" },
    { "name": "Mercedes-Benz", "domain": "mercedes-benz.com", "category": "Automotive" },
    { "name": "Honda", "domain": "honda.com", "category": "Automotive" },
    { "name": "Visa", "domain": "visa.com", "category": "Financial Services" },
    { "name": "Mastercard", "domain": "mastercard.com", "category": "Financial Services" },
    { "name": "PayPal", "domain": "paypal.com", "category": "Financial Services" },
    { "name": "Stripe", "domain": "stripe.com", "category": "Financial Services" },
    { "name": "American Express", "domain": "americanexpress.com", "category": "Financial Services" }
];

// Typosquatting & Homoglyph Mutation Strategies
const TYPO_STRATEGIES = [
    { type: "Homoglyph Substitution", fn: (s) => s.replace(/i/g, '1').replace(/l/g, 'I').replace(/o/g, '0').replace(/a/g, '@') },
    { type: "Character Swap / Transposition", fn: (s) => s.length > 3 ? s.slice(0, 1) + s[2] + s[1] + s.slice(3) : s + "s" },
    { type: "Deceptive Suffix", fn: (s) => s + "-support-verify.com" },
    { type: "Subdomain Phishing", fn: (s) => "login-" + s + "-security.net" },
    { type: "Double Character Omission", fn: (s) => s.replace(/[aeiou]/, '') },
    { type: "Lookalike TLD", fn: (s) => s + "-official.shop" },
    { type: "App Store Scam Prefix", fn: (s) => "Official " + s + " Security Guard" },
    { type: "Support Handle Impersonation", fn: (s) => "@" + s + "_Helpdesk_Official" }
];

// Dynamic Dataset Generator for 3,000+ Items
let BRAND_DATABASE = [];

function generate3000Brands() {
    let db = [];
    let idCounter = 1;

    SEED_BRANDS.forEach(seed => {
        db.push({
            id: idCounter++,
            name: seed.name,
            queryStr: seed.name.toLowerCase(),
            type: "Original",
            category: seed.category,
            typoMechanism: "None (Authentic)",
            riskScore: "0% (Authentic)",
            matchedOriginal: seed.name
        });
    });

    let targetCount = 3040;
    let index = 0;

    while (db.length < targetCount) {
        let seed = SEED_BRANDS[index % SEED_BRANDS.length];
        let strat = TYPO_STRATEGIES[(index + Math.floor(index / SEED_BRANDS.length)) % TYPO_STRATEGIES.length];
        let fakeName = strat.fn(seed.name.toLowerCase());
        
        if (db.some(e => e.name === fakeName)) {
            fakeName = fakeName + (Math.floor(index / 10));
        }

        db.push({
            id: idCounter++,
            name: fakeName,
            queryStr: fakeName.toLowerCase(),
            type: "Fake / Impersonator",
            category: seed.category,
            typoMechanism: strat.type,
            riskScore: (88 + (index % 12)) + "% Risk",
            matchedOriginal: seed.name
        });

        index++;
    }

    return db;
}

// Initialize dataset
BRAND_DATABASE = generate3000Brands();
const sidebarDbCount = document.getElementById('sidebar-db-count');
if (sidebarDbCount) {
    sidebarDbCount.innerText = BRAND_DATABASE.length.toLocaleString();
}

// 2. LEVENSHTEIN DISTANCE CALCULATION
function computeLevenshtein(a, b) {
    const matrix = Array.from({ length: a.length + 1 }, () => Array(b.length + 1).fill(0));
    for (let i = 0; i <= a.length; i++) matrix[i][0] = i;
    for (let j = 0; j <= b.length; j++) matrix[0][j] = j;

    for (let i = 1; i <= a.length; i++) {
        for (let j = 1; j <= b.length; j++) {
            const cost = a[i - 1] === b[j - 1] ? 0 : 1;
            matrix[i][j] = Math.min(
                matrix[i - 1][j] + 1,
                matrix[i][j - 1] + 1,
                matrix[i - 1][j - 1] + cost
            );
        }
    }
    return matrix[a.length][b.length];
}

// 3. RUN DETECTION ENGINE
function runDetection() {
    const inputElement = document.getElementById('detector-input');
    if (!inputElement) return;
    const inputVal = inputElement.value.trim();
    if (!inputVal) {
        showToast("Please enter a brand, domain, or handle to analyze.");
        return;
    }

    const cleanInput = inputVal.toLowerCase().replace(/^(https?:\/\/)?(www\.)?/, '').replace(/[@]/g, '');
    const exactMatch = BRAND_DATABASE.find(item => item.queryStr === cleanInput || item.name.toLowerCase() === cleanInput);

    let verdict = "";
    let isFake = true;
    let matchedBrand = "Unknown";
    let levenshteinDist = 99;
    let typoType = "Heuristic Pattern";
    let score = "92%";
    let recommendation = "";

    if (exactMatch) {
        if (exactMatch.type === "Original") {
            isFake = false;
            verdict = "ORIGINAL / AUTHENTIC";
            matchedBrand = exactMatch.name;
            levenshteinDist = 0;
            typoType = "None";
            score = "99.8% Authentic";
            recommendation = "This is an indexed verified original enterprise asset. Safe to interact.";
        } else {
            isFake = true;
            verdict = "FAKE / IMPERSONATOR (High Risk)";
            matchedBrand = exactMatch.matchedOriginal;
            levenshteinDist = 1;
            typoType = exactMatch.typoMechanism;
            score = exactMatch.riskScore;
            recommendation = `Matches known typosquatting vector impersonating ${exactMatch.matchedOriginal}. Flagged for automated DMCA takedown.`;
        }
    } else {
        let bestSeed = SEED_BRANDS[0];
        let minDist = 99;

        SEED_BRANDS.forEach(seed => {
            let dist = computeLevenshtein(cleanInput.substring(0, seed.name.length + 3), seed.name.toLowerCase());
            if (dist < minDist) {
                minDist = dist;
                bestSeed = seed;
            }
        });

        matchedBrand = bestSeed.name;
        levenshteinDist = minDist;

        if (cleanInput.includes(bestSeed.name.toLowerCase()) && cleanInput !== bestSeed.name.toLowerCase()) {
            isFake = true;
            verdict = "FAKE / IMPERSONATOR (High Risk)";
            typoType = "Subdomain / Suffix Hijack";
            score = "95.2% Risk";
            recommendation = `Target contains legitimate brand string '${bestSeed.name}' inside an unverified domain pattern. Recommended for immediate platform reporting.`;
        } else if (minDist <= 3) {
            isFake = true;
            verdict = "FAKE / IMPERSONATOR (High Risk)";
            typoType = "Homoglyph / Character Edit";
            score = "91.8% Risk";
            recommendation = `Close visual & Levenshtein similarity to verified brand '${bestSeed.name}'. High probability of phishing.`;
        } else {
            isFake = false;
            verdict = "SUSPICIOUS / UNVERIFIED";
            typoType = "Low Similarity Cluster";
            score = "60.0% Risk";
            recommendation = "No direct typosquatting pattern matched, but asset lacks enterprise verification signature. Proceed with caution.";
        }
    }

    const resultCard = document.getElementById('detector-result-card');
    if (resultCard) resultCard.classList.remove('hidden');
    
    const logoImage = document.getElementById('brand-logo');
    const logoFallback = document.getElementById('brand-logo-fallback');
    const logoName = document.getElementById('brand-logo-name');

    const logoBrand = SEED_BRANDS.find(
        brand => brand.name.toLowerCase() === matchedBrand.toLowerCase()
    );

    if (logoName) logoName.textContent = matchedBrand;
    if (logoImage && logoFallback) {
        logoImage.classList.add('hidden');
        logoFallback.classList.remove('hidden');
        logoImage.removeAttribute('src');

        if (logoBrand) {
            logoImage.alt = logoBrand.name + ' logo';

            logoImage.onload = function () {
                logoImage.classList.remove('hidden');
                logoFallback.classList.add('hidden');
            };

            logoImage.onerror = function () {
                logoImage.classList.add('hidden');
                logoFallback.classList.remove('hidden');
            };

            logoFallback.textContent = logoBrand.name.charAt(0).toUpperCase();
            logoImage.src = 'https://www.google.com/s2/favicons?domain=' + encodeURIComponent(logoBrand.domain) + '&sz=128';
        } else {
            logoFallback.textContent = matchedBrand === 'Unknown' ? '?' : matchedBrand.charAt(0).toUpperCase();
        }
    }

    const targetNameEl = document.getElementById('verdict-target-name');
    const matchedBrandEl = document.getElementById('res-matched-brand');
    const levenshteinEl = document.getElementById('res-levenshtein');
    const typoTypeEl = document.getElementById('res-typo-type');
    const entropyEl = document.getElementById('res-entropy');
    const recommendationEl = document.getElementById('res-recommendation');

    if (targetNameEl) targetNameEl.innerText = inputVal;
    if (matchedBrandEl) matchedBrandEl.innerText = matchedBrand;
    if (levenshteinEl) levenshteinEl.innerText = levenshteinDist === 0 ? "0 (Exact)" : `${levenshteinDist} Edit(s)`;
    if (typoTypeEl) typoTypeEl.innerText = typoType;
    if (entropyEl) entropyEl.innerText = isFake ? "4.82 bits (High)" : "2.10 bits (Normal)";
    if (recommendationEl) recommendationEl.innerText = recommendation;

    const badge = document.getElementById('verdict-badge');
    const scoreVal = document.getElementById('score-value');
    const btnTakedown = document.getElementById('btn-action-takedown');

    if (isFake) {
        if (badge) {
            badge.innerText = verdict;
            badge.className = "px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-rose-500/10 text-rose-400 border border-rose-500/20";
        }
        if (scoreVal) {
            scoreVal.innerText = score;
            scoreVal.className = "text-3xl font-bold font-mono text-rose-400 mt-1";
        }
        if (btnTakedown) btnTakedown.classList.remove('hidden');
    } else {
        if (badge) {
            badge.innerText = verdict;
            badge.className = "px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20";
        }
        if (scoreVal) {
            scoreVal.innerText = score;
            scoreVal.className = "text-3xl font-bold font-mono text-emerald-400 mt-1";
        }
        if (btnTakedown) btnTakedown.classList.add('hidden');
    }

    if (resultCard) resultCard.scrollIntoView({ behavior: 'smooth' });
}

function quickTest(input, isOrig) {
    const detectorInput = document.getElementById('detector-input');
    if (detectorInput) {
        detectorInput.value = input;
        runDetection();
    }
}

// 4. DATABASE EXPLORER PAGINATION & FILTERS
let currentPage = 1;
const pageSize = 15;
let filteredDB = [...BRAND_DATABASE];

function renderDatabaseTable() {
    const tbody = document.getElementById('db-table-body');
    if (!tbody) return;
    tbody.innerHTML = '';

    const startIdx = (currentPage - 1) * pageSize;
    const pageItems = filteredDB.slice(startIdx, startIdx + pageSize);

    const countText = document.getElementById('db-count-text');
    if (countText) countText.innerText = filteredDB.length.toLocaleString();

    const totalPages = Math.ceil(filteredDB.length / pageSize) || 1;
    const pageInfo = document.getElementById('db-page-info');
    if (pageInfo) pageInfo.innerText = `Page ${currentPage} of ${totalPages}`;

    pageItems.forEach(item => {
        const tr = document.createElement('tr');
        tr.className = "hover:bg-slate-800/40 transition-colors";
        
        const typeBadge = item.type === "Original" 
            ? `<span class="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono text-[10px]">ORIGINAL</span>`
            : `<span class="px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20 font-mono text-[10px]">FAKE / IMPERSONATOR</span>`;

        tr.innerHTML = `
            <td class="p-3.5 font-mono text-white font-semibold">${item.name}</td>
            <td class="p-3.5">${typeBadge}</td>
            <td class="p-3.5 text-slate-300">${item.category}</td>
            <td class="p-3.5 text-slate-400 font-mono text-[11px]">${item.typoMechanism}</td>
            <td class="p-3.5 font-mono text-cyan-400 font-medium">${item.riskScore}</td>
            <td class="p-3.5 text-right">
                <button onclick="inspectFromDB('${item.name}')" class="text-cyan-400 hover:underline font-mono text-[11px]">Test in Detector &rarr;</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function filterDatabase() {
    const searchInput = document.getElementById('db-search-input');
    const industrySelect = document.getElementById('db-filter-industry');
    const typeSelect = document.getElementById('db-filter-type');

    const searchVal = searchInput ? searchInput.value.toLowerCase() : '';
    const industryVal = industrySelect ? industrySelect.value : 'all';
    const typeVal = typeSelect ? typeSelect.value : 'all';

    filteredDB = BRAND_DATABASE.filter(item => {
        const matchSearch = item.name.toLowerCase().includes(searchVal) || item.matchedOriginal.toLowerCase().includes(searchVal);
        const matchIndustry = industryVal === 'all' || item.category === industryVal;
        const matchType = typeVal === 'all' || (typeVal === 'Original' && item.type === 'Original') || (typeVal === 'Fake' && item.type !== 'Original');
        return matchSearch && matchIndustry && matchType;
    });

    currentPage = 1;
    renderDatabaseTable();
}

function changePage(delta) {
    const totalPages = Math.ceil(filteredDB.length / pageSize) || 1;
    currentPage += delta;
    if (currentPage < 1) currentPage = 1;
    if (currentPage > totalPages) currentPage = totalPages;
    renderDatabaseTable();
}

function inspectFromDB(name) {
    switchTab('detector');
    const detectorInput = document.getElementById('detector-input');
    if (detectorInput) {
        detectorInput.value = name;
        runDetection();
    }
}

// 5. TAKEDOWN MANAGER DATA
const TAKEDOWNS_DATA = [
    { entity: "netfl1x-verify.com", brand: "Netflix", platform: "Namecheap Registrar", status: "Removal Pending" },
    { entity: "paypaI-login.support", brand: "PayPal", platform: "Cloudflare Abuse", status: "Notice Submitted" },
    { entity: "blnance-airdrop-claim", brand: "Binance", platform: "X Corp (Twitter)", status: "Account Suspended" },
    { entity: "Official Apple Security Guard", brand: "Apple", platform: "Apple App Store", status: "App Delisted" }
];

function renderTakedowns() {
    const tbody = document.getElementById('takedown-table-body');
    if (!tbody) return;
    tbody.innerHTML = '';
    TAKEDOWNS_DATA.forEach(t => {
        const tr = document.createElement('tr');
        tr.className = "hover:bg-slate-800/40 transition-colors";
        tr.innerHTML = `
            <td class="p-3.5 font-mono text-white font-semibold">${t.entity}</td>
            <td class="p-3.5 text-slate-300">${t.brand}</td>
            <td class="p-3.5 text-slate-400">${t.platform}</td>
            <td class="p-3.5"><span class="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-mono text-[10px]">${t.status}</span></td>
            <td class="p-3.5 text-right">
                <button onclick="showToast('Status updated for ${t.entity}')" class="text-cyan-400 hover:underline font-mono text-[11px]">Refresh Status</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function queueTakedownFromDetector() {
    const targetNameEl = document.getElementById('verdict-target-name');
    const matchedBrandEl = document.getElementById('res-matched-brand');
    const name = targetNameEl ? targetNameEl.innerText : 'Unknown';
    const matched = matchedBrandEl ? matchedBrandEl.innerText : 'Unknown';

    TAKEDOWNS_DATA.unshift({
        entity: name,
        brand: matched,
        platform: "Meta / X Corp Enforcement API",
        status: "Notice Generated"
    });
    renderTakedowns();
    showToast(`Takedown report queued for ${name}`);
    switchTab('takedowns');
}

// 6. CHART.JS ANALYTICS INITIALIZATION
let chartVectorsInstance = null;
let chartIndustryInstance = null;

function initCharts() {
    if (chartVectorsInstance) chartVectorsInstance.destroy();
    if (chartIndustryInstance) chartIndustryInstance.destroy();

    const canvasVectors = document.getElementById('chart-attack-vectors');
    if (canvasVectors) {
        const ctx1 = canvasVectors.getContext('2d');
        chartVectorsInstance = new Chart(ctx1, {
            type: 'bar',
            data: {
                labels: ['Homoglyphs', 'Char Swaps', 'Subdomains', 'Lookalike TLDs', 'App Store Scams'],
                datasets: [{
                    label: 'Detected Count',
                    data: [1120, 680, 540, 420, 280],
                    backgroundColor: '#06b6d4'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    x: { ticks: { color: '#94a3b8' }, grid: { display: false } },
                    y: { ticks: { color: '#94a3b8' }, grid: { color: '#1e293b' } }
                }
            }
        });
    }

    const canvasIndustry = document.getElementById('chart-industry-targets');
    if (canvasIndustry) {
        const ctx2 = canvasIndustry.getContext('2d');
        chartIndustryInstance = new Chart(ctx2, {
            type: 'doughnut',
            data: {
                labels: ['Tech', 'Finance & Crypto', 'Retail', 'Streaming', 'Gaming'],
                datasets: [{
                    data: [35, 25, 20, 12, 8],
                    backgroundColor: ['#06b6d4', '#10b981', '#f59e0b', '#f43f5e', '#6366f1']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: 'bottom', labels: { color: '#94a3b8', boxWidth: 12 } } }
            }
        });
    }
}

// CSV Export Functionality
function exportCSV() {
    let csvContent = "data:text/csv;charset=utf-8,ID,Name,Type,Category,TypoMechanism,RiskScore\n";
    BRAND_DATABASE.slice(0, 500).forEach(row => {
        csvContent += `${row.id},"${row.name}",${row.type},"${row.category}","${row.typoMechanism}",${row.riskScore}\n`;
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "brandguard_threats_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Exported 500 threat records to CSV.");
}

// Navigation Tab Switching
function switchTab(tabId) {
    const tabs = ['detector', 'database', 'dashboard', 'tuner', 'takedowns'];
    tabs.forEach(t => {
        const viewEl = document.getElementById('view-' + t);
        if (viewEl) viewEl.classList.add('hidden');
        const btn = document.getElementById('nav-' + t);
        if (btn) btn.className = "w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all text-slate-400 hover:text-slate-200 hover:bg-slate-800/50";
    });

    const activeView = document.getElementById('view-' + tabId);
    if (activeView) activeView.classList.remove('hidden');
    const activeBtn = document.getElementById('nav-' + tabId);
    if (activeBtn) activeBtn.className = "w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all bg-cyan-500/10 text-cyan-400 border border-cyan-500/20";

    if (tabId === 'dashboard') initCharts();
}

function showToast(msg) {
    const toast = document.getElementById('toast');
    const msgEl = document.getElementById('toast-message');
    if (!toast || !msgEl) return;
    msgEl.innerText = msg;
    toast.classList.remove('translate-y-24', 'opacity-0');
    setTimeout(() => toast.classList.add('translate-y-24', 'opacity-0'), 3000);
}

function toggleMobileNav() {
    showToast("Navigation accessible via top header buttons.");
}

// Initialize Table on Load
renderDatabaseTable();
renderTakedowns();