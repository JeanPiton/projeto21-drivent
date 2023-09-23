import Joi from 'joi';

export const ticketTypeIdSchema = Joi.object({
  ticketTypeId: Joi.number().integer().greater(-1).required(),
});
