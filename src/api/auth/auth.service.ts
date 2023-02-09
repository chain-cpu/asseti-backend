import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthenticationClient } from 'auth0';

@Injectable()
export class AuthService {
  private readonly auth: AuthenticationClient;

  constructor(private config: ConfigService) {
    this.auth = new AuthenticationClient({
      domain: this.config.get('AUTH0_DOMAIN'),
      clientId: this.config.get('AUTH0_CLIENT_ID'),
      clientSecret: this.config.get('AUTH0_CLIENT_SECRET'),
    });
  }

  async getProfile(token: string): Promise<any> {
    return this.auth.getProfile(token.split(' ')[1]);
  }
}
