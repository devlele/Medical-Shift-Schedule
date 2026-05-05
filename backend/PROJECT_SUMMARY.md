# Medical Shift Schedule - Projeto Backend

## Visão Geral
Este é um projeto backend para gerenciamento de escalas médicas, desenvolvido com **Spring Boot**. O sistema permite o cadastro e autenticação de Hospitais, médicos (Doctors) e gerentes (Managers/escalistas), com controle de acesso baseado em roles hierárquicas. A autenticação é feita via JWT (JSON Web Tokens), garantindo segurança nas requisições.

## Tecnologias Utilizadas
- **Java 21**
- **Spring Boot 4.0.3** (com Spring Security, JPA, Flyway)
- **Banco de Dados**: H2 (desenvolvimento) / MySQL (produção)
- **JWT**: Para autenticação stateless
- **Maven**: Gerenciamento de dependências
- **Flyway**: Migrações de banco

## Hierarquia de Roles
O sistema implementa uma hierarquia de segurança com as seguintes roles:

| Role | Descrição |
|------|-----------|
| **ADMIN** | Acesso a todos os recursos. Apenas acessado por desenvolvedores. |
| **HOSPITAL** | Acesso a recursos para cadastro de escalistas (Managers) para cada setor. |
| **MANAGER** | Representa o escalista. Acesso a recursos de pesquisa de médicos, atribuição de plantões, inserção de médicos em escalas e vinculação de médicos com hospital e setor. |
| **DOCTOR** | Representa o médico. Acesso apenas a recursos referentes a seus plantões e interesse em cobrir furos na escala. |

## Estrutura do Projeto
```
backend/medShift/
├── src/main/java/com/mss/medShift/
│   ├── MedShiftApplication.java          # Classe principal
│   ├── controller/
│   │   ├── AuthController.java           # Login (/auth/login)
│   │   ├── DoctorController.java         # CRUD de Doctors (/doctor)
│   │   ├── ManagerController.java        # CRUD de Managers (/manager)
│   │   ├── HospitalController.java       # CRUD de Hospitals (/hospital)
│   │   └── SetorController.java          # CRUD de Setores (/setor)
│   ├── domain/
│   │   ├── model/
│   │   │   ├── User.java                 # Classe base (nome, email, cpf, etc.)
│   │   │   ├── Doctor.java               # Médico (crm, specialty, role=DOCTOR)
│   │   │   ├── Manager.java              # Escalista (department, role=MANAGER)
│   │   │   ├── Hospital.java             # Hospital (nomeFantasia, cnpj, role=HOSPITAL)
│   │   │   ├── Setor.java                # Setor (nome, descricao, hospital)
│   │   │   └── UserRole.java             # Enum (ADMIN, HOSPITAL, MANAGER, DOCTOR)
│   │   └── repository/
│   │       ├── DoctorRepository.java     # Repositório JPA para Doctors
│   │       ├── ManagerRepository.java    # Repositório JPA para Managers
│   │       ├── HospitalRepository.java   # Repositório JPA para Hospitals
│   │       └── SetorRepository.java      # Repositório JPA para Setores
│   ├── infra/security/
│   │   ├── SecurityConfiguration.java    # Configuração Spring Security
│   │   └── SecurityFilter.java           # Filtro JWT para validação de tokens
│   └── service/
│       ├── auth/
│       │   ├── AuthorizationService.java # UserDetailsService para login
│       │   └── TokenService.java         # Geração/validação de JWT
│       ├── DoctorService.java            # Interface para Doctors
│       ├── ManagerService.java           # Interface para Managers
│       ├── HospitalService.java          # Interface para Hospitals
│       ├── SetorService.java             # Interface para Setores
│       └── impl/
│           ├── DoctorServiceImple.java   # Implementação DoctorService
│           ├── ManagerServiceImple.java  # Implementação ManagerService
│           ├── HospitalServiceImple.java # Implementação HospitalService
│           └── SetorServiceImple.java    # Implementação SetorService
├── src/main/resources/
│   ├── application.properties            # Configurações (JWT secret, profiles)
│   ├── application-dev.yml               # Configuração dev com Hibernate validate
│   └── db/migration/
│       ├── V1__create-doctor-table.sql   # Migração tabela tb_doctor
│       ├── V2__create-manager-table.sql  # Migração tabela tb_manager
│       └── V3__create-hospital-table.sql # Migração tabelas tb_hospital, tb_setor e FKs
└── pom.xml                               # Dependências Maven
```

