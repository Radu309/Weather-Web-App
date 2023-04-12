export interface Weather {
  dt: number;
  dt_txt: string;
  main: {
    temp: number;
    humidity: number;
    temp_max: number;
    temp_min: number;
  };
  weather: {
    icon: string;
    main: string;
    description: string;
  }[];
}
