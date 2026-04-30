"use client";
import { motion } from "framer-motion";
import { Phone, Mail, Heart, User, Globe, Clock, MessageCircle } from "lucide-react";

export default function Support() {
  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent mb-4">
            فريق الدعم
          </h1>
          <p className="text-gray-400 text-lg">نحن هنا لمساعدتك 24/7</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Developer Card */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-morphism rounded-2xl p-8 hover:neon-border transition-all duration-300"
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-32 h-32 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center mb-6 animate-float">
                <User size={56} className="text-white" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Omar Abdo</h2>
              <p className="text-amber-500 mb-6">المطور الرئيسي</p>
              
              <div className="space-y-4 w-full text-right">
                <div className="flex items-center gap-4 bg-black/50 rounded-xl p-4">
                  <Phone className="text-amber-500" size={24} />
                  <div>
                    <p className="text-gray-400 text-sm">رقم الهاتف</p>
                    <p className="text-xl font-bold">01289411976</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 bg-black/50 rounded-xl p-4">
                  <Mail className="text-amber-500" size={24} />
                  <div>
                    <p className="text-gray-400 text-sm">البريد الإلكتروني</p>
                    <p className="text-xl font-bold">omar@qadeemstore.com</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 bg-black/50 rounded-xl p-4">
                  <Globe className="text-amber-500" size={24} />
                  <div>
                    <p className="text-gray-400 text-sm">الموقع</p>
                    <p className="text-xl font-bold">qadeemstore.vercel.app</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Support Info Card */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-morphism rounded-2xl p-8"
          >
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <MessageCircle className="text-amber-500" />
              معلومات الدعم
            </h3>
            
            <div className="space-y-6">
              <div>
                <h4 className="text-amber-500 font-bold mb-2">⏰ أوقات العمل</h4>
                <p className="text-gray-300">نحن متاحون طوال أيام الأسبوع 24 ساعة</p>
              </div>
              
              <div>
                <h4 className="text-amber-500 font-bold mb-2">📞 طرق التواصل</h4>
                <p className="text-gray-300">اتصال - واتساب - تلغرام - ايميل</p>
              </div>
              
              <div>
                <h4 className="text-amber-500 font-bold mb-2">💡 ماذا نقدم؟</h4>
                <ul className="text-gray-300 space-y-1 list-disc list-inside">
                  <li>دعم فني للموقع</li>
                  <li>مقترحات إضافة أنمي جديد</li>
                  <li>الإبلاغ عن مشاكل تقنية</li>
                  <li>شراكات وإعلانات</li>
                </ul>
              </div>
              
              <div className="border-t border-gray-700 pt-6 mt-6">
                <p className="text-gray-400 flex items-center justify-center gap-2">
                  Made with <Heart size={16} className="text-red-500" /> by Omar Abdo
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
          }
