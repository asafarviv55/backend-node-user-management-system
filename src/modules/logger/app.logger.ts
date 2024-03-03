// src/modules/logging/app-logger.ts
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AppLogger extends Logger {
 
  public log(message:string){
    console.log(message);
  }

}