export interface QuestionDto {
  name: string;
  optional?: boolean;
  options?: Option[];
  question: string;
  type: 'text' | 'dropdown' | 'checkbox' | 'slider' | 'radio' | 'number';
}

export interface Option {
  name: string;
  value: string | number;
}
