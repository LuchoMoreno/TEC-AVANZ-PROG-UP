class BadRequestError extends Error {
    constructor(message) {
        super(message);
        this.name = "BadRequestError";
        this.statusCode = 400; // Código HTTP 400 para errores de solicitud incorrecta
    }
}

class UnauthorizedError extends Error {
    constructor(message) {
        super(message);
        this.name = "UnauthorizedError";
        this.statusCode = 401; // Código HTTP 401 para errores de autorización
    }
}

class NotFoundError extends Error {
    constructor(message) {
        super(message);
        this.name = "NotFoundError";
        this.statusCode = 404; // Código HTTP 404 para errores de recurso no encontrado
    }
}

// Falta agregar mas como NotFoundError, ConflictError, etc.

module.exports = {
    BadRequestError,
    UnauthorizedError,
    NotFoundError,
    // Exportar más errores aca si es necesario
};