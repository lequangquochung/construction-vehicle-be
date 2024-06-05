export const createCategorySchema: AjvSchema = {
  type: 'object',
  required: ['nameEng', 'nameVie', 'image'],
  additionalProperties: false,
  properties: {
    nameEng: {
      type: 'string',
      minLength: 1,
      maxLength: 255,
    },
    nameVie: {
      type: 'string',
      minLength: 1,
      maxLength: 255,
    },
    image: {
      type: 'string',
      minLength: 1,
      maxLength: 255,
    },
  },
};

export const updateCategorySchema: AjvSchema = {
  type: 'object',
  required: ['id', 'nameEng', 'nameVie', 'image'],
  additionalProperties: false,
  properties: {
    nameEng: {
      type: 'string',
      minLength: 1,
      maxLength: 255,
    },
    nameVie: {
      type: 'string',
      minLength: 1,
      maxLength: 255,
    },
    image: {
      type: 'string',
      minLength: 1,
      maxLength: 255,
    },
    id: {
      type: 'number',
    },
  },
};
