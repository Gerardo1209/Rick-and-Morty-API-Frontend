import { Component } from '@angular/core';
import { Input } from '@angular/core';
import { character } from '../../services/rickandmorty.service';
import { NgClass } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [NgClass, RouterModule],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css'
})
export class CardComponent {
  @Input({required:false}) character!:character;
}
