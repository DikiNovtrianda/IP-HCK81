function errorHandler(err, req, res, next) {
    console.error(err);
    switch (err.name) {
        case "SequelizeUniqueConstraintError":
        case "SequelizeValidationError":
            res.status(400).json({ message : err.errors[0].message });
            return;
        case "ValidationError":
        case "BadRequest":
        case "InvalidFilterError":
            res.status(400).json({ message: err.message });
            return;
        case "Unauthorized":
            res.status(401).json({ message : err.message });
            return;
        case "JsonWebTokenError":
            res.status(401).json({ message : "Invalid token" });
            return;
        case "NotFound":
            res.status(404).json({ message : err.message });
            break;
        default:
            res.status(500).json({ message : "Internal server error" });
            return;
    }
}

module.exports = { errorHandler };