## Funcionalidades Implementadas
### 1. **Cadastro de Usuários**
- **Hospitals**: POST `/hospital` (role automaticamente HOSPITAL)
- **Doctors**: POST `/doctor/register` (role automaticamente DOCTOR)
- **Managers**: POST `/manager` (role automaticamente MANAGER)
- Validações: Email e CPF/CNPJ únicos; senha codificada com BCrypt.

### 2. **Autenticação e Autorização**
- **Login**: POST `/auth/login` (funciona para Hospitals, Doctors e Managers)
- **JWT**: Tokens válidos por 2 horas, enviados no header `Authorization: Bearer <token>`
- **Roles**:
  - ADMIN: Acesso total
  - HOSPITAL: Cadastro de setores e escalistas
  - MANAGER: Gerenciamento de escalas do setor
  - DOCTOR: Acesso aos próprios plantões

### 3. **Segurança**
- Senhas codificadas (BCrypt)
- Stateless (sem sessões)
- CORS desabilitado para desenvolvimento
- Tratamento de erros de autenticação (401 para credenciais inválidas)
- Autorização baseada em roles por endpoint

## Endpoints da API
Legenda de status:
- **OK**: implementado e funcionando no estado atual.
- **FAIL**: implementado, mas com erro conhecido.
- **Not Imple**: ainda nao implementado.

### Público
| Método | Endpoint | Descrição | Acesso | Status |
|--------|----------|-----------|--------|--------|
| POST | `/auth/login` | Autentica Hospital, Doctor ou Manager por email/senha e retorna token JWT. | Público | OK |
| POST | `/hospital` | Cadastra um hospital, define role `HOSPITAL` e salva senha com BCrypt. | Público | OK |
| POST | `/doctor/register` | Cadastra um médico, define role `DOCTOR` e salva senha com BCrypt. | Público | OK |

### ROLE_ADMIN
| Método | Endpoint | Descrição | Acesso | Status |
|--------|----------|-----------|--------|--------|
| GET | `/hospital` | Lista todos os hospitais cadastrados. Endpoint administrativo. | ROLE_ADMIN | OK |
| GET | `/hospital/{id}` | Busca um hospital por ID. Endpoint administrativo. | ROLE_ADMIN | OK |
| PUT | `/hospital/{id}` | Atualiza dados cadastrais de um hospital por ID. Endpoint administrativo. | ROLE_ADMIN | OK |
| DELETE | `/hospital/{id}` | Remove um hospital por ID. Endpoint administrativo via regra global de delete. | ROLE_ADMIN | OK |
| GET | `/doctor/{id}` | Busca um médico por ID. Endpoint administrativo. | ROLE_ADMIN | OK |
| DELETE | `/doctor/{id}` | Deveria remover médico por ID, mas nao ha método no controller. | ROLE_ADMIN | Not Imple |
| PUT | `/manager/{id}` | Deveria atualizar manager, mas nao ha método no controller. | ROLE_HOSPITAL ou ROLE_ADMIN | Not Imple |
| DELETE | `/manager/{id}` | Deveria remover manager por ID, mas nao ha método no controller. | ROLE_ADMIN | Not Imple |
| GET | `/setor/hospital/{hospitalId}` | Lista setores de um hospital específico. Endpoint administrativo. | ROLE_ADMIN | OK |
| DELETE | `/setor/{id}` | Remove setor por ID via regra global de delete. | ROLE_ADMIN | OK |
| GET | `/doctor` | Deveria listar médicos para Manager/Hospital/Admin, mas nao ha método no controller. | ROLE_MANAGER, ROLE_HOSPITAL, ROLE_ADMIN | Not Imple |
| PUT | `/doctor/{id}` | Deveria atualizar/vincular médico, mas nao ha método no controller. | ROLE_MANAGER, ROLE_HOSPITAL, ROLE_ADMIN | Not Imple |
| GET | `/plantao/{id}` | Deveria buscar plantão por ID. | ROLE_MANAGER, ROLE_DOCTOR, ROLE_HOSPITAL, ROLE_ADMIN | Not Imple |
| DELETE | `/plantao/{id}` | Deveria cancelar/remover plantão. | ROLE_MANAGER ou ROLE_ADMIN | Not Imple |
| GET | `/agenda/setor/{setorId}` | Deveria listar escala por setor e período. | ROLE_MANAGER, ROLE_HOSPITAL, ROLE_ADMIN | Not Imple |

