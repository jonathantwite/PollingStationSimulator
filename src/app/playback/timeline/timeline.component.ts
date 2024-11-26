import { Component, computed, effect, inject } from '@angular/core';
import { SimulatorService } from '../../services/simulator.service';
import { DatePipe } from '@angular/common';
import { TimeLineEntry } from '../../models/TimeLineEntry';
import { PlaybackService } from '../services/playback.service';

@Component({
  selector: 'app-timeline',
  standalone: true,
  imports: [DatePipe],
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

  timeline = computed(() => {
    let time = this.openingTime.minute(0).second(0);
    const output: TimeLineEntry[] = [];

    while(time <= this.closingTime){
      //console.log(time.format("HH:mm"));
      //console.log(this.simulator.simulation().filter(snapshot => snapshot.CurrentTime.hour() === time.hour()));
      //console.log(this.simulator.simulation().filter(snapshot => snapshot.CurrentTime.hour() === time.hour()).map(sn => sn.totalInBuilding()));

      output.push(new TimeLineEntry(time, Math.max(...this.simulator.simulation().filter(snapshot => snapshot.CurrentTime.hour() === time.hour()).map(sn => sn.totalInBuilding()))));
      time = time.add(1, 'hour');
    }

    return output;
  })
}
