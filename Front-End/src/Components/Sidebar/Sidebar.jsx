import React from "react";
import { NavLink } from "react-router-dom";
import {Home, CalendarDays, ClipboardPlus, History, User} from "lucide-react";

import logo from "../../assets/logo.png";
import "./Sidebar.css"

export default function Sidebar() {
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

                <NavLink to="/agenda" className="item-menu">
                    <CalendarDays className="icone" />
                    <span>Agenda</span>
                </NavLink>

                <NavLink to="/plantoes" className="item-menu">
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
        </aside>

    );
}