import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Login from "./Components/Login/Login";
import Home from "./Components/Home/Home";
import ProtectedRoute from "./Components/Auth/ProtectedRoute.jsx";
import CadastroMedico from "./Components/CadastroMedico/CadastroMedico";
import CadastroHospital from "./Components/CadastroHospital/CadastroHospital";
import CadastroTipo from "./Components/CadastroTipo/CadastroTipo";
import PerfilPlantonista from "./Components/UserPlantonista/Perfil/Perfil";
import TelaPrincipal from "./Components/UserPlantonista/TelaPrincipal/TelaPrincipal";
import ResolucaoConflito from "./Components/UserPlantonista/ResolucaoConflito/ResolucaoConflito";
import RecuperarSenha from "./Components/RecuperarSenha/RecuperarSenha";
import Agenda from "./Components/UserPlantonista/Agenda/Agenda";
import DetalhePlantao from "./Components/UserPlantonista/Agenda/DetalhePlantao";
import PlantoesOfertados from "./Components/UserPlantonista/Plantoes/PlantoesOfertados.jsx";
import DetalhesOferta from "./Components/UserPlantonista/Plantoes/DetalhesOferta.jsx";
import OferecerPlantao from "./Components/UserPlantonista/Plantoes/OferecerPlantao.jsx";
import TelaPrincipalHospital from "./Components/UserHospital/TelaPrincipal/TelaPrincipal";
import Setores from "./Components/UserHospital/Setores/Setores.jsx";
import CadastrarProfissional from "./Components/UserHospital/CadastrarProfissional/CadastrarProfissional.jsx";
import TelaPrincipalEscalista from "./Components/UserEscalista/TelaPrincipal/TelaPrincipal.jsx";
import CriarPlantao from "./Components/UserEscalista/CriarPlantao/CriarPlantao.jsx";
import MedicosSetor from "./Components/UserEscalista/MedicosSetor/MedicosSetor.jsx";
import Colaboradores from "./Components/UserHospital/Colaboradores/Colaboradores.jsx";
import PerfilHospital from "./Components/UserHospital/Perfil/Perfil.jsx";
import EscalistaInfo from "./Components/UserHospital/EscalistaInfo/EscalistaInfo.jsx";
import PerfilEscalista from "./Components/UserEscalista/Perfil/Perfil.jsx"
import Delegacao from "./Components/UserEscalista/Delegacao/Delegacao.jsx";
import DetalhePlantonista from "./Components/UserEscalista/DetalhePlantonista/DetalhePlantonista.jsx"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        //TODOS
        <Route path="/" element={<Home />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/CadastroTipo" element={<CadastroTipo />} />
        <Route path="/CadastroHospital" element={<CadastroHospital />} />
        <Route path="/CadastroMedico" element={<CadastroMedico />} />
        <Route path="/RecuperarSenha" element={<RecuperarSenha />} />
        {/* PLNTONISTA */}
        <Route
          path="/UserPlantonista/Perfil"
          element={
            <ProtectedRoute allowedRoles={["medico"]}>
              <PerfilPlantonista />
            </ProtectedRoute>
          }
        />
        <Route
          path="/UserPlantonista/TelaPrincipal"
          element={
            <ProtectedRoute allowedRoles={["medico"]}>
              <TelaPrincipal />
            </ProtectedRoute>
          }
        />
        <Route
          path="/UserPlantonista/ResolucaoConflito"
          element={
            <ProtectedRoute allowedRoles={["medico"]}>
              <ResolucaoConflito />
            </ProtectedRoute>
          }
        />
        <Route
          path="/UserPlantonista/Agenda"
          element={
            <ProtectedRoute allowedRoles={["medico"]}>
              <Agenda />
            </ProtectedRoute>
          }
        />
        <Route
          path="/UserPlantonista/DetalhePlantao/:id"
          element={
            <ProtectedRoute allowedRoles={["medico"]}>
              <DetalhePlantao />
            </ProtectedRoute>
          }
        />
        <Route
          path="/UserPlantonista/PlantoesOfertados"
          element={
            <ProtectedRoute allowedRoles={["medico"]}>
              <PlantoesOfertados />
            </ProtectedRoute>
          }
        />
        <Route
          path="/UserPlantonista/OferecerPlantao"
          element={
            <ProtectedRoute allowedRoles={["medico"]}>
              <OferecerPlantao />
            </ProtectedRoute>
          }
        />
        <Route
          path="/UserPlantonista/DetalhesOferta"
          element={
            <ProtectedRoute allowedRoles={["medico"]}>
              <DetalhesOferta />
            </ProtectedRoute>
          }
        />
        {/*HOSPITAL: */}
        <Route
          path="/UserHospital/TelaPrincipal"
          element={
            <ProtectedRoute allowedRoles={["hospital"]}>
              <TelaPrincipalHospital />
            </ProtectedRoute>
          }
        />
        <Route
          path="/UserHospital/CadastrarProfissional"
          element={
            <ProtectedRoute allowedRoles={["hospital"]}>
              <CadastrarProfissional />
            </ProtectedRoute>
          }
        />
        <Route
          path="/UserHospital/Colaboradores"
          element={
            <ProtectedRoute allowedRoles={["hospital"]}>
              <Colaboradores />
            </ProtectedRoute>
          }
        />
        <Route
          path="/UserHospital/Setores"
          element={
            <ProtectedRoute allowedRoles={["hospital"]}>
              <Setores />
            </ProtectedRoute>
          }
        />
        <Route
          path="/UserHospital/Perfil"
          element={
            <ProtectedRoute allowedRoles={["hospital"]}>
              <PerfilHospital />
            </ProtectedRoute>
          }
        />
        <Route
          path="/UserHospital/EscalistaInfo/:id"
          element={
            <ProtectedRoute allowedRoles={["hospital"]}>
              <EscalistaInfo />
            </ProtectedRoute>
          }
        />
        {/* ESCALISTA */}
        <Route
          path="/UserEscalista/TelaPrincipal"
          element={
            <ProtectedRoute allowedRoles={["escalista"]}>
              <TelaPrincipalEscalista />
            </ProtectedRoute>
          }
        />
        <Route
          path="/UserEscalista/Medicos"
          element={
            <ProtectedRoute allowedRoles={["escalista"]}>
              <MedicosSetor />
            </ProtectedRoute>
          }
        />

        <Route
          path="/UserEscalista/Medicos/:id"
          element={
            <ProtectedRoute allowedRoles={["escalista"]}>
              <DetalhePlantonista />
            </ProtectedRoute>
          }
        />

        <Route
          path="/detalhePlantonista"
          element={
            <ProtectedRoute allowedRoles={["escalista"]}>
              <DetalhePlantonista />
            </ProtectedRoute>
          }
        />

        
        <Route
          path="/UserEscalista/CriarPlantao"
          element={
            <ProtectedRoute allowedRoles={["escalista"]}>
              <CriarPlantao />
            </ProtectedRoute>
          }
        />
        <Route
          path="/UserEscalista/Delegacao"
          element={
            <ProtectedRoute allowedRoles={["escalista"]}>
              <Delegacao />
            </ProtectedRoute>
          }
        />
        <Route 
          path="/UserEscalista/Perfil"
          element={
            <ProtectedRoute allowedRoles={["escalista"]} >
              <PerfilEscalista/>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
