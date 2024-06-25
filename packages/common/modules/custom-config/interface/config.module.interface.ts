import { ConfigFactory } from '@nestjs/config';
import { ClassConstructor } from 'class-transformer';
import { ValidatorOptions } from 'class-validator';

export interface ICustomConfigModuleOptions<T> {
  /*
   * Class to be used for validation.
   */
  validationClass: ClassConstructor<T>;

  /**
   * Class validator options.
   * See: https://www.npmjs.com/package/class-validator#passing-options
   */
  validatorOptions?: ValidatorOptions;

  /**
   * If "true", values from the process.env object will be cached in the memory.
   */
  cache?: boolean;
  /**
   * If "true", registers `ConfigModule` as a global module.
   * See: https://docs.nestjs.com/modules#global-modules
   */
  isGlobal?: boolean;
  /**
   * Array of custom configuration files to be loaded.
   * See: https://docs.nestjs.com/techniques/configuration
   */
  load?: Array<ConfigFactory>;
}
