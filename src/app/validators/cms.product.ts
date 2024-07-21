export const createProductSchema: AjvSchema = {
  type: 'object',
  required: ['name', 'brandId', 'description', 'model', 'gallery'],
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
    brandId: {
      type: 'number',
      minimum: 1,
    },
    description: {
      type: 'object',
      properties: {
        contentEng: {
          type: 'string',
          minLength: 0,
          maxLength: 255,
        },
        contentVie: {
          type: 'string',
          minLength: 0,
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
    type: {
      type: ['null', 'string'],
      maxLength: 255,
    },
    amount: {
      type: ['null', 'number'],
    },
    price: {
      type: ['null', 'number'],
    },
    discount: {
      type: ['null', 'number'],
    },
    isHot: {
      type: ['null', 'boolean'],
    },
    gallery: {
      type: 'array',
      minItems: 1,
    },
  },
};

export const updateProductSchema: AjvSchema = {
  type: 'object',
  required: ['id', 'status', 'name', 'brandId', 'description', 'model', 'gallery'],
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
    brandId: {
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
    type: {
      type: ['null', 'string'],
      maxLength: 255,
    },
    amount: {
      type: ['null', 'number'],
    },
    price: {
      type: ['null', 'number'],
    },
    discount: {
      type: ['null', 'number'],
    },
    isHot: {
      type: ['null', 'boolean'],
    },
    gallery: {
      type: 'array',
      minItems: 1,
    },
  },
};
