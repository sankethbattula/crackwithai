import { useEffect, useMemo, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Search, ChevronDown, Check } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const companyNotes = {
  Google: {
    focus: 'Heavy algorithms and system design',
    rounds: '4–5 coding rounds + 1 system design + 1 Googleyness',
    tip: 'Google values elegant solutions. Think about time/space complexity for every answer. Master graphs and DP — they appear in many Google interviews.',
    topTopics: ['Graphs', 'DP', 'System Design', 'Trees'],
  },
  Amazon: {
    focus: 'Leadership Principles + DSA',
    rounds: '4–5 rounds, each often includes LP-style questions',
    tip: 'Prepare STAR stories mapped to Leadership Principles. Arrays and trees are very common; behavioral depth matters as much as code.',
    topTopics: ['Arrays', 'Trees', 'LP Stories', 'OOP'],
  },
  Microsoft: {
    focus: 'Problem-solving approach + OOP design',
    rounds: '4–5 rounds, often includes “as appropriate” depth',
    tip: 'Microsoft values how you think. Narrate trade-offs clearly. Trees, graphs, and OOP-style design show up often.',
    topTopics: ['Trees', 'OOP', 'Graphs', 'Arrays'],
  },
  PayPal: {
    focus: 'Backend, APIs, security, payments',
    rounds: '3–4 technical + hiring manager',
    tip: 'Know REST, OAuth basics, SQL, and security fundamentals. Showing interest in payments and reliability helps.',
    topTopics: ['REST APIs', 'SQL', 'Security', 'Java'],
  },
  Adobe: {
    focus: 'Data structures + frontend + creativity',
    rounds: '3–4 coding + possible system design',
    tip: 'Balance strong DSA with clarity on frontend or product thinking if the role leans that way.',
    topTopics: ['Arrays', 'OOP', 'Design Patterns', 'Frontend'],
  },
  Meta: {
    focus: 'Speed + coding efficiency',
    rounds: '2 coding + 1 system design + 1 behavioral (typical)',
    tip: 'Practice writing clean code under time pressure. Graphs and trees are interview staples.',
    topTopics: ['Graphs', 'Trees', 'Arrays', 'System Design'],
  },
}

const ALL_COMPANIES = [
  'Google',
  'Meta',
  'Apple',
  'Amazon',
  'Netflix',
  'Microsoft',
  'Adobe',
  'Salesforce',
  'Oracle',
  'IBM',
  'Intel',
  'Nvidia',
  'Qualcomm',
  'Cisco',
  'VMware',
  'ServiceNow',
  'Workday',
  'Splunk',
  'Databricks',
  'Snowflake',
  'Palantir',
  'Stripe',
  'Square',
  'PayPal',
  'Uber',
  'Lyft',
  'Airbnb',
  'Twitter/X',
  'LinkedIn',
  'Snap',
  'Pinterest',
  'Reddit',
  'Zoom',
  'Dropbox',
  'Atlassian',
  'GitHub',
  'GitLab',
  'MongoDB',
  'Twilio',
  'Cloudflare',
  'Okta',
  'CrowdStrike',
  'Datadog',
  'Robinhood',
  'Coinbase',
  'DoorDash',
  'Instacart',
  'Shopify',
  'Etsy',
  'eBay',
  'Walmart Tech',
  'Goldman Sachs',
  'JPMorgan',
  'Bloomberg',
  'Morgan Stanley',
  'Capital One',
  'American Express',
  'Visa',
  'Mastercard',
  'Intuit',
  'Fidelity',
  'SAP',
  'Accenture',
  'TCS',
  'Infosys',
  'Wipro',
  'Tesla',
  'SpaceX',
  'Rivian',
  'Boeing',
  'Lockheed Martin',
]

const TOPIC_HEADINGS = {
  dsa: { title: 'Data Structures & Algorithms', sub: 'Interview-first problem patterns.', icon: '{}' },
  python: { title: 'Python', sub: 'Fast to learn, huge for AI and backend.', icon: '🐍' },
  java: { title: 'Java', sub: 'Strong OOP, JVM ecosystem, and enterprise patterns.', icon: '☕' },
  c: { title: 'C', sub: 'Memory, pointers, and systems thinking.', icon: 'C' },
  cpp: { title: 'C++', sub: 'STL, RAII, and performance-aware coding.', icon: 'C++' },
  sql: { title: 'SQL', sub: 'Queries analysts and backend engineers use daily.', icon: '🗄' },
  'system-design': { title: 'System Design', sub: 'End-to-end architecture for scale.', icon: '🏗' },
  'ml-ai': { title: 'ML & AI', sub: 'Foundations before deep models.', icon: '🧠' },
  'web-dev': { title: 'Web Development', sub: 'Modern frontend + HTTP APIs.', icon: '🌐' },
}

const EXPLORE_CARDS = [
  {
    id: 'dsa',
    title: 'Data Structures & Algorithms',
    description:
      'Master arrays, trees, graphs and DP. Crack any technical interview round.',
    bg: 'bg-[#3730a3]',
    icon: '{}',
    keywords: 'dsa algorithm array tree graph dp leetcode interview',
  },
  {
    id: 'python',
    title: 'Python',
    description: 'Most in-demand language. Essential for AI, data science and backend roles.',
    bg: 'bg-[#0369a1]',
    icon: '🐍',
    keywords: 'python ai data backend scripting',
  },
  {
    id: 'java',
    title: 'Java',
    description: 'Object-oriented powerhouse. Required at Google, Amazon and Microsoft.',
    bg: 'bg-[#b91c1c]',
    icon: '☕',
    keywords: 'java oop spring enterprise',
  },
  {
    id: 'c',
    title: 'C Language',
    description: 'Foundation of all programming. Master memory management and pointers.',
    bg: 'bg-[#6d28d9]',
    icon: 'C',
    keywords: 'c systems pointers memory embedded',
  },
  {
    id: 'cpp',
    title: 'C++',
    description: 'High performance computing. Essential for competitive programming.',
    bg: 'bg-[#065f46]',
    icon: 'C++',
    keywords: 'cpp stl competitive programming performance',
  },
  {
    id: 'sql',
    title: 'SQL',
    description: 'Query databases like a pro. Required for every data analyst and backend role.',
    bg: 'bg-[#92400e]',
    icon: '🗄',
    keywords: 'sql database query analytics postgres mysql',
  },
  {
    id: 'system-design',
    title: 'System Design',
    description: 'Design scalable systems. Essential for senior roles at FAANG companies.',
    bg: 'bg-[#0f766e]',
    icon: '🏗',
    keywords: 'system design scale distributed cache load balancer',
  },
  {
    id: 'ml-ai',
    title: 'ML & AI',
    description: 'Machine learning fundamentals and AI concepts explained simply.',
    bg: 'bg-[#7c2d12]',
    icon: '🧠',
    keywords: 'machine learning neural network ai data',
  },
]

/** Short labels for the sticky bottom topic switcher */
const TOPIC_PILL_LABELS = {
  dsa: 'DSA',
  python: 'Python',
  java: 'Java',
  c: 'C',
  cpp: 'C++',
  sql: 'SQL',
  'system-design': 'Design',
  'ml-ai': 'ML',
}

function companyAvatar(name) {
  const cleaned = name.replace(/[^a-zA-Z0-9]/g, '')
  const two = cleaned.slice(0, 2).toUpperCase()
  return two || 'CO'
}

function getCompanyNote(name) {
  if (companyNotes[name]) return companyNotes[name]
  return {
    focus: 'Strong DSA + communication + role-specific depth',
    rounds: 'Multiple technical rounds plus behavioral / hiring manager',
    tip: `Research ${name}'s products and recent launches. Tie your stories to impact, ownership, and clarity under ambiguity.`,
    topTopics: ['DSA', 'System Design basics', 'Behavioral', 'Domain basics'],
  }
}

function CodeBlock({ children }) {
  return (
    <pre className="mb-4 overflow-x-auto rounded-lg border-l-[3px] border-primary bg-[#1e1e2e] p-4 font-mono text-[14px] leading-relaxed text-[#cdd6f4]">
      {children}
    </pre>
  )
}

function Divider() {
  return <hr className="my-6 border-gray-200" />
}

function ResourceLink({ href, children }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-primary underline decoration-primary/40 underline-offset-2 transition hover:decoration-primary"
    >
      {children}
    </a>
  )
}

function AccordionRow({ id, openId, setOpenId, badge, badgeClass, title, right, children }) {
  const open = openId === id
  return (
    <div
      className={[
        'border-b border-gray-200 transition-colors duration-200',
        open ? 'border-l-[3px] border-l-primary bg-[#f9f5ff]' : 'border-l-[3px] border-l-transparent',
      ].join(' ')}
    >
      <button
        type="button"
        onClick={() => setOpenId(open ? null : id)}
        className={[
          'flex w-full items-center justify-between gap-4 px-4 py-4 text-left transition-colors duration-200',
          open ? '' : 'hover:bg-gray-50',
        ].join(' ')}
      >
        <div className="flex min-w-0 flex-1 flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
          <span
            className={[
              'inline-flex w-fit shrink-0 rounded-full px-3 py-1 text-xs font-semibold text-white',
              badgeClass,
            ].join(' ')}
          >
            {badge}
          </span>
          <div className="min-w-0">
            <div className="text-base font-semibold text-gray-900">{title}</div>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <span className="hidden text-sm text-gray-600 sm:inline">{right}</span>
          <ChevronDown
            className={['h-5 w-5 text-gray-500 transition-transform duration-300', open ? 'rotate-180' : ''].join(
              ' ',
            )}
          />
        </div>
      </button>
      <div
        className={['overflow-hidden transition-all duration-300 ease-in-out', open ? 'max-h-[10000px]' : 'max-h-0'].join(
          ' ',
        )}
      >
        <div className="border-t border-gray-100 bg-white px-4 py-6 sm:px-8">
          <div className="text-[15px] leading-[1.8] text-gray-800">{children}</div>
        </div>
      </div>
    </div>
  )
}

/** Shared system-design weeks — idPrefix "py-sd" (Python track) or "sd" (System Design topic card) */
function SystemDesignWeeks({ openId, setOpenId, idPrefix }) {
  const p = idPrefix
  return (
    <>
      <AccordionRow
        id={`${p}-w1`}
        openId={openId}
        setOpenId={setOpenId}
        badge="SD Week 1"
        badgeClass="bg-orange-500"
        title="System Design — Week 1: Fundamentals"
        right="Internet, LB, cache, DB, CAP"
      >
        <p className="mb-6 text-lg font-bold text-gray-900">SECTION: HOW THE INTERNET WORKS (DNS, HTTP, TCP/IP)</p>
        <p className="mb-1 font-semibold text-gray-900">DEFINITION:</p>
        <p className="mb-4">
          The internet is a network of networks. <strong>TCP/IP</strong> delivers bytes reliably between hosts.{' '}
          <strong>DNS</strong> maps human-readable names (google.com) to IP addresses. <strong>HTTP</strong> is the request/response protocol
          browsers and APIs use on top of TCP.
        </p>
        <p className="mb-1 font-semibold text-gray-900">WHY IT EXISTS:</p>
        <p className="mb-4">
          Without layered models, every app would reinvent routing, reliability, and naming. Standards let Google, Amazon, and
          Microsoft interoperate globally.
        </p>
        <p className="mb-1 font-semibold text-gray-900">HOW COMPANIES USE IT:</p>
        <p className="mb-4">
          Google runs massive DNS and edge infrastructure. Amazon API Gateway and CloudFront sit on HTTP. Microsoft Azure
          Traffic Manager uses DNS for geo-routing. Every microservice you design assumes HTTP + TLS + DNS.
        </p>
        <p className="mb-1 font-semibold text-gray-900">HOW IT WORKS:</p>
        <p className="mb-4">
          Client resolves DNS → opens TCP connection to IP:443 → TLS handshake → sends <code className="rounded bg-gray-100 px-1">GET /path HTTP/1.1</code> with headers → server responds with status + body. HTTP/2 multiplexes streams; HTTP/3 uses QUIC over UDP.
        </p>
        <p className="mb-2 font-semibold text-gray-900">CODE / CLI:</p>
        <CodeBlock>{`# See DNS resolution (example)
# dig api.stripe.com +short

# Simple HTTP GET (verbose)
# curl -v https://example.com`}</CodeBlock>
        <p className="mb-1 font-semibold text-gray-900">WHAT HAPPENS:</p>
        <p className="mb-4">
          Each hop (resolver, authoritative DNS, load balancer, app server) adds latency. Caching DNS and TLS session resumption
          reduces repeated work.
        </p>
        <p className="mb-1 font-semibold text-gray-900">COMMON MISTAKES:</p>
        <p className="mb-4">
          Confusing DNS TTL with HTTP cache headers; ignoring connection limits; designing APIs without idempotency for retries.
        </p>
        <Divider />
        <p className="mb-6 text-lg font-bold text-gray-900">SECTION: LOAD BALANCERS</p>
        <p className="mb-1 font-semibold text-gray-900">DEFINITION:</p>
        <p className="mb-4">
          A load balancer spreads incoming traffic across multiple healthy backend instances so no single server is overloaded
          and you can survive failures.
        </p>
        <p className="mb-1 font-semibold text-gray-900">WHY IT EXISTS:</p>
        <p className="mb-4">
          One machine cannot scale forever. LBs add horizontal scale and health checks so bad nodes stop receiving traffic.
        </p>
        <p className="mb-1 font-semibold text-gray-900">HOW COMPANIES USE IT:</p>
        <p className="mb-4">
          AWS ALB/NLB, GCP GLB, Azure Front Door, and on-prem F5/Nginx layers front almost every production service at Amazon,
          Google, and Microsoft.
        </p>
        <p className="mb-1 font-semibold text-gray-900">HOW IT WORKS:</p>
        <p className="mb-4">
          Algorithms: round-robin, least connections, IP hash (sticky sessions). L4 (TCP) vs L7 (HTTP) balancing. TLS
          termination at the edge saves CPU on app servers but centralizes certificate management.
        </p>
        <p className="mb-1 font-semibold text-gray-900">WHAT HAPPENS:</p>
        <p className="mb-4">
          Health probes mark instances in/out of rotation. During deploys, traffic drains gracefully (connection draining).
        </p>
        <p className="mb-1 font-semibold text-gray-900">COMMON MISTAKES:</p>
        <p className="mb-4">No health checks; thundering herd on cold instances; forgetting sticky sessions break cache affinity.</p>
        <Divider />
        <p className="mb-6 text-lg font-bold text-gray-900">SECTION: CACHING (REDIS, CDN)</p>
        <p className="mb-1 font-semibold text-gray-900">DEFINITION:</p>
        <p className="mb-4">
          A cache stores hot data in fast storage (RAM or edge POPs). <strong>CDN</strong> caches static assets geographically;{' '}
          <strong>Redis</strong> caches dynamic read-heavy data in memory.
        </p>
        <p className="mb-1 font-semibold text-gray-900">WHY IT EXISTS:</p>
        <p className="mb-4">Databases and origin servers are slower and more expensive per query than RAM or edge caches.</p>
        <p className="mb-1 font-semibold text-gray-900">HOW COMPANIES USE IT:</p>
        <p className="mb-4">
          Netflix caches video manifests and images on CDN. Amazon product pages cache fragments. Microsoft Teams caches session
          data in regional caches.
        </p>
        <p className="mb-1 font-semibold text-gray-900">HOW IT WORKS:</p>
        <p className="mb-4">
          Cache-aside: app reads cache, on miss loads DB and populates cache. TTL + eviction policies (LRU). Invalidate on
          writes or accept temporary inconsistency.
        </p>
        <p className="mb-1 font-semibold text-gray-900">WHAT HAPPENS:</p>
        <p className="mb-4">
          Cache hit → fast path. Cache miss → slower path + populate. Stampede risk if many misses at once — use locking or
          single-flight.
        </p>
        <p className="mb-1 font-semibold text-gray-900">COMMON MISTAKES:</p>
        <p className="mb-4">No TTL (stale forever); caching non-idempotent user-specific data globally; ignoring cache key design.</p>
        <Divider />
        <p className="mb-6 text-lg font-bold text-gray-900">SECTION: DATABASES (SQL VS NOSQL)</p>
        <p className="mb-1 font-semibold text-gray-900">DEFINITION:</p>
        <p className="mb-4">
          <strong>SQL</strong> databases (Postgres, MySQL) are relational, ACID-friendly, strong for joins. <strong>NoSQL</strong> (DynamoDB,
          Cassandra, Mongo) trades flexibility and scale patterns for different consistency models.
        </p>
        <p className="mb-1 font-semibold text-gray-900">WHY IT EXISTS:</p>
        <p className="mb-4">Different access patterns need different storage: OLTP, analytics, wide-column, document, graph.</p>
        <p className="mb-1 font-semibold text-gray-900">HOW COMPANIES USE IT:</p>
        <p className="mb-4">
          Amazon built Dynamo for always-on carts; Google uses Spanner and Bigtable; Microsoft SQL Server + Cosmos DB cover
          enterprise and global document/API patterns.
        </p>
        <p className="mb-1 font-semibold text-gray-900">HOW IT WORKS:</p>
        <p className="mb-4">
          Pick SQL when you need transactions + ad-hoc queries. Pick NoSQL when you need partition-key scalability, flexible
          schema, or huge write throughput with defined tradeoffs.
        </p>
        <p className="mb-1 font-semibold text-gray-900">WHAT HAPPENS:</p>
        <p className="mb-4">Wrong choice → painful migrations. Hybrid is normal: OLTP RDBMS + search (Elasticsearch) + object store.</p>
        <p className="mb-1 font-semibold text-gray-900">COMMON MISTAKES:</p>
        <p className="mb-4">Using Mongo for heavy relational reporting; sharding RDBMS without understanding hotspots.</p>
        <Divider />
        <p className="mb-6 text-lg font-bold text-gray-900">SECTION: CAP THEOREM</p>
        <p className="mb-1 font-semibold text-gray-900">DEFINITION:</p>
        <p className="mb-4">
          In a distributed system under partitions, you cannot simultaneously guarantee <strong>C</strong>onsistency, <strong>A</strong>vailability, and{' '}
          <strong>P</strong>artition tolerance — you pick tradeoffs along that triangle (practical systems usually choose CP or AP under
          partition).
        </p>
        <p className="mb-1 font-semibold text-gray-900">WHY IT EXISTS:</p>
        <p className="mb-4">Networks fail; designers must know what degrades: stale reads, errors, or partial outages.</p>
        <p className="mb-1 font-semibold text-gray-900">HOW COMPANIES USE IT:</p>
        <p className="mb-4">
          Banks lean consistent; social feeds may favor availability + eventual consistency. Interviewers want you to name what
          your product chooses when a datacenter partition happens.
        </p>
        <p className="mb-1 font-semibold text-gray-900">HOW IT WORKS:</p>
        <p className="mb-4">
          <strong>CP</strong>: block or error rather than return inconsistent data. <strong>AP</strong>: keep serving possibly stale data. Real systems
          add latency budgets, quorum (e.g. Dynamo-style), and repair.
        </p>
        <p className="mb-1 font-semibold text-gray-900">WHAT HAPPENS:</p>
        <p className="mb-4">During partition, UX and correctness tension surfaces — explain how you detect and heal inconsistency.</p>
        <p className="mb-1 font-semibold text-gray-900">COMMON MISTAKES:</p>
        <p className="mb-4">Claiming &quot;we have all three&quot;; ignoring real-world latency vs theoretical CAP.</p>
        <Divider />
        <p className="mb-4">
          <span className="mr-2">🎯</span>
          <strong>Practice</strong>
        </p>
        <p className="mb-4">Sketch DNS → LB → API → cache → DB for a product you use. Label one read path and one write path.</p>
        <p className="mb-2">
          <span className="mr-2">📚</span>
          <strong>Go Deeper</strong>
        </p>
        <ul className="list-disc space-y-1 pl-6 marker:text-primary">
          <li>
            <ResourceLink href="https://github.com/donnemartin/system-design-primer">System Design Primer</ResourceLink>
          </li>
          <li>
            <ResourceLink href="https://www.youtube.com/@ByteByteGo">ByteByteGo</ResourceLink>
          </li>
        </ul>
      </AccordionRow>

      <AccordionRow
        id={`${p}-w2`}
        openId={openId}
        setOpenId={setOpenId}
        badge="SD Week 2"
        badgeClass="bg-orange-500"
        title="System Design — Week 2: Design a URL Shortener"
        right="Requirements → scale → design"
      >
        <p className="mb-6 text-lg font-bold text-gray-900">SECTION: STEP 1 — CLARIFY REQUIREMENTS</p>
        <p className="mb-1 font-semibold text-gray-900">DEFINITION:</p>
        <p className="mb-4">Functional: shorten long URL → short code; redirect; optional custom alias, expiry, analytics clicks.</p>
        <p className="mb-1 font-semibold text-gray-900">WHY IT EXISTS:</p>
        <p className="mb-4">Ambiguous asks waste time; interviewers reward structured questions.</p>
        <p className="mb-1 font-semibold text-gray-900">HOW COMPANIES USE IT:</p>
        <p className="mb-4">PMs write PRDs; engineers validate SLAs, auth, and abuse scenarios the same way.</p>
        <p className="mb-1 font-semibold text-gray-900">NON-FUNCTIONAL:</p>
        <p className="mb-4">Latency (redirect p99), availability, consistency of mapping, rate limits, GDPR delete.</p>
        <Divider />
        <p className="mb-6 text-lg font-bold text-gray-900">SECTION: STEP 2 — ESTIMATE SCALE</p>
        <p className="mb-1 font-semibold text-gray-900">HOW IT WORKS:</p>
        <p className="mb-4">
          Assume 100M new URLs/month, 10:1 read:write, 5-year retention. QPS = reads/sec + writes/sec. Storage = record size ×
          count. Bandwidth for redirects.
        </p>
        <p className="mb-1 font-semibold text-gray-900">WHAT HAPPENS:</p>
        <p className="mb-4">Order-of-magnitude drives DB choice, cache size, and sharding key (short_code).</p>
        <p className="mb-1 font-semibold text-gray-900">COMMON MISTAKES:</p>
        <p className="mb-4">Ignoring hot keys (viral links); skipping replication factor in storage math.</p>
        <Divider />
        <p className="mb-6 text-lg font-bold text-gray-900">SECTION: STEP 3 — HIGH-LEVEL DESIGN</p>
        <p className="mb-1 font-semibold text-gray-900">DEFINITION:</p>
        <p className="mb-4">
          Clients → API service → ID generator (snowflake / counter range) → encode Base62 → write to DB → redirect service reads
          cache/DB.
        </p>
        <p className="mb-1 font-semibold text-gray-900">CODE (BASE62 SKETCH):</p>
        <CodeBlock>{`const CHARS = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
function encodeBase62(num) {
  let s = "";
  while (num > 0) { s = CHARS[num % 62] + s; num = Math.floor(num / 62); }
  return s || "0";
}`}</CodeBlock>
        <Divider />
        <p className="mb-6 text-lg font-bold text-gray-900">SECTION: STEP 4 — DEEP DIVE</p>
        <p className="mb-4">
          Collision handling; DB primary key on short_code; redirect 302 vs 301; analytics async via queue; rate limiting per
          API key; bloom filter optional for existence.
        </p>
        <Divider />
        <p className="mb-6 text-lg font-bold text-gray-900">SECTION: STEP 5 — TRADEOFFS</p>
        <p className="mb-4">
          Strong consistency vs redirect latency; SQL simplicity vs Dynamo partition scalability; global edge cache vs origin
          invalidation complexity.
        </p>
        <p className="mb-2">
          <span className="mr-2">🎯</span>
          <strong>Practice</strong>
        </p>
        <p className="mb-4">Redo the estimate with your own assumptions. Time yourself: 5 min requirements, 10 min math, 20 min diagram.</p>
        <p className="mb-2">
          <span className="mr-2">📚</span>
          <strong>Go Deeper</strong>
        </p>
        <ul className="list-disc space-y-1 pl-6 marker:text-primary">
          <li>
            <ResourceLink href="https://www.educative.io/courses/grokking-the-system-design-interview">Educative — Grokking SD</ResourceLink>
          </li>
        </ul>
      </AccordionRow>

      <AccordionRow
        id={`${p}-w3`}
        openId={openId}
        setOpenId={setOpenId}
        badge="SD Week 3"
        badgeClass="bg-orange-500"
        title="System Design — Week 3: Twitter, Netflix, Uber"
        right="Complex systems walkthrough"
      >
        <p className="mb-6 text-lg font-bold text-gray-900">SECTION: DESIGN TWITTER (SIMPLIFIED FEED)</p>
        <p className="mb-1 font-semibold text-gray-900">DEFINITION:</p>
        <p className="mb-4">Users post tweets; followers see a timeline — fan-out on write vs read, ranking, media storage.</p>
        <p className="mb-1 font-semibold text-gray-900">HOW IT WORKS:</p>
        <p className="mb-4">
          Post → write to tweets store + push to fan-out service (for celebs, pull model + merge). Timeline service assembles,
          caches home timelines in Redis, ML ranker scores candidates.
        </p>
        <p className="mb-1 font-semibold text-gray-900">COMMON MISTAKES:</p>
        <p className="mb-4">Fan-out write for 100M followers per tweet; ignoring eventual consistency on counts.</p>
        <Divider />
        <p className="mb-6 text-lg font-bold text-gray-900">SECTION: DESIGN NETFLIX (STREAMING OVERVIEW)</p>
        <p className="mb-1 font-semibold text-gray-900">DEFINITION:</p>
        <p className="mb-4">Encode video at many bitrates → object storage → Open Connect CDN edge caches → client adaptive bitrate.</p>
        <p className="mb-1 font-semibold text-gray-900">HOW COMPANIES USE IT:</p>
        <p className="mb-4">Metadata in NoSQL/RDBMS; viewing history drives recommendations (separate ML pipeline).</p>
        <p className="mb-1 font-semibold text-gray-900">COMMON MISTAKES:</p>
        <p className="mb-4">Ignoring DRM; serving video from app servers instead of CDN.</p>
        <Divider />
        <p className="mb-6 text-lg font-bold text-gray-900">SECTION: DESIGN UBER (LOCATION & MATCHING)</p>
        <p className="mb-1 font-semibold text-gray-900">DEFINITION:</p>
        <p className="mb-4">Drivers heartbeat location; riders request trips; matching finds nearby drivers; pricing surge logic.</p>
        <p className="mb-1 font-semibold text-gray-900">HOW IT WORKS:</p>
        <p className="mb-4">
          Geospatial index (grid, quadtree, Google S2); dispatch service; trip state machine; payments and fraud as separate
          services.
        </p>
        <p className="mb-1 font-semibold text-gray-900">COMMON MISTAKES:</p>
        <p className="mb-4">Brute-force distance to all drivers; no idempotency on ride creation.</p>
        <p className="mb-2 mt-4">
          <span className="mr-2">📚</span>
          <strong>Go Deeper</strong>
        </p>
        <ul className="list-disc space-y-1 pl-6 marker:text-primary">
          <li>
            <ResourceLink href="https://www.youtube.com/@ByteByteGo">ByteByteGo — case studies</ResourceLink>
          </li>
        </ul>
      </AccordionRow>

      <AccordionRow
        id={`${p}-w4`}
        openId={openId}
        setOpenId={setOpenId}
        badge="SD Week 4"
        badgeClass="bg-orange-500"
        title="System Design — Week 4: Interview Execution"
        right="45 minutes, pitfalls, signals"
      >
        <p className="mb-6 text-lg font-bold text-gray-900">SECTION: STRUCTURE IN 45 MINUTES</p>
        <p className="mb-1 font-semibold text-gray-900">HOW IT WORKS:</p>
        <ol className="mb-4 list-decimal space-y-2 pl-6 text-gray-800">
          <li>0–5 min: clarify functional + non-functional requirements.</li>
          <li>5–12 min: back-of-envelope QPS, storage, bandwidth.</li>
          <li>12–25 min: draw clients, API, services, data stores, async flows.</li>
          <li>25–40 min: deep dive (scaling DB, caching, consistency, failure).</li>
          <li>40–45 min: tradeoffs, monitoring, future work.</li>
        </ol>
        <Divider />
        <p className="mb-6 text-lg font-bold text-gray-900">SECTION: COMMON MISTAKES</p>
        <ul className="mb-4 list-disc space-y-2 pl-6 text-gray-800">
          <li>Jumping to tools before requirements.</li>
          <li>No estimates or absurd numbers without sanity check.</li>
          <li>Single box &quot;App&quot; with no data flow.</li>
          <li>Ignoring failure modes (DB down, partition).</li>
          <li>No tradeoffs — everything cannot be strongest consistency and lowest latency.</li>
        </ul>
        <Divider />
        <p className="mb-6 text-lg font-bold text-gray-900">SECTION: WHAT INTERVIEWERS LOOK FOR</p>
        <p className="mb-4">
          Structured communication, sensible tradeoffs, familiarity with real components (LB, cache, DB, queue), and curiosity
          when you ask clarifying questions — the same skills Google, Amazon, and Microsoft expect from mid/senior hires.
        </p>
        <p className="mb-2">
          <span className="mr-2">🎯</span>
          <strong>Practice</strong>
        </p>
        <p className="mb-4">Record yourself designing paste-bin or chat. Listen for silence gaps and jargon without definition.</p>
      </AccordionRow>
    </>
  )
}

