import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "../app/axios";
import { X, User, Mail, Lock } from "lucide-react";

const EditProfileModal = ({ isOpen, onClose, user, onUpdated }) => {
  const [form, setForm] = useState({
    name: user?.name,
    email: user?.email,
    password: "",
  });

  useEffect(() => {
    setForm({
      name: user?.name,
      email: user?.email,
      password: "",
    });
  }, [user]);

  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const user = (
      await axios.put("/users/", {
        name: form.name,
        email: form.email,
        ...(form.password && { password: form.password }),
      })
    ).data;

    setLoading(false);
    localStorage.setItem("user", JSON.stringify(user));
    window.location.reload();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Overlay */}
          <div
            onClick={onClose}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="
              relative z-10
              w-full max-w-md
              bg-zinc-900
              border border-zinc-800
              rounded-2xl
              p-6
              text-white
            "
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Редактирование профиля</h2>
              <button onClick={onClose}>
                <X className="w-5 h-5 text-zinc-400 hover:text-white" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div>
                <label className="text-xs text-zinc-400">Имя</label>
                <div className="relative mt-1">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    className="
                      w-full pl-10 pr-4 py-2
                      bg-zinc-950
                      border border-zinc-700
                      rounded-xl
                      focus:ring-2 focus:ring-blue-600
                      outline-none
                    "
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="text-xs text-zinc-400">Email</label>
                <div className="relative mt-1">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className="
                      w-full pl-10 pr-4 py-2
                      bg-zinc-950
                      border border-zinc-700
                      rounded-xl
                      focus:ring-2 focus:ring-blue-600
                      outline-none
                    "
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm rounded-xl border border-zinc-700 hover:bg-zinc-800"
                >
                  Отмена
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="
                    px-5 py-2 text-sm rounded-xl
                    bg-blue-600 hover:bg-blue-700
                    transition
                  "
                >
                  {loading ? "Сохранение..." : "Сохранить"}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EditProfileModal;
