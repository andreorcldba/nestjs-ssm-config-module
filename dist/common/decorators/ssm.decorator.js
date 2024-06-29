"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsSSM = exports.setSSMColumn = exports.getSSMColumn = void 0;
const ssm_decorator_constant_1 = require("../constants/ssm.decorator.constant");
function getSSMColumn(target) {
    return Reflect.getMetadata(ssm_decorator_constant_1.IS_SSM_KEY, target);
}
exports.getSSMColumn = getSSMColumn;
function setSSMColumn(target, columns) {
    Reflect.defineMetadata(ssm_decorator_constant_1.IS_SSM_KEY, columns, target);
}
exports.setSSMColumn = setSSMColumn;
function IsSSM() {
    return (target, propertyKey) => {
        let columns = getSSMColumn(target) || [];
        columns.push({ propertyKey });
        setSSMColumn(target, columns);
    };
}
exports.IsSSM = IsSSM;
