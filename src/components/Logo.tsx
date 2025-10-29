// material-ui
import { useTheme } from "@mui/material/styles"
import { FunctionComponent } from "react"
import martinLogo from "assets/images/martin-logo.png" // <- nuevo import

const Logo: FunctionComponent = () => {
  const theme = useTheme()

  return (
    // usa la imagen en vez del SVG
    <img
      src={martinLogo}
      alt="Martin Logo"
      style={{ width: 100, height: "auto", display: "block" }}
    />
  )
}

export default Logo
