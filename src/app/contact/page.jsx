"use client";
import { motion } from 'framer-motion';
import { FiMapPin, FiPhone, FiMail, FiClock } from 'react-icons/fi';

export default function ContactPage() {
  return (
    <main className="min-h-screen pt-20 px-4 text-white">
      <div className="max-w-6xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl font-bold text-center mb-4"
        >
          تواصل معنا
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-xl text-gray-300 text-center mb-12"
        >
          فريقنا جاهز للإجابة على استفساراتك
        </motion.p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* معلومات الاتصال */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10">
              <h2 className="text-2xl font-bold mb-6">معلومات الاتصال</h2>
              
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors">
                  <FiPhone className="w-6 h-6 text-green-400" />
                  <div>
                    <p className="text-sm text-gray-400">الهاتف</p>
                    <p className="text-lg font-semibold" dir="ltr">{process.env.NEXT_PUBLIC_PHONE_NUMBER}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors">
                  <FiMail className="w-6 h-6 text-blue-400" />
                  <div>
                    <p className="text-sm text-gray-400">البريد الإلكتروني</p>
                    <p className="text-lg font-semibold">{process.env.NEXT_PUBLIC_EMAIL}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors">
                  <FiClock className="w-6 h-6 text-yellow-400" />
                  <div>
                    <p className="text-sm text-gray-400">ساعات العمل</p>
                    <p className="text-lg font-semibold">٩:٠٠ صباحاً - ٩:٠٠ مساءً</p>
                    <p className="text-sm text-gray-400">طوال أيام الأسبوع</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* نموذج الاتصال */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10"
          >
            <h2 className="text-2xl font-bold mb-6">أرسل لنا رسالة</h2>
            
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">الاسم</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all text-white"
                  placeholder="أدخل اسمك"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">البريد الإلكتروني</label>
                <input
                  type="email"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all text-white"
                  placeholder="أدخل بريدك الإلكتروني"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">الرسالة</label>
                <textarea
                  rows="5"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all text-white"
                  placeholder="اكتب رسالتك هنا..."
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl font-bold text-lg hover:shadow-2xl hover:shadow-purple-500/30 transition-all duration-300 transform hover:scale-105"
              >
                إرسال الرسالة
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
