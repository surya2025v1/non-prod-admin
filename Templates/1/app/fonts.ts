import { Cinzel, Cormorant_Garamond, Poppins } from "next/font/google"

export const cinzel = Cinzel({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-cinzel",
})

export const cormorantGaramond = Cormorant_Garamond({
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
})

export const poppins = Poppins({
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
})
