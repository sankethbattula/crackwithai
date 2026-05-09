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
        <p className="mb-4">
          <span className="mr-2">📖</span>
          <strong>What You Will Learn</strong>
        </p>
        <p className="mb-4">Object-oriented programming, file handling, error handling, and useful libraries.</p>
        <CodeBlock>{`class Student:
    def __init__(self, name, gpa, university):
        self.name = name
        self.gpa = gpa
        self.university = university
    def introduce(self):
        return f"I am {self.name} from {self.university}"
    def is_honor_roll(self):
        return self.gpa >= 3.5

class GradStudent(Student):
    def __init__(self, name, gpa, university, thesis):
        super().__init__(name, gpa, university)
        self.thesis = thesis`}</CodeBlock>
        <p className="mb-2 mt-4 font-semibold">4 PILLARS OF OOP</p>
        <ul className="mb-4 list-disc space-y-2 pl-6">
          <li>Encapsulation — hide internal details</li>
          <li>Inheritance — reuse and extend behavior</li>
          <li>Polymorphism — same interface, different behavior</li>
          <li>Abstraction — hide complexity behind simple APIs</li>
        </ul>
        <CodeBlock>{`with open("resume.txt", "r") as file:
    content = file.read()

try:
    x = int(input("Enter a number: "))
except ValueError:
    print("Not a number!")`}</CodeBlock>
        <p className="mb-4 mt-4">
          <span className="mr-2">🎯</span>
          <strong>Practice Problems</strong>
        </p>
        <ol className="list-decimal space-y-2 pl-6 marker:text-primary">
          <li>BankAccount class: deposit, withdraw, balance.</li>
          <li>Student class: honor roll if GPA ≥ 3.5.</li>
          <li>Read a text file and count words.</li>
          <li>Write gradebook dict to JSON and read it back.</li>
          <li>Handle invalid numeric input gracefully.</li>
        </ol>
        <p className="mb-2 mt-4">
          <span className="mr-2">📚</span>
          <strong>Go Deeper</strong>
        </p>
        <ul className="list-disc space-y-1 pl-6">
          <li>
            <ResourceLink href="https://realpython.com/python3-object-oriented-programming/">Real Python OOP</ResourceLink>
          </li>
          <li>
            <ResourceLink href="https://docs.python.org/3/tutorial/classes.html">Python Docs — Classes</ResourceLink>
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
        <p className="mb-4">
          <span className="mr-2">📖</span>
          <strong>Arrays and Strings</strong> — the most tested topics in interviews.
        </p>
        <CodeBlock>{`arr = [10, 20, 30, 40, 50]
arr[0]; arr[-1]; arr[1:3]
len(arr); arr.append(60); arr.sort()`}</CodeBlock>
        <CodeBlock>{`def has_pair_sorted(arr, target):
    left, right = 0, len(arr) - 1
    while left < right:
        total = arr[left] + arr[right]
        if total == target:
            return True
        if total < target:
            left += 1
        else:
            right -= 1
    return False`}</CodeBlock>
        <CodeBlock>{`def max_sum(arr, k):
    window_sum = sum(arr[:k])
    best = window_sum
    for i in range(k, len(arr)):
        window_sum += arr[i] - arr[i - k]
        best = max(best, window_sum)
    return best`}</CodeBlock>
        <CodeBlock>{`def two_sum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        c = target - num
        if c in seen:
            return [seen[c], i]
        seen[num] = i`}</CodeBlock>
        <p className="mb-2 mt-4">
          <span className="mr-2">🎯</span>
          <strong>LeetCode This Week</strong>
        </p>
        <ol className="mb-4 list-decimal pl-6 marker:text-primary">
          <li>Two Sum — #1</li>
          <li>Best Time to Buy and Sell Stock — #121</li>
          <li>Contains Duplicate — #217</li>
          <li>Valid Anagram — #242</li>
          <li>Maximum Subarray — #53</li>
          <li>Move Zeroes — #283</li>
          <li>Longest Substring Without Repeating — #3</li>
        </ol>
        <p>
          <span className="mr-2">📚</span>
          <ResourceLink href="https://neetcode.io/">NeetCode</ResourceLink>
          {' · '}
          <ResourceLink href="https://www.geeksforgeeks.org/array-data-structure/">GFG Arrays</ResourceLink>
        </p>
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
        <p className="mb-4">
          <span className="mr-2">📖</span>
          <strong>Stack, Queue, Linked List</strong>
        </p>
        <CodeBlock>{`stack = []
stack.append(1); stack.pop()

from collections import deque
q = deque(); q.append(1); q.popleft()`}</CodeBlock>
        <CodeBlock>{`def binary_search(arr, target):
    lo, hi = 0, len(arr) - 1
    while lo <= hi:
        mid = (lo + hi) // 2
        if arr[mid] == target:
            return mid
        if arr[mid] < target:
            lo = mid + 1
        else:
            hi = mid - 1
    return -1`}</CodeBlock>
        <p className="mb-2 mt-4">
          <span className="mr-2">🎯</span>
          <strong>LeetCode This Week</strong>
        </p>
        <ol className="list-decimal pl-6 marker:text-primary">
          <li>Valid Parentheses — #20</li>
          <li>Min Stack — #155</li>
          <li>Binary Search — #704</li>
          <li>Search Insert Position — #35</li>
          <li>Find Minimum in Rotated Sorted Array — #153</li>
        </ol>
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
        <p className="mb-4">
          <span className="mr-2">📖</span>
          <strong>Trees and Graphs</strong>
        </p>
        <CodeBlock>{`class TreeNode:
    def __init__(self, val=0):
        self.val = val
        self.left = None
        self.right = None`}</CodeBlock>
        <p className="mb-2 mt-4">
          <span className="mr-2">🎯</span>
          <strong>LeetCode This Week</strong>
        </p>
        <ol className="list-decimal pl-6 marker:text-primary">
          <li>Maximum Depth of Binary Tree — #104</li>
          <li>Invert Binary Tree — #226</li>
          <li>Symmetric Tree — #101</li>
          <li>Binary Tree Level Order Traversal — #102</li>
          <li>Number of Islands — #200</li>
          <li>Course Schedule — #207</li>
        </ol>
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
        <p className="mb-4">
          <span className="mr-2">📖</span>
          <strong>Dynamic Programming</strong>
        </p>
        <CodeBlock>{`def fib(n, memo=None):
    memo = {} if memo is None else memo
    if n in memo:
        return memo[n]
    if n <= 1:
        return n
    memo[n] = fib(n-1, memo) + fib(n-2, memo)
    return memo[n]`}</CodeBlock>
        <p className="mb-2 mt-4">
          <span className="mr-2">🎯</span>
          <strong>LeetCode This Week</strong>
        </p>
        <ol className="list-decimal pl-6 marker:text-primary">
          <li>Climbing Stairs — #70</li>
          <li>House Robber — #198</li>
          <li>Coin Change — #322</li>
          <li>Longest Increasing Subsequence — #300</li>
          <li>Unique Paths — #62</li>
        </ol>
      </AccordionRow>

      <AccordionRow
        id="py-sd"
        openId={openId}
        setOpenId={setOpenId}
        badge="Phase 3"
        badgeClass="bg-orange-500"
        title="System Design"
        right="Week 5–6, for SDE-2 and above"
      >
        <p className="mb-4">
          <span className="mr-2">📖</span>
          <strong>System Design Fundamentals</strong>
        </p>
        <ul className="mb-4 list-disc space-y-2 pl-6">
          <li>
            <strong>Load balancer</strong> — spread traffic across instances.
          </li>
          <li>
            <strong>Caching</strong> — Redis/Memcached; hits vs misses.
          </li>
          <li>
            <strong>DB scaling</strong> — replication, sharding, read replicas.
          </li>
          <li>
            <strong>CDN</strong> — edge caching for static assets.
          </li>
          <li>
            <strong>Message queues</strong> — async work, decoupling services.
          </li>
        </ul>
        <p className="mb-2 font-semibold">How to answer</p>
        <ol className="list-decimal space-y-1 pl-6">
          <li>Clarify requirements and constraints</li>
          <li>Estimate scale (QPS, storage, latency)</li>
          <li>High-level diagram</li>
          <li>Deep dive + tradeoffs</li>
        </ol>
        <p className="mt-4">
          <span className="mr-2">📚</span>
          <ResourceLink href="https://github.com/donnemartin/system-design-primer">System Design Primer</ResourceLink>
          {' · '}
          <ResourceLink href="https://www.youtube.com/@ByteByteGo">ByteByteGo</ResourceLink>
        </p>
      </AccordionRow>

      <AccordionRow
        id="py-beh"
        openId={openId}
        setOpenId={setOpenId}
        badge="Phase 4"
        badgeClass="bg-pink-600"
        title="Interview Prep"
        right="Ongoing, parallel to all phases"
      >
        <p className="mb-4">
          <span className="mr-2">📖</span>
          <strong>Behavioral — STAR</strong>
        </p>
        <p className="mb-4">Situation → Task → Action → Result. Quantify impact whenever possible.</p>
        <p className="mb-2 font-semibold">Amazon Leadership Principles (prepare STAR per LP)</p>
        <p className="mb-4 text-sm text-gray-700">
          Customer Obsession, Ownership, Invent and Simplify, Are Right A Lot, Learn and Be Curious, Hire and Develop the
          Best, Insist on Highest Standards, Think Big, Bias for Action, Frugality, Earn Trust, Dive Deep, Have Backbone,
          Deliver Results.
        </p>
        <p>
          <span className="mr-2">📚</span>
          <ResourceLink href="https://www.amazon.jobs/content/en/our-workplace/leadership-principles">Amazon LPs</ResourceLink>
        </p>
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
        <p className="mb-4">
          <span className="mr-2">📖</span>
          <strong>LeetCode Strategy</strong>
        </p>
        <ul className="mb-4 list-disc space-y-2 pl-6">
          <li>Weeks 1–2: ~3 Easy/day</li>
          <li>Weeks 3–4: 2 Easy + 1 Medium/day</li>
          <li>Weeks 5–6: 1 Easy + 2 Medium/day</li>
          <li>Targets: 75+ Easy, 50+ Medium, 10+ Hard (adjust to your timeline)</li>
        </ul>
        <p>
          <span className="mr-2">📚</span>
          <ResourceLink href="https://neetcode.io/practice">NeetCode 150</ResourceLink>
          {' · '}
          <ResourceLink href="https://www.techinterviewhandbook.org/grind75">Grind 75</ResourceLink>
        </p>
      </AccordionRow>
    </div>
  )
}

