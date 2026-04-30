"use client";
import Link from "next/link";
import Image from "next/image";
import { Anime } from "@/data/animeData";
import { useState, useEffect } from "react";
import { Heart, Star, Play } from "lucide-react";
import { motion } from "framer-motion";

export default function AnimeCard({ anime }: { anime: Anime }) {
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const favs = JSON.parse(localStorage.getItem("favorites") || "[]");
    setIsFavorite(favs.includes(anime.id));
  }, [anime.id]);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    const favs = JSON.parse(localStorage.getItem("favorites") || "[]");
    let newFavs;
    if (favs.includes(anime.id)) {
      newFavs = favs.filter((id: number) => id !== anime.id);
    } else {
      newFavs = [...favs, anime.id];
    }
    localStorage.setItem("favorites", JSON.stringify(newFavs));
    setIsFavorite(!isFavorite);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.05 }}
      className="group"
    >
      <Link href={`/anime/${anime.id}`}>
        <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl overflow-hidden cursor-pointer shadow-xl hover:shadow-2xl hover:shadow-amber-500/20 transition-all duration-300">
          <div className="relative h-72 overflow-hidden">
            <Image
              src={anime.image}
              alt={anime.titleAr}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
            
            <button
              onClick={toggleFavorite}
              className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm p-2 rounded-full hover:bg-black/80 transition-all z-10"
            >
              <Heart size={18} className={isFavorite ? "fill-red-500 text-red-500" : "text-white"} />
            </button>
            
            <div className="absolute top-3 left-3 flex items-center gap-1 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-full">
              <Star size={12} className="fill-amber-500 text-amber-500" />
              <span className="text-xs text-white">{anime.rating}</span>
            </div>
            
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent">
              <span className="text-amber-400 text-sm font-bold">{anime.year}</span>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs bg-amber-600/80 px-2 py-0.5 rounded-full">{anime.category}</span>
                <span className="text-xs text-gray-300">{anime.episodes} حلقة</span>
              </div>
            </div>
          </div>
          
          <div className="p-4">
            <h3 className="font-bold text-lg group-hover:text-amber-500 transition text-center">
              {anime.titleAr}
            </h3>
            <p className="text-gray-400 text-sm text-center mt-1 line-clamp-2">{anime.description}</p>
            
            <div className="absolute inset-0 bg-amber-600/0 group-hover:bg-amber-600/10 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
              <div className="bg-amber-600 rounded-full p-3">
                <Play size={24} className="text-white fill-white" />
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
                   }
