export const changeCoverSchema: AjvSchema = {
  type: 'array',
  items: {
    type: 'object',
    required: ['srcImage'],
    additionalProperties: true,
    properties: {
      srcImage: {
        type: 'string',
        maxLength: 255,
      },
    },
  },
};