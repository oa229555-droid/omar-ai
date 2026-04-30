"use client";
import { animeList } from "@/data/animeData";
import AnimeCard from "@/components/AnimeCard";
import { motion } from "framer-motion";
import { Sparkles, Flame, Clock, TrendingUp } from "lucide-react";
import { useInView } from "react-intersection-observer";

export default function Home() {
  const [ref, inView] = useInView({ triggerOnce: true });

  const featured = animeList.slice(0, 8);
  const classics = animeList.slice(8, 20);
  const sports = animeList.filter(a => a.category === "رياضة").slice(0, 8);
  const action = animeList.filter(a => a.category === "أكشن").slice(0, 8);

  return (
    <div className="overflow-hidden">
      {/* Hero Section - مذهلة */}
      <section className="relative h-[70vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-black/90 to-amber-900/20 z-0" />
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="relative z-10 text-center px-4"
        >
          <motion.h1 
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-6xl md:text-8xl font-bold mb-6"
          >
            <span className="bg-gradient-to-r from-amber-400 via-orange-500 to-amber-400 bg-clip-text text-transparent animate-gradient">
              قديم استور
            </span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-xl md:text-2xl text-gray-300 mb-8"
          >
            أرشيف الأنمي الخالد - استرجع ذكريات الطفولة
          </motion.p>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap gap-4 justify-center"
          >
            <span className="glass-morphism px-6 py-3 rounded-full flex items-center gap-2">
              <Clock size={18} className="text-amber-500" />
              80+ أنمي كلاسيكي
            </span>
            <span className="glass-morphism px-6 py-3 rounded-full flex items-center gap-2">
              <Flame size={18} className="text-amber-500" />
              أكثر من 5000 حلقة
            </span>
            <span className="glass-morphism px-6 py-3 rounded-full flex items-center gap-2">
              <TrendingUp size={18} className="text-amber-500" />
              مجاني 100%
            </span>
          </motion.div>
        </motion.div>
      </section>

      {/* Featured Section */}
      <section className="container mx-auto px-4 py-16" ref={ref}>
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-3 mb-8"
        >
          <Sparkles className="text-amber-500" size={28} />
          <h2 className="text-3xl font-bold">أشهر الأنمي</h2>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {featured.map((anime) => (
            <AnimeCard key={anime.id} anime={anime} />
          ))}
        </div>
      </section>

      {/* Classics Section */}
      <section className="container mx-auto px-4 py-16 bg-gradient-to-r from-transparent via-amber-600/5 to-transparent">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-3 mb-8"
        >
          <Flame className="text-orange-500" size={28} />
          <h2 className="text-3xl font-bold">كلاسيكيات خالدة</h2>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {classics.map((anime) => (
            <AnimeCard key={anime.id} anime={anime} />
          ))}
        </div>
      </section>

      {/* Action Section */}
      <section className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-3 mb-8"
        >
          <TrendingUp className="text-red-500" size={28} />
          <h2 className="text-3xl font-bold">أنمي الأكشن</h2>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {action.map((anime) => (
            <AnimeCard key={anime.id} anime={anime} />
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-600/20 to-orange-600/20" />
        <div className="relative z-10 container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              استعد لرحلة الحنين إلى الماضي
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              أكثر من 50 أنمي كلاسيكي في انتظارك
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
            }
