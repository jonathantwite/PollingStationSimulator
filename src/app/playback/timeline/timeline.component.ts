import { Component, computed, effect, inject } from '@angular/core';
import { SimulatorService } from '../../generic/services/simulator.service';
import { DatePipe } from '@angular/common';
import { TimeLineEntry } from '../../generic/models/TimeLineEntry';
import { PlaybackService } from '../services/playback.service';

@Component({
    selector: 'app-timeline',
    templateUrl: './timeline.component.html',
    styleUrl: './timeline.component.scss'
})
export class TimelineComponent {
  private simulator = inject(SimulatorService);
  private playbackService = inject(PlaybackService);
  
  constructor() {}

  openingTime = this.simulator.options().OpeningTime;
  closingTime = this.simulator.options().ClosingTime;
  
  currentSnapshot = this.playbackService.simulationSnapshot;
  snapshotCurrentTime = computed(() => this.currentSnapshot().CurrentTime);//this.playbackService.currentTime;
  next = () => this.playbackService.snapshotIndex.update(i => ++i);
  previous = () => this.playbackService.snapshotIndex.update(i => --i);
  hasNext = this.playbackService.hasNext;
  hasPrevious = this.playbackService.hasPrevious;

  timeline = computed(() => {
    let time = this.openingTime.minute(0).second(0);
    const output: TimeLineEntry[] = [];

    while(time <= this.closingTime){
      const entries = this.simulator.simulation().filter(snapshot => snapshot.CurrentTime.hour() === time.hour());
      output.push(new TimeLineEntry(time, Math.max(...entries.map(sn => sn.totalInBuilding())), Math.max(...entries.map(sn => sn.BuildingQueue.length))));
      time = time.add(1, 'hour');
    }

    return output;
  })
}
