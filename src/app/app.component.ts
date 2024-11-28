import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./layout-components/header/header.component";
import { MapComponent } from "./playback/map-view/map/map.component";
import { SettingsComponent } from "./settings/settings.component";
import { HelpComponent } from './layout-components/help/help.component';
import { StatsComponent } from './statistics/stats/stats.component';
import { HelpService } from './services/help.service';
import { PlaybackService } from './playback/services/playback.service';
import { IntroComponent } from './playback/intro/intro.component';
import { SimulatorService } from './services/simulator.service';
import { SimulationRunningComponent } from './layout-components/simulation-running/simulation-running.component';

@Component({
  selector: 'app-root',
  standalone: true,
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
