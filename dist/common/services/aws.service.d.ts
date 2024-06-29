import { SSMClient } from '@aws-sdk/client-ssm';
export declare class AwsService {
    private readonly ssmClient;
    constructor(ssmClient: SSMClient);
    getParameters(names: string[]): Promise<Record<string, string>>;
}
