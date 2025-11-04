export const validationMessages = {
  required: (field: string) => `The ${field} is required`,
  invalidFormat: (field: string) => `The ${field} format is invalid`,
  tooShort: (field: string, min: number) => `The ${field} must be at least ${min} characters long`,
  tooLong: (field: string, max: number) => `The ${field} must be at most ${max} characters long`,
  notNumeric: (field: string) => `The ${field} must be a number`,
  notInteger: (field: string) => `The ${field} must be an integer`,
  notBoolean: (field: string) => `The ${field} must be true or false`,
  notDate: (field: string) => `The ${field} must be a valid date`,
  invalidEmail: (field: string) => `The ${field} must be a valid email address`,
  minValue: (field: string, min: number) => `The ${field} must be at least ${min}`,
  maxValue: (field: string, max: number) => `The ${field} must be at most ${max}`,
  notInList: (field: string) => `The ${field} must be one of the allowed values`,
  duplicate: (field: string) => `Duplicate value for ${field}`,
  notFound: (field: string) => `${field} not found`,
  notString: (field: string) => `${field} must be a string`,
  notDecimal: (field: string) => `${field} must be a decimal number`
}
