import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DemoVotingComponent } from './demo-voting.component';

describe('DemoVotingComponent', () => {
  let component: DemoVotingComponent;
  let fixture: ComponentFixture<DemoVotingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DemoVotingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DemoVotingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
