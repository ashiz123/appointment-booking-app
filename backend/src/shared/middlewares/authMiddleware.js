import { jwtService } from "../services/jwtServices.js";


export function authenticate(req, res, next){


 if (process.env.NODE_ENV === 'test') {
    console.log('its coming in test environment authenticate');
    req.user = { id: '68e699a649500a709aa9b8c3' , username : 'testing', email : "testing@gmail.com"};
    return next();
  }


  const authHeader = req.headers['authorization'];
  if(!authHeader) return res.status(401).json({message : 'No token provided'});

  const token = authHeader.split(' ')[1];

  try{
    const decoded = jwtService.verify(token)
    req.user = {
      id: decoded.payload.userId,
      username: decoded.payload.username,
      email: decoded.payload.email
    }
    next();
  }catch(err){
    return res.status(400).json({
      message : "Invalid token",
      error: err.message
    })
  }
  
  
}