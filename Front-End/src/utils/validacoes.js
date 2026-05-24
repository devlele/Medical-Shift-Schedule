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

// Validação de CNPJ Corrigida
export const validarCNPJ = (cnpj) => {
  if (!cnpj) return false;

  // Remove caracteres não numéricos
  const cleanCNPJ = cnpj.toString().replace(/\D/g, "");

  // Verifica tamanho e rejeita sequências repetidas conhecidas
  if (cleanCNPJ.length !== 14 || /^(\d)\1+$/.test(cleanCNPJ)) return false;

  // Validação do primeiro dígito verificador (DV)
  let tamanho = 12;
  let numeros = cleanCNPJ.substring(0, tamanho);
  let digitos = cleanCNPJ.substring(tamanho);
  let soma = 0;
  let pos = 5; // O primeiro cálculo começa com peso 5

  for (let i = tamanho; i >= 1; i--) {
    soma += numeros.charAt(tamanho - i) * pos;
    pos--;
    if (pos < 2) pos = 9; // Após o 2, o peso volta para 9
  }

  let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
  if (resultado !== parseInt(digitos.charAt(0))) return false;

  // Validação do segundo dígito verificador (DV)
  tamanho = 13;
  numeros = cleanCNPJ.substring(0, tamanho);
  soma = 0;
  pos = 6; // O segundo cálculo começa com peso 6

  for (let i = tamanho; i >= 1; i--) {
    soma += numeros.charAt(tamanho - i) * pos;
    pos--;
    if (pos < 2) pos = 9; // Após o 2, o peso volta para 9
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
