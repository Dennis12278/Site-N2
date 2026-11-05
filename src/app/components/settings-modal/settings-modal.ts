import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-settings-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './settings-modal.html',
  styleUrl: './settings-modal.css'
})
export class SettingsModalComponent {

  @Output() fechar = new EventEmitter<void>();

  temaSelecionado = 'principal';

  selecionarTema(tema: string) {
    this.temaSelecionado = tema;
  }

}