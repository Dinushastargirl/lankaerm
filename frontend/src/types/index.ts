export type UserRole = 'ADMIN' | 'DOCTOR' | 'NURSE' | 'RECEPTIONIST' | 'PATIENT' | 'LAB_TECHNICIAN' | 'PHARMACIST';

export interface User {
  id: number;
  username: string;
  email: string;
  fullName: string;
  role: UserRole;
  active: boolean;
  permissions: string[];
}

export interface Patient {
  id: number;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  email: string;
  phoneNumber: string;
  address: string;
  insuranceProvider: string;
  insurancePolicyNumber: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  createdAt: string;
}

export interface MedicalRecord {
  id: number;
  patientId: number;
  diagnosis: string;
  symptoms: string;
  prescriptions: string;
  notes: string;
  bloodPressure: string;
  heartRate: string;
  temperature: string;
  recordedBy: string;
  createdAt: string;
}

export interface Appointment {
  id: number;
  patientId: number;
  patientName: string;
  doctorName: string;
  appointmentDate: string;
  appointmentTime: string;
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';
  reason: string;
}
