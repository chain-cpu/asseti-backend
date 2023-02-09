export interface RiskScoreModel {
  average_order_value: AverageOrderValue[];
  cash_flow: unknown;
  company_name: string;
  customers: RiskScoreCustomer[];
  customers_paying: RiskScoreCustomerPaying[];
  default_probability: number;
  expenses: RiskScoreExpense[];
  incomes: RiskScoreIncome[];
  loan_maturity: string;
  loan_nominal_max: number;
  loan_nominal_model: number;
  loan_nominal_wacc: number;
  loan_rate: number;
  revenues_recurrent: RevenuesRecurrent[];
  score: string;
}

export interface RiskScoreCustomer {
  customers_total: number;
  start: string;
}

export interface RiskScoreCustomerPaying {
  customers_paying: number;
  start: string;
}

export interface RevenuesRecurrent {
  revenue: number;
  start: string;
}

export interface RiskScoreIncome {
  INCOME: number;
  START: string;
}

export interface RiskScoreExpense {
  expense: number;
  start: string;
}

export interface AverageOrderValue {
  average_order_value: number;
  start: string;
}
