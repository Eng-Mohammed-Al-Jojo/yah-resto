import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

interface Props {
  /** When true, screen is visible. When false, triggers fade-out. */
  visible: boolean;
  /** Called after fade-out animation completes */
  onExited?: () => void;
}

export default function LoadingScreen({ visible, onExited }: Props) {
  const { i18n } = useTranslation();
  const isRtl = i18n.language === "ar";

  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!visible) {
      setProgress(100);
      return;
    }
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) return prev;
        return prev + (95 - prev) * 0.1;
      });
    }, 200);
    return () => clearInterval(interval);
  }, [visible]);

  return (
    <AnimatePresence onExitComplete={onExited}>
      {visible && (
        <motion.div
          key="loading-screen"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
          transition={{ duration: 0.8, ease: [0.43, 0.13, 0.23, 0.96] }}
          className="fixed inset-0 z-9999 flex flex-col items-center justify-center bg-(--bg-main) overflow-hidden"
          dir={isRtl ? "rtl" : "ltr"}
        >
          {/* Ambient Glow: Radial Gradient */}
          <motion.div
            animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.15, 0.1] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            className="absolute w-[500px] h-[500px] rounded-full blur-[100px]"
            style={{ background: "radial-gradient(circle, var(--color-primary-500) 0%, transparent 70%)" }}
          />

          <div className="relative z-10 flex flex-col items-center">
            {/* The Loader Centerpiece */}
            <div className="relative flex items-center justify-center">

              {/* 3 Decorative Rotating Rings */}
              {[0.08, 0.05, 0.03].map((op, i) => (
                <motion.div
                  key={i}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 15 + i * 5, repeat: Infinity, ease: "linear" }}
                  className="absolute rounded-full border-2"
                  style={{
                    width: 200 + i * 40,
                    height: 200 + i * 40,
                    opacity: op,
                    borderColor: "var(--color-primary-500)"
                  }}
                />
              ))}

              {/* Logo Card */}
              <motion.div
                animate={{ scale: [0.98, 1.02, 0.98] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="relative w-[170px] h-[170px] bg-white rounded-3xl shadow-premium flex items-center justify-center z-10 border border-gray-50"
              >
                {/* Corner Accents */}
                {[
                  "top-0 left-0 border-t-4 border-l-4 rounded-tl-3xl",
                  "top-0 right-0 border-t-4 border-r-4 rounded-tr-3xl",
                  "bottom-0 left-0 border-b-4 border-l-4 rounded-bl-3xl",
                  "bottom-0 right-0 border-b-4 border-r-4 rounded-br-3xl"
                ].map((pos, i) => (
                  <div
                    key={i}
                    className={`absolute w-8 h-8 ${pos}`}
                    style={{ borderColor: "var(--color-primary-500)" }}
                  />
                ))}

                <img
                  src="/logo.png"
                  className="w-[180px] h-[180px] object-contain drop-shadow-xl"
                  alt="Logo"
                />
              </motion.div>
            </div>

            {/* Progress Bar Area */}
            <div className="mt-16 flex flex-col items-center">
              {/* Progress Line */}
              <div className="w-[200px] h-px bg-gray-100 relative overflow-hidden">
                <motion.div
                  className="absolute inset-y-0 right-0 shadow-[0_0_8px_var(--color-primary-400)]"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  style={{ backgroundColor: "var(--color-primary-500)" }}
                />
              </div>

              {/* Typography */}
              <div className="mt-8 text-center space-y-2">
                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-lg font-black text-gray-900 tracking-[0.2em] uppercase"
                >
                  {isRtl ? "جاري التحميل" : "Loading"}
                </motion.h2>

                <div className="flex items-center justify-center gap-4">
                  <div className="h-1px w-8 bg-gray-100" />
                  <span className="text-[10px] font-bold text-(--color-primary-500) tracking-[0.4em] uppercase opacity-60">
                    {Math.round(progress)}%
                  </span>
                  <div className="h-1px w-8 bg-gray-100" />
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Branding */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="absolute bottom-12 text-md md:text-xl font-black text-gray-300 uppercase tracking-[0.5em]"
          >
            تجربة واحدة لا تكفي
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}