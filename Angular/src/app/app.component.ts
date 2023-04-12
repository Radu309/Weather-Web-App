import {Component, OnInit} from '@angular/core';
import {Weather} from "src/app/services/weather";
import axios from 'axios';
import {HttpClient} from "@angular/common/http";
import {iterator} from "rxjs/internal/symbol/iterator";

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
  public fiveTemps: number[] = [];
  public fiveHours: number[] = [];
  public fiveConditions: string[] = [];
  public fiveDays: string[] = [];
  public maxFiveDays: number[] = [];
  public minFiveDays: number[] = [];

  constructor(private http: HttpClient) {
  }

  async ngOnInit() {
    this.nextDays();
    await this.displayWeatherData(this.city);
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
          this.maxFiveDays[this.iterator] = weather.main.temp;
          this.minFiveDays[this.iterator] = weather.main.temp;
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
        if(it < 5) {
          this.fiveTemps[it] = Math.floor(weather.main.temp);
          this.fiveHours[it] = date.getHours();
          if(weather.weather[0].main == "Clear" && (date.getHours() <= 6 || date.getHours() >=20))
            this.fiveConditions[it] = "Night";
          else
            this.fiveConditions[it] = weather.weather[0].main;

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

