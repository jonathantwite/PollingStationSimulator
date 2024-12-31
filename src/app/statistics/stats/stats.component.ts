import { Component, computed, inject, ViewChild } from '@angular/core';
import { StatsService } from '../services/stats.service';
import { ApexAxisChartSeries, ChartComponent, ChartType, NgApexchartsModule } from 'ng-apexcharts';
import { SimulatorService } from '../../generic/services/simulator.service';

type ChartOptions = {
  series: NonNullable<ApexAxisChartSeries>;
  chart: NonNullable<ApexChart>;
  xaxis: ApexXAxis;
  title: ApexTitleSubtitle;
};

/** *******************************************************************
 * NOTE
 * 
 * Change 
 *   type: ChartType;
 * To
 *   type?: ChartType;
 * On line 40 of node_modules/ng-apexcharts/lib/model/apex-types.d.ts
 * ********************************************************************/

@Component({
    selector: 'app-stats',
    imports: [NgApexchartsModule],
    templateUrl: './stats.component.html',
    styleUrl: './stats.component.scss'
})
export class StatsComponent {
  private statsService = inject(StatsService);
  private simulationService = inject(SimulatorService);

  firstTime = computed(() => this.simulationService.simulation()[0]?.CurrentTime);
  lastTime = computed(() => this.simulationService.simulation()[this.simulationService.simulation().length - 1]?.CurrentTime);

  numberOfTimepoints = computed(() => this.firstTime() && this.lastTime() ? this.lastTime().hour - this.firstTime().hour + 1 : 1);

  //totalInBuilding = computed(() => Array(this.numberOfTimepoints()).fill(1).map((_, i) => ({x: this.firstTime().add(i, 'hour').format('HH:mm'), y: 5})));
  maxInBuilding = computed(() =>
    this.simulationService.simulation()
      .map(s => (
        {
          time: `${s.CurrentTime.hour}:00`,
          totalInBuilding: s.totalInBuilding()
        }
      ))
      .reduce((arr, nextVal) => {
        const v = arr.find(a => a.x === nextVal.time)
        if(v) {
          if(nextVal.totalInBuilding > v.y) {
            v.y = nextVal.totalInBuilding;
          }
        }
        else{
          arr.push({x: nextVal.time, y: nextVal.totalInBuilding});
        }
        return arr;
      }, [] as {x: string, y: number}[])
  );
  
  maxInBuildingQueue = computed(() =>
    this.simulationService.simulation()
      .map(s => (
        {
          time: `${s.CurrentTime.hour}:00`,
          totalInBuildingQueue: s.BuildingQueue.length
        }
      ))
      .reduce((arr, nextVal) => {
        const v = arr.find(a => a.x === nextVal.time)
        if(v) {
          if(nextVal.totalInBuildingQueue > v.y) {
            v.y = nextVal.totalInBuildingQueue;
          }
        }
        else{
          arr.push({x: nextVal.time, y: nextVal.totalInBuildingQueue});
        }
        return arr;
      }, [] as {x: string, y: number}[])
  );

  @ViewChild("chart") chart!: ChartComponent;
  public chartOptions: ChartOptions  = {
    series: [
      {
        name: "Maximum in building",
        data: this.maxInBuilding()
      },
      {
        name: "Maximum queueing outside",
        data: this.maxInBuildingQueue()
      }
    ],
    chart: {
      height: 150,
      width: 1000,
      type: "area",
      stacked: true
    },
    title: {
      text: "People"
    },
    xaxis: {
      categories: ["2024-01-01 9:00", "2024-01-01 10:00",  "2024-01-01 11:00",  "2024-01-01 12:00"]
    }
  };;

  constructor() {
    
  }

  series = this.chartOptions.series
  chart2 = this.chartOptions.chart.type
  //abc: ChartType = []

  averageTotalSecondsUntilVoted = this.statsService.averageTotalSecondsUntilVoted;
}
