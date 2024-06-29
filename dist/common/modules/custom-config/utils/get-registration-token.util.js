"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRegistrationToken = void 0;
const custom_config_module_constant_1 = require("../constants/custom-config.module.constant");
function getRegistrationToken(config) {
    return config[custom_config_module_constant_1.PARTIAL_CUSTOM_CONFIGURATION_KEY];
}
exports.getRegistrationToken = getRegistrationToken;
