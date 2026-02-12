import { EnvironmentInjector, TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { of } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { onlyAdminGuard } from './only-admin.guard';

describe('onlyAdminGuard', () => {
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;
  let injector: EnvironmentInjector;
  let homeTree: UrlTree;

  beforeEach(() => {
    authService = jasmine.createSpyObj('AuthService', [], { isAdmin: of(true) });
    homeTree = { toString: () => '/home' } as UrlTree;
    router = jasmine.createSpyObj('Router', ['createUrlTree']);
    router.createUrlTree.and.returnValue(homeTree);

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: Router, useValue: router },
      ],
    });
    injector = TestBed.inject(EnvironmentInjector);
  });

  it('should allow access when user is admin', (done) => {
    const route = {} as ActivatedRouteSnapshot;
    const state = {} as RouterStateSnapshot;
    const result = injector.runInContext(() => onlyAdminGuard(route, state));
    result.subscribe((allowed) => {
      expect(allowed).toBe(true);
      expect(router.createUrlTree).not.toHaveBeenCalled();
      done();
    });
  });

  it('should redirect when user is not admin', (done) => {
    Object.defineProperty(authService, 'isAdmin', { get: () => of(false), configurable: true });
    const route = {} as ActivatedRouteSnapshot;
    const state = {} as RouterStateSnapshot;
    const result = injector.runInContext(() => onlyAdminGuard(route, state));
    result.subscribe((allowed) => {
      expect(router.createUrlTree).toHaveBeenCalledWith(['/home']);
      expect(allowed).toBe(homeTree);
      done();
    });
  });
});
