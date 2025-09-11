import { BaseGenerator } from './base-generator';
/**
 * 客户端服务生成器
 */
export declare class ServiceGenerator extends BaseGenerator {
    generate(): string;
    private generateValidationFunctions;
    private generateValidationCallsForService;
    private generateDataObjectWithValidation;
    private generateBatchValidationCalls;
}
