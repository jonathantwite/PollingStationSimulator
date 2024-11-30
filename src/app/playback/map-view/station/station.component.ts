import { Component, input } from '@angular/core';
import { Person } from '../../../models/Person';
import { TimeInPollingStationColorDirective } from '../directives/time-in-polling-station-color.directive';
import dayjs from 'dayjs';

@Component({
    selector: 'app-station',
    imports: [TimeInPollingStationColorDirective],
    templateUrl: './station.component.html',
    styleUrl: './station.component.scss'
})
export class StationComponent {
  numOfStations = input<number>();
  people = input<Person[]>();
  currentTime = dayjs(new Date(2024,1,1,11,0,0));
}
