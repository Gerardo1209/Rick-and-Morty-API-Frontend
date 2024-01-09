import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class RickandmortyService {
  private baseurl = "https://rickandmortyapi.com/api"
  constructor(private httpClient: HttpClient) {}

}
