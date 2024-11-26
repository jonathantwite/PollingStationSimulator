import { computed, Injectable, signal, WritableSignal } from '@angular/core';
import { SimulatorOptions } from '../types/SimulatorOptions';
import { Person } from '../models/Person';
import dayjs, { Dayjs } from 'dayjs';
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
          
      this.currentProgressTime.set(currentTime);
      this.processTimePoint(currentTime, currentSnapshot);
      this.simulation.update(allSnapshots => [...allSnapshots, currentSnapshot]);
        
      currentTime = this.getNextTimePoint(currentTime);
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

  processTimePoint(time: Dayjs, simulationSnapshot: SimulationSnapshot){
    if(time.second() === 0 && (time.minute() % 1) === 0 && time < this.options().ClosingTime){
    //if(time.second() === 0 && time.minute() === 0 && time.hour() === 7){
        const p = new Person();
        p.CurrentLocation = 'Arriving';
        p.TimeArrived = time;
        simulationSnapshot.BuildingQueue.enqueue(p);
    }

    this.#processQueue(simulationSnapshot, simulationSnapshot.ExitQueue, simulationSnapshot.Voted, 'Exited', time, (p, t) => p.TimeExited = t);
    this.#processQueue(simulationSnapshot, simulationSnapshot.BallotBox, simulationSnapshot.ExitQueue, 'ExitQueue', time, (p, t) => p.TimeFinishedBallotBox = t);
    this.#processQueue(simulationSnapshot, simulationSnapshot.BallotBoxQueue, simulationSnapshot.BallotBox, 'BallotBox', time, (p, t) => p.TimeFinishedBallotBoxQueue = t);
    this.#processQueue(simulationSnapshot, simulationSnapshot.VotingBooth, simulationSnapshot.BallotBoxQueue, 'BallotBoxQueue', time, (p, t) => p.TimeFinishedVotingBooth = t);
    this.#processQueue(simulationSnapshot, simulationSnapshot.VotingBoothQueue, simulationSnapshot.VotingBooth, 'VotingBooth', time, (p, t) => p.TimeFinishedVotingBoothQueue = t);
    this.#processQueue(simulationSnapshot, simulationSnapshot.RegisterDesk, simulationSnapshot.VotingBoothQueue, 'VotingBoothQueue', time, (p, t) => p.TimeFinishedRegisterDesk = t);
    this.#processQueue(simulationSnapshot, simulationSnapshot.RegisterDeskQueue, simulationSnapshot.RegisterDesk, 'RegisterDesk', time, (p, t) => p.TimeFinishedRegisterDeskQueue = t);
    this.#processQueue(simulationSnapshot, simulationSnapshot.BuildingQueue, simulationSnapshot.RegisterDeskQueue, 'RegisterDeskQueue', time, (p, t) => p.TimeEnteredRegisterDeskQueue = t);
  }

  #processQueue(simulationSnapshot: SimulationSnapshot, currentLocationQueue: Queue<Person>, nextLocationQueue: Queue<Person>, nextLocation: StationLocation, currentTime: Dayjs, updateTimeFunc: (person: Person, time: Dayjs) => void){
    if(currentLocationQueue.length === 0){
      return;
    }
    
    var nextPerson = currentLocationQueue.front;
    if(nextPerson && this.canPersonMove(nextPerson, currentTime, simulationSnapshot)){
      var person = currentLocationQueue.dequeue();
      updateTimeFunc(person, currentTime);
      person.CurrentLocation = nextLocation;
      nextLocationQueue.enqueue(person);
    }
  }


    //TODO - currently all people move at same speed.  Need to generate random actual time each one spends at each location
    canPersonMove(person: Person, currentTime: Dayjs, simulationSnapshot: SimulationSnapshot){
      switch(person.CurrentLocation){
        case 'Arriving':          return simulationSnapshot.totalInBuilding() < this.options().MaxInBuilding && this.#canPersonMove(simulationSnapshot.RegisterDeskQueue.length,this.options().MaxQueueRegisterDesk, currentTime, currentTime, 0);
        case 'RegisterDeskQueue': return this.#canPersonMove(simulationSnapshot.RegisterDesk.length, this.options().NumberOfRegisterDesks, person.TimeEnteredRegisterDeskQueue, currentTime, this.options().MinTimeInRegisterDeskQueue);
        case 'RegisterDesk':      return this.#canPersonMove(simulationSnapshot.VotingBoothQueue.length, this.options().MaxQueueVotingBooth, person.TimeFinishedRegisterDeskQueue, currentTime, this.options().AvgTimeAtRegisterDesk);
        case 'VotingBoothQueue':  return this.#canPersonMove(simulationSnapshot.VotingBooth.length, this.options().NumberOfVotingBooths, person.TimeFinishedRegisterDesk, currentTime, this.options().MinTimeInVotingBoothQueue);
        case 'VotingBooth':       return this.#canPersonMove(simulationSnapshot.BallotBoxQueue.length, this.options().MaxQueueBallotBox, person.TimeFinishedVotingBoothQueue, currentTime, this.options().AvgTimeAtVotingBooth);
        case 'BallotBoxQueue':    return this.#canPersonMove(simulationSnapshot.BallotBox.length, this.options().NumberOfBallotBoxes, person.TimeFinishedVotingBooth, currentTime, this.options().MinTimeInBallotBoxQueue);
        case 'BallotBox':         return this.#canPersonMove(simulationSnapshot.ExitQueue.length, this.options().MaxInBuilding, person.TimeFinishedBallotBoxQueue, currentTime, this.options().AvgTimeAtBallotBox);
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
