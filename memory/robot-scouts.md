# 🤖 Robot Scouts - Data Freshness System
## HS Portal One - Automated Coach Monitoring

---

## 🎯 GOAL
Keep 8,783+ college coach records accurate and up-to-date with minimal manual effort.

---

## 📊 THE PROBLEM

College coaching staffs change constantly:
- Coaches get hired/fired mid-season
- Position changes (DC → HC)
- New hires announced on team websites
- Contact info changes (email, Twitter)

**Without automation:** Data goes stale within weeks, users lose trust.

**With Robot Scouts:** Data stays fresh, users see "Verified today" badges.

---

## 🔧 SYSTEM ARCHITECTURE

```
┌─────────────────────────────────────────────────────────────┐
│                    COLLEGE WEBSITES                          │
│  (Auburn, Alabama, Ohio State, etc. - staff directories)    │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                   ROBOT SCOUTS                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Visualping  │  │  Distill.io  │  │   Wachete    │      │
│  │  (Visual)    │  │  (Webhooks)  │  │  (Keywords)  │      │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘      │
└─────────┼─────────────────┼─────────────────┼───────────────┘
          │                 │                 │
          ▼                 ▼                 ▼
┌─────────────────────────────────────────────────────────────┐
│                  ALERT ROUTING                               │
│                                                              │
│  Phase 1: Email → Kevin → Manual Update via Admin Portal    │
│  Phase 2: Webhook → /api/scouts/alert → Queue for Review    │
│  Phase 3: Webhook → /api/scouts/auto → Auto-update DB       │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                   SUPABASE DATABASE                          │
│                                                              │
│  coaches table:                                              │
│  - last_verified_at (timestamp)                             │
│  - verification_source ('manual' | 'scout' | 'scraper')     │
│  - verification_status ('verified' | 'pending' | 'stale')   │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                   USER INTERFACE                             │
│                                                              │
│  🟢 LIVE - Verified today                                   │
│  🟡 RECENT - Verified this week                             │
│  🔴 STALE - Needs verification (30+ days)                   │
└─────────────────────────────────────────────────────────────┘
```

---

## 📋 IMPLEMENTATION PHASES

### Phase 1: Manual Monitoring (Week 1)
**Goal:** Prove the concept works

**Setup:**
1. Create Visualping account (free tier: 65 pages)
2. Add top 25 priority schools (Power 4 conferences)
3. Configure "Select Area" to monitor ONLY coaching staff section
4. Email alerts to info@ocelitefootball.com
5. Manually update via /admin/coaches when alerts come in

**Database Changes:**
```sql
-- Run in Supabase SQL Editor
ALTER TABLE coaches ADD COLUMN last_verified_at timestamptz DEFAULT now();
ALTER TABLE coaches ADD COLUMN verification_source text DEFAULT 'manual';
ALTER TABLE coaches ADD COLUMN school_staff_url text;
```

**Priority Schools (Phase 1):**
| Conference | Schools |
|------------|---------|
| SEC | Alabama, Auburn, Georgia, LSU, Texas, Oklahoma |
| Big Ten | Ohio State, Michigan, Penn State, USC |
| Big 12 | Colorado, Arizona, Utah, Kansas State |
| ACC | Clemson, Florida State, Miami, NC State |

---

### Phase 2: Semi-Automated (Week 2-3)
**Goal:** Reduce manual work

**Setup:**
1. Upgrade to Visualping Pro (webhooks)
2. Build `/api/scouts/alert` endpoint
3. Create "Pending Review" queue in admin dashboard
4. Kevin reviews alerts, approves/rejects updates

**New API Endpoint:**
```typescript
// app/api/scouts/alert/route.ts
export async function POST(req: Request) {
  const { school_name, change_detected, screenshot_url } = await req.json()

  // Create pending verification record
  await supabase.from('verification_queue').insert({
    school_name,
    change_detected,
    screenshot_url,
    status: 'pending',
    created_at: new Date()
  })

  // Notify admin (email or push)
  await sendAdminNotification(school_name)

  return Response.json({ success: true })
}
```

