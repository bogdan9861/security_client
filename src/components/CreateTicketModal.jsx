import { motion, AnimatePresence } from "framer-motion";
import { X, FilePlus } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "../app/axios";

const PRIORITIES = [
  { value: "LOW", label: "Низкий" },
  { value: "MEDIUM", label: "Средний" },
  { value: "HIGH", label: "Высокий" },
  { value: "CRITICAL", label: "Критический" },
];

const CreateTicketModal = ({ isOpen, onClose }) => {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    categoryId: "",
    priority: "MEDIUM",
    incidentDate: "",
  });

  const [files, setFiles] = useState([]);

  useEffect(() => {
    console.log(files[0]);
  }, [files]);

  useEffect(() => {
    (async () => {
      const data = (await axios.get("/categories/")).data;

      setCategories(data);
    })();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFiles([...files, e.target.files[0]]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (value) data.append(key, value);
    });

    files.forEach((file) => {
      data.append("files", file);
    });

    try {
      await axios.post("/tickets/", data, {
        headers: { "Content-type": "multipart/form-data" },
      });
      onClose();
    } catch (err) {
      console.error("Ошибка создания заявки", err);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center px-4"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-2xl bg-slate-900 rounded-3xl p-8 border border-white/10 shadow-2xl text-white"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Новая заявка</h2>
              <button onClick={onClose}>
                <X className="w-6 h-6 text-slate-400 hover:text-white" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* TITLE */}
              <Input
                label="Заголовок"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Кратко опишите проблему"
                required
              />

              {/* DESCRIPTION */}
              <Textarea
                label="Описание"
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Подробное описание инцидента"
                required
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* CATEGORY */}
                <Select
                  label="Категория"
                  name="categoryId"
                  value={form.categoryId}
                  onChange={handleChange}
                  required
                >
                  <option value="">Выберите категорию</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </Select>

                {/* PRIORITY */}
                <Select
                  label="Приоритет"
                  name="priority"
                  value={form.priority}
                  onChange={handleChange}
                >
                  {PRIORITIES.map((p) => (
                    <option key={p.value} value={p.value}>
                      {p.label}
                    </option>
                  ))}
                </Select>
              </div>

              {/* FILES */}
              <div>
                <label className="block text-sm mb-2">Прикрепить файлы</label>

                <label className="flex items-center gap-3 px-4 py-4 rounded-xl bg-white/5 border border-dashed border-white/20 cursor-pointer hover:bg-white/10 transition">
                  <FilePlus className="text-blue-400" />
                  <span className="text-sm text-slate-300">
                    Выберите файлы (изображения или документы)
                  </span>
                  <input
                    type="file"
                    multiple={true}
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>

                {files.length > 0 && (
                  <ul className="mt-2 text-sm text-slate-400 space-y-1">
                    {files.map((file, i) => (
                      <li key={i}>• {file.name}</li>
                    ))}
                  </ul>
                )}
              </div>

              {/* ACTIONS */}
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 transition"
                >
                  Отмена
                </button>

                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-blue-500 hover:bg-blue-600 transition font-semibold"
                >
                  Создать заявку
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

/* ===== UI components ===== */

const Input = ({ label, ...props }) => (
  <div>
    <label className="block text-sm mb-2">{label}</label>
    <input
      {...props}
      className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-white/10
                 focus:ring-2 focus:ring-blue-500/30 outline-none"
    />
  </div>
);

const Textarea = ({ label, ...props }) => (
  <div>
    <label className="block text-sm mb-2">{label}</label>
    <textarea
      {...props}
      rows={4}
      className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-white/10
                 focus:ring-2 focus:ring-blue-500/30 outline-none resize-none"
    />
  </div>
);

const Select = ({ label, children, ...props }) => (
  <div>
    <label className="block text-sm mb-2">{label}</label>
    <select
      {...props}
      className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-white/10
                 focus:ring-2 focus:ring-blue-500/30 outline-none"
    >
      {children}
    </select>
  </div>
);

export default CreateTicketModal;
