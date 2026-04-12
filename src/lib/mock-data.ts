export type TransportStatus =
  | "en_route"
  | "livré"
  | "retardé"
  | "annulé"
  | "en_attente";
export type AlertPriority = "critique" | "élevée" | "moyenne" | "faible";
export type ActorRole =
  | "agent"
  | "transporteur"
  | "destinataire"
  | "superviseur";
export type MineralType =
  | "Cobalt"
  | "Coltan"
  | "Cuivre"
  | "Or"
  | "Cassitérite"
  | "Wolframite";

export interface Transport {
  id: string;
  reference: string;
  mineral: MineralType;
  quantity: number;
  unit: string;
  origin: string;
  destination: string;
  transporter: string;
  driver: string;
  vehicle: string;
  status: TransportStatus;
  departureDate: string;
  arrivalDate: string | null;
  estimatedArrival: string;
  currentLat: number;
  currentLng: number;
  progress: number;
  weight: number;
  badgeGps: string;
}

export interface Alert {
  id: string;
  type: string;
  priority: AlertPriority;
  title: string;
  description: string;
  transport?: string;
  actor?: string;
  location: string;
  timestamp: string;
  resolved: boolean;
}

export interface Actor {
  id: string;
  name: string;
  role: ActorRole;
  email: string;
  phone: string;
  province: string;
  company?: string;
  status: "actif" | "inactif" | "suspendu";
  createdAt: string;
  transportsCount: number;
  avatar?: string;
}

export interface Equipment {
  id: string;
  serial: string;
  model: string;
  status: "actif" | "inactif" | "en_panne" | "en_transit";
  assignedTo?: string;
  assignedTransport?: string;
  lastSeen: string;
  battery: number;
  province: string;
  lat?: number;
  lng?: number;
}

export interface AuditLog {
  id: string;
  action: string;
  module: string;
  user: string;
  userRole: string;
  target: string;
  timestamp: string;
  ip: string;
  result: "succès" | "échec" | "avertissement";
}

// ── Transports ──────────────────────────────────────────
export const mockTransports: Transport[] = [
  {
    id: "T001",
    reference: "SM-2024-0891",
    mineral: "Cobalt",
    quantity: 12500,
    unit: "kg",
    origin: "Kolwezi",
    destination: "Lubumbashi",
    transporter: "GECAMINES Trans",
    driver: "Jean-Baptiste Mwamba",
    vehicle: "CD 4521 KV",
    status: "en_route",
    departureDate: "2024-03-28T06:00:00",
    arrivalDate: null,
    estimatedArrival: "2024-03-28T18:00:00",
    currentLat: -10.716667,
    currentLng: 25.473333,
    progress: 65,
    weight: 14200,
    badgeGps: "BGP-0781",
  },
  {
    id: "T002",
    reference: "SM-2024-0892",
    mineral: "Coltan",
    quantity: 3200,
    unit: "kg",
    origin: "Walikale",
    destination: "Goma",
    transporter: "MinTrans SARL",
    driver: "Pierre Kabila",
    vehicle: "CD 1122 NK",
    status: "livré",
    departureDate: "2024-03-27T08:00:00",
    arrivalDate: "2024-03-27T20:30:00",
    estimatedArrival: "2024-03-27T19:00:00",
    currentLat: -1.679444,
    currentLng: 29.220833,
    progress: 100,
    weight: 3600,
    badgeGps: "BGP-0320",
  },
  {
    id: "T003",
    reference: "SM-2024-0893",
    mineral: "Cuivre",
    quantity: 28000,
    unit: "kg",
    origin: "Likasi",
    destination: "Beira (via Zambie)",
    transporter: "CopperRoute DRC",
    driver: "Augustin Tshomba",
    vehicle: "CD 7788 KT",
    status: "retardé",
    departureDate: "2024-03-26T07:00:00",
    arrivalDate: null,
    estimatedArrival: "2024-03-29T12:00:00",
    currentLat: -11.009722,
    currentLng: 26.733333,
    progress: 40,
    weight: 30500,
    badgeGps: "BGP-0512",
  },
  {
    id: "T004",
    reference: "SM-2024-0894",
    mineral: "Or",
    quantity: 45,
    unit: "kg",
    origin: "Butembo",
    destination: "Kinshasa",
    transporter: "GoldSecure DRC",
    driver: "Emmanuel Ndungu",
    vehicle: "CD 2233 NB",
    status: "en_route",
    departureDate: "2024-03-28T05:00:00",
    arrivalDate: null,
    estimatedArrival: "2024-03-30T10:00:00",
    currentLat: 0.131667,
    currentLng: 29.259444,
    progress: 25,
    weight: 87,
    badgeGps: "BGP-0890",
  },
  {
    id: "T005",
    reference: "SM-2024-0895",
    mineral: "Cassitérite",
    quantity: 5600,
    unit: "kg",
    origin: "Manono",
    destination: "Kalemie",
    transporter: "TinTrans Congo",
    driver: "Mathieu Banza",
    vehicle: "CD 3344 TN",
    status: "en_attente",
    departureDate: "2024-03-29T08:00:00",
    arrivalDate: null,
    estimatedArrival: "2024-03-29T16:00:00",
    currentLat: -7.3,
    currentLng: 27.416667,
    progress: 0,
    weight: 6100,
    badgeGps: "BGP-0145",
  },
  {
    id: "T006",
    reference: "SM-2024-0896",
    mineral: "Wolframite",
    quantity: 1800,
    unit: "kg",
    origin: "Maniema",
    destination: "Kindu",
    transporter: "WolfMin DRC",
    driver: "Raphaël Mutombo",
    vehicle: "CD 5566 MN",
    status: "annulé",
    departureDate: "2024-03-25T09:00:00",
    arrivalDate: null,
    estimatedArrival: "2024-03-25T17:00:00",
    currentLat: -3.017,
    currentLng: 26.0,
    progress: 0,
    weight: 2000,
    badgeGps: "BGP-0234",
  },
  {
    id: "T007",
    reference: "SM-2024-0897",
    mineral: "Cobalt",
    quantity: 9800,
    unit: "kg",
    origin: "Kolwezi",
    destination: "Sakania",
    transporter: "GECAMINES Trans",
    driver: "Cédric Ilunga",
    vehicle: "CD 8891 KV",
    status: "en_route",
    departureDate: "2024-03-28T10:00:00",
    arrivalDate: null,
    estimatedArrival: "2024-03-28T22:00:00",
    currentLat: -11.5,
    currentLng: 25.9,
    progress: 50,
    weight: 10800,
    badgeGps: "BGP-0671",
  },
];

