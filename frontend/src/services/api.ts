import {
  User,
  District,
  AssemblyConstituency,
  ComplaintCategory,
  Application,
  DashboardStats,
  DistrictStat,
  CategoryStat,
  ProjectAnnouncement,
  ProjectStats
} from '../types';

const API_BASE = '/api';

function getHeaders(isFormData = false): HeadersInit {
  const token = localStorage.getItem('bacms_token');
  const headers: Record<string, string> = {};
  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

export const api = {
  // --- Auth ---
  async login(credentials: { email?: string; username?: string; password: string; captchaId?: string; captchaCode?: string } | string, pwd?: string): Promise<{ token: string; user: User }> {
    let payload: any;
    if (typeof credentials === 'string') {
      payload = { email: credentials, password: pwd };
    } else {
      payload = credentials;
    }

    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Login failed');
    localStorage.setItem('bacms_token', data.token);
    return data;
  },

  async getCaptcha(): Promise<{ captchaId: string; svgDataUrl: string; code?: string }> {
    const res = await fetch(`${API_BASE}/auth/captcha?t=${Date.now()}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to generate CAPTCHA');
    return data;
  },

  async forgotPassword(email: string): Promise<{ success: boolean; message: string; resetToken?: string }> {
    const res = await fetch(`${API_BASE}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to request password reset');
    return data;
  },

  async resetPassword(token: string, newPassword: string): Promise<{ success: boolean; message: string }> {
    const res = await fetch(`${API_BASE}/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, newPassword })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Password reset failed');
    return data;
  },

  async demoSwitch(role: string): Promise<{ token: string; user: User }> {
    const res = await fetch(`${API_BASE}/auth/demo-switch`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Demo switch failed');
    localStorage.setItem('bacms_token', data.token);
    return data;
  },

  async getMe(): Promise<{ user: User }> {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Session expired');
    return data;
  },

  async updateMyProfile(profile: { name: string; email: string; department?: string; phone?: string }): Promise<{ user: User; token: string; message: string }> {
    const res = await fetch(`${API_BASE}/auth/me`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify(profile)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update profile');
    if (data.token) localStorage.setItem('bacms_token', data.token);
    return data;
  },

  async changePassword(currentPassword: string, newPassword: string): Promise<{ success: boolean; message: string }> {
    const res = await fetch(`${API_BASE}/auth/change-password`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ currentPassword, newPassword })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to change password');
    return data;
  },

  async logout(): Promise<void> {
    const token = localStorage.getItem('bacms_token');
    if (token) {
      try {
        await fetch(`${API_BASE}/auth/logout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
      } catch (e) {
        // Ignore network failure during logout
      }
    }
    localStorage.removeItem('bacms_token');
  },

  async getUsers(): Promise<{ users: User[] }> {
    const res = await fetch(`${API_BASE}/auth/users`, { headers: getHeaders() });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch users');
    return data;
  },

  async createUser(payload: {
    name: string;
    email: string;
    password: string;
    role: User['role'];
    department?: string;
    phone?: string;
  }): Promise<{ user: User }> {
    const res = await fetch(`${API_BASE}/auth/users`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to create user');
    return data;
  },

  async deleteUser(userId: number, currentPassword: string): Promise<{ success: boolean; message: string }> {
    const res = await fetch(`${API_BASE}/auth/users/${userId}`, {
      method: 'DELETE',
      headers: getHeaders(),
      body: JSON.stringify({ currentPassword })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to delete user');
    return data;
  },

  // --- Master Data ---
  async getDistricts(): Promise<{ districts: District[] }> {
    const res = await fetch(`${API_BASE}/master/districts`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch districts');
    return data;
  },

  async getConstituencies(districtId?: number): Promise<{ constituencies: AssemblyConstituency[] }> {
    const url = districtId
      ? `${API_BASE}/master/constituencies?districtId=${districtId}`
      : `${API_BASE}/master/constituencies`;
    const res = await fetch(url);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch constituencies');
    return data;
  },

  async getValidationReport(): Promise<any> {
    const res = await fetch(`${API_BASE}/master/validation-report`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch validation report');
    return data;
  },

  async previewImportConstituencies(formData: FormData): Promise<any> {
    const res = await fetch(`${API_BASE}/master/import/preview-constituencies`, {
      method: 'POST',
      headers: getHeaders(true),
      body: formData
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'CSV import validation failed');
    return data;
  },

  // --- Categories ---
  async getCategories(): Promise<{ categories: ComplaintCategory[] }> {
    const res = await fetch(`${API_BASE}/categories`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch categories');
    return data;
  },

  async createCategory(cat: { name: string; code: string; description?: string }): Promise<any> {
    const res = await fetch(`${API_BASE}/categories`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(cat)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to create category');
    return data;
  },

  // --- Applications ---
  async getApplications(params: Record<string, any> = {}): Promise<{
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
    applications: Application[];
  }> {
    const query = new URLSearchParams();
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== null && v !== '') {
        query.set(k, String(v));
      }
    }
    const res = await fetch(`${API_BASE}/applications?${query.toString()}`, {
      headers: getHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch applications');
    return data;
  },

  async getApplication(idOrCode: string | number): Promise<{ application: Application }> {
    const res = await fetch(`${API_BASE}/applications/${idOrCode}`, {
      headers: getHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch application');
    return data;
  },

  async updateApplication(id: number, payload: any): Promise<{ success: boolean; application: Application }> {
    const res = await fetch(`${API_BASE}/applications/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update application');
    return data;
  },

  async deleteApplication(id: number | string): Promise<{ success: boolean; message: string }> {
    const res = await fetch(`${API_BASE}/applications/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to delete application');
    return data;
  },

  async bulkDeleteApplications(ids: (number | string)[]): Promise<{ success: boolean; count: number; message: string }> {
    const res = await fetch(`${API_BASE}/applications/bulk-delete`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ ids })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to delete applications');
    return data;
  },

  async clearAllApplications(): Promise<{ success: boolean; count: number; message: string }> {
    const res = await fetch(`${API_BASE}/applications/clear-all`, {
      method: 'POST',
      headers: getHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to clear all applications');
    return data;
  },

  getExportCsvUrl(params: Record<string, any> = {}): string {
    const query = new URLSearchParams();
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== null && v !== '') {
        query.set(k, String(v));
      }
    }
    const token = localStorage.getItem('bacms_token');
    if (token) {
      query.set('token', token);
    }
    return `${API_BASE}/applications/export/csv?${query.toString()}`;
  },

  // --- Reminders & Follow-Ups ---
  async getReminders(filterOverdue = false): Promise<{ reminders: Application[] }> {
    const res = await fetch(`${API_BASE}/reminders?filterOverdue=${filterOverdue}`, {
      headers: getHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch reminders');
    return data;
  },

  async addFollowUp(applicationId: number, payload: {
    actionTaken: string;
    reminderNotes: string;
    nextFollowUpDate?: string;
    reassignEmployee?: string;
    newStatus?: string;
  }): Promise<any> {
    const res = await fetch(`${API_BASE}/reminders/${applicationId}/add`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to add follow-up');
    return data;
  },

  async reopenApplication(applicationId: number, payload: {
    reopenReason: string;
    assignedEmployee?: string;
    nextFollowUpDate?: string;
  }): Promise<any> {
    const res = await fetch(`${API_BASE}/reminders/${applicationId}/reopen`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to reopen application');
    return data;
  },

  // --- Reports & Analytics ---
  async getDashboardStats(): Promise<DashboardStats> {
    const res = await fetch(`${API_BASE}/reports/dashboard-stats`, {
      headers: getHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch dashboard stats');
    return data;
  },

  async getDistrictReports(): Promise<{ districts: DistrictStat[] }> {
    const res = await fetch(`${API_BASE}/reports/district-wise`, {
      headers: getHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch district reports');
    return data;
  },

  async getCategoryReports(): Promise<{ categories: CategoryStat[] }> {
    const res = await fetch(`${API_BASE}/reports/category-wise`, {
      headers: getHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch category reports');
    return data;
  },

  async getAgeingReport(): Promise<any> {
    const res = await fetch(`${API_BASE}/reports/ageing`, {
      headers: getHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch ageing report');
    return data;
  },

  async getEmployeeWorkload(): Promise<any> {
    const res = await fetch(`${API_BASE}/reports/employee-workload`, {
      headers: getHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch employee workload');
    return data;
  },

  // --- Upload Files with Progress Tracking (up to 200MB) ---
  uploadFiles(files: FileList | File[], onProgress?: (percent: number) => void): Promise<{ files: any[] }> {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        formData.append('files', files[i]);
      }

      const xhr = new XMLHttpRequest();
      xhr.open('POST', `${API_BASE}/upload`);
      xhr.timeout = 10 * 60 * 1000; // 10 minute timeout for large 200MB transfers

      const token = localStorage.getItem('bacms_token');
      if (token) {
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      }

      if (xhr.upload && onProgress) {
        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const percent = Math.round((event.loaded / event.total) * 100);
            onProgress(percent);
          }
        };
      }

      xhr.onload = () => {
        try {
          const data = JSON.parse(xhr.responseText);
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve(data);
          } else {
            reject(new Error(data.error || `Upload failed with HTTP status ${xhr.status}`));
          }
        } catch (e) {
          reject(new Error('Invalid server response during upload'));
        }
      };

      xhr.onerror = () => {
        reject(new Error('Network connection error during file upload. Please check connectivity.'));
      };

      xhr.ontimeout = () => {
        reject(new Error('File upload timed out. Large files up to 200MB require sufficient network bandwidth.'));
      };

      xhr.onabort = () => {
        reject(new Error('File upload was cancelled.'));
      };

      xhr.send(formData);
    });
  },

  // --- Settings ---
  async getSettings(): Promise<{ settings: any }> {
    const res = await fetch(`${API_BASE}/settings`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch settings');
    return data;
  },

  async updateSettings(payload: any): Promise<{ success: boolean; settings: any }> {
    const res = await fetch(`${API_BASE}/settings`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update settings');
    return data;
  },

  // --- Announcement & Project Tracking ---
  async getProjectStats(): Promise<{ success: boolean; stats: ProjectStats }> {
    const res = await fetch(`${API_BASE}/projects/stats`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch project stats');
    return data;
  },

  async getProjects(params: {
    search?: string;
    department?: string;
    stage?: string;
    status?: string;
    district?: string;
    source?: string;
    communicationStatus?: string;
    page?: number;
    limit?: number;
  } = {}): Promise<{ success: boolean; total: number; page: number; totalPages: number; projects: ProjectAnnouncement[] }> {
    const query = new URLSearchParams();
    if (params.search) query.set('search', params.search);
    if (params.department) query.set('department', params.department);
    if (params.stage) query.set('stage', params.stage);
    if (params.status) query.set('status', params.status);
    if (params.district) query.set('district', params.district);
    if (params.source) query.set('source', params.source);
    if (params.communicationStatus) query.set('communicationStatus', params.communicationStatus);
    if (params.page) query.set('page', params.page.toString());
    if (params.limit) query.set('limit', params.limit.toString());

    const res = await fetch(`${API_BASE}/projects?${query.toString()}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch projects');
    return data;
  },

  async getProject(id: number | string): Promise<{ success: boolean; project: ProjectAnnouncement }> {
    const res = await fetch(`${API_BASE}/projects/${id}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch project');
    return data;
  },

  async createProject(payload: Partial<ProjectAnnouncement>): Promise<{ success: boolean; project: ProjectAnnouncement }> {
    const res = await fetch(`${API_BASE}/projects`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to create project record');
    return data;
  },

  async updateProject(id: number, payload: Partial<ProjectAnnouncement>): Promise<{ success: boolean; project: ProjectAnnouncement }> {
    const res = await fetch(`${API_BASE}/projects/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update project record');
    return data;
  },

  async deleteProject(id: number): Promise<{ success: boolean; message: string }> {
    const res = await fetch(`${API_BASE}/projects/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to delete project record');
    return data;
  },

  async clearAllProjects(): Promise<{ success: boolean; count: number; message: string }> {
    const res = await fetch(`${API_BASE}/projects/clear-all`, {
      method: 'POST',
      headers: getHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to clear project records');
    return data;
  }
};
