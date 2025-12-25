const handleasync = (handleasync) => {
    return (req, res , next) => {
        Promise.resolve(handleasync(req, res , next)).catch((err) => next(err))
    }
}
export {handleasync}