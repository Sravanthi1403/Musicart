class ErrorHandler extends Error {
    constructor(statusCode, message = "Internal Server Error" , stack="")
    {
        super(message)
        this.statusCode = statusCode
        if(stack) {
            this.stack = stack
        } else{
            Error.captureStackTrace(this, this.constructor)
        }
    }
}

const errorMiddleware = (err, req, res, next) => {
    
    return res.status(err.statusCode || 500).json({
        success : false,
        message : err.message|| "Internal Server Error",
    })
}

module.exports = {ErrorHandler, errorMiddleware}