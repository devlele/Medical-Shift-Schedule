import { useState } from "react";
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
  Building2,
  BriefcaseMedical,
  UserPlus,
} from "lucide-react";

import { clearAuthSession, getStoredRole } from "../../utils/authStorage";
import logo from "../../assets/logo.png";
import "./Sidebar.css";

export default function Sidebar() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const role = getStoredRole();

  function handleLogout() {
    clearAuthSession();

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
      to: "/UserHospital/CadastrarProfissional",
      label: "Cadastrar Profissional",
      icon: UserPlus,
    },
    {
      to: "/UserHospital/Colaboradores",
      label: "Colaboradores",
      icon: ClipboardPlus,
    },
    {
      to: "/UserHospital/Setores",
      label: "Setores",
      icon: Building2,
    },
    {
      to: "/UserHospital/Perfil",
      label: "Perfil",
      icon: User,
    },
  ];

  /* MENU PLANTONISTA */
  const menuPlantonista = [
    {
      to: "/UserPlantonista/TelaPrincipal",
      label: "Home",
      icon: Home,
    },
    {
      to: "/UserPlantonista/Agenda",
      label: "Agenda",
      icon: CalendarDays,
    },
    {
      to: "/UserPlantonista/PlantoesOfertados",
      label: "Plantão",
      icon: ClipboardPlus,
    },
    {
      to: "/UserPlantonista/Historico",
      label: "Histórico",
      icon: History,
    },
    {
      to: "/UserPlantonista/Perfil",
      label: "Perfil",
      icon: User,
    },
  ];

  /*  ESCALISTA */
  const menuEscalista = [
    {
      to: "/UserEscalista/TelaPrincipal",
      label: "Home",
      icon: Home,
    },
    {
      to: "/UserEscalista/Medicos",
      label: "Médicos",
      icon: UserPlus,
    },
    {
      to: "/UserEscalista/CriarPlantao",
      label: "Criar Plantão",
      icon: BriefcaseMedical,
    },
    {
      to: "/UserEscalista/Perfil",
      label: "Perfil",
      icon: User,
    },
    
  ];

  /* ESCOLHE MENU PELO ROLE */
  const menus = {
    hospital: menuHospital,
    plantonista: menuPlantonista,
    medico: menuPlantonista,
    doctor: menuPlantonista,
    escalista: menuEscalista,
    manager: menuEscalista,
  };

  const menu = menus[role] || [];

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
                className={({ isActive }) =>
                  isActive ? "item-menu ativo" : "item-menu"
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
