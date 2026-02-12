import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { map } from 'rxjs/operators';
import { AuthService } from 'src/app/core/services/auth/auth.service';

export const onlyAdminGuard: CanActivateFn = (
  _route: ActivatedRouteSnapshot,
  _state: RouterStateSnapshot
) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isAdmin.pipe(
    map((isAdmin): boolean | UrlTree =>
      isAdmin ? true : router.createUrlTree(['/home'])
    )
  );
};
