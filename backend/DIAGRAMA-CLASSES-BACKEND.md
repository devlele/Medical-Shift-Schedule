# Diagrama de classes do backend

Versao enxuta do modelo de dominio, focada nos fluxos principais do MVP: autenticacao, estrutura hospitalar, vinculos por setor, criacao de plantoes, recorrencia, cobertura entre medicos e notificacoes.

No codigo atual, os conceitos de dominio `Escalista` e `Medico` aparecem como classes Java `Manager` e `Doctor`. Neste documento, os nomes do dominio foram mantidos para facilitar a leitura da banca.

## Convencao das setas

As setas do diagrama abaixo seguem a referencia do codigo/banco:

- A seta sai da classe que guarda a referencia ou FK.
- A seta aponta para a classe referenciada.
- Exemplo: `Setor --> Hospital` significa que `Setor` pertence a um `Hospital` e guarda essa referencia.
- Relacoes N:N foram representadas por classes associativas, como `MedicoSetor` e `MedicoEspecialidade`.

```mermaid
classDiagram
direction LR

class Usuario {
  -Long id
  -String nome
  -String email
  -String cpf
  -String telefone
  -UserRole role
  -Boolean ativo
  +getAuthorities()
  +getUsername()
  +getPassword()
  +isEnabled()
}

class Hospital {
  -Long id
  -String nomeFantasia
  -String razaoSocial
  -String cnpj
  -String endereco
  -String nomeGestor
  -Boolean ativo
  +getUsuario()
  +setUsuario(Usuario)
  +getSetores()
  +getEmail()
}

class Setor {
  -Long id
  -String nome
  -String descricao
  -Boolean ativo
  +getHospital()
  +setHospital(Hospital)
  +getMedicoSetores()
  +getEscalista()
}

class Escalista {
  -Long id
  -String cargo
  -Boolean ativo
  -UserRole role
  +getUsuario()
  +setUsuario(Usuario)
  +getHospital()
  +getSetor()
  +setSetor(Setor)
  +getPassword()
}

class Medico {
  -Long id
  -String crm
  -String ufCrm
  -String telefone
  -String specialty
  -Boolean ativo
  +getUsuario()
  +setUsuario(Usuario)
  +getMedicoSetores()
  +getMedicoEspecialidades()
  +getPassword()
}

class Especialidade {
  -Long id
  -String nome
  -String descricao
  -Boolean ativo
  +getMedicoEspecialidades()
}

class MedicoSetor {
  -Long id
  -Boolean ativo
  -LocalDateTime vinculadoEm
  -LocalDateTime desvinculadoEm
  +getMedico()
  +setMedico(Medico)
  +getSetor()
  +setSetor(Setor)
  +getVinculadoPorEscalista()
}

class MedicoEspecialidade {
  -Long id
  -Boolean principal
  -LocalDateTime criadoEm
  +getMedico()
  +setMedico(Medico)
  +getEspecialidade()
  +setEspecialidade(Especialidade)
}

class EscalistaSetor {
  -Long id
  -Boolean ativo
  -LocalDateTime vinculadoEm
  -LocalDateTime desvinculadoEm
  +getEscalista()
  +setEscalista(Escalista)
  +getSetor()
  +setSetor(Setor)
}

class RegraPlantaoFixo {
  -Long id
  -TipoRecorrenciaPlantao tipoRecorrencia
  -String diaSemana
  -Integer semanaDoMes
  -Integer diaDoMes
  -LocalTime horaInicio
  -LocalTime horaFim
  -LocalDate dataInicioVigencia
  -LocalDate dataFimVigencia
  -Boolean ativo
  +setSetor(Setor)
  +setMedicoTitular(Medico)
  +getPlantoes()
}

class Plantao {
  -Long id
  -PlantaoTipo tipo
  -PlantaoTurno turno
  -LocalDateTime dataInicio
  -LocalDateTime dataFim
  -PlantaoStatus status
  +getHospital()
  +setSetor(Setor)
  +setMedicoTitular(Medico)
  +setMedicoResponsavelAtual(Medico)
  +getPedidosCobertura()
}

class PedidoCobertura {
  -Long id
  -PedidoCoberturaStatus status
  -LocalDateTime abertoEm
  -LocalDateTime assumidoEm
  -LocalDateTime canceladoEm
  -LocalDateTime expiradoEm
  +setPlantao(Plantao)
  +setMedicoSolicitante(Medico)
  +setMedicoCobridor(Medico)
  +isAberto()
}

class Notificacao {
  -Long id
  -NotificacaoTipo tipo
  -String titulo
  -String mensagem
  -LocalDateTime lidaEm
  -LocalDateTime criadoEm
  +setUsuarioDestino(Usuario)
  +setPedidoCobertura(PedidoCobertura)
  +setPlantao(Plantao)
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
}

class PlantaoStatus {
  <<enumeration>>
  AGENDADO
  OFERECIDO
  COBERTO
  CANCELADO
}

class TipoRecorrenciaPlantao {
  <<enumeration>>
  SEMANAL
  MENSAL
}

class PedidoCoberturaStatus {
  <<enumeration>>
  ABERTO
  ACEITO
  CANCELADO
  EXPIRADO
}

class NotificacaoTipo {
  <<enumeration>>
  COBERTURA_ASSUMIDA
}

Usuario --> UserRole : role
Hospital --> Usuario : credenciais
Escalista --> Usuario : credenciais
Medico --> Usuario : credenciais

Setor --> Hospital : hospital
Escalista --> Setor : setorResponsavel

EscalistaSetor --> Escalista : escalista
EscalistaSetor --> Setor : setor

MedicoSetor --> Medico : medico
MedicoSetor --> Setor : setor
MedicoSetor --> Escalista : vinculadoPor

MedicoEspecialidade --> Medico : medico
MedicoEspecialidade --> Especialidade : especialidade

RegraPlantaoFixo --> Hospital : hospital
RegraPlantaoFixo --> Setor : setor
RegraPlantaoFixo --> Medico : medicoTitular
RegraPlantaoFixo --> Escalista : criadoPor
RegraPlantaoFixo --> TipoRecorrenciaPlantao : recorrencia

Plantao --> Setor : setor
Plantao --> RegraPlantaoFixo : regra
Plantao "0..*" --> "1" Medico : titular/responsavel
Plantao --> Escalista : criadoPor
Plantao --> PlantaoTipo : tipo
Plantao --> PlantaoTurno : turno
Plantao --> PlantaoStatus : status

PedidoCobertura "0..*" --> "1" Plantao : plantao
PedidoCobertura --> Hospital : hospital
PedidoCobertura --> Setor : setor
PedidoCobertura --> Medico : solicitante/cobridor
PedidoCobertura --> PedidoCoberturaStatus : status

Notificacao --> Usuario : usuarioDestino
Notificacao --> PedidoCobertura : pedido
Notificacao --> Plantao : plantao
Notificacao --> NotificacaoTipo : tipo
```

