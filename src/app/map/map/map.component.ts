import { Component, inject } from '@angular/core';
import { RoomComponent } from "../room/room.component";
import { TimelineComponent } from "../timeline/timeline.component";
import { SimulatorService } from '../../services/simulator.service';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [RoomComponent, TimelineComponent],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss'
})
export class MapComponent {
  private simulator = inject(SimulatorService);

  buildingQueue = this.simulator.BuildingQueue;
  registerDeskQueue = this.simulator.RegisterDeskQueue;
  registerDesk = this.simulator.RegisterDesk;
  votingBoothQueue = this.simulator.VotingBoothQueue;
  votingBooth = this.simulator.VotingBooth;
  ballotBoxQueue = this.simulator.BallotBoxQueue;
  ballotBox = this.simulator.BallotBox;
  exitQueue = this.simulator.ExitQueue;

  numberOfRegisterDesks = this.simulator.options().NumberOfRegisterDesks;
  numberOfVotingBooths = this.simulator.options().NumberOfVotingBooths;
  numberOfBallotBoxes = this.simulator.options().NumberOfBallotBoxes;
}
