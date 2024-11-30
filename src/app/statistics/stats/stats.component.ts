import { Component, inject } from '@angular/core';
import { StatsService } from '../services/stats.service';

@Component({
    selector: 'app-stats',
    imports: [],
    templateUrl: './stats.component.html',
    styleUrl: './stats.component.scss'
})
export class StatsComponent {
  private statsService = inject(StatsService);

  averageTotalSecondsUntilVoted = this.statsService.averageTotalSecondsUntilVoted;
}
