// frontend/sligart-ui/src/dataProvider.js
import simpleRestProvider from 'ra-data-simple-rest';

const apiUrl = '/api/admin';
const baseDataProvider = simpleRestProvider(apiUrl);

const dataProvider = {
    ...baseDataProvider,

    // Add auth headers to all requests
    getList: (resource, params) => {
        return addAuthHeaders(() => baseDataProvider.getList(resource, params));
    },

    getOne: (resource, params) => {
        return addAuthHeaders(() => baseDataProvider.getOne(resource, params));
    },

    getMany: (resource, params) => {
        return addAuthHeaders(() => baseDataProvider.getMany(resource, params));
    },

    getManyReference: (resource, params) => {
        return addAuthHeaders(() => baseDataProvider.getManyReference(resource, params));
    },

    create: (resource, params) => {
        return addAuthHeaders(() => baseDataProvider.create(resource, params));
    },

    update: (resource, params) => {
        return addAuthHeaders(() => baseDataProvider.update(resource, params));
    },

    updateMany: (resource, params) => {
        return addAuthHeaders(() => baseDataProvider.updateMany(resource, params));
    },

    delete: (resource, params) => {
        return addAuthHeaders(() => baseDataProvider.delete(resource, params));
    },

    deleteMany: (resource, params) => {
        return addAuthHeaders(() => baseDataProvider.deleteMany(resource, params));
    },
};

// Helper function to add auth headers
function addAuthHeaders(requestFunction) {
    const token = localStorage.getItem('token');

    if (!token) {
        return Promise.reject(new Error('No auth token found'));
    }

    // Override fetch to add auth headers
    const originalFetch = window.fetch;
    window.fetch = function(url, options = {}) {
        return originalFetch(url, {
            ...options,
            headers: {
                ...options.headers,
                'Authorization': `Bearer ${token}`,
            },
        });
    };

    const result = requestFunction();

    // Restore original fetch
    window.fetch = originalFetch;

    return result;
}

export default dataProvider;