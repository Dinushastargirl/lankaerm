package com.emr.platform.common;

import com.emr.platform.organization.Organization;
import com.emr.platform.organization.OrganizationRepository;
import com.emr.platform.permission.Permission;
import com.emr.platform.permission.PermissionRepository;
import com.emr.platform.role.Role;
import com.emr.platform.role.RoleRepository;
import com.emr.platform.user.User;
import com.emr.platform.user.UserRepository;
import com.emr.platform.user.UserStatus;
import com.emr.platform.prescription.Medication;
import com.emr.platform.prescription.MedicationRepository;
import com.emr.platform.patient.Patient;
import com.emr.platform.patient.PatientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.HashSet;
import java.util.Set;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PermissionRepository permissionRepository;

    @Autowired
    private OrganizationRepository organizationRepository;

    @Autowired
    private MedicationRepository medicationRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        if (userRepository.count() == 0) {
            seedDatabase();
        }
    }

    private void seedDatabase() {
        // 1. Seed Organization
        Organization defaultOrg = organizationRepository.findByName("Colombo Medical Center")
                .orElseGet(() -> organizationRepository.save(
                        Organization.builder()
                                .name("Colombo Medical Center")
                                .address("45 Galle Road, Colombo 03")
                                .country("Sri Lanka")
                                .build()
                ));

        // 2. Seed Permissions
        Permission readPatients = createPermissionIfNotExist("patients", "patients:read");
        Permission writePatients = createPermissionIfNotExist("patients", "patients:write");
        Permission deletePatients = createPermissionIfNotExist("patients", "patients:delete");
        Permission manageUsers = createPermissionIfNotExist("user-management", "user-management:write");
        Permission labRead = createPermissionIfNotExist("laboratory", "laboratory:read");
        Permission labWrite = createPermissionIfNotExist("laboratory", "laboratory:write");
        Permission pharmRead = createPermissionIfNotExist("pharmacy", "pharmacy:read");
        Permission pharmWrite = createPermissionIfNotExist("pharmacy", "pharmacy:write");

        // 3. Seed Roles
        Role adminRole = createRoleIfNotExist("ADMIN", Set.of(readPatients, writePatients, deletePatients, manageUsers));
        Role doctorRole = createRoleIfNotExist("DOCTOR", Set.of(readPatients, writePatients, labRead, labWrite, pharmRead));
        Role nurseRole = createRoleIfNotExist("NURSE", Set.of(readPatients, writePatients));
        Role receptionistRole = createRoleIfNotExist("RECEPTIONIST", Set.of(readPatients));
        Role labTechRole = createRoleIfNotExist("LAB_TECHNICIAN", Set.of(readPatients, labRead, labWrite));
        Role pharmacistRole = createRoleIfNotExist("PHARMACIST", Set.of(readPatients, pharmRead, pharmWrite));

        // 4. Seed Users
        createUserIfNotExist("admin", "Admin System Chief", "admin@lankahospital-emr.lk", "admin123", adminRole, defaultOrg);
        createUserIfNotExist("doctor", "Dr. Kanishka Perera", "doctor@lankahospital-emr.lk", "doctor123", doctorRole, defaultOrg);
        createUserIfNotExist("nurse", "Nurse Emily Stone", "nurse@lankahospital-emr.lk", "nurse123", nurseRole, defaultOrg);
        createUserIfNotExist("receptionist", "Sunil Perera", "receptionist@lankahospital-emr.lk", "receptionist123", receptionistRole, defaultOrg);
        createUserIfNotExist("labtech", "Lab Tech Gamini", "labtech@lankahospital-emr.lk", "labtech123", labTechRole, defaultOrg);
        createUserIfNotExist("pharmacist", "Pharmacist Nimal", "pharmacist@lankahospital-emr.lk", "pharmacist123", pharmacistRole, defaultOrg);

        // 5. Seed Medications
        seedMedicationIfNotExist("Paracetamol", "MED-001", "Tablet", "500mg", 1000, "2028-12-31");
        seedMedicationIfNotExist("Amoxicillin", "MED-002", "Capsule", "250mg", 500, "2027-06-30");
        seedMedicationIfNotExist("Metformin", "MED-003", "Tablet", "850mg", 200, "2028-03-15");

        // 6. Seed Patients
        seedPatientIfNotExist("MRN-1001", "Kamal", "Silva", "1980-05-12", "Male", "kamal.silva@gmail.com", "+94 77 123 4567", "12 Galle Road, Colombo 03");
    }

    private Permission createPermissionIfNotExist(String module, String action) {
        return permissionRepository.findByModuleAndAction(module, action)
                .orElseGet(() -> permissionRepository.save(
                        Permission.builder().module(module).action(action).build()
                ));
    }

    private Role createRoleIfNotExist(String name, Set<Permission> permissions) {
        return roleRepository.findByName(name)
                .orElseGet(() -> roleRepository.save(
                        Role.builder().name(name).permissions(new HashSet<>(permissions)).build()
                ));
    }

    private void createUserIfNotExist(String username, String fullName, String email, String plainPassword, Role role, Organization organization) {
        if (!userRepository.existsByUsername(username)) {
            User user = User.builder()
                    .username(username)
                    .fullName(fullName)
                    .email(email)
                    .passwordHash(passwordEncoder.encode(plainPassword))
                    .role(role)
                    .organization(organization)
                    .status(UserStatus.ACTIVE)
                    .failedLoginAttempts(0)
                    .createdAt(Instant.now())
                    .build();
            userRepository.save(user);
        }
    }

    private void seedMedicationIfNotExist(String name, String code, String form, String strength, int stock, String expiry) {
        if (medicationRepository.findByCode(code).isEmpty()) {
            medicationRepository.save(
                    Medication.builder()
                            .name(name)
                            .code(code)
                            .form(form)
                            .dosageStrength(strength)
                            .stockQuantity(stock)
                            .expiryDate(expiry)
                            .build()
            );
        }
    }

    private void seedPatientIfNotExist(String mrn, String first, String last, String dob, String gender, String email, String phone, String address) {
        if (patientRepository.findByMedicalRecordNumber(mrn).isEmpty()) {
            patientRepository.save(
                    Patient.builder()
                            .medicalRecordNumber(mrn)
                            .firstName(first)
                            .lastName(last)
                            .dateOfBirth(dob)
                            .gender(gender)
                            .email(email)
                            .phoneNumber(phone)
                            .address(address)
                            .build()
            );
        }
    }
}
