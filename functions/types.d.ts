
import '@cloudflare/workers-types';

declare global {
    interface Env {
        PORTFOLIO_BUCKET: R2Bucket;
        ADMIN_PASSWORD?: string;
    }

    type Params = Record<string, string | string[]>;
    type PagesFunction<E = Env> = (context: EventContext<E, Params, Record<string, unknown>>) => Promise<Response>;

    // Type definitions for R2 if explicit types are missing (fallback)
    interface R2Bucket {
        get(key: string): Promise<R2Object | null>;
        put(key: string, value: ReadableStream | ArrayBuffer | string, options?: R2PutOptions): Promise<R2Object>;
        delete(key: string): Promise<void>;
    }

    interface R2Object {
        body: ReadableStream;
        writeHttpMetadata(headers: Headers): void;
        httpEtag: string;
        json<T>(): Promise<T>;
    }

    interface R2PutOptions {
        httpMetadata?: {
            contentType?: string;
        };
    }

    interface EventContext<E, P, D> {
        env: E;
        params: P;
        data: D;
        request: Request;
        next: () => Promise<Response>;
    }
}

export {};
