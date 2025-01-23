import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { SimulatorService } from '../../simulator/services/simulator.service';
import { Time } from '../../simulator/models/Time';
import { SettingsService } from '../services/settings.service';

@Component({
    selector: 'app-settings',
    imports: [ReactiveFormsModule],
    templateUrl: './settings.component.html',
    styleUrl: './settings.component.scss'
})
export class SettingsComponent {
  private formBuilder = inject(FormBuilder);
  private simulator = inject(SimulatorService);
  private service = inject(SettingsService);

  availableVisitProfiles = this.service.availableVisitProfiles;
  showAdvancedSettings = signal(false);

  settingsForm = this.formBuilder.group({
    selectedVisitProfile: [this.simulator.options().VisitProfile.name],
    totalElectorate: [this.simulator.options().TotalElectorate],
    turnout: [this.simulator.options().Turnout],
    openingTime: [this.simulator.options().OpeningTime.display(), Validators.required],
    closingTime: [this.simulator.options().ClosingTime.display(), Validators.required],
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
      VisitProfile: this.availableVisitProfiles.find(vp => vp.name === this.settingsForm.controls.selectedVisitProfile.value) ?? this.availableVisitProfiles[0],
      TotalElectorate: this.settingsForm.controls.totalElectorate.value as number,
      Turnout: this.settingsForm.controls.turnout.value as number,
      OpeningTime: Time.parse(this.settingsForm.controls.openingTime.value ?? ''),
      ClosingTime: Time.parse(this.settingsForm.controls.closingTime.value ?? ''),
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
