const fetch = require("node-fetch")

const CALC_HOST = process.env.CALC_HOST || 'localhost'
const CALC_PORT = process.env.CALC_PORT || 4001
const CALC_URL = `http://${CALC_HOST}:${CALC_PORT}/calculate`

async function calc(array, operation) {
    const query = array.reduce((acc, c) => `${acc}n=${c}&`, `${CALC_URL}/${operation}?`).slice(0,-1)
    const response = await fetch(query)
    const total = await response.json()
    return total
}

module.exports = calc