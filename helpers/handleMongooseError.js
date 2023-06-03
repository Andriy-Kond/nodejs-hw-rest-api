const handleMongooseError = (error, data, next) => {
	const { name, code } = error;
	console.log("handleMongooseError >> code:", code);
	console.log("handleMongooseError >> name:", name);
	// При помилці валідації по унікальному значенні буде:
	// handleMongooseError >> code: 11000
	// handleMongooseError >> name: MongoServerError

	// При іншій помилці буде:
	// handleMongooseError >> code: undefined
	// handleMongooseError >> name: ValidationError

	const status = name === "MongoServerError" && code === 11000 ? 409 : 400;
	// error.status = 400;
	error.status = status;
	next();
};

module.exports = handleMongooseError;
