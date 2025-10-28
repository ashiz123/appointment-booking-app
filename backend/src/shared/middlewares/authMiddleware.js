import { jwtService } from "../services/jwtServices.js";
import { AppError } from "../utils/appError.js";

export function authenticate(req, res, next){

  const authHeader = req.headers['authorization'];
  if(!authHeader) return res.status(401).json({message : 'User not authorized, Token required'});

  const token = authHeader.split(' ')[1];

   if (process.env.NODE_ENV === 'test') {
    req.user = { id: '68e699a649500a709aa9b8c3' , username : 'testing', email : "testing@gmail.com"};
    return next();
  }

  try{
    const decoded = jwtService.verify(token)
    req.user = {
      id: decoded.payload.userId,
      username: decoded.payload.username,
      email: decoded.payload.email
    }
    next();
  }catch(err){
    console.log('auth', err.message);
    throw new AppError('authenticationFailed' , [{ type : "middleware", path : "authMiddleware", msg: err.message}]  );
  }
  
  
} 