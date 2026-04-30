# Relatório de Testes - MedShift

## Comando executado
`./mvnw -Dtest=MedShiftApplicationTests test`

## Classe de teste
`com.mss.medShift.MedShiftApplicationTests`

## Resultado
- Testes executados: 3
- Falhas: 0
- Erros: 0
- Ignorados: 0
- Status: ✅ BUILD SUCCESS

## Observações
- Foi necessário ajustar a classe de testes para gerar CNPJs únicos por hospital, evitando conflitos de dados entre métodos.
- Também foi adicionada a anotação `@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_EACH_TEST_METHOD)` para garantir isolamento entre os testes.

## Conclusão
Todos os testes foram executados com sucesso e o fluxo de cadastro, login, criação de setor e criação de manager foi validado pela suíte.
