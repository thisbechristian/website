"use client"

import { useTheme } from "next-themes";
import Image from "next/image";

export default function ThemeToggle() {
    const { setTheme, resolvedTheme: theme } = useTheme()

    const toggleTheme = (off: boolean) => {
        const theme: string = off ? "light" : "dark";
        setTheme(theme);
    }

    return (
        <Image
            className="cursor-pointer"
            src={theme === "dark" ? `./lightswitch-off.png` : `./lightswitch-on.png`}
            alt="Light Switch"
            onClick={() => toggleTheme(theme === "dark")}
            width={100}
            height={100}
        />
    );
}