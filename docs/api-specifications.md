# Spécifications API - SMART MINE RDC

## Vue d'ensemble

API REST pour le système de traçabilité minière nationale de la RDC.

**Base URL**: `https://api.smartmine-rdc.cd/v1`

**Format**: JSON  
**Authentification**: JWT Bearer Token  
**Encoding**: UTF-8

---

## Authentification

### POST `/auth/login`
Connexion utilisateur avec matricule et mot de passe.

**Request:**
```json
{
  "matricule": "ADM-2024-001",
  "password": "SmartMine@2024"
}
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "matricule": "ADM-2024-001",
      "name": "Sophie Tshisekedi",
      "email": "s.tshisekedi@mines.gouv.cd",
      "role": "admin",
      "province": "Kinshasa"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 86400
  }
}
```

**Response 401:**
```json
{
  "success": false,
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "Matricule ou mot de passe incorrect"
  }
}
```

---

### POST `/auth/logout`
Déconnexion (invalidation du token).

**Headers:** `Authorization: Bearer {token}`

**Response 200:**
```json
{
  "success": true,
  "message": "Déconnexion réussie"
}
```

---

### GET `/auth/me`
Récupérer les informations de l'utilisateur connecté.

**Headers:** `Authorization: Bearer {token}`

**Response 200:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "matricule": "ADM-2024-001",
    "name": "Sophie Tshisekedi",
    "email": "s.tshisekedi@mines.gouv.cd",
    "role": "admin",
    "province": "Kinshasa",
    "status": "actif",
    "createdAt": "2022-11-05T00:00:00Z"
  }
}
```

---

### POST `/auth/refresh`
Renouveler le token JWT.

**Headers:** `Authorization: Bearer {token}`

**Response 200:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 86400
  }
}
```

---

## Transports

### GET `/transports`
Liste des transports avec filtres et pagination.

**Query params:**
- `page` (int, default: 1)
- `limit` (int, default: 20, max: 100)
- `status` (string: en_attente|en_route|livré|retardé|annulé)
- `mineral` (string: Cobalt|Coltan|Cuivre|Or|Cassitérite|Wolframite)
- `origin` (string)
- `destination` (string)
- `dateFrom` (ISO 8601)
- `dateTo` (ISO 8601)
- `search` (string: recherche sur reference, driver, vehicle)
- `sortBy` (string: departureDate|reference|status, default: departureDate)
- `sortOrder` (string: asc|desc, default: desc)

**Response 200:**
```json
{
  "success": true,
  "data": {
    "transports": [
      {
        "id": "uuid",
        "reference": "SM-2024-0891",
        "mineral": "Cobalt",
        "quantity": 12500,
        "unit": "kg",
        "weightGross": 14200,
        "origin": "Kolwezi",
        "destination": "Lubumbashi",
        "transporter": "GECAMINES Trans",
        "driver": {
          "id": "uuid",
          "name": "Jean-Baptiste Mwamba"
        },
        "vehiclePlate": "CD 4521 KV",
        "badgeGps": {
          "id": "uuid",
          "serial": "BGP-0781"
        },
        "status": "en_route",
        "departureDate": "2024-03-28T06:00:00Z",
        "estimatedArrival": "2024-03-28T18:00:00Z",
        "arrivalDate": null,
        "currentPosition": {
          "latitude": -10.716667,
          "longitude": 25.473333,
          "timestamp": "2024-03-28T14:30:00Z"
        },
        "progress": 65,
        "createdAt": "2024-03-28T05:45:00Z",
        "updatedAt": "2024-03-28T14:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 212,
      "totalPages": 11
    }
  }
}
```

---

### GET `/transports/:id`
Détails d'un transport spécifique.

