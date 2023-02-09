import { registerAs } from '@nestjs/config';
import { CorsConfigType } from './types/cors.config.type';
import { getEnv } from '../utils/get-env.variable.util';

export default registerAs(
  'cors',
  (): CorsConfigType => ({
    /**
     * Get CORS allowed headers
     * @return string
     */
    getAllowedHeaders: (): string => getEnv('CORS_ALLOWED_HEADERS', true),

    /**
     * Get CORS allowed methods
     * @return string
     */
    getAllowedMethods: (): string => getEnv('CORS_ALLOWED_METHODS', true),

    /**
     * Get CORS allowed domains
     * @return string[] | string
     */
    getAllowedOrigins: (): string[] | string => {
      let origins: string[] | string = getEnv('CORS_ALLOWED_DOMAINS', true);
      if ('*' !== origins) {
        origins = origins.split(',');
      }
      return origins;
    },

    /**
     * Get CORS exposed headers
     * @return string
     */
    getExposedHeaders: (): string => getEnv('CORS_EXPOSED_HEADERS', true),

    /**
     * Is credentials required
     * @return boolean
     */
    requireCredentials: (): boolean =>
      getEnv('CORS_CREDENTIALS', true) === 'true',
  }),
);
