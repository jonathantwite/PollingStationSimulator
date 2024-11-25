import { Component, inject, signal } from '@angular/core';
import { RoomComponent } from "../room/room.component";
import { TimelineComponent } from "../timeline/timeline.component";
import { PlaybackService } from '../services/playback.service';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [RoomComponent, TimelineComponent],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss'
})
export class MapComponent {
  private simulator = inject(PlaybackService);
  private snapshot = this.simulator.simulationSnapshot;

  buildingQueue = signal(this.snapshot().BuildingQueue.toArray());
  registerDeskQueue = signal(this.snapshot().RegisterDeskQueue.toArray());
  registerDesk = signal(this.snapshot().RegisterDesk.toArray());
  votingBoothQueue = signal(this.snapshot().VotingBoothQueue.toArray());
  votingBooth = signal(this.snapshot().VotingBooth.toArray());
  ballotBoxQueue = signal(this.snapshot().BallotBoxQueue.toArray());
  ballotBox = signal(this.snapshot().BallotBox.toArray());
  exitQueue = signal(this.snapshot().ExitQueue.toArray());

  numberOfRegisterDesks = this.simulator.options().NumberOfRegisterDesks;
  numberOfVotingBooths = this.simulator.options().NumberOfVotingBooths;
  numberOfBallotBoxes = this.simulator.options().NumberOfBallotBoxes;
}
