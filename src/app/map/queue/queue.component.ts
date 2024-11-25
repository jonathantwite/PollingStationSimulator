import { Component, input } from '@angular/core';
import { Person } from '../../models/Person';
import { TimeInPollingStationColorDirective } from '../directives/time-in-polling-station-color.directive';
import dayjs from 'dayjs';

@Component({
  selector: 'app-queue',
  standalone: true,
  imports: [TimeInPollingStationColorDirective],
  templateUrl: './queue.component.html',
  styleUrl: './queue.component.scss'
})
export class QueueComponent {
  people = input.required<Person[]>()
  currentTime = dayjs(new Date(2024,1,1,11,0,0));
}
