import { Component, input } from '@angular/core';

@Component({
  selector: 'app-station',
  standalone: true,
  imports: [],
  templateUrl: './station.component.html',
  styleUrl: './station.component.scss'
})
export class StationComponent {
  numOfStations = input<number>();
}
