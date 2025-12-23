const handleasync = (handleasync) => {
    (req, res , next) => {
        Promise.resolve(handleasync(req, res , next)).catch((err) => next(err))
    }
}