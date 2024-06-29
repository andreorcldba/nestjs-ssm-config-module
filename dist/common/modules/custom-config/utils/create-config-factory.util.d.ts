import { FactoryProvider } from '@nestjs/common/interfaces';
import { ConfigFactory, ConfigFactoryKeyHost } from '@nestjs/config';
export declare function createConfigProvider(factory: ConfigFactory & ConfigFactoryKeyHost): FactoryProvider;
