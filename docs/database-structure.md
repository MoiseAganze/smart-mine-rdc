# Structure de la Base de Données - SMART MINE RDC

## Vue d'ensemble

Base de données relationnelle PostgreSQL pour le système de traçabilité minière nationale.

---

## Tables principales

### 1. `users` - Utilisateurs du système
Gestion de l'authentification et des permissions.

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  matricule VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'superviseur', 'agent')),
  province VARCHAR(100) NOT NULL,
  status VARCHAR(20) DEFAULT 'actif' CHECK (status IN ('actif', 'inactif', 'suspendu')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_matricule ON users(matricule);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
```

---

### 2. `actors` - Acteurs de la chaîne minière
Transporteurs, agents, destinataires, superviseurs.

```sql
CREATE TABLE actors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('agent', 'transporteur', 'destinataire', 'superviseur')),
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(50),
  province VARCHAR(100) NOT NULL,
  company VARCHAR(255),
  status VARCHAR(20) DEFAULT 'actif' CHECK (status IN ('actif', 'inactif', 'suspendu')),
  avatar_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_actors_role ON actors(role);
CREATE INDEX idx_actors_province ON actors(province);
CREATE INDEX idx_actors_status ON actors(status);
CREATE INDEX idx_actors_email ON actors(email);
```

---

### 3. `equipment` - Badges GPS (QR code + GPS)
Dispositifs de traçabilité unifiés.

```sql
CREATE TABLE equipment (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  serial VARCHAR(50) UNIQUE NOT NULL,
  model VARCHAR(100) NOT NULL,
  status VARCHAR(20) DEFAULT 'inactif' CHECK (status IN ('actif', 'inactif', 'en_panne', 'en_transit')),
  battery_level SMALLINT CHECK (battery_level >= 0 AND battery_level <= 100),
  province VARCHAR(100) NOT NULL,
  assigned_actor_id UUID REFERENCES actors(id) ON DELETE SET NULL,
  assigned_transport_id UUID REFERENCES transports(id) ON DELETE SET NULL,
  last_seen TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_equipment_serial ON equipment(serial);
CREATE INDEX idx_equipment_status ON equipment(status);
CREATE INDEX idx_equipment_assigned_actor ON equipment(assigned_actor_id);
CREATE INDEX idx_equipment_assigned_transport ON equipment(assigned_transport_id);
```

---

### 4. `transports` - Convois miniers
Suivi des transports de minerais.

```sql
CREATE TABLE transports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reference VARCHAR(50) UNIQUE NOT NULL,
  mineral VARCHAR(50) NOT NULL CHECK (mineral IN ('Cobalt', 'Coltan', 'Cuivre', 'Or', 'Cassitérite', 'Wolframite')),
  quantity DECIMAL(12, 2) NOT NULL,
  unit VARCHAR(10) DEFAULT 'kg',
  weight_gross DECIMAL(12, 2) NOT NULL,
  origin VARCHAR(255) NOT NULL,
  destination VARCHAR(255) NOT NULL,
  transporter VARCHAR(255) NOT NULL,
  driver_actor_id UUID REFERENCES actors(id) ON DELETE SET NULL,
  vehicle_plate VARCHAR(50) NOT NULL,
  badge_gps_id UUID REFERENCES equipment(id) ON DELETE SET NULL,
  status VARCHAR(20) DEFAULT 'en_attente' CHECK (status IN ('en_attente', 'en_route', 'livré', 'retardé', 'annulé')),
  departure_date TIMESTAMP NOT NULL,
  estimated_arrival TIMESTAMP NOT NULL,
  arrival_date TIMESTAMP,
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_transports_reference ON transports(reference);
CREATE INDEX idx_transports_status ON transports(status);
CREATE INDEX idx_transports_mineral ON transports(mineral);
CREATE INDEX idx_transports_driver ON transports(driver_actor_id);
CREATE INDEX idx_transports_badge ON transports(badge_gps_id);
CREATE INDEX idx_transports_departure ON transports(departure_date);
CREATE INDEX idx_transports_created_by ON transports(created_by);
```

---

### 5. `gps_positions` - Positions GPS en temps réel
Historique de géolocalisation des badges GPS.

```sql
CREATE TABLE gps_positions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  equipment_id UUID NOT NULL REFERENCES equipment(id) ON DELETE CASCADE,
  transport_id UUID REFERENCES transports(id) ON DELETE SET NULL,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  altitude DECIMAL(8, 2),
  speed DECIMAL(6, 2),
  heading SMALLINT CHECK (heading >= 0 AND heading < 360),
  accuracy DECIMAL(6, 2),
  timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_gps_equipment ON gps_positions(equipment_id, timestamp DESC);
CREATE INDEX idx_gps_transport ON gps_positions(transport_id, timestamp DESC);
CREATE INDEX idx_gps_timestamp ON gps_positions(timestamp DESC);

-- Partitionnement par mois recommandé pour optimiser les performances
```

---

### 6. `alerts` - Alertes et anomalies
Détection automatique d'incidents.

```sql
CREATE TABLE alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type VARCHAR(100) NOT NULL,
  priority VARCHAR(20) NOT NULL CHECK (priority IN ('critique', 'élevée', 'moyenne', 'faible')),
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  transport_id UUID REFERENCES transports(id) ON DELETE SET NULL,
  actor_id UUID REFERENCES actors(id) ON DELETE SET NULL,
  equipment_id UUID REFERENCES equipment(id) ON DELETE SET NULL,
  location VARCHAR(255),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  resolved BOOLEAN DEFAULT FALSE,
  resolved_by UUID REFERENCES users(id) ON DELETE SET NULL,
  resolved_at TIMESTAMP,
  resolution_notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_alerts_priority ON alerts(priority);
CREATE INDEX idx_alerts_resolved ON alerts(resolved);
CREATE INDEX idx_alerts_transport ON alerts(transport_id);
CREATE INDEX idx_alerts_created_at ON alerts(created_at DESC);
CREATE INDEX idx_alerts_type ON alerts(type);
```

---

### 7. `audit_logs` - Journaux d'audit
Traçabilité complète des actions système.

```sql
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action VARCHAR(100) NOT NULL,
  module VARCHAR(50) NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  user_name VARCHAR(255) NOT NULL,
  user_role VARCHAR(20) NOT NULL,
  target_type VARCHAR(50),
  target_id VARCHAR(100),
  target_description TEXT,
  ip_address INET NOT NULL,
  user_agent TEXT,
  result VARCHAR(20) NOT NULL CHECK (result IN ('succès', 'échec', 'avertissement')),
  error_message TEXT,
  metadata JSONB,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_user ON audit_logs(user_id, timestamp DESC);
CREATE INDEX idx_audit_module ON audit_logs(module, timestamp DESC);
CREATE INDEX idx_audit_timestamp ON audit_logs(timestamp DESC);
CREATE INDEX idx_audit_result ON audit_logs(result);
CREATE INDEX idx_audit_action ON audit_logs(action);

-- Partitionnement par mois recommandé
```

---

### 8. `notifications` - Notifications utilisateur
Alertes push et notifications système.

```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  link VARCHAR(500),
  read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMP,
  priority VARCHAR(20) DEFAULT 'moyenne' CHECK (priority IN ('critique', 'élevée', 'moyenne', 'faible')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_notifications_user ON notifications(user_id, created_at DESC);
CREATE INDEX idx_notifications_read ON notifications(user_id, read);
```

---

### 9. `settings` - Paramètres système
Configuration globale et par utilisateur.

```sql
CREATE TABLE settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  category VARCHAR(50) NOT NULL,
  key VARCHAR(100) NOT NULL,
  value JSONB NOT NULL,
  description TEXT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, category, key)
);

