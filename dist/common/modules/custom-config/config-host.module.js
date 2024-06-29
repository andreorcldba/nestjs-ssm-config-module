"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigHostModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const custom_config_module_constant_1 = require("./constants/custom-config.module.constant");
let ConfigHostModule = class ConfigHostModule {
};
exports.ConfigHostModule = ConfigHostModule;
exports.ConfigHostModule = ConfigHostModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        providers: [
            {
                provide: custom_config_module_constant_1.CUSTOM_CONFIGURATION_TOKEN,
                useFactory: () => ({})
            },
            {
                provide: custom_config_module_constant_1.CUSTOM_CONFIG_SERVICE,
                useClass: config_1.ConfigService
            }
        ],
        exports: [custom_config_module_constant_1.CUSTOM_CONFIGURATION_TOKEN, custom_config_module_constant_1.CUSTOM_CONFIG_SERVICE]
    })
], ConfigHostModule);
