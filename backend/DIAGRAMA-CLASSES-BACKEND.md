# Diagrama de classes do backend

Versao enxuta do modelo de dominio, focada nos fluxos principais: estrutura hospitalar, vinculos por setor, criacao de plantoes e cobertura entre medicos.

No codigo atual, os conceitos `Escalista` e `Medico` ainda aparecem em algumas classes Java como `Manager` e `Doctor`. Neste diagrama, os nomes foram mantidos em portugues para refletir o dominio mais recente do sistema.

```mermaid
classDiagram
direction LR

class Usuario {
  +Long id
  +String nome
  +String email
  +UserRole role
}

class Hospital {
  +Long id
  +String nomeFantasia
  +String cnpj
}

class Setor {
  +Long id
  +String nome
}

class Escalista {
  +Long id
  +String cargo
}

class Medico {
  +Long id
  +String crm
  +String ufCrm
}

class EscalistaSetor {
  +Long id
  +Boolean ativo
}

class MedicoSetor {
  +Long id
  +Boolean ativo
}

class RegraPlantaoFixo {
  +Long id
  +TipoRecorrenciaPlantao tipoRecorrencia
  +String diaSemana
  +Integer semanaDoMes
  +LocalTime horaInicio
  +LocalTime horaFim
}

class Plantao {
  +Long id
  +PlantaoTipo tipo
  +LocalDateTime dataInicio
  +LocalDateTime dataFim
  +PlantaoStatus status
}

class PlantaoMedico {
  +Long id
  +PlantaoStatus status
}

class PedidoCobertura {
  +Long id
  +PedidoCoberturaStatus status
  +LocalDateTime abertoEm
  +LocalDateTime assumidoEm
}

class Notificacao {
  +Long id
  +NotificacaoTipo tipo
  +String mensagem
  +LocalDateTime criadoEm
}

Usuario "1" --> "0..1" Hospital : perfilHospital
Usuario "1" --> "0..1" Escalista : perfilEscalista
Usuario "1" --> "0..1" Medico : perfilMedico

Hospital "1" *-- "1..*" Setor : possui
Hospital "1" --> "0..*" Escalista : cadastra

Escalista "1" --> "0..*" EscalistaSetor : vinculo
Setor "1" --> "0..*" EscalistaSetor : vinculo

Escalista "1" --> "0..*" MedicoSetor : vinculaMedico
Medico "1" --> "0..*" MedicoSetor : vinculo
Setor "1" --> "0..*" MedicoSetor : vinculo

Escalista "1" --> "0..*" RegraPlantaoFixo : cria
Setor "1" --> "0..*" RegraPlantaoFixo : agenda
Medico "1" --> "0..*" RegraPlantaoFixo : titular
RegraPlantaoFixo "0..1" --> "0..*" Plantao : gera

Escalista "1" --> "0..*" Plantao : atribui
Setor "1" --> "0..*" Plantao : contem
Medico "1" --> "0..*" Plantao : titular
Medico "1" --> "0..*" Plantao : responsavelAtual

Plantao "1" *-- "0..*" PlantaoMedico : alocacoes
Medico "1" --> "0..*" PlantaoMedico : titular
Medico "1" --> "0..*" PlantaoMedico : responsavelAtual

Plantao "1" --> "0..*" PedidoCobertura : origina
PlantaoMedico "0..1" --> "0..*" PedidoCobertura : detalhaAlocacao
Setor "1" --> "0..*" PedidoCobertura : limitaVisibilidade
Medico "1" --> "0..*" PedidoCobertura : solicita
Medico "1" --> "0..*" PedidoCobertura : assume

PedidoCobertura "1" --> "0..*" Notificacao : dispara
Plantao "1" --> "0..*" Notificacao : referencia
Usuario "1" --> "0..*" Notificacao : recebe
```

## Leitura rapida

- `Usuario` representa a conta de acesso. Ela pode ter perfil de `Hospital`, `Escalista` ou `Medico`.
- `Hospital` cadastra `Setor` e `Escalista`. O hospital nao cadastra medico diretamente neste fluxo.
- `EscalistaSetor` define em quais setores o escalista atua.
- `MedicoSetor` define em quais setores o medico pode ser visto, escalado e visualizar coberturas.
- `RegraPlantaoFixo` gera ocorrencias de `Plantao`; plantoes avulsos entram diretamente como `Plantao`.
- `PlantaoMedico` representa a alocacao de um medico em um plantao.
- `PedidoCobertura` representa a oferta/aceite de cobertura e gera `Notificacao` para o usuario relacionado.
