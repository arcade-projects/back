import { registerDecorator, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@ValidatorConstraint({ async: true })
@Injectable()
export class IsUniqueConstraint implements ValidatorConstraintInterface {
  constructor(private readonly dataSource: DataSource) {}

  async validate(value: any, args: ValidationArguments) {
    const [entityClass, column] = args.constraints;
    const repository = this.dataSource.getRepository(entityClass);
    
    const record = await repository.findOneBy({ [column]: value });
    return !record;
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} already exists!`;
  }
}

export function IsUnique(entityClass: Function, column: string, validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [entityClass, column],
      validator: IsUniqueConstraint,
    });
  };
}