**Response 200:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "reference": "SM-2024-0891",
    "mineral": "Cobalt",
    "quantity": 12500,
    "unit": "kg",
    "weightGross": 14200,
    "origin": "Kolwezi",
    "destination": "Lubumbashi",
    "transporter": "GECAMINES Trans",
    "driver": {
      "id": "uuid",
      "name": "Jean-Baptiste Mwamba",
      "phone": "+243 81 234 5678"
    },
    "vehiclePlate": "CD 4521 KV",
    "badgeGps": {
      "id": "uuid",
      "serial": "BGP-0781",
      "model": "SmartBadge v2 (Queclink)",
      "batteryLevel": 78
    },
    "status": "en_route",
    "departureDate": "2024-03-28T06:00:00Z",
    "estimatedArrival": "2024-03-28T18:00:00Z",
    "arrivalDate": null,
    "currentPosition": {
      "latitude": -10.716667,
      "longitude": 25.473333,
      "altitude": 1250,
      "speed": 65.5,
      "heading": 180,
      "timestamp": "2024-03-28T14:30:00Z"
    },
    "progress": 65,
    "alerts": [
      {
        "id": "uuid",
        "type": "Arrêt non planifié",
        "priority": "élevée",
        "title": "Arrêt prolongé non autorisé",
        "timestamp": "2024-03-28T12:45:00Z",
        "resolved": false
      }
    ],
    "createdBy": {
      "id": "uuid",
      "name": "Marie-Claire Kabongo"
    },
    "createdAt": "2024-03-28T05:45:00Z",
    "updatedAt": "2024-03-28T14:30:00Z"
  }
}
```

---

### POST `/transports`
Créer un nouveau transport.

**Request:**
```json
{
  "mineral": "Cobalt",
  "quantity": 12500,
  "unit": "kg",
  "weightGross": 14200,
  "origin": "Kolwezi",
  "destination": "Lubumbashi",
  "transporter": "GECAMINES Trans",
  "driverActorId": "uuid",
  "vehiclePlate": "CD 4521 KV",
  "badgeGpsId": "uuid",
  "departureDate": "2024-03-28T06:00:00Z",
  "estimatedArrival": "2024-03-28T18:00:00Z"
}
```

**Response 201:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "reference": "SM-2024-0898",
    "status": "en_attente",
    "createdAt": "2024-03-28T15:00:00Z"
  }
}
```

