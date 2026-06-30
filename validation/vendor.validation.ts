import Joi from "joi";

export const createVendorSchema = Joi.object({
  name: Joi.string().required(),

  email: Joi.string().email().required(),

  password: Joi.string().min(6).required(),

  phone: Joi.string().allow("", null),

  avatar: Joi.string().allow("", null),

  bio: Joi.string().allow("", null),
});

export const updateVendorSchema = Joi.object({
  name: Joi.string(),

  email: Joi.string().email(),

  password: Joi.string().min(6),

  phone: Joi.string().allow("", null),

  avatar: Joi.string().allow("", null),

  bio: Joi.string().allow("", null),
});
