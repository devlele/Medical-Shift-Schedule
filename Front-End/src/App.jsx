import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Login from "./Components/Login/Login";
import Home from "./Components/Home/Home";
import CadastroMedico from "./Components/CadastroMedico/CadastroMedico";
import CadastroTipo from "./Components/CadastroTipo/CadastroTipo";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/CadastroMedico" element={<CadastroMedico />} />
        <Route path="/CadastroTipo" element={<CadastroTipo />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
