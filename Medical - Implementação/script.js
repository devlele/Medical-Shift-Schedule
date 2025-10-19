/* ============================================================
   Medical Shift Schedule - Script principal
   Controla login, cadastro e tela de carregamento
============================================================ */

/* Mostra ou oculta a senha digitada */
function toggleSenha(idInput, idIcone) {
    const input = document.getElementById(idInput);
    const icone = document.getElementById(idIcone);
    if (!input || !icone) return;

    if (input.type === 'password') {
        input.type = 'text';
        icone.src = 'icons/olho-aberto.png';
    }
    else {
        input.type = 'password';
        icone.src = 'icons/olho-fechado.png';
    }
}

/* Mostra tela de carregamento antes de trocar de página */
function mostrarLoading(destino) {
    localStorage.setItem("destinoLoading", destino);
    window.location.href = "loading.html";
}

/* Etapa 1 do cadastro - salva nome e e-mail */
function salvarCadastroBasico(event) {
    if (event) event.preventDefault();

    const nome = document.getElementById('nome')?.value.trim() || "Usuário Teste";
    const email = document.getElementById('email-cad')?.value.trim() || "teste@email.com";

    localStorage.setItem('nomeUsuario', nome);
    localStorage.setItem('emailUsuario', email);

    mostrarLoading('cadastro2.html');
}

/* Etapa 2 - salva (ou simula) foto de perfil */
function salvarFotoPerfil(event) {
    if (event) event.preventDefault();
    const inputFoto = document.getElementById('foto');

    if (inputFoto?.files.length > 0) {
        const file = inputFoto.files[0];
        const reader = new FileReader();

        reader.onload = function (e) {
            localStorage.setItem('fotoPerfil', e.target.result);
            mostrarLoading('cadastro3.html');
        };

        reader.readAsDataURL(file);
    }
    else {
        mostrarLoading('cadastro3.html');
    }
}

/* Etapa 3 - finaliza cadastro e salva PIS */
function finalizarCadastro(event) {
    if (event) event.preventDefault();
    const pis = document.getElementById('pis')?.value || "000000";
    localStorage.setItem('pisUsuario', pis);
    mostrarLoading('confirmacao_pis.html');
}

/* Simula login e vai direto pra home */
function logarUsuario() {
    mostrarLoading('home.html');
}

/* Simula envio de recuperação de senha */
function enviarRecuperacao(event) {
    if (event) event.preventDefault();
    const msg = document.getElementById('mensagem-recuperar');
    if (msg) {
        msg.textContent = '📧 E-mail de recuperação enviado (simulado).';
        msg.style.color = '#0a4f5c';
    }
}

/* Mostra nome e foto na home */
if (window.location.pathname.includes('home.html')) {
    const nome = localStorage.getItem('nomeUsuario') || "Dr(a). Nome Sobrenome";
    const foto = localStorage.getItem('fotoPerfil');
    const nomeEl = document.getElementById('nome-usuario');
    const fotoEl = document.getElementById('foto-perfil');

    if (nomeEl) nomeEl.textContent = nome;
    if (fotoEl && foto) {
        fotoEl.style.backgroundImage = `url(${foto})`;
        fotoEl.style.backgroundSize = 'cover';
        fotoEl.style.backgroundPosition = 'center';
    }
}

/* Controla a tela de carregamento */
if (window.location.pathname.includes('loading.html')) {
    const destino = localStorage.getItem("destinoLoading") || "login.html";
    setTimeout(() => window.location.href = destino, 1500);
}

/* Limpa dados e volta pro login */
function sair() {
    localStorage.clear();
    mostrarLoading('login.html');
}
