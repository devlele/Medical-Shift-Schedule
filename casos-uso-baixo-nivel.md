# Quadro 1 - Caso de uso – Cadastrar Usuário

| Caso de Uso    | RF01: Cadastrar Usuário |
|----------------|--------------------------|
| Ator Principal | USUÁRIO                  |
| Ator Secundário| —                        |
| Pré-Condição   | O usuário não possui cadastro no sistema. O sistema está disponível. |
| Pós-Condição   | Dados do usuário persistidos no banco de dados. O usuário pode realizar login. |

## Cadastrar

| Ações do Ator | Ações do Sistema |
|---------------|------------------|
| 1 – O usuário acessa a tela de cadastro. | 2 – O sistema exibe o formulário com campos obrigatórios: nome completo, e-mail, CPF, gênero, data de nascimento e senha. |
| 3 – O usuário preenche os campos obrigatórios e submete o formulário. | 4 – O sistema valida o formato do e‑mail, a unicidade do CPF e do e‑mail na base de dados, a força da senha e a idade mínima (18 anos). |
| 5 – O usuário visualiza a mensagem de sucesso. | 6 – O sistema armazena os dados do usuário (com senha criptografada) e exibe mensagem de confirmação de cadastro. |

---

# Quadro 2 - Caso de uso – Login

| Caso de Uso    | RF02: Login             |
|----------------|-------------------------|
| Ator Principal | USUÁRIO                 |
| Ator Secundário| —                       |
| Pré-Condição   | O usuário possui cadastro ativo no sistema. O sistema está disponível. |
| Pós-Condição   | Sessão autenticada do usuário iniciada. Acesso concedido à área restrita da aplicação. |

## Realizar Login

| Ações do Ator | Ações do Sistema |
|---------------|------------------|
| 1 – O usuário acessa a tela de login. | 2 – O sistema exibe os campos e‑mail e senha. |
| 3 – O usuário informa e‑mail e senha e submete. | 4 – O sistema valida as credenciais informadas comparando com os registros da base de dados. |
| 5 – O usuário é redirecionado para a página inicial da aplicação. | 6 – O sistema inicia a sessão autenticada do usuário e carrega as permissões associadas ao seu perfil. |

---

# Quadro 3 - Caso de uso – Visualização Personalizada

| Caso de Uso    | RF03: Visualização Personalizada |
|----------------|----------------------------------|
| Ator Principal | PLANTONISTA                      |
| Ator Secundário| —                                |
| Pré-Condição   | O usuário deve ter uma sessão ativa no sistema. |
| Pós-Condição   | Agenda exibida no formato escolhido (diário, semanal ou mensal). |

## Selecionar Formato de Visualização da Agenda

| Ações do Ator | Ações do Sistema |
|---------------|------------------|
| 1 – O usuário acessa a tela de agenda. | 2 – O sistema exibe a agenda padrão (mensal) e as opções de visualização: Diário, Semanal, Mensal. |
| 3 – O usuário seleciona um dos formatos de visualização. | 4 – O sistema recarrega a agenda com os plantões do período correspondente ao formato escolhido. |

---

# Quadro 4 - Caso de uso – Filtrar e Categorizar Plantões

| Caso de Uso    | RF04: Filtrar e Categorizar Plantões |
|----------------|--------------------------------------|
| Ator Principal | PLANTONISTA                          |
| Ator Secundário| —                                    |
| Pré-Condição   | O usuário deve ter uma sessão ativa no sistema. A agenda contém plantões cadastrados. |
| Pós-Condição   | Lista de plantões exibida de acordo com os filtros aplicados. |

## Filtrar Plantões

| Ações do Ator | Ações do Sistema |
|---------------|------------------|
| 1 – O usuário acessa a tela de agenda e aciona a opção “Filtrar”. | 2 – O sistema exibe os critérios de filtro disponíveis: turno (manhã, tarde, noite), status (confirmado, pendente, disponível), área médica e unidade de saúde. |
| 3 – O usuário seleciona um ou mais critérios de filtro e confirma. | 4 – O sistema processa os critérios e retorna a lista de plantões que atendem aos filtros aplicados, exibindo-os na grade da agenda. |

---

# Quadro 5 - Caso de uso – Consultar Histórico

| Caso de Uso    | RF05: Consultar Histórico |
|----------------|---------------------------|
| Ator Principal | USUÁRIO                   |
| Ator Secundário| —                         |
| Pré-Condição   | O usuário deve ter uma sessão ativa no sistema. Existem plantões finalizados associados ao usuário. |
| Pós-Condição   | Histórico de plantões apresentado ao usuário. |

## Consultar Histórico de Plantões

| Ações do Ator | Ações do Sistema |
|---------------|------------------|
| 1 – O usuário acessa a opção “Histórico” no menu principal. | 2 – O sistema exibe uma lista com todos os plantões já finalizados do usuário, ordenados por data (mais recente primeiro). |
| 3 – O usuário pode rolar a lista e visualizar detalhes de cada plantão. | 4 – O sistema apresenta informações como data, horário, unidade de saúde, área de atuação e status final (realizado, não compareceu). |

