import { useState } from "react";
import {
  Truck,
  Plus,
  Filter,
  Download,
  MapPin,
  Calendar,
  Weight,
  ChevronRight,
  X,
} from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable, type Column } from "@/components/shared/DataTable";
import { TransportStatusBadge } from "@/components/shared/StatusBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogBody,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { useToast } from "@/components/shared/Toast";
import {
  mockTransports,
  mockEquipment,
  mockActors,
  type Transport,
  type MineralType,
} from "@/lib/mock-data";
import { formatDate, formatNumber } from "@/lib/utils";

const mineralColors: Record<MineralType, string> = {
  Cobalt: "text-primary-400",
  Coltan: "text-warning-400",
  Cuivre: "text-success-400",
  Or: "text-yellow-400",
  Cassitérite: "text-cyan-400",
  Wolframite: "text-violet-400",
};

export default function Transports() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [mineralFilter, setMineralFilter] = useState("all");
  const [selected, setSelected] = useState<Transport | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const { toast } = useToast();

  const [form, setForm] = useState({
    mineral: "",
    origin: "",
    destination: "",
    transporter: "",
    driver: "",
    vehicle: "",
    quantity: "",
    weight: "",
    badgeGps: "",
    departure: "",
  });
  const setField =
    (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleCreate = () => {
    if (
      !form.mineral ||
      !form.origin ||
      !form.destination ||
      !form.driver ||
      !form.vehicle
    ) {
      toast({
        type: "error",
        title: "Champs requis manquants",
        description: "Remplissez tous les champs obligatoires.",
      });
      return;
    }
    setShowCreate(false);
    setForm({
      mineral: "",
      origin: "",
      destination: "",
      transporter: "",
      driver: "",
      vehicle: "",
      quantity: "",
      weight: "",
      badgeGps: "",
      departure: "",
    });
    toast({
      type: "success",
      title: "Transport créé",
      description: `Transport enregistré avec succès.`,
    });
  };

  const filtered = mockTransports.filter((t) => {
    const matchSearch =
      !search ||
      [t.reference, t.driver, t.origin, t.destination, t.transporter].some(
        (f) => f.toLowerCase().includes(search.toLowerCase()),
      );
    const matchStatus = statusFilter === "all" || t.status === statusFilter;
    const matchMineral = mineralFilter === "all" || t.mineral === mineralFilter;
    return matchSearch && matchStatus && matchMineral;
  });

  const columns: Column<Transport>[] = [
    {
      key: "reference",
      header: "Référence",
      sortable: true,
      render: (r) => (
        <span className="font-mono text-xs font-semibold text-primary-300">
          {r.reference}
        </span>
      ),
    },
    {
      key: "mineral",
      header: "Minéral",
      sortable: true,
      render: (r) => (
        <span className={`text-xs font-medium ${mineralColors[r.mineral]}`}>
          {r.mineral}
        </span>
      ),
    },
    {
      key: "quantity",
      header: "Quantité",
      sortable: true,
      render: (r) => (
        <span className="tabular-nums">
          {formatNumber(r.quantity)} {r.unit}
        </span>
      ),
    },
    {
      key: "origin",
      header: "Origine → Destination",
      render: (r) => (
        <div className="flex items-center gap-1.5 text-xs">
          <MapPin className="h-3 w-3 text-slate-500 shrink-0" />
          <span className="text-slate-300">{r.origin}</span>
          <ChevronRight className="h-3 w-3 text-slate-600" />
          <span className="text-slate-300">{r.destination}</span>
        </div>
      ),
    },
    { key: "transporter", header: "Transporteur", sortable: true },
    {
      key: "status",
      header: "Statut",
      sortable: true,
      render: (r) => <TransportStatusBadge status={r.status} />,
    },
    {
      key: "progress",
      header: "Progression",
      render: (r) => (
        <div className="flex items-center gap-2 w-24">
          <Progress
            value={r.progress}
            className="h-1.5"
            barClassName={
              r.status === "retardé"
                ? "bg-warning-500"
                : r.status === "livré"
                  ? "bg-success-500"
                  : "bg-primary-500"
            }
          />
          <span className="text-xs text-slate-400 tabular-nums w-7">
            {r.progress}%
          </span>
        </div>
      ),
    },
    {
      key: "departureDate",
      header: "Départ",
      sortable: true,
      render: (r) => (
        <span className="text-xs text-slate-400">
          {formatDate(r.departureDate)}
        </span>
      ),
    },
  ];

  return (
    <>
      <div className="flex h-full gap-6">
        {/* Main content */}
        <div className="flex-1 min-w-0 space-y-5">
          <PageHeader
            title="Gestion des transports"
            description="Suivi des convois miniers à l'échelle nationale"
            icon={Truck}
          >
            <Button variant="outline" size="sm">
              <Filter className="h-3.5 w-3.5" />
              Filtres
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-3.5 w-3.5" />
              Exporter
            </Button>
            <Button size="sm" onClick={() => setShowCreate(true)}>
              <Plus className="h-3.5 w-3.5" />
              Nouveau transport
            </Button>
          </PageHeader>

          {/* Filters bar */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <Input
                placeholder="Référence, chauffeur, origine…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8"
              />
              <Filter className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500 pointer-events-none" />
            </div>
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Tous les statuts</option>
              <option value="en_route">En route</option>
              <option value="livré">Livré</option>
              <option value="retardé">Retardé</option>
              <option value="en_attente">En attente</option>
              <option value="annulé">Annulé</option>
            </Select>
            <Select
              value={mineralFilter}
              onChange={(e) => setMineralFilter(e.target.value)}
            >
              <option value="all">Tous les minéraux</option>
              <option value="Cobalt">Cobalt</option>
              <option value="Coltan">Coltan</option>
              <option value="Cuivre">Cuivre</option>
              <option value="Or">Or</option>
              <option value="Cassitérite">Cassitérite</option>
              <option value="Wolframite">Wolframite</option>
            </Select>
            {(search || statusFilter !== "all" || mineralFilter !== "all") && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearch("");
                  setStatusFilter("all");
                  setMineralFilter("all");
                }}
              >
                <X className="h-3.5 w-3.5" />
                Réinitialiser
              </Button>
            )}
            <span className="ml-auto text-xs text-slate-500">
              {filtered.length} transport(s)
            </span>
          </div>

          <DataTable
            columns={columns}
            data={filtered}
            onRowClick={setSelected}
          />
        </div>

        {/* Detail panel */}
        {selected && (
          <div className="w-80 shrink-0">
            <Card className="sticky top-0 h-full overflow-y-auto">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Détail transport</CardTitle>
                  <button
                    onClick={() => setSelected(null)}
                    className="text-slate-500 hover:text-slate-300 cursor-pointer"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <p className="font-mono text-sm font-bold text-primary-300">
                  {selected.reference}
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Status + progress */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <TransportStatusBadge status={selected.status} />
                    <span className="text-sm font-semibold text-slate-200">
                      {selected.progress}%
                    </span>
                  </div>
                  <Progress
                    value={selected.progress}
                    className="h-2"
                    barClassName={
                      selected.status === "retardé"
                        ? "bg-warning-500"
                        : selected.status === "livré"
                          ? "bg-success-500"
                          : "bg-primary-500"
                    }
                  />
                </div>

                <Separator />

                {/* Info grid */}
                {[
                  {
                    icon: Weight,
                    label: "Minéral",
                    value: `${selected.mineral}`,
                  },
                  {
                    icon: Weight,
                    label: "Quantité",
                    value: `${formatNumber(selected.quantity)} ${selected.unit}`,
                  },
                  {
                    icon: Weight,
                    label: "Poids brut",
                    value: `${formatNumber(selected.weight)} kg`,
                  },
                  { icon: MapPin, label: "Origine", value: selected.origin },
                  {
                    icon: MapPin,
                    label: "Destination",
                    value: selected.destination,
                  },
                  {
                    icon: Truck,
                    label: "Transporteur",
                    value: selected.transporter,
                  },
                  { icon: Truck, label: "Chauffeur", value: selected.driver },
                  { icon: Truck, label: "Véhicule", value: selected.vehicle },
                  {
                    icon: Calendar,
                    label: "Départ",
                    value: formatDate(selected.departureDate),
                  },
                  {
                    icon: Calendar,
                    label: "Arrivée est.",
                    value: formatDate(selected.estimatedArrival),
                  },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between gap-2">
                    <span className="text-xs text-slate-500 shrink-0">
                      {label}
                    </span>
                    <span className="text-xs text-slate-200 text-right truncate">
                      {value}
                    </span>
                  </div>
                ))}

                <Separator />

                {/* Equipment */}
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Équipements
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500">Badge GPS</span>
                    <Badge variant="default">{selected.badgeGps}</Badge>
                  </div>
                </div>

                <Separator />

                {/* Timeline */}
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Chronologie
                  </p>
                  <div className="relative pl-4 space-y-3">
                    <div className="absolute left-1.5 top-0 bottom-0 w-px bg-slate-700" />
                    <div className="flex gap-2 items-start">
                      <div className="absolute left-0 h-3 w-3 rounded-full bg-success-500 mt-0.5" />
                      <div className="pl-3">
                        <p className="text-xs font-medium text-slate-200">
                          Départ enregistré
                        </p>
                        <p className="text-[10px] text-slate-500">
                          {formatDate(selected.departureDate)}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2 items-start">
                      <div
                        className={`absolute left-0 h-3 w-3 rounded-full mt-0.5 ${selected.status === "livré" ? "bg-success-500" : "bg-primary-500 pulse-dot"}`}
                      />
                      <div className="pl-3">
                        <p className="text-xs font-medium text-slate-200">
                          {selected.status === "livré"
                            ? "Livraison confirmée"
                            : "En transit"}
                        </p>
                        <p className="text-[10px] text-slate-500">
                          {selected.status === "livré"
                            ? formatDate(selected.arrivalDate!)
                            : `Progression: ${selected.progress}%`}
                        </p>
                      </div>
                    </div>
                    {selected.status !== "livré" && (
                      <div className="flex gap-2 items-start">
                        <div className="absolute left-0 h-3 w-3 rounded-full bg-slate-600 mt-0.5" />
                        <div className="pl-3">
                          <p className="text-xs font-medium text-slate-400">
                            Arrivée prévue
                          </p>
                          <p className="text-[10px] text-slate-500">
                            {formatDate(selected.estimatedArrival)}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Create transport dialog */}
      <Dialog
        open={showCreate}
        onClose={() => setShowCreate(false)}
        className="max-w-2xl"
      >
        <DialogHeader>
          <div>
            <DialogTitle>Nouveau transport</DialogTitle>
            <DialogDescription>
              Enregistrer un nouveau convoi minier
            </DialogDescription>
          </div>
          <DialogClose onClose={() => setShowCreate(false)} />
        </DialogHeader>
        <DialogBody>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="ct-mineral">Minéral *</Label>
              <Select
                id="ct-mineral"
                value={form.mineral}
                onChange={setField("mineral")}
                className="w-full"
              >
                <option value="">Sélectionner</option>
                {[
                  "Cobalt",
                  "Coltan",
                  "Cuivre",
                  "Or",
                  "Cassitérite",
                  "Wolframite",
                ].map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="ct-qty">Quantité (kg) *</Label>
              <Input
                id="ct-qty"
                type="number"
                placeholder="ex: 12500"
                value={form.quantity}
                onChange={setField("quantity")}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="ct-weight">Poids brut (kg) *</Label>
              <Input
                id="ct-weight"
                type="number"
                placeholder="ex: 14200"
                value={form.weight}
                onChange={setField("weight")}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="ct-origin">Origine *</Label>
              <Select
                id="ct-origin"
                value={form.origin}
                onChange={setField("origin")}
                className="w-full"
              >
                <option value="">Sélectionner</option>
                {[
                  "Kolwezi",
                  "Walikale",
                  "Likasi",
                  "Butembo",
                  "Manono",
                  "Maniema",
                  "Lubumbashi",
                  "Kinshasa",
                  "Goma",
                  "Kalemie",
                ].map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="ct-dest">Destination *</Label>
              <Select
                id="ct-dest"
                value={form.destination}
                onChange={setField("destination")}
                className="w-full"
              >
                <option value="">Sélectionner</option>
                {[
                  "Lubumbashi",
                  "Goma",
                  "Beira (via Zambie)",
                  "Kinshasa",
                  "Kalemie",
                  "Kindu",
                  "Sakania",
                  "Dar es Salaam",
                ].map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="ct-transport">Transporteur *</Label>
              <Select
                id="ct-transport"
                value={form.transporter}
                onChange={setField("transporter")}
                className="w-full"
              >
                <option value="">Sélectionner</option>
                {[...new Set(mockTransports.map((t) => t.transporter))].map(
                  (tr) => (
                    <option key={tr} value={tr}>
                      {tr}
                    </option>
                  ),
                )}
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="ct-driver">Chauffeur *</Label>
              <Select
                id="ct-driver"
                value={form.driver}
                onChange={setField("driver")}
                className="w-full"
              >
                <option value="">Sélectionner un acteur</option>
                {mockActors
                  .filter((a) => a.role === "transporteur")
                  .map((a) => (
                    <option key={a.id} value={a.name}>
                      {a.name}
                    </option>
                  ))}
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="ct-vehicle">Immatriculation véhicule *</Label>
              <Input
                id="ct-vehicle"
                placeholder="ex: CD 4521 KV"
                value={form.vehicle}
                onChange={setField("vehicle")}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="ct-badge">Badge GPS</Label>
              <Select
                id="ct-badge"
                value={form.badgeGps}
                onChange={setField("badgeGps")}
                className="w-full"
              >
                <option value="">Sélectionner un badge</option>
                {mockEquipment
                  .filter((e) => !e.assignedTransport && e.status === "actif")
                  .map((e) => (
                    <option key={e.id} value={e.serial}>
                      {e.serial} — {e.model}
                    </option>
                  ))}
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="ct-date">Date et heure de départ *</Label>
              <Input
                id="ct-date"
                type="datetime-local"
                value={form.departure}
                onChange={setField("departure")}
              />
            </div>
          </div>
        </DialogBody>
        <DialogFooter>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowCreate(false)}
          >
            Annuler
          </Button>
          <Button size="sm" onClick={handleCreate}>
            <Plus className="h-3.5 w-3.5" />
            Créer le transport
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}
