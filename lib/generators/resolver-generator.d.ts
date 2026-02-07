import { BaseGenerator } from "./base-generator";
/**
 * Resolver生成器
 */
export declare class ResolverGenerator extends BaseGenerator {
    private getQuotedTableName;
    generate(): string;
    private generateSearchConditions;
    private generateNewValidationCalls;
    private generateBatchValidation;
    private generateUpdateValidation;
    private generateUpdateValues;
    private generateBatchReturnObject;
    private generateBatchInsertValues;
    private generateDataLoaderSearchLogic;
    private generateNewRecordObject;
}
