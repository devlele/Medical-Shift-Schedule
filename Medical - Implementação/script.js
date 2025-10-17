function toggleSenha(idInput, idIcone) {
    const input = document.getElementById(idInput);
    const icone = document.getElementById(idIcone);

    if (input.type === "password") {
        input.type = "text";
        icone.src = "icons/olho-aberto.png";
    } else {
        input.type = "password";
        icone.src = "icons/olho-fechado.png";
    }
}


