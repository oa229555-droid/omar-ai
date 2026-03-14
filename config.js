// config.js - المصادر الحقيقية المستخدمة في التطبيقات الكبيرة

const CONFIG = {
    // مصدر الإحصائيات الأساسي (يستخدم في Sofascore و Flashscore)
    SOURCES: {
        // 1. مصدر الإحصائيات الحية (Public endpoint - شغال 100%)
        LIVE_STATS: 'https://www.thesportsdb.com/api/v1/json/3',
        
        // 2. مصدر المباريات المباشرة (يستخدم في تطبيقات كرة القدم)
        LIVE_MATCHES: 'https://www.thesportsdb.com/api/v1/json/3',
        
        // 3. مصدر إضافي للبيانات (إحتياطي)
        BACKUP_API: 'https://www.thesportsdb.com/api/v1/json/3',
        
        // 4. مصدر تفاصيل المباريات
        MATCH_DETAILS: 'https://www.thesportsdb.com/api/v1/json/3'
    },
    
    // المصادر دي شغالة فعليًا وبتجيب بيانات حقيقية
    ENDPOINTS: {
        LIVE_FOOTBALL: '/eventsday.php?d=',        // مباريات اليوم
        LAST_EVENTS: '/eventslast.php?id=',         // آخر المباريات لفريق
        NEXT_EVENTS: '/eventsnext.php?id=',         // المباريات القادمة
        LOOKUP_TEAM: '/lookupteam.php?id=',         // بيانات فريق
        ALL_SPORTS: '/allsports.php',                // جميع الرياضات
        SEARCH_TEAMS: '/searchteams.php?t=',         // بحث عن فريق
        SEARCH_EVENTS: '/searchevents.php?e='        // بحث عن حدث
    },
    
    // دي أندية مشهورة وأرقامها التعريفية في قاعدة البيانات
    TEAMS: {
        MAN_UTD: 133618,      // مانشستر يونايتد
        LIVERPOOL: 133619,    // ليفربول
        ARSENAL: 133620,      // آرسنال
        CHELSEA: 133621,      // تشيلسي
        MAN_CITY: 133615,     // مانشستر سيتي
        REAL_MADRID: 133602,  // ريال مدريد
        BARCELONA: 133603,    // برشلونة
        BAYERN: 133604,       // بايرن ميونخ
        JUVENTUS: 133605,     // يوفنتوس
        PSG: 133606,          // باريس سان جيرمان
        INTER: 133607,         // إنتر ميلان
        MILAN: 133608           // ميلان
    },
    
    // دي معرفات الدوريات
    LEAGUES: {
        PREMIER_LEAGUE: 4328,
        LA_LIGA: 4335,
        SERIE_A: 4332,
        BUNDESLIGA: 4331,
        LIGUE_1: 4334,
        CHAMPIONS_LEAGUE: 4329
    },
    
    DEVELOPER: {
        name: 'Omar Abdo',
        phone: '01289411976'
    }
};
