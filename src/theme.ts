import { createTheme } from "@mui/material/styles";

const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
    background: {
      default: "#ffffff",
      paper: "#f5f5f5",
    },
  },
  spacing: 8, // Default spacing is 8px
});

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    // primary: {
    //   main: "#90caf9",
    // },
    // secondary: {
    //   main: "#f48fb1",
    // },
    // background: {
    //   default: "#121212",
    //   paper: "#1d1d1d",
    // },
  },
  spacing: 8, // Default spacing is 8px
});

export { lightTheme, darkTheme };
