"use client"

import Image from "next/image";
import { useState } from "react";
import Spinner from "./spinner";
import { trackEvent } from "./analytics";

interface Forecast {
    timestamp: Date;
    temperature: string;
    precipitation: string;
}

const getCurrentPosition = (options?: PositionOptions): Promise<GeolocationPosition> => {
    return new Promise((resolve, reject) =>
        navigator.geolocation.getCurrentPosition(resolve, reject, options)
    );
}

const getLocation = async () => {
    if (navigator.geolocation) {
        try {
            const position = await getCurrentPosition();
            return position;
        } catch (error) {
            alert((error as Error).message);
        }
    } else {
        alert("Geolocation not supported");
    }
}

const getForecast = async (latitude: number, longitude: number, temperature_unit: string = "fahrenheit") => {
    const url: URL = new URL("https://api.open-meteo.com/v1/forecast");
    url.searchParams.append("latitude", String(latitude));
    url.searchParams.append("longitude", String(longitude));
    url.searchParams.append("temperature_unit", temperature_unit);
    url.searchParams.append("hourly", "temperature_2m,precipitation_probability");
    const response: Response = await fetch(url);
    const data = await response.json();

    const temperatureUnit = data.hourly_units.temperature_2m;
    const precipitationUnit = data.hourly_units.precipitation_probability;

    const currentTimeByTheHour: Date = new Date();
    currentTimeByTheHour.setMinutes(0);
    currentTimeByTheHour.setSeconds(0);
    currentTimeByTheHour.setMilliseconds(0);

    const currentTime: string = currentTimeByTheHour.toISOString().split(".")[0];
    const index: number = data.hourly.time.findIndex((time: string) => ((time + ":00") === currentTime));

    const timestamp: Date = new Date();
    const temperature: string = data.hourly.temperature_2m[index] + temperatureUnit;
    const precipitation: string = data.hourly.precipitation_probability[index] + precipitationUnit;

    return { timestamp, temperature, precipitation };
}

export default function WhatsTheWeather() {
    const [loading, setLoading] = useState<boolean>(false);
    const [forecast, setForecast] = useState<Forecast | null>(null);
    const [unit, setUnit] = useState<string>("fahrenheit");

    const getWeatherForecast = async (unit: string) => {
        trackEvent("get_forecast", { event_category: "Weather", event_label: `Forecast (${unit})`, value: 1 });
        try {
            setLoading(true);
            setForecast(null);
            const location: GeolocationPosition | undefined = await getLocation();
            if (location) {
                const forecast: Forecast = await getForecast(location.coords.latitude, location.coords.longitude, unit);
                setForecast(forecast);
            }
        } finally {
            setLoading(false);
        }
    }

    const onUnitChanged = (isCelsius: boolean) => {
        const unit: string = isCelsius ? "fahrenheit" : "celsius";
        setUnit(unit);
        getWeatherForecast(unit);
    }

    return (
        <div className="flex gap-4 self-center items-center flex-col">
            {
                (loading) ?
                    <Spinner /> :
                    <span
                        className="cursor-pointer rounded-full border border-2 border-solid border-zinc-250 dark:border-zinc-800 transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-black/[.05] dark:hover:bg-white/[.06] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
                        onClick={() => getWeatherForecast(unit)}
                    >
                        <Image
                            className="dark:invert"
                            src="./weather.svg"
                            alt="Weather"
                            width={20}
                            height={20}
                        />
                        {`what's the weather gon' be?`}
                    </span>
            }
            {
                (forecast) ?
                    <ol className="text-center">
                        <li>{forecast.timestamp.toLocaleString()}</li>
                        <li>
                            <p
                                className="cursor-pointer hover:underline hover:underline-offset-4" onClick={() => onUnitChanged(unit === "celsius")}
                                title={`Change Units to ${unit === "celsius" ? "Fahrenheit" : "Celsius"}`}>
                                Temperature: {forecast.temperature}
                            </p>
                        </li>
                        <li>Precipitation: {forecast.precipitation}</li>
                    </ol>
                    : null
            }
        </div>
    )
}