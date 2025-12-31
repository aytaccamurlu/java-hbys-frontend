import React, { useEffect, useState } from 'react';
import { 
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
    Paper, Button, Typography, Box, TextField, Grid, IconButton, 
    InputAdornment, Avatar, Dialog, DialogTitle, DialogContent, DialogActions 
} from '@mui/material';
import { patientService } from '../api';
import { Trash2, UserPlus, Search, User, Save, Edit3, X } from 'lucide-react';

const PatientList = () => {
    const [patients, setPatients] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [open, setOpen] = useState(false);
    const [editingId, setEditingId] = useState(null); // Düzenleme modu için
    const [newPatient, setNewPatient] = useState({ name: '', tcNo: '', complaint: '' });

    useEffect(() => { loadPatients(); }, []);

    const loadPatients = async () => {
        try {
            const res = await patientService.getAll();
            setPatients(res.data);
        } catch (err) { console.error("Yükleme hatası:", err); }
    };

    const handleOpen = (patient = null) => {
        if (patient) {
            setEditingId(patient.id);
            setNewPatient({ name: patient.name, tcNo: patient.tcNo, complaint: patient.complaint });
        } else {
            setEditingId(null);
            setNewPatient({ name: '', tcNo: '', complaint: '' });
        }
        setOpen(true);
    };

    const handleSave = async () => {
        try {
            if (editingId) {
                // UPDATE İŞLEMİ (API'nizde update metodu olmalı)
                await patientService.update(editingId, newPatient);
            } else {
                // CREATE İŞLEMİ
                await patientService.create(newPatient);
            }
            setOpen(false);
            loadPatients();
        } catch (err) { console.error("Kaydetme hatası:", err); }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Silmek istediğinize emin misiniz?")) {
            await patientService.delete(id);
            loadPatients();
        }
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: 800 }}>Hasta Yönetimi</Typography>
                <Button variant="contained" startIcon={<UserPlus size={18} />} onClick={() => handleOpen()} sx={{ bgcolor: '#0ea5e9' }}>
                    Yeni Hasta
                </Button>
            </Box>

            <TableContainer component={Paper} sx={{ borderRadius: '12px', boxShadow: 'none', border: '1px solid #e2e8f0' }}>
                <Table>
                    <TableHead sx={{ bgcolor: '#f1f5f9' }}>
                        <TableRow>
                            <TableCell>Hasta</TableCell>
                            <TableCell>TC No</TableCell>
                            <TableCell>Şikayet</TableCell>
                            <TableCell align="right">İşlemler</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {patients.map((p) => (
                            <TableRow key={p.id} hover>
                                <TableCell>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Avatar sx={{ width: 30, height: 30 }}><User size={16}/></Avatar>
                                        {p.name}
                                    </Box>
                                </TableCell>
                                <TableCell>{p.tcNo}</TableCell>
                                <TableCell>{p.complaint}</TableCell>
                                <TableCell align="right">
                                    <IconButton color="primary" onClick={() => handleOpen(p)}><Edit3 size={18} /></IconButton>
                                    <IconButton color="error" onClick={() => handleDelete(p.id)}><Trash2 size={18} /></IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* EKLEME & DÜZENLEME MODAL */}
            <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
                <DialogTitle>{editingId ? 'Kaydı Düzenle' : 'Yeni Kayıt'}</DialogTitle>
                <DialogContent dividers>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12}>
                            <TextField fullWidth label="Ad Soyad" value={newPatient.name} onChange={(e) => setNewPatient({...newPatient, name: e.target.value})} />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField fullWidth label="TC No" value={newPatient.tcNo} onChange={(e) => setNewPatient({...newPatient, tcNo: e.target.value})} />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField fullWidth label="Şikayet" multiline rows={3} value={newPatient.complaint} onChange={(e) => setNewPatient({...newPatient, complaint: e.target.value})} />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>İptal</Button>
                    <Button variant="contained" onClick={handleSave}>Kaydet</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default PatientList;