function PythonCurriculum({ openId, setOpenId }) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <AccordionRow
        id="py-d1"
        openId={openId}
        setOpenId={setOpenId}
        badge="Phase 1"
        badgeClass="bg-blue-600"
        title="Python — Day 1"
        right="Core fundamentals"
      >
        <p className="mb-6 text-lg font-bold text-gray-900">SECTION: VARIABLES AND DATA TYPES</p>
        <p className="mb-1 font-semibold text-gray-900">DEFINITION:</p>
        <p className="mb-4">
          A variable is a named storage location in your computer&apos;s memory. Think of it like a labeled box where you store
          information that your program can use and change later.
        </p>
        <p className="mb-1 font-semibold text-gray-900">WHY IT EXISTS:</p>
        <p className="mb-4">
          Without variables, your program cannot remember anything. Every piece of data — a user&apos;s name, their age, their
          score — needs a place to live while your program runs.
        </p>
        <p className="mb-1 font-semibold text-gray-900">HOW COMPANIES USE IT:</p>
        <p className="mb-4">
          When you log into Google, their server creates variables like user_email, user_id, is_logged_in. When Amazon shows
          you a product, variables store product_name, product_price, items_in_cart. Every program ever written uses variables.
        </p>
        <p className="mb-1 font-semibold text-gray-900">THE 4 MAIN DATA TYPES IN PYTHON:</p>
        <p className="mb-4">
          Python automatically detects what type of data you are storing. You never have to say &quot;this is a number&quot;
          explicitly like in Java or C.
        </p>
        <ul className="mb-4 list-disc space-y-1 pl-6 text-gray-800">
          <li>STRING — stores text (words, sentences, names)</li>
          <li>INTEGER — stores whole numbers (age, count, id)</li>
          <li>FLOAT — stores decimal numbers (price, gpa, rating)</li>
          <li>BOOLEAN — stores True or False only</li>
        </ul>
        <p className="mb-2 font-semibold text-gray-900">CODE:</p>
        <CodeBlock>{`name = "Sai"          # string: text goes in quotes
age = 25              # integer: whole number, no quotes
gpa = 3.9             # float: has a decimal point
is_employed = True    # boolean: capital T, no quotes

# Python tells you what type it is
print(type(name))        # output: <class 'str'>
print(type(age))         # output: <class 'int'>
print(type(gpa))         # output: <class 'float'>
print(type(is_employed)) # output: <class 'bool'>`}</CodeBlock>
        <p className="mb-1 font-semibold text-gray-900">WHAT HAPPENS WHEN YOU RUN THIS:</p>
        <p className="mb-4">
          Python reads each line top to bottom. Line 1: creates a box called &quot;name&quot;, puts &quot;Sai&quot; in it. Line
          2: creates a box called &quot;age&quot;, puts 25 in it. When you print(type(name)), Python looks inside the
          &quot;name&quot; box, sees text, and tells you it is a string.
        </p>
        <p className="mb-1 font-semibold text-gray-900">COMMON MISTAKES BEGINNERS MAKE:</p>
        <p className="mb-2">Mistake 1: Forgetting quotes around strings</p>
        <CodeBlock>{`name = Sai      # WRONG — Python thinks Sai is a variable
name = "Sai"    # CORRECT`}</CodeBlock>
        <p className="mb-2">Mistake 2: Mixing up = and ==</p>
        <CodeBlock>{`age = 25        # assigns value (stores 25 in age)
age == 25       # checks if age equals 25 (comparison)`}</CodeBlock>

        <Divider />
        <p className="mb-6 text-lg font-bold text-gray-900">SECTION: LISTS</p>
        <p className="mb-1 font-semibold text-gray-900">DEFINITION:</p>
        <p className="mb-4">
          A list is an ordered collection of items stored together under one name. Like a shopping list — multiple items,
          numbered in order, you can add or remove items anytime.
        </p>
        <p className="mb-1 font-semibold text-gray-900">WHY IT EXISTS:</p>
        <p className="mb-4">
          If you have 100 student names, you do not want 100 separate variables. A list holds all of them in one place. You can
          loop through them, sort them, search them, add or remove items easily.
        </p>
        <p className="mb-1 font-semibold text-gray-900">HOW COMPANIES USE IT:</p>
        <p className="mb-4">
          Netflix stores your watch history as a list. Amazon stores your cart items as a list. Google stores search results as
          a list. Every feed, every recommendation, every search result you see is a list being processed.
        </p>
        <p className="mb-1 font-semibold text-gray-900">HOW IT WORKS:</p>
        <p className="mb-4">
          Items are stored in numbered positions called indexes. Counting starts at 0, not 1. This confuses beginners. Position
          0 = first item. Position 1 = second item. Position -1 = last item (shortcut).
        </p>
        <p className="mb-2 font-semibold text-gray-900">CODE:</p>
        <CodeBlock>{`# Create a list
companies = ["Google", "Microsoft", "PayPal", "Amazon"]

# Access items by position (index)
print(companies[0])   # Google (first item, index 0)
print(companies[1])   # Microsoft (second item, index 1)
print(companies[-1])  # Amazon (last item, -1 shortcut)

# Get the number of items
print(len(companies)) # 4

# Add an item to the end
companies.append("Adobe")
# companies is now: ["Google","Microsoft","PayPal",
#                    "Amazon","Adobe"]

# Remove a specific item
companies.remove("PayPal")
# companies is now: ["Google","Microsoft","Amazon","Adobe"]

# Get a slice (portion) of the list
print(companies[0:2]) # ["Google", "Microsoft"]
# starts at index 0, stops BEFORE index 2

# Loop through every item
for company in companies:
    print("I want to work at", company)
# Output:
# I want to work at Google
# I want to work at Microsoft
# I want to work at Amazon
# I want to work at Adobe`}</CodeBlock>
        <p className="mb-1 font-semibold text-gray-900">WHAT HAPPENS WHEN YOU RUN THIS:</p>
        <p className="mb-4">
          Python creates a list with 4 items in memory. Each item gets an address: 0, 1, 2, 3. When you say companies[0],
          Python goes to address 0 and fetches &quot;Google&quot;. append() adds to the end — no new address needed, it just
          extends the list.
        </p>
        <p className="mb-1 font-semibold text-gray-900">COMMON MISTAKES:</p>
        <p className="mb-2">Mistake: Index out of range error</p>
        <CodeBlock>{`companies = ["Google", "Microsoft"]
companies[2]  # ERROR — only index 0 and 1 exist`}</CodeBlock>
        <p className="mb-2">Mistake: Forgetting that index starts at 0</p>
        <CodeBlock>{`companies[1]  # gives you SECOND item, not first`}</CodeBlock>

        <Divider />
        <p className="mb-6 text-lg font-bold text-gray-900">SECTION: DICTIONARY</p>
        <p className="mb-1 font-semibold text-gray-900">DEFINITION:</p>
        <p className="mb-4">
          A dictionary stores data as key-value pairs. Instead of numbered positions like a list, you access items using a
          meaningful name (key). Like a real dictionary: you look up a word (key) and get the definition (value).
        </p>
        <p className="mb-1 font-semibold text-gray-900">WHY IT EXISTS:</p>
        <p className="mb-4">
          Sometimes numbered positions make no sense. A student profile has name, age, gpa, university. A dictionary lets you
          access them by name, not number. student[&quot;name&quot;] is clearer than student[0].
        </p>
        <p className="mb-1 font-semibold text-gray-900">HOW COMPANIES USE IT:</p>
        <p className="mb-4">
          Every user profile at every company is a dictionary. When you log into LinkedIn, your profile is fetched as a
          dictionary: {'{name: "Sai", role: "SWE", company: "Minspark", connections: 500}'}. APIs return data as dictionaries
          (JSON format). This is the most important data structure for web development and data science.
        </p>
        <p className="mb-2 font-semibold text-gray-900">CODE:</p>
        <CodeBlock>{`# Create a dictionary
student = {
    "name": "Sai",
    "age": 25,
    "gpa": 3.9,
    "university": "ASU",
    "target_companies": ["Google", "Microsoft"]
}

# Access a value using its key
print(student["name"])        # Sai
print(student["gpa"])         # 3.9

# Change a value
student["gpa"] = 4.0
print(student["gpa"])         # 4.0

# Add a new key-value pair
student["city"] = "Tempe"
print(student["city"])        # Tempe

# Check if a key exists
if "name" in student:
    print("Name is:", student["name"])

# Loop through all keys and values
for key, value in student.items():
    print(key, ":", value)
# Output:
# name : Sai
# age : 25
# gpa : 4.0
# university : ASU
# target_companies : ['Google', 'Microsoft']
# city : Tempe

# Safe access — get() does not crash if key missing
phone = student.get("phone", "Not provided")
print(phone)  # Not provided (key does not exist)`}</CodeBlock>
        <p className="mb-1 font-semibold text-gray-900">WHAT HAPPENS:</p>
        <p className="mb-4">
          Python stores each key-value pair in a hash table. When you say student[&quot;gpa&quot;], Python hashes &quot;gpa&quot;
          to instantly find its location — O(1) lookup. This is why dictionaries are incredibly fast.
        </p>
        <p className="mb-1 font-semibold text-gray-900">COMMON MISTAKES:</p>
        <CodeBlock>{`student["phone"]  # crashes if "phone" key missing
student.get("phone")  # returns None safely
student.get("phone", "N/A")  # returns "N/A" safely`}</CodeBlock>

        <Divider />
        <p className="mb-6 text-lg font-bold text-gray-900">SECTION: CONTROL FLOW (if/elif/else)</p>
        <p className="mb-1 font-semibold text-gray-900">DEFINITION:</p>
        <p className="mb-4">
          Control flow is how your program makes decisions. The if statement runs a block of code ONLY IF a condition is True.
          Like a fork in the road — your program chooses which path to take.
        </p>
        <p className="mb-1 font-semibold text-gray-900">WHY IT EXISTS:</p>
        <p className="mb-4">
          Without decisions, your program does the same thing every time. Real programs need to react differently based on the
          situation: If user is logged in → show dashboard. If user is not logged in → redirect to login page.
        </p>
        <p className="mb-1 font-semibold text-gray-900">HOW COMPANIES USE IT:</p>
        <p className="mb-4">
          Google uses if statements to decide what ads to show. Amazon uses if statements to apply discounts: if purchase_total
          &gt; 100: apply_free_shipping(). Netflix uses if statements to recommend content: if user_likes_action:
          recommend_action_movies().
        </p>
        <p className="mb-2 font-semibold text-gray-900">CODE:</p>
        <CodeBlock>{`# Simple if statement
score = 85

if score >= 90:
    print("Grade: A")
    print("Excellent work!")
elif score >= 80:       # elif = else if
    print("Grade: B")  # this runs because 85 >= 80
    print("Good work!")
elif score >= 70:
    print("Grade: C")
else:                   # runs if nothing above is True
    print("Below C, keep studying")

# Output: Grade: B
#         Good work!

# Why elif and not multiple ifs?
# Multiple ifs ALL get checked
# elif stops checking once one is True
# Use elif when conditions are related

# Combining conditions
gpa = 3.9
university = "ASU"

if gpa >= 3.5 and university == "ASU":
    print("Sun Devil Honor Roll!")  # both must be True

if gpa >= 3.5 or university == "MIT":
    print("Strong candidate")  # either one is enough

# One-line if (ternary operator)
status = "Pass" if score >= 60 else "Fail"
print(status)  # Pass`}</CodeBlock>
        <p className="mb-1 font-semibold text-gray-900">WHAT HAPPENS:</p>
        <p className="mb-4">
          Python reads the if condition first. score &gt;= 90 → is 85 &gt;= 90? No → skip this block. score &gt;= 80 → is 85
          &gt;= 80? Yes → run this block. Since a block ran, skip all remaining elif and else. Program continues after the entire
          if/elif/else.
        </p>

        <Divider />
        <p className="mb-6 text-lg font-bold text-gray-900">SECTION: LOOPS</p>
        <p className="mb-1 font-semibold text-gray-900">DEFINITION:</p>
        <p className="mb-4">
          A loop repeats a block of code multiple times. Instead of writing the same code 100 times, you write it once and tell
          Python to repeat it.
        </p>
        <p className="mb-1 font-semibold text-gray-900">WHY IT EXISTS:</p>
        <p className="mb-4">
          If you have 1000 students and need to print each name, you cannot write 1000 print statements. A loop does it in 3
          lines regardless of size.
        </p>
        <p className="mb-1 font-semibold text-gray-900">HOW COMPANIES USE IT:</p>
        <p className="mb-4">
          Amazon loops through every item in your cart to calculate total price. LinkedIn loops through your connections to show
          their posts. Spotify loops through songs to build your playlist.
        </p>
        <p className="mb-4 font-semibold text-gray-900">FOR LOOP — use when you know how many times:</p>
        <p className="mb-2 font-semibold text-gray-900">CODE:</p>
        <CodeBlock>{`# Loop through a list
companies = ["Google", "Microsoft", "PayPal"]
for company in companies:
    print("Preparing for", company, "interview")
# Output:
# Preparing for Google interview
# Preparing for Microsoft interview
# Preparing for PayPal interview

# Loop a specific number of times using range()
for i in range(5):          # 0, 1, 2, 3, 4
    print("Attempt", i + 1) # +1 so it shows 1-5

# range(start, stop, step)
for i in range(0, 10, 2):   # 0, 2, 4, 6, 8
    print(i)

# Loop with index using enumerate()
for index, company in enumerate(companies):
    print(index, "-", company)
# Output:
# 0 - Google
# 1 - Microsoft
# 2 - PayPal`}</CodeBlock>
        <p className="mb-4 font-semibold text-gray-900">WHILE LOOP — use when you do not know how many times:</p>
        <p className="mb-2 font-semibold text-gray-900">CODE:</p>
        <CodeBlock>{`# Keep asking until valid input
attempts = 0
max_attempts = 3

while attempts < max_attempts:
    password = input("Enter password: ")
    if password == "correct":
        print("Access granted!")
        break        # exits the loop immediately
    attempts += 1
    print(f"Wrong. {max_attempts - attempts} left")

# break — exits loop immediately
# continue — skips to next iteration`}</CodeBlock>

        <Divider />
        <p className="mb-6 text-lg font-bold text-gray-900">SECTION: FUNCTIONS</p>
        <p className="mb-1 font-semibold text-gray-900">DEFINITION:</p>
        <p className="mb-4">
          A function is a named, reusable block of code. You write it once, give it a name, and call it anywhere in your program
          as many times as you need.
        </p>
        <p className="mb-1 font-semibold text-gray-900">WHY IT EXISTS:</p>
        <p className="mb-4">
          Without functions, you repeat the same code in multiple places. If you need to change it, you change it everywhere and
          miss some. Functions fix this — change it once, fixed everywhere. This is called the DRY principle: Do Not Repeat
          Yourself.
        </p>
        <p className="mb-1 font-semibold text-gray-900">HOW COMPANIES USE IT:</p>
        <p className="mb-4">
          Every feature at every company is a function. calculate_shipping_cost() at Amazon. get_recommended_movies() at
          Netflix. validate_payment() at PayPal. send_notification() at every app.
        </p>
        <p className="mb-2 font-semibold text-gray-900">CODE:</p>
        <CodeBlock>{`# Define a function (blueprint)
def calculate_gpa(grades):
    # grades is a parameter — value passed in
    total = sum(grades)
    count = len(grades)
    return total / count  # return sends value back

# Call the function (use it)
my_grades = [4.0, 3.7, 4.0, 3.3, 4.0]
result = calculate_gpa(my_grades)
print(f"Your GPA is: {result}")  # 3.8

# Function with default parameter
def greet(name, greeting="Hello"):
    return f"{greeting}, {name}!"

print(greet("Sai"))              # Hello, Sai!
print(greet("Sai", "Welcome"))  # Welcome, Sai!

# Function that returns multiple values
def get_stats(numbers):
    return min(numbers), max(numbers), sum(numbers)

low, high, total = get_stats([3, 1, 4, 1, 5, 9])
print(low, high, total)   # 1 9 23`}</CodeBlock>
        <p className="mb-1 font-semibold text-gray-900">WHAT HAPPENS:</p>
        <p className="mb-4">
          When Python sees def calculate_gpa, it stores the function in memory but does NOT run it yet. When you call
          calculate_gpa(my_grades), Python: 1. Creates a temporary variable grades = my_grades. 2. Runs every line inside the
          function. 3. When it hits return, sends that value back. 4. The function disappears from memory.
        </p>
        <p className="mb-1 font-semibold text-gray-900">COMMON MISTAKES:</p>
        <CodeBlock>{`def greet():
    message = "Hello"  # defined inside function

print(message)  # ERROR — message only exists
                # inside the function (local scope)`}</CodeBlock>

        <Divider />
        <p className="mb-4 mt-6">
          <span className="mr-2">🎯</span>
          <strong>Practice Problems — Do These Today</strong>
        </p>
        <ol className="mb-6 list-decimal space-y-2 pl-6 marker:text-primary">
          <li>Print your name five ways (uppercase, lowercase, reversed, length, first letter only).</li>
          <li>Build a dictionary with your info: name, age, university, and target company.</li>
          <li>Write a function that returns whether a number is even or odd.</li>
          <li>Create a list of your top five target companies and print each with a for loop.</li>
          <li>Write a function that takes a list of numbers and returns only the even ones.</li>
        </ol>
        <p className="mb-2">
          <span className="mr-2">📚</span>
          <strong>Go Deeper</strong>
        </p>
        <ul className="list-disc space-y-1 pl-6 marker:text-primary">
          <li>
            <ResourceLink href="https://docs.python.org/3/">Python Official Docs</ResourceLink>
          </li>
          <li>
            <ResourceLink href="https://www.youtube.com/results?search_query=freecodecamp+python+full+course">
              FreeCodeCamp Python (YouTube)
            </ResourceLink>
          </li>
          <li>
            <ResourceLink href="https://www.w3schools.com/python/">W3Schools Python</ResourceLink>
          </li>
        </ul>
      </AccordionRow>

      <AccordionRow
        id="py-d2"
        openId={openId}
        setOpenId={setOpenId}
        badge="Phase 1"
        badgeClass="bg-blue-600"
        title="Python — Day 2"
        right="OOP, files, libraries"
      >
        <p className="mb-6 text-lg font-bold text-gray-900">SECTION: CLASSES AND OBJECTS (OOP BASICS)</p>
        <p className="mb-1 font-semibold text-gray-900">DEFINITION:</p>
        <p className="mb-4">
          A <strong>class</strong> is a blueprint for creating <strong>objects</strong>. An object bundles data (attributes) and
          behavior (methods) together. <code className="rounded bg-gray-100 px-1">self</code> refers to the specific instance the
          code is acting on.
        </p>
        <p className="mb-1 font-semibold text-gray-900">WHY IT EXISTS:</p>
        <p className="mb-4">
          Large programs need structure. Modeling &quot;Student,&quot; &quot;Order,&quot; or &quot;Payment&quot; as classes keeps
          related logic in one place, reduces bugs, and matches how teams design real systems.
        </p>
        <p className="mb-1 font-semibold text-gray-900">HOW COMPANIES USE IT:</p>
        <p className="mb-4">
          At Stripe or PayPal, classes represent payments, customers, and ledgers. At Uber, classes model drivers, trips, and
          pricing rules. The same patterns you learn here appear in production codebases.
        </p>
        <p className="mb-1 font-semibold text-gray-900">HOW IT WORKS:</p>
        <p className="mb-4">
          <code className="rounded bg-gray-100 px-1">__init__</code> runs when you create an object. Instance attributes live on{' '}
          <code className="rounded bg-gray-100 px-1">self</code>. Methods are functions that take <code className="rounded bg-gray-100 px-1">self</code> as the first parameter so they can read and update that object&apos;s state.
        </p>
        <p className="mb-2 font-semibold text-gray-900">CODE:</p>
        <CodeBlock>{`class Student:
    # __init__ runs once when you create a Student object
    def __init__(self, name, gpa, university):
        self.name = name              # store name on this instance
        self.gpa = gpa
        self.university = university

    def introduce(self):
        # self.name is THIS student's name
        return f"I am {self.name} from {self.university}"

    def is_honor_roll(self):
        return self.gpa >= 3.5

# Create objects (instances) from the blueprint
sai = Student("Sai", 3.9, "ASU")
print(sai.introduce())       # I am Sai from ASU
print(sai.is_honor_roll())   # True`}</CodeBlock>
        <p className="mb-1 font-semibold text-gray-900">WHAT HAPPENS:</p>
        <p className="mb-4">
          Calling <code className="rounded bg-gray-100 px-1">Student(...)</code> allocates an object, runs{' '}
          <code className="rounded bg-gray-100 px-1">__init__</code>, and binds <code className="rounded bg-gray-100 px-1">sai</code> to that object. Methods receive that same object as{' '}
          <code className="rounded bg-gray-100 px-1">self</code> automatically.
        </p>
        <p className="mb-1 font-semibold text-gray-900">COMMON MISTAKES:</p>
        <CodeBlock>{`# Forgetting self in method definition
def bad_introduce():  # should be def introduce(self):
    return self.name  # NameError — no self

# Forgetting to call __init__ arguments
# s = Student()  # TypeError if __init__ requires arguments`}</CodeBlock>

        <Divider />
        <p className="mb-6 text-lg font-bold text-gray-900">SECTION: INHERITANCE</p>
        <p className="mb-1 font-semibold text-gray-900">DEFINITION:</p>
        <p className="mb-4">
          Inheritance lets a <strong>child class</strong> reuse and extend a <strong>parent class</strong>. The child gets the
          parent&apos;s methods and attributes unless it overrides them.
        </p>
        <p className="mb-1 font-semibold text-gray-900">WHY IT EXISTS:</p>
        <p className="mb-4">
          You should not copy-paste the same fields and methods for &quot;GradStudent&quot; and &quot;Undergrad.&quot; Inheritance
          shares the common &quot;Student&quot; core and only adds what is different.
        </p>
        <p className="mb-1 font-semibold text-gray-900">HOW COMPANIES USE IT:</p>
        <p className="mb-4">
          Frameworks use inheritance everywhere: base &quot;Model&quot; classes, custom exceptions extending a common base, or
          plugin interfaces where each plugin subclasses a core handler.
        </p>
        <p className="mb-1 font-semibold text-gray-900">HOW IT WORKS:</p>
        <p className="mb-4">
          Write <code className="rounded bg-gray-100 px-1">class Child(Parent):</code>. Call{' '}
          <code className="rounded bg-gray-100 px-1">super()</code> to run the parent&apos;s version of a method (often inside{' '}
          <code className="rounded bg-gray-100 px-1">__init__</code>) so you do not duplicate setup logic.
        </p>
        <p className="mb-2 font-semibold text-gray-900">CODE:</p>
        <CodeBlock>{`class GradStudent(Student):
    def __init__(self, name, gpa, university, thesis):
        super().__init__(name, gpa, university)  # run Student.__init__
        self.thesis = thesis                     # grad-only field

    def introduce(self):
        base = super().introduce()               # reuse parent's string
        return f"{base}, researching {self.thesis}"

g = GradStudent("Sai", 3.9, "ASU", "ML systems")
print(g.introduce())`}</CodeBlock>
        <p className="mb-1 font-semibold text-gray-900">WHAT HAPPENS:</p>
        <p className="mb-4">
          Python looks up methods on the instance, then the class, then parent classes (MRO). Overriding{' '}
          <code className="rounded bg-gray-100 px-1">introduce</code> in <code className="rounded bg-gray-100 px-1">GradStudent</code> replaces the parent behavior for grad instances only.
        </p>
        <p className="mb-1 font-semibold text-gray-900">COMMON MISTAKES:</p>
        <CodeBlock>{`# Forgetting super().__init__ — parent fields never set
# Overusing inheritance; sometimes composition (has-a) fits better`}</CodeBlock>

        <Divider />
        <p className="mb-6 text-lg font-bold text-gray-900">SECTION: THE FOUR PILLARS OF OOP</p>
        <p className="mb-1 font-semibold text-gray-900">DEFINITION:</p>
        <p className="mb-4">
          Interviewers often ask for the four pillars: <strong>encapsulation, inheritance, polymorphism, abstraction</strong>.
          They describe how to hide detail, reuse code, swap behaviors, and expose simple interfaces.
        </p>
        <p className="mb-1 font-semibold text-gray-900">WHY IT EXISTS:</p>
        <p className="mb-4">
          These ideas keep code maintainable as teams and features grow. They are vocabulary for discussing design in code
          reviews and interviews.
        </p>
        <p className="mb-1 font-semibold text-gray-900">HOW COMPANIES USE IT:</p>
        <p className="mb-4">
          Public APIs are <strong>abstraction</strong>. Internal fields with getters/setters are{' '}
          <strong>encapsulation</strong>. Plugin systems rely on <strong>polymorphism</strong> (many classes, one interface).
        </p>
        <p className="mb-1 font-semibold text-gray-900">HOW IT WORKS:</p>
        <ul className="mb-4 list-disc space-y-2 pl-6 text-gray-800">
          <li>
            <strong>Encapsulation</strong> — hide internals; expose only safe methods (like not letting balance go negative).
          </li>
          <li>
            <strong>Inheritance</strong> — IS-A relationship; child extends parent.
          </li>
          <li>
            <strong>Polymorphism</strong> — same method name, different classes respond differently (e.g.{' '}
            <code className="rounded bg-gray-100 px-1">speak()</code> on Dog vs Cat).
          </li>
          <li>
            <strong>Abstraction</strong> — simple surface (e.g. <code className="rounded bg-gray-100 px-1">charge_card()</code>) hiding complex steps.
          </li>
        </ul>
        <p className="mb-2 font-semibold text-gray-900">CODE (polymorphism sketch):</p>
        <CodeBlock>{`class Dog:
    def speak(self):
        return "Woof"

class Cat:
    def speak(self):
        return "Meow"

for animal in [Dog(), Cat()]:
    print(animal.speak())  # same call, different behavior`}</CodeBlock>
        <p className="mb-1 font-semibold text-gray-900">WHAT HAPPENS:</p>
        <p className="mb-4">
          Python resolves <code className="rounded bg-gray-100 px-1">speak</code> on the actual class of each object — that is polymorphism in action.
        </p>
        <p className="mb-1 font-semibold text-gray-900">COMMON MISTAKES:</p>
        <p className="mb-4">
          Memorizing buzzwords without examples. Always tie each pillar to a concrete class or API you can describe in one
          sentence.
        </p>

        <Divider />
        <p className="mb-6 text-lg font-bold text-gray-900">SECTION: FILE HANDLING</p>
        <p className="mb-1 font-semibold text-gray-900">DEFINITION:</p>
        <p className="mb-4">
          File handling is reading from or writing to files on disk using Python. The <code className="rounded bg-gray-100 px-1">with</code> statement ensures files close
          automatically even if an error occurs.
        </p>
        <p className="mb-1 font-semibold text-gray-900">WHY IT EXISTS:</p>
        <p className="mb-4">
          Programs need logs, configs, exports, and imports. Interview tasks often include &quot;parse this file&quot; or &quot;write
          results to CSV.&quot;
        </p>
        <p className="mb-1 font-semibold text-gray-900">HOW COMPANIES USE IT:</p>
        <p className="mb-4">
          ETL jobs read raw files; services write audit logs; tools generate reports. In production, object storage (S3) is
          common, but the same read/write patterns apply.
        </p>
        <p className="mb-1 font-semibold text-gray-900">HOW IT WORKS:</p>
        <p className="mb-4">
          Open with a mode: <code className="rounded bg-gray-100 px-1">&quot;r&quot;</code> read, <code className="rounded bg-gray-100 px-1">&quot;w&quot;</code> overwrite write, <code className="rounded bg-gray-100 px-1">&quot;a&quot;</code> append. Iterate lines to avoid loading huge files into memory at once.
        </p>
        <p className="mb-2 font-semibold text-gray-900">CODE:</p>
        <CodeBlock>{`# Read entire file into one string
with open("resume.txt", "r", encoding="utf-8") as file:
    content = file.read()
    print(content[:200])  # first 200 chars

# Write a new file (creates or truncates)
with open("output.txt", "w", encoding="utf-8") as file:
    file.write("Hello from Python!\\n")

# Read line by line — memory friendly
with open("data.txt", "r", encoding="utf-8") as file:
    for line in file:
        print(line.strip())  # strip removes newline`}</CodeBlock>
        <p className="mb-1 font-semibold text-gray-900">WHAT HAPPENS:</p>
        <p className="mb-4">
          The OS opens a file descriptor; Python wraps it in a file object. Exiting the <code className="rounded bg-gray-100 px-1">with</code> block closes the file. Wrong
          encoding can mangle text — <code className="rounded bg-gray-100 px-1">utf-8</code> is the usual default for modern apps.
        </p>
        <p className="mb-1 font-semibold text-gray-900">COMMON MISTAKES:</p>
        <CodeBlock>{`# Forgetting encoding on non-ASCII text
# Using "w" when you meant to append — it wipes the file
# Skipping a with-block — file may stay open if an exception fires`}</CodeBlock>

        <Divider />
        <p className="mb-6 text-lg font-bold text-gray-900">SECTION: ERROR HANDLING (try / except)</p>
        <p className="mb-1 font-semibold text-gray-900">DEFINITION:</p>
        <p className="mb-4">
          <code className="rounded bg-gray-100 px-1">try</code> runs code that might fail. <code className="rounded bg-gray-100 px-1">except</code> catches specific error types so you can recover or show a clear message instead of crashing.
        </p>
        <p className="mb-1 font-semibold text-gray-900">WHY IT EXISTS:</p>
        <p className="mb-4">
          Users type invalid input. Networks drop. Files go missing. Robust programs anticipate failures and handle them
          deliberately.
        </p>
        <p className="mb-1 font-semibold text-gray-900">HOW COMPANIES USE IT:</p>
        <p className="mb-4">
          APIs return friendly errors when parsing fails. Checkout flows catch payment errors and retry or surface a support
          path. Logging often happens in <code className="rounded bg-gray-100 px-1">except</code> blocks.
        </p>
        <p className="mb-1 font-semibold text-gray-900">HOW IT WORKS:</p>
        <p className="mb-4">
          Exceptions bubble up until a matching <code className="rounded bg-gray-100 px-1">except</code> catches them. <code className="rounded bg-gray-100 px-1">finally</code> runs whether or not an error occurred — good for cleanup.
        </p>
        <p className="mb-2 font-semibold text-gray-900">CODE:</p>
        <CodeBlock>{`try:
    number = int(input("Enter a number: "))
    result = 100 / number
    print(result)
except ValueError:
    print("That is not a valid integer.")
except ZeroDivisionError:
    print("Cannot divide by zero.")
finally:
    print("Done with this input attempt.")`}</CodeBlock>
        <p className="mb-1 font-semibold text-gray-900">WHAT HAPPENS:</p>
        <p className="mb-4">
          If <code className="rounded bg-gray-100 px-1">int(...)</code> fails, Python jumps to <code className="rounded bg-gray-100 px-1">ValueError</code>. If division runs but the number is 0,{' '}
          <code className="rounded bg-gray-100 px-1">ZeroDivisionError</code> fires. Only one matching <code className="rounded bg-gray-100 px-1">except</code> block runs for a given exception.
        </p>
        <p className="mb-1 font-semibold text-gray-900">COMMON MISTAKES:</p>
        <CodeBlock>{`except:  # catches EVERYTHING — hides bugs; be specific
    pass

# Swallowing errors without logging in production`}</CodeBlock>

        <Divider />
        <p className="mb-6 text-lg font-bold text-gray-900">SECTION: USEFUL STANDARD LIBRARIES</p>
        <p className="mb-1 font-semibold text-gray-900">DEFINITION:</p>
        <p className="mb-4">
          Python ships with batteries included: <code className="rounded bg-gray-100 px-1">json</code>, <code className="rounded bg-gray-100 px-1">datetime</code>, <code className="rounded bg-gray-100 px-1">os</code>, <code className="rounded bg-gray-100 px-1">random</code>, <code className="rounded bg-gray-100 px-1">math</code>, and <code className="rounded bg-gray-100 px-1">collections</code> are used daily in scripts and services.
        </p>
        <p className="mb-1 font-semibold text-gray-900">WHY IT EXISTS:</p>
        <p className="mb-4">
          Reinventing JSON parsing or date math wastes time and introduces bugs. Standard libraries are well-tested and fast
          enough for most tasks.
        </p>
        <p className="mb-1 font-semibold text-gray-900">HOW COMPANIES USE IT:</p>
        <p className="mb-4">
          Microservices exchange JSON. Cron jobs use <code className="rounded bg-gray-100 px-1">datetime</code>. Pipelines use <code className="rounded bg-gray-100 px-1">os.path</code> or <code className="rounded bg-gray-100 px-1">pathlib</code>. Interviewers expect you to know <code className="rounded bg-gray-100 px-1">json.loads</code> / <code className="rounded bg-gray-100 px-1">dumps</code>.
        </p>
        <p className="mb-1 font-semibold text-gray-900">HOW IT WORKS:</p>
        <p className="mb-4">
          <code className="rounded bg-gray-100 px-1">json.dumps</code> turns Python dicts into strings; <code className="rounded bg-gray-100 px-1">json.loads</code> parses JSON strings into dicts. <code className="rounded bg-gray-100 px-1">datetime.date.today()</code> gives today&apos;s date object.
        </p>
        <p className="mb-2 font-semibold text-gray-900">CODE:</p>
        <CodeBlock>{`import json
import datetime

data = {"name": "Sai", "gpa": 3.9}
s = json.dumps(data)        # dict → JSON string
back = json.loads(s)        # JSON string → dict
print(back["name"])

today = datetime.date.today()
print(today)`}</CodeBlock>
        <p className="mb-1 font-semibold text-gray-900">WHAT HAPPENS:</p>
        <p className="mb-4">
          JSON keys become strings in Python; nested structures become dicts and lists. Dates are not JSON-native — for APIs
          people often serialize them as ISO strings.
        </p>
        <p className="mb-1 font-semibold text-gray-900">COMMON MISTAKES:</p>
        <CodeBlock>{`# Using single quotes in JSON text — JSON requires double quotes
# Forgetting json.loads vs load (file) — loads takes a string`}</CodeBlock>

        <Divider />
        <p className="mb-4">
          <span className="mr-2">🎯</span>
          <strong>Practice Problems</strong>
        </p>
        <ol className="mb-6 list-decimal space-y-2 pl-6 marker:text-primary">
          <li>Implement a <code className="rounded bg-gray-100 px-1">BankAccount</code> class with deposit, withdraw, and get_balance (no negative balance).</li>
          <li>
            Implement <code className="rounded bg-gray-100 px-1">Student</code> with a method that returns <code className="rounded bg-gray-100 px-1">&quot;Honor Roll&quot;</code> if GPA ≥ 3.5 else{' '}
            <code className="rounded bg-gray-100 px-1">&quot;Good Standing&quot;</code>.
          </li>
          <li>Read a text file and print how many words it contains.</li>
          <li>Build a gradebook dict, write it to a JSON file with <code className="rounded bg-gray-100 px-1">json.dump</code>, then read it back with <code className="rounded bg-gray-100 px-1">json.load</code>.</li>
          <li>Prompt for a number in a loop until the user enters valid input or types &quot;quit&quot;.</li>
        </ol>
        <p className="mb-2">
          <span className="mr-2">📚</span>
          <strong>Go Deeper</strong>
        </p>
        <ul className="list-disc space-y-1 pl-6 marker:text-primary">
          <li>
            <ResourceLink href="https://realpython.com/python3-object-oriented-programming/">Real Python — OOP Guide</ResourceLink>
          </li>
          <li>
            <ResourceLink href="https://docs.python.org/3/tutorial/classes.html">Python Docs — Classes</ResourceLink>
          </li>
          <li>
            <ResourceLink href="https://docs.python.org/3/library/json.html">Python Docs — json module</ResourceLink>
          </li>
        </ul>
      </AccordionRow>

      <AccordionRow
        id="py-w1"
        openId={openId}
        setOpenId={setOpenId}
        badge="Phase 2"
        badgeClass="bg-emerald-600"
        title="DSA — Week 1"
        right="Arrays, strings, hashing, two-pointer"
      >
        <p className="mb-6 text-lg font-bold text-gray-900">SECTION: ARRAYS AND STRINGS (FOUNDATION)</p>
        <p className="mb-1 font-semibold text-gray-900">DEFINITION:</p>
        <p className="mb-4">
          In Python, lists are your dynamic arrays; strings are immutable sequences of characters. Indexing, slicing, and
          iteration are the basic moves for almost every interview problem.
        </p>
        <p className="mb-1 font-semibold text-gray-900">WHY IT EXISTS:</p>
        <p className="mb-4">
          Interviewers default to array and string problems because they test logic, complexity intuition, and careful handling
          of edge cases without heavy APIs.
        </p>
        <p className="mb-1 font-semibold text-gray-900">HOW COMPANIES USE IT:</p>
        <p className="mb-4">
          Search ranking features, log parsing, time-series buffers, and text normalization all boil down to sequential data
          and efficient passes over it.
        </p>
        <p className="mb-1 font-semibold text-gray-900">HOW IT WORKS:</p>
        <p className="mb-4">
          Know <code className="rounded bg-gray-100 px-1">O(1)</code> index access, <code className="rounded bg-gray-100 px-1">len</code>, slice semantics (end index exclusive), and that string &quot;mutation&quot; builds new strings.
        </p>
        <p className="mb-2 font-semibold text-gray-900">CODE:</p>
        <CodeBlock>{`arr = [10, 20, 30, 40, 50]
print(arr[0], arr[-1])    # first and last
print(arr[1:3])           # [20, 30] — stops before index 3
arr.append(60)            # add to end
arr.sort()                # in-place ascending sort`}</CodeBlock>
        <p className="mb-1 font-semibold text-gray-900">WHAT HAPPENS:</p>
        <p className="mb-4">
          Slicing returns a new list; <code className="rounded bg-gray-100 px-1">sort()</code> reorders in place. For strings, methods like <code className="rounded bg-gray-100 px-1">.lower()</code> return new objects.
        </p>
        <p className="mb-1 font-semibold text-gray-900">COMMON MISTAKES:</p>
        <p className="mb-4">Off-by-one slices; assuming <code className="rounded bg-gray-100 px-1">sort()</code> returns a new list (it returns <code className="rounded bg-gray-100 px-1">None</code>).</p>

        <Divider />
        <p className="mb-6 text-lg font-bold text-gray-900">SECTION: TWO POINTER TECHNIQUE</p>
        <p className="mb-1 font-semibold text-gray-900">DEFINITION:</p>
        <p className="mb-4">
          Two pointers are two indices moving through an array (or string) under a rule — often from both ends toward the
          middle, or both from the start at different speeds.
        </p>
        <p className="mb-1 font-semibold text-gray-900">WHY IT EXISTS:</p>
        <p className="mb-4">
          Nested loops often give <code className="rounded bg-gray-100 px-1">O(n²)</code>. A smart two-pointer pattern can reduce the same problem to <code className="rounded bg-gray-100 px-1">O(n)</code> when the data is ordered or the structure allows eliminating many pairs at once.
        </p>
        <p className="mb-1 font-semibold text-gray-900">HOW COMPANIES USE IT:</p>
        <p className="mb-4">
          Merging sorted streams, validating palindromes, finding pairs with a target sum on sorted data, and resizing windows
          all show up in real pipelines and interviews.
        </p>
        <p className="mb-1 font-semibold text-gray-900">HOW IT WORKS:</p>
        <p className="mb-4">
          Place <code className="rounded bg-gray-100 px-1">left</code> at the start and <code className="rounded bg-gray-100 px-1">right</code> at the end. Each step moves the pointer that improves your goal (e.g. increase sum vs decrease sum). Invariant: the answer, if it exists, stays inside the remaining range.
        </p>
        <p className="mb-2 font-semibold text-gray-900">CODE (sorted array — pair sums to target):</p>
        <CodeBlock>{`def has_pair_sorted(arr, target):
    left, right = 0, len(arr) - 1
    while left < right:
        total = arr[left] + arr[right]
        if total == target:
            return True
        if total < target:
            left += 1    # need a larger sum → move left rightward
        else:
            right -= 1   # need a smaller sum → move right leftward
    return False`}</CodeBlock>
        <p className="mb-1 font-semibold text-gray-900">WHAT HAPPENS:</p>
        <p className="mb-4">
          Each pointer moves at most <code className="rounded bg-gray-100 px-1">n</code> steps — linear time, <code className="rounded bg-gray-100 px-1">O(1)</code> extra space. This only works because sorting orders the search space.
        </p>
        <p className="mb-1 font-semibold text-gray-900">COMMON MISTAKES:</p>
        <p className="mb-4">
          Using this on an unsorted array without sorting first (sorting changes indices — not OK for index-return problems like
          Two Sum on arbitrary arrays — use a hash map there).
        </p>

        <Divider />
        <p className="mb-6 text-lg font-bold text-gray-900">SECTION: SLIDING WINDOW</p>
        <p className="mb-1 font-semibold text-gray-900">DEFINITION:</p>
        <p className="mb-4">
          A sliding window maintains a contiguous subarray (or substring) of size <code className="rounded bg-gray-100 px-1">k</code> or variable size and updates its sum or
          frequency as it moves one step at a time.
        </p>
        <p className="mb-1 font-semibold text-gray-900">WHY IT EXISTS:</p>
        <p className="mb-4">
          Recomputing from scratch for every window costs <code className="rounded bg-gray-100 px-1">O(n·k)</code>. Sliding adds the entering element and subtracts the leaving element — <code className="rounded bg-gray-100 px-1">O(n)</code>.
        </p>
        <p className="mb-1 font-semibold text-gray-900">HOW COMPANIES USE IT:</p>
        <p className="mb-4">
          Rate limiting over time buckets, rolling metrics, stream processing, and substring problems with constraints (unique
          chars, max frequency, etc.).
        </p>
        <p className="mb-1 font-semibold text-gray-900">HOW IT WORKS:</p>
        <p className="mb-4">
          Initialize the first window in one pass. For each shift: <code className="rounded bg-gray-100 px-1">window += arr[i]</code>, <code className="rounded bg-gray-100 px-1">window -= arr[i-k]</code>, track max or min as needed.
        </p>
        <p className="mb-2 font-semibold text-gray-900">CODE (fixed size k — max sum):</p>
        <CodeBlock>{`def max_sum_subarray_size_k(arr, k):
    if k > len(arr):
        return 0
    window_sum = sum(arr[:k])   # sum of first k elements
    best = window_sum
    for i in range(k, len(arr)):
        window_sum += arr[i] - arr[i - k]  # slide: add new, drop old
        best = max(best, window_sum)
    return best`}</CodeBlock>
        <p className="mb-1 font-semibold text-gray-900">WHAT HAPPENS:</p>
        <p className="mb-4">
          The inner loop does constant work per index — total <code className="rounded bg-gray-100 px-1">O(n)</code>. Variable-size windows use two pointers with expand/shrink rules.
        </p>
        <p className="mb-1 font-semibold text-gray-900">COMMON MISTAKES:</p>
        <p className="mb-4">Forgetting to handle <code className="rounded bg-gray-100 px-1">k &gt; len(arr)</code>; off-by-one when subtracting <code className="rounded bg-gray-100 px-1">arr[i-k]</code>.</p>

        <Divider />
        <p className="mb-6 text-lg font-bold text-gray-900">SECTION: HASH MAP (DICTIONARY) PATTERN</p>
        <p className="mb-1 font-semibold text-gray-900">DEFINITION:</p>
        <p className="mb-4">
          A hash map stores key → value with average <code className="rounded bg-gray-100 px-1">O(1)</code> insert and lookup. In Python, the built-in <code className="rounded bg-gray-100 px-1">dict</code> is your interview hash map.
        </p>
        <p className="mb-1 font-semibold text-gray-900">WHY IT EXISTS:</p>
        <p className="mb-4">
          Many array problems ask &quot;have I seen the complement before?&quot; or &quot;what is the frequency?&quot; Linear scans with a dict
          beat naive nested loops.
        </p>
        <p className="mb-1 font-semibold text-gray-900">HOW COMPANIES USE IT:</p>
        <p className="mb-4">
          Caching, deduplication, counting events, indexing records by ID, and implementing sets of seen items at scale (with
          real hash tables + collision handling in lower-level systems).
        </p>
        <p className="mb-1 font-semibold text-gray-900">HOW IT WORKS:</p>
        <p className="mb-4">
          Walk the array once. For Two Sum, store each value → index. For each <code className="rounded bg-gray-100 px-1">num</code>, check if <code className="rounded bg-gray-100 px-1">target - num</code> is already in the map.
        </p>
        <p className="mb-2 font-semibold text-gray-900">CODE (Two Sum — one pass):</p>
        <CodeBlock>{`def two_sum(nums, target):
    seen = {}                      # value → index
    for i, num in enumerate(nums):
        need = target - num        # complement we need
        if need in seen:
            return [seen[need], i] # earlier index first
        seen[num] = i              # record this value's index
    return []                      # no pair`}</CodeBlock>
        <p className="mb-2 font-semibold text-gray-900">CODE (frequency count):</p>
        <CodeBlock>{`def count_frequency(arr):
    freq = {}
    for x in arr:
        freq[x] = freq.get(x, 0) + 1
    return freq`}</CodeBlock>
        <p className="mb-1 font-semibold text-gray-900">WHAT HAPPENS:</p>
        <p className="mb-4">
          Each insertion and lookup is amortized constant time for typical inputs — overall <code className="rounded bg-gray-100 px-1">O(n)</code> time and <code className="rounded bg-gray-100 px-1">O(n)</code> space for the map.
        </p>
        <p className="mb-1 font-semibold text-gray-900">COMMON MISTAKES:</p>
        <p className="mb-4">
          Using a list as a map for sparse integer keys; mutating dict while iterating; wrong order of insert vs check (Two Sum
          needs to avoid using the same element twice).
        </p>

        <Divider />
        <p className="mb-2 mt-4">
          <span className="mr-2">🎯</span>
          <strong>LeetCode This Week (in order)</strong>
        </p>
        <ol className="mb-4 list-decimal space-y-1 pl-6 marker:text-primary">
          <li>Two Sum — Easy — #1</li>
          <li>Best Time to Buy and Sell Stock — Easy — #121</li>
          <li>Contains Duplicate — Easy — #217</li>
          <li>Valid Anagram — Easy — #242</li>
          <li>Maximum Subarray — Easy — #53</li>
          <li>Move Zeroes — Easy — #283</li>
          <li>Longest Substring Without Repeating Characters — Medium — #3</li>
        </ol>
        <p className="mb-2">
          <span className="mr-2">📚</span>
          <strong>Go Deeper</strong>
        </p>
        <ul className="list-disc space-y-1 pl-6 marker:text-primary">
          <li>
            <ResourceLink href="https://neetcode.io/">NeetCode</ResourceLink>
          </li>
          <li>
            <ResourceLink href="https://www.geeksforgeeks.org/array-data-structure/">GeeksforGeeks — Arrays</ResourceLink>
          </li>
          <li>
            <ResourceLink href="https://leetcode.com/explore/learn/card/fun-with-arrays/">LeetCode Explore — Arrays</ResourceLink>
          </li>
        </ul>
      </AccordionRow>

      <AccordionRow
        id="py-w2"
        openId={openId}
        setOpenId={setOpenId}
        badge="Phase 2"
        badgeClass="bg-emerald-600"
        title="DSA — Week 2"
        right="Stack, queue, linked list, binary search"
      >
        <p className="mb-6 text-lg font-bold text-gray-900">SECTION: STACK (LIFO)</p>
        <p className="mb-1 font-semibold text-gray-900">DEFINITION:</p>
        <p className="mb-4">
          A stack is Last-In-First-Out. You push on top and pop from top — like a stack of plates.
        </p>
        <p className="mb-1 font-semibold text-gray-900">WHY IT EXISTS:</p>
        <p className="mb-4">
          Many problems nest structure: parentheses, XML/HTML tags, undo history, DFS on graphs, and function call stacks in
          runtimes.
        </p>
        <p className="mb-1 font-semibold text-gray-900">HOW COMPANIES USE IT:</p>
        <p className="mb-4">
          Expression evaluators, route parsers, syntax checking in IDEs, and backtracking search in compilers and infra tools.
        </p>
        <p className="mb-1 font-semibold text-gray-900">HOW IT WORKS:</p>
        <p className="mb-4">
          In Python, a list is a fine stack: <code className="rounded bg-gray-100 px-1">append</code> for push, <code className="rounded bg-gray-100 px-1">pop()</code> for pop, <code className="rounded bg-gray-100 px-1">[-1]</code> to peek.
        </p>
        <p className="mb-2 font-semibold text-gray-900">CODE (classic Valid Parentheses idea):</p>
        <CodeBlock>{`def is_valid_parentheses(s: str) -> bool:
    stack = []
    pairs = {")": "(", "}": "{", "]": "["}
    for ch in s:
        if ch in "({[":          # opening → push
            stack.append(ch)
        else:                     # closing → must match top
            if not stack or stack[-1] != pairs[ch]:
                return False
            stack.pop()
    return len(stack) == 0`}</CodeBlock>
        <p className="mb-1 font-semibold text-gray-900">WHAT HAPPENS:</p>
        <p className="mb-4">
          Each character is processed once — <code className="rounded bg-gray-100 px-1">O(n)</code> time, <code className="rounded bg-gray-100 px-1">O(n)</code> stack space in the worst case (all opening brackets).
        </p>
        <p className="mb-1 font-semibold text-gray-900">COMMON MISTAKES:</p>
        <p className="mb-4">
          Popping without checking <code className="rounded bg-gray-100 px-1">stack</code> empty; forgetting that only the most recent unmatched opener can pair with a closer.
        </p>

        <Divider />
        <p className="mb-6 text-lg font-bold text-gray-900">SECTION: QUEUE (FIFO)</p>
        <p className="mb-1 font-semibold text-gray-900">DEFINITION:</p>
        <p className="mb-4">
          A queue is First-In-First-Out: enqueue at the back, dequeue from the front — like a line at a coffee shop.
        </p>
        <p className="mb-1 font-semibold text-gray-900">WHY IT EXISTS:</p>
        <p className="mb-4">
          Fair scheduling, breadth-first traversal, buffering between producers and consumers, and level-order tree walks.
        </p>
        <p className="mb-1 font-semibold text-gray-900">HOW COMPANIES USE IT:</p>
        <p className="mb-4">
          Job queues (SQS, RabbitMQ), request throttling, BFS in route planning, and streaming pipelines with ordered handoff.
        </p>
        <p className="mb-1 font-semibold text-gray-900">HOW IT WORKS:</p>
        <p className="mb-4">
          Prefer <code className="rounded bg-gray-100 px-1">collections.deque</code> in Python: <code className="rounded bg-gray-100 px-1">append</code> / <code className="rounded bg-gray-100 px-1">popleft</code> are <code className="rounded bg-gray-100 px-1">O(1)</code>. Using <code className="rounded bg-gray-100 px-1">list.pop(0)</code> is <code className="rounded bg-gray-100 px-1">O(n)</code> — avoid it for queues.
        </p>
        <p className="mb-2 font-semibold text-gray-900">CODE:</p>
        <CodeBlock>{`from collections import deque

q = deque()
q.append(1)      # enqueue back
q.append(2)
first = q.popleft()  # dequeue front → 1
print(first, list(q))  # 1 [2]`}</CodeBlock>
        <p className="mb-1 font-semibold text-gray-900">WHAT HAPPENS:</p>
        <p className="mb-4">
          <code className="rounded bg-gray-100 px-1">deque</code> is a doubly-linked chain of blocks — fast ends, no full-array shifts.
        </p>
        <p className="mb-1 font-semibold text-gray-900">COMMON MISTAKES:</p>
        <p className="mb-4">Using a list as a queue with pop(0); dequeuing from an empty queue (guard with size checks).</p>

        <Divider />
        <p className="mb-6 text-lg font-bold text-gray-900">SECTION: BINARY SEARCH</p>
        <p className="mb-1 font-semibold text-gray-900">DEFINITION:</p>
        <p className="mb-4">
          Binary search finds a target in a <strong>sorted</strong> array by repeatedly cutting the search space in half.
        </p>
        <p className="mb-1 font-semibold text-gray-900">WHY IT EXISTS:</p>
        <p className="mb-4">
          Linear scan is <code className="rounded bg-gray-100 px-1">O(n)</code>. Halving each step gives <code className="rounded bg-gray-100 px-1">O(log n)</code> — critical for huge sorted tables and many &quot;search space&quot; puzzles.
        </p>
        <p className="mb-1 font-semibold text-gray-900">HOW COMPANIES USE IT:</p>
        <p className="mb-4">
          Database indexes, feature flags on sorted keys, timelines, and &quot;minimum feasible answer&quot; problems (binary search on
          answer).
        </p>
        <p className="mb-1 font-semibold text-gray-900">HOW IT WORKS:</p>
        <p className="mb-4">
          Maintain <code className="rounded bg-gray-100 px-1">lo</code> and <code className="rounded bg-gray-100 px-1">hi</code>. Compute <code className="rounded bg-gray-100 px-1">mid</code>. If <code className="rounded bg-gray-100 px-1">arr[mid]</code> is too small, move <code className="rounded bg-gray-100 px-1">lo</code> up; else move <code className="rounded bg-gray-100 px-1">hi</code> down. Watch boundary variants (first/last occurrence, insert position).
        </p>
        <p className="mb-2 font-semibold text-gray-900">CODE (classic — return index or -1):</p>
        <CodeBlock>{`def binary_search(arr, target):
    lo, hi = 0, len(arr) - 1
    while lo <= hi:
        mid = (lo + hi) // 2
        if arr[mid] == target:
            return mid
        if arr[mid] < target:
            lo = mid + 1   # discard left half
        else:
            hi = mid - 1   # discard right half
    return -1`}</CodeBlock>
        <p className="mb-1 font-semibold text-gray-900">WHAT HAPPENS:</p>
        <p className="mb-4">
          Each iteration removes about half the candidates — at most <code className="rounded bg-gray-100 px-1">⌈log₂ n⌉</code> iterations. Integer overflow in other languages needs careful <code className="rounded bg-gray-100 px-1">mid</code> formulas; Python integers are safe.
        </p>
        <p className="mb-1 font-semibold text-gray-900">COMMON MISTAKES:</p>
        <p className="mb-4">
          Applying binary search on unsorted data; infinite loops from wrong <code className="rounded bg-gray-100 px-1">lo/hi</code> updates; off-by-one when searching for boundaries.
        </p>

        <Divider />
        <p className="mb-2 mt-4">
          <span className="mr-2">🎯</span>
          <strong>LeetCode This Week</strong>
        </p>
        <ol className="mb-4 list-decimal space-y-1 pl-6 marker:text-primary">
          <li>Valid Parentheses — Easy — #20</li>
          <li>Min Stack — Medium — #155</li>
          <li>Binary Search — Easy — #704</li>
          <li>Search Insert Position — Easy — #35</li>
          <li>Find Minimum in Rotated Sorted Array — Medium — #153</li>
        </ol>
        <p className="mb-2">
          <span className="mr-2">📚</span>
          <strong>Go Deeper</strong>
        </p>
        <ul className="list-disc space-y-1 pl-6 marker:text-primary">
          <li>
            <ResourceLink href="https://neetcode.io/">NeetCode — Stack / Binary Search</ResourceLink>
          </li>
          <li>
            <ResourceLink href="https://leetcode.com/explore/learn/card/binary-search/">LeetCode Explore — Binary Search</ResourceLink>
          </li>
        </ul>
      </AccordionRow>

      <AccordionRow
        id="py-w3"
        openId={openId}
        setOpenId={setOpenId}
        badge="Phase 2"
        badgeClass="bg-emerald-600"
        title="DSA — Week 3"
        right="Trees, graphs, recursion"
      >
        <p className="mb-6 text-lg font-bold text-gray-900">SECTION: BINARY TREES</p>
        <p className="mb-1 font-semibold text-gray-900">DEFINITION:</p>
        <p className="mb-4">
          A binary tree is a hierarchy where each node has at most two children: <code className="rounded bg-gray-100 px-1">left</code> and <code className="rounded bg-gray-100 px-1">right</code>. The top node is the root.
        </p>
        <p className="mb-1 font-semibold text-gray-900">WHY IT EXISTS:</p>
        <p className="mb-4">
          Trees model decisions, file folders, syntax, and sorted structures (BST). They are a core interview topic because
          recursion and structure pair naturally.
        </p>
        <p className="mb-1 font-semibold text-gray-900">HOW COMPANIES USE IT:</p>
        <p className="mb-4">
          ASTs in compilers, indexes in databases (B-trees family), org charts, and many ML model structures (decision trees).
        </p>
        <p className="mb-1 font-semibold text-gray-900">HOW IT WORKS:</p>
        <p className="mb-4">
          Nodes are objects (or structs) with pointers to children. Algorithms recurse: base case is <code className="rounded bg-gray-100 px-1">node is None</code>; recursive case combines results from left and right subtrees.
        </p>
        <p className="mb-2 font-semibold text-gray-900">CODE (node definition + depth):</p>
        <CodeBlock>{`class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def max_depth(root: TreeNode) -> int:
    if root is None:
        return 0
    return 1 + max(max_depth(root.left), max_depth(root.right))`}</CodeBlock>
        <p className="mb-1 font-semibold text-gray-900">WHAT HAPPENS:</p>
        <p className="mb-4">
          The call stack mirrors the tree height — <code className="rounded bg-gray-100 px-1">O(h)</code> auxiliary space for recursion, <code className="rounded bg-gray-100 px-1">O(n)</code> time to visit every node once.
        </p>
        <p className="mb-1 font-semibold text-gray-900">COMMON MISTAKES:</p>
        <p className="mb-4">Forgetting the null base case; confusing height vs depth; mutating shared nodes when cloning trees.</p>

        <Divider />
        <p className="mb-6 text-lg font-bold text-gray-900">SECTION: TREE TRAVERSALS (DFS ORDERS)</p>
        <p className="mb-1 font-semibold text-gray-900">DEFINITION:</p>
        <p className="mb-4">
          DFS traversals differ by <em>when</em> you visit the root: preorder (root-left-right), inorder (left-root-right), postorder
          (left-right-root).
        </p>
        <p className="mb-1 font-semibold text-gray-900">WHY IT EXISTS:</p>
        <p className="mb-4">
          Different orders extract different information — inorder on a BST yields sorted values; preorder helps serialize trees.
        </p>
        <p className="mb-1 font-semibold text-gray-900">HOW COMPANIES USE IT:</p>
        <p className="mb-4">
          Query planners, expression evaluation, diffing hierarchical configs, and debugging recursive renders in front-end
          frameworks.
        </p>
        <p className="mb-1 font-semibold text-gray-900">HOW IT WORKS:</p>
        <p className="mb-4">
          Recursive functions append or process <code className="rounded bg-gray-100 px-1">root.val</code> at the correct point relative to left and right calls.
        </p>
        <p className="mb-2 font-semibold text-gray-900">CODE (inorder list):</p>
        <CodeBlock>{`def inorder(root: TreeNode):
    if not root:
        return []
    return inorder(root.left) + [root.val] + inorder(root.right)`}</CodeBlock>
        <p className="mb-2 font-semibold text-gray-900">CODE (level order = BFS on a tree):</p>
        <CodeBlock>{`from collections import deque

def level_order(root: TreeNode):
    if not root:
        return []
    out, q = [], deque([root])
    while q:
        node = q.popleft()
        out.append(node.val)
        if node.left:
            q.append(node.left)
        if node.right:
            q.append(node.right)
    return out`}</CodeBlock>
        <p className="mb-1 font-semibold text-gray-900">WHAT HAPPENS:</p>
        <p className="mb-4">
          BFS uses a queue — visits level by level. DFS uses the call stack (or an explicit stack) — goes deep before wide.
        </p>
        <p className="mb-1 font-semibold text-gray-900">COMMON MISTAKES:</p>
        <p className="mb-4">Mixing up traversal orders; BFS without a queue; not handling skewed trees (linked-list shaped).</p>

        <Divider />
        <p className="mb-6 text-lg font-bold text-gray-900">SECTION: GRAPHS — BFS AND DFS</p>
        <p className="mb-1 font-semibold text-gray-900">DEFINITION:</p>
        <p className="mb-4">
          A graph is nodes (vertices) and edges. Represented as an <strong>adjacency list</strong>: <code className="rounded bg-gray-100 px-1">dict[node, list[neighbor]]</code>.
        </p>
        <p className="mb-1 font-semibold text-gray-900">WHY IT EXISTS:</p>
        <p className="mb-4">
          Social networks, dependency resolution, maps, and any &quot;things connected to things&quot; problem reduce to graph reachability
          or shortest path.
        </p>
        <p className="mb-1 font-semibold text-gray-900">HOW COMPANIES USE IT:</p>
        <p className="mb-4">
          Build systems (DAGs), microservice dependency graphs, fraud link analysis, and network routing abstractions.
        </p>
        <p className="mb-1 font-semibold text-gray-900">HOW IT WORKS:</p>
        <p className="mb-4">
          <strong>DFS</strong>: go deep with recursion/stack; mark <code className="rounded bg-gray-100 px-1">visited</code> to avoid cycles. <strong>BFS</strong>: expand a frontier queue layer by layer — shortest path in unweighted graphs.
        </p>
        <p className="mb-2 font-semibold text-gray-900">CODE (DFS recursive):</p>
        <CodeBlock>{`def dfs(graph, node, visited=None):
    if visited is None:
        visited = set()
    if node in visited:
        return
    visited.add(node)
    print(node)
    for nei in graph.get(node, []):
        dfs(graph, nei, visited)`}</CodeBlock>
        <p className="mb-2 font-semibold text-gray-900">CODE (BFS):</p>
        <CodeBlock>{`from collections import deque

def bfs(graph, start):
    visited = {start}
    q = deque([start])
    while q:
        node = q.popleft()
        print(node)
        for nei in graph.get(node, []):
            if nei not in visited:
                visited.add(nei)
                q.append(nei)`}</CodeBlock>
        <p className="mb-1 font-semibold text-gray-900">WHAT HAPPENS:</p>
        <p className="mb-4">
          Each vertex and edge is processed once with the right bookkeeping — typically <code className="rounded bg-gray-100 px-1">O(V + E)</code> time. Space is{' '}
          <code className="rounded bg-gray-100 px-1">O(V)</code> for visited + frontier.
        </p>
        <p className="mb-1 font-semibold text-gray-900">COMMON MISTAKES:</p>
        <p className="mb-4">
          Infinite loops without visited; wrong graph representation for the problem; confusing BFS distance with weighted
          shortest path (need Dijkstra, not covered here).
        </p>

        <Divider />
        <p className="mb-2 mt-4">
          <span className="mr-2">🎯</span>
          <strong>LeetCode This Week</strong>
        </p>
        <ol className="mb-4 list-decimal space-y-1 pl-6 marker:text-primary">
          <li>Maximum Depth of Binary Tree — Easy — #104</li>
          <li>Invert Binary Tree — Easy — #226</li>
          <li>Symmetric Tree — Easy — #101</li>
          <li>Binary Tree Level Order Traversal — Medium — #102</li>
          <li>Number of Islands — Medium — #200</li>
          <li>Course Schedule — Medium — #207</li>
        </ol>
        <p className="mb-2">
          <span className="mr-2">📚</span>
          <strong>Go Deeper</strong>
        </p>
        <ul className="list-disc space-y-1 pl-6 marker:text-primary">
          <li>
            <ResourceLink href="https://neetcode.io/">NeetCode — Trees &amp; Graphs</ResourceLink>
          </li>
          <li>
            <ResourceLink href="https://visualgo.net/en/binarytree">Visualgo — Binary Tree</ResourceLink>
          </li>
        </ul>
      </AccordionRow>

      <AccordionRow
        id="py-w4"
        openId={openId}
        setOpenId={setOpenId}
        badge="Phase 2"
        badgeClass="bg-emerald-600"
        title="DSA — Week 4"
        right="Heaps, DP, greedy, backtracking"
      >
        <p className="mb-6 text-lg font-bold text-gray-900">SECTION: WHAT IS DYNAMIC PROGRAMMING?</p>
        <p className="mb-1 font-semibold text-gray-900">DEFINITION:</p>
        <p className="mb-4">
          Dynamic Programming (DP) solves problems by combining answers to <strong>overlapping subproblems</strong> and storing those
          answers to avoid recomputation.
        </p>
        <p className="mb-1 font-semibold text-gray-900">WHY IT EXISTS:</p>
        <p className="mb-4">
          Naive recursion often revisits the same states exponentially (e.g. Fibonacci). Memoization or tabulation turns that
          into polynomial time.
        </p>
        <p className="mb-1 font-semibold text-gray-900">HOW COMPANIES USE IT:</p>
        <p className="mb-4">
          Resource allocation, pricing, string similarity in search, bioinformatics alignment, and any optimization with
          sequential decisions shows DP patterns.
        </p>
        <p className="mb-1 font-semibold text-gray-900">HOW IT WORKS:</p>
        <p className="mb-4">
          1) Identify state (often index + constraint). 2) Write recurrence — how today&apos;s answer depends on smaller subproblems.
          3) Add base cases. 4) Implement top-down (memo) or bottom-up (table). 5) Check time/space.
        </p>
        <p className="mb-2 font-semibold text-gray-900">CODE (Fibonacci — top-down memo):</p>
        <CodeBlock>{`def fib(n, memo=None):
    memo = {} if memo is None else memo
    if n in memo:
        return memo[n]       # already solved this subproblem
    if n <= 1:
        return n             # base cases
    memo[n] = fib(n - 1, memo) + fib(n - 2, memo)
    return memo[n]`}</CodeBlock>
        <p className="mb-1 font-semibold text-gray-900">WHAT HAPPENS:</p>
        <p className="mb-4">
          Each <code className="rounded bg-gray-100 px-1">fib(k)</code> for <code className="rounded bg-gray-100 px-1">k ≤ n</code> is computed once — <code className="rounded bg-gray-100 px-1">O(n)</code> time, <code className="rounded bg-gray-100 px-1">O(n)</code> memo space. Without memo, time is exponential.
        </p>
        <p className="mb-1 font-semibold text-gray-900">COMMON MISTAKES:</p>
        <p className="mb-4">Wrong base case; mutating shared state across calls; forgetting that not every recursion benefits from DP (need overlap).</p>

        <Divider />
        <p className="mb-6 text-lg font-bold text-gray-900">SECTION: CLIMBING STAIRS (CLASSIC DP)</p>
        <p className="mb-1 font-semibold text-gray-900">DEFINITION:</p>
        <p className="mb-4">
          You can climb 1 or 2 steps at a time. Count distinct ways to reach step <code className="rounded bg-gray-100 px-1">n</code> (LeetCode #70).
        </p>
        <p className="mb-1 font-semibold text-gray-900">WHY IT EXISTS:</p>
        <p className="mb-4">
          It is the Fibonacci pattern in disguise — ways(n) = ways(n-1) + ways(n-2) with small bases.
        </p>
        <p className="mb-1 font-semibold text-gray-900">HOW COMPANIES USE IT:</p>
        <p className="mb-4">
          Interviewers use it to test whether you can recognize recurrence and implement <code className="rounded bg-gray-100 px-1">O(n)</code> DP vs exponential recursion.
        </p>
        <p className="mb-1 font-semibold text-gray-900">HOW IT WORKS:</p>
        <p className="mb-4">
          From step <code className="rounded bg-gray-100 px-1">n</code> you arrived from <code className="rounded bg-gray-100 px-1">n-1</code> or <code className="rounded bg-gray-100 px-1">n-2</code>. Sum the ways. Bottom-up fills an array from 0..n.
        </p>
        <p className="mb-2 font-semibold text-gray-900">CODE (bottom-up):</p>
        <CodeBlock>{`def climb_stairs(n: int) -> int:
    if n <= 2:
        return n
    dp = [0] * (n + 1)
    dp[1] = 1
    dp[2] = 2
    for i in range(3, n + 1):
        dp[i] = dp[i - 1] + dp[i - 2]
    return dp[n]`}</CodeBlock>
        <p className="mb-1 font-semibold text-gray-900">WHAT HAPPENS:</p>
        <p className="mb-4">
          Loop runs <code className="rounded bg-gray-100 px-1">n</code> times — <code className="rounded bg-gray-100 px-1">O(n)</code> time. You can optimize to <code className="rounded bg-gray-100 px-1">O(1)</code> space by keeping only last two values.
        </p>
        <p className="mb-1 font-semibold text-gray-900">COMMON MISTAKES:</p>
        <p className="mb-4">Off-by-one on array size; using <code className="rounded bg-gray-100 px-1">fib(n)</code> indexing instead of stair semantics for base cases.</p>

        <Divider />
        <p className="mb-6 text-lg font-bold text-gray-900">SECTION: WHEN YOU NEED DP (QUICK SIGNALS)</p>
        <p className="mb-1 font-semibold text-gray-900">DEFINITION:</p>
        <p className="mb-4">
          Ask: &quot;Can I define a state and does the optimal/count solution reuse smaller states?&quot; If yes, try DP.
        </p>
        <p className="mb-1 font-semibold text-gray-900">WHY IT EXISTS:</p>
        <p className="mb-4">
          Greedy fails when local choices need global context. DP considers all compatible substructures.
        </p>
        <p className="mb-1 font-semibold text-gray-900">HOW COMPANIES USE IT:</p>
        <p className="mb-4">
          Scheduling with constraints, knapsack-style tradeoffs, and parsing problems (string DP) appear in advanced interviews.
        </p>
        <p className="mb-1 font-semibold text-gray-900">HOW IT WORKS:</p>
        <ul className="mb-4 list-disc space-y-1 pl-6 text-gray-800">
          <li>Optimization: min/max cost or count of ways.</li>
          <li>Decision sequence: include/exclude item, match characters, cut string.</li>
          <li>Draw the recurrence on paper before coding.</li>
        </ul>
        <p className="mb-1 font-semibold text-gray-900">WHAT HAPPENS:</p>
        <p className="mb-4">
          Well-defined states prevent exponential branching; the table order must respect dependencies (compute prerequisites
          first).
        </p>
        <p className="mb-1 font-semibold text-gray-900">COMMON MISTAKES:</p>
        <p className="mb-4">Ambiguous state; filling table in wrong order; mixing greedy intuition where DP is required.</p>

        <Divider />
        <p className="mb-2 mt-4">
          <span className="mr-2">🎯</span>
          <strong>LeetCode This Week</strong>
        </p>
        <ol className="mb-4 list-decimal space-y-1 pl-6 marker:text-primary">
          <li>Climbing Stairs — Easy — #70</li>
          <li>House Robber — Medium — #198</li>
          <li>Coin Change — Medium — #322</li>
          <li>Longest Increasing Subsequence — Medium — #300</li>
          <li>Unique Paths — Medium — #62</li>
        </ol>
        <p className="mb-2">
          <span className="mr-2">📚</span>
          <strong>Go Deeper</strong>
        </p>
        <ul className="list-disc space-y-1 pl-6 marker:text-primary">
          <li>
            <ResourceLink href="https://neetcode.io/">NeetCode — DP</ResourceLink>
          </li>
          <li>
            <ResourceLink href="https://leetcode.com/discuss/study-guide">LeetCode — DP discussions</ResourceLink>
          </li>
        </ul>
      </AccordionRow>

      <SystemDesignWeeks openId={openId} setOpenId={setOpenId} idPrefix="py-sd" />

      <AccordionRow
        id="py-beh"
        openId={openId}
        setOpenId={setOpenId}
        badge="Phase 4"
        badgeClass="bg-pink-600"
        title="Interview Prep"
        right="Ongoing, parallel to all phases"
      >
        <p className="mb-6 text-lg font-bold text-gray-900">SECTION: STAR FRAMEWORK</p>
        <p className="mb-1 font-semibold text-gray-900">DEFINITION:</p>
        <p className="mb-4">
          <strong>S</strong>ituation (context, one sentence) → <strong>T</strong>ask (your responsibility) → <strong>A</strong>ction (what <em>you</em> did, stepwise) →{' '}
          <strong>R</strong>esult (metric, business outcome, learning).
        </p>
        <p className="mb-1 font-semibold text-gray-900">WHY IT EXISTS:</p>
        <p className="mb-4">Interviewers grade signal density. STAR prevents rambling and proves ownership.</p>
        <p className="mb-1 font-semibold text-gray-900">HOW COMPANIES USE IT:</p>
        <p className="mb-4">
          Google, Amazon, Microsoft, Meta, PayPal, and Adobe all use behavioral rounds; Amazon explicitly maps stories to
          Leadership Principles.
        </p>
        <p className="mb-1 font-semibold text-gray-900">COMMON MISTAKES:</p>
        <p className="mb-4">Using &quot;we&quot; with no I; no numbers; no reflection; stories that blame others.</p>
        <Divider />
        <p className="mb-4 text-lg font-bold text-gray-900">TOP 20 BEHAVIORAL QUESTIONS — STAR SCAFFOLDS</p>
        <p className="mb-3 text-sm text-gray-700">
          For each: pick a real project. Write 4 bullets (S,T,A,R). Keep under 90s spoken. Quantify (latency %, revenue, users,
          bugs prevented).
        </p>
        <ol className="mb-6 list-decimal space-y-4 pl-6 text-[14px] leading-relaxed marker:text-primary">
          <li>
            <strong>Tell me about yourself</strong> — Template: Present role/skills → 1 past win → why this team/company. End with
            what you want to learn next.
          </li>
          <li>
            <strong>Greatest strength</strong> — Pick one (e.g. debugging). STAR: production outage, you traced root cause, cut MTTR
            by X%.
          </li>
          <li>
            <strong>Greatest weakness</strong> — Real skill gap + concrete fix (course, mentor, habit). Avoid &quot;perfectionism.&quot;
          </li>
          <li>
            <strong>Why this company</strong> — 3 specifics: product you use, technical blog/talk, value that matches your story.
          </li>
          <li>
            <strong>Challenge overcome</strong> — Ambiguous requirements; you clarified scope, shipped v1, measured adoption.
          </li>
          <li>
            <strong>Conflict with teammate</strong> — Disagreed on design; data/experiment resolved; relationship intact.
          </li>
          <li>
            <strong>Leadership</strong> — No title needed: you drove alignment, delegated, unblocked juniors.
          </li>
          <li>
            <strong>Failed project</strong> — What broke, early signal missed, what you changed next time.
          </li>
          <li>
            <strong>5-year plan</strong> — Skill goals (e.g. distributed systems) tied to business impact, not job title vanity.
          </li>
          <li>
            <strong>Why leaving</strong> — Positive framing: seeking scope X / mission Y; never trash current employer.
          </li>
          <li>
            <strong>Disagreed with manager</strong> — Presented data; committed after decision; outcome.
          </li>
          <li>
            <strong>Missed deadline</strong> — Early comms, cut scope, postmortem, new estimate process.
          </li>
          <li>
            <strong>Innovation</strong> — Small automation or feature that saved time/money; how you validated it.
          </li>
          <li>
            <strong>Prioritization</strong> — Competing asks; RICE/impact matrix; stakeholder comms.
          </li>
          <li>
            <strong>Technical decision</strong> — Tradeoffs (cost, latency, maintainability); what you would revisit.
          </li>
          <li>
            <strong>Ambiguity</strong> — Undefined problem; you prototyped, got feedback, iterated.
          </li>
          <li>
            <strong>Mentoring</strong> — Onboarding plan, code review habits, measurable growth of mentee.
          </li>
          <li>
            <strong>Learned fast</strong> — New stack in N weeks; resources; first shipped contribution.
          </li>
          <li>
            <strong>Proudest accomplishment</strong> — Business + technical angle; team credit + your slice.
          </li>
          <li>
            <strong>Questions for us</strong> — Team metrics, on-call, tech debt budget, success in first 90 days.
          </li>
        </ol>
        <Divider />
        <p className="mb-4 text-lg font-bold text-gray-900">AMAZON — 14 LEADERSHIP PRINCIPLES (STUDY FORMAT)</p>
        <p className="mb-4 text-sm text-gray-700">
          For each: (1) one-line definition (2) question flavor (3) STAR focus — what you did, not the team abstractly.
        </p>
        <ul className="mb-6 list-disc space-y-3 pl-6 text-[14px] leading-relaxed marker:text-primary">
          <li>
            <strong>Customer Obsession</strong> — &quot;Tell me about a time you fought for the user.&quot; — Reduced friction / defect affecting
            customers; metric.
          </li>
          <li>
            <strong>Ownership</strong> — &quot;End-to-end delivery.&quot; — You drove prod issue past your team boundary.
          </li>
          <li>
            <strong>Invent and Simplify</strong> — &quot;Improved process/tooling.&quot; — Before/after complexity.
          </li>
          <li>
            <strong>Are Right, A Lot</strong> — &quot;Strong judgment under uncertainty.&quot; — Data + intuition call with outcome.
          </li>
          <li>
            <strong>Learn and Be Curious</strong> — &quot;Self-taught gap.&quot; — Course, book, internal doc; applied on job.
          </li>
          <li>
            <strong>Hire and Develop the Best</strong> — Interview bar, mentoring plan, feedback story.
          </li>
          <li>
            <strong>Insist on the Highest Standards</strong> — Caught quality issue before launch; tests/monitoring added.
          </li>
          <li>
            <strong>Think Big</strong> — Bold bet scoped into milestones; stakeholder buy-in.
          </li>
          <li>
            <strong>Bias for Action</strong> — Reasonable risk; shipped experiment; learned fast.
          </li>
          <li>
            <strong>Frugality</strong> — Did more with less; cost/latency saved.
          </li>
          <li>
            <strong>Earn Trust</strong> — Transparent about mistake; rebuilt credibility.
          </li>
          <li>
            <strong>Dive Deep</strong> — Metrics/logs to root cause; no hand-waving.
          </li>
          <li>
            <strong>Have Backbone; Disagree and Commit</strong> — Constructive dissent; supported final call.
          </li>
          <li>
            <strong>Deliver Results</strong> — Clear goal, timeline, outcome vs target.
          </li>
        </ul>
        <Divider />
        <p className="mb-4 text-lg font-bold text-gray-900">COMPANY-SPECIFIC INTERVIEW PREP</p>
        <p className="mb-1 font-semibold text-gray-900">Google</p>
        <p className="mb-3 text-sm text-gray-700">
          Googleyness + structured problem solving. Prepare 2–3 stories on collaboration, ambiguity, and ethics. Expect deep
          follow-ups: &quot;What else?&quot; Technical screens emphasize algorithms and communication.
        </p>
        <p className="mb-1 font-semibold text-gray-900">Microsoft</p>
        <p className="mb-3 text-sm text-gray-700">
          Growth mindset narrative. Emphasize how you seek feedback and improve systems. Often scenario + &quot;as appropriate&quot;
          depth; clarify assumptions aloud.
        </p>
        <p className="mb-1 font-semibold text-gray-900">PayPal</p>
        <p className="mb-3 text-sm text-gray-700">
          Reliability, fraud awareness, customer trust. Stories on secure handling of money movement, incident response, and
          cross-functional work with risk/compliance.
        </p>
        <p className="mb-1 font-semibold text-gray-900">Adobe</p>
        <p className="mb-3 text-sm text-gray-700">
          Craft + creativity alongside engineering. Portfolio of polished UX or creative problem solving helps. Tie features to
          customer delight metrics.
        </p>
        <p className="mb-1 font-semibold text-gray-900">Meta</p>
        <p className="mb-4 text-sm text-gray-700">
          Move fast with measurable impact. Prepare stories on velocity, A/B tests, and scaling products. Know why Meta over
          peers (specific teams/products).
        </p>
        <p className="mb-2">
          <span className="mr-2">🎯</span>
          <strong>Practice Problems</strong>
        </p>
        <ol className="mb-6 list-decimal space-y-1 pl-6 marker:text-primary">
          <li>Record STAR answers for Q1–Q10; listen back; cut filler words.</li>
          <li>Write 14 Amazon LP headlines; map two stories per LP max (reuse allowed).</li>
          <li>Mock with peer: random LP, 2-minute answer, rapid follow-ups.</li>
        </ol>
        <p className="mb-2">
          <span className="mr-2">📚</span>
          <strong>Go Deeper</strong>
        </p>
        <ul className="list-disc space-y-1 pl-6 marker:text-primary">
          <li>
            <ResourceLink href="https://www.amazon.jobs/content/en/our-workplace/leadership-principles">Amazon Leadership Principles</ResourceLink>
          </li>
          <li>
            <ResourceLink href="https://www.biginterview.com/">Big Interview (behavioral)</ResourceLink>
          </li>
        </ul>
      </AccordionRow>

      <AccordionRow
        id="py-lc"
        openId={openId}
        setOpenId={setOpenId}
        badge="LeetCode"
        badgeClass="bg-primary"
        title="Target Problem Counts"
        right="Realistic weekly targets"
      >
        <p className="mb-6 text-lg font-bold text-gray-900">SECTION: WEEKLY SCHEDULE (SAMPLE PROBLEM IDS)</p>
        <p className="mb-1 font-semibold text-gray-900">DEFINITION:</p>
        <p className="mb-4">
          A steady cadence beats random grinding. Below: representative LeetCode numbers — swap for your list, keep the pattern
          mix.
        </p>
        <p className="mb-1 font-semibold text-gray-900">HOW IT WORKS:</p>
        <ul className="mb-4 list-disc space-y-2 pl-6 text-sm text-gray-800">
          <li>
            <strong>Weeks 1–2 (Arrays/Hashing)</strong>: Mon #1 Two Sum, Tue #217 Contains Duplicate, Wed #121 Best Time to Buy Stock,
            Thu #238 Product of Array Except Self, Fri #128 Longest Consecutive, Weekend review + #347 Top K Frequent Elements.
          </li>
          <li>
            <strong>Weeks 3–4 (Two pointers / Stack)</strong>: #15 3Sum, #11 Container With Most Water, #42 Trapping Rain Water, #20 Valid
            Parentheses, #155 Min Stack, #739 Daily Temperatures.
          </li>
          <li>
            <strong>Weeks 5–6 (Binary search / Trees)</strong>: #704 Binary Search, #33 Search Rotated Sorted Array, #104 Max Depth, #226
            Invert Tree, #235 LCA BST, #98 Validate BST.
          </li>
          <li>
            <strong>Weeks 7–8 (Graphs / DP)</strong>: #200 Number of Islands, #207 Course Schedule, #70 Climbing Stairs, #198 House Robber,
            #322 Coin Change, #300 LIS.
          </li>
        </ul>
        <p className="mb-1 font-semibold text-gray-900">WHAT HAPPENS:</p>
        <p className="mb-4">You build pattern muscle memory; revisit missed problems in spaced repetition.</p>
        <Divider />
        <p className="mb-6 text-lg font-bold text-gray-900">SECTION: PATTERN RECOGNITION GUIDE</p>
        <p className="mb-1 font-semibold text-gray-900">HOW IT WORKS:</p>
        <ul className="mb-4 list-disc space-y-2 pl-6 text-sm text-gray-800">
          <li>See sorted array + pair/target → two pointers or binary search.</li>
          <li>See substring with constraint → sliding window + hashmap counts.</li>
          <li>See nested structure / undo → stack.</li>
          <li>See shortest path unweighted graph → BFS.</li>
          <li>See dependency / ordering → topological sort (DFS/BFS).</li>
          <li>See count ways / min cost with subproblems → DP.</li>
        </ul>
        <Divider />
        <p className="mb-4 text-lg font-bold text-gray-900">TOP 10 PATTERNS (~80% OF INTERVIEWS)</p>
        <ol className="mb-6 list-decimal space-y-1 pl-6 text-sm marker:text-primary">
          <li>Hash map / frequency</li>
          <li>Two pointers</li>
          <li>Sliding window</li>
          <li>Binary search (incl. on answer)</li>
          <li>BFS / DFS</li>
          <li>Heap / top-K</li>
          <li>Intervals / merge / sweep</li>
          <li>Linked list (dummy node, fast/slow)</li>
          <li>Tree recursion + BST property</li>
          <li>1D/2D DP and greedy checks</li>
        </ol>
        <Divider />
        <p className="mb-4 text-lg font-bold text-gray-900">TIME COMPLEXITY CHEAT SHEET</p>
        <p className="mb-1 font-semibold text-gray-900">DEFINITION:</p>
        <p className="mb-4">Big-O describes how runtime grows with input size n.</p>
        <CodeBlock>{`O(1)     — constant (hash lookup average, array index)
O(log n) — binary search, balanced BST height
O(n)     — single pass, BFS/DFS visit each node once in a tree
O(n log n) — sorting, many heap operations per element
O(n^2)   — nested loops on same array (naive)
O(2^n)   — brute-force subsets (avoid via DP)`}</CodeBlock>
        <p className="mb-1 font-semibold text-gray-900">COMMON MISTAKES:</p>
        <p className="mb-4">Forgetting sort cost; ignoring space recursion stack O(h).</p>
        <Divider />
        <p className="mb-4 text-lg font-bold text-gray-900">SPACE COMPLEXITY CHEAT SHEET</p>
        <CodeBlock>{`O(1) extra  — two pointers, iterative, in-place swap
O(n) extra  — copy array, hash map storing n keys
O(h) stack  — recursion depth = tree height
O(n) queue  — BFS frontier worst case`}</CodeBlock>
        <p className="mb-1 font-semibold text-gray-900">COMMON MISTAKES:</p>
        <p className="mb-4">Declaring huge auxiliary matrix when rolling array suffices.</p>
        <Divider />
        <p className="mb-1 font-semibold text-gray-900">TARGET COUNTS (ADJUST TO TIMELINE)</p>
        <ul className="mb-6 list-disc space-y-1 pl-6">
          <li>75+ Easy, 50+ Medium, 10+ Hard — minimum strong baseline for many FAANG loops.</li>
        </ul>
        <p className="mb-2">
          <span className="mr-2">🎯</span>
          <strong>Practice Problems</strong>
        </p>
        <ol className="mb-6 list-decimal space-y-1 pl-6 marker:text-primary">
          <li>Blind 75 / NeetCode 150 — pick one list and finish core tagged problems.</li>
          <li>Re-solve any problem that took &gt;45 min without notes after 3 days.</li>
          <li>One timed mock weekly (2 problems, 70 min) with spoken complexity analysis.</li>
        </ol>
        <p className="mb-2">
          <span className="mr-2">📚</span>
          <strong>Go Deeper</strong>
        </p>
        <ul className="list-disc space-y-1 pl-6 marker:text-primary">
          <li>
            <ResourceLink href="https://neetcode.io/practice">NeetCode 150</ResourceLink>
          </li>
          <li>
            <ResourceLink href="https://www.techinterviewhandbook.org/grind75">Grind 75</ResourceLink>
          </li>
          <li>
            <ResourceLink href="https://leetcode.com/discuss/study-guide">LeetCode study guides</ResourceLink>
          </li>
        </ul>
      </AccordionRow>
    </div>
  )
}

