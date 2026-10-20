import mongoose, { Model, Schema } from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

const commonOptions = {
  versionKey: false as const,
  timestamps: true as const,
  toJSON: { transform: (_doc: unknown, ret: any) => { delete ret._id; return ret; } },
  toObject: { transform: (_doc: unknown, ret: any) => { delete ret._id; return ret; } }
};

const userSchema = new Schema({
  id: { type: Number, unique: true, index: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  role: { type: String, default: 'DATA_ENTRY' },
  department: { type: String, default: 'Assembly Secretariat' },
  phone: String,
  isActive: { type: Boolean, default: true }
}, commonOptions);

const districtSchema = new Schema({
  id: { type: Number, unique: true, index: true },
  code: { type: String, required: true, unique: true },
  name: { type: String, required: true, unique: true },
  state: { type: String, default: 'Bihar' },
  assemblySeatsCount: { type: Number, required: true },
  isActive: { type: Boolean, default: true }
}, commonOptions);

const constituencySchema = new Schema({
  id: { type: Number, unique: true, index: true },
  acNumber: { type: Number, required: true, unique: true },
  acCode: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  reservation: { type: String, default: 'GEN' },
  districtId: { type: Number, required: true, index: true },
  lokSabhaConstituency: String,
  isActive: { type: Boolean, default: true }
}, commonOptions);

const categorySchema = new Schema({
  id: { type: Number, unique: true, index: true },
  name: { type: String, required: true, unique: true },
  code: { type: String, required: true, unique: true },
  description: String,
  isActive: { type: Boolean, default: true }
}, commonOptions);

const applicationSchema = new Schema({
  id: { type: Number, unique: true, index: true },
  applicationId: { type: String, required: true, unique: true },
  dateReceived: { type: Date, default: Date.now },
  applicantName: { type: String, required: true },
  mobileNumber: { type: String, required: true },
  alternateMobile: String,
  address: { type: String, required: true },
  districtId: { type: Number, required: true, index: true },
  constituencyId: { type: Number, index: true },
  customConstituency: String,
  verifiedAcCode: { type: String, required: true },
  isUnverifiedAc: { type: Boolean, default: false },
  categoryId: { type: Number, index: true },
  categoryName: String,
  subject: { type: String, required: true },
  description: { type: String, required: true },
  priority: { type: String, default: 'NORMAL' },
  status: { type: String, default: 'PENDING' },
  assignedEmployee: { type: String, default: 'Unassigned' },
  internalRemarks: String,
  documents: String,
  nextFollowUpDate: Date,
  lastActionTaken: String,
  completedAt: Date,
  completionNotes: String,
  reopenedAt: Date,
  reopenReason: String,
  createdById: Number
}, commonOptions);

const followUpSchema = new Schema({
  id: { type: Number, unique: true, index: true },
  applicationId: { type: Number, required: true, index: true },
  actionTaken: { type: String, required: true },
  reminderNotes: { type: String, required: true },
  previousStatus: String,
  newStatus: String,
  assignedTo: String,
  nextFollowUpDate: Date,
  actionBy: { type: String, required: true }
}, commonOptions);

const auditLogSchema = new Schema({
  id: { type: Number, unique: true, index: true },
  applicationId: { type: Number, index: true },
  entityType: { type: String, required: true },
  action: { type: String, required: true },
  details: { type: String, required: true },
  performedBy: { type: String, required: true },
  ipAddress: String
}, commonOptions);

const settingSchema = new Schema({
  id: { type: Number, unique: true, index: true },
  maxUploadSizeMb: { type: Number, default: 200 },
  supportEmail: String,
  supportPhone: String,
  workingHours: String
}, commonOptions);

const passwordResetSchema = new Schema({
  id: { type: Number, unique: true, index: true },
  email: { type: String, required: true },
  token: { type: String, required: true, unique: true },
  expiresAt: { type: Date, required: true }
}, commonOptions);

const projectSchema = new Schema({
  id: { type: Number, unique: true, index: true },
  referenceId: { type: String, required: true, unique: true },
  department: { type: String, required: true },
  commitment: { type: String, required: true },
  location: { type: String, required: true },
  beneficiaries: String,
  districtId: { type: Number, index: true },
  districtName: String,
  financialStatus: { type: String, required: true },
  sanctionedAmountCr: { type: Number, default: 0 },
  utilizedAmountCr: { type: Number, default: 0 },
  currentStage: { type: String, default: 'UNDER_CONSTRUCTION' },
  verifiedProgress: { type: Number, default: 0 },
  nextMilestone: { type: String, required: true },
  nextMilestoneDate: Date,
  delayOrObstacle: String,
  isDelayed: { type: Boolean, default: false },
  source: { type: String, default: "Hon'ble CM Announcement" },
  communicationStatus: { type: String, default: 'COMPLIANCE_VERIFIED' },
  documents: String,
  createdById: Number
}, commonOptions);

const counterSchema = new Schema({
  name: { type: String, required: true, unique: true },
  value: { type: Number, default: 0 }
}, { versionKey: false });

const models = {
  user: mongoose.models.User || mongoose.model('User', userSchema),
  district: mongoose.models.District || mongoose.model('District', districtSchema),
  assemblyConstituency: mongoose.models.AssemblyConstituency || mongoose.model('AssemblyConstituency', constituencySchema),
  complaintCategory: mongoose.models.ComplaintCategory || mongoose.model('ComplaintCategory', categorySchema),
  application: mongoose.models.Application || mongoose.model('Application', applicationSchema),
  followUp: mongoose.models.FollowUp || mongoose.model('FollowUp', followUpSchema),
  auditLog: mongoose.models.AuditLog || mongoose.model('AuditLog', auditLogSchema),
  systemSetting: mongoose.models.SystemSetting || mongoose.model('SystemSetting', settingSchema),
  passwordResetToken: mongoose.models.PasswordResetToken || mongoose.model('PasswordResetToken', passwordResetSchema),
  projectAnnouncement: mongoose.models.ProjectAnnouncement || mongoose.model('ProjectAnnouncement', projectSchema)
} as Record<string, Model<any>>;

const Counter = mongoose.models.Counter || mongoose.model('Counter', counterSchema);

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function convertWhere(where: any = {}): any {
  if (!where || typeof where !== 'object' || where instanceof Date || where instanceof RegExp) return where;
  if (Array.isArray(where)) return where.map(convertWhere);

  const result: any = {};
  for (const [key, raw] of Object.entries(where)) {
    if (key === 'OR') { result.$or = (raw as any[]).map(convertWhere); continue; }
    if (key === 'AND') { result.$and = (raw as any[]).map(convertWhere); continue; }
    if (key === 'NOT') { result.$nor = [convertWhere(raw)]; continue; }
    if (typeof raw === 'function') { result.id = { $exists: false }; continue; }
    if (!raw || typeof raw !== 'object' || raw instanceof Date || Array.isArray(raw)) {
      result[key] = raw;
      continue;
    }

    const condition: any = raw;
    if ('equals' in condition) result[key] = condition.equals;
    else if ('contains' in condition) result[key] = new RegExp(escapeRegex(String(condition.contains)), condition.mode === 'insensitive' ? 'i' : 'i');
    else if ('startsWith' in condition) result[key] = new RegExp(`^${escapeRegex(String(condition.startsWith))}`, condition.mode === 'insensitive' ? 'i' : '');
    else if ('endsWith' in condition) result[key] = new RegExp(`${escapeRegex(String(condition.endsWith))}$`, condition.mode === 'insensitive' ? 'i' : '');
    else {
      const operators: any = {};
      if ('in' in condition) operators.$in = condition.in;
      if ('notIn' in condition) operators.$nin = condition.notIn;
      if ('not' in condition) operators.$ne = condition.not;
      if ('gt' in condition) operators.$gt = condition.gt;
      if ('gte' in condition) operators.$gte = condition.gte;
      if ('lt' in condition) operators.$lt = condition.lt;
      if ('lte' in condition) operators.$lte = condition.lte;
      result[key] = Object.keys(operators).length ? operators : convertWhere(condition);
    }
  }
  return result;
}

function cleanData(data: any): any {
  return Object.fromEntries(Object.entries(data || {}).filter(([, value]) => value !== undefined));
}

function cleanRecord(record: any): any {
  if (!record) return record;
  const value = typeof record.toObject === 'function' ? record.toObject() : { ...record };
  delete value._id;
  delete value.__v;
  return value;
}

function applySelect(record: any, select?: Record<string, boolean>): any {
  if (!select) return record;
  const selected: any = {};
  for (const [key, enabled] of Object.entries(select)) {
    if (enabled && Object.prototype.hasOwnProperty.call(record, key)) selected[key] = record[key];
  }
  return selected;
}

function sortSpec(orderBy: any): Record<string, 1 | -1> {
  const entries = Array.isArray(orderBy) ? orderBy.flatMap(Object.entries) : Object.entries(orderBy || {});
  return Object.fromEntries(entries.map(([field, direction]) => [field, direction === 'asc' ? 1 : -1])) as Record<string, 1 | -1>;
}

async function nextId(name: string): Promise<number> {
  const counter = await Counter.findOneAndUpdate(
    { name },
    { $inc: { value: 1 } },
    { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
  );
  return counter.value;
}

async function keepCounterAtLeast(name: string, id: number): Promise<void> {
  await Counter.updateOne({ name }, { $max: { value: id } }, { upsert: true });
}

class MongoRepository {
  constructor(private readonly name: string, private readonly model: Model<any>) {}

  async count(args: any = {}): Promise<number> {
    return this.model.countDocuments(convertWhere(args.where || {}));
  }

  async findFirst(args: any = {}): Promise<any> {
    let query = this.model.findOne(convertWhere(args.where || {}));
    const sort = sortSpec(args.orderBy);
    if (Object.keys(sort).length) query = query.sort(sort);
    const record = await query.lean();
    return record ? this.finish(cleanRecord(record), args) : null;
  }

  async findUnique(args: any): Promise<any> {
    return this.findFirst(args);
  }

  async findMany(args: any = {}): Promise<any[]> {
    let query = this.model.find(convertWhere(args.where || {}));
    const sort = sortSpec(args.orderBy);
    if (Object.keys(sort).length) query = query.sort(sort);
    if (args.skip) query = query.skip(args.skip);
    if (args.take !== undefined) query = query.limit(args.take);
    const records = await query.lean();
    return Promise.all(records.map((record: any) => this.finish(cleanRecord(record), args)));
  }

  async create(args: any): Promise<any> {
    const data = cleanData(args.data);
    if (data.id === undefined) data.id = await nextId(this.name);
    else await keepCounterAtLeast(this.name, data.id);
    const created = await this.model.create(data);
    return this.finish(cleanRecord(created), args);
  }

  async update(args: any): Promise<any> {
    const updated = await this.model.findOneAndUpdate(
      convertWhere(args.where),
      { $set: cleanData(args.data) },
      { returnDocument: 'after', runValidators: true }
    ).lean();
    if (!updated) throw new Error(`${this.name} record not found`);
    return this.finish(cleanRecord(updated), args);
  }

  async delete(args: any): Promise<any> {
    const deleted = await this.model.findOneAndDelete(convertWhere(args.where)).lean();
    if (!deleted) throw new Error(`${this.name} record not found`);
    return cleanRecord(deleted);
  }

  async deleteMany(args: any = {}): Promise<{ count: number }> {
    const result = await this.model.deleteMany(convertWhere(args.where || {}));
    return { count: result.deletedCount };
  }

  async upsert(args: any): Promise<any> {
    const existing = await this.model.findOne(convertWhere(args.where)).lean();
    if (existing) return this.update({ where: args.where, data: args.update, include: args.include, select: args.select });
    return this.create({ data: { ...args.create }, include: args.include, select: args.select });
  }

  async aggregate(args: any): Promise<any> {
    const numericFields = [...Object.keys(args._sum || {}), ...Object.keys(args._avg || {})];
    const group: any = { _id: null };
    for (const field of Object.keys(args._sum || {})) group[`sum_${field}`] = { $sum: `$${field}` };
    for (const field of Object.keys(args._avg || {})) group[`avg_${field}`] = { $avg: `$${field}` };
    const match = convertWhere(args.where || {});
    const pipeline: any[] = [];
    if (Object.keys(match).length) pipeline.push({ $match: match });
    if (numericFields.length) pipeline.push({ $group: group });
    const [value = {}] = numericFields.length ? await this.model.aggregate(pipeline) : [{}];
    return {
      _sum: Object.fromEntries(Object.keys(args._sum || {}).map(field => [field, value[`sum_${field}`] || 0])),
      _avg: Object.fromEntries(Object.keys(args._avg || {}).map(field => [field, value[`avg_${field}`] || 0]))
    };
  }

  private async finish(record: any, args: any): Promise<any> {
    const hydrated = args.include ? await hydrateRelations(this.name, record, args.include) : record;
    return applySelect(hydrated, args.select);
  }
}

const repositories: Record<string, MongoRepository> = Object.fromEntries(
  Object.entries(models).map(([name, model]) => [name, new MongoRepository(name, model)])
);

async function related(name: string, many: boolean, where: any, option: any): Promise<any> {
  const args = typeof option === 'object' ? { ...option, where } : { where };
  return many ? repositories[name].findMany(args) : repositories[name].findFirst(args);
}

async function hydrateRelations(name: string, record: any, include: any): Promise<any> {
  const result = { ...record };
  if (name === 'district') {
    if (include.constituencies) result.constituencies = await related('assemblyConstituency', true, { districtId: record.id }, include.constituencies);
    if (include.applications) result.applications = await related('application', true, { districtId: record.id }, include.applications);
    if (include._count) result._count = {
      ...(include._count.select?.constituencies ? { constituencies: await repositories.assemblyConstituency.count({ where: { districtId: record.id } }) } : {}),
      ...(include._count.select?.applications ? { applications: await repositories.application.count({ where: { districtId: record.id } }) } : {})
    };
  } else if (name === 'assemblyConstituency' && include.district) {
    result.district = await related('district', false, { id: record.districtId }, include.district);
  } else if (name === 'complaintCategory') {
    if (include.applications) result.applications = await related('application', true, { categoryId: record.id }, include.applications);
    if (include._count) result._count = {
      ...(include._count.select?.applications ? { applications: await repositories.application.count({ where: { categoryId: record.id } }) } : {})
    };
  } else if (name === 'application') {
    if (include.district) result.district = await related('district', false, { id: record.districtId }, include.district);
    if (include.constituency) result.constituency = record.constituencyId ? await related('assemblyConstituency', false, { id: record.constituencyId }, include.constituency) : null;
    if (include.category) result.category = record.categoryId ? await related('complaintCategory', false, { id: record.categoryId }, include.category) : null;
    if (include.followUps) result.followUps = await related('followUp', true, { applicationId: record.id }, include.followUps);
    if (include.auditLogs) result.auditLogs = await related('auditLog', true, { applicationId: record.id }, include.auditLogs);
    if (include._count) result._count = {
      ...(include._count.select?.followUps ? { followUps: await repositories.followUp.count({ where: { applicationId: record.id } }) } : {})
    };
  } else if (name === 'projectAnnouncement' && include.district) {
    result.district = record.districtId ? await related('district', false, { id: record.districtId }, include.district) : null;
  }
  return result;
}

export const db = repositories;

export async function connectDatabase(): Promise<void> {
  const uri = process.env.MONGODB_URI?.trim();
  if (!uri) throw new Error('MONGODB_URI is not configured. Add it to the project root .env before starting the server.');
  await mongoose.connect(uri, {
    dbName: process.env.MONGODB_DB_NAME?.trim() || 'sammohan',
    serverSelectionTimeoutMS: 10000
  });
  console.log('✅ MongoDB connected successfully');
}

export async function disconnectDatabase(): Promise<void> {
  await mongoose.disconnect();
}

export { models };
