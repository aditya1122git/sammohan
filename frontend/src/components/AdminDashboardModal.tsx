import React, { useState, useEffect } from 'react';
import {
  X,
  Shield,
  Users,
  Lock,
  UserPlus,
  CheckCircle,
  FileText,
  Save,
  AlertCircle,
  UserCircle,
  Pencil,
  KeyRound,
  Eye,
  EyeOff,
  Trash2
} from 'lucide-react';
import { api } from '../services/api';
import { User } from '../types';
import { getRoleLabel, getUserDisplayName } from '../utils/userDisplay';
import { FullPageWorkspace } from './FullPageWorkspace';

interface AdminDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  language: 'hi' | 'en';
  onCurrentUserUpdated?: (user: User) => void;
}

export const AdminDashboardModal: React.FC<AdminDashboardModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  language,
  onCurrentUserUpdated
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'users'>('profile');
  const [users, setUsers] = useState<User[]>([]);
  const [showCreateUser, setShowCreateUser] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [newUserRole, setNewUserRole] = useState<User['role']>('DATA_ENTRY');
  const [newUserDepartment, setNewUserDepartment] = useState('');
  const [newUserPhone, setNewUserPhone] = useState('');
  const [showNewUserPassword, setShowNewUserPassword] = useState(false);
  const [isCreatingUser, setIsCreatingUser] = useState(false);
  const [userMsg, setUserMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);
  const [deleteAdminPassword, setDeleteAdminPassword] = useState('');
  const [showDeleteAdminPassword, setShowDeleteAdminPassword] = useState(false);
  const [isDeletingUser, setIsDeletingUser] = useState(false);

  // Admin Profile State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileName, setProfileName] = useState('');
  const [profileEmail, setProfileEmail] = useState('');
  const [profileDepartment, setProfileDepartment] = useState('');
  const [profilePhone, setProfilePhone] = useState('');
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showPasswordCard, setShowPasswordCard] = useState(false);

  useEffect(() => {
    if (isOpen && currentUser?.role === 'ADMIN') {
      loadAdminData();
    }
  }, [isOpen, activeTab]);

  useEffect(() => {
    if (currentUser) {
      setProfileName(getUserDisplayName(currentUser.name));
      setProfileEmail(currentUser.email);
      setProfileDepartment(currentUser.department || '');
      setProfilePhone(currentUser.phone || '');
    }
  }, [currentUser]);

  const loadAdminData = async () => {
    try {
      if (activeTab === 'users') {
        const res = await api.getUsers();
        setUsers(res.users);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const resetNewUserForm = () => {
    setNewUserName('');
    setNewUserEmail('');
    setNewUserPassword('');
    setNewUserRole('DATA_ENTRY');
    setNewUserDepartment('');
    setNewUserPhone('');
    setShowNewUserPassword(false);
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setUserMsg(null);
    setIsCreatingUser(true);
    try {
      await api.createUser({
        name: newUserName.trim(),
        email: newUserEmail.trim(),
        password: newUserPassword,
        role: newUserRole,
        department: newUserDepartment.trim() || undefined,
        phone: newUserPhone.trim() || undefined
      });
      resetNewUserForm();
      setShowCreateUser(false);
      setUserMsg({ type: 'success', text: 'User created successfully.' });
      await loadAdminData();
    } catch (err: any) {
      setUserMsg({ type: 'error', text: err.message || 'Failed to create user.' });
    } finally {
      setIsCreatingUser(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!deleteTarget || !deleteAdminPassword) return;
    setUserMsg(null);
    setIsDeletingUser(true);
    try {
      const deletedName = getUserDisplayName(deleteTarget.name);
      await api.deleteUser(deleteTarget.id, deleteAdminPassword);
      setDeleteTarget(null);
      setDeleteAdminPassword('');
      setShowDeleteAdminPassword(false);
      setUserMsg({ type: 'success', text: `${deletedName} has been deleted.` });
      await loadAdminData();
    } catch (err: any) {
      setUserMsg({ type: 'error', text: err.message || 'Failed to delete user.' });
    } finally {
      setIsDeletingUser(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileMsg(null);
    setIsSavingProfile(true);
    try {
      const res = await api.updateMyProfile({
        name: profileName.trim(),
        email: profileEmail.trim(),
        department: profileDepartment.trim(),
        phone: profilePhone.trim()
      });
      setProfileMsg({ type: 'success', text: res.message || 'Profile updated successfully.' });
      setIsEditingProfile(false);
      if (onCurrentUserUpdated) onCurrentUserUpdated(res.user);
    } catch (err: any) {
      setProfileMsg({ type: 'error', text: err.message || 'Failed to update profile.' });
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMsg(null);
    if (newPassword !== confirmPassword) {
      setPasswordMsg({ type: 'error', text: 'New password and confirmation do not match.' });
      return;
    }
    setIsChangingPassword(true);
    try {
      const res = await api.changePassword(currentPassword, newPassword);
      setPasswordMsg({ type: 'success', text: res.message || 'Password changed successfully.' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setPasswordMsg({ type: 'error', text: err.message || 'Failed to change password.' });
    } finally {
      setIsChangingPassword(false);
    }
  };

  if (!isOpen) return null;

  return (
    <FullPageWorkspace>
      <div className="bg-white w-full h-full overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-amber-700 text-white px-6 py-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-amber-200" />
            <div>
              <h3 className="text-lg font-bold">
                {language === 'hi' ? 'प्रशासनिक नियंत्रण कक्ष' : 'System Administration Console'}
              </h3>
              <p className="text-xs text-amber-100">
                User Security & Account Administration
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-white/20 rounded-full transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Headers */}
        <div className="bg-gray-100 border-b border-gray-200 px-6 pt-2 flex items-center gap-2 text-xs flex-shrink-0">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2 font-bold rounded-t-lg transition flex items-center gap-1.5 ${
              activeTab === 'profile'
                ? 'bg-white text-gray-900 border-t-2 border-amber-600 shadow-sm'
                : 'text-gray-600 hover:text-black'
            }`}
          >
            <UserCircle className="w-3.5 h-3.5" />
            <span>Admin Profile</span>
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 font-bold rounded-t-lg transition flex items-center gap-1.5 ${
              activeTab === 'users'
                ? 'bg-white text-gray-900 border-t-2 border-amber-600 shadow-sm'
                : 'text-gray-600 hover:text-black'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Staff Users & Roles</span>
          </button>

        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto overscroll-contain flex-grow text-xs">
          {/* TAB 1: Admin Profile */}
          {activeTab === 'profile' && currentUser && (
            <div className={`grid grid-cols-1 gap-6 ${showPasswordCard ? 'xl:grid-cols-2 max-w-6xl' : 'max-w-3xl'}`}>
              <section className="border border-gray-200 rounded-2xl overflow-hidden shadow-sm bg-white">
                <div className="bg-gradient-to-r from-amber-700 to-amber-600 text-white p-5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-white/15 flex items-center justify-center border border-white/25">
                      <UserCircle className="w-7 h-7" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold">Administrator Profile</h4>
                      <p className="text-amber-100 mt-0.5">Account and official contact details</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setPasswordMsg(null);
                        setShowPasswordCard(true);
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 text-white font-bold hover:bg-slate-900 transition"
                    >
                      <KeyRound className="w-3.5 h-3.5" />
                      Change Password
                    </button>
                    {!isEditingProfile && (
                      <button
                        type="button"
                        onClick={() => {
                          setProfileMsg(null);
                          setIsEditingProfile(true);
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white text-amber-800 font-bold hover:bg-amber-50 transition"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                        Edit Profile
                      </button>
                    )}
                  </div>
                </div>

                <form onSubmit={handleSaveProfile} className="p-5 space-y-4">
                  {profileMsg && (
                    <div className={`p-3 rounded-lg flex items-center gap-2 ${profileMsg.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                      {profileMsg.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                      <span>{profileMsg.text}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block font-bold text-gray-700 mb-1">Full Name</label>
                      <input required minLength={2} disabled={!isEditingProfile} value={profileName} onChange={(e) => setProfileName(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 disabled:bg-gray-100 disabled:text-gray-700 outline-none focus:ring-2 focus:ring-amber-600" />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block font-bold text-gray-700 mb-1">Email Address</label>
                      <input required type="email" disabled={!isEditingProfile} value={profileEmail} onChange={(e) => setProfileEmail(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 disabled:bg-gray-100 disabled:text-gray-700 outline-none focus:ring-2 focus:ring-amber-600" />
                    </div>
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">Role</label>
                      <input disabled value="Administrator" className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-100 text-gray-700 font-bold" />
                    </div>
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">Account Status</label>
                      <input disabled value={currentUser.isActive === false ? 'Inactive' : 'Active'} className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-100 text-emerald-700 font-bold" />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block font-bold text-gray-700 mb-1">Department / Office</label>
                      <input disabled={!isEditingProfile} value={profileDepartment} onChange={(e) => setProfileDepartment(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 disabled:bg-gray-100 disabled:text-gray-700 outline-none focus:ring-2 focus:ring-amber-600" />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block font-bold text-gray-700 mb-1">Phone Number</label>
                      <input disabled={!isEditingProfile} value={profilePhone} onChange={(e) => setProfilePhone(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 disabled:bg-gray-100 disabled:text-gray-700 outline-none focus:ring-2 focus:ring-amber-600" />
                    </div>
                  </div>

                  {isEditingProfile && (
                    <div className="flex items-center gap-2 pt-2">
                      <button type="submit" disabled={isSavingProfile} className="inline-flex items-center gap-1.5 bg-amber-700 hover:bg-amber-800 text-white font-bold px-4 py-2 rounded-lg disabled:opacity-60">
                        <Save className="w-3.5 h-3.5" />
                        {isSavingProfile ? 'Saving...' : 'Save Profile'}
                      </button>
                      <button type="button" onClick={() => {
                        setProfileName(getUserDisplayName(currentUser.name));
                        setProfileEmail(currentUser.email);
                        setProfileDepartment(currentUser.department || '');
                        setProfilePhone(currentUser.phone || '');
                        setProfileMsg(null);
                        setIsEditingProfile(false);
                      }} className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-bold hover:bg-gray-50">
                        Cancel
                      </button>
                    </div>
                  )}
                </form>
              </section>

              {showPasswordCard && (
              <section className="border border-gray-200 rounded-2xl overflow-hidden shadow-sm bg-white self-start animate-fadeIn">
                <div className="bg-slate-800 text-white p-5 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                      <KeyRound className="w-5 h-5 text-amber-300" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold">Change Password</h4>
                      <p className="text-slate-300 mt-0.5">Verify the current password before setting a new one</p>
                    </div>
                  </div>
                  <button type="button" onClick={() => {
                    setShowPasswordCard(false);
                    setCurrentPassword('');
                    setNewPassword('');
                    setConfirmPassword('');
                    setPasswordMsg(null);
                  }} className="p-1.5 rounded-lg hover:bg-white/10" aria-label="Close change password card">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <form onSubmit={handleChangePassword} className="p-5 space-y-4">
                  {passwordMsg && (
                    <div className={`p-3 rounded-lg flex items-center gap-2 ${passwordMsg.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                      {passwordMsg.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                      <span>{passwordMsg.text}</span>
                    </div>
                  )}
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Current Password</label>
                    <div className="relative">
                      <input required type={showCurrentPassword ? 'text' : 'password'} value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-10 outline-none focus:ring-2 focus:ring-amber-600" />
                      <button type="button" onClick={() => setShowCurrentPassword(!showCurrentPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500" aria-label="Toggle current password visibility">
                        {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">New Password</label>
                    <div className="relative">
                      <input required minLength={8} type={showNewPassword ? 'text' : 'password'} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-10 outline-none focus:ring-2 focus:ring-amber-600" />
                      <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500" aria-label="Toggle new password visibility">
                        {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <p className="text-[11px] text-gray-500 mt-1">Use at least 8 characters.</p>
                  </div>
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Confirm New Password</label>
                    <input required minLength={8} type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-amber-600" />
                  </div>
                  <button type="submit" disabled={isChangingPassword} className="inline-flex items-center gap-1.5 bg-slate-800 hover:bg-slate-900 text-white font-bold px-5 py-2.5 rounded-lg disabled:opacity-60">
                    <Lock className="w-3.5 h-3.5" />
                    {isChangingPassword ? 'Changing Password...' : 'Change Password'}
                  </button>
                </form>
              </section>
              )}
            </div>
          )}

          {/* TAB 2: Users */}
          {activeTab === 'users' && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h4 className="text-base font-bold text-slate-900">Staff Users</h4>
                  <p className="mt-0.5 text-slate-500">Create accounts, assign access roles and remove users.</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setUserMsg(null);
                    setShowCreateUser((value) => !value);
                  }}
                  className="inline-flex items-center gap-2 rounded-lg bg-amber-700 px-4 py-2.5 font-bold text-white transition hover:bg-amber-800"
                >
                  {showCreateUser ? <X className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />}
                  {showCreateUser ? 'Close Form' : 'Create New User'}
                </button>
              </div>

              {userMsg && (
                <div className={`flex items-center gap-2 rounded-lg border p-3 ${userMsg.type === 'success' ? 'border-emerald-200 bg-emerald-50 text-emerald-800' : 'border-red-200 bg-red-50 text-red-700'}`}>
                  {userMsg.type === 'success' ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                  <span>{userMsg.text}</span>
                </div>
              )}

              {showCreateUser && (
                <form onSubmit={handleCreateUser} className="rounded-2xl border border-amber-200 bg-amber-50/40 p-5 shadow-sm">
                  <div className="mb-4 flex items-center gap-2 text-amber-900">
                    <UserPlus className="h-5 w-5" />
                    <h5 className="text-sm font-bold">New User Account</h5>
                  </div>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                    <div>
                      <label className="mb-1 block font-bold text-gray-700">Full Name *</label>
                      <input required minLength={2} value={newUserName} onChange={(e) => setNewUserName(e.target.value)} className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-amber-600" />
                    </div>
                    <div>
                      <label className="mb-1 block font-bold text-gray-700">Email Address *</label>
                      <input required type="email" value={newUserEmail} onChange={(e) => setNewUserEmail(e.target.value)} className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-amber-600" />
                    </div>
                    <div>
                      <label className="mb-1 block font-bold text-gray-700">Temporary Password *</label>
                      <div className="relative">
                        <input required minLength={8} type={showNewUserPassword ? 'text' : 'password'} value={newUserPassword} onChange={(e) => setNewUserPassword(e.target.value)} className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 pr-10 outline-none focus:ring-2 focus:ring-amber-600" />
                        <button type="button" onClick={() => setShowNewUserPassword((value) => !value)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500" aria-label="Toggle temporary password visibility">
                          {showNewUserPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="mb-1 block font-bold text-gray-700">Assigned Role *</label>
                      <select value={newUserRole} onChange={(e) => setNewUserRole(e.target.value as User['role'])} className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-amber-600">
                        <option value="ADMIN">Administrator</option>
                        <option value="DATA_ENTRY">Data Entry Operator</option>
                        <option value="REVIEWER">Reviewer</option>
                        <option value="READONLY">Read Only</option>
                      </select>
                    </div>
                    <div>
                      <label className="mb-1 block font-bold text-gray-700">Department / Office</label>
                      <input value={newUserDepartment} onChange={(e) => setNewUserDepartment(e.target.value)} placeholder="General Administration" className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-amber-600" />
                    </div>
                    <div>
                      <label className="mb-1 block font-bold text-gray-700">Phone Number</label>
                      <input type="tel" value={newUserPhone} onChange={(e) => setNewUserPhone(e.target.value)} className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-amber-600" />
                    </div>
                  </div>
                  <div className="mt-5 flex items-center gap-2">
                    <button type="submit" disabled={isCreatingUser} className="inline-flex items-center gap-2 rounded-lg bg-amber-700 px-5 py-2.5 font-bold text-white hover:bg-amber-800 disabled:opacity-60">
                      <UserPlus className="h-4 w-4" />
                      {isCreatingUser ? 'Creating User...' : 'Create User'}
                    </button>
                    <button type="button" onClick={() => { resetNewUserForm(); setShowCreateUser(false); }} className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 font-bold text-gray-700 hover:bg-gray-50">
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              {deleteTarget && (
                <div className="rounded-2xl border border-red-200 bg-red-50 p-5 shadow-sm">
                  <div className="flex flex-col gap-4">
                    <div className="flex items-start gap-3">
                      <div className="rounded-xl bg-red-100 p-2 text-red-700"><Trash2 className="h-5 w-5" /></div>
                      <div>
                        <h5 className="text-sm font-bold text-red-900">Delete user account?</h5>
                        <p className="mt-1 text-red-700">{getUserDisplayName(deleteTarget.name)} ({deleteTarget.email}) will permanently lose access.</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 items-end gap-3 sm:grid-cols-[minmax(240px,420px)_auto] sm:justify-between">
                      <div>
                        <label className="mb-1 block font-bold text-red-900">Enter your administrator password to confirm</label>
                        <div className="relative">
                          <input
                            type={showDeleteAdminPassword ? 'text' : 'password'}
                            value={deleteAdminPassword}
                            onChange={(e) => setDeleteAdminPassword(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && deleteAdminPassword && !isDeletingUser) handleDeleteUser();
                            }}
                            autoComplete="current-password"
                            className="w-full rounded-lg border border-red-300 bg-white px-3 py-2.5 pr-10 outline-none focus:ring-2 focus:ring-red-600"
                            placeholder="Current admin password"
                          />
                          <button type="button" onClick={() => setShowDeleteAdminPassword((value) => !value)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500" aria-label="Toggle administrator password visibility">
                            {showDeleteAdminPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center justify-end gap-2">
                        <button type="button" onClick={() => { setDeleteTarget(null); setDeleteAdminPassword(''); setShowDeleteAdminPassword(false); }} disabled={isDeletingUser} className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 font-bold text-gray-700 hover:bg-gray-50">Cancel</button>
                        <button type="button" onClick={handleDeleteUser} disabled={isDeletingUser || !deleteAdminPassword} className="inline-flex items-center gap-2 rounded-lg bg-red-700 px-4 py-2.5 font-bold text-white hover:bg-red-800 disabled:cursor-not-allowed disabled:opacity-50">
                          <Trash2 className="h-4 w-4" />
                          {isDeletingUser ? 'Verifying & Deleting...' : 'Confirm Delete'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="overflow-x-auto rounded-xl border shadow-sm">
                <table className="w-full min-w-[860px] text-left">
                  <thead className="bg-gray-100 text-gray-700 uppercase font-bold border-b">
                    <tr>
                      <th className="py-2.5 px-3">Name</th>
                      <th className="py-2.5 px-3">Email Address</th>
                      <th className="py-2.5 px-3">Assigned Role</th>
                      <th className="py-2.5 px-3">Secretariat Department</th>
                      <th className="py-2.5 px-3 text-center">Status</th>
                      <th className="py-2.5 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {users.map((u) => (
                      <tr key={u.id} className="hover:bg-amber-50/30">
                        <td className="py-2.5 px-3 font-bold text-gray-900">{getUserDisplayName(u.name)}</td>
                        <td className="py-2.5 px-3 text-gray-600 font-mono">{u.email}</td>
                        <td className="py-2.5 px-3">
                          <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                            u.role === 'ADMIN' ? 'bg-red-100 text-red-700' :
                            u.role === 'REVIEWER' ? 'bg-amber-100 text-amber-800' :
                            u.role === 'DATA_ENTRY' ? 'bg-blue-100 text-blue-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {getRoleLabel(u.role)}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-gray-600">{u.department || 'General Administration'}</td>
                        <td className="py-2.5 px-3 text-center">
                          <span className={`${u.isActive === false ? 'bg-gray-100 text-gray-700' : 'bg-green-100 text-green-800'} px-2 py-0.5 rounded-full text-[10px] font-bold`}>
                            {u.isActive === false ? 'Inactive' : 'Active'}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          {u.role !== 'ADMIN' && (
                            <button
                              type="button"
                              onClick={() => {
                                setUserMsg(null);
                                setDeleteAdminPassword('');
                                setShowDeleteAdminPassword(false);
                                setDeleteTarget(u);
                              }}
                              title={`Delete ${getUserDisplayName(u.name)}`}
                              className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-1.5 font-bold text-red-700 transition hover:bg-red-50"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                              Delete
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      </div>
    </FullPageWorkspace>
  );
};
