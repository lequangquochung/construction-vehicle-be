import { Logger, QueryRunner, AdvancedConsoleLogger, LoggerOptions } from "typeorm";
import log from '$helpers/log';

const logger = log('Query');

export class CustomLogger extends AdvancedConsoleLogger implements Logger {

    constructor(options?: LoggerOptions) {
        super(options);
    }

    logQuery(query: string, parameters?: any[], queryRunner?: QueryRunner) {
        const requestUrl = queryRunner && queryRunner.data["request"] ? "(" + queryRunner.data["request"].url + ") " : "";
        logger.info(requestUrl + "query: " + query + "---- Parameters:" + parameters)
            
    }
}