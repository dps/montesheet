import React from "react";
import Navbar from "./../components/Navbar";
import DashboardPage from "./dashboard";
import NotFoundPage from "./not-found.js";
import { ThemeProvider } from "./../util/theme.js";

function App(props) {
  return (
    <ThemeProvider>
          <>
            <Navbar
              color="default"
              logo="https://uploads.divjoy.com/logo.svg"
              logoInverted="https://uploads.divjoy.com/logo-white.svg"
            />

            <DashboardPage/>
          </>
    </ThemeProvider>
  );
}

export default App;
