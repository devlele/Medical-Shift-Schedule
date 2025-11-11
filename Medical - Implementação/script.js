import React, { useState, useEffect } from "react";

/* ============================================================
   Medical Shift Schedule - Script principal (versão React)
   Controla login, cadastro e tela de carregamento
============================================================ */

export default function App() {
    // Estados globais simulando o fluxo de telas
    const [pagina, setPagina] = useState("login");
    const [nomeUsuario, setNomeUsuario] = useState(localStorage.getItem("nomeUsuario") || "");
    const [emailUsuario, setEmailUsuario] = useState(localStorage.getItem("emailUsuario") || "");
    const [fotoPerfil, setFotoPerfil] = useState(localStorage.getItem("fotoPerfil") || "");
    const [pisUsuario, setPisUsuario] = useState(localStorage.getItem("pisUsuario") || "");
    const [mostrarSenha, setMostrarSenha] = useState(false);
    const [mensagemRecuperar, setMensagemRecuperar] = useState("");

    /* ============================================================
       Função: alterna a visibilidade da senha
    ============================================================= */
    function toggleSenha() {
        setMostrarSenha((prev) => !prev);
    }

    /* ============================================================
       Simula mudança de página com loading
    ============================================================= */
    function mostrarLoading(destino) {
        localStorage.setItem("destinoLoading", destino);
        setPagina("loading");
        // Após 1,5s, troca de tela simulando o carregamento
        setTimeout(() => setPagina(destino), 1500);
    }

    /* ============================================================
       Salva nome e email
    ============================================================= */
    function salvarCadastroBasico(event) {
        event.preventDefault();
        localStorage.setItem("nomeUsuario", nomeUsuario || "Usuário Teste");
        localStorage.setItem("emailUsuario", emailUsuario || "teste@email.com");
        mostrarLoading("cadastro2");
    }

    /* ============================================================
       Salva foto de perfil (ou simula)
    ============================================================= */
    function salvarFotoPerfil(event) {
        event.preventDefault();
        const inputFoto = event.target.elements.foto;

        if (inputFoto.files.length > 0) {
            const file = inputFoto.files[0];
            const reader = new FileReader();
            reader.onload = function (e) {
                localStorage.setItem("fotoPerfil", e.target.result);
                setFotoPerfil(e.target.result);
                mostrarLoading("cadastro3");
            };
            reader.readAsDataURL(file);
        } else {
            mostrarLoading("cadastro3");
        }
    }

    /* ============================================================
       Salva PIS e finaliza cadastro
    ============================================================= */
    function finalizarCadastro(event) {
        event.preventDefault();
        localStorage.setItem("pisUsuario", pisUsuario || "000000");
        mostrarLoading("confirmacao_pis");
    }

    /* ============================================================
       Simula login
    ============================================================= */
    function logarUsuario() {
        mostrarLoading("home");
    }

    /* ============================================================
       Simula envio de recuperação de senha
    ============================================================= */
    function enviarRecuperacao(event) {
        event.preventDefault();
        setMensagemRecuperar("📧 E-mail de recuperação enviado (simulado).");
    }

    /* ============================================================
       Logout - limpa tudo e volta ao login
    ============================================================= */
    function sair() {
        localStorage.clear();
        setNomeUsuario("");
        setEmailUsuario("");
        setFotoPerfil("");
        setPisUsuario("");
        mostrarLoading("login");
    }

    /* ============================================================
       Renderização condicional das "páginas"
    ============================================================= */
    if (pagina === "loading") {
        return (
            <div style={{ textAlign: "center", paddingTop: "50px" }}>
                <h2>⏳ Carregando...</h2>
            </div>
        );
    }

    if (pagina === "login") {
        return (
            <div style={{ textAlign: "center", marginTop: "50px" }}>
                <h2>Login</h2>
                <input
                    type={mostrarSenha ? "text" : "password"}
                    placeholder="Senha"
                    style={{ marginBottom: "10px" }}
                />
                <br />
                <button onClick={toggleSenha}>
                    {mostrarSenha ? "🙈 Ocultar" : "👁️ Mostrar Senha"}
                </button>
                <br />
                <button onClick={logarUsuario}>Entrar</button>
                <br />
                <form onSubmit={enviarRecuperacao}>
                    <button type="submit">Esqueci a senha</button>
                </form>
                {mensagemRecuperar && <p>{mensagemRecuperar}</p>}
            </div>
        );
    }

    if (pagina === "cadastro1") {
        return (
            <form onSubmit={salvarCadastroBasico} style={{ textAlign: "center", marginTop: "50px" }}>
                <h2>Cadastro - Etapa 1</h2>
                <input
                    type="text"
                    placeholder="Nome"
                    value={nomeUsuario}
                    onChange={(e) => setNomeUsuario(e.target.value)}
                />
                <br />
                <input
                    type="email"
                    placeholder="E-mail"
                    value={emailUsuario}
                    onChange={(e) => setEmailUsuario(e.target.value)}
                />
                <br />
                <button type="submit">Avançar</button>
            </form>
        );
    }

    if (pagina === "cadastro2") {
        return (
            <form onSubmit={salvarFotoPerfil} style={{ textAlign: "center", marginTop: "50px" }}>
                <h2>Cadastro - Etapa 2</h2>
                <input type="file" name="foto" />
                <br />
                <button type="submit">Avançar</button>
            </form>
        );
    }

    if (pagina === "cadastro3") {
        return (
            <form onSubmit={finalizarCadastro} style={{ textAlign: "center", marginTop: "50px" }}>
                <h2>Cadastro - Etapa 3</h2>
                <input
                    type="text"
                    placeholder="PIS"
                    value={pisUsuario}
                    onChange={(e) => setPisUsuario(e.target.value)}
                />
                <br />
                <button type="submit">Finalizar</button>
            </form>
        );
    }

    if (pagina === "confirmacao_pis") {
        return (
            <div style={{ textAlign: "center", marginTop: "50px" }}>
                <h2>✅ Cadastro concluído!</h2>
                <p>Bem-vindo(a), {nomeUsuario}.</p>
                <button onClick={() => mostrarLoading("home")}>Ir para Home</button>
            </div>
        );
    }

    if (pagina === "home") {
        return (
            <div style={{ textAlign: "center", marginTop: "50px" }}>
                <h2>🏥 Home</h2>
                {fotoPerfil && (
                    <img
                        src={fotoPerfil}
                        alt="Perfil"
                        width="100"
                        height="100"
                        style={{ borderRadius: "50%", objectFit: "cover" }}
                    />
                )}
                <p>Bem-vindo(a), {nomeUsuario || "Dr(a). Nome Sobrenome"}!</p>
                <button onClick={sair}>Sair</button>
            </div>
        );
    }

    return null;
}
