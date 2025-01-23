import { TestBed } from '@angular/core/testing';

import { SettingsService } from './settings.service';
import { SimulatorOptions } from '../../simulator/types/SimulatorOptions';
import { Time } from '../../simulator/models/Time';
import { VisitProfile } from '../../simulator/types/VisitProfile';




describe('SettingsService', () => {
  let service: SettingsService;
  let options: SimulatorOptions;

  beforeEach(() => {
    const fixture = TestBed.configureTestingModule({providers: [SettingsService]});
    service = TestBed.inject(SettingsService);

    //fixture.cha
    options = service.defaultOptions;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('availableVisitProfiles', ()=>{
    describe('Consistent', () => {
      let profileFunction: (time: Time, options: SimulatorOptions) => number;
      
      beforeEach(() => {
        profileFunction = (service.availableVisitProfiles.find(vp => vp.name === 'Consistent') as VisitProfile).profile;
        //1000 electors over 10 hours - 100 per hour
        options.ClosingTime = new Time(17, 0, 0);
        options.Turnout = 100;
        options.TotalElectorate = 1000;
      });

      const testCases: {time: Time, expected: number}[] = [
        { time: new Time(7, 0, 0), expected: 100 },
        { time: new Time(8, 0, 0), expected: 100 },
        { time: new Time(9, 0, 0), expected: 100 },
        { time: new Time(10, 0, 0), expected: 100 },
        { time: new Time(11, 0, 0), expected: 100 },
        { time: new Time(12, 0, 0), expected: 100 },
        { time: new Time(13, 0, 0), expected: 100 },
        { time: new Time(14, 0, 0), expected: 100 },
        { time: new Time(15, 0, 0), expected: 100 },
        { time: new Time(16, 0, 0), expected: 100 },
        { time: new Time(17, 0, 0), expected: 100 },
      ];
      testCases.forEach(({ time, expected}) => {
        it(`Profile at ${time.displays()} is correct`, () => {
          expect(profileFunction(time, options)*1000).toBe(expected);
        });
      });
    });


    describe('Late rush', () => {
      let profileFunction: (time: Time, options: SimulatorOptions) => number;
      
      beforeEach(() => {
        profileFunction = (service.availableVisitProfiles.find(vp => vp.name === 'Late rush') as VisitProfile).profile;
        //1000 electors over 10 hours - 100 per hour
        options.ClosingTime = new Time(17, 0, 0);
        options.Turnout = 100;
        options.TotalElectorate = 1000;
      });

      const val = 1*1 + 2*2 + 3*3 + 4*4 + 5*5 + 6*6 + 7*7 + 8*8 + 9*9;

      const testCases: {time: Time, expected: number}[] = [
        { time: new Time(7, 0, 0), expected: 0 },
        { time: new Time(8, 0, 0), expected: 1*1*1000/val },
        { time: new Time(9, 0, 0), expected: 2*2*1000/val },
        { time: new Time(10, 0, 0), expected: 3*3*1000/val },
        { time: new Time(11, 0, 0), expected: 4*4*1000/val },
        { time: new Time(12, 0, 0), expected: 5*5*1000/val },
        { time: new Time(13, 0, 0), expected: 6*6*1000/val },
        { time: new Time(14, 0, 0), expected: 7*7*1000/val },
        { time: new Time(15, 0, 0), expected: 8*8*1000/val },
        { time: new Time(16, 0, 0), expected: 9*9*1000/val },
        { time: new Time(17, 0, 0), expected: 10*10*1000/val },
      ];
      testCases.forEach(({ time, expected}) => {
        it(`Profile at ${time.displays()} is correct`, () => {
          console.log('val', val)
          expect(profileFunction(time, options)*1000).toBeCloseTo(expected, 3);
        });
      });

      it('Adds up to 1', () => {
        const actual = 
          profileFunction(new Time(7, 0, 0), options)
          + profileFunction(new Time(8, 0, 0), options)
          + profileFunction(new Time(9, 0, 0), options)
          + profileFunction(new Time(10, 0, 0), options)
          + profileFunction(new Time(11, 0, 0), options)
          + profileFunction(new Time(12, 0, 0), options)
          + profileFunction(new Time(13, 0, 0), options)
          + profileFunction(new Time(14, 0, 0), options)
          + profileFunction(new Time(15, 0, 0), options)
          + profileFunction(new Time(16, 0, 0), options)
          + profileFunction(new Time(17, 0, 0), options);

        expect(actual).toBeCloseTo(1, 3);
      })
    });

  });
});
