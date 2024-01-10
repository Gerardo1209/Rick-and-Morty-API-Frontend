import { Component, OnInit } from '@angular/core';
import { RickandmortyService, character, characters, location, episode } from '../../services/rickandmorty.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgClass } from '@angular/common';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-detail',
  standalone: true,
  imports: [NgClass, CommonModule],
  providers: [RickandmortyService],
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.css'
})
export class DetailComponent implements OnInit{
  id:number|undefined //Character id
  character: character|undefined //Character for display
  locationInfo: location|undefined //Location of character
  episodesInfo: episode[]|undefined //Episodes appeared
  information:boolean = true // Page view information
  location:boolean = false //Page view location
  episodes:boolean = false //Page view episodes


  constructor(private rickandmortyService: RickandmortyService,
    private route:ActivatedRoute, private router:Router){

  }

  async ngOnInit(): Promise<void> {
    if(this.route.snapshot.params["id"]){
      this.id = this.route.snapshot.params["id"]
    }else{
      await this.getRandom()
    }
    await this.getCharacter();
  }

  async getCharacter(){
    await this.rickandmortyService.getCharacter(this.id!).forEach((char) => {
      this.character = <character>char
    })
    await this.rickandmortyService.getLocation(this.character?.location.url!).forEach((loc) => {
      this.locationInfo = <location> loc
    })
  }

  async getRandom(){
    await this.rickandmortyService.getCharacters().forEach((page) => {
      var infoPage:characters = <characters>page
      this.id = Math.floor(Math.random()*infoPage.info.count)
    })
  }
}
