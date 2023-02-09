import { Controller, Get, Query, Res } from '@nestjs/common';
import {
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { Response } from 'express';
import { DocumentsService } from './documents.service';
import { AccountDocumentDto, fileTypes } from './dto/account-document.dto';

@ApiTags('Documents')
@Controller('documents')
@ApiSecurity('API-KEY')
export class DocumentsController {
  constructor(private readonly service: DocumentsService) {}

  @ApiOperation({ summary: 'Download Account questionnaire info' })
  @ApiResponse({ status: 200, description: 'Download' })
  @ApiQuery({ name: 'accountId', type: 'string' })
  @Get('/questionnaire')
  async questionnaire(
    @Query() { accountId, fileType }: AccountDocumentDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<any> {
    if (Number(fileType) === Number(fileTypes.csv)) {
      res.set({
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="Questionnaire-${accountId}.csv"`,
      });
      return await this.service.generateAccountQuestionnaireCsv(accountId);
    }

    if (Number(fileType) === Number(fileTypes.xlsx)) {
      res.set({
        'Content-Type': 'text/xlsx',
        'Content-Disposition': `attachment; filename="Questionnaire-${accountId}.xlsx"`,
      });
      return await this.service.generateAccountQuestionnaireXls(accountId);
    }
  }
}
