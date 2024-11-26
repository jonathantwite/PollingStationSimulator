import { Component, computed, inject } from '@angular/core';
import { SimulatorService } from '../../services/simulator.service';

@Component({
  selector: 'app-simulation-running',
  standalone: true,
  imports: [],
  templateUrl: './simulation-running.component.html',
  styleUrl: './simulation-running.component.scss'
})
export class SimulationRunningComponent {
  simulator = inject(SimulatorService);

  currentTime = computed(() => this.simulator.currentProgressTime().format('HH:mm'));
  currentProgress = this.simulator.currentProgress;
}
