"use client"

import { useTheme } from "next-themes";
import Image from "next/image";
import { trackEvent } from "./analytics";

export default function ThemeToggle() {
    const { setTheme, resolvedTheme: theme } = useTheme()

    const toggleTheme = (off: boolean) => {
        const theme: string = off ? "light" : "dark";
        setTheme(theme);
        trackEvent("theme_toggled", { event_category: "Theme", event_label: `Theme Change (${theme})`, value: 1 });
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