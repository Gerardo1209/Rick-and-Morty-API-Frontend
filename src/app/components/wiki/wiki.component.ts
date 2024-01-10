import { Component, OnDestroy, OnInit } from '@angular/core';
import { CardComponent } from '../card/card.component';
import { RickandmortyService, character, characters } from '../../services/rickandmorty.service';
import { NgClass } from '@angular/common';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-wiki',
  standalone: true,
  imports: [CardComponent, NgClass, RouterModule],
  providers: [RickandmortyService],
  templateUrl: './wiki.component.html',
  styleUrl: './wiki.component.css'
})

export class WikiComponent implements OnDestroy{
  currentPage:characters | undefined // Data from the current page
  numberPage: number = 1 // Current page number
  pagesArray:number[]|undefined // Pages to show in options
  paramsSubscription:Subscription|undefined // Saves the subscription
  loading: boolean = false //Indicates if the data is beign fetched form the API
  loadingArray = [1,2,3,4,5] //Number of loading cards
  error: boolean = false //If an error appears in fetching, activate

  constructor(private rickandmortyService: RickandmortyService, private route:ActivatedRoute, private router:Router){
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
        /*Creates an array for the number of pages
          makes a five pages paginator
        */
        if(this.currentPage==undefined) return
        switch (page) {
          case 1:
            this.pagesArray = this.createArray(page, page + 3)
            break;
          case 2:
            this.pagesArray = this.createArray(page-1, page+2)
            break;
          case (this.currentPage.info.pages-1):
              this.pagesArray = this.createArray(page-2, page+1)
              break;
          case this.currentPage.info.pages:
            this.pagesArray = this.createArray(page-3, page)
            break;
          default:
            this.pagesArray = this.createArray(page-1, page+1)
            break;
        }
      })
    }catch(error){
      this.router.navigateByUrl("/wiki/1")
    }

    this.loading = false; // Finish the fetch
  }

  createArray(start:number, stop:number):Array<number>{
    /**
     * Creates an array containing the numbers from the start to stop
     */
    return Array.from(
      {length: (stop-start)+1},
      (_, index) => start + index
    )
  }

}
