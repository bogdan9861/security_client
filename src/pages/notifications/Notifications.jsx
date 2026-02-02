import { motion } from "framer-motion";
import { ArrowLeft, Bell, CheckCircle, Circle, Loader } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "../../app/axios";
import "../../animations/animations.css";
import { Link } from "react-router";
import { useAuth } from "../../auth/AuthProvider.tsx";
import NotificationCard from "./components/NotificationCard.jsx";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  const getNotifications = async (params) => {
    setLoading(true);

    const res = (await axios.get("/notifications")).data;

    setLoading(false);
    setNotifications(res);
  };

  useEffect(() => {
    getNotifications();
  }, []);

  const unread = notifications.filter((n) => !n.isRead);
  const read = notifications.filter((n) => n.isRead);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white px-10 py-10 items-center">
        <Loader size={50} className="rotating" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white px-10 py-10">
      <Link to={"/"}>
        <ArrowLeft />
      </Link>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-5xl mx-auto"
      >
        <h1 className="text-4xl font-bold mb-10 flex items-center gap-3">
          <Bell className="text-blue-400" />
          Уведомления
        </h1>

        {/* НЕПРОЧИТАННЫЕ */}
        <Section title={`Непрочитанные (${unread.length})`} accent="blue">
          {unread.length ? (
            unread.map((item) => (
              <NotificationCard key={item.id} data={item} unread />
            ))
          ) : (
            <Empty text="Нет непрочитанных уведомлений" />
          )}
        </Section>

        {/* ПРОЧИТАННЫЕ */}
        <Section title={`Прочитанные (${read.length})`} accent="gray">
          {read.length ? (
            read.map((item) => <NotificationCard key={item.id} data={item} />)
          ) : (
            <Empty text="Прочитанных уведомлений нет" />
          )}
        </Section>
      </motion.div>
    </div>
  );
};

const Section = ({ title, accent, children }) => (
  <div className="mb-12">
    <h2
      className={`text-2xl font-semibold mb-6 ${
        accent === "blue" ? "text-blue-400" : "text-slate-300"
      }`}
    >
      {title}
    </h2>

    <div className="space-y-4">{children}</div>
  </div>
);

const Empty = ({ text }) => (
  <div className="text-slate-400 italic bg-white/5 rounded-xl p-4 border border-white/10">
    {text}
  </div>
);

export default Notifications;
