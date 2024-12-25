import { Component, input } from '@angular/core';
import { QueueComponent } from "../queue/queue.component";
import { StationComponent } from "../station/station.component";
import { Person } from '../../../generic/models/Person';

@Component({
    selector: 'app-room',
    imports: [QueueComponent, StationComponent],
    templateUrl: './room.component.html',
    styleUrl: './room.component.scss'
})
export class RoomComponent {
  roomTitle = input.required<string>();
  queue = input.required<Person[]>();
  station = input<Person[]>();
  useStation = input(true);
  numOfStations = input<number>();
}
