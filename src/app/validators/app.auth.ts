export const loginSchema: AjvSchema = {
  type: 'object',
  required: ['username', 'password'],
  additionalProperties: false,
  properties: {
    username: {
      type: 'string',
      minLength: 1,
      maxLength: 255,
    },
    password: {
      type: 'string',
      minLength: 1,
      maxLength: 255,
    },
  },
};

export const changePasswordSchema: AjvSchema = {
  type: 'object',
  required: ['oldPassword', 'newPassword'],
  additionalProperties: false,
  properties: {
    oldPassword: {
      type: 'string',
      minLength: 1,
      maxLength: 255,
    },
    newPassword: {
      type: 'string',
      minLength: 1,
      maxLength: 255,
    },
  },
};

export const registerSchema: AjvSchema = {
  type: 'object',
  required: ['fullName', 'phoneNumber', 'email', 'password'],
  additionalProperties: false,
  properties: {
    fullName: {
      type: 'string',
      minLength: 1,
      maxLength: 20,
    },
    phoneNumber: {
      type: ['string', 'null'],
      minLength: 1,
    },
    birthday: {
      type: 'string',
      minLength: 1,
    },
    gender: {
      type: 'number',
      maxLength: 1,
    },
    email: {
      type: 'string',
      pattern: '^(\\S+([\\.\\+-]?\\w+)*@\\w+([\\.-]?\\w+)*(\\.\\w{2,3})+)$',
    },
    password: {
      type: 'string',
      minLength: 1,
      maxLength: 255,
    },
  },
};