**Response 400:**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Données invalides",
    "details": [
      {
        "field": "badgeGpsId",
        "message": "Badge GPS déjà assigné à un autre transport"
      }
    ]
  }
}
```

---

### PATCH `/transports/:id`
Mettre à jour un transport.

**Request:**
```json
{
  "status": "livré",
  "arrivalDate": "2024-03-28T17:45:00Z"
}
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "status": "livré",
    "updatedAt": "2024-03-28T17:45:00Z"
  }
}
```

---

### DELETE `/transports/:id`
Annuler un transport (soft delete).

**Response 200:**
```json
{
  "success": true,
  "message": "Transport annulé avec succès"
}
```

---

### GET `/transports/:id/positions`
Historique des positions GPS d'un transport.

**Query params:**
- `from` (ISO 8601)
- `to` (ISO 8601)
- `limit` (int, default: 100)

**Response 200:**
```json
{
  "success": true,
  "data": {
    "positions": [
      {
        "latitude": -10.716667,
        "longitude": 25.473333,
        "altitude": 1250,
        "speed": 65.5,
        "heading": 180,
        "accuracy": 5.2,
        "timestamp": "2024-03-28T14:30:00Z"
      }
    ],
    "total": 156
  }
}
```

---

### GET `/transports/stats`
Statistiques globales des transports.

**Query params:**
- `period` (string: day|week|month|year, default: month)
- `groupBy` (string: mineral|status|province)

**Response 200:**
```json
{
  "success": true,
  "data": {
    "summary": {
      "total": 212,
      "enRoute": 45,
      "delivered": 158,
      "delayed": 6,
      "cancelled": 3,
      "totalWeight": 71500
    },
    "byMineral": [
      {
        "mineral": "Cobalt",
        "count": 72,
        "percentage": 34,
        "totalWeight": 24310
      }
    ],
    "trend": [
      {
        "date": "2024-03-01",
        "count": 67,
        "weight": 22100
      }
    ]
  }
}
```

---

## Alertes

### GET `/alerts`
Liste des alertes avec filtres.

**Query params:**
- `page` (int)
- `limit` (int)
- `priority` (string: critique|élevée|moyenne|faible)
- `type` (string)
- `resolved` (boolean)
- `transportId` (uuid)
- `dateFrom` (ISO 8601)
- `dateTo` (ISO 8601)

**Response 200:**
```json
{
  "success": true,
  "data": {
    "alerts": [
      {
        "id": "uuid",
        "type": "Déviation GPS",
        "priority": "critique",
        "title": "Déviation de route détectée",
        "description": "Le convoi SM-2024-0893 a dévié de 45km...",
        "transport": {
          "id": "uuid",
          "reference": "SM-2024-0893"
        },
        "location": "Kambove, Haut-Katanga",
        "position": {
          "latitude": -10.8,
          "longitude": 26.6
        },
        "resolved": false,
        "createdAt": "2024-03-28T14:23:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 47,
      "totalPages": 3
    }
  }
}
```

---

### GET `/alerts/:id`
Détails d'une alerte.

**Response 200:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "type": "Déviation GPS",
    "priority": "critique",
    "title": "Déviation de route détectée",
    "description": "Le convoi SM-2024-0893 a dévié de 45km de son itinéraire prévu près de Kambove.",
    "transport": {
      "id": "uuid",
      "reference": "SM-2024-0893",
      "driver": "Augustin Tshomba"
    },
    "location": "Kambove, Haut-Katanga",
    "position": {
      "latitude": -10.8,
      "longitude": 26.6
    },
    "resolved": false,
    "resolvedBy": null,
    "resolvedAt": null,
    "resolutionNotes": null,
    "createdAt": "2024-03-28T14:23:00Z",
    "updatedAt": "2024-03-28T14:23:00Z"
  }
}
```

---

### POST `/alerts/:id/resolve`
Résoudre une alerte.

**Request:**
```json
{
  "resolutionNotes": "Déviation justifiée par travaux routiers. Chauffeur contacté et itinéraire validé."
}
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "resolved": true,
    "resolvedBy": {
      "id": "uuid",
      "name": "Sophie Tshisekedi"
    },
    "resolvedAt": "2024-03-28T15:00:00Z"
  }
}
```

---

### POST `/alerts/:id/escalate`
Escalader une alerte (augmenter la priorité).

**Request:**
```json
{
  "newPriority": "critique",
  "reason": "Pas de réponse du chauffeur après 2h"
}
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "priority": "critique",
    "updatedAt": "2024-03-28T15:00:00Z"
  }
}
```

---

## Acteurs

### GET `/actors`
Liste des acteurs.

**Query params:**
- `page` (int)
- `limit` (int)
- `role` (string: agent|transporteur|destinataire|superviseur)
- `province` (string)
- `status` (string: actif|inactif|suspendu)
- `search` (string)

**Response 200:**
```json
{
  "success": true,
  "data": {
    "actors": [
      {
        "id": "uuid",
        "name": "Jean-Baptiste Mwamba",
        "role": "transporteur",
        "email": "jb.mwamba@gecamines.cd",
        "phone": "+243 81 234 5678",
        "province": "Haut-Katanga",
        "company": "GECAMINES Trans",
        "status": "actif",
        "transportsCount": 89,
        "avatarUrl": "https://...",
        "createdAt": "2023-01-15T00:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 156,
      "totalPages": 8
    }
  }
}
```

---

### GET `/actors/:id`
Détails d'un acteur.

**Response 200:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Jean-Baptiste Mwamba",
    "role": "transporteur",
    "email": "jb.mwamba@gecamines.cd",
    "phone": "+243 81 234 5678",
    "province": "Haut-Katanga",
    "company": "GECAMINES Trans",
    "status": "actif",
    "avatarUrl": "https://...",
    "statistics": {
      "transportsTotal": 89,
      "transportsDelivered": 84,
      "transportsDelayed": 3,
      "successRate": 94.4
    },
    "recentTransports": [
      {
        "id": "uuid",
        "reference": "SM-2024-0891",
        "status": "en_route",
        "departureDate": "2024-03-28T06:00:00Z"
      }
    ],
    "createdAt": "2023-01-15T00:00:00Z",
    "updatedAt": "2024-03-28T05:45:00Z"
  }
}
```

---

### POST `/actors`
Créer un nouvel acteur.

**Request:**
```json
{
  "name": "Emmanuel Ndungu",
  "role": "transporteur",
  "email": "e.ndungu@goldsecure.cd",
  "phone": "+243 84 567 8901",
  "province": "Nord-Kivu",
  "company": "GoldSecure DRC"
}
```

**Response 201:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Emmanuel Ndungu",
    "status": "actif",
    "createdAt": "2024-03-28T15:00:00Z"
  }
}
```

