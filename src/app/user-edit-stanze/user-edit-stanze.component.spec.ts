import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserEditStanzeComponent } from './user-edit-stanze.component';

describe('UserEditStanzeComponent', () => {
  let component: UserEditStanzeComponent;
  let fixture: ComponentFixture<UserEditStanzeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserEditStanzeComponent]
    });
    fixture = TestBed.createComponent(UserEditStanzeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
