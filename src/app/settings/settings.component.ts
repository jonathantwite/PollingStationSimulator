import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { SimulatorService } from '../generic/services/simulator.service';
import dayjs from 'dayjs';

@Component({
    selector: 'app-settings',
    imports: [ReactiveFormsModule],
    templateUrl: './settings.component.html',
    styleUrl: './settings.component.scss'
})
export class SettingsComponent {
  private formBuilder = inject(FormBuilder);
  private simulator = inject(SimulatorService);

  showAdvancedSettings = signal(false);

  settingsForm = this.formBuilder.group({
    openingTime: [this.simulator.options().OpeningTime.format('HH:mm'), Validators.required],
    closingTime: [this.simulator.options().ClosingTime.format('HH:mm'), Validators.required],
    maxQueueRegisterDesk: [this.simulator.options().MaxQueueBallotBox, Validators.required],
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
  });

  toggleAdvancedSettings = () => this.showAdvancedSettings.update(s => !s);
  toggleAdvanceSettingsButtonText = computed(() => this.showAdvancedSettings() ? 'Hide advanced settings' : 'Show advanced settings');

  runSimulation() {
    this.simulator.options.set({
      VisitProfile: [],
      OpeningTime: dayjs('2024-01-01 ' + this.settingsForm.controls.openingTime.value),
      ClosingTime: dayjs('2024-01-01 ' + this.settingsForm.controls.closingTime.value),
      MaxQueueRegisterDesk: this.settingsForm.controls.maxQueueRegisterDesk.value as number,
      NumberOfRegisterDesks: this.settingsForm.controls.numberOfRegisterDesks.value as number,
      MaxQueueVotingBooth: this.settingsForm.controls.maxQueueVotingBooth.value as number,
      NumberOfVotingBooths: this.settingsForm.controls.numberOfVotingBooths.value as number,
      MaxQueueBallotBox: this.settingsForm.controls.maxQueueBallotBox.value as number,
      NumberOfBallotBoxes: this.settingsForm.controls.numberOfBallotBoxes.value as number,
      MaxInBuilding: this.settingsForm.controls.maxInBuilding.value as number,
      MinTimeInRegisterDeskQueue: this.settingsForm.controls.minTimeInRegisterDeskQueue.value as number,
      AvgTimeAtRegisterDesk: this.settingsForm.controls.avgTimeAtRegisterDesk.value as number,
      MinTimeInVotingBoothQueue: this.settingsForm.controls.minTimeInVotingBoothQueue.value as number,
      AvgTimeAtVotingBooth: this.settingsForm.controls.avgTimeAtVotingBooth.value as number,
      MinTimeInBallotBoxQueue: this.settingsForm.controls.minTimeInBallotBoxQueue.value as number,
      AvgTimeAtBallotBox: this.settingsForm.controls.avgTimeAtBallotBox.value as number,
      MinTimeInExitQueue: this.settingsForm.controls.minTimeInExitQueue.value as number,
    });

    this.simulator.runSimulation();
  }
}
