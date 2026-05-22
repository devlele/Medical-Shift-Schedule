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
  Building2,
  Shield,
  FileText,
  BriefcaseMedical, 
  UserPlus,       
  UsersRound,     
  ArrowLeftRight, 
  CircleUser      
} from "lucide-react";

import logo from "../../assets/logo.png";
import "./Sidebar.css";

export default function Sidebar() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  // pega o role salvo no login - MUDAR AQUI TIRAR DPS O || "ROLE"
  const role = localStorage
    .getItem("role")
    ?.toLowerCase()
    ?.trim() || "escalista";  // MUDAR AQUI PARA ALTERAR A SIDEBAR (plantonista - hospital - escalista)

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

  /* MENU PLANTONISTA */
  const menuPlantonista = [
    {
      to: "/TelaPrincipal",
      label: "Home",
      icon: Home,
    },
    {
      to: "/Agenda",
      label: "Agenda",
      icon: CalendarDays,
    },
    {
      to: "/PlantoesOfertados",
      label: "Plantão",
      icon: ClipboardPlus,
    },
    {
      to: "/Historico",
      label: "Histórico",
      icon: History,
    },
    {
      to: "/Perfil",
      label: "Perfil",
      icon: User,
    },
  ];

  /*  ESCALISTA */
  const menuEscalista = [
    {
      to: "/home",
      label: "Home",
      icon: Home,
    },
    {
      to: "/criar-plantao",
      label: "Criar Plantão",
      icon: BriefcaseMedical,
    },
    {
      to: "/cadastrar-profissional",
      label: "Cadastrar Profissional",
      icon: UserPlus,
    },
    {
      to: "/setores",
      label: "Setores",
      icon: Building2,
    },
    {
      to: "/plantonistas",
      label: "Plantonistas",
      icon: UsersRound,
    },
    {
      to: "/delegacao",
      label: "Delegação",
      icon: ArrowLeftRight,
    },
    {
      to: "/perfil",
      label: "Perfil",
      icon: CircleUser,
    },
  ];

  /* ESCOLHE MENU PELO ROLE */
  const menus = {
    hospital: menuHospital,
    plantonista: menuPlantonista,
    escalista: menuEscalista,
  };

  const menu = menus[role] || [];

  return (
    <>
      {/* BOTÃO MOBILE */}
      <button
        type="button"
        className="sidebar-toggle"
        aria-label={
          isOpen ? "Fechar menu lateral" : "Abrir menu lateral"
        }
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
                className={({ isActive }) =>
                  isActive
                    ? "item-menu ativo"
                    : "item-menu"
                }
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