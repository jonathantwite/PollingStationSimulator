import { Component, inject, input } from '@angular/core';
import { Person } from '../../../simulator/models/Person';
import { TimeInPollingStationColorDirective } from '../directives/time-in-polling-station-color.directive';
import { PlaybackService } from '../../services/playback.service';

@Component({
    selector: 'app-station',
    imports: [TimeInPollingStationColorDirective],
    templateUrl: './station.component.html',
    styleUrl: './station.component.scss'
})
export class StationComponent {
  private playbackService = inject(PlaybackService);
  numOfStations = input<number>();
  people = input<Person[]>();
  currentTime = this.playbackService.currentTime;
}
