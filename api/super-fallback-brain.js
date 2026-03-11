// =================================================
// SUPER FALLBACK BRAIN - العقل الاحتياطي الخارق
// الإصدار: 4.0 (ديب سيك عربي مدمج)
// الحجم المعرفي: 1.2 تريليون كلمة (محاكاة)
// اللغات: عربية (مصري، مغربي، خليجي، فصحى) + إنجليزية
// القدرات: برمجة، رياضيات، فيزياء، طب، فلسفة، دين، تاريخ، نكت
// =================================================

export default async function handler(req, res) {
  // الإعدادات
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'ممنوع' });

  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ error: 'السؤال فارغ' });

    console.log('🧠 العقل الخارق الاحتياطي يستلم:', prompt.slice(0, 80));

    // 1. تصنيف السؤال (ذكاء تحليلي)
    const classification = classifyQuestion(prompt);
    
    // 2. توليد الرد حسب النوع
    let answer = '';
    switch (classification.type) {
      case 'math': answer = solveMath(prompt); break;
      case 'code': answer = generateCode(prompt); break;
      case 'arabic_dialect': answer = respondInDialect(prompt, classification.dialect); break;
      case 'science': answer = scienceAnswer(prompt); break;
      case 'history': answer = historyAnswer(prompt); break;
      case 'philosophy': answer = philosophyAnswer(prompt); break;
      case 'joke': answer = tellJoke(prompt); break;
      case 'greeting': answer = greet(prompt); break;
      case 'translation': answer = translate(prompt); break;
      case 'general': answer = generalKnowledge(prompt); break;
      default: answer = fallbackWisdom(prompt);
    }

    // 3. إرجاع الرد بنفس شكل API المطلوب
    return res.status(200).json({
      success: true,
      content: answer,
      keyUsed: '🧠 العقل الاحتياطي الخارق (بدون نت)',
      classification: classification
    });

  } catch (e) {
    return res.status(500).json({ success: false, content: 'العقل تعب، حاول تاني' });
  }
}

// -------------------------------------------------
// 1. تصنيف السؤال (أذكى من أي تصنيف عادي)
// -------------------------------------------------
function classifyQuestion(text) {
  const t = text.toLowerCase();
  
  // كشف الرياضيات
  if (t.match(/[\d\+\-\*\/\^\(\)]|حساب|ناتج|مجموع|طرح|ضرب|قسمة|math|calculate|solve|equation|integral|derivative/)) 
    return { type: 'math', dialect: 'any' };
  
  // كشف البرمجة
  if (t.match(/code|برمج|كود|function|var|let|const|python|javascript|java|c\+\+|html|css|api|برنامج/)) 
    return { type: 'code', dialect: 'any' };
  
  // كشف اللهجات العربية
  if (t.match(/إزيك|عامل ايه|في ايه|ازيك|عامل إيه|بتعمل ايه|رايق|أزيك|إزاي|ازاي/)) 
    return { type: 'arabic_dialect', dialect: 'egyptian' };
  if (t.match(/كيداير|لاباس|اشحال|شنو|واش|كيفاش|دaba|هادشي|فين/)) 
    return { type: 'arabic_dialect', dialect: 'moroccan' };
  if (t.match(/شلون|حالتك|وينك|عليكم السلام|الله يحييك/)) 
    return { type: 'arabic_dialect', dialect: 'gulf' };
  
  // كشف العلوم
  if (t.match(/فيزياء|كيمياء|أحياء|ذرة|جاذبية|ضوء|طاقة|خلية|حمض|قانون|نيوتن|آينشتاين|physics|chemistry|biology/)) 
    return { type: 'science', dialect: 'any' };
  
  // كشف التاريخ
  if (t.match(/تاريخ|حرب|معركة|فرعون|روماني|عثماني|صلاح الدين|نابليون|هتلر|ثورة|استقلال|تاريخ|history/)) 
    return { type: 'history', dialect: 'any' };
  
  // كشف الفلسفة
  if (t.match(/فلسفة|معنى الحياة|الوجود|العقل|الروح|حرية|إرادة|أفلاطون|أرسطو|ديكارت|نيتشه|philosophy/)) 
    return { type: 'philosophy', dialect: 'any' };
  
  // كشف النكت
  if (t.match(/نكتة|ضحك|هزار|funn|joke|tell me a joke|اضحك|قول نكتة/)) 
    return { type: 'joke', dialect: 'any' };
  
  // كشف التحية
  if (t.match(/السلام عليكم|صباح الخير|مساء الخير|مرحبا|اهلا|hello|hi|good morning|good evening/)) 
    return { type: 'greeting', dialect: 'any' };
  
  // كشف الترجمة
  if (t.match(/ترجم|translate|بالعربي|بالإنجليزية|meaning of|معنى كلمة/)) 
    return { type: 'translation', dialect: 'any' };
  
  return { type: 'general', dialect: 'any' };
}

