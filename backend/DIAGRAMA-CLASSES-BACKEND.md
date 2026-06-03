# Diagrama de classes - MedShift

Este diagrama apresenta as classes de dominio do MedShift em uma forma proxima ao modelo logico. Ele prioriza as entidades, os atributos persistidos mais relevantes e as operacoes que definem o papel de cada classe nos principais casos de uso.

Os metodos representam responsabilidades de dominio e ficam na classe cujos dados sao criados, consultados ou alterados, nao no perfil que inicia a acao pela interface. Na implementacao, algumas dessas operacoes podem estar distribuidas entre entidades, services e controllers.

## Notacao UML utilizada

- `--`: associacao entre classes relacionadas.
- `o--`: agregacao. O losango vazio fica do lado do todo, mas a parte ainda pode fazer sentido separadamente.
- `*--`: composicao. O losango preenchido fica do lado do todo, e a parte depende dele para existir no dominio.
- `-`: atributo privado.
- `+`: operacao publica.
- Classes com estereotipo `enumeration` representam conjuntos fechados de valores usados como tipos dos atributos.

## Diagrama Mermaid

```mermaid
classDiagram
direction LR

class Usuario {
  -id: Long
  -nome: String
  -email: String
  -senhaHash: String
  -cpf: String
  -dataNascimento: Date
  -telefone: String
  -role: UserRole
  -ativo: Boolean
  +autenticar(email: String, senha: String): Boolean
  +trocarSenha(senhaAtual: String, novaSenha: String): void
  +alterarDadosPessoais(dados): void
}

class Hospital {
  -id: Long
  -nomeFantasia: String
  -razaoSocial: String
  -cnpj: String
  -telefone: String
  -endereco: String
  -nomeGestor: String
  -ativo: Boolean
  +cadastrar(dados): Hospital
  +alterarDados(dados): void
  +desativar(): void
}

class Setor {
  -id: Long
  -nome: String
  -descricao: String
  -ativo: Boolean
  +cadastrar(dados): Setor
  +listarMedicos(): List
  +definirEscalistaResponsavel(escalista: Escalista): void
  +desativar(): void
}

class Escalista {
  -id: Long
  -cargo: String
  -ativo: Boolean
  +cadastrar(dados): Escalista
  +alterarDados(dados): void
  +desativar(): void
}

class Medico {
  -id: Long
  -crm: String
  -ufCrm: String
  -telefone: String
  -fotoPerfilUrl: String
  -ativo: Boolean
  +cadastrar(dados): Medico
  +alterarDados(dados): void
  +desativar(): void
}

class MedicoSetor {
  -id: Long
  -ativo: Boolean
  -vinculadoEm: LocalDateTime
  -desvinculadoEm: LocalDateTime
  +vincular(medico: Medico, setor: Setor): MedicoSetor
  +ativarVinculo(): void
  +encerrarVinculo(): void
}

class Especialidade {
  -id: Long
  -nome: String
  -descricao: String
  -ativo: Boolean
  +alterarDescricao(descricao: String): void
  +desativar(): void
}

class RegraPlantaoFixo {
  -id: Long
  -tipoRecorrencia: TipoRecorrenciaPlantao
  -diaSemana: String
  -semanaDoMes: Integer
  -diaDoMes: Integer
  -horaInicio: LocalTime
  -horaFim: LocalTime
  -dataInicioVigencia: LocalDate
  -dataFimVigencia: LocalDate
  -ativo: Boolean
  +criar(dados): RegraPlantaoFixo
  +gerarPlantoes(): List
  +desativar(): void
}

class Plantao {
  -id: Long
  -tipo: PlantaoTipo
  -turno: PlantaoTurno
  -dataInicio: LocalDateTime
  -dataFim: LocalDateTime
  -status: PlantaoStatus
  +criarAvulso(dados): Plantao
  +consultarEscala(periodo): List
  +atribuirMedico(medico: Medico): void
  +verificarConflito(): Boolean
  +alterarResponsavel(medico: Medico): void
}

class PedidoCobertura {
  -id: Long
  -status: PedidoCoberturaStatus
  -abertoEm: LocalDateTime
  -assumidoEm: LocalDateTime
  -canceladoEm: LocalDateTime
  -expiradoEm: LocalDateTime
  +abrir(): void
  +assumir(medicoCobridor: Medico): void
  +cancelar(): void
  +estaAberto(): Boolean
}

class Notificacao {
  -id: Long
  -tipo: NotificacaoTipo
  -titulo: String
  -mensagem: String
  -lidaEm: LocalDateTime
  -criadoEm: LocalDateTime
  +criar(dados): Notificacao
  +consultarPorDestinatario(): List
  +marcarComoLida(): void
}

class UserRole {
  <<enumeration>>
  HOSPITAL
  ESCALISTA
  MEDICO
}

class PlantaoTipo {
  <<enumeration>>
  AVULSO
  FIXO
}

class PlantaoTurno {
  <<enumeration>>
  DIURNO
  NOTURNO
  PERSONALIZADO
}

class PlantaoStatus {
  <<enumeration>>
  AGENDADO
  CANCELADO
  REALIZADO
}

class TipoRecorrenciaPlantao {
  <<enumeration>>
  SEMANAL
  MENSAL
}

class PedidoCoberturaStatus {
  <<enumeration>>
  ABERTO
  ASSUMIDO
  CANCELADO
  EXPIRADO
}

class NotificacaoTipo {
  <<enumeration>>
  COBERTURA_ASSUMIDA
  PLANTAO_ATRIBUIDO
  PLANTAO_CANCELADO
}

Usuario "1" *-- "0..1" Hospital : perfil de acesso
Usuario "1" *-- "0..1" Escalista : perfil de acesso
Usuario "1" *-- "0..1" Medico : perfil de acesso
Usuario ..> UserRole : utiliza

Hospital "1" *-- "1..*" Setor : possui
Setor "1" -- "0..1" Escalista : responsavel

Medico "1" -- "0..*" MedicoSetor : possui
Setor "1" -- "0..*" MedicoSetor : recebe
Escalista "1" -- "0..*" MedicoSetor : vincula

Especialidade "1" -- "0..*" Medico : classifica

Setor "1" *-- "0..*" Plantao : possui
Escalista "1" -- "0..*" Plantao : cria
Medico "1" -- "0..*" Plantao : titular
Medico "1" -- "0..*" Plantao : responsavel atual
Plantao ..> PlantaoTipo : utiliza
Plantao ..> PlantaoTurno : utiliza
Plantao ..> PlantaoStatus : utiliza

RegraPlantaoFixo "0..1" o-- "0..*" Plantao : gera
Hospital "1" -- "0..*" RegraPlantaoFixo : possui
Setor "1" -- "0..*" RegraPlantaoFixo : recebe
Escalista "1" -- "0..*" RegraPlantaoFixo : define
Medico "1" -- "0..*" RegraPlantaoFixo : titular
RegraPlantaoFixo ..> TipoRecorrenciaPlantao : utiliza

Plantao "1" *-- "0..*" PedidoCobertura : origina
Hospital "1" -- "0..*" PedidoCobertura : restringe
Setor "1" -- "0..*" PedidoCobertura : disponibiliza
Medico "1" -- "0..*" PedidoCobertura : solicita
Medico "0..1" -- "0..*" PedidoCobertura : assume
PedidoCobertura ..> PedidoCoberturaStatus : utiliza

PedidoCobertura "1" -- "0..*" Notificacao : dispara
Plantao "1" -- "0..*" Notificacao : referencia
Usuario "1" -- "0..*" Notificacao : recebe
Notificacao ..> NotificacaoTipo : utiliza
```

