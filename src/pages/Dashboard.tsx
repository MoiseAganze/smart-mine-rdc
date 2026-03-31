import { Truck, AlertTriangle, Users, Cpu, TrendingUp, Package } from 'lucide-react'
import { KpiCard } from '@/components/shared/KpiCard'
import { PageHeader } from '@/components/shared/PageHeader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TransportStatusBadge, AlertPriorityBadge } from '@/components/shared/StatusBadge'
import { Progress } from '@/components/ui/progress'
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts'
import {
  mockAlerts, mockTransports,
  monthlyTransportData, mineralBreakdown, alertTrendData
} from '@/lib/mock-data'
import { formatDate } from '@/lib/utils'

const CHART_COLORS = {
  primary: '#6366f1',
  success: '#22c55e',
  warning: '#f97316',
  danger:  '#ef4444',
  muted:   '#475569',
}

export default function Dashboard() {
  const activeTransports  = mockTransports.filter(t => t.status === 'en_route').length
  const criticalAlerts    = mockAlerts.filter(a => a.priority === 'critique' && !a.resolved).length
  const unresolvedAlerts  = mockAlerts.filter(a => !a.resolved).length

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tableau de bord"
        description="Vue d'ensemble nationale — SMART MINE RDC"
        icon={TrendingUp}
      >
        <div className="flex items-center gap-1.5 rounded-full border border-success-600/30 bg-success-600/10 px-3 py-1">
          <span className="h-1.5 w-1.5 rounded-full bg-success-500 pulse-dot" />
          <span className="text-[11px] font-medium text-success-400">Données en direct</span>
        </div>
      </PageHeader>

      {/* KPI Row */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
        <KpiCard title="Transports actifs"   value={activeTransports}  subValue="En route en ce moment" icon={Truck}         iconColor="text-primary-400" trend={12} pulse />
        <KpiCard title="Total ce mois"       value={212}               subValue="Mars 2024"              icon={Package}       iconColor="text-cyan-400"    trend={8}  />
        <KpiCard title="Alertes actives"     value={unresolvedAlerts}  subValue={`${criticalAlerts} critiques`} icon={AlertTriangle} iconColor="text-danger-400"  trend={-5} />
        <KpiCard title="Acteurs enregistrés" value={247}               subValue="+12 ce mois"           icon={Users}         iconColor="text-success-400" trend={5}  />
        <KpiCard title="Équipements actifs"  value={189}               subValue="GPS + Badges"          icon={Cpu}           iconColor="text-warning-400" trend={2}  />
        <KpiCard title="Tonnes transportées" value="71 500"            subValue="Mars 2024"             icon={TrendingUp}    iconColor="text-violet-400"  trend={13} />
      </div>

      {/* Charts Row 1 */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Monthly Volume */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Volume mensuel de transports</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={monthlyTransportData} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
                <defs>
                  <linearGradient id="colorTransports" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor={CHART_COLORS.primary} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={CHART_COLORS.primary} stopOpacity={0}   />
                  </linearGradient>
                  <linearGradient id="colorTonnes" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor={CHART_COLORS.success} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={CHART_COLORS.success} stopOpacity={0}   />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis yAxisId="left"  tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis yAxisId="right" orientation="right" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8, fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
                <Area yAxisId="left"  type="monotone" dataKey="transports" name="Transports" stroke={CHART_COLORS.primary} fill="url(#colorTransports)" strokeWidth={2} dot={false} />
                <Area yAxisId="right" type="monotone" dataKey="tonnes"     name="Tonnes (kg)" stroke={CHART_COLORS.success} fill="url(#colorTonnes)"     strokeWidth={2} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Mineral Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Répartition par minéral</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={170}>
              <PieChart>
                <Pie data={mineralBreakdown} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={3} dataKey="value">
                  {mineralBreakdown.map((entry, index) => (
                    <Cell key={index} fill={entry.fill} stroke="transparent" />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8, fontSize: 12 }} formatter={(v) => [`${v}%`, '']} />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-2 grid grid-cols-2 gap-1.5">
              {mineralBreakdown.map(m => (
                <div key={m.name} className="flex items-center gap-1.5 text-xs">
                  <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: m.fill }} />
                  <span className="text-slate-400 truncate">{m.name}</span>
                  <span className="ml-auto font-medium text-slate-300">{m.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Alert Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Tendance des alertes (7j)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={alertTrendData} margin={{ top: 5, right: 5, bottom: 5, left: 0 }} barSize={8}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="day" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="critique" name="Critique" fill={CHART_COLORS.danger}  radius={[2,2,0,0]} />
                <Bar dataKey="élevée"   name="Élevée"   fill={CHART_COLORS.warning} radius={[2,2,0,0]} />
                <Bar dataKey="moyenne"  name="Moyenne"  fill={CHART_COLORS.primary} radius={[2,2,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Active Transports */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Transports en cours</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {mockTransports.filter(t => t.status === 'en_route').map(t => (
              <div key={t.id} className="flex items-center gap-3 rounded-lg bg-slate-700/20 p-3 border border-slate-700/40">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-600/20">
                  <Truck className="h-3.5 w-3.5 text-primary-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1.5">
                    <p className="text-xs font-medium text-slate-200 truncate">{t.reference}</p>
                    <TransportStatusBadge status={t.status} />
                  </div>
                  <div className="flex items-center justify-between mb-1.5 text-[11px] text-slate-400">
                    <span className="truncate">{t.origin} → {t.destination}</span>
                    <span className="shrink-0 ml-2">{t.progress}%</span>
                  </div>
                  <Progress value={t.progress} barClassName="bg-primary-500" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Live Alerts */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Alertes récentes</CardTitle>
            <Badge variant="danger">{unresolvedAlerts} actives</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          {mockAlerts.slice(0, 5).map(alert => (
            <div
              key={alert.id}
              className={`flex items-start gap-3 rounded-lg border p-3 transition-colors ${
                alert.resolved
                  ? 'border-slate-700/30 bg-slate-800/20 opacity-60'
                  : 'border-slate-700/50 bg-slate-800/40 hover:bg-slate-700/30'
              }`}
            >
              <AlertTriangle className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${
                alert.priority === 'critique' ? 'text-danger-400' :
                alert.priority === 'élevée'   ? 'text-warning-400' : 'text-primary-400'
              }`} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="text-xs font-medium text-slate-200">{alert.title}</p>
                  <AlertPriorityBadge priority={alert.priority} />
                  {alert.resolved && <Badge variant="success">Résolu</Badge>}
                </div>
                <p className="text-[11px] text-slate-400 truncate">{alert.description}</p>
                <p className="mt-1 text-[10px] text-slate-500">{alert.location} · {formatDate(alert.timestamp)}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