CREATE INDEX idx_settings_user ON settings(user_id);
CREATE INDEX idx_settings_category ON settings(category);
```

---

## Relations clés

```
users (1) ──── (N) transports [created_by]
users (1) ──── (N) audit_logs
users (1) ──── (N) notifications
users (1) ──── (N) alerts [resolved_by]

actors (1) ──── (N) transports [driver]
actors (1) ──── (N) equipment [assigned_to]
actors (1) ──── (N) alerts

equipment (1) ──── (N) gps_positions
equipment (1) ──── (1) transports [badge_gps]

transports (1) ──── (N) gps_positions
transports (1) ──── (N) alerts
```

---

## Vues matérialisées recommandées

### `v_transport_stats` - Statistiques temps réel
```sql
CREATE MATERIALIZED VIEW v_transport_stats AS
SELECT 
  DATE_TRUNC('day', departure_date) as date,
  mineral,
  status,
  COUNT(*) as count,
  SUM(quantity) as total_quantity,
  SUM(weight_gross) as total_weight
FROM transports
GROUP BY DATE_TRUNC('day', departure_date), mineral, status;

CREATE INDEX idx_transport_stats_date ON v_transport_stats(date DESC);
```

### `v_actor_performance` - Performance des acteurs
```sql
CREATE MATERIALIZED VIEW v_actor_performance AS
SELECT 
  a.id,
  a.name,
  a.role,
  COUNT(t.id) as transports_count,
  COUNT(CASE WHEN t.status = 'livré' THEN 1 END) as delivered_count,
  COUNT(CASE WHEN t.status = 'retardé' THEN 1 END) as delayed_count
