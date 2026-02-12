import * as v from 'valibot';
import { ProjectListSchema, LoginResponseSchema, UploadResponseSchema } from '../schemas';

export const API_ENDPOINTS = {
    AUTH: '/api/auth',
    CONFIG: '/api/config',
    UPLOAD: '/api/upload',
    MEDIA: '/api/media',
};

export const apiService = {
    login: async (password: string) => {
        const response = await fetch(API_ENDPOINTS.AUTH, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-admin-password': password,
            },
        });
        const json = await response.json();
        if (!response.ok) throw new Error(json.error || 'Login failed');
        
        const data = v.parse(LoginResponseSchema, json);
        return data.token;
    },

    fetchConfig: async () => {
        try {
            const response = await fetch(API_ENDPOINTS.CONFIG, { cache: 'no-store' });
            if (!response.ok) {
                console.warn(`API fetchConfig returned ${response.status}: Falling back to default data.`);
                return null;
            }
            
            const etag = response.headers.get('ETag');
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                const json = await response.json();
                const schema = v.union([
                    ProjectListSchema, 
                    v.object({ data: ProjectListSchema }),
                    v.object({ projects: ProjectListSchema })
                ]);
                const validated = v.parse(schema, json);
                const projects = Array.isArray(validated) 
                    ? validated 
                    : (('data' in validated) ? validated.data : (validated as any).projects);
                console.log(`API fetchConfig success: Loaded ${projects.length} projects.`);
                return { projects, etag };
            }
            return null;
        } catch (error) {
            console.error('API fetchConfig error:', error);
            return null;
        }
    },

    saveConfig: async (data: any, token: string, etag?: string) => {
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        };
        if (etag) {
            headers['If-Match'] = etag;
        }

        const response = await fetch(API_ENDPOINTS.CONFIG, {
            method: 'POST',
            headers,
            body: JSON.stringify(data),
        });
        const json = await response.json();
        
        if (response.status === 412) {
            throw new Error('데이터가 다른 곳에서 수정되었습니다. 새로고침 후 다시 시도해주세요.');
        }
        if (!response.ok) throw new Error(json.error || 'Failed to save config');
        
        const newEtag = response.headers.get('ETag');
        const schema = v.union([
            ProjectListSchema, 
            v.object({ data: ProjectListSchema }),
            v.object({ projects: ProjectListSchema })
        ]);
        const validated = v.parse(schema, json);
        const projects = Array.isArray(validated) 
            ? validated 
            : (('data' in validated) ? validated.data : (validated as any).projects);
        return { projects, etag: newEtag };
    },

    uploadFile: async (file: File, token: string) => {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch(API_ENDPOINTS.UPLOAD, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || 'Upload failed');
        }
        
        const json = await response.json();
        const data = v.parse(UploadResponseSchema, json);
        return data.url;
    }
};
