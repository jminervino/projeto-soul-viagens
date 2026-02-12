import { Component, OnDestroy, OnInit } from '@angular/core';
import { HotToastService } from '@ngneat/hot-toast';
import { Observable, Subject } from 'rxjs';
import { AuthService } from '../../services/auth/auth.service';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit, OnDestroy {
  constructor(
    private authService: AuthService,
    private toast: HotToastService
  ) {}

  private readonly destroy$ = new Subject<void>();

  logged$?: Observable<any>;
  isAdmin$?: Observable<boolean>;

  logout() {
    this.authService
      .logout('/login')
      .pipe(
        takeUntil(this.destroy$),
        this.toast.observe({
          success: 'Você foi desconectado, Ate breve',
          error: 'Um erro ocorreu',
          loading: 'Fazendo logout...',
        })
      )
      .subscribe();
  }

  ngOnInit(): void {
    this.logged$ = this.authService.logged;
    this.isAdmin$ = this.authService.isAdmin;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
