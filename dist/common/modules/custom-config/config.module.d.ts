import 'reflect-metadata';
import { DynamicModule } from '@nestjs/common';
import { ICustomConfigModuleOptions } from './interface/config.module.interface';
export declare class ConfigModule {
    private static getErrorMessages;
    private static validateInstance;
    private static chunkArray;
    private static fetchAndSetEnvVariables;
    private static setEnvFromSSM;
    static forRoot<T>(options: ICustomConfigModuleOptions<T>): Promise<DynamicModule>;
    private static mergePartial;
}
