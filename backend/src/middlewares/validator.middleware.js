
import { validationResult } from "express-validator";

import { ApiError } from "../utils/api-error.js";


//if there are error from userRegisterValidator i.e any error in body fields
export const validate = (req, res, next) => {
    //find the error 
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    //if not err move to next i.e next module registerUser
    return next();
  }
  //if error
  const extractedErrors = [];
  //add all errors in a array
  errors.array().map((err) =>
    extractedErrors.push({
      [err.path]: err.msg,
    }),
  );
  //response with the error 
  throw new ApiError(422, "Recieved data is not valid", extractedErrors);
};
