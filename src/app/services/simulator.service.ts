import { Injectable, signal } from '@angular/core';
import { SimulatorOptions } from '../types/SimulatorOptions';
import { Queue } from 'queue-typescript';
import { Person } from '../models/Person';
import dayjs from 'dayjs';
import { StationLocation } from '../types/StationLocation';

@Injectable({
  providedIn: 'root'
})
export class SimulatorService {

  constructor() { }

  options = signal<SimulatorOptions>({
    VisitProfile: [],
    OpeningTime: new Date(2024,1,1,7,0,0,0),
    ClosingTime: new Date(2024,1,1,22,0,0,0),
    MaxInBuilding: 120,
    MaxQueueRegisterDesk: 10,
    MaxQueueVotingBooth: 4,
    MaxQueueBallotBox: 4,
    MinTimeInRegisterDeskQueue: 60,
    MinTimeInVotingBoothQueue: 5,
    MinTimeInBallotBoxQueue: 15,
    MinTimeInExitQueue: 60
  });

  currentTime = signal(this.options().OpeningTime);

  BuildingQueue = new Queue<Person>();
  RegisterDeskQueue = new Queue<Person>();
  RegisterDesk: Person[] = [];
  VotingBoothQueue = new Queue<Person>();
  VotingBooth: Person[] = [];
  BallotBoxQueue = new Queue<Person>();
  BallotBox: Person[] = [];
  ExitBoxQueue = new Queue<Person>();
  Voted: Person[] = []


  runSimulation() {
    while (
      this.currentTime() < this.options().ClosingTime
      || this.RegisterDeskQueue.length > 0
      || this.VotingBoothQueue.length > 0
      || this.BallotBoxQueue.length > 0
      || this.ExitBoxQueue.length > 0){

        this.processTimePoint(this.currentTime());
        
        this.currentTime.set(this.getNextTimePoint());
      }


  }

  getNextTimePoint(){
    //TODO
    return dayjs(this.currentTime()).add(60, 'second').toDate();
  }

  processTimePoint(time: Date){
    if(this.canPersonMove(this.ExitBoxQueue.front)){
      var person = this.ExitBoxQueue.dequeue();
      person.TimeExited = time;
      person.CurrentLocation = 'Exited';
      this.Voted.push(person);
    }

    this.BallotBox.forEach(person => {
      if(this.canPersonMove(person)){
        this.BallotBox.splice(this.BallotBox.indexOf(person));
        person.TimeFinishedBallotBox = time;
        person.CurrentLocation = 'ExitQueue';
        this.ExitBoxQueue.enqueue(person);
      }
    });

    if(this.canPersonMove(this.BallotBoxQueue.front)){
      let person = this.BallotBoxQueue.dequeue();
      person.TimeFinishedBallotBoxQueue = time;
      person.CurrentLocation = 'BallotBox';
      this.BallotBox.push(person);
    }
  }

  canPersonMove(person: Person){
    //TODO
    return true;
  }
}
