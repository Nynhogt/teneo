// Consultas de referencia para o Power Query do Power BI.
// Use "Obter dados > Editor Avancado" e cole a consulta desejada.

// 1) Organizacoes
let
    Fonte = PostgreSQL.Database("localhost:5432", "teneo_development"),
    Organizacoes = Fonte{[Schema = "bi", Item = "organizations"]}[Data],
    Tipos = Table.TransformColumnTypes(
        Organizacoes,
        {
            {"id", Int64.Type},
            {"name", type text},
            {"slug", type text},
            {"created_at", type datetime},
            {"updated_at", type datetime}
        }
    )
in
    Tipos

// 2) Organizacoes por mes de cadastro
// let
//     Organizacoes = PostgreSQL.Database("localhost:5432", "teneo_development"){[Schema = "bi", Item = "organizations"]}[Data],
//     ComMes = Table.AddColumn(Organizacoes, "mes_cadastro", each Date.StartOfMonth(DateTime.Date([created_at])), type date),
//     Agrupado = Table.Group(
//         ComMes,
//         {"mes_cadastro"},
//         {{"organizacoes", each Table.RowCount(_), Int64.Type}}
//     ),
//     Ordenado = Table.Sort(Agrupado, {{"mes_cadastro", Order.Ascending}})
// in
//     Ordenado
