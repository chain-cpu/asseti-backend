import { applyDecorators } from '@nestjs/common';
import { ApiExtraModels, ApiQuery, getSchemaPath } from '@nestjs/swagger';

/**
 * Apply filter[] for GET input param
 * @param {string} fieldName
 * @param {any} filterDto
 * @param {any} type
 * @constructor
 */
export function ApiFilterQuery(
  fieldName: string,
  filterDto: any,
  type: any = 'object',
) {
  return applyDecorators(
    ApiExtraModels(filterDto),
    ApiQuery({
      required: false,
      name: fieldName,
      style: 'deepObject',
      explode: true,
      type: type,
      schema: {
        $ref: getSchemaPath(filterDto),
      },
    }),
  );
}
