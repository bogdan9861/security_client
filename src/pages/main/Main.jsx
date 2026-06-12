import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Bell,
  UserCircle,
  ShieldCheck,
  Clock,
  FileText,
  Shield,
  ShieldAlertIcon,
  ShieldCheckIcon,
  SunMoonIcon,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "../../app/axios";
import { useAuth } from "../../auth/AuthProvider.tsx";
import CreateTicketModal from "../../components/CreateTicketModal.jsx";
import { enums } from "../../enums/index.js";

const Main = () => {
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);
  const [createTicketOpen, setCreateTicketOpen] = useState(false);
  const [theme, setTheme] = useState("dark");

  const { user } = useAuth();

  useEffect(() => {
    const theme = localStorage.getItem(enums.THEME);

    setTheme(theme);
  }, []);

  const toggleTheme = () => {
    localStorage.setItem(enums.THEME, theme === "light" ? "dark" : "light");

    const toggleTheme = window.dispatchEvent(
      new CustomEvent("themeChanged", {
        detail: {
          key: enums.THEME,
          newValue: theme === "light" ? "dark" : "light",
          url: window.location.href,
        },
      }),
    );

    setTheme(theme === "light" ? "dark" : "light");
  };

  useEffect(() => {
    if (theme === "light") {
      document.body.style.filter = "invert()";
    } else {
      document.body.style.filter = "";
    }
  }, [theme]);

  const getUnreadedCount = async (params) => {
    const result = (await axios.get("/notifications/unreaded")).data;

    setUnreadCount(result?.count);
  };

  useEffect(() => {
    getUnreadedCount();
  }, []);

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
    }
  }, []);

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
        {/* Header */}
        <header className="flex items-center justify-between px-10 py-6">
          <div className="flex items-center gap-5">
            <ShieldCheckIcon />
            <h1 className="text-xl font-semibold tracking-wide">
              Служба безопасности
            </h1>
          </div>

          <div className="flex items-center gap-6">
            <span className="text-l font-semibold tracking-wide">
              {user?.name}
            </span>

            <button
              onClick={() => navigate("/notifications")}
              className="relative p-2 rounded-full hover:bg-white/10 transition"
            >
              <Bell className="w-6 h-6" />
              {/* индикатор */}
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              )}
            </button>

            <button
              onClick={() => navigate("/profile")}
              className="p-2 rounded-full hover:bg-white/10 transition"
            >
              <UserCircle className="w-7 h-7" />
            </button>

            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-white/10 transition"
            >
              <SunMoonIcon className="w-7 h-7" />
            </button>
          </div>
        </header>

        {/* Hero */}
        <main className="px-10 mt-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <h2 className="text-5xl font-bold leading-tight mb-6">
              Учет и обработка обращений
              <span className="text-blue-400"> в службу безопасности</span>
            </h2>

            <p className="text-lg text-slate-300 mb-10">
              Веб-приложение предназначено для централизованного приёма,
              обработки и контроля заявок, связанных с инцидентами, нарушениями
              и вопросами безопасности.
            </p>

            <button
              onClick={() => setCreateTicketOpen(true)}
              className="px-8 py-4 rounded-xl bg-blue-500 hover:bg-blue-600 transition font-semibold shadow-lg"
            >
              Оставить заявку
            </button>
          </motion.div>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 max-w-5xl"
          >
            <Feature
              icon={<ShieldCheck />}
              title="Безопасность"
              text="Контроль обращений и доступ только для авторизованных пользователей."
            />

            <Feature
              icon={<Clock />}
              title="Оперативность"
              text="Быстрая регистрация заявок и отслеживание их статуса."
            />

            <Feature
              icon={<FileText />}
              title="Документооборот"
              text="Прикрепление файлов и фиксация всех действий по заявке."
            />
          </motion.div>
        </main>
      </div>
      <CreateTicketModal
        isOpen={createTicketOpen}
        onClose={() => setCreateTicketOpen(false)}
      />
    </>
  );
};

const Feature = ({ icon, title, text }) => (
  <div className="bg-white/5 backdrop-blur rounded-2xl p-6 border border-white/10 hover:border-blue-400/50 transition">
    <div className="text-blue-400 mb-4">{icon}</div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-slate-300">{text}</p>
  </div>
);

export default Main;
