import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Login from "./Components/Login/Login";
import Home from "./Components/Home/Home";
import CadastroMedico from "./Components/CadastroMedico/CadastroMedico";
import CadastroHospital from "./Components/CadastroHospital/CadastroHospital";
import CadastroTipo from "./Components/CadastroTipo/CadastroTipo";
import Perfil from "./Components/Perfil/Perfil";
import TelaPrincipal from "./Components/TelaPrincipal/TelaPrincipal";
import RecuperarSenha from "./Components/RecuperarSenha/RecuperarSenha";
import Agenda from "./Components/Agenda/Agenda";
import Historico from "./Components/Historico/Historico";

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
        <Route path="/RecuperarSenha" element={<RecuperarSenha />} />
        <Route path="/Agenda" element={<Agenda />} />
        <Route path="/historico" element={<Historico />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
