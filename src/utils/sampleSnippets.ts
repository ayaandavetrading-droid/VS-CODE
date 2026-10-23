export interface SampleSnippet {
  title: string;
  languageId: string;
  filename: string;
  description: string;
  code: string;
}

export const SAMPLE_SNIPPETS: SampleSnippet[] = [
  {
    title: 'HTML & CSS: EcoArt Works Studio (Screenshot Reference)',
    languageId: 'html',
    filename: 'ecoart-works (1).html',
    description: 'EcoArt design system with CSS custom properties, grid layouts, cards, and testimonials.',
    code: `<html lang="en">
<head>
<style>
/* ===== DESIGN SYSTEM & COMPONENTS ===== */
:root {
  --sand: #e8c99a;
  --cream: #fbf7ee;
  --white: #ffffff;
  --gold: #d4af37;
  --ink: #1a1410;
}

.about-contact-item {
  background: rgba(232,201,154,.05); border: 1px solid rgba(232,201,154,.1);
  border-radius: 14px; padding: 18px 20px;
}
.aci-icon { font-size: 1.4rem; margin-bottom: 8px; }
.aci-label { font-size: .68rem; text-transform: uppercase; letter-spacing: .14em; color: var(--sand); opacity: .6; margin-bottom: 4px; }
.aci-val { font-size: .9rem; color: var(--cream); font-weight: 500; word-break: break-word; }

.services-grid { display: grid; gap: 16px; }
.service-card {
  background: rgba(232,201,154,.04); border: 1px solid rgba(232,201,154,.09);
  border-radius: 18px; padding: 24px 26px;
  display: flex; align-items: flex-start; gap: 18px;
  transition: all .3s; cursor: default;
}
.service-card:hover { background: rgba(232,201,154,.08); border-color: rgba(181,98,42,.35); transform: translateX(6px); }
.serv-icon { font-size: 1.8rem; flex-shrink: 0; line-height: 1; }
.serv-title { font-family: 'Cormorant Garamond', serif; font-size: 1.2rem; font-weight: 500; color: var(--sand); margin-bottom: 6px; }
.serv-desc { font-size: .83rem; color: rgba(232,201,154,.55); line-height: 1.6; }

/* ===== TESTIMONIALS ===== */
#testimonials { background: var(--cream); }
.testi-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; margin-top: 60px; }
.testi-card {
  background: var(--white); border-radius: 20px; padding: 28px;
  box-shadow: 0 2px 14px rgba(26,20,16,.05);
  transition: transform .35s, box-shadow .35s;
}
.testi-card:hover { transform: translateY(-6px); box-shadow: 0 16px 40px rgba(26,20,16,.1); }
.testi-stars { color: var(--gold); font-size: 1rem; letter-spacing: 2px; margin-bottom: 16px; }
.testi-quote {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.1rem; font-style: italic; font-weight: 400;
  color: var(--ink); line-height: 1.65; margin-bottom: 22px;
}
</style>
</head>
<body>
  <div class="testi-card">
    <div class="testi-stars">★★★★★</div>
    <div class="testi-quote">
      "The handcrafted ceramic collection transformed our architectural project."
    </div>
  </div>
</body>
</html>`,
  },
  {
    title: 'Python: DeskPilot Starter Expense Tracker',
    languageId: 'python',
    filename: 'DeskPilot Starter: Python Expense Tracke Untitled-1',
    description: 'Personal finance analytics CLI with category budgets and CSV reporting.',
    code: `"""DeskPilot Starter: Python Expense Tracker"""
from dataclasses import dataclass
from typing import List, Dict
import datetime

@dataclass
class Expense:
    id: str
    description: str
    amount: float
    category: str
    date: datetime.date

class ExpenseTracker:
    def __init__(self, monthly_budget: float = 2500.0):
        self.budget = monthly_budget
        self.expenses: List[Expense] = []

    def add_expense(self, description: str, amount: float, category: str = "General") -> Expense:
        record = Expense(
            id=f"exp-{len(self.expenses) + 1:04d}",
            description=description,
            amount=amount,
            category=category,
            date=datetime.date.today()
        )
        self.expenses.append(record)
        return record

    def get_summary(self) -> Dict[str, float]:
        total = sum(e.amount for e in self.expenses)
        by_cat: Dict[str, float] = {}
        for e in self.expenses:
            by_cat[e.category] = by_cat.get(e.category, 0.0) + e.amount
        return {"total": total, "remaining": self.budget - total, "by_category": by_cat}

if __name__ == "__main__":
    tracker = ExpenseTracker()
    tracker.add_expense("Hosting & Cloud CDN", 45.00, "Infrastructure")
    tracker.add_expense("VS Code Extension Tooling", 19.99, "Development")
    print("Summary:", tracker.get_summary())
`,
  },
  {
    title: 'Python: Concurrent Worker Pool & Cache',
    languageId: 'python',
    filename: 'worker_pool.py',
    description: 'Async task processor with LRU cache, type hints, and exception handling.',
    code: `import asyncio
import hashlib
import time
from typing import Dict, Any, Optional
from collections import OrderedDict

class LRUCache:
    """Thread-safe LRU Cache with TTL eviction policy."""
    def __init__(self, capacity: int = 128, default_ttl: float = 300.0):
        self.capacity = capacity
        self.default_ttl = default_ttl
        self.cache: OrderedDict[str, tuple[Any, float]] = OrderedDict()
        self._lock = asyncio.Lock()

    async def get(self, key: str) -> Optional[Any]:
        async with self._lock:
            if key not in self.cache:
                return None
            val, expire_at = self.cache[key]
            if time.time() > expire_at:
                del self.cache[key]
                return None
            self.cache.move_to_end(key)
            return val

    async def set(self, key: str, value: Any, ttl: Optional[float] = None) -> None:
        async with self._lock:
            expire_at = time.time() + (ttl or self.default_ttl)
            if key in self.cache:
                self.cache.move_to_end(key)
            elif len(self.cache) >= self.capacity:
                self.cache.popitem(last=False)
            self.cache[key] = (value, expire_at)

async def compute_payload(data: str) -> Dict[str, Any]:
    # Simulate cryptographic verification
    digest = hashlib.sha256(data.encode('utf-8')).hexdigest()
    await asyncio.sleep(0.05)
    return {
        "status": "verified",
        "hash": digest,
        "length": len(data),
        "timestamp": time.time()
    }

async def main():
    cache = LRUCache(capacity=50)
    print("🚀 Initializing concurrent ingestion pipeline...")
    tasks = [compute_payload(f"item_{i}") for i in range(10)]
    results = await asyncio.gather(*tasks)
    for res in results[:3]:
        print(f" -> Processed: {res['hash'][:16]}... len={res['length']}")
    print("✓ Pipeline successfully completed.")

if __name__ == "__main__":
    asyncio.run(main())
`
  },
  {
    title: 'TypeScript: Event Bus & Reactive Store',
    languageId: 'typescript',
    filename: 'eventBus.ts',
    description: 'Type-safe event dispatcher and state listener implementation.',
    code: `export type Listener<T> = (event: T) => void | Promise<void>;

export interface StoreSnapshot<TState> {
  version: number;
  data: Readonly<TState>;
  timestamp: number;
}

export class ReactiveEventBus<Events extends Record<string, any>> {
  private listeners: Map<keyof Events, Set<Listener<any>>> = new Map();
  private history: Array<{ event: keyof Events; payload: any; at: number }> = [];

  public on<K extends keyof Events>(event: K, handler: Listener<Events[K]>): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    const bucket = this.listeners.get(event)!;
    bucket.add(handler);

    // Return unsubscription callback
    return () => bucket.delete(handler);
  }

  public async emit<K extends keyof Events>(event: K, payload: Events[K]): Promise<void> {
    const timestamp = Date.now();
    this.history.push({ event, payload, at: timestamp });

    const bucket = this.listeners.get(event);
    if (!bucket || bucket.size === 0) return;

    const executions = Array.from(bucket).map(async (fn) => {
      try {
        await fn(payload);
      } catch (err) {
        console.error(\`[EventBus Error on \${String(event)}]:\`, err);
      }
    });

    await Promise.allSettled(executions);
  }

  public getRecentLogs(limit = 10) {
    return this.history.slice(-limit);
  }
}

// Example usage
interface AppEvents {
  'user:login': { userId: string; role: 'admin' | 'user' };
  'replay:tick': { offset: number; total: number };
}

const bus = new ReactiveEventBus<AppEvents>();
bus.on('replay:tick', ({ offset, total }) => {
  console.log(\`Replay progress: \${((offset / total) * 100).toFixed(1)}%\`);
});
`
  },
  {
    title: 'JavaScript: Particle Simulator (Canvas)',
    languageId: 'javascript',
    filename: 'particles.js',
    description: 'Interactive canvas physics simulation with velocity vectors.',
    code: `class ParticleSystem {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.particles = [];
    this.maxParticles = 120;
    this.gravity = 0.08;
    this.friction = 0.99;
    this.init();
  }

  init() {
    for (let i = 0; i < this.maxParticles; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: (Math.random() - 0.5) * 4,
        vy: (Math.random() - 0.5) * 4,
        radius: Math.random() * 3 + 1.5,
        color: \`hsl(\${Math.random() * 60 + 200}, 85%, 65%)\`,
        alpha: Math.random() * 0.8 + 0.2
      });
    }
  }

  update() {
    this.ctx.fillStyle = 'rgba(15, 23, 42, 0.2)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    for (const p of this.particles) {
      p.vy += this.gravity;
      p.vx *= this.friction;
      p.vy *= this.friction;
      p.x += p.vx;
      p.y += p.vy;

      // Boundary collision
      if (p.x < 0 || p.x > this.canvas.width) p.vx *= -1;
      if (p.y > this.canvas.height) {
        p.y = this.canvas.height;
        p.vy *= -0.7;
      }

      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = p.color;
      this.ctx.fill();
    }

    requestAnimationFrame(() => this.update());
  }
}
`
  },
  {
    title: 'HTML & CSS: VS Code Glassmorphism Dashboard',
    languageId: 'html',
    filename: 'index.html',
    description: 'Clean modern layout structure with semantic markup and responsive styling.',
    code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Developer Metrics</title>
  <style>
    :root {
      --bg-dark: #0d1117;
      --card-bg: rgba(22, 27, 34, 0.8);
      --border-color: #30363d;
      --accent-blue: #58a6ff;
      --text-primary: #c9d1d9;
    }
    body {
      margin: 0;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, monospace;
      background: var(--bg-dark);
      color: var(--text-primary);
      display: grid;
      place-items: center;
      min-height: 100vh;
    }
    .card {
      background: var(--card-bg);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 24px;
      width: 380px;
      backdrop-filter: blur(8px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35);
    }
    .card h2 {
      font-size: 1.1rem;
      margin: 0 0 12px 0;
      color: #f0f6fc;
    }
    .metric {
      font-size: 2.2rem;
      font-weight: 700;
      color: var(--accent-blue);
    }
  </style>
</head>
<body>
  <div class="card">
    <h2>Realtime Compilation</h2>
    <div class="metric">99.98%</div>
    <p>Zero regression builds verified across 48 target suites.</p>
  </div>
</body>
</html>
`
  },
  {
    title: 'SQL: Window Analytics & Churn Cohort Query',
    languageId: 'sql',
    filename: 'cohort_analysis.sql',
    description: 'Multi-CTE analytical SQL query with window partitions and rolling averages.',
    code: `-- Monthly Cohort Retention and Net Expansion Revenue
WITH user_first_order AS (
    SELECT 
        user_id,
        DATE_TRUNC('month', MIN(created_at)) AS cohort_month
    FROM orders
    WHERE status = 'completed'
    GROUP BY user_id
),
monthly_activity AS (
    SELECT 
        o.user_id,
        ufo.cohort_month,
        DATE_TRUNC('month', o.created_at) AS activity_month,
        SUM(o.amount_usd) AS monthly_spend,
        COUNT(o.id) AS order_count
    FROM orders o
    JOIN user_first_order ufo ON o.user_id = ufo.user_id
    WHERE o.status = 'completed'
    GROUP BY 1, 2, 3
),
cohort_sizes AS (
    SELECT 
        cohort_month,
        COUNT(DISTINCT user_id) AS total_users
    FROM user_first_order
    GROUP BY cohort_month
)
SELECT 
    m.cohort_month,
    m.activity_month,
    cs.total_users AS original_cohort_size,
    COUNT(DISTINCT m.user_id) AS retained_users,
    ROUND(COUNT(DISTINCT m.user_id)::numeric / cs.total_users * 100, 2) AS retention_pct,
    ROUND(SUM(m.monthly_spend), 2) AS total_cohort_revenue,
    ROUND(AVG(m.monthly_spend), 2) AS arpu
FROM monthly_activity m
JOIN cohort_sizes cs ON m.cohort_month = cs.cohort_month
GROUP BY m.cohort_month, m.activity_month, cs.total_users
ORDER BY m.cohort_month DESC, m.activity_month ASC;
`
  },
  {
    title: 'C#: High Performance Generic Object Pool',
    languageId: 'csharp',
    filename: 'ObjectPool.cs',
    description: 'Thread-safe generic object pool utilizing ConcurrentBag.',
    code: `using System;
using System.Collections.Concurrent;

namespace CodeReplay.Collections
{
    public class ObjectPool<T> where T : class
    {
        private readonly ConcurrentBag<T> _objects;
        private readonly Func<T> _objectGenerator;
        private readonly Action<T>? _resetAction;

        public int Count => _objects.Count;

        public ObjectPool(Func<T> objectGenerator, Action<T>? resetAction = null, int initialCapacity = 16)
        {
            _objectGenerator = objectGenerator ?? throw new ArgumentNullException(nameof(objectGenerator));
            _resetAction = resetAction;
            _objects = new ConcurrentBag<T>();

            for (int i = 0; i < initialCapacity; i++)
            {
                _objects.Add(_objectGenerator());
            }
        }

        public T Rent()
        {
            if (_objects.TryTake(out T? item))
            {
                return item;
            }
            return _objectGenerator();
        }

        public void Return(T item)
        {
            if (item == null) throw new ArgumentNullException(nameof(item));
            _resetAction?.Invoke(item);
            _objects.Add(item);
        }
    }
}
`
  }
];
