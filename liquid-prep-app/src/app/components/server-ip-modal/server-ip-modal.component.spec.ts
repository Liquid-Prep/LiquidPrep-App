import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServerIpModalComponent } from './server-ip-modal.component';

describe('ServerIpModalComponent', () => {
  let component: ServerIpModalComponent;
  let fixture: ComponentFixture<ServerIpModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServerIpModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ServerIpModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
