import { Component, computed, effect, inject, signal } from '@angular/core';
import { RoomComponent } from "../room/room.component";
import { TimelineComponent } from "../../timeline/timeline.component";
import { PlaybackService } from '../../services/playback.service';
import { JsonPipe } from '@angular/common';
import { SimulatorService } from '../../../services/simulator.service';

@Component({
    selector: 'app-map',
    imports: [RoomComponent, TimelineComponent, JsonPipe],
    templateUrl: './map.component.html',
    styleUrl: './map.component.scss'
})
export class MapComponent {
  private simulator = inject(PlaybackService);
  private sim = inject(SimulatorService);
  snapshot = this.simulator.simulationSnapshot;
  simulation = this.sim.simulation;

  constructor() {/*effect(() => { console.log(this.simulator.snapshotIndex()); console.log(this.snapshot()); console.log(this.ballotBoxQueue()) })*/}

  buildingQueue = computed(() => this.simulator.simulationSnapshot().BuildingQueue.toArray());
  registerDeskQueue = computed(() => this.simulator.simulationSnapshot().RegisterDeskQueue.toArray());
  registerDesk = computed(() => this.simulator.simulationSnapshot().RegisterDesk.toArray());
  votingBoothQueue = computed(() => this.simulator.simulationSnapshot().VotingBoothQueue.toArray());
  votingBooth = computed(() => this.simulator.simulationSnapshot().VotingBooth.toArray());
  ballotBoxQueue = computed(() => this.simulator.simulationSnapshot().BallotBoxQueue.toArray());
  ballotBox = computed(() => this.simulator.simulationSnapshot().BallotBox.toArray());
  exitQueue = computed(() => this.simulator.simulationSnapshot().ExitQueue.toArray());

  numberOfRegisterDesks = this.simulator.options().NumberOfRegisterDesks;
  numberOfVotingBooths = this.simulator.options().NumberOfVotingBooths;
  numberOfBallotBoxes = this.simulator.options().NumberOfBallotBoxes;
}
