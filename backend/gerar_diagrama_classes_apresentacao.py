#!/usr/bin/env python3
from base64 import b64encode
from html import escape
from pathlib import Path
import subprocess

WIDTH, HEIGHT = 5200, 2300
RASTER_SCALE = 2
OUT = Path(__file__).parent
MEMBER_LINE_HEIGHT = 31
MEMBER_TOP_PADDING = 27
METHOD_TOP_PADDING = 17


class Box:
    def __init__(self, name, x, y, width, attrs=(), methods=(), stereotype=""):
        self.name = name
        self.x, self.y, self.width = x, y, width
        self.attrs, self.methods = list(attrs), list(methods)
        self.stereotype = stereotype
        header = 48 if stereotype else 36
        self.height = header + max(1, len(self.attrs)) * MEMBER_LINE_HEIGHT
        if self.methods:
            self.height += 22 + len(self.methods) * MEMBER_LINE_HEIGHT

    def port(self, side, offset=0):
        return {
            "l": (self.x, self.y + self.height / 2 + offset),
            "r": (self.x + self.width, self.y + self.height / 2 + offset),
            "t": (self.x + self.width / 2 + offset, self.y),
            "b": (self.x + self.width / 2 + offset, self.y + self.height),
        }[side]


boxes = {
    "Usuario": Box("Usuario", 60, 350, 520, (
        "- id: Long", "- nome: String", "- email: String", "- senhaHash: String",
        "- cpf: String", "- dataNascimento: Date", "- telefone: String",
        "- role: UserRole", "- ativo: Boolean",
    ), (
        "+ autenticar(email, senha): Boolean", "+ trocarSenha(senhaAtual, novaSenha): void",
        "+ alterarDadosPessoais(dados): void",
    )),
    "UserRole": Box("UserRole", 150, 90, 240, (
        "HOSPITAL", "ESCALISTA", "MEDICO",
    ), stereotype="enumeration"),
    "Hospital": Box("Hospital", 650, 370, 500, (
        "- id: Long", "- nomeFantasia: String", "- razaoSocial: String",
        "- cnpj: String", "- telefone: String", "- endereco: String",
        "- nomeGestor: String", "- ativo: Boolean",
    ), (
        "+ cadastrar(dados): Hospital",
        "+ alterarDados(dados): void",
        "+ desativar(): void",
    )),
    "Setor": Box("Setor", 1340, 420, 550, (
        "- id: Long", "- nome: String", "- descricao: String", "- ativo: Boolean",
    ), (
        "+ cadastrar(dados): Setor",
        "+ listarMedicos(): List",
        "+ definirEscalistaResponsavel(escalista): void",
        "+ desativar(): void",
    )),
    "Escalista": Box("Escalista", 1920, 300, 540, (
        "- id: Long", "- cargo: String", "- ativo: Boolean",
    ), (
        "+ cadastrar(dados): Escalista",
        "+ alterarDados(dados): void",
        "+ desativar(): void",
    )),
    "Medico": Box("Medico", 1920, 930, 540, (
        "- id: Long", "- crm: String", "- ufCrm: String", "- telefone: String",
        "- fotoPerfilUrl: String", "- ativo: Boolean",
    ), (
        "+ cadastrar(dados): Medico",
        "+ alterarDados(dados): void",
        "+ desativar(): void",
    )),
    "MedicoSetor": Box("MedicoSetor", 1340, 950, 490, (
        "- id: Long", "- ativo: Boolean", "- vinculadoEm: LocalDateTime",
        "- desvinculadoEm: LocalDateTime",
    ), (
        "+ vincular(medico, setor): MedicoSetor",
        "+ ativarVinculo(): void",
        "+ encerrarVinculo(): void",
    )),
    "Especialidade": Box("Especialidade", 1340, 1600, 460, (
        "- id: Long", "- nome: String", "- descricao: String", "- ativo: Boolean",
    ), ("+ alterarDescricao(descricao): void", "+ desativar(): void")),
    "RegraPlantaoFixo": Box("RegraPlantaoFixo", 2900, 230, 500, (
        "- id: Long", "- tipoRecorrencia: TipoRecorrenciaPlantao",
        "- diaSemana: String", "- semanaDoMes: Integer", "- diaDoMes: Integer",
        "- horaInicio: LocalTime", "- horaFim: LocalTime",
        "- dataInicioVigencia: LocalDate", "- dataFimVigencia: LocalDate",
        "- ativo: Boolean",
    ), (
        "+ criar(dados): RegraPlantaoFixo",
        "+ gerarPlantoes(): List",
        "+ desativar(): void",
    )),
    "TipoRecorrencia": Box("TipoRecorrenciaPlantao", 2950, 55, 420, (
        "SEMANAL", "MENSAL",
    ), stereotype="enumeration"),
    "Plantao": Box("Plantao", 2900, 980, 560, (
        "- id: Long", "- tipo: PlantaoTipo", "- turno: PlantaoTurno",
        "- dataInicio: LocalDateTime", "- dataFim: LocalDateTime",
        "- status: PlantaoStatus",
    ), (
        "+ criarAvulso(dados): Plantao",
        "+ consultarEscala(periodo): List",
        "+ atribuirMedico(medico): void",
        "+ verificarConflito(): Boolean",
        "+ alterarResponsavel(medico): void",
    )),
    "PlantaoTipo": Box("PlantaoTipo", 2820, 1530, 210, ("AVULSO", "FIXO"), stereotype="enumeration"),
    "PlantaoTurno": Box("PlantaoTurno", 3070, 1530, 240, (
        "DIURNO", "NOTURNO", "PERSONALIZADO",
    ), stereotype="enumeration"),
    "PlantaoStatus": Box("PlantaoStatus", 3350, 1530, 220, (
        "AGENDADO", "CANCELADO", "REALIZADO",
    ), stereotype="enumeration"),
    "PedidoCobertura": Box("PedidoCobertura", 3720, 980, 490, (
        "- id: Long", "- status: PedidoCoberturaStatus",
        "- abertoEm: LocalDateTime", "- assumidoEm: LocalDateTime",
        "- canceladoEm: LocalDateTime", "- expiradoEm: LocalDateTime",
    ), (
        "+ abrir(): void", "+ assumir(medicoCobridor): void",
        "+ cancelar(): void", "+ estaAberto(): Boolean",
    )),
    "PedidoStatus": Box("PedidoCoberturaStatus", 3820, 1530, 330, (
        "ABERTO", "ASSUMIDO", "CANCELADO", "EXPIRADO",
    ), stereotype="enumeration"),
    "Notificacao": Box("Notificacao", 4540, 1010, 480, (
        "- id: Long", "- tipo: NotificacaoTipo", "- titulo: String",
        "- mensagem: String", "- lidaEm: LocalDateTime", "- criadoEm: LocalDateTime",
    ), (
        "+ criar(dados): Notificacao",
        "+ consultarPorDestinatario(): List",
        "+ marcarComoLida(): void",
    )),
    "NotificacaoTipo": Box("NotificacaoTipo", 4580, 1530, 390, (
        "COBERTURA_ASSUMIDA", "PLANTAO_ATRIBUIDO", "PLANTAO_CANCELADO",
    ), stereotype="enumeration"),
}


