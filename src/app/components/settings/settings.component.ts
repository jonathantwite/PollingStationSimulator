import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { SimulatorService } from '../../services/simulator.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent {
  private formBuilder = inject(FormBuilder);
  private simulator = inject(SimulatorService);

  showAdvancedSettings = signal(true);

  settingsForm = this.formBuilder.group({
    openingTime: ['', Validators.required],
    closingTime: ['', Validators.required],
    maxQueueRegisterDesk: [this.simulator.options().MaxQueueBallotBox],
    numberOfRegisterDesks: [this.simulator.options().NumberOfRegisterDesks],
    maxQueueVotingBooth: [this.simulator.options().MaxQueueVotingBooth],
    numberOfVotingBooths: [this.simulator.options().NumberOfVotingBooths],
    maxQueueBallotBox: [this.simulator.options().MaxQueueBallotBox],
    numberOfBallotBoxes: [this.simulator.options().NumberOfBallotBoxes],
    maxInBuilding: [this.simulator.options().MaxInBuilding],
    minTimeInRegisterDeskQueue: [this.simulator.options().MinTimeInRegisterDeskQueue],
    avgTimeAtRegisterDesk: [this.simulator.options().AvgTimeAtRegisterDesk],
    minTimeInVotingBoothQueue: [this.simulator.options().MinTimeInVotingBoothQueue],
    avgTimeAtVotingBooth: [this.simulator.options().AvgTimeAtVotingBooth],
    minTimeInBallotBoxQueue: [this.simulator.options().MinTimeInBallotBoxQueue],
    avgTimeAtBallotBox: [this.simulator.options().AvgTimeAtBallotBox],
    minTimeInExitQueue: [this.simulator.options().MinTimeInExitQueue]
  })
}
