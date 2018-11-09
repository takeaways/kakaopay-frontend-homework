import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogEventManageComponent } from './dialog-event-manage.component';

describe('DialogEventManageComponent', () => {
  let component: DialogEventManageComponent;
  let fixture: ComponentFixture<DialogEventManageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogEventManageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogEventManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
