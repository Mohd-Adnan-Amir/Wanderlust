// class ExpressError extends Error {
//   constructor(statusCode = 500, message = "Something went wrong") {
//     super(message);
//     this.statusCode = statusCode;

//     if (Error.captureStackTrace) {
//       Error.captureStackTrace(this, this.constructor);
//     }
//   }
// }

// module.exports = ExpressError;



class ExpressError extends Error {
    constructor(statusCode, message){
        super();
        this.statusCode = statusCode;
        this.message = message;
    }

}
module.exports = ExpressError;