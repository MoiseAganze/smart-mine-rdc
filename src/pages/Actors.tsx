import { useState } from "react";
import {
  Users,
  Plus,
  Search,
  Upload,
  Phone,
  Mail,
  Building2,
  MapPin,
  Truck,
  X,
} from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable, type Column } from "@/components/shared/DataTable";
import { ActorStatusBadge } from "@/components/shared/StatusBadge";
import { EmptyState } from "@/components/shared/EmptyState";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogBody,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { mockActors, type Actor, type ActorRole } from "@/lib/mock-data";
import { formatDateShort } from "@/lib/utils";
import { useToast } from "@/components/shared/Toast";

const roleColors: Record<ActorRole, string> = {
  agent: "text-primary-400",
  transporteur: "text-success-400",
  destinataire: "text-warning-400",
  superviseur: "text-violet-400",
};

const roleLabels: Record<ActorRole, string> = {
  agent: "Agent",
  transporteur: "Transporteur",
  destinataire: "Destinataire",
  superviseur: "Superviseur",
};

export default function Actors() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [selected, setSelected] = useState<Actor | null>(null);
  const [activeTab, setActiveTab] = useState("list");
  const { toast } = useToast();

  const filtered = mockActors.filter((a) => {
    const q = search.toLowerCase();
    const matchSearch =
      !search ||
      [a.name, a.email, a.phone, a.province, a.company ?? ""].some((f) =>
        f.toLowerCase().includes(q),
      );
    const matchRole = roleFilter === "all" || a.role === roleFilter;
    return matchSearch && matchRole;
  });

  const byRole = (role: ActorRole) => mockActors.filter((a) => a.role === role);

  const columns: Column<Actor>[] = [
    {
      key: "name",
      header: "Nom complet",
      sortable: true,
      render: (r) => (
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-600/20 text-xs font-semibold text-primary-300">
            {r.name.charAt(0)}
          </div>
          <div>
            <p className="text-sm font-medium text-slate-200">{r.name}</p>
            {r.company && (
              <p className="text-[10px] text-slate-500">{r.company}</p>
            )}
          </div>
        </div>
      ),
    },
    {
      key: "role",
      header: "Rôle",
      sortable: true,
      render: (r) => (
        <span className={`text-xs font-medium ${roleColors[r.role]}`}>
          {roleLabels[r.role]}
        </span>
      ),
    },
    { key: "province", header: "Province", sortable: true },
    {
      key: "email",
      header: "Contact",
      render: (r) => (
        <div className="space-y-0.5">
          <p className="text-xs text-slate-300">{r.email}</p>
          <p className="text-[10px] text-slate-500">{r.phone}</p>
        </div>
      ),
    },
    {
      key: "transportsCount",
      header: "Transports",
      sortable: true,
      render: (r) => (
        <span className="tabular-nums font-medium">{r.transportsCount}</span>
      ),
    },
    {
      key: "status",
      header: "Statut",
      sortable: true,
      render: (r) => <ActorStatusBadge status={r.status} />,
    },
    {
      key: "createdAt",
      header: "Créé le",
      sortable: true,
      render: (r) => (
        <span className="text-xs text-slate-400">
          {formatDateShort(r.createdAt)}
        </span>
      ),
    },
  ];

  return (
    <>
      <div className="space-y-5">
        <PageHeader
          title="Gestion des acteurs"
          description="Agents, transporteurs, destinataires et superviseurs"
          icon={Users}
        >
          <Button size="sm" onClick={() => setActiveTab("add")}>
            <Plus className="h-3.5 w-3.5" />
            Nouvel acteur
          </Button>
        </PageHeader>

        {/* Stats row */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {(
            [
              "agent",
              "transporteur",
              "destinataire",
              "superviseur",
            ] as ActorRole[]
          ).map((role) => (
            <button
              key={role}
              onClick={() => setRoleFilter(roleFilter === role ? "all" : role)}
              className={`rounded-xl border p-3 text-left transition-all cursor-pointer ${
                roleFilter === role
                  ? "border-primary-600/50 bg-primary-600/10"
                  : "border-slate-700/60 bg-slate-800/50 hover:border-slate-600"
              }`}
            >
              <p
                className={`text-xl font-bold tabular-nums ${roleColors[role]}`}
              >
                {byRole(role).length}
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                {roleLabels[role]}s
              </p>
              <p className="text-[10px] text-slate-500">
                {byRole(role).filter((a) => a.status === "actif").length} actifs
              </p>
            </button>
          ))}
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex items-center justify-between gap-4">
            <TabsList>
              <TabsTrigger value="list">
                <Users className="h-3.5 w-3.5" />
                Liste
              </TabsTrigger>
              <TabsTrigger value="add">
                <Plus className="h-3.5 w-3.5" />
                Ajouter
              </TabsTrigger>
            </TabsList>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Input
                  placeholder="Rechercher…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-8 w-56"
                />
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500 pointer-events-none" />
              </div>
              <Select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <option value="all">Tous les rôles</option>
                <option value="agent">Agents</option>
                <option value="transporteur">Transporteurs</option>
                <option value="destinataire">Destinataires</option>
                <option value="superviseur">Superviseurs</option>
              </Select>
            </div>
          </div>

          <TabsContent value="list">
            {filtered.length === 0 ? (
              <EmptyState
                icon={Users}
                title="Aucun acteur trouvé"
                description="Modifiez vos filtres ou ajoutez un nouvel acteur."
              />
            ) : (
              <DataTable
                columns={columns}
                data={filtered}
                onRowClick={setSelected}
              />
            )}
          </TabsContent>

          <TabsContent value="add">
            <Card>
              <CardHeader>
                <CardTitle>Enregistrer un nouvel acteur</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="name">Nom complet *</Label>
                    <Input id="name" placeholder="Jean-Baptiste Mwamba" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="role">Rôle *</Label>
                    <Select id="role" className="w-full">
                      <option value="">Sélectionner un rôle</option>
                      <option value="agent">Agent</option>
                      <option value="transporteur">Transporteur</option>
                      <option value="destinataire">Destinataire</option>
                      <option value="superviseur">Superviseur</option>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="nom@exemple.cd"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="phone">Téléphone *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+243 8X XXX XXXX"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="province">Province *</Label>
                    <Select id="province" className="w-full">
                      <option value="">Sélectionner</option>
                      {[
                        "Haut-Katanga",
                        "Lualaba",
                        "Nord-Kivu",
                        "Sud-Kivu",
                        "Tanganyika",
                        "Maniema",
                        "Kinshasa",
                      ].map((p) => (
                        <option key={p} value={p}>
                          {p}
                        </option>
                      ))}
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="company">Entreprise</Label>
                    <Input
                      id="company"
                      placeholder="GECAMINES Trans, MinTrans…"
                    />
                  </div>
                  <div className="space-y-1.5 sm:col-span-2">
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea
                      id="notes"
                      placeholder="Informations complémentaires…"
                      rows={3}
                    />
                  </div>
                  <div className="space-y-1.5 sm:col-span-2">
                    <Label>Documents d'identité</Label>
                    <div className="flex items-center justify-center rounded-xl border-2 border-dashed border-slate-700 p-8 hover:border-slate-600 transition-colors cursor-pointer">
                      <div className="flex flex-col items-center gap-2 text-slate-500">
                        <Upload className="h-6 w-6" />
                        <p className="text-sm">
                          Glisser-déposer ou{" "}
                          <span className="text-primary-400">parcourir</span>
                        </p>
                        <p className="text-xs">PDF, JPG, PNG · max 10 Mo</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-5 flex justify-end gap-3">
                  <Button variant="secondary">Annuler</Button>
                  <Button
                    onClick={() =>
                      toast({
                        type: "success",
                        title: "Acteur enregistré",
                        description: "Le nouvel acteur a été créé avec succès.",
                      })
                    }
                  >
                    Enregistrer
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Detail dialog */}
      <Dialog
        open={!!selected}
        onClose={() => setSelected(null)}
        className="max-w-lg"
      >
        {selected && (
          <>
            <DialogHeader>
              <div>
                <DialogTitle>{selected.name}</DialogTitle>
                <DialogDescription>
                  {roleLabels[selected.role]} · {selected.province}
                </DialogDescription>
              </div>
              <DialogClose onClose={() => setSelected(null)} />
            </DialogHeader>
            <DialogBody className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-600/20 text-xl font-bold text-primary-300">
                  {selected.name.charAt(0)}
                </div>
                <div>
                  <p
                    className={`text-sm font-semibold ${roleColors[selected.role]}`}
                  >
                    {roleLabels[selected.role]}
                  </p>
                  <ActorStatusBadge status={selected.status} />
                </div>
              </div>
              <Separator />
              <div className="grid grid-cols-2 gap-3 text-sm">
                {[
                  { icon: Mail, label: "Email", value: selected.email },
                  { icon: Phone, label: "Téléphone", value: selected.phone },
                  { icon: MapPin, label: "Province", value: selected.province },
                  {
                    icon: Building2,
                    label: "Entreprise",
                    value: selected.company ?? "—",
                  },
                  {
                    icon: Truck,
                    label: "Transports",
                    value: String(selected.transportsCount),
                  },
                  {
                    icon: Users,
                    label: "Membre depuis",
                    value: formatDateShort(selected.createdAt),
                  },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-start gap-2">
                    <Icon className="h-3.5 w-3.5 text-slate-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-[10px] text-slate-500">{label}</p>
                      <p className="text-xs text-slate-200">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-400">Nombre de transports</p>
                <Badge
                  variant={
                    selected.transportsCount > 50 ? "success" : "neutral"
                  }
                >
                  {selected.transportsCount} transports
                </Badge>
              </div>
            </DialogBody>
            <DialogFooter>
              {selected.status === "actif" ? (
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => {
                    setSelected(null);
                    toast({ type: "warning", title: "Acteur suspendu" });
                  }}
                >
                  Suspendre
                </Button>
              ) : (
                <Button
                  variant="success"
                  size="sm"
                  onClick={() => {
                    setSelected(null);
                    toast({ type: "success", title: "Acteur réactivé" });
                  }}
                >
                  Réactiver
                </Button>
              )}
              <Button size="sm">Modifier</Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelected(null)}
              >
                <X className="h-3.5 w-3.5" />
                Fermer
              </Button>
            </DialogFooter>
          </>
        )}
      </Dialog>
    </>
  );
}
