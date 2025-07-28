import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { ThemeProvider, createTheme } from "@mui/material/styles"
import CssBaseline from "@mui/material/CssBaseline"

type ThemeMode = "light" | "dark"

interface ThemeContextType {
  mode: ThemeMode
  toggleTheme: () => void
  setTheme: (mode: ThemeMode) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

interface ThemeProviderWrapperProps {
  children: ReactNode
}

export function ThemeProviderWrapper({ children }: ThemeProviderWrapperProps) {
  const [mode, setMode] = useState<ThemeMode>("light")
  const [isLoaded, setIsLoaded] = useState(false)

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as ThemeMode
    if (savedTheme && (savedTheme === "light" || savedTheme === "dark")) {
      setMode(savedTheme)
    } else {
      // Only check system preference if no saved theme exists
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
      const systemTheme = prefersDark ? "dark" : "light"
      setMode(systemTheme)
    }
    setIsLoaded(true)
  }, [])

  // Save theme to localStorage whenever it changes (but only after initial load)
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("theme", mode)
    }
  }, [mode, isLoaded])

  const toggleTheme = () => {
    setMode((prevMode) => {
      const newMode = prevMode === "light" ? "dark" : "light"
      return newMode
    })
  }

  const setTheme = (newMode: ThemeMode) => {
    setMode(newMode)
  }

  // Create MUI theme based on current mode
  const theme = createTheme({
    palette: {
      mode: mode,
    },
    typography: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    },
  })

  const contextValue: ThemeContextType = {
    mode,
    toggleTheme,
    setTheme,
  }

  // Don't render until we've loaded the theme from localStorage
  if (!isLoaded) {
    return null
  }

  return (
    <ThemeContext.Provider value={contextValue}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProviderWrapper")
  }
  return context
}
