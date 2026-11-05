import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TitulosSeguidos } from './titulos-seguidos';

describe('TitulosSeguidos', () => {
  let component: TitulosSeguidos;
  let fixture: ComponentFixture<TitulosSeguidos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TitulosSeguidos]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TitulosSeguidos);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
