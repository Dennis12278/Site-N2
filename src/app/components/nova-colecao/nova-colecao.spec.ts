import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NovaColecao } from './nova-colecao';

describe('NovaColecao', () => {
  let component: NovaColecao;
  let fixture: ComponentFixture<NovaColecao>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NovaColecao]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NovaColecao);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
