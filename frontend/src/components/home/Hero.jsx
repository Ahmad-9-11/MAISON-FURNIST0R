import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Hero() {
  const videoRef = useRef(null);

  useEffect(() => {
    // Force play on mount
    if (videoRef.current) {
      videoRef.current.defaultMuted = true;
      videoRef.current.muted = true;
      videoRef.current.play().catch(err => console.error("Video play error:", err));
    }
  }, []);

  return (
    <section className="relative h-screen w-full overflow-hidden bg-zinc-900">
      {/* 1. THE VIDEO CONTAINER */}
      <div className="absolute inset-0 z-[0]">
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          className="h-full w-full object-cover opacity-100"
          style={{ visibility: 'visible' }}
        >
          <source src="/hero.mp4" type="video/mp4" />
          <source src="https://video.wixstatic.com/video/11062b_926639534571439487c6314841c7b8e1/1080p/mp4/file.mp4" type="video/mp4" />
        </video>
        {/* Dark overlay to make text pop */}
        <div className="absolute inset-0 bg-black/40 z-[1]" />
      </div>

      {/* 2. THE CONTENT LAYER */}
      <div className="relative z-[10] flex h-full flex-col justify-end pb-24 px-16 max-w-[1600px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <h1 className="font-serif text-[clamp(48px,10vw,92px)] font-light leading-[1.1] text-white mb-8">
            Modern living,<br /> timeless design
          </h1>
          <p className="max-w-xl text-xl font-light text-white/80 mb-12">
            Curated Scandinavian furniture built for comfort and longevity.
          </p>
          <Link to="/shop" className="inline-block border border-white px-10 py-4 text-white uppercase tracking-widest hover:bg-white hover:text-black transition-all">
            Explore Now
          </Link>
        </motion.div>
      </div>
    </section>
  );
}