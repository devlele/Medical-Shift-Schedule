// Validação de Email
export const validarEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

// Validação de Senha
export const validarSenha = (senha) => {
  return senha.length >= 6;
};

// Validação de Telefone
export const validarTelefone = (telefone) => {
  const regex = /^\(\d{2}\)\s\d{4,5}-\d{4}$/;
  return regex.test(telefone);
};

// Validação de CNPJ
export const validarCNPJ = (cnpj) => {
  const cleanCNPJ = cnpj.replace(/\D/g, "");
  if (cleanCNPJ.length !== 14) return false;

  let tamanho = cleanCNPJ.length - 2;
  let numeros = cleanCNPJ.substring(0, tamanho);
  let digitos = cleanCNPJ.substring(tamanho);
  let soma = 0;
  let pos = 0;

  for (let i = tamanho - 7; i >= 0; i--) {
    soma += numeros.charAt(tamanho - 7 - i) * (pos + 2);
    pos++;
  }

  let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
  if (resultado !== parseInt(digitos.charAt(0))) return false;

  tamanho = tamanho + 1;
  numeros = cleanCNPJ.substring(0, tamanho);
  soma = 0;
  pos = 0;

  for (let i = tamanho - 7; i >= 0; i--) {
    soma += numeros.charAt(tamanho - 7 - i) * (pos + 2);
    pos++;
  }

  resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
  if (resultado !== parseInt(digitos.charAt(1))) return false;

  return true;
};

// Validação de CRM
export const validarCRM = (crm) => {
  const cleanCRM = crm.replace(/\D/g, "");
  return cleanCRM.length >= 5 && cleanCRM.length <= 8;
};

// Validação de campo obrigatório
export const validarCampoObrigatorio = (valor) => {
  return valor && valor.trim().length > 0;
};

// Formatação de Telefone
export const formatarTelefone = (valor) => {
  valor = valor.replace(/\D/g, "");
  if (valor.length > 11) valor = valor.slice(0, 11);
  valor = valor.replace(/(\d{2})(\d)/, "($1) $2");
  valor = valor.replace(/(\d{5})(\d)/, "$1-$2");
  return valor;
};

// Formatação de CNPJ
export const formatarCNPJ = (valor) => {
  valor = valor.replace(/\D/g, "");
  valor = valor.replace(/(\d{2})(\d)/, "$1.$2");
  valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
  valor = valor.replace(/(\d{3})(\d)/, "$1/$2");
  valor = valor.replace(/(\d{4})(\d)/, "$1-$2");
  return valor;
};
