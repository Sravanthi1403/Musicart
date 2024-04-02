const {ErrorHandler} = require('../utils/ErrorHandler');

const validate = (schema) => async (req, res, next) => {
    try {
        const parseBody = await schema.parseAsync(req.body);
        req.body = parseBody;
        next();
    } catch (err) {
        console.log(err.issues.map((curElem) => curElem.message));
        next(new ErrorHandler(422, err.issues.map((curElem) => curElem.message)));       
    }

};

module.exports = validate;