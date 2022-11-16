import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root' // just before your class
})

export class LanguageTranslatorService {
  constructor(private http: HttpClient) { }
  apiUrl = "https://api.us-south.language-translator.watson.cloud.ibm.com/instances/b0491abd-7640-4d72-98e6-a68035a39968/v3/translate?version=2018-05-01"
  getTranslation(text, language) {
    let translation
    console.log('sending request!!')
    const httpOptions = { headers: new HttpHeaders({
      'Content-Type':  'application/json',
      'Authorization': 'Basic ' + btoa("apikey:ZghpOfAbpgdLuoAgV7-kOEYlG6CJSTem-wSHo9NrWues"),
    //   'observe': 'response'
    }),
    // observe: 'response'
    };
    const requestOptions: Object = {
      //If your response is text not json
      responseType: 'text'
    }    
    let headers = new HttpHeaders();
    headers = headers.append("Authorization", "Basic " + btoa("apikey:ZghpOfAbpgdLuoAgV7-kOEYlG6CJSTem-wSHo9NrWues"));
    headers = headers.append("Content-Type", "application/json");
    // headers = headers.append("observe", "response");
    let body = {"text": text, "model_id":language}

    return this.http.post(this.apiUrl, body, httpOptions);
  }
}