import { Component, OnDestroy } from '@angular/core';
import { RickandmortyService, characters } from '../../services/rickandmorty.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NgClass } from '@angular/common';
import { CardComponent } from '../card/card.component';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [
    NgClass,
    RouterModule,
    CardComponent
  ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent implements OnDestroy{
  currentPage:characters | undefined // Data from the current page of search
  numberPage:number = 1
  query: string = '' // Current page number
  pagesArray:number[]|undefined // Pages to show in options
  queryParamsSubscription:Subscription|undefined // Saves the subscription for the params
  loading: boolean = false //Indicates if the data is beign fetched form the API
  loadingArray = [1,2,3,4,5] //Number of loading cards
  error: boolean = false //If an error appears in fetching, activate

  constructor(private rickandmortyService: RickandmortyService, private route:ActivatedRoute, private router:Router){
    this.queryParamsSubscription = this.route.queryParams.subscribe(params => {
      this.error = false
      this.query = params['q']
      this.numberPage = parseInt(params['p'])
      this.getContent(this.query)
    })
  }

  ngOnDestroy(): void {
    /**
     * Unsubscribe form the params changes
     */
    if(this.queryParamsSubscription!=undefined) this.queryParamsSubscription.unsubscribe()
  }

  async getContent(query:string){
    /**
     * Gets the data for the page
     */
    this.loading = true //State of loading changed
    try{
      await this.rickandmortyService.filterCahracterByName(query, this.numberPage).forEach(pageData => {
        this.currentPage = <characters>pageData
        console.log(this.currentPage)
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
    return Array.from(
      {length: (stop <= 0 ? 1 : (stop-start)+1)},
      (_, index) => start + index
    )
  }

  nextPage(){
    this.router.navigate(
      ['/search'],
      {
        queryParams: {
          'q':this.query,
          'p':this.numberPage+1
        },
        queryParamsHandling: 'merge'
      }
    )
  }

  previousPage(){
    this.router.navigate(
      ['/search'],
      {
        queryParams: {
          'q':this.query,
          'p':this.numberPage-1
        },
        queryParamsHandling: 'merge'
      }
    )
  }

  specificPage(page:number){
    this.router.navigate(
      ['/search'],
      {
        queryParams: {
          'q':this.query,
          'p':page
        },
        queryParamsHandling: 'merge'
      }
    )
  }
}
