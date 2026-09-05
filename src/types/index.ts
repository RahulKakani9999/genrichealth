export type Role = "admin" | "doctor" | "patient";

export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  role: Role;
  clinicId?: string;
  providerId?: string;
  patientId?: string;
  initials: string;
  jobTitle: string;
}

export interface Clinic {
  id: string;
  name: string;
  afterHoursNumber: string;
  clinicDoctorFee: number;
  telehealthFee: number;
  greetingScript: string;
  practiceManagerPhone: string;
  timezone: string;
  isActive: boolean;
  createdAt: string;
}

export interface Provider {
  id: string;
  clinicId: string | null;
  fullName: string;
  phoneNumber: string;
  isTelehealth: boolean;
  isActive: boolean;
  specialty: string;
}

export interface Patient {
  id: string;
  fullName: string;
  dateOfBirth: string;
  phoneNumber: string;
  address: string;
  createdAt: string;
}

export type CallOutcome =
  | "completed"
  | "redirected_to_000"
  | "abandoned"
  | "failed";

export interface Call {
  id: string;
  clinicId: string;
  patientId: string | null;
  twilioCallSid: string;
  fromNumber: string;
  startedAt: string;
  endedAt: string | null;
  outcome: CallOutcome;
  durationSeconds: number;
  recordingUrl: string | null;
  transcriptUrl: string | null;
}

export type BookingStatus =
  | "NEW"
  | "DETAILS_CONFIRMED"
  | "SERVICE_SELECTED"
  | "AWAITING_PAYMENT"
  | "PAID"
  | "CONTACTING_DOCTOR"
  | "DOCTOR_ACCEPTED"
  | "BRIDGED"
  | "COMPLETED"
  | "ESCALATED";

export interface Booking {
  id: string;
  callId: string;
  clinicId: string;
  patientId: string;
  serviceType: "clinic_doctor" | "telehealth";
  feeAmount: number;
  status: BookingStatus;
  currentStep: string;
  providerId: string | null;
  scheduledFor: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  id: string;
  bookingId: string;
  stripeSessionId: string;
  amount: number;
  currency: string;
  status: "pending" | "paid" | "failed" | "expired" | "refunded";
  linkSentAt: string;
  paidAt: string | null;
}

export interface RosterEntry {
  id: string;
  clinicId: string;
  providerId: string;
  startsAt: string;
  endsAt: string;
  isBackup: boolean;
}

export interface CallAttempt {
  id: string;
  bookingId: string;
  providerId: string;
  attemptNumber: number;
  escalationLevel: "primary" | "backup" | "practice_manager";
  dialedAt: string;
  outcome: "answered" | "no_answer" | "busy" | "declined";
}

export interface ConsultationNote {
  id: string;
  bookingId: string;
  providerId: string;
  patientId: string;
  chiefComplaint: string;
  assessment: string;
  prescription: string;
  followUpRequired: boolean;
  followUpNotes: string;
  createdAt: string;
}

export interface Availability {
  id: string;
  providerId: string;
  startsAt: string;
  endsAt: string;
  isAvailable: boolean;
  reason: string;
}