// ── Alerts ──────────────────────────────────────────────
export const mockAlerts: Alert[] = [
  {
    id: "A001",
    type: "Déviation GPS",
    priority: "critique",
    title: "Déviation de route détectée",
    description:
      "Le convoi SM-2024-0893 a dévié de 45km de son itinéraire prévu près de Kambove.",
    transport: "SM-2024-0893",
    location: "Kambove, Haut-Katanga",
    timestamp: "2024-03-28T14:23:00",
    resolved: false,
  },
  {
    id: "A002",
    type: "Arrêt non planifié",
    priority: "élevée",
    title: "Arrêt prolongé non autorisé",
    description:
      "Le véhicule CD 4521 KV est immobilisé depuis 2h30 en dehors d'une zone autorisée.",
    transport: "SM-2024-0891",
    location: "Route N1, Katanga",
    timestamp: "2024-03-28T12:45:00",
    resolved: false,
  },
  {
    id: "A003",
    type: "Fraude potentielle",
    priority: "critique",
    title: "Anomalie de poids détectée",
    description:
      "Écart de 2,3 tonnes entre le poids déclaré et le poids mesuré au poste de Likasi.",
    transport: "SM-2024-0892",
    location: "Poste de contrôle Likasi",
    timestamp: "2024-03-27T09:15:00",
    resolved: true,
  },
  {
    id: "A004",
    type: "GPS hors ligne",
    priority: "moyenne",
    title: "Signal GPS perdu",
    description:
      "Le dispositif GPS-0512 n'envoie plus de signal depuis 45 minutes.",
    transport: "SM-2024-0893",
    location: "Dernière position: Lubudi",
    timestamp: "2024-03-28T11:30:00",
    resolved: false,
  },
  {
    id: "A005",
    type: "Badge invalide",
    priority: "élevée",
    title: "Tentative d'utilisation de badge expiré",
    description: "Badge BDG-0199 (expiré) utilisé au checkpoint de Kipushi.",
    actor: "Inconnu",
    location: "Checkpoint Kipushi",
    timestamp: "2024-03-28T10:05:00",
    resolved: false,
  },
  {
    id: "A006",
    type: "Température",
    priority: "faible",
    title: "Alerte température véhicule",
    description: "Température moteur anormale signalée sur CD 7788 KT.",
    transport: "SM-2024-0893",
    location: "Route N39",
    timestamp: "2024-03-28T08:20:00",
    resolved: true,
  },
  {
    id: "A007",
    type: "Accès non autorisé",
    priority: "élevée",
    title: "Tentative d'accès système",
    description:
      "5 tentatives d'authentification échouées depuis l'IP 41.243.56.88.",
    location: "Système SMART MINE RDC",
    timestamp: "2024-03-28T07:55:00",
    resolved: false,
  },
];