function JavaCurriculum({ openId, setOpenId }) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <AccordionRow
        id="java-d1"
        openId={openId}
        setOpenId={setOpenId}
        badge="Java Day 1"
        badgeClass="bg-red-600"
        title="Java — Day 1: Basics"
        right="Types, arrays, control flow, methods, Scanner"
      >
        <p className="mb-4 text-sm text-gray-700">
          Java powers large-scale backends at <strong>Google</strong> (many internal services), <strong>Amazon</strong> (AWS SDKs, retail services), and{' '}
          <strong>Microsoft</strong> (Azure, enterprise). Strong typing and the JVM help huge teams share code safely.
        </p>
        <p className="mb-6 text-lg font-bold text-gray-900">SECTION: VARIABLES AND DATA TYPES</p>
        <p className="mb-1 font-semibold text-gray-900">DEFINITION:</p>
        <p className="mb-4">
          Java variables must declare a type. Core primitives: <code className="rounded bg-gray-100 px-1">int</code>, <code className="rounded bg-gray-100 px-1">double</code>, <code className="rounded bg-gray-100 px-1">boolean</code>; reference type{' '}
          <code className="rounded bg-gray-100 px-1">String</code> holds immutable text.
        </p>
        <p className="mb-1 font-semibold text-gray-900">WHY IT EXISTS:</p>
        <p className="mb-4">Types catch errors at compile time and document intent — critical in million-line codebases.</p>
        <p className="mb-1 font-semibold text-gray-900">HOW COMPANIES USE IT:</p>
        <p className="mb-4">Services pass DTOs with explicit fields; configs parsed into typed objects; fewer prod surprises.</p>
        <p className="mb-1 font-semibold text-gray-900">HOW IT WORKS:</p>
        <p className="mb-4">
          <code className="rounded bg-gray-100 px-1">final</code> for constants; widening casts (int→double) implicit; narrowing requires explicit cast.
        </p>
        <p className="mb-2 font-semibold text-gray-900">CODE:</p>
        <CodeBlock>{`public class TypesDemo {
  public static void main(String[] args) {
    int count = 42;                 // 32-bit integer
    double price = 19.99;           // floating point
    String name = "CrackWithAI";   // capital S — reference type
    boolean active = true;
    System.out.println(name + " " + count + " " + price + " " + active);
  }
}`}</CodeBlock>
        <p className="mb-1 font-semibold text-gray-900">WHAT HAPPENS:</p>
        <p className="mb-4">JVM loads class, runs <code className="rounded bg-gray-100 px-1">main</code>, allocates locals on stack, prints concatenated string.</p>
        <p className="mb-1 font-semibold text-gray-900">COMMON MISTAKES:</p>
        <p className="mb-4">Using == on Strings (use <code className="rounded bg-gray-100 px-1">equals</code>); forgetting semicolons; <code className="rounded bg-gray-100 px-1">String s = 'a';</code> invalid.</p>
        <Divider />
        <p className="mb-6 text-lg font-bold text-gray-900">SECTION: ARRAYS AND ARRAYLISTS</p>
        <p className="mb-1 font-semibold text-gray-900">DEFINITION:</p>
        <p className="mb-4">
          Arrays have fixed length; <code className="rounded bg-gray-100 px-1">ArrayList</code> is a resizable list implementing <code className="rounded bg-gray-100 px-1">List</code>.
        </p>
        <p className="mb-1 font-semibold text-gray-900">WHY IT EXISTS:</p>
        <p className="mb-4">Batch processing and collections APIs need ordered storage; ArrayList gives amortized O(1) append.</p>
        <p className="mb-1 font-semibold text-gray-900">HOW COMPANIES USE IT:</p>
        <p className="mb-4">Return lists from DAOs; buffer rows before bulk insert; temporary in-memory structures in Spark/Java apps.</p>
        <CodeBlock>{`import java.util.ArrayList;
import java.util.Arrays;

public class ListsDemo {
  public static void main(String[] args) {
    int[] nums = {10, 20, 30};           // fixed size
    nums[0] = 15;

    ArrayList<String> companies = new ArrayList<>();
    companies.add("Google");
    companies.add("Amazon");
    companies.remove("Amazon");
    System.out.println(companies.size());
    System.out.println(Arrays.toString(nums));
  }
}`}</CodeBlock>
        <p className="mb-1 font-semibold text-gray-900">COMMON MISTAKES:</p>
        <p className="mb-4">Array index out of bounds; using raw types instead of <code className="rounded bg-gray-100 px-1">ArrayList&lt;String&gt;</code>.</p>
        <Divider />
        <p className="mb-6 text-lg font-bold text-gray-900">SECTION: CONTROL FLOW</p>
        <CodeBlock>{`public class FlowDemo {
  public static void main(String[] args) {
    int score = 85;
    if (score >= 90) {
      System.out.println("A");
    } else if (score >= 80) {
      System.out.println("B");
    } else {
      System.out.println("Below B");
    }

    int day = 3;
    switch (day) {
      case 1: System.out.println("Mon"); break;
      case 2: System.out.println("Tue"); break;
      default: System.out.println("Other");
    }

    for (int i = 0; i < 3; i++) {
      System.out.println(i);
    }

    int n = 0;
    while (n < 2) {
      System.out.println("while " + n);
      n++;
    }
  }
}`}</CodeBlock>
        <p className="mb-1 font-semibold text-gray-900">COMMON MISTAKES:</p>
        <p className="mb-4">Missing <code className="rounded bg-gray-100 px-1">break</code> in switch (fall-through); off-by-one in for loops.</p>
        <Divider />
        <p className="mb-6 text-lg font-bold text-gray-900">SECTION: METHODS</p>
        <CodeBlock>{`public class MethodsDemo {
  static int add(int a, int b) {
    return a + b;
  }

  public static void main(String[] args) {
    System.out.println(add(2, 3));
  }
}`}</CodeBlock>
        <p className="mb-1 font-semibold text-gray-900">COMMON MISTAKES:</p>
        <p className="mb-4">Forgetting <code className="rounded bg-gray-100 px-1">static</code> when calling from static main without an instance.</p>
        <Divider />
        <p className="mb-6 text-lg font-bold text-gray-900">SECTION: SCANNER (USER INPUT)</p>
        <CodeBlock>{`import java.util.Scanner;

public class ScanDemo {
  public static void main(String[] args) {
    Scanner sc = new Scanner(System.in);
    System.out.print("Name? ");
    String name = sc.nextLine();
    System.out.println("Hello " + name);
    sc.close();
  }
}`}</CodeBlock>
        <p className="mb-2">
          <span className="mr-2">🎯</span>
          <strong>Practice</strong>
        </p>
        <ol className="mb-4 list-decimal pl-6 marker:text-primary">
          <li>CLI calculator: read two ints, print sum/diff.</li>
          <li>Read N lines into ArrayList, print reversed.</li>
        </ol>
        <p className="mb-2">
          <span className="mr-2">📚</span>
          <strong>Go Deeper</strong>
        </p>
        <ul className="list-disc space-y-1 pl-6 marker:text-primary">
          <li>
            <ResourceLink href="https://docs.oracle.com/javase/tutorial/">Oracle Java Tutorial</ResourceLink>
          </li>
        </ul>
      </AccordionRow>

      <AccordionRow
        id="java-d2"
        openId={openId}
        setOpenId={setOpenId}
        badge="Java Day 2"
        badgeClass="bg-red-600"
        title="Java — Day 2: OOP"
        right="Classes, constructors, inheritance, interfaces"
      >
        <p className="mb-6 text-lg font-bold text-gray-900">SECTION: CLASSES AND OBJECTS</p>
        <p className="mb-1 font-semibold text-gray-900">DEFINITION:</p>
        <p className="mb-4">A class defines fields and methods; <code className="rounded bg-gray-100 px-1">new</code> creates an object instance on the heap.</p>
        <p className="mb-1 font-semibold text-gray-900">HOW COMPANIES USE IT:</p>
        <p className="mb-4">Domain models (Order, User) map cleanly to tables and APIs at Amazon/Google-scale services.</p>
        <CodeBlock>{`public class Student {
  private final String name;
  private double gpa;

  public Student(String name, double gpa) {
    this.name = name;
    this.gpa = gpa;
  }

  public boolean honorRoll() {
    return gpa >= 3.5;
  }
}`}</CodeBlock>
        <Divider />
        <p className="mb-6 text-lg font-bold text-gray-900">SECTION: CONSTRUCTORS</p>
        <p className="mb-4">Constructors initialize state; overload for multiple creation patterns; <code className="rounded bg-gray-100 px-1">this()</code> chains.</p>
        <Divider />
        <p className="mb-6 text-lg font-bold text-gray-900">SECTION: INHERITANCE AND super</p>
        <CodeBlock>{`public class GradStudent extends Student {
  private final String thesis;

  public GradStudent(String name, double gpa, String thesis) {
    super(name, gpa);
    this.thesis = thesis;
  }
}`}</CodeBlock>
        <Divider />
        <p className="mb-6 text-lg font-bold text-gray-900">SECTION: INTERFACES AND ABSTRACT CLASSES</p>
        <p className="mb-4">
          <strong>Interface</strong>: contract of methods a class must implement (supports multiple inheritance of type).{' '}
          <strong>Abstract class</strong>: shared partial implementation + abstract methods.
        </p>
        <CodeBlock>{`public interface Payable {
  Money amount();
}

public abstract class Invoice implements Payable {
  protected final String id;
  protected Invoice(String id) { this.id = id; }
}`}</CodeBlock>
        <Divider />
        <p className="mb-6 text-lg font-bold text-gray-900">SECTION: ACCESS MODIFIERS</p>
        <ul className="mb-4 list-disc pl-6 text-sm">
          <li>
            <code className="rounded bg-gray-100 px-1">public</code> — anywhere
          </li>
          <li>
            <code className="rounded bg-gray-100 px-1">protected</code> — package + subclasses
          </li>
          <li>package-private (no modifier) — same package</li>
          <li>
            <code className="rounded bg-gray-100 px-1">private</code> — class only (encapsulation)
          </li>
        </ul>
        <p className="mb-1 font-semibold text-gray-900">COMMON MISTAKES:</p>
        <p className="mb-4">Exposing mutable fields; breaking Liskov substitution when overriding.</p>
        <p className="mb-2">
          <span className="mr-2">🎯</span>
          <strong>Practice</strong>
        </p>
        <ol className="mb-4 list-decimal pl-6 marker:text-primary">
          <li>Model BankAccount with deposit/withdraw.</li>
          <li>Interface Drawable with Circle/Rectangle implementations.</li>
        </ol>
        <p className="mb-2">
          <span className="mr-2">📚</span>
          <strong>Go Deeper</strong>
        </p>
        <ul className="list-disc space-y-1 pl-6 marker:text-primary">
          <li>
            <ResourceLink href="https://docs.oracle.com/javase/tutorial/java/IandI/index.html">Oracle — Interfaces &amp; Inheritance</ResourceLink>
          </li>
        </ul>
      </AccordionRow>

      <AccordionRow
        id="java-w1"
        openId={openId}
        setOpenId={setOpenId}
        badge="Java Week 1"
        badgeClass="bg-red-700"
        title="Java — Week 1: Core Concepts"
        right="Exceptions, collections, generics, streams"
      >
        <p className="mb-6 text-lg font-bold text-gray-900">SECTION: EXCEPTION HANDLING</p>
        <p className="mb-1 font-semibold text-gray-900">DEFINITION:</p>
        <p className="mb-4">
          <code className="rounded bg-gray-100 px-1">try/catch/finally</code> handles recoverable errors; <code className="rounded bg-gray-100 px-1">throws</code> declares checked exceptions.
        </p>
        <CodeBlock>{`public class ExDemo {
  static int parse(String s) throws NumberFormatException {
    return Integer.parseInt(s);
  }

  public static void main(String[] args) {
    try {
      System.out.println(parse("42"));
      System.out.println(parse("oops"));
    } catch (NumberFormatException e) {
      System.out.println("bad number");
    } finally {
      System.out.println("cleanup");
    }
  }
}`}</CodeBlock>
        <Divider />
        <p className="mb-6 text-lg font-bold text-gray-900">SECTION: COLLECTIONS (LIST, MAP, SET, QUEUE)</p>
        <CodeBlock>{`import java.util.*;

public class CollDemo {
  public static void main(String[] args) {
    List<String> list = new ArrayList<>(List.of("a", "b"));
    Set<Integer> set = new HashSet<>(List.of(1, 1, 2));
    Map<String, Integer> map = new HashMap<>();
    map.put("google", 1);
    Queue<String> q = new ArrayDeque<>();
    q.add("x");
    System.out.println(list.size() + " " + set.size() + " " + map.get("google"));
  }
}`}</CodeBlock>
        <Divider />
        <p className="mb-6 text-lg font-bold text-gray-900">SECTION: GENERICS</p>
        <p className="mb-4">
          Type parameters (<code className="rounded bg-gray-100 px-1">List&lt;T&gt;</code>) enforce compile-time safety and eliminate casts — essential for APIs at scale.
        </p>
        <Divider />
        <p className="mb-6 text-lg font-bold text-gray-900">SECTION: LAMBDAS AND STREAMS</p>
        <CodeBlock>{`import java.util.List;

public class StreamDemo {
  public static void main(String[] args) {
    var nums = List.of(1, 2, 3, 4);
    int sum = nums.stream().filter(n -> n % 2 == 0).mapToInt(n -> n).sum();
    System.out.println(sum);
  }
}`}</CodeBlock>
        <Divider />
        <p className="mb-6 text-lg font-bold text-gray-900">SECTION: STRING MANIPULATION</p>
        <p className="mb-4">
          Use <code className="rounded bg-gray-100 px-1">StringBuilder</code> for heavy concatenation; <code className="rounded bg-gray-100 px-1">split</code>, <code className="rounded bg-gray-100 px-1">strip</code>, <code className="rounded bg-gray-100 px-1">substring</code>, <code className="rounded bg-gray-100 px-1">equalsIgnoreCase</code>.
        </p>
        <p className="mb-2">
          <span className="mr-2">🎯</span>
          <strong>Practice</strong>
        </p>
        <ol className="mb-4 list-decimal pl-6 marker:text-primary">
          <li>Read file lines into List, count word frequency with HashMap.</li>
          <li>Stream pipeline: map employees to salaries, average optional.</li>
        </ol>
        <p className="mb-2">
          <span className="mr-2">📚</span>
          <strong>Go Deeper</strong>
        </p>
        <ul className="list-disc space-y-1 pl-6 marker:text-primary">
          <li>
            <ResourceLink href="https://docs.oracle.com/javase/tutorial/collections/">Collections trail</ResourceLink>
          </li>
        </ul>
      </AccordionRow>

      <AccordionRow
        id="java-w2"
        openId={openId}
        setOpenId={setOpenId}
        badge="Java Week 2"
        badgeClass="bg-red-700"
        title="Java — Week 2: Interview Focus"
        right="Maps, lists, equals/hashCode, GC"
      >
        <p className="mb-6 text-lg font-bold text-gray-900">SECTION: HASHMAP VS HASHTABLE VS CONCURRENTHASHMAP</p>
        <p className="mb-1 font-semibold text-gray-900">DEFINITION:</p>
        <p className="mb-4">
          All map keys to values; <code className="rounded bg-gray-100 px-1">HashTable</code> is legacy synchronized; <code className="rounded bg-gray-100 px-1">HashMap</code> is default not thread-safe;{' '}
          <code className="rounded bg-gray-100 px-1">ConcurrentHashMap</code> supports safe concurrent updates with finer locking/CAS.
        </p>
        <p className="mb-1 font-semibold text-gray-900">HOW COMPANIES USE IT:</p>
        <p className="mb-4">Caches, rate limit counters, session maps — choose thread-safety based on access pattern.</p>
        <p className="mb-1 font-semibold text-gray-900">COMMON MISTAKES:</p>
        <p className="mb-4">Mutating keys after insert; using HashMap from many threads without synchronization.</p>
        <Divider />
        <p className="mb-6 text-lg font-bold text-gray-900">SECTION: ARRAYLIST VS LINKEDLIST</p>
        <p className="mb-4">
          ArrayList: O(1) indexed access, cache-friendly; LinkedList: O(1) insert middle with iterator, poor random access. Most
          services default to ArrayList.
        </p>
        <Divider />
        <p className="mb-6 text-lg font-bold text-gray-900">SECTION: COMPARABLE VS COMPARATOR</p>
        <CodeBlock>{`import java.util.*;

record Person(String name, int age) implements Comparable<Person> {
  public int compareTo(Person o) {
    return Integer.compare(this.age, o.age);
  }
}

List<Person> people = new ArrayList<>();
Collections.sort(people, Comparator.comparing(Person::name));`}</CodeBlock>
        <Divider />
        <p className="mb-6 text-lg font-bold text-gray-900">SECTION: equals() AND hashCode()</p>
        <p className="mb-4">
          Contract: equal objects must have equal hash codes; used by HashMap/HashSet. Generate with IDE or records carefully.
        </p>
        <Divider />
        <p className="mb-6 text-lg font-bold text-gray-900">SECTION: MEMORY AND GARBAGE COLLECTION</p>
        <p className="mb-4">
          Heap (objects) vs stack (frames). GC reclaims unreachable objects; generational GC assumes most objects die young.
          Avoid unnecessary object churn in hot loops at Google-scale latency targets.
        </p>
        <p className="mb-2">
          <span className="mr-2">🎯</span>
          <strong>Practice</strong>
        </p>
        <ol className="mb-4 list-decimal pl-6 marker:text-primary">
          <li>Implement LRU cache (HashMap + doubly linked list).</li>
          <li>Debug equals/hashCode bug with HashSet duplicates.</li>
        </ol>
        <p className="mb-2">
          <span className="mr-2">📚</span>
          <strong>Go Deeper</strong>
        </p>
        <ul className="list-disc space-y-1 pl-6 marker:text-primary">
          <li>
            <ResourceLink href="https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/concurrent/ConcurrentHashMap.html">
              ConcurrentHashMap Javadoc
            </ResourceLink>
          </li>
        </ul>
      </AccordionRow>
    </div>
  )
}

