export interface SampleSnippet {
  title: string;
  languageId: string;
  filename: string;
  description: string;
  code: string;
}

export const SAMPLE_SNIPPETS: SampleSnippet[] = [
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