### ROLE_HOSPITAL
| Método | Endpoint | Descrição | Acesso | Status |
|--------|----------|-----------|--------|--------|
| GET | `/doctor` | Deveria listar médicos para Manager/Hospital/Admin, mas nao ha método no controller. | ROLE_MANAGER, ROLE_HOSPITAL, ROLE_ADMIN | Not Imple |
| PUT | `/doctor/{id}` | Deveria atualizar/vincular médico, mas nao ha método no controller. | ROLE_MANAGER, ROLE_HOSPITAL, ROLE_ADMIN | Not Imple |
| POST | `/manager` | Cadastra escalista para o hospital autenticado, vinculando-o a um setor do próprio hospital. | ROLE_HOSPITAL | OK |
| GET | `/manager` | Lista managers/escalistas pertencentes ao hospital autenticado. | ROLE_HOSPITAL | OK |
| GET | `/manager/{id}` | Busca manager por ID, somente se pertencer ao hospital autenticado. | ROLE_HOSPITAL | OK |
| PUT | `/manager/{id}` | Deveria atualizar manager, mas nao ha método no controller. | ROLE_HOSPITAL ou ROLE_ADMIN | Not Imple |
| POST | `/setor` | Cadastra setor e associa automaticamente ao hospital autenticado. | ROLE_HOSPITAL | OK |
| GET | `/setor` | Lista setores pertencentes ao hospital autenticado. | ROLE_HOSPITAL | OK |
| GET | `/setor/{id}` | Busca setor por ID, somente se pertencer ao hospital autenticado. | ROLE_HOSPITAL | OK |
| PUT | `/setor/{id}` | Atualiza nome/descrição de setor, somente se pertencer ao hospital autenticado. | ROLE_HOSPITAL | OK |
| GET | `/plantao/{id}` | Deveria buscar plantão por ID. | ROLE_MANAGER, ROLE_DOCTOR, ROLE_HOSPITAL, ROLE_ADMIN | Not Imple |
| GET | `/agenda/setor/{setorId}` | Deveria listar escala por setor e período. | ROLE_MANAGER, ROLE_HOSPITAL, ROLE_ADMIN | Not Imple |

### ROLE_MANAGER
| Método | Endpoint | Descrição | Acesso | Status |
|--------|----------|-----------|--------|--------|
| GET | `/doctor` | Deveria listar médicos para Manager/Hospital/Admin, mas nao ha método no controller. | ROLE_MANAGER, ROLE_HOSPITAL, ROLE_ADMIN | Not Imple |
| PUT | `/doctor/{id}` | Deveria atualizar/vincular médico, mas nao ha método no controller. | ROLE_MANAGER, ROLE_HOSPITAL, ROLE_ADMIN | Not Imple |
| POST | `/plantao` | Deveria cadastrar plantão/escala. | ROLE_MANAGER | Not Imple |
| GET | `/plantao/{id}` | Deveria buscar plantão por ID. | ROLE_MANAGER, ROLE_DOCTOR, ROLE_HOSPITAL, ROLE_ADMIN | Not Imple |
| PUT | `/plantao/{id}` | Deveria atualizar plantão/escala. | ROLE_MANAGER | Not Imple |
| DELETE | `/plantao/{id}` | Deveria cancelar/remover plantão. | ROLE_MANAGER ou ROLE_ADMIN | Not Imple |
| GET | `/agenda/setor/{setorId}` | Deveria listar escala por setor e período. | ROLE_MANAGER, ROLE_HOSPITAL, ROLE_ADMIN | Not Imple |