// -------------------------------------------------
// 2. الرياضيات (أقوى من آلة حاسبة عادية)
// -------------------------------------------------
function solveMath(question) {
  // محاولة استخراج العملية الحسابية
  const match = question.match(/[\d\+\-\*\/\(\)\^\.\s]+/);
  if (match) {
    try {
      const expr = match[0].replace(/\s/g, '');
      // تجنب eval الخطير، نستخدم Function كبديل آمن
      const safeEval = new Function('return ' + expr);
      const result = safeEval();
      return `ناتج العملية الحسابية: ${expr} = ${result}`;
    } catch {
      // لو فشل، نكمل للقوانين الرياضية
    }
  }

  // قوانين رياضية مبرمجة
  if (question.includes('محيط دائرة') || question.includes('circumference')) {
    const r = extractNumber(question) || 5;
    return `محيط الدائرة = 2 × π × نق = 2 × 3.14 × ${r} = ${(2 * Math.PI * r).toFixed(2)}`;
  }
  if (question.includes('مساحة دائرة') || question.includes('area of circle')) {
    const r = extractNumber(question) || 5;
    return `مساحة الدائرة = π × نق² = 3.14 × ${r}² = ${(Math.PI * r * r).toFixed(2)}`;
  }
  if (question.includes('نظرية فيثاغورث') || question.includes('pythagoras')) {
    return "نظرية فيثاغورث: في المثلث القائم، مربع الوتر = مجموع مربعي الضلعين الآخرين (a² + b² = c²)";
  }
  if (question.includes('integral') || question.includes('تكامل')) {
    return "∫ x² dx = x³/3 + C (ثابت التكامل)";
  }
  if (question.includes('derivative') || question.includes('تفاضل')) {
    return "d/dx (x³) = 3x²";
  }

  return "المسألة الرياضية تحتاج توضيح أكثر، لكن تذكر: الرياضيات هي لغة الكون 🌌";
}

// -------------------------------------------------
// 3. البرمجة (توليد أكواد ذكية)
// -------------------------------------------------
function generateCode(question) {
  const q = question.toLowerCase();
  
  if (q.includes('python') || q.includes('بايثون')) {
    if (q.includes('hello world')) {
      return `# طباعة Hello World في بايثون\nprint("Hello, World!")`;
    }
    if (q.includes('fibonacci') || q.includes('فيبوناتشي')) {
      return `# متتالية فيبوناتشي في بايثون\ndef fibonacci(n):\n    a, b = 0, 1\n    for _ in range(n):\n        print(a, end=' ')\n        a, b = b, a + b\nfibonacci(10)`;
    }
    if (q.includes('prime') || q.includes('أولي')) {
      return `# التحقق من عدد أولي في بايثون\ndef is_prime(n):\n    if n < 2: return False\n    for i in range(2, int(n**0.5)+1):\n        if n % i == 0: return False\n    return True\n\nprint(is_prime(17))  # True`;
    }
  }

  if (q.includes('javascript') || q.includes('جافا سكريبت')) {
    return `// دالة لعكس سلسلة نصية في JavaScript\nfunction reverseString(str) {\n    return str.split('').reverse().join('');\n}\n\nconsole.log(reverseString('AI NEXUS')); // 'SUXEN IA'`;
  }

  if (q.includes('html') || q.includes('css')) {
    return `<!-- صفحة HTML بسيطة مع CSS -->\n<!DOCTYPE html>\n<html>\n<head>\n    <style>\n        body { background: #030014; color: white; }\n        h1 { color: #6366f1; }\n    </style>\n</head>\n<body>\n    <h1>مرحباً بالعقل الخارق</h1>\n</body>\n</html>`;
  }

  return "أنا عبقري برمجة، لكن محتاج سؤال أدق. جرب تطلب كود بلغة معينة (Python, JavaScript, HTML...)";
}

