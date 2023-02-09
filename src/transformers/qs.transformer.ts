import { isDateString, IsDateString, isObject, isArray } from 'class-validator';
import {
  Between,
  ILike,
  In,
  IsNull,
  LessThan,
  LessThanOrEqual,
  MoreThan,
  MoreThanOrEqual,
  Not,
} from 'typeorm';
import {
  QUERY_FILTER_MODIFIER,
  QUERY_FILTER_VALUE,
} from '../constants/query-filter.constant';

export class QsTransformer {
  /**
   * Transform string from query
   * @param input
   */
  static from(input) {
    const collection = {};
    Object.keys(input).forEach((key) => {
      if (!isObject(input[key])) {
        const value = input[key];
        switch (value) {
          case QUERY_FILTER_VALUE.NULL:
            collection[key] = IsNull();
            break;
          case QUERY_FILTER_VALUE.NOT_NULL:
            collection[key] = Not(IsNull());
            break;
          default:
            if (isArray(value)) {
              collection[key] = In(value);
            } else if (typeof value === 'boolean') {
              collection[key] = value;
            } else if (value.indexOf(QUERY_FILTER_MODIFIER.DOUBLE_DOT) !== -1) {
              const range = value.split(QUERY_FILTER_MODIFIER.DOUBLE_DOT);
              if (IsDateString(range[0]) && isDateString(range[1])) {
                collection[key] = Between(
                  new Date(range[0]),
                  new Date(range[1]),
                );
              } else {
                collection[key] = Between(
                  parseInt(range[0]),
                  parseInt(range[1]),
                );
              }
            } else if (value.indexOf(QUERY_FILTER_MODIFIER.PERCENT) !== -1) {
              if (
                value.startsWith(QUERY_FILTER_MODIFIER.PERCENT) ||
                value.endsWith(QUERY_FILTER_MODIFIER.PERCENT) ||
                (value.startsWith(QUERY_FILTER_MODIFIER.PERCENT) &&
                  value.endsWith(QUERY_FILTER_MODIFIER.PERCENT))
              ) {
                collection[key] = ILike(value.trim());
              } else {
                collection[key] = value.trim();
              }
            } else if (
              value.indexOf(QUERY_FILTER_MODIFIER.GREATER_OR_EQUAL) !== -1
            ) {
              collection[key] = MoreThanOrEqual(value.trim());
            } else if (
              value.indexOf(QUERY_FILTER_MODIFIER.LESS_OR_EQUAL) !== -1
            ) {
              collection[key] = LessThanOrEqual(value.trim());
            } else if (value.indexOf(QUERY_FILTER_MODIFIER.GREATER) !== -1) {
              collection[key] = MoreThan(value.trim());
            } else if (value.indexOf(QUERY_FILTER_MODIFIER.LESS) !== -1) {
              collection[key] = LessThan(value.trim());
            } else {
              collection[key] = value.trim();
            }
        }
      } else {
        collection[key] = QsTransformer.from(input[key]);
      }
    });
    return collection;
  }
}
