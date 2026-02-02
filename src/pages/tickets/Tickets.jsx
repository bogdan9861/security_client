import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import axios from "../../app/axios";
import { Link } from "react-router";
import Loader from "../../components/Loader";
import { useAuth } from "../../auth/AuthProvider.tsx";
import TicketCard from "../../components/TicketCard.jsx";

const Tickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [operators, setOperators] = useState([]);

  const { user } = useAuth();

  const isAdmin = useMemo(() => {
    return user?.role === "ADMIN";
  }, [user]);

  useEffect(() => {
    if (!isAdmin) return;

    (async () => {
      const res = (await axios.get("/users/operators")).data;

      setOperators(res);
    })();
  }, [isAdmin]);

  const refreshTickets = async () => {
    if (!user) return;

    try {
      setLoading(true);

      let url = "";

      switch (user?.role) {
        case "CLIENT":
          url = "/tickets/my";
          break;

        case "ADMIN":
          url = "/tickets";
          break;

        case "OPERATOR":
          url = `/tickets/${user.id}/assigned`;
          break;
      }

      const data = (await axios.get(url)).data;

      setLoading(false);
      setTickets(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    refreshTickets();
  }, [user]);

  const handleDelete = async (id) => {
    if (!window.confirm("Удалить заявку?")) return;

    try {
      const res = await axios.delete(`/tickets/${id}`);
      console.log(res);
      setTickets((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      console.error("Ошибка удаления", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white px-10 py-10">
      <Link to={"/profile"}>
        <ArrowLeft />
      </Link>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto"
      >
        <h1 className="text-4xl font-bold mb-10">
          {isAdmin ? "Все заявки" : "Мои заявки"}{" "}
        </h1>
        {loading ? (
          <Loader />
        ) : (
          <div className="space-y-6">
            {tickets.map((ticket) => (
              <TicketCard
                key={ticket.id}
                ticket={ticket}
                onDelete={handleDelete}
                user={user}
                refreshTickets={refreshTickets}
                operators={operators}
              />
            ))}

            {!tickets.length && (
              <p className="text-slate-400 italic">У вас пока нет заявок</p>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Tickets;
