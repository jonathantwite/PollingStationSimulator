import { computed, Injectable, signal, WritableSignal } from '@angular/core';
import { SimulatorOptions } from '../types/SimulatorOptions';
import { Person } from '../models/Person';
import dayjs, { Dayjs } from 'dayjs';
import { dequeue, enqueue, front, tail } from '../helpers/signalHelpers/arrayHelpers';
import { StationLocation } from '../types/StationLocation';
import { SimulationSnapshot } from '../models/SimulationSnapshot';
import { Queue } from 'queue-typescript';

@Injectable({
  providedIn: 'root'
})
export class SimulatorService {

  constructor() { }

  options = signal<SimulatorOptions>({
    VisitProfile: [],
    OpeningTime: dayjs(new Date(2024,1,1,7,0,0,0)),
    ClosingTime: dayjs(new Date(2024,1,1,22,0,0,0)),
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

  simulation = signal<SimulationSnapshot[]>([]);
  simulationRunning = signal(false);
  simulationFinished = signal(false);
  currentProgressTime = signal(this.options().OpeningTime);
  currentProgress = computed(() => this.currentProgressTime().diff(this.options().OpeningTime, 'second') / this.options().ClosingTime.diff(this.options().OpeningTime, 'second'));

  runSimulation() {
    this.simulation.set([]);
    let currentTime = this.options().OpeningTime;
    //const CurrentTime!: Dayjs;
    const BuildingQueue = new Queue<Person>();
    const RegisterDeskQueue = new Queue<Person>();
    const RegisterDesk = new Queue<Person>();
    const VotingBoothQueue = new Queue<Person>();
    const VotingBooth = new Queue<Person>();
    const BallotBoxQueue = new Queue<Person>();
    const BallotBox = new Queue<Person>();
    const ExitQueue = new Queue<Person>();
    const Voted = new Queue<Person>();

    this.simulationFinished.set(false);
    this.simulationRunning.set(true);
    
    let count = 0;

    while (
      ++count < 115 &&// 24*60*60 &&
      (currentTime < this.options().ClosingTime
      || RegisterDeskQueue.length > 0
      || VotingBoothQueue.length > 0
      || BallotBoxQueue.length > 0
      || ExitQueue.length > 0)){
        
        const previousSnapshot = this.simulation().length > 0 ? this.simulation()[this.simulation().length - 1] : undefined;

        const currentSnapshot = new SimulationSnapshot(
          currentTime,
          previousSnapshot ? new Queue<Person>(...this.deepCopyPerson(previousSnapshot.BuildingQueue.toArray())) : new Queue<Person>(),
          previousSnapshot ? new Queue<Person>(...this.deepCopyPerson(previousSnapshot.RegisterDeskQueue.toArray())) : new Queue<Person>(),
          previousSnapshot ? new Queue<Person>(...this.deepCopyPerson(previousSnapshot.RegisterDesk.toArray())) : new Queue<Person>(),
          previousSnapshot ? new Queue<Person>(...this.deepCopyPerson(previousSnapshot.VotingBoothQueue.toArray())) : new Queue<Person>(),
          previousSnapshot ? new Queue<Person>(...this.deepCopyPerson(previousSnapshot.VotingBooth.toArray())) : new Queue<Person>(),
          previousSnapshot ? new Queue<Person>(...this.deepCopyPerson(previousSnapshot.BallotBoxQueue.toArray())) : new Queue<Person>(),
          previousSnapshot ? new Queue<Person>(...this.deepCopyPerson(previousSnapshot.BallotBox.toArray())) : new Queue<Person>(),
          previousSnapshot ? new Queue<Person>(...this.deepCopyPerson(previousSnapshot.ExitQueue.toArray())) : new Queue<Person>(),
          previousSnapshot ? new Queue<Person>(...this.deepCopyPerson(previousSnapshot.Voted.toArray())) : new Queue<Person>(),
          this.options());

        console.log(currentSnapshot);
          
      this.currentProgressTime.set(currentTime);
      currentSnapshot.processTimePoint(currentTime);
      this.simulation.update(allSnapshots => [...allSnapshots, currentSnapshot]);
        
      currentTime = currentSnapshot.getNextTimePoint(currentTime);
    }
    this.simulationRunning.set(false);
    this.simulationFinished.set(true);

  }

  deepCopyPerson(array: Person[]){
    const copy = JSON.parse(JSON.stringify(array)) as Person[];
    copy.forEach(p => {
      p.TimeArrived = p.TimeArrived ? dayjs(p.TimeArrived) : undefined;
      p.TimeEnteredRegisterDeskQueue = p.TimeEnteredRegisterDeskQueue ? dayjs(p.TimeEnteredRegisterDeskQueue) : undefined;
      p.TimeFinishedRegisterDeskQueue = p.TimeFinishedRegisterDeskQueue ? dayjs(p.TimeFinishedRegisterDeskQueue) : undefined;
      p.TimeFinishedRegisterDesk = p.TimeFinishedRegisterDesk ? dayjs(p.TimeFinishedRegisterDesk) : undefined;
      p.TimeFinishedVotingBoothQueue = p.TimeFinishedVotingBoothQueue ? dayjs(p.TimeFinishedVotingBoothQueue) : undefined;
      p.TimeFinishedVotingBooth = p.TimeFinishedVotingBooth ? dayjs(p.TimeFinishedVotingBooth) : undefined;
      p.TimeFinishedBallotBoxQueue = p.TimeFinishedBallotBoxQueue ? dayjs(p.TimeFinishedBallotBoxQueue) : undefined;
      p.TimeFinishedBallotBox = p.TimeFinishedBallotBox ? dayjs(p.TimeFinishedBallotBox) : undefined;
      p.TimeExited = p.TimeExited ? dayjs(p.TimeExited) : undefined;
    });

    return copy;
  }

}
