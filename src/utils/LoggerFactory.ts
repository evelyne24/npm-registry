export interface LoggerFactory {
    getLogger(name: string): Logger;
}

export interface Logger {

    trace(obj: Object, ...params: any[]): void;

    trace(format: any, ...params: any[]): void;
  

    debug(error: Error, ...params: any[]): void;

    debug(obj: Object, ...params: any[]): void;

    debug(format: any, ...params: any[]): void;


    info(error: Error, ...params: any[]): void;

    info(obj: Object, ...params: any[]): void;

    info(format: any, ...params: any[]): void;


    warn(error: Error, ...params: any[]): void;

    warn(obj: Object, ...params: any[]): void;

    warn(format: any, ...params: any[]): void;
 

    error(error: Error, ...params: any[]): void;

    error(obj: Object, ...params: any[]): void;

    error(format: any, ...params: any[]): void;
}