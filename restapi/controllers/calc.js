module.exports = {
    add: (req, res) => {
        const result = req.query.n.reduce((acc, c) => acc + Number(c),0)
        res.json(result)
    },
    subtract: (req, res) => {
        let result = Number(req.query.n[0])
        for (i = 1; i < req.query.n.length; i++) {
            result -= Number(req.query.n[i])
        }
        res.json(result)
    },
    multiply: (req, res) => {
        const result = req.query.n.reduce((acc, c) => acc * Number(c),1)
        res.json(result)
    },
}
