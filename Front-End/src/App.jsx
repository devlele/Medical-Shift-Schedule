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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/CadastroTipo" element={<CadastroTipo />} />
        <Route path="/CadastroHospital" element={<CadastroHospital />} />
        <Route path="/CadastroMedico" element={<CadastroMedico />} />
        <Route path="/Perfil" element={<Perfil />} />
        <Route path="/TelaPrincipal" element={<TelaPrincipal />} />
        <Route path="/ResolucaoConflito" element={<ResolucaoConflito />} />
        <Route path="/RecuperarSenha" element={<RecuperarSenha />} />
        <Route path="/Agenda" element={<Agenda />} />
        <Route path="/DetalhePlantao/:id" element={<DetalhePlantao />} />
        <Route path="/historico" element={<Historico />} />
        <Route path="/PlantoesOfertados" element={<PlantoesOfertados />} />
        <Route path="/OferecerPlantao" element={<OferecerPlantao />} />
        <Route path="/DetalhesOferta" element={<DetalhesOferta />} />
        <Route
          path="/UserHospital/TelaPrincipal"
          element={<TelaPrincipalHospital />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
