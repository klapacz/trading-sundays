import { Hono } from "hono";
import type { Child, FC } from "hono/jsx";
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

const Layout: FC<{ children: Child; year: number }> = (props) => {
    return (
        <html lang="pl">
            <head>
                <meta charSet="utf-8" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <meta
                    name="keywords"
                    content={`niedziele handlowe ${props.year}, zakupy w niedzielę, sklepy otwarte w niedzielę, kalendarz niedziel handlowych, godziny otwarcia w niedzielę, kiedy sklepy otwarte, niedziela bez handlu, lista niedziel handlowych, ograniczenie handlu w niedziele, galerie handlowe w niedziele, handel w niedziele ${props.year}, zakaz handlu`}
                />
                <title>Niedziele Handlowe {props.year}</title>
                <script src="https://cdn.tailwindcss.com"></script>
            </head>
            <body class="bg-gray-50">{props.children}</body>
        </html>
    );
};

const HomePage: FC<{ year: number }> = (props) => {
    return (
        <Layout year={props.year}>
            <div class="min-h-screen flex flex-col">
                <main>
                    {/* Hero Section */}
                    <div class="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-24">
                        <div class="max-w-4xl mx-auto px-4 text-center">
                            <h1 class="text-5xl font-bold mb-6">
                                Niedziele Handlowe {props.year}
                            </h1>
                            <p class="text-xl text-blue-100 mb-12 max-w-2xl mx-auto">
                                Zaplanuj swoje zakupy z wyprzedzeniem. Sprawdź
                                listę wszystkich niedziel handlowych w{" "}
                                {props.year} roku. Dowiedz się dokładnie w które
                                niedziele sklepy będą otwarte i dodaj terminy do
                                swojego kalendarza.
                            </p>
                            <a
                                href="/calendar"
                                class="inline-flex items-center gap-2 bg-white text-blue-600 px-8 py-4 rounded-lg hover:bg-blue-50 transition-colors font-medium shadow-lg"
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
                        </div>
                    </div>

                    {/* Calendar Section */}
                    <div class="max-w-4xl mx-auto px-4 py-16">
                        <h2 class="text-2xl font-semibold text-gray-900 mb-8 text-center">
                            Lista niedziel handlowych
                        </h2>
                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {nonTradingSundays.map((date) => {
                                const dateObj = new Date(date);
                                return (
                                    <div class="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                                        <div class="text-4xl font-bold text-blue-600 mb-2">
                                            {format(dateObj, "d", {
                                                locale: pl,
                                            })}
                                        </div>
                                        <div class="text-gray-600">
                                            {format(dateObj, "MMMM yyyy", {
                                                locale: pl,
                                            })}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* FAQ Section */}
                    <section class="max-w-4xl mx-auto px-4 py-16">
                        <h2 class="text-2xl font-semibold text-gray-900 mb-8 text-center">
                            Często zadawane pytania
                        </h2>
                        <div class="space-y-6">
                            <div class="bg-white p-6 rounded-xl shadow-sm">
                                <h3 class="font-semibold text-lg mb-2">
                                    Ile jest niedziel handlowych w {props.year}{" "}
                                    roku?
                                </h3>
                                <p class="text-gray-600">
                                    W {props.year} roku jest{" "}
                                    {nonTradingSundays.length} niedziel
                                    handlowych.
                                </p>
                            </div>
                            <div class="bg-white p-6 rounded-xl shadow-sm">
                                <h3 class="font-semibold text-lg mb-2">
                                    Czy sklepy muszą być otwarte w niedziele
                                    handlowe?
                                </h3>
                                <p class="text-gray-600">
                                    Nie, niedziele handlowe dają możliwość
                                    otwarcia sklepu, ale nie jest to obowiązek.
                                    Warto sprawdzić godziny otwarcia konkretnego
                                    sklepu.
                                </p>
                            </div>
                        </div>
                    </section>
                    <footer class="mt-auto py-8 bg-gray-50 border-t border-gray-200">
                        <div class="max-w-4xl mx-auto px-4 text-center text-gray-600">
                            <p class="mb-2">
                                Dane na podstawie ustawy o ograniczeniu handlu w
                                niedziele i święta
                            </p>
                            <p class="text-sm text-gray-500">
                                Ostatnia aktualizacja:{" "}
                                {format(new Date(), "d MMMM yyyy", {
                                    locale: pl,
                                })}
                            </p>
                        </div>
                    </footer>
                </main>
            </div>
        </Layout>
    );
};

app.get("/", (c) => {
    const year = new Date().getFullYear();
    return c.html(<HomePage year={year} />);
});

app.get("/calendar", (c) => {
    const year = new Date().getFullYear();

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
            "Content-Disposition": `attachment; filename=niedziele-handlowe-${year}.ics`,
        },
    });
});

export default app;
