import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import CartButton from "../components/cart/CartButton";
import Footer from "../components/menu/footer";
import Menu, { type Item } from "../components/menu/Menu";
import ItemModal from "../components/menu/ItemModal";
import ItemDetailsDrawer from "../components/menu/ItemDetailsDrawer";
import { HiSparkles } from "react-icons/hi";
import FeaturedModal from "../components/menu/FeaturedModal";
import LoadingScreen from "../components/common/LoadingScreen";
import { motion } from "framer-motion";
import { FirebaseService } from "../services/firebaseService";
import OrderStatusButton from "../components/cart/OrderStatusButton";
import GlassButton from "../components/common/GlassButton";

export default function MenuPage() {
  const { t } = useTranslation();

  const [showFeaturedModal, setShowFeaturedModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isDataReady, setIsDataReady] = useState(false);
  const [hasFeatured, setHasFeatured] = useState(false);
  const [featuredItems, setFeaturedItems] = useState<Item[]>([]);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [selectedDetailsItem, setSelectedDetailsItem] = useState<Item | null>(null);
  const [orderSystem, setOrderSystem] = useState(true);

  useEffect(() => {
    const unsubscribe = FirebaseService.listen("settings/orderSystem", (value) => {
      setOrderSystem(value ?? true);
    });
    return () => unsubscribe();
  }, []);

  const handleLoadingChange = useCallback((loading: boolean) => {
    setIsLoading(loading);
    if (!loading) setIsDataReady(true);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-(--menu-bg) text-(--menu-text) menu-wrapper overflow-x-hidden">

      {/* Loading */}
      <LoadingScreen visible={isLoading} />

      {/* ✅ Top Bar */}
      {/* ✅ Featured Button — Floating Left */}
      <div className="absolute top-4 left-4 z-50">
        {isDataReady && hasFeatured && (
          <motion.div
            initial={{ opacity: 0, x: -20, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <GlassButton
              variant="featured"
              icon={<HiSparkles size={18} />}
              onClick={() => setShowFeaturedModal(true)}
              title={t("menu.featured_items")}
            />
          </motion.div>
        )}
      </div>

      <main className="flex flex-col flex-1">

        {/*Hero Section*/}
        {/*Hero Section*/}
        <section className="relative flex flex-col items-center justify-center text-center py-16 px-6 overflow-hidden">

          {/* Background: Radial Gradient */}
          <div className="absolute inset-0 pointer-events-none" style={{
            background: "radial-gradient(circle at top, rgba(211, 30, 30, 0.10) 0%, transparent 70%)"
          }} />

          {/* Logo Container */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex items-center justify-center"
          >
            {/* Rotating Dashed Ring */}
            <motion.div
              className="absolute w-[210px] h-[210px] rounded-4xl border-3 opacity-40"
              style={{ borderColor: "var(--color-primary-500)" }}
            />

            {/* Logo Card (Matches Loading Style) */}
            <div className="relative w-[180px] h-[180px] bg-white rounded-[2.5rem] shadow-premium flex items-center justify-center z-10 border border-gray-50">
              {/* Corner Accents */}
              {[
                "top-0 left-0 border-t-4 border-l-4 rounded-tl-[2.5rem]",
                "top-0 right-0 border-t-4 border-r-4 rounded-tr-[2.5rem]",
                "bottom-0 left-0 border-b-4 border-l-4 rounded-bl-[2.5rem]",
                "bottom-0 right-0 border-b-4 border-r-4 rounded-br-[2.5rem]"
              ].map((pos, i) => (
                <div key={i} className={`absolute w-10 h-10 ${pos}`} style={{ borderColor: "var(--color-primary-500)" }} />
              ))}
              <img src="/logo.png" className="w-[220px] h-[220px] object-cover drop-shadow-2xl" alt="Logo" />
            </div>
          </motion.div>


        </section>
        {/* ✅ Menu */}
        <div className="flex-1 w-full max-w-6xl mx-auto px-0 md:px-6 pb-24">
          <Menu
            onLoadingChange={handleLoadingChange}
            onFeaturedCheck={setHasFeatured}
            onFeaturedItemsChange={setFeaturedItems}
            onItemClick={setSelectedItem}
            onDetailsClick={setSelectedDetailsItem}
          />
        </div>

      </main>

      {/* Cart */}
      {isDataReady && (
        <div className="fixed bottom-6 right-6 z-50">
          <CartButton />
        </div>
      )}

      {/* Modals */}
      <FeaturedModal
        isOpen={showFeaturedModal}
        onClose={() => setShowFeaturedModal(false)}
        orderSystem={orderSystem}
        items={featuredItems}
        onItemClick={setSelectedItem}
        onDetailsClick={setSelectedDetailsItem}
      />

      <ItemModal
        isOpen={!!selectedItem}
        onClose={() => setSelectedItem(null)}
        item={selectedItem}
      />

      <ItemDetailsDrawer
        isOpen={!!selectedDetailsItem}
        onClose={() => setSelectedDetailsItem(null)}
        item={selectedDetailsItem}
      />

      <OrderStatusButton />
      <Footer />
    </div>
  );
}