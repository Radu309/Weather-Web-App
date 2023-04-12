package com.example.Project;
import org.json.JSONArray;
import org.json.JSONException;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import org.json.JSONObject;
import java.util.Arrays;
import java.util.Scanner;

@SpringBootApplication(exclude = SecurityAutoConfiguration.class)
public class ProjectApplication {

	public static void main(String[] args) throws IOException, JSONException {
		/*
		String city = "Cluj-Napoca";
		String apiKey = "a34d5326ea351833b5f474de91025a9b";

		URL url = new URL("http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + apiKey + "&units=metric");

		HttpURLConnection conn = (HttpURLConnection) url.openConnection();
		conn.setRequestMethod("GET");
		conn.connect();

		int responseCode = conn.getResponseCode();

		if (responseCode == 200) {
			String inline = "";
			Scanner scanner = new Scanner(url.openStream());

			while (scanner.hasNext()) {
				inline += scanner.nextLine();
			}
			scanner.close();
			String temperature = inline.split("\"temp\":")[1].split(",")[0];
			System.out.println("The current temperature in " + city + " is " + temperature + "°C.");
		} else {
			System.out.println("Error: " + responseCode);
		}

		 */
		String city = "New York"; // Replace with the name of the city you want to get the forecast for
		String apiKey = "a34d5326ea351833b5f474de91025a9b";

		String apiUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=" + apiKey + "&units=metric";

		URL url = new URL(apiUrl);
		HttpURLConnection conn = (HttpURLConnection) url.openConnection();
		conn.setRequestMethod("GET");

		BufferedReader in = new BufferedReader(new InputStreamReader(conn.getInputStream()));

		String inputLine;
		StringBuilder response = new StringBuilder();

		while ((inputLine = in.readLine()) != null) {
			response.append(inputLine);
		}

		in.close();

		JSONObject jsonObject = new JSONObject(response.toString());

		JSONArray forecastList = jsonObject.getJSONArray("list");

		for (int i = 0; i < forecastList.length(); i++) {
			JSONObject forecast = forecastList.getJSONObject(i);

			String dateTime = forecast.getString("dt_txt");
			JSONObject main = forecast.getJSONObject("main");
			double temperature = main.getDouble("temp");

			System.out.println(dateTime + " - " + temperature + "°C");
		}
		SpringApplication.run(ProjectApplication.class,args);
	}
	@Bean
	public CorsFilter corsFilter(){
		CorsConfiguration configuration = new CorsConfiguration();
		configuration.setAllowCredentials(true);
		configuration.setAllowedOrigins(Arrays.asList("http://localhost:4200"));
		configuration.setAllowedHeaders(Arrays.asList("Access-Control-Allow-Headers","Access-Control-Allow-Origin",
				"Access-Control-Request-Method", "Access-Control-Request-Headers","Origin","Cache-Control", "Content-Type", "Authorization"));
		configuration.setExposedHeaders(Arrays.asList("Origin", "Content-Type", "Accept", "Authorization",
				"Access-Control-Allow-Origin", "Access-Control-Allow-Origin", "Access-Control-Allow-Origin", "Access-Allow-Credentials"));
		configuration.setAllowedMethods(Arrays.asList("DELETE", "GET", "POST", "OPTIONS", "PUT"));
		UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
		source.registerCorsConfiguration("/**", configuration);
		return new CorsFilter(source);
	}

}