### ROLE_DOCTOR
| Método | Endpoint | Descrição | Acesso | Status |
|--------|----------|-----------|--------|--------|
| GET | `/doctor/me` | Retorna os dados do médico autenticado pelo token. | ROLE_DOCTOR | OK |
| GET | `/plantao/{id}` | Deveria buscar plantão por ID. | ROLE_MANAGER, ROLE_DOCTOR, ROLE_HOSPITAL, ROLE_ADMIN | Not Imple |
| GET | `/agenda/doctor/me` | Deveria listar agenda do médico autenticado por período. | ROLE_DOCTOR | Not Imple |
| POST | `/plantao/{id}/check-in` | Deveria registrar check-in do médico responsável. | ROLE_DOCTOR | Not Imple |
| POST | `/plantao/{id}/check-out` | Deveria registrar check-out do médico responsável. | ROLE_DOCTOR | Not Imple |
| POST | `/plantao/{id}/troca` | Deveria disponibilizar plantão para troca/cobertura. | ROLE_DOCTOR | Not Imple |
| POST | `/plantao/{id}/interesse` | Deveria registrar interesse de médico em cobrir plantão. | ROLE_DOCTOR | Not Imple |

## Alterações Realizadas Durante o Desenvolvimento
1. **Configuração Inicial**: Spring Boot com JPA, Security e JWT.
2. **Entidades**: Criadas Doctor e Manager (ambas extendendo User e implementando UserDetails).
3. **Repositórios e Serviços**: Implementados para CRUD e autenticação.
4. **Segurança**: JWT com roles, filtros customizados, permissões por endpoint.
5. **Correções**:
   - Dependências circulares resolvidas (beans gerenciados pelo Spring).
   - Imports faltantes adicionados.
   - Cast de tipos corrigido (UserDetails em vez de Doctor específico).
   - Migrações Flyway para tabelas.
   - Validações de unicidade (email, CPF, CRM).
6. **Refatoração**: Nomes de classes ajustados (Impl -> Imple para consistência).
7. **Endpoint Doctor /me**: Implementado GET /doctor/me para médicos autenticados retornarem seus próprios dados.
8. **Correção da base técnica (Prioridade 1)**:
   - Pasta de migrations renomeada de `db/migrations` para `db/migration`, seguindo o padrão do Flyway.
   - Migration `V1__create-doctor-table.sql` corrigida, removendo SQL inválido e adicionando `AUTO_INCREMENT`.
   - IDs das tabelas principais ajustados para geração identity compatível com `GenerationType.IDENTITY`.
   - Coluna `role` incluída nas tabelas `tb_doctor` e `tb_hospital`.
   - Roles persistidas como texto via `@Enumerated(EnumType.STRING)` em Doctor, Manager e Hospital.
   - Campo `birthday` mapeado como `DATE` para alinhar entidade e schema.
   - `spring.jpa.hibernate.ddl-auto` alterado de `update` para `validate` no perfil dev.
   - Métodos `delete` de Doctor e Manager corrigidos para encerrar após deleção bem-sucedida.
   - Testes executados com sucesso: `./mvnw test` retornou 3 testes, 0 falhas e 0 erros.
9. **Correção de segurança e isolamento (Prioridade 2)**:
   - `SecurityConfiguration` ajustada para refletir endpoints administrativos documentados.
   - `GET /doctor/me` ordenado antes de `GET /doctor/{id}` para evitar conflito de matcher.
   - `GET /hospital`, `GET /hospital/{id}`, `PUT /hospital/{id}`, `GET /doctor/{id}` e `GET /setor/hospital/{hospitalId}` restritos a `ROLE_ADMIN`.
   - `GET /setor/{id}` e `PUT /setor/{id}` passaram a validar se o setor pertence ao hospital autenticado.
   - `GET /manager/{id}` passou a validar se o manager pertence ao hospital autenticado.
   - Adicionados métodos `findByIdAndHospitalId` nos repositories de Setor e Manager.
   - Respostas de segurança separadas: `401` para nao autenticado e `403` para autenticado sem permissao.
   - Testes de regressao adicionados para autorização e isolamento entre hospitais.
   - Testes executados com sucesso: `./mvnw test` retornou 5 testes, 0 falhas e 0 erros.

