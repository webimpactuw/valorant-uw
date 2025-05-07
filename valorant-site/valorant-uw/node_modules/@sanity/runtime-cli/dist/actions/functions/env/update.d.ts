import type { AuthParams } from '../../../utils/types.js';
export declare function update(id: string, key: string, value: string, auth: AuthParams): Promise<{
    ok: boolean;
    error: any;
}>;
