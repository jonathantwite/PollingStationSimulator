import { Component, computed, inject } from '@angular/core';
import { SimulatorService } from '../../simulator/services/simulator.service';
import { TimeLineEntry } from '../../simulator/models/TimeLineEntry';
import { PlaybackService } from '../services/playback.service';
import { Time } from '../../simulator/models/Time';

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
  snapshotCurrentTime = computed(() => this.currentSnapshot()?.CurrentTime);//this.playbackService.currentTime;
  next = () => this.playbackService.snapshotIndex.update(i => ++i);
  previous = () => this.playbackService.snapshotIndex.update(i => --i);
  hasNext = this.playbackService.hasNext;
  hasPrevious = this.playbackService.hasPrevious;

  timeline = computed(() => {
    let time = new Time(this.openingTime.hour, 0, 0);
    const output: TimeLineEntry[] = [];

    while(time.isLessThanOrEqualTo(this.closingTime)){
      const entries = this.simulator.simulation()?.snapshots.filter(snapshot => snapshot.CurrentTime.hour === time.hour) ?? [];
      output.push(new TimeLineEntry(time, Math.max(...entries.map(sn => sn.totalInBuilding())), Math.max(...entries.map(sn => sn.BuildingQueue.length))));
      time = time.add(1, 'Hours');
    }

    return output;
  })
}
