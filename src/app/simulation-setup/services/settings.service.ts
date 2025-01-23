import { Injectable } from '@angular/core';
import { VisitProfile } from '../../simulator/types/VisitProfile';
import { SimulatorOptions } from '../../simulator/types/SimulatorOptions';
import { Time } from '../../simulator/models/Time';

export type ProfileNames = "Consistent" | "Late rush";

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  constructor() { }

  private normalise = (t: Time, o: SimulatorOptions, fx: (x: number) => number) => {
    const totalHours = o.ClosingTime.diff(o.OpeningTime, 'Hours');
    const x = t.diff(o.OpeningTime, 'Hours');

    let total = 0;
    for(let i = 0; i < totalHours; i++){
      total += fx(i);
      console.log(i, fx(i), total)
    }

    console.log(o);

    console.log('totalHours', totalHours);
    console.log('x', x);
    console.log('total', total);
    console.log('fx(x)', fx(x));
    console.log('fx(x) / total', fx(x) / total);


    return fx(x) / total;
  }

  availableVisitProfiles: VisitProfile[] = [
    { 
      name: "Consistent", 
      profile: (t, o) => {
        const totalHours = o.ClosingTime.diff(o.OpeningTime, 'Hours');
        return 1 / totalHours;
      }
    },
    { 
      name: "Late rush", 
      profile: (t, o) => this.normalise(t, o, x => x * x)
    }
  ];

  defaultOptions: SimulatorOptions = {
    VisitProfile: this.availableVisitProfiles[0],
    TotalElectorate: 2000,
    Turnout: 65,
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
  };
}
