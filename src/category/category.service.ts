import { Injectable } from '@nestjs/common';

@Injectable()
export class CategoryService {
    
    fetchMany() {
        return 'some categoriesss';
    }

    fetchOneById() {
        return 'one category';
    }

    create() {
        return 'category created';
    }

    update() {
        return 'category updated';
    }

    delete() {
        return 'category deleted';
    }
}