---

### PATCH `/actors/:id`
Mettre à jour un acteur.

**Request:**
```json
{
  "status": "suspendu",
  "phone": "+243 84 567 8902"
}
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "status": "suspendu",
    "updatedAt": "2024-03-28T15:00:00Z"
  }
}
```

---

### DELETE `/actors/:id`
Supprimer un acteur (soft delete).

**Response 200:**
```json
{
  "success": true,
  "message": "Acteur supprimé avec succès"
}
```

---

## Équipements (Badges GPS)

### GET `/equipment`
Liste des équipements.

**Query params:**
- `page` (int)
- `limit` (int)
- `status` (string: actif|inactif|en_panne|en_transit)
- `province` (string)
- `assigned` (boolean: true pour affectés, false pour non affectés)
- `batteryLow` (boolean: true pour batterie < 20%)
- `search` (string)

**Response 200:**
```json
{
  "success": true,
  "data": {
    "equipment": [
      {
        "id": "uuid",
        "serial": "BGP-0781",
        "model": "SmartBadge v2 (Queclink)",
        "status": "actif",
        "batteryLevel": 78,
        "province": "Haut-Katanga",
        "assignedActor": {
          "id": "uuid",
          "name": "Jean-Baptiste Mwamba"
        },
        "assignedTransport": {
          "id": "uuid",
          "reference": "SM-2024-0891"
        },
        "currentPosition": {
          "latitude": -10.716667,
          "longitude": 25.473333,
          "timestamp": "2024-03-28T14:30:00Z"
        },
        "lastSeen": "2024-03-28T14:30:00Z",
        "createdAt": "2023-01-10T00:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 245,
      "totalPages": 13
    }
  }
}
```

---

### GET `/equipment/:id`
Détails d'un équipement.

**Response 200:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "serial": "BGP-0781",
    "model": "SmartBadge v2 (Queclink)",
    "status": "actif",
    "batteryLevel": 78,
    "province": "Haut-Katanga",
    "assignedActor": {
      "id": "uuid",
      "name": "Jean-Baptiste Mwamba",
      "phone": "+243 81 234 5678"
    },
    "assignedTransport": {
      "id": "uuid",
      "reference": "SM-2024-0891",
      "status": "en_route"
    },
    "currentPosition": {
      "latitude": -10.716667,
      "longitude": 25.473333,
      "altitude": 1250,
      "timestamp": "2024-03-28T14:30:00Z"
    },
    "lastSeen": "2024-03-28T14:30:00Z",
    "statistics": {
      "totalTransports": 45,
      "totalDistance": 12450,
      "averageBattery": 82
    },
    "createdAt": "2023-01-10T00:00:00Z",
    "updatedAt": "2024-03-28T14:30:00Z"
  }
}
```

---

### POST `/equipment`
Enregistrer un nouveau badge GPS.

**Request:**
```json
{
  "serial": "BGP-0999",
  "model": "SmartBadge v3 (Teltonika)",
  "province": "Haut-Katanga",
  "assignedActorId": "uuid"
}
```

**Response 201:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "serial": "BGP-0999",
    "status": "actif",
    "createdAt": "2024-03-28T15:00:00Z"
  }
}
```

---

### PATCH `/equipment/:id`
Mettre à jour un équipement.

