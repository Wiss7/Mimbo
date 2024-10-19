import { CanActivateFn } from '@angular/router';
import { AuthService } from './auth.service';
import { inject } from '@angular/core';
export const adminGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthService);
  const isAdmin = await authService.isAdmin();
  return isAdmin;
};