function CCurriculum({ openId, setOpenId }) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <AccordionRow
        id="c-d1"
        openId={openId}
        setOpenId={setOpenId}
        badge="C Day 1"
        badgeClass="bg-violet-700"
        title="C — Day 1: Basics"
        right="Types, printf/scanf, operators, control flow"
      >
        <p className="mb-6 text-lg font-bold text-gray-900">SECTION: WHAT IS C?</p>
        <p className="mb-1 font-semibold text-gray-900">DEFINITION:</p>
        <p className="mb-4">
          C is the mother of modern systems languages. Created in 1972 at Bell Labs, it is still used in operating systems,
          embedded firmware, and performance-critical components.
        </p>
        <p className="mb-1 font-semibold text-gray-900">WHY IT EXISTS:</p>
        <p className="mb-4">Portable assembly: fine control over memory and hardware with minimal runtime.</p>
        <p className="mb-1 font-semibold text-gray-900">HOW COMPANIES USE IT:</p>
        <p className="mb-4">
          Linux kernel (C), device drivers, automotive (e.g. Tesla ECU firmware stacks), aerospace (Boeing avionics modules),
          medical devices — wherever predictability and certification matter.
        </p>
        <Divider />
        <p className="mb-6 text-lg font-bold text-gray-900">SECTION: VARIABLES, TYPES, FORMAT SPECIFIERS</p>
        <CodeBlock>{`#include <stdio.h>

int main(void) {
  int age = 25;
  double gpa = 3.9;
  char grade = 'A';
  printf("age=%d gpa=%.2f grade=%c\\n", age, gpa, grade);
  return 0;
}`}</CodeBlock>
        <p className="mb-1 font-semibold text-gray-900">COMMON MISTAKES:</p>
        <p className="mb-4">Wrong format specifier → undefined behavior; uninitialized locals.</p>
        <Divider />
        <p className="mb-6 text-lg font-bold text-gray-900">SECTION: PRINTF AND SCANF</p>
        <CodeBlock>{`#include <stdio.h>

int main(void) {
  int x;
  printf("Enter int: ");
  scanf("%d", &x);   // needs address of x
  printf("You entered %d\\n", x);
  return 0;
}`}</CodeBlock>
        <Divider />
        <p className="mb-6 text-lg font-bold text-gray-900">SECTION: OPERATORS AND CONTROL FLOW</p>
        <CodeBlock>{`#include <stdio.h>

int main(void) {
  int a = 5, b = 2;
  printf("%d %d %d\\n", a + b, a / b, a % b);

  if (a > b) {
    printf("greater\\n");
  } else {
    printf("not\\n");
  }

  for (int i = 0; i < 3; i++) {
    printf("%d ", i);
  }
  return 0;
}`}</CodeBlock>
        <p className="mb-2">
          <span className="mr-2">🎯</span>
          <strong>Practice</strong>
        </p>
        <ol className="mb-4 list-decimal pl-6 marker:text-primary">
          <li>Fahrenheit ↔ Celsius converter with scanf/printf.</li>
          <li>Print primes up to N.</li>
        </ol>
        <p className="mb-2">
          <span className="mr-2">📚</span>
          <strong>Go Deeper</strong>
        </p>
        <ul className="list-disc space-y-1 pl-6 marker:text-primary">
          <li>
            <ResourceLink href="https://en.cppreference.com/w/c">cppreference.com — C</ResourceLink>
          </li>
        </ul>
      </AccordionRow>

      <AccordionRow
        id="c-d2"
        openId={openId}
        setOpenId={setOpenId}
        badge="C Day 2"
        badgeClass="bg-violet-700"
        title="C — Day 2: Pointers"
        right="&, *, arithmetic, arrays, NULL"
      >
        <p className="mb-1 font-semibold text-gray-900">DEFINITION:</p>
        <p className="mb-4">
          A pointer stores the memory address of another value. C exposes addresses explicitly — most managed languages hide
          this.
        </p>
        <p className="mb-1 font-semibold text-gray-900">WHY IT EXISTS:</p>
        <p className="mb-4">Direct memory control for performance: O(1) passing large structs by address, dynamic arrays, hardware MMIO.</p>
        <p className="mb-1 font-semibold text-gray-900">HOW COMPANIES USE IT:</p>
        <p className="mb-4">OS kernels, embedded controllers at Tesla, flight software, drivers — pointers are unavoidable.</p>
        <p className="mb-1 font-semibold text-gray-900">HOW IT WORKS:</p>
        <p className="mb-4">
          <code className="rounded bg-gray-100 px-1">&amp;x</code> address-of; <code className="rounded bg-gray-100 px-1">*p</code> dereference; pointer arithmetic moves by sizeof(type); array name decays to pointer to first
          element; <code className="rounded bg-gray-100 px-1">NULL</code> is no address.
        </p>
        <CodeBlock>{`#include <stdio.h>

int main(void) {
  int x = 42;
  int *p = &x;        // p holds address of x
  printf("%d\\n", *p); // 42 — follow address
  *p = 7;             // writes through pointer
  printf("%d\\n", x);  // 7

  int arr[] = {10, 20, 30};
  int *q = arr;       // same as &arr[0]
  printf("%d %d\\n", q[1], *(q + 1)); // 20 20

  int *n = NULL;
  if (n == NULL) {
    printf("safe\\n");
  }
  return 0;
}`}</CodeBlock>
        <p className="mb-1 font-semibold text-gray-900">COMMON MISTAKES:</p>
        <p className="mb-4">Dangling pointers; dereferencing NULL; out-of-bounds pointer arithmetic.</p>
        <p className="mb-2">
          <span className="mr-2">🎯</span>
          <strong>Practice</strong>
        </p>
        <ol className="mb-4 list-decimal pl-6 marker:text-primary">
          <li>Swap two ints using pointers.</li>
          <li>Reverse array in-place with two pointers.</li>
        </ol>
        <p className="mb-2">
          <span className="mr-2">📚</span>
          <strong>Go Deeper</strong>
        </p>
        <ul className="list-disc space-y-1 pl-6 marker:text-primary">
          <li>
            <ResourceLink href="https://en.cppreference.com/w/c/language/pointer">cppreference — pointers</ResourceLink>
          </li>
        </ul>
      </AccordionRow>

      <AccordionRow
        id="c-w1"
        openId={openId}
        setOpenId={setOpenId}
        badge="C Week 1"
        badgeClass="bg-violet-800"
        title="C — Week 1: Core Topics"
        right="Functions, strings, structs, malloc, files"
      >
        <p className="mb-6 text-lg font-bold text-gray-900">SECTION: FUNCTIONS AND RECURSION</p>
        <CodeBlock>{`#include <stdio.h>

int fact(int n) {
  if (n <= 1) return 1;
  return n * fact(n - 1);
}

int main(void) {
  printf("%d\\n", fact(5));
  return 0;
}`}</CodeBlock>
        <Divider />
        <p className="mb-6 text-lg font-bold text-gray-900">SECTION: ARRAYS AND STRINGS</p>
        <p className="mb-4">C strings are char arrays ending with <code className="rounded bg-gray-100 px-1">'\\0'</code>. Use <code className="rounded bg-gray-100 px-1">strlen</code>, <code className="rounded bg-gray-100 px-1">strcmp</code>, <code className="rounded bg-gray-100 px-1">strcpy</code> from <code className="rounded bg-gray-100 px-1">&lt;string.h&gt;</code>.</p>
        <Divider />
        <p className="mb-6 text-lg font-bold text-gray-900">SECTION: STRUCTURES AND UNIONS</p>
        <CodeBlock>{`#include <stdio.h>

typedef struct {
  char name[32];
  int id;
} Student;

typedef union {
  int i;
  float f;
} Payload;`}</CodeBlock>
        <Divider />
        <p className="mb-6 text-lg font-bold text-gray-900">SECTION: DYNAMIC MEMORY</p>
        <CodeBlock>{`#include <stdlib.h>
#include <stdio.h>

int main(void) {
  int *p = malloc(10 * sizeof(int));
  if (!p) return 1;
  p[0] = 5;
  free(p);   // release
  return 0;
}`}</CodeBlock>
        <Divider />
        <p className="mb-6 text-lg font-bold text-gray-900">SECTION: FILE I/O</p>
        <CodeBlock>{`#include <stdio.h>

int main(void) {
  FILE *f = fopen("out.txt", "w");
  if (!f) return 1;
  fprintf(f, "hello\\n");
  fclose(f);
  return 0;
}`}</CodeBlock>
        <p className="mb-2">
          <span className="mr-2">🎯</span>
          <strong>Practice</strong>
        </p>
        <ol className="mb-4 list-decimal pl-6 marker:text-primary">
          <li>Linked list of ints (malloc/free each node).</li>
          <li>Word count program reading a text file.</li>
        </ol>
        <p className="mb-2">
          <span className="mr-2">📚</span>
          <strong>Go Deeper</strong>
        </p>
        <ul className="list-disc space-y-1 pl-6 marker:text-primary">
          <li>
            <ResourceLink href="https://www.gnu.org/software/libc/manual/html_node/index.html">GNU C Library manual</ResourceLink>
          </li>
        </ul>
      </AccordionRow>
    </div>
  )
}