def pt(name, side, offset=0):
    return boxes[name].port(side, offset)


edges = []


def edge(start, end, via=(), kind="association", label="", start_mult="", end_mult="",
         label_at=None, start_mult_at=None, end_mult_at=None):
    edges.append((
        start, list(via), end, kind, label, start_mult, end_mult, label_at,
        start_mult_at, end_mult_at,
    ))


# Perfis e estrutura hospitalar.
edge(pt("Usuario", "r", -25), pt("Hospital", "l", -25), kind="composition",
     label="perfil de acesso", start_mult="1", end_mult="0..1",
     start_mult_at=(525, 545), end_mult_at=(625, 545))
edge(pt("Usuario", "t", 90), pt("Escalista", "t", -120),
     via=((400, 280), (2070, 280)), kind="composition",
     label="perfil de acesso", start_mult="1", end_mult="0..1", label_at=(1120, 270),
     start_mult_at=(420, 290), end_mult_at=(2090, 285))
edge(pt("Usuario", "b", 90), pt("Medico", "l", -70),
     via=((400, 1450), (1850, 1450), (1850, 1100)), kind="composition",
     label="perfil de acesso", start_mult="1", end_mult="0..1", label_at=(1120, 1440),
     start_mult_at=(420, 710), end_mult_at=(1870, 1090))
edge(pt("Usuario", "t", -90), pt("UserRole", "b"), via=((190, 290), (270, 290)),
     kind="dependency", label="utiliza")
edge(pt("Hospital", "r", -20), pt("Setor", "l", -20), kind="composition",
     label="possui", start_mult="1", end_mult="1..*")
