import {Component, OnInit} from '@angular/core';
import {Weather} from "src/app/services/weather";
import axios from 'axios';
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit{

  public iterator : number = -1;
  public currentWeatherImage: string | undefined;
  public apiKey = "a34d5326ea351833b5f474de91025a9b";
  public city: string = "Cluj-Napoca";
  public firstTemps: number[] = [];
  public firstHours: number[] = [];
  public firstConditions: string[] = [];
  public fiveDays: string[] = [];
  public maxFiveDays: number[] = [];
  public minFiveDays: number[] = [];
  public listOfNumbers: number[] = [];
  public listOfDays: number[] = [];


  constructor(private http: HttpClient) {}

  async ngOnInit() {
    let i;
    for(i = 0; i < 8; i++)
      this.listOfNumbers[i] = i;
    for(i = 0; i <5; i++)
      this.listOfDays[i] = i;
    this.city = await this.currentLocation();
    this.nextDays();
    await this.displayWeatherData(this.city);
  }

  public async currentLocation(): Promise<string> {
    var lat: number = 46.770439;
    var long: number = 23.591423;
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        //lat = position.coords.latitude;
        //long = position.coords.longitude;
      });
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
    const apiUrl = `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${long}&limit=1&appid=${this.apiKey}`;
    const response = await fetch(apiUrl);
    const data = await response.json();
    if (response.ok && data.length > 0) {
      return data[0].name;
    } else {
      throw new Error(`Failed to get city name. Status: ${response.status}, Error message: ${data.message}`);
    }
  }

  public async selectNewCity(){
    this.city = (document.getElementById("Name") as HTMLInputElement).value;
    this.nextDays();
    await this.displayWeatherData(this.city);
  }

  public async getWeatherData(city: string): Promise<Weather[]> {
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${this.apiKey}&units=metric`;
    const response = await axios.get<{list: Weather[]}>(url);
    return response.data.list;
  }

  public async displayWeatherData(city: string){
    try {
      const data = await this.getWeatherData(city);
      let string = "";
      let it = 0;
      this.iterator = -1;
      data.forEach((weather) => {
        const date = new Date(weather.dt * 1000);
        if(string != weather.dt_txt.substring(0,10)){
          string = weather.dt_txt.substring(0,10);
          this.iterator++
          this.maxFiveDays[this.iterator] =  Math.floor(weather.main.temp);
          this.minFiveDays[this.iterator] =  Math.floor(weather.main.temp);
        }
        else{
          if(weather.main.temp > this.maxFiveDays[this.iterator])
            this.maxFiveDays[this.iterator] = Math.floor(weather.main.temp);
          if(weather.main.temp < this.minFiveDays[this.iterator])
            this.minFiveDays[this.iterator] = Math.floor(weather.main.temp);
        }
        if(it == 0){
          if(date.getHours() <= 6 || date.getHours() >= 20)
            this.currentWeatherImage = "Night";
          else
            this.currentWeatherImage = "Day"
        }
        if(it < 8) {
          this.firstTemps[it] = Math.floor(weather.main.temp);
          this.firstHours[it] = date.getHours();
          if(weather.weather[0].main == "Clear" && (date.getHours() <= 6 || date.getHours() >=20))
            this.firstConditions[it] = "Night";
          else
            this.firstConditions[it] = weather.weather[0].main;

          it++;
        }
      });
    } catch (error) {
      console.error(error);
    }
  }

  public nextDays(): void {
    var it = 0;
    const currentDate = new Date();
    this.fiveDays[it++] = currentDate.toLocaleDateString('en-US', {weekday: 'long'});

    for (let i = 1; i <= 4; i++) {
      const futureDate = new Date();
      futureDate.setDate(currentDate.getDate() + i); // add i days to the current date
      this.fiveDays[it++] = futureDate.toLocaleDateString('en-US', { weekday: 'long' });
    }
  }
}

