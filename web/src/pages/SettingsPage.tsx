import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Camera, Globe, Shield, HelpCircle, MessageSquare, Bell, LogOut, ChevronRight, Moon, User, Lock, CreditCard, Star, Edit3, Loader2 } from 'lucide-react';
import AppLayout from '../components/AppLayout';

function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button onClick={onToggle} style={{ width: 44, height: 24, borderRadius: 99, background: on ? '#F97316' : '#E5E7EB', border: 'none', cursor: 'pointer', position: 'relative', transition: 'background .2s', flexShrink: 0 }}>
      <div style={{ position: 'absolute', top: 2, left: on ? 22 : 2, width: 20, height: 20, background: '#fff', borderRadius: '50%', transition: 'left .2s', boxShadow: '0 1px 4px rgba(0,0,0,0.15)' }} />
    </button>
  );
}

function SettingRow({ icon, label, value, onClick, right, danger }: { icon: React.ReactNode; label: string; value?: string; onClick?: () => void; right?: React.ReactNode; danger?: boolean }) {
  return (
    <button onClick={onClick} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '13px 16px', background: 'none', border: 'none', cursor: onClick || right ? 'pointer' : 'default', textAlign: 'left', borderRadius: 10, transition: 'background .15s' }}
      onMouseEnter={e => { if (onClick) (e.currentTarget as HTMLElement).style.background = '#F9FAFB'; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
    >
      <div style={{ width: 36, height: 36, background: danger ? '#FEF2F2' : '#F3F4F6', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: danger ? '#EF4444' : '#6B7280' }}>
        {icon}
      </div>
      <span style={{ flex: 1, fontSize: 14, fontWeight: 600, color: danger ? '#EF4444' : '#0D1B2A' }}>{label}</span>
      {value && <span style={{ fontSize: 13, color: '#9CA3AF' }}>{value}</span>}
      {right || (onClick && <ChevronRight size={15} color="#D1D5DB" />)}
    </button>
  );
}

