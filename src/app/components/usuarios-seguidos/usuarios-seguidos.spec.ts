import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsuariosSeguidos } from './usuarios-seguidos';

describe('UsuariosSeguidos', () => {
  let component: UsuariosSeguidos;
  let fixture: ComponentFixture<UsuariosSeguidos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsuariosSeguidos]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsuariosSeguidos);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
