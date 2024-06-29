import { SSMColumn } from '../interfaces/sm.decorator.interface';
export declare function getSSMColumn(target: any): SSMColumn[];
export declare function setSSMColumn(target: any, columns: any): void;
export declare function IsSSM(): (target: object, propertyKey: string) => void;
