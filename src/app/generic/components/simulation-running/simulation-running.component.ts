import { Component, computed, inject } from '@angular/core';
import { SimulatorService } from '../../../simulator/services/simulator.service';

@Component({
    selector: 'app-simulation-running',
    imports: [],
    templateUrl: './simulation-running.component.html',
    styleUrl: './simulation-running.component.scss'
})
export class SimulationRunningComponent {
  simulator = inject(SimulatorService);

  currentTime = computed(() => this.simulator.currentProgressTime().display());
  currentProgress = this.simulator.currentProgress;
}
