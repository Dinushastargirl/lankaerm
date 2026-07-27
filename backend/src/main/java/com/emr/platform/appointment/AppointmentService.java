package com.emr.platform.appointment;

import com.emr.platform.patient.PatientRepository;
import com.emr.platform.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class AppointmentService {

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private UserRepository userRepository;

    @Transactional(readOnly = true)
    public List<Appointment> getAllAppointments() {
        return appointmentRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Optional<Appointment> getAppointmentById(UUID id) {
        return appointmentRepository.findById(id);
    }

    @Transactional(readOnly = true)
    public List<Appointment> getAppointmentsByDoctor(UUID doctorId) {
        return appointmentRepository.findByDoctorId(doctorId);
    }

    @Transactional(readOnly = true)
    public List<Appointment> getAppointmentsByPatient(UUID patientId) {
        return appointmentRepository.findByPatientId(patientId);
    }

    @Transactional
    public Appointment scheduleAppointment(UUID patientId, UUID doctorId, String date, String time, String reason) {
        var patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new IllegalArgumentException("Patient not found"));
        var doctor = userRepository.findById(doctorId)
                .orElseThrow(() -> new IllegalArgumentException("Doctor not found"));

        Appointment appointment = Appointment.builder()
                .patient(patient)
                .doctor(doctor)
                .appointmentDate(date)
                .appointmentTime(time)
                .status("SCHEDULED")
                .reason(reason)
                .build();

        return appointmentRepository.save(appointment);
    }

    @Transactional
    public Appointment updateAppointmentStatus(UUID id, String status) {
        return appointmentRepository.findById(id).map(appointment -> {
            appointment.setStatus(status.toUpperCase());
            return appointmentRepository.save(appointment);
        }).orElseThrow(() -> new IllegalArgumentException("Appointment not found with id: " + id));
    }
}
