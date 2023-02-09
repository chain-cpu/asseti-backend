import { Injectable } from '@nestjs/common';
import { QuestionDto } from '../models/question.dto';

const RISK_SCORE_SURVEY: QuestionDto[] = [
  {
    question: 'How much revenues do you have per month',
    type: 'number',
    name: 'mrr_value',
  },
  {
    question: 'How is it growing',
    type: 'number',
    name: 'mrr_growth_rate',
  },
  {
    question: 'How much do you spend every month',
    type: 'number',
    name: 'burn_rate',
  },
  {
    question: 'How many users do you have',
    type: 'number',
    name: 'customers_total',
  },
  {
    question: 'How is it growing',
    type: 'number',
    name: 'customers_growth_rate',
  },
  {
    question: 'What’s the percentage of paying users do you have',
    type: 'number',
    name: 'customers_paying_rate',
  },
  {
    question: 'How many customers do you lose every month',
    type: 'number',
    name: 'customers_churn_rate',
  },
  {
    question: 'What’s your customer acquisition cost (optional) ',
    type: 'number',
    name: 'cac_rate',
    optional: true,
  },
];

@Injectable()
export class SurveyService {
  public getBorrowerQuestions(): QuestionDto[] {
    return [
      {
        question: 'Let’s start with the beginning… What is your first name',
        type: 'text',
        name: 'firstName',
      },
      {
        question: 'What is your company name',
        type: 'text',
        name: 'companyName',
      },
      {
        question: '{firstName}, how old is {companyName}',
        options: [
          { name: '12', value: 12 },
          { name: '24', value: 24 },
          { name: '36', value: 36 },
          { name: '60', value: 60 },
        ],
        type: 'slider',
        name: 'companyAge',
      },
      {
        question: 'Where is {companyName} based',
        options: [
          { name: 'Europe', value: 'EU' },
          { name: 'United Kingdom', value: 'UK' },
          { name: 'Middle East and North Africa (MENA)', value: 'MENA' },
          { name: 'Asia', value: 'Asia' },
          { name: 'United States', value: 'US' },
          { name: 'Latin America', value: 'LATAM' },
          { name: 'Others', value: 'Others' },
        ],
        type: 'dropdown',
        name: 'location',
      },
      {
        question: 'Which industry group describes best {companyName} activity',
        options: [
          { name: 'Professional Services', value: 'Professional Services' },
          { name: 'Ag Tech', value: 'Ag Tech' },
          { name: 'AI & Big Data', value: 'AI & Big Data' },
          {
            name: 'Commerce, Sales & Shopping',
            value: 'Commerce, Sales & Shopping',
          },
          { name: 'Community & Lifestyle', value: 'Community & Lifestyle' },
          { name: 'Content & Media', value: 'Content & Media' },
          { name: 'Education Tech', value: 'Education Tech' },
          { name: 'Energy & Environment', value: 'Energy & Environment' },
          { name: 'Financial services', value: 'Financial services' },
          { name: 'Food & Beverage', value: 'Food & Beverage' },
          { name: 'Gaming & Sports', value: 'Gaming & Sports' },
          { name: 'Government', value: 'Government' },
          { name: 'Health Tech', value: 'Health Tech' },
          { name: 'IT infrastructure', value: 'IT infrastructure' },
          {
            name: 'Manufacturing / Industrial',
            value: 'Manufacturing / Industrial',
          },
          { name: 'Production', value: 'Production' },
          {
            name: 'Messaging & Telecommunications / Connectivity',
            value: 'Messaging & Telecommunications / Connectivity',
          },
          { name: 'Real Estatey', value: 'Real Estate' },
          { name: 'Transport & Mobility', value: 'Transport & Mobility' },
          { name: 'Travel & Tourism', value: 'Travel & Tourism' },
          { name: 'Others', value: 'Others' },
        ],
        type: 'checkbox',
        name: 'industryGroups',
      },
      {
        question: 'How many people (full-time) work for {companyName}',
        options: [
          { name: '10', value: 10 },
          { name: '50', value: 50 },
          { name: '100', value: 100 },
          { name: '250', value: 250 },
          { name: '500', value: 500 },
          { name: '1000', value: 1000 },
        ],
        type: 'slider',
        optional: true,
        name: 'peopleQuantity',
      },
      {
        question: 'What is {companyName} MRR',
        options: [
          { name: '25', value: 25 },
          { name: '50', value: 50 },
          { name: '75', value: 75 },
          { name: '100', value: 100 },
          { name: '250', value: 250 },
          { name: '500', value: 500 },
          { name: '1000000', value: 1000000 },
        ],
        type: 'slider',
        name: 'mrr',
      },
      {
        question: 'What is the debt to equity ratio',
        options: [
          { name: '0', value: 0 },
          { name: '10', value: 10 },
          { name: '20', value: 20 },
          { name: '30', value: 30 },
          { name: '40', value: 40 },
          { name: '50', value: 50 },
          { name: '60', value: 60 },
          { name: '70', value: 70 },
          { name: '80', value: 80 },
          { name: '90', value: 90 },
          { name: '100', value: 100 },
        ],
        type: 'slider',
        optional: true,
        name: 'debtRatio',
      },
      {
        question:
          'Now {firstName}, tell us a bit more about you… What is your role at {companyName}? (Box ticking)',
        options: [
          { name: 'CEO', value: 'CEO' },
          { name: 'Founder', value: 'Founder' },
          { name: 'CFO', value: 'CFO' },
          { name: 'CIO', value: 'CIO' },
          { name: 'CRO', value: 'CRO' },
          { name: 'CCO', value: 'CCO' },
          { name: 'Partner', value: 'Partner' },
          { name: 'Managing Partner', value: 'Managing Partner' },
          { name: 'Director', value: 'Director' },
          { name: 'Other', value: 'Other' },
        ],
        type: 'dropdown',
        name: 'role',
      },
      {
        question: 'Age',
        type: 'text',
        name: 'age',
      },
      {
        question: 'gender',
        options: [
          { name: 'Male', value: 'Male' },
          { name: 'Female', value: 'Female' },
          { name: 'Other', value: 'Other' },
        ],
        type: 'dropdown',
        name: 'gender',
      },
      {
        question: 'How many years have you been working at {companyName}',
        type: 'text',
        name: 'workingExperience',
      },
      {
        question:
          'Do you have authority* to enter into loan agreements on behalf of {companyName}',
        options: [
          { name: 'Yes', value: 'yes' },
          { name: 'No', value: 'no' },
        ],
        type: 'radio',
        name: 'isAuthority',
      },
    ];
  }

  public getLanderQuestions(): QuestionDto[] {
    return this.getBorrowerRiskScoreQuestions();
  }

  public getBorrowerRiskScoreQuestions(): QuestionDto[] {
    return RISK_SCORE_SURVEY;
  }
}
