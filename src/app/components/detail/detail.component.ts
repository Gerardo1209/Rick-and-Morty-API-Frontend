import { Component, OnInit } from '@angular/core';
import { RickandmortyService, character, characters, location, episode } from '../../services/rickandmorty.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NgClass } from '@angular/common';
import { CommonModule } from '@angular/common';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-detail',
  standalone: true,
  imports: [NgClass,
    CommonModule,
    TooltipModule,
    RouterModule
  ],
  providers: [RickandmortyService],
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.css'
})
export class DetailComponent implements OnInit{
  id:number|undefined //Character id
  character: character|undefined //Character for display
  characterInfo: character|undefined //Character information for display
  locationInfo: location|undefined //Location of character
  episodesInfo: episode[]|undefined //Episodes appeared
  information:boolean = true // Page view information
  location:boolean = false //Page view location
  episodes:boolean = false //Page view episodes


  constructor(private rickandmortyService: RickandmortyService,
    private route:ActivatedRoute, private router:Router){
      /**
       * Gets the id of the character to show
       */
    if(this.route.snapshot.params["id"]){
      this.id = this.route.snapshot.params["id"]
    }
  }

  async ngOnInit(): Promise<void> {
    /**
     * If the id is undefined, fetchs a random character,
     * else get the character info
     */
    if(!this.id){
      this.id = await this.getRandom()
      this.router.navigateByUrl('character/'+this.id)
    }
    await this.getCharacter()
    this.getInformation()
  }

  async getCharacter(){
    /**
     * Fetchs the character info
     */
    await this.rickandmortyService.getCharacter(this.id!).forEach((char) => {
      this.character = <character>char
    })
  }

  async getLocation(){
    /**
     * Fetch the location when the user selects that option
     * and disables the show of the others
     */
    this.locationInfo = undefined
    this.information = false
    this.episodes = false
    this.location = true
    await this.rickandmortyService.getLocation(this.character?.location.url!).forEach((loc) => {
      this.locationInfo = <location> loc
    })
  }

  async getInformation(){
    /**
     * Fetch the information tab and disables the other options show
     */
    this.characterInfo = undefined
    this.episodes = false
    this.location = false
    this.information = true
    await this.rickandmortyService.getCharacter(this.id!).forEach((char) => {
      this.characterInfo = <character>char
    })
  }

  async getEpisodes(){
    /**
     * Restart the data for a new fetch
     */
    this.episodesInfo = undefined
    this.location = false
    this.information = false
    this.episodes = true
    if(this.character){
      /**
       * Checks the character has episodes
       */
      var episodes:string[] = this.character.episode
      var idEpisodes: number[] = [];
      /**
       * Makes an array of numbers for all the episodes to make only one fetch
       */
      for (let i = 0; i < episodes.length; i++) {
        const element = episodes[i];
        idEpisodes.push(parseInt(element.split('/').slice(-1)[0]))
      }
      /**
       * Makes the fetch
       * If the character only has one episode,
       * makes that to an actual array
       */
      await this.rickandmortyService.getEpisodes(idEpisodes).forEach((ep) => {
        this.episodesInfo = <episode[]> ep
        if(!Array.isArray(this.episodesInfo)){
          this.episodesInfo = []
          this.episodesInfo.push(<episode>ep)
        }
      })
    }

  }

  async getRandom():Promise<number>{
    /**
     * Returns a random number based on random
     * and the number of characters available
     */
    var random:number = 0;
    await this.rickandmortyService.getCharacters().forEach((page) => {
      var infoPage:characters = <characters>page
      random = Math.floor(Math.random()*infoPage.info.count)
    })
    return random;
  }

  newRandom(){
    /**
     * Fetch a new character
     * Makes everything undefined to show the load
     */
    this.character = undefined
    this.characterInfo = undefined
    this.locationInfo = undefined
    this.episodesInfo = undefined
    this.id = undefined
    this.ngOnInit()
  }
}
