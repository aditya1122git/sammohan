export type UserRole = 'ADMIN' | 'DATA_ENTRY' | 'REVIEWER' | 'READONLY';

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  department?: string;
  phone?: string;
  isActive: boolean;
}

export interface District {
  id: number;
  code: string;
  name: string;
  state: string;
  assemblySeatsCount: number;
  isActive: boolean;
  _count?: {
    constituencies?: number;
    applications?: number;
  };
}

export interface AssemblyConstituency {
  id: number;
  acNumber: number;
  acCode: string;
  name: string;
  reservation: 'GEN' | 'SC' | 'ST';
  districtId: number;
  district?: {
    id: number;
    name: string;
    code: string;
  };
  lokSabhaConstituency?: string;
  isActive: boolean;
}

export interface ComplaintCategory {
  id: number;
  name: string;
  code: string;
  description?: string;
  isActive: boolean;
  _count?: {
    applications?: number;
  };
}

export type ApplicationPriority = 'IMPORTANT' | 'NORMAL';
export type ApplicationStatus = 'PENDING' | 'IN_PROGRESS' | 'AWAITING_INFO' | 'COMPLETED' | 'DISPOSED' | 'REJECTED';

export interface FollowUpRecord {
  id: number;
  applicationId: number;
  actionTaken: string;
  reminderNotes: string;
  previousStatus?: string;
  newStatus?: string;
  assignedTo?: string;
  nextFollowUpDate?: string;
  actionBy: string;
  createdAt: string;
  user?: {
    id?: number;
    name: string;
    email?: string;
  };
}

export interface Application {
  id: number;
  applicationId: string;
  dateReceived: string;
  applicantName: string;
  fatherOrHusbandName?: string | null;
  mobileNumber: string;
  alternateMobile?: string;
  address: string;
  districtId: number;
  district: District;
  constituencyId?: number | null;
  constituency?: AssemblyConstituency | null;
  assemblyConstituency?: AssemblyConstituency | null;
  customConstituency?: string | null;
  isUnverifiedAc?: boolean;
  verifiedAcCode: string;
  categoryId?: number | null;
  category?: ComplaintCategory | null;
  categoryName?: string;
  subject: string;
  description: string;
  priority: ApplicationPriority;
  status: ApplicationStatus;
  assignedEmployee: string;
  internalRemarks?: string;
  documents?: string;
  nextFollowUpDate?: string;
  lastActionTaken?: string;
  completedAt?: string;
  completionNotes?: string;
  reopenedAt?: string;
  reopenReason?: string;
  createdAt: string;
  updatedAt: string;
  followUps?: FollowUpRecord[];
  // Calculated frontend properties
  daysSinceReceipt?: number;
  daysSinceLastUpdate?: number;
  isOverdue?: boolean;
}

export interface DashboardStats {
  total: number;
  important: number;
  normal: number;
  pending: number;
  inProgress: number;
  awaitingInfo: number;
  completed: number;
  overdue: number;
  receivedToday: number;
  activeFollowUps?: number;
  disposed?: number;
  timestamp: string;
}

export interface DistrictStat {
  districtId: number;
  districtCode: string;
  districtName: string;
  totalSeats: number;
  totalApplications: number;
  importantCount: number;
  normalCount: number;
  pendingCount: number;
  completedCount: number;
  resolutionRate: number;
}

export interface CategoryStat {
  categoryId: number;
  categoryName: string;
  categoryCode: string;
  total: number;
  importantCount: number;
  normalCount: number;
  pendingCount: number;
  completedCount: number;
}

export interface SystemSettings {
  maxUploadSizeMb: number;
  supportEmail: string | null;
  supportPhone: string | null;
  workingHours: string | null;
  allowedExtensions: string[];
  hasConfiguredEmail: boolean;
  hasConfiguredPhone: boolean;
  hasConfiguredHours: boolean;
}

export type ProjectStage = 'PLANNING' | 'TENDERING' | 'UNDER_CONSTRUCTION' | 'COMMISSIONED' | 'OPERATIONAL';

export interface ProjectAnnouncement {
  id: number;
  referenceId: string;
  department: string;
  commitment: string;
  location: string;
  beneficiaries?: string | null;
  districtId?: number | null;
  districtName?: string | null;
  financialStatus: string;
  sanctionedAmountCr: number;
  utilizedAmountCr: number;
  currentStage: ProjectStage;
  verifiedProgress: number; // 0-100%
  nextMilestone: string;
  nextMilestoneDate?: string | null;
  delayOrObstacle?: string | null;
  isDelayed: boolean;
  source: string;
  communicationStatus: string;
  documents?: string | null;
  createdById?: number | null;
  createdAt: string;
  updatedAt: string;
  district?: District | null;
}

export interface ProjectStats {
  totalAnnouncements: number;
  ongoingProjects: number;
  completedProjects: number;
  delayedProjects: number;
  totalSanctionedCr: number;
  totalUtilizedCr: number;
  avgProgress: number;
  departmentBreakdown: Array<{
    name: string;
    count: number;
    sanctionedCr: number;
    utilizedCr: number;
  }>;
  districtBreakdown: Array<{
    name: string;
    count: number;
  }>;
  stageBreakdown: Record<string, number>;
  communicationBreakdown: Record<string, number>;
}