// ── Actors ──────────────────────────────────────────────
export const mockActors: Actor[] = [
  {
    id: "AC001",
    name: "Jean-Baptiste Mwamba",
    role: "transporteur",
    email: "jb.mwamba@gecamines.cd",
    phone: "+243 81 234 5678",
    province: "Haut-Katanga",
    company: "GECAMINES Trans",
    status: "actif",
    createdAt: "2023-01-15",
    transportsCount: 89,
  },
  {
    id: "AC002",
    name: "Marie-Claire Kabongo",
    role: "agent",
    email: "m.kabongo@mines.gouv.cd",
    phone: "+243 89 876 5432",
    province: "Haut-Katanga",
    status: "actif",
    createdAt: "2023-03-20",
    transportsCount: 0,
  },
  {
    id: "AC003",
    name: "Pierre Kabila",
    role: "transporteur",
    email: "p.kabila@mintrans.cd",
    phone: "+243 82 345 6789",
    province: "Nord-Kivu",
    company: "MinTrans SARL",
    status: "actif",
    createdAt: "2023-06-10",
    transportsCount: 45,
  },
  {
    id: "AC004",
    name: "Société CAMECO RDC",
    role: "destinataire",
    email: "ops@cameco-rdc.cd",
    phone: "+243 90 111 2222",
    province: "Kinshasa",
    company: "CAMECO RDC",
    status: "actif",
    createdAt: "2022-09-01",
    transportsCount: 234,
  },
  {
    id: "AC005",
    name: "Augustin Tshomba",
    role: "transporteur",
    email: "a.tshomba@copperroute.cd",
    phone: "+243 83 456 7890",
    province: "Lualaba",
    company: "CopperRoute DRC",
    status: "suspendu",
    createdAt: "2023-02-28",
    transportsCount: 62,
  },
  {
    id: "AC006",
    name: "Sophie Tshisekedi",
    role: "superviseur",
    email: "s.tshisekedi@mines.gouv.cd",
    phone: "+243 97 654 3210",
    province: "Kinshasa",
    status: "actif",
    createdAt: "2022-11-05",
    transportsCount: 0,
  },
  {
    id: "AC007",
    name: "Emmanuel Ndungu",
    role: "transporteur",
    email: "e.ndungu@goldsecure.cd",
    phone: "+243 84 567 8901",
    province: "Nord-Kivu",
    company: "GoldSecure DRC",
    status: "actif",
    createdAt: "2023-08-14",
    transportsCount: 28,
  },
];

// ── Equipment (Badge GPS — QR code + GPS plastifié, livré en un seul support) ──
export const mockEquipment: Equipment[] = [
  {
    id: "EQ001",
    serial: "BGP-0781",
    model: "SmartBadge v2 (Queclink)",
    status: "actif",
    assignedTo: "Jean-Baptiste Mwamba",
    assignedTransport: "SM-2024-0891",
    lastSeen: "2024-03-28T14:30:00",
    battery: 78,
    province: "Haut-Katanga",
    lat: -10.716667,
    lng: 25.473333,
  },
  {
    id: "EQ002",
    serial: "BGP-0320",
    model: "SmartBadge v2 (Teltonika)",
    status: "actif",
    assignedTo: "Pierre Kabila",
    lastSeen: "2024-03-27T20:30:00",
    battery: 92,
    province: "Nord-Kivu",
    lat: -1.679444,
    lng: 29.220833,
  },
  {
    id: "EQ003",
    serial: "BGP-0512",
    model: "SmartBadge v2 (Queclink)",
    status: "en_panne",
    assignedTo: "Augustin Tshomba",
    assignedTransport: "SM-2024-0893",
    lastSeen: "2024-03-28T11:30:00",
    battery: 12,
    province: "Lualaba",
    lat: -11.009722,
    lng: 26.733333,
  },
  {
    id: "EQ004",
    serial: "BGP-0890",
    model: "SmartBadge v3 (Teltonika)",
    status: "actif",
    assignedTo: "Emmanuel Ndungu",
    assignedTransport: "SM-2024-0894",
    lastSeen: "2024-03-28T14:15:00",
    battery: 65,
    province: "Nord-Kivu",
    lat: 0.131667,
    lng: 29.259444,
  },
  {
    id: "EQ005",
    serial: "BGP-0145",
    model: "SmartBadge v2 (Queclink)",
    status: "inactif",
    lastSeen: "2024-03-20T10:00:00",
    battery: 45,
    province: "Tanganyika",
    lat: -7.3,
    lng: 27.416667,
  },
  {
    id: "EQ006",
    serial: "BGP-0671",
    model: "SmartBadge v3 (Teltonika)",
    status: "actif",
    assignedTo: "Cédric Ilunga",
    assignedTransport: "SM-2024-0897",
    lastSeen: "2024-03-28T14:00:00",
    battery: 88,
    province: "Haut-Katanga",
    lat: -11.5,
    lng: 25.9,
  },
  {
    id: "EQ007",
    serial: "BGP-0234",
    model: "SmartBadge v2 (Queclink)",
    status: "en_transit",
    assignedTo: "Mathieu Banza",
    lastSeen: "2024-03-28T08:00:00",
    battery: 55,
    province: "Tanganyika",
    lat: -7.0,
    lng: 27.1,
  },
  {
    id: "EQ008",
    serial: "BGP-0558",
    model: "SmartBadge v3 (Teltonika)",
    status: "actif",
    lastSeen: "2024-03-28T09:00:00",
    battery: 100,
    province: "Kinshasa",
    lat: -4.322447,
    lng: 15.322445,
  },
  {
    id: "EQ009",
    serial: "BGP-0099",
    model: "SmartBadge v2 (Queclink)",
    status: "inactif",
    lastSeen: "2024-03-15T08:00:00",
    battery: 20,
    province: "Maniema",
    lat: -3.017,
    lng: 26.0,
  },
  {
    id: "EQ010",
    serial: "BGP-0410",
    model: "SmartBadge v3 (Teltonika)",
    status: "actif",
    lastSeen: "2024-03-28T13:00:00",
    battery: 74,
    province: "Sud-Kivu",
    lat: -2.5,
    lng: 28.8,
  },
];

