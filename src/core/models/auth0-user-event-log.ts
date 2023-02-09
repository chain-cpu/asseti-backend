export interface Auth0UserEventLog {
  _id: string;
  audience: string;
  client_id: string;
  client_name: string;
  connection: string;
  connection_id: string;
  date: string;
  description: string;
  details: object;
  hostname: string;
  ip: string;
  isMobile: boolean;
  location_info: LocationInfo;
  log_id: string;
  scope: string;
  strategy: string;
  strategy_type: string;
  type: string;
  user_agent: string;
  user_id: string;
  user_name: string;
}

export interface LocationInfo {
  city_name: string;
  continent_code: string;
  country_code: string;
  country_code3: string;
  country_name: string;
  latitude: number;
  longitude: number;
  time_zone: string;
}
