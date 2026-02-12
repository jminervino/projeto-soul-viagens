import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Diario } from 'src/app/core/models/diario';
import { DashboardService } from 'src/app/core/services/dashboard/dashboard.service';

@Component({
  selector: 'app-last-posts',
  templateUrl: './last-posts.component.html',
  styleUrls: ['./last-posts.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LastPostsComponent implements OnInit {
  lastPosts$?: Observable<Diario[]>;

  constructor(private dashboardService: DashboardService) {}

  trackByDiarioId(_: number, diario: Diario): string {
    return diario.id ?? '';
  }

  ngOnInit(): void {
    this.lastPosts$ = this.dashboardService.getLastPosts();
  }
}