// ── Audit Logs ───────────────────────────────────────────
export const mockAuditLogs: AuditLog[] = [
  {
    id: "L001",
    action: "Connexion",
    module: "Auth",
    user: "Sophie Tshisekedi",
    userRole: "superviseur",
    target: "Session utilisateur",
    timestamp: "2024-03-28T14:00:00",
    ip: "41.243.12.44",
    result: "succès",
  },
  {
    id: "L002",
    action: "Modifier statut transport",
    module: "Transports",
    user: "Marie-Claire Kabongo",
    userRole: "agent",
    target: "SM-2024-0893",
    timestamp: "2024-03-28T13:45:00",
    ip: "41.243.12.78",
    result: "succès",
  },
  {
    id: "L003",
    action: "Connexion",
    module: "Auth",
    user: "Inconnu",
    userRole: "-",
    target: "Session utilisateur",
    timestamp: "2024-03-28T13:30:00",
    ip: "41.243.56.88",
    result: "échec",
  },
  {
    id: "L004",
    action: "Exporter rapport",
    module: "Rapports",
    user: "Sophie Tshisekedi",
    userRole: "superviseur",
    target: "Rapport mensuel Mars 2024",
    timestamp: "2024-03-28T13:15:00",
    ip: "41.243.12.44",
    result: "succès",
  },
  {
    id: "L005",
    action: "Créer acteur",
    module: "Acteurs",
    user: "Marie-Claire Kabongo",
    userRole: "agent",
    target: "Emmanuel Ndungu",
    timestamp: "2024-03-28T12:00:00",
    ip: "41.243.12.78",
    result: "succès",
  },
  {
    id: "L006",
    action: "Suspendre acteur",
    module: "Acteurs",
    user: "Sophie Tshisekedi",
    userRole: "superviseur",
    target: "Augustin Tshomba",
    timestamp: "2024-03-28T11:30:00",
    ip: "41.243.12.44",
    result: "succès",
  },
  {
    id: "L007",
    action: "Affecter GPS",
    module: "Équipements",
    user: "Marie-Claire Kabongo",
    userRole: "agent",
    target: "GPS-0781 → SM-2024-0891",
    timestamp: "2024-03-28T11:00:00",
    ip: "41.243.12.78",
    result: "succès",
  },
  {
    id: "L008",
    action: "Résoudre alerte",
    module: "Alertes",
    user: "Sophie Tshisekedi",
    userRole: "superviseur",
    target: "A003 - Anomalie de poids",
    timestamp: "2024-03-28T10:45:00",
    ip: "41.243.12.44",
    result: "succès",
  },
  {
    id: "L009",
    action: "Modifier configuration",
    module: "Paramètres",
    user: "Sophie Tshisekedi",
    userRole: "superviseur",
    target: "Seuil alerte poids",
    timestamp: "2024-03-28T10:00:00",
    ip: "41.243.12.44",
    result: "avertissement",
  },
  {
    id: "L010",
    action: "Créer transport",
    module: "Transports",
    user: "Marie-Claire Kabongo",
    userRole: "agent",
    target: "SM-2024-0897",
    timestamp: "2024-03-28T09:45:00",
    ip: "41.243.12.78",
    result: "succès",
  },
];

// ── Chart Data ───────────────────────────────────────────
export const monthlyTransportData = [
  { month: "Oct", transports: 142, tonnes: 48200 },
  { month: "Nov", transports: 158, tonnes: 52100 },
  { month: "Déc", transports: 134, tonnes: 41800 },
  { month: "Jan", transports: 167, tonnes: 58400 },
  { month: "Fév", transports: 189, tonnes: 63200 },
  { month: "Mar", transports: 212, tonnes: 71500 },
];

export const mineralBreakdown = [
  { name: "Cobalt", value: 34, fill: "#6366f1" },
  { name: "Cuivre", value: 28, fill: "#22c55e" },
  { name: "Coltan", value: 18, fill: "#f97316" },
  { name: "Or", value: 8, fill: "#eab308" },
  { name: "Cassitérite", value: 7, fill: "#06b6d4" },
  { name: "Autres", value: 5, fill: "#64748b" },
];

export const alertTrendData = [
  { day: "Lun", critique: 2, élevée: 5, moyenne: 8 },
  { day: "Mar", critique: 1, élevée: 3, moyenne: 6 },
  { day: "Mer", critique: 4, élevée: 7, moyenne: 9 },
  { day: "Jeu", critique: 2, élevée: 4, moyenne: 5 },
  { day: "Ven", critique: 3, élevée: 6, moyenne: 10 },
  { day: "Sam", critique: 1, élevée: 2, moyenne: 4 },
  { day: "Dim", critique: 2, élevée: 3, moyenne: 7 },
];

