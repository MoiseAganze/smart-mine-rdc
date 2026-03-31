import { useState } from "react";
import {
  Settings as SettingsIcon,
  Bell,
  Shield,
  Database,
  Globe,
  Palette,
  Save,
  RefreshCw,
} from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/shared/Toast";

function ToggleRow({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <div className="min-w-0">
        <p className="text-sm font-medium text-slate-200">{label}</p>
        <p className="text-xs text-slate-500 mt-0.5">{description}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}

export default function Settings() {
  const { toast } = useToast();

  const [notifSettings, setNotif] = useState({
    alertCritique: true,
    alertElevee: true,
    alertMoyenne: false,
    emailDigest: true,
    smsAlerts: false,
    browserPush: true,
  });

  const [systemSettings, setSystem] = useState({
    autoRefresh: true,
    auditLog: true,
    twoFactor: true,
    sessionTimeout: false,
    maintenanceMode: false,
  });

  const toggleNotif = (key: keyof typeof notifSettings) =>
    setNotif((s) => ({ ...s, [key]: !s[key] }));

  const toggleSystem = (key: keyof typeof systemSettings) =>
    setSystem((s) => ({ ...s, [key]: !s[key] }));

  const handleSave = () =>
    toast({
      type: "success",
      title: "Paramètres enregistrés",
      description: "Vos modifications ont été appliquées.",
    });

  return (
    <div className="space-y-5">
      <PageHeader
        title="Paramètres"
        description="Configuration de la plateforme SMART MINE RDC"
        icon={SettingsIcon}
      >
        <Button variant="outline" size="sm">
          <RefreshCw className="h-3.5 w-3.5" />
          Réinitialiser
        </Button>
        <Button size="sm" onClick={handleSave}>
          <Save className="h-3.5 w-3.5" />
          Enregistrer
        </Button>
      </PageHeader>

      <Tabs defaultValue="general">
        <TabsList>
          <TabsTrigger value="general">
            <Globe className="h-3.5 w-3.5" />
            Général
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="h-3.5 w-3.5" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="security">
            <Shield className="h-3.5 w-3.5" />
            Sécurité
          </TabsTrigger>
          <TabsTrigger value="system">
            <Database className="h-3.5 w-3.5" />
            Système
          </TabsTrigger>
          <TabsTrigger value="appearance">
            <Palette className="h-3.5 w-3.5" />
            Apparence
          </TabsTrigger>
        </TabsList>

        {/* General */}
        <TabsContent value="general">
          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Informations de la plateforme</CardTitle>
                <CardDescription>
                  Configuration de base du système
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  {
                    id: "platform-name",
                    label: "Nom de la plateforme",
                    defaultValue: "SMART MINE RDC",
                  },
                  {
                    id: "org",
                    label: "Organisation",
                    defaultValue: "Ministère des Mines, RDC",
                  },
                  {
                    id: "contact",
                    label: "Email de contact",
                    defaultValue: "admin@smartmine.gouv.cd",
                  },
                  {
                    id: "timezone",
                    label: "Fuseau horaire",
                    defaultValue: "Africa/Kinshasa (UTC+1)",
                  },
                ].map(({ id, label, defaultValue }) => (
                  <div key={id} className="space-y-1.5">
                    <Label htmlFor={id}>{label}</Label>
                    <Input id={id} defaultValue={defaultValue} />
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Configuration des transports</CardTitle>
                <CardDescription>
                  Seuils et règles de validation
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  {
                    id: "max-weight",
                    label: "Poids maximal par convoi (kg)",
                    defaultValue: "50000",
                  },
                  {
                    id: "deviation-km",
                    label: "Seuil déviation route (km)",
                    defaultValue: "20",
                  },
                  {
                    id: "stop-duration",
                    label: "Durée arrêt non planifié max (min)",
                    defaultValue: "60",
                  },
                  {
                    id: "gps-interval",
                    label: "Intervalle envoi GPS (secondes)",
                    defaultValue: "30",
                  },
                ].map(({ id, label, defaultValue }) => (
                  <div key={id} className="space-y-1.5">
                    <Label htmlFor={id}>{label}</Label>
                    <Input id={id} type="number" defaultValue={defaultValue} />
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Provinces actives</CardTitle>
                <CardDescription>
                  Provinces couvertes par le système
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
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
                    <Badge
                      key={p}
                      variant="default"
                      className="cursor-pointer hover:brightness-125"
                    >
                      {p}
                    </Badge>
                  ))}
                  <Button variant="outline" size="sm">
                    <span className="text-lg leading-none">+</span>Ajouter
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Intégrations API</CardTitle>
                <CardDescription>
                  Connexions aux services externes
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  {
                    name: "GPS Teltonika API",
                    status: "connecté",
                    url: "api.teltonika.lt",
                  },
                  {
                    name: "Queclink Fleet",
                    status: "connecté",
                    url: "fleet.queclink.com",
                  },
                  {
                    name: "SAGEMCOM Postaux",
                    status: "déconnecté",
                    url: "api.sagemcom.cd",
                  },
                  {
                    name: "Ministère Base RDC",
                    status: "connecté",
                    url: "data.mines.gouv.cd",
                  },
                ].map(({ name, status, url }) => (
                  <div
                    key={name}
                    className="flex items-center justify-between rounded-lg border border-slate-700/50 bg-slate-800/40 px-3 py-2.5"
                  >
                    <div>
                      <p className="text-xs font-medium text-slate-200">
                        {name}
                      </p>
                      <p className="text-[10px] text-slate-500">{url}</p>
                    </div>
                    <Badge
                      variant={status === "connecté" ? "success" : "danger"}
                    >
                      {status}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications">
          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Alertes en temps réel</CardTitle>
                <CardDescription>
                  Choisissez les alertes à recevoir
                </CardDescription>
              </CardHeader>
              <CardContent className="divide-y divide-slate-700/40">
                <ToggleRow
                  label="Alertes critiques"
                  description="Déviations, fraudes et incidents graves"
                  checked={notifSettings.alertCritique}
                  onChange={() => toggleNotif("alertCritique")}
                />
                <ToggleRow
                  label="Alertes élevées"
                  description="Arrêts non planifiés, badges invalides"
                  checked={notifSettings.alertElevee}
                  onChange={() => toggleNotif("alertElevee")}
                />
                <ToggleRow
                  label="Alertes moyennes"
                  description="Anomalies GPS, retards mineurs"
                  checked={notifSettings.alertMoyenne}
                  onChange={() => toggleNotif("alertMoyenne")}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Canaux de notification</CardTitle>
                <CardDescription>
                  Comment recevoir les notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="divide-y divide-slate-700/40">
                <ToggleRow
                  label="Email digest quotidien"
                  description="Résumé envoyé à 07h00 chaque matin"
                  checked={notifSettings.emailDigest}
                  onChange={() => toggleNotif("emailDigest")}
                />
                <ToggleRow
                  label="SMS pour critiques"
                  description="SMS envoyé pour toute alerte critique"
                  checked={notifSettings.smsAlerts}
                  onChange={() => toggleNotif("smsAlerts")}
                />
                <ToggleRow
                  label="Notifications browser"
                  description="Alertes push dans le navigateur"
                  checked={notifSettings.browserPush}
                  onChange={() => toggleNotif("browserPush")}
                />
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Destinataires des alertes critiques</CardTitle>
                <CardDescription>
                  Ces contacts sont notifiés immédiatement
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  "sophie.tshisekedi@mines.gouv.cd",
                  "ops.urgence@smartmine.gouv.cd",
                ].map((email) => (
                  <div
                    key={email}
                    className="flex items-center justify-between rounded-lg border border-slate-700/50 bg-slate-800/40 px-3 py-2.5"
                  >
                    <span className="text-sm text-slate-300">{email}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-danger-400 hover:text-danger-300"
                    >
                      Supprimer
                    </Button>
                  </div>
                ))}
                <div className="flex gap-2">
                  <Input
                    placeholder="Ajouter une adresse email…"
                    className="flex-1"
                  />
                  <Button variant="secondary" size="sm">
                    Ajouter
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Security */}
        <TabsContent value="security">
          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Authentification</CardTitle>
                <CardDescription>
                  Paramètres de sécurité des accès
                </CardDescription>
              </CardHeader>
              <CardContent className="divide-y divide-slate-700/40">
                <ToggleRow
                  label="Authentification à deux facteurs"
                  description="Obligatoire pour tous les superviseurs"
                  checked={systemSettings.twoFactor}
                  onChange={() => toggleSystem("twoFactor")}
                />
                <ToggleRow
                  label="Expiration de session (30 min)"
                  description="Déconnexion automatique après inactivité"
                  checked={systemSettings.sessionTimeout}
                  onChange={() => toggleSystem("sessionTimeout")}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Politique de mots de passe</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1.5">
                  <Label>Longueur minimale</Label>
                  <Select defaultValue="12" className="w-full">
                    <option value="8">8 caractères</option>
                    <option value="10">10 caractères</option>
                    <option value="12">12 caractères</option>
                    <option value="16">16 caractères</option>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Expiration du mot de passe</Label>
                  <Select defaultValue="90" className="w-full">
                    <option value="30">30 jours</option>
                    <option value="60">60 jours</option>
                    <option value="90">90 jours</option>
                    <option value="never">Jamais</option>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Plages IP autorisées</CardTitle>
                <CardDescription>
                  Restriction d'accès par adresse IP
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  "41.243.0.0/16 — Réseau gouvernemental RDC",
                  "196.207.0.0/16 — Réseau GECAMINES",
                ].map((ip) => (
                  <div
                    key={ip}
                    className="flex items-center justify-between rounded-lg border border-slate-700/50 bg-slate-800/40 px-3 py-2.5"
                  >
                    <span className="font-mono text-xs text-slate-300">
                      {ip}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-danger-400 hover:text-danger-300"
                    >
                      Supprimer
                    </Button>
                  </div>
                ))}
                <div className="flex gap-2">
                  <Input
                    placeholder="Ex: 192.168.1.0/24"
                    className="flex-1 font-mono"
                  />
                  <Button variant="secondary" size="sm">
                    Ajouter
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* System */}
        <TabsContent value="system">
          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Comportement système</CardTitle>
              </CardHeader>
              <CardContent className="divide-y divide-slate-700/40">
                <ToggleRow
                  label="Actualisation auto"
                  description="Mise à jour toutes les 30 secondes"
                  checked={systemSettings.autoRefresh}
                  onChange={() => toggleSystem("autoRefresh")}
                />
                <ToggleRow
                  label="Journal d'audit"
                  description="Enregistrer toutes les actions utilisateurs"
                  checked={systemSettings.auditLog}
                  onChange={() => toggleSystem("auditLog")}
                />
                <ToggleRow
                  label="Mode maintenance"
                  description="Restreindre l'accès pendant la maintenance"
                  checked={systemSettings.maintenanceMode}
                  onChange={() => toggleSystem("maintenanceMode")}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>État du système</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  {
                    service: "API principale",
                    status: "Opérationnel",
                    ok: true,
                    latency: "42ms",
                  },
                  {
                    service: "Service GPS",
                    status: "Opérationnel",
                    ok: true,
                    latency: "128ms",
                  },
                  {
                    service: "Base de données",
                    status: "Opérationnel",
                    ok: true,
                    latency: "8ms",
                  },
                  {
                    service: "Service de notifs",
                    status: "Dégradé",
                    ok: false,
                    latency: "890ms",
                  },
                  {
                    service: "Stockage fichiers",
                    status: "Opérationnel",
                    ok: true,
                    latency: "15ms",
                  },
                ].map(({ service, status, ok, latency }) => (
                  <div
                    key={service}
                    className="flex items-center justify-between rounded-lg border border-slate-700/50 bg-slate-800/40 px-3 py-2.5"
                  >
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`h-2 w-2 rounded-full ${ok ? "bg-success-500" : "bg-warning-500"}`}
                      />
                      <span className="text-xs text-slate-300">{service}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] text-slate-500">
                        {latency}
                      </span>
                      <Badge variant={ok ? "success" : "warning"}>
                        {status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Appearance */}
        <TabsContent value="appearance">
          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Thème et couleurs</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1.5">
                  <Label>Thème</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: "dark", label: "Sombre", active: true },
                      { id: "light", label: "Clair", active: false },
                      { id: "system", label: "Système", active: false },
                    ].map((t) => (
                      <button
                        key={t.id}
                        className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors cursor-pointer ${t.active ? "border-primary-600/60 bg-primary-600/15 text-primary-300" : "border-slate-700 text-slate-400 hover:border-slate-600"}`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>
                <Separator />
                <div className="space-y-2">
                  <Label>Couleur d'accentuation</Label>
                  <div className="flex gap-2">
                    {[
                      "#6366f1",
                      "#3b82f6",
                      "#10b981",
                      "#f59e0b",
                      "#ef4444",
                      "#8b5cf6",
                    ].map((c) => (
                      <button
                        key={c}
                        className="h-7 w-7 rounded-full border-2 border-transparent hover:border-white/50 transition-all cursor-pointer"
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </div>
                <Separator />
                <div className="space-y-1.5">
                  <Label>Densité d'affichage</Label>
                  <Select defaultValue="compact" className="w-full">
                    <option value="spacious">Espacé</option>
                    <option value="default">Par défaut</option>
                    <option value="compact">Compact</option>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Langue et région</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1.5">
                  <Label>Langue de l'interface</Label>
                  <Select defaultValue="fr" className="w-full">
                    <option value="fr">Français</option>
                    <option value="en">English</option>
                    <option value="sw">Kiswahili</option>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Format de date</Label>
                  <Select defaultValue="dmy" className="w-full">
                    <option value="dmy">JJ/MM/AAAA</option>
                    <option value="mdy">MM/JJ/AAAA</option>
                    <option value="iso">AAAA-MM-JJ</option>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Unité de masse</Label>
                  <Select defaultValue="kg" className="w-full">
                    <option value="kg">Kilogrammes (kg)</option>
                    <option value="t">Tonnes métriques (t)</option>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Devise d'affichage</Label>
                  <Select defaultValue="usd" className="w-full">
                    <option value="usd">Dollar américain (USD)</option>
                    <option value="cdf">Franc congolais (CDF)</option>
                    <option value="eur">Euro (EUR)</option>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
