import { computed, inject, Injectable } from '@angular/core';
import { SimulatorService } from '../../simulator/services/simulator.service';

@Injectable({
  providedIn: 'root'
})
export class StatsService {

  constructor() { }

  private simulatorService = inject(SimulatorService);
  
  private lastSnapshot = computed(() => this.simulatorService.simulation()?.snapshots[(this.simulatorService.simulation()?.snapshots.length ?? 1) - 1]);
  
  averageTotalSecondsUntilVoted = computed(() => 
    this.lastSnapshot()?.Voted.toArray()
      .filter(p => p.TotalSecondsUntilVoted() != undefined)
      .reduce((t, p) => t + (p.TotalSecondsUntilVoted() ?? 0), 0) ?? 1 / (this.lastSnapshot()?.Voted.length ?? 1));

}
