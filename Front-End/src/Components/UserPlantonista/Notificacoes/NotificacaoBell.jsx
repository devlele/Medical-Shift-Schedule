import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell } from "lucide-react";
import { getMinhasNotificacoes } from "../../../services/doctorServices";
import "./NotificacaoBell.css";

const REFRESH_INTERVAL_MS = 15000;

export default function NotificacaoBell({ className }) {
    const navigate = useNavigate();
    const [naoLidas, setNaoLidas] = useState(0);

    useEffect(() => {
        let ativo = true;

        const carregarNaoLidas = () => {
            getMinhasNotificacoes(true)
                .then((data) => {
                    if (ativo) {
                        setNaoLidas(Array.isArray(data) ? data.length : 0);
                    }
                })
                .catch(() => {});
        };

        const handleFocus = () => carregarNaoLidas();
        const handleNotificacoesAtualizadas = () => carregarNaoLidas();

        carregarNaoLidas();
        window.addEventListener("focus", handleFocus);
        window.addEventListener("notificacoes-atualizadas", handleNotificacoesAtualizadas);

        const intervalId = window.setInterval(carregarNaoLidas, REFRESH_INTERVAL_MS);

        return () => {
            ativo = false;
            window.removeEventListener("focus", handleFocus);
            window.removeEventListener("notificacoes-atualizadas", handleNotificacoesAtualizadas);
            window.clearInterval(intervalId);
        };
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
