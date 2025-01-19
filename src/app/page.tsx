import Image from "next/image";
import ThemeToggle from "@/components/theme-toggle";

const dob = new Date(1994, 4, 1, 0, 0, 0, 0).getTime();
const now = new Date().getTime();
const age = Math.floor((now - dob) / (365 * 24 * 60 * 60 * 1000));

const biography: string =
`var helloWorld = () => {
  var name = "christian boni";
  var age = ${age};
  var location = "pittsburgh, pa";
  var occupation = "software engineer";

  console.log([name,age,location,occupation].join(", "));
}
helloWorld();`;

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <header>
        <ThemeToggle />
      </header>
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <Image
          className="rounded-full self-center border-4 border-zinc-50 dark:border-zinc-800"
          src="/me.jpg"
          alt="Me"
          width={250}
          height={250}
          priority
        />

        <pre className="text-sm text-center sm:text-left font-[family-name:var(--font-geist-mono)] rounded font-semibold bg-black/[.05] dark:bg-white/[.06] p-4">
          <code>
            {biography}
          </code>
        </pre>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <a
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className="dark:invert"
              src="/vercel.svg"
              alt="Vercel logomark"
              width={20}
              height={20}
            />
            Deploy now
          </a>
          <a
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44"
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Read our docs
          </a>
        </div>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="mailto:christianjboni@gmail.com"
        >
          <Image
            className="dark:invert"
            aria-hidden
            src="/email.svg"
            alt="Email"
            width={20}
            height={20}
          />
          Email
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://www.linkedin.com/in/christianboni"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            className="dark:invert"
            aria-hidden
            src="/linkedin.svg"
            alt="LinkedIn"
            width={20}
            height={20}
          />
          LinkedIn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://github.com/thisbechristian?tab=repositories"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            className="dark:invert"
            aria-hidden
            src="/github.svg"
            alt="GitHub"
            width={20}
            height={20}
          />
          GitHub
        </a>
      </footer>
    </div>
  );
}
