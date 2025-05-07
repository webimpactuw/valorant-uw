import type { AuthParams } from '../../../utils/types.js';
export declare function remove(id: string, key: string, auth: AuthParams): Promise<{
    ok: boolean;
    error: any;
}>;
