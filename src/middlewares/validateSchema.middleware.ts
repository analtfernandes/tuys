import { NextFunction, Request, Response } from "express";
import Joi from "joi";
import * as responseHelper from "../helpers/response.helper";

type ValidateSchemaTypeParam = "body" | "params";

export function validateSchema<Type>(schema: Joi.ObjectSchema<Type>, type: ValidateSchemaTypeParam = "body") {
  return (req: Request, res: Response, next: NextFunction) => {
    const validation = schema.validate(req[type], { abortEarly: false });

    if (validation.error) {
      const errors = validation.error.details.map(({ message }) => message);
      return responseHelper.BAD_REQUEST({ res, body: errors });
    }

    next();
  };
}