## Leitura rapida

- `Usuario` e a fonte unica de credenciais, senha, role e permissoes.
- `Hospital`, `Escalista` e `Medico` sao perfis vinculados a `Usuario`.
- `Setor` pertence a um `Hospital`.
- `Escalista` possui um unico `Setor` responsavel. Assim, o hospital do escalista e obtido pelo setor.
- `EscalistaSetor` existe no codigo como historico/compatibilidade de vinculo, mas a regra atual do MVP considera um setor por escalista.
- `MedicoSetor` permite que um medico esteja vinculado a varios setores, inclusive de hospitais diferentes.
- `MedicoEspecialidade` representa a relacao N:N entre medicos e especialidades.
- `RegraPlantaoFixo` define a recorrencia de plantoes fixos e gera registros concretos de `Plantao`.
- `Plantao` representa uma ocorrencia concreta, avulsa ou gerada por regra fixa.
- `PlantaoTurno.fromPeriodo(...)` e usado no codigo para classificar automaticamente o turno como diurno ou noturno.
- Cada `Plantao` possui um unico medico titular. O responsavel atual inicialmente e o titular e pode mudar quando uma cobertura for assumida.
- `PedidoCobertura` representa a oferta de um plantao para outro medico do mesmo setor assumir.
- `Notificacao` registra avisos ao usuario, especialmente quando outro medico assume um pedido de cobertura.
