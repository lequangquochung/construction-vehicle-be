export const changeCoverSchema: AjvSchema = {
  type: 'object',
  required: ['srcImages'],
  additionalProperties: false,
  properties: {
    srcImages: {
      type: 'array',
      minItems: 1,
      items: {
        type: 'string',
        maxLength: 255,
      },
    },
  },
};