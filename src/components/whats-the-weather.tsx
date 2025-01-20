"use client"

import Image from "next/image";
import { useState } from "react";

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
                    <div role="status">
                        <svg aria-hidden="true" className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-gray-600 dark:fill-gray-300" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                        </svg>
                        <span className="sr-only">Loading...</span>
                    </div> :
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