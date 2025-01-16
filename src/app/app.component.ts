import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./generic/components/header/header.component";
import { MapComponent } from "./playback/map-view/map/map.component";
import { SettingsComponent } from "./settings/settings.component";
import { HelpComponent } from './generic/components/help/help.component';
import { StatsComponent } from './statistics/stats/stats.component';
import { HelpService } from './generic/services/help.service';
import { PlaybackService } from './playback/services/playback.service';
import { IntroComponent } from './playback/intro/intro.component';
import { SimulatorService } from './simulator/services/simulator.service';
import { SimulationRunningComponent } from './generic/components/simulation-running/simulation-running.component';

@Component({
    selector: 'app-root',
    imports: [RouterOutlet, HeaderComponent, MapComponent, SettingsComponent, StatsComponent, HelpComponent, IntroComponent, SimulationRunningComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent {
  private helpService = inject(HelpService);
  private playbackService = inject(PlaybackService);
  private simulatorService = inject(SimulatorService);
  showHelpPanel = this.helpService.showHelp;
  title = 'PollingStationSimulator';
  showSimulation = this.playbackService.simulationReady;
  simulationRunning = this.simulatorService.simulationRunning;
}
