"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var ConfigModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigModule = void 0;
require("reflect-metadata");
const client_ssm_1 = require("@aws-sdk/client-ssm");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const config_host_module_1 = require("./config-host.module");
const custom_config_module_constant_1 = require("./constants/custom-config.module.constant");
const http_enum_1 = require("./enums/http.enum");
const ssm_decorator_1 = require("packages/common/decorators/ssm.decorator");
const aws_service_1 = require("packages/common/services/aws.service");
const create_config_factory_util_1 = require("./utils/create-config-factory.util");
const get_registration_token_util_1 = require("./utils/get-registration-token.util");
const merge_configs_util_1 = require("./utils/merge-configs.util");
let ConfigModule = ConfigModule_1 = class ConfigModule {
    static getErrorMessages(errors) {
        let messages = [];
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
    static async validateInstance(instanceClass, envs, validatorOptions) {
        const instance = (0, class_transformer_1.plainToClass)(instanceClass, envs);
        const errors = await (0, class_validator_1.validate)(instance, validatorOptions);
        if (errors.length > 0) {
            throw new Error(JSON.stringify({
                statusCode: common_1.HttpStatus.BAD_REQUEST,
                messages: this.getErrorMessages(errors),
                error: http_enum_1.HttpText.BAD_REQUEST
            }));
        }
    }
    static chunkArray(array, chunkSize) {
        const results = [];
        for (let i = 0; i < array.length; i += chunkSize) {
            results.push(array.slice(i, i + chunkSize));
        }
        return results;
    }
    static async fetchAndSetEnvVariables(keys) {
        const awsService = new aws_service_1.AwsService(new client_ssm_1.SSMClient());
        const awsEnvironments = await awsService.getParameters(keys);
        Object.keys(awsEnvironments).forEach((key) => {
            process.env[key] = awsEnvironments[key];
        });
    }
    static async setEnvFromSSM(instanceClass) {
        const instance = (0, class_transformer_1.plainToClass)(instanceClass, process.env);
        const ssmColumns = (0, ssm_decorator_1.getSSMColumn)(instance) || [];
        const chunkedKeys = this.chunkArray(ssmColumns, 10).map((chunk) => chunk.map((column) => column.propertyKey));
        for (const keys of chunkedKeys) {
            await this.fetchAndSetEnvVariables(keys);
        }
    }
    static async forRoot(options) {
        await this.setEnvFromSSM(options.validationClass);
        let config = process.env;
        this.validateInstance(options.validationClass, config, options.validatorOptions);
        const isConfigToLoad = options.load?.length;
        const providers = (options.load || [])
            .map((factory) => (0, create_config_factory_util_1.createConfigProvider)(factory))
            .filter((item) => item);
        const configProviderTokens = providers.map((item) => item.provide);
        const configServiceProvider = {
            provide: config_1.ConfigService,
            useFactory: (configService) => {
                if (options.cache) {
                    configService.isCacheEnabled = true;
                }
                return configService;
            },
            inject: [custom_config_module_constant_1.CUSTOM_CONFIG_SERVICE, ...configProviderTokens]
        };
        providers.push(configServiceProvider);
        console.log('123');
        return {
            module: ConfigModule_1,
            global: options.isGlobal,
            providers: isConfigToLoad
                ? [
                    ...providers,
                    {
                        provide: custom_config_module_constant_1.CUSTOM_CONFIGURATION_LOADER,
                        useFactory: (host, ...configurations) => {
                            configurations.forEach((item, index) => this.mergePartial(host, item, providers[index]));
                        },
                        inject: [custom_config_module_constant_1.CUSTOM_CONFIGURATION_TOKEN, ...configProviderTokens]
                    }
                ]
                : providers,
            exports: [config_1.ConfigService, ...configProviderTokens]
        };
    }
    static mergePartial(host, item, provider) {
        const factoryRef = provider.useFactory;
        const token = (0, get_registration_token_util_1.getRegistrationToken)(factoryRef);
        (0, merge_configs_util_1.mergeConfigObject)(host, item, token);
    }
};
exports.ConfigModule = ConfigModule;
exports.ConfigModule = ConfigModule = ConfigModule_1 = __decorate([
    (0, common_1.Module)({
        imports: [config_host_module_1.ConfigHostModule],
        providers: [
            {
                provide: config_1.ConfigService,
                useExisting: custom_config_module_constant_1.CUSTOM_CONFIG_SERVICE
            }
        ],
        exports: [config_host_module_1.ConfigHostModule, config_1.ConfigService]
    })
], ConfigModule);
