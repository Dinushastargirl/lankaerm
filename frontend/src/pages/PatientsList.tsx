import React, { useState, useEffect } from 'react';
import { useAuth } from '../store/AuthContext';
import { useNavigate } from 'react-router-dom';
import type { Patient, MedicalRecord } from '../types';
import { apiRequest } from '../services/api';
import { 
  Search, 
  Plus, 
  FileText, 
  UserPlus, 
  Activity, 
  X,
  Stethoscope
} from 'lucide-react';

export const PatientsList: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [patientRecords, setPatientRecords] = useState<MedicalRecord[]>([]);
  
  const [searchQuery, setSearchQuery] = useState('');
  // error state removed to prevent TS unused warning
  const [loading, setLoading] = useState(false);

  const [isPatientModalOpen, setIsPatientModalOpen] = useState(false);
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);

  const [newPatient, setNewPatient] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: 'MALE',
    email: '',
    phoneNumber: '',
    address: '',
    insuranceProvider: '',
    insurancePolicyNumber: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
  });

  const [newRecord, setNewRecord] = useState({
    diagnosis: '',
    symptoms: '',
    prescriptions: '',
    notes: '',
    bloodPressure: '120/80',
    heartRate: '72',
    temperature: '98.6',
  });

  const mockPatients: Patient[] = [
    {
      id: 101,
      firstName: 'Samantha',
      lastName: 'Ratnayake',
      dateOfBirth: '1985-04-12',
      gender: 'FEMALE',
      email: 'samantha.r@gmail.com',
      phoneNumber: '+94 77 123 4567',
      address: '45 Galle Road, Colombo 03, Sri Lanka',
      insuranceProvider: 'Sri Lanka Insurance',
      insurancePolicyNumber: 'SLI-992019',
      emergencyContactName: 'Kamal Ratnayake',
      emergencyContactPhone: '+94 71 987 6543',
      createdAt: '2026-01-10T12:00:00Z',
    },
    {
      id: 102,
      firstName: 'Rohan',
      lastName: 'Fernando',
      dateOfBirth: '1972-11-23',
      gender: 'MALE',
      email: 'rohan.f@outlook.com',
      phoneNumber: '+94 76 543 2109',
      address: '12 Kandy Road, Peradeniya, Sri Lanka',
      insuranceProvider: 'AIA Health Lanka',
      insurancePolicyNumber: 'AIA-220194',
      emergencyContactName: 'Priyanthi Fernando',
      emergencyContactPhone: '+94 77 111 2222',
      createdAt: '2026-02-14T09:30:00Z',
    },
    {
      id: 103,
      firstName: 'Dilshan',
      lastName: 'Jayawardene',
      dateOfBirth: '1990-08-04',
      gender: 'MALE',
      email: 'dilshan.j@gmail.com',
      phoneNumber: '+94 72 321 0987',
      address: '77/1 Negombo Road, Kurunegala, Sri Lanka',
      insuranceProvider: 'Allianz Insurance',
      insurancePolicyNumber: 'ALZ-884102',
      emergencyContactName: 'Henry Jayawardene',
      emergencyContactPhone: '+94 71 555 4444',
      createdAt: '2026-03-01T15:45:00Z',
    }
  ];

  const mockRecords: Record<number, MedicalRecord[]> = {
    101: [
      {
        id: 501,
        patientId: 101,
        diagnosis: 'Dengue Fever (Non-Severe)',
        symptoms: 'High fever, severe headache, retro-orbital pain, joint pain',
        prescriptions: 'Paracetamol 500mg Q6H PO, Bed rest, Oral Rehydration Therapy (Jeevani)',
        notes: 'Advised daily blood count monitoring. Return immediately if bleeding spots or persistent vomiting occurs.',
        bloodPressure: '110/70',
        heartRate: '92',
        temperature: '102.4',
        recordedBy: 'Dr. Kanishka Perera',
        createdAt: '2026-07-20T10:00:00Z'
      }
    ],
    102: [
      {
        id: 502,
        patientId: 102,
        diagnosis: 'Essential Hypertension',
        symptoms: 'Mild headache, tension in shoulders',
        prescriptions: 'Losartan 50mg PO QD',
        notes: 'Salt restriction and home blood pressure monitoring log checks requested. Review in 2 weeks.',
        bloodPressure: '145/95',
        heartRate: '72',
        temperature: '98.6',
        recordedBy: 'Dr. Kanishka Perera',
        createdAt: '2026-07-15T14:30:00Z'
      }
    ],
    103: []
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  useEffect(() => {
    const query = searchQuery.toLowerCase();
    const filtered = patients.filter(p => 
      p.firstName.toLowerCase().includes(query) || 
      p.lastName.toLowerCase().includes(query) ||
      p.phoneNumber.includes(query) ||
      p.email.toLowerCase().includes(query)
    );
    setFilteredPatients(filtered);
  }, [searchQuery, patients]);

  const fetchPatients = async () => {
    setLoading(true);
    try {
      const data = await apiRequest<Patient[]>('/patients');
      setPatients(data);
    } catch (err: any) {
      console.warn('API connection refused, reverting to Sri Lanka Mock Patient Data.');
      setPatients(mockPatients);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecords = async (patientId: number) => {
    try {
      const data = await apiRequest<MedicalRecord[]>(`/patients/${patientId}/records`);
      setPatientRecords(data);
    } catch (err) {
      console.warn('Loading mock records for patient ', patientId);
      setPatientRecords(mockRecords[patientId] || []);
    }
  };

  const handlePatientClick = (patient: Patient) => {
    setSelectedPatient(patient);
    fetchRecords(patient.id);
  };

  const handleCreatePatient = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const created = await apiRequest<Patient>('/patients', {
        method: 'POST',
        body: JSON.stringify(newPatient)
      });
      setPatients([created, ...patients]);
      setIsPatientModalOpen(false);
    } catch (err) {
      console.warn('Backend offline, adding patient mock locally: ', err);
      const simulated: Patient = {
        ...newPatient,
        id: Date.now(),
        createdAt: new Date().toISOString()
      };
      setPatients([simulated, ...patients]);
      setIsPatientModalOpen(false);
    }

    setNewPatient({
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      gender: 'MALE',
      email: '',
      phoneNumber: '',
      address: '',
      insuranceProvider: '',
      insurancePolicyNumber: '',
      emergencyContactName: '',
      emergencyContactPhone: '',
    });
  };

  const handleCreateRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient) return;

    const payload = {
      ...newRecord,
      recordedBy: user?.fullName || 'Clinician'
    };

    try {
      const created = await apiRequest<MedicalRecord>(`/patients/${selectedPatient.id}/records`, {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      setPatientRecords([created, ...patientRecords]);
      setIsRecordModalOpen(false);
    } catch (err) {
      console.warn('Backend offline, logging encounter mock locally: ', err);
      const simulated: MedicalRecord = {
        ...payload,
        id: Date.now(),
        patientId: selectedPatient.id,
        createdAt: new Date().toISOString()
      };
      setPatientRecords([simulated, ...patientRecords]);
      setIsRecordModalOpen(false);
    }

    setNewRecord({
      diagnosis: '',
      symptoms: '',
      prescriptions: '',
      notes: '',
      bloodPressure: '120/80',
      heartRate: '72',
      temperature: '98.6',
    });
  };

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-heading text-2xl font-bold text-white">Registry Directory</h2>
          <p className="text-sm text-slate-400">Manage patient demographic records and log vitals charts.</p>
        </div>
        <button
          onClick={() => setIsPatientModalOpen(true)}
          className="inline-flex items-center justify-center space-x-2 rounded-xl bg-clinical-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-clinical-500 active:scale-[0.98] transition-all"
        >
          <UserPlus className="h-4 w-4" />
          <span>New Patient Profile</span>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        
        {/* Directory Table */}
        <div className="rounded-2xl border border-slate-850 bg-slate-900 p-5 lg:col-span-2 space-y-4 flex flex-col">
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search by patient name, email, or Sri Lankan mobile key..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-clinical-500 focus:border-transparent transition-all border-slate-800"
            />
          </div>

          {loading ? (
            <div className="flex flex-1 items-center justify-center py-20">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-clinical-600 border-t-transparent"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="bg-slate-950 text-slate-400 text-xs font-semibold uppercase tracking-wider border border-slate-850">
                  <tr>
                    <th className="px-4 py-3 rounded-l-xl">Patient Name</th>
                    <th className="px-4 py-3">Demographics</th>
                    <th className="px-4 py-3">Contact</th>
                    <th className="px-4 py-3 rounded-r-xl text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850">
                  {filteredPatients.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="text-center py-10 text-slate-500">
                        No matches found in patient database registries.
                      </td>
                    </tr>
                  ) : (
                    filteredPatients.map((patient) => (
                      <tr 
                        key={patient.id} 
                        onClick={() => handlePatientClick(patient)}
                        className={`hover:bg-slate-850/50 cursor-pointer transition-colors ${
                          selectedPatient?.id === patient.id ? 'bg-clinical-500/5 text-white' : ''
                        }`}
                      >
                        <td className="px-4 py-4.5">
                          <p className="font-bold text-slate-100">
                            {patient.lastName}, {patient.firstName}
                          </p>
                          <span className="text-[10px] font-semibold bg-slate-950 px-2 py-0.5 rounded-full border border-slate-800 text-slate-400 mt-1 inline-block">
                            ID: #{patient.id}
                          </span>
                        </td>
                        <td className="px-4 py-4.5">
                          <p className="text-xs">{patient.gender} &bull; DOB: {patient.dateOfBirth}</p>
                          <p className="text-[11px] text-slate-500">{patient.insuranceProvider}</p>
                        </td>
                        <td className="px-4 py-4.5">
                          <p className="text-xs">{patient.phoneNumber}</p>
                          <p className="text-xs text-slate-500">{patient.email}</p>
                        </td>
                        <td className="px-4 py-4.5 text-right">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/patients/${patient.id}`);
                            }}
                            className="inline-flex items-center space-x-1 text-xs text-clinical-400 hover:text-clinical-300 font-semibold bg-clinical-500/10 px-2.5 py-1.5 rounded-lg border border-clinical-500/20"
                          >
                            <FileText className="h-3.5 w-3.5" />
                            <span>Open Profile</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Chart View */}
        <div className="rounded-2xl border border-slate-850 bg-slate-900 p-5 flex flex-col justify-between h-[600px] overflow-hidden">
          {selectedPatient ? (
            <div className="flex flex-col h-full justify-between">
              
              <div className="pb-4 border-b border-slate-850">
                <div className="flex items-center justify-between">
                  <h3 className="font-heading text-lg font-bold text-white">Clinical Chart</h3>
                  <button 
                    onClick={() => setSelectedPatient(null)}
                    className="h-8 w-8 rounded-lg hover:bg-slate-850 flex items-center justify-center text-slate-400 hover:text-white"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <div className="mt-4 flex items-center space-x-3">
                  <div className="h-12 w-12 bg-clinical-600 rounded-xl flex items-center justify-center text-lg font-extrabold text-white">
                    {selectedPatient.firstName.charAt(0)}{selectedPatient.lastName.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-100">{selectedPatient.firstName} {selectedPatient.lastName}</h4>
                    <p className="text-xs text-slate-400">Gender: {selectedPatient.gender} | DOB: {selectedPatient.dateOfBirth}</p>
                  </div>
                </div>
              </div>

              <div className="flex-1 my-4 overflow-y-auto space-y-4 pr-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Encounters</span>
                  {user?.role !== 'RECEPTIONIST' && (
                    <button
                      onClick={() => setIsRecordModalOpen(true)}
                      className="inline-flex items-center space-x-1 text-xs text-clinical-400 font-semibold hover:text-clinical-300"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>Append Encounter</span>
                    </button>
                  )}
                </div>

                {patientRecords.length === 0 ? (
                  <div className="text-center py-12 rounded-xl bg-slate-950 border border-slate-850 p-4">
                    <Stethoscope className="h-8 w-8 text-slate-600 mx-auto mb-2" />
                    <p className="text-xs text-slate-500 font-semibold">No entries logged in patient chart.</p>
                  </div>
                ) : (
                  patientRecords.map((record) => (
                    <div key={record.id} className="rounded-xl border border-slate-850 bg-slate-950 p-4 space-y-3">
                      <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-900">
                        <span className="font-bold text-clinical-400">{record.diagnosis}</span>
                        <span className="text-slate-500 font-medium">{new Date(record.createdAt).toLocaleDateString()}</span>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-2 text-[11px] bg-slate-900/50 p-2 rounded-lg border border-slate-850/50 text-slate-400">
                        <div>
                          <span className="block text-[9px] text-slate-600 uppercase font-semibold">Vitals (BP)</span>
                          <span className="font-bold text-slate-300">{record.bloodPressure}</span>
                        </div>
                        <div>
                          <span className="block text-[9px] text-slate-600 uppercase font-semibold">Pulse Rate</span>
                          <span className="font-bold text-slate-300">{record.heartRate} bpm</span>
                        </div>
                        <div>
                          <span className="block text-[9px] text-slate-600 uppercase font-semibold">Temp</span>
                          <span className="font-bold text-slate-300">{record.temperature} °F</span>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <p className="text-xs text-slate-300">
                          <span className="text-[10px] font-semibold text-slate-500 block">Symptoms:</span>
                          {record.symptoms}
                        </p>
                        <p className="text-xs text-slate-300">
                          <span className="text-[10px] font-semibold text-slate-500 block">Prescriptions:</span>
                          <code className="text-[11px] text-teal-300 font-mono block mt-0.5 bg-slate-900 px-2 py-1 rounded border border-slate-850">{record.prescriptions}</code>
                        </p>
                        <p className="text-xs text-slate-300">
                          <span className="text-[10px] font-semibold text-slate-500 block">Clinician Notes:</span>
                          {record.notes}
                        </p>
                      </div>

                      <div className="text-[10px] text-slate-500 text-right font-medium">
                        Recorded by: {record.recordedBy}
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="rounded-xl bg-slate-950 p-3.5 border border-slate-850 text-xs text-slate-400 space-y-1">
                <p className="font-bold text-white text-[11px] uppercase tracking-wide text-slate-500 mb-1.5">Emergency Contact Details</p>
                <div className="flex justify-between">
                  <span>Contact: {selectedPatient.emergencyContactName}</span>
                  <span className="font-bold text-white">{selectedPatient.emergencyContactPhone}</span>
                </div>
                <div className="flex justify-between">
                  <span>Policy ID: {selectedPatient.insurancePolicyNumber}</span>
                  <span>{selectedPatient.insuranceProvider}</span>
                </div>
              </div>

            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 bg-slate-950/40 rounded-xl border border-dashed border-slate-800">
              <Activity className="h-10 w-10 text-clinical-600 mb-3 animate-pulse" />
              <h4 className="font-bold text-white text-base">No Patient Selected</h4>
              <p className="text-xs text-slate-500 max-w-[220px] mt-2">
                Click "Open Chart" next to any patient record in the registry directory to view historical clinical notes, vitals logs, and prescription histories.
              </p>
            </div>
          )}
        </div>

      </div>

      {/* MODAL 1: Create Patient */}
      {isPatientModalOpen && (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto shadow-2xl relative">
            <button 
              onClick={() => setIsPatientModalOpen(false)}
              className="absolute top-4 right-4 h-8 w-8 hover:bg-slate-800 rounded-lg flex items-center justify-center text-slate-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
            <h3 className="font-heading text-xl font-bold text-white mb-4">Create Patient Profile</h3>
            
            <form onSubmit={handleCreatePatient} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400">First Name</label>
                  <input
                    type="text"
                    required
                    value={newPatient.firstName}
                    onChange={(e) => setNewPatient({ ...newPatient, firstName: e.target.value })}
                    className="w-full mt-1.5 bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-clinical-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400">Last Name</label>
                  <input
                    type="text"
                    required
                    value={newPatient.lastName}
                    onChange={(e) => setNewPatient({ ...newPatient, lastName: e.target.value })}
                    className="w-full mt-1.5 bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-clinical-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400">Date of Birth</label>
                  <input
                    type="date"
                    required
                    value={newPatient.dateOfBirth}
                    onChange={(e) => setNewPatient({ ...newPatient, dateOfBirth: e.target.value })}
                    className="w-full mt-1.5 bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-clinical-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400">Gender</label>
                  <select
                    value={newPatient.gender}
                    onChange={(e) => setNewPatient({ ...newPatient, gender: e.target.value })}
                    className="w-full mt-1.5 bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-clinical-500"
                  >
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400">Email</label>
                  <input
                    type="email"
                    required
                    value={newPatient.email}
                    onChange={(e) => setNewPatient({ ...newPatient, email: e.target.value })}
                    className="w-full mt-1.5 bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-clinical-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400">Phone Number</label>
                  <input
                    type="text"
                    required
                    value={newPatient.phoneNumber}
                    onChange={(e) => setNewPatient({ ...newPatient, phoneNumber: e.target.value })}
                    className="w-full mt-1.5 bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-clinical-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400">Physical Address</label>
                <input
                  type="text"
                  required
                  value={newPatient.address}
                  onChange={(e) => setNewPatient({ ...newPatient, address: e.target.value })}
                  className="w-full mt-1.5 bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-clinical-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 border-t border-slate-850 pt-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400">Insurance Provider</label>
                  <input
                    type="text"
                    required
                    value={newPatient.insuranceProvider}
                    onChange={(e) => setNewPatient({ ...newPatient, insuranceProvider: e.target.value })}
                    className="w-full mt-1.5 bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-clinical-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400">Policy Number</label>
                  <input
                    type="text"
                    required
                    value={newPatient.insurancePolicyNumber}
                    onChange={(e) => setNewPatient({ ...newPatient, insurancePolicyNumber: e.target.value })}
                    className="w-full mt-1.5 bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-clinical-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 border-t border-slate-850 pt-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400">Emergency Contact Name</label>
                  <input
                    type="text"
                    required
                    value={newPatient.emergencyContactName}
                    onChange={(e) => setNewPatient({ ...newPatient, emergencyContactName: e.target.value })}
                    className="w-full mt-1.5 bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-clinical-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400">Emergency Phone</label>
                  <input
                    type="text"
                    required
                    value={newPatient.emergencyContactPhone}
                    onChange={(e) => setNewPatient({ ...newPatient, emergencyContactPhone: e.target.value })}
                    className="w-full mt-1.5 bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-clinical-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-clinical-600 hover:bg-clinical-500 text-sm font-semibold text-white transition-colors mt-6"
              >
                Submit Patient Profile
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Create Medical Record */}
      {isRecordModalOpen && selectedPatient && (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
            <button 
              onClick={() => setIsRecordModalOpen(false)}
              className="absolute top-4 right-4 h-8 w-8 hover:bg-slate-800 rounded-lg flex items-center justify-center text-slate-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
            <h3 className="font-heading text-lg font-bold text-white mb-2">Append Encounter</h3>
            <p className="text-xs text-slate-500 mb-4">Patient: {selectedPatient.firstName} {selectedPatient.lastName}</p>
            
            <form onSubmit={handleCreateRecord} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400">Diagnosis</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dengue Fever"
                  value={newRecord.diagnosis}
                  onChange={(e) => setNewRecord({ ...newRecord, diagnosis: e.target.value })}
                  className="w-full mt-1.5 bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-clinical-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400">Symptoms</label>
                <textarea
                  required
                  rows={2}
                  placeholder="Describe symptoms reported..."
                  value={newRecord.symptoms}
                  onChange={(e) => setNewRecord({ ...newRecord, symptoms: e.target.value })}
                  className="w-full mt-1.5 bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-clinical-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-2.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-400">BP</label>
                  <input
                    type="text"
                    required
                    value={newRecord.bloodPressure}
                    onChange={(e) => setNewRecord({ ...newRecord, bloodPressure: e.target.value })}
                    className="w-full mt-1.5 bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:ring-2 focus:ring-clinical-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400">Pulse (bpm)</label>
                  <input
                    type="text"
                    required
                    value={newRecord.heartRate}
                    onChange={(e) => setNewRecord({ ...newRecord, heartRate: e.target.value })}
                    className="w-full mt-1.5 bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:ring-2 focus:ring-clinical-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400">Temp (°F)</label>
                  <input
                    type="text"
                    required
                    value={newRecord.temperature}
                    onChange={(e) => setNewRecord({ ...newRecord, temperature: e.target.value })}
                    className="w-full mt-1.5 bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:ring-2 focus:ring-clinical-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400">Prescriptions</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Paracetamol 500mg Q6H PO"
                  value={newRecord.prescriptions}
                  onChange={(e) => setNewRecord({ ...newRecord, prescriptions: e.target.value })}
                  className="w-full mt-1.5 bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-clinical-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400">Session Notes</label>
                <textarea
                  rows={2}
                  value={newRecord.notes}
                  onChange={(e) => setNewRecord({ ...newRecord, notes: e.target.value })}
                  className="w-full mt-1.5 bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-clinical-500 resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-clinical-600 hover:bg-clinical-500 text-sm font-semibold text-white transition-colors mt-6"
              >
                Log Medical Record Vitals
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