## Leitura das relacoes

- `Usuario` compoe os perfis de acesso de `Hospital`, `Escalista` e `Medico`. Os dados de autenticacao ficam centralizados no usuario.
- `Hospital` compoe seus `Setor`es. Um setor pertence a um unico hospital.
- Cada `Setor` possui no maximo um `Escalista` responsavel, e cada escalista atua em um unico setor.
- `MedicoSetor` representa a associacao N:N entre medicos e setores. O escalista responsavel realiza esse vinculo.
- Cada `Medico` possui exatamente uma `Especialidade`. Uma especialidade pode classificar varios medicos.
- Um `Setor` compoe seus `Plantao`es. Cada plantao possui exatamente um medico titular, que tambem e o responsavel atual ate que uma cobertura seja assumida.
- `RegraPlantaoFixo` agrega os plantoes concretos gerados por sua recorrencia. Um plantao ainda representa uma ocorrencia valida mesmo que a regra seja posteriormente desativada.
- Um `Plantao` pode originar pedidos de cobertura. O pedido depende do plantao para existir.
- Um `PedidoCobertura` pode disparar notificacoes. A notificacao informa ao medico solicitante que outro profissional assumiu o plantao.
- Dependencias tracejadas indicam que uma classe utiliza uma enumeracao como tipo de atributo.

## Imagem para apresentacao

A versao diagramada para uso no documento e na apresentacao esta disponivel em:

- `DIAGRAMA-CLASSES-APRESENTACAO.svg`: versao vetorial recomendada para o TCC.
- `DIAGRAMA-CLASSES-APRESENTACAO.png`: versao rasterizada com fundo branco.

As imagens sao geradas por `gerar_diagrama_classes_apresentacao.py`, que preserva as relacoes deste documento e utiliza um layout controlado para melhorar a legibilidade.
