import { useState } from "react";
import {
  Cpu,
  Plus,
  Search,
  Edit,
  Trash2,
  BatteryLow,
  BatteryMedium,
  BatteryFull,
  Wifi,
  WifiOff,
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable, type Column } from "@/components/shared/DataTable";
import { EquipmentStatusBadge } from "@/components/shared/StatusBadge";
import { EmptyState } from "@/components/shared/EmptyState";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dropdown } from "@/components/ui/dropdown";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogBody,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  mockEquipment,
  mockActors,
  type Equipment as EquipmentType,
} from "@/lib/mock-data";
import { formatDate } from "@/lib/utils";
import { useToast } from "@/components/shared/Toast";

function BatteryIcon({ level }: { level?: number }) {
  if (level === undefined) return <span className="text-slate-500">—</span>;
  const Icon =
    level < 25 ? BatteryLow : level < 60 ? BatteryMedium : BatteryFull;
  const color =
    level < 25
      ? "text-danger-400"
      : level < 60
        ? "text-warning-400"
        : "text-success-400";
  return (
    <div className="flex items-center gap-1.5">
      <Icon className={`h-3.5 w-3.5 ${color}`} />
      <span className={`text-xs tabular-nums ${color}`}>{level}%</span>
    </div>
  );
}

export default function Equipment() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selected, setSelected] = useState<EquipmentType | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const { toast } = useToast();

  const [form, setForm] = useState({
    model: "",
    serial: "",
    province: "",
    assignedTo: "",
  });
  const setField =
    (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleCreate = () => {
    if (!form.model || !form.serial || !form.province) {
      toast({ type: "error", title: "Champs requis manquants" });
      return;
    }
    setShowCreate(false);
    setForm({ model: "", serial: "", province: "", assignedTo: "" });
    toast({
      type: "success",
      title: "Badge GPS enregistré",
      description: `${form.serial} ajouté avec succès.`,
    });
  };

  const filtered = mockEquipment.filter((e) => {
    const q = search.toLowerCase();
    const matchSearch =
      !search ||
      [e.serial, e.model, e.assignedTo ?? "", e.province].some((f) =>
        f.toLowerCase().includes(q),
      );
    const matchStatus = statusFilter === "all" || e.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalCount = mockEquipment.length;
  const faultyCount = mockEquipment.filter(
    (e) => e.status === "en_panne",
  ).length;
  const activeCount = mockEquipment.filter((e) => e.status === "actif").length;
  const assignedCount = mockEquipment.filter((e) => e.assignedTo).length;

  const columns: Column<EquipmentType>[] = [
    {
      key: "serial",
      header: "N° Série",
      sortable: true,
      render: (r) => (
        <span className="font-mono text-xs font-semibold text-primary-300">
          {r.serial}
        </span>
      ),
    },
    {
      key: "model",
      header: "Badge GPS",
      sortable: true,
      render: () => <Badge variant="default">Badge GPS</Badge>,
    },
    { key: "model", header: "Modèle", sortable: true },
    {
      key: "assignedTo",
      header: "Affecté à",
      render: (r) =>
        r.assignedTo ? (
          <span className="text-xs text-slate-200">{r.assignedTo}</span>
        ) : (
          <span className="text-xs text-slate-500 italic">Non affecté</span>
        ),
    },
    { key: "province", header: "Province", sortable: true },
    {
      key: "status",
      header: "Statut",
      sortable: true,
      render: (r) => <EquipmentStatusBadge status={r.status} />,
    },
    {
      key: "battery",
      header: "Batterie",
      render: (r) => <BatteryIcon level={r.battery} />,
    },
    {
      key: "lastSeen",
      header: "Dernière activité",
      sortable: true,
      render: (r) => (
        <div className="flex items-center gap-1.5">
          {r.status === "actif" ? (
            <Wifi className="h-3 w-3 text-success-400" />
          ) : (
            <WifiOff className="h-3 w-3 text-slate-500" />
          )}
          <span className="text-xs text-slate-400">
            {formatDate(r.lastSeen)}
          </span>
        </div>
      ),
    },
    {
      key: "id",
      header: "",
      render: (r) => (
        <Dropdown
          trigger={
            <Button variant="ghost" size="icon-sm">
              <Edit className="h-3.5 w-3.5" />
            </Button>
          }
          items={[
            { label: "Voir détails", onClick: () => setSelected(r) },
            {
              label: "Modifier affectation",
              onClick: () =>
                toast({
                  type: "info",
                  title: "Fonctionnalité bientôt disponible",
                }),
            },
            { separator: true, label: "" },
            {
              label: "Désactiver",
              variant: "danger",
              icon: <Trash2 className="h-4 w-4" />,
              onClick: () =>
                toast({ type: "warning", title: "Équipement désactivé" }),
            },
          ]}
        />
      ),
    },
  ];

  return (
    <>
      <div className="space-y-5">
        <PageHeader
          title="Gestion des équipements"
          description="Dispositifs Badge GPS"
          icon={Cpu}
        >
          <Button size="sm" onClick={() => setShowCreate(true)}>
            <Plus className="h-3.5 w-3.5" />
            Ajouter Badge GPS
          </Button>
        </PageHeader>

        {/* Summary cards */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            {
              label: "Badges GPS totaux",
              value: totalCount,
              color: "text-primary-400",
              bg: "bg-primary-600/10",
            },
            {
              label: "Affectés",
              value: assignedCount,
              color: "text-success-400",
              bg: "bg-success-600/10",
            },
            {
              label: "En panne",
              value: faultyCount,
              color: "text-danger-400",
              bg: "bg-danger-600/10",
            },
            {
              label: "Actifs",
              value: activeCount,
              color: "text-warning-400",
              bg: "bg-warning-600/10",
            },
          ].map(({ label, value, color, bg }) => (
            <Card key={label} className={`${bg} border-transparent`}>
              <CardContent className="p-4">
                <p className={`text-2xl font-bold tabular-nums ${color}`}>
                  {value}
                </p>
                <p className="text-xs text-slate-400 mt-1">{label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px] max-w-xs">
            <Input
              placeholder="N° série, modèle, affectataire…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8"
            />
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500 pointer-events-none" />
          </div>
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">Tous les statuts</option>
            <option value="actif">Actif</option>
            <option value="inactif">Inactif</option>
            <option value="en_panne">En panne</option>
            <option value="en_transit">En transit</option>
          </Select>
          <span className="ml-auto text-xs text-slate-500">
            {filtered.length} équipement(s)
          </span>
        </div>

        {filtered.length === 0 ? (
          <EmptyState icon={Cpu} title="Aucun équipement trouvé" />
        ) : (
          <DataTable
            columns={columns}
            data={filtered}
            onRowClick={setSelected}
          />
        )}
      </div>

      {/* Detail dialog */}
      <Dialog open={!!selected} onClose={() => setSelected(null)}>
        {selected && (
          <>
            <DialogHeader>
              <div>
                <DialogTitle>{selected.serial}</DialogTitle>
                <p className="text-xs text-slate-400 mt-0.5">
                  {selected.model}
                </p>
              </div>
              <DialogClose onClose={() => setSelected(null)} />
            </DialogHeader>
            <DialogBody className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-600/20">
                  <Cpu className="h-5 w-5 text-primary-400" />
                </div>
                <div className="space-y-1">
                  <EquipmentStatusBadge status={selected.status} />
                  <Badge variant="default">Badge GPS</Badge>
                </div>
              </div>
              <Separator />
              <div className="space-y-3">
                {[
                  { label: "Modèle", value: selected.model },
                  { label: "Province", value: selected.province },
                  { label: "Affecté à", value: selected.assignedTo ?? "—" },
                  {
                    label: "Transport actif",
                    value: selected.assignedTransport ?? "—",
                  },
                  {
                    label: "Dernière activité",
                    value: formatDate(selected.lastSeen),
                  },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between">
                    <span className="text-xs text-slate-500">{label}</span>
                    <span className="text-xs text-slate-200 font-medium">
                      {value}
                    </span>
                  </div>
                ))}
                {selected.battery !== undefined && (
                  <div>
                    <div className="flex justify-between mb-1.5">
                      <span className="text-xs text-slate-500">
                        Niveau de batterie
                      </span>
                      <BatteryIcon level={selected.battery} />
                    </div>
                    <Progress
                      value={selected.battery}
                      barClassName={
                        selected.battery < 25
                          ? "bg-danger-500"
                          : selected.battery < 60
                            ? "bg-warning-500"
                            : "bg-success-500"
                      }
                    />
                  </div>
                )}
              </div>
            </DialogBody>
            <DialogFooter>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setSelected(null)}
              >
                Fermer
              </Button>
              <Button
                size="sm"
                onClick={() =>
                  toast({
                    type: "success",
                    title: "Modifications enregistrées",
                  })
                }
              >
                Modifier
              </Button>
            </DialogFooter>
          </>
        )}
      </Dialog>

      {/* Create Badge GPS dialog */}
      <Dialog open={showCreate} onClose={() => setShowCreate(false)}>
        <DialogHeader>
          <div>
            <DialogTitle>Ajouter un Badge GPS</DialogTitle>
            <DialogDescription>
              Enregistrer un nouveau dispositif Badge GPS
            </DialogDescription>
          </div>
          <DialogClose onClose={() => setShowCreate(false)} />
        </DialogHeader>
        <DialogBody>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="eq-serial">Numéro de série *</Label>
              <Input
                id="eq-serial"
                placeholder="ex: BGP-0999"
                value={form.serial}
                onChange={setField("serial")}
                className="font-mono"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="eq-model">Modèle *</Label>
              <Select
                id="eq-model"
                value={form.model}
                onChange={setField("model")}
                className="w-full"
              >
                <option value="">Sélectionner</option>
                <option value="SmartBadge v2 (Queclink)">
                  SmartBadge v2 (Queclink)
                </option>
                <option value="SmartBadge v3 (Teltonika)">
                  SmartBadge v3 (Teltonika)
                </option>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="eq-province">Province *</Label>
              <Select
                id="eq-province"
                value={form.province}
                onChange={setField("province")}
                className="w-full"
              >
                <option value="">Sélectionner</option>
                {[
                  "Haut-Katanga",
                  "Lualaba",
                  "Nord-Kivu",
                  "Sud-Kivu",
                  "Tanganyika",
                  "Maniema",
                  "Kinshasa",
                  "Kasaï",
                ].map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="eq-actor">Affecter à (optionnel)</Label>
              <Select
                id="eq-actor"
                value={form.assignedTo}
                onChange={setField("assignedTo")}
                className="w-full"
              >
                <option value="">Non affecté</option>
                {mockActors
                  .filter(
                    (a) => a.role === "transporteur" && a.status === "actif",
                  )
                  .map((a) => (
                    <option key={a.id} value={a.name}>
                      {a.name}
                    </option>
                  ))}
              </Select>
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
            Enregistrer
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}
