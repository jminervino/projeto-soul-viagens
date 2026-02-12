import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../core/services/dashboard/dashboard.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  totalPosts$?: Observable<number>;

  usuarioTotal$?: Observable<number>;

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.totalPosts$ = this.dashboardService.getPostsCount();

    this.usuarioTotal$ = this.dashboardService.getContadorUsuario();
  }
}
