module.exports = class gameController {
    static home(req, res, next) {
        res.send('Welcome to Game Page');
    }
}