edge(pt("Setor", "r", -25), pt("Escalista", "l", -25),
     via=((1820, 499), (1820, 391)), kind="association",
     label="responsável", start_mult="1", end_mult="0..1", label_at=(1790, 455),
     start_mult_at=(1770, 500), end_mult_at=(1880, 390))

# Associações de médico.
edge(pt("MedicoSetor", "r", -35), pt("Medico", "l", -35),
     via=((1830, 1008), (1830, 1034)), kind="association",
     label="médico", start_mult="0..*", end_mult="1", label_at=(1790, 1020),
     start_mult_at=(1780, 990), end_mult_at=(1890, 1040))
edge(pt("MedicoSetor", "t", -70), pt("Setor", "b", -70), kind="association",
     label="setor", start_mult="0..*", end_mult="1")
edge(pt("Escalista", "b", -130), pt("MedicoSetor", "t", 120),
     via=((2060, 900), (1665, 900)), kind="association",
     label="vincula", start_mult="1", end_mult="0..*",
     label_at=(1850, 890), start_mult_at=(2080, 640), end_mult_at=(1685, 930))
edge(pt("Medico", "b", -100), pt("Especialidade", "r", -20),
     via=((2090, 1500), (1800, 1500), (1800, 1693)), kind="association",
     label="especialidade", start_mult="0..*", end_mult="1",
     label_at=(1940, 1490), start_mult_at=(2110, 1280), end_mult_at=(1770, 1680))

# Escala e recorrência.
edge(pt("Setor", "r", 55), pt("Plantao", "l", -45),
     via=((1800, 650), (1800, 850), (2800, 850), (2800, 1077)), kind="composition",
     label="possui", start_mult="1", end_mult="0..*", label_at=(2250, 840),
     start_mult_at=(1760, 680), end_mult_at=(2820, 1070))
edge(pt("Plantao", "l", -10), pt("Escalista", "r", 25),
     via=((2760, 1112), (2760, 800), (2540, 800), (2540, 520)), kind="association",
     label="criado por", start_mult="0..*", end_mult="1", label_at=(2670, 790),
     start_mult_at=(2820, 1110), end_mult_at=(2510, 520))
edge(pt("Plantao", "l", 40), pt("Medico", "r", -10),
     via=((2700, 1162), (2700, 1074)), kind="association",
     label="titular", start_mult="0..*", end_mult="1", label_at=(2660, 1110),
     start_mult_at=(2820, 1160), end_mult_at=(2500, 1070))
edge(pt("Plantao", "l", 90), pt("Medico", "r", 25),
     via=((2740, 1212), (2740, 1109)), kind="association",
     label="responsável atual", start_mult="0..*", end_mult="1", label_at=(2670, 1200),
     start_mult_at=(2820, 1210), end_mult_at=(2500, 1110))
edge(pt("RegraPlantaoFixo", "b", 0), pt("Plantao", "t", 0), kind="aggregation",
     label="gera", start_mult="0..1", end_mult="0..*")
edge(pt("RegraPlantaoFixo", "l", -65), pt("Hospital", "t", 90),
     via=((2780, 344), (2780, 150), (990, 150), (990, 340)), kind="association",
     label="hospital", start_mult="0..*", end_mult="1", label_at=(1330, 120),
     start_mult_at=(2850, 330))
edge(pt("RegraPlantaoFixo", "l", -25), pt("Setor", "t", 30),
     via=((2820, 384), (2820, 240), (1800, 240), (1800, 350), (1565, 350)),
     kind="association", label="setor", start_mult="0..*", end_mult="1",
     label_at=(2300, 230), start_mult_at=(2810, 370), end_mult_at=(1570, 330))
edge(pt("RegraPlantaoFixo", "l", 25), pt("Escalista", "r", -45),
     via=((2760, 434), (2760, 371)), kind="association",
     label="definida por", start_mult="0..*", end_mult="1", label_at=(2690, 390),
     start_mult_at=(2770, 420), end_mult_at=(2500, 371))
edge(pt("RegraPlantaoFixo", "l", 65), pt("Medico", "r", -55),
     via=((2840, 474), (2840, 900), (2520, 900), (2520, 1030)), kind="association",
     label="titular", start_mult="0..*", end_mult="1", start_mult_at=(2730, 470))
edge(pt("RegraPlantaoFixo", "t"), pt("TipoRecorrencia", "b"),
     kind="dependency", label="utiliza")
