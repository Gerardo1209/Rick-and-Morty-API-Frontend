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
        /*Creates an array for the number of pages
          makes a five pages paginator
          if the number of page is less than five,
          creates the number of pages necesary
        */
        if(this.currentPage==undefined) return
        switch (this.numberPage) {
          case 1:
            this.pagesArray = this.createArray(this.numberPage, this.numberPage + ((this.currentPage.info.pages > 5) ? 4 : this.currentPage.info.pages-1))
            break;
          case 2:
            this.pagesArray = this.createArray(this.numberPage-1, this.numberPage + ((this.currentPage.info.pages > 5) ? 3 : this.currentPage.info.pages - this.numberPage))
            break;
          case (this.currentPage.info.pages-1):
              this.pagesArray = this.createArray(this.numberPage-((this.currentPage.info.pages > 5) ? 3 : this.currentPage.info.pages-this.numberPage+1), this.numberPage+1)
              break;
          case this.currentPage.info.pages:
            this.pagesArray = this.createArray(this.numberPage-((this.currentPage.info.pages > 5) ? 4 : this.currentPage.info.pages-(this.numberPage-3)), this.numberPage)
            break;
          default:
            this.pagesArray = this.createArray(this.numberPage-1, this.numberPage+1)
            break;
        }
      })
    }catch(error){
      this.error = true
    }

    this.loading = false; // Finish the fetch
  }

  createArray(start:number, stop:number):Array<number>{
    /**
     * Creates an array containing the numbers from the start to stop
     */
    if(start <= 0) start++
    return Array.from(
      {length: (stop <= 0 ? 1 : (stop-start)+1)},
      (_, index) => start + index
    )
  }

}
