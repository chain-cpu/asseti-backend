import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ManagementClient } from 'auth0';
import { Auth0Role } from '../models/auth0-role';
import { Auth0UserModel } from '../models/auth0-user';
import { Auth0UserEventLog } from '../models/auth0-user-event-log';

@Injectable()
export class Auth0ManagementService {
  private readonly management: ManagementClient;

  constructor(private config: ConfigService) {
    this.management = new ManagementClient({
      domain: this.config.get('AUTH0_DOMAIN'),
      clientId: this.config.get('AUTH0_API_CLIENT_ID'),
      clientSecret: this.config.get('AUTH0_API_CLIENT_SECRET'),
      scope: 'read:logs read:logs_users',
      audience: `${this.config.get('AUTH0_ISSUER_URL')}api/v2/`,
      tokenProvider: {
        enableCache: true,
        cacheTTLInSeconds: 10,
      },
    });
  }

  async getAuditLogs(userId: string): Promise<Auth0UserEventLog[]> {
    // todo add pagination
    const params = {
      id: userId,
      page: 0,
      per_page: 50,
      sort: 'date:-1',
      include_totals: true,
    };

    return await this.management.users.logs(params);
  }

  async getUser(id: string): Promise<Auth0UserModel> {
    return await this.management.getUser({ id });
  }

  async updateUser(id: string, data): Promise<any> {
    return await this.management.updateUser({ id }, data);
  }

  async getUserRoles(id: string): Promise<Auth0Role[]> {
    return await this.management.getUserRoles({ id });
  }

  async sendEmailVerification(id: string): Promise<any> {
    return await this.management.sendEmailVerification({ user_id: id });
  }
}
