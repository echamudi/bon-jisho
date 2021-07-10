import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VocabularyListsComponent } from './vocabulary-lists.component';

describe('VocabularyListsComponent', () => {
  let component: VocabularyListsComponent;
  let fixture: ComponentFixture<VocabularyListsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VocabularyListsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VocabularyListsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
