import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KanjiTreeComponent } from './kanji-tree.component';

describe('KanjiTreeComponent', () => {
  let component: KanjiTreeComponent;
  let fixture: ComponentFixture<KanjiTreeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KanjiTreeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KanjiTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