---

# Quadro 6 - Caso de uso – Registrar Check‑in e Check‑out

| Caso de Uso    | RF06: Registrar Check‑in e Check‑out |
|----------------|--------------------------------------|
| Ator Principal | PLANTONISTA                          |
| Ator Secundário| —                                    |
| Pré-Condição   | O usuário deve ter uma sessão ativa no sistema. Existe um plantão confirmado para o usuário no horário atual. |
| Pós-Condição   | Horário de entrada e/ou saída registrados no sistema. |

## Registrar Ponto

| Ações do Ator | Ações do Sistema |
|---------------|------------------|
| 1 – O usuário acessa a agenda e localiza o plantão do dia. | 2 – O sistema exibe o plantão com os botões “Check‑in” e “Check‑out”, conforme o estado atual do plantão. |
| 3 – O usuário aciona o botão “Check‑in” no início do plantão. | 4 – O sistema registra a data e hora exatas da ação e altera o estado do botão para “Check‑out”. |
| 5 – Ao final do plantão, o usuário aciona o botão “Check‑out”. | 6 – O sistema registra a data e hora da saída e calcula o total de horas trabalhadas, atualizando o status do plantão para “Finalizado”. |

---

# Quadro 7 - Caso de uso – Oferecer Plantões (Delegação)

| Caso de Uso    | RF07: Oferecer Plantões (Delegação) |
|----------------|-------------------------------------|
| Ator Principal | PLANTONISTA                         |
| Ator Secundário| Sistema de Notificação              |
| Pré-Condição   | O usuário deve ter uma sessão ativa. O usuário possui um plantão confirmado futuro. |
| Pós-Condição   | Plantão disponibilizado para outros profissionais. Notificação enviada aos potenciais interessados. |

## Oferecer Plantão

| Ações do Ator | Ações do Sistema |
|---------------|------------------|
| 1 – O usuário seleciona um plantão futuro em sua agenda e aciona a opção “Oferecer Plantão”. | 2 – O sistema exibe uma tela de confirmação com os detalhes do plantão. |
| 3 – O usuário confirma a oferta do plantão. | 4 – O sistema altera o status do plantão para “Disponível para troca” e notifica os profissionais habilitados da mesma área sobre a oportunidade. |

---

# Quadro 8 - Caso de uso – Manifestar Interesse em Plantão

| Caso de Uso    | RF08: Manifestar Interesse em Plantão |
|----------------|---------------------------------------|
| Ator Principal | PLANTONISTA                           |
| Ator Secundário| Sistema de Notificação                |
| Pré-Condição   | O usuário deve ter uma sessão ativa. Existe ao menos um plantão com status “Disponível para troca” visível para o usuário. |
| Pós-Condição   | Interesse registrado. Notificação enviada ao ofertante do plantão. |

## Manifestar Interesse

| Ações do Ator | Ações do Sistema |
|---------------|------------------|
| 1 – O usuário visualiza um plantão disponível na agenda ou na lista de oportunidades. | 2 – O sistema exibe o botão “Tenho Interesse” ao lado do plantão disponível. |
| 3 – O usuário aciona o botão “Tenho Interesse”. | 4 – O sistema registra a manifestação de interesse e notifica o profissional que ofertou o plantão sobre a candidatura. |

---

# Quadro 9 - Caso de uso – Gerenciar Plantões

| Caso de Uso    | RF09: Gerenciar Plantões |
|----------------|--------------------------|
| Ator Principal | ESCALISTA                |
| Ator Secundário| —                        |
| Pré-Condição   | O usuário deve ter uma sessão ativa e perfil de acesso “Escalista”. |
| Pós-Condição   | Dados dos plantões persistidos, alterados ou removidos da base de dados. |

## Cadastrar Plantão

| Ações do Ator | Ações do Sistema |
|---------------|------------------|
| 1 – O escalista acessa a funcionalidade “Gerenciar Plantões” e seleciona “Novo Plantão”. | 2 – O sistema exibe o formulário com campos: data, horário, unidade de saúde, área médica, profissional responsável e tipo de plantão (fixo/variável). |
| 3 – O escalista preenche os dados e submete. | 4 – O sistema valida se não há conflito de horário para o profissional na data e horário selecionados. |
| 5 – O escalista visualiza a confirmação. | 6 – O sistema armazena o novo plantão e atualiza a agenda do profissional. |

## Alterar Plantão

| Ações do Ator | Ações do Sistema |
|---------------|------------------|
| 1 – O escalista localiza um plantão existente na lista e aciona a opção “Editar”. | 2 – O sistema carrega os dados atuais do plantão no formulário de edição. |
| 3 – O escalista modifica os campos desejados (ex: horário, profissional) e submete. | 4 – O sistema valida os novos dados (incluindo conflitos de horário) e atualiza o registro na base. |
| 5 – O escalista visualiza a confirmação da alteração. | 6 – O sistema notifica o(s) profissional(is) afetado(s) sobre a mudança na escala. |

