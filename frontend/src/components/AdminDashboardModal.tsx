import React, { useState, useEffect } from 'react';
import {
  X,
  Shield,
  Users,
  FolderPlus,
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
  EyeOff
} from 'lucide-react';
import { api } from '../services/api';
import { User, ComplaintCategory } from '../types';
import { getRoleLabel, getUserDisplayName } from '../utils/userDisplay';

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
  const [activeTab, setActiveTab] = useState<'profile' | 'users' | 'categories'>('profile');
  const [users, setUsers] = useState<User[]>([]);
  const [categories, setCategories] = useState<ComplaintCategory[]>([]);

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

  // New Category State
  const [newCatName, setNewCatName] = useState('');
  const [newCatCode, setNewCatCode] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');

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
      } else if (activeTab === 'categories') {
        const res = await api.getCategories();
        setCategories(res.categories);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createCategory({
        name: newCatName.trim(),
        code: newCatCode.trim().toUpperCase(),
        description: newCatDesc.trim() || undefined
      });
      alert('Category added successfully!');
      setNewCatName('');
      setNewCatCode('');
      setNewCatDesc('');
      loadAdminData();
    } catch (err: any) {
      alert('Failed to create category: ' + err.message);
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
    <div className="fixed inset-x-0 bottom-0 top-16 sm:top-[70px] z-40 overflow-hidden overscroll-none bg-white">
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
                User Security, Category Governance & System Configuration
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
            <span>Staff Users & Roles (4 Tiers)</span>
          </button>

          <button
            onClick={() => setActiveTab('categories')}
            className={`px-4 py-2 font-bold rounded-t-lg transition flex items-center gap-1.5 ${
              activeTab === 'categories'
                ? 'bg-white text-gray-900 border-t-2 border-amber-600 shadow-sm'
                : 'text-gray-600 hover:text-black'
            }`}
          >
            <FolderPlus className="w-3.5 h-3.5" />
            <span>Complaint Categories Manager</span>
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
              <div className="border rounded-xl overflow-hidden shadow-sm">
                <table className="w-full text-left">
                  <thead className="bg-gray-100 text-gray-700 uppercase font-bold border-b">
                    <tr>
                      <th className="py-2.5 px-3">Name</th>
                      <th className="py-2.5 px-3">Email Address</th>
                      <th className="py-2.5 px-3">Assigned Role</th>
                      <th className="py-2.5 px-3">Secretariat Department</th>
                      <th className="py-2.5 px-3 text-center">Status</th>
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
                          <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded-full text-[10px] font-bold">
                            Active
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: Categories */}
          {activeTab === 'categories' && (
            <div className="space-y-6">
              {/* Form to add category */}
              <form onSubmit={handleCreateCategory} className="bg-amber-50/50 border border-amber-200 rounded-xl p-4 flex flex-wrap gap-3 items-end">
                <div className="w-56">
                  <label className="block font-bold text-gray-700 mb-1">New Category Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Forest & Environment"
                    value={newCatName}
                    onChange={(e) => setNewCatName(e.target.value)}
                    className="w-full border rounded-lg px-2.5 py-1.5 bg-white outline-none"
                  />
                </div>
                <div className="w-36">
                  <label className="block font-bold text-gray-700 mb-1">Code</label>
                  <input
                    type="text"
                    required
                    placeholder="CAT-FOREST"
                    value={newCatCode}
                    onChange={(e) => setNewCatCode(e.target.value)}
                    className="w-full border rounded-lg px-2.5 py-1.5 bg-white outline-none font-mono"
                  />
                </div>
                <div className="flex-grow">
                  <label className="block font-bold text-gray-700 mb-1">Scope / Description</label>
                  <input
                    type="text"
                    placeholder="Brief description of grievances handled under this category"
                    value={newCatDesc}
                    onChange={(e) => setNewCatDesc(e.target.value)}
                    className="w-full border rounded-lg px-2.5 py-1.5 bg-white outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-amber-700 hover:bg-amber-800 text-white font-bold px-4 py-2 rounded-lg transition"
                >
                  + Add Category
                </button>
              </form>

              {/* Existing Categories Table */}
              <div className="border rounded-xl overflow-hidden shadow-sm">
                <table className="w-full text-left">
                  <thead className="bg-gray-100 text-gray-700 uppercase font-bold border-b">
                    <tr>
                      <th className="py-2.5 px-3">Code</th>
                      <th className="py-2.5 px-3">Category Name</th>
                      <th className="py-2.5 px-3">Description</th>
                      <th className="py-2.5 px-3 text-center">Associated Applications</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {categories.map((c) => (
                      <tr key={c.id} className="hover:bg-amber-50/30">
                        <td className="py-2.5 px-3 font-mono font-bold text-amber-800">{c.code}</td>
                        <td className="py-2.5 px-3 font-bold text-gray-900">{c.name}</td>
                        <td className="py-2.5 px-3 text-gray-600">{c.description || '-'}</td>
                        <td className="py-2.5 px-3 text-center font-bold text-blue-700">{c._count?.applications || 0}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}


        </div>
      </div>
    </div>
  );
};
