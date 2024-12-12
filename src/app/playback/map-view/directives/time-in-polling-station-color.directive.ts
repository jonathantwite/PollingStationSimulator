import { Directive, ElementRef, input, OnChanges, SimpleChanges } from '@angular/core';
import { Dayjs } from 'dayjs';

@Directive({
  selector: '[appTimeInPollingStationColor]',
  standalone: true
})
export class TimeInPollingStationColorDirective implements OnChanges {
  
  constructor(private el: ElementRef) {}

  currentTime = input<Dayjs>()
  timeArrived = input<Dayjs>()
  
  ngOnChanges(changes: SimpleChanges): void {
    if(!this.timeArrived || !this.currentTime){
      return;
    }
    let timeInMinutes = this.currentTime()!.diff(this.timeArrived(), 'minute');
    
    console.log(this.timeArrived(), this.currentTime(), timeInMinutes);
    
    if(timeInMinutes > 60) {  this.el.nativeElement.style.backgroundColor = 'red'; }
    else if(timeInMinutes > 15) {  this.el.nativeElement.style.backgroundColor = 'orange'; }
    else if(timeInMinutes > 5) {  this.el.nativeElement.style.backgroundColor = 'yellow'; }
    else if(timeInMinutes >= 0) {  this.el.nativeElement.style.backgroundColor = 'green'; }
  }
  
}
