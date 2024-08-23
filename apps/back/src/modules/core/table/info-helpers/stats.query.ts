// type Client = 'mysql' &
//     'memsql' &
//     'sqlite' &
//     'mariadb' &
//     'mssql' &
//     'pg' &
//     'redshift' &
//     'oracle' &
//     'clickhouse' &
//     'mongodb'

interface IStat {
    withoutValues: {
        [key: string]: string
    }
    count: {
        [key: string]: string
    }
    minMax: {
        [key: string]: string
    }
    countDistinct: {
        [key: string]: string
    }
    statistics: {
        [key: string]: string
    }
    frequency: {
        [key: string]: string
    }
}

export const statsQuery: IStat = {
    withoutValues: {
        mysql: `SELECT count(*) as count, sum(CASE WHEN (@cl) IS NULL OR (@cl) = '' THEN 1 ELSE 0 END) as empty FROM @db.@tb`,
        memsql: `SELECT count(*) as count, sum(CASE WHEN (@cl) IS NULL OR (@cl) = '' THEN 1 ELSE 0 END) as empty FROM @db.@tb`,
        mariadb: `SELECT count(*) as count, sum(CASE WHEN (@cl) IS NULL OR (@cl) = '' THEN 1 ELSE 0 END) as empty FROM @db.@tb`,
        mssql: `SELECT count(*) as count, sum(CASE WHEN (@cl) IS NULL OR (@cl) = '' THEN 1 ELSE 0 END) as empty FROM @schema.[@tb]`,
        redshift: `SELECT count(*) as count, sum(CASE WHEN "@cl" IS NULL THEN 1 ELSE 0 END) as empty FROM @schema.@tb`,
        pg: `SELECT count(*) as count, sum(CASE WHEN "@cl" IS NULL THEN 1 ELSE 0 END) as empty FROM @schema.@tb`,
        oracle: `SELECT count(*) as count, sum(CASE WHEN "@cl" IS NULL OR "@cl" = '' THEN 1 ELSE 0 END) "empty" FROM "@db"."@tb"`,
        clickhouse: `SELECT count(*) as count, sum(CASE WHEN (@cl) IS NULL or empty(toString(@cl)) = 1 THEN 1 ELSE 0 END) as empty FROM @db.@tb`
    },
    count: {
        mysql: `SELECT count(*) as qtd, count(distinct(@cl)) as countDistinct FROM @db.@tb @filter`,
        memsql: `SELECT count(*) as qtd, count(distinct(@cl)) as countDistinct FROM @db.@tb @filter`,
        sqlite: `SELECT count(*) as qtd, count(distinct(@cl)) as countDistinct FROM @tb @filter`,
        mariadb: `SELECT count() as qtd, count(distinct(@cl)) as countDistinct FROM @db.@tb @filter`,
        mssql: `SELECT COUNT(*) as qtd, count(distinct(@cl)) as countDistinct FROM @schema.[@tb] @filter`,
        pg: `SELECT count(*) as qtd, count(distinct("@cl")) as "countDistinct" FROM @schema.@tb @filter`,
        redshift: `SELECT count(*) as qtd, count(distinct("@cl")) as "countDistinct" FROM @schema.@tb @filter`,
        oracle: `SELECT count(*) "qtd", count(distinct("@cl")) "countDistinct" FROM "@db"."@tb" @filter`,
        clickhouse: `SELECT count(*) as qtd, count(distinct(@cl)) as countDistinct FROM @db.@tb @filter`
    },
    minMax: {
        mysql: `SELECT min(@cl) as minimum, max(@cl) as maximum FROM @db.@tb`,
        memsql: `SELECT min(@cl) as minimum, max(@cl) as maximum FROM @db.@tb`,
        sqlite: `SELECT min(@cl) as minimum, max(@cl) as maximum FROM @tb`,
        mariadb: `SELECT min(@cl) as minimum, max(@cl) as maximum FROM @db.@tb`,
        mssql: `SELECT min(@cl) as minimum, max(@cl) as maximum FROM @schema.[@tb]`,
        redshift: `SELECT min("@cl") as minimum, max("@cl") as maximum FROM @schema.@tb`,
        pg: `SELECT min("@cl") as minimum, max("@cl") as maximum FROM @schema.@tb`,
        oracle: `SELECT min("@cl") "minimum", max("@cl") "maximum" FROM "@db"."@tb"`,
        clickhouse: `SELECT min(@cl) as minimum, max(@cl) as maximum, median(@cl) as median FROM @db.@tb`
    },
    countDistinct: {
        mysql: `SELECT count(@cl) as qtd, count(distinct(@cl)) as countDistinct FROM @db.@tb @filter`,
        memsql: `SELECT count(@cl) as qtd, count(distinct(@cl)) as countDistinct FROM @db.@tb @filter`,
        sqlite: `SELECT count(@cl) as qtd, count(distinct(@cl)) as countDistinct FROM @tb @filter`,
        mariadb: `SELECT count(@cl) as qtd, count(distinct(@cl)) as countDistinct FROM @db.@tb @filter`,
        mssql: `SELECT COUNT(@cl) as qtd, count(distinct(@cl)) as countDistinct FROM @schema.[@tb] @filter`,
        pg: `SELECT count("@cl") as qtd, count(distinct("@cl")) as "countDistinct" FROM @schema.@tb @filter`,
        redshift: `SELECT count("@cl") as qtd, count(distinct("@cl")) as "countDistinct" FROM @schema.@tb @filter`,
        oracle: `SELECT count("@cl") "qtd", count(distinct("@cl")) "countDistinct" FROM "@db"."@tb" @filter`,
        clickhouse: `SELECT count(@cl) as qtd, count(distinct(@cl)) as countDistinct FROM @db.@tb @filter`
    },
    statistics: {
        mysql: `SELECT  avg(@cl) as average,
                    min(@cl) as minimum,
                    max(@cl) as maximum,
                    std(@cl) as standardDeviation,
                    sum(@cl) as sum,
                    count(*) as count,
                    sum(CASE WHEN (@cl) IS NULL OR (@cl) = '' THEN 1 ELSE 0 END) as empty,
                    count(distinct(@cl)) as countDistinct
            FROM @db.@tb @filter;
    `,
        mariadb: `SELECT  avg(@cl) as average,
                      min(@cl) as minimum, 
                      max(@cl) as maximum,
                      std(@cl) as standardDeviation,
                      sum(@cl) as sum,
                      count(*) as count,
                      sum(CASE WHEN (@cl) IS NULL OR (@cl) = '' THEN 1 ELSE 0 END) as empty,
                      count(distinct(@cl)) as countDistinct
              FROM @db.@tb @filter;
    `,
        memsql: `SELECT   avg(@cl) as average,
                      min(@cl) as minimum, 
                      max(@cl) as maximum,
                      std(@cl) as standardDeviation,
                      sum(@cl) as sum,
                      count(*) as count,
                      sum(CASE WHEN (@cl) IS NULL OR (@cl) = '' THEN 1 ELSE 0 END) as empty,
                      count(distinct(@cl)) as countDistinct
              FROM @db.@tb @filter
    `,
        mssql: `SELECT  avg(@cl) as average,
                    min(@cl) as minimum,
                    max(@cl) as maximum,
                    cast(stdev(@cl) as decimal(10,2)) as standardDeviation,
                    sum(@cl) as sum,
                    count(*) as count,
                    sum(CASE WHEN (@cl) IS NULL OR (@cl) = '' THEN 1 ELSE 0 END) as empty,
                    count(distinct(@cl)) as countDistinct
            FROM  @schema.[@tb] @filter
    `,
        pg: `SELECT  avg("@cl") as average,
                    min("@cl") as minimum,
                    max("@cl") as maximum,
                    stddev("@cl") as standardDeviation,
                    sum("@cl") as sum,
                    count(*) as count,
                    sum(CASE WHEN "@cl" IS NULL THEN 1 ELSE 0 END) as empty,
                    count(distinct("@cl")) as countDistinct
            FROM  @schema.@tb @filter
    `,
        redshift: `SELECT  avg("@cl") as average,
                    min("@cl") as minimum,
                    max("@cl") as maximum,
                    stddev("@cl") as standardDeviation,
                    sum("@cl") as sum,
                    count(*) as count,
                    sum(CASE WHEN "@cl" IS NULL THEN 1 ELSE 0 END) as empty,
                    count(distinct("@cl")) as countDistinct
            FROM  @schema.@tb @filter
    `,
        oracle: `SELECT  avg("@cl") "average",
                    min("@cl") "minimum",
                    max("@cl") "maximum",
                    stddev("@cl") "standardDeviation",
                    sum("@cl") "sum",
                    count(*) "count",
                    sum(CASE WHEN "@cl" IS NULL OR "@cl" = '' THEN 1 ELSE 0 END) "empty",
                    count(distinct("@cl")) "countDistinct"
            FROM @db.@tb @filter
    `,
        clickhouse: `SELECT  avg(@cl) as average,
                    min(@cl) as minimum,
                    max(@cl) as maximum,
                    median(@cl) as median,
                    stddevSamp(@cl) as standardDeviation,
                    sum(@cl) as sum,
                    count(*) as count,
                    sum(CASE WHEN (@cl) IS NULL THEN 1 ELSE 0 END) as empty,
                    count(distinct(@cl)) as countDistinct
            FROM @db.@tb @filter
    `
    },
    frequency: {
        mysql: `SELECT  @cl as category,
                    count(*) as qtd,
                    round(count(*) / (@ct) * 100, 2) as percent
            FROM @db.@tb 
            @filter 
            GROUP BY @cl 
            ORDER BY qtd DESC
            LIMIT @lm
    `,
        mariadb: `  SELECT  @cl as category, 
                        count(*) as qtd,
                        round(count(*) / (@ct) * 100, 2) as percent
                FROM @db.@tb 
                @filter 
                GROUP BY @cl 
                ORDER BY qtd DESC LIMIT @lm
  `,
        memsql: `SELECT  @cl as category,
                      count(*) as qtd,
                      round(count(*) / (@ct) * 100, 2) as percent
                FROM @db.@tb 
                @filter 
                GROUP BY @cl 
                ORDER BY qtd DESC 
                LIMIT @lm
    `,
        pg: `SELECT  "@cl" as category,
                    count(*) as qtd,
                    round(count(*) * 100.00 / (@ct), 2) as percent
            FROM @schema.@tb 
            @filter 
            GROUP BY "@cl" 
            ORDER BY qtd DESC 
            LIMIT @lm
    `,
        mssql: `select  top (@lm)
                    [@tb].[@cl] as [category],
                    count(*) as [qtd],
                    cast((count(*) * 100.00) / (@ct) as decimal(10,2)) as [percent]
            from @schema.[@tb]
            @filter 
            group by [@tb].[@cl]
            order by qtd desc
    `,
        oracle: `SELECT * FROM (
                SELECT  @cl "category",
                    count(*) "qtd",
                    round(count(*) / (@ct) * 100, 2) "percent"
                FROM @db.@tb 
                @filter 
                GROUP BY @cl 
                ORDER BY COUNT(*) DESC) 
            WHERE ROWNUM <= @lm
    `,
        clickhouse: `SELECT  @cl as category,
                        count(*) as qtd,
                        round(count(*) / (@ct) * 100, 2) as percent
                    FROM @db.@tb 
                    @filter 
                    GROUP BY @cl 
                    ORDER BY qtd DESC 
                    LIMIT @lm
    `
    }
}
