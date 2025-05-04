import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';
import { Nunito_Sans, Bebas_Neue } from "next/font/google";
import "./globals.css";

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
})

const nunitoSans = Nunito_Sans({
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "Schmetzer Score",
  description: "The Schmetzer Score is a web app that compares how possession is won or lost by soccer players using a new, custom-built sports statistic.",
};

export default function RootLayout( props ) {
  const { children } = props;
  return (
    <html lang="en" className={`${bebasNeue.variable} ${nunitoSans.className}`}>
      <body >
      <AppRouterCacheProvider>
           <ThemeProvider theme={theme}>
              {children}
+          </ThemeProvider>
          </AppRouterCacheProvider>
      </body>
    </html>
  );
}
