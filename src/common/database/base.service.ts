import { DataSource, EntityManager } from "typeorm";


export abstract class BaseService {
    constructor(private readonly dataSource: DataSource) {}

    async runInTransaction<T>(
        work: (entityManager: EntityManager) => Promise<T>
    ): Promise<T> {
        const queryRunner = this.dataSource.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const result = await work(queryRunner.manager);

            await queryRunner.commitTransaction();

            return result;

        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }

        await queryRunner.commitTransaction();
    }
}