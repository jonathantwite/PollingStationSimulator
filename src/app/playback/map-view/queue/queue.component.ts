import { Component, inject, input } from '@angular/core';
import { Person } from '../../../generic/models/Person';
import { TimeInPollingStationColorDirective } from '../directives/time-in-polling-station-color.directive';
import { PlaybackService } from '../../services/playback.service';

@Component({
    selector: 'app-queue',
    imports: [TimeInPollingStationColorDirective],
    templateUrl: './queue.component.html',
    styleUrl: './queue.component.scss'
})
export class QueueComponent {
  private playbackService = inject(PlaybackService);

  people = input.required<Person[]>();
  currentTime = this.playbackService.currentTime;
}