export const provinceData = [
  { province: "Haut-Katanga", transports: 89, tonnes: 28400 },
  { province: "Lualaba", transports: 64, tonnes: 21200 },
  { province: "Nord-Kivu", transports: 38, tonnes: 8900 },
  { province: "Tanganyika", transports: 21, tonnes: 7100 },
  { province: "Maniema", transports: 15, tonnes: 3800 },
  { province: "Sud-Kivu", transports: 12, tonnes: 2100 },
];

// ── AI Chat Data ─────────────────────────────────────────

export type AIStatColor =
  | "red"
  | "green"
  | "orange"
  | "blue"
  | "yellow"
  | "purple";

export type AIContentBlock =
  | { type: "text"; content: string }
  | {
      type: "stats";
      items: {
        label: string;
        value: string;
        sub?: string;
        color: AIStatColor;
      }[];
    }
  | { type: "table"; headers: string[]; rows: string[][] }
  | { type: "list"; items: { icon: string; text: string; sub?: string }[] };

export interface AISuggestedQuery {
  id: string;
  label: string;
  query: string;
  icon: string;
  category: string;
}

export interface AIScriptedResponse {
  triggers: string[];
  blocks: AIContentBlock[];
  delay: number;
}

export const aiSuggestedQueries: AISuggestedQuery[] = [
  {
    id: "q1",
    label: "Résumé opérationnel",
    query: "Donne-moi le résumé de la situation actuelle",
    icon: "📊",
    category: "general",
  },
  {
    id: "q2",
    label: "Convois en transit",
    query: "Quels convois sont actuellement en route ?",
    icon: "🚚",
    category: "transport",
  },
  {
    id: "q3",
    label: "Alertes critiques",
    query: "Montre-moi les alertes critiques non résolues",
    icon: "🔴",
    category: "alert",
  },
  {
    id: "q4",
    label: "Retards & Anomalies",
    query: "Quels sont les retards et anomalies en cours ?",
    icon: "⚠️",
    category: "transport",
  },
  {
    id: "q5",
    label: "Répartition minerais",
    query: "Donne-moi la répartition des minerais ce mois",
    icon: "💎",
    category: "mineral",
  },
  {
    id: "q6",
    label: "État équipements GPS",
    query: "Quel est l'état des équipements GPS en temps réel ?",
    icon: "📡",
    category: "equipment",
  },
  {
    id: "q7",
    label: "Détection fraudes",
    query: "Y a-t-il des suspicions de fraude ou d'irrégularités ?",
    icon: "🔍",
    category: "fraud",
  },
  {
    id: "q8",
    label: "Performance mars 2024",
    query: "Donne-moi les statistiques de performance de mars 2024",
    icon: "📈",
    category: "stats",
  },
];

