import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Paper, Avatar, Container } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { authService } from '../api';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await authService.login(credentials);
            localStorage.setItem('user', JSON.stringify(res.data));
            navigate('/dashboard');
        } catch (err) {
            alert("Giriş başarısız!");
        }
    };

    return (
        /* sx içindeki minHeight: '100vh' ve display: 'flex' kısmı tam merkezleme sağlar */
        <Box sx={{ 
            height: '100vh',
            width: '100vw', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            backgroundColor: '#f5f5f5' 
        }}>
            <Container maxWidth="xs">
                <Paper elevation={10} sx={{ padding: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', borderRadius: 3 }}>
                    <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}><LockOutlinedIcon /></Avatar>
                    <Typography variant="h5" sx={{ mb: 2 }}>HBYS Giriş</Typography>
                    <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
                        <TextField margin="normal" required fullWidth label="Kullanıcı Adı" autoFocus
                            onChange={(e) => setCredentials({ ...credentials, username: e.target.value })} />
                        <TextField margin="normal" required fullWidth label="Şifre" type="password"
                            onChange={(e) => setCredentials({ ...credentials, password: e.target.value })} />
                        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2, py: 1.5 }}>Giriş Yap</Button>
                        <Typography variant="body2" align="center">
                            Hesabınız yok mu? <Link to="/register" style={{ color: '#1976d2', textDecoration: 'none' }}>Kayıt Ol</Link>
                        </Typography>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
};

export default Login;