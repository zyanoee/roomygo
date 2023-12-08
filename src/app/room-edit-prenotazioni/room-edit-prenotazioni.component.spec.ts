import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomEditPrenotazioniComponent } from './room-edit-prenotazioni.component';

describe('RoomEditPrenotazioniComponent', () => {
  let component: RoomEditPrenotazioniComponent;
  let fixture: ComponentFixture<RoomEditPrenotazioniComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RoomEditPrenotazioniComponent]
    });
    fixture = TestBed.createComponent(RoomEditPrenotazioniComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
