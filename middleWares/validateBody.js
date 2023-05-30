const { HttpError } = require("../helpers");

const validateBody = (schema) => {
	const func = (req, res, next) => {
		const { error } = schema.validate(req.body);
		// console.log("func >> error:", error); // '"name" is required',
		const errorArr = error.message.split(" ");

		if (error) {
			// next(HttpError(400, `missing fields: ${error.message}`));
			next(HttpError(400, `missing fields: ${errorArr[0]}`));
		}

		next();
	};
	return func;
};

module.exports = validateBody;
