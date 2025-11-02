import { getDb } from "../../shared/config/db.js";
import { UserRepository } from "./userRepository.js";
import { userFactory } from "./userFactory.js"; 


export async function userService(){
    const db = new getDb();
    const repo = new UserRepository(db);
    return userFactory(repo);
}