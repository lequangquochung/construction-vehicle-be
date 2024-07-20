export const createBrandSchema: AjvSchema = {
  type: 'object',
  required: ['name', 'categoryId'],
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
    },
  },
};

export const updateBrandSchema: AjvSchema = {
  type: 'object',
  required: ['id', 'name', 'categoryId'],
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
    },
    id: {
      type: 'number',
    },
  },
};
