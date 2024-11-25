import { Component } from '@angular/core';
import { RoomComponent } from "../room/room.component";
import { TimelineComponent } from "../timeline/timeline.component";

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [RoomComponent, TimelineComponent],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss'
})
export class MapComponent {
  
}
