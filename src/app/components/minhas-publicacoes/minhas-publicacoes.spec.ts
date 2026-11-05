import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MinhasPublicacoes } from './minhas-publicacoes';

describe('MinhasPublicacoes', () => {
  let component: MinhasPublicacoes;
  let fixture: ComponentFixture<MinhasPublicacoes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MinhasPublicacoes]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MinhasPublicacoes);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
