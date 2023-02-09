import { registerAs } from '@nestjs/config';
import * as psjon from './../../package.json';
import { ApiConfigType } from './types/api.config.type';
import { EnvironmentEnum } from '../enums/environment.enum';
import { SortEnum } from '../enums/sort.enum';
import { getEnv } from '../utils/get-env.variable.util';

export default registerAs(
  'api',
  (): ApiConfigType => ({
    /**
     * Get api name
     * @return {string}
     */
    getName: (): string => psjon.name,
    /**
     * Get api version
     * @return {string}
     */
    getVersion: (): string => psjon.version,
    /**
     * Get api environment
     * @return {string}
     */
    getEnvironment: (): string => getEnv('NODE_ENV', true),
    /**
     * Get api http port
     * @return {string}
     */
    getHttpsPort: (): number => parseInt(getEnv('HTTP_PORT', false)) || 3000,
    /**
     * Get API key hashed value
     * @return {string}
     */
    getApiKeyHash: (): string => getEnv('API_KEY_HASH', true),
    /**
     * Is local environment
     * @return {boolean}
     */
    isLocal: (): boolean =>
      getEnv('NODE_ENV', false) === EnvironmentEnum.LOCALHOST,
    /**
     * Get api version
     * @return {string}
     */
    isDevelopment: (): boolean =>
      getEnv('NODE_ENV', false) === EnvironmentEnum.DEVELOPMENT,
    /**
     * Is production environment
     * @return {boolean}
     */
    isProduction: (): boolean =>
      getEnv('NODE_ENV', false) === EnvironmentEnum.PRODUCTION,

    getDefaultHttpRefererPolicy: (): string[] => {
      const httpReferer: string | null =
        getEnv('DEFAULT_HTTP_REFERER_POLICY', false) || null;
      return httpReferer !== null ? httpReferer.split(',') : [];
    },

    /**
     * Get default records per page
     * @return {number}
     */
    getDefaultRecordsPerPage: (): number =>
      parseInt(getEnv('DEFAULT_RECORDS_PER_PAGE', false)) || 10,

    /**
     * Get default sort
     * @return { field: string; sort: string }
     */
    getDefaultSort: (): { [x: string]: string } => {
      const sort = getEnv('DEFAULT_RECORDS_SORT', false);
      if (sort) {
        const sortIdx = sort.split(':');
        return {
          [sortIdx[0]]: sortIdx[1],
        };
      }
      return {
        createdAt: SortEnum.DESC,
      };
    },
  }),
);
