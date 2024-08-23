import { dbGaio } from '../db/db.gaio'

const getUserSerial = async () => {
    return await dbGaio('upUserSerial')
        .exec(
            `INSERT INTO serial (serial, type) 
                    VALUES(
                        (SELECT serial + 1 as serial 
                            FROM serial FINAL WHERE type = 'user'),
                        'user'
                    )`
        )
        .then(() =>
            dbGaio('getUserSerial')
                .query(`SELECT serial FROM serial FINAL WHERE type = 'user'`)
                .then((res) => res[0].serial)
        )
}

const getAppSerial = async () => {
    return await dbGaio('upAppSerial')
        .exec(
            `INSERT INTO serial (serial, type) 
                    VALUES(
                        (SELECT serial + 1 as serial 
                            FROM serial FINAL WHERE type = 'app'),
                        'app'
                    )`
        )
        .then(() =>
            dbGaio('getAppSerial')
                .query(`SELECT serial FROM serial FINAL WHERE type = 'app'`)
                .then((res) => res[0].serial)
        )
}

export default {
    getAppSerial,
    getUserSerial
}
