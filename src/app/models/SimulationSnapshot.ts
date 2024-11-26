import { Queue } from "queue-typescript";
import { Person } from "./Person";
import dayjs, { Dayjs } from "dayjs";
import minMax from "dayjs/plugin/minMax";
import { StationLocation } from "../types/StationLocation";
import { SimulatorOptions } from "../types/SimulatorOptions";
import { PersonWithNextTime } from "./PersonWithNextTime";

export class SimulationSnapshot {
  constructor(
    public CurrentTime: Dayjs,
    public BuildingQueue: Queue<Person>,
    public RegisterDeskQueue: Queue<Person>,
    public RegisterDesk: Queue<Person>,
    public VotingBoothQueue: Queue<Person>,
    public VotingBooth: Queue<Person>,
    public BallotBoxQueue: Queue<Person>,
    public BallotBox: Queue<Person>,
    public ExitQueue: Queue<Person>,
    public Voted: Queue<Person>,
    private options: SimulatorOptions) {}
  
  processTimePoint(time: Dayjs){
    if(time.second() === 0 && (time.minute() % 1) === 0 && time < this.options.ClosingTime){
    //if(time.second() === 0 && time.minute() === 0 && time.hour() === 7){
        const p = new Person();
        p.CurrentLocation = 'Arriving';
        p.TimeArrived = time;
        this.BuildingQueue.enqueue(p);
    }

    console.log('time', time);
    this.#processQueue(this.ExitQueue, this.Voted, 'Exited', time, (p, t) => p.TimeExited = t);
    this.#processQueue(this.BallotBox, this.ExitQueue, 'ExitQueue', time, (p, t) => p.TimeFinishedBallotBox = t);
    this.#processQueue(this.BallotBoxQueue, this.BallotBox, 'BallotBox', time, (p, t) => p.TimeFinishedBallotBoxQueue = t);
    this.#processQueue(this.VotingBooth, this.BallotBoxQueue, 'BallotBoxQueue', time, (p, t) => p.TimeFinishedVotingBooth = t);
    this.#processQueue(this.VotingBoothQueue, this.VotingBooth, 'VotingBooth', time, (p, t) => p.TimeFinishedVotingBoothQueue = t);
    this.#processQueue(this.RegisterDesk, this.VotingBoothQueue, 'VotingBoothQueue', time, (p, t) => p.TimeFinishedRegisterDesk = t);
    this.#processQueue(this.RegisterDeskQueue, this.RegisterDesk, 'RegisterDesk', time, (p, t) => p.TimeFinishedRegisterDeskQueue = t);
    this.#processQueue(this.BuildingQueue, this.RegisterDeskQueue, 'RegisterDeskQueue', time, (p, t) => p.TimeEnteredRegisterDeskQueue = t);
  }

  #processQueue(currentLocationQueue: Queue<Person>, nextLocationQueue: Queue<Person>, nextLocation: StationLocation, currentTime: Dayjs, updateTimeFunc: (person: Person, time: Dayjs) => void){
    if(currentLocationQueue.length === 0){
      return;
    }
    
    var nextPerson = currentLocationQueue.front;
    if(nextPerson && this.canPersonMove(nextPerson, currentTime)){
      var person = currentLocationQueue.dequeue();
      updateTimeFunc(person, currentTime);
      person.CurrentLocation = nextLocation;
      nextLocationQueue.enqueue(person);
    }
  }

  //TODO - currently all people move at same speed.  Need to generate random actual time each one spends at each location
  canPersonMove(person: Person, currentTime: Dayjs){
    switch(person.CurrentLocation){
      case 'Arriving':          return this.totalInBuilding() < this.options.MaxInBuilding && this.#canPersonMove(this.RegisterDeskQueue.length,this.options.MaxQueueRegisterDesk, currentTime, currentTime, 0);
      case 'RegisterDeskQueue': return this.#canPersonMove(this.RegisterDesk.length, this.options.NumberOfRegisterDesks, person.TimeEnteredRegisterDeskQueue, currentTime, this.options.MinTimeInRegisterDeskQueue);
      case 'RegisterDesk':      return this.#canPersonMove(this.VotingBoothQueue.length, this.options.MaxQueueVotingBooth, person.TimeFinishedRegisterDeskQueue, currentTime, this.options.AvgTimeAtRegisterDesk);
      case 'VotingBoothQueue':  return this.#canPersonMove(this.VotingBooth.length, this.options.NumberOfVotingBooths, person.TimeFinishedRegisterDesk, currentTime, this.options.MinTimeInVotingBoothQueue);
      case 'VotingBooth':       return this.#canPersonMove(this.BallotBoxQueue.length, this.options.MaxQueueBallotBox, person.TimeFinishedVotingBoothQueue, currentTime, this.options.AvgTimeAtVotingBooth);
      case 'BallotBoxQueue':    return this.#canPersonMove(this.BallotBox.length, this.options.NumberOfBallotBoxes, person.TimeFinishedVotingBooth, currentTime, this.options.MinTimeInBallotBoxQueue);
      case 'BallotBox':         return this.#canPersonMove(this.ExitQueue.length, this.options.MaxInBuilding, person.TimeFinishedBallotBoxQueue, currentTime, this.options.AvgTimeAtBallotBox);
      case 'ExitQueue':         return this.#canPersonMove(0, 1, person.TimeFinishedBallotBox, currentTime, this.options.MinTimeInExitQueue);
      case 'Exited': return false;
    }
  }

  totalInBuilding = () => this.RegisterDeskQueue.length + this.RegisterDesk.length + this.VotingBoothQueue.length + this.VotingBooth.length + this.BallotBoxQueue.length + this.BallotBox.length + this.ExitQueue.length;

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

  getNextTimePoint(
    currentTime: Dayjs
  ){
    //TODO - something clever to ignore time when nothing happens
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
}
