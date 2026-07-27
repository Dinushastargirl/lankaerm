package com.emr.platform.auth;

import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Aspect
@Component
public class PermissionAspect {

    @Before("@annotation(requirePermission)")
    public void doPermissionCheck(RequirePermission requirePermission) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new AccessDeniedException("User session is not authenticated");
        }

        String targetPermission = requirePermission.value();
        
        // Admins automatically bypass any permission restrictions
        boolean hasPermission = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .anyMatch(auth -> auth.equalsIgnoreCase(targetPermission) || auth.equals("ROLE_ADMIN"));

        if (!hasPermission) {
            throw new AccessDeniedException("Access denied: Clinician is missing required permission: " + targetPermission);
        }
    }
}
