import { Component, OnDestroy, OnInit } from '@angular/core';
import { CardComponent } from '../card/card.component';
import { RickandmortyService, characters } from '../../services/rickandmorty.service';
import { NgClass } from '@angular/common';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { PaginationComponent } from '../../navigation/pagination/pagination.component';

@Component({
  selector: 'app-wiki',
  standalone: true,
  imports: [
    CardComponent,
    NgClass,
    RouterModule,
    PaginationComponent
  ],
  providers: [RickandmortyService],
  templateUrl: './wiki.component.html',
  styleUrl: './wiki.component.css'
})

export class WikiComponent implements OnDestroy{
  currentPage:characters | undefined // Data from the current page
  numberPage: number = 1 // Current page number
  paramsSubscription:Subscription|undefined // Saves the subscription
  loading: boolean = false //Indicates if the data is beign fetched form the API
  loadingArray = [1,2,3,4,5] //Number of loading cards
  error: boolean = false //If an error appears in fetching, activate

  constructor(private rickandmortyService: RickandmortyService, private route:ActivatedRoute, private router:Router){
    /**
     * Subscribe to the params for listen to changes in the page number
     */
    this.paramsSubscription = this.route.params.subscribe(params => {
      this.numberPage = (params["page"]!=undefined ? parseInt(params["page"]!) : 1)
      this.getContent(this.numberPage)
    })
  }

  ngOnDestroy(): void {
    /**
     * Unsubscribe form the params changes
     */
    if(this.paramsSubscription!=undefined) this.paramsSubscription.unsubscribe()
  }

  async getContent(page:number){
    /**
     * Gets the data for the page
     */
    this.loading = true //State of loading changed
    try{
      await this.rickandmortyService.getPage(page).forEach(pageData => {
        this.currentPage = <characters>pageData
      })
    }catch(error){
      this.error = true
    }

    this.loading = false; // Finish the fetch
  }

  changePage(page:number){
    /**
     * Gets an specific page for a search
     */
    this.router.navigateByUrl('/wiki/'+page)
  }

}
