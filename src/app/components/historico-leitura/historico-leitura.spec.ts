import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoricoLeitura } from './historico-leitura';


describe('HistoricoLeitura', () => {
  let component: HistoricoLeitura;
  let fixture: ComponentFixture<HistoricoLeitura>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistoricoLeitura]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HistoricoLeitura);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