**Request:**
```json
{
  "status": "en_panne",
  "assignedActorId": null,
  "assignedTransportId": null
}
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "status": "en_panne",
    "updatedAt": "2024-03-28T15:00:00Z"
  }
}
```

---

### POST `/equipment/:id/positions`
Enregistrer une position GPS (endpoint pour les badges).

**Request:**
```json
{
  "latitude": -10.716667,
  "longitude": 25.473333,
  "altitude": 1250,
  "speed": 65.5,
  "heading": 180,
  "accuracy": 5.2,
  "batteryLevel": 78,
  "timestamp": "2024-03-28T14:30:00Z"
}
```

**Response 201:**
```json
{
  "success": true,
  "message": "Position enregistrée"
}
```

---

## Logs d'audit

### GET `/audit-logs`
Historique des actions système.

**Query params:**
- `page` (int)
- `limit` (int)
- `module` (string: Auth|Transports|Acteurs|Équipements|Alertes|Rapports|Paramètres)
- `action` (string)
- `userId` (uuid)
- `result` (string: succès|échec|avertissement)
- `dateFrom` (ISO 8601)
- `dateTo` (ISO 8601)

**Response 200:**
```json
{
  "success": true,
  "data": {
    "logs": [
      {
        "id": "uuid",
        "action": "Créer transport",
        "module": "Transports",
        "user": {
          "id": "uuid",
          "name": "Marie-Claire Kabongo",
          "role": "agent"
        },
        "target": {
          "type": "transport",
          "id": "uuid",
          "description": "SM-2024-0897"
        },
        "ipAddress": "41.243.12.78",
        "result": "succès",
        "timestamp": "2024-03-28T09:45:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 50,
      "total": 2847,
      "totalPages": 57
    }
  }
}
```

---

## Notifications

### GET `/notifications`
Notifications de l'utilisateur connecté.

**Query params:**
- `page` (int)
- `limit` (int)
- `read` (boolean)
- `priority` (string)

**Response 200:**
```json
{
  "success": true,
  "data": {
    "notifications": [
      {
        "id": "uuid",
        "type": "alert",
        "title": "Nouvelle alerte critique",
        "message": "Déviation de route détectée sur SM-2024-0893",
        "link": "/alerts/uuid",
        "priority": "critique",
        "read": false,
        "createdAt": "2024-03-28T14:23:00Z"
      }
    ],
    "unreadCount": 12,
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 156,
      "totalPages": 8
    }
  }
}
```

---

### PATCH `/notifications/:id/read`
Marquer une notification comme lue.