### Novas Implementações (Hierarquia de Segurança)
- **UserRole atualizado**: ADMIN, HOSPITAL, MANAGER, DOCTOR
- **Entidade Hospital**: Implementa UserDetails para autenticação
- **Entidade Setor**: Representa departamentos dentro de um hospital
- **Doctor atualizado**: Adicionados campos hospital e setor, novas authorities
- **Manager atualizado**: Adicionados campos hospital e setor, novas authorities
- **HospitalRepository**: Busca por email e CNPJ
- **SetorRepository**: Busca por hospital ID
- **HospitalService/HospitalServiceImple**: CRUD completo com validações
- **SetorService/SetorServiceImple**: CRUD completo
- **HospitalController**: Endpoints REST para hospitals
- **SetorController**: Endpoints REST para setores
- **AuthorizationService**: Atualizado para buscar também por Hospital
- **SecurityConfiguration**: Regras de autorização baseadas em roles
- **Migração V3**: Criação das tabelas tb_hospital, tb_setor e FKs
- **Flyway validado**: Migrations executadas antes do Hibernate, com schema validado em vez de criado por `ddl-auto=update`
- **Isolamento por hospital**: Setores e managers buscados por ID agora sao filtrados pelo hospital autenticado.

## Próximos Passos
- Implementar vínculo formal Doctor-Hospital-Setor.
- Implementar endpoints de escala de plantões.
- Adicionar sistema de interesse de médicos em cobrir furos.
- Separar DTOs de entrada/saída para nao expor entidades diretamente.
- Padronizar tratamento de erros com `@RestControllerAdvice`.
- Expandir testes unitários/integração.
- Configurar produção (MySQL, variáveis de ambiente para JWT secret)
- Adicionar validações adicionais (ex.: formato de CPF/CNPJ, data de nascimento)

## Como Executar
1. **Pré-requisitos**: Java 21, Maven
2. **Clonar/Entrar no diretório**: `backend/medShift`
3. **Executar**: `.\mvnw spring-boot:run` (Windows) ou `./mvnw spring-boot:run` (Linux/Mac)
4. **Banco**: H2 console em `http://localhost:8080/h2-console` (JDBC URL: `jdbc:h2:mem:testdb`)

## Exemplos de Requisições

### Cadastro de Hospital
```json
POST /hospital
{
  "nomeFantasia": "Hospital Central",
  "cnpj": "12345678000199",
  "endereco": "Av. Principal, 1000 - Centro",
  "nomeGestor": "Carlos Silva",
  "email": "hospital@central.com",
  "password": "senha123"
}
```

### Cadastro de Setor (requer token de Hospital)
```json
POST /setor
{
  "nome": "Cardiologia",
  "descricao": "Setor de Cardiologia do Hospital Central"
}
```

### Cadastro de Doctor
```json
POST /doctor/register
{
  "name": "João Silva",
  "cpf": "12345678900",
  "email": "joao@example.com",
  "birthday": "1990-01-01",
  "password": "senha123",
  "specialty": "Cardiologia",
  "crm": "12345"
}
```

### Cadastro de Manager (requer token de Hospital)
```json
POST /manager
{
  "name": "Maria Souza",
  "cpf": "09876543210",
  "email": "maria@example.com",
  "birthday": "1985-05-15",
  "password": "senha456",
  "department": "Cardiologia",
  "setor": {
    "id": 1
  }
}
```

### Listar managers do hospital logado
```bash
GET /manager
Header: Authorization: Bearer <token>
```

### Login (funciona para Hospital, Doctor ou Manager)
```json
POST /auth/login
{
  "email": "hospital@central.com",
  "password": "senha123"
}
```
**Resposta**: `{"token": "jwt-token-aqui"}`

### Acesso Administrativo (requer ROLE_ADMIN)
```bash
GET /doctor/1
Header: Authorization: Bearer <token>
```

### Listar médicos
Ainda nao implementado no controller.

```bash
GET /doctor
Header: Authorization: Bearer <token>
```

### Listar setores do hospital logado
```bash
GET /setor
Header: Authorization: Bearer <token>
```

### Listar setores por hospital
```bash
GET /setor/hospital/1
Header: Authorization: Bearer <token>
```

## Contato
Projeto desenvolvido para gerenciamento de escalas médicas, com foco em segurança e escalabilidade.
