import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GruposSeguidos } from './grupos-seguidos';

describe('GruposSeguidos', () => {
  let component: GruposSeguidos;
  let fixture: ComponentFixture<GruposSeguidos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GruposSeguidos]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GruposSeguidos);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