edge(pt("Plantao", "b", -110), pt("PlantaoTipo", "t"), kind="dependency", label="utiliza")
edge(pt("Plantao", "b", 0), pt("PlantaoTurno", "t"), kind="dependency", label="utiliza")
edge(pt("Plantao", "b", 110), pt("PlantaoStatus", "t"), kind="dependency", label="utiliza")

# Cobertura e notificações.
edge(pt("Plantao", "r", -10), pt("PedidoCobertura", "l", -10), kind="composition",
     label="origina", start_mult="1", end_mult="0..*")
edge(pt("PedidoCobertura", "l", 70), pt("Medico", "r", 65),
     via=((3660, 1230), (3600, 1230), (3600, 1400), (2580, 1400), (2580, 1200)), kind="association",
     label="solicitante", start_mult="0..*", end_mult="1", label_at=(3460, 1390),
     start_mult_at=(3680, 1230), end_mult_at=(2530, 1200))
edge(pt("PedidoCobertura", "l", 105), pt("Medico", "r", 100),
     via=((3680, 1270), (3640, 1270), (3640, 1470), (2640, 1470), (2640, 1240)), kind="association",
     label="cobridor", start_mult="0..*", end_mult="0..1", label_at=(3460, 1460),
     start_mult_at=(3700, 1270), end_mult_at=(2530, 1240))
edge(pt("PedidoCobertura", "b", -80), pt("Hospital", "b", -70),
     via=((3885, 1430), (4300, 1430), (4300, 1850), (830, 1850)), kind="association",
     label="hospital", start_mult="0..*", end_mult="1", label_at=(2250, 1840))
edge(pt("PedidoCobertura", "b", 60), pt("Setor", "b", 80),
     via=((4025, 1460), (4340, 1460), (4340, 1910), (1250, 1910),
          (1250, 700), (1615, 700)), kind="association",
     label="setor", start_mult="0..*", end_mult="1", label_at=(2800, 1900))
edge(pt("PedidoCobertura", "b"), pt("PedidoStatus", "t"), kind="dependency", label="utiliza")
edge(pt("PedidoCobertura", "r", -15), pt("Notificacao", "l", -15),
     kind="association", label="dispara", start_mult="1", end_mult="0..*")
edge(pt("Notificacao", "l", 45), pt("Plantao", "r", 45),
     via=((4480, 1200), (4420, 1200), (4420, 860), (3450, 860), (3450, 1200)),
     kind="association", label="referencia", start_mult="0..*", end_mult="1",
     label_at=(3930, 850))
edge(pt("Notificacao", "b", 100), pt("Usuario", "b", -90),
     via=((4850, 1470), (5100, 1470), (5100, 2000), (190, 2000)), kind="association",
     label="destinatário", start_mult="0..*", end_mult="1", label_at=(2500, 1990))
edge(pt("Notificacao", "b"), pt("NotificacaoTipo", "t"), kind="dependency", label="utiliza")


def poly(points):
    return " ".join(f"{x:.0f},{y:.0f}" for x, y in points)


def text(x, y, value, cls="edge-label", anchor="middle"):
    return f'<text x="{x}" y="{y}" class="{cls}" text-anchor="{anchor}">{escape(value)}</text>'


def tag(x, y, value, cls="edge-label"):
    width = max(42, len(value) * 9 + 24)
    return (
        f'<g class="tag"><rect x="{x - width / 2:.0f}" y="{y - 19:.0f}" '
        f'width="{width}" height="30" rx="4"/>'
        f'{text(x, y + 1, value, cls)}</g>'
    )


def box_svg(box):
    header_h = 48 if box.stereotype else 36
    parts = [f'<g class="box"><rect x="{box.x}" y="{box.y}" width="{box.width}" height="{box.height}" rx="2"/>']
    parts.append(f'<rect class="header" x="{box.x}" y="{box.y}" width="{box.width}" height="{header_h}" rx="2"/>')
    if box.stereotype:
        parts.append(text(box.x + box.width / 2, box.y + 18, f'«{box.stereotype}»', "stereotype"))
        parts.append(text(box.x + box.width / 2, box.y + 39, box.name, "title"))
    else:
        parts.append(text(box.x + box.width / 2, box.y + 24, box.name, "title"))
    y = box.y + header_h + MEMBER_TOP_PADDING
    for line in box.attrs:
        parts.append(text(box.x + 8, y, line, "member", "start"))
        y += MEMBER_LINE_HEIGHT
    if box.methods:
        parts.append(f'<line x1="{box.x}" y1="{y - 11}" x2="{box.x + box.width}" y2="{y - 11}" class="separator"/>')
        y += METHOD_TOP_PADDING
        for line in box.methods:
            parts.append(text(box.x + 8, y, line, "member", "start"))
            y += MEMBER_LINE_HEIGHT
    parts.append("</g>")
    return "".join(parts)


