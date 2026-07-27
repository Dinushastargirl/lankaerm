package com.emr.platform.audit;

import com.emr.platform.auth.RequirePermission;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.AfterThrowing;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Aspect
@Component
public class AuditAspect {

      @Autowired
      private AuditService auditService;

      @AfterReturning("@annotation(requirePermission)")
      public void auditPermissionSuccess(JoinPoint joinPoint, RequirePermission requirePermission) {
          String username = SecurityContextHolder.getContext().getAuthentication().getName();
          auditService.log(username, "AUTHORIZED_ACTION_" + requirePermission.value().toUpperCase(), "SECURITY", "127.0.0.1");
      }

      @AfterThrowing(pointcut = "@annotation(requirePermission)", throwing = "ex")
      public void auditPermissionFailure(JoinPoint joinPoint, RequirePermission requirePermission, AccessDeniedException ex) {
          String username = SecurityContextHolder.getContext().getAuthentication().getName();
          auditService.log(username, "PERMISSION_DENIED_" + requirePermission.value().toUpperCase(), "SECURITY", "127.0.0.1");
      }
}
