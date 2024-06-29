"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSSMColumn = getSSMColumn;
exports.setSSMColumn = setSSMColumn;
exports.IsSSM = IsSSM;
const ssm_decorator_constant_1 = require("../constants/ssm.decorator.constant");
function getSSMColumn(target) {
    return Reflect.getMetadata(ssm_decorator_constant_1.IS_SSM_KEY, target);
}
function setSSMColumn(target, columns) {
    Reflect.defineMetadata(ssm_decorator_constant_1.IS_SSM_KEY, columns, target);
}
function IsSSM() {
    return (target, propertyKey) => {
        let columns = getSSMColumn(target) || [];
        columns.push({ propertyKey });
        setSSMColumn(target, columns);
    };
}
