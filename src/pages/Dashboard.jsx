import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PatientList from '../components/PatientList';
import { patientService, appointmentService } from '../api'; // appointmentService eklendi
import { 
    Box, Drawer, AppBar, Toolbar, List, Typography, Divider, 
    IconButton, ListItem, ListItemButton, ListItemIcon, ListItemText, 
    Avatar, Chip, Paper, Grid, Table, TableBody, TableCell, 
    TableContainer, TableHead, TableRow, Button, Dialog, 
    DialogTitle, DialogContent, TextField, MenuItem, Stack 
} from '@mui/material';
import { 
    Users, LogOut, Hospital, LayoutDashboard, 
    UserCircle, Calendar, ChevronRight,
    Activity, Plus, CheckCircle, XCircle 
} from 'lucide-react';

const drawerWidth = 260;

const Dashboard = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));
    const [activeTab, setActiveTab] = useState('dashboard');
    const [stats, setStats] = useState({ totalPatients: 0, activeAppointments: 0 });
    
    // Randevu Listesi ve Form State'leri
    const [appointments, setAppointments] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [formData, setFormData] = useState({
        patientName: '',
        doctorName: '',
        appointmentDate: '',
        complaint: ''
    });

    // Verileri Yükle (İstatistikler ve Randevular)
    const loadAllData = async () => {
        try {
            const [pRes, aRes] = await Promise.all([
                patientService.getAll(),
                appointmentService.getAll()
            ]);
            setStats({ 
                totalPatients: pRes.data.length,
                activeAppointments: aRes.data.filter(a => a.status === 'Bekliyor').length 
            });
            setAppointments(aRes.data);
        } catch (err) {
            console.error("Veri yükleme hatası:", err);
        }
    };

    useEffect(() => { loadAllData(); }, []);

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/login');
    };

    // Randevu Durumu Güncelle (Doktor Onayı/İptali)
    const handleStatusUpdate = async (id, newStatus) => {
        try {
            await appointmentService.updateStatus(id, newStatus);
            loadAllData();
        } catch (err) { console.error("Güncelleme hatası:", err); }
    };

    // Yeni Randevu Kaydı
    const handleAddAppointment = async () => {
        try {
            await appointmentService.create(formData);
            setOpenModal(false);
            setFormData({ patientName: '', doctorName: '', appointmentDate: '', complaint: '' });
            loadAllData();
        } catch (err) { alert("Randevu kaydedilemedi!"); }
    };

    const menuItems = [
        { id: 'dashboard', text: 'Genel Bakış', icon: <LayoutDashboard size={20} /> },
        { id: 'patients', text: 'Hasta Yönetimi', icon: <Users size={20} /> },
        { id: 'appointments', text: 'Randevular', icon: <Calendar size={20} /> },
    ];

    // --- İÇERİK BİLEŞENLERİ ---

    const OverviewContent = () => (
        <Box>
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={4}>
                    <CardComponent title="Toplam Hasta" value={stats.totalPatients} icon={<Users />} color="#3b82f6" />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <CardComponent title="Bekleyen Randevular" value={stats.activeAppointments} icon={<Calendar />} color="#10b981" />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <CardComponent title="Kritik İşlemler" value="-" icon={<Activity />} color="#f59e0b" />
                </Grid>
            </Grid>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Sistem Özeti</Typography>
            <Paper sx={{ p: 4, textAlign: 'center', borderRadius: '12px', border: '1px dashed #cbd5e1' }}>
                <Typography color="text.secondary">Veritabanı bağlantısı aktif. Tüm sistemler normal çalışıyor.</Typography>
            </Paper>
        </Box>
    );

    const AppointmentsContent = () => (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>Randevu Takvimi</Typography>
                {user?.role === 'receptionist' && (
                <Button 
                    variant="contained" 
                    startIcon={<Plus size={18} />} 
                    onClick={() => setOpenModal(true)}
                    sx={{ borderRadius: '10px', bgcolor: '#38bdf8' }}
                >
                    Yeni Randevu
                </Button>
            )}
            </Box>

            <TableContainer component={Paper} sx={{ boxShadow: 'none', border: '1px solid #e2e8f0', borderRadius: '12px' }}>
                <Table>
                    <TableHead sx={{ bgcolor: '#f8fafc' }}>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 700 }}>Hasta</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Doktor</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Durum</TableCell>
                            {user?.role === 'doktor' && (
                                <TableCell sx={{ fontWeight: 700, textAlign: 'center' }}>İşlemler (Doktor Onayı)</TableCell>
                            )}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {appointments.map((app) => (
                            <TableRow key={app.id} hover>
                                <TableCell>{app.patientName}</TableCell>
                                <TableCell>{app.doctorName}</TableCell>
                                <TableCell>
                                    <Chip 
                                        label={app.status} 
                                        size="small" 
                                        sx={{ 
                                            fontWeight: 700,
                                            bgcolor: app.status === 'Onaylandı' ? '#dcfce7' : app.status === 'İptal' ? '#fee2e2' : '#fef9c3',
                                            color: app.status === 'Onaylandı' ? '#166534' : app.status === 'İptal' ? '#991b1b' : '#854d0e'
                                        }} 
                                    />
                                </TableCell>
                                {/* BUTONLAR: SADECE DOKTOR ROLÜNDEYSE GÖRÜNSÜN */}
                            {user?.role === 'doctor' && (
                                <TableCell>
                                    <Stack direction="row" spacing={1} justifyContent="center">
                                        {app.status === 'Bekliyor' ? (
                                            <>
                                                <IconButton color="success" onClick={() => handleStatusUpdate(app.id, 'Onaylandı')} title="Onayla">
                                                    <CheckCircle size={20} />
                                                </IconButton>
                                                <IconButton color="error" onClick={() => handleStatusUpdate(app.id, 'İptal')} title="İptal Et">
                                                    <XCircle size={20} />
                                                </IconButton>
                                            </>
                                        ) : (
                                            <Typography variant="caption" sx={{ color: 'text.disabled', fontStyle: 'italic' }}>
                                                Tamamlandı
                                            </Typography>
                                        )}
                                    </Stack>
                                </TableCell>
                            )}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );

    return (
        <Box sx={{ display: 'flex', bgcolor: '#f0f2f5', minHeight: '100vh' }}>
            {/* Sidebar ve AppBar kodların aynen kalıyor... */}
            <Drawer variant="permanent" sx={{ width: drawerWidth, flexShrink: 0, [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box', bgcolor: '#1e293b', color: 'white', border: 'none' } }}>
                <Toolbar sx={{ display: 'flex', alignItems: 'center', py: 3, gap: 1.5 }}>
                    <Avatar sx={{ bgcolor: '#38bdf8', width: 40, height: 40 }}><Hospital color="#1e293b" size={24} /></Avatar>
                    <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: 0.5 }}>HBYS PRO</Typography>
                </Toolbar>
                <Box sx={{ px: 2, mt: 2 }}>
                    <List>
                        {menuItems.map((item) => (
                            <ListItem key={item.id} disablePadding sx={{ mb: 1 }}>
                                <ListItemButton onClick={() => setActiveTab(item.id)} selected={activeTab === item.id} sx={{ borderRadius: '12px', py: 1.5, '&.Mui-selected': { bgcolor: '#38bdf8', color: 'white' }, '&.Mui-selected:hover': { bgcolor: '#0ea5e9' }, '&:hover': { bgcolor: 'rgba(255,255,255,0.08)' } }}>
                                    <ListItemIcon sx={{ color: 'inherit', minWidth: 38 }}>{item.icon}</ListItemIcon>
                                    <ListItemText primary={item.text} primaryTypographyProps={{ fontWeight: 600, fontSize: '0.9rem' }} />
                                    {activeTab === item.id && <ChevronRight size={14} />}
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                </Box>
                <Box sx={{ mt: 'auto', p: 2 }}>
                    <Divider sx={{ bgcolor: 'rgba(255,255,255,0.1)', mb: 2 }} />
                    <ListItemButton onClick={handleLogout} sx={{ borderRadius: '12px', color: '#fb7185' }}>
                        <ListItemIcon sx={{ color: 'inherit', minWidth: 38 }}><LogOut size={20} /></ListItemIcon>
                        <ListItemText primary="Oturumu Kapat" />
                    </ListItemButton>
                </Box>
            </Drawer>

            <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, md: 5 } }}>
                <AppBar position="static" color="transparent" elevation={0} sx={{ mb: 5 }}>
                    <Toolbar sx={{ justifyContent: 'space-between', px: '0 !important' }}>
                        <Box>
                            <Typography variant="h4" sx={{ fontWeight: 900, color: '#1e293b', mb: 0.5 }}>
                                {activeTab === 'dashboard' ? 'Genel Bakış' : activeTab === 'patients' ? 'Hasta Kayıtları' : 'Randevu Planı'}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">Hoş geldin, <b>{user?.username}</b>.</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
                            <Box sx={{ textAlign: 'right' }}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>{user?.username}</Typography>
                                <Chip label={user?.role?.toLowerCase() === 'doctor' ? 'Doktor' : 'Sekreter'} size="small" sx={{ height: 20, bgcolor: '#e0f2fe', color: '#0369a1', fontWeight: 900 }} />
                            </Box>
                            <Avatar sx={{ bgcolor: '#1e293b', border: '2px solid #38bdf8' }}><UserCircle size={28} /></Avatar>
                        </Box>
                    </Toolbar>
                </AppBar>

                <Paper elevation={0} sx={{ p: 4, borderRadius: '24px', border: '1px solid #e2e8f0', minHeight: '60vh' }}>
                    {activeTab === 'dashboard' && <OverviewContent />}
                    {activeTab === 'patients' && <PatientList />}
                    {activeTab === 'appointments' && <AppointmentsContent />}
                </Paper>
            </Box>

            {/* Yeni Randevu Modalı */}
            <Dialog open={openModal} onClose={() => setOpenModal(false)} fullWidth maxWidth="xs">
                <DialogTitle sx={{ fontWeight: 800 }}>Yeni Randevu Kaydı</DialogTitle>
                <DialogContent>
                    <Stack spacing={2} sx={{ mt: 1 }}>
                        <TextField label="Hasta Adı" fullWidth onChange={(e) => setFormData({...formData, patientName: e.target.value})} />
                        <TextField select label="Doktor" fullWidth onChange={(e) => setFormData({...formData, doctorName: e.target.value})}>
                            <MenuItem value="Dr. Ali Veli">Dr. Ali Veli (Dahiliye)</MenuItem>
                            <MenuItem value="Dr. Ayşe Yılmaz">Dr. Ayşe Yılmaz (Kardiyoloji)</MenuItem>
                        </TextField>
                        <TextField type="datetime-local" fullWidth InputLabelProps={{ shrink: true }} label="Tarih" onChange={(e) => setFormData({...formData, appointmentDate: e.target.value})} />
                        <Button variant="contained" fullWidth onClick={handleAddAppointment} sx={{ py: 1.5, borderRadius: '10px' }}>Kaydet</Button>
                    </Stack>
                </DialogContent>
            </Dialog>
        </Box>
    );
};

const CardComponent = ({ title, value, icon, color }) => (
    <Paper sx={{ p: 3, borderRadius: '20px', border: '1px solid #e2e8f0' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Box>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>{title}</Typography>
                <Typography variant="h3" sx={{ fontWeight: 900 }}>{value}</Typography>
            </Box>
            <Avatar sx={{ bgcolor: `${color}15`, color: color, borderRadius: '12px' }}>{icon}</Avatar>
        </Box>
    </Paper>
);

export default Dashboard;