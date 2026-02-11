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
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Login failed');
        return data.token;
    },

    fetchConfig: async () => {
        const response = await fetch(API_ENDPOINTS.CONFIG, { cache: 'no-store' });
        if (!response.ok) throw new Error('Failed to fetch config');
        return response.json();
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
        if (!response.ok) throw new Error('Failed to save config');
        return response.json();
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
        const data = await response.json();
        return data.url;
    }
};
