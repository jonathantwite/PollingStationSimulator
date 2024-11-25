import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./components/header/header.component";
import { MapComponent } from "./playback/map/map.component";
import { SettingsComponent } from "./settings/settings.component";
import { HelpComponent } from './components/help/help.component';
import { StatsComponent } from './components/stats/stats.component';
import { HelpService } from './services/help.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, MapComponent, SettingsComponent, StatsComponent, HelpComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  private helpService = inject(HelpService);
  showHelpPanel = this.helpService.showHelp;
  title = 'PollingStationSimulator';
}
