import {createClient} from 'redis';

class RedisClient {


    constructor(){
        this.client = createClient({
        url: process.env.REDIS_URL || 'redis://127.0.0.1:6379',
        });

        this.client.on('connect', () => console.log('Redis connected successfully'));
        this.client.on('ready', () => console.log('Redis is ready'));
        this.client.on('end', () => console.log('Redis disconnected'));
        this.client.on('error',  (err) => console.log('Redis client error:', err));

    }


    async connect(){
        if(!this.client.isOpen){
            await this.client.connect();
        }
    }

    async disConnect(){
        if(this.client.isOpen){
            await this.client.quit();
        }
    }

    async set(key, value, expireSeconds = null){
        
        if(expireSeconds){
             return await this.client.set(key, expireSeconds);
        }

       return await this.client.set(key, value);
    }

    async hSet(key, field, value){
        return this.client.hSet(key, field, value);
    }

    async hGetAll(key){
        return this.client.hGetAll(key);
    }


    async get(key){
        return await this.client.get(key);
    }

    async del(key){
         return await this.client.del(key);
    }

    async isConnected(){
        return this.client.isOpen;
    }

    async ping(){
        try{
            const pong = await this.client.ping();
            return pong === 'PONG';
        }catch{
            return false;
        }
    }

}


export const redisClient = new RedisClient();