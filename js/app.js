// js/app.js

let liveMatches = [];
let updateInterval;

// عناصر DOM
const matchesGrid = document.getElementById('matchesGrid');
const loadingSpinner = document.getElementById('loadingSpinner');
const errorMessage = document.getElementById('errorMessage');
const loadingBar = document.getElementById('loadingBar');

// شريط التحميل
function showLoading(percent) {
    loadingBar.style.width = percent + '%';
}

function hideLoading() {
    setTimeout(() => {
        loadingBar.style.width = '0%';
    }, 500);
}

// عرض الأخطاء
function showError(msg) {
    errorMessage.classList.remove('hidden');
    errorMessage.textContent = msg;
    matchesGrid.classList.add('hidden');
}

// إخفاء الأخطاء
function hideError() {
    errorMessage.classList.add('hidden');
    matchesGrid.classList.remove('hidden');
}

// تحويل بيانات SofaScore لبطاقة مباراة
function formatMatch(match) {
    return {
        id: match.id,
        homeTeam: match.homeTeam?.name || '???',
        awayTeam: match.awayTeam?.name || '???',
        homeScore: match.homeScore?.current || 0,
        awayScore: match.awayScore?.current || 0,
        minute: match.time?.current || 0,
        status: match.status?.description || 'LIVE',
        league: match.tournament?.name || 'دوري غير معروف',
        homeLogo: match.homeTeam?.slug || '🏃',
        awayLogo: match.awayTeam?.slug || '🏃'
    };
}

// إنشاء بطاقة مباراة HTML
function createMatchCard(match) {
    const isLive = match.status === 'LIVE' || match.minute > 0;
    
    return `
        <div class="match-card glass rounded-2xl p-6 relative overflow-hidden group cursor-pointer" 
             onclick="window.location.href='/match.html?id=${match.id}'">
            
            ${isLive ? `
                <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-orange-500 to-red-500 animate-pulse"></div>
                <div class="absolute top-4 right-4 flex items-center gap-2">
                    <span class="live-pulse w-2 h-2 bg-red-500 rounded-full"></span>
                    <span class="text-sm font-bold text-red-500">LIVE</span>
                    <span class="text-sm bg-red-500/20 px-2 py-1 rounded-full">${match.minute}'</span>
                </div>
            ` : `
                <div class="absolute top-4 right-4 text-sm text-gray-500">${match.time || '20:45'}</div>
            `}
            
            <!-- League info -->
            <div class="flex items-center gap-2 mb-6">
                <i class="fas fa-trophy text-yellow-500"></i>
                <span class="text-sm text-gray-400">${match.league}</span>
            </div>
            
            <!-- Teams and score -->
            <div class="flex items-center justify-between mb-6">
                <div class="text-center flex-1">
                    <div class="w-16 h-16 mx-auto mb-2 bg-white/5 rounded-full flex items-center justify-center text-3xl">
                        ${match.homeLogo}
                    </div>
                    <h3 class="font-bold truncate">${match.homeTeam}</h3>
                </div>
                
                <div class="flex items-center gap-4 px-4">
                    <span class="text-4xl font-black score-value">${match.homeScore}</span>
                    <span class="text-2xl text-gray-500">-</span>
                    <span class="text-4xl font-black score-value">${match.awayScore}</span>
                </div>
                
                <div class="text-center flex-1">
                    <div class="w-16 h-16 mx-auto mb-2 bg-white/5 rounded-full flex items-center justify-center text-3xl">
                        ${match.awayLogo}
                    </div>
                    <h3 class="font-bold truncate">${match.awayTeam}</h3>
                </div>
            </div>
            
            <!-- Hover stats preview -->
            <div class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <div class="text-sm space-y-2">
                    <div class="flex justify-between">
                        <span>استحواذ</span>
                        <span>52% - 48%</span>
                    </div>
                    <div class="flex justify-between">
                        <span>تسديدات</span>
                        <span>8 - 6</span>
                    </div>
                    <div class="flex justify-between">
                        <span>على المرمى</span>
                        <span>4 - 3</span>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// تحديث المباريات في الواجهة
function renderMatches(matches) {
    if (!matches || matches.length === 0) {
        matchesGrid.innerHTML = `
            <div class="col-span-3 text-center py-12">
                <i class="fas fa-futbol text-6xl text-gray-600 mb-4"></i>
                <p class="text-gray-400">لا توجد مباريات مباشرة الآن</p>
            </div>
        `;
        return;
    }
    
    matchesGrid.innerHTML = matches
        .map(m => createMatchCard(formatMatch(m)))
        .join('');
}

// جلب وتحديث المباريات
async function updateLiveMatches() {
    hideError();
    loadingSpinner.classList.remove('hidden');
    
    try {
        const matches = await fetchAllLiveMatches();
        liveMatches = matches;
        renderMatches(matches);
        
        // تحديث عنوان الصفحة بعدد المباريات
        if (matches.length > 0) {
            document.title = `(${matches.length}) OMNIA SPORTS - مباريات مباشرة`;
        }
    } catch (error) {
        console.error('Update failed:', error);
        showError('فشل تحديث المباريات. حاول تحديث الصفحة.');
    } finally {
        loadingSpinner.classList.add('hidden');
    }
}

// بدء التحديث التلقائي
function startAutoRefresh() {
    updateLive
