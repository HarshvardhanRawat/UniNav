// A utility function to wrap async route handlers in Express
module.exports = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    };
}