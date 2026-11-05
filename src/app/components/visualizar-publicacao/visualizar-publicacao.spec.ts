import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualizarPublicacao } from './visualizar-publicacao';

describe('VisualizarPublicacao', () => {
  let component: VisualizarPublicacao;
  let fixture: ComponentFixture<VisualizarPublicacao>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VisualizarPublicacao]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VisualizarPublicacao);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
