import { applyDecorators, Type } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiExtraModels,
  ApiInternalServerErrorResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  getSchemaPath
} from '@nestjs/swagger';

export function ApiResult(
  dto: Type,
  modelName: string,
  operation: 'getAll' | 'getMany' | 'getOne' | 'create' | 'update' | 'delete'
) {
  const resOb = {
    schema: {
      properties: {
        status: {
          type: 'number'
        },
        data: {
          type: 'object',
          $ref: getSchemaPath(dto)
        },
        message: {
          type: 'string'
        }
      }
    }
  };

  if (operation === 'getAll' || operation === 'getMany')
    return applyDecorators(
      ApiOperation({ summary: `get a list of ${modelName}s` }),
      ApiExtraModels(dto),
      ApiOkResponse({
        description: 'Ok',
        schema: {
          properties: {
            status: {
              type: 'number'
            },
            data: { type: 'array', items: { $ref: getSchemaPath(dto) } },
            message: {
              type: 'string'
            }
          }
        }
      }),
      ApiInternalServerErrorResponse({ description: 'Something went wrong' })
    );

  if (operation === 'getOne') {
    return applyDecorators(
      ApiOperation({ summary: `get a ${modelName}` }),
      ApiExtraModels(dto),
      ApiOkResponse({ description: 'Ok', ...resOb }),
      ApiNotFoundResponse({ description: 'Not found' }),
      ApiInternalServerErrorResponse({ description: 'Something went wrong' })
    );
  }
  if (operation === 'create')
    return applyDecorators(
      ApiOperation({ summary: `create a ${modelName}` }),
      ApiCreatedResponse({ description: 'New data created', ...resOb }),
      ApiBadRequestResponse({ description: 'Bad Request' }),
      ApiInternalServerErrorResponse({ description: 'Something went wrong' })
    );

  if (operation === 'update')
    return applyDecorators(
      ApiOperation({ summary: `update a ${modelName} with a specific id` }),
      ApiOkResponse({ description: 'The data is updated', ...resOb }),
      ApiBadRequestResponse({ description: 'Bad Request' }),
      ApiInternalServerErrorResponse({ description: 'Something went wrong' })
    );

  if (operation === 'delete')
    return applyDecorators(
      ApiOperation({ summary: `delete a specific ${modelName}` }),
      ApiNoContentResponse({
        description: 'The data is deleted',
        schema: {
          properties: {
            status: {
              type: 'string'
            },
            data: {
              type: 'null'
            },
            message: {
              type: 'string'
            }
          }
        }
      }),
      ApiNotFoundResponse({ description: 'Not found' }),
      ApiInternalServerErrorResponse({ description: 'Something went wrong' })
    );
}
