import { customErrors } from "../utils/customErrors.js";

export default function errorHandler(err, _req, res , _next){
  
   try{
      const errorTemplate = customErrors[err.message]; //bracket object notation
      res.status(errorTemplate.statusCode).json({success:false,  ...errorTemplate, errors: err.error || undefined});
    }
    catch(e){
        res.statusCode = 500;
        res.send({error : true,  errorDetail : e.message, ...customErrors['serverError']});
    }
}

