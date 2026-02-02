import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Trash2, Paperclip, Clock, AlertTriangle, Save } from "lucide-react";

import axios from "../app/axios";

const STATUS_COLORS = {
  NEW: "bg-blue-500/20 text-blue-400",
  IN_PROGRESS: "bg-yellow-500/20 text-yellow-400",
  NEED_INFO: "bg-orange-500/20 text-orange-400",
  CLOSED: "bg-green-500/20 text-green-400",
  REJECTED: "bg-red-500/20 text-red-400",
};

const STATUS_LABLES = {
  NEW: "Новый",
  IN_PROGRESS: "В процессе",
  NEED_INFO: "Требует уточнений",
  CLOSED: "Закрыт",
  REJECTED: "Отклонён",
};

const PRIORITIES = {
  LOW: "Низкий",
  MEDIUM: "Средний",
  HIGH: "Высокий",
  CRITICAL: "Критический",
};

const PRIORITY_ICONS = {
  LOW: null,
  MEDIUM: <Clock className="w-4 h-4" />,
  HIGH: <AlertTriangle className="w-4 h-4" />,
  CRITICAL: <AlertTriangle className="w-4 h-4 text-red-400" />,
};

const TicketCard = ({ ticket, onDelete, user, refreshTickets, operators }) => {
  const [commentsShown, setCommentsShown] = useState(false);
  const [selectedOperator, setSelectedOperator] = useState(null);

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;

    try {
      await axios.put(`/tickets/${ticket.id}/updateStatus`, {
        status: newStatus,
      });

      refreshTickets();
    } catch (err) {
      console.error("Ошибка изменения статуса", err);
    }
  };

  const handleOperatorChange = async (e) => {
    const id = e.target.value;

    try {
      await axios.put(`/tickets/${ticket.id}/assign`, {
        assignedToId: id,
      });

      refreshTickets();
    } catch (err) {
      console.error("Ошибка изменения статуса", err);
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      className="bg-white/5 backdrop-blur rounded-2xl p-6 border border-white/10"
    >
      <div className="flex justify-between items-start gap-6">
        {/* INFO */}
        <div className="flex-1">
          <div
            className="flex-1"
            onClick={() => setCommentsShown(!commentsShown)}
          >
            <h2 className="text-xl font-semibold mb-1">{ticket?.title}</h2>

            <p className="text-slate-300 text-sm mb-3">{ticket?.description}</p>

            <div className="flex flex-wrap gap-3 mb-4">
              <Badge
                text={STATUS_LABLES[ticket?.status]}
                className={STATUS_COLORS[ticket?.status]}
              />

              <Badge
                text={PRIORITIES[ticket?.priority]}
                icon={PRIORITY_ICONS[ticket?.priority]}
              />

              <Badge text={ticket?.category?.name} />
            </div>
          </div>
          <div
            style={{ alignItems: "center" }}
            className="flex items-center mt-5 gap-5"
          >
            {user.role === "ADMIN" && (
              <div className="max-w-[160px]">
                <select
                  value={ticket.assignedToId}
                  onChange={handleOperatorChange}
                  className="w-full bg-white/5 backdrop-blur border border-white/10 rounded-lg  p-2 text-sm
                         focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                >
                  {operators?.map((operator) => (
                    <option key={operator.id} value={operator.id}>
                      {operator.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {user.role === "ADMIN" || user.role === "OPERATOR" ? (
              <div className="max-w-[160px]">
                <select
                  value={ticket.status}
                  onChange={handleStatusChange}
                  className="w-full bg-white/5 backdrop-blur border border-white/10 rounded-lg  p-2 text-sm
                         focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                >
                  {Object.keys(STATUS_LABLES).map((key) => (
                    <option key={key} value={key}>
                      {STATUS_LABLES[key]}
                    </option>
                  ))}
                </select>
              </div>
            ) : null}
          </div>

          {/* FILES */}
          {ticket.attachments?.length > 0 && (
            <div className="mt-3">
              <p className="text-sm text-slate-400 mb-2 flex items-center gap-1">
                <Paperclip className="w-4 h-4" />
                Вложения:
              </p>

              <ul className="space-y-1 text-sm">
                {ticket.attachments.map((file) => (
                  <li key={file.id}>
                    <a
                      href={file.filePath}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-400 hover:underline"
                    >
                      {file.fileName}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <AnimatePresence>
            {commentsShown && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <CommentsSection ticketId={ticket.id} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ACTIONS */}
        <button
          onClick={() => onDelete(ticket.id)}
          className="p-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 transition"
          title="Удалить заявку"
        >
          <Trash2 className="w-5 h-5 text-red-400" />
        </button>
      </div>
    </motion.div>
  );
};

const CommentsSection = ({ ticketId }) => {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchComments = async () => {
    const res = await axios.get(`/comments/${ticketId}`);
    setComments(res.data);
  };

  const addComment = async () => {
    if (!text.trim()) return;

    setLoading(true);
    await axios.post(`/comments`, {
      content: text,
      ticketId,
      isInternal: true,
    });

    setText("");
    await fetchComments();
    setLoading(false);
  };

  useEffect(() => {
    fetchComments();
  }, []);

  return (
    <div
      style={{ borderTop: "1px solid rgba(255,255,255,0.2)" }}
      className="mt-5 pt-4"
    >
      <h4 className="font-medium mb-3">Комментарии</h4>

      <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
        {comments.map((comment) => (
          <motion.div
            key={comment.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="
        bg-zinc-900/80
        border border-zinc-800
        rounded-xl
        p-4
        backdrop-blur
      "
          >
            <div className="flex justify-between items-center text-xs mb-2">
              <span className="text-zinc-300 font-medium">
                {comment.author.name}
              </span>
              <span className="text-zinc-500">
                {new Date(comment.createdAt).toLocaleString()}
              </span>
            </div>

            <p className="text-sm text-zinc-200 leading-relaxed">
              {comment.content}
            </p>
          </motion.div>
        ))}
      </div>

      <div className="mt-4 flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Написать комментарий..."
          className="flex-1 px-4 py-2 rounded-xl border focus:ring-2 focus:ring-blue-500 outline-none"
        />
        <button
          onClick={addComment}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition"
        >
          Отправить
        </button>
      </div>
    </div>
  );
};

const Badge = ({ text, icon, className }) => (
  <span
    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-white/10 ${className}`}
  >
    {icon}
    {text}
  </span>
);

export default TicketCard;
