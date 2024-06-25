import { FactoryProvider } from '@nestjs/common/interfaces';
import { v4 as uuid } from 'uuid';
import { ConfigFactory, ConfigFactoryKeyHost, getConfigToken } from '@nestjs/config';

/**
 * @publicApi
 */
export function createConfigProvider(factory: ConfigFactory & ConfigFactoryKeyHost): FactoryProvider {
  return {
    provide: factory.KEY || getConfigToken(uuid()),
    useFactory: factory,
    inject: []
  };
}
