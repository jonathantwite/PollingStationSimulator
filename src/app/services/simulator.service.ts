import { Injectable, signal, WritableSignal } from '@angular/core';
import { SimulatorOptions } from '../types/SimulatorOptions';
import { Person } from '../models/Person';
import dayjs, { Dayjs } from 'dayjs';
import { dequeue, enqueue, front } from '../helpers/signalHelpers/arrayHelpers';
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

  currentTime = signal(dayjs(new Date(2024,1,1,11,0,0))/*this.options().OpeningTime*/);

  BuildingQueue = signal<Person[]>([]);
  RegisterDeskQueue = signal<Person[]>([{ CurrentLocation: 'RegisterDeskQueue', TimeEnteredRegisterDeskQueue: dayjs(new Date(2024,1,1,10,55,0))}, { CurrentLocation: 'RegisterDeskQueue', TimeEnteredRegisterDeskQueue: dayjs(new Date(2024,1,1,9,30,0))}]);
  RegisterDesk = signal<Person[]>([]);
  VotingBoothQueue = signal<Person[]>([]);
  VotingBooth = signal<Person[]>([]);
  BallotBoxQueue = signal<Person[]>([]);
  BallotBox = signal<Person[]>([]);
  ExitQueue = signal<Person[]>([]);
  Voted = signal<Person[]>([]);


  runSimulation() {
    console.log("Running Simulation");
    console.log(this.options());
    /*
    while (
      this.currentTime() < this.options().ClosingTime
      || this.RegisterDeskQueue.length > 0
      || this.VotingBoothQueue.length > 0
      || this.BallotBoxQueue.length > 0
      || this.ExitQueue.length > 0){

        this.processTimePoint(this.currentTime());
        
        this.currentTime.set(this.getNextTimePoint());
      }
        */
  }

  getNextTimePoint(){
    //TODO - something clever to ignore time when nothing happens
    return dayjs(this.currentTime()).add(1, 'second');
  }

  processTimePoint(time: Dayjs){
    this.#processQueue(this.ExitQueue, this.Voted, 'Exited', p => p.TimeExited = time);
    this.#processQueue(this.BallotBox, this.ExitQueue, 'ExitQueue', p => p.TimeFinishedBallotBox = time);
    this.#processQueue(this.BallotBoxQueue, this.BallotBox, 'BallotBox', p => p.TimeFinishedBallotBoxQueue = time);
    this.#processQueue(this.VotingBooth, this.BallotBoxQueue, 'BallotBoxQueue', p => p.TimeFinishedVotingBooth = time);
    this.#processQueue(this.VotingBoothQueue, this.VotingBooth, 'VotingBooth', p => p.TimeFinishedVotingBoothQueue = time);
    this.#processQueue(this.RegisterDesk, this.VotingBoothQueue, 'VotingBoothQueue', p => p.TimeFinishedRegisterDesk = time);
    this.#processQueue(this.RegisterDeskQueue, this.RegisterDesk, 'RegisterDesk', p => p.TimeFinishedRegisterDeskQueue = time);
    this.#processQueue(this.BuildingQueue, this.RegisterDeskQueue, 'RegisterDeskQueue', p => p.TimeEnteredRegisterDeskQueue = time);
  }

  #processQueue(currentLocationQueue: WritableSignal<Person[]>, nextLocationQueue: WritableSignal<Person[]>, nextLocation: StationLocation, updateTimeFunc: (person: Person) => void){
    if(currentLocationQueue.length === 0){
      return;
    }

    var nextPerson = front(currentLocationQueue);
    if(nextPerson && this.canPersonMove(nextPerson)){
      var person = dequeue(currentLocationQueue) as Person;
      updateTimeFunc(person);
      person.CurrentLocation = nextLocation;
      enqueue(nextLocationQueue,person);
    }
  }

  //TODO - currently all people move at same speed.  Need to generate random actual time each one spends at each location
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
