import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserEditPrenotazioniComponent } from './user-edit-prenotazioni.component';

describe('UserEditPrenotazioniComponent', () => {
  let component: UserEditPrenotazioniComponent;
  let fixture: ComponentFixture<UserEditPrenotazioniComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserEditPrenotazioniComponent]
    });
    fixture = TestBed.createComponent(UserEditPrenotazioniComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
