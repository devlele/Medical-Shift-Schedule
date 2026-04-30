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
│   └── db/migrations/
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
| Método | Endpoint | Descrição | Acesso |
|--------|----------|-----------|--------|
| POST | /hospital | Cadastrar hospital | Público |
| POST | /setor | Cadastrar setor | ROLE_HOSPITAL |
| POST | /doctor/register | Cadastrar médico | Público |
| POST | /manager | Cadastrar escalista | ROLE_HOSPITAL |
| GET | /manager | Listar managers do hospital logado | ROLE_HOSPITAL |
| POST | /auth/login | Fazer login | Público |
| GET | /hospital/{id} | Buscar hospital | ROLE_ADMIN |
| GET | /doctor | Listar médicos | ROLE_MANAGER, HOSPITAL, ADMIN |
| GET | /doctor/{id} | Buscar médico por ID | ROLE_ADMIN |
| GET | /doctor/me | Meus dados | ROLE_DOCTOR |
| GET | /setor | Listar setores do hospital logado | ROLE_HOSPITAL |

#ADMIN
| GET | /setor/hospital/{id} | Listar setores por hospital | ROLE_ADMIN|
| DELETE | /** | Deletar recursos | ROLE_ADMIN |

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

## Próximos Passos
- Implementar endpoints de escala de plantões
- Adicionar sistema de interesse de médicos em cobrir furos
- Implementar testes unitários/integração
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

### Acesso Protegido (com token)
```bash
GET /doctor/1
Header: Authorization: Bearer <token>
```

### Listar médicos (requer token de Manager/Hospital/Admin)
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