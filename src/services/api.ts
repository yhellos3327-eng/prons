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
            if (!response.ok) return null;
            
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                const json = await response.json();
                return v.parse(ProjectListSchema, json);
            }
            return null;
        } catch (error) {
            console.error('API fetchConfig error:', error);
            return null;
        }
    },

    saveConfig: async (data: any, token: string) => {
        const response = await fetch(API_ENDPOINTS.CONFIG, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(data),
        });
        const json = await response.json();
        if (!response.ok) throw new Error('Failed to save config');
        
        return v.parse(ProjectListSchema, json);
    },

    uploadFile: async (file: File, token: string) => {
        const sanitizedFilename = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
        const filename = `${Date.now()}-${sanitizedFilename}`;
        const encodedFilename = encodeURIComponent(filename);

        const response = await fetch(`${API_ENDPOINTS.UPLOAD}?filename=${encodedFilename}`, {
            method: 'POST',
            headers: {
                'Content-Type': file.type,
                'Authorization': `Bearer ${token}`,
            },
            body: file,
        });

        if (!response.ok) throw new Error('Upload failed');
        const json = await response.json();
        const data = v.parse(UploadResponseSchema, json);
        return data.url;
    }
};
