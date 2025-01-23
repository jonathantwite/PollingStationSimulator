import { computed, inject, Injectable, signal } from '@angular/core';
import { stringify, parse} from 'flatted';
import { SimulatorOptions } from '../types/SimulatorOptions';
import { Time } from '../models/Time';
import { Simulation } from '../models/Simulation';
import { SimulationDto } from '../../web-worker/SimulationDto';
import { SettingsService } from '../../simulation-setup/services/settings.service';

@Injectable({
  providedIn: 'root'
})
export class SimulatorService {

  constructor() { }
  
  settingService = inject(SettingsService);

  options = signal(this.settingService.defaultOptions);

  simulations = signal<Simulation[]>([]);
  simulation = computed(() => this.simulations().length > 0 ? this.simulations()[0] : undefined);
  simulationRunning = signal(false);
  simulationFinished = signal(false);
  currentProgressTime = signal(this.options().OpeningTime);
  currentProgress = computed(() => this.currentProgressTime().diff(this.options().OpeningTime, 'Seconds') / this.options().ClosingTime.diff(this.options().OpeningTime, 'Seconds'));


  runSimulation() {
    this.simulationFinished.set(false);
    this.simulationRunning.set(true);

    if (typeof Worker !== 'undefined') {
      // Create a new
      const worker = new Worker(new URL('./../../web-worker/app.worker', import.meta.url));
      const options = stringify(this.options());
      worker.postMessage(options);
      worker.onmessage = ev => {
        console.log(ev); 
        const parsedData = parse(ev.data) as SimulationDto;
        const simulation: Simulation = Simulation.fromDto(parsedData);
        
        console.log(simulation);
        this.simulations.update(s => [...s, simulation]);
        this.simulationRunning.set(false);
        this.simulationFinished.set(true);
        console.log("Finished");
      }
      worker.onerror = ev => console.log(ev);
    } else {
      // Web Workers are not supported in this environment.
      // You should add a fallback so that your program still executes correctly.
    }
  };
}
