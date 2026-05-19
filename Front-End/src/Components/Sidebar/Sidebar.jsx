import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Home,
  CalendarDays,
  ClipboardPlus,
  History,
  User,
  LogOut,
  Menu,
  X,
} from "lucide-react";

import logo from "../../assets/logo.png";
import "./Sidebar.css";

export default function Sidebar() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("emailUsuario");
    localStorage.removeItem("usuario");
    localStorage.removeItem("role");

    navigate("/Login", { replace: true });
  }

  function closeSidebar() {
    setIsOpen(false);
  }

  return (
    <>
      <button
        type="button"
        className="sidebar-toggle"
        aria-label={isOpen ? "Fechar menu lateral" : "Abrir menu lateral"}
        aria-expanded={isOpen}
        onClick={() => setIsOpen((current) => !current)}
      >
        {isOpen ? <X size={26} /> : <Menu size={26} />}
      </button>

      <button
        type="button"
        className={`sidebar-overlay ${isOpen ? "ativo" : ""}`}
        aria-label="Fechar menu lateral"
        onClick={closeSidebar}
      />

      <aside className={`sidebar ${isOpen ? "aberta" : ""}`}>
        <div className="area-logo">
          <img src={logo} alt="Logo MSS" className="logo" />
        </div>

        <nav className="menu-lateral">
          <NavLink
            to="/TelaPrincipal"
            className="item-menu"
            onClick={closeSidebar}
          >
            <Home className="icone" />
            <span>Home</span>
          </NavLink>

          <NavLink to="/Agenda" className="item-menu" onClick={closeSidebar}>
            <CalendarDays className="icone" />
            <span>Agenda</span>
          </NavLink>

          <NavLink
            to="/PlantoesOfertados"
            className="item-menu"
            onClick={closeSidebar}
          >
            <ClipboardPlus className="icone" />
            <span>Plantões</span>
          </NavLink>

          <NavLink to="/historico" className="item-menu" onClick={closeSidebar}>
            <History className="icone" />
            <span>Histórico</span>
          </NavLink>

          <NavLink to="/perfil" className="item-menu" onClick={closeSidebar}>
            <User className="icone" />
            <span>Perfil</span>
          </NavLink>
        </nav>

        <button
          type="button"
          className="item-menu botao-logout"
          onClick={handleLogout}
        >
          <LogOut className="icone" />
          <span>Sair</span>
        </button>
      </aside>
    </>
  );
}
