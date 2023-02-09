import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SES } from 'aws-sdk';
import { createTransport, Transporter } from 'nodemailer';
import { getText, getHtml, getSubject } from '../../configs/email.config';

@Injectable()
export class EmailService {
  private readonly transporter: Transporter;
  constructor(private config: ConfigService) {
    const host = config.get('MAIL_HOST');
    const port = config.get('MAIL_PORT');

    const useSes = config.get('AWS_SES') === 'true';
    const accessKey = config.get('AWS_ACCESS_KEY_ID');
    const secretKey = config.get('AWS_SECRET_ACCESS_KEY');
    const region = config.get('AWS_REGION');
    this.transporter = useSes
      ? createTransport({
          SES: new SES({
            accessKeyId: accessKey,
            secretAccessKey: secretKey,
            region: region,
            apiVersion: '2010-12-01',
          }),
        })
      : createTransport({ host, port });
  }

  async sendInvite(email: string, link: string, creatorName: string) {
    const message = {
      from: this.config.get('MAIL_FROM'),
      to: email,
      subject: getSubject(creatorName),
      text: getText(creatorName, link),
      html: getHtml(creatorName, link),
    };
    try {
      const result = await this.transporter.sendMail(message);
      // eslint-disable-next-line no-console
      console.log('**** result sent', result);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log('**** send email error', e);
    }
  }
}
