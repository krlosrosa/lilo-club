"use client";

import L from "leaflet";
import { Crosshair, Minus, Plus } from "lucide-react";
import { createPortal } from "react-dom";
import { useCallback, useMemo } from "react";
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from "react-leaflet";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import "leaflet/dist/leaflet.css";

const defaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export interface AddressMapProps {
  latitude: number;
  longitude: number;
  onDragEnd: (lat: number, lng: number) => void;
  className?: string;
}

function DragMarker({
  position,
  onDragEnd,
}: {
  position: [number, number];
  onDragEnd: (lat: number, lng: number) => void;
}) {
  const eventHandlers = useMemo(
    () => ({
      dragend(e: L.DragEndEvent) {
        const m = e.target as L.Marker;
        const p = m.getLatLng();
        onDragEnd(p.lat, p.lng);
      },
    }),
    [onDragEnd],
  );

  return (
    <Marker position={position} draggable icon={defaultIcon} eventHandlers={eventHandlers} />
  );
}

function ClickToMove({ onPick }: { onPick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onPick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

function FloatingMapControls({
  onLocate,
}: {
  onLocate: (lat: number, lng: number) => void;
}) {
  const map = useMap();
  const el = map.getContainer();
  return createPortal(
    <div className="absolute top-4 right-4 z-1000 flex flex-col gap-2">
      <Button
        type="button"
        size="icon"
        variant="secondary"
        className="size-12 rounded-xl shadow-lg"
        onClick={() => map.zoomIn()}
      >
        <Plus className="size-5" />
      </Button>
      <Button
        type="button"
        size="icon"
        variant="secondary"
        className="size-12 rounded-xl shadow-lg"
        onClick={() => map.zoomOut()}
      >
        <Minus className="size-5" />
      </Button>
      <Button
        type="button"
        size="icon"
        variant="secondary"
        className="text-primary size-12 rounded-xl shadow-lg"
        onClick={() => {
          if (!navigator.geolocation) {
            toast.error("Geolocalização não disponível neste dispositivo.");
            return;
          }
          navigator.geolocation.getCurrentPosition(
            (p) => {
              onLocate(p.coords.latitude, p.coords.longitude);
              map.setView([p.coords.latitude, p.coords.longitude], Math.max(map.getZoom(), 16), {
                animate: true,
              });
            },
            () => toast.error("Não foi possível obter sua localização."),
            { enableHighAccuracy: true, timeout: 10_000 },
          );
        }}
      >
        <Crosshair className="size-5" />
      </Button>
    </div>,
    el,
  );
}

export function AddressMap({ latitude, longitude, onDragEnd, className }: AddressMapProps) {
  const pos: [number, number] = [latitude, longitude];
  const stableOnDrag = useCallback(
    (la: number, ln: number) => {
      onDragEnd(la, ln);
    },
    [onDragEnd],
  );

  return (
    <MapContainer
      center={pos}
      zoom={16}
      className={cn("z-0 h-full min-h-[320px] w-full rounded-lg", className)}
      scrollWheelZoom
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <ClickToMove onPick={stableOnDrag} />
      <DragMarker position={pos} onDragEnd={stableOnDrag} />
      <FloatingMapControls onLocate={stableOnDrag} />
    </MapContainer>
  );
}
