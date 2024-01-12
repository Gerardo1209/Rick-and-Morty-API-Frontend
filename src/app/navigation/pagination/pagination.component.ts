import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [
    NgClass
  ],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.css'
})
export class PaginationComponent implements OnChanges{
  @Input({required:true}) numberPage!:number; //Current number page
  @Input({required:true}) pages!:number; //Current number page
  @Output() selectedPageEvent = new EventEmitter<number>() //Emitter for output
  pagesArray:number[]|undefined // Pages to show in options

  ngOnChanges(changes: SimpleChanges): void {
    /*Creates an array for the number of pages
      makes a five pages paginator
      if the number of page is less than five,
      creates the number of pages necesary
    */
      switch (this.numberPage) {
        case 1:
          this.pagesArray = this.createArray(this.numberPage, this.numberPage + ((this.pages > 5) ? 4 : this.pages-1))
          break;
        case 2:
          this.pagesArray = this.createArray(this.numberPage-1, this.numberPage + ((this.pages > 5) ? 3 : this.pages - this.numberPage))
          break;
        case (this.pages-1):
            this.pagesArray = this.createArray(this.numberPage-((this.pages > 5) ? 3 : this.pages-this.numberPage+1), this.numberPage+1)
            break;
        case this.pages:
          this.pagesArray = this.createArray(this.numberPage-((this.pages > 5) ? 4 : this.pages-(this.numberPage-3)), this.numberPage)
          break;
        default:
          this.pagesArray = this.createArray(this.numberPage-1, this.numberPage+1)
          break;
      }
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

  nextPage(){
    /**
     * Next page
     */
    this.numberPage++
    this.selectedPageEvent.emit(this.numberPage)
  }

  previousPage(){
    /**
     * Previous page
     */
    this.numberPage--
    this.selectedPageEvent.emit(this.numberPage)
  }

  specificPage(page:number){
    /**
     * Gets an specific page for a search
     */
    this.numberPage = page
    this.selectedPageEvent.emit(this.numberPage)
  }
}
