export const createOrderSchema: AjvSchema = {
  type: 'object',
  required: ['email', 'phoneNumber', 'details'],
  additionalProperties: false,
  properties: {
    userId: {
      type: ['null', 'number'],
      minimum: 1,
    },
    email: {
      type: 'string',
      minLength: 1,
      maxLength: 255,
    },
    phoneNumber: {
      type: 'string',
      minLength: 1,
      maxLength: 255,
    },
    details: {
      type: 'array',
      minItems: 1,
      items: {
        type: 'object',
        required: ['productId', 'amount'],
        properties: {
          productId: {
            type: 'number',
            minimum: 1,
          },
          amount: {
            type: 'number',
            minimum: 1,
          },
        },
      },
    },
  },
};

export const updateOrderSchema: AjvSchema = {
  type: 'object',
  required: ['id', 'status', 'email', 'phoneNumber', 'details'],
  additionalProperties: false,
  properties: {
    id: {
      type: 'number',
    },
    status: {
      type: 'string',
      minLength: 1,
      maxLength: 255,
    },
    userId: {
      type: 'number',
      minimum: 1,
    },
    email: {
      type: 'string',
      minLength: 1,
      maxLength: 255,
    },
    phoneNumber: {
      type: 'string',
      minLength: 1,
      maxLength: 255,
    },
    details: {
      type: 'array',
      minItems: 1,
      items: {
        type: 'object',
        required: ['productId', 'amount'],
        properties: {
          productId: {
            type: 'number',
            minimum: 1,
          },
          amount: {
            type: 'number',
            minimum: 1,
          },
        },
      },
    },
  },
};
