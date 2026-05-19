import { useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { FiX, FiCreditCard } from "react-icons/fi";
import type { PaymentMethod } from "../../types/payment";
import PaymentFieldsRenderer from "../common/PaymentFieldsRenderer";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    methods: PaymentMethod[];
    isLoading?: boolean;
}

export default function PaymentModal({
    isOpen, onClose, methods, isLoading = false
}: Props) {
    useTranslation();

    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    }, [onClose]);

    const enabledMethods = useMemo(() => methods.filter(m => m.isActive), [methods]);

    if (!isOpen) return null;

    const modalContent = (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-6 overflow-hidden">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-gray-950/60 backdrop-blur-md"
            />

            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-4xl bg-white rounded-[3rem] shadow-premium flex flex-col max-h-[85vh] overflow-hidden border border-gray-100 z-10"
            >
                {/* Header */}
                <div className="p-6 sm:p-8 border-b border-gray-50 flex items-center justify-between bg-white shrink-0">
                    <div className="flex items-center gap-5">
                        <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shadow-inner shrink-0">
                            <FiCreditCard size={28} />
                        </div>
                        <div>
                            <h3 className="text-2xl font-black text-gray-900 leading-tight tracking-tight">طرق الدفع</h3>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">بيانات التحويل المعتمدة</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-12 h-12 rounded-2xl bg-gray-50 text-gray-400 hover:text-secondary hover:bg-secondary/10 transition-all flex items-center justify-center border border-gray-100"
                    >
                        <FiX size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-2 sm:p-4 bg-gray-50/30">
                    {isLoading ? (
                        <div className="flex flex-col gap-4">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="p-3 sm:p-4 rounded-[2rem] border border-gray-100 bg-white shadow-sm animate-pulse space-y-5">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 bg-gray-100 rounded-2xl" />
                                        <div className="h-5 bg-gray-100 rounded w-1/2" />
                                    </div>
                                    <div className="h-24 bg-gray-100 rounded-2xl" />
                                </div>
                            ))}
                        </div>
                    ) : enabledMethods.length > 0 ? (
                        <div className="flex flex-col gap-5">
                            {enabledMethods.map((method) => (
                                <div key={method.id} className="bg-white border border-gray-100 rounded-[2rem] p-5 shadow-sm hover:shadow-premium hover:-translate-y-1 transition-all duration-300 flex flex-col group">
                                    <div className="flex items-center gap-4 mb-2">
                                        <div className="w-14 h-14 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center p-2.5 shadow-inner shrink-0 group-hover:scale-105 group-hover:bg-primary/5 transition-transform">
                                            {method.image ? (
                                                <img
                                                    src={method.image.startsWith('/') ? method.image : `/images/payment/${method.image}`}
                                                    alt={method.name}
                                                    className="w-full h-full object-contain"
                                                />
                                            ) : <FiCreditCard size={26} className="text-gray-400 group-hover:text-primary transition-colors" />}
                                        </div>
                                        <div>
                                            <h4 className="font-black text-gray-900 text-lg leading-tight">{method.name}</h4>
                                            {method.label && (
                                                <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-wider">{method.label}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex-1 bg-gray-50/80 rounded-2xl p-4 border border-gray-100 group-hover:border-primary/10 group-hover:bg-primary/[0.02] transition-colors">
                                        <PaymentFieldsRenderer
                                            fields={method.fields || []}
                                            isCash={method.type === 'cash'}
                                        />
                                        {method.instructions && (
                                            <p className="text-[11px] text-gray-500 mt-4 font-bold leading-relaxed bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                                                {method.instructions}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-16 text-center space-y-6">
                            <div className="w-24 h-24 rounded-[2.5rem] bg-white shadow-sm flex items-center justify-center text-5xl border border-gray-100">📵</div>
                            <div>
                                <h4 className="text-xl font-black text-gray-900">لا توجد وسائل دفع متاحة</h4>
                                <p className="text-xs font-bold text-gray-400 mt-2 uppercase tracking-widest leading-relaxed max-w-[250px] mx-auto">يرجى التواصل مع الإدارة مباشرة لإتمام طلبك</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Bottom Tip */}
                <div className="p-8 bg-gray-50/50 border-t border-gray-50 shrink-0">
                    <p className="text-[10px] font-bold text-red-400 text-center uppercase tracking-widest leading-relaxed opacity-90">
                        تأكد من إرسال إشعار التحويل بعد إتمام العملية لضمان معالجة طلبك بأسرع وقت
                    </p>
                </div>
            </motion.div>
        </div>
    );

    return createPortal(
        <AnimatePresence>
            {isOpen && modalContent}
        </AnimatePresence>,
        document.body
    );
}
