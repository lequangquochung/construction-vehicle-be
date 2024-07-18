export const createQuestionSchema: AjvSchema = {
  type: 'object',
  required: ['phoneNumber', 'fullName', 'content', 'titleId'],
  additionalProperties: false,
  properties: {
    email: {
      type: ['null', 'string'],
      minLength: 0,
      maxLength: 255,
    },
    phoneNumber: {
      type: 'string',
      minLength: 1,
      maxLength: 255,
    },
    fullName: {
      type: 'string',
      minLength: 1,
      maxLength: 255,
    },
    content: {
      type: 'string',
      minLength: 1,
      maxLength: 255,
    },
    titleId: {
      type: 'number',
      minimum: 0,
    },
  },
};
