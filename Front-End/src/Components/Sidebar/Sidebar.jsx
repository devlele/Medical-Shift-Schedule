import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {Home, CalendarDays, ClipboardPlus, History, User, LogOut} from "lucide-react";

import logo from "../../assets/logo.png";
import "./Sidebar.css"

export default function Sidebar() {
    const navigate = useNavigate();

    function handleLogout() {
        localStorage.removeItem("token");
        localStorage.removeItem("emailUsuario");
        localStorage.removeItem("usuario");
        localStorage.removeItem("role");
        navigate("/Login", { replace: true });
    }

    return (
        <aside className="sidebar">
            <div className="area-logo">
                <img src={logo} alt="Logo MSS" className="logo" />
            </div>

            <nav className="menu-lateral">

                <NavLink to="/TelaPrincipal" className="item-menu">
                    <Home className="icone" />
                    <span>Home</span>
                </NavLink>

                <NavLink to="/Agenda" className="item-menu">
                    <CalendarDays className="icone" />
                    <span>Agenda</span>
                </NavLink>

                <NavLink to="/PlantoesOfertados" className="item-menu">
                    <ClipboardPlus className="icone" />
                    <span>Plantões</span>
                </NavLink>

                <NavLink to="/historico" className="item-menu">
                    <History className="icone" />
                    <span>Histórico</span>
                </NavLink>

                <NavLink to="/perfil" className="item-menu">
                    <User className="icone" />
                    <span>Perfil</span>
                </NavLink>

            </nav>

            <button type="button" className="item-menu botao-logout" onClick={handleLogout}>
                <LogOut className="icone" />
                <span>Sair</span>
            </button>
        </aside>

    );
}
