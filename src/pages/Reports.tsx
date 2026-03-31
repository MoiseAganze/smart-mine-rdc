import { BarChart3, Download, Filter, Calendar, RefreshCw } from 'lucide-react'
import { PageHeader } from '@/components/shared/PageHeader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  BarChart, Bar, AreaChart, Area, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts'
import { monthlyTransportData, mineralBreakdown, alertTrendData, provinceData } from '@/lib/mock-data'

const COLORS = { primary: '#6366f1', success: '#22c55e', warning: '#f97316', danger: '#ef4444', cyan: '#06b6d4' }

const tooltipStyle = { background: '#1e293b', border: '1px solid #334155', borderRadius: 8, fontSize: 12 }

export default function Reports() {
  return (
    <div className="space-y-6">
      <PageHeader title="Rapports & Analyses" description="Analyses avancées de l'activité minière nationale" icon={BarChart3}>
        <Select defaultValue="mars-2024">
          <option value="mars-2024">Mars 2024</option>
          <option value="fev-2024">Février 2024</option>
          <option value="jan-2024">Janvier 2024</option>
          <option value="q1-2024">T1 2024</option>
        </Select>
        <Button variant="outline" size="sm"><Filter className="h-3.5 w-3.5" />Filtres</Button>
        <Button variant="outline" size="sm"><RefreshCw className="h-3.5 w-3.5" />Actualiser</Button>
        <Button size="sm"><Download className="h-3.5 w-3.5" />Exporter PDF</Button>
      </PageHeader>

      {/* KPI summary bar */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: 'Transports totaux',   value: '212',    unit: 'ce mois',  delta: '+12%', up: true  },
          { label: 'Tonnes exportées',     value: '71 500', unit: 'kg',       delta: '+8%',  up: true  },
          { label: 'Valeur estimée',       value: '$4.2M',  unit: 'USD',      delta: '+15%', up: true  },
          { label: 'Taux de conformité',   value: '94.3%',  unit: 'ce mois',  delta: '-0.5%',up: false },
        ].map(({ label, value, unit, delta, up }) => (
          <Card key={label}>
            <CardContent className="p-4">
              <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">{label}</p>
              <p className="text-2xl font-bold text-slate-100 tabular-nums">{value}</p>
              <div className="mt-1 flex items-center gap-2">
                <span className="text-[10px] text-slate-500">{unit}</span>
                <Badge variant={up ? 'success' : 'danger'}>{delta}</Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Row 1: Volume + Province */}
      <div className="grid gap-4 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Volume mensuel (6 mois)</CardTitle>
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <Calendar className="h-3.5 w-3.5" />Oct 2023 – Mar 2024
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={monthlyTransportData} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
                <defs>
                  <linearGradient id="rptTransports" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor={COLORS.primary} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0}   />
                  </linearGradient>
                  <linearGradient id="rptTonnes" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor={COLORS.success} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={COLORS.success} stopOpacity={0}   />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Area type="monotone" dataKey="transports" name="Transports" stroke={COLORS.primary} fill="url(#rptTransports)" strokeWidth={2} dot={false} />
                <Area type="monotone" dataKey="tonnes"     name="Tonnes (÷100)" stroke={COLORS.success} fill="url(#rptTonnes)"     strokeWidth={2} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>Volume par province</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={provinceData} layout="vertical" margin={{ top: 5, right: 10, bottom: 5, left: 0 }} barSize={8}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
                <XAxis type="number" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="province" tick={{ fill: '#94a3b8', fontSize: 10 }} axisLine={false} tickLine={false} width={80} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="transports" name="Transports" fill={COLORS.primary} radius={[0,2,2,0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Row 2: Mineral + Alerts + Trend */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Mineral breakdown table */}
        <Card>
          <CardHeader><CardTitle>Répartition par minéral</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mineralBreakdown.map(m => (
                <div key={m.name}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: m.fill }} />
                      <span className="text-sm text-slate-300">{m.name}</span>
                    </div>
                    <span className="text-sm font-semibold text-slate-100 tabular-nums">{m.value}%</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-slate-700/60">
                    <div className="h-full rounded-full transition-all" style={{ width: `${m.value}%`, backgroundColor: m.fill }} />
                  </div>
                </div>
              ))}
            </div>
            <Separator className="my-4" />
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Minéral dominant</span>
              <span className="font-semibold text-primary-300">Cobalt (34%)</span>
            </div>
          </CardContent>
        </Card>

        {/* Alert trends */}
        <Card>
          <CardHeader><CardTitle>Tendance alertes (7j)</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={alertTrendData} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="day" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Line type="monotone" dataKey="critique" name="Critique" stroke={COLORS.danger}  strokeWidth={2} dot={{ fill: COLORS.danger,  r: 3 }} />
                <Line type="monotone" dataKey="élevée"   name="Élevée"   stroke={COLORS.warning} strokeWidth={2} dot={{ fill: COLORS.warning, r: 3 }} />
                <Line type="monotone" dataKey="moyenne"  name="Moyenne"  stroke={COLORS.primary} strokeWidth={2} dot={{ fill: COLORS.primary, r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top transporters */}
        <Card>
          <CardHeader><CardTitle>Top transporteurs</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { name: 'GECAMINES Trans',  count: 89, pct: 42, color: COLORS.primary },
                { name: 'CopperRoute DRC',  count: 62, pct: 29, color: COLORS.success },
                { name: 'MinTrans SARL',    count: 45, pct: 21, color: COLORS.warning },
                { name: 'GoldSecure DRC',   count: 28, pct: 13, color: COLORS.cyan    },
                { name: 'TinTrans Congo',   count: 18, pct: 8,  color: '#8b5cf6'      },
              ].map((t, i) => (
                <div key={t.name} className="flex items-center gap-3">
                  <span className="text-xs font-bold text-slate-500 w-4 text-center">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between mb-1">
                      <span className="text-xs text-slate-300 truncate">{t.name}</span>
                      <span className="text-xs font-semibold text-slate-200 tabular-nums shrink-0 ml-2">{t.count}</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-slate-700/60">
                      <div className="h-full rounded-full" style={{ width: `${t.pct}%`, backgroundColor: t.color }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Export section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Exports disponibles</CardTitle>
            <Badge variant="default">Mars 2024</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { title: 'Rapport mensuel complet',  desc: 'Tous les transports, alertes et statistiques', format: 'PDF' },
              { title: 'Données transports',        desc: 'Tableau CSV de tous les convois',              format: 'CSV' },
              { title: 'Rapport d\'anomalies',      desc: 'Alertes et incidents du mois',                 format: 'PDF' },
              { title: 'Statistiques provinces',    desc: 'Agrégats par province et minéral',             format: 'XLSX' },
            ].map(({ title, desc, format }) => (
              <div key={title} className="flex items-start justify-between rounded-xl border border-slate-700/60 bg-slate-800/40 p-4">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-slate-200">{title}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">{desc}</p>
                  <Badge variant="neutral" className="mt-2">{format}</Badge>
                </div>
                <Button variant="ghost" size="icon-sm" className="shrink-0 ml-2">
                  <Download className="h-3.5 w-3.5" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
