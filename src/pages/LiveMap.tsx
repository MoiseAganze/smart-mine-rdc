import { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import L from "leaflet";
import { Navigation, AlertTriangle, Layers, X, Signal } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TransportStatusBadge } from "@/components/shared/StatusBadge";
import { Progress } from "@/components/ui/progress";
import {
  mockTransports,
  mockAlerts,
  mockEquipment,
  type Transport,
} from "@/lib/mock-data";
import { formatDate } from "@/lib/utils";

const activeTransports = mockTransports.filter(
  (t) => t.status === "en_route" || t.status === "retardé",
);

function createTruckIcon(color: string) {
  return L.divIcon({
    className: "",
    html: `<div style="background:${color};width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:2px solid rgba(255,255,255,0.3);box-shadow:0 0 0 4px ${color}33">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M1 3h15v13H1z"/><path d="M16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
      </svg>
    </div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -20],
  });
}

const statusIconColor: Record<string, string> = {
  en_route: "#6366f1",
  retardé: "#f97316",
  livré: "#22c55e",
};

function createBadgeIcon(status: string) {
  const color =
    status === "actif"
      ? "#22c55e"
      : status === "en_panne"
        ? "#ef4444"
        : status === "en_transit"
          ? "#f97316"
          : "#64748b";
  return L.divIcon({
    className: "",
    html: `<div style="background:${color};width:22px;height:22px;border-radius:4px;display:flex;align-items:center;justify-content:center;border:2px solid rgba(255,255,255,0.4);box-shadow:0 0 0 3px ${color}44">
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5">
        <rect x="2" y="2" width="20" height="20" rx="3"/><path d="M8 12h8M12 8v8"/>
      </svg>
    </div>`,
    iconSize: [22, 22],
    iconAnchor: [11, 11],
    popupAnchor: [0, -14],
  });
}

const equipmentWithCoords = mockEquipment.filter(
  (e) => e.lat !== undefined && e.lng !== undefined,
);

export default function LiveMap() {
  const [selected, setSelected] = useState<Transport | null>(null);
  const [showAlerts, setShowAlerts] = useState(true);
  const [showEquipment, setShowEquipment] = useState(true);
  const unresolvedAlerts = mockAlerts.filter((a) => !a.resolved);

  return (
    <div className="relative -m-6 h-[calc(100vh-3.5rem)] flex">
      {/* Map fills background */}
      <div className="flex-1 relative">
        <MapContainer
          center={[-4.5, 25.5]}
          zoom={6}
          style={{ width: "100%", height: "100%" }}
          zoomControl={false}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />

          {activeTransports.map((t) => (
            <Marker
              key={t.id}
              position={[t.currentLat, t.currentLng]}
              icon={createTruckIcon(statusIconColor[t.status] ?? "#6366f1")}
              eventHandlers={{ click: () => setSelected(t) }}
            >
              <Popup className="dark-popup">
                <div className="bg-slate-800 text-slate-100 rounded-lg p-3 min-w-[200px] border border-slate-700">
                  <p className="font-mono text-xs font-bold text-primary-300">
                    {t.reference}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    {t.mineral} · {t.quantity} {t.unit}
                  </p>
                  <p className="text-xs text-slate-400">
                    {t.origin} → {t.destination}
                  </p>
                  <div className="mt-2">
                    <Progress value={t.progress} className="h-1.5" />
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}

          {/* Equipment (Badge GPS) markers */}
          {showEquipment &&
            equipmentWithCoords.map((eq) => (
              <Marker
                key={eq.id}
                position={[eq.lat!, eq.lng!]}
                icon={createBadgeIcon(eq.status)}
              >
                <Popup className="dark-popup">
                  <div className="bg-slate-800 text-slate-100 rounded-lg p-3 min-w-[180px] border border-slate-700">
                    <p className="font-mono text-xs font-bold text-success-300">
                      {eq.serial}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">{eq.model}</p>
                    <p className="text-xs text-slate-500">{eq.province}</p>
                    {eq.assignedTo && (
                      <p className="text-xs text-slate-400 mt-1">
                        → {eq.assignedTo}
                      </p>
                    )}
                    <div className="mt-1.5 flex items-center gap-1.5">
                      <span className="text-[10px] text-slate-500">
                        Batterie:
                      </span>
                      <span className="text-[10px] font-medium text-slate-300">
                        {eq.battery}%
                      </span>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}

          {/* Alert zones */}
          {showAlerts &&
            unresolvedAlerts
              .filter((a) => a.priority === "critique")
              .map((a) => (
                <Circle
                  key={a.id}
                  center={[
                    activeTransports[0]?.currentLat ?? -11,
                    activeTransports[0]?.currentLng ?? 26,
                  ]}
                  radius={50000}
                  pathOptions={{
                    color: "#ef4444",
                    fillColor: "#ef4444",
                    fillOpacity: 0.08,
                    weight: 1,
                    dashArray: "6",
                  }}
                />
              ))}
        </MapContainer>

        {/* Map toolbar */}
        <div className="absolute top-4 left-4 z-400 flex flex-col gap-2">
          <Button
            variant={showAlerts ? "default" : "secondary"}
            size="sm"
            onClick={() => setShowAlerts(!showAlerts)}
            className="shadow-lg"
          >
            <AlertTriangle className="h-3.5 w-3.5" />
            Zones d'alerte
          </Button>
          <Button
            variant={showEquipment ? "default" : "secondary"}
            size="sm"
            onClick={() => setShowEquipment(!showEquipment)}
            className="shadow-lg"
          >
            <Layers className="h-3.5 w-3.5" />
            Badges GPS
          </Button>
        </div>

        {/* Legend */}
        <div className="absolute bottom-6 left-4 z-400 rounded-xl border border-slate-700/80 bg-slate-900/90 p-3 backdrop-blur-sm">
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Légende
          </p>
          <div className="space-y-1.5">
            {[
              { color: "#6366f1", label: "En route" },
              { color: "#f97316", label: "Retardé" },
              { color: "#22c55e", label: "Livré" },
              { color: "#ef4444", label: "Zone alerte" },
              { color: "#22c55e", label: "Badge GPS actif", square: true },
              { color: "#ef4444", label: "Badge GPS panne", square: true },
            ].map(({ color, label, square }) => (
              <div key={label} className="flex items-center gap-2">
                <span
                  className={`h-2.5 w-2.5 shrink-0 ${square ? "rounded-sm" : "rounded-full"}`}
                  style={{ backgroundColor: color }}
                />
                <span className="text-xs text-slate-300">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="w-72 shrink-0 flex flex-col border-l border-slate-700/60 bg-slate-900/95 backdrop-blur-xl overflow-y-auto">
        {/* Header */}
        <div className="border-b border-slate-700/60 p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Navigation className="h-4 w-4 text-primary-400" />
              <span className="text-sm font-semibold text-slate-100">
                Carte en direct
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Signal className="h-3.5 w-3.5 text-success-400" />
              <span className="text-[11px] text-success-400">Live</span>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[
              {
                value: activeTransports.length,
                label: "Actifs",
                color: "text-primary-400",
              },
              {
                value: mockAlerts.filter((a) => !a.resolved).length,
                label: "Alertes",
                color: "text-danger-400",
              },
              {
                value: mockTransports.filter((t) => t.status === "retardé")
                  .length,
                label: "Retardés",
                color: "text-warning-400",
              },
            ].map(({ value, label, color }) => (
              <div
                key={label}
                className="rounded-lg bg-slate-800/60 p-2 text-center border border-slate-700/40"
              >
                <p className={`text-lg font-bold tabular-nums ${color}`}>
                  {value}
                </p>
                <p className="text-[10px] text-slate-500">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Transport list */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider px-1">
            Convois actifs
          </p>
          {activeTransports.map((t) => (
            <button
              key={t.id}
              onClick={() => setSelected(selected?.id === t.id ? null : t)}
              className={`w-full rounded-lg border p-3 text-left transition-all cursor-pointer ${
                selected?.id === t.id
                  ? "border-primary-600/60 bg-primary-600/10"
                  : "border-slate-700/50 bg-slate-800/40 hover:bg-slate-700/30"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-mono text-xs font-semibold text-primary-300">
                  {t.reference}
                </span>
                <TransportStatusBadge status={t.status} />
              </div>
              <p className="text-xs text-slate-400 truncate">
                {t.origin} → {t.destination}
              </p>
              <div className="mt-2 flex items-center gap-2">
                <Progress
                  value={t.progress}
                  className="h-1"
                  barClassName={
                    t.status === "retardé" ? "bg-warning-500" : "bg-primary-500"
                  }
                />
                <span className="text-[10px] text-slate-500 shrink-0">
                  {t.progress}%
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* Selected detail */}
        {selected && (
          <div className="border-t border-slate-700/60 p-4">
            <Card className="bg-slate-800/60 border-primary-600/30">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xs">Détail sélectionné</CardTitle>
                  <button
                    onClick={() => setSelected(null)}
                    className="text-slate-500 hover:text-slate-300 cursor-pointer"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                {[
                  { label: "Minéral", value: selected.mineral },
                  { label: "Chauffeur", value: selected.driver },
                  { label: "Véhicule", value: selected.vehicle },
                  { label: "Badge GPS", value: selected.badgeGps },
                  {
                    label: "Arrivée est.",
                    value: formatDate(selected.estimatedArrival),
                  },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between">
                    <span className="text-[10px] text-slate-500">{label}</span>
                    <span className="text-[10px] text-slate-300 font-medium truncate ml-2">
                      {value}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Alerts section */}
        <div className="border-t border-slate-700/60 p-3 space-y-2">
          <div className="flex items-center justify-between px-1">
            <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
              Alertes actives
            </p>
            <Badge variant="danger">{unresolvedAlerts.length}</Badge>
          </div>
          {unresolvedAlerts.slice(0, 3).map((a) => (
            <div
              key={a.id}
              className={`rounded-lg border p-2.5 ${
                a.priority === "critique"
                  ? "border-danger-600/30 bg-danger-600/10"
                  : "border-warning-600/20 bg-slate-800/40"
              }`}
            >
              <div className="flex items-center gap-1.5 mb-1">
                <AlertTriangle
                  className={`h-3 w-3 shrink-0 ${a.priority === "critique" ? "text-danger-400" : "text-warning-400"}`}
                />
                <p className="text-[11px] font-medium text-slate-200 truncate">
                  {a.title}
                </p>
              </div>
              <p className="text-[10px] text-slate-400 truncate">
                {a.location}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Layer button float */}
      <div className="absolute top-4 right-[19rem] z-400">
        <Button variant="secondary" size="icon" className="shadow-lg">
          <Layers className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
