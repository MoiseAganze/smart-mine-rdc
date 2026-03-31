import { useState } from "react";
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  Search,
  X,
  MapPin,
  Truck,
  User,
} from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { AlertPriorityBadge } from "@/components/shared/StatusBadge";
import { EmptyState } from "@/components/shared/EmptyState";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
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
import { mockAlerts, type Alert, type AlertPriority } from "@/lib/mock-data";
import { formatDate } from "@/lib/utils";
import { useToast } from "@/components/shared/Toast";

const priorityOrder: Record<AlertPriority, number> = {
  critique: 0,
  élevée: 1,
  moyenne: 2,
  faible: 3,
};

const priorityStyles: Record<
  AlertPriority,
  { border: string; bg: string; icon: string; ring: string }
> = {
  critique: {
    border: "border-danger-600/40",
    bg: "bg-danger-600/8",
    icon: "text-danger-400",
    ring: "ring-danger-600/20",
  },
  élevée: {
    border: "border-warning-600/40",
    bg: "bg-warning-600/8",
    icon: "text-warning-400",
    ring: "ring-warning-600/20",
  },
  moyenne: {
    border: "border-primary-600/30",
    bg: "bg-primary-600/5",
    icon: "text-primary-400",
    ring: "ring-primary-600/10",
  },
  faible: {
    border: "border-slate-700/40",
    bg: "bg-slate-800/40",
    icon: "text-slate-400",
    ring: "",
  },
};

