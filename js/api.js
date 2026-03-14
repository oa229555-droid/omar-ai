// js/api.js

// مصادر البيانات المتعددة
const SOURCES = {
    sofascore: 'https://api.sofascore.com/api/v1',
    flashscore: 'https://d.flashscore.com/x/feed',
    espn: 'http://site.api.espn.com/apis/site/v2/sports/soccer'
};

// Headers متغيرة عشان ما ننكشفش
const getHeaders = () => ({
    'User-Agent': Math.random() > 0.5 
        ? 'Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36'
        : 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X)',
    'Accept': 'application/json',
    'Referer': 'https://www.google.com/',
    'Origin': 'https://www.google.com'
});

// 1️⃣ جلب المباريات من SofaScore (المصدر الرئيسي)
export const fetchSofaScoreMatches = async () => {
    try {
        const today = new Date().toISOString().split('T')[0];
        const response = await fetch(
            `${SOURCES.sofascore}/sport/football/scheduled-events/${today}`,
            { headers: getHeaders() }
        );
        
        if (!response.ok) throw new Error('SofaScore failed');
        
        const data = await response.json();
        return data.events || [];
    } catch (error) {
        console.warn('SofaScore error:', error);
        return [];
    }
};

// 2️⃣ جلب المباريات من ESPN
export const fetchESPNMatches = async () => {
    try {
        const response = await fetch(
            `${SOURCES.espn}/scoreboard`,
            { headers: getHeaders() }
        );
        
        if (!response.ok) throw new Error('ESPN failed');
        
        const data = await response.json();
        return data.events || [];
    } catch (error) {
        console.warn('ESPN error:', error);
        return [];
    }
};

// 3️⃣ جلب تفاصيل مباراة محددة
export const fetchMatchDetails = async (matchId) => {
    try {
        // نجرب من أكتر من مصدر
        const sources = [
            fetch(`${SOURCES.sofascore}/event/${matchId}`).then(r => r.json()),
            fetch(`${SOURCES.espn}/event/${matchId}`).then(r => r.json())
        ];
        
        const result = await Promise.any(sources);
        return result;
    } catch (error) {
        console.error('All sources failed for match:', matchId);
        return null;
    }
};

// 4️⃣ جلب إحصائيات المباراة
export const fetchMatchStats = async (matchId) => {
    try {
        const response = await fetch(
            `${SOURCES.sofascore}/event/${matchId}/statistics`,
            { headers: getHeaders() }
        );
        
        if (!response.ok) throw new Error('Stats failed');
        
        return await response.json();
    } catch (error) {
        return {
            possession: [50, 50],
            shots: [0, 0],
            shotsOnTarget: [0, 0],
            corners: [0, 0],
            fouls: [0, 0]
        };
    }
};

// 5️⃣ جلب المباريات المباشرة (بتجمع من كل المصادر)
export const fetchAllLiveMatches = async () => {
    showLoading(30);
    
    try {
        // نحاول نجيب من SofaScore الأول (أسرع)
        const sofascoreMatches = await fetchSofaScoreMatches();
        
        // لو فشل، نجيب من ESPN
        let matches = sofascoreMatches;
        if (!matches.length) {
            const espnMatches = await fetchESPNMatches();
            matches = espnMatches;
        }
        
        // تصفية المباريات المباشرة
        const liveMatches = matches.filter(m => 
            m.status?.type === 'inprogress' || 
            m.status?.description === 'LIVE'
        );
        
        showLoading(100);
        setTimeout(() => hideLoading(), 500);
        
        return liveMatches;
    } catch (error) {
        showLoading(100);
        setTimeout(() => hideLoading(), 500);
        showError('فشل تحميل المباريات');
        return [];
    }
};
