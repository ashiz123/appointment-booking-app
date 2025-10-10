import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET||'default-secret';
const EXPIRES_IN = '1h';

export const jwtService = {
    sign(payload, options = {}){
        return jwt.sign({payload}, SECRET_KEY, {expiresIn: EXPIRES_IN, ...options} )
    },

    verify(token){
        try{
            return jwt.verify(token, SECRET_KEY);
        }catch(err){
            return 'Error found in jwts verify:' , err.message;
        }
    },
    
    decode(token){
        return jwt.decode(token)
    }   


}