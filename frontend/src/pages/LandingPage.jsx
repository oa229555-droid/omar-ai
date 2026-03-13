import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { 
  ChatBubbleLeftIcon, 
  CodeBracketIcon, 
  LanguageIcon, 
  DocumentTextIcon,
  LightBulbIcon,
  PhotoIcon,
  SpeakerWaveIcon,
  MicrophoneIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline'

export const LandingPage = () => {
  const features = [
    { icon: ChatBubbleLeftIcon, title: 'دردشة ذكية', desc: 'تحدث مع الذكاء الاصطناعي بكل سلاسة' },
    { icon: CodeBracketIcon, title: 'توليد أكواد', desc: 'اكتب أي كود برمجي بلغات متعددة' },
    { icon: LanguageIcon, title: 'ترجمة فورية', desc: 'ترجم بين 100+ لغة' },
    { icon: DocumentTextIcon, title: 'تلخيص نصوص', desc: 'لخص المقالات الطويلة في ثوان' },
    { icon: LightBulbIcon, title: 'توليد أفكار', desc: 'احصل على أفكار مشاريع مبتكرة' },
    { icon: PhotoIcon, title: 'توليد صور', desc: 'حول النصوص لصور مذهلة' },
    { icon: SpeakerWaveIcon, title: 'نص إلى صوت', desc: 'حول النص لكلام طبيعي' },
    { icon: MicrophoneIcon, title: 'صوت إلى نص', desc: 'اكتب ما تقوله بدقة' }
  ]

  const models = [
    { name: 'GPT-4 Turbo', provider: 'OpenAI', icon: '🚀', color: 'from-green-500 to-emerald-700' },
    { name: 'Claude 3', provider: 'Anthropic', icon: '🧠', color: 'from-purple-500 to-pink-700' },
    { name: 'Gemini Pro', provider: 'Google', icon: '⚡', color: 'from-blue-500 to-cyan-700' },
    { name: 'Mixtral 8x7B', provider: 'Groq', icon: '🔥', color: 'from-orange-500 to-red-700' }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-black mb-6">
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                OMNIA AI
              </span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-10">
              منصة الذكاء الاصطناعي الأشمل في العالم. دردش، اكتب أكواد، حلل بيانات، وولد صور 
              <br />باستخدام أقوى النماذج في مكان واحد.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/chat"
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-bold hover:opacity-90 transition-all hover:scale-105 shadow-lg hover:shadow-purple-500/50"
              >
                ابدأ المحادثة مجاناً
              </Link>
              <Link
                to="/pricing"
                className="px-8 py-4 bg-gray-200 dark:bg-gray-800 rounded-xl font-bold hover:bg-gray-300 dark:hover:bg-gray-700 transition-all"
              >
                شاهد الخطط
              </Link>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mt-20"
          >
            {[
              { value: '50M+', label: 'محادثة' },
              { value: '100K+', label: 'مستخدم' },
              { value: '99.9%', label: 'دقة' },
              { value: '24/7', label: 'دعم' }
            ].map((stat, i) => (
              <div key={i} className="text-center p-6 rounded-2xl bg-white/5 backdrop-blur-lg border border-white/10">
                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">{stat.value}</div>
                <div className="text-gray-600 dark:text-gray-400">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-gray-50 dark:bg-gray-800/50">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              مميزات خارقة
            </span>
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="p-6 rounded-2xl bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all border border-gray-200 dark:border-gray-700"
              >
                <feature.icon className="w-12 h-12 text-purple-600 mb-4" />
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Models Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              أشهر النماذج العالمية
            </span>
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {models.map((model, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className={`p-6 rounded-2xl bg-gradient-to-br ${model.color} text-white shadow-xl`}
              >
                <div className="text-4xl mb-4">{model.icon}</div>
                <h3 className="text-xl font-bold mb-1">{model.name}</h3>
                <p className="text-sm opacity-90 mb-3">{model.provider}</p>
                <div className="flex gap-2">
                  <span className="px-2 py-1 bg-white/20 rounded-full text-xs">128K</span>
                  <span className="px-2 py-1 bg-white/20 rounded-full text-xs">مجاني</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-purple-600 to-blue-600">
        <div className="container mx-auto text-center text-white">
          <h2 className="text-4xl font-bold mb-4">ابدأ رحلتك مع OMNIA AI</h2>
          <p className="text-xl opacity-90 mb-8">أول 1000 محادثة مجانية - جرب الآن</p>
          <Link
            to="/register"
            className="inline-block px-8 py-4 bg-white text-purple-600 rounded-xl font-bold hover:bg-gray-100 transition-all hover:scale-105"
          >
            أنشئ حساب مجاني
          </Link>
        </div>
      </section>
    </div>
  )
}
