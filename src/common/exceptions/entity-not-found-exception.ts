export interface IEntityNotFoundException {
  fieldName: string;
  field: string;
}
export class EntityNotFoundException extends Error {
  readonly statusCode = 404;
  readonly modelName: string;
  readonly fields: IEntityNotFoundException[];

  constructor(modelName: string, fields: IEntityNotFoundException[]) {
    super(`Entidade ${modelName} não encontrado`);
    this.modelName = modelName;
    this.fields = fields;
  }
}
