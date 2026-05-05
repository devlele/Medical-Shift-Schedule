# Next Steps - Medical Shift Schedule

Este documento organiza os principais pontos encontrados na analise da logica atual da aplicacao, comparando o codigo existente com o `PROJECT_SUMMARY.md`, o `README.md` e os casos de uso.

## Conclusao Geral

A aplicacao faz sentido como um primeiro nucleo de autenticacao, cadastro e estrutura organizacional:

- Hospital cadastra setores.
- Hospital cadastra managers/escalistas.
- Doctor se cadastra.
- Hospital, Manager e Doctor autenticam via JWT.
- As roles principais ja existem: `ADMIN`, `HOSPITAL`, `MANAGER`, `DOCTOR`.

Porem, a aplicacao ainda nao implementa o dominio central do produto: gerenciamento de escalas e plantoes. No estado atual, ela esta mais proxima de um modulo de identidade e cadastro institucional do que de um sistema completo de escala medica.

## Prioridade 1 - Corrigir Base Tecnica

### 1. Corrigir Flyway e migrations

**Problema:** As migrations estao em `src/main/resources/db/migrations`, mas o padrao do Flyway e `src/main/resources/db/migration`. Durante a execucao dos testes, o log indicou que nenhuma migration foi encontrada.

**Impacto:** O banco esta sendo criado pelo Hibernate via `ddl-auto=update`, nao pelas migrations. Isso torna o schema imprevisivel entre ambientes e invalida a promessa de controle por Flyway.

**Acoes recomendadas:**

- Renomear a pasta `db/migrations` para `db/migration`.
- Corrigir a migration `V1__create-doctor-table.sql`, que possui virgula sobrando no final.
- Adicionar `AUTO_INCREMENT`/identity nos IDs quando necessario.
- Garantir que as colunas das migrations batam com as entidades JPA.
- Incluir coluna `role` em `tb_doctor` e `tb_hospital`, se a persistencia da role for mantida.
- Depois disso, considerar trocar `spring.jpa.hibernate.ddl-auto` de `update` para `validate`.

### 2. Corrigir metodos de delete

**Problema:** `DoctorServiceImple.delete` e `ManagerServiceImple.delete` deletam o registro, mas continuam a execucao e lancam excecao logo depois.

**Impacto:** Mesmo quando a delecao funciona, a API pode responder como erro.

**Acoes recomendadas:**

- Adicionar `return` apos `deleteById`.
- Ou reestruturar com `else`.
- Padronizar excecoes de recurso nao encontrado.

## Prioridade 2 - Alinhar Seguranca com a Regra de Negocio

### 3. Revisar autorizacao dos endpoints

**Problema:** O `PROJECT_SUMMARY.md` documenta alguns endpoints como `ROLE_ADMIN`, mas no codigo eles acabam liberados para qualquer usuario autenticado ou para `ROLE_HOSPITAL`.

**Exemplos:**

- `GET /hospital/{id}` esta documentado como admin, mas cai em `.anyRequest().authenticated()`.
- `GET /doctor/{id}` esta documentado como admin, mas tambem cai em `.anyRequest().authenticated()`.
- `GET /setor/hospital/{id}` esta documentado como admin, mas a configuracao atual permite hospital.

**Impacto:** Usuarios podem consultar dados fora do escopo esperado.

**Acoes recomendadas:**

- Definir uma matriz oficial de permissoes.
- Atualizar `SecurityConfiguration` para refletir essa matriz.
- Ordenar matchers especificos antes de matchers amplos, por exemplo `/setor/hospital/**` antes de `/setor/**`.
- Criar testes de autorizacao para cada role.

### 4. Garantir isolamento entre hospitais

**Problema:** Endpoints como `GET /setor/{id}` e `PUT /setor/{id}` buscam ou alteram setor por ID, sem conferir se o setor pertence ao hospital autenticado.

**Impacto:** Um hospital pode acessar ou alterar dados de outro hospital, se souber o ID.

**Acoes recomendadas:**

- Ao buscar setor por ID, validar `setor.hospital.id == hospitalLogado.id`.
- Repetir essa regra para managers, doctors e futuros plantoes.
- Criar metodos como `findByIdAndHospitalId`.
- Evitar endpoints que recebem `hospitalId` quando o contexto pode vir do token.

## Prioridade 3 - Completar o Fluxo de Cadastro e Vinculos

### 5. Definir fluxo de vinculo Doctor-Hospital-Setor

**Problema:** O medico se cadastra publicamente em `/doctor/register`, mas fica sem hospital e sem setor. O projeto diz que profissionais devem ser vinculados a hospitais e setores por intermedio de escalistas.

**Impacto:** A aplicacao ainda nao consegue responder bem a perguntas como:

- Quais medicos trabalham neste hospital?
- Quais medicos pertencem a este setor?
- Qual manager pode gerenciar este medico?
- Quem pode receber ou cobrir determinado plantao?

**Acoes recomendadas:**

- Criar endpoint para hospital ou manager vincular doctor a hospital/setor.
- Decidir se um doctor pode atuar em multiplos hospitais e setores.
- Se puder, substituir `Doctor.hospital` e `Doctor.setor` por uma entidade de vinculo, por exemplo `DoctorHospitalSetor`.
- Se nao puder, deixar essa limitacao explicita nos requisitos.

