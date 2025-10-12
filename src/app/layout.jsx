import './globals.css'
import 'leaflet/dist/leaflet.css'

export const metadata = {
  title: 'Weather App',
  description: 'A modern weather application with authentication and interactive maps',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>{children}</body>
    </html>
  )
}
