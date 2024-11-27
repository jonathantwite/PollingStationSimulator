import { computed, Injectable, signal, WritableSignal } from '@angular/core';
import { SimulatorOptions } from '../types/SimulatorOptions';
import { Person } from '../models/Person';
import dayjs, { Dayjs } from 'dayjs';
import { StationLocation } from '../types/StationLocation';
import { SimulationSnapshot } from '../models/SimulationSnapshot';
import { Queue } from 'queue-typescript';
import { deepCopyPerson } from '../helpers/modelHelpers/PeopleHelpers';

type AllQueues = {
  BuildingQueue: Queue<Person>,
  RegisterDeskQueue: Queue<Person>,
  RegisterDesk: Queue<Person>,
  VotingBoothQueue: Queue<Person>,
  VotingBooth: Queue<Person>,
  BallotBoxQueue: Queue<Person>,
  BallotBox: Queue<Person>,
  ExitQueue: Queue<Person>,
  Voted: Queue<Person>,
};

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
    
    const AllQueues: AllQueues = {
      BuildingQueue: new Queue<Person>(),
      RegisterDeskQueue: new Queue<Person>(),
      RegisterDesk: new Queue<Person>(),
      VotingBoothQueue: new Queue<Person>(),
      VotingBooth: new Queue<Person>(),
      BallotBoxQueue: new Queue<Person>(),
      BallotBox: new Queue<Person>(),
      ExitQueue: new Queue<Person>(),
      Voted: new Queue<Person>()
    }

    this.simulationFinished.set(false);
    this.simulationRunning.set(true);
    
    let count = 0;

    while (
      ++count < 24*60*60 &&
      (currentTime < this.options().ClosingTime
      || AllQueues.RegisterDeskQueue.length > 0
      || AllQueues.RegisterDesk.length > 0
      || AllQueues.VotingBoothQueue.length > 0
      || AllQueues.VotingBooth.length > 0
      || AllQueues.BallotBoxQueue.length > 0
      || AllQueues.BallotBox.length > 0
      || AllQueues.ExitQueue.length > 0)){
        
      //const previousSnapshot = this.simulation().length > 0 ? this.simulation()[this.simulation().length - 1] : undefined;

      this.currentProgressTime.set(currentTime);
      this.processTimePoint(currentTime, AllQueues);
        
      const currentSnapshot = new SimulationSnapshot(
        currentTime,
        new Queue<Person>(...deepCopyPerson(AllQueues.BuildingQueue.toArray())),
        new Queue<Person>(...deepCopyPerson(AllQueues.RegisterDeskQueue.toArray())),
        new Queue<Person>(...deepCopyPerson(AllQueues.RegisterDesk.toArray())),
        new Queue<Person>(...deepCopyPerson(AllQueues.VotingBoothQueue.toArray())),
        new Queue<Person>(...deepCopyPerson(AllQueues.VotingBooth.toArray())),
        new Queue<Person>(...deepCopyPerson(AllQueues.BallotBoxQueue.toArray())),
        new Queue<Person>(...deepCopyPerson(AllQueues.BallotBox.toArray())),
        new Queue<Person>(...deepCopyPerson(AllQueues.ExitQueue.toArray())),
        new Queue<Person>(...deepCopyPerson(AllQueues.Voted.toArray())),
        this.options());
          
      this.simulation.update(allSnapshots => [...allSnapshots, currentSnapshot]);
        
      currentTime = this.getNextTimePoint(currentTime);
    }
    this.simulationRunning.set(false);
    this.simulationFinished.set(true);

  }

  getNextTimePoint(
    currentTime: Dayjs
  ){
    //TODO - something clever to ignore time when nothing happens - or don't save snapshot if nothing happens
    return currentTime.add(20, 'second');

    //const nextMin = currentTime.second(0).add(1, 'minute');
    //
    //const allPeopleWithNextTime: PersonWithNextTime[] = [
    //  ...this.RegisterDeskQueue.toArray().map(p => { const pn = p as PersonWithNextTime; pn.NextTime = pn.TimeEnteredRegisterDeskQueue?.add(this.options.MinTimeInRegisterDeskQueue, 'second'); return pn}),
    //  ...this.RegisterDesk.toArray().map(p => { const pn = p as PersonWithNextTime; pn.NextTime = pn.TimeFinishedRegisterDeskQueue?.add(this.options.AvgTimeAtRegisterDesk, 'second'); return pn})
    //]
//
    //const nextPersonEvent = allPeopleWithNextTime.sort((a, b) => dayjs.min(a.NextTime as Dayjs, b.NextTime as Dayjs) === a.NextTime ? -1 : 1)[0]?.NextTime ?? dayjs(new Date(2099,12,31,23,59,59));
//
    //dayjs.extend(minMax);
    //return dayjs.min(nextMin, nextPersonEvent);
  }

  processTimePoint(time: Dayjs, AllQueues:AllQueues){
    if(time.second() === 0 && (time.minute() % 1) === 0 && time < this.options().ClosingTime){
    //if(time.second() === 0 && time.minute() === 0 && time.hour() === 7){
        const p = new Person();
        p.CurrentLocation = 'Arriving';
        p.TimeArrived = time;
        AllQueues.BuildingQueue.enqueue(p);
    }

    this.#processQueue(AllQueues, AllQueues.ExitQueue, AllQueues.Voted, 'Exited', time, (p, t) => p.TimeExited = t);
    this.#processQueue(AllQueues, AllQueues.BallotBox, AllQueues.ExitQueue, 'ExitQueue', time, (p, t) => p.TimeFinishedBallotBox = t);
    this.#processQueue(AllQueues, AllQueues.BallotBoxQueue, AllQueues.BallotBox, 'BallotBox', time, (p, t) => p.TimeFinishedBallotBoxQueue = t);
    this.#processQueue(AllQueues, AllQueues.VotingBooth, AllQueues.BallotBoxQueue, 'BallotBoxQueue', time, (p, t) => p.TimeFinishedVotingBooth = t);
    this.#processQueue(AllQueues, AllQueues.VotingBoothQueue, AllQueues.VotingBooth, 'VotingBooth', time, (p, t) => p.TimeFinishedVotingBoothQueue = t);
    this.#processQueue(AllQueues, AllQueues.RegisterDesk, AllQueues.VotingBoothQueue, 'VotingBoothQueue', time, (p, t) => p.TimeFinishedRegisterDesk = t);
    this.#processQueue(AllQueues, AllQueues.RegisterDeskQueue, AllQueues.RegisterDesk, 'RegisterDesk', time, (p, t) => p.TimeFinishedRegisterDeskQueue = t);
    this.#processQueue(AllQueues, AllQueues.BuildingQueue, AllQueues.RegisterDeskQueue, 'RegisterDeskQueue', time, (p, t) => p.TimeEnteredRegisterDeskQueue = t);
  }

  #processQueue(AllQueues: AllQueues, currentLocationQueue: Queue<Person>, nextLocationQueue: Queue<Person>, nextLocation: StationLocation, currentTime: Dayjs, updateTimeFunc: (person: Person, time: Dayjs) => void){
    if(currentLocationQueue.length === 0){
      return;
    }
    
    var nextPerson = currentLocationQueue.front;
    if(nextPerson && this.canPersonMove(nextPerson, currentTime, AllQueues)){
      const person = currentLocationQueue.dequeue();
      updateTimeFunc(person, currentTime);
      person.CurrentLocation = nextLocation;
      nextLocationQueue.enqueue(person);
    }
  }

  //TODO - currently all people move at same speed.  Need to generate random actual time each one spends at each location
  canPersonMove(person: Person, currentTime: Dayjs, AllQueues: AllQueues){
    const totalInBuilding = AllQueues.RegisterDeskQueue.length + AllQueues.RegisterDesk.length + AllQueues.VotingBoothQueue.length + AllQueues.VotingBooth.length + AllQueues.BallotBoxQueue.length + AllQueues.BallotBox.length + AllQueues.ExitQueue.length;
    switch(person.CurrentLocation){
      case 'Arriving':          return totalInBuilding < this.options().MaxInBuilding && this.#canPersonMove(AllQueues.RegisterDeskQueue.length,this.options().MaxQueueRegisterDesk, currentTime, currentTime, 0);
      case 'RegisterDeskQueue': return this.#canPersonMove(AllQueues.RegisterDesk.length, this.options().NumberOfRegisterDesks, person.TimeEnteredRegisterDeskQueue, currentTime, this.options().MinTimeInRegisterDeskQueue);
      case 'RegisterDesk':      return this.#canPersonMove(AllQueues.VotingBoothQueue.length, this.options().MaxQueueVotingBooth, person.TimeFinishedRegisterDeskQueue, currentTime, this.options().AvgTimeAtRegisterDesk);
      case 'VotingBoothQueue':  return this.#canPersonMove(AllQueues.VotingBooth.length, this.options().NumberOfVotingBooths, person.TimeFinishedRegisterDesk, currentTime, this.options().MinTimeInVotingBoothQueue);
      case 'VotingBooth':       return this.#canPersonMove(AllQueues.BallotBoxQueue.length, this.options().MaxQueueBallotBox, person.TimeFinishedVotingBoothQueue, currentTime, this.options().AvgTimeAtVotingBooth);
      case 'BallotBoxQueue':    return this.#canPersonMove(AllQueues.BallotBox.length, this.options().NumberOfBallotBoxes, person.TimeFinishedVotingBooth, currentTime, this.options().MinTimeInBallotBoxQueue);
      case 'BallotBox':         return this.#canPersonMove(AllQueues.ExitQueue.length, this.options().MaxInBuilding, person.TimeFinishedBallotBoxQueue, currentTime, this.options().AvgTimeAtBallotBox);
      case 'ExitQueue':         return this.#canPersonMove(0, 1, person.TimeFinishedBallotBox, currentTime, this.options().MinTimeInExitQueue);
      case 'Exited': return false;
    }
  }

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
