import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class PipeDriveService {
  constructor(
    private readonly httpService: HttpService,
    private readonly config: ConfigService,
  ) {
    this.baseURL = this.config.get('PIPEDRIVE_COMPANY_URL');
    this.apiToken = this.config.get('PIPEDRIVE_API_TOKEN');
  }

  // PRIVATE VARS
  private baseURL: string;
  private apiToken: string;

  // PUBLIC
  async addPersonAsALead(name: string, email: string): Promise<any> {
    return this.addPerson(name, email)
      .then((personId) => {
        this.addLead(name, personId);
      })
      .catch((err) => {
        return Promise.reject(err);
      });
  }

  // PRIVATE
  private async addLead(name: string, toPersonId: number): Promise<any> {
    const addLeadURL = `${this.baseURL}v1/leads`;
    const addLeadData = {
      title: `${name} lead`,
      person_id: toPersonId,
    };
    const queryParams = { api_token: this.apiToken };

    return this.httpService.axiosRef.post(addLeadURL, addLeadData, {
      params: queryParams,
    });
  }

  private async addPerson(name: string, email: string): Promise<number> {
    const addLeadURL = `${this.baseURL}v1/persons`;
    const addLeadData = {
      name: name,
      email: email,
    };
    const queryParams = { api_token: this.apiToken };

    return this.httpService.axiosRef
      .post(addLeadURL, addLeadData, { params: queryParams })
      .then((res) => {
        const userId = res.data.data.id;
        return Promise.resolve(userId);
      });
  }
}
