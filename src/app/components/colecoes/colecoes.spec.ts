import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Colecoes } from './colecoes';

describe('Colecoes', () => {
  let component: Colecoes;
  let fixture: ComponentFixture<Colecoes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Colecoes]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Colecoes);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
