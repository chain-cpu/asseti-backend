export type ApiConfigType = {
  /**
   * Get API key hashed value
   * @return {string}
   */
  getApiKeyHash(): string;
  /**
   * Get default http referer policy
   * @return {string[]}
   */
  getDefaultHttpRefererPolicy(): string[];
  /**
   * Get default records per page
   * @return {number}
   */
  getDefaultRecordsPerPage(): number;
  /**
   * Get default sort
   * @return { field: string; sort: string }
   */
  getDefaultSort(): { [x: string]: string };
  /**
   * Get api environment
   * @return {string}
   */
  getEnvironment(): string;
  /**
   * Get api http port
   * @return {string}
   */
  getHttpsPort(): number;
  /**
   * Get api name
   * @return {string}
   */
  getName(): string;
  /**
   * Get api version
   * @return {string}
   */
  getVersion(): string;

  /**
   * Is development environment
   * @return {boolean}
   */
  isDevelopment(): boolean;

  /**
   * Is local environment
   * @return {boolean}
   */
  isLocal(): boolean;

  /**
   * Is production environment
   * @return {boolean}
   */
  isProduction(): boolean;
};
