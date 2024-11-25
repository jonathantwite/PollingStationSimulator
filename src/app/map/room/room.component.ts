import { Component, input } from '@angular/core';
import { QueueComponent } from "../queue/queue.component";
import { StationComponent } from "../station/station.component";

@Component({
  selector: 'app-room',
  standalone: true,
  imports: [QueueComponent, StationComponent],
  templateUrl: './room.component.html',
  styleUrl: './room.component.scss'
})
export class RoomComponent {
  roomTitle = input('room');
}
