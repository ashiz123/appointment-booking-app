
import { saveUser, findUserByUsername } from "../repositories/userRepository.js";
import bcrypt from 'bcrypt';
import { jwtService } from "./jwtServices.js";

export async function registerUser(userData){
    const existingUser = await findUserByUsername(userData.username);
    
    if(existingUser){
        throw new Error('User already exist');
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    // const newUser = {...userData, password: hashedPassword};
    const userToSave = {
        username : userData.username,
        email: userData.email,
        password: hashedPassword,
        createdAt: new Date()
    }

    return await saveUser(userToSave);

}


export async function loginUser(userData){
    const user = await findUserByUsername(userData.username);
   
    
    if(!user){
        throw new Error('User not found');
    }

    const isMatch = await bcrypt.compare(userData.password, user.password);

    if(!isMatch){
        throw new Error('Invalid password');
    }

  
    const payload = {
    userId: user.id,
    username: user.username,
    email: user.email
    };

    const token =  jwtService.sign(payload)

    return {token, user: {
        id: user.id,
        username : user.username,
        email : user.email
    }};

}