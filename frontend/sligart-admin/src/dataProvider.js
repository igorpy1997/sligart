// frontend/sligart-admin/src/dataProvider.js - КАСТОМНАЯ ВЕРСИЯ
const apiUrl = '/api/admin';

// Кастомный data provider с правильными headers
const dataProvider = {
    getList: (resource, params) => {
        const { page, perPage } = params.pagination;
        const { field, order } = params.sort;
        const query = {
            _start: (page - 1) * perPage,
            _end: page * perPage,
            _sort: field,
            _order: order,
            ...params.filter,
        };

        const url = `${apiUrl}/${resource}?${new URLSearchParams(query)}`;

        return httpClient(url, {
            method: 'GET',
        }).then(response => ({
            data: response.json,
            total: parseInt(response.headers.get('content-range').split('/').pop(), 10),
        }));
    },

    getOne: (resource, params) =>
        httpClient(`${apiUrl}/${resource}/${params.id}`, {
            method: 'GET',
        }).then(response => ({
            data: response.json,
        })),

    getMany: (resource, params) => {
        const query = {
            ids: params.ids,
        };
        const url = `${apiUrl}/${resource}?${new URLSearchParams(query)}`;
        return httpClient(url, { method: 'GET' }).then(response => ({
            data: response.json,
        }));
    },

    getManyReference: (resource, params) => {
        const { page, perPage } = params.pagination;
        const { field, order } = params.sort;
        const query = {
            _start: (page - 1) * perPage,
            _end: page * perPage,
            _sort: field,
            _order: order,
            [params.target]: params.id,
            ...params.filter,
        };
        const url = `${apiUrl}/${resource}?${new URLSearchParams(query)}`;

        return httpClient(url, { method: 'GET' }).then(response => ({
            data: response.json,
            total: parseInt(response.headers.get('content-range').split('/').pop(), 10),
        }));
    },

    create: (resource, params) =>
        httpClient(`${apiUrl}/${resource}`, {
            method: 'POST',
            body: JSON.stringify(params.data),
        }).then(response => ({
            data: { ...params.data, id: response.json.id },
        })),

    update: (resource, params) =>
        httpClient(`${apiUrl}/${resource}/${params.id}`, {
            method: 'PUT',
            body: JSON.stringify(params.data),
        }).then(response => ({ data: response.json })),

    updateMany: (resource, params) => {
        const query = {
            ids: params.ids,
        };
        return httpClient(`${apiUrl}/${resource}?${new URLSearchParams(query)}`, {
            method: 'PUT',
            body: JSON.stringify(params.data),
        }).then(response => ({ data: response.json }));
    },

    delete: (resource, params) =>
        httpClient(`${apiUrl}/${resource}/${params.id}`, {
            method: 'DELETE',
        }).then(response => ({ data: response.json })),

    deleteMany: (resource, params) => {
        const query = {
            ids: params.ids,
        };
        return httpClient(`${apiUrl}/${resource}?${new URLSearchParams(query)}`, {
            method: 'DELETE',
        }).then(response => ({ data: response.json }));
    },
};

// HTTP клиент с правильными headers
const httpClient = (url, options = {}) => {
    const token = localStorage.getItem('token');

    if (!token) {
        return Promise.reject(new Error('No auth token found'));
    }

    const headers = {
        'Authorization': `Bearer ${token}`,
    };

    // Добавляем Content-Type для POST/PUT/PATCH
    if (options.method && ['POST', 'PUT', 'PATCH'].includes(options.method)) {
        headers['Content-Type'] = 'application/json';
    }

    console.log(`🚀 ${options.method || 'GET'} ${url}`, {
        headers,
        body: options.body
    });

    return fetch(url, {
        ...options,
        headers,
    }).then(response => {
        if (response.status < 200 || response.status >= 300) {
            return Promise.reject(new Error(response.statusText));
        }
        return response.json().then(json => ({
            status: response.status,
            statusText: response.statusText,
            headers: response.headers,
            json,
        }));
    });
};

export default dataProvider;