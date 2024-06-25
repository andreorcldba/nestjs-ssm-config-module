import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CUSTOM_CONFIGURATION_TOKEN, CUSTOM_CONFIG_SERVICE } from './constants/custom-config.module.constant';

/**
 * @publicApi
 */
@Global()
@Module({
  providers: [
    {
      provide: CUSTOM_CONFIGURATION_TOKEN,
      useFactory: () => ({})
    },
    {
      provide: CUSTOM_CONFIG_SERVICE,
      useClass: ConfigService
    }
  ],
  exports: [CUSTOM_CONFIGURATION_TOKEN, CUSTOM_CONFIG_SERVICE]
})
export class ConfigHostModule {}
