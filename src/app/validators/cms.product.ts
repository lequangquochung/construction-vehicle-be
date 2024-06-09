export const createProductSchema: AjvSchema = {
  type: 'object',
  required: ['name', 'categoryId', 'description', 'model', 'gallery'],
  additionalProperties: false,
  properties: {
    name: {
      type: 'object',
      properties: {
        contentEng: {
          type: 'string',
          minLength: 1,
          maxLength: 255,
        },
        contentVie: {
          type: 'string',
          minLength: 1,
          maxLength: 255,
        },
      },
    },
    categoryId: {
      type: 'number',
      minimum: 1,
    },
    description: {
      type: 'object',
      properties: {
        contentEng: {
          type: 'string',
          minLength: 1,
          maxLength: 255,
        },
        contentVie: {
          type: 'string',
          minLength: 1,
          maxLength: 255,
        },
      },
    },
    model: {
      type: 'string',
      minLength: 1,
      maxLength: 255,
    },
    contact: {
      type: 'string',
      maxLength: 255,
    },
    amount: {
      type: ['null', 'number'],
    },
    price: {
      type: ['null', 'number'],
    },
    gallery: {
      type: 'array',
      minItems: 1,
    },
  },
};

export const updateProductSchema: AjvSchema = {
  type: 'object',
  required: ['id', 'status', 'name', 'categoryId', 'description', 'model', 'gallery'],
  additionalProperties: false,
  properties: {
    id: {
      type: 'number',
      minimum: 1,
    },
    status: {
      type: 'number',
      maximum: 1,
      minimum: 0,
    },
    name: {
      type: 'object',
      properties: {
        contentEng: {
          type: 'string',
          minLength: 1,
          maxLength: 255,
        },
        contentVie: {
          type: 'string',
          minLength: 1,
          maxLength: 255,
        },
      },
    },
    categoryId: {
      type: 'number',
      minimum: 1,
    },
    description: {
      type: 'object',
      properties: {
        contentEng: {
          type: 'string',
          minLength: 1,
          maxLength: 255,
        },
        contentVie: {
          type: 'string',
          minLength: 1,
          maxLength: 255,
        },
      },
    },
    model: {
      type: 'string',
      minLength: 1,
      maxLength: 255,
    },
    contact: {
      type: 'string',
      maxLength: 255,
    },
    amount: {
      type: ['null', 'number'],
    },
    price: {
      type: ['null', 'number'],
    },
    gallery: {
      type: 'array',
      minItems: 1,
    },
  },
};

