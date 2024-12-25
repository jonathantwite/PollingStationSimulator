import { computed, inject, Injectable } from '@angular/core';
import { SimulatorService } from '../../generic/services/simulator.service';

@Injectable({
  providedIn: 'root'
})
export class StatsService {

  constructor() { }

  private simulatorService = inject(SimulatorService);
  
  private lastSnapshot = computed(() => this.simulatorService.simulation()[this.simulatorService.simulation().length-1]);
  
  averageTotalSecondsUntilVoted = computed(() => 
    this.lastSnapshot()?.Voted.toArray()
      .filter(p => p.TotalSecondsUntilVoted() != undefined)
      .reduce((t, p) => t + (p.TotalSecondsUntilVoted() ?? 0), 0) / (this.lastSnapshot()?.Voted.length ?? 1));

}