function CppCurriculum({ openId, setOpenId }) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <AccordionRow
        id="cpp-d1"
        openId={openId}
        setOpenId={setOpenId}
        badge="C++ Day 1"
        badgeClass="bg-emerald-800"
        title="C++ — Day 1: Basics + OOP"
        right="Classes, RAII, destructors"
      >
        <p className="mb-1 font-semibold text-gray-900">DEFINITION:</p>
        <p className="mb-4">
          C++ adds classes, references, templates, and RAII on top of C. RAII: acquire resource in constructor, release in
          destructor — ties lifetime to scope.
        </p>
        <p className="mb-1 font-semibold text-gray-900">HOW COMPANIES USE IT:</p>
        <p className="mb-4">Game engines, browsers, trading systems, Google/Meta infra hot paths — where C++ performance wins.</p>
        <CodeBlock>{`#include <iostream>
#include <string>

class Student {
  std::string name;
  double gpa;
public:
  Student(std::string n, double g) : name(std::move(n)), gpa(g) {}
  ~Student() { /* cleanup if needed */ }
  bool honor() const { return gpa >= 3.5; }
};

int main() {
  Student s("Sai", 3.9);
  std::cout << std::boolalpha << s.honor() << "\\n";
}`}</CodeBlock>
        <p className="mb-1 font-semibold text-gray-900">COMMON MISTAKES:</p>
        <p className="mb-4">Rule of three/five violations; slicing when copying polymorphic objects by value.</p>
        <p className="mb-2">
          <span className="mr-2">🎯</span>
          <strong>Practice</strong>
        </p>
        <ol className="mb-4 list-decimal pl-6 marker:text-primary">
          <li>RAII File wrapper wrapping FILE* or fstream.</li>
        </ol>
        <p className="mb-2">
          <span className="mr-2">📚</span>
          <strong>Go Deeper</strong>
        </p>
        <ul className="list-disc space-y-1 pl-6 marker:text-primary">
          <li>
            <ResourceLink href="https://en.cppreference.com/w/cpp/language/raii">cppreference — RAII</ResourceLink>
          </li>
        </ul>
      </AccordionRow>

      <AccordionRow
        id="cpp-d2"
        openId={openId}
        setOpenId={setOpenId}
        badge="C++ Day 2"
        badgeClass="bg-emerald-800"
        title="C++ — Day 2: Advanced"
        right="Templates, STL, iterators, smart pointers"
      >
        <p className="mb-6 text-lg font-bold text-gray-900">SECTION: TEMPLATES</p>
        <CodeBlock>{`template <typename T>
T add(T a, T b) { return a + b; }`}</CodeBlock>
        <Divider />
        <p className="mb-6 text-lg font-bold text-gray-900">SECTION: STL CONTAINERS</p>
        <CodeBlock>{`#include <bits/stdc++.h>
using namespace std;

int main() {
  vector<int> v = {3,1,4};
  map<string,int> m{{"a",1}};
  set<int> s{1,2,2};
  queue<int> q; q.push(1);
  stack<int> st; st.push(2);
  priority_queue<int> pq; pq.push(3);
}`}</CodeBlock>
        <Divider />
        <p className="mb-6 text-lg font-bold text-gray-900">SECTION: ITERATORS</p>
        <p className="mb-4">Range-for uses iterators; algorithms take begin/end pairs.</p>
        <Divider />
        <p className="mb-6 text-lg font-bold text-gray-900">SECTION: SMART POINTERS</p>
        <CodeBlock>{`#include <memory>
auto u = std::make_unique<int>(5);
auto s = std::make_shared<int>(7);`}</CodeBlock>
        <p className="mb-2">
          <span className="mr-2">🎯</span>
          <strong>Practice</strong>
        </p>
        <ol className="mb-4 list-decimal pl-6 marker:text-primary">
          <li>Template max() for int/double.</li>
          <li>shared_ptr graph node with weak_ptr back-edges.</li>
        </ol>
        <p className="mb-2">
          <span className="mr-2">📚</span>
          <strong>Go Deeper</strong>
        </p>
        <ul className="list-disc space-y-1 pl-6 marker:text-primary">
          <li>
            <ResourceLink href="https://en.cppreference.com/w/cpp/container">cppreference — containers</ResourceLink>
          </li>
        </ul>
      </AccordionRow>

      <AccordionRow
        id="cpp-w1"
        openId={openId}
        setOpenId={setOpenId}
        badge="C++ Week 1"
        badgeClass="bg-emerald-900"
        title="C++ — Week 1: Competitive Programming"
        right="Fast I/O, STL patterns, algorithms, bits"
      >
        <p className="mb-6 text-lg font-bold text-gray-900">SECTION: FAST I/O</p>
        <CodeBlock>{`#include <bits/stdc++.h>
using namespace std;

int main() {
  ios::sync_with_stdio(false);
  cin.tie(nullptr);
  int n; cin >> n;
  cout << n * 2 << "\\n";
}`}</CodeBlock>
        <Divider />
        <p className="mb-6 text-lg font-bold text-gray-900">SECTION: STL INTERVIEW PATTERNS</p>
        <p className="mb-4">Frequency with map; top-K with priority_queue; sliding window with deque; multiset for duplicates.</p>
        <Divider />
        <p className="mb-6 text-lg font-bold text-gray-900">SECTION: ALGORITHMS HEADER</p>
        <CodeBlock>{`#include <algorithm>
#include <vector>
using namespace std;

int main() {
  vector<int> v = {1,3,3,7};
  sort(v.begin(), v.end());
  bool ok = binary_search(v.begin(), v.end(), 3);
  auto it = lower_bound(v.begin(), v.end(), 3);
  auto jt = upper_bound(v.begin(), v.end(), 3);
}`}</CodeBlock>
        <Divider />
        <p className="mb-6 text-lg font-bold text-gray-900">SECTION: BIT MANIPULATION BASICS</p>
        <CodeBlock>{`int x = 6;            // 110
int set = x | (1<<0); // set bit 0
int clr = x & ~(1<<1);
bool on = (x >> 2) & 1;`}</CodeBlock>
        <p className="mb-2">
          <span className="mr-2">🎯</span>
          <strong>Practice</strong>
        </p>
        <ol className="mb-4 list-decimal pl-6 marker:text-primary">
          <li>Implement lower_bound behavior manually on sorted vector.</li>
          <li>Count set bits (Brian Kernighan).</li>
        </ol>
        <p className="mb-2">
          <span className="mr-2">📚</span>
          <strong>Go Deeper</strong>
        </p>
        <ul className="list-disc space-y-1 pl-6 marker:text-primary">
          <li>
            <ResourceLink href="https://en.cppreference.com/w/cpp/algorithm">cppreference — algorithms</ResourceLink>
          </li>
        </ul>
      </AccordionRow>
    </div>
  )
}

