import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Paper, Avatar, Container, MenuItem } from '@mui/material';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import { authService } from '../api';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [user, setUser] = useState({ username: '', password: '', role: 'receptionist' });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await authService.register(user);
            alert("Kayıt Başarılı!");
            // Yönlendirmeyi garantiye almak için timeout koyabiliriz
            setTimeout(() => {
                navigate('/login');
            }, 500);
        } catch (err) {
            console.error(err);
            alert("Hata oluştu, veritabanını veya backend loglarını kontrol edin.");
        }
    };

    return (
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
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}><PersonAddAlt1Icon /></Avatar>
                    <Typography variant="h5" sx={{ mb: 2 }}>Yeni Personel</Typography>
                    <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
                        <TextField margin="normal" required fullWidth label="Kullanıcı Adı"
                            onChange={(e) => setUser({ ...user, username: e.target.value })} />
                        <TextField margin="normal" required fullWidth label="Şifre" type="password"
                            onChange={(e) => setUser({ ...user, password: e.target.value })} />
                        <TextField select margin="normal" fullWidth label="Görev" value={user.role}
                            onChange={(e) => setUser({ ...user, role: e.target.value })}>
                            <MenuItem value="receptionist">Resepsiyonist</MenuItem>
                            <MenuItem value="doctor">Doktor</MenuItem>
                        </TextField>
                        <Button type="submit" fullWidth variant="contained" color="secondary" sx={{ mt: 3, mb: 2, py: 1.5 }}>Kaydı Tamamla</Button>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
};

export default Register;