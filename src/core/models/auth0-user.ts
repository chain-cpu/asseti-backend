export interface Auth0UserModel {
  created_at: string;
  email: string;
  email_verified: boolean;
  identities: Auth0UserIdentity[];
  last_ip: string;
  last_login: string;
  logins_count: string;
  name: string;
  nickname: string;
  picture: string;
  updated_at: string;
  user_id: string;
}

export interface Auth0UserIdentity {
  connection: string;
  isSocial: boolean;
  provider: string;
  user_id: string;
}
