import {
  FaLaptopCode,
  FaMapMarkerAlt,
  FaInstagram,
  FaWhatsapp,
  FaFacebookF,
  FaPhoneAlt,
  FaTelegramPlane,
  FaTiktok,
} from "react-icons/fa";
import { useState, useEffect } from "react";
import { ref, onValue } from "firebase/database";
import { db } from "../../firebase";
import { useTranslation } from "react-i18next";
import PaymentModal from "./PaymentModal";
import type { PaymentMethod } from "../../types/payment";
import { FiCreditCard } from "react-icons/fi";
import { PaymentService } from "../../services/paymentService";

const LOCAL_STORAGE_KEY = "footerInfo";

export default function Footer() {

  const { t } = useTranslation();

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [isPaymentLoading, setIsPaymentLoading] = useState(true);

  const [footer, setFooter] = useState({
    address: "",
    phone: "",
    whatsapp: "",
    facebook: "",
    instagram: "",
    tiktok: "",
    telegram: "",
  });


  useEffect(() => {
    /* ===== footerInfo ===== */
    const localData = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (localData) setFooter(JSON.parse(localData));

    const footerRef = ref(db, "settings/footerInfo");
    const unsubFooter = onValue(footerRef, (snapshot) => {
      if (snapshot.exists()) {
        console.log("Firebase footerInfo:", snapshot.val());
        const data = snapshot.val();
        setFooter(data);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
      }
    });

    const unsubMethods = PaymentService.listenToPaymentMethods((methods) => {
      setPaymentMethods(methods);
      setIsPaymentLoading(false);
    });

    return () => {
      unsubFooter();
      unsubMethods();
    };
  }, []);

  /* ===== Social Icons ===== */
  const socialIcons: { Icon: any; url: string | undefined }[] = [
    {
      Icon: FaWhatsapp,
      url: footer.whatsapp
        ? `https://wa.me/${footer.whatsapp}`
        : undefined,
    },
    { Icon: FaInstagram, url: footer.instagram || undefined },
    { Icon: FaFacebookF, url: footer.facebook || undefined },
    { Icon: FaTiktok, url: footer.tiktok || undefined },
    { Icon: FaTelegramPlane, url: footer.telegram || undefined },
  ];

  return (
    <footer className="w-full bg-(--menu-card-bg)/40 backdrop-blur-md border-t border-(--menu-border) py-12 px-6 mt-20">
      <div className="max-w-6xl mx-auto flex flex-col items-center gap-8">
        {/* Contact info Row */}
        <div className="flex flex-wrap justify-center gap-8 text-sm font-bold text-(--menu-text)">
          {footer.address && (
            <div className="flex items-center gap-2">
              <FaMapMarkerAlt className="text-primary" />
              <span>{footer.address}</span>
            </div>
          )}
          {footer.phone && (
            <a href={`tel:${footer.phone}`} className="flex items-center gap-2 hover:text-(--menu-primary) transition-colors">
              <FaPhoneAlt className="text-primary" />
              <span>{footer.phone}</span>
            </a>
          )}
        </div>

        {/* Social Icons */}
        <div className="flex gap-4">
          {socialIcons.map(({ Icon, url }, i) => url && (
            <a key={i} href={url} target="_blank" rel="noopener noreferrer"
              className="w-10 h-10 rounded-xl flex items-center justify-center bg-(--menu-bg) border hover:border-secondary hover:text-primary border-primary text-secondary hover:scale-105 active:scale-95 transition-all duration-300 shadow-sm hover:shadow-lg shadow-primary/20">
              <Icon size={18} />
            </a>
          ))}
        </div>
        <button
          onClick={() => setIsPaymentModalOpen(true)}
          className="flex items-center gap-2 text-primary hover:text-secondary transition-colors cursor-pointer group"
        >
          <div className="p-1.5 bg-primary/10 rounded-lg group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
            <FiCreditCard size={14} />
          </div>
          <span className="text-xs uppercase tracking-widest font-black">طرق الدفع</span>
        </button>


        {/* Developer Signature */}
        <div className="pt-8 border-t border-(--menu-border) w-full flex flex-col items-center gap-4">
          <a href="https://engmohammedaljojo.vercel.app/" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-3 opacity-60 hover:opacity-100 transition-opacity">
            <FaLaptopCode className="text-lg" />
            <div className="text-[10px] font-bold uppercase tracking-widest text-center">
              {t('footer.developed_by')} : Eng.<span className="text-(--menu-primary)">Mohammed El joujo</span>
            </div>
          </a>
          <p className="text-[10px] text-(--menu-text-muted) font-bold">© {new Date().getFullYear()} {t('footer.rights_reserved')}</p>
        </div>


        <PaymentModal
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          methods={paymentMethods}
          isLoading={isPaymentLoading}
        />
      </div>
    </footer>
  );
}
