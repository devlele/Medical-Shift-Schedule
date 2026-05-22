import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Login from "./Components/Login/Login";
import Home from "./Components/Home/Home";
import CadastroMedico from "./Components/CadastroMedico/CadastroMedico";
import CadastroHospital from "./Components/CadastroHospital/CadastroHospital";
import CadastroTipo from "./Components/CadastroTipo/CadastroTipo";
import Perfil from "./Components/UserPlantonista/Perfil/Perfil";
import TelaPrincipal from "./Components/UserPlantonista/TelaPrincipal/TelaPrincipal";
import ResolucaoConflito from "./Components/UserPlantonista/ResolucaoConflito/ResolucaoConflito";
import RecuperarSenha from "./Components/RecuperarSenha/RecuperarSenha";
import Agenda from "./Components/UserPlantonista/Agenda/Agenda";
import DetalhePlantao from "./Components/UserPlantonista/Agenda/DetalhePlantao";
import Historico from "./Components/UserPlantonista/Historico/Historico";
import PlantoesOfertados from "./Components/UserPlantonista/Plantoes/PlantoesOfertados.jsx";
import DetalhesOferta from "./Components/UserPlantonista/Plantoes/DetalhesOferta.jsx";
import OferecerPlantao from "./Components/UserPlantonista/Plantoes/OferecerPlantao.jsx";
import TelaPrincipalHospital from "./Components/UserHospital/TelaPrincipal/TelaPrincipal";
import Setores from "./Components/UserHospital/Setores/Setores.jsx";
import CadastrarProfissional from "./Components/UserHospital/CadastrarProfissional/CadastrarProfissional.jsx";
import TelaPrincipalEscalista from "./Components/UserEscalista/TelaPrincipal/TelaPrincipal.jsx";
import CriarPlantao from "./Components/UserEscalista/CriarPlantao/CriarPlantao.jsx";
import MedicosSetor from "./Components/UserEscalista/MedicosSetor/MedicosSetor.jsx";

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

        //PLNTONISTA:
        <Route path="/UserPlantonista/Perfil" element={<Perfil />} />
        <Route path="/UserPlantonista/TelaPrincipal" element={<TelaPrincipal />} />
        <Route path="/UserPlantonista/ResolucaoConflito" element={<ResolucaoConflito />} />
        <Route path="/UserPlantonista/Agenda" element={<Agenda />} />
        <Route path="/UserPlantonista/DetalhePlantao/:id" element={<DetalhePlantao />} />
        <Route path="/UserPlantonista/Historico" element={<Historico />} />
        <Route path="/UserPlantonista/PlantoesOfertados" element={<PlantoesOfertados />} />
        <Route path="/UserPlantonista/OferecerPlantao" element={<OferecerPlantao />} />
        <Route path="/UserPlantonista/DetalhesOferta" element={<DetalhesOferta />} />

        //HOSPITAL:
        <Route path="/UserHospital/TelaPrincipal" element={<TelaPrincipalHospital />} />
        <Route path="/UserHospital/CadastrarProfissional" element={<CadastrarProfissional />} />
        <Route path="/UserHospital/Setores" element={<Setores />} />

        //ESCALISTA:
        <Route path="/UserEscalista/TelaPrincipal" element={<TelaPrincipalEscalista />} />
        <Route path="/UserEscalista/Medicos" element={<MedicosSetor />} />
        <Route path="/UserEscalista/CriarPlantao" element={<CriarPlantao />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
