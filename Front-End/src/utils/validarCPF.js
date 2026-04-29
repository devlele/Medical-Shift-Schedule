export function validarCPF(cpf) {
  cpf = cpf.replace(/\D/g, "");

  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) {
    return false;
  }

  const calcularDigito = (cpfParcial, pesoInicial) => {
    let soma = 0;

    for (let i = 0; i < cpfParcial.length; i++) {
      soma += parseInt(cpfParcial[i]) * (pesoInicial - i);
    }

    let resto = (soma * 10) % 11;

    return resto === 10 ? 0 : resto;
  };

  const digito1 = calcularDigito(cpf.substring(0, 9), 10);
  const digito2 = calcularDigito(cpf.substring(0, 10), 11);

  return digito1 === parseInt(cpf[9]) && digito2 === parseInt(cpf[10]);
}
