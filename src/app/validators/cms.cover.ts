export const changeCoverSchema: AjvSchema = {
  type: 'object',
  required: ['srcImages'],
  additionalProperties: false,
  properties: {
    srcImages: {
      type: 'array',
      items: {
        type: 'string',
        maxLength: 255,
      },
    },
  },
};