import { Component, computed, inject, signal } from '@angular/core';
import { HelpService } from '../../services/help.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  helpService = inject(HelpService);
  toggleHelp = () => {
    this.helpService.showHelp.set(!this.helpService.showHelp());
  }
  helpButtonText = computed(() => this.helpService.showHelp() ? 'Hide help' : 'Show help');
}