export default function SettingsPage() {
  const { user, logout, updateProfile, uploadFile } = useAuth();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [notifs, setNotifs] = useState({ push: true, email: true, sms: false });
  const [form, setForm] = useState({ 
    fullName: user?.fullName || '', 
    email: user?.email || '', 
    bio: user?.providerProfile?.bio || '' 
  });

  useEffect(() => {
    if (user) {
      setForm({
        fullName: user.fullName || '',
        email: user.email || '',
        bio: user.providerProfile?.bio || ''
      });
    }
  }, [user]);

  const handleSave = async () => {
    setLoading(true);
    try {
      await updateProfile(form);
      setEditing(false);
    } catch (error) {
      alert("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', e.target.files[0]);
      formData.append('type', 'avatar');
      
      const res = await uploadFile(formData);
      await updateProfile({ avatar: res.url });
    } catch (error) {
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout title="Profile & Settings" subtitle="Manage your account information and preferences.">
      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 24, alignItems: 'start' }}>

        {/* ── LEFT: Profile card ────────────────────────────── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ background: '#fff', borderRadius: 18, border: '1px solid #E5E7EB', padding: '28px 22px', textAlign: 'center' }}>
            <div style={{ position: 'relative', display: 'inline-block', marginBottom: 16 }}>
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt=""
                  style={{ width: 84, height: 84, borderRadius: 20, objectFit: 'cover', display: 'block' }}
                />
              ) : (
                <div style={{ width: 84, height: 84, borderRadius: 20, background: '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 800, color: '#F97316' }}>
                  {user?.fullName?.charAt(0)}
                </div>
              )}
              <label style={{ position: 'absolute', bottom: -4, right: -4, width: 28, height: 28, background: '#F97316', border: '2px solid #fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <Camera size={13} color="#fff" />
                <input type="file" hidden accept="image/*" onChange={handleAvatarUpload} disabled={loading} />
              </label>
            </div>
            <p style={{ fontSize: 16, fontWeight: 800, color: '#0D1B2A', marginBottom: 2 }}>{user?.fullName || 'Fixam User'}</p>
            <p style={{ fontSize: 12, color: '#6B7280', marginBottom: 4, textTransform: 'capitalize' }}>{user?.role?.toLowerCase() || 'client'}</p>
            <p style={{ fontSize: 12, color: '#9CA3AF', marginBottom: 18 }}>{user?.email || user?.phone}</p>
            {user?.role?.toUpperCase() === 'PROVIDER' && (
              <div style={{ display: 'flex', justifyContent: 'center', gap: 4, marginBottom: 18 }}>
                {[1,2,3,4,5].map(s => <Star key={s} size={14} color="#F97316" fill={s <= (user.providerProfile?.rating || 0) ? "#F97316" : "none"} />)}
                <span style={{ fontSize: 13, fontWeight: 700, color: '#0D1B2A', marginLeft: 4 }}>{user.providerProfile?.rating || '0.0'}</span>
              </div>
            )}
            <button
              onClick={() => editing ? handleSave() : setEditing(true)}
              disabled={loading}
              style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '10px', borderRadius: 10, border: '1.5px solid #E5E7EB', background: '#fff', cursor: 'pointer', fontWeight: 700, fontSize: 13, color: '#0D1B2A', fontFamily: 'Inter, sans-serif' }}
            >
              {loading ? <Loader2 size={14} className="animate-spin" /> : <Edit3 size={14} />} 
              {editing ? 'Save Changes' : 'Edit Profile'}
            </button>
          </div>
        </div>

        {/* ── RIGHT: Settings panels ────────────────────────── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Edit profile fields */}
          {editing && (
            <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #E5E7EB', padding: '22px 24px' }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: '#0D1B2A', marginBottom: 18, paddingBottom: 12, borderBottom: '1px solid #F3F4F6' }}>Edit Profile Information</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#6B7280', marginBottom: 6 }}>Full Name</label>
                  <input
                    type="text"
                    value={form.fullName}
                    onChange={e => setForm(p => ({ ...p, fullName: e.target.value }))}
                    style={{ width: '100%', border: '1.5px solid #E5E7EB', borderRadius: 10, padding: '11px 14px', fontSize: 14, color: '#0D1B2A', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#6B7280', marginBottom: 6 }}>Email Address</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                    style={{ width: '100%', border: '1.5px solid #E5E7EB', borderRadius: 10, padding: '11px 14px', fontSize: 14, color: '#0D1B2A', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>
                {user?.role?.toUpperCase() === 'PROVIDER' && (
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#6B7280', marginBottom: 6 }}>Professional Bio</label>
                    <textarea
                      value={form.bio}
                      onChange={e => setForm(p => ({ ...p, bio: e.target.value }))}
                      style={{ width: '100%', border: '1.5px solid #E5E7EB', borderRadius: 10, padding: '11px 14px', fontSize: 14, color: '#0D1B2A', outline: 'none', boxSizing: 'border-box', minHeight: 100, resize: 'vertical' }}
                    />
                  </div>
                )}
                <div style={{ display: 'flex', gap: 10 }}>
                  <button onClick={handleSave} disabled={loading} style={{ flex: 1, background: '#F97316', color: '#fff', fontWeight: 700, fontSize: 14, padding: '12px', borderRadius: 10, border: 'none', cursor: 'pointer' }}>
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button onClick={() => setEditing(false)} style={{ flex: 1, background: '#fff', color: '#374151', fontWeight: 600, fontSize: 14, padding: '12px', borderRadius: 10, border: '1.5px solid #E5E7EB', cursor: 'pointer' }}>Cancel</button>
                </div>
              </div>
            </div>
          )}

          {/* Account */}
          <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #E5E7EB', padding: '6px 8px' }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: '#9CA3AF', letterSpacing: 1, padding: '12px 10px 6px' }}>ACCOUNT</p>
            <SettingRow icon={<User size={16} />} label="Personal Information" onClick={() => setEditing(true)} />
            <SettingRow icon={<CreditCard size={16} />} label="Wallet & Payments" onClick={() => navigate('/wallet')} />
            <SettingRow icon={<Shield size={16} />} label="Privacy & Security" onClick={() => {}} />
          </div>

          <button
            onClick={() => { logout(); navigate('/'); }}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, width: '100%', padding: '14px', background: '#FEF2F2', color: '#EF4444', fontWeight: 700, fontSize: 14, borderRadius: 14, border: '1px solid #FECACA', cursor: 'pointer' }}
          >
            <LogOut size={17} /> Log Out
          </button>
        </div>
      </div>
    </AppLayout>
  );
}
