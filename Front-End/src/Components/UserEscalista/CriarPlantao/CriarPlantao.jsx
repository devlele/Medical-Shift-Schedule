import { useState } from "react";
import "./CriarPlantao.css";
import Sidebar from "../../Sidebar/Sidebar";
import userImg from "../../../assets/draGrey.png";

import {
    Bell,
    Settings,
    CalendarDays,
    Clock3,
    Building2,
    FileText,
    Users,
    UserRound,
    RotateCcw,
    Upload,
} from "lucide-react";

export default function CriarPlantao() {
    const [formData, setFormData] =
        useState({
            dataPlantao: "",
            horaInicio: "",
            horaFim: "",
            unidade: "",
            especialidade: "",
            vagas: 1,
            profissional: "",
            frequencia: "semanal",
        });

    function handleChange(e) {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    }

    function handleFrequencia(tipo) {
        setFormData((prev) => ({
            ...prev,
            frequencia: tipo,
        }));
    }

    function handleClear() {
        setFormData({
            dataPlantao: "",
            horaInicio: "",
            horaFim: "",
            unidade: "",
            especialidade: "",
            vagas: 1,
            profissional: "",
            frequencia: "semanal",
        });
    }

    async function handleSubmit(e) {
        e.preventDefault();

        console.log(formData);
    }

    return (
        <div className="layout-escalista">
            <Sidebar />

            <main className="criar-plantao-container">
                {/* HEADER */}
                <header className="topo-escalista">
                    <div>
                        <h1>Criar Plantão</h1>
                        <p>
                            Crie um plantão e associe a um
                            plantonista
                        </p>
                    </div>

                    <div className="topo-direita">
                        <Bell className="icone-topo" />
                        <Settings className="icone-topo" />

                        <div className="user">
                            <img
                                src={userImg}
                                alt="user"
                            />
                            <span>Dr(a). Grey</span>
                        </div>
                    </div>
                </header>

                <form
                    className="plantao-card"
                    onSubmit={handleSubmit}
                >
                    {/* DATA + HORÁRIOS */}
                    <div className="linha-tripla">
                        <div className="campo">
                            <label>Data do Plantão</label>

                            <div className="input-box">
                                <CalendarDays size={18} />

                                <input
                                    type="date"
                                    name="dataPlantao"
                                    value={formData.dataPlantao}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="campo">
                            <label>Hora Início</label>

                            <div className="input-box">
                                <Clock3 size={18} />

                                <input
                                    type="time"
                                    name="horaInicio"
                                    value={formData.horaInicio}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="campo">
                            <label>Hora Fim</label>

                            <div className="input-box">
                                <Clock3 size={18} />

                                <input
                                    type="time"
                                    name="horaFim"
                                    value={formData.horaFim}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                    </div>

                    {/* UNIDADE */}
                    <div className="campo">
                        <label>
                            Unidade / Setor
                        </label>

                        <div className="input-box">
                            <Building2 size={18} />

                            <select
                                name="unidade"
                                value={
                                    formData.unidade
                                }
                                onChange={
                                    handleChange
                                }
                            >
                                <option value="">
                                    Selecione
                                </option>

                                <option value="uti-adulto">
                                    UTI Adulto
                                </option>

                                <option value="pediatria">
                                    Pediatria
                                </option>

                                <option value="cardiologia">
                                    Cardiologia
                                </option>
                            </select>
                        </div>
                    </div>

                    {/* ESPECIALIDADE + VAGAS */}
                    <div className="linha-dupla especialidade-grid">
                        <div className="campo">
                            <label>
                                Especialidade
                                Requerida
                            </label>

                            <div className="input-box">
                                <FileText size={18} />

                                <select
                                    name="especialidade"
                                    value={
                                        formData.especialidade
                                    }
                                    onChange={
                                        handleChange
                                    }
                                >
                                    <option value="">
                                        Selecione
                                    </option>

                                    <option value="enfermagem-intensivista">
                                        Enfermagem
                                        Intensivista
                                    </option>
                                </select>
                            </div>
                        </div>

                        <div className="campo vagas">
                            <label>Vagas</label>

                            <div className="input-box">
                                <Users size={18} />

                                <input
                                    type="number"
                                    min="1"
                                    name="vagas"
                                    value={
                                        formData.vagas
                                    }
                                    onChange={
                                        handleChange
                                    }
                                />
                            </div>
                        </div>
                    </div>

                    {/* PROFISSIONAL */}
                    <div className="campo">
                        <label>
                            Profissionais
                            (Opcional)
                        </label>

                        <div className="input-box">
                            <UserRound size={18} />

                            <select
                                name="profissional"
                                value={
                                    formData.profissional
                                }
                                onChange={
                                    handleChange
                                }
                            >
                                <option value="">
                                    Selecione
                                </option>

                                <option value="1">
                                    Dr. Mateus
                                </option>

                                <option value="2">
                                    Dra. Helena
                                </option>
                            </select>
                        </div>
                    </div>

                    {/* FREQUÊNCIA */}
                    <div className="campo">
                        <label>
                            Frequência
                        </label>

                        <div className="frequencia-buttons">
                            <button
                                type="button"
                                className={`freq-btn ${formData.frequencia ===
                                    "semanal"
                                    ? "active"
                                    : ""
                                    }`}
                                onClick={() =>
                                    handleFrequencia(
                                        "semanal"
                                    )
                                }
                            >
                                Toda semana
                            </button>

                            <button
                                type="button"
                                className={`freq-btn ${formData.frequencia ===
                                    "unico"
                                    ? "active"
                                    : ""
                                    }`}
                                onClick={() =>
                                    handleFrequencia(
                                        "unico"
                                    )
                                }
                            >
                                Plantão Único
                            </button>

                            <button
                                type="button"
                                className={`freq-btn ${formData.frequencia ===
                                    "mensal"
                                    ? "active"
                                    : ""
                                    }`}
                                onClick={() =>
                                    handleFrequencia(
                                        "mensal"
                                    )
                                }
                            >
                                Todo Mês
                            </button>
                        </div>
                    </div>

                    <div className="divider" />

                    {/* FOOTER */}
                    <div className="footer-form">
                        <button
                            type="button"
                            className="limpar-btn"
                            onClick={handleClear}
                        >
                            <RotateCcw size={18} />
                            Limpar Campos
                        </button>

                        <button
                            type="submit"
                            className="criar-btn"
                        >
                            <Upload size={18} />
                            Criar Plantão
                        </button>
                    </div>
                </form>
            </main>
        </div>
    );
}