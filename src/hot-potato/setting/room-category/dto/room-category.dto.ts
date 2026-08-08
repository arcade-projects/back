import { ArrayNotEmpty, IsArray, IsBoolean, IsNotEmpty, IsOptional, IsUUID } from "class-validator";
import { i18nValidationMessage } from "nestjs-i18n";

export class RoomCategoryDto {
    @IsUUID('4', { message: i18nValidationMessage('validation.IS_UUID') })
    @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY')})
    room_id!: string;

    @IsArray({ message: i18nValidationMessage('validation.IS_ARRAY') })
    @ArrayNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
    @IsUUID('4', { each: true, message: i18nValidationMessage('validation.IS_UUID') })
    category_ids!: string[];

    @IsBoolean({ message: i18nValidationMessage('validation.IS_BOOLEAN') })
    @IsOptional()
    activate?: boolean;
}