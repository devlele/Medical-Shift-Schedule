import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell } from "lucide-react";
import { getMinhasNotificacoes } from "../../../services/doctorServices";
import "./NotificacaoBell.css";

export default function NotificacaoBell({ className }) {
    const navigate = useNavigate();
    const [naoLidas, setNaoLidas] = useState(0);

    useEffect(() => {
        getMinhasNotificacoes(true)
            .then((data) => setNaoLidas(Array.isArray(data) ? data.length : 0))
            .catch(() => {});
    }, []);

    return (
        <button
            type="button"
            className="notif-bell-btn"
            onClick={() => navigate("/UserPlantonista/Notificacoes")}
            aria-label={
                naoLidas > 0
                    ? `Notificações (${naoLidas} não lidas)`
                    : "Notificações"
            }
        >
            <Bell className={className} />
            {naoLidas > 0 && <span className="notif-bell-ponto" />}
        </button>
    );
}