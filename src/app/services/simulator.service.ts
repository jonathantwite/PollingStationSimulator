import { Injectable, signal } from '@angular/core';
import { SimulatorOptions } from '../types/SimulatorOptions';
import { Queue } from 'queue-typescript';
import { Person } from '../models/Person';
import dayjs, { Dayjs } from 'dayjs';
import { StationLocation } from '../types/StationLocation';

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

  currentTime = signal(this.options().OpeningTime);

  BuildingQueue = new Queue<Person>();
  RegisterDeskQueue = new Queue<Person>();
  RegisterDesk: Person[] = [];
  VotingBoothQueue = new Queue<Person>();
  VotingBooth: Person[] = [];
  BallotBoxQueue = new Queue<Person>();
  BallotBox: Person[] = [];
  ExitQueue = new Queue<Person>();
  Voted: Person[] = []


  runSimulation() {
    while (
      this.currentTime() < this.options().ClosingTime
      || this.RegisterDeskQueue.length > 0
      || this.VotingBoothQueue.length > 0
      || this.BallotBoxQueue.length > 0
      || this.ExitQueue.length > 0){

        this.processTimePoint(this.currentTime());
        
        this.currentTime.set(this.getNextTimePoint());
      }


  }

  getNextTimePoint(){
    //TODO
    return dayjs(this.currentTime()).add(60, 'second');
  }

  processTimePoint(time: Dayjs){
    if(this.canPersonMove(this.ExitQueue.front)){
      var person = this.ExitQueue.dequeue();
      person.TimeExited = time;
      person.CurrentLocation = 'Exited';
      this.Voted.push(person);
    }

    this.BallotBox.forEach(person => {
      if(this.canPersonMove(person)){
        this.BallotBox.splice(this.BallotBox.indexOf(person));
        person.TimeFinishedBallotBox = time;
        person.CurrentLocation = 'ExitQueue';
        this.ExitQueue.enqueue(person);
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
    switch(person.CurrentLocation){
      case 'Arriving':          return this.totalInBuilding() < this.options().MaxInBuilding && this.#canPersonMove(this.RegisterDeskQueue.length,this.options().MaxQueueRegisterDesk, this.currentTime(), this.currentTime(), 0);
      case 'RegisterDeskQueue': return this.#canPersonMove(this.RegisterDesk.length, this.options().NumberOfRegisterDesks, person.TimeEnteredRegisterDeskQueue, this.currentTime(), this.options().MinTimeInRegisterDeskQueue);
      case 'RegisterDesk':      return this.#canPersonMove(this.VotingBoothQueue.length, this.options().MaxQueueVotingBooth, person.TimeFinishedRegisterDeskQueue, this.currentTime(), this.options().AvgTimeAtRegisterDesk);
      case 'VotingBoothQueue':  return this.#canPersonMove(this.VotingBooth.length, this.options().NumberOfVotingBooths, person.TimeFinishedRegisterDesk, this.currentTime(), this.options().MinTimeInVotingBoothQueue);
      case 'VotingBooth':       return this.#canPersonMove(this.BallotBoxQueue.length, this.options().MaxQueueBallotBox, person.TimeFinishedVotingBoothQueue, this.currentTime(), this.options().AvgTimeAtVotingBooth);
      case 'BallotBoxQueue':    return this.#canPersonMove(this.BallotBox.length, this.options().NumberOfBallotBoxes, person.TimeFinishedVotingBooth, this.currentTime(), this.options().MinTimeInBallotBoxQueue);
      case 'BallotBox':         return this.#canPersonMove(this.ExitQueue.length, this.options().MaxInBuilding, person.TimeFinishedBallotBoxQueue, this.currentTime(), this.options().AvgTimeAtBallotBox);
      case 'ExitQueue':         return this.#canPersonMove(0, 1, person.TimeFinishedBallotBox, this.currentTime(), this.options().MinTimeInExitQueue);
      case 'Exited': return false;
    }
  }

  totalInBuilding = () => this.RegisterDeskQueue.length + this.VotingBoothQueue.length + this.BallotBoxQueue.length + this.ExitQueue.length;

  #canPersonMove(
    nextLocationCurrentSize: number, 
    nextLocationMaxSize: number, 
    timeFinishedPreviousLocation: Dayjs | undefined, 
    currentTime: Dayjs, 
    minimumSecondsToCompleteCurrentLocation: number) {
    
      return (
        nextLocationCurrentSize < nextLocationMaxSize
        && timeFinishedPreviousLocation != undefined
        && (timeFinishedPreviousLocation?.add(minimumSecondsToCompleteCurrentLocation, 'second') ?? currentTime.add(1, 'minute')) <= currentTime);
  }
}