**New Database Table:**
```sql
CREATE TABLE verification_queue (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  school_name text NOT NULL,
  change_detected text,
  screenshot_url text,
  status text DEFAULT 'pending', -- 'pending' | 'approved' | 'rejected'
  reviewed_by uuid REFERENCES profiles(id),
  reviewed_at timestamptz,
  created_at timestamptz DEFAULT now()
);
```

---

### Phase 3: Full Automation (Week 4+)
**Goal:** Minimal human intervention

**Setup:**
1. Add CrewAI scraper agents
2. Agents parse coaching staff pages
3. Compare scraped data vs database
4. Auto-update if confidence > 90%
5. Queue for review if confidence < 90%

**CrewAI Agent Roles:**
| Agent | Role | Task |
|-------|------|------|
| Scout | Monitor | Watch for page changes |
| Scraper | Extract | Parse names, titles, contact info |
| Validator | Verify | Compare against existing data |
| Updater | Execute | Push changes to database |

---

## 🎮 EA SPORTS-STYLE FRESHNESS BADGES

### Badge Logic:
```typescript
function getFreshnessBadge(lastVerifiedAt: Date | null): Badge {
  if (!lastVerifiedAt) return { color: 'gray', label: 'UNVERIFIED' }

  const hoursSinceVerified = (Date.now() - lastVerifiedAt.getTime()) / (1000 * 60 * 60)

  if (hoursSinceVerified < 24) {
    return { color: 'green', label: 'LIVE', icon: '🟢' }
  } else if (hoursSinceVerified < 168) { // 7 days
    return { color: 'yellow', label: 'RECENT', icon: '🟡' }
  } else if (hoursSinceVerified < 720) { // 30 days
    return { color: 'orange', label: 'AGING', icon: '🟠' }
  } else {
    return { color: 'red', label: 'STALE', icon: '🔴' }
  }
}
```

### UI Display:
```
┌─────────────────────────────────────────┐
│  COACH CARD                             │
│  ─────────────────────────────────────  │
│  Nick Saban Jr.                         │
│  Offensive Coordinator                  │
│  Alabama Crimson Tide                   │
│                                         │
│  🟢 LIVE · Verified 2 hours ago        │
│  Source: Robot Scout                    │
└─────────────────────────────────────────┘
```

---

## 💰 COST ESTIMATE

### Phase 1 (Manual):
- Visualping Free: 65 pages, $0/month
- Your time: ~30 min/week

### Phase 2 (Semi-Auto):
- Visualping Pro: 1,000 pages, $19/month
- Supabase: Already have, $0
- Your time: ~15 min/week

### Phase 3 (Full Auto):
- Visualping Business: Unlimited, $49/month
- CrewAI: Self-hosted, $0 (compute costs vary)
- Your time: ~5 min/week (review edge cases)

---

## 📈 SUCCESS METRICS

| Metric | Target |
|--------|--------|
| % coaches with "LIVE" badge | > 80% |
| Average verification age | < 7 days |
| Time from change → database update | < 24 hours |
| False positive alerts | < 10% |
| Manual intervention rate | < 20% |

---

## 🚀 QUICK START CHECKLIST

- [ ] Create Visualping account
- [ ] Add first 10 schools to monitor
- [ ] Run SQL to add verification columns to coaches table
- [ ] Test with 1 school - make a fake change, verify alert works
- [ ] Update admin portal to show last_verified_at
- [ ] Add freshness badge component to coach cards
- [ ] Document which schools are monitored

---

## 🔗 TOOL LINKS

- Visualping: https://visualping.io
- Distill.io: https://distill.io
- Wachete: https://www.wachete.com
- ChangeTower: https://changetower.com
- Sken.io: https://www.sken.io

---

## 📝 NOTES

- Start small (10-25 schools), prove it works
- Power 4 conferences first (highest demand)
- FCS and D2/D3 can use less frequent monitoring
- Consider partnering with existing data providers later
- This system differentiates us from competitors
