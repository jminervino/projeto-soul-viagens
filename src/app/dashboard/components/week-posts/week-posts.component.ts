import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ChartConfiguration, ChartData } from 'chart.js';
import { map, Observable } from 'rxjs';
import { DashboardService } from 'src/app/core/services/dashboard/dashboard.service';

@Component({
  selector: 'app-week-posts',
  templateUrl: './week-posts.component.html',
  styleUrls: ['./week-posts.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WeekPostsComponent implements OnInit {
  chartData$?: Observable<ChartData>;

  config: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#64748b', font: { size: 12 } },
      },
      y: {
        beginAtZero: true,
        ticks: { stepSize: 1, color: '#64748b', font: { size: 12 } },
        grid: { color: '#f1f5f9' },
      },
    },
  };

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.chartData$ = this.dashboardService.getWeekPosts().pipe(
      map((data) => {
        return {
          labels: Object.keys(data),
          datasets: [
            {
              data: Object.values(data),
              label: 'Quantidade de posts',
              backgroundColor: '#ff6b35',
              hoverBackgroundColor: '#e55a2b',
              borderRadius: 6,
              borderSkipped: false as const,
              maxBarThickness: 40,
            },
          ],
        };
      })
    );
  }
}
