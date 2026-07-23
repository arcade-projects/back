import { IsNotEmpty, IsString, MinLength } from "class-validator";
import { IsUnique } from "src/common/decorators/is-unique.decorator";
import { Category } from "../entities/category.entity";


export class CreateCategoryDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    @IsUnique(Category, 'title',
        {
            message: 'duplicate'
        }
    )
    title!: string;

}