"use client";
import { motion } from 'framer-motion';
import AIParticleBackground from '@/components/ai/AIParticleBackground';
import AIChatbot from '@/components/ai/AIChatbot';
import { FiCpu, FiCode, FiZap, FiUsers } from 'react-icons/fi';

export default function Home() {
  const services = [
    { icon: FiCpu, title: 'محركات الذكاء الاصطناعي', desc: 'نبني محركات ذكية تتعلم وتتطور مع عملك' },
    { icon: FiCode, title: 'كتابة الأكواد', desc: 'أكواد نظيفة، سريعة، وقابلة للتطوير' },
    { icon: FiZap, title: 'حلول سحابية', desc: 'نشر وتشغيل بتقنية الـ Cloud الحديثة' },
    { icon: FiUsers, title: 'استشارات تقنية', desc: 'نرشدك لأفضل الحلول التقنية لمشروعك' },
  ];

  return (
    <>
      <AIParticleBackground />
      <AIChatbot />

      <main className="relative min-h-screen text-white">
        {/* القسم الرئيسي */}
        <section className="min-h-screen flex items-center justify-center px-4">
          <div className="text-center max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-7xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-transparent bg-clip-text">
                Omar AI
              </h1>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <p className="text-2xl md:text-3xl text-gray-300 mb-8">
                حيث يلتقي الإبداع مع الذكاء الاصطناعي
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex gap-4 justify-center flex-wrap"
            >
              <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full font-bold text-lg hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-300 transform hover:scale-105">
                ابدأ مشروعك الذكي
              </button>
              <button className="px-8 py-4 bg-transparent border-2 border-purple-500 rounded-full font-bold text-lg hover:bg-purple-500/10 transition-all duration-300">
                شاهد أعمالنا
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.8 }}
              className="mt-12 text-gray-400"
            >
              <p>تواصل معنا: {process.env.NEXT_PUBLIC_PHONE_NUMBER} | {process.env.NEXT_PUBLIC_EMAIL}</p>
            </motion.div>
          </div>
        </section>

        {/* قسم الخدمات */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl font-bold text-center mb-12"
            >
              خدماتنا المتطورة
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {services.map((service, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 hover:border-purple-500/50 transition-all duration-300"
                >
                  <service.icon className="w-12 h-12 text-purple-400 mb-4" />
                  <h3 className="text-xl font-bold mb-2">{service.title}</h3>
                  <p className="text-gray-400">{service.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* قسم تجربة الذكاء الاصطناعي المباشرة */}
        <section className="py-20 px-4 bg-gradient-to-t from-blue-900/20 to-transparent">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="bg-white/5 backdrop-blur-xl rounded-3xl p-12 border border-white/10"
            >
              <FiCpu className="w-16 h-16 text-purple-400 mx-auto mb-6" />
              <h2 className="text-3xl font-bold mb-4">جرب قوة الذكاء الاصطناعي بنفسك</h2>
              <p className="text-gray-300 mb-8 text-lg">
                اضغط على أيقونة المحادثة في الزاوية اليمنى السفلى وتحدث مع مساعدنا الذكي المدعوم بـ Google Gemini
              </p>
              <div className="flex justify-center gap-4 text-sm text-gray-400">
                <span>⚡ ردود فورية</span>
                <span>🔮 فهم عميق للسياق</span>
                <span>💡 استشارات تقنية ذكية</span>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
    </>
  );
          }