def edge_svg(item):
    start, via, end, kind, label, sm, em, label_at, _, _ = item
    points = [start, *via, end]
    attrs = {
        "association": 'marker-end="url(#arrow-open)"',
        "composition": "",
        "aggregation": "",
        "dependency": 'marker-end="url(#arrow-open)" stroke-dasharray="9 7"',
    }[kind]
    parts = [f'<polyline points="{poly(points)}" class="edge {kind}" {attrs}/>']
    if kind in ("composition", "aggregation"):
        x1, y1 = points[0]
        x2, y2 = points[1]
        length = max(((x2 - x1) ** 2 + (y2 - y1) ** 2) ** 0.5, 1)
        ux, uy = (x2 - x1) / length, (y2 - y1) / length
        px, py = -uy, ux
        diamond = (
            (x1, y1),
            (x1 + ux * 10 + px * 7, y1 + uy * 10 + py * 7),
            (x1 + ux * 20, y1 + uy * 20),
            (x1 + ux * 10 - px * 7, y1 + uy * 10 - py * 7),
        )
        fill = "#111827" if kind == "composition" else "white"
        parts.append(f'<polygon points="{poly(diamond)}" fill="{fill}" stroke="#111827" stroke-width="2"/>')
    return "".join(parts)


def move_from(a, b, distance, perpendicular=0):
    x1, y1 = a
    x2, y2 = b
    length = max(((x2 - x1) ** 2 + (y2 - y1) ** 2) ** 0.5, 1)
    ux, uy = (x2 - x1) / length, (y2 - y1) / length
    px, py = -uy, ux
    return x1 + ux * distance + px * perpendicular, y1 + uy * distance + py * perpendicular


