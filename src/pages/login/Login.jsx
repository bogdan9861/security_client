import { motion } from "framer-motion";
import { Mail, Lock } from "lucide-react";
import axios from "../../app/axios.js";

import { useAuth } from "../../auth/AuthProvider.tsx";
import { Link, useNavigate } from "react-router";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;

    const res = await axios.post("/users/login", {
      email: form.email.value,
      password: form.password.value,
    });

    console.log(res);

    login(res.data);
    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800">
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="
          w-full max-w-md
          bg-white/5 backdrop-blur-xl
          border border-white/10
          rounded-3xl
          p-10
          shadow-2xl
        "
      >
        {/* Заголовок */}
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-semibold text-white">Вход в систему</h1>
          <p className="text-slate-400 mt-2 text-sm">Служба безопасности</p>
        </div>

        {/* Email */}
        <div className="relative mb-6">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

          <input
            id="email"
            name="email"
            type="email"
            required
            className="
              peer w-full
              bg-white/5
              border border-white/10
              rounded-xl
              py-4 pl-12 pr-4
              text-white
              placeholder-transparent
              focus:outline-none
              focus:border-blue-500
              focus:ring-2 focus:ring-blue-500/30
              transition
            "
            placeholder="Email"
          />

          <label
            htmlFor="email"
            className="
              absolute left-12 top-1/2 -translate-y-1/2
              text-slate-400 text-sm
              peer-placeholder-shown:top-1/2
              peer-placeholder-shown:text-base
              peer-focus:top-2
              peer-focus:text-xs
              peer-focus:text-blue-400
              transition-all
            "
          >
            Email
          </label>
        </div>

        {/* Password */}
        <div className="relative mb-8">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

          <input
            id="password"
            name="password"
            type="password"
            required
            className="
              peer w-full
              bg-white/5
              border border-white/10
              rounded-xl
              py-4 pl-12 pr-4
              text-white
              placeholder-transparent
              focus:outline-none
              focus:border-blue-500
              focus:ring-2 focus:ring-blue-500/30
              transition
            "
            placeholder="Пароль"
          />

          <label
            htmlFor="password"
            className="
              absolute left-12 top-1/2 -translate-y-1/2
              text-slate-400 text-sm
              peer-placeholder-shown:top-1/2
              peer-placeholder-shown:text-base
              peer-focus:top-2
              peer-focus:text-xs
              peer-focus:text-blue-400
              transition-all
            "
          >
            Пароль
          </label>
        </div>

        {/* Кнопка */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="
            w-full
            py-4
            rounded-xl
            bg-gradient-to-r from-blue-500 to-indigo-500
            text-white font-medium
            shadow-lg shadow-blue-500/30
            hover:shadow-blue-500/50
            transition
          "
        >
          Войти
        </motion.button>

        {/* Нижний текст */}
        <Link
          to={"/register"}
          style={{ display: "block" }}
          className="text-center text-slate-400 text-sm mt-6"
        >
          Нет аккаунта?{" "}
          <span className="text-blue-400 hover:underline cursor-pointer">
            Зарегистрироваться
          </span>
        </Link>
      </motion.form>
    </div>
  );
}
