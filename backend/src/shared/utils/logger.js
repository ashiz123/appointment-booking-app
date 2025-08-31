import winston from 'winston';
const {combine, timestamp, json, errors} = winston.format;
import fs from 'fs';
import path from 'path';

const logDir = path.join(process.cwd(), "logs");

if(!fs.existsSync(logDir)){
  fs.mkdirSync(logDir, {recursive:true});
  console.log('log folder created');
}

let loggerInstance;
//singleton approach
export function getLogger(){
  if(loggerInstance) return loggerInstance;

  const logger = winston.createLogger({
    level : process.env.LOG_LEVEL || "info",
    format: combine(
       timestamp(),
       errors({stack: true}), 
       json()),
    defaultMeta : {service: 'checkout-service'}, //global meta
    transports: [
      new winston.transports.File({filename:path.join(logDir,  "app.log")}),
    ],
    exceptionHandlers: [
    new winston.transports.File({filename:path.join(logDir, "exception.log")}),
    ],

    rejectionHandlers: [
    new winston.transports.File({filename: path.join(logDir, "rejections.log") })
    ]
});


//if production show logs in Console of production
if (process.env.NODE_ENV !== 'production' && !logger.consoleAdded) {
   logger.add(new winston.transports.Console({
        format: winston.format.simple()
      }));
      logger.consoleAdded = true;
   
}

loggerInstance = logger;
return loggerInstance;
}



 