def edge_annotations(item):
    start, via, end, _, label, sm, em, label_at, start_mult_at, end_mult_at = item
    points = [start, *via, end]
    parts = []
    if label:
        if label_at:
            lx, ly = label_at
        else:
            a, b = points[len(points) // 2 - 1], points[len(points) // 2]
            lx, ly = (a[0] + b[0]) / 2, (a[1] + b[1]) / 2 - 10
        parts.append(tag(lx, ly, label))
    if sm:
        mx, my = start_mult_at or move_from(points[0], points[1], 32, -14)
        parts.append(tag(mx, my, sm, "multiplicity"))
    if em:
        mx, my = end_mult_at or move_from(points[-1], points[-2], 28, 14)
        parts.append(tag(mx, my, em, "multiplicity"))
    return "".join(parts)


svg = f'''<svg xmlns="http://www.w3.org/2000/svg" width="{WIDTH}" height="{HEIGHT}" viewBox="0 0 {WIDTH} {HEIGHT}">
<defs>
  <marker id="arrow-open" viewBox="0 0 12 12" refX="11" refY="6" markerWidth="11" markerHeight="11" orient="auto">
    <path d="M1,1 L11,6 L1,11" fill="white" stroke="#111827" stroke-width="1.8"/>
  </marker>
  <marker id="diamond-filled" viewBox="0 0 16 12" refX="1" refY="6" markerWidth="15" markerHeight="13" orient="auto-start-reverse">
    <path d="M1,6 L8,1 L15,6 L8,11 Z" fill="#111827" stroke="#111827" stroke-width="1.6"/>
  </marker>
  <marker id="diamond-open" viewBox="0 0 16 12" refX="1" refY="6" markerWidth="15" markerHeight="13" orient="auto-start-reverse">
    <path d="M1,6 L8,1 L15,6 L8,11 Z" fill="white" stroke="#111827" stroke-width="1.6"/>
  </marker>
</defs>
<style>
  svg {{ background: white; }}
  .box > rect:first-child {{ fill: #ffffff; stroke: #111827; stroke-width: 2.3; }}
  .header {{ fill: #dceeff; stroke: #111827; stroke-width: 2.3; }}
  .title {{ font: 700 23px Arial, sans-serif; fill: #111827; }}
  .stereotype {{ font: 700 18px Arial, sans-serif; fill: #374151; }}
  .member {{ font: 700 20px Arial, sans-serif; fill: #111827; }}
  .separator {{ stroke: #111827; stroke-width: 1.6; }}
  .edge {{ fill: none; stroke: #111827; stroke-width: 2.8; stroke-linejoin: round; }}
  .dependency {{ stroke-width: 2.5; stroke-dasharray: 10 8; }}
  .tag rect {{ fill: white; fill-opacity: .97; stroke: #94a3b8; stroke-width: 1; }}
  .edge-label, .multiplicity {{ font: 700 18px Arial, sans-serif; fill: #111827; }}
  .multiplicity {{ font-size: 18px; }}
  .section {{ font: 700 20px Arial, sans-serif; fill: #475569; letter-spacing: 1px; }}
  .legend {{ font: 700 19px Arial, sans-serif; fill: #111827; }}
</style>
<rect width="100%" height="100%" fill="white"/>
<text x="{WIDTH / 2}" y="38" class="title" style="font-size:22px">Diagrama de Classes - MedShift</text>
<text x="60" y="325" class="section">AUTENTICAÇÃO E PERFIS</text>
<text x="650" y="345" class="section">ESTRUTURA HOSPITALAR</text>
<text x="1340" y="1570" class="section">ESPECIALIDADES</text>
<text x="2900" y="205" class="section">RECORRÊNCIA</text>
<text x="2900" y="950" class="section">PLANTÕES E COBERTURAS</text>
<g id="edges">{''.join(edge_svg(item) for item in edges)}</g>
<g id="classes">{''.join(box_svg(box) for box in boxes.values())}</g>
<g id="annotations">{''.join(edge_annotations(item) for item in edges)}</g>
<g id="legend">
  <rect x="4320" y="2015" width="820" height="265" fill="white" stroke="#111827" stroke-width="2"/>
  <text x="4355" y="2055" class="title">Legenda UML</text>
  <line x1="4360" y1="2100" x2="4490" y2="2100" class="edge" marker-start="url(#diamond-filled)"/>
  <text x="4530" y="2105" class="legend">Composição: dependência forte de ciclo de vida</text>
  <line x1="4360" y1="2145" x2="4490" y2="2145" class="edge" marker-start="url(#diamond-open)"/>
  <text x="4530" y="2150" class="legend">Agregação: relação todo-parte</text>
  <line x1="4360" y1="2190" x2="4490" y2="2190" class="edge" marker-end="url(#arrow-open)"/>
  <text x="4530" y="2195" class="legend">Associação navegável</text>
  <line x1="4360" y1="2235" x2="4490" y2="2235" class="edge dependency" marker-end="url(#arrow-open)"/>
  <text x="4530" y="2240" class="legend">Dependência de enumeração</text>
</g>
</svg>'''

svg_path = OUT / "DIAGRAMA-CLASSES-APRESENTACAO.svg"
svg_path.write_text(svg, encoding="utf-8")

# Chromium renderiza o SVG inline para manter fundo branco e gerar PNG fiel.
html = f'<html><head><meta charset="utf-8"></head><body style="margin:0;background:white">{svg}</body></html>'
url = "data:text/html;base64," + b64encode(html.encode()).decode()
subprocess.run([
    "/snap/bin/chromium", "--headless", "--no-sandbox", "--disable-gpu",
    "--hide-scrollbars", f"--window-size={WIDTH},{HEIGHT}",
    f"--force-device-scale-factor={RASTER_SCALE}",
    f"--screenshot={OUT / 'DIAGRAMA-CLASSES-APRESENTACAO.png'}", url,
], check=True)

# PDF vetorial em página única para inclusão em documentos acadêmicos.
print_html = (
    '<html><head><meta charset="utf-8"><style>'
    '@page { size: A3 landscape; margin: 0; }'
    'html,body { width:100%; height:100%; margin:0; background:white; }'
    'svg { width:100vw; height:100vh; display:block; }'
    '</style></head><body>'
    f'{svg}'
    '</body></html>'
)
print_url = "data:text/html;base64," + b64encode(print_html.encode()).decode()
subprocess.run([
    "/snap/bin/chromium", "--headless", "--no-sandbox", "--disable-gpu",
    "--no-pdf-header-footer",
    f"--print-to-pdf={OUT / 'DIAGRAMA-CLASSES-APRESENTACAO-VETORIAL.pdf'}",
    print_url,
], check=True)
