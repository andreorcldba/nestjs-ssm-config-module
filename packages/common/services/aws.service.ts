import { GetParametersCommand, SSMClient } from '@aws-sdk/client-ssm';
import { Logger } from '@nestjs/common';

export class AwsService {
  constructor(private readonly ssmClient: SSMClient) {}

  async getParameters(names: string[]): Promise<Record<string, string>> {
    try {
      const input = {
        Names: names,
        WithDecryption: true
      };

      const command = new GetParametersCommand(input);
      const response = await this.ssmClient.send(command);
      const { Parameters: parameters = [] } = response || {};

      return parameters.reduce((acc: Record<string, string>, cur) => {
        if (cur.Name && cur.Value) {
          acc[cur.Name] = cur.Value;
        }
        return acc;
      }, {});
    } catch (error) {
      Logger.error('Error fetching parameters from SSM', error);

      throw error;
    }
  }
}
