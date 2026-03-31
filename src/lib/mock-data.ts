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
