import { TestBed } from '@angular/core/testing';
import { computed, inject, Injectable, signal, WritableSignal } from '@angular/core';

import { StatsService } from './stats.service';
import { SimulationSnapshot } from '../../generic/models/SimulationSnapshot';
import { Queue } from 'queue-typescript';
import { Person } from '../../generic/models/Person';
import { SimulatorOptions } from "../../generic/types/SimulatorOptions";
import { SimulatorService } from '../../generic/services/simulator.service';
import { Time } from '../../generic/models/Time';

fdescribe('StatsService', () => {
  
  // Mock other services
  let simulatorServiceMock: jasmine.SpyObj<SimulatorService>;
  
  // Injected service instances
  let statService: StatsService;
  let simulatorServiceSpy: jasmine.SpyObj<SimulatorService>;

  // Setup Testbed for all tests
  beforeEach(() => {
    simulatorServiceMock = jasmine.createSpyObj('SimulatorService', ['simulation']);

    TestBed.configureTestingModule({
      providers: [
        StatsService, 
        { provide: SimulatorService, useValue: simulatorServiceMock }]
    });
    
    statService = TestBed.inject(StatsService);
    simulatorServiceSpy = TestBed.inject(SimulatorService) as jasmine.SpyObj<SimulatorService>;
  });



  describe('Pre simulation', () => {
    beforeEach(() => {
      const simulationOutput: SimulationSnapshot[] = [];
      simulatorServiceMock.simulation.and.returnValue(simulationOutput);
    });
  
    describe('averageTotalSecondsUntilVoted', () => {
      it('no error', () => {
        expect(() => statService.averageTotalSecondsUntilVoted()).not.toThrow();
      });
    });
  });



  describe('With simulation', () => {
    
    //Setup data
    beforeEach(() => {
      const options:SimulatorOptions = {
        VisitProfile: [],
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

      
      // Length of time until voting
      const dt1 = 5;
      const dt2 = 10;
      const dt3 = 15;
      
      // Time arrived
      const t1 = options.OpeningTime;
      const t2 = options.OpeningTime.add(1, 'Hours');
      const t3 = options.OpeningTime.add(2, 'Hours');

      const p1 = new Person();
      const p2 = new Person();
      const p3 = new Person();

      p1.CurrentLocation = 'Exited';
      p1.TimeArrived = t1;
      p1.TimeFinishedBallotBox = t1.add(dt1, 'Minutes');
      
      p2.CurrentLocation = 'Exited';
      p2.TimeArrived = t2;
      p2.TimeFinishedBallotBox = t2.add(dt2, 'Minutes');
      
      p3.CurrentLocation = 'Exited';
      p3.TimeArrived = t3;
      p3.TimeFinishedBallotBox = t3.add(dt3, 'Minutes');

      const simulationOutput: SimulationSnapshot[] = [
        new SimulationSnapshot(
          options.OpeningTime,
          new Queue<Person>(),
          new Queue<Person>(),
          new Queue<Person>(),
          new Queue<Person>(),
          new Queue<Person>(),
          new Queue<Person>(),
          new Queue<Person>(),
          new Queue<Person>(),
          new Queue<Person>(),
          options
        ),
        new SimulationSnapshot(
          options.ClosingTime,
          new Queue<Person>(),
          new Queue<Person>(),
          new Queue<Person>(),
          new Queue<Person>(),
          new Queue<Person>(),
          new Queue<Person>(),
          new Queue<Person>(),
          new Queue<Person>(),
          new Queue<Person>(p1, p2, p3),
          options
        ),
      ];

      simulatorServiceMock.simulation.and.returnValue(simulationOutput);
    });
    
    it('averageTotalSecondsUntilVoted correct value', () => {
      var actual = statService.averageTotalSecondsUntilVoted();
      expect(actual).toBe(10 * 60);
    });
  });
  
});
