import { Component, OnDestroy } from '@angular/core';
import { RickandmortyService, characters } from '../../services/rickandmorty.service';
import { PaginationComponent } from '../../navigation/pagination/pagination.component';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardComponent } from '../card/card.component';
import { TooltipModule } from 'primeng/tooltip';
import { RadioButtonModule } from 'primeng/radiobutton';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [
    NgClass,
    RouterModule,
    CardComponent,
    TooltipModule,
    RadioButtonModule,
    FormsModule,
    PaginationComponent
  ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent implements OnDestroy{
  currentPage:characters | undefined // Data from the current page of search
  numberPage:number = 1
  query: string = '' // Current page number
  queryParamsSubscription:Subscription|undefined // Saves the subscription for the params
  loading: boolean = false //Indicates if the data is beign fetched form the API
  loadingArray = [1,2,3,4,5] //Number of loading cards
  error: boolean = false //If an error appears in fetching, activate
  firstResult: boolean = false //If the first result is true, then never show error page
  /**
   * Available status for the characters
   */
  status:category[] = [
    {name: "all", key: 'allName'},
    {name: "alive", key: 'al'},
    {name: "dead", key: 'de'},
    {name: "unknown", key:'un' }
  ]
  selectedStatus:category = this.status[0] //Controls the selected status
  /**
   * Available genders for the characters
   */
  gender:category[] = [
    {name: "all", key: 'allGen'},
    {name: "female", key: 'fe'},
    {name: "male", key: 'ma'},
    {name: "genderless", key: 'gl'},
    {name: "unknown", key: 'un'}
  ]
  selectedGender:category = this.gender[0] //Controls the selected genders

  constructor(private rickandmortyService: RickandmortyService,
    private route:ActivatedRoute, private router:Router){
    this.queryParamsSubscription = this.route.queryParams.subscribe(params => {
      this.error = false
      this.query = params['q']
      this.numberPage = parseInt(params['p'])
      this.selectedStatus = this.status.find(obj => obj.name == params['s'])!
      this.selectedGender = this.gender.find(obj => obj.name == params['g'])!
      this.getContent(this.query, this.selectedStatus.name, this.selectedGender.name)
    })
  }

  ngOnDestroy(): void {
    /**
     * Unsubscribe form the params changes
     */
    if(this.queryParamsSubscription!=undefined) this.queryParamsSubscription.unsubscribe()
  }

  async getContent(query:string, status:string, gender:string){
    /**
     * Gets the data for the page and filters
     */
    this.loading = true //State of loading changed
    try{
      await this.rickandmortyService.filterCahracter(this.numberPage, query, (status == 'all' ? undefined : status), (gender == 'all' ? undefined : gender)).forEach(pageData => {
        this.error = false
        this.firstResult = true
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
    this.router.navigate(
      ['/search'],
      {
        queryParams: {
          'q':this.query,
          'p':page,
          's':this.selectedStatus.name,
          'g':this.selectedGender.name
        },
        queryParamsHandling: 'merge'
      }
    )
  }

  changeFilter(){
    /**
     * When the filters change, call get content to fetch the new data
     */
    this.router.navigate(
      ['/search'],
      {
        queryParams: {
          'q':this.query,
          'p':1,
          's':this.selectedStatus.name,
          'g':this.selectedGender.name
        },
        queryParamsHandling: 'merge'
      }
    )
  }
}

interface category{
  name:string,
  key: string
}
