import React, {useState} from "react";
import Navbar from "./../components/Navbar";
import DashboardPage from "./dashboard";
import { ThemeProvider } from "./../util/theme.js";

function App(props) {
  const [title, setTitle] = useState(JSON.parse(localStorage.getItem("montesheet"))['A1'] || "Montesheet");

  return (
    <ThemeProvider>
          <>
            <Navbar
              color="default"
              title={title}
            />
            <DashboardPage setTitle={setTitle} />
          </>
    </ThemeProvider>
  );
}

export default App;
