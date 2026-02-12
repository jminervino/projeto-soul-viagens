import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ChartConfiguration, ChartData } from 'chart.js';
import { map, Observable } from 'rxjs';
import { DashboardService } from 'src/app/core/services/dashboard/dashboard.service';

@Component({
  selector: 'app-common-locals',
  templateUrl: './common-locals.component.html',
  styleUrls: ['./common-locals.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommonLocalsComponent implements OnInit {
  constructor(private dashboardService: DashboardService) {}

  chartData$?: Observable<ChartData>;

  config: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'bottom',
        display: true,
        labels: {
          padding: 16,
          usePointStyle: true,
          pointStyle: 'circle',
          color: '#64748b',
          font: { size: 12 },
        },
      },
    },
  };

  ngOnInit(): void {
    this.chartData$ = this.dashboardService.getCommonLocals().pipe(
      map((data) => {
        return {
          labels: Object.keys(data),
          datasets: [
            {
              data: Object.values(data),
              backgroundColor: [
                '#ff6b35', '#004e89', '#1a8fe3', '#ff8c69',
                '#64748b', '#334155', '#0f172a', '#94a3b8',
              ],
              hoverOffset: 0,
              borderWidth: 2,
              borderColor: '#ffffff',
            },
          ],
        };
      })
    );
  }
}
