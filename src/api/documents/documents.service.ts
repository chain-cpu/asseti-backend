import {
  BadRequestException,
  Injectable,
  StreamableFile,
} from '@nestjs/common';

import { Workbook } from 'exceljs';
import { Parser } from 'json2csv';
import { Account } from '../accounts/account.entity';
import { AccountService } from '../accounts/account.service';

@Injectable()
export class DocumentsService {
  constructor(private readonly accountService: AccountService) {}

  async generateAccountQuestionnaireCsv(accountId: string) {
    const account: Account = await this.accountService.findOne(accountId);

    if (account) {
      const data = JSON.parse(account.survey);
      const fields = Object.keys(data);
      const parser = new Parser({ fields });
      return parser.parse(data);
    } else {
      throw new BadRequestException('Account was not found');
    }
  }

  async generateAccountQuestionnaireXls(accountId: string) {
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Questionnaire');
    const account: Account = await this.accountService.findOne(accountId);

    if (account) {
      const data = JSON.parse(account.survey);
      const fields = Object.keys(data);
      worksheet.columns = fields.map((item) => ({
        header: item,
        key: item,
        width: 20,
      }));

      worksheet.addRow(data);
      const buffer = await workbook.xlsx.writeBuffer();
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      return new StreamableFile(buffer);
    } else {
      // return null;
      throw new BadRequestException('Account was not found');
    }
  }
}