## Excluir Plantão

| Ações do Ator | Ações do Sistema |
|---------------|------------------|
| 1 – O escalista localiza um plantão na lista e aciona a opção “Excluir”. | 2 – O sistema exibe uma mensagem de confirmação da exclusão. |
| 3 – O escalista confirma a exclusão. | 4 – O sistema remove o plantão da base de dados e atualiza a agenda dos envolvidos. |

---

# Quadro 10 - Caso de uso – Definir Tipos de Plantões

| Caso de Uso    | RF10: Definir Tipos de Plantões |
|----------------|---------------------------------|
| Ator Principal | ESCALISTA                       |
| Ator Secundário| —                               |
| Pré-Condição   | O usuário deve ter uma sessão ativa. Está no fluxo de cadastro ou edição de um plantão. |
| Pós-Condição   | Tipo do plantão (Fixo ou Variável) definido e salvo. |

## Definir Tipo do Plantão

| Ações do Ator | Ações do Sistema |
|---------------|------------------|
| 1 – Durante o cadastro ou edição de um plantão, o escalista seleciona a opção “Tipo”. | 2 – O sistema exibe as opções disponíveis: “Fixo” (recorrente) e “Variável” (avulso). |
| 3 – O escalista escolhe uma das opções. | 4 – O sistema associa a propriedade selecionada ao plantão. Caso seja “Fixo”, o sistema habilita a opção de recorrência semanal/mensal. |

---

# Quadro 11 - Caso de uso – Consultar Profissionais Vinculados

| Caso de Uso    | RF11: Consultar Profissionais Vinculados |
|----------------|------------------------------------------|
| Ator Principal | ESCALISTA / USUÁRIO                      |
| Ator Secundário| —                                        |
| Pré-Condição   | O usuário deve ter uma sessão ativa. Existem profissionais cadastrados e vinculados a uma unidade de saúde. |
| Pós-Condição   | Lista de profissionais exibida. |

## Consultar Vinculados

| Ações do Ator | Ações do Sistema |
|---------------|------------------|
| 1 – O usuário acessa a opção “Profissionais” ou “Equipe” no menu. | 2 – O sistema exibe a lista de profissionais vinculados à unidade de saúde do contexto atual. |
| 3 – O usuário pode pesquisar por nome ou especialidade. | 4 – O sistema filtra a lista em tempo real de acordo com o termo digitado. |

---

# Quadro 12 - Caso de uso – Visualizar Escala

| Caso de Uso    | RF12: Visualizar Escala |
|----------------|-------------------------|
| Ator Principal | ESCALISTA / USUÁRIO     |
| Ator Secundário| —                       |
| Pré-Condição   | O usuário deve ter uma sessão ativa. Existem plantões cadastrados. |
| Pós-Condição   | Escala apresentada conforme o critério selecionado. |

## Visualizar Escala por Setor ou Profissional

| Ações do Ator | Ações do Sistema |
|---------------|------------------|
| 1 – O usuário acessa a funcionalidade “Visualizar Escala”. | 2 – O sistema exibe as opções de visualização: “Por Setor” e “Por Profissional”. |
| 3 – O usuário seleciona “Por Setor” e escolhe um setor (ex: UTI, Emergência). | 4 – O sistema retorna a escala semanal/mensal com todos os plantões alocados para aquele setor. |
| 5 – O usuário seleciona “Por Profissional” e escolhe um nome da lista. | 6 – O sistema retorna a agenda individual do profissional selecionado. |

---

# Quadro 13 - Caso de uso – Cadastrar Unidade de Saúde

| Caso de Uso    | RF13: Cadastrar Unidade de Saúde |
|----------------|----------------------------------|
| Ator Principal | ADMINISTRADOR DO SISTEMA         |
| Ator Secundário| —                                |
| Pré-Condição   | O administrador deve ter uma sessão ativa no sistema com perfil de administrador. |
| Pós-Condição   | Nova unidade de saúde cadastrada e apta a receber usuários vinculados. |

## Cadastrar Unidade de Saúde

| Ações do Ator | Ações do Sistema |
|---------------|------------------|
| 1 – O administrador acessa o painel administrativo e seleciona “Cadastrar Unidade de Saúde”. | 2 – O sistema exibe o formulário com campos: CNPJ, razão social, nome fantasia, endereço completo, telefone e e‑mail institucional. |
| 3 – O administrador preenche os dados obrigatórios e submete. | 4 – O sistema valida a unicidade do CNPJ e a consistência dos dados. |
| 5 – O administrador visualiza a confirmação de sucesso. | 6 – O sistema persiste os dados da nova unidade de saúde e cria o ambiente para que o hospital/clínica possa gerenciar seus plantonistas. |
