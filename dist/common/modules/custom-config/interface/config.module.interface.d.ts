import { ConfigFactory } from '@nestjs/config';
import { ClassConstructor } from 'class-transformer';
import { ValidatorOptions } from 'class-validator';
export interface ICustomConfigModuleOptions<T> {
    validationClass: ClassConstructor<T>;
    validatorOptions?: ValidatorOptions;
    cache?: boolean;
    isGlobal?: boolean;
    load?: Array<ConfigFactory>;
}
