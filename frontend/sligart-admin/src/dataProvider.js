// frontend/sligart-admin/src/dataProvider.js - ОБНОВЛЕННАЯ ВЕРСИЯ С ФОТО ПРОЕКТОВ
const apiUrl = '/api/admin';

// Кастомный data provider с правильными headers и загрузкой файлов
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

    create: (resource, params) => {
        // Обрабатываем загрузку файлов для developers
        if (resource === 'developers' && params.data.avatar_file) {
            return createDeveloperWithAvatar(params);
        }

        // Обрабатываем загрузку файлов для projects
        if (resource === 'projects' && params.data.project_photos) {
            return createProjectWithPhotos(params);
        }

        return httpClient(`${apiUrl}/${resource}`, {
            method: 'POST',
            body: JSON.stringify(params.data),
        }).then(response => ({
            data: { ...params.data, id: response.json.id },
        }));
    },

    update: (resource, params) => {
        // Обрабатываем загрузку файлов для developers
        if (resource === 'developers' && params.data.avatar_file) {
            return updateDeveloperWithAvatar(params);
        }

        // Обрабатываем загрузку файлов для projects
        if (resource === 'projects' && params.data.project_photos) {
            return updateProjectWithPhotos(params);
        }

        return httpClient(`${apiUrl}/${resource}/${params.id}`, {
            method: 'PUT',
            body: JSON.stringify(params.data),
        }).then(response => ({ data: response.json }));
    },

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

// Функция для создания разработчика с аватаром
const createDeveloperWithAvatar = async (params) => {
    const developerData = { ...params.data };
    delete developerData.avatar_file;

    const createResponse = await httpClient(`${apiUrl}/developers`, {
        method: 'POST',
        body: JSON.stringify(developerData),
    });

    const developerId = createResponse.json.id;

    if (params.data.avatar_file && params.data.avatar_file.rawFile) {
        await uploadAvatar(developerId, params.data.avatar_file.rawFile);
    }

    const updatedResponse = await httpClient(`${apiUrl}/developers/${developerId}`, {
        method: 'GET',
    });

    return { data: updatedResponse.json };
};

// Функция для обновления разработчика с аватаром
const updateDeveloperWithAvatar = async (params) => {
    const developerData = { ...params.data };
    delete developerData.avatar_file;

    const updateResponse = await httpClient(`${apiUrl}/developers/${params.id}`, {
        method: 'PUT',
        body: JSON.stringify(developerData),
    });

    if (params.data.avatar_file && params.data.avatar_file.rawFile) {
        await uploadAvatar(params.id, params.data.avatar_file.rawFile);
    }

    const updatedResponse = await httpClient(`${apiUrl}/developers/${params.id}`, {
        method: 'GET',
    });

    return { data: updatedResponse.json };
};

// Функция для создания проекта с фотографиями
const createProjectWithPhotos = async (params) => {
    const projectData = { ...params.data };
    delete projectData.project_photos;

    const createResponse = await httpClient(`${apiUrl}/projects`, {
        method: 'POST',
        body: JSON.stringify(projectData),
    });

    const projectId = createResponse.json.id;

    // Загружаем фотографии если есть
    if (params.data.project_photos && params.data.project_photos.length > 0) {
        const photoFiles = params.data.project_photos
            .map(photo => photo.rawFile)
            .filter(file => file);

        if (photoFiles.length > 0) {
            await uploadProjectPhotos(projectId, photoFiles);
        }
    }

    const updatedResponse = await httpClient(`${apiUrl}/projects/${projectId}`, {
        method: 'GET',
    });

    return { data: updatedResponse.json };
};

// Функция для обновления проекта с фотографиями
const updateProjectWithPhotos = async (params) => {
    const projectData = { ...params.data };
    delete projectData.project_photos;

    const updateResponse = await httpClient(`${apiUrl}/projects/${params.id}`, {
        method: 'PUT',
        body: JSON.stringify(projectData),
    });

    // Загружаем новые фотографии если есть
    if (params.data.project_photos && params.data.project_photos.length > 0) {
        const photoFiles = params.data.project_photos
            .map(photo => photo.rawFile)
            .filter(file => file);

        if (photoFiles.length > 0) {
            await uploadProjectPhotos(params.id, photoFiles);
        }
    }

    const updatedResponse = await httpClient(`${apiUrl}/projects/${params.id}`, {
        method: 'GET',
    });

    return { data: updatedResponse.json };
};

// Функция для загрузки аватара
const uploadAvatar = async (developerId, file) => {
    const token = localStorage.getItem('token');

    if (!token) {
        throw new Error('No auth token found');
    }

    const formData = new FormData();
    formData.append('avatar', file);

    const response = await fetch(`${apiUrl}/developers/${developerId}/avatar`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
        body: formData,
    });

    if (!response.ok) {
        throw new Error(`Failed to upload avatar: ${response.statusText}`);
    }

    return response.json();
};

// Функция для загрузки фотографий проекта
const uploadProjectPhotos = async (projectId, files) => {
    const token = localStorage.getItem('token');

    if (!token) {
        throw new Error('No auth token found');
    }

    const formData = new FormData();
    files.forEach((file, index) => {
        formData.append('photos', file);
    });

    console.log(`📸 Uploading ${files.length} photos for project ${projectId}`);

    const response = await fetch(`${apiUrl}/projects/${projectId}/photos`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
        body: formData,
    });

    if (!response.ok) {
        throw new Error(`Failed to upload project photos: ${response.statusText}`);
    }

    return response.json();
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

    // Добавляем Content-Type для POST/PUT/PATCH (кроме multipart)
    if (options.method && ['POST', 'PUT', 'PATCH'].includes(options.method) && options.body) {
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