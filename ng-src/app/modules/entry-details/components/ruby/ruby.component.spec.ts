import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RubyComponent } from './ruby.component';

describe('RubyComponent', () => {
  let component: RubyComponent;
  let fixture: ComponentFixture<RubyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RubyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RubyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
