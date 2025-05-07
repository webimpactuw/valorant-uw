import type { AuthParams, StackOperation } from '../../utils/types.js';
export declare const stacksUrl: string;
export declare function getOperation({ stackId, operationId, auth, }: {
    stackId: string;
    operationId: string;
    auth: AuthParams;
}): Promise<{
    ok: boolean;
    error: string | null;
    operation: StackOperation | null;
}>;
export declare function listOperations({ stackId, auth, }: {
    stackId: string;
    auth: AuthParams;
}): Promise<{
    ok: boolean;
    error: string | null;
    operations: StackOperation[];
}>;
