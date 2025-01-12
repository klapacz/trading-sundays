import { Hono } from "hono";
import type { FC } from "hono/jsx";
import { format, addDays } from "date-fns";
import { pl } from "date-fns/locale";

const app = new Hono();

const nonTradingSundays = [
    // 2025
    "2025-01-26",
    "2025-04-13",
    "2025-04-27",
    "2025-06-29",
    "2025-08-31",
    "2025-12-07",
    "2025-12-14",
    "2025-12-21",
] as const;

const currentYear = new Date().getFullYear();

const Layout: FC = (props) => {
    return (
        <html lang="pl">
            <head>
                <meta charSet="utf-8" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <title>Niedziele Handlowe {currentYear}</title>
                <script src="https://cdn.tailwindcss.com"></script>
            </head>
            <body class="bg-gray-50">{props.children}</body>
        </html>
    );
};

const HomePage: FC = () => {
    return (
        <Layout>
            <main class="max-w-4xl mx-auto px-4 py-12">
                <div class="text-center">
                    <h1 class="text-4xl font-bold text-gray-900 mb-4">
                        Niedziele Niehandlowe {currentYear}
                    </h1>
                    <p class="text-lg text-gray-600 mb-8">
                        Sprawdź, w które niedziele sklepy będą zamknięte
                    </p>

                    <a
                        href="/calendar"
                        class="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <svg
                            class="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <rect
                                x="3"
                                y="4"
                                width="18"
                                height="18"
                                rx="2"
                                ry="2"
                            />
                            <line x1="16" y1="2" x2="16" y2="6" />
                            <line x1="8" y1="2" x2="8" y2="6" />
                            <line x1="3" y1="10" x2="21" y2="10" />
                        </svg>
                        Dodaj do kalendarza
                    </a>

                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-12">
                        {nonTradingSundays.map((date) => (
                            <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                                <div class="text-xl font-semibold text-gray-800">
                                    {format(new Date(date), "d MMMM yyyy", {
                                        locale: pl,
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>

                    <footer class="mt-16 text-sm text-gray-500">
                        <p>
                            Dane na podstawie ustawy o ograniczeniu handlu w
                            niedziele i święta.
                        </p>
                    </footer>
                </div>
            </main>
        </Layout>
    );
};

app.get("/", (c) => c.html(<HomePage />));

app.get("/calendar", (c) => {
    const calendarLines = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//Niedziele Handlowe//PL",
        "CALSCALE:GREGORIAN",
        "X-WR-CALNAME:Niedziele Handlowe",
    ];

    for (const sundayISO of nonTradingSundays) {
        const dateStr = format(sundayISO, "yyyyMMdd");
        const nextDayStr = format(addDays(sundayISO, 1), "yyyyMMdd");

        calendarLines.push(
            "BEGIN:VEVENT",
            `DTSTART;VALUE=DATE:${dateStr}`,
            `DTEND;VALUE=DATE:${nextDayStr}`,
            `SUMMARY:Niedziela Handlowa`,
            `DESCRIPTION:Sklepy mogą być otwarte`,
            "END:VEVENT",
        );
    }

    calendarLines.push("END:VCALENDAR");

    return new Response(calendarLines.join("\r\n"), {
        headers: {
            "Content-Type": "text/calendar; charset=utf-8",
            "Cache-Control": "public, max-age=3600",
        },
    });
});

export default app;
