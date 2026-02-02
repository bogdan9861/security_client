import { motion } from "framer-motion";

import { useAuth } from "../../../auth/AuthProvider.tsx";
import { CheckCircle, Circle } from "lucide-react";
import { useEffect } from "react";
import axios from "../../../app/axios.js";

const notificationTypes = {
  STATUS_CHANGED: "Статус обращения изменён",
  COMMENT_ADDED: "Новый комментарий",
  ASSIGNED: "Назначен исполнитель",
  TICKET_CREATED: "Обращение",
  READED: "Обращение прочитано",
};

const NotificationCard = ({ data, unread }) => {
  useEffect(() => {
    if (data.isRead) return;

    (async () => {
      await axios.post(`/notifications/read/${data.id}`);
    })();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      whileHover={{ scale: 1.01 }}
      className={`p-5 rounded-2xl border backdrop-blur transition cursor-pointer
      ${
        unread
          ? "bg-blue-500/10 border-blue-400/30"
          : "bg-white/5 border-white/10"
      }
    `}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-semibold text-lg mb-1">
            {notificationTypes[data.type]}
          </h3>
          <p className="text-slate-300 text-sm">{data.message}</p>
          <p className="text-xs text-slate-400 mt-2">{data.createdAt}</p>
        </div>

        {unread ? (
          <Circle className="w-5 h-5 text-blue-400 mt-1" />
        ) : (
          <CheckCircle className="w-5 h-5 text-slate-400 mt-1" />
        )}
      </div>
    </motion.div>
  );
};

export default NotificationCard;
