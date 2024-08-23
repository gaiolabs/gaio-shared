export const appQuery = `
            SELECT appName as label, 
                    appId as id, 
                    options,
                    'app' as type
                FROM app 
            WHERE replaceRegexpAll(normalizeUTF8NFKD(LOWER(appName)), '\\pM', '')
	        LIKE replaceRegexpAll(normalizeUTF8NFKD(LOWER({search: String})), '\\pM', '')
	        ORDER BY appName ASC
`

export const metaQuery = `
            SELECT label, 
                    metaId as id,
                    '{}' as options,
                    'meta' as type
                FROM meta
            WHERE replaceRegexpAll(normalizeUTF8NFKD(LOWER(label)), '\pM', '')
	        LIKE replaceRegexpAll(normalizeUTF8NFKD(LOWER({search: String})), '\pM', '')
	        ORDER BY label ASC
`
