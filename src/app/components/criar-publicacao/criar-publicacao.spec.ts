import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CriarPublicacao } from './criar-publicacao';

describe('CriarPublicacao', () => {
  let component: CriarPublicacao;
  let fixture: ComponentFixture<CriarPublicacao>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CriarPublicacao]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CriarPublicacao);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