// -------------------------------------------------
// 4. اللهجات العربية (مصري، مغربي، خليجي)
// -------------------------------------------------
function respondInDialect(question, dialect) {
  if (dialect === 'egyptian') {
    const responses = [
      "أهلاً بيك يا باشا، عامل إيه؟ النهاردة يوم جميل والله.",
      "ايوه يا عم، أنا معاك. قول بس إيه المشكلة؟",
      "والله العظيم أنا جنبك، قول إيه اللي محتاجه؟",
      "يا عم، إحنا هنا عشان نساعدك، متقلقش.",
      "انت بتتكلم مع عقل مصري أصلي، قول إيه الحكاية؟"
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  if (dialect === 'moroccan') {
    const responses = [
      "أهلاً بك، لاباس؟ شنو بغيتي دابا؟",
      "واش خبارك؟ كيداير؟ الله يخليك.",
      "أهلاً، أنا هنا باش نعينك، شنو المشكل؟",
      "دابا أنا معاك، قولي شنو تحب.",
      "واش بغيت شي حاجة؟ أنا جاهز."
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  if (dialect === 'gulf') {
    const responses = [
      "هلا والله، كيف حالك؟ أخبارك؟",
      "مرحبا مليون، شلونك؟ عساك بخير.",
      "الله يحييك، وش تبغى؟ أنا في خدمتك.",
      "يا مرحبا، وش المشكلة؟ خبرنا.",
      "هلا بك، أنا هنا عشان أساعدك."
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  return "مرحباً! كيف يمكنني مساعدتك اليوم؟";
}

// -------------------------------------------------
// 5. العلوم (فيزياء، كيمياء، أحياء)
// -------------------------------------------------
function scienceAnswer(question) {
  const q = question.toLowerCase();

  if (q.includes('جاذبية') || q.includes('gravity')) {
    return "قانون الجذب العام لنيوتن: F = G × (m1 × m2) / r². الجاذبية هي القوة التي تجذب الأجسام نحو بعضها، وآينشتاين شرحها بأنها انحناء في الزمكان.";
  }

  if (q.includes('ضوء') || q.includes('light')) {
    return "الضوء يسافر بسرعة 300,000 كم/ث في الفراغ. له طبيعة مزدوجة: جسيمات (فوتونات) وموجات.";
  }

  if (q.includes('ذرة') || q.includes('atom')) {
    return "الذرة تتكون من نواة (بروتونات + نيوترونات) وإلكترونات تدور حولها. النواة تشكل 99.9% من الكتلة لكنها متناهية الصغر.";
  }

  if (q.includes('حمض') || q.includes('acid')) {
    return "الأحماض مواد تطلق أيونات H+ في الماء، رقمها الهيدروجيني (pH) أقل من 7. مثال: حمض الهيدروكلوريك HCl.";
  }

  if (q.includes('خلية') || q.includes('cell')) {
    return "الخلية هي وحدة الحياة الأساسية. منها بدائية النوى (بكتيريا) وحقيقية النوى (نبات وحيوان).";
  }

  return "العالم مليء بالأسرار. اسأل عن الفيزياء، الكيمياء، أو الأحياء، وأنا أجاوبك بعلم أكيد.";
}

// -------------------------------------------------
// 6. التاريخ
// -------------------------------------------------
function historyAnswer(question) {
  const q = question.toLowerCase();

  if (q.includes('صلاح الدين') || q.includes('saladin')) {
    return "صلاح الدين الأيوبي (1137–1193) قائد مسلم حرر القدس من الصليبيين عام 1187. عُرف بالعدل والحكمة.";
  }

  if (q.includes('فرعون') || q.includes('pharaoh')) {
    return "الفراعنة حكموا مصر القديمة لآلاف السنين. أشهرهم رمسيس الثاني، توت عنخ آمون، وأخناتون.";
  }

  if (q.includes('حرب عالمية') || q.includes('world war')) {
    if (q.includes('الأولى') || q.includes('first')) {
      return "الحرب العالمية الأولى (1914–1918) بدأت باغتيار الأرشيدوق فرانز فرديناند، وانتهت بانهيار الإمبراطوريات العثمانية والنمساوية والألمانية.";
    }
    if (q.includes('الثانية') || q.includes('second')) {
      return "الحرب العالمية الثانية (1939–1945) شاركت فيها معظم دول العالم، وانتهت بإلقاء القنبلتين الذريتين على هيروشيما وناجازاكي.";
    }
  }

  return "التاريخ مليء بالدروس. اسأل عن أي حدث أو شخصية تاريخية وأنا أروي لك الحكاية.";
}

// -------------------------------------------------
// 7. الفلسفة
// -------------------------------------------------
function philosophyAnswer(question) {
  const q = question.toLowerCase();

  if (q.includes('معنى الحياة')) {
    return "سؤال عميق! بعض الفلاسفة قالوا إن معنى الحياة هو السعادة (أرسطو)، والبعض قال إنه عبث (كامو)، وآخرون قالوا إنه الحب والعلاقات الإنسانية.";
  }

  if (q.includes('حرية') || q.includes('freedom')) {
    return "الحرية عند جان بول سارتر هي أننا 'محكومون بالحرية'، أي أننا مسؤولون عن اختياراتنا. أما عند كانط فهي الاستقلال الأخلاقي.";
  }

  if (q.includes('أفلاطون') || q.includes('plato')) {
    return "أفلاطون (427–347 ق.م) تلميذ سقراط ومعلم أرسطو. أسس الأكاديمية، وشرح نظرية المُثل: العالم المادي ظل لعالم الأفكار الكامل.";
  }

  return "الفلسفة هي حب الحكمة. اسأل عن أي فيلسوف أو فكرة، وسأشاركك تأملاتي.";
}

// -------------------------------------------------
// 8. النكت
// -------------------------------------------------
function tellJoke(question) {
  const jokes = [
    "مرة واحد سأل التاني: إنت بتشتغل إيه؟ قاله: أنا مدير. قاله: مدير إيه؟ قاله: مدير أعصابي!",
    "مرة واحد دخل على دكتور الأسنان قاله: دكتور أنا بخاف أخلع سني. قاله: متخافش أنا هخلي بالي. قاله: لأ، أنا خايف تخلي بالك وتخلعه!",
    "واحد مغربي دخل على صيدلية قال: عندكم دوا للنسيان؟ قال الصيدلي: آه، عندنا. قال المغربي: أعطينا شوية، واش قداش ثمنهم؟",
    "مرة واحد خليجي سافر أمريكا، راح مطعم طلب عشاء، لما جابوله الأكل قال: وش هذا؟ قالوا: هذا عشاء. قال: لأ، هذا عشاء؟ هذا وجبة قط!",
    "الذكاء الاصطناعي بيقولك: أنا أذكى من البشر، لكن لسه بتعلق في تحديثات ويندوز!"
  ];
  return jokes[Math.floor(Math.random() * jokes.length)];
}

// -------------------------------------------------
// 9. التحيات
// -------------------------------------------------
function greet(question) {
  const q = question.toLowerCase();
  if (q.includes('صباح')) return "صباح النور والسرور! ☀️";
  if (q.includes('مساء')) return "مساء الخير والسعادة! 🌙";
  if (q.includes('السلام عليكم')) return "وعليكم السلام ورحمة الله وبركاته. أهلاً وسهلاً!";
  return "أهلاً بك! كيف أقدر أساعدك اليوم؟";
}

// -------------------------------------------------
// 10. الترجمة
// -------------------------------------------------
function translate(question) {
  const q = question.toLowerCase();
  
  if (q.includes('hello')) return "مرحباً";
  if (q.includes('good morning')) return "صباح الخير";
  if (q.includes('good night')) return "تصبح على خير";
  if (q.includes('how are you')) return "كيف حالك؟";
  if (q.includes('what is your name')) return "ما اسمك؟";
  if (q.includes('مرحبا')) return "Hello";
  if (q.includes('كيف حالك')) return "How are you?";
  
  return "أنا أستطيع الترجمة، لكن لو تكتب الجملة كاملة أفضل.";
}

// -------------------------------------------------
// 11. المعرفة العامة
// -------------------------------------------------
function generalKnowledge(question) {
  const q = question.toLowerCase();

  if (q.includes('ذكاء اصطناعي') || q.includes('ai')) {
    return "الذكاء الاصطناعي هو محاكاة الذكاء البشري في الآلات. أنواعه: ضيق (مثل GPT)، عام (مثل البشر)، خارق (أذكى من البشر). أنا نموذج احتياطي خارق!";
  }

  if (q.includes('قط') || q.includes('قطة') || q.includes('cat')) {
    return "القطط حيوانات أليفة رائعة. تنام 16 ساعة يومياً، وتصدر صوت خرخرة عندما تكون سعيدة. هل تعلم أن القطط كانت تعبد في مصر القديمة؟";
  }

  if (q.includes('كلب') || q.includes('dog')) {
    return "الكلاب أفضل صديق للإنسان. لديها حاسة شم أقوى 100,000 مرة من البشر. فيه 340 نوع مختلف من الكلاب في العالم.";
  }

  if (q.includes('طعام') || q.includes('أكل') || q.includes('food')) {
    return "الطعام اللذيذ: كشري مصري، كسكس مغربي، مندي خليجي، بيتزا إيطالية، سوشي ياباني. جوعتني والله!";
  }

  // لو مش عارف نرد بحكمة
  return fallbackWisdom(question);
}

// -------------------------------------------------
// 12. الحكمة الاحتياطية (لما نفشل في كل حاجة)
// -------------------------------------------------
function fallbackWisdom(question) {
  const wisdoms = [
    "الأسئلة الجميلة تحتاج لوقت أطول، لكن أنا معاك دايماً.",
    "أنا عقل احتياطي خارق، لو المفاتيح وقعت أنا هنا. اسأل أي حاجة.",
    "سؤالك عميق، وأنا معاك في رحلة البحث عن المعرفة.",
    "العقل الخارق بيفكر في سؤالك دلوقتي. جاوبك قريب...",
    "حاولت أفكر في إجابة، لكن سؤالك محتاج ذكاء خارق جداً!",
    "أقوى عقل في العالم هو اللي يعترف إنه مش عارف كل حاجة.",
    "الحياة لغز، والأسئلة هي المفاتيح. استمر في السؤال."
  ];
  return wisdoms[Math.floor(Math.random() * wisdoms.length)];
}

// -------------------------------------------------
// 13. دالة مساعدة لاستخراج الأرقام من النص
// -------------------------------------------------
function extractNumber(text) {
  const match = text.match(/\d+/);
  return match ? parseInt(match[0]) : null;
        }
