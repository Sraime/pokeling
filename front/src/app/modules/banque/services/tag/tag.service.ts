import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Tag } from '../../interfaces/tag';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TagService {

  constructor(private http: HttpClient) { }

  url = environment.api.tag.url;

  searchTag(term): Observable<Tag[]> {
    return this.http.get<Tag[]>(this.url+'?search='+term);
  }
}