### 6. Validacoes de cadastro

**Problema:** Os casos de uso falam em validacao de e-mail, CPF, senha forte e idade minima, mas o codigo valida apenas algumas unicidades.

**Impacto:** Dados invalidos podem entrar no banco e comprometer fluxos futuros.

**Acoes recomendadas:**

- Usar Bean Validation com `@Valid`.
- Adicionar DTOs de entrada em vez de receber entidades JPA diretamente nos controllers.
- Validar formato de e-mail.
- Validar CPF/CNPJ.
- Validar idade minima.
- Validar senha minima/forte.
- Validar campos obrigatorios.

## Prioridade 4 - Implementar o Dominio Principal

### 7. Criar modelo de Plantao/Escala

**Problema:** O produto e descrito como um sistema de escala medica, mas ainda nao ha entidades para escala, plantao, agenda, historico, disponibilidade ou troca.

**Impacto:** A aplicacao ainda nao atende aos principais casos de uso do projeto.

**Acoes recomendadas:**

- Criar entidade `Plantao`.
- Definir campos minimos:
  - data/hora de inicio;
  - data/hora de fim;
  - hospital;
  - setor;
  - medico responsavel;
  - manager responsavel;
  - status;
  - tipo: fixo ou variavel.
- Criar entidade ou enum para status do plantao:
  - pendente;
  - confirmado;
  - disponivel para troca;
  - em andamento;
  - finalizado;
  - cancelado.
- Criar endpoints de CRUD de plantao para `MANAGER`.
- Validar conflito de horario para o medico.

### 8. Implementar visualizacao de agenda

**Problema:** Os casos de uso preveem visualizacao diaria, semanal e mensal, mas nao existe endpoint para isso.

**Acoes recomendadas:**

- Criar endpoints de consulta por periodo:
  - agenda do doctor autenticado;
  - escala por setor;
  - escala por profissional;
  - escala por hospital.
- Adicionar filtros por status, turno, setor, especialidade e hospital.

### 9. Implementar check-in/check-out

**Problema:** Check-in e check-out aparecem nos casos de uso, mas nao existem no backend.

**Acoes recomendadas:**

- Adicionar campos em `Plantao` ou entidade separada de ponto:
  - `checkInAt`;
  - `checkOutAt`;
  - `totalHoras`;
  - status final.
- Permitir check-in apenas para o medico responsavel.
- Validar janela de horario permitida para check-in/check-out.

### 10. Implementar troca/cobertura de plantoes

**Problema:** O sistema promete permitir que medicos oferecam plantoes e manifestem interesse, mas nao existe estrutura para isso.

**Acoes recomendadas:**

- Criar entidade `InteressePlantao`.
- Permitir que doctor marque um plantao futuro como disponivel para troca.
- Listar oportunidades compativeis por setor/especialidade/hospital.
- Permitir manifestacao de interesse.
- Definir se a troca precisa de aprovacao do manager.

## Prioridade 5 - Melhorar Arquitetura da API

### 11. Separar DTOs de entidades

**Problema:** Controllers recebem e retornam entidades JPA diretamente.

**Impacto:** Isso expõe campos internos, dificulta validacao e pode gerar problemas de serializacao.

**Acoes recomendadas:**

- Criar DTOs de request e response.
- Nunca retornar `password`.
- Retornar apenas dados necessarios para cada tela/fluxo.
- Evitar que o cliente envie campos sensiveis como `role`, `hospital` e `setor` diretamente quando eles devem vir da regra de negocio.

### 12. Padronizar tratamento de erros

**Problema:** Varios controllers usam `try/catch` generico e retornam `404` para qualquer excecao.

**Impacto:** Erros de validacao, autorizacao e regra de negocio podem ser mascarados como recurso nao encontrado.

**Acoes recomendadas:**

- Criar `@RestControllerAdvice`.
- Retornar:
  - `400` para dados invalidos;
  - `401` para nao autenticado;
  - `403` para sem permissao;
  - `404` para recurso inexistente;
  - `409` para conflito de unicidade ou conflito de horario.

## Ordem Recomendada de Execucao

1. Corrigir Flyway/migrations e alinhar schema com entidades.
2. Corrigir deletes e erros evidentes de service.
3. Ajustar `SecurityConfiguration` conforme a matriz real de permissoes.
4. Implementar isolamento por hospital nos endpoints existentes.
5. Criar DTOs e validacoes para cadastros.
6. Definir e implementar o vinculo entre Doctor, Hospital e Setor.
7. Criar entidade e endpoints de Plantao.
8. Implementar consultas de agenda/escala.
9. Implementar check-in/check-out.
10. Implementar troca de plantoes e manifestacao de interesse.

## Observacao Sobre Testes

Foi executado `./mvnw test`, mas os testes nao chegaram a validar regras de negocio porque o ambiente bloqueou a abertura de porta do Tomcat com `SocketException: Operation not permitted`.

Mesmo assim, o log mostrou um ponto importante: o Flyway nao encontrou migrations e o Hibernate criou as tabelas automaticamente via `ddl-auto=update`.