function SqlCurriculum({ openId, setOpenId }) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <AccordionRow
        id="sql-basic"
        openId={openId}
        setOpenId={setOpenId}
        badge="SQL"
        badgeClass="bg-amber-800"
        title="SQL — Basics"
        right="SELECT, filters, aggregates, GROUP BY, joins overview"
      >
        <p className="mb-1 font-semibold text-gray-900">DEFINITION:</p>
        <p className="mb-4">
          SQL (Structured Query Language) is how you query relational databases. Every major company stores orders, users, and
          events in databases — SQL extracts exactly the slice you need.
        </p>
        <p className="mb-1 font-semibold text-gray-900">WHY IT EXISTS:</p>
        <p className="mb-4">Billions of rows require declarative filtering, aggregation, and joins — standardized since the 1970s.</p>
        <p className="mb-1 font-semibold text-gray-900">HOW COMPANIES USE IT:</p>
        <p className="mb-4">
          Amazon queries order pipelines; Netflix analyzes viewing in data warehouses; analysts at Microsoft, Google, and PayPal
          live in SQL daily.
        </p>
        <p className="mb-2 font-semibold text-gray-900">CODE:</p>
        <CodeBlock>{`SELECT name, salary
FROM employees
WHERE department = 'Engineering'
  AND salary BETWEEN 80000 AND 150000
  AND level IN ('L4','L5')
  AND email NOT LIKE '%@test.com'
ORDER BY salary DESC
LIMIT 20;`}</CodeBlock>
        <CodeBlock>{`SELECT department,
       COUNT(*) AS headcount,
       AVG(salary) AS avg_sal,
       MAX(salary) AS top_sal
FROM employees
GROUP BY department
HAVING COUNT(*) >= 5;`}</CodeBlock>
        <p className="mb-1 font-semibold text-gray-900">COMMON MISTAKES:</p>
        <p className="mb-4">Using WHERE on aggregates (use HAVING); forgetting GROUP BY columns; duplicate rows from joins.</p>
        <p className="mb-2">
          <span className="mr-2">🎯</span>
          <strong>Practice</strong>
        </p>
        <ol className="mb-4 list-decimal pl-6 marker:text-primary">
          <li>Monthly revenue by region from orders table.</li>
          <li>Employees earning above department average.</li>
        </ol>
        <p className="mb-2">
          <span className="mr-2">📚</span>
          <strong>Go Deeper</strong>
        </p>
        <ul className="list-disc space-y-1 pl-6 marker:text-primary">
          <li>
            <ResourceLink href="https://www.postgresql.org/docs/current/tutorial-sql.html">PostgreSQL SQL intro</ResourceLink>
          </li>
        </ul>
      </AccordionRow>

      <AccordionRow
        id="sql-joins"
        openId={openId}
        setOpenId={setOpenId}
        badge="SQL"
        badgeClass="bg-amber-800"
        title="SQL — Joins (deep dive)"
        right="Inner, left, right, full"
      >
        <p className="mb-1 font-semibold text-gray-900">DEFINITION:</p>
        <p className="mb-4">
          A JOIN combines rows from two tables using a related column. Example schema: <code className="rounded bg-gray-100 px-1">users(user_id, name, email)</code>,{' '}
          <code className="rounded bg-gray-100 px-1">orders(order_id, user_id, product, amount)</code>.
        </p>
        <p className="mb-1 font-semibold text-gray-900">HOW IT WORKS — INNER JOIN:</p>
        <p className="mb-4">Only rows where match exists on <strong>both</strong> sides.</p>
        <CodeBlock>{`SELECT u.name, o.product, o.amount
FROM users u
INNER JOIN orders o ON o.user_id = u.user_id;`}</CodeBlock>
        <p className="mb-4 text-sm text-gray-700">Output: one row per matching pair — users with no orders disappear.</p>
        <p className="mb-1 font-semibold text-gray-900">LEFT JOIN:</p>
        <p className="mb-4">All users, plus orders if any; missing order columns become NULL.</p>
        <CodeBlock>{`SELECT u.name, o.order_id
FROM users u
LEFT JOIN orders o ON o.user_id = u.user_id;`}</CodeBlock>
        <p className="mb-1 font-semibold text-gray-900">RIGHT JOIN:</p>
        <p className="mb-4">All orders, users optional — mirror of LEFT; some teams prefer flipping tables and using LEFT only.</p>
        <CodeBlock>{`SELECT u.name, o.product
FROM users u
RIGHT JOIN orders o ON o.user_id = u.user_id;`}</CodeBlock>
        <p className="mb-1 font-semibold text-gray-900">FULL OUTER JOIN:</p>
        <p className="mb-4">Keeps all users and all orders; non-matching sides NULL-padded.</p>
        <CodeBlock>{`SELECT u.name, o.product
FROM users u
FULL OUTER JOIN orders o ON o.user_id = u.user_id;`}</CodeBlock>
        <p className="mb-1 font-semibold text-gray-900">VISUAL:</p>
        <p className="mb-4">Think Venn diagrams: inner = intersection; left = left circle + overlap; full = union with blanks.</p>
        <p className="mb-1 font-semibold text-gray-900">COMMON MISTAKES:</p>
        <p className="mb-4">Joining on wrong key; accidental cross join (missing ON); duplicate explosion from one-to-many.</p>
        <p className="mb-2">
          <span className="mr-2">📚</span>
          <strong>Go Deeper</strong>
        </p>
        <ul className="list-disc space-y-1 pl-6 marker:text-primary">
          <li>
            <ResourceLink href="https://sqlbolt.com/lesson/select-queries-with-joins">SQLBolt — Joins</ResourceLink>
          </li>
        </ul>
      </AccordionRow>

      <AccordionRow
        id="sql-adv"
        openId={openId}
        setOpenId={setOpenId}
        badge="SQL"
        badgeClass="bg-amber-900"
        title="SQL — Advanced"
        right="Subqueries, CTEs, windows, indexes, EXPLAIN"
      >
        <p className="mb-6 text-lg font-bold text-gray-900">SECTION: SUBQUERIES</p>
        <CodeBlock>{`SELECT name
FROM employees
WHERE salary > (SELECT AVG(salary) FROM employees);`}</CodeBlock>
        <Divider />
        <p className="mb-6 text-lg font-bold text-gray-900">SECTION: CTES (WITH)</p>
        <CodeBlock>{`WITH dept_avg AS (
  SELECT department_id, AVG(salary) AS avg_sal
  FROM employees
  GROUP BY department_id
)
SELECT e.name, e.salary, d.avg_sal
FROM employees e
JOIN dept_avg d ON e.department_id = d.department_id
WHERE e.salary > d.avg_sal;`}</CodeBlock>
        <Divider />
        <p className="mb-6 text-lg font-bold text-gray-900">SECTION: WINDOW FUNCTIONS</p>
        <CodeBlock>{`SELECT name, salary,
       ROW_NUMBER() OVER (PARTITION BY department_id ORDER BY salary DESC) AS rn,
       RANK() OVER (PARTITION BY department_id ORDER BY salary DESC) AS rnk,
       LAG(salary) OVER (ORDER BY hire_date) AS prev_sal
FROM employees;`}</CodeBlock>
        <Divider />
        <p className="mb-6 text-lg font-bold text-gray-900">SECTION: INDEXES</p>
        <p className="mb-4">
          B-tree indexes speed equality/range on columns; composite indexes (a,b) help filters on prefix a. Tradeoff: faster reads,
          slower writes, storage.
        </p>
        <CodeBlock>{`CREATE INDEX idx_orders_user ON orders(user_id);`}</CodeBlock>
        <Divider />
        <p className="mb-6 text-lg font-bold text-gray-900">SECTION: EXPLAIN</p>
        <p className="mb-4">Run <code className="rounded bg-gray-100 px-1">EXPLAIN (ANALYZE, BUFFERS)</code> in Postgres to see seq scan vs index scan, row estimates, actual time.</p>
        <p className="mb-2">
          <span className="mr-2">📚</span>
          <strong>Go Deeper</strong>
        </p>
        <ul className="list-disc space-y-1 pl-6 marker:text-primary">
          <li>
            <ResourceLink href="https://use-the-index-luke.com/">Use The Index, Luke</ResourceLink>
          </li>
        </ul>
      </AccordionRow>

      <AccordionRow
        id="sql-practice"
        openId={openId}
        setOpenId={setOpenId}
        badge="SQL"
        badgeClass="bg-amber-700"
        title="SQL — 10 Practice Problems"
        right="Questions + solutions"
      >
        <ol className="list-decimal space-y-8 pl-6 text-sm leading-relaxed marker:text-primary">
          <li>
            <strong>Users with &gt;3 orders</strong>
            <CodeBlock>{`SELECT u.user_id, u.name, COUNT(o.order_id) AS cnt
FROM users u
JOIN orders o ON o.user_id = u.user_id
GROUP BY u.user_id, u.name
HAVING COUNT(o.order_id) > 3;`}</CodeBlock>
            <p className="mt-2 text-gray-700">
              <code className="rounded bg-gray-100 px-1">JOIN</code> links users to orders; <code className="rounded bg-gray-100 px-1">GROUP BY</code> collapses per user;{' '}
              <code className="rounded bg-gray-100 px-1">HAVING</code> filters aggregates (&gt;3).
            </p>
          </li>
          <li>
            <strong>Second highest salary</strong>
            <CodeBlock>{`SELECT MAX(salary) AS second_highest
FROM employees
WHERE salary < (SELECT MAX(salary) FROM employees);`}</CodeBlock>
            <p className="mt-2 text-gray-700">Subquery finds top salary; outer max finds best below that. (Handles ties with dense_rank variant in production.)</p>
          </li>
          <li>
            <strong>Earn more than manager</strong>
            <CodeBlock>{`SELECT e.name
FROM employees e
JOIN employees m ON e.manager_id = m.employee_id
WHERE e.salary > m.salary;`}</CodeBlock>
            <p className="mt-2 text-gray-700">Self-join maps employee row to manager row via manager_id.</p>
          </li>
          <li>
            <strong>Duplicate emails</strong>
            <CodeBlock>{`SELECT email
FROM users
GROUP BY email
HAVING COUNT(*) > 1;`}</CodeBlock>
            <p className="mt-2 text-gray-700">Groups identical emails; keeps those appearing more than once.</p>
          </li>
          <li>
            <strong>Customers who never ordered</strong>
            <CodeBlock>{`SELECT c.customer_id
FROM customers c
LEFT JOIN orders o ON o.customer_id = c.customer_id
WHERE o.order_id IS NULL;`}</CodeBlock>
            <p className="mt-2 text-gray-700">LEFT JOIN preserves all customers; NULL order means no match.</p>
          </li>
          <li>
            <strong>Top 3 products per category by sales</strong>
            <CodeBlock>{`SELECT category_id, product_id, sales
FROM (
  SELECT category_id, product_id, sales,
         ROW_NUMBER() OVER (PARTITION BY category_id ORDER BY sales DESC) AS rn
  FROM product_sales
) t
WHERE rn <= 3;`}</CodeBlock>
            <p className="mt-2 text-gray-700">Window ranks within each category; filter rn for top 3.</p>
          </li>
          <li>
            <strong>Running total of sales by date</strong>
            <CodeBlock>{`SELECT sale_date, amount,
       SUM(amount) OVER (ORDER BY sale_date ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS running_total
FROM daily_sales;`}</CodeBlock>
            <p className="mt-2 text-gray-700">Ordered window frame accumulates sum as dates advance.</p>
          </li>
          <li>
            <strong>Users active in last 30 days</strong>
            <CodeBlock>{`SELECT DISTINCT user_id
FROM events
WHERE event_time >= NOW() - INTERVAL '30 days';`}</CodeBlock>
            <p className="mt-2 text-gray-700">Time filter on fact table; dialect may use DATE_SUB/CURRENT_TIMESTAMP.</p>
          </li>
          <li>
            <strong>Department with highest average salary</strong>
            <CodeBlock>{`SELECT department_id
FROM employees
GROUP BY department_id
ORDER BY AVG(salary) DESC
LIMIT 1;`}</CodeBlock>
            <p className="mt-2 text-gray-700">Aggregate per dept, sort by avg desc, take first.</p>
          </li>
          <li>
            <strong>Managers with &gt;5 reports</strong>
            <CodeBlock>{`SELECT manager_id
FROM employees
WHERE manager_id IS NOT NULL
GROUP BY manager_id
HAVING COUNT(*) > 5;`}</CodeBlock>
            <p className="mt-2 text-gray-700">Counts direct reports per manager_id using GROUP BY + HAVING.</p>
          </li>
        </ol>
        <p className="mb-2 mt-6">
          <span className="mr-2">📚</span>
          <strong>Go Deeper</strong>
        </p>
        <ul className="list-disc space-y-1 pl-6 marker:text-primary">
          <li>
            <ResourceLink href="https://leetcode.com/studyplan/sql-50/">LeetCode SQL 50</ResourceLink>
          </li>
        </ul>
      </AccordionRow>
    </div>
  )
}

