"use client"

import Image from "next/image";
import { useState, useEffect } from "react";

const getInitialTheme = () => {
    const theme: string | undefined = window.localStorage ? window.localStorage.theme : undefined;
    const prefersDarkTheme: boolean = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if ((theme === 'dark') || (!theme && prefersDarkTheme)) {
        return 'dark';
    } else {
        return 'light';
    }
}

const setThemeForApplication = (theme: string) => {
    if ((theme === 'dark')) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
}

export default function ThemeToggle() {
    const initialTheme = getInitialTheme();
    const [theme, setTheme] = useState<string>(initialTheme);

    const toggleTheme = (off: boolean) => {
        const theme: string = off ? 'light' : 'dark';
        setTheme(theme);
        setThemeForApplication(theme);
        if (localStorage) { localStorage.theme = theme; }
    }

    useEffect(() => {
        setThemeForApplication(theme);
    }, []);

    return (
        <div>
            <Image
                className="cursor-pointer"
                src={theme === "dark" ? `./lightswitch-off.png` : `./lightswitch-on.png`}
                alt="Light Switch"
                onClick={() => toggleTheme(theme === "dark")}
                width={100}
                height={100}
            />
        </div>
        // <label className="inline-flex items-center cursor-pointer">
        //     <span className="me-3 text-sm font-medium text-gray-900 dark:text-gray-300">Dark</span>
        //     <input type="checkbox" className="sr-only peer" value="" onChange={() -> toggleTheme(event.target.checked)} checked={theme === "light"}></input>
        //     <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow-300 dark:peer-focus:ring-yellow-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-yellow-600"></div>
        //     <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">Light</span>
        // </label>
    );
}