import React from "react";
import Navbar from "./../components/Navbar";
import DashboardPage from "./dashboard";
import { ThemeProvider } from "./../util/theme.js";

function App(props) {
  return (
    <ThemeProvider>
          <>
            <Navbar
              color="default"
            />
            <DashboardPage/>
          </>
    </ThemeProvider>
  );
}

export default App;
