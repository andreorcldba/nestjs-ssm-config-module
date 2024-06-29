"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createConfigProvider = createConfigProvider;
const uuid_1 = require("uuid");
const config_1 = require("@nestjs/config");
function createConfigProvider(factory) {
    return {
        provide: factory.KEY || (0, config_1.getConfigToken)((0, uuid_1.v4)()),
        useFactory: factory,
        inject: []
    };
}
