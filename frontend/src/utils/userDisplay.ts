import { UserRole } from '../types';

const ROLE_SUFFIX_PATTERN = /\s*\((?:System Administrator|Data Entry Operator|Reviewing Officer|Read-Only Viewer)\)\s*$/i;

export const getUserDisplayName = (name: string): string =>
  name.replace(ROLE_SUFFIX_PATTERN, '').trim();

export const getRoleLabel = (role: UserRole): string => {
  const labels: Record<UserRole, string> = {
    ADMIN: 'Administrator',
    DATA_ENTRY: 'Data Entry Operator',
    REVIEWER: 'Reviewing Officer',
    READONLY: 'Read-Only Viewer'
  };
  return labels[role];
};
