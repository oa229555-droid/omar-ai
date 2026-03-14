import { GoogleGenerativeAI } from "@google/generative-ai";

// تهيئة Gemini API
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

// دالة لإرسال رسالة والحصول على رد
export async function sendMessageToAI(message, context = "") {
  try {
    const prompt = `
      أنت مساعد ذكي لشركة Omar AI - شركة رائدة في مجال الذكاء الاصطناعي وكتابة الأكواد.
      
      معلومات الشركة:
      - الاسم: Omar AI
      - الخدمات: تطوير محركات الذكاء الاصطناعي، كتابة أكواد احترافية، دمج APIs الذكية، استشارات تقنية
      - التواصل: ${process.env.NEXT_PUBLIC_PHONE_NUMBER} - ${process.env.NEXT_PUBLIC_EMAIL}
      
      ${context ? `السياق الحالي: ${context}` : ''}
      
      المستخدم يقول: ${message}
      
      رد بطريقة ودية ومهنية، وقدم معلومات مفيدة عن خدمات الشركة.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("خطأ في الاتصال بالذكاء الاصطناعي:", error);
    return "عذراً، حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى أو التواصل معنا مباشرة على الرقم: " + process.env.NEXT_PUBLIC_PHONE_NUMBER;
  }
}