FROM actors a
LEFT JOIN transports t ON t.driver_actor_id = a.id
WHERE a.role = 'transporteur'
GROUP BY a.id, a.name, a.role;
```

---

## Triggers recommandés

### Mise à jour automatique `updated_at`
```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Appliquer à toutes les tables avec updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_actors_updated_at BEFORE UPDATE ON actors
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_equipment_updated_at BEFORE UPDATE ON equipment
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transports_updated_at BEFORE UPDATE ON transports
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_alerts_updated_at BEFORE UPDATE ON alerts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### Génération automatique de référence transport
```sql
CREATE OR REPLACE FUNCTION generate_transport_reference()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.reference IS NULL THEN
    NEW.reference := 'SM-' || TO_CHAR(CURRENT_TIMESTAMP, 'YYYY') || '-' || 
                     LPAD(nextval('transport_ref_seq')::TEXT, 4, '0');
  END IF;
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE SEQUENCE transport_ref_seq START 1000;

CREATE TRIGGER set_transport_reference BEFORE INSERT ON transports
  FOR EACH ROW EXECUTE FUNCTION generate_transport_reference();
```

---

## Optimisations recommandées

1. **Partitionnement**
   - `gps_positions` : par mois (RANGE sur timestamp)
   - `audit_logs` : par mois (RANGE sur timestamp)

2. **Indices composites**
   ```sql
   CREATE INDEX idx_transports_status_date ON transports(status, departure_date DESC);
   CREATE INDEX idx_alerts_resolved_priority ON alerts(resolved, priority, created_at DESC);
   ```

3. **Rafraîchissement des vues matérialisées**
   - Toutes les 5 minutes via cron job ou pg_cron

4. **Archivage**
   - Déplacer `gps_positions` > 6 mois vers table d'archivage
   - Déplacer `audit_logs` > 1 an vers stockage froid

---

## Sécurité

1. **Row Level Security (RLS)**
   ```sql
   ALTER TABLE transports ENABLE ROW LEVEL SECURITY;
   
   CREATE POLICY transports_province_policy ON transports
     FOR SELECT
     USING (
       current_setting('app.user_role') = 'admin' OR
       origin = current_setting('app.user_province') OR
       destination = current_setting('app.user_province')
     );
   ```

2. **Chiffrement**
   - Mots de passe : bcrypt (coût 12)
   - Données sensibles : pgcrypto pour colonnes critiques

3. **Backup**
   - Backup complet quotidien
   - WAL archiving en continu
   - Rétention : 30 jours

---

## Notes d'implémentation

- Utiliser **UUID v4** pour tous les identifiants
- Tous les timestamps en **UTC**
- Encoding : **UTF-8**
- Collation : **fr_FR.UTF-8** pour tri correct des noms français
- Contraintes de clés étrangères avec **ON DELETE** approprié selon la logique métier
