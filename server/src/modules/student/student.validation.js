const Joi = require("joi");

const studentIdSchema = Joi.object({
  studentId: Joi.string().required()
});

module.exports = { studentIdSchema };