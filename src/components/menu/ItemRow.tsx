import React, {
  useCallback,
} from "react";
import { type Item } from "./Menu";
import { FaFire } from "react-icons/fa";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { FiShoppingCart } from "react-icons/fi";

interface Props {
  item: Item;
  orderSystem: boolean;
  onClick?: (item: Item) => void;
  onDetailsClick?: (item: Item) => void;
}

const ItemRow = React.memo(
  ({ item, orderSystem, onClick }: Props) => {
    const { t } = useTranslation();

    const prices = String(item.price).split(",");
    const basePrice = Number(prices[0]);
    const unavailable = item.visible === false;
    const itemName = item.nameAr || item.name || "";
    const description = item.ingredientsAr || item.ingredients || "";
    const canOrder = !unavailable && orderSystem;

    const handleOrderClick = useCallback(
      (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (canOrder) onClick?.(item);
      },
      [canOrder, item, onClick]
    );

    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        viewport={{ once: true, margin: "50px" }}
        className={`
          relative flex items-center justify-between w-full rounded-3xl border border-primary-200
          h-[100px] pr-27 pl-2 bg-white mb-8 mr-2
          transition-all duration-300 group
          ${unavailable ? "opacity-60 grayscale mt-10 mb-10" : "hover:bg-gray-50/50 cursor-pointer"}
        `}
        onClick={handleOrderClick}
      >
        {/* IMAGE (RIGHT SIDE, ABSOLUTE, OVERFLOW) */}
        <div className="absolute right-10 translate-x-1/2 w-28 h-28 z-10">
          <img
            src={item.image ? `/images/${item.image}` : "/logo.png"}
            alt={itemName}
            loading="lazy"
            className="w-full h-full rounded-full object-cover shadow-md border-2 border-primary-500 transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/logo.png";
            }}
          />

          {/* FEATURED BADGE */}
          {(item.star || (item as any).isFeatured) && !unavailable && (
            <div className="absolute -top-1 -right-1 bg-[#B7303E] text-white p-1.5 rounded-full shadow-lg border-2 border-white animate-bounce">
              <FaFire size={10} />
            </div>
          )}
        </div>

        {/* CONTENT (CENTER-RIGHT) */}
        <div className="flex-1 text-right overflow-hidden">
          <h3 className="text-md md:text-lg lg:text-xl font-bold text-gray-900 mb-1 leading-tight truncate">
            {itemName}
          </h3>
          <p className="text-[11px] md:text-xs lg:text-sm text-gray-500 line-clamp-2 leading-relaxed font-medium">
            {description}
          </p>
        </div>

        {/* LEFT SECTION (PRICE + BUTTON) */}
        <div className="flex flex-col items-end gap-2.5 shrink-0 min-w-[90px] pl-2">
          <div className="text-[#355152] font-black text-xl flex items-center gap-0.5">
            <span className="text-sm font-bold opacity-60">₪</span>
            {basePrice}
          </div>

          {canOrder && (
            <button
              onClick={handleOrderClick}
              className="bg-[#B7303E] hover:bg-[#a02a36] text-white px-4 py-2.5 rounded-full text-xs font-black shadow-lg shadow-[#B7303E]/20 transition-all active:scale-95 uppercase tracking-wider whitespace-nowrap"
            >
              <FiShoppingCart size={14} />
            </button>
          )}

          {unavailable && (
            <span className="bg-gray-100 text-gray-400 px-3 py-1 rounded-full text-[10px] font-bold">
              {t("common.unavailable")}
            </span>
          )}
        </div>
      </motion.div>
    );
  }
);

export default ItemRow;
