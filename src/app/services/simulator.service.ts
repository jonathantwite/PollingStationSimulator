import { Injectable, signal, WritableSignal } from '@angular/core';
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
    
    while (
      currentTime < this.options().ClosingTime
      || RegisterDeskQueue.length > 0
      || VotingBoothQueue.length > 0
      || BallotBoxQueue.length > 0
      || ExitQueue.length > 0){
        
        var currentSnapshot = new SimulationSnapshot(
          currentTime,
          BuildingQueue,
          RegisterDeskQueue,
          RegisterDesk,
          VotingBoothQueue,
          VotingBooth,
          BallotBoxQueue,
          BallotBox,
          ExitQueue,
          Voted,
          this.options());

        currentSnapshot.processTimePoint(currentTime);

        this.simulation.update(allSnapshots => [...allSnapshots, currentSnapshot]);
        
        currentTime = this.getNextTimePoint(currentTime);
      }
  }

  getNextTimePoint(currentTime: Dayjs){
    //TODO - something clever to ignore time when nothing happens
    return currentTime.add(1, 'second');
  }
}
