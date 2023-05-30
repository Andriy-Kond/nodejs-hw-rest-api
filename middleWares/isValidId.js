const { isValidObjectId } = require("mongoose");
const { HttpError } = require("../helpers");

const isValidId = (req, res, next) => {
	const { contactId } = req.params;
	if (!isValidObjectId(contactId)) {
		next(HttpError(400, `${contactId} is not valid id`));
	}
	next(); // якщо id валідний, то просто йдемо даі
};

module.exports = isValidId;