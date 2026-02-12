import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter, map, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'diarios-app';
  showLayout$!: Observable<boolean>;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.showLayout$ = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => this.shouldShowLayout()),
      startWith(this.shouldShowLayout())
    );
  }

  private shouldShowLayout(): boolean {
    // Esconde navbar e footer nas rotas de autenticação (lazy em /auth/*; /login etc. redirecionam para /auth)
    return !this.router.url.startsWith('/auth');
  }
}
