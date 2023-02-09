import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import apiConfig from '../configs/api.config';
import { QueryTypeEnum } from '../enums/query-type.enum';
import { SortEnum } from '../enums/sort.enum';
import { toNumber } from '../transformers/number.transformer';
import { QsTransformer } from '../transformers/qs.transformer';

@Injectable()
export class QueryFilterPipe implements PipeTransform {
  /**
   * Query string transformation
   * @param {any} value
   * @param {ArgumentMetadata} metadata
   */
  transform(value: any, metadata: ArgumentMetadata) {
    if (metadata.type !== 'query') return value;
    switch (metadata.data) {
      case QueryTypeEnum.LIMIT:
        return toNumber(value, {
          default: apiConfig().getDefaultRecordsPerPage(),
          min: 1,
        });
      case QueryTypeEnum.OFFSET:
        return toNumber(value, {
          default: 0,
        });
      case QueryTypeEnum.SORT: {
        let transformed: any = {};
        for (const key in value) {
          transformed[key] = !Object.values(SortEnum).includes(
            value[key].toUpperCase(),
          )
            ? SortEnum.ASC
            : value[key].toUpperCase();
        }
        transformed =
          Object.keys(transformed).length === 0
            ? apiConfig().getDefaultSort()
            : transformed;
        return transformed;
      }
      case QueryTypeEnum.FILTER: {
        let transformed: any = {};
        if (!value) return transformed;
        transformed = QsTransformer.from(value);
        return transformed;
      }
      default:
        return value;
    }
  }
}
