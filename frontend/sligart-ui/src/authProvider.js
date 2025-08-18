// frontend/sligart-ui/src/authProvider.js
const authProvider = {
    // called when the user attempts to log in
    login: ({ username, password }) => {
        const request = new Request('/api/auth/login', {
            method: 'POST',
            body: JSON.stringify({ username, password }),
            headers: new Headers({ 'Content-Type': 'application/json' }),
        });
        return fetch(request)
            .then(response => {
                if (response.status < 200 || response.status >= 300) {
                    throw new Error(response.statusText);
                }
                return response.json();
            })
            .then(auth => {
                localStorage.setItem('auth', JSON.stringify(auth));
                localStorage.setItem('token', auth.access_token);
            })
            .catch(() => {
                throw new Error('Network error');
            });
    },

    // called when the user clicks on the logout button
    logout: () => {
        localStorage.removeItem('auth');
        localStorage.removeItem('token');
        return Promise.resolve();
    },

    // called when the API returns an error
    checkError: ({ status }) => {
        if (status === 401 || status === 403) {
            localStorage.removeItem('auth');
            localStorage.removeItem('token');
            return Promise.reject();
        }
        return Promise.resolve();
    },

    // called when the user navigates to a new location, to check for authentication
    checkAuth: () => {
        const token = localStorage.getItem('token');
        if (!token) {
            return Promise.reject();
        }

        // Verify token with backend
        return fetch('/api/auth/verify', {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        }).then(response => {
            if (response.status < 200 || response.status >= 300) {
                localStorage.removeItem('auth');
                localStorage.removeItem('token');
                throw new Error('Token invalid');
            }
            return response.json();
        }).catch(() => {
            localStorage.removeItem('auth');
            localStorage.removeItem('token');
            return Promise.reject();
        });
    },

    // called when the user navigates to a new location, to check for permissions / roles
    getPermissions: () => {
        const auth = localStorage.getItem('auth');
        if (!auth) {
            return Promise.reject();
        }

        const { user } = JSON.parse(auth);
        return Promise.resolve(user.is_admin ? 'admin' : 'user');
    },

    // called to get user identity
    getIdentity: () => {
        const auth = localStorage.getItem('auth');
        if (!auth) {
            return Promise.reject();
        }

        const { user } = JSON.parse(auth);
        return Promise.resolve({
            id: user.id,
            fullName: user.username,
            email: user.email,
        });
    },
};

export default authProvider;