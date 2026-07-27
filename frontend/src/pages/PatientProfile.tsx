import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../store/AuthContext';
import { apiRequest } from '../services/api';
import {
  User,
  Calendar,
  Activity,
  Pill,
  FlaskConical,
  CreditCard,
  ChevronLeft,
  Plus,
  AlertTriangle,
  Clock,
  Briefcase
} from 'lucide-react';

interface Patient {
  id: string;
  medicalRecordNumber: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  email: string;
  phoneNumber: string;
  address: string;
  insuranceProvider: string;
  insurancePolicyNumber: string;
  allergies: string;
  medicalHistory: string;
}

export const PatientProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [patient, setPatient] = useState<Patient | null>(null);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [encounters, setEncounters] = useState<any[]>([]);
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [labOrders, setLabOrders] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Sri Lanka demo fallback data
  const mockPatient: Patient = {
    id: id || 'demo-1001',
    medicalRecordNumber: 'MRN-1001',
    firstName: 'Kamal',
    lastName: 'Silva',
    dateOfBirth: '1980-05-12',
    gender: 'Male',
    email: 'kamal.silva@gmail.com',
    phoneNumber: '+94 77 123 4567',
    address: '12 Galle Road, Colombo 03, Sri Lanka',
    insuranceProvider: 'Sri Lanka Insurance',
    insurancePolicyNumber: 'SLI-449102',
    allergies: 'Penicillin, Shellfish',
    medicalHistory: 'Diagnosed with Type 2 Diabetes in 2021. Managed via Metformin. History of seasonal Dengue in 2024.'
  };

  const mockAppointments = [
    { id: '1', appointmentDate: '2026-07-28', appointmentTime: '10:30 AM', status: 'SCHEDULED', reason: 'Routine Diabetes follow-up checkup' },
    { id: '2', appointmentDate: '2026-07-10', appointmentTime: '02:15 PM', status: 'COMPLETED', reason: 'Vitals tracking & blood sugar profile' }
  ];

  const mockEncounters = [
    {
      id: 'enc-1',
      createdAt: '2026-07-10T14:15:00Z',
      doctorName: 'Dr. Kanishka Perera',
      clinicalNotes: 'Patient complains of occasional nocturnal polyuria. Blood sugar fasting levels have been stable between 110-120 mg/dL.',
      treatmentPlan: 'Adjust diet plan. Increase daily physical workout to 30 mins. Recheck HbA1c in 3 months.',
      bloodPressure: '120/80',
      heartRate: '72',
      temperature: '98.4 F',
      respiratoryRate: '16',
      icd10Code: 'E11.9',
      diagnosisDescription: 'Type 2 Diabetes Mellitus without complications',
      severity: 'MODERATE'
    }
  ];

  const mockPrescriptions = [
    {
      id: 'rx-1',
      status: 'DISPENSED',
      createdAt: '2026-07-10T14:20:00Z',
      doctorName: 'Dr. Kanishka Perera',
      items: [
        { medicationName: 'Metformin Hydrochloride', dosage: '1 tablet', frequency: 'Twice daily', duration: '30 days', instructions: 'Take with morning and evening meals.' }
      ]
    }
  ];

  const mockLabOrders = [
    { id: 'lab-1', testName: 'HbA1c Blood Sugar Profile', status: 'COMPLETED', createdAt: '2026-07-10T14:25:00Z', resultData: '6.4%', comments: 'Good metabolic glycemic control. Continue current medication guidelines.' }
  ];

  const mockInvoices = [
    { id: 'inv-1', invoiceNumber: 'INV-17892019', amount: 1500.00, status: 'PAID', createdAt: '2026-07-10T14:30:00Z' }
  ];

  useEffect(() => {
    fetchProfileData();
  }, [id]);

  const fetchProfileData = async () => {
    setLoading(true);
    try {
      // Try to fetch patient details from backend
      const pData = await apiRequest<Patient>(`/patients/${id}`);
      setPatient(pData);
      
      // Fetch associated details
      const appData = await apiRequest<any[]>(`/appointments/patient/${id}`).catch(() => mockAppointments);
      setAppointments(appData);
      
      const encData = await apiRequest<any[]>(`/encounters/patient/${id}`).catch(() => mockEncounters);
      setEncounters(encData);

      const rxData = await apiRequest<any[]>(`/prescriptions/patient/${id}`).catch(() => mockPrescriptions);
      setPrescriptions(rxData);

      const labData = await apiRequest<any[]>(`/laboratory/orders/patient/${id}`).catch(() => mockLabOrders);
      setLabOrders(labData);

      const invData = await apiRequest<any[]>(`/billing/invoices/patient/${id}`).catch(() => mockInvoices);
      setInvoices(invData);

    } catch (err) {
      console.warn('API error, loading Sri Lankan mock profile fallbacks.');
      setPatient(mockPatient);
      setAppointments(mockAppointments);
      setEncounters(mockEncounters);
      setPrescriptions(mockPrescriptions);
      setLabOrders(mockLabOrders);
      setInvoices(mockInvoices);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-clinical-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="text-center py-12 text-slate-400">Patient chart could not be loaded.</div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back button */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/patients')}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-semibold"
        >
          <ChevronLeft className="h-4 w-4" /> Back to Directories
        </button>

        <div className="flex gap-2">
          {user?.role === 'RECEPTIONIST' && (
            <button
              onClick={() => navigate('/appointments')}
              className="flex items-center gap-1.5 rounded-xl bg-clinical-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-clinical-500 transition-all shadow-md active:scale-98"
            >
              <Plus className="h-3.5 w-3.5" /> Book Appointment
            </button>
          )}
          {user?.role === 'DOCTOR' && (
            <button
              onClick={() => navigate('/consultations')}
              className="flex items-center gap-1.5 rounded-xl bg-clinical-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-clinical-500 transition-all shadow-md active:scale-98"
            >
              <Activity className="h-3.5 w-3.5" /> Launch Consultation
            </button>
          )}
        </div>
      </div>

      {/* Grid Profile header */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Core demographic card */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 flex flex-col items-center text-center">
          <div className="h-20 w-20 rounded-full bg-clinical-500/10 flex items-center justify-center border border-clinical-500/20 text-clinical-400 mb-4 shadow-inner">
            <User className="h-10 w-10 animate-pulse" />
          </div>
          <h2 className="text-xl font-bold text-white">{patient.firstName} {patient.lastName}</h2>
          <span className="text-xs font-bold text-clinical-400 mt-1 px-3 py-1 rounded-full bg-clinical-500/10 border border-clinical-500/20 tracking-wider">
            {patient.medicalRecordNumber}
          </span>

          <div className="w-full border-t border-slate-800 my-4"></div>

          <div className="w-full text-left space-y-2.5 text-sm">
            <div className="flex justify-between"><span className="text-slate-500 font-medium">Gender</span><span className="text-slate-300 font-semibold">{patient.gender}</span></div>
            <div className="flex justify-between"><span className="text-slate-500 font-medium">Birthdate</span><span className="text-slate-300 font-semibold">{patient.dateOfBirth}</span></div>
            <div className="flex justify-between"><span className="text-slate-500 font-medium">Phone</span><span className="text-slate-300 font-semibold">{patient.phoneNumber}</span></div>
            <div className="flex justify-between"><span className="text-slate-500 font-medium">Email</span><span className="text-slate-300 font-semibold break-all">{patient.email}</span></div>
            <div className="flex justify-between"><span className="text-slate-500 font-medium">Address</span><span className="text-slate-300 font-semibold text-right break-words max-w-[180px]">{patient.address}</span></div>
          </div>
        </div>

        {/* Clinical alerts & History */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 md:col-span-2 space-y-6">
          <div>
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2 mb-2">
              <AlertTriangle className="h-4 w-4 text-amber-500" /> Allergies Warnings
            </h3>
            <div className="p-3 bg-red-500/5 rounded-xl border border-red-500/10 text-red-400 text-sm font-semibold">
              {patient.allergies || 'No allergies logged.'}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2 mb-2">
              <Briefcase className="h-4 w-4 text-clinical-400" /> Chronic Medical History
            </h3>
            <div className="text-sm text-slate-300 bg-slate-950 p-4 rounded-xl leading-relaxed whitespace-pre-line border border-slate-800/50">
              {patient.medicalHistory || 'No previous clinical logs found.'}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Timeline Medical History (Encounters) */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2 mb-2">
            <Clock className="h-4 w-4 text-clinical-400" /> Consultation Timeline
          </h3>

          {encounters.length === 0 ? (
            <div className="text-center py-6 text-sm text-slate-500">No encounters logged yet.</div>
          ) : (
            <div className="relative border-l-2 border-slate-800 pl-4 ml-2 space-y-6">
              {encounters.map((enc) => (
                <div key={enc.id} className="relative">
                  {/* Point */}
                  <div className="absolute -left-[23px] top-1.5 h-3.5 w-3.5 rounded-full bg-clinical-500 border-2 border-slate-950"></div>
                  
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-clinical-400 font-bold">{new Date(enc.createdAt).toLocaleDateString()}</span>
                      <span className="text-slate-500 font-medium">{enc.doctorName}</span>
                    </div>
                    <div className="rounded-xl bg-slate-950 p-3.5 space-y-2 border border-slate-850">
                      <div>
                        <span className="text-[10px] font-bold text-slate-500 uppercase">Diagnosis Code</span>
                        <p className="text-sm text-slate-300 font-semibold">{enc.icd10Code} - {enc.diagnosisDescription}</p>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-slate-500 uppercase">Clinical Notes</span>
                        <p className="text-xs text-slate-400 italic leading-relaxed">{enc.clinicalNotes}</p>
                      </div>
                      {enc.bloodPressure && (
                        <div className="grid grid-cols-4 gap-2 pt-2 border-t border-slate-900 text-center">
                          <div>
                            <span className="text-[9px] text-slate-500 font-bold block">BP</span>
                            <span className="text-xs text-slate-300 font-semibold">{enc.bloodPressure}</span>
                          </div>
                          <div>
                            <span className="text-[9px] text-slate-500 font-bold block">Pulse</span>
                            <span className="text-xs text-slate-300 font-semibold">{enc.heartRate} bpm</span>
                          </div>
                          <div>
                            <span className="text-[9px] text-slate-500 font-bold block">Temp</span>
                            <span className="text-xs text-slate-300 font-semibold">{enc.temperature}</span>
                          </div>
                          <div>
                            <span className="text-[9px] text-slate-500 font-bold block">RR</span>
                            <span className="text-xs text-slate-300 font-semibold">{enc.respiratoryRate}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Labs, Prescriptions & Bills split */}
        <div className="space-y-6">

          {/* Clinic Appointments */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Calendar className="h-4 w-4 text-clinical-400" /> Clinic Appointments
            </h3>
            {appointments.length === 0 ? (
              <div className="text-center py-4 text-xs text-slate-500">No scheduled appointments.</div>
            ) : (
              <div className="space-y-3">
                {appointments.map((app) => (
                  <div key={app.id} className="rounded-xl bg-slate-950 p-3.5 border border-slate-850 flex justify-between items-center">
                    <div>
                      <h4 className="text-sm font-bold text-slate-300">{app.reason}</h4>
                      <p className="text-xs text-slate-500 font-semibold mt-0.5">
                        Date: {app.appointmentDate} at {app.appointmentTime}
                      </p>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-clinical-500/10 text-clinical-400 border border-clinical-500/20 uppercase">
                      {app.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Active Prescriptions */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Pill className="h-4 w-4 text-clinical-400" /> Active Medications
            </h3>
            {prescriptions.length === 0 ? (
              <div className="text-center py-4 text-xs text-slate-500">No prescriptions.</div>
            ) : (
              <div className="space-y-3">
                {prescriptions.map((rx) => (
                  <div key={rx.id} className="rounded-xl bg-slate-950 p-3.5 border border-slate-850 flex justify-between items-start">
                    <div className="space-y-1">
                      {rx.items.map((item: any, idx: number) => (
                        <div key={idx}>
                          <h4 className="text-sm font-bold text-slate-300">{item.medicationName}</h4>
                          <p className="text-xs text-slate-500 font-medium mt-0.5">
                            {item.dosage} — {item.frequency} for {item.duration}
                          </p>
                          <p className="text-xs text-clinical-400/90 italic mt-1 font-semibold">
                            Inst: {item.instructions}
                          </p>
                        </div>
                      ))}
                    </div>
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {rx.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Diagnostic Lab Reports */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <FlaskConical className="h-4 w-4 text-clinical-400" /> Laboratory Results
            </h3>
            {labOrders.length === 0 ? (
              <div className="text-center py-4 text-xs text-slate-500">No lab results logged.</div>
            ) : (
              <div className="space-y-3">
                {labOrders.map((lab) => (
                  <div key={lab.id} className="rounded-xl bg-slate-950 p-3.5 border border-slate-850">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-sm font-bold text-slate-300">{lab.testName}</h4>
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-clinical-500/10 text-clinical-400 border border-clinical-500/20 uppercase">
                        {lab.status}
                      </span>
                    </div>
                    {lab.resultData && (
                      <div className="space-y-1">
                        <div className="flex justify-between"><span className="text-xs text-slate-500">Value</span><span className="text-xs text-white font-bold">{lab.resultData}</span></div>
                        <div className="flex justify-between"><span className="text-xs text-slate-500 font-medium">Comments</span><span className="text-xs text-slate-400 italic font-semibold">{lab.comments}</span></div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Invoice & Payments billing ledger */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-clinical-400" /> Invoice ledger
            </h3>
            {invoices.length === 0 ? (
              <div className="text-center py-4 text-xs text-slate-500">No invoices generated.</div>
            ) : (
              <div className="space-y-3">
                {invoices.map((inv) => (
                  <div key={inv.id} className="rounded-xl bg-slate-950 p-3.5 border border-slate-850 flex justify-between items-center">
                    <div>
                      <h4 className="text-xs font-bold text-slate-400">{inv.invoiceNumber}</h4>
                      <span className="text-xs text-slate-500 font-semibold mt-0.5 block">
                        Date: {new Date(inv.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-extrabold text-white">LKR {inv.amount.toLocaleString()}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {inv.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};
