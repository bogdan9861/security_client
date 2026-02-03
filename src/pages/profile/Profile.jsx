import { motion } from "framer-motion";
import {
  User,
  Mail,
  Shield,
  ClipboardList,
  Users,
  Settings,
  LogOut,
  ArrowBigLeft,
  ArrowLeft,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthProvider.tsx";
import CreateTicketModal from "../../components/CreateTicketModal.jsx";
import { useMemo, useState } from "react";
import EditProfileModal from "../../components/EditProfileModal.jsx";

const ROLES = {
  ADMIN: "Администратор",
  OPERATOR: "Оператор",
  CLIENT: "Пользователь",
};

const Profile = () => {
  const navigate = useNavigate();

  const [modals, setModals] = useState({
    createTicket: false,
    editTicket: false,
  });

  const { user, logout } = useAuth();

  console.log(user);

  const isAdmin = useMemo(() => {
    if (!user) return;

    return user?.role === "ADMIN";
  }, [user]);

  const onLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white px-10 py-10">
        <Link to={"/"}>
          <ArrowLeft />
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-5xl mx-auto"
        >
          {/* Header */}
          <h1 className="text-4xl font-bold mb-10">Личный кабинет</h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Profile Card */}
            <div className="bg-white/5 backdrop-blur rounded-2xl p-6 border border-white/10">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <User className="w-8 h-8 text-blue-400" />
                </div>

                <div>
                  <h2 className="text-xl font-semibold">{user?.name}</h2>
                  <p className="text-slate-400 text-sm">{user?.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-slate-300 mb-6">
                <Shield className="w-4 h-4 text-blue-400" />
                Роль:{" "}
                <span className="font-semibold text-white">
                  {ROLES[user?.role]}
                </span>
              </div>

              <button
                onClick={onLogout}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-red-500/20 hover:bg-red-500/30 transition text-red-300"
              >
                <LogOut className="w-5 h-5" />
                Выйти
              </button>
            </div>

            {/* Actions */}
            <div className="md:col-span-2 space-y-6">
              {/* USER BLOCK */}
              {user?.role === "CLIENT" && (
                <Section title="Действия пользователя" icon={<ClipboardList />}>
                  <ActionButton
                    text="Мои заявки"
                    onClick={() => navigate("/tickets")}
                  />
                  <ActionButton
                    text="Создать заявку"
                    onClick={() => setModals({ ...modals, createTicket: true })}
                  />
                </Section>
              )}

              {/* ADMIN BLOCK */}
              {isAdmin || user?.role === "OPERATOR" && (
                <Section title="Панель администратора" icon={<Users />}>
                  <ActionButton
                    text="Управление обращениями"
                    onClick={() => navigate("/tickets")}
                  />
                </Section>
              )}

              {/* SETTINGS */}
              <Section title="Настройки" icon={<Settings />}>
                <ActionButton
                  text="Редактировать профиль"
                  onClick={() => setModals({ ...modals, editTicket: true })}
                />
              </Section>
            </div>
          </div>
        </motion.div>
      </div>
      <CreateTicketModal
        isOpen={modals.createTicket}
        onClose={() => setModals({ ...modals, createTicket: false })}
      />
      <EditProfileModal
        isOpen={modals.editTicket}
        onClose={() => setModals({ ...modals, editTicket: false })}
        user={user}
      />
    </>
  );
};

const Section = ({ title, icon, children }) => (
  <div className="bg-white/5 backdrop-blur rounded-2xl p-6 border border-white/10">
    <div className="flex items-center gap-2 mb-4">
      <span className="text-blue-400">{icon}</span>
      <h3 className="text-xl font-semibold">{title}</h3>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{children}</div>
  </div>
);

const ActionButton = ({ text, onClick }) => (
  <button
    onClick={onClick}
    className="w-full py-3 rounded-xl bg-blue-500/20 hover:bg-blue-500/30 transition text-left px-4"
  >
    {text}
  </button>
);

export default Profile;
