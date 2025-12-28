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
  res
    .status(err.statusCode || 500)
    .set({
      "Access-Control-Allow-Origin": req.headers.origin,
      "Access-Control-Allow-Credentials": "true"
    })
    .json({
      success: false,
      message: err.message || "Internal Server Error"
    });
};


module.exports = {ErrorHandler, errorMiddleware}