export const aiScriptedResponses: AIScriptedResponse[] = [
  {
    triggers: [
      "résumé",
      "situation",
      "bonjour",
      "aujourd",
      "dashboard",
      "bilan",
      "overview",
      "général",
      "actuelle",
    ],
    delay: 1800,
    blocks: [
      {
        type: "text",
        content:
          "Bonjour ! Voici l'état opérationnel **en temps réel** du 28 mars 2024 pour **SMART MINE RDC** :",
      },
      {
        type: "stats",
        items: [
          {
            label: "Transports actifs",
            value: "7",
            sub: "3 en route ce jour",
            color: "blue",
          },
          {
            label: "Tonnes tracées",
            value: "71 500",
            sub: "+13.1% vs février",
            color: "green",
          },
          {
            label: "Alertes ouvertes",
            value: "5",
            sub: "dont 1 critique",
            color: "red",
          },
          {
            label: "GPS actifs",
            value: "6 / 10",
            sub: "1 en panne · BGP-0512",
            color: "orange",
          },
        ],
      },
      { type: "text", content: "**Points d'attention prioritaires :**" },
      {
        type: "list",
        items: [
          {
            icon: "🔴",
            text: "Convoi SM-2024-0893 — Cuivre 28t",
            sub: "Déviation GPS de 45km détectée près de Kambove — enquête recommandée",
          },
          {
            icon: "🟠",
            text: "Véhicule CD 4521 KV immobilisé depuis 2h30",
            sub: "Arrêt non autorisé · Route N1, Katanga — contact chauffeur requis",
          },
          {
            icon: "🟠",
            text: "Badge révoqué détecté — Checkpoint Kipushi",
            sub: "Tentative d'accès avec badge BDG-0199 expiré · Identité inconnue",
          },
          {
            icon: "🟡",
            text: "GPS BGP-0512 hors ligne depuis 45 min",
            sub: "Batterie critique 12% · Convoi SM-2024-0893 affecté",
          },
        ],
      },
      {
        type: "text",
        content:
          "💡 *Recommandation : Contacter immédiatement le superviseur du convoi SM-2024-0893 et vérifier l'intégrité du chargement à la prochaine étape de contrôle.*",
      },
    ],
  },
  {
    triggers: [
      "convoi",
      "transport",
      "route",
      "transit",
      "en_route",
      "véhicule",
      "livraison",
      "suivi",
    ],
    delay: 2200,
    blocks: [
      {
        type: "text",
        content:
          "**3 convois sont actuellement en route** sur 7 enregistrés dans la base :",
      },
      {
        type: "table",
        headers: [
          "Référence",
          "Minéral",
          "Progression",
          "Transporteur",
          "Statut",
        ],
        rows: [
          [
            "SM-2024-0891",
            "Cobalt · 12.5t",
            "65% ████████░░",
            "GECAMINES Trans",
            "⚠️ Immobilisé",
          ],
          [
            "SM-2024-0894",
            "Or · 45 kg",
            "25% ███░░░░░░░",
            "GoldSecure DRC",
            "✅ Normal",
          ],
          [
            "SM-2024-0897",
            "Cobalt · 9.8t",
            "50% █████░░░░░",
            "GECAMINES Trans",
            "✅ Normal",
          ],
        ],
      },
      {
        type: "text",
        content:
          "⚠️ **Alerte active** sur SM-2024-0891 : le véhicule **CD 4521 KV** (Jean-Baptiste Mwamba) est immobilisé depuis **2h30** hors d'une zone autorisée · Route N1, Katanga.",
      },
      {
        type: "text",
        content:
          "Le convoi **SM-2024-0893** (Cuivre, 28t) est **retardé** — livraison estimée repoussée au 29/03 à 12h00 (Beira via Zambie). GPS en panne sur ce convoi depuis 11h30.",
      },
    ],
  },
  {
    triggers: [
      "alerte",
      "critique",
      "urgence",
      "anomalie",
      "incident",
      "problème",
      "danger",
      "non résolue",
    ],
    delay: 1500,
    blocks: [
      {
        type: "text",
        content:
          "**5 alertes ouvertes** dans la base de données — analyse par niveau de priorité :",
      },
      {
        type: "stats",
        items: [
          { label: "Critique", value: "1", sub: "non résolue", color: "red" },
          { label: "Élevée", value: "3", sub: "non résolues", color: "orange" },
          { label: "Moyenne", value: "1", sub: "non résolue", color: "yellow" },
          { label: "Résolues", value: "2", sub: "ce jour", color: "green" },
        ],
      },
      {
        type: "list",
        items: [
          {
            icon: "🔴",
            text: "[CRITIQUE] Déviation GPS — SM-2024-0893",
            sub: "45km hors itinéraire · Kambove, Haut-Katanga · 28/03 à 14:23",
          },
          {
            icon: "🟠",
            text: "[ÉLEVÉE] Arrêt non planifié — CD 4521 KV",
            sub: "Immobilisé 2h30 hors zone autorisée · Route N1 · 28/03 à 12:45",
          },
          {
            icon: "🟠",
            text: "[ÉLEVÉE] Badge invalide expiré — BDG-0199",
            sub: "Checkpoint Kipushi · Acteur inconnu · 28/03 à 10:05",
          },
          {
            icon: "🟠",
            text: "[ÉLEVÉE] Tentative d'accès système",
            sub: "5 tentatives depuis IP 41.243.56.88 · 28/03 à 07:55",
          },
          {
            icon: "🟡",
            text: "[MOYENNE] GPS BGP-0512 hors ligne",
            sub: "Dernière position : Lubudi · Batterie 12% · 28/03 à 11:30",
          },
        ],
      },
      {
        type: "text",
        content:
          "💡 *L'anomalie de poids SM-2024-0892 (écart +2.3t, Coltan) a été résolue et archivée dans le journal d'audit. Historique conservé.*",
      },
    ],
  },
  {
    triggers: [
      "retard",
      "retardé",
      "délai",
      "annulé",
      "annulation",
      "blocage",
      "immobilisé",
      "perturbation",
    ],
    delay: 1600,
    blocks: [
      {
        type: "text",
        content: "**Analyse des perturbations opérationnelles en cours :**",
      },
      {
        type: "table",
        headers: ["Convoi", "Minéral", "Cause principale", "Impact", "Retard"],
        rows: [
          [
            "SM-2024-0893",
            "Cuivre · 28t",
            "Panne GPS + Déviation",
            "🔴 Critique",
            "+21h estimé",
          ],
          [
            "SM-2024-0891",
            "Cobalt · 12.5t",
            "Arrêt non autorisé",
            "🟠 Élevé",
            "2h30 en attente",
          ],
          [
            "SM-2024-0896",
            "Wolframite · 1.8t",
            "Convoi annulé",
            "⚫ Annulé",
            "N/A",
          ],
        ],
      },
      {
        type: "text",
        content:
          "**Impact financier estimé :** Le retard du convoi SM-2024-0893 représente un risque sur **28 tonnes de cuivre** non livrées, estimées à **~147 000 USD** selon les cours actuels (LME).",
      },
      {
        type: "text",
        content:
          "💡 *L'acteur Augustin Tshomba (CopperRoute DRC) est actuellement **suspendu**. Son convoi SM-2024-0893 cumule : panne GPS, déviation de route et retard de 21h. Un audit physique du chargement est fortement recommandé.*",
      },
    ],
  },
  {
    triggers: [
      "minerai",
      "minéral",
      "cobalt",
      "cuivre",
      "coltan",
      "or",
      "cassitérite",
      "wolframite",
      "répartition",
      "mineraux",
    ],
    delay: 2000,
    blocks: [
      {
        type: "text",
        content:
          "**Répartition des minerais tracés — Mars 2024** (212 transports · 71 500 tonnes) :",
      },
      {
        type: "table",
        headers: ["Minerai", "Part", "Tonnes est.", "Transports", "Tendance"],
        rows: [
          ["Cobalt", "34%", "24 310 t", "72", "📈 +8% vs fév."],
          ["Cuivre", "28%", "20 020 t", "59", "📈 +3% vs fév."],
          ["Coltan", "18%", "12 870 t", "38", "📉 -2% vs fév."],
          ["Or", "8%", "5 720 t", "17", "📈 +12% vs fév."],
          ["Cassitérite", "7%", "5 005 t", "15", "➡️ stable"],
          ["Wolframite", "5%", "3 575 t", "11", "📉 -5% vs fév."],
        ],
      },
      {
        type: "text",
        content:
          "💡 *Le **Cobalt** reste le minéral dominant (+8%), avec 2 convois actifs GECAMINES Trans. L'**Or** affiche la croissance la plus forte (+12%), portée par la route Butembo → Kinshasa. Le Coltan recule légèrement (-2%) suite à la dégradation sécuritaire en zone Walikale.*",
      },
    ],
  },
  {
    triggers: [
      "gps",
      "badge",
      "équipement",
      "tracker",
      "signal",
      "batterie",
      "télématique",
      "smartbadge",
      "capteur",
    ],
    delay: 1900,
    blocks: [
      {
        type: "text",
        content:
          "**Inventaire des équipements SmartBadge GPS/QR — état en temps réel :**",
      },
      {
        type: "stats",
        items: [
          {
            label: "Actifs",
            value: "6",
            sub: "60% du parc",
            color: "green",
          },
          {
            label: "En panne",
            value: "1",
            sub: "BGP-0512 · Lualaba",
            color: "red",
          },
          {
            label: "Inactifs",
            value: "2",
            sub: "≥7j sans signal",
            color: "orange",
          },
          {
            label: "En transit",
            value: "1",
            sub: "BGP-0234 · Tanganyika",
            color: "blue",
          },
        ],
      },
      {
        type: "table",
        headers: ["Série", "Modèle", "Batterie", "Province", "Statut"],
        rows: [
          [
            "BGP-0512",
            "SmartBadge v2 (Queclink)",
            "12% 🔋",
            "Lualaba",
            "⛔ En panne",
          ],
          [
            "BGP-0099",
            "SmartBadge v2 (Queclink)",
            "20%",
            "Maniema",
            "⚪ Inactif",
          ],
          [
            "BGP-0145",
            "SmartBadge v2 (Queclink)",
            "45%",
            "Tanganyika",
            "⚪ Inactif",
          ],
          [
            "BGP-0671",
            "SmartBadge v3 (Teltonika)",
            "88%",
            "Haut-Katanga",
            "✅ Actif",
          ],
          [
            "BGP-0558",
            "SmartBadge v3 (Teltonika)",
            "100% 🟢",
            "Kinshasa",
            "✅ Actif",
          ],
        ],
      },
      {
        type: "text",
        content:
          "⚠️ **Action requise** : Le badge **BGP-0512** (assigné au convoi retardé SM-2024-0893) est en panne avec batterie à **12%**. C'est la cause directe de la perte de signal GPS signalée à 11h30. Remplacement urgent recommandé.",
      },
    ],
  },
  {
    triggers: [
      "statistique",
      "mois",
      "mars",
      "performance",
      "rapport",
      "chiffre",
      "indicateur",
      "kpi",
    ],
    delay: 2500,
    blocks: [
      {
        type: "text",
        content:
          "**Rapport de performance consolidé — Mars 2024** (données extraites de la BDD) :",
      },
      {
        type: "stats",
        items: [
          {
            label: "Transports réalisés",
            value: "212",
            sub: "+12.2% vs février",
            color: "green",
          },
          {
            label: "Tonnes transportées",
            value: "71 500",
            sub: "+13.1% vs février",
            color: "green",
          },
          {
            label: "Taux de livraison",
            value: "94.3%",
            sub: "-0.8pp vs fév.",
            color: "blue",
          },
          {
            label: "Alertes générées",
            value: "47",
            sub: "3 critiques ce mois",
            color: "orange",
          },
        ],
      },
      {
        type: "table",
        headers: ["Province", "Transports", "Tonnes", "Alertes", "Score"],
        rows: [
          ["Haut-Katanga", "89", "28 400 t", "2", "🟢 96%"],
          ["Lualaba", "64", "21 200 t", "3", "🟡 78%"],
          ["Nord-Kivu", "38", "8 900 t", "1", "🟢 91%"],
          ["Tanganyika", "21", "7 100 t", "0", "🟢 100%"],
          ["Maniema", "15", "3 800 t", "1", "🟡 83%"],
          ["Sud-Kivu", "12", "2 100 t", "0", "🟢 100%"],
        ],
      },
      {
        type: "text",
        content:
          "💡 *Haut-Katanga domine avec **42% du volume total**. La province Lualaba affiche le score le plus bas (78%), corrélé à l'acteur suspendu Augustin Tshomba (CopperRoute DRC) et ses 3 alertes associées.*",
      },
    ],
  },
  {
    triggers: [
      "fraude",
      "suspicion",
      "irrégularité",
      "faux",
      "poids",
      "détournement",
      "illégal",
      "criminel",
      "investigation",
    ],
    delay: 2100,
    blocks: [
      {
        type: "text",
        content:
          "**Analyse des risques et détections d'irrégularités — SMART MINE RDC :**",
      },
      {
        type: "list",
        items: [
          {
            icon: "🔴",
            text: "Anomalie de poids — SM-2024-0892 (Coltan, 3.2t)",
            sub: "Écart +2.3t entre déclaré et mesuré · Poste Likasi · RÉSOLU le 28/03 à 09:15",
          },
          {
            icon: "🟠",
            text: "Déviation d'itinéraire — SM-2024-0893 (Cuivre, 28t)",
            sub: "45km hors route officielle · Zone Kambove · EN COURS d'investigation",
          },
          {
            icon: "🟠",
            text: "Badge révoqué utilisé — BDG-0199",
            sub: "Tentative d'accès Checkpoint Kipushi · Identité non identifiée · 28/03 10:05",
          },
          {
            icon: "🟠",
            text: "Cyberattaque potentielle — IP 41.243.56.88",
            sub: "5 tentatives d'authentification échouées · Possible brute-force · 28/03 07:55",
          },
        ],
      },
      {
        type: "text",
        content: "**Score de risque opérationnel global : 🟠 MODÉRÉ-ÉLEVÉ**",
      },
      {
        type: "text",
        content:
          "💡 *L'acteur Augustin Tshomba (CopperRoute DRC) est suspendu suite à l'anomalie de poids. Son convoi SM-2024-0893 fait l'objet d'une surveillance renforcée. Recommandation : audit physique immédiat + signalement à la Direction des Mines.*",
      },
    ],
  },
  {
    triggers: [
      "transporteur",
      "acteur",
      "chauffeur",
      "société",
      "gecamines",
      "mintrans",
      "goldsecure",
      "copperoute",
      "fiabilité",
    ],
    delay: 1700,
    blocks: [
      {
        type: "text",
        content: "**Analyse de fiabilité des transporteurs enregistrés :**",
      },
      {
        type: "table",
        headers: ["Société", "Transports", "Acteur", "Alertes", "Fiabilité"],
        rows: [
          ["GECAMINES Trans", "89", "✅ J.B. Mwamba", "1", "🟢 96%"],
          ["MinTrans SARL", "45", "✅ P. Kabila", "0", "🟢 98%"],
          ["CopperRoute DRC", "62", "🔴 A. Tshomba (suspendu)", "3", "🔴 72%"],
          ["GoldSecure DRC", "28", "✅ E. Ndungu", "0", "🟢 100%"],
          ["TinTrans Congo", "15", "✅ M. Banza", "0", "🟢 100%"],
        ],
      },
      {
        type: "text",
        content:
          "⚠️ **CopperRoute DRC** présente le taux de fiabilité le plus bas (**72%**) avec 3 alertes associées et l'acteur principal suspendu. Une révision de son accréditation est recommandée avant tout nouveau convoi autorisé.",
      },
    ],
  },
];

