import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VoteOverlayComponent } from './vote-overlay.component';

describe('VoteOverlayComponent', () => {
  let component: VoteOverlayComponent;
  let fixture: ComponentFixture<VoteOverlayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VoteOverlayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VoteOverlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
