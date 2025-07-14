export const changeCoverShema: AjvSchema = {
    type: 'object',
    required: ['srcImage'],
    additionalProperties: true,
    properties: {
        srcImage: {
        type: 'string',
        maxLength: 255,
      },
    },
  };