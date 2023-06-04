import { Component, OnInit, HostListener } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { Observable } from 'rxjs';
import { AuthService } from '../../services/auth/auth.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private toast: HotToastService,
    private router: Router
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.isHomePage = event.url === '/home';
      }
    });
  }

  isHomePage: boolean = false;
  logged$?: Observable<any>;
  corDaNav: string = '#d7d228';

  logout() {
    this.authService
      .logout('/login')
      .pipe(
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
    // this.isHomePage = this.router.url === '/';
    // const navbar = document.querySelector('.navbar')

    // if(this.isHomePage){
    //   navbar?.classList.remove('navbar')
    //   navbar?.classList.add('navbar-home')
    // } else {
    //   navbar?.classList.remove('navbar-home')
    //   navbar?.classList.add('navbar')
    // }

    // console.log(navbar);
  }
}
