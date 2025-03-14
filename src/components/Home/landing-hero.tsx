"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import { LayoutGroup, motion } from "framer-motion"
// Aşağıdaki importlar, senin paylaştığın örnek component dosyalarına göre ayarlanmalıdır.
import Floating, { FloatingElement } from "@/components/Home/parallax-floating"
import { TextRotate } from "@/components/Home/text-rorate"
import Image from "next/image"
import Navbar from "@/components/Headers/navbar"

const islamicImages = [
  {
    image: "/images/kabe.png",
    title: "Kabe",
  },
  {
    image: "/images/mescidi-nebevi.png",
    title: "Mescid-i Nebevi",
  },
  {
    image: "/images/kuran.png",
    title: "Kur'an-ı Kerim",
  },
  {
    image: "/images/minareler.png",
    title: "Minareler",
  },
  {
    image: "/images/cami-avlusu.png",
    title: "Cami avlusu",
  },
]

/**
 * Anasayfanın üst bölümünde, parallax-floating ve animasyonlu yazı örneğini
 * İslamî temalarla kullanabileceğin bir component. 
 * Bunu ister 'landing-hero.tsx' dosyası yapıp import et, 
 * ister doğrudan sayfana kopyala.
 */
export function LandingHero() {
  return (
    <section className="w-full h-[80vh] overflow-hidden md:overflow-visible flex flex-col items-center justify-center relative">
      {/* Parallax-Floating yapısı */}
      <Floating sensitivity={-0.5} className="h-full">
        {/* 1. Görsel */}
        <FloatingElement
          depth={0.5}
          className="top-[15%] left-[2%] md:top-[25%] md:left-[5%]"
        >
          <motion.img
            src={islamicImages[0].image}
            alt={islamicImages[0].title}
            className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 object-cover hover:scale-105 duration-200 cursor-pointer transition-transform -rotate-[3deg] shadow-2xl rounded-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          />
        </FloatingElement>

        {/* 2. Görsel */}
        <FloatingElement
          depth={1}
          className="top-[0%] left-[8%] md:top-[6%] md:left-[11%]"
        >
          <motion.img
            src={islamicImages[1].image}
            alt={islamicImages[1].title}
            className="w-32 h-24 sm:w-36 sm:h-28 md:w-44 md:h-36 lg:w-52 lg:h-40 object-cover hover:scale-105 duration-200 cursor-pointer transition-transform -rotate-12 shadow-2xl rounded-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          />
        </FloatingElement>

        {/* 3. Görsel */}
        <FloatingElement
          depth={4}
          className="top-[90%] left-[6%] md:top-[80%] md:left-[8%]"
        >
          <motion.img
            src={islamicImages[2].image}
            alt={islamicImages[2].title}
            className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-56 lg:h-56 object-cover -rotate-[4deg] hover:scale-105 duration-200 cursor-pointer transition-transform shadow-2xl rounded-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
          />
        </FloatingElement>

        {/* 4. Görsel */}
        <FloatingElement
          depth={2}
          className="top-[0%] left-[87%] md:top-[2%] md:left-[83%]"
        >
          <motion.img
            src={islamicImages[3].image}
            alt={islamicImages[3].title}
            className="w-32 h-28 sm:w-40 sm:h-36 md:w-48 md:h-42 lg:w-56 lg:h-48 object-cover hover:scale-105 duration-200 cursor-pointer transition-transform shadow-2xl rotate-[6deg] rounded-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
          />
        </FloatingElement>

        {/* 5. Görsel */}
        <FloatingElement
          depth={1}
          className="top-[78%] left-[83%] md:top-[68%] md:left-[83%]"
        >
          <motion.img
            src={islamicImages[4].image}
            alt={islamicImages[4].title}
            className="w-36 h-36 sm:w-52 sm:h-52 md:w-60 md:h-60 lg:w-68 lg:h-68 object-cover hover:scale-105 duration-200 cursor-pointer transition-transform shadow-2xl rotate-[19deg] rounded-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.3 }}
          />
        </FloatingElement>
      </Floating>

      {/* Ortadaki büyük başlık ve açıklama alanı */}
      <div className="flex flex-col justify-center items-center w-[280px] sm:w-[350px] md:w-[550px] lg:w-[750px] z-50 pointer-events-auto px-4">
        <motion.h1
          className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl text-center w-full flex-col flex whitespace-pre leading-tight font-bold tracking-tight space-y-2 sm:space-y-4 text-emerald-800 dark:text-emerald-300"
          animate={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.4, ease: "easeOut", delay: 0.3 }}
        >
          <span className="mb-2">Nur Bilgi</span>
          <LayoutGroup>
            <motion.span layout className="flex flex-wrap items-center justify-center">
              İslami Bilgiyle
              <TextRotate
                texts={[
                  "nurlanın.",
                  "zihninizi aydınlatın.",
                  "imanınızı güçlendirin.",
                  "kalbinizi ferahlatın.",
                  "hayatınızı bereketlendirin.",
                ]}
                mainClassName="overflow-visible min-w-[300px] px-2 text-emerald-500"
                rotationInterval={2500}
                staggerDuration={0.04}
                staggerFrom="first"
              />
            </motion.span>
          </LayoutGroup>
        </motion.h1>

        <motion.p
          className="text-sm sm:text-lg md:text-xl lg:text-2xl text-center mt-3 sm:mt-6 md:mt-8 lg:mt-10 text-emerald-700 dark:text-emerald-400"
          animate={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.4, ease: "easeOut", delay: 0.5 }}
        >
          Dini sorularınızı sorun, ibadetlerinizi takip edin, 
          Kur'an-ı Kerim okuyun ve daha fazlası için tek adresiniz.
        </motion.p>

        <div className="flex flex-wrap gap-4 justify-center mt-8">
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.4, ease: "easeOut", delay: 0.7 }}
          >
            <Link
              href="/chatbot"
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-lg transition-colors text-sm sm:text-base"
            >
              Sorularınızı Sorun
            </Link>
          </motion.div>

          <motion.div
            animate={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.4, ease: "easeOut", delay: 0.9 }}
          >
            <Link
              href="/hakkimizda"
              className="px-6 py-3 border border-emerald-600 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg shadow-lg transition-colors text-sm sm:text-base"
            >
              Bize Ulaşın
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default LandingHero;
