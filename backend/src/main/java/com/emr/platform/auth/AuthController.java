package com.emr.platform.auth;

import com.emr.platform.common.ApiResponse;
import com.emr.platform.organization.Organization;
import com.emr.platform.organization.OrganizationRepository;
import com.emr.platform.role.Role;
import com.emr.platform.role.RoleRepository;
import com.emr.platform.user.User;
import com.emr.platform.user.UserRepository;
import com.emr.platform.user.UserStatus;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.LockedException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private OrganizationRepository organizationRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private RefreshTokenService refreshTokenService;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        User preCheckUser = userRepository.findByUsername(loginRequest.getUsername()).orElse(null);
        if (preCheckUser != null && preCheckUser.getStatus() == UserStatus.LOCKED) {
            throw new LockedException("Your account is locked. Contact your system admin.");
        }

        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

            SecurityContextHolder.getContext().setAuthentication(authentication);
            String jwt = jwtUtils.generateJwtToken(authentication);
            
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            
            if (preCheckUser != null) {
                preCheckUser.setFailedLoginAttempts(0);
                userRepository.save(preCheckUser);
            }

            RefreshToken refreshToken = refreshTokenService.createRefreshToken(userDetails.getId());

            List<String> permissions = userDetails.getAuthorities().stream()
                    .map(GrantedAuthority::getAuthority)
                    .filter(auth -> !auth.startsWith("ROLE_"))
                    .collect(Collectors.toList());

            return ResponseEntity.ok(AuthResponse.builder()
                    .accessToken(jwt)
                    .refreshToken(refreshToken.getToken())
                    .userId(userDetails.getId())
                    .username(userDetails.getUsername())
                    .role(preCheckUser.getRole().getName())
                    .permissions(permissions)
                    .build());

        } catch (BadCredentialsException e) {
            if (preCheckUser != null && preCheckUser.getStatus() == UserStatus.ACTIVE) {
                int attempts = preCheckUser.getFailedLoginAttempts() + 1;
                preCheckUser.setFailedLoginAttempts(attempts);
                if (attempts >= 5) {
                    preCheckUser.setStatus(UserStatus.LOCKED);
                    userRepository.save(preCheckUser);
                    throw new LockedException("Your account has been locked due to 5 consecutive failed login attempts.");
                }
                userRepository.save(preCheckUser);
            }
            throw e;
        }
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<String>> registerUser(@Valid @RequestBody RegisterRequest signUpRequest) {
        if (userRepository.existsByUsername(signUpRequest.getUsername())) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Username is already taken!"));
        }

        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Email is already registered!"));
        }

        Role userRole = roleRepository.findByName(signUpRequest.getRole().toUpperCase())
                .orElseThrow(() -> new RuntimeException("Fail! Cause: User Role not found."));

        Organization defaultOrg = organizationRepository.findByName("Colombo Medical Center")
                .orElseThrow(() -> new RuntimeException("Default organization 'Colombo Medical Center' not seeded."));

        User user = User.builder()
                .username(signUpRequest.getUsername())
                .fullName(signUpRequest.getFullName())
                .email(signUpRequest.getEmail())
                .passwordHash(passwordEncoder.encode(signUpRequest.getPassword()))
                .role(userRole)
                .organization(defaultOrg)
                .status(UserStatus.ACTIVE)
                .failedLoginAttempts(0)
                .createdAt(Instant.now())
                .build();

        userRepository.save(user);

        return ResponseEntity.ok(ApiResponse.success(null, "User registered successfully!"));
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<TokenRefreshResponse> refreshToken(@Valid @RequestBody TokenRefreshRequest request) {
        String requestRefreshToken = request.getRefreshToken();

        return refreshTokenService.findByToken(requestRefreshToken)
                .map(refreshTokenService::verifyExpiration)
                .map(RefreshToken::getUser)
                .map(user -> {
                    RefreshToken rotatedToken = refreshTokenService.createRefreshToken(user.getId());
                    String token = jwtUtils.generateTokenFromUsername(user.getUsername());
                    return ResponseEntity.ok(new TokenRefreshResponse(token, rotatedToken.getToken()));
                })
                .orElseThrow(() -> new RuntimeException("Refresh token is not present in database registry!"));
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<String>> logoutUser() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof UserDetailsImpl) {
            UserDetailsImpl userDetails = (UserDetailsImpl) principal;
            refreshTokenService.deleteByUserId(userDetails.getId());
            return ResponseEntity.ok(ApiResponse.success(null, "Log out completed securely. Session tokens deleted."));
        }
        return ResponseEntity.badRequest().body(ApiResponse.error("Active session not found"));
    }
}
