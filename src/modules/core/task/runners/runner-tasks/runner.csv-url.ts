import type { CsvUrlTaskType, ParamType } from '@gaio/types'
import templateString from '../../../../../utils/templateString'
import { dropTableIfExist, executeQuery, prepareSchemaInference } from '../runner.tools'

const getCleanErrorAtCatch = (error) => {
    if (error && error.data && error.data[0]) {
        const { message, code } = error.data[0]
        throw { error: true, message, code }
    } else if (error && error.data && error.data.message) {
        const { message, code } = error.data
        throw { error: true, message, code }
    } else {
        const { message, code, errno, query } = error
        throw { error: true, message, code, errno, query }
    }
}

export default async <T extends CsvUrlTaskType>(taskData: T, params: ParamType[]) => {
    const filePathWithCsvParameters = templateString(taskData.url, params)

    let fileFormatType = taskData.fileFormatType
    let delimiter = ',format_csv_allow_single_quotes=1'

    if (!['TabSeparatedWithNames', 'CSVWithNames'].includes(taskData.fileFormatType)) {
        fileFormatType = 'CSVWithNames'
        delimiter = `, format_csv_delimiter='${taskData.fileFormatType}', format_csv_allow_single_quotes=1`
    }

    delimiter += ',input_format_null_as_default=1'

    try {
        if (taskData.insertMode) {
            await executeQuery({
                at: taskData,
                sql: `INSERT INTO
                        ${taskData.resultDatabase}.${taskData.resultTable}
                            SELECT * FROM
                        url('${filePathWithCsvParameters}', ${fileFormatType})
                        SETTINGS input_format_skip_unknown_fields = 1 
                        ${delimiter}`
            })
        } else {
            let schemaInference = ''
            if (!taskData.insertMode) {
                await dropTableIfExist(taskData)
                schemaInference = prepareSchemaInference(taskData)
            }

            await executeQuery({
                at: taskData,
                sql: `CREATE TABLE ${taskData.resultDatabase}.${taskData.resultTable} 
                         ENGINE = MergeTree ORDER BY tuple() 
                            AS SELECT * FROM
                                url('${filePathWithCsvParameters}', ${fileFormatType})
                         SETTINGS input_format_skip_unknown_fields = 1, 
                         ${schemaInference} 
                         ${delimiter}`
            })
        }

        return { status: 'success' }
    } catch (error) {
        getCleanErrorAtCatch(error)
    }

    return { status: 'done' }
}
