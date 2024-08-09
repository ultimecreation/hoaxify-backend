module.exports = {
    getPagination: (req, res, next) => {
        const pageAsNumber = parseInt(req.query.page)
        const sizeAsNumber = parseInt(req.query.size)
        const page = pageAsNumber > 0 ? pageAsNumber : 0
        const size = (sizeAsNumber > 0 && sizeAsNumber < 11)
            ? sizeAsNumber
            : 10

        req.pagination = { page, size }
        next()
    }
}