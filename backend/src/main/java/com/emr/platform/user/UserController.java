package com.emr.platform.user;

import com.emr.platform.auth.UserDetailsImpl;
import com.emr.platform.common.ApiResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserDto>> getCurrentUser() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof UserDetailsImpl) {
            UserDetailsImpl userDetails = (UserDetailsImpl) principal;
            User user = userRepository.findById(userDetails.getId())
                    .orElseThrow(() -> new RuntimeException("Current user not found"));

            UserDto dto = UserDto.builder()
                    .id(user.getId())
                    .username(user.getUsername())
                    .fullName(user.getFullName())
                    .email(user.getEmail())
                    .role(user.getRole().getName())
                    .createdAt(user.getCreatedAt().toString())
                    .build();

            return ResponseEntity.ok(ApiResponse.success(dto, "Current active profile retrieved"));
        }
        return ResponseEntity.badRequest().body(ApiResponse.error("Anonymous user session"));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<UserDto>>> listUsers() {
        List<UserDto> dtoList = userRepository.findAll().stream()
                .map(user -> UserDto.builder()
                        .id(user.getId())
                        .username(user.getUsername())
                        .fullName(user.getFullName())
                        .email(user.getEmail())
                        .role(user.getRole().getName())
                        .createdAt(user.getCreatedAt().toString())
                        .build())
                .collect(Collectors.toList());

        return ResponseEntity.ok(ApiResponse.success(dtoList, "Hospital directory retrieved successfully"));
    }

    @lombok.Data
    @lombok.Builder
    public static class UserDto {
        private java.util.UUID id;
        private String username;
        private String fullName;
        private String email;
        private String role;
        private String createdAt;
    }
}