export function getAIResponse(query: string): AIScriptedResponse {
  const lower = query.toLowerCase();
  const match = aiScriptedResponses.find((r) =>
    r.triggers.some((t) => lower.includes(t)),
  );
  if (match) return match;

  return {
    triggers: [],
    delay: 1200,
    blocks: [
      {
        type: "text",
        content:
          "Je n'ai pas trouvé de données spécifiques pour cette requête dans la base **SMART MINE RDC**. Voici les analyses disponibles :",
      },
      {
        type: "list",
        items: [
          {
            icon: "📊",
            text: "Résumé opérationnel",
            sub: "État général des transports et alertes du jour",
          },
          {
            icon: "🚚",
            text: "Convois en route",
            sub: "Suivi temps réel des 3 convois actifs",
          },
          {
            icon: "🔴",
            text: "Alertes & Anomalies",
            sub: "5 alertes ouvertes dont 1 critique non résolue",
          },
          {
            icon: "💎",
            text: "Répartition des minerais",
            sub: "212 transports · 71 500 tonnes ce mois",
          },
          {
            icon: "📡",
            text: "État des équipements GPS",
            sub: "6 actifs · 1 en panne · 2 inactifs",
          },
          {
            icon: "🔍",
            text: "Détection de fraudes",
            sub: "Score de risque actuel : Modéré-Élevé",
          },
        ],
      },
    ],
  };
}