**Response 200:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "read": true,
    "readAt": "2024-03-28T15:00:00Z"
  }
}
```

---

### POST `/notifications/read-all`
Marquer toutes les notifications comme lues.

**Response 200:**
```json
{
  "success": true,
  "message": "Toutes les notifications ont été marquées comme lues"
}
```

---

## Rapports & Analytics

### GET `/reports/dashboard`
Données du tableau de bord.

**Response 200:**
```json
{
  "success": true,
  "data": {
    "kpis": {
      "activeTransports": 45,
      "totalWeight": 71500,
      "unresolvedAlerts": 12,
      "activeEquipment": 234
    },
    "monthlyTrend": [
      {
        "month": "Mar",
        "transports": 212,
        "tonnes": 71500
      }
    ],
    "mineralBreakdown": [
      {
        "mineral": "Cobalt",
        "percentage": 34,
        "value": 72
      }
    ],
    "alertTrend": [
      {
        "day": "Lun",
        "critique": 2,
        "élevée": 5,
        "moyenne": 8
      }
    ],
    "topTransporters": [
      {
        "name": "GECAMINES Trans",
        "transports": 89,
        "successRate": 94.4
      }
    ]
  }
}
```

---

### GET `/reports/transports`
Rapport détaillé des transports.

**Query params:**
- `dateFrom` (ISO 8601, required)
- `dateTo` (ISO 8601, required)
- `mineral` (string)
- `province` (string)
- `format` (string: json|csv|pdf, default: json)

**Response 200:**
```json
{
  "success": true,
  "data": {
    "summary": {
      "total": 212,
      "totalWeight": 71500,
      "byStatus": {
        "livré": 158,
        "en_route": 45,
        "retardé": 6,
        "annulé": 3
      }
    },
    "byMineral": [
      {
        "mineral": "Cobalt",
        "count": 72,
        "weight": 24310,
        "percentage": 34
      }
    ],
    "byProvince": [
      {
        "province": "Haut-Katanga",
        "count": 89,
        "weight": 28400
      }
    ],
    "period": {
      "from": "2024-03-01T00:00:00Z",
      "to": "2024-03-31T23:59:59Z"
    }
  }
}
```

---

### GET `/reports/alerts`
Rapport des alertes.

**Query params:**
- `dateFrom` (ISO 8601, required)
- `dateTo` (ISO 8601, required)
- `priority` (string)
- `type` (string)

**Response 200:**
```json
{
  "success": true,
  "data": {
    "summary": {
      "total": 156,
      "resolved": 89,
      "unresolved": 67,
      "averageResolutionTime": 4.5
    },
    "byPriority": [
      {
        "priority": "critique",
        "count": 23,
        "percentage": 14.7
      }
    ],
    "byType": [
      {
        "type": "Déviation GPS",
        "count": 45,
        "percentage": 28.8
      }
    ]
  }
}
```

---

### POST `/reports/export`
Exporter un rapport (génération asynchrone).

**Request:**
```json
{
  "type": "transports",
  "format": "pdf",
  "dateFrom": "2024-03-01T00:00:00Z",
  "dateTo": "2024-03-31T23:59:59Z",
  "filters": {
    "mineral": "Cobalt",
    "province": "Haut-Katanga"
  }
}
```

**Response 202:**
```json
{
  "success": true,
  "data": {
    "jobId": "uuid",
    "status": "processing",
    "estimatedTime": 30
  }
}
```

---

### GET `/reports/export/:jobId`
Vérifier le statut d'un export.

**Response 200:**
```json
{
  "success": true,
  "data": {
    "jobId": "uuid",
    "status": "completed",
    "downloadUrl": "https://api.smartmine-rdc.cd/downloads/report-uuid.pdf",
    "expiresAt": "2024-03-29T15:00:00Z"
  }
}
```

---

## Paramètres

### GET `/settings`
Récupérer les paramètres de l'utilisateur.

**Query params:**
- `category` (string: general|notifications|security|system|appearance)

**Response 200:**
```json
{
  "success": true,
  "data": {
    "settings": [
      {
        "category": "notifications",
        "key": "emailAlerts",
        "value": true,
        "updatedAt": "2024-03-20T10:00:00Z"
      },
      {
        "category": "appearance",
        "key": "theme",
        "value": "dark",
        "updatedAt": "2024-03-15T08:00:00Z"
      }
    ]
  }
}
```

---

### PUT `/settings`
Mettre à jour les paramètres.

**Request:**
```json
{
  "settings": [
    {
      "category": "notifications",
      "key": "emailAlerts",
      "value": false
    },
    {
      "category": "notifications",
      "key": "pushAlerts",
      "value": true
    }
  ]
}
```

**Response 200:**
```json
{
  "success": true,
  "message": "Paramètres mis à jour avec succès"
}
```

---

## WebSocket - Temps réel

### Connexion WebSocket
`wss://api.smartmine-rdc.cd/v1/ws`

