export const createCategorySchema: AjvSchema = {
  type: 'object',
  required: ['name'],
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
    image: {
      type: 'string',
      minLength: 0,
      maxLength: 255,
    },
  },
};

export const updateCategorySchema: AjvSchema = {
  type: 'object',
  required: ['id', 'name'],
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
    image: {
      type: 'string',
      minLength: 0,
      maxLength: 255,
    },
    id: {
      type: 'number',
    },
  },
};
