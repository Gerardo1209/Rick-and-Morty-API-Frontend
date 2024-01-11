import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class RickandmortyService {
  private baseurl = "https://rickandmortyapi.com/api"
  constructor(private httpClient: HttpClient) {}

  getCharacters():Observable<Object>{
    /**
     * Return the fist page for metadata
     */
    return this.httpClient.get(this.baseurl+"/character")
  }

  getPage(page:number):Observable<Object>{
    /**
     * Return specific page
     */
    return this.httpClient.get(this.baseurl+"/character/?page="+page.toString())
  }

  getCharacter(id:number):Observable<Object>{
    /**
     * Return specific character
     */
    return this.httpClient.get(this.baseurl+"/character/"+id.toString())
  }

  getLocation(locationUrl:string):Observable<Object>{
    /**
     * Return specific location
     */
    return this.httpClient.get(locationUrl)
  }

  getEpisodes(ids:number[]):Observable<Object>{
    /**
     * Return multiple episodes
     */
    let format = "";
    for (let episode = 0; episode < ids.length; episode++) {
      if(episode == ids.length - 1){
        format += ids[episode]
      }else{
        format += ids[episode] + ","
      }

    }
    return this.httpClient.get(this.baseurl+"/episode/"+format)
  }

  filterCahracterByName(query:string, page:number):Observable<Object>{
    /**
     * Filtes the characters by name and the number page of the search
     */
    return this.httpClient.get(this.baseurl+"/character/?page="+page+"&name="+query);
  }

}

/**
 * Below are all the interfaces for manage the API data
 */

export interface characters{
  info: {
    count: number,
    pages: number,
    next: string|null,
    prev: string|null
  },
  results: character[]
}

export interface character{
  id: number,
  name: string,
  status: string,
  species: string,
  type: string,
  gender: string,
  origin: {
    name: string,
    url: string
  }
  location: {
    name: string,
    url: string
  }
  image: string,
  episode: string[],
  url: string,
  created: Date
}

export interface episode{
  id: number,
  name: string,
  air_date: Date,
  episode: string,
  characters: string[],
  url: string,
  created: Date
}

export interface location{
  id: number,
  name: string,
  type: string,
  dimension: string,
  residents: string[],
  url: string,
  created: Date
}