function GenericTopicCurriculum({ topic, openId, setOpenId }) {
  const blocks = {
    'ml-ai': {
      rows: [
        {
          id: 'm1',
          badge: 'Basics',
          bc: 'bg-orange-900',
          title: 'Supervised learning',
          right: 'Train / test split',
          body: (
            <p>
              Learn linear/logistic regression intuition, overfitting, regularization, and metrics (precision/recall). Use
              scikit-learn for small experiments.
            </p>
          ),
        },
      ],
    },
    dsa: {
      rows: [
        {
          id: 'd1',
          badge: 'Track',
          bc: 'bg-indigo-800',
          title: '4-week core path',
          right: 'Arrays → graphs → DP',
          body: (
            <p>
              Follow the same weekly structure as the Python DSA weeks: arrays/hashmaps, stacks/BST, trees/graphs, then DP.
              Implement each pattern in your strongest language.
            </p>
          ),
        },
      ],
    },
    'web-dev': {
      rows: [
        {
          id: 'w1',
          badge: 'Web 1',
          bc: 'bg-slate-700',
          title: 'HTML, CSS, JS fundamentals',
          right: 'Layout & DOM',
          body: <p>Semantic HTML, flexbox/grid, fetch API, and accessibility basics (labels, focus, contrast).</p>,
        },
        {
          id: 'w2',
          badge: 'Web 2',
          bc: 'bg-slate-700',
          title: 'React mindset',
          right: 'Components & state',
          body: (
            <p>
              Components as functions, one-way data flow, hooks for state/effects, and keeping UI pure where possible.
            </p>
          ),
        },
      ],
    },
  }

  const cfg = blocks[topic]
  if (!cfg) return null

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      {cfg.rows.map((r) => (
        <AccordionRow
          key={r.id}
          id={r.id}
          openId={openId}
          setOpenId={setOpenId}
          badge={r.badge}
          badgeClass={r.bc}
          title={r.title}
          right={r.right}
        >
          {r.body}
        </AccordionRow>
      ))}
    </div>
  )
}

