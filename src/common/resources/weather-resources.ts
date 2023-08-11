import type { WeatherCodes, WeatherRecord } from "@common/types";

export const mockWeatherResponse: WeatherRecord[] = [
    {
        maxFeels: "18º",
        lowTemp: "14º",
        maxTemp: "20º",
        maxWindSpeed: 3,
        time: "01/02/2023",
        weather: "cloud",
        weatherDescription: "Cloudy",
    },
    {
        lowTemp: "13º",
        maxFeels: "16º",
        maxTemp: "18º",
        maxWindSpeed: 3,
        time: "02/02/2023",
        weather: "rain",
        weatherDescription: "Light rain",
    },
];

export const weatherCodes: WeatherCodes = {
    0: ["sun", "Clear night"],
    1: ["sun", "Sunny day"],
    2: ["cloud", "Partly cloudy (night)"],
    3: ["cloud", "Partly cloudy (day)"],
    5: ["foggy", "Mist"],
    6: ["foggy", "Fog"],
    7: ["cloud", "Cloudy"],
    8: ["cloud", "Overcast"],
    9: ["rain", "Light rain shower (night)"],
    10: ["rain", "Light rain shower (day)"],
    11: ["rain", "Drizzle"],
    12: ["rain", "Light rain"],
    13: ["rain", "Heavy rain shower (night)"],
    14: ["rain", "Heavy rain shower (day)"],
    15: ["rain", "Heavy rain"],
    16: ["snow", "Sleet shower (night)"],
    17: ["snow", "Sleet shower (day)"],
    18: ["snow", "Sleet"],
    19: ["snow", "Hail shower (night)"],
    20: ["snow", "Hail shower (day)"],
    21: ["snow", "Hail"],
    22: ["snow", "Light snow shower (night)"],
    23: ["snow", "Light snow shower (day)"],
    24: ["snow", "Light snow"],
    25: ["snow", "Heavy snow shower (night)"],
    26: ["snow", "Heavy snow shower (day)"],
    27: ["snow", "Heavy snow"],
    28: ["thunder", "Thunder shower (night)"],
    29: ["thunder", "Thunder shower (day)"],
    30: ["thunder", "Thunder"],
};
