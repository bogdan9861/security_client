import { motion } from "framer-motion";
import { User, Mail, Lock, Loader } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../../app/axios";
import { useState } from "react";
import "../../animations/animations.css";
import { useAuth } from "../../auth/AuthProvider.tsx";

const Register = () => {
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    const form = e.currentTarget;

    axios
      .post("/users/register", {
        name: form.name.value,
        email: form.email.value,
        password: form.password.value,
      })
      .then((res) => {
        login(res.data);
        navigate("/");
      })
      .catch((e) => {
        console.log(e);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md bg-white/5 backdrop-blur-lg rounded-3xl p-8 border border-white/10 shadow-2xl"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Регистрация</h1>
          <p className="text-slate-300 text-sm">
            Создайте аккаунт для работы с заявками
          </p>
        </div>

        {/* Form */}
        <form className="space-y-6" onSubmit={(e) => handleSubmit(e)}>
          {/* NAME */}
          <Input icon={<User />} type="text" name="name" placeholder="Имя" />

          {/* EMAIL */}
          <Input
            icon={<Mail />}
            type="email"
            name="email"
            placeholder="Email"
          />

          {/* PASSWORD */}
          <Input
            icon={<Lock />}
            type="password"
            name="password"
            placeholder="Пароль"
          />

          {/* SUBMIT */}
          <button
            type="submit"
            className="w-full py-4 rounded-xl bg-blue-500 hover:bg-blue-600 transition font-semibold shadow-lg flex items-center justify-center"
          >
            {loading ? <Loader className="rotating" /> : " Зарегистрироваться"}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-slate-300">
          Уже есть аккаунт?{" "}
          <Link to="/login" className="text-blue-400 hover:underline">
            Войти
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

const Input = ({ icon, ...props }) => (
  <div className="relative">
    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
      {icon}
    </span>
    <input
      {...props}
      className="w-full pl-12 pr-4 py-4 rounded-xl bg-slate-900 border border-white/10
                 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30
                 outline-none transition text-white placeholder-slate-400"
    />
  </div>
);

export default Register;
