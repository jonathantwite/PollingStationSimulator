import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimulationRunningComponent } from './simulation-running.component';

describe('SimulationRunningComponent', () => {
  let component: SimulationRunningComponent;
  let fixture: ComponentFixture<SimulationRunningComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SimulationRunningComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SimulationRunningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
