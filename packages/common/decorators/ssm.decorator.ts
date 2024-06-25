// import 'reflect-metadata';
import { IS_SSM_KEY } from '../constants/ssm.decorator.constant';
import { SSMColumn } from '../interfaces/sm.decorator.interface';

export function getSSMColumn(target: any): SSMColumn[] {
  return Reflect.getMetadata(IS_SSM_KEY, target);
}

export function setSSMColumn(target: any, columns: any): void {
  Reflect.defineMetadata(IS_SSM_KEY, columns, target);
}

/**
 * Decorator. Defines a property of a class such as SSM.
 *
 * @see (https://www.npmjs.com/package/nestjs-ssm-config-module#decorators)
 *
 * @publicApi
 */
export function IsSSM() {
  return (target: object, propertyKey: string) => {
    // get or initialize the columns list
    let columns = getSSMColumn(target) || [];

    // add the new column to the list
    columns.push({ propertyKey });

    // define column in metadata for the target
    setSSMColumn(target, columns);
  };
}