function GenericTopicCurriculum({ topic, openId, setOpenId }) {
  const blocks = {
    java: {
      rows: [
        {
          id: 'j1',
          badge: 'Week 1',
          bc: 'bg-red-600',
          title: 'Java fundamentals',
          right: 'Syntax, OOP, collections',
          body: (
            <>
              <p>Classes, interfaces, packages, generics, and the collections framework (List, Map, Set).</p>
              <CodeBlock>{`public class Hello {
  public static void main(String[] args) {
    System.out.println("CrackWithAI");
  }
}`}</CodeBlock>
            </>
          ),
        },
        {
          id: 'j2',
          badge: 'Week 2',
          bc: 'bg-red-600',
          title: 'JVM & concurrency basics',
          right: 'Threads, synchronized, executors',
          body: (
            <p>
              Understand garbage collection at a high level, memory model basics, and safe use of{' '}
              <code className="rounded bg-gray-100 px-1">ExecutorService</code> for async tasks.
            </p>
          ),
        },
      ],
    },
    c: {
      rows: [
        {
          id: 'c1',
          badge: 'Module 1',
          bc: 'bg-violet-700',
          title: 'Pointers & memory',
          right: 'Stack vs heap',
          body: (
            <>
              <CodeBlock>{`#include <stdio.h>
int main(void) {
  int x = 42;
  int *p = &x;
  printf("%d\\n", *p);
  return 0;
}`}</CodeBlock>
            </>
          ),
        },
      ],
    },
    cpp: {
      rows: [
        {
          id: 'cp1',
          badge: 'Module 1',
          bc: 'bg-emerald-800',
          title: 'STL containers',
          right: 'vector, map, set',
          body: (
            <CodeBlock>{`#include <vector>
#include <iostream>
int main() {
  std::vector<int> v = {1,2,3};
  for (int x : v) std::cout << x << " ";
}`}</CodeBlock>
          ),
        },
      ],
    },
    sql: {
      rows: [
        {
          id: 's1',
          badge: 'Basics',
          bc: 'bg-amber-800',
          title: 'SELECT, WHERE, ORDER BY',
          right: 'Filtering & sorting',
          body: (
            <CodeBlock>{`SELECT name, salary
FROM employees
WHERE department = 'Engineering'
ORDER BY salary DESC;`}</CodeBlock>
          ),
        },
        {
          id: 's2',
          badge: 'Joins',
          bc: 'bg-amber-800',
          title: 'INNER and LEFT JOIN',
          right: 'Relate tables',
          body: (
            <CodeBlock>{`SELECT u.name, o.total
FROM users u
JOIN orders o ON o.user_id = u.id;`}</CodeBlock>
          ),
        },
      ],
    },
    'system-design': {
      rows: [
        {
          id: 'sd1',
          badge: 'Core',
          bc: 'bg-teal-700',
          title: 'Reliability & scalability',
          right: 'SLAs, redundancy, failover',
          body: <p>Practice 1 design/week: URL shortener, news feed, chat. Draw boxes; label data flows and failures.</p>,
        },
      ],
    },
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