export default function LearningPlan() {
  const location = useLocation()
  const curriculumRef = useRef(null)

  const [mode, setMode] = useState('learning')
  const [heroSearch, setHeroSearch] = useState('')
  const [companyQuery, setCompanyQuery] = useState('')
  const [selectedCompany, setSelectedCompany] = useState(null)
  const [activeTopic, setActiveTopic] = useState(null)
  const [openAccordion, setOpenAccordion] = useState(null)

  const filteredCards = useMemo(() => {
    const q = heroSearch.trim().toLowerCase()
    if (!q) return EXPLORE_CARDS
    return EXPLORE_CARDS.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.keywords.includes(q),
    )
  }, [heroSearch])

  const filteredCompanies = useMemo(() => {
    const q = companyQuery.trim().toLowerCase()
    if (!q) return ALL_COMPANIES
    return ALL_COMPANIES.filter((c) => c.toLowerCase().includes(q))
  }, [companyQuery])

  function scrollToCurriculum() {
    requestAnimationFrame(() => {
      curriculumRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }

  function openTopic(id) {
    setActiveTopic(id)
    setOpenAccordion(null)
    scrollToCurriculum()
  }

  useEffect(() => {
    const hash = (location.hash || '').replace('#', '')
    const valid = [...EXPLORE_CARDS.map((c) => c.id), 'web-dev'].includes(hash)
    if (valid && hash) {
      setActiveTopic(hash)
      scrollToCurriculum()
    }
  }, [location.hash])

  const showInterviewBanner = mode === 'interview'
  const note = selectedCompany ? getCompanyNote(selectedCompany) : null

  return (
    <div className="min-h-screen bg-bg pb-24 text-gray-900">
      <Navbar />

      <section className="bg-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <h1 className="text-center text-[32px] font-bold text-gray-900">What do you want to learn today?</h1>

          <div className="mx-auto mt-8 flex max-w-[600px] items-center rounded-lg border border-gray-300 bg-white px-4">
            <input
              type="search"
              value={heroSearch}
              onChange={(e) => setHeroSearch(e.target.value)}
              placeholder="Search topics, languages, concepts..."
              className="h-[52px] w-full border-0 bg-transparent text-[15px] text-gray-900 outline-none placeholder:text-gray-400"
            />
            <Search className="h-5 w-5 shrink-0 text-gray-400" aria-hidden />
          </div>

          <div className="mx-auto mt-6 flex max-w-[600px] flex-col justify-center gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => setMode('interview')}
              className={[
                'h-11 rounded-lg border px-4 text-sm font-semibold transition duration-200',
                mode === 'interview'
                  ? 'border-primary bg-primary text-white'
                  : 'border-gray-300 bg-white text-gray-600 hover:border-gray-400',
              ].join(' ')}
            >
              🎯 Interview Prep
            </button>
            <button
              type="button"
              onClick={() => setMode('learning')}
              className={[
                'h-11 rounded-lg border px-4 text-sm font-semibold transition duration-200',
                mode === 'learning'
                  ? 'border-primary bg-primary text-white'
                  : 'border-gray-300 bg-white text-gray-600 hover:border-gray-400',
              ].join(' ')}
            >
              📚 Just Learning
            </button>
          </div>

          {showInterviewBanner ? (
            <div className="mx-auto mt-8 max-w-[720px] rounded-lg border border-gray-200 border-l-4 border-l-primary bg-[#f8fafc] px-5 py-4 text-sm leading-relaxed text-gray-800">
              💡 Select your target company below to get a customized roadmap. Company selection is optional — skip it and
              we show a general interview plan.
            </div>
          ) : null}
        </div>
      </section>

      <section className="bg-[#fafafa] py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <h2 className="mb-6 text-2xl font-bold text-gray-900">Explore Topics</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {filteredCards.map((card) => (
              <button
                key={card.id}
                type="button"
                onClick={() => openTopic(card.id)}
                className={[
                  'flex flex-col rounded-xl p-8 text-left text-white shadow-sm transition duration-200',
                  'hover:scale-[1.02] hover:shadow-lg',
                  card.bg,
                ].join(' ')}
              >
                <div className="mb-3 text-2xl font-bold">{card.icon}</div>
                <div className="text-lg font-bold">{card.title}</div>
                <p className="mt-2 text-sm leading-relaxed text-white/90">{card.description}</p>
                <span className="mt-6 inline-flex w-fit items-center border border-white/40 px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-white/10">
                  Start Learning →
                </span>
              </button>
            ))}
          </div>
          {filteredCards.length === 0 ? (
            <p className="mt-6 text-center text-gray-600">No topics match your search. Try another keyword.</p>
          ) : null}
        </div>
      </section>

      {mode === 'interview' ? (
        <section className="bg-white py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <h2 className="text-2xl font-bold text-gray-900">Select Your Target Company</h2>
            <p className="mt-2 text-gray-600">Optional — skip to see general plan</p>

            <div className="mx-auto mt-6 max-w-md">
              <div className="flex items-center rounded-lg border border-gray-300 bg-white px-3">
                <Search className="h-4 w-4 text-gray-400" />
                <input
                  value={companyQuery}
                  onChange={(e) => setCompanyQuery(e.target.value)}
                  placeholder="Search companies..."
                  className="h-11 w-full border-0 bg-transparent px-2 text-sm outline-none"
                />
              </div>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {filteredCompanies.map((name) => {
                const selected = selectedCompany === name
                const av = companyAvatar(name)
                return (
                  <button
                    key={name}
                    type="button"
                    onClick={() => setSelectedCompany(name)}
                    className={[
                      'relative flex flex-col items-center rounded-lg border bg-white p-3 text-center transition',
                      selected ? 'border-primary ring-2 ring-primary/20' : 'border-gray-200 hover:border-gray-300',
                    ].join(' ')}
                  >
                    {selected ? (
                      <span className="absolute right-2 top-2 text-primary">
                        <Check className="h-4 w-4" />
                      </span>
                    ) : null}
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                      {av}
                    </span>
                    <span className="mt-2 text-xs font-medium text-gray-900">{name}</span>
                  </button>
                )
              })}
            </div>

            <div className="mt-8 text-center">
              <button
                type="button"
                onClick={() => setSelectedCompany(null)}
                className="text-sm font-medium text-gray-500 transition hover:text-primary"
              >
                Skip — Show General Plan
              </button>
            </div>
          </div>
        </section>
      ) : null}

      {activeTopic ? (
        <section ref={curriculumRef} className="border-t border-gray-200 bg-[#fafafa] py-12">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            {mode === 'interview' && selectedCompany && note ? (
              <div className="mb-8 rounded-xl border border-gray-200 bg-gradient-to-br from-[#eef2ff] to-white p-6 shadow-sm">
                <div className="text-lg font-bold text-gray-900">{selectedCompany}</div>
                <p className="mt-2 text-sm text-gray-700">
                  <strong>Focus:</strong> {note.focus}
                </p>
                <p className="mt-1 text-sm text-gray-700">
                  <strong>Rounds:</strong> {note.rounds}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-gray-800">{note.tip}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {note.topTopics.map((t) => (
                    <span key={t} className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}

            {activeTopic === 'python' ? (
              <>
                <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      <span className="mr-2">🐍</span>Python
                    </h2>
                    <p className="mt-2 text-gray-600">
                      Start here. Python is the fastest language to learn and most in-demand for AI and backend roles.
                    </p>
                  </div>
                </div>

                <div className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <div className="rounded-lg bg-blue-600 px-4 py-3 text-center text-sm font-semibold text-white">
                    2 days — Python Core
                  </div>
                  <div className="rounded-lg bg-emerald-600 px-4 py-3 text-center text-sm font-semibold text-white">
                    3–4 wks — DSA + LeetCode
                  </div>
                  <div className="rounded-lg bg-orange-500 px-4 py-3 text-center text-sm font-semibold text-white">
                    2 wks — System Design
                  </div>
                </div>

                <PythonCurriculum openId={openAccordion} setOpenId={setOpenAccordion} />
              </>
            ) : activeTopic === 'java' ? (
              <>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    <span className="mr-2">{TOPIC_HEADINGS.java.icon}</span>
                    {TOPIC_HEADINGS.java.title}
                  </h2>
                  <p className="mt-2 text-gray-600">{TOPIC_HEADINGS.java.sub}</p>
                </div>
                <JavaCurriculum openId={openAccordion} setOpenId={setOpenAccordion} />
              </>
            ) : activeTopic === 'c' ? (
              <>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    <span className="mr-2">{TOPIC_HEADINGS.c.icon}</span>
                    {TOPIC_HEADINGS.c.title}
                  </h2>
                  <p className="mt-2 text-gray-600">{TOPIC_HEADINGS.c.sub}</p>
                </div>
                <CCurriculum openId={openAccordion} setOpenId={setOpenAccordion} />
              </>
            ) : activeTopic === 'cpp' ? (
              <>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    <span className="mr-2">{TOPIC_HEADINGS.cpp.icon}</span>
                    {TOPIC_HEADINGS.cpp.title}
                  </h2>
                  <p className="mt-2 text-gray-600">{TOPIC_HEADINGS.cpp.sub}</p>
                </div>
                <CppCurriculum openId={openAccordion} setOpenId={setOpenAccordion} />
              </>
            ) : activeTopic === 'sql' ? (
              <>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    <span className="mr-2">{TOPIC_HEADINGS.sql.icon}</span>
                    {TOPIC_HEADINGS.sql.title}
                  </h2>
                  <p className="mt-2 text-gray-600">{TOPIC_HEADINGS.sql.sub}</p>
                </div>
                <SqlCurriculum openId={openAccordion} setOpenId={setOpenAccordion} />
              </>
            ) : activeTopic === 'system-design' ? (
              <>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    <span className="mr-2">{TOPIC_HEADINGS['system-design'].icon}</span>
                    {TOPIC_HEADINGS['system-design'].title}
                  </h2>
                  <p className="mt-2 text-gray-600">
                    Four-week track: fundamentals, classic designs, complex systems, and interview execution — same content as
                    the Python path System Design weeks.
                  </p>
                </div>
                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                  <SystemDesignWeeks openId={openAccordion} setOpenId={setOpenAccordion} idPrefix="sd" />
                </div>
              </>
            ) : (
              <>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    <span className="mr-2">{TOPIC_HEADINGS[activeTopic]?.icon || '📘'}</span>
                    {TOPIC_HEADINGS[activeTopic]?.title || activeTopic}
                  </h2>
                  <p className="mt-2 text-gray-600">
                    {TOPIC_HEADINGS[activeTopic]?.sub || 'Structured modules — click a row to expand.'}
                  </p>
                </div>
                <GenericTopicCurriculum topic={activeTopic} openId={openAccordion} setOpenId={setOpenAccordion} />
              </>
            )}
          </div>
        </section>
      ) : null}

      <Footer />

      <nav
        aria-label="Jump to topic curriculum"
        className="fixed bottom-0 left-0 right-0 z-40 border-t border-gray-200 bg-white/95 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] backdrop-blur-sm"
      >
        <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-3 py-2.5 sm:justify-center sm:overflow-visible">
          {EXPLORE_CARDS.map((c) => {
            const active = activeTopic === c.id
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => openTopic(c.id)}
                className={[
                  'shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold transition sm:text-sm',
                  active
                    ? 'bg-primary text-white shadow-sm'
                    : 'border border-gray-300 bg-white text-gray-600 hover:border-gray-400',
                ].join(' ')}
              >
                {TOPIC_PILL_LABELS[c.id] || c.title}
              </button>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
