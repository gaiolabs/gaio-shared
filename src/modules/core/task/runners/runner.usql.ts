export const usqlQueryCommand = async (type, args) => {
    const {
        host,
        oracleAlternativeDriver,
        user,
        password,
        encryptSource,
        port,
        database,
        sid,
        serviceName,
        sql,
        rawValue
    } = args

    const miniQuery = JSON.stringify(
        `${sql}`
            .replace(/--.*\n/g, '')
            .replace(/\/\*[\s\S]*?\*\//g, '')
            .replace(' =', '=')
            .replace('= ', '=')
            .replace('( ', '(')
            .replace(' )', ')')
            .replace('\r', ' ')
            .replace('\\n', ' ')
            .replace('\\r', ' ')
            .replace('\n', ' ')
            .replace(/`/g, '')
            .replace(/ +/g, ' ')
            .replace(/^ /g, '')
            .replace(/\s+/g, ' ')
            .trim()
    )

    const sed = `| sed "s/'/’/g" | sed "s/    / /g" `
    let scrubcsv = sed + ` | scrubcsv --replace-newlines --null '(?i)NULL' -q -d "|" `

    if (rawValue) {
        scrubcsv = sed + ` | scrubcsv --null '(?i)NULL' -q -d "|" `
    }

    const dbPort = type === 'clickhouse' ? '9000' : port
    const conn = `${user}:${encodeURIComponent(password)}@${host}:${Number(dbPort)}`

    if (type === 'clickhouse') {
        return `usql --csv -q -F "|" ch://${conn}/${database}?charset=utf8mb4,utf8 -w  --command ${miniQuery} --set SHOW_HOST_INFORMATION=false ${scrubcsv} `
    } else if (type === 'mysql' || type === 'memsql' || type === 'aurora') {
        return `usql --csv -q -F "|" my://${conn}/${database}?charset=utf8mb4,utf8 -w  --command ${miniQuery} --set SHOW_HOST_INFORMATION=false ${scrubcsv} `
    } else if (type === 'mssql') {
        return `usql --csv -q -F "|" mssql://${conn}/${database}${
            !encryptSource ? '' : '?encrypt=true'
        } -w  --command ${miniQuery} --set SHOW_HOST_INFORMATION=false ${scrubcsv} `
    } else if (type === 'pg') {
        return `usql --csv -q -F "|" pg://${conn}/${database}?sslmode=disable -w  --command ${miniQuery} --set SHOW_HOST_INFORMATION=false ${scrubcsv} `
    } else if (type === 'redshift') {
        return `usql --csv -q -F "|" postgres://${conn}/${database}?sslmode=disable -w  --command ${miniQuery} --set SHOW_HOST_INFORMATION=false ${scrubcsv} `
    } else if (type === 'oracle') {
        if (oracleAlternativeDriver) {
            return `usql --csv -q -F "|" gr://${conn}/${
                sid || serviceName
            } -w  --command ${miniQuery} --set SHOW_HOST_INFORMATION=false ${scrubcsv} `
        } else {
            return `usql --csv -q -F "|" or://${conn}/${
                sid || serviceName
            } -w  --command ${miniQuery} --set SHOW_HOST_INFORMATION=false ${scrubcsv} `
        }
    }
    return ''
}
