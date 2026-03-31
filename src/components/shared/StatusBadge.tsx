import { Badge } from '@/components/ui/badge'
import type { TransportStatus, AlertPriority } from '@/lib/mock-data'

const transportStatusMap: Record<TransportStatus, { label: string; variant: 'success' | 'warning' | 'danger' | 'neutral' | 'default' }> = {
  en_route:   { label: 'En route',   variant: 'default' },
  livré:      { label: 'Livré',      variant: 'success' },
  retardé:    { label: 'Retardé',    variant: 'warning' },
  annulé:     { label: 'Annulé',     variant: 'danger' },
  en_attente: { label: 'En attente', variant: 'neutral' },
}

const alertPriorityMap: Record<AlertPriority, { label: string; variant: 'danger' | 'warning' | 'default' | 'neutral' }> = {
  critique: { label: 'Critique', variant: 'danger' },
  élevée:   { label: 'Élevée',   variant: 'warning' },
  moyenne:  { label: 'Moyenne',  variant: 'default' },
  faible:   { label: 'Faible',   variant: 'neutral' },
}

export function TransportStatusBadge({ status }: { status: TransportStatus }) {
  const config = transportStatusMap[status]
  return <Badge variant={config.variant}>{config.label}</Badge>
}

export function AlertPriorityBadge({ priority }: { priority: AlertPriority }) {
  const config = alertPriorityMap[priority]
  return <Badge variant={config.variant}>{config.label}</Badge>
}

export function ActorStatusBadge({ status }: { status: 'actif' | 'inactif' | 'suspendu' }) {
  const map = {
    actif:    { label: 'Actif',    variant: 'success' as const },
    inactif:  { label: 'Inactif',  variant: 'neutral' as const },
    suspendu: { label: 'Suspendu', variant: 'danger'  as const },
  }
  const config = map[status]
  return <Badge variant={config.variant}>{config.label}</Badge>
}

export function EquipmentStatusBadge({ status }: { status: 'actif' | 'inactif' | 'en_panne' | 'en_transit' }) {
  const map = {
    actif:      { label: 'Actif',      variant: 'success'  as const },
    inactif:    { label: 'Inactif',    variant: 'neutral'  as const },
    en_panne:   { label: 'En panne',   variant: 'danger'   as const },
    en_transit: { label: 'En transit', variant: 'default'  as const },
  }
  const config = map[status]
  return <Badge variant={config.variant}>{config.label}</Badge>
}

export function AuditResultBadge({ result }: { result: 'succès' | 'échec' | 'avertissement' }) {
  const map = {
    succès:        { label: 'Succès',        variant: 'success'  as const },
    échec:         { label: 'Échec',         variant: 'danger'   as const },
    avertissement: { label: 'Avertissement', variant: 'warning'  as const },
  }
  const config = map[result]
  return <Badge variant={config.variant}>{config.label}</Badge>
}
