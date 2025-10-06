"use client"

import { useEffect, useRef, useState } from "react"
import { MapPin } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Listing {
  id: number
  title: string
  price: number
  location: string
  condition: string
  image: string
  category: string
  lat: number
  lng: number
}

interface MapViewProps {
  listings: Listing[]
}

export default function MapView({ listings }: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const markersRef = useRef<any[]>([])
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null)

  useEffect(() => {
    // Only run on client side
    if (typeof window === "undefined" || !mapRef.current) return

    // Dynamically import Leaflet
    import("leaflet").then((L) => {
      // Fix for default marker icons in Leaflet
      delete (L.Icon.Default.prototype as any)._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
        iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
      })

      // Initialize map only once
      if (!mapInstanceRef.current && mapRef.current) {
        const map = L.map(mapRef.current).setView([37.5665, 126.978], 11)

        // Add OpenStreetMap tiles
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(map)

        mapInstanceRef.current = map
      }

      // Clear existing markers
      markersRef.current.forEach((marker) => marker.remove())
      markersRef.current = []

      // Add markers for each listing
      if (mapInstanceRef.current) {
        listings.forEach((listing) => {
          // Create custom icon with price
          const customIcon = L.divIcon({
            className: "custom-marker",
            html: `
              <div class="flex h-10 items-center justify-center rounded-full bg-blue-600 px-3 text-white shadow-lg transition-transform hover:scale-110 cursor-pointer border-2 border-white">
                <span class="text-xs font-bold">${(listing.price / 10000).toFixed(0)}만</span>
              </div>
            `,
            iconSize: [60, 40],
            iconAnchor: [30, 40],
          })

          const marker = L.marker([listing.lat, listing.lng], { icon: customIcon }).addTo(mapInstanceRef.current)

          marker.on("click", () => {
            setSelectedListing(listing)
            mapInstanceRef.current.setView([listing.lat, listing.lng], 13)
          })

          markersRef.current.push(marker)
        })
      }
    })

    // Cleanup function
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [listings])

  return (
    <div className="relative h-full w-full">
      {/* Leaflet CSS */}
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/leaflet.css" />

      {/* Map Container */}
      <div ref={mapRef} className="h-full w-full" />

      {/* Selected Listing Card */}
      {selectedListing && (
        <Card className="absolute right-4 top-4 z-[1000] w-80 shadow-xl">
          <CardContent className="p-4">
            <button
              onClick={() => setSelectedListing(null)}
              className="absolute right-2 top-2 text-muted-foreground hover:text-foreground"
            >
              ✕
            </button>
            <img
              src={selectedListing.image || "/placeholder.svg"}
              alt={selectedListing.title}
              className="mb-3 h-48 w-full rounded object-cover"
            />
            <h3 className="mb-2 font-semibold text-foreground">{selectedListing.title}</h3>
            <p className="mb-3 text-2xl font-bold text-primary">{selectedListing.price.toLocaleString()}원</p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>{selectedListing.location}</span>
              <Badge variant="secondary" className="ml-auto">
                {selectedListing.condition}
              </Badge>
            </div>
            <button className="mt-4 w-full rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
              상세보기
            </button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
