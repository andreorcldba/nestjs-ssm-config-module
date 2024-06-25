import { PARTIAL_CUSTOM_CONFIGURATION_KEY } from '../constants/custom-config.module.constant';

/**
 * @publicApi
 */
export function getRegistrationToken(config: Record<string, any>) {
  return config[PARTIAL_CUSTOM_CONFIGURATION_KEY];
}
