import { Component, inject } from '@angular/core';
import { SimulatorService } from '../../services/simulator.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-timeline',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './timeline.component.html',
  styleUrl: './timeline.component.scss'
})
export class TimelineComponent {
  private simulator = inject(SimulatorService);
  
  openingTime = this.simulator.options().OpeningTime;
  closingTime = this.simulator.options().ClosingTime;
  currentTime = this.simulator.currentTime;
}
