const joi = require('joi');

const ActivitySchema = joi.object({
  Activity_Type: joi.string().required(),
}).required();

module.exports = { ActivitySchema };