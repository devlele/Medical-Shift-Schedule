# Medical Shift Schedule - Projeto Backend

## Visão Geral
Este é um projeto backend para gerenciamento de escalas médicas, desenvolvido com **Spring Boot**. O sistema permite o cadastro e autenticação de médicos (Doctors) e gerentes (Managers), com controle de acesso baseado em roles (USER e ADMIN). A autenticação é feita via JWT (JSON Web Tokens), garantindo segurança nas requisições.

## Tecnologias Utilizadas
- **Java 21**
- **Spring Boot 4.0.3** (com Spring Security, JPA, Flyway)
- **Banco de Dados**: H2 (desenvolvimento) / MySQL (produção)
- **JWT**: Para autenticação stateless
- **Maven**: Gerenciamento de dependências
- **Flyway**: Migrações de banco

## Estrutura do Projeto
```
backend/medShift/
├── src/main/java/com/mss/medShift/
│   ├── MedShiftApplication.java          # Classe principal
│   ├── controller/
│   │   ├── AuthController.java           # Login (/auth/login)
│   │   ├── DoctorController.java         # CRUD de Doctors (/doctor)
│   │   └── ManagerController.java        # CRUD de Managers (/manager)
│   ├── domain/
│   │   ├── model/
│   │   │   ├── User.java                 # Classe base (nome, email, cpf, etc.)
│   │   │   ├── Doctor.java               # Médico (crm, specialty, role=USER)
│   │   │   ├── Manager.java              # Gerente (department, role=ADMIN)
│   │   │   └── UserRole.java             # Enum (ADMIN, USER)
│   │   └── repository/
│   │       ├── DoctorRepository.java     # Repositório JPA para Doctors
│   │       └── ManagerRepository.java    # Repositório JPA para Managers
│   ├── infra/security/
│   │   ├── SecurityConfiguration.java    # Configuração Spring Security
│   │   └── SecurityFilter.java           # Filtro JWT para validação de tokens
│   └── service/
│       ├── auth/
│       │   ├── AuthorizationService.java # UserDetailsService para login
│       │   └── TokenService.java         # Geração/validação de JWT
│       ├── DoctorService.java            # Interface para Doctors
│       ├── ManagerService.java           # Interface para Managers
│       └── impl/
│           ├── DoctorServiceImple.java   # Implementação DoctorService
│           └── ManagerServiceImple.java  # Implementação ManagerService
├── src/main/resources/
│   ├── application.properties            # Configurações (JWT secret, profiles)
│   └── db/migrations/
│       ├── V1__create-doctor-table.sql   # Migração tabela tb_doctor
│       └── V2__create-manager-table.sql  # Migração tabela tb_manager
└── pom.xml                               # Dependências Maven
```

## Funcionalidades Implementadas
### 1. **Cadastro de Usuários**
- **Doctors**: POST `/doctor` (role automaticamente USER)
- **Managers**: POST `/manager` (role automaticamente ADMIN)
- Validações: Email e CPF únicos; senha codificada com BCrypt.

### 2. **Autenticação e Autorização**
- **Login**: POST `/auth/login` (funciona para Doctors e Managers)
- **JWT**: Tokens válidos por 2 horas, enviados no header `Authorization: Bearer <token>`
- **Roles**:
  - Doctors: ROLE_USER (acesso limitado)
  - Managers: ROLE_ADMIN (acesso a endpoints restritos)
- **Endpoints Protegidos**:
  - GET `/doctor/{id}`: Apenas ROLE_ADMIN
  - Outros: Autenticados

### 3. **Segurança**
- Senhas codificadas (BCrypt)
- Stateless (sem sessões)
- CORS desabilitado para desenvolvimento
- Tratamento de erros de autenticação (401 para credenciais inválidas)

## Endpoints da API
| Método | Endpoint          | Descrição                          | Acesso          |
|--------|-------------------|------------------------------------|-----------------|
| POST   | /doctor           | Cadastrar médico                   | Público         |
| POST   | /manager          | Cadastrar gerente                  | Público         |
| POST   | /auth/login       | Fazer login (Doctor/Manager)       | Público         |
| GET    | /doctor/{id}      | Buscar médico por ID               | ROLE_ADMIN      |

## Como Executar
1. **Pré-requisitos**: Java 21, Maven
2. **Clonar/Entrar no diretório**: `backend/medShift`
3. **Executar**: `.\mvnw spring-boot:run` (Windows) ou `./mvnw spring-boot:run` (Linux/Mac)
4. **Banco**: H2 console em `http://localhost:8080/h2-console` (JDBC URL: `jdbc:h2:mem:testdb`)

## Exemplos de Requisições
### Cadastro de Doctor
```json
POST /doctor
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

### Cadastro de Manager
```json
POST /manager
{
  "name": "Maria Souza",
  "cpf": "09876543210",
  "email": "maria@example.com",
  "birthday": "1985-05-15",
  "password": "senha456",
  "department": "Recursos Humanos"
}
```

### Login
```json
POST /auth/login
{
  "email": "maria@example.com",
  "password": "senha456"
}
```
**Resposta**: `{"token": "jwt-token-aqui"}`

### Acesso Protegido (com token)
```bash
GET /doctor/1
Header: Authorization: Bearer <token>
```

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

## Próximos Passos
- Adicionar mais endpoints (ex.: listagem de doctors, atualização de perfis).
- Implementar testes unitários/integração.
- Configurar produção (MySQL, variáveis de ambiente para JWT secret).
- Adicionar validações adicionais (ex.: formato de CPF, data de nascimento).

## Contato
Projeto desenvolvido para gerenciamento de escalas médicas, com foco em segurança e escalabilidade.