import { BaseGenerator } from './base-generator';
/**
 * Resolver生成器
 */
export declare class ResolverGenerator extends BaseGenerator {
    generate(): string;
    private generateSearchConditions;
    private generateValidateFunctions;
    private generateValidationCalls;
    private generateBatchValidationCalls;
    private generateUpdateValidationCalls;
}
