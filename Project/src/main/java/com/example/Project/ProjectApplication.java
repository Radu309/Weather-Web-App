package com.example.Project;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.Scanner;

@SpringBootApplication
public class ProjectApplication {

	public static void main(String[] args) throws IOException {

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
	}

}

