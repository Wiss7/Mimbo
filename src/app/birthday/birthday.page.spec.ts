import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { BirthdayPage } from './birthday.page';

describe('BirthdayPage', () => {
  let component: BirthdayPage;
  let fixture: ComponentFixture<BirthdayPage>;

  beforeEach(waitForAsync () => {
    fixture = TestBed.createComponent(BirthdayPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
