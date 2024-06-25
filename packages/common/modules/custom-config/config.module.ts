import 'reflect-metadata';
import { SSMClient } from '@aws-sdk/client-ssm';
import { DynamicModule, HttpStatus, Module } from '@nestjs/common';
import { FactoryProvider } from '@nestjs/common/interfaces';
import { ConfigFactory, ConfigFactoryKeyHost, ConfigService } from '@nestjs/config';
import { ValidationError, ValidatorOptions, validate } from 'class-validator';
import { mergeConfigObject } from './utils/merge-configs.util';
import { ConfigHostModule } from './config-host.module';
import { createConfigProvider } from './utils/create-config-factory.util';
import { getRegistrationToken } from './utils/get-registration-token.util';
import { ICustomConfigModuleOptions } from './interface/config.module.interface';
import { AwsService } from '../../services/aws.service';
import { ClassConstructor, plainToClass } from 'class-transformer';
import { HttpText } from './enums/http.enum';
import { getSSMColumn } from '../../decorators/ssm.decorator';
import {
  CUSTOM_CONFIGURATION_LOADER,
  CUSTOM_CONFIGURATION_TOKEN,
  CUSTOM_CONFIG_SERVICE
} from './constants/custom-config.module.constant';

/**
 * @publicApi
 */
@Module({
  imports: [ConfigHostModule],
  providers: [
    {
      provide: ConfigService,
      useExisting: CUSTOM_CONFIG_SERVICE
    }
  ],
  exports: [ConfigHostModule, ConfigService]
})
export class ConfigModule {
  private static getErrorMessages(errors: ValidationError[]): string[] {
    let messages: string[] = [];

    errors.forEach((error) => {
      if (error.children && error.children.length > 0) {
        const childrenError = this.getErrorMessages(error.children);

        messages = [...messages, ...childrenError.map((children) => `${error.property}.${children}`)];
      }

      if (error?.constraints) {
        messages = [...messages, ...Object.values(error.constraints)];
      }
    });

    messages = [...new Set(messages)];

    return messages;
  }

  private static async validateInstance<T>(
    instanceClass: ClassConstructor<T>,
    envs: NodeJS.ProcessEnv,
    validatorOptions?: ValidatorOptions
  ) {
    const instance = plainToClass(instanceClass, envs);

    const errors = await validate(instance as object, validatorOptions);

    if (errors.length > 0) {
      throw new Error(
        JSON.stringify({
          statusCode: HttpStatus.BAD_REQUEST,
          messages: this.getErrorMessages(errors),
          error: HttpText.BAD_REQUEST
        })
      );
    }
  }

  // Função utilitária para dividir um array em sub-arrays de tamanho máximo especificado
  private static chunkArray<T>(array: T[], chunkSize: number): T[][] {
    const results: T[][] = [];

    for (let i = 0; i < array.length; i += chunkSize) {
      results.push(array.slice(i, i + chunkSize));
    }
    return results;
  }

  private static async fetchAndSetEnvVariables(keys: string[]) {
    const awsService = new AwsService(new SSMClient());
    const awsEnvironments = await awsService.getParameters(keys);

    Object.keys(awsEnvironments).forEach((key) => {
      process.env[key] = awsEnvironments[key];
    });
  }

  private static async setEnvFromSSM<T>(instanceClass: new () => T): Promise<void> {
    const instance = plainToClass(instanceClass, process.env);
    const ssmColumns = getSSMColumn(instance) || [];
    const chunkedKeys = this.chunkArray(ssmColumns, 10).map((chunk) => chunk.map((column) => column.propertyKey));

    for (const keys of chunkedKeys) {
      await this.fetchAndSetEnvVariables(keys);
    }
  }

  /**
   * Loads process environment variables depending on the "ignoreEnvFile" flag and "envFilePath" value.
   * Also, registers custom configurations globally.
   * @param options
   */
  static async forRoot<T>(options: ICustomConfigModuleOptions<T>): Promise<DynamicModule> {
    await this.setEnvFromSSM(options.validationClass);
    let config = process.env;

    this.validateInstance(options.validationClass, config, options.validatorOptions);

    const isConfigToLoad = options.load?.length;
    const providers = (options.load || [])
      .map((factory) => createConfigProvider(factory as ConfigFactory & ConfigFactoryKeyHost))
      .filter((item) => item) as FactoryProvider[];

    const configProviderTokens = providers.map((item) => item.provide);

    const configServiceProvider = {
      provide: ConfigService,
      useFactory: (configService: ConfigService) => {
        if (options.cache) {
          (configService as any).isCacheEnabled = true;
        }
        return configService;
      },
      inject: [CUSTOM_CONFIG_SERVICE, ...configProviderTokens]
    };

    providers.push(configServiceProvider);

    console.log('123');

    return {
      module: ConfigModule,
      global: options.isGlobal,
      providers: isConfigToLoad
        ? [
            ...providers,
            {
              provide: CUSTOM_CONFIGURATION_LOADER,
              useFactory: (host: Record<string, any>, ...configurations: Record<string, any>[]) => {
                configurations.forEach((item, index) => this.mergePartial(host, item, providers[index]));
              },
              inject: [CUSTOM_CONFIGURATION_TOKEN, ...configProviderTokens]
            }
          ]
        : providers,
      exports: [ConfigService, ...configProviderTokens]
    };
  }

  private static mergePartial(host: Record<string, any>, item: Record<string, any>, provider: FactoryProvider) {
    const factoryRef = provider.useFactory;
    const token = getRegistrationToken(factoryRef);
    mergeConfigObject(host, item, token);
  }
}
