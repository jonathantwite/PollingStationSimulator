import { computed, inject, Injectable, signal, effect } from '@angular/core';
import { SimulatorService } from '../../simulator/services/simulator.service';

@Injectable({
  providedIn: 'root'
})
export class PlaybackService {

  constructor() { }
  private simulationService = inject(SimulatorService);

  snapshotIndex = signal(0);
  currentTime = computed(() => this.simulationSnapshot()?.CurrentTime);
  simulationSnapshot = computed(() => this.simulationService.simulation()?.snapshots[this.snapshotIndex()]);
  options = this.simulationService.options.asReadonly();
  simulationReady = computed(() => (this.simulationService.simulation()?.snapshots.length ?? 0) > 0 && this.simulationService.simulationFinished());

  hasNext = computed(() => this.snapshotIndex() < (this.simulationService.simulation()?.snapshots.length ?? 0));
  hasPrevious = computed(() => this.snapshotIndex() > 1);
}
