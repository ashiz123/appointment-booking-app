

import bcrypt from 'bcrypt';
import { jwtService } from "../../shared/services/jwtServices.js";



export function userFactory(repository){

   return {
    //register
    async registerUser(userData){
            const existingUser = await repository.findUserByUsername(userData.username);
        
        if(existingUser){
            throw new Error('User already exist');
        }

        const hashedPassword = await bcrypt.hash(userData.password, 10);
        const userToSave = {
            username : userData.username,
            email: userData.email,
            password: hashedPassword,
            createdAt: new Date()
        }

         const data =  await repository.saveUser(userToSave);
         return {success: true, newUser: data};
    },

    //login
     async loginUser(userData){
            const user = await repository.findUserByUsername(userData.username);
            
            if(!user){
                throw new Error('User not found');
            }

            const isMatch = await bcrypt.compare(userData.password, user.password);

            if(!isMatch){
                throw new Error('Invalid password');
            }

            const payload = {
            userId : user._id,    //toString() in case need
            username: user.username,
            email: user.email
            };

            const token =  jwtService.sign(payload)

            return {success:true, token, user: {
                username : user.username,
                email : user.email
            }};
    }

}



    

}