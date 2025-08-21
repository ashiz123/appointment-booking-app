import { jwtService } from "../services/jwtServices.js";


export function authenticate(req, res, next){
  const authHeader = req.headers['authorization'];
  if(!authHeader) return res.status(401).json({message : 'No token provided'});

  const token = authHeader.split(' ')[1];
  const decoded = jwtService.verify(token)
  if(!decoded){
    return res.status(401).json({message : "Invalid token"});
  }
  next();
}