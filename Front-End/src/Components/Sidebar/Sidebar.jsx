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
  Users,
  FileText,
  Shield,
  Building2,
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

  /* MENU HOSPITAL */
  const menuHospital = [
    {
      to: "/UserHospital/TelaPrincipal",
      label: "Home",
      icon: Home,
    },
    {
      to: "/Colaboradores",
      label: "Colaboradores",
      icon: Users,
    },
    {
      to: "/CadastrarProfissional",
      label: "Cadastrar Profissional",
      icon: ClipboardPlus,
    },
    {
      to: "/Setores",
      label: "Setores",
      icon: Building2,
    },
    {
      to: "/perfil",
      label: "Perfil",
      icon: User,
    },
  ];

  /* ESCOLHE MENU */
  let menu = menuHospital;

  return (
    <>
      {/* BOTÃO MOBILE */}
      <button
        type="button"
        className="sidebar-toggle"
        aria-label={isOpen ? "Fechar menu lateral" : "Abrir menu lateral"}
        aria-expanded={isOpen}
        onClick={() => setIsOpen((current) => !current)}
      >
        {isOpen ? <X size={26} /> : <Menu size={26} />}
      </button>

      {/* OVERLAY */}
      <button
        type="button"
        className={`sidebar-overlay ${isOpen ? "ativo" : ""}`}
        aria-label="Fechar menu lateral"
        onClick={closeSidebar}
      />

      {/* SIDEBAR */}
      <aside className={`sidebar ${isOpen ? "aberta" : ""}`}>
        {/* LOGO */}
        <div className="area-logo">
          <img src={logo} alt="Logo MSS" className="logo" />
        </div>

        {/* MENU */}
        <nav className="menu-lateral">
          {menu.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.to}
                to={item.to}
                className="item-menu"
                onClick={closeSidebar}
              >
                <Icon className="icone" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* LOGOUT */}
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
