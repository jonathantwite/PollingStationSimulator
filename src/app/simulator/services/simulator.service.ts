import { computed, Injectable, signal } from '@angular/core';
import { stringify, parse} from 'flatted';
import { SimulatorOptions } from '../types/SimulatorOptions';
import { SimulationSnapshot } from '../models/SimulationSnapshot';
import { Time } from '../models/Time';
import { Queue } from 'queue-typescript';
import { Person } from '../models/Person';
import { Simulation } from '../models/Simulation';

@Injectable({
  providedIn: 'root'
})
export class SimulatorService {

  constructor() { }
  
  options = signal<SimulatorOptions>({
    VisitProfile: [],
    OpeningTime: new Time(7,0,0),
    ClosingTime: new Time(22,0,0),
    NumberOfRegisterDesks: 2,
    NumberOfVotingBooths: 4,
    NumberOfBallotBoxes: 1,
    MaxInBuilding: 120,
    MaxQueueRegisterDesk: 10,
    MaxQueueVotingBooth: 4,
    MaxQueueBallotBox: 4,
    MinTimeInRegisterDeskQueue: 60,
    AvgTimeAtRegisterDesk: 90,
    MinTimeInVotingBoothQueue: 5,
    AvgTimeAtVotingBooth: 30,
    MinTimeInBallotBoxQueue: 15,
    AvgTimeAtBallotBox: 20,
    MinTimeInExitQueue: 60
  });

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
      const worker = new Worker(new URL('./../../app.worker', import.meta.url));
      const options = stringify(this.options());
      worker.postMessage(options);
      worker.onmessage = ev => {
        console.log(ev); 
        const simulation: Simulation = Simulation.fromJsonSnapshots(this.options(), ev.data);
        
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
