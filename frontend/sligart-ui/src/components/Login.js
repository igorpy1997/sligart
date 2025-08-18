// frontend/sligart-ui/src/components/Login.js
import React, { useState } from 'react';
import { useLogin, useNotify, Notification } from 'react-admin';
import {
    Card,
    CardContent,
    CardActions,
    TextField,
    Button,
    CircularProgress,
    Box,
    Typography,
    Alert
} from '@mui/material';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const login = useLogin();
    const notify = useNotify();

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        login({ username, password })
            .catch(() => {
                setLoading(false);
                notify('Invalid username or password', { type: 'error' });
            });
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                minHeight: '100vh',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            }}
        >
            <Card sx={{ minWidth: 300, maxWidth: 400 }}>
                <form onSubmit={handleSubmit}>
                    <CardContent>
                        <Typography variant="h5" component="h2" sx={{ mb: 3, textAlign: 'center' }}>
                            Portfolio Admin
                        </Typography>

                        <Box sx={{ mb: 2 }}>
                            <TextField
                                fullWidth
                                label="Username"
                                name="username"
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                disabled={loading}
                                required
                                autoFocus
                            />
                        </Box>

                        <Box sx={{ mb: 2 }}>
                            <TextField
                                fullWidth
                                label="Password"
                                name="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={loading}
                                required
                            />
                        </Box>

                        {/* Test credentials hint */}
                        <Alert severity="info" sx={{ mt: 2 }}>
                            <Typography variant="caption">
                                Test credentials:<br />
                                Username: admin<br />
                                Password: your_password
                            </Typography>
                        </Alert>
                    </CardContent>

                    <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                        <Button
                            variant="contained"
                            type="submit"
                            color="primary"
                            disabled={loading || !username || !password}
                            fullWidth
                            sx={{ mx: 2 }}
                        >
                            {loading ? (
                                <CircularProgress size={24} color="inherit" />
                            ) : (
                                'Sign In'
                            )}
                        </Button>
                    </CardActions>
                </form>
            </Card>

            <Notification />
        </Box>
    );
};

export default Login;