**Authentification:**
Envoyer le token JWT après connexion:
```json
{
  "type": "auth",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### Événements reçus

**Nouvelle position GPS:**
```json
{
  "type": "gps_position",
  "data": {
    "equipmentId": "uuid",
    "transportId": "uuid",
    "latitude": -10.716667,
    "longitude": 25.473333,
    "speed": 65.5,
    "timestamp": "2024-03-28T14:30:00Z"
  }
}
```

**Nouvelle alerte:**
```json
{
  "type": "alert_created",
  "data": {
    "id": "uuid",
    "priority": "critique",
    "title": "Déviation de route détectée",
    "transportId": "uuid",
    "timestamp": "2024-03-28T14:23:00Z"
  }
}
```

**Changement de statut transport:**
```json
{
  "type": "transport_status_changed",
  "data": {
    "transportId": "uuid",
    "reference": "SM-2024-0891",
    "oldStatus": "en_route",
    "newStatus": "livré",
    "timestamp": "2024-03-28T17:45:00Z"
  }
}
```

**Nouvelle notification:**
```json
{
  "type": "notification",
  "data": {
    "id": "uuid",
    "title": "Nouvelle alerte critique",
    "message": "Déviation de route détectée",
    "priority": "critique",
    "timestamp": "2024-03-28T14:23:00Z"
  }
}
```

---

### Événements envoyés

**S'abonner aux mises à jour d'un transport:**
```json
{
  "type": "subscribe",
  "channel": "transport",
  "id": "uuid"
}
```

**Se désabonner:**
```json
{
  "type": "unsubscribe",
  "channel": "transport",
  "id": "uuid"
}
```

---

## Codes d'erreur

| Code | Message | Description |
|------|---------|-------------|
| `INVALID_CREDENTIALS` | Identifiants invalides | Matricule ou mot de passe incorrect |
| `TOKEN_EXPIRED` | Token expiré | Le token JWT a expiré |
| `TOKEN_INVALID` | Token invalide | Le token JWT est malformé ou invalide |
| `UNAUTHORIZED` | Non autorisé | Permissions insuffisantes |
| `NOT_FOUND` | Ressource introuvable | L'entité demandée n'existe pas |
| `VALIDATION_ERROR` | Erreur de validation | Données invalides |
| `DUPLICATE_ENTRY` | Entrée dupliquée | Une ressource avec ces données existe déjà |
| `RESOURCE_LOCKED` | Ressource verrouillée | La ressource est utilisée ailleurs |
| `RATE_LIMIT_EXCEEDED` | Limite de requêtes dépassée | Trop de requêtes |
| `SERVER_ERROR` | Erreur serveur | Erreur interne du serveur |

---

## Pagination

Toutes les listes utilisent la pagination standard:

**Query params:**
- `page` (int, default: 1)
- `limit` (int, default: 20, max: 100)

**Response structure:**
```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 212,
    "totalPages": 11
  }
}
```

---

## Rate Limiting

- **Authentification**: 5 requêtes/minute
- **Lecture (GET)**: 100 requêtes/minute
- **Écriture (POST/PATCH/DELETE)**: 30 requêtes/minute
- **WebSocket**: 1000 messages/minute

**Headers de réponse:**
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1711634400
```

---

## Versioning

L'API utilise le versioning dans l'URL: `/v1/`

Les versions majeures cassent la compatibilité. Les versions mineures ajoutent des fonctionnalités rétrocompatibles.

---

## CORS

Origines autorisées:
- `https://app.smartmine-rdc.cd`
- `https://admin.smartmine-rdc.cd`

---

## Notes d'implémentation

1. **Authentification JWT**
   - Algorithme: HS256
   - Expiration: 24h
   - Refresh token: 30 jours

2. **Timestamps**
   - Format: ISO 8601 (UTC)
   - Exemple: `2024-03-28T14:30:00Z`

3. **UUIDs**
   - Version 4 (random)
   - Format: `550e8400-e29b-41d4-a716-446655440000`

4. **Validation**
   - Utiliser JSON Schema pour validation des requêtes
   - Retourner des messages d'erreur détaillés

5. **Sécurité**
   - HTTPS obligatoire
   - Rate limiting par IP et par utilisateur
   - Validation stricte des entrées
   - Sanitization des sorties
   - CORS configuré strictement

6. **Performance**
   - Cache Redis pour données fréquentes (stats, dashboard)
   - Compression gzip/brotli
   - Pagination obligatoire sur toutes les listes
   - Index database optimisés

7. **Monitoring**
   - Logs structurés (JSON)
   - Métriques Prometheus
   - Tracing distribué (OpenTelemetry)
