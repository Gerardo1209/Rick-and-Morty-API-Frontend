import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgClass } from '@angular/common';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    RouterModule,
    ReactiveFormsModule,
    NgClass,
    TooltipModule
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  searchGroup: FormGroup = new FormGroup({ //Group for reactive form
    //Controls search
    search: new FormControl<string|undefined>('', {
      validators: [Validators.required]
    })
  })
  invalidSearch:boolean = false //Invalid control

  constructor(private router:Router){
  }

  search(){
    /**
     * Search the introduced term
     */
    if(this.searchGroup.get('search')?.value){
      this.invalidSearch = false
      this.router.navigate(
        ['/search'],
        {
          queryParams: {'q':this.searchGroup.get('search')?.value},
          queryParamsHandling: 'merge'
        }
      )
    }else{
      /**
       * If no search, make the form invalid
       */
      this.invalidSearch = true;
    }
  }

  deselectSearch(){
    /**
     * When the search is unselected, returs to nomral as 'valid'
     */
    this.invalidSearch = false
  }
}