export default function Alerts() {
  const [search, setSearch] = useState("");
  const [priorityFilter, setPriority] = useState("all");
  const [showResolved, setShowResolved] = useState(false);
  const [selected, setSelected] = useState<Alert | null>(null);
  const { toast } = useToast();

  const filtered = mockAlerts
    .filter((a) => {
      const q = search.toLowerCase();
      const matchSearch =
        !search ||
        [a.title, a.description, a.location, a.type].some((f) =>
          f.toLowerCase().includes(q),
        );
      const matchPriority =
        priorityFilter === "all" || a.priority === priorityFilter;
      const matchResolved = showResolved || !a.resolved;
      return matchSearch && matchPriority && matchResolved;
    })
    .sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  const unresolvedCount = mockAlerts.filter((a) => !a.resolved).length;
  const critiqueCount = mockAlerts.filter(
    (a) => a.priority === "critique" && !a.resolved,
  ).length;
  const élevéeCount = mockAlerts.filter(
    (a) => a.priority === "élevée" && !a.resolved,
  ).length;

  const handleResolve = (alert: Alert) => {
    setSelected(null);
    toast({
      type: "success",
      title: "Alerte résolue",
      description: `"${alert.title}" a été marquée comme résolue.`,
    });
  };

  return (
    <>
      <div className="space-y-5">
        <PageHeader
          title="Alertes & Anomalies"
          description="Surveillance des incidents et anomalies en temps réel"
          icon={AlertTriangle}
          iconColor="text-danger-400"
        >
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowResolved((v) => !v)}
          >
            {showResolved ? (
              <X className="h-3.5 w-3.5" />
            ) : (
              <CheckCircle className="h-3.5 w-3.5" />
            )}
            {showResolved ? "Masquer résolues" : "Voir résolues"}
          </Button>
        </PageHeader>

        {/* Summary */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            {
              label: "Non résolues",
              value: unresolvedCount,
              color: "text-slate-100",
              bg: "bg-slate-800/60 border-slate-700/60",
            },
            {
              label: "Critiques",
              value: critiqueCount,
              color: "text-danger-400",
              bg: "bg-danger-600/10 border-danger-600/30",
            },
            {
              label: "Élevées",
              value: élevéeCount,
              color: "text-warning-400",
              bg: "bg-warning-600/10 border-warning-600/30",
            },
            {
              label: "Résolues",
              value: mockAlerts.filter((a) => a.resolved).length,
              color: "text-success-400",
              bg: "bg-success-600/10 border-success-600/30",
            },
          ].map(({ label, value, color, bg }) => (
            <Card key={label} className={`border ${bg}`}>
              <CardContent className="p-4">
                <p className={`text-2xl font-bold tabular-nums ${color}`}>
                  {value}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">{label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Input
              placeholder="Titre, description, localisation…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8"
            />
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500 pointer-events-none" />
          </div>
          <Select
            value={priorityFilter}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="all">Toutes priorités</option>
            <option value="critique">Critique</option>
            <option value="élevée">Élevée</option>
            <option value="moyenne">Moyenne</option>
            <option value="faible">Faible</option>
          </Select>
          {(search || priorityFilter !== "all") && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearch("");
                setPriority("all");
              }}
            >
              <X className="h-3.5 w-3.5" />
              Réinitialiser
            </Button>
          )}
          <span className="ml-auto text-xs text-slate-500">
            {filtered.length} alerte(s)
          </span>
        </div>

        {/* Alert list */}
        {filtered.length === 0 ? (
          <EmptyState
            icon={CheckCircle}
            title="Aucune alerte active"
            description="Toutes les alertes ont été résolues ou aucune ne correspond à vos filtres."
          />
        ) : (
          <div className="space-y-2">
            {filtered.map((alert) => {
              const style = priorityStyles[alert.priority];
              return (
                <button
                  key={alert.id}
                  onClick={() => setSelected(alert)}
                  className={`w-full rounded-xl border ${style.border} ${alert.resolved ? "opacity-50" : ""} p-4 text-left transition-all hover:brightness-110 cursor-pointer`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-800 ring-1 ${style.ring}`}
                    >
                      <AlertTriangle className={`h-3.5 w-3.5 ${style.icon}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="text-sm font-semibold text-slate-100">
                          {alert.title}
                        </span>
                        <AlertPriorityBadge priority={alert.priority} />
                        <Badge variant="neutral">{alert.type}</Badge>
                        {alert.resolved && (
                          <Badge variant="success">Résolu</Badge>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 line-clamp-2">
                        {alert.description}
                      </p>
                      <div className="mt-2 flex flex-wrap items-center gap-3 text-[11px] text-slate-500">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {alert.location}
                        </span>
                        {alert.transport && (
                          <span className="flex items-center gap-1">
                            <Truck className="h-3 w-3" />
                            {alert.transport}
                          </span>
                        )}
                        {alert.actor && (
                          <span className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {alert.actor}
                          </span>
                        )}
                        <span className="flex items-center gap-1 ml-auto">
                          <Clock className="h-3 w-3" />
                          {formatDate(alert.timestamp)}
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Detail dialog */}
      <Dialog
        open={!!selected}
        onClose={() => setSelected(null)}
        className="max-w-xl"
      >
        {selected && (
          <>
            <DialogHeader>
              <div>
                <DialogTitle>{selected.title}</DialogTitle>
                <DialogDescription>
                  {selected.type} · {formatDate(selected.timestamp)}
                </DialogDescription>
              </div>
              <DialogClose onClose={() => setSelected(null)} />
            </DialogHeader>
            <DialogBody className="space-y-4">
              <div className="flex items-center gap-3">
                <AlertPriorityBadge priority={selected.priority} />
                {selected.resolved && <Badge variant="success">Résolu</Badge>}
              </div>
              <div className="rounded-xl border border-slate-700/60 bg-slate-800/60 p-4">
                <p className="text-sm text-slate-200 leading-relaxed">
                  {selected.description}
                </p>
              </div>
              <Separator />
              <div className="grid grid-cols-2 gap-3">
                {[
                  {
                    icon: MapPin,
                    label: "Localisation",
                    value: selected.location,
                  },
                  {
                    icon: Clock,
                    label: "Horodatage",
                    value: formatDate(selected.timestamp),
                  },
                  ...(selected.transport
                    ? [
                        {
                          icon: Truck,
                          label: "Transport",
                          value: selected.transport,
                        },
                      ]
                    : []),
                  ...(selected.actor
                    ? [{ icon: User, label: "Acteur", value: selected.actor }]
                    : []),
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
              {!selected.resolved && (
                <>
                  <Separator />
                  <div className="rounded-xl border border-warning-600/20 bg-warning-600/8 p-3">
                    <p className="text-xs text-warning-300 font-medium">
                      Action requise
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      Cette alerte nécessite une intervention. Veuillez prendre
                      les mesures appropriées avant de la marquer comme résolue.
                    </p>
                  </div>
                </>
              )}
            </DialogBody>
            <DialogFooter>
              {!selected.resolved && (
                <Button
                  variant="success"
                  size="sm"
                  onClick={() => handleResolve(selected)}
                >
                  <CheckCircle className="h-3.5 w-3.5" />
                  Marquer comme résolue
                </Button>
              )}
              <Button
                variant="danger"
                size="sm"
                onClick={() => {
                  setSelected(null);
                  toast({ type: "info", title: "Escalade créée" });
                }}
              >
                Escalader
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelected(null)}
              >
                Fermer
              </Button>
            </DialogFooter>
          </>
        )}
      </Dialog>
    </>
  );
}
