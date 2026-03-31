import { useState } from 'react'
import { ScrollText, Search, Download, X } from 'lucide-react'
import { PageHeader } from '@/components/shared/PageHeader'
import { DataTable, type Column } from '@/components/shared/DataTable'
import { AuditResultBadge } from '@/components/shared/StatusBadge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { mockAuditLogs, type AuditLog } from '@/lib/mock-data'
import { formatDate } from '@/lib/utils'

const moduleColors: Record<string, string> = {
  Auth:         'text-primary-400',
  Transports:   'text-cyan-400',
  Acteurs:      'text-success-400',
  Équipements:  'text-warning-400',
  Alertes:      'text-danger-400',
  Rapports:     'text-violet-400',
  Paramètres:   'text-slate-400',
}

export default function AuditLogs() {
  const [search, setSearch]         = useState('')
  const [moduleFilter, setModule]   = useState('all')
  const [resultFilter, setResult]   = useState('all')

  const filtered = mockAuditLogs.filter(l => {
    const q = search.toLowerCase()
    const matchSearch = !search || [l.action, l.user, l.target, l.ip, l.module].some(f => f.toLowerCase().includes(q))
    const matchModule = moduleFilter === 'all' || l.module === moduleFilter
    const matchResult = resultFilter === 'all' || l.result === resultFilter
    return matchSearch && matchModule && matchResult
  })

  const successCount = mockAuditLogs.filter(l => l.result === 'succès').length
  const failCount    = mockAuditLogs.filter(l => l.result === 'échec').length
  const warnCount    = mockAuditLogs.filter(l => l.result === 'avertissement').length

  const columns: Column<AuditLog>[] = [
    { key: 'timestamp', header: 'Horodatage', sortable: true, render: r => (
      <span className="font-mono text-xs text-slate-400">{formatDate(r.timestamp)}</span>
    )},
    { key: 'action', header: 'Action', sortable: true, render: r => (
      <span className="text-sm font-medium text-slate-200">{r.action}</span>
    )},
    { key: 'module', header: 'Module', sortable: true, render: r => (
      <Badge variant="neutral" className={moduleColors[r.module] ?? 'text-slate-300'}>{r.module}</Badge>
    )},
    { key: 'user', header: 'Utilisateur', sortable: true, render: r => (
      <div>
        <p className="text-xs text-slate-200">{r.user}</p>
        <p className="text-[10px] text-slate-500">{r.userRole}</p>
      </div>
    )},
    { key: 'target', header: 'Cible', render: r => (
      <span className="text-xs text-slate-400 truncate max-w-[160px] block">{r.target}</span>
    )},
    { key: 'ip', header: 'Adresse IP', render: r => (
      <span className="font-mono text-xs text-slate-500">{r.ip}</span>
    )},
    { key: 'result', header: 'Résultat', sortable: true, render: r => (
      <AuditResultBadge result={r.result} />
    )},
  ]

  const modules = [...new Set(mockAuditLogs.map(l => l.module))]

  return (
    <div className="space-y-5">
      <PageHeader title="Journaux d'audit" description="Traçabilité complète de toutes les actions système" icon={ScrollText}>
        <Button variant="outline" size="sm"><Download className="h-3.5 w-3.5" />Exporter</Button>
      </PageHeader>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
        {[
          { label: 'Total entrées',   value: mockAuditLogs.length, color: 'text-slate-100' },
          { label: 'Succès',          value: successCount,          color: 'text-success-400' },
          { label: 'Échecs',          value: failCount,             color: 'text-danger-400' },
          { label: 'Avertissements',  value: warnCount,             color: 'text-warning-400' },
        ].map(({ label, value, color }) => (
          <div key={label} className="rounded-xl border border-slate-700/60 bg-slate-800/50 p-3">
            <p className={`text-xl font-bold tabular-nums ${color}`}>{value}</p>
            <p className="text-xs text-slate-400 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[220px] max-w-sm">
          <Input
            placeholder="Action, utilisateur, cible, IP…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-8"
          />
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500 pointer-events-none" />
        </div>
        <Select value={moduleFilter} onChange={e => setModule(e.target.value)}>
          <option value="all">Tous les modules</option>
          {modules.map(m => <option key={m} value={m}>{m}</option>)}
        </Select>
        <Select value={resultFilter} onChange={e => setResult(e.target.value)}>
          <option value="all">Tous les résultats</option>
          <option value="succès">Succès</option>
          <option value="échec">Échec</option>
          <option value="avertissement">Avertissement</option>
        </Select>
        {(search || moduleFilter !== 'all' || resultFilter !== 'all') && (
          <Button variant="ghost" size="sm" onClick={() => { setSearch(''); setModule('all'); setResult('all') }}>
            <X className="h-3.5 w-3.5" />Réinitialiser
          </Button>
        )}
        <span className="ml-auto text-xs text-slate-500">{filtered.length} entrée(s)</span>
      </div>

      <DataTable columns={columns} data={filtered} />
    </div>
  )
}
