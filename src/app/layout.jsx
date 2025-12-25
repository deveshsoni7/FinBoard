import { Inter } from "next/font/google"; // Assuming Inter is available or I can use basic sans
import "./globals.css";
import { ThemeProvider } from "@/components/ui/ThemeProvider";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
    title: "FinBoard",
    description: "Customizable Finance Dashboard",
};

export default function RootLayout({
    children,
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={cn(inter.className, "bg-background text-foreground antialiased h-full")}>
                <ThemeProvider>{children}</ThemeProvider>
            </body>
        </html>
    );
}
