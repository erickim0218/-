import { PaymentRecord, ManagedUser } from '../types';

export const INITIAL_PAYMENTS: PaymentRecord[] = [];

export const INITIAL_MANAGED_USERS: ManagedUser[] = [
  {
    id: 'usr-admin-01',
    username: 'admin',
    password: 'password123',
    name: '총괄 관리자',
    email: 'admin@reposition.kr',
    phone: '010-9999-8888',
    careerLevel: '10년차 이상',
    tier: 'BOOTCAMP',
    isAdmin: true,
    joinedDate: '2026-01-01',
    lastLoginDate: '2026-09-05 10:00',
    targetJob: '시스템 총괄 / 대표 운영자',
    totalSpent: 0,
    notes: '시스템 최고 관리자 계정',
    status: '활성'
  }
];
