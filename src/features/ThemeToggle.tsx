import { IconButton, Tooltip } from "@mui/material"
import { Brightness4, Brightness7 } from "@mui/icons-material"
import { useTheme } from "../context/ThemeContext"

export function ThemeToggle() {
  const { mode, toggleTheme } = useTheme()

  return (
    <div className="z-30 absolute left-2 mt-[14px]">
      <Tooltip title={`Switch to ${mode === "light" ? "dark" : "light"} mode`}>
        <IconButton onClick={toggleTheme} sx={{ color: "text.primary" }}>
          {mode === "light" ? <Brightness4 /> : <Brightness7 />}
        </IconButton>
      </Tooltip>
    </div>
  )
}
