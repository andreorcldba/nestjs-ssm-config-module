"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AwsService = void 0;
const client_ssm_1 = require("@aws-sdk/client-ssm");
const common_1 = require("@nestjs/common");
class AwsService {
    constructor(ssmClient) {
        this.ssmClient = ssmClient;
    }
    async getParameters(names) {
        try {
            const input = {
                Names: names,
                WithDecryption: true
            };
            const command = new client_ssm_1.GetParametersCommand(input);
            const response = await this.ssmClient.send(command);
            const { Parameters: parameters = [] } = response || {};
            return parameters.reduce((acc, cur) => {
                if (cur.Name && cur.Value) {
                    acc[cur.Name] = cur.Value;
                }
                return acc;
            }, {});
        }
        catch (error) {
            common_1.Logger.error('Error fetching parameters from SSM', error);
            throw error;
        }
    }
}
exports.AwsService = AwsService;
