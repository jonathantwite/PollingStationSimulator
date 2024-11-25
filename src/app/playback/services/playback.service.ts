import { computed, inject, Injectable, signal } from '@angular/core';
import { SimulatorService } from '../../services/simulator.service';

@Injectable({
  providedIn: 'root'
})
export class PlaybackService {

  constructor() { }
  private simulationService = inject(SimulatorService);

  snapshotIndex = signal(0);
  currentTime = computed(() => this.simulationSnapshot().CurrentTime);
  simulationSnapshot = computed(() => this.simulationService.simulation()[this.snapshotIndex()]);
  options = this.simulationService.options.asReadonly();
}
