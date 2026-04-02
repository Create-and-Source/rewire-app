import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://ibthbzgvibixjdvjaouj.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlidGhiemd2aWJpeGpkdmphb3VqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUwOTc3NzQsImV4cCI6MjA5MDY3Mzc3NH0.5f-F_VK13-IgKeeFQyUUYNCEE5vIIv-O_wQ6w0RYyEg'
)

// ============================================================
// CONSTANTS & DATA
// ============================================================

const QUIT_DATE = new Date('2026-04-01T18:45:00')

const NEVILLE_QUOTES = [
  "Assume the feeling of the wish fulfilled.",
  "Imagination is the only reality.",
  "Change your conception of yourself and you will automatically change the world in which you live.",
  "Live in the end. Act as though it were impossible to fail.",
  "An awakened imagination works with a purpose.",
  "To reach a higher level of being, you must assume a higher concept of yourself.",
  "Dare to believe in the reality of your assumption and watch the world play its part.",
  "The world is yourself pushed out.",
  "Feeling is the secret.",
  "Health, wealth, beauty, and genius are not created; they are only manifested by the arrangement of your mind.",
  "Your imagination is you yourself, and the world as your imagination sees it is the real world.",
  "Nothing comes from without. All things come from within.",
  "Stop trying to change the world since it is only the mirror.",
  "Prayer is the art of assuming the feeling of being and having that which you want.",
  "You are already that which you want to be, and your refusal to believe this is the only reason you do not see it.",
]

const NEURAL_MILESTONES = [
  { hours: 0, title: "Hour 0 — The Decision", description: "The moment you chose yourself. Your last dose of THC is being processed. Your endocannabinoid system, which has been flooded with external cannabinoids, just got the signal that the supply is stopping. CB1 receptors throughout your brain — in the hippocampus (memory), prefrontal cortex (decisions), amygdala (emotions), cerebellum (coordination) — are about to start waking up. The rewiring begins now.", icon: "🌱" },
  { hours: 6, title: "Hour 6 — Metabolism Shifts", description: "Your liver enzyme CYP2C9 is actively breaking down THC into 11-OH-THC (still psychoactive) and then into THC-COOH (inactive). Your body temperature and heart rate are normalizing. You might feel restless or irritable — that's your GABA and glutamate systems rebalancing. Your brain has been using external cannabinoids to regulate anxiety; now it has to remember how to do it alone.", icon: "⚡" },
  { hours: 12, title: "Hour 12 — First Night", description: "Your first sober sleep cycle. THC normally suppresses REM sleep, so tonight your brain will begin REM rebound — dramatically increasing the intensity and duration of dreams. You may sleep poorly or wake up sweating. This is your autonomic nervous system recalibrating. Your brain is literally clearing a backlog of emotional processing that's been queued up. Every vivid dream is repair work.", icon: "🌙" },
  { hours: 24, title: "Day 1 — Receptors Wake Up", description: "CB1 receptor upregulation has begun. Your brain is physically growing new receptor sites on neurons throughout your cortex. THC-COOH levels in your blood are dropping. You may notice heightened anxiety, irritability, or emotional sensitivity — this is your amygdala coming back online at full volume after being dampened. Your appetite may be reduced because your hypothalamus is recalibrating hunger signals. You made it a full day. That matters.", icon: "🌟" },
  { hours: 48, title: "Day 2 — Emotions Amplify", description: "Cannabinoid receptors are measurably recovering in brain imaging studies. You may feel emotions more intensely than you have in months or years — joy, sadness, frustration, tenderness. This isn't a problem; it's your limbic system (emotional brain) coming back to full sensitivity. Your brain spent so long with an external emotional regulator that these feelings may feel unfamiliar or overwhelming. They're not too much. They're the right amount. You just forgot.", icon: "💫" },
  { hours: 72, title: "Day 3 — Peak Withdrawal", description: "This is often the hardest day. Cravings peak as your reward circuitry (nucleus accumbens) is fully aware the supply has stopped. Dopamine levels are at their lowest point — your brain reduced its own production because THC was providing artificial surges. You might feel flat, unmotivated, or like nothing matters. This is temporary. Your prefrontal cortex is strengthening its inhibitory connections, literally building the neural infrastructure of willpower. Sleep may still be disrupted. Appetite fluctuating. Stay hydrated — your brain needs water to run the enzymatic processes clearing THC metabolites.", icon: "🧠" },
  { hours: 96, title: "Day 4 — The Shift Begins", description: "Withdrawal symptoms start plateauing. Your GABAergic system is rebalancing — GABA is your brain's primary calming neurotransmitter, and it's starting to normalize without external cannabinoid input. You may notice moments of unexpected clarity or calm between waves of discomfort. Your brain's default mode network (the 'daydreaming' network that Neville's visualization work activates) is becoming more accessible. Night sweats may continue as your body purges stored THC from fat cells.", icon: "🌤️" },
  { hours: 120, title: "Day 5 — Appetite Returns", description: "Your hypothalamus is recalibrating. Appetite signals are starting to feel more natural — less 'I need to eat everything' and more genuine hunger. Your gut-brain axis is shifting too; the endocannabinoid system plays a huge role in digestion, and your gut is producing its own endocannabinoids again. Serotonin production (90% of which happens in your gut) is stabilizing. Dreams are intensely vivid now — this is peak REM rebound. Your brain is processing weeks or months of unprocessed emotional material.", icon: "🍃" },
  { hours: 144, title: "Day 6 — Neuroplasticity Surge", description: "Your brain is entering a period of enhanced neuroplasticity — the ability to form new connections and pathways. BDNF (Brain-Derived Neurotrophic Factor) levels are increasing. This is like fertilizer for your neurons. Every new habit you practice, every visualization, every moment of presence is being encoded more deeply than it would have been while using. This is the window where the work you do on yourself has outsized impact. Your brain is hungry to rewire.", icon: "✨" },
  { hours: 168, title: "Day 7 — One Week", description: "You made it a week. REM sleep architecture is actively rebuilding — your sleep cycles are getting longer and more structured. Memory consolidation is improving; your hippocampus is processing and storing information more effectively. You might notice you're remembering names, conversations, and details better. Verbal fluency is returning. The 'brain fog' that chronic use creates is starting to lift. Your endocannabinoid system is now producing measurably more anandamide (the 'bliss molecule') on its own.", icon: "🌊" },
  { hours: 240, title: "Day 10 — Emotional Depth", description: "The acute withdrawal window is closing. Irritability and anxiety are fading for many people by now. What remains is deeper — you're feeling things at a depth you may not have in a long time. Music sounds different. Colors look more vivid. Conversations feel more present. This isn't new sensitivity being created; it's your natural sensitivity being uncovered. Your dopamine receptors are resensitizing, meaning normal pleasures are starting to hit harder.", icon: "🎵" },
  { hours: 336, title: "Day 14 — Two Weeks", description: "CB1 receptor density in cortical regions is approaching normal levels. Brain imaging studies show measurable differences between day 1 and day 14. Your verbal memory is objectively improving — you can recall words, names, and sequences more easily. Attention span is lengthening. Executive function in your prefrontal cortex is strengthening, meaning better decision-making, planning, and impulse control. Sleep is becoming more restorative as your circadian rhythm resets. You're thinking clearer, and it's not your imagination.", icon: "🔮" },
  { hours: 504, title: "Day 21 — Three Weeks", description: "Most physical withdrawal symptoms have resolved. Your body is making its own bliss molecules again — anandamide and 2-AG production has normalized. These natural endocannabinoids are smoother, subtler, and more attuned to your actual needs than external THC ever was. Your stress response (HPA axis) is recalibrating — cortisol patterns are normalizing, meaning you handle stress more evenly instead of spiking. Your brain's ability to learn and adapt is markedly improved.", icon: "🦅" },
  { hours: 720, title: "Day 30 — One Month", description: "Significant cognitive recovery across all domains. Working memory is sharper. Sustained attention is stronger. Processing speed has increased. Neural pruning is accelerating — your brain is actively dismantling the synaptic pathways that were dedicated to seeking and using cannabis, and redirecting that neural real estate to whatever you're focused on now. Your dreams have settled from the wild REM rebound into rich, meaningful, narrative dreams. Your default emotional state is more stable than it's been in a long time.", icon: "🏔️" },
  { hours: 1080, title: "Day 45 — Six Weeks", description: "Your brain's white matter integrity is measurably improving. White matter is the wiring that connects different brain regions — the myelin-coated axons that let neurons talk to each other quickly. Chronic cannabis use can degrade these connections, and they're rebuilding now. You're literally getting faster. Communication between your prefrontal cortex (thinking) and limbic system (feeling) is stronger, which means you're responding to emotions rather than being overwhelmed by them.", icon: "🔗" },
  { hours: 1440, title: "Day 60 — Two Months", description: "Emotional regulation is markedly improved. Your amygdala and prefrontal cortex are working together smoothly — you feel emotions fully but you're not hijacked by them. Stress doesn't flatten you the way it might have in early recovery. Neuroplasticity gains are visible in daily life — you're learning faster, adapting quicker, building skills more readily. Your baseline mood is higher and more stable. People around you may have noticed changes before you did.", icon: "🦋" },
  { hours: 2160, title: "Day 90 — Three Months", description: "CB1 receptors are fully normalized in most brain regions. Your endocannabinoid system is operating as it was designed to — producing the right amount of internal cannabinoids at the right time for the right duration. Dream life is rich and meaningful. Motivation and drive come from natural dopamine. Cognitive function has recovered to the point where you may not remember what the impairment felt like. You are, by every neurological measure, rewired.", icon: "🌸" },
  { hours: 4320, title: "Day 180 — Six Months", description: "Full endocannabinoid system recovery confirmed in longitudinal studies. Deep structural changes in white matter integrity. Your brain's default mode network — the network activated during rest, reflection, and imagination — is functioning differently than it did when you were using. Your capacity for visualization, presence, and intentional thought has been permanently expanded by this recovery. You didn't just quit something. You became someone new.", icon: "🌺" },
  { hours: 8760, title: "Day 365 — One Year", description: "Complete neural rewiring. New default pathways are fully established and reinforced by months of use. The old pathways — the ones that led to craving, to reaching for something external, to numbing — have been pruned back through disuse. Your brain has built an entirely new architecture. An architecture of clarity, presence, and power. This isn't the person you were before you started using. This is the person you were always becoming.", icon: "👑" },
]

const FOOD_BENEFITS = {
  broccoli: { nutrients: "Vitamin C, K, Folate, Sulforaphane", benefits: "Protects brain cells from oxidative stress. Sulforaphane crosses the blood-brain barrier and supports neurogenesis — literally helping your brain grow new neurons as it rewires." },
  salmon: { nutrients: "Omega-3 (DHA/EPA), B12, Selenium", benefits: "DHA is the primary structural fat in your brain. Omega-3s reduce neuroinflammation and support the myelin sheaths forming around your new neural pathways." },
  blueberries: { nutrients: "Anthocyanins, Vitamin C, K, Manganese", benefits: "Anthocyanins accumulate in brain regions responsible for memory and learning. They improve signal transmission between neurons." },
  spinach: { nutrients: "Iron, Folate, Magnesium, Vitamin K", benefits: "Folate supports serotonin and dopamine production — exactly what your brain needs as it rebuilds natural reward pathways." },
  avocado: { nutrients: "Healthy Fats, Potassium, Folate, Vitamin E", benefits: "Monounsaturated fats support brain cell membrane integrity. Vitamin E protects neurons from oxidative damage during recovery." },
  eggs: { nutrients: "Choline, B12, Protein, Vitamin D", benefits: "Choline is essential for acetylcholine — the neurotransmitter of memory and learning. Your brain craves this as it rebuilds." },
  walnuts: { nutrients: "Omega-3 (ALA), Polyphenols, Vitamin E", benefits: "The only tree nut with significant omega-3s. Polyphenols reduce brain inflammation. Even shaped like a brain — nature's hint." },
  turmeric: { nutrients: "Curcumin, Iron, Manganese", benefits: "Curcumin boosts BDNF (Brain-Derived Neurotrophic Factor), like fertilizer for your neurons. Directly supports neuroplasticity." },
  "dark chocolate": { nutrients: "Flavonoids, Iron, Magnesium", benefits: "Flavonoids increase blood flow to the brain and promote neurogenesis. Supports alertness without overstimulation." },
  "sweet potato": { nutrients: "Beta-Carotene, Vitamin C, B6, Fiber", benefits: "Complex carbs provide steady glucose to your brain. B6 supports serotonin and melatonin production for better sleep." },
  "green tea": { nutrients: "L-Theanine, EGCG, Caffeine", benefits: "L-Theanine promotes alpha brain waves — the state of calm focus. The perfect replacement ritual for your brain." },
  water: { nutrients: "H2O, Minerals", benefits: "Your brain is 73% water. Even 2% dehydration impairs attention and memory. Proper hydration supports every neural process." },
  banana: { nutrients: "Potassium, B6, Vitamin C, Tryptophan", benefits: "Tryptophan converts to serotonin — your natural mood stabilizer. B6 helps produce dopamine for motivation." },
  almonds: { nutrients: "Vitamin E, Magnesium, Protein, Riboflavin", benefits: "Vitamin E is the brain's primary fat-soluble antioxidant. Magnesium supports 300+ enzyme reactions." },
  kale: { nutrients: "Lutein, Vitamin K, Beta-Carotene, Folate", benefits: "Lutein accumulates in the brain and slows cognitive decline. Vitamin K supports sphingolipid formation." },
  lemon: { nutrients: "Vitamin C, Citric Acid, Flavonoids", benefits: "Vitamin C is required for dopamine synthesis. Lemon water is a double win — hydration plus neurotransmitter support." },
  ginger: { nutrients: "Gingerol, Vitamin B6, Magnesium", benefits: "Anti-inflammatory compounds cross the blood-brain barrier. Supports digestion and reduces detox nausea." },
  oatmeal: { nutrients: "Beta-Glucan, Iron, B Vitamins, Fiber", benefits: "Slow-release energy keeps your brain fueled steadily. B vitamins support myelin production." },
  yogurt: { nutrients: "Probiotics, Calcium, B12, Protein", benefits: "Gut bacteria produce 90% of your serotonin. Probiotics strengthen the gut-brain axis for mood stability." },
  chicken: { nutrients: "Protein, B6, Niacin, Selenium", benefits: "Complete protein provides all amino acids for neurotransmitter production. B6 converts tryptophan to serotonin." },
  steak: { nutrients: "Iron, B12, Zinc, Protein", benefits: "Heme iron is critical for oxygen transport to your brain. B12 supports nerve function and myelin production." },
  mushrooms: { nutrients: "Ergothioneine, B Vitamins, Selenium", benefits: "Ergothioneine is a powerful neuroprotective antioxidant. Lion's mane promotes nerve growth factor production." },
  strawberries: { nutrients: "Vitamin C, Anthocyanins, Folate", benefits: "Rich in anthocyanins that protect brain cells. Vitamin C supports dopamine synthesis." },
  oranges: { nutrients: "Vitamin C, Folate, Potassium", benefits: "One orange provides your daily Vitamin C — essential for preventing mental decline." },
  apple: { nutrients: "Quercetin, Fiber, Vitamin C", benefits: "Quercetin protects brain cells from oxidative damage. Biting and chewing stimulates blood flow to the brain." },
  beets: { nutrients: "Nitrates, Folate, Manganese", benefits: "Nitrates increase blood flow to the brain, especially the prefrontal cortex — improving decision-making." },
  coffee: { nutrients: "Caffeine, Antioxidants, Niacin", benefits: "Caffeine blocks adenosine receptors, increasing alertness. Rich in antioxidants. Moderation is key during recovery." },
  rice: { nutrients: "Carbohydrates, Manganese, B Vitamins", benefits: "Clean fuel for your brain. Manganese supports antioxidant enzymes that protect neurons." },
  "olive oil": { nutrients: "Oleic Acid, Polyphenols, Vitamin E", benefits: "Oleic acid maintains myelin integrity. Polyphenols are neuroprotective." },
  carrots: { nutrients: "Beta-Carotene, Fiber, Vitamin K", benefits: "Beta-carotene converts to Vitamin A, supporting neuroplasticity — the exact process driving your recovery." },
  "peanut butter": { nutrients: "Healthy Fats, Protein, Niacin", benefits: "Niacin helps brain function. Healthy fats support brain cell membrane integrity." },
  smoothie: { nutrients: "Blended Fruits/Vegetables, Fiber", benefits: "Concentrated brain nutrition. Blending breaks down cell walls for maximum nutrient absorption." },
  soup: { nutrients: "Hydration, Electrolytes, Various", benefits: "Warm broths are deeply nourishing — hydrating, mineral-rich, and easy to digest." },
  salad: { nutrients: "Various Vitamins, Fiber, Water", benefits: "Mixed greens provide a symphony of brain-supporting nutrients across multiple pathways." },
}

const TIMER_SOUNDS = [
  { id: 'rain', name: 'Rain', freq: [200, 400, 600] },
  { id: 'ocean', name: 'Ocean', freq: [150, 300, 450] },
  { id: 'wind', name: 'Wind', freq: [100, 250, 380] },
  { id: 'bowl', name: 'Bowl', freq: [256, 384, 512] },
  { id: 'forest', name: 'Forest', freq: [180, 320, 500] },
]

const BRAIN_ARTICLES = [
  { title: "How Your CB1 Receptors Are Healing", content: "Cannabis floods your brain's CB1 receptors with external cannabinoids, causing them to downregulate — your brain literally removes receptor sites because they're overwhelmed. When you quit, these receptors begin upregulating within 48 hours. By 4 weeks, brain imaging shows CB1 receptor density returning to levels seen in people who've never used cannabis. Your brain is rebuilding its ability to feel pleasure, motivation, and calm from its own endocannabinoids — anandamide (the \"bliss molecule\") and 2-AG. Every day sober, you're growing back what was dimmed." },
  { title: "REM Rebound: Why Your Dreams Are So Vivid", content: "THC suppresses REM sleep — the phase where you dream, process emotions, and consolidate memories. When you quit, your brain has a backlog. It enters \"REM rebound\" — dramatically increasing dream intensity and duration. Those vivid, wild, sometimes unsettling dreams? That's your brain clearing the queue. This is healing. Your dream journal entries are literally your brain's repair log. REM rebound typically peaks at 2-3 weeks and settles into rich, meaningful dreaming by month 2." },
  { title: "Neuroplasticity: Your Brain's Superpower", content: "Neuroplasticity is your brain's ability to rewire itself — forming new connections and pathways. Cannabis use reduces neuroplasticity over time, but quitting triggers a recovery surge. The first 90 days are a critical window of enhanced plasticity. Every new habit you build, every visualization you practice, every gratitude entry you write is physically sculpting your neural architecture. When you 'live in the end,' you're literally creating neural pathways for the reality you're stepping into." },
  { title: "Dopamine Recovery: Finding Natural Joy", content: "Cannabis creates an artificial dopamine surge that your brain adapts to by reducing its natural production and receptor sensitivity. When you quit, there's a temporary deficit — things might feel flat. This is normal and temporary. By week 2-3, natural pleasures become more vivid — food tastes better, music hits different, sunsets stop you in your tracks. By month 2-3, your baseline dopamine levels are markedly improved. You're not losing pleasure — you're recovering the full spectrum of it." },
  { title: "The Prefrontal Cortex Returns", content: "Your prefrontal cortex — the CEO of your brain — handles decision-making, impulse control, planning, and emotional regulation. THC specifically impairs this region. Recovery takes 1-3 months but the gains are profound: clearer thinking, better follow-through, stronger willpower, more nuanced emotional responses. You'll notice you're responding to situations rather than reacting to them." },
  { title: "Your Body's Balance Keeper", content: "Your endocannabinoid system (ECS) regulates mood, sleep, appetite, pain, immune function, and memory. It produces its own cannabinoids — anandamide and 2-AG — to maintain homeostasis. When you quit, your ECS recalibrates. Anandamide production normalizes — literally called the 'bliss molecule' because it produces feelings of well-being naturally. You're not giving something up — you're letting your body remember how to produce its own peace." },
]

// ============================================================
// HELPERS
// ============================================================

const getTimeSince = () => {
  const diff = new Date() - QUIT_DATE
  if (diff < 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, totalHours: 0 }
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
    totalHours: diff / 3600000,
  }
}

const getMilestone = (h) => {
  let cur = NEURAL_MILESTONES[0], nxt = NEURAL_MILESTONES[1]
  for (let i = 0; i < NEURAL_MILESTONES.length; i++) {
    if (h >= NEURAL_MILESTONES[i].hours) { cur = NEURAL_MILESTONES[i]; nxt = NEURAL_MILESTONES[i + 1] || null }
  }
  return { cur, nxt }
}

const load = (k, fb) => { try { const d = localStorage.getItem(`rw_${k}`); return d ? JSON.parse(d) : fb } catch { return fb } }
const save = (k, d) => localStorage.setItem(`rw_${k}`, JSON.stringify(d))
const fmtDate = d => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
const fmtTime = d => new Date(d).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
const findFood = (input) => { const l = input.toLowerCase(); for (const [f, d] of Object.entries(FOOD_BENEFITS)) { if (l.includes(f)) return { food: f, ...d } } return null }

// Supabase sync hook — localStorage for instant load, Supabase for persistence
function useSync(table, localKey, fallback = []) {
  const [data, setData] = useState(load(localKey, fallback))

  useEffect(() => {
    supabase.from(table).select('*').order('created_at', { ascending: false })
      .then(({ data: rows }) => {
        if (rows && rows.length) { setData(rows); save(localKey, rows) }
      })
  }, [table, localKey])

  const add = async (row) => {
    const { data: inserted } = await supabase.from(table).insert(row).select()
    const newRow = inserted?.[0] || { ...row, id: Date.now() }
    const updated = [newRow, ...data]
    setData(updated); save(localKey, updated)
    return newRow
  }

  const remove = async (id) => {
    supabase.from(table).delete().eq('id', id).then(() => {})
    const updated = data.filter(x => x.id !== id)
    setData(updated); save(localKey, updated)
  }

  const update = async (id, changes) => {
    supabase.from(table).update(changes).eq('id', id).then(() => {})
    const updated = data.map(x => x.id === id ? { ...x, ...changes } : x)
    setData(updated); save(localKey, updated)
  }

  const replace = (newData) => { setData(newData); save(localKey, newData) }

  return [data, { add, remove, update, replace, setData }]
}

// Speech-to-text hook — reusable across all inputs
function useSpeech(onResult) {
  const [listening, setListening] = useState(false)
  const recRef = useRef(null)

  const toggle = (currentText = '') => {
    if (listening) {
      recRef.current?.stop()
      setListening(false)
      return
    }
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) { alert('Speech recognition not supported in this browser'); return }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    const rec = new SR()
    rec.continuous = true
    rec.interimResults = true
    rec.onresult = (ev) => {
      let t = currentText ? currentText + ' ' : ''
      for (let i = 0; i < ev.results.length; i++) t += ev.results[i][0].transcript
      onResult(t)
    }
    rec.onerror = () => setListening(false)
    rec.onend = () => setListening(false)
    recRef.current = rec
    rec.start()
    setListening(true)
  }

  const stop = () => { if (recRef.current) { recRef.current.onresult = null; recRef.current.stop() } setListening(false) }

  useEffect(() => () => { recRef.current?.stop() }, [])

  return { listening, toggle, stop }
}

// Mic button component
function MicBtn({ listening, onPress, small }) {
  return (
    <button onClick={onPress} type="button"
      style={{ background: listening ? 'rgba(255,100,100,0.12)' : 'rgba(255,255,255,0.04)',
        border: listening ? '1px solid rgba(255,100,100,0.25)' : '1px solid rgba(255,255,255,0.08)',
        borderRadius: small ? 8 : 10, padding: small ? '6px 8px' : '10px 12px', cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s', flexShrink: 0 }}>
      <svg width={small ? 14 : 16} height={small ? 14 : 16} viewBox="0 0 24 24" fill="none"
        stroke={listening ? 'rgba(255,100,100,0.8)' : 'rgba(255,255,255,0.4)'} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <rect x="9" y="1" width="6" height="14" rx="3" />
        <path d="M19 10v1a7 7 0 01-14 0v-1M12 18.5V23M8 23h8" />
      </svg>
    </button>
  )
}

// Audio
class Ambient {
  constructor() { this.ctx = null; this.nodes = []; this.on = false }
  start(freqs) {
    if (this.on) this.stop()
    this.ctx = new (window.AudioContext || window.webkitAudioContext)()
    const g = this.ctx.createGain(); g.gain.value = 0.06; g.connect(this.ctx.destination)
    freqs.forEach((f, i) => {
      const o = this.ctx.createOscillator(), og = this.ctx.createGain()
      o.type = 'sine'; o.frequency.value = f; og.gain.value = 0.25 - i * 0.06
      o.connect(og); og.connect(g); o.start()
      const lfo = this.ctx.createOscillator(), lg = this.ctx.createGain()
      lfo.frequency.value = 0.08 + i * 0.04; lg.gain.value = f * 0.015
      lfo.connect(lg); lg.connect(o.frequency); lfo.start()
      this.nodes.push(o, lfo)
    })
    this.on = true
  }
  stop() { this.nodes.forEach(n => { try { n.stop() } catch(e) {} }); this.nodes = []; if (this.ctx) try { this.ctx.close() } catch(e) {}; this.ctx = null; this.on = false }
}
const ambient = new Ambient()

// ============================================================
// STYLES (Stoa design system)
// ============================================================

const s = {
  page: { maxWidth: 430, margin: '0 auto', padding: '0 16px', minHeight: '100vh' },
  greeting: { fontSize: 32, fontWeight: 300, color: '#fff', letterSpacing: -0.5 },
  subtitle: { fontSize: 17, fontWeight: 400, color: 'rgba(255,255,255,0.35)', marginTop: 6 },
  label: { fontSize: 13, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 3, color: 'rgba(255,255,255,0.35)', marginBottom: 12 },
  card: { background: '#1A1A1A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, padding: '22px 20px' },
  cardTitle: { fontSize: 18, fontWeight: 500, color: '#fff' },
  cardText: { fontSize: 16, fontWeight: 400, color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, marginTop: 6 },
  stat: { fontSize: 38, fontWeight: 300, color: '#fff' },
  statUnit: { fontSize: 15, fontWeight: 400, color: 'rgba(255,255,255,0.35)', marginTop: 2 },
  pillActive: { borderRadius: 999, padding: '12px 20px', fontSize: 16, fontWeight: 500, background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', cursor: 'pointer', transition: 'all 0.2s' },
  pill: { borderRadius: 999, padding: '12px 20px', fontSize: 16, fontWeight: 500, background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', transition: 'all 0.2s' },
  btnPrimary: { width: '100%', padding: '18px 0', borderRadius: 999, background: '#fff', color: '#0D0D0D', fontSize: 17, fontWeight: 600, border: 'none', cursor: 'pointer', letterSpacing: 0.5, transition: 'all 0.2s' },
  btnSecondary: { padding: '14px 24px', borderRadius: 999, background: 'rgba(255,255,255,0.08)', color: '#fff', fontSize: 16, fontWeight: 500, border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', transition: 'all 0.2s' },
  input: { width: '100%', padding: '18px 20px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, color: '#fff', fontSize: 18, outline: 'none', fontFamily: 'Inter' },
  textarea: { width: '100%', padding: '18px 20px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, color: '#fff', fontSize: 18, outline: 'none', fontFamily: 'Inter', resize: 'none', lineHeight: 1.7 },
  dim: { color: 'rgba(255,255,255,0.35)' },
  mid: { color: 'rgba(255,255,255,0.6)' },
  bright: { color: '#fff' },
  track: { height: 2, background: 'rgba(255,255,255,0.06)', borderRadius: 1, overflow: 'hidden', marginTop: 10 },
  fill: (pct) => ({ height: '100%', width: `${pct}%`, background: 'rgba(255,255,255,0.2)', borderRadius: 1, transition: 'width 0.6s ease' }),
  nav: { position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 100, background: 'rgba(13,13,13,0.92)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', borderTop: '1px solid rgba(255,255,255,0.06)' },
  navInner: { maxWidth: 430, margin: '0 auto', display: 'flex', justifyContent: 'space-around', alignItems: 'center', padding: '8px 0 max(8px, env(safe-area-inset-bottom))' },
  navItem: (active) => ({ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, background: 'none', border: 'none', cursor: 'pointer', opacity: active ? 1 : 0.35, transition: 'all 0.2s', padding: '4px 8px' }),
  navLabel: { fontSize: 12, fontWeight: 600, letterSpacing: 0.5, textTransform: 'uppercase', color: '#fff' },
  quoteBar: { position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, background: 'rgba(13,13,13,0.92)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.06)' },
  quoteInner: { maxWidth: 430, margin: '0 auto', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 8 },
  quoteText: { fontSize: 11, fontWeight: 400, color: 'rgba(255,255,255,0.35)', fontStyle: 'italic', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
}

// ============================================================
// SVG Icons (Stoa-style stroke only, strokeWidth 1.8)
// ============================================================

const Icon = ({ d, size = 20, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" {...props}>
    {typeof d === 'string' ? <path d={d} /> : d}
  </svg>
)

const Icons = {
  home: <Icon d={[<path key="1" d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />, <polyline key="2" points="9 22 9 12 15 12 15 22" />]} />,
  brain: <Icon d={[<path key="1" d="M12 2a6 6 0 016 6c0 3-2 5-4 7l-2 2-2-2c-2-2-4-4-4-7a6 6 0 016-6z" />, <circle key="2" cx="12" cy="8" r="2" />]} />,
  moon: <Icon d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />,
  drop: <Icon d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z" />,
  heart: <Icon d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />,
  image: <Icon d={[<rect key="1" x="3" y="3" width="18" height="18" rx="2" ry="2" />, <circle key="2" cx="8.5" cy="8.5" r="1.5" />, <polyline key="3" points="21 15 16 10 5 21" />]} />,
  eye: <Icon d={[<path key="1" d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />, <circle key="2" cx="12" cy="12" r="3" />]} />,
  timer: <Icon d={[<circle key="1" cx="12" cy="12" r="10" />, <polyline key="2" points="12 6 12 12 16 14" />]} />,
  health: <Icon d={[<polyline key="1" points="22 12 18 12 15 21 9 3 6 12 2 12" />]} />,
  salad: <Icon d={[<path key="1" d="M7 21h10" />, <path key="2" d="M12 21a9 9 0 009-9H3a9 9 0 009 9z" />, <path key="3" d="M12 3v6" />]} />,
  send: <Icon d={[<line key="1" x1="22" y1="2" x2="11" y2="13" />, <polygon key="2" points="22 2 15 22 11 13 2 9 22 2" />]} />,
  mic: <Icon d={[<path key="1" d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" />, <path key="2" d="M19 10v2a7 7 0 01-14 0v-2" />, <line key="3" x1="12" y1="19" x2="12" y2="23" />]} />,
  plus: <Icon d={[<line key="1" x1="12" y1="5" x2="12" y2="19" />, <line key="2" x1="5" y1="12" x2="19" y2="12" />]} />,
  check: <Icon d={<polyline points="20 6 9 17 4 12" />} />,
  trash: <Icon d={[<polyline key="1" points="3 6 5 6 21 6" />, <path key="2" d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />]} size={14} />,
  chevron: <Icon d={<polyline points="9 18 15 12 9 6" />} size={14} />,
  chat: <Icon d={[<path key="1" d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />]} />,
  play: <Icon d={<polygon points="5 3 19 12 5 21 5 3" />} />,
  pause: <Icon d={[<rect key="1" x="6" y="4" width="4" height="16" />, <rect key="2" x="14" y="4" width="4" height="16" />]} />,
  volume: <Icon d={[<polygon key="1" points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />, <path key="2" d="M19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07" />]} />,
  mute: <Icon d={[<polygon key="1" points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />, <line key="2" x1="23" y1="9" x2="17" y2="15" />, <line key="3" x1="17" y1="9" x2="23" y2="15" />]} />,
  music: <Icon d={[<path key="1" d="M9 18V5l12-2v13" />, <circle key="2" cx="6" cy="18" r="3" />, <circle key="3" cx="18" cy="16" r="3" />]} />,
  star: <Icon d={<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />} />,
}

// ============================================================
// PASSCODE GATE
// ============================================================

const PASSCODE = '55555'

function PasscodeScreen({ onUnlock }) {
  const [code, setCode] = useState('')
  const [shake, setShake] = useState(false)
  const [dots, setDots] = useState([false, false, false, false, false])

  const press = (num) => {
    if (code.length >= 5) return
    const next = code + num
    const nextDots = dots.map((_, i) => i < next.length)
    setCode(next)
    setDots(nextDots)

    if (next.length === 5) {
      if (next === PASSCODE) {
        setTimeout(() => onUnlock(), 200)
      } else {
        setShake(true)
        setTimeout(() => { setCode(''); setDots([false, false, false, false, false]); setShake(false) }, 500)
      }
    }
  }

  const del = () => {
    if (!code.length) return
    const next = code.slice(0, -1)
    setCode(next)
    setDots(dots.map((_, i) => i < next.length))
  }

  const numPad = [[1,2,3],[4,5,6],[7,8,9],[null,0,'del']]

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#0D0D0D', padding: 20 }}>
      <div style={{ marginBottom: 8 }}>
        <span style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 3, color: 'rgba(255,255,255,0.35)' }}>REWIRE</span>
      </div>

      <p style={{ fontSize: 14, fontWeight: 300, color: 'rgba(255,255,255,0.5)', marginBottom: 40 }}>Enter passcode</p>

      <motion.div animate={shake ? { x: [-12, 12, -8, 8, -4, 4, 0] } : {}} transition={{ duration: 0.4 }}
        style={{ display: 'flex', gap: 14, marginBottom: 48 }}>
        {dots.map((filled, i) => (
          <motion.div key={i} animate={{ scale: filled ? [1, 1.2, 1] : 1 }} transition={{ duration: 0.15 }}
            style={{ width: 14, height: 14, borderRadius: '50%',
              border: '1.5px solid rgba(255,255,255,0.2)',
              background: filled ? '#fff' : 'transparent',
              transition: 'background 0.15s' }} />
        ))}
      </motion.div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 280, width: '100%' }}>
        {numPad.map((row, ri) => (
          <div key={ri} style={{ display: 'flex', justifyContent: 'center', gap: 24 }}>
            {row.map((key, ki) => (
              key === null ? <div key={ki} style={{ width: 68, height: 68 }} /> :
              key === 'del' ? (
                <button key={ki} onClick={del}
                  style={{ width: 68, height: 68, borderRadius: '50%', background: 'none', border: 'none', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.5)', fontSize: 13, fontWeight: 500, fontFamily: 'Inter' }}>
                  Delete
                </button>
              ) : (
                <button key={ki} onClick={() => press(key)}
                  style={{ width: 68, height: 68, borderRadius: '50%', background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.08)', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 24, fontWeight: 300, color: '#fff', fontFamily: 'Inter',
                    transition: 'all 0.15s' }}>
                  {key}
                </button>
              )
            ))}
          </div>
        ))}
      </div>

      <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)', marginTop: 40, fontStyle: 'italic' }}>
        "{NEVILLE_QUOTES[Math.floor(Date.now() / 86400000) % NEVILLE_QUOTES.length]}"
      </p>
    </div>
  )
}

// ============================================================
// MAIN APP
// ============================================================

export default function App() {
  const [unlocked, setUnlocked] = useState(false)
  const [page, setPage] = useState('home')
  const [time, setTime] = useState(getTimeSince())
  const [quote, setQuote] = useState(NEVILLE_QUOTES[Math.floor(Math.random() * NEVILLE_QUOTES.length)])
  const [visionImages, setVisionImages] = useState(load('vision', []))
  const [bgIdx, setBgIdx] = useState(0)

  useEffect(() => { const i = setInterval(() => setTime(getTimeSince()), 1000); return () => clearInterval(i) }, [])
  useEffect(() => { const i = setInterval(() => setQuote(NEVILLE_QUOTES[Math.floor(Math.random() * NEVILLE_QUOTES.length)]), 45000); return () => clearInterval(i) }, [])
  useEffect(() => { if (!visionImages.length) return; const i = setInterval(() => setBgIdx(v => (v + 1) % visionImages.length), 15000); return () => clearInterval(i) }, [visionImages.length])
  useEffect(() => {
    supabase.from('vision_images').select('*').order('created_at', { ascending: false })
      .then(({ data: rows }) => { if (rows?.length) { setVisionImages(rows); save('vision', rows) } })
  }, [])

  if (!unlocked) return <PasscodeScreen onUnlock={() => setUnlocked(true)} />

  const bgImg = visionImages[bgIdx]?.url

  const tabs = [
    { id: 'home', icon: Icons.home, label: 'Home' },
    { id: 'sats', icon: Icons.star, label: 'SATS' },
    { id: 'gratitude', icon: Icons.heart, label: 'Gratitude' },
    { id: 'work', icon: Icons.timer, label: 'Focus' },
    { id: 'more', icon: Icons.plus, label: 'More' },
  ]

  return (
    <div style={{ minHeight: '100vh', position: 'relative' }}>
      {/* Vision board bg */}
      <AnimatePresence>
        {bgImg && (
          <motion.div key={bgIdx} initial={{ opacity: 0 }} animate={{ opacity: 0.04 }} exit={{ opacity: 0 }} transition={{ duration: 3 }}
            style={{ position: 'fixed', inset: 0, backgroundImage: `url(${bgImg})`, backgroundSize: 'cover', backgroundPosition: 'center', pointerEvents: 'none', zIndex: 0 }} />
        )}
      </AnimatePresence>

      {/* Quote bar */}
      <div style={s.quoteBar}>
        <div style={{ ...s.quoteInner, justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, minWidth: 0 }}>
            <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: 10 }}>✦</span>
            <p style={s.quoteText}>"{quote}" — Neville Goddard</p>
          </div>
          <button onClick={() => setUnlocked(false)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px 8px', flexShrink: 0 }}>
            <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0110 0v4" />
            </svg>
          </button>
        </div>
      </div>

      {/* Nav */}
      <nav style={s.nav}>
        <div style={s.navInner}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setPage(t.id)} style={s.navItem(page === t.id || (t.id === 'more' && ['water','progress','vision','visualize','timer','health','brain','cravings','dreams','nourish','tasks','run','readings','bathroom','energy','journal','surrender','checkin','sos','coach','revision','iam','ladder','mentaldiet','goalcard','paradigm','terror','intention','wishes','certainway','increase','rampage'].includes(page)))}>
              <span style={{ color: '#fff' }}>{t.icon}</span>
              <span style={s.navLabel}>{t.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Content */}
      <main style={{ position: 'relative', zIndex: 1, paddingTop: 44, paddingBottom: 80 }}>
        <AnimatePresence mode="wait">
          <motion.div key={page} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
            {page === 'home' && <HomePage time={time} quote={quote} setPage={setPage} />}
            {page === 'sats' && <SATSPage />}
            {page === 'gratitude' && <GratitudePage />}
            {page === 'progress' && <ProgressPhotosPage onBack={() => setPage('more')} />}
            {page === 'brain' && <BrainPage time={time} onBack={() => setPage('more')} />}
            {page === 'dreams' && <DreamsPage onBack={() => setPage('more')} />}
            {page === 'nourish' && <NutritionPage onBack={() => setPage('more')} />}
            {page === 'work' && <WorkTasksPage />}
            {page === 'cravings' && <CravingsPage onBack={() => setPage('more')} />}
            {page === 'more' && <MorePage setPage={setPage} />}
            {page === 'water' && <WaterPage onBack={() => setPage('more')} />}
            {page === 'vision' && <VisionPage images={visionImages} setImages={setVisionImages} onBack={() => setPage('more')} />}
            {page === 'visualize' && <VisualizePage onBack={() => setPage('more')} />}
            {page === 'timer' && <TimerPage onBack={() => setPage('more')} />}
            {page === 'health' && <HealthPage onBack={() => setPage('more')} />}
            {page === 'tasks' && <TasksPage onBack={() => setPage('more')} />}
            {page === 'run' && <RunPage onBack={() => setPage('more')} />}
            {page === 'readings' && <ReadingsPage onBack={() => setPage('more')} />}
            {page === 'bathroom' && <BathroomPage onBack={() => setPage('more')} />}
            {page === 'energy' && <EnergyPage onBack={() => setPage('more')} />}
            {page === 'journal' && <JournalPage onBack={() => setPage('more')} />}
            {page === 'surrender' && <GiveToGodPage onBack={() => setPage('more')} />}
            {page === 'checkin' && <CheckInPage onBack={() => setPage('more')} />}
            {page === 'sos' && <SOSPage onBack={() => setPage('home')} />}
            {page === 'coach' && <CoachPage onBack={() => setPage('home')} />}
            {page === 'revision' && <RevisionPage onBack={() => setPage('more')} />}
            {page === 'iam' && <IAMPage onBack={() => setPage('more')} />}
            {page === 'ladder' && <LadderPage onBack={() => setPage('more')} />}
            {page === 'mentaldiet' && <MentalDietPage onBack={() => setPage('more')} />}
            {page === 'goalcard' && <GoalCardPage onBack={() => setPage('more')} />}
            {page === 'paradigm' && <ParadigmPage onBack={() => setPage('more')} />}
            {page === 'terror' && <TerrorBarrierPage onBack={() => setPage('more')} />}
            {page === 'intention' && <IntentionPage onBack={() => setPage('more')} />}
            {page === 'wishes' && <WishesFulfilledPage onBack={() => setPage('more')} />}
            {page === 'certainway' && <CertainWayPage onBack={() => setPage('more')} />}
            {page === 'increase' && <IncreasePage onBack={() => setPage('more')} />}
            {page === 'rampage' && <GratitudeRampagePage onBack={() => setPage('more')} />}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  )
}

// ============================================================
// HOME
// ============================================================

function HomePage({ time, quote, setPage }) {
  const { cur, nxt } = getMilestone(time.totalHours)
  const pct = nxt ? Math.min(100, ((time.totalHours - cur.hours) / (nxt.hours - cur.hours)) * 100) : 100
  const today = new Date().toDateString()
  const [cravingLog, cravingDb] = useSync('craving_log', 'craving_log')
  const [justResisted, setJustResisted] = useState(false)
  const [tasks, tasksDb] = useSync('tasks', 'tasks')
  const [taskInput, setTaskInput] = useState('')
  const activeTasks = tasks.filter(t => !t.done)
  const addHomeTask = () => { if (!taskInput.trim()) return; tasksDb.add({ text: taskInput.trim(), done: false }); setTaskInput('') }
  const toggleHomeTask = (id) => { const t = tasks.find(x => x.id === id); if (t) tasksDb.update(id, { done: !t.done, completed_at: !t.done ? new Date().toISOString() : null }) }

  const cravings = cravingLog.filter(e => new Date(e.created_at || e.date).toDateString() === today).length
  const totalResisted = cravingLog.length

  const resistCraving = () => {
    cravingDb.add({ note: null })
    setJustResisted(true); setTimeout(() => setJustResisted(false), 2000)
  }

  const hour = new Date().getHours()
  const timeOfDay = hour < 5 ? 'night' : hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : hour < 21 ? 'evening' : 'night'

  const getGreeting = () => {
    if (timeOfDay === 'morning') return 'Good morning'
    if (timeOfDay === 'afternoon') return 'Good afternoon'
    if (timeOfDay === 'evening') return 'Good evening'
    return 'Wind down'
  }

  const getSubtitle = () => {
    if (timeOfDay === 'morning') return 'Start your day with intention'
    if (timeOfDay === 'afternoon') return 'Stay focused, stay present'
    if (timeOfDay === 'evening') return 'Reflect, revise, release'
    return 'Prepare your mind for sleep'
  }

  // Time-based practice recommendations
  const practicesByTime = {
    morning: [
      { id: 'checkin', label: 'Morning Check-in', sub: 'Set your energy and intention' },
      { id: 'iam', label: 'I AM Declarations', sub: 'Speak your identity into being' },
      { id: 'goalcard', label: 'Read Your Goal Card', sub: 'Saturate your subconscious' },
      { id: 'intention', label: 'Set Your Intention', sub: 'Connect to source' },
      { id: 'readings', label: 'Daily Reading', sub: 'Neville, Proctor, Dyer, Wattles' },
      { id: 'certainway', label: 'The Certain Way', sub: 'Think clearly, create deliberately' },
    ],
    afternoon: [
      { id: 'coach', label: 'Talk to Coach', sub: 'Your recovery companion' },
      { id: 'mentaldiet', label: 'Mental Diet', sub: 'Catch and replace thoughts' },
      { id: 'energy', label: 'Log Energy', sub: 'Track your recovery' },
      { id: 'increase', label: 'Impression of Increase', sub: 'Give more value today' },
      { id: 'paradigm', label: 'Paradigm Shift', sub: 'Reprogram old beliefs' },
      { id: 'terror', label: 'Terror Barrier', sub: 'Push through resistance' },
    ],
    evening: [
      { id: 'revision', label: 'Revise Your Day', sub: 'Rewrite any moment as you wish' },
      { id: 'journal', label: 'Journal', sub: 'Process and release' },
      { id: 'rampage', label: 'Gratitude Rampage', sub: 'Pour out appreciation' },
      { id: 'checkin', label: 'Evening Check-in', sub: 'Rate your day, claim your win' },
      { id: 'surrender', label: 'Give It to God', sub: 'Release what isn\'t yours' },
      { id: 'goalcard', label: 'Read Your Goal Card', sub: 'Last thing before bed' },
    ],
    night: [
      { id: 'wishes', label: 'Wishes Fulfilled', sub: 'Fall asleep in the wish fulfilled' },
      { id: 'visualize', label: 'Visualize', sub: 'Live in the end' },
      { id: 'sats', label: 'SATS', sub: 'State akin to sleep' },
      { id: 'timer', label: 'Meditation', sub: 'Enter the silence' },
      { id: 'ladder', label: 'Ladder Experiment', sub: 'Tonight\'s manifestation practice' },
      { id: 'dreams', label: 'Dream Journal', sub: 'Record before you forget' },
    ],
  }

  const currentPractices = practicesByTime[timeOfDay]

  // Always-available tools (no emojis, clean list)
  const alwaysTools = [
    { id: 'water', label: 'Water' },
    { id: 'nourish', label: 'Nourish' },
    { id: 'bathroom', label: 'Bathroom' },
    { id: 'run', label: 'Run' },
    { id: 'health', label: 'Health' },
    { id: 'cravings', label: 'Cravings' },
    { id: 'progress', label: 'Photos' },
    { id: 'vision', label: 'Vision Board' },
    { id: 'brain', label: 'Brain Science' },
  ]

  const toolBtn = { background: 'none', border: 'none', cursor: 'pointer', padding: '14px 0',
    borderBottom: '1px solid rgba(255,255,255,0.04)', width: '100%', textAlign: 'left',
    display: 'flex', justifyContent: 'space-between', alignItems: 'center' }

  return (
    <div style={s.page}>
      <div style={{ paddingTop: 20, marginBottom: 28 }}>
        <h1 style={s.greeting}>{getGreeting()}</h1>
        <p style={{ ...s.subtitle, marginTop: 6 }}>{getSubtitle()}</p>
      </div>

      {/* Timer card */}
      <div style={{ ...s.card, textAlign: 'center', marginBottom: 14 }}>
        <div style={{ ...s.label, marginBottom: 16 }}>YOUR STREAK</div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 24 }}>
          {[
            { v: time.days, l: 'Days' },
            { v: time.hours, l: 'Hrs' },
            { v: time.minutes, l: 'Min' },
            { v: time.seconds, l: 'Sec' },
          ].map(({ v, l }) => (
            <div key={l}>
              <div style={s.stat}>{String(v).padStart(2, '0')}</div>
              <div style={s.statUnit}>{l}</div>
            </div>
          ))}
        </div>
        <div style={{ ...s.dim, fontSize: 11, marginTop: 14 }}>Since April 1, 2026 · 6:45 PM</div>
      </div>

      {/* Craving resist button */}
      <div style={{ ...s.card, marginBottom: 14, textAlign: 'center', padding: '24px 16px' }}>
        <div style={{ ...s.label, marginBottom: 12 }}>CRAVING?</div>
        <button onClick={resistCraving}
          style={{ width: 80, height: 80, borderRadius: '50%', border: justResisted ? '2px solid rgba(255,255,255,0.3)' : '2px solid rgba(255,255,255,0.1)',
            background: justResisted ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.03)', cursor: 'pointer', transition: 'all 0.3s',
            display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: '#fff', letterSpacing: 1 }}>
            {justResisted ? '✓' : 'PASS'}
          </span>
        </button>
        <p style={{ fontSize: 11, ...s.dim, marginTop: 12 }}>
          {justResisted ? 'You chose yourself. That\'s power.' : 'Press every time you resist'}
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginTop: 14 }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 300, color: '#fff' }}>{cravings}</div>
            <div style={{ fontSize: 9, ...s.dim, textTransform: 'uppercase', letterSpacing: 1 }}>Today</div>
          </div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 300, color: '#fff' }}>{totalResisted}</div>
            <div style={{ fontSize: 9, ...s.dim, textTransform: 'uppercase', letterSpacing: 1 }}>All Time</div>
          </div>
        </div>
      </div>

      {/* Time-based practices */}
      <div style={{ ...s.card, marginBottom: 14 }}>
        <div style={s.label}>
          {timeOfDay === 'morning' ? 'MORNING PRACTICE' : timeOfDay === 'afternoon' ? 'AFTERNOON PRACTICE' : timeOfDay === 'evening' ? 'EVENING PRACTICE' : 'BEDTIME PRACTICE'}
        </div>
        {currentPractices.map((p, i) => (
          <button key={p.id + i} onClick={() => setPage(p.id)} style={toolBtn}>
            <div>
              <div style={{ fontSize: 16, fontWeight: 500, color: '#fff' }}>{p.label}</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', marginTop: 3 }}>{p.sub}</div>
            </div>
            <span style={s.dim}>{Icons.chevron}</span>
          </button>
        ))}
      </div>

      {/* Tasks widget */}
      <div style={{ ...s.card, marginBottom: 14 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div style={s.label}>TODAY'S TASKS</div>
          <button onClick={() => setPage('tasks')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, color: 'rgba(255,255,255,0.3)', letterSpacing: 0.5 }}>See all →</button>
        </div>
        <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
          <input value={taskInput} onChange={e => setTaskInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addHomeTask()}
            placeholder="Add a task..." style={{ ...s.input, padding: '12px 14px', fontSize: 14 }} />
          <button onClick={addHomeTask} style={{ ...s.btnSecondary, padding: '12px 16px', fontSize: 13, flexShrink: 0 }}>+</button>
        </div>
        {activeTasks.length === 0 && <p style={{ fontSize: 13, ...s.dim, textAlign: 'center', padding: '8px 0' }}>All clear — you're on top of it</p>}
        {activeTasks.slice(0, 5).map(t => (
          <button key={t.id} onClick={() => toggleHomeTask(t.id)}
            style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%', background: 'none', border: 'none', cursor: 'pointer', padding: '10px 0', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
            <span style={{ width: 20, height: 20, borderRadius: 6, border: '1.5px solid rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              {t.done && <span style={{ color: '#fff', fontSize: 11 }}>✓</span>}
            </span>
            <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', textAlign: 'left' }}>{t.text}</span>
          </button>
        ))}
        {activeTasks.length > 5 && <p style={{ fontSize: 12, ...s.dim, marginTop: 8 }}>+{activeTasks.length - 5} more</p>}
      </div>

      {/* Always available */}
      <div style={{ ...s.card, marginBottom: 14 }}>
        <div style={s.label}>TRACK</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 0 }}>
          {alwaysTools.map(t => (
            <button key={t.id} onClick={() => setPage(t.id)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '14px 8px', textAlign: 'center',
                borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
              <div style={{ fontSize: 14, fontWeight: 500, color: 'rgba(255,255,255,0.6)' }}>{t.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Milestone */}
      <div style={{ ...s.card, marginBottom: 14 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 11, ...s.dim, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 8 }}>MILESTONE</div>
          <div style={{ fontSize: 16, fontWeight: 500, color: '#fff' }}>{cur.title}</div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', lineHeight: 1.5, marginTop: 6 }}>{cur.description}</div>
        </div>
        {nxt && (
          <div style={{ marginTop: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, ...s.dim, marginBottom: 4 }}>
              <span>Now</span><span>{nxt.title}</span>
            </div>
            <div style={s.track}><div style={s.fill(pct)} /></div>
          </div>
        )}
        <button onClick={() => setPage('brain')} style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)', background: 'none', border: 'none', cursor: 'pointer', marginTop: 12, letterSpacing: 1 }}>
          What's happening in your brain →
        </button>
      </div>

      {/* Quote */}
      <div style={{ ...s.card, textAlign: 'center', padding: '24px 20px' }}>
        <div style={{ width: 24, height: 1, background: 'rgba(255,255,255,0.15)', margin: '0 auto 16px' }} />
        <p style={{ fontSize: 16, fontWeight: 300, color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, fontStyle: 'italic' }}>
          "{quote}"
        </p>
        <p style={{ fontSize: 10, letterSpacing: 3, textTransform: 'uppercase', ...s.dim, marginTop: 14 }}>Neville Goddard</p>
      </div>
    </div>
  )
}

// ============================================================
// BRAIN
// ============================================================

const DAILY_BREAKDOWN = [
  { day: 1, title: 'The Decision', symptoms: ['Restlessness', 'Irritability', 'Anxiety', 'Reduced appetite', 'Difficulty sleeping'], brain: 'THC is still being metabolized by your liver. CB1 receptors are starting to notice the supply has stopped. Your endocannabinoid system is sounding the alarm. GABA and glutamate — your brain\'s brake and gas pedals — are out of balance. This is why you feel on edge.', body: 'Heart rate normalizing. Body temperature may fluctuate. You might sweat more than usual. Your gut has cannabinoid receptors too — appetite disruption is your digestive system recalibrating.', survive: 'Drink water constantly. Your brain needs it to run the enzymatic processes clearing THC. Eat even if you\'re not hungry — your brain burns 20% of your calories. Go to bed at the same time even if you can\'t sleep.' },
  { day: 2, title: 'Emotions Resurface', symptoms: ['Intense emotions', 'Mood swings', 'Vivid dreams begin', 'Cravings intensify', 'Brain fog'], brain: 'CB1 receptor upregulation has begun — your brain is literally growing new receptor sites. Your amygdala (emotional center) is coming back online at full volume after being dampened by THC. Emotions you haven\'t felt in months are flooding in. This is not weakness. This is your brain healing.', body: 'Night sweats are common — your body is purging THC stored in fat cells through sweat. REM rebound starts tonight. Dreams will be more vivid than anything you\'ve experienced. This is your brain clearing a backlog of unprocessed emotional material.', survive: 'Let yourself feel. Don\'t judge the emotions. Journal them. Every feeling that moves through you is one that no longer needs to be stored. Cold showers reset your nervous system fast.' },
  { day: 3, title: 'Peak Withdrawal', symptoms: ['Strongest cravings', 'Low motivation', 'Flat mood', 'Insomnia', 'Headaches possible'], brain: 'This is often the hardest day. Dopamine levels are at their LOWEST point. Your brain reduced its natural dopamine production because THC was providing artificial surges. Your nucleus accumbens (reward center) is screaming for the substance. But your prefrontal cortex is building new inhibitory connections RIGHT NOW — the neural infrastructure of willpower.', body: 'Your body is working overtime. Liver enzymes are breaking down remaining THC metabolites. Stay hydrated — dehydration makes every symptom worse. Appetite may be nonexistent. Force yourself to eat small meals.', survive: 'This is the day most people relapse. If you make it through today, the worst is behind you. Do the 4-7-8 breathing. Use the SOS button. Talk to the coach. Do NOT be alone with the craving — move your body, call someone, get outside.' },
  { day: 4, title: 'The Shift', symptoms: ['Cravings still present', 'Sleep slightly better', 'Moments of clarity', 'Appetite returning', 'Emotional sensitivity'], brain: 'Your GABAergic system is rebalancing. GABA is your brain\'s primary calming neurotransmitter — it\'s normalizing without external cannabinoid input. You\'ll notice moments of unexpected calm between waves of discomfort. Your default mode network (the one Neville\'s visualization activates) is becoming more accessible.', body: 'Night sweats may continue. Your autonomic nervous system is recalibrating — temperature regulation, sweating, heart rate are all finding new baselines. Your gut bacteria are shifting too, which affects mood through the gut-brain axis.', survive: 'Notice the moments of clarity. They\'re brief but real. That\'s your brain showing you what\'s coming. Write down WHY you quit. Read it when a craving hits.' },
  { day: 5, title: 'Appetite Returns', symptoms: ['Hunger comes back', 'Dreams intensifying', 'Better focus moments', 'Emotional waves', 'Energy still low'], brain: 'Your hypothalamus is recalibrating hunger signals. Serotonin production in your gut (90% of serotonin is made there) is stabilizing. Dreams are at peak intensity now — REM rebound is in full force. Every vivid dream is your brain processing weeks of unprocessed emotional material. Your brain is literally doing maintenance.', body: 'Eat brain-building foods: salmon, eggs, blueberries, walnuts, dark leafy greens. Your brain is hungry for the raw materials to rebuild. Omega-3s for cell membranes. Choline for memory. Antioxidants for protection.', survive: 'Use the energy tracker. You\'ll start seeing the pattern — energy comes in waves but the baseline is rising. Even 10 minutes of walking floods your brain with BDNF.' },
  { day: 6, title: 'Neuroplasticity Opens', symptoms: ['Brain fog lifting', 'Better verbal recall', 'Sleep improving', 'Cravings less intense', 'Emotional depth'], brain: 'BDNF (Brain-Derived Neurotrophic Factor) levels are increasing — this is literal fertilizer for your neurons. Your brain has entered a window of enhanced neuroplasticity. Every new habit you practice, every I AM declaration, every visualization is being encoded more deeply than it would have been while using. This is the window where the work has outsized impact.', body: 'Your endocannabinoid system is producing more anandamide — the bliss molecule — on its own. You may get brief moments of natural euphoria that feel different from being high. Cleaner. Realer.', survive: 'USE THIS WINDOW. Do your SATS. Do your revisions. Practice your I AM declarations. Your brain is hungry to rewire and everything you feed it right now gets carved deeper.' },
  { day: 7, title: 'One Week', symptoms: ['Sleep architecture rebuilding', 'Memory improving', 'Cravings becoming manageable', 'Mood stabilizing', 'Brain fog clearing'], brain: 'Your sleep cycles are getting longer and more structured. Memory consolidation is improving — your hippocampus is processing information more effectively. You\'ll notice you\'re remembering names, conversations, details better. Verbal fluency is returning. The anandamide your body produces naturally is smoother and more attuned to your actual needs than external THC ever was.', body: 'Physical symptoms are fading. Your body has cleared most active THC. THC-COOH (the inactive metabolite stored in fat) will continue clearing for weeks, but it\'s not affecting your brain anymore. Your cortisol patterns are normalizing.', survive: 'Celebrate this. One week is massive. Your brain has done more healing in 7 days than most people realize is possible. Keep going — the next 7 days compound what you\'ve built.' },
  { day: 8, title: 'Building Momentum', symptoms: ['More consistent energy', 'Cravings less frequent', 'Sleep getting deeper', 'Emotions more manageable', 'Clearer thinking'], brain: 'Neural pathways associated with cannabis use are weakening through disuse. Every day you don\'t use, the synaptic connections that drove the habit get pruned. Meanwhile, every new practice — gratitude, journaling, visualization — is strengthening new pathways. This is literally Neville\'s law playing out at the cellular level: what you focus on grows.', body: 'Your body\'s stress response system (HPA axis) is recalibrating. Cortisol — the stress hormone — is finding a healthier daily rhythm. You\'ll handle unexpected stress better today than you did on Day 3.', survive: 'Start noticing what feels different. Write it down. On hard days ahead, this list is your evidence that recovery is real and working.' },
  { day: 9, title: 'Natural Rewards Return', symptoms: ['Food tastes better', 'Music hits different', 'Colors more vivid', 'Natural laughter', 'Sleep dreams calming'], brain: 'Your dopamine receptors are resensitizing. Normal, everyday pleasures are starting to register again at their full intensity. A good meal, a song, a sunset, a genuine laugh — these things were dampened by artificial dopamine surges. Now they\'re coming back.', body: 'Appetite is normalizing. You may crave specific nutrients your brain needs — follow those cravings (for food, not weed). Your body knows what it needs to rebuild.', survive: 'Pay attention to the small pleasures. That\'s your reward system healing. The flat, gray feeling is lifting. This is what natural joy feels like.' },
  { day: 10, title: 'Emotional Depth', symptoms: ['Deep feelings', 'Sensitivity to beauty', 'Presence', 'Less brain fog', 'Rare cravings'], brain: 'The acute withdrawal window is closing. What remains is deeper processing. Your dopamine system is producing and receiving at closer-to-normal levels. Music sounds different because your auditory cortex is processing without interference. Conversations feel more present because your prefrontal cortex is fully online.', body: 'Most physical withdrawal symptoms have passed. Any remaining discomfort is psychological — habitual patterns, environmental triggers, social situations. Your body is functioning well.', survive: 'You\'re through the hardest part. Days 1-10 are the mountain. You climbed it. Everything from here compounds.' },
  { day: 14, title: 'Two Weeks', symptoms: ['Memory noticeably sharper', 'Better decisions', 'Stable mood', 'Deep sleep', 'Identity shifting'], brain: 'CB1 receptor density in cortical regions is approaching normal levels. Brain imaging studies show measurable structural differences between Day 1 and Day 14. Verbal memory is objectively better. Attention span is longer. Your prefrontal cortex is making stronger connections — better planning, better impulse control, better emotional regulation.', body: 'Your circadian rhythm is resetting. If you\'ve been going to bed and waking at consistent times, your body is locking in. Sleep is becoming genuinely restorative — the kind where you wake up actually rested.', survive: 'You\'re not the same person who quit two weeks ago. The neural architecture is different. Trust the process — your brain is doing exactly what it\'s supposed to do.' },
  { day: 21, title: 'Three Weeks', symptoms: ['Natural calm', 'Steady energy', 'Vivid but manageable dreams', 'Genuine motivation', 'Stress resilience'], brain: 'Most physical withdrawal symptoms have fully resolved. Your body is producing anandamide and 2-AG at normal levels — these natural endocannabinoids are smoother, subtler, and perfectly calibrated to your needs. Your stress response is even. Your ability to learn and adapt is markedly improved.', body: 'You may notice your skin looks better, your eyes are clearer, your breathing is easier. THC metabolites stored in fat are still clearing but at low levels. Your body is functioning as designed.', survive: 'This is where the real transformation begins. The withdrawal is over. Now it\'s about building. Every practice you do now is building the architecture of your new life.' },
  { day: 30, title: 'One Month', symptoms: ['Cognitive clarity', 'Emotional stability', 'Strong willpower', 'Natural energy', 'Identity fully shifting'], brain: 'Significant cognitive recovery across all domains. Working memory is sharper. Sustained attention is stronger. Processing speed has increased. Neural pruning is accelerating — your brain is actively dismantling the old pathways dedicated to cannabis and redirecting that neural real estate to whatever you\'re focused on now. Your default emotional state is more stable than it\'s been in a long time.', body: 'Your body has fully adapted. Sleep is deep and restorative. Appetite is natural. Energy comes in strong, sustained waves. You look different, feel different, think different.', survive: 'You did it. 30 days. But don\'t stop — the brain continues healing for 90 days, and the gains from Day 30-90 are where everything locks in permanently. Keep going.' },
]

function BrainPage({ time, onBack }) {
  const [expanded, setExpanded] = useState(null)
  const [expandedDay, setExpandedDay] = useState(null)
  const [expandedArticle, setExpandedArticle] = useState(null)
  const { cur } = getMilestone(time.totalHours)
  const currentDay = Math.floor(time.totalHours / 24) + 1

  // Find the current daily breakdown
  const currentDayInfo = DAILY_BREAKDOWN.find((d, i) => {
    const next = DAILY_BREAKDOWN[i + 1]
    return currentDay >= d.day && (!next || currentDay < next.day)
  }) || DAILY_BREAKDOWN[0]

  return (
    <div style={s.page}>
      <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', ...s.dim, fontSize: 14, display: 'flex', alignItems: 'center', gap: 4, marginTop: 16 }}>
        <span style={{ transform: 'rotate(180deg)', display: 'inline-block' }}>{Icons.chevron}</span> Back
      </button>
      <div style={{ paddingTop: 8, marginBottom: 20 }}>
        <h1 style={s.greeting}>Day {currentDay}</h1>
        <p style={s.subtitle}>{Math.floor(time.totalHours)} hours into recovery</p>
      </div>

      {/* What's happening RIGHT NOW */}
      <div style={{ ...s.card, marginBottom: 14, border: '1px solid rgba(255,255,255,0.15)' }}>
        <div style={s.label}>WHAT'S HAPPENING RIGHT NOW</div>
        <div style={{ fontSize: 18, fontWeight: 500, color: '#fff', marginBottom: 12 }}>{currentDayInfo.title}</div>
        <div style={{ fontSize: 15, color: 'rgba(255,255,255,0.6)', lineHeight: 1.8, marginBottom: 16 }}>{currentDayInfo.brain}</div>

        <div style={s.label}>WHAT YOU MAY BE FEELING</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
          {currentDayInfo.symptoms.map(sym => (
            <span key={sym} style={{ padding: '8px 14px', borderRadius: 999, fontSize: 13, background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.6)' }}>{sym}</span>
          ))}
        </div>

        <div style={s.label}>YOUR BODY</div>
        <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, marginBottom: 16 }}>{currentDayInfo.body}</div>

        <div style={s.label}>HOW TO GET THROUGH THIS</div>
        <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', lineHeight: 1.7 }}>{currentDayInfo.survive}</div>
      </div>

      {/* Day by day breakdown */}
      <div style={{ ...s.label, marginTop: 24, marginBottom: 10 }}>YOUR 30-DAY JOURNEY</div>
      {DAILY_BREAKDOWN.map((d, i) => {
        const reached = currentDay >= d.day
        const isExpanded = expandedDay === i
        return (
          <div key={i} onClick={() => setExpandedDay(isExpanded ? null : i)}
            style={{ ...s.card, marginBottom: 6, opacity: reached ? 1 : 0.4, cursor: 'pointer' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: reached ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.03)',
                  border: currentDay >= d.day && currentDay < (DAILY_BREAKDOWN[i + 1]?.day || 999) ? '1px solid rgba(255,255,255,0.2)' : '1px solid rgba(255,255,255,0.06)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: reached ? '#fff' : 'rgba(255,255,255,0.3)' }}>{d.day}</span>
                </div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 500, color: '#fff' }}>{d.title}</div>
                  {!isExpanded && <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', marginTop: 2 }}>{d.symptoms.slice(0, 3).join(' · ')}</div>}
                </div>
              </div>
              <span style={{ ...s.dim, fontSize: 12, transform: isExpanded ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }}>›</span>
            </div>
            {isExpanded && (
              <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={s.label}>YOUR BRAIN</div>
                <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, marginBottom: 14 }}>{d.brain}</p>
                <div style={s.label}>YOUR BODY</div>
                <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, marginBottom: 14 }}>{d.body}</p>
                <div style={s.label}>SURVIVE THIS</div>
                <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, marginBottom: 14 }}>{d.survive}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {d.symptoms.map(sym => (
                    <span key={sym} style={{ padding: '6px 12px', borderRadius: 999, fontSize: 12, background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.4)' }}>{sym}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )
      })}

      {/* Long-term milestones */}
      <div style={{ ...s.label, marginTop: 24, marginBottom: 10 }}>BEYOND 30 DAYS</div>
      {NEURAL_MILESTONES.filter(m => m.hours >= 1080).map((m, i) => {
        const reached = time.totalHours >= m.hours
        return (
          <div key={i} style={{ ...s.card, marginBottom: 6, opacity: reached ? 1 : 0.4 }}>
            <div style={{ fontSize: 15, fontWeight: 500, color: '#fff' }}>{m.title}</div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', lineHeight: 1.6, marginTop: 6 }}>{m.description}</div>
          </div>
        )
      })}

      {/* Deep reads */}
      <div style={{ ...s.label, marginTop: 24, marginBottom: 10 }}>DEEP READS</div>
      {BRAIN_ARTICLES.map((a, i) => (
        <div key={i} style={{ ...s.card, marginBottom: 8, cursor: 'pointer' }} onClick={() => setExpandedArticle(expandedArticle === i ? null : i)}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ fontSize: 15, fontWeight: 500, color: '#fff' }}>{a.title}</div>
            <span style={{ ...s.dim, fontSize: 12, transform: expandedArticle === i ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }}>›</span>
          </div>
          {expandedArticle === i && <div style={{ ...s.cardText, marginTop: 12 }}>{a.content}</div>}
        </div>
      ))}
    </div>
  )
}

// ============================================================
// SATS — Nighttime Manifestation Practice
// ============================================================

function SATSPage() {
  const [scenes, satsDb] = useSync('sats_scenes', 'sats_scenes')
  const [input, setInput] = useState('')
  const [nightMode, setNightMode] = useState(false)
  const [soundOn, setSoundOn] = useState(false)
  const [selectedSound, setSelectedSound] = useState(TIMER_SOUNDS[0])
  const mic = useSpeech(setInput)

  const saveScene = () => {
    if (!input.trim()) return
    satsDb.add({ content: input, type: mic.listening ? 'spoken' : 'written' }); setInput('')
    mic.stop()
  }

  const delScene = (id) => {
    if (!confirm('Are you sure you want to delete this scene?')) return
    satsDb.remove(id)
  }

  const enterNight = () => {
    setNightMode(true)
    if (soundOn) ambient.start(selectedSound.freq)
  }

  const exitNight = () => {
    setNightMode(false)
    ambient.stop()
  }

  useEffect(() => { return () => ambient.stop() }, [])

  // Night mode — full immersive dark screen
  if (nightMode) {
    return (
      <div style={{ minHeight: '100vh', background: '#050507', display: 'flex', flexDirection: 'column', position: 'fixed', inset: 0, zIndex: 200, padding: '0 20px' }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', maxWidth: 430, margin: '0 auto', width: '100%' }}>

          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <span style={{ fontSize: 24, color: 'rgba(255,255,255,0.1)' }}>✦</span>
            <p style={{ fontSize: 13, fontWeight: 300, color: 'rgba(255,255,255,0.25)', lineHeight: 1.8, marginTop: 16, fontStyle: 'italic' }}>
              Close your eyes. Create a short scene that implies your wish is fulfilled. Feel yourself in it. Loop it. The feeling is the secret.
            </p>
          </div>

          <textarea value={input} onChange={e => setInput(e.target.value)}
            placeholder="Speak or write your scene here... present tense, as if it's already real..."
            rows={6}
            style={{ ...s.textarea, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)', fontSize: 15, lineHeight: 1.8, marginBottom: 20, color: 'rgba(255,255,255,0.6)' }}
          />

          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginBottom: 24 }}>
            <MicBtn listening={mic.listening} onPress={() => mic.toggle(input)} />
            {input.trim() && (
              <button onClick={saveScene} style={{ ...s.btnSecondary, padding: '12px 20px' }}>Save Scene</button>
            )}
          </div>

          {/* Sound controls */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 20 }}>
            {TIMER_SOUNDS.map(snd => (
              <button key={snd.id} onClick={() => { setSelectedSound(snd); if (soundOn) { ambient.stop(); ambient.start(snd.freq) } }}
                style={{ padding: '6px 12px', borderRadius: 999, fontSize: 10, fontWeight: 500, cursor: 'pointer', transition: 'all 0.2s',
                  background: selectedSound.id === snd.id && soundOn ? 'rgba(255,255,255,0.08)' : 'transparent',
                  border: selectedSound.id === snd.id && soundOn ? '1px solid rgba(255,255,255,0.15)' : '1px solid rgba(255,255,255,0.04)',
                  color: 'rgba(255,255,255,0.3)' }}>
                {snd.name}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: 12 }}>
            <button onClick={() => { setSoundOn(!soundOn); if (!soundOn) ambient.start(selectedSound.freq); else ambient.stop() }}
              style={{ ...s.btnSecondary, padding: '8px 16px', fontSize: 11, opacity: 0.5 }}>
              {soundOn ? 'Sound On' : 'Sound Off'}
            </button>
          </div>

          {/* Recent scenes in night mode */}
          {scenes.length > 0 && (
            <div style={{ marginTop: 32 }}>
              <div style={{ fontSize: 9, letterSpacing: 3, textTransform: 'uppercase', color: 'rgba(255,255,255,0.15)', marginBottom: 12, textAlign: 'center' }}>RECENT SCENES</div>
              {scenes.slice(0, 3).map(sc => (
                <div key={sc.id} style={{ padding: '10px 0', borderTop: '1px solid rgba(255,255,255,0.03)' }}>
                  <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)', fontStyle: 'italic', lineHeight: 1.6 }}>"{(sc.content || sc.text).slice(0, 120)}{(sc.content || sc.text).length > 120 ? '...' : ''}"</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Exit button */}
        <button onClick={exitNight}
          style={{ position: 'fixed', top: 16, right: 16, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 999, padding: '8px 16px', fontSize: 11, color: 'rgba(255,255,255,0.3)', cursor: 'pointer' }}>
          Exit
        </button>
      </div>
    )
  }

  return (
    <div style={s.page}>
      <div style={{ paddingTop: 20, marginBottom: 24 }}>
        <h1 style={s.greeting}>SATS</h1>
        <p style={s.subtitle}>State Akin To Sleep — your nightly practice</p>
      </div>

      {/* Enter night mode */}
      <button onClick={enterNight}
        style={{ ...s.card, width: '100%', textAlign: 'center', cursor: 'pointer', padding: '32px 16px', marginBottom: 14,
          background: '#0a0a0e', border: '1px solid rgba(255,255,255,0.06)', transition: 'all 0.2s' }}>
        <span style={{ fontSize: 28, display: 'block', marginBottom: 10 }}>✦</span>
        <div style={{ fontSize: 14, fontWeight: 500, color: '#fff', marginBottom: 6 }}>Begin Nighttime Practice</div>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', lineHeight: 1.5 }}>
          Full screen, dimmed, with ambient sound. Write or speak your scene as you drift to sleep.
        </div>
      </button>

      {/* Neville teaching */}
      <div style={{ ...s.card, marginBottom: 14, padding: '20px 16px' }}>
        <div style={{ ...s.label, marginBottom: 10 }}>THE TECHNIQUE</div>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', lineHeight: 1.7 }}>
          <p style={{ marginBottom: 10 }}>
            <strong style={{ color: 'rgba(255,255,255,0.7)' }}>1. Relax.</strong> Lie down. Let your body get heavy. Reach that drowsy state between waking and sleeping.
          </p>
          <p style={{ marginBottom: 10 }}>
            <strong style={{ color: 'rgba(255,255,255,0.7)' }}>2. Create a scene.</strong> One short scene — 10 seconds — that implies your wish is already fulfilled.
            A handshake, a conversation, looking at something, hearing specific words.
          </p>
          <p style={{ marginBottom: 10 }}>
            <strong style={{ color: 'rgba(255,255,255,0.7)' }}>3. Loop it.</strong> Replay the scene over and over. Feel yourself IN it, not watching it.
            Feel the texture, the temperature, the emotion.
          </p>
          <p>
            <strong style={{ color: 'rgba(255,255,255,0.7)' }}>4. Feel it real.</strong> The feeling is the secret. Not the words. Not the images.
            The <em>feeling</em> of already having it. Fall asleep in that feeling.
          </p>
        </div>
      </div>

      {/* Quick write (non-night mode) */}
      <div style={{ ...s.card, marginBottom: 14 }}>
        <div style={{ ...s.label, marginBottom: 10 }}>WRITE YOUR SCENE</div>
        <textarea value={input} onChange={e => setInput(e.target.value)} rows={4}
          placeholder="Describe your scene in present tense... what do you see, hear, feel?"
          style={s.textarea} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
          <MicBtn listening={mic.listening} onPress={() => mic.toggle(input)} />
          <button onClick={saveScene} style={s.btnSecondary}>Save Scene</button>
        </div>
      </div>

      {/* Neville quotes specific to SATS */}
      <div style={{ ...s.card, marginBottom: 14, textAlign: 'center', padding: '20px 16px', borderLeft: '2px solid rgba(255,255,255,0.1)', borderRadius: '0 14px 14px 0' }}>
        <p style={{ fontSize: 13, fontWeight: 300, color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, fontStyle: 'italic' }}>
          "Sleep, the gateway to the subconscious, is the most favorable time to impress the subconscious with your desires."
        </p>
        <p style={{ fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', ...s.dim, marginTop: 10 }}>Neville Goddard</p>
      </div>

      {/* Saved scenes */}
      {scenes.length > 0 && (
        <>
          <div style={s.label}>YOUR SCENES</div>
          {scenes.map(sc => (
            <div key={sc.id} style={{ ...s.card, marginBottom: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 10, ...s.dim }}>{sc.type === 'spoken' ? '🎙' : '✎'}</span>
                  <span style={{ fontSize: 10, ...s.dim }}>{fmtDate(sc.created_at || sc.date)} · {fmtTime(sc.created_at || sc.date)}</span>
                </div>
                <button onClick={() => delScene(sc.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.1)' }}>{Icons.trash}</button>
              </div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', lineHeight: 1.6, fontStyle: 'italic' }}>"{sc.content || sc.text}"</div>
            </div>
          ))}
        </>
      )}

      {!scenes.length && (
        <div style={{ textAlign: 'center', padding: '40px 0', ...s.dim }}>
          <p style={{ fontSize: 13 }}>No scenes saved yet</p>
          <p style={{ fontSize: 11, marginTop: 6, opacity: 0.6 }}>Write your first scene and practice it tonight</p>
        </div>
      )}
    </div>
  )
}

// ============================================================
// DREAMS
// ============================================================

function DreamsPage({ onBack }) {
  const [dreams, dreamsDb] = useSync('dreams', 'dreams')
  const [input, setInput] = useState('')
  const [chatMode, setChatMode] = useState(false)
  const [chats, chatsDb] = useSync('dream_chats', 'dreamchats')
  const [chatIn, setChatIn] = useState('')
  const dreamMic = useSpeech(setInput)
  const chatMic = useSpeech(setChatIn)

  const addDream = () => {
    if (!input.trim()) return
    dreamsDb.add({ text: input }); setInput('')
  }

  const delDream = (id) => {
    if (!confirm('Are you sure you want to delete this dream?')) return
    dreamsDb.remove(id)
  }

  const sendChat = async () => {
    if (!chatIn.trim()) return
    const responses = [
      `That's beautiful. Your subconscious is communicating — this is exactly the kind of dream processing that happens during REM rebound. You've logged ${dreams.length} dreams so far, each one a window into your healing.`,
      `Dreams like this often emerge as your REM sleep architecture rebuilds. The vividness is a sign of healing. Neville would say this dream is showing you a state you're moving toward.`,
      `Your brain is processing and releasing. During cannabis use, REM is suppressed — now it's flooding back. The fact that you remember this so clearly means your memory pathways are strengthening.`,
      `Your subconscious is reorganizing — sorting through old files, making new connections, building the neural architecture for who you're becoming. As Neville said, "Imagination is the beginning of creation."`,
      `Dream journaling during recovery is powerful — it strengthens the bridge between your conscious and subconscious mind. You have ${dreams.length} entries now — that's ${dreams.length} conversations with your deeper self.`,
    ]
    await chatsDb.add({ role: 'user', content: chatIn })
    await chatsDb.add({ role: 'ai', content: responses[Math.floor(Math.random() * responses.length)] })
    setChatIn('')
  }

  return (
    <div style={s.page}>
      <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', ...s.dim, fontSize: 12, paddingTop: 16, display: 'flex', alignItems: 'center', gap: 4 }}>
        <span style={{ transform: 'rotate(180deg)', display: 'inline-block' }}>{Icons.chevron}</span> Back
      </button>
      <div style={{ paddingTop: 12, marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={s.greeting}>Dream journal</h1>
          <p style={s.subtitle}>Your brain is learning to dream again</p>
        </div>
        <button onClick={() => setChatMode(!chatMode)} style={{ ...s.btnSecondary, padding: '8px 14px', opacity: chatMode ? 1 : 0.5 }}>
          <span style={{ fontSize: 12 }}>{chatMode ? 'Journal' : 'Chat'}</span>
        </button>
      </div>

      {chatMode ? (
        <div style={{ ...s.card, minHeight: '60vh', display: 'flex', flexDirection: 'column' }}>
          <div style={{ ...s.label, paddingBottom: 12, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>DREAM COMPANION</div>
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px 0' }}>
            <div style={{ ...s.card, marginBottom: 12, background: 'rgba(255,255,255,0.03)' }}>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}>
                Tell me about your dreams. I remember everything you share, and I'm here to help you understand what your brain is processing.
              </div>
            </div>
            {chats.map((m, i) => (
              <div key={i} style={{ marginBottom: 10, display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
                <div style={{
                  maxWidth: '80%', padding: '10px 14px', borderRadius: 14, fontSize: 12, lineHeight: 1.6,
                  background: m.role === 'user' ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.03)',
                  color: m.role === 'user' ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.5)',
                }}>{m.content || m.text}</div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 8, paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <input value={chatIn} onChange={e => setChatIn(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendChat()}
              placeholder="Tell me about your dream..." style={{ ...s.input, flex: 1 }} />
            <MicBtn listening={chatMic.listening} onPress={() => chatMic.toggle(chatIn)} small />
            <button onClick={sendChat} style={{ ...s.btnSecondary, padding: '10px 14px' }}>
              <span style={{ color: '#fff' }}>{Icons.send}</span>
            </button>
          </div>
        </div>
      ) : (
        <>
          <div style={{ ...s.card, marginBottom: 14 }}>
            <textarea value={input} onChange={e => setInput(e.target.value)} rows={4}
              placeholder="Describe your dream... every detail matters as your REM sleep rebuilds..."
              style={s.textarea} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
              <span style={{ fontSize: 10, ...s.dim }}>{dreams.length} dreams recorded</span>
              <div style={{ display: 'flex', gap: 8 }}>
                <MicBtn listening={dreamMic.listening} onPress={() => dreamMic.toggle(input)} small />
                <button onClick={addDream} style={s.btnSecondary}>Save Dream</button>
              </div>
            </div>
          </div>

          {dreams.map(d => (
            <div key={d.id} style={{ ...s.card, marginBottom: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontSize: 10, ...s.dim }}>{fmtDate(d.created_at || d.date)} · {fmtTime(d.created_at || d.date)}</span>
                <button onClick={() => delDream(d.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.15)' }}>{Icons.trash}</button>
              </div>
              <div style={s.cardText}>{d.text}</div>
            </div>
          ))}

          {!dreams.length && (
            <div style={{ textAlign: 'center', padding: '60px 0', ...s.dim }}>
              <p style={{ fontSize: 13 }}>Your dream journal is waiting</p>
              <p style={{ fontSize: 11, marginTop: 6, opacity: 0.6 }}>As REM rebound kicks in, your dreams will become vivid and meaningful</p>
            </div>
          )}
        </>
      )}
    </div>
  )
}

// ============================================================
// NUTRITION
// ============================================================

function NutritionPage({ onBack }) {
  const [entries, nutritionDb] = useSync('nutrition', 'nutrition')
  const [input, setInput] = useState('')
  const [found, setFound] = useState(null)
  const [show, setShow] = useState(false)
  const mic = useSpeech(setInput)

  const log = (text, foodData) => {
    const f = foodData || findFood(text)
    nutritionDb.add({ food: text, nutrients: f?.nutrients || '', benefits: f?.benefits || '' })
    setFound(f); setShow(true); setInput('')
    setTimeout(() => setShow(false), 10000)
  }

  return (
    <div style={s.page}>
      {onBack && (
        <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', ...s.dim, fontSize: 12, paddingTop: 16, display: 'flex', alignItems: 'center', gap: 4 }}>
          <span style={{ transform: 'rotate(180deg)', display: 'inline-block' }}>{Icons.chevron}</span> Back
        </button>
      )}
      <div style={{ paddingTop: onBack ? 12 : 20, marginBottom: 24 }}>
        <h1 style={s.greeting}>Nourish</h1>
        <p style={s.subtitle}>Feed your brain what it needs to rebuild</p>
      </div>

      {/* Neville */}
      <div style={{ ...s.card, marginBottom: 14, borderLeft: '2px solid rgba(255,255,255,0.15)', borderRadius: '0 14px 14px 0' }}>
        <p style={{ fontSize: 12, fontStyle: 'italic', color: 'rgba(255,255,255,0.4)', lineHeight: 1.6 }}>
          "Health is not created; it is only manifested by the arrangement of your mind — and what you feed it."
        </p>
        <p style={{ fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', ...s.dim, marginTop: 8 }}>Neville Goddard</p>
      </div>

      <div style={{ ...s.card, marginBottom: 14 }}>
        <div style={{ ...s.label, marginBottom: 10 }}>WHAT DID YOU EAT?</div>
        <div style={{ display: 'flex', gap: 8 }}>
          <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && log(input)}
            placeholder="I had broccoli and salmon..." style={{ ...s.input, flex: 1 }} />
          <MicBtn listening={mic.listening} onPress={() => mic.toggle(input)} small />
          <button onClick={() => log(input)} style={s.btnSecondary}>Log</button>
        </div>
      </div>

      <AnimatePresence>
        {show && found && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            style={{ ...s.card, marginBottom: 14, borderLeft: '2px solid rgba(255,255,255,0.2)', borderRadius: '0 14px 14px 0' }}>
            <div style={{ fontSize: 14, fontWeight: 500, color: '#fff', textTransform: 'capitalize', marginBottom: 6 }}>{found.food} ✦</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 8 }}>{found.nutrients}</div>
            <div style={s.cardText}>{found.benefits}</div>
          </motion.div>
        )}
        {show && !found && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ ...s.card, marginBottom: 14, textAlign: 'center' }}>
            <p style={{ fontSize: 12, ...s.dim }}>Logged! Try a specific food like "broccoli" or "salmon" to see how it helps your brain rebuild.</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ ...s.label, marginTop: 20 }}>BRAIN FOODS</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 8 }}>
        {Object.entries(FOOD_BENEFITS).slice(0, 16).map(([food, data]) => (
          <button key={food} onClick={() => log(food, { food, ...data })}
            style={{ ...s.card, padding: '12px 8px', textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s' }}>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', textTransform: 'capitalize' }}>{food}</div>
          </button>
        ))}
      </div>

      {entries.length > 0 && (
        <>
          <div style={{ ...s.label, marginTop: 24 }}>TODAY</div>
          {entries.slice(0, 10).map(e => (
            <div key={e.id} style={{ ...s.card, marginBottom: 6, display: 'flex', alignItems: 'center', padding: '10px 14px' }}>
              <div style={{ flex: 1 }}>
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', textTransform: 'capitalize' }}>{e.food || e.text}</span>
                <span style={{ fontSize: 10, ...s.dim, marginLeft: 8 }}>{fmtTime(e.created_at || e.date)}</span>
              </div>
              {e.food && <span style={{ fontSize: 10, ...s.dim }}>✦</span>}
            </div>
          ))}
        </>
      )}
    </div>
  )
}

// ============================================================
// MORE PAGE (hub for sub-pages)
// ============================================================

function MorePage({ setPage }) {
  const sections = [
    { title: 'NEVILLE GODDARD', items: [
      { id: 'revision', label: 'Revision', sub: 'Rewrite any moment as you wished it happened' },
      { id: 'iam', label: 'I AM Declarations', sub: 'Speak your identity into being' },
      { id: 'ladder', label: 'Ladder Experiment', sub: 'Prove the law to yourself' },
      { id: 'mentaldiet', label: 'Mental Diet', sub: 'Catch the thought, replace the thought' },
      { id: 'surrender', label: 'Give It to God', sub: 'Release what isn\'t yours to carry' },
      { id: 'visualize', label: 'Visualize', sub: 'Live in the end' },
      { id: 'sats', label: 'SATS', sub: 'State akin to sleep' },
      { id: 'readings', label: 'Daily Readings', sub: 'Neville, Proctor, Dyer, Wattles' },
    ]},
    { title: 'BOB PROCTOR', items: [
      { id: 'goalcard', label: 'Goal Card', sub: 'Your one goal, morning and night' },
      { id: 'paradigm', label: 'Paradigm Tracker', sub: 'Old beliefs to new beliefs' },
      { id: 'terror', label: 'Terror Barrier', sub: 'Log and push through resistance' },
    ]},
    { title: 'WAYNE DYER', items: [
      { id: 'intention', label: 'Power of Intention', sub: 'Connect to source each morning' },
      { id: 'wishes', label: 'Wishes Fulfilled', sub: 'Fall asleep in the wish fulfilled' },
    ]},
    { title: 'WALLACE WATTLES', items: [
      { id: 'certainway', label: 'The Certain Way', sub: 'Desire, gratitude, faith' },
      { id: 'increase', label: 'Impression of Increase', sub: 'Give more value than you receive' },
      { id: 'rampage', label: 'Gratitude Rampage', sub: 'Pour out appreciation' },
    ]},
    { title: 'RECOVERY', items: [
      { id: 'coach', label: 'Coach', sub: 'Your AI recovery companion' },
      { id: 'checkin', label: 'Daily Check-in', sub: 'Morning and evening ritual' },
      { id: 'energy', label: 'Energy', sub: 'Track your recovery' },
      { id: 'cravings', label: 'Cravings', sub: 'Every resist is a win' },
      { id: 'sos', label: 'SOS', sub: 'Emergency craving support' },
      { id: 'brain', label: 'Brain Science', sub: 'What\'s happening inside' },
      { id: 'dreams', label: 'Dream Journal', sub: 'Your brain is dreaming again' },
    ]},
    { title: 'BODY', items: [
      { id: 'water', label: 'Water', sub: 'Your brain is 73% water' },
      { id: 'nourish', label: 'Nourish', sub: 'What food does for recovery' },
      { id: 'bathroom', label: 'Bathroom', sub: 'Your body is detoxing' },
      { id: 'run', label: 'Run', sub: 'GPS tracking, distance, pace' },
      { id: 'health', label: 'Health', sub: 'Daily check-in' },
    ]},
    { title: 'JOURNAL & REFLECT', items: [
      { id: 'journal', label: 'Journal', sub: 'Process, release, grow' },
      { id: 'gratitude', label: 'Gratitude', sub: 'What you appreciate appreciates' },
      { id: 'tasks', label: 'Tasks', sub: 'Your daily to-dos' },
      { id: 'work', label: 'Work Tasks', sub: 'Focus and productivity' },
      { id: 'timer', label: 'Meditation', sub: 'Enter the silence' },
      { id: 'vision', label: 'Vision Board', sub: 'See it, become it' },
      { id: 'progress', label: 'Progress Photos', sub: 'Watch yourself transform' },
    ]},
  ]

  const toolBtn = { background: 'none', border: 'none', cursor: 'pointer', padding: '14px 0',
    borderBottom: '1px solid rgba(255,255,255,0.04)', width: '100%', textAlign: 'left',
    display: 'flex', justifyContent: 'space-between', alignItems: 'center' }

  return (
    <div style={s.page}>
      <div style={{ paddingTop: 20, marginBottom: 24 }}>
        <h1 style={s.greeting}>Everything</h1>
        <p style={s.subtitle}>All your tools, organized by practice</p>
      </div>
      {sections.map(sec => (
        <div key={sec.title} style={{ ...s.card, marginBottom: 14 }}>
          <div style={s.label}>{sec.title}</div>
          {sec.items.map(it => (
            <button key={it.id} onClick={() => setPage(it.id)} style={toolBtn}>
              <div>
                <div style={{ fontSize: 16, fontWeight: 500, color: '#fff' }}>{it.label}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', marginTop: 3 }}>{it.sub}</div>
              </div>
              <span style={s.dim}>{Icons.chevron}</span>
            </button>
          ))}
        </div>
      ))}
    </div>
  )
}

// ============================================================
// WATER
// ============================================================

function WaterPage({ onBack }) {
  const today = new Date().toDateString()
  const [glasses, setGlasses] = useState(load(`water_${today}`, 0))
  const [hist, setHist] = useState(load('waterhist', []))
  const goal = 8

  useEffect(() => {
    supabase.from('water').select('*').order('date', { ascending: false }).limit(30)
      .then(({ data: rows }) => {
        if (rows?.length) {
          setHist(rows); save('waterhist', rows)
          const todayRow = rows.find(r => r.date === today)
          if (todayRow) { setGlasses(todayRow.glasses); save(`water_${today}`, todayRow.glasses) }
        }
      })
  }, [])

  const add = () => {
    const n = glasses + 1; setGlasses(n); save(`water_${today}`, n)
    const h = hist.filter(x => x.date !== today); h.unshift({ date: today, glasses: n }); setHist(h.slice(0, 30)); save('waterhist', h.slice(0, 30))
    supabase.from('water').upsert({ date: today, glasses: n }, { onConflict: 'date' }).then(() => {})
  }

  const pct = Math.min(100, (glasses / goal) * 100)

  return (
    <div style={s.page}>
      <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', ...s.dim, fontSize: 12, paddingTop: 16, display: 'flex', alignItems: 'center', gap: 4 }}>
        <span style={{ transform: 'rotate(180deg)', display: 'inline-block' }}>{Icons.chevron}</span> Back
      </button>
      <div style={{ paddingTop: 12, marginBottom: 24 }}>
        <h1 style={s.greeting}>Hydrate</h1>
        <p style={s.subtitle}>Your brain is 73% water — it needs this</p>
      </div>

      <div style={{ ...s.card, textAlign: 'center', marginBottom: 14, padding: '32px 16px' }}>
        <div style={{ position: 'relative', width: 140, height: 140, margin: '0 auto 20px' }}>
          <svg viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)' }}>
            <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="6" />
            <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="6"
              strokeDasharray={`${pct * 2.83} ${283 - pct * 2.83}`} strokeLinecap="round" style={{ transition: 'all 0.5s' }} />
          </svg>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div style={s.stat}>{glasses}</div>
            <div style={s.statUnit}>of {goal} glasses</div>
          </div>
        </div>

        <button onClick={add} style={{ ...s.btnPrimary, width: 'auto', padding: '12px 32px', display: 'inline-block' }}>
          Add Glass
        </button>

        {glasses >= goal && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ fontSize: 11, ...s.dim, marginTop: 16 }}>
            Goal reached — your neurons are hydrated and happy
          </motion.p>
        )}
      </div>

      <div style={{ ...s.card, borderLeft: '2px solid rgba(255,255,255,0.1)', borderRadius: '0 14px 14px 0', marginBottom: 14 }}>
        <div style={s.cardText}>
          <strong style={{ color: '#fff' }}>During recovery,</strong> proper hydration supports the enzymatic processes that clear THC metabolites,
          cushions your brain during neuroplastic changes, and maintains electrical signaling between your rebuilding neurons.
        </div>
      </div>

      {hist.length > 1 && (
        <>
          <div style={s.label}>THIS WEEK</div>
          <div style={{ display: 'flex', gap: 8 }}>
            {hist.slice(0, 7).map((h, i) => (
              <div key={i} style={{ ...s.card, flex: 1, textAlign: 'center', padding: '10px 6px' }}>
                <div style={{ fontSize: 14, fontWeight: 500, color: '#fff' }}>{h.glasses}</div>
                <div style={{ fontSize: 9, ...s.dim, marginTop: 4 }}>{new Date(h.date).toLocaleDateString('en-US', { weekday: 'short' })}</div>
                <div style={{ width: 4, height: 4, borderRadius: 2, margin: '6px auto 0', background: h.glasses >= goal ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.06)' }} />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

// ============================================================
// GRATITUDE
// ============================================================

function GratitudePage({ onBack }) {
  const [entries, gratDb] = useSync('gratitude', 'gratitude')
  const [input, setInput] = useState('')
  const mic = useSpeech(setInput)

  const add = () => {
    if (!input.trim()) return
    mic.stop()
    gratDb.add({ text: input })
    setInput('')
  }

  const del = (id) => {
    if (!confirm('Are you sure you want to delete this?')) return
    gratDb.remove(id)
  }

  return (
    <div style={s.page}>
      {onBack && (
        <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', ...s.dim, fontSize: 12, paddingTop: 16, display: 'flex', alignItems: 'center', gap: 4 }}>
          <span style={{ transform: 'rotate(180deg)', display: 'inline-block' }}>{Icons.chevron}</span> Back
        </button>
      )}
      <div style={{ paddingTop: onBack ? 12 : 20, marginBottom: 24 }}>
        <h1 style={s.greeting}>Gratitude</h1>
        <p style={s.subtitle}>Rewire your brain toward abundance</p>
      </div>

      <div style={{ ...s.card, marginBottom: 14, borderLeft: '2px solid rgba(255,255,255,0.15)', borderRadius: '0 14px 14px 0' }}>
        <p style={{ fontSize: 12, fontStyle: 'italic', color: 'rgba(255,255,255,0.4)', lineHeight: 1.6 }}>
          "Assume the feeling of the wish fulfilled. Gratitude is the bridge between what you have and what you desire."
        </p>
        <p style={{ fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', ...s.dim, marginTop: 8 }}>Neville Goddard</p>
      </div>

      <div style={{ ...s.card, marginBottom: 14 }}>
        <textarea value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); add() } }}
          placeholder="I am grateful for..." rows={3} style={s.textarea} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
          <span style={{ fontSize: 10, ...s.dim }}>{entries.length} moments of gratitude</span>
          <div style={{ display: 'flex', gap: 8 }}>
            <MicBtn listening={mic.listening} onPress={() => mic.toggle(input)} small />
            <button onClick={add} style={s.btnSecondary}>Give Thanks</button>
          </div>
        </div>
      </div>

      {entries.map(e => (
        <div key={e.id} style={{ ...s.card, marginBottom: 8 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontSize: 10, ...s.dim }}>{fmtDate(e.created_at || e.date)}</span>
            <button onClick={() => del(e.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.1)' }}>{Icons.trash}</button>
          </div>
          <div style={s.cardText}>{e.text}</div>
        </div>
      ))}

      {!entries.length && (
        <div style={{ textAlign: 'center', padding: '60px 0', ...s.dim }}>
          <p style={{ fontSize: 13 }}>Start your gratitude practice</p>
          <p style={{ fontSize: 11, marginTop: 6, opacity: 0.6 }}>Gratitude physically rewires neural pathways toward positivity</p>
        </div>
      )}
    </div>
  )
}

// ============================================================
// BATHROOM TRACKER
// ============================================================

function BathroomPage({ onBack }) {
  const today = new Date().toDateString()
  const [log, logDb] = useSync('bathroom_log', 'bathroom_log')
  const todayEntries = log.filter(e => new Date(e.created_at || e.date).toDateString() === today)
  const [note, setNote] = useState('')

  const logVisit = (type) => {
    logDb.add({ type, note: note.trim() || null })
    setNote('')
  }

  // Group by date for history
  const grouped = {}
  log.forEach(e => {
    const d = new Date(e.created_at || e.date).toDateString()
    if (!grouped[d]) grouped[d] = []
    grouped[d].push(e)
  })
  const dates = Object.keys(grouped).slice(0, 14)

  return (
    <div style={s.page}>
      <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', ...s.dim, fontSize: 13, paddingTop: 16, display: 'flex', alignItems: 'center', gap: 4 }}>
        <span style={{ transform: 'rotate(180deg)', display: 'inline-block' }}>{Icons.chevron}</span> Back
      </button>
      <div style={{ paddingTop: 12, marginBottom: 24 }}>
        <h1 style={s.greeting}>Bathroom</h1>
        <p style={s.subtitle}>Your body is detoxing — track it</p>
      </div>

      {/* Today's count */}
      <div style={{ ...s.card, textAlign: 'center', marginBottom: 14, padding: '28px 18px' }}>
        <div style={s.label}>TODAY</div>
        <div style={{ fontSize: 48, fontWeight: 200, color: '#fff', marginTop: 8 }}>{todayEntries.length}</div>
        <div style={{ fontSize: 13, ...s.dim, marginTop: 4 }}>visits</div>
      </div>

      {/* Log buttons */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
        <button onClick={() => logVisit('1')}
          style={{ ...s.card, flex: 1, textAlign: 'center', cursor: 'pointer', padding: '20px 14px', transition: 'all 0.2s' }}>
          <div style={{ fontSize: 28 }}>💧</div>
          <div style={{ fontSize: 13, fontWeight: 500, color: '#fff', marginTop: 8 }}>#1</div>
        </button>
        <button onClick={() => logVisit('2')}
          style={{ ...s.card, flex: 1, textAlign: 'center', cursor: 'pointer', padding: '20px 14px', transition: 'all 0.2s' }}>
          <div style={{ fontSize: 28 }}>🪵</div>
          <div style={{ fontSize: 13, fontWeight: 500, color: '#fff', marginTop: 8 }}>#2</div>
        </button>
      </div>

      {/* Optional note */}
      <div style={{ ...s.card, marginBottom: 14 }}>
        <input value={note} onChange={e => setNote(e.target.value)}
          placeholder="Optional note (color, consistency, etc.)"
          style={{ ...s.input, background: 'transparent', border: 'none', padding: '4px 0' }} />
      </div>

      {/* Recovery context */}
      <div style={{ ...s.card, borderLeft: '2px solid rgba(255,255,255,0.1)', borderRadius: '0 14px 14px 0', marginBottom: 14 }}>
        <div style={s.cardText}>
          <strong style={{ color: '#fff' }}>During recovery,</strong> your digestive system recalibrates as the endocannabinoid system
          stops receiving external input. THC affects gut motility — changes in frequency and consistency are completely normal
          as your body detoxes and your gut-brain axis rebalances.
        </div>
      </div>

      {/* Today's log */}
      {todayEntries.length > 0 && (
        <div style={{ marginBottom: 14 }}>
          <div style={s.label}>TODAY'S LOG</div>
          {todayEntries.map(e => (
            <div key={e.id} style={{ ...s.card, marginBottom: 6, display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px' }}>
              <span style={{ fontSize: 18 }}>{e.type === '1' ? '💧' : '🪵'}</span>
              <div style={{ flex: 1 }}>
                <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>#{e.type}</span>
                {e.note && <span style={{ fontSize: 12, ...s.dim, marginLeft: 8 }}>{e.note}</span>}
              </div>
              <span style={{ fontSize: 11, ...s.dim }}>{new Date(e.created_at || e.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          ))}
        </div>
      )}

      {/* History */}
      {dates.length > 1 && (
        <div>
          <div style={s.label}>HISTORY</div>
          {dates.slice(1).map(d => (
            <div key={d} style={{ ...s.card, marginBottom: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px' }}>
              <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>{new Date(d).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</span>
              <div style={{ display: 'flex', gap: 12 }}>
                <span style={{ fontSize: 13, ...s.dim }}>💧 {grouped[d].filter(e => e.type === '1').length}</span>
                <span style={{ fontSize: 13, ...s.dim }}>🪵 {grouped[d].filter(e => e.type === '2').length}</span>
                <span style={{ fontSize: 14, fontWeight: 500, color: '#fff' }}>{grouped[d].length}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ============================================================
// VISION BOARD
// ============================================================

function VisionPage({ images, setImages, onBack }) {
  const fileRef = useRef(null)

  const addImg = (e) => {
    const file = e.target.files[0]; if (!file) return
    const r = new FileReader()
    r.onload = ev => {
      const img = { url: ev.target.result, name: file.name }
      supabase.from('vision_images').insert(img).select().then(({ data }) => {
        const newImg = data?.[0] || { id: Date.now(), ...img }
        const u = [...images, newImg]; setImages(u); save('vision', u)
      })
    }
    r.readAsDataURL(file)
  }

  const delImg = (id) => {
    if (!confirm('Are you sure you want to remove this from your vision board?')) return
    supabase.from('vision_images').delete().eq('id', id).then(() => {})
    const u = images.filter(x => x.id !== id); setImages(u); save('vision', u)
  }

  const setAff = (id, text) => {
    const u = images.map(x => x.id === id ? { ...x, affirmation: text } : x); setImages(u); save('vision', u)
  }

  return (
    <div style={s.page}>
      <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', ...s.dim, fontSize: 12, paddingTop: 16, display: 'flex', alignItems: 'center', gap: 4 }}>
        <span style={{ transform: 'rotate(180deg)', display: 'inline-block' }}>{Icons.chevron}</span> Back
      </button>
      <div style={{ paddingTop: 12, marginBottom: 24 }}>
        <h1 style={s.greeting}>Vision board</h1>
        <p style={s.subtitle}>These images rotate throughout the app</p>
      </div>

      <div style={{ ...s.card, marginBottom: 14, borderLeft: '2px solid rgba(255,255,255,0.15)', borderRadius: '0 14px 14px 0' }}>
        <p style={{ fontSize: 12, fontStyle: 'italic', color: 'rgba(255,255,255,0.4)', lineHeight: 1.6 }}>
          "Dare to believe in the reality of your assumption and watch the world play its part."
        </p>
        <p style={{ fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', ...s.dim, marginTop: 8 }}>Neville Goddard</p>
      </div>

      <button onClick={() => fileRef.current?.click()}
        style={{ ...s.card, width: '100%', textAlign: 'center', cursor: 'pointer', padding: '32px 16px', marginBottom: 14, border: '1px dashed rgba(255,255,255,0.15)', transition: 'all 0.2s' }}>
        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>+ Add to your vision board</div>
        <div style={{ fontSize: 11, ...s.dim, marginTop: 6 }}>They'll gently rotate as your app background</div>
      </button>
      <input ref={fileRef} type="file" accept="image/*" onChange={addImg} style={{ display: 'none' }} />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {images.map(img => (
          <div key={img.id} style={{ ...s.card, padding: 0, overflow: 'hidden', position: 'relative' }}>
            <img src={img.url} alt="" style={{ width: '100%', height: 160, objectFit: 'cover', display: 'block' }} />
            <div style={{ padding: '10px 12px' }}>
              <input value={img.affirmation} onChange={e => setAff(img.id, e.target.value)}
                placeholder="Add an affirmation..." style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', background: 'none', border: 'none', outline: 'none', width: '100%', fontFamily: 'Inter' }} />
            </div>
            <button onClick={() => delImg(img.id)}
              style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(0,0,0,0.5)', border: 'none', borderRadius: 8, padding: '4px 6px', cursor: 'pointer', color: 'rgba(255,255,255,0.5)' }}>
              {Icons.trash}
            </button>
          </div>
        ))}
      </div>

      {!images.length && (
        <div style={{ textAlign: 'center', padding: '60px 0', ...s.dim }}>
          <p style={{ fontSize: 13 }}>Your vision board is empty</p>
          <p style={{ fontSize: 11, marginTop: 6, opacity: 0.6 }}>Add images of what you're manifesting</p>
        </div>
      )}
    </div>
  )
}

// ============================================================
// VISUALIZE
// ============================================================

function VisualizePage({ onBack }) {
  const [vizs, vizDb] = useSync('visualizations', 'visualizations')
  const [input, setInput] = useState('')
  const mic = useSpeech(setInput)

  const saveViz = () => {
    if (!input.trim()) return
    vizDb.add({ content: input, type: mic.listening ? 'spoken' : 'written' }); setInput('')
    mic.stop()
  }

  const delViz = (id) => {
    if (!confirm('Are you sure you want to delete this visualization?')) return
    vizDb.remove(id)
  }

  return (
    <div style={s.page}>
      <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', ...s.dim, fontSize: 12, paddingTop: 16, display: 'flex', alignItems: 'center', gap: 4 }}>
        <span style={{ transform: 'rotate(180deg)', display: 'inline-block' }}>{Icons.chevron}</span> Back
      </button>
      <div style={{ paddingTop: 12, marginBottom: 24 }}>
        <h1 style={s.greeting}>Visualize</h1>
        <p style={s.subtitle}>Live in the end — feel it real</p>
      </div>

      <div style={{ ...s.card, marginBottom: 14, padding: '24px 20px' }}>
        <div style={{ ...s.label, marginBottom: 12 }}>THE SATS TECHNIQUE</div>
        <div style={s.cardText}>
          Neville's "State Akin To Sleep" method: As you drift to sleep, create a short scene that implies your wish is fulfilled.
          Feel it as real. Loop it. The feeling is the secret — not the words, not the images, but the <em>feeling</em> of already having it.
          Write your scene below, or speak it aloud.
        </div>
      </div>

      <div style={{ ...s.card, marginBottom: 14 }}>
        <textarea value={input} onChange={e => setInput(e.target.value)} rows={5}
          placeholder="Write your visualization scene... present tense, as if it's already real. What do you see? How does it feel?"
          style={s.textarea} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
          <MicBtn listening={mic.listening} onPress={() => mic.toggle(input)} />
          <button onClick={saveViz} style={s.btnSecondary}>Save Scene</button>
        </div>
      </div>

      {vizs.map(v => (
        <div key={v.id} style={{ ...s.card, marginBottom: 8 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 10, ...s.dim }}>{v.type === 'spoken' ? '🎙' : '✎'}</span>
              <span style={{ fontSize: 10, ...s.dim }}>{fmtDate(v.created_at || v.date)}</span>
            </div>
            <button onClick={() => delViz(v.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.1)' }}>{Icons.trash}</button>
          </div>
          <div style={{ ...s.cardText, fontStyle: 'italic' }}>"{v.content || v.text}"</div>
        </div>
      ))}

      {!vizs.length && (
        <div style={{ textAlign: 'center', padding: '60px 0', ...s.dim }}>
          <p style={{ fontSize: 13 }}>Write your first visualization</p>
          <p style={{ fontSize: 11, marginTop: 6, opacity: 0.6 }}>"Assume the feeling of the wish fulfilled"</p>
        </div>
      )}
    </div>
  )
}

// ============================================================
// TIMER
// ============================================================

function TimerPage({ onBack }) {
  const [dur, setDur] = useState(10)
  const [rem, setRem] = useState(null)
  const [running, setRunning] = useState(false)
  const [sound, setSound] = useState(TIMER_SOUNDS[0])
  const [soundOn, setSoundOn] = useState(true)
  const intRef = useRef(null)

  const start = () => { setRem(dur * 60); setRunning(true); if (soundOn) ambient.start(sound.freq) }
  const pause = () => { setRunning(false); ambient.stop() }
  const reset = () => { setRunning(false); setRem(null); ambient.stop(); clearInterval(intRef.current) }

  useEffect(() => {
    if (!running || rem === null) return
    intRef.current = setInterval(() => {
      setRem(p => { if (p <= 1) { setRunning(false); ambient.stop(); return 0 } return p - 1 })
    }, 1000)
    return () => clearInterval(intRef.current)
  }, [running])

  useEffect(() => () => ambient.stop(), [])

  const m = rem !== null ? Math.floor(rem / 60) : dur
  const sc = rem !== null ? rem % 60 : 0
  const pct = rem !== null ? ((dur * 60 - rem) / (dur * 60)) * 100 : 0

  return (
    <div style={s.page}>
      <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', ...s.dim, fontSize: 12, paddingTop: 16, display: 'flex', alignItems: 'center', gap: 4 }}>
        <span style={{ transform: 'rotate(180deg)', display: 'inline-block' }}>{Icons.chevron}</span> Back
      </button>
      <div style={{ paddingTop: 12, marginBottom: 24 }}>
        <h1 style={s.greeting}>Meditation</h1>
        <p style={s.subtitle}>Enter the silence — SATS practice</p>
      </div>

      <div style={{ ...s.card, marginBottom: 14, borderLeft: '2px solid rgba(255,255,255,0.15)', borderRadius: '0 14px 14px 0' }}>
        <p style={{ fontSize: 12, fontStyle: 'italic', color: 'rgba(255,255,255,0.4)', lineHeight: 1.6 }}>
          "Go within and shut the door. In the silence, assume the feeling of the wish fulfilled."
        </p>
        <p style={{ fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', ...s.dim, marginTop: 8 }}>Neville Goddard</p>
      </div>

      <div style={{ ...s.card, textAlign: 'center', padding: '40px 16px', marginBottom: 14 }}>
        <div style={{ position: 'relative', width: 180, height: 180, margin: '0 auto 24px' }}>
          <svg viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)' }}>
            <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="3" />
            <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="3"
              strokeDasharray={`${pct * 2.83} ${283 - pct * 2.83}`} strokeLinecap="round" style={{ transition: 'all 1s' }} />
          </svg>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: 36, fontWeight: 300, color: '#fff', fontVariantNumeric: 'tabular-nums' }}>
              {String(m).padStart(2, '0')}:{String(sc).padStart(2, '0')}
            </span>
            {rem === 0 && <span style={{ fontSize: 11, ...s.dim, marginTop: 8 }}>Namaste</span>}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: 10 }}>
          {!running && rem === null && <button onClick={start} style={s.btnPrimary}>Begin</button>}
          {running && <button onClick={pause} style={s.btnSecondary}>Pause</button>}
          {!running && rem !== null && rem > 0 && <button onClick={() => { setRunning(true); if (soundOn) ambient.start(sound.freq) }} style={s.btnPrimary}>Resume</button>}
          {rem !== null && <button onClick={reset} style={s.btnSecondary}>Reset</button>}
        </div>
      </div>

      {rem === null && (
        <>
          <div style={s.label}>DURATION</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {[5, 10, 15, 20, 30, 45, 60].map(min => (
              <button key={min} onClick={() => setDur(min)} style={dur === min ? s.pillActive : s.pill}>{min}m</button>
            ))}
          </div>
        </>
      )}

      <div style={{ marginTop: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={s.label}>AMBIENT SOUND</div>
        <button onClick={() => { setSoundOn(!soundOn); if (soundOn) ambient.stop() }}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: soundOn ? '#fff' : 'rgba(255,255,255,0.2)' }}>
          {soundOn ? Icons.volume : Icons.mute}
        </button>
      </div>
      <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
        {TIMER_SOUNDS.map(snd => (
          <button key={snd.id} onClick={() => setSound(snd)} style={sound.id === snd.id ? s.pillActive : s.pill}>{snd.name}</button>
        ))}
      </div>
    </div>
  )
}

// ============================================================
// HEALTH
// ============================================================

function HealthPage({ onBack }) {
  const [logs, healthDb] = useSync('health_logs', 'healthlogs')
  const [mood, setMood] = useState(null)
  const [energy, setEnergy] = useState(null)
  const [sleep, setSleep] = useState('')
  const [hrv, setHrv] = useState('')
  const [rhr, setRhr] = useState('')
  const [steps, setSteps] = useState('')
  const [calories, setCalories] = useState('')
  const [notes, setNotes] = useState('')
  const mic = useSpeech(setNotes)

  const logIt = () => {
    healthDb.add({
      date: new Date().toISOString(), mood, energy,
      sleep: sleep ? parseFloat(sleep) : null,
      hrv: hrv ? parseInt(hrv) : null,
      rhr: rhr ? parseInt(rhr) : null,
      steps: steps ? parseInt(steps) : null,
      calories: calories ? parseInt(calories) : null,
      notes,
    })
    setMood(null); setEnergy(null); setSleep(''); setHrv(''); setRhr(''); setSteps(''); setCalories(''); setNotes('')
  }

  const moods = ['😔', '😐', '🙂', '😊', '🤩']
  const moodLabels = ['Low', 'Meh', 'Good', 'Great', 'Amazing']
  const energyLabels = ['Drained', 'Low', 'Steady', 'Energized', 'Electric']

  return (
    <div style={s.page}>
      <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', ...s.dim, fontSize: 12, paddingTop: 16, display: 'flex', alignItems: 'center', gap: 4 }}>
        <span style={{ transform: 'rotate(180deg)', display: 'inline-block' }}>{Icons.chevron}</span> Back
      </button>
      <div style={{ paddingTop: 12, marginBottom: 24 }}>
        <h1 style={s.greeting}>Health</h1>
        <p style={s.subtitle}>Track your body and mind</p>
      </div>

      {/* Spotify */}
      <div style={{ ...s.card, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ fontSize: 20 }}>{Icons.music}</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 500, color: '#fff' }}>Spotify</div>
          <div style={{ fontSize: 11, ...s.dim, marginTop: 2 }}>Connect saved episodes & playlists</div>
        </div>
        <button style={{ ...s.btnSecondary, fontSize: 11 }}>Connect</button>
      </div>

      {/* Check-in */}
      <div style={{ ...s.card, marginBottom: 14 }}>
        <div style={s.label}>DAILY CHECK-IN</div>

        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 12, ...s.mid, marginBottom: 8 }}>How are you feeling?</div>
          <div style={{ display: 'flex', gap: 8 }}>
            {moods.map((em, i) => (
              <button key={i} onClick={() => setMood(i + 1)}
                style={{ flex: 1, padding: '10px 0', borderRadius: 12, textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s',
                  background: mood === i + 1 ? 'rgba(255,255,255,0.08)' : '#1A1A1A',
                  border: mood === i + 1 ? '1px solid rgba(255,255,255,0.2)' : '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ fontSize: 20 }}>{em}</div>
                <div style={{ fontSize: 9, ...s.dim, marginTop: 4 }}>{moodLabels[i]}</div>
              </button>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 12, ...s.mid, marginBottom: 8 }}>Energy level?</div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {energyLabels.map((l, i) => (
              <button key={i} onClick={() => setEnergy(i + 1)} style={energy === i + 1 ? s.pillActive : s.pill}>{l}</button>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 12, ...s.mid, marginBottom: 8 }}>Hours of sleep</div>
          <input type="number" value={sleep} onChange={e => setSleep(e.target.value)} placeholder="7.5" step="0.5" style={s.input} />
        </div>
      </div>

      {/* Apple Health Data */}
      <div style={{ ...s.card, marginBottom: 14 }}>
        <div style={s.label}>APPLE HEALTH</div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
          <div>
            <div style={{ fontSize: 11, ...s.dim, marginBottom: 6 }}>HRV (ms)</div>
            <input type="number" value={hrv} onChange={e => setHrv(e.target.value)} placeholder="45" style={s.input} />
          </div>
          <div>
            <div style={{ fontSize: 11, ...s.dim, marginBottom: 6 }}>Resting HR</div>
            <input type="number" value={rhr} onChange={e => setRhr(e.target.value)} placeholder="62" style={s.input} />
          </div>
          <div>
            <div style={{ fontSize: 11, ...s.dim, marginBottom: 6 }}>Steps</div>
            <input type="number" value={steps} onChange={e => setSteps(e.target.value)} placeholder="8000" style={s.input} />
          </div>
          <div>
            <div style={{ fontSize: 11, ...s.dim, marginBottom: 6 }}>Active Cal</div>
            <input type="number" value={calories} onChange={e => setCalories(e.target.value)} placeholder="350" style={s.input} />
          </div>
        </div>

        <div style={{ fontSize: 10, ...s.dim, lineHeight: 1.5 }}>
          Enter from your Apple Watch or Health app. HRV improves as your nervous system recalibrates during recovery.
        </div>
      </div>

      {/* Notes */}
      <div style={{ ...s.card, marginBottom: 14 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <div style={{ fontSize: 12, ...s.mid }}>Notes</div>
          <MicBtn listening={mic.listening} onPress={() => mic.toggle(notes)} small />
        </div>
        <textarea value={notes} onChange={e => setNotes(e.target.value)}
          placeholder="How is your body feeling today?"
          rows={3} style={s.textarea} />
        <button onClick={logIt} style={{ ...s.btnPrimary, marginTop: 14 }}>Log Check-in</button>
      </div>

      {/* History */}
      {logs.length > 0 && (
        <>
          <div style={s.label}>RECENT</div>
          {logs.slice(0, 7).map(l => (
            <div key={l.id} style={{ ...s.card, marginBottom: 8, padding: '14px 16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <span style={{ fontSize: 18 }}>{moods[(l.mood || 1) - 1]}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, ...s.mid }}>{fmtDate(l.created_at || l.date)}</div>
                  <div style={{ fontSize: 9, ...s.dim }}>{energyLabels[(l.energy || 1) - 1]}</div>
                </div>
                {l.sleep && <div style={{ fontSize: 11, ...s.dim }}>{l.sleep}h sleep</div>}
              </div>
              {(l.hrv || l.rhr || l.steps || l.calories) && (
                <div style={{ display: 'flex', gap: 12, paddingTop: 8, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                  {l.hrv && <div><div style={{ fontSize: 13, fontWeight: 500, color: '#fff' }}>{l.hrv}</div><div style={{ fontSize: 9, ...s.dim }}>HRV</div></div>}
                  {l.rhr && <div><div style={{ fontSize: 13, fontWeight: 500, color: '#fff' }}>{l.rhr}</div><div style={{ fontSize: 9, ...s.dim }}>RHR</div></div>}
                  {l.steps && <div><div style={{ fontSize: 13, fontWeight: 500, color: '#fff' }}>{l.steps.toLocaleString()}</div><div style={{ fontSize: 9, ...s.dim }}>Steps</div></div>}
                  {l.calories && <div><div style={{ fontSize: 13, fontWeight: 500, color: '#fff' }}>{l.calories}</div><div style={{ fontSize: 9, ...s.dim }}>Cal</div></div>}
                </div>
              )}
              {l.notes && <div style={{ fontSize: 10, ...s.dim, marginTop: 6 }}>{l.notes}</div>}
            </div>
          ))}
        </>
      )}
    </div>
  )
}

// ============================================================
// PROGRESS PHOTOS — Daily Face & Body
// ============================================================

function ProgressPhotosPage({ onBack }) {
  const [photos, photosDb] = useSync('progress_photos', 'progress_photos')
  const [tab, setTab] = useState('face')
  const fileRef = useRef(null)

  const addPhoto = (e) => {
    const file = e.target.files[0]; if (!file) return
    const r = new FileReader()
    r.onload = ev => {
      const photo = { url: ev.target.result, date: new Date().toISOString(), type: tab }
      photosDb.add(photo)
    }
    r.readAsDataURL(file)
  }

  const delPhoto = (id) => {
    if (!confirm('Are you sure you want to delete this photo?')) return
    photosDb.remove(id)
  }

  const filtered = photos.filter(p => p.type === tab)
  const dayNum = Math.max(1, Math.ceil((Date.now() - QUIT_DATE) / 86400000))

  return (
    <div style={s.page}>
      {onBack && (
        <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', ...s.dim, fontSize: 12, paddingTop: 16, display: 'flex', alignItems: 'center', gap: 4 }}>
          <span style={{ transform: 'rotate(180deg)', display: 'inline-block' }}>{Icons.chevron}</span> Back
        </button>
      )}
      <div style={{ paddingTop: onBack ? 12 : 20, marginBottom: 24 }}>
        <h1 style={s.greeting}>Progress</h1>
        <p style={s.subtitle}>Day {dayNum} — watch yourself transform</p>
      </div>

      {/* Face / Body toggle */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
        <button onClick={() => setTab('face')} style={tab === 'face' ? s.pillActive : s.pill}>Face</button>
        <button onClick={() => setTab('body')} style={tab === 'body' ? s.pillActive : s.pill}>Body</button>
      </div>

      {/* Add photo */}
      <button onClick={() => fileRef.current?.click()}
        style={{ ...s.card, width: '100%', textAlign: 'center', cursor: 'pointer', padding: '28px 16px', marginBottom: 14,
          border: '1px dashed rgba(255,255,255,0.15)', transition: 'all 0.2s' }}>
        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>+ Add today's {tab} photo</div>
        <div style={{ fontSize: 11, ...s.dim, marginTop: 6 }}>Day {dayNum} of your journey</div>
      </button>
      <input ref={fileRef} type="file" accept="image/*" capture="user" onChange={addPhoto} style={{ display: 'none' }} />

      {/* Photo grid */}
      {filtered.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6 }}>
          {filtered.map(photo => (
            <div key={photo.id} style={{ position: 'relative', borderRadius: 10, overflow: 'hidden' }}>
              <img src={photo.url} alt="" style={{ width: '100%', aspectRatio: tab === 'face' ? '1' : '3/4', objectFit: 'cover', display: 'block' }} />
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(transparent, rgba(0,0,0,0.7))', padding: '16px 8px 6px' }}>
                <div style={{ fontSize: 10, fontWeight: 600, color: '#fff' }}>Day {photo.day || Math.max(1, Math.ceil((new Date(photo.created_at || photo.date) - QUIT_DATE) / 86400000))}</div>
                <div style={{ fontSize: 8, color: 'rgba(255,255,255,0.5)' }}>{fmtDate(photo.created_at || photo.date)}</div>
              </div>
              <button onClick={() => delPhoto(photo.id)}
                style={{ position: 'absolute', top: 4, right: 4, background: 'rgba(0,0,0,0.5)', border: 'none', borderRadius: 6, padding: '3px 5px', cursor: 'pointer', color: 'rgba(255,255,255,0.4)' }}>
                {Icons.trash}
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '60px 0', ...s.dim }}>
          <p style={{ fontSize: 13 }}>No {tab} photos yet</p>
          <p style={{ fontSize: 11, marginTop: 6, opacity: 0.6 }}>Take your first photo to start tracking your transformation</p>
        </div>
      )}

      {/* Side by side comparison */}
      {filtered.length >= 2 && (
        <>
          <div style={{ ...s.label, marginTop: 24 }}>FIRST vs LATEST</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <div style={{ position: 'relative', borderRadius: 10, overflow: 'hidden' }}>
              <img src={filtered[filtered.length - 1].url} alt="" style={{ width: '100%', aspectRatio: tab === 'face' ? '1' : '3/4', objectFit: 'cover', display: 'block' }} />
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(transparent, rgba(0,0,0,0.7))', padding: '12px 8px 6px', textAlign: 'center' }}>
                <div style={{ fontSize: 10, fontWeight: 600, color: '#fff' }}>Day {filtered[filtered.length - 1].day}</div>
              </div>
            </div>
            <div style={{ position: 'relative', borderRadius: 10, overflow: 'hidden' }}>
              <img src={filtered[0].url} alt="" style={{ width: '100%', aspectRatio: tab === 'face' ? '1' : '3/4', objectFit: 'cover', display: 'block' }} />
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(transparent, rgba(0,0,0,0.7))', padding: '12px 8px 6px', textAlign: 'center' }}>
                <div style={{ fontSize: 10, fontWeight: 600, color: '#fff' }}>Day {filtered[0].day}</div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

// ============================================================
// WORK TIMER — Start/Stop Focus Sessions
// ============================================================

function WorkTasksPage() {
  const [tasks, tasksDb] = useSync('work_tasks', 'work_tasks')
  const [input, setInput] = useState('')
  const mic = useSpeech(setInput)
  const today = new Date().toDateString()

  const addTask = () => {
    if (!input.trim()) return
    mic.stop()
    tasksDb.add({ text: input.trim(), done: false })
    setInput('')
  }

  const toggle = (id) => {
    const t = tasks.find(x => x.id === id)
    if (t) tasksDb.update(id, { done: !t.done, completed_at: !t.done ? new Date().toISOString() : null })
  }

  const remove = (id) => {
    if (!confirm('Are you sure?')) return
    tasksDb.remove(id)
  }

  const clearDone = () => {
    if (!confirm('Clear all completed tasks?')) return
    tasks.filter(t => t.done).forEach(t => tasksDb.remove(t.id))
  }

  const active = tasks.filter(t => !t.done)
  const done = tasks.filter(t => t.done)
  const todayDone = done.filter(t => new Date(t.completed_at || t.created_at || t.date).toDateString() === today)

  return (
    <div style={s.page}>
      <div style={{ paddingTop: 20, marginBottom: 28 }}>
        <h1 style={s.greeting}>Work</h1>
        <p style={s.subtitle}>Get it done, check it off</p>
      </div>

      {/* Add task */}
      <div style={{ ...s.card, marginBottom: 14 }}>
        <div style={{ display: 'flex', gap: 8 }}>
          <input value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addTask()}
            placeholder="Add a work task..." style={{ ...s.input, flex: 1 }} />
          <MicBtn listening={mic.listening} onPress={() => mic.toggle(input)} small />
          <button onClick={addTask} style={{ ...s.btnSecondary, padding: '14px 20px', fontSize: 16, flexShrink: 0 }}>Add</button>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 14 }}>
        <div style={{ ...s.card, textAlign: 'center', padding: '16px 12px' }}>
          <div style={{ fontSize: 28, fontWeight: 200, color: '#fff' }}>{active.length}</div>
          <div style={{ fontSize: 12, ...s.dim, marginTop: 4 }}>To Do</div>
        </div>
        <div style={{ ...s.card, textAlign: 'center', padding: '16px 12px' }}>
          <div style={{ fontSize: 28, fontWeight: 200, color: '#fff' }}>{todayDone.length}</div>
          <div style={{ fontSize: 12, ...s.dim, marginTop: 4 }}>Done Today</div>
        </div>
        <div style={{ ...s.card, textAlign: 'center', padding: '16px 12px' }}>
          <div style={{ fontSize: 28, fontWeight: 200, color: '#fff' }}>{done.length}</div>
          <div style={{ fontSize: 12, ...s.dim, marginTop: 4 }}>All Time</div>
        </div>
      </div>

      {/* Active tasks */}
      {active.length > 0 && (
        <div style={{ marginBottom: 14 }}>
          <div style={s.label}>TO DO</div>
          {active.map(t => (
            <div key={t.id} style={{ ...s.card, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 14, padding: '16px 18px' }}>
              <button onClick={() => toggle(t.id)}
                style={{ width: 26, height: 26, borderRadius: 8, border: '2px solid rgba(255,255,255,0.15)',
                  background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }} />
              <span style={{ fontSize: 16, color: 'rgba(255,255,255,0.8)', flex: 1 }}>{t.text}</span>
              <button onClick={() => remove(t.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.1)', flexShrink: 0 }}>
                {Icons.trash}
              </button>
            </div>
          ))}
        </div>
      )}

      {active.length === 0 && (
        <div style={{ ...s.card, textAlign: 'center', padding: '40px 20px', marginBottom: 14 }}>
          <span style={{ fontSize: 36 }}>✓</span>
          <p style={{ fontSize: 16, color: '#fff', marginTop: 12 }}>All clear</p>
          <p style={{ fontSize: 14, ...s.dim, marginTop: 6 }}>Add work tasks above</p>
        </div>
      )}

      {/* Completed */}
      {done.length > 0 && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div style={s.label}>COMPLETED</div>
            <button onClick={clearDone} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, color: 'rgba(255,255,255,0.2)' }}>Clear all</button>
          </div>
          {done.slice(0, 20).map(t => (
            <div key={t.id} style={{ ...s.card, marginBottom: 6, display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px', opacity: 0.5 }}>
              <button onClick={() => toggle(t.id)}
                style={{ width: 26, height: 26, borderRadius: 8, border: '2px solid rgba(255,255,255,0.15)',
                  background: 'rgba(255,255,255,0.08)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ color: '#fff', fontSize: 13 }}>✓</span>
              </button>
              <span style={{ fontSize: 15, color: 'rgba(255,255,255,0.4)', textDecoration: 'line-through', flex: 1 }}>{t.text}</span>
              <span style={{ fontSize: 11, ...s.dim }}>{fmtDate(t.completed_at || t.created_at || t.date)}</span>
            </div>
          ))}
        </div>
      )}

      <div style={{ ...s.card, marginTop: 14, borderLeft: '2px solid rgba(255,255,255,0.15)', borderRadius: '0 16px 16px 0' }}>
        <p style={{ fontSize: 14, fontStyle: 'italic', color: 'rgba(255,255,255,0.4)', lineHeight: 1.7 }}>
          "An awakened imagination works with a purpose. It creates and conserves the desirable."
        </p>
        <p style={{ fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', ...s.dim, marginTop: 8 }}>Neville Goddard</p>
      </div>
    </div>
  )
}

// ============================================================
// TASKS PAGE
// ============================================================

function TasksPage({ onBack }) {
  const [tasks, tasksDb] = useSync('tasks', 'tasks')
  const [input, setInput] = useState('')
  const [filter, setFilter] = useState('active')
  const mic = useSpeech(setInput)

  const addTask = () => {
    if (!input.trim()) return
    tasksDb.add({ text: input.trim(), done: false }); setInput('')
  }

  const toggle = (id) => {
    const task = tasks.find(t => t.id === id)
    if (!task) return
    tasksDb.update(id, { done: !task.done, completed_at: !task.done ? new Date().toISOString() : null })
  }

  const remove = (id) => {
    tasksDb.remove(id)
  }

  const filtered = filter === 'all' ? tasks : filter === 'active' ? tasks.filter(t => !t.done) : tasks.filter(t => t.done)
  const activeCount = tasks.filter(t => !t.done).length
  const doneCount = tasks.filter(t => t.done).length

  return (
    <div style={s.page}>
      <div style={{ paddingTop: 20, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#fff', opacity: 0.5 }}>
          {Icons.back}
        </button>
        <div>
          <h1 style={s.greeting}>Tasks</h1>
          <p style={s.subtitle}>{activeCount} remaining · {doneCount} completed</p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <input value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addTask()}
          placeholder="What needs to be done?"
          style={{ ...s.input, flex: 1 }} />
        <MicBtn listening={mic.listening} onPress={() => mic.toggle(input)} small />
        <button onClick={addTask}
          style={{ ...s.btnSecondary, padding: '14px 20px', fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap' }}>
          Add
        </button>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {['active', 'completed', 'all'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            style={filter === f ? s.pillActive : s.pill}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {filtered.length === 0 && (
        <div style={{ ...s.card, textAlign: 'center', padding: '40px 20px' }}>
          <div style={{ fontSize: 28, marginBottom: 12 }}>{filter === 'completed' ? '✨' : '📋'}</div>
          <p style={{ fontSize: 13, ...s.dim }}>
            {filter === 'completed' ? 'Nothing completed yet — keep going' : filter === 'active' ? 'All clear — you crushed it' : 'Add your first task'}
          </p>
        </div>
      )}

      {filtered.map(task => (
        <motion.div key={task.id}
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          style={{ ...s.card, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={() => toggle(task.id)}
            style={{ width: 22, height: 22, borderRadius: '50%', border: task.done ? '2px solid rgba(255,255,255,0.3)' : '2px solid rgba(255,255,255,0.15)',
              background: task.done ? 'rgba(255,255,255,0.1)' : 'transparent', cursor: 'pointer', flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}>
            {task.done && <span style={{ fontSize: 10, color: '#fff' }}>✓</span>}
          </button>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 400, color: task.done ? 'rgba(255,255,255,0.3)' : '#fff',
              textDecoration: task.done ? 'line-through' : 'none', transition: 'all 0.2s' }}>
              {task.text}
            </div>
            <div style={{ fontSize: 10, ...s.dim, marginTop: 3 }}>
              {task.done ? `Done ${fmtDate(task.completed_at || task.completed)}` : fmtDate(task.created_at || task.created)}
            </div>
          </div>
          <button onClick={() => remove(task.id)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.2)', fontSize: 16, padding: '4px 8px', transition: 'all 0.2s' }}>
            ×
          </button>
        </motion.div>
      ))}

      <div style={{ textAlign: 'center', marginTop: 24, marginBottom: 100 }}>
        <p style={{ fontSize: 11, ...s.dim, fontStyle: 'italic', lineHeight: 1.6 }}>
          "{NEVILLE_QUOTES[Math.floor(Date.now() / 86400000) % NEVILLE_QUOTES.length]}"
        </p>
      </div>
    </div>
  )
}

// ============================================================
// DAILY READINGS — Bob Proctor, Wayne Dyer, Neville Goddard
// ============================================================

const TEACHINGS = [
  { day: 1, teacher: 'Neville Goddard', title: 'The Law of Assumption', text: 'Everything begins with an assumption. When you assume the feeling of your wish fulfilled — not hoping, not wishing, but actually feeling yourself INTO the state — you set the creative power of your consciousness in motion.\n\nNeville taught that your imagination is God. Not a metaphor. The actual creative force of the universe lives in your ability to imagine and FEEL a scene as though it were real.\n\nToday\'s practice: Close your eyes. Pick one thing you desire. Now feel yourself already having it. Not getting it someday — HAVING it. What does the room look like? Who congratulates you? What do your hands touch? Stay in that feeling for as long as you can. That feeling IS the prayer.' },
  { day: 2, teacher: 'Bob Proctor', title: 'The Terror Barrier', text: 'Bob Proctor spent 60 years studying why people stay stuck. He discovered something he called the Terror Barrier — the invisible wall between your current life and the life you want.\n\nHere\'s how it works: You get an idea. You get excited. You start moving toward it. Then fear hits. Your body floods with anxiety. Every cell screams "GO BACK TO WHAT\'S FAMILIAR." Most people retreat. They rationalize. They say "it wasn\'t meant to be."\n\nBut the terror barrier is not a stop sign. It\'s a GATE. The people who push through it — despite shaking hands, despite doubt, despite the voice saying "who do you think you are?" — they\'re the ones whose lives change.\n\nToday\'s practice: What is one thing you\'ve been avoiding because it scares you? Name it. Now ask: what would the version of me who already achieved this do RIGHT NOW?' },
  { day: 3, teacher: 'Wayne Dyer', title: 'You Are Not Your Body', text: 'Wayne Dyer loved to ask his audiences: "Who is it that\'s aware that you\'re thinking?" That question is a key that unlocks everything.\n\nYou have thoughts, but you are not your thoughts. You have a body, but you are not your body. You have emotions, but you are not your emotions. You are the OBSERVER. The infinite awareness behind all of it.\n\nWhen you identify with the observer — the silent witness — you stop being tossed around by every craving, every fear, every mood swing. You realize that the craving is just weather. It passes through. But YOU remain.\n\nToday\'s practice: Sit quietly for 5 minutes. Don\'t try to stop your thoughts. Just watch them. Notice: "There\'s a thought about food. There\'s a thought about tomorrow. There\'s a craving." Don\'t judge them. Just notice. The one who notices is the real you.' },
  { day: 4, teacher: 'Neville Goddard', title: 'Everyone Is You Pushed Out', text: 'This is one of Neville\'s most powerful — and most misunderstood — teachings. "The world is yourself pushed out." Every person in your life is reflecting back your own assumptions about them.\n\nIf you assume someone is against you, you will find evidence everywhere. If you assume they support you, they will begin to. This isn\'t about controlling people — it\'s about recognizing that your inner state creates your outer experience.\n\nThe people who frustrate you are showing you beliefs you hold about yourself. The people who inspire you are showing you who you already are inside.\n\nToday\'s practice: Think of someone who bothers you. Now ask: "What belief about MYSELF is this person reflecting?" Write it down. Then revise it. Imagine that person being kind, supportive, wonderful to you. Hold that image. Watch what happens.' },
  { day: 5, teacher: 'Bob Proctor', title: 'Paradigms', text: 'Bob Proctor\'s life work centered on one word: PARADIGM. A paradigm is a multitude of habits — most of which you didn\'t choose. They were installed in you before age 7 by parents, teachers, television, environment.\n\nYour paradigm controls everything: how much money you earn, who you attract, how you feel about yourself, what you eat, whether you exercise, whether you reach for a substance when stressed.\n\nHere\'s the truth that changes everything: your paradigm is just PROGRAMMING. And programs can be changed. Not by willpower alone — willpower is conscious, and paradigms live in the subconscious. You change them through REPETITION of new ideas.\n\nThis is why you\'re here. Every day you don\'t smoke, every gratitude entry, every visualization — you are literally reprogramming your paradigm.\n\nToday\'s practice: Write down 3 beliefs about yourself that you KNOW were given to you by someone else. Then write the belief you want to replace each one with. Read the new beliefs aloud, with feeling, morning and night.' },
  { day: 6, teacher: 'Wayne Dyer', title: 'The Power of Intention', text: 'Wayne Dyer redefined intention. Most people think intention means "I\'m going to try really hard." Wayne said no — intention is a FORCE in the universe, like gravity. You don\'t try to use gravity. You align with it.\n\nIntention has qualities: creativity, kindness, love, beauty, expansion, abundance, receptivity. When you align with these qualities, you tap into the force of intention. When you\'re angry, fearful, judgmental — you disconnect from it.\n\nYour job isn\'t to MAKE things happen. Your job is to get yourself into alignment with the force that makes everything happen. Stop pushing. Start aligning.\n\nToday\'s practice: Before every decision today, pause and ask: "Is this moving me toward expansion or contraction? Toward love or fear?" Choose expansion every time.' },
  { day: 7, teacher: 'Neville Goddard', title: 'Revision', text: 'Revision is one of Neville\'s most practical techniques. At the end of each day, replay any event that didn\'t go the way you wanted — but revise it. Change the ending. See the conversation going perfectly. See yourself responding with confidence. See the outcome you wished had happened.\n\nThis isn\'t denial. It\'s creative intervention. When you revise a memory, you are literally rewriting the neural pathway associated with that event. Neuroscience has since confirmed this: recalled memories are RECONSTRUCTED, not replayed. Every time you recall something, you can change it.\n\nYou\'re not lying to yourself. You\'re choosing which version of reality your subconscious builds upon.\n\nToday\'s practice: Before sleep tonight, take the one thing that bothered you most today. Replay it in your mind, but change it. See it going perfectly. Feel the relief. Fall asleep in that revised state.' },
  { day: 8, teacher: 'Bob Proctor', title: 'You Were Born Rich', text: 'The title of Bob\'s most famous book is "You Were Born Rich." Not "you can become rich" — you were BORN rich. The wealth, the health, the love, the creativity — it\'s already inside you. It was never missing.\n\nWhat happened is that layers of conditioning covered it up. Like a diamond buried under mud. The diamond doesn\'t need to be created. It needs to be uncovered.\n\nEvery craving you resist, every morning you show up for yourself, every visualization you do — you\'re not building something new. You\'re removing what was never yours to begin with. The doubt. The numbness. The habits that kept you small.\n\nToday\'s practice: Finish this sentence 10 times, each with a different answer: "I was born with the ability to _______." Don\'t think too hard. Let it flow.' },
  { day: 9, teacher: 'Wayne Dyer', title: 'When You Change the Way You Look at Things', text: '"When you change the way you look at things, the things you look at change." This is Wayne Dyer\'s most quoted line, and it\'s based on quantum physics.\n\nThe observer effect in physics shows that the act of observation literally changes what\'s being observed. Wayne extended this to life: your perception isn\'t passive. It\'s creative. How you see the world actively shapes the world you see.\n\nLook at your recovery as punishment? It feels like prison.\nLook at your recovery as liberation? It feels like flying.\nThe facts haven\'t changed. Your LENS changed. And the lens is everything.\n\nToday\'s practice: Take your biggest current struggle. Write down 3 ways it\'s actually serving you. Not might serve you someday — is serving you RIGHT NOW. Change the lens.' },
  { day: 10, teacher: 'Neville Goddard', title: 'The Sabbath', text: 'Neville taught about the Sabbath — not as a day of the week, but as a STATE of consciousness. The Sabbath is the feeling of "it is done." It\'s when you stop trying, stop pushing, stop worrying about HOW your desire will manifest.\n\nWhen you plant a seed, you don\'t dig it up every hour to check if it\'s growing. You water it, give it light, and TRUST. The Sabbath is that trust.\n\nMost people fail at manifestation not because they don\'t imagine well enough — but because they can\'t REST afterward. They keep checking. Keep doubting. Keep looking for evidence. And that frantic energy actually pushes the desire away.\n\nToday\'s practice: Think of something you\'ve been wanting. Imagine it fulfilled one more time, vividly, with feeling. Then say to yourself: "It is done." And for the rest of today, refuse to think about HOW it will happen. Let go completely.' },
  { day: 11, teacher: 'Bob Proctor', title: 'The Stick Person', text: 'Bob Proctor used a simple drawing he called the Stick Person to explain the mind. The top half is the CONSCIOUS mind — where you think, analyze, choose. The bottom half is the SUBCONSCIOUS mind — where your habits, beliefs, and paradigms live. Below that is the BODY — which acts out whatever the subconscious tells it to.\n\nHere\'s the key: information enters through the conscious mind, but it doesn\'t change behavior until it reaches the subconscious. This is why you can KNOW something is bad for you and still do it. Knowing is conscious. Doing is subconscious.\n\nThe bridge between knowing and doing is REPETITION and EMOTION. When you repeat a new idea with intense feeling, it sinks from conscious to subconscious. That\'s when behavior changes automatically.\n\nToday\'s practice: Choose one affirmation. Something you want to believe about yourself. Say it 50 times today — not mindlessly, but FEELING each repetition. This is the work of reprogramming.' },
  { day: 12, teacher: 'Wayne Dyer', title: 'There Are No Justified Resentments', text: 'Wayne Dyer was fierce about this one: "There are no justified resentments." Not some resentments. Not the small ones. ALL of them.\n\nResentment is a poison you drink hoping the other person dies. It doesn\'t affect them at all. It only destroys your peace, your health, your energy. It keeps you tethered to the past — the exact opposite of the freedom you\'re building.\n\n"But they hurt me." Yes. And carrying the resentment hurts you again, every single day. Forgiveness isn\'t saying what happened was okay. It\'s saying: "I refuse to let this steal one more moment of my life."\n\nToday\'s practice: Think of someone you resent. Write their name down. Then write: "I release you. I free myself." Feel the weight leave your body. You don\'t have to mean it perfectly yet. Just begin.' },
  { day: 13, teacher: 'Neville Goddard', title: 'States of Consciousness', text: 'Neville taught that there are infinite "states" of consciousness — and you are always occupying one. The state of wealth. The state of poverty. The state of health. The state of sickness. The state of being loved. The state of loneliness.\n\nA state is not something you DO — it\'s something you WEAR. Like a garment. And you can change your garment at any time. You don\'t have to earn the right to feel abundant. You just step into that state and stay there.\n\nThe mistake people make is thinking they need to change their CIRCUMSTANCES to change their state. Neville said it\'s the reverse. Change your STATE and your circumstances must rearrange to match.\n\nToday\'s practice: Right now, identify the state you\'re currently in. Name it honestly. Now choose the state you want to occupy. Don\'t wait for permission. Step into it. Walk, talk, think, and feel AS IF you are already there.' },
  { day: 14, teacher: 'Bob Proctor', title: 'Worthy of the Goal', text: 'Bob Proctor would ask his students to set a goal that terrified them. Then he\'d say something that stopped them cold: "Do you believe you\'re WORTHY of this goal?"\n\nMost people\'s honest answer is no. And that unworthiness is the paradigm that keeps the goal at arm\'s length forever. You can visualize all day, but if deep down you believe you don\'t deserve it, your subconscious will sabotage every opportunity.\n\nUnworthiness is not truth. It\'s programming. A child isn\'t born feeling unworthy. That was installed. Which means it can be uninstalled.\n\nToday\'s practice: Write your biggest dream at the top of a page. Below it write: "I am worthy of this because:" and list 10 reasons. They don\'t have to be achievements. "Because I exist" is enough. "Because I decided to change" is enough. You ARE enough.' },
  { day: 15, teacher: 'Wayne Dyer', title: 'Be the Change', text: 'Wayne loved the Gandhi quote: "Be the change you wish to see in the world." But he took it deeper. He said most people try to change the world first, then hope they\'ll feel different inside. It\'s backwards.\n\nYou cannot give what you don\'t have. You cannot create peace around you while there\'s war inside you. You cannot inspire health while your own body is neglected. You cannot attract abundance while radiating scarcity.\n\nYour recovery — this daily practice of showing up, of choosing yourself, of doing the hard thing — is not selfish. It\'s the most generous thing you can do. Because every time you heal yourself, you give everyone around you permission to heal too.\n\nToday\'s practice: Instead of trying to fix anything outside of you today, focus entirely on your inner state. Meditate. Move your body. Eat something beautiful. Speak kindly to yourself. Watch how the world responds.' },
  { day: 16, teacher: 'Neville Goddard', title: 'The Bridge of Incidents', text: 'After you assume the feeling of the wish fulfilled and enter the Sabbath — the state of "it is done" — something begins to happen. Neville called it the Bridge of Incidents.\n\nEvents will unfold that move you toward your desire. But they may not look like what you expected. A seemingly random conversation. A "wrong" turn. A delay that puts you in the right place at the right time. A setback that redirects you to something better.\n\nYour job is NOT to engineer the bridge. Your job is to stay faithful to the end result and TRUST the process. The bridge will look different than you imagined. Let it.\n\nToday\'s practice: Look back at your life. Find one time when something "bad" happened that led to something wonderful. Write it down. That was a bridge of incidents. Trust that bridges are being built for you right now.' },
  { day: 17, teacher: 'Bob Proctor', title: 'Vibration and Frequency', text: 'Everything in the universe vibrates. Your thoughts vibrate. Your feelings vibrate. Your body vibrates. Bob Proctor taught that you are a walking transmission tower — constantly broadcasting a frequency.\n\nThe frequency you broadcast determines what you attract. Like attracts like. A tuning fork at 440 Hz will make another 440 Hz fork vibrate across the room. Your dominant vibration does the same thing with people, circumstances, and opportunities.\n\nWhen you were numbing yourself, you were broadcasting a low, dampened frequency. Now that you\'re clearing out — your signal is getting stronger, clearer, more powerful. You\'re literally becoming a magnet for different things.\n\nToday\'s practice: Pay attention to how you FEEL throughout the day. Your feelings are your vibration indicator. When you notice yourself feeling low, don\'t judge it — just consciously shift. Put on music that lifts you. Move your body. Think of someone you love. Raise the signal.' },
  { day: 18, teacher: 'Wayne Dyer', title: 'Your Life Is a Dream', text: 'Wayne Dyer often quoted the Aboriginal proverb: "We are all visitors to this time, this place. We are just passing through. Our purpose here is to observe, to learn, to grow, to love — and then we return home."\n\nWhen you zoom out far enough, this entire life is one brief dream. The things that feel so heavy — the struggles, the cravings, the fears — they\'re temporary weather in an eternal sky.\n\nThis isn\'t about dismissing your pain. It\'s about perspective. When you know you\'re eternal, the small self — the one that craves, the one that doubts, the one that fears — loses its grip. You can hold your struggles gently instead of being crushed by them.\n\nToday\'s practice: Imagine yourself at the end of your life, looking back at today. What would that future you say about this moment? About your courage? About the path you\'re walking? Write a letter from your 90-year-old self to you today.' },
  { day: 19, teacher: 'Neville Goddard', title: 'Feeling Is the Secret', text: 'The title of Neville\'s shortest and most powerful book: "Feeling Is the Secret." Not thinking. Not affirming. Not vision boarding. FEELING.\n\nYou can say "I am wealthy" a thousand times, but if you FEEL broke, broke is what you\'ll experience. The subconscious mind doesn\'t respond to words. It responds to the feeling behind the words.\n\nThis is why Neville emphasized the state akin to sleep — that drowsy, relaxed state right before you fall asleep. In that state, the conscious mind\'s defenses are down, and feelings are imprinted directly into the subconscious. This is your SATS practice.\n\nToday\'s practice: Tonight, as you drift to sleep, don\'t just visualize — FEEL. Feel the sheets of the bed in your dream home. Feel the handshake of celebration. Feel the tears of joy. Let the feeling be so real that you can\'t tell the difference between imagination and memory.' },
  { day: 20, teacher: 'Bob Proctor', title: 'The Knowing-Doing Gap', text: 'Bob Proctor pointed out something obvious that everyone ignores: billions of people KNOW what to do. They know to eat well, exercise, save money, be kind, follow their dreams. And yet most don\'t do it.\n\nThe gap between knowing and doing is the most expensive real estate in the world. Your entire life is determined by that gap.\n\nWhat bridges the gap? Not more information. Not another book. Not another YouTube video. The bridge is DECISION — true decision, which comes from the Latin "decidere," meaning to CUT OFF. When you truly decide, you cut off every other possibility. There\'s no plan B. There\'s no "I\'ll try."\n\nYou decided to quit. That\'s a real decision. Now protect that decision with everything you have.\n\nToday\'s practice: Make one decision you\'ve been postponing. Not a goal, not a wish — a DECISION. Write it as "I have decided to _______." Feel the finality of it. Cut off the alternative.' },
  { day: 21, teacher: 'Wayne Dyer', title: 'Don\'t Die with Your Music Still in You', text: '"Don\'t die with your music still in you." Wayne Dyer said this was the most important sentence he ever spoke.\n\nInside you is a song that only you can sing. A contribution that only you can make. A life that only you can live. Every moment you spend numbing, hiding, playing small — that music stays trapped.\n\nRecovery isn\'t just about stopping something. It\'s about STARTING something. What is the thing you came here to do? What lights you up so much that time disappears? What would you do every day if money didn\'t exist?\n\nThat thing — whatever it is — the world needs it. And the clearer your mind gets, the louder that music becomes.\n\nToday\'s practice: Write down 5 things that make you lose track of time. Not guilty pleasures — things that make you feel ALIVE. These are clues to your music. Follow them.' },
  { day: 22, teacher: 'Neville Goddard', title: 'The Promise', text: 'Late in his life, Neville spoke less about manifestation and more about what he called "The Promise." He taught that all of creation — every struggle, every joy, every dark night — is God experiencing itself through you.\n\nYou are not a human trying to become spiritual. You are spirit having a human experience. And the whole point of the experience is AWAKENING — realizing who you really are.\n\nYour recovery is part of this awakening. The fog lifting. The dreams returning. The feelings deepening. You\'re not just getting clean — you\'re waking up.\n\nToday\'s practice: Today, look at everything through the lens of awakening. The discomfort is awakening. The clarity is awakening. The tears are awakening. You are not broken and being fixed. You are asleep and waking up.' },
  { day: 23, teacher: 'Bob Proctor', title: 'Think and Grow Rich Decoded', text: 'Bob spent his life teaching the principles from Napoleon Hill\'s "Think and Grow Rich." The book\'s real secret, Bob said, isn\'t about money at all. It\'s about the creative power of THOUGHT.\n\nThought → Feeling → Action → Result. That\'s the chain. And it ALWAYS starts with thought. Not circumstance. Not luck. Not other people. Thought.\n\nThe thoughts you habitually think become feelings. Those feelings drive your actions. Those actions produce results. And those results reinforce the original thoughts. It\'s a cycle — and right now, you\'re building a NEW cycle.\n\nEvery time you resist a craving, you break the old cycle. Every time you visualize, you plant new thoughts. Every time you practice gratitude, you generate new feelings. The cycle is turning.\n\nToday\'s practice: Catch your first 3 thoughts tomorrow morning. Write them down. Are they building the life you want? If not, consciously replace them. This is where everything starts.' },
  { day: 24, teacher: 'Wayne Dyer', title: 'There Is a Spiritual Solution to Every Problem', text: 'Wayne Dyer wrote an entire book with this title. His premise: every problem exists at a certain frequency. The solution exists at a HIGHER frequency. You can\'t solve a problem at the level of consciousness that created it.\n\nFrustration, anger, fear — these are low-frequency states. They can identify problems, but they can\'t solve them. The solutions live in love, peace, gratitude, surrender.\n\nThis doesn\'t mean ignoring problems. It means ELEVATING yourself before addressing them. Handle the crisis from peace, not panic. Make the decision from love, not fear. The answer you find at a higher frequency will be fundamentally different — and better — than the one you\'d find while stressed.\n\nToday\'s practice: Take your current biggest problem. Instead of trying to solve it, spend 10 minutes in meditation or deep breathing first. Then revisit the problem from that calmer state. Notice how different the answers feel.' },
  { day: 25, teacher: 'Neville Goddard', title: 'The Pruning Shears of Revision', text: 'Neville returned to the practice of Revision again and again because he considered it the single most powerful technique available to humans.\n\nEvery night, you have the opportunity to prune your life like a gardener prunes a tree. Cut away what didn\'t serve you. Reshape what happened. Plant seeds of what you want to grow.\n\nA student once asked Neville: "How long should I practice revision?" He answered: "Until it is so natural that you revise every unlovely thought the moment it occurs — not just at night, but in real time."\n\nImagine having that skill. Something goes wrong, and INSTANTLY you revise it in your mind. Someone says something hurtful, and you immediately replay it with love. That\'s mastery.\n\nToday\'s practice: Practice real-time revision. The next time something happens today that bothers you — even something tiny — immediately replay it in your mind the way you wish it had gone. Don\'t wait until tonight. Revise on the spot.' },
  { day: 26, teacher: 'Bob Proctor', title: 'Multiple Sources of Income', text: 'Bob Proctor taught that having a single source of income is one of the most dangerous financial positions you can be in. Not because of greed — but because dependence on one source creates fear, and fear lowers your vibration.\n\nBut this teaching goes deeper than money. Bob was really talking about CREATIVITY. Every person has multiple gifts, multiple interests, multiple ways they can serve the world. When you only express one, you\'re leaving potential on the table.\n\nYour recovery is unlocking parts of yourself that were dormant. Skills, passions, ideas — they\'re all coming back online as your brain heals. Don\'t ignore them. Explore them.\n\nToday\'s practice: Make a list of everything you\'re good at — not just professional skills, but things people come to you for. Advice? Creativity? Organizing? Support? Each one is a seed that could grow into something beautiful.' },
  { day: 27, teacher: 'Wayne Dyer', title: 'The Tao', text: 'Wayne Dyer spent the last decade of his life immersed in the Tao Te Ching — the ancient Chinese text by Lao Tzu. He wrote an entire book translating it for modern life.\n\nThe core message of the Tao: stop forcing. The river doesn\'t try to flow. The flower doesn\'t try to bloom. The sun doesn\'t try to shine. Everything in nature fulfills its purpose without effort, without straining, without anxiety.\n\nYou are part of nature. And yet you\'ve been taught to push, grind, hustle, force. Wayne said: "In the Tao, doing nothing is actually doing everything — because you\'re allowing the intelligence of the universe to flow through you unobstructed."\n\nToday\'s practice: Find one area where you\'ve been forcing. Relationships. Career. Health. Recovery. Whatever it is — soften. Not give up — soften. Let it breathe. Trust the process. Be like water.' },
  { day: 28, teacher: 'Neville Goddard', title: 'Live in the End', text: 'This is the teaching that ties everything together. Neville\'s entire philosophy in four words: LIVE IN THE END.\n\nDon\'t live in the middle — the space between where you are and where you want to be. That middle is anxiety, doubt, impatience. Don\'t live in the beginning — the space of hoping and wishing. That beginning is powerlessness.\n\nLive in the END. The desire fulfilled. The goal achieved. The person you\'re becoming — BE THEM NOW.\n\nFour weeks ago you made a decision. Every day since then, you\'ve been building new neural pathways, new habits, new beliefs. You are not the person who started this journey. You are already becoming someone new.\n\nToday\'s practice: Write a journal entry dated one year from today. Describe your life as if everything you\'ve been visualizing has come true. Be specific. Be detailed. Be grateful. Read it every morning this week.' },
  { day: 29, teacher: 'Bob Proctor', title: 'The Secret to Living Is Giving', text: 'Bob Proctor said the universe operates on a law of circulation. Money, love, ideas, energy — they must flow. When you hoard anything, you block the flow. When you give, you create a vacuum that the universe rushes to fill.\n\nThis is counterintuitive. Most people think: "I\'ll give when I have enough." Bob said: "You\'ll never have enough until you give." Giving doesn\'t mean depleting yourself. It means recognizing that you are a CHANNEL, not a container. The more that flows through you, the more comes to you.\n\nToday\'s practice: Give something away today. It doesn\'t have to be money. Give a compliment. Give your time. Give your attention. Give encouragement. Notice how it makes YOU feel. That feeling is the law of circulation at work.' },
  { day: 30, teacher: 'Wayne Dyer', title: 'I AM That I AM', text: 'Wayne Dyer said the two most powerful words in any language are "I AM." Whatever you attach to "I AM" becomes your identity, and your identity becomes your destiny.\n\n"I am an addict." "I am broken." "I am stuck." — these are prisons.\n"I am healing." "I am powerful." "I am free." — these are wings.\n\nBe ruthlessly careful with your "I am" statements. Every time you say "I am tired" or "I am stressed" or "I am not good enough" — your subconscious takes it as an instruction.\n\nYou are 30 days in. You have earned the right to say: "I am someone who shows up for themselves every single day. I am someone who chose freedom. I am someone who is rewiring their entire life."\n\nToday\'s practice: Write 10 "I AM" statements about the person you are becoming. Say them aloud. Say them with conviction. These are not lies — they are blueprints.' },
  { day: 31, teacher: 'Neville Goddard', title: 'Mental Diets', text: 'Neville gave a famous lecture called "Mental Diets" where he compared your thought patterns to food. Just as you wouldn\'t eat poison and expect to be healthy, you cannot think poison and expect to thrive.\n\nA mental diet means monitoring every thought with the same attention you give to what you eat. When a negative thought enters — "I can\'t do this," "this will never work," "I\'m not strong enough" — you catch it and refuse to feed it. You starve it by replacing it with its opposite.\n\nThis is HARD. It may be the hardest thing Neville ever taught. But he said if you could maintain a strict mental diet for even three days, your life would begin to change in ways that seem miraculous.\n\nToday\'s practice: For the next 24 hours, catch every negative thought about yourself and immediately replace it with the opposite. "I can\'t" becomes "I can." "I\'m afraid" becomes "I am courageous." Track how many you catch. The number will surprise you.' },
  { day: 32, teacher: 'Bob Proctor', title: 'Goal Setting From the Inside Out', text: 'Most people set goals they think they can achieve. Bob called these "Type A" goals. They\'re safe. Predictable. And they don\'t require any growth.\n\nThen there are "Type C" goals — goals that you have absolutely no idea HOW to achieve. Goals that scare you. Goals that would require you to become a completely different person.\n\nBob said only Type C goals are worth setting, because they\'re the only ones that force you to grow. And growth is the entire point of being alive.\n\nToday\'s practice: Set one goal that makes your stomach drop. Not a safe goal. A REAL goal. Write it down. Don\'t worry about the HOW — that\'s the universe\'s job. Your job is to hold the vision and become the person who achieves it.' },
  { day: 33, teacher: 'Wayne Dyer', title: 'Surrender', text: 'Wayne Dyer\'s later work was all about surrender — and he was careful to distinguish surrender from giving up. Giving up says: "I can\'t." Surrender says: "I trust something larger than my ego to handle this."\n\nThe ego wants to control everything. When. How. Who. Where. And the ego\'s plans are always limited by what it has already experienced. Surrender opens you to possibilities your ego could never imagine.\n\nWayne said: "Stop acting as if life is a rehearsal. Live this day as if it were your last. The past is over and gone. The future is not guaranteed."\n\nToday\'s practice: Pick one thing you\'ve been trying to control. Just one. And let it go for today. Not forever — just today. Tell the universe: "I trust you with this." Then watch. The answers that come from surrender are always more elegant than the ones we force.' },
  { day: 34, teacher: 'Neville Goddard', title: 'The Inner Conversation', text: 'Neville said that the conversation you carry on inside your head — the running commentary, the inner dialogue, the constant narrator — is the most powerful force in your life.\n\nMost people\'s inner conversation is destructive without them even knowing it. "I hope this works but it probably won\'t." "Things always go wrong for me." "I\'ll believe it when I see it."\n\nNeville said to reverse it: "You\'ll SEE it when you BELIEVE it." And belief starts with what you say to yourself in the privacy of your own mind.\n\nToday\'s practice: Listen to your inner conversation today without judgment. Just observe. What are you telling yourself about your life, your worth, your future? Write down the 3 most frequent inner phrases. Then rewrite each one as its empowered opposite.' },
  { day: 35, teacher: 'Bob Proctor', title: 'Gratitude as a Discipline', text: 'Bob Proctor practiced gratitude not as a feel-good exercise, but as a DISCIPLINE. He said gratitude is the frequency that attracts abundance — and you must practice it especially when you don\'t feel like it.\n\n"When times are tough, that\'s when gratitude matters most. Anyone can be grateful when everything\'s going great. The master is grateful in the storm because they KNOW the storm is temporary and the growth is permanent."\n\nYou\'re building this muscle right now. Every gratitude entry in this app is a rep. And the stronger this muscle gets, the more naturally abundance flows to you.\n\nToday\'s practice: Write 5 things you\'re grateful for that you\'ve NEVER written before. Push past the obvious. Be grateful for your challenges. For the hard days. For the moments you almost gave in but didn\'t. That\'s advanced gratitude.' },
]

function ReadingsPage({ onBack }) {
  const [readPages, readingsDb] = useSync('readings', 'readings')
  const daysSinceQuit = Math.max(1, Math.ceil((Date.now() - QUIT_DATE) / 86400000))
  const unlockedCount = Math.min(TEACHINGS.length, daysSinceQuit)
  const readSet = new Set(readPages.map(r => r.page_num))
  const [selectedDay, setSelectedDay] = useState(null)

  const markRead = (pageNum) => {
    if (!readSet.has(pageNum)) {
      readingsDb.add({ page_num: pageNum })
    }
  }

  const teaching = selectedDay !== null ? TEACHINGS[selectedDay] : null

  return (
    <div style={s.page}>
      <div style={{ paddingTop: 20, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={selectedDay !== null ? () => setSelectedDay(null) : onBack}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#fff', opacity: 0.5 }}>
          {Icons.back}
        </button>
        <div>
          <h1 style={s.greeting}>{selectedDay !== null ? `Day ${teaching.day}` : 'Daily Readings'}</h1>
          <p style={s.subtitle}>
            {selectedDay !== null ? teaching.teacher : `${readSet.size} of ${unlockedCount} pages read`}
          </p>
        </div>
      </div>

      {selectedDay !== null ? (
        /* Reading view */
        <div>
          <div style={{ ...s.card, marginBottom: 14, borderLeft: '2px solid rgba(255,255,255,0.15)', borderRadius: '0 14px 14px 0' }}>
            <div style={{ fontSize: 9, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 3, color: 'rgba(255,255,255,0.25)', marginBottom: 8 }}>
              {teaching.teacher}
            </div>
            <div style={{ fontSize: 18, fontWeight: 300, color: '#fff', marginBottom: 16, lineHeight: 1.4 }}>
              {teaching.title}
            </div>
            {teaching.text.split('\n\n').map((para, i) => (
              <p key={i} style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', lineHeight: 1.8, marginBottom: 16 }}>
                {para}
              </p>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
            <button onClick={() => { markRead(teaching.day); setSelectedDay(null) }}
              style={{ ...s.btnPrimary, flex: 1 }}>
              {readSet.has(teaching.day) ? '✓ Read' : 'Mark as Read'}
            </button>
            {selectedDay < unlockedCount - 1 && (
              <button onClick={() => { markRead(teaching.day); setSelectedDay(selectedDay + 1) }}
                style={{ ...s.btnSecondary, padding: '14px 20px' }}>
                Next →
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Page list */
        <div>
          {/* Progress */}
          <div style={{ ...s.card, marginBottom: 14, textAlign: 'center', padding: '20px 16px' }}>
            <div style={{ fontSize: 28, fontWeight: 300, color: '#fff' }}>
              {readSet.size}<span style={{ fontSize: 14, ...s.dim }}>/{unlockedCount}</span>
            </div>
            <div style={{ fontSize: 10, ...s.dim, marginTop: 4, textTransform: 'uppercase', letterSpacing: 1 }}>Pages read</div>
            <div style={{ ...s.track, marginTop: 12 }}>
              <div style={s.fill(unlockedCount > 0 ? (readSet.size / unlockedCount) * 100 : 0)} />
            </div>
          </div>

          {/* Today's reading highlight */}
          {daysSinceQuit <= TEACHINGS.length && (
            <div style={{ marginBottom: 14 }}>
              <div style={s.label}>TODAY'S READING</div>
              <button onClick={() => setSelectedDay(daysSinceQuit - 1)}
                style={{ ...s.card, width: '100%', textAlign: 'left', cursor: 'pointer', padding: '18px 16px',
                  border: readSet.has(daysSinceQuit) ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(255,255,255,0.2)',
                  transition: 'all 0.2s' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: 9, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 2, color: 'rgba(255,255,255,0.3)', marginBottom: 6 }}>
                      {TEACHINGS[daysSinceQuit - 1].teacher}
                    </div>
                    <div style={s.cardTitle}>{TEACHINGS[daysSinceQuit - 1].title}</div>
                    <div style={{ fontSize: 11, ...s.dim, marginTop: 4 }}>Day {daysSinceQuit}</div>
                  </div>
                  {readSet.has(daysSinceQuit) ? (
                    <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.3)' }}>✓</span>
                  ) : (
                    <span style={{ fontSize: 10, fontWeight: 600, color: '#fff', background: 'rgba(255,255,255,0.1)', padding: '4px 10px', borderRadius: 999 }}>NEW</span>
                  )}
                </div>
              </button>
            </div>
          )}

          {/* All pages */}
          <div style={s.label}>ALL PAGES</div>
          {TEACHINGS.slice(0, unlockedCount).map((t, i) => {
            const isRead = readSet.has(t.day)
            const isLocked = i >= unlockedCount
            return (
              <button key={t.day} onClick={() => !isLocked && setSelectedDay(i)}
                style={{ ...s.card, marginBottom: 6, width: '100%', textAlign: 'left', cursor: isLocked ? 'default' : 'pointer',
                  opacity: isLocked ? 0.3 : 1, display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', transition: 'all 0.2s' }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', border: isRead ? '2px solid rgba(255,255,255,0.3)' : '2px solid rgba(255,255,255,0.1)',
                  background: isRead ? 'rgba(255,255,255,0.1)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {isRead ? <span style={{ fontSize: 11, color: '#fff' }}>✓</span> : <span style={{ fontSize: 10, ...s.dim }}>{t.day}</span>}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 500, color: '#fff' }}>{t.title}</div>
                  <div style={{ fontSize: 9, ...s.dim, marginTop: 2 }}>{t.teacher}</div>
                </div>
                <span style={{ ...s.dim, fontSize: 12 }}>{Icons.chevron}</span>
              </button>
            )
          })}

          {unlockedCount < TEACHINGS.length && (
            <div style={{ textAlign: 'center', padding: '20px 0', ...s.dim, fontSize: 11 }}>
              {TEACHINGS.length - unlockedCount} more pages unlock as your journey continues
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ============================================================
// RUN TRACKER — GPS distance, pace, route
// ============================================================

const haversine = (a, b) => {
  const R = 3958.8 // miles
  const dLat = (b.lat - a.lat) * Math.PI / 180
  const dLon = (b.lng - a.lng) * Math.PI / 180
  const x = Math.sin(dLat/2)**2 + Math.cos(a.lat*Math.PI/180) * Math.cos(b.lat*Math.PI/180) * Math.sin(dLon/2)**2
  return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1-x))
}

function RunPage({ onBack }) {
  const [runs, runsDb] = useSync('runs', 'runs')
  const [running, setRunning] = useState(false)
  const [route, setRoute] = useState([])
  const [distance, setDistance] = useState(0)
  const [elapsed, setElapsed] = useState(0)
  const [startTime, setStartTime] = useState(null)
  const watchRef = useRef(null)
  const canvasRef = useRef(null)
  const timerRef = useRef(null)

  // Timer
  useEffect(() => {
    if (!running || !startTime) return
    const tick = () => setElapsed(Math.floor((Date.now() - startTime) / 1000))
    timerRef.current = setInterval(tick, 1000)
    return () => clearInterval(timerRef.current)
  }, [running, startTime])

  // Draw route on canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || route.length < 2) return
    const ctx = canvas.getContext('2d')
    const w = canvas.width = canvas.offsetWidth * 2
    const h = canvas.height = canvas.offsetHeight * 2
    ctx.scale(2, 2)
    ctx.clearRect(0, 0, w, h)

    const lats = route.map(p => p.lat), lngs = route.map(p => p.lng)
    const minLat = Math.min(...lats), maxLat = Math.max(...lats)
    const minLng = Math.min(...lngs), maxLng = Math.max(...lngs)
    const pad = 30
    const dw = canvas.offsetWidth - pad * 2
    const dh = canvas.offsetHeight - pad * 2
    const rangeL = maxLat - minLat || 0.001
    const rangeN = maxLng - minLng || 0.001

    const toX = lng => pad + ((lng - minLng) / rangeN) * dw
    const toY = lat => pad + ((maxLat - lat) / rangeL) * dh

    // Route line
    ctx.beginPath()
    ctx.moveTo(toX(route[0].lng), toY(route[0].lat))
    route.forEach((p, i) => { if (i > 0) ctx.lineTo(toX(p.lng), toY(p.lat)) })
    ctx.strokeStyle = 'rgba(255,255,255,0.4)'
    ctx.lineWidth = 2.5
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.stroke()

    // Start dot
    ctx.beginPath()
    ctx.arc(toX(route[0].lng), toY(route[0].lat), 4, 0, Math.PI * 2)
    ctx.fillStyle = 'rgba(255,255,255,0.6)'
    ctx.fill()

    // Current position dot
    const last = route[route.length - 1]
    ctx.beginPath()
    ctx.arc(toX(last.lng), toY(last.lat), 5, 0, Math.PI * 2)
    ctx.fillStyle = '#fff'
    ctx.fill()
  }, [route])

  const startRun = () => {
    if (!navigator.geolocation) { alert('GPS not available'); return }
    setRunning(true)
    setStartTime(Date.now())
    setRoute([])
    setDistance(0)
    setElapsed(0)

    watchRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        const point = { lat: pos.coords.latitude, lng: pos.coords.longitude, t: Date.now() }
        setRoute(prev => {
          const updated = [...prev, point]
          if (prev.length > 0) {
            const d = haversine(prev[prev.length - 1], point)
            if (d < 0.5) setDistance(dist => dist + d) // ignore GPS jumps > 0.5mi
          }
          return updated
        })
      },
      (err) => console.log('GPS error:', err.message),
      { enableHighAccuracy: true, maximumAge: 3000, timeout: 10000 }
    )
  }

  const endRun = () => {
    if (watchRef.current !== null) navigator.geolocation.clearWatch(watchRef.current)
    clearInterval(timerRef.current)
    setRunning(false)

    if (distance > 0.01) {
      const paceMin = elapsed > 0 && distance > 0 ? elapsed / 60 / distance : 0
      const paceStr = paceMin > 0 ? `${Math.floor(paceMin)}:${String(Math.floor((paceMin % 1) * 60)).padStart(2, '0')}` : '--'
      runsDb.add({ distance: Math.round(distance * 100) / 100, duration: elapsed, pace: paceStr, route })
    }
    setRoute([]); setDistance(0); setElapsed(0); setStartTime(null)
  }

  const fmtDur = (secs) => {
    const h = Math.floor(secs / 3600)
    const m = Math.floor((secs % 3600) / 60)
    const sc = secs % 60
    if (h > 0) return `${h}:${String(m).padStart(2,'0')}:${String(sc).padStart(2,'0')}`
    return `${String(m).padStart(2,'0')}:${String(sc).padStart(2,'0')}`
  }

  const currentPace = elapsed > 0 && distance > 0.01
    ? (() => { const p = elapsed / 60 / distance; return `${Math.floor(p)}:${String(Math.floor((p % 1) * 60)).padStart(2, '0')}` })()
    : '--:--'

  return (
    <div style={s.page}>
      <div style={{ paddingTop: 20, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#fff', opacity: 0.5 }}>
          {Icons.back}
        </button>
        <div>
          <h1 style={s.greeting}>Run</h1>
          <p style={s.subtitle}>{running ? 'Tracking your run...' : `${runs.length} runs logged`}</p>
        </div>
      </div>

      {/* Route map */}
      <div style={{ ...s.card, marginBottom: 14, padding: 0, overflow: 'hidden', position: 'relative' }}>
        <canvas ref={canvasRef}
          style={{ width: '100%', height: 200, display: 'block', background: running && route.length > 1 ? 'rgba(255,255,255,0.02)' : 'transparent' }} />
        {!running && route.length < 2 && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <p style={{ fontSize: 11, ...s.dim }}>Your route will appear here</p>
          </div>
        )}
      </div>

      {/* Live stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 20 }}>
        <div style={{ ...s.card, textAlign: 'center', padding: '16px 8px' }}>
          <div style={{ fontSize: 24, fontWeight: 300, color: '#fff' }}>{distance.toFixed(2)}</div>
          <div style={{ fontSize: 9, ...s.dim, marginTop: 4, textTransform: 'uppercase', letterSpacing: 1 }}>Miles</div>
        </div>
        <div style={{ ...s.card, textAlign: 'center', padding: '16px 8px' }}>
          <div style={{ fontSize: 24, fontWeight: 300, color: '#fff' }}>{fmtDur(elapsed)}</div>
          <div style={{ fontSize: 9, ...s.dim, marginTop: 4, textTransform: 'uppercase', letterSpacing: 1 }}>Time</div>
        </div>
        <div style={{ ...s.card, textAlign: 'center', padding: '16px 8px' }}>
          <div style={{ fontSize: 24, fontWeight: 300, color: '#fff' }}>{currentPace}</div>
          <div style={{ fontSize: 9, ...s.dim, marginTop: 4, textTransform: 'uppercase', letterSpacing: 1 }}>Pace /mi</div>
        </div>
      </div>

      {/* Start / End button */}
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        {running ? (
          <button onClick={endRun}
            style={{ ...s.btnSecondary, padding: '16px 48px', fontSize: 14, fontWeight: 600, letterSpacing: 1,
              background: 'rgba(255,100,100,0.1)', borderColor: 'rgba(255,100,100,0.25)', color: '#fff' }}>
            END RUN
          </button>
        ) : (
          <button onClick={startRun}
            style={{ ...s.btnPrimary, width: 'auto', padding: '16px 48px', fontSize: 14, fontWeight: 600, letterSpacing: 1, display: 'inline-block' }}>
            START RUN
          </button>
        )}
      </div>

      {/* Run history */}
      {runs.length > 0 && (
        <>
          <div style={s.label}>HISTORY</div>
          {runs.map(run => {
            const runRoute = run.route || []
            return (
              <div key={run.id} style={{ ...s.card, marginBottom: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <span style={{ fontSize: 10, ...s.dim }}>{fmtDate(run.created_at)}</span>
                  <span style={{ fontSize: 10, ...s.dim }}>{runRoute.length} GPS points</span>
                </div>
                <div style={{ display: 'flex', gap: 16 }}>
                  <div>
                    <div style={{ fontSize: 18, fontWeight: 300, color: '#fff' }}>{run.distance?.toFixed(2)} mi</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 300, ...s.mid }}>{fmtDur(run.duration)}</div>
                    <div style={{ fontSize: 9, ...s.dim }}>time</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 300, ...s.mid }}>{run.pace || '--'}</div>
                    <div style={{ fontSize: 9, ...s.dim }}>pace</div>
                  </div>
                </div>
              </div>
            )
          })}
        </>
      )}

      <div style={{ textAlign: 'center', marginTop: 20, marginBottom: 100 }}>
        <p style={{ fontSize: 11, ...s.dim, fontStyle: 'italic', lineHeight: 1.6 }}>
          "An awakened imagination works with a purpose."
        </p>
        <p style={{ fontSize: 9, ...s.dim, marginTop: 4, letterSpacing: 2, textTransform: 'uppercase' }}>Neville Goddard</p>
      </div>
    </div>
  )
}

// ============================================================
// CRAVINGS PAGE
// ============================================================

function CravingsPage({ onBack }) {
  const today = new Date().toDateString()
  const [cravingLog, cravingDb] = useSync('craving_log', 'craving_log')
  const [justResisted, setJustResisted] = useState(false)
  const [note, setNote] = useState('')
  const mic = useSpeech(setNote)

  const todayCount = cravingLog.filter(e => new Date(e.created_at || e.date).toDateString() === today).length
  const totalResisted = cravingLog.length

  const resist = () => {
    cravingDb.add({ note: note || null })
    setNote(''); setJustResisted(true); setTimeout(() => setJustResisted(false), 2500)
  }

  const affirmations = [
    "You chose yourself. Again.",
    "Every resist rewires a pathway.",
    "This craving is temporary. You are permanent.",
    "Your future self is proud of this moment.",
    "The feeling passes. The growth stays.",
    "You don't need it. You never did.",
    "Your brain is creating new defaults right now.",
    "This is discipline becoming freedom.",
  ]

  return (
    <div style={s.page}>
      <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', ...s.dim, fontSize: 12, paddingTop: 16, display: 'flex', alignItems: 'center', gap: 4 }}>
        <span style={{ transform: 'rotate(180deg)', display: 'inline-block' }}>{Icons.chevron}</span> Back
      </button>
      <div style={{ paddingTop: 12, marginBottom: 24 }}>
        <h1 style={s.greeting}>Cravings</h1>
        <p style={s.subtitle}>Every resist is a win</p>
      </div>

      <div style={{ ...s.card, textAlign: 'center', padding: '32px 16px', marginBottom: 14 }}>
        <div style={{ ...s.label, marginBottom: 12 }}>HAVING A CRAVING?</div>
        <p style={{ fontSize: 11, ...s.dim, marginBottom: 16, lineHeight: 1.6 }}>
          Want to drink water, chew something, smoke — anything. Press the button instead.
        </p>

        <div style={{ display: 'flex', gap: 8, marginBottom: 16, justifyContent: 'center' }}>
          <input value={note} onChange={e => setNote(e.target.value)}
            placeholder="What are you craving? (optional)"
            style={{ ...s.input, textAlign: 'center', flex: 1 }} />
          <MicBtn listening={mic.listening} onPress={() => mic.toggle(note)} small />
        </div>

        <button onClick={resist}
          style={{ width: 100, height: 100, borderRadius: '50%', border: justResisted ? '2px solid rgba(255,255,255,0.3)' : '2px solid rgba(255,255,255,0.1)',
            background: justResisted ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.03)', cursor: 'pointer', transition: 'all 0.3s',
            display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: '#fff', letterSpacing: 1 }}>
            {justResisted ? '✓' : 'PASS'}
          </span>
        </button>

        <AnimatePresence>
          {justResisted && (
            <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', marginTop: 16, fontStyle: 'italic' }}>
              {affirmations[Math.floor(Math.random() * affirmations.length)]}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
        <div style={{ ...s.card, textAlign: 'center', padding: '16px 12px' }}>
          <div style={{ fontSize: 28, fontWeight: 300, color: '#fff' }}>{todayCount}</div>
          <div style={{ fontSize: 10, ...s.dim, marginTop: 4, textTransform: 'uppercase', letterSpacing: 1 }}>Today</div>
        </div>
        <div style={{ ...s.card, textAlign: 'center', padding: '16px 12px' }}>
          <div style={{ fontSize: 28, fontWeight: 300, color: '#fff' }}>{totalResisted}</div>
          <div style={{ fontSize: 10, ...s.dim, marginTop: 4, textTransform: 'uppercase', letterSpacing: 1 }}>All Time</div>
        </div>
      </div>

      {cravingLog.length > 0 && (
        <>
          <div style={s.label}>RECENT</div>
          {cravingLog.slice(0, 20).map(entry => (
            <div key={entry.id} style={{ ...s.card, marginBottom: 6, display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px' }}>
              <span style={{ fontSize: 12 }}>✓</span>
              <div style={{ flex: 1 }}>
                <span style={{ fontSize: 11, ...s.mid }}>{fmtDate(entry.created_at || entry.date)} · {fmtTime(entry.created_at || entry.date)}</span>
                {entry.note && <div style={{ fontSize: 10, ...s.dim, marginTop: 2 }}>{entry.note}</div>}
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  )
}

// ============================================================
// ENERGY TRACKER
// ============================================================

function EnergyPage({ onBack }) {
  const [log, logDb] = useSync('energy_log', 'energy_log')
  const [selected, setSelected] = useState(null)
  const [note, setNote] = useState('')
  const mic = useSpeech(setNote)
  const today = new Date().toDateString()
  const todayEntries = log.filter(e => new Date(e.created_at || e.date).toDateString() === today)
  const latestToday = todayEntries.length ? todayEntries[0] : null

  const levels = [
    { value: 1, emoji: '😴', label: 'Crashed', color: 'rgba(255,100,100,0.15)' },
    { value: 2, emoji: '🥱', label: 'Exhausted', color: 'rgba(255,140,100,0.15)' },
    { value: 3, emoji: '😐', label: 'Low', color: 'rgba(255,180,100,0.15)' },
    { value: 4, emoji: '🙂', label: 'Okay', color: 'rgba(255,220,100,0.15)' },
    { value: 5, emoji: '😊', label: 'Good', color: 'rgba(180,255,100,0.15)' },
    { value: 6, emoji: '⚡', label: 'Strong', color: 'rgba(100,255,150,0.15)' },
    { value: 7, emoji: '🔥', label: 'On Fire', color: 'rgba(100,200,255,0.15)' },
  ]

  const logEnergy = () => {
    if (selected === null) return
    const level = levels[selected]
    mic.stop()
    logDb.add({ level: level.value, label: level.label, emoji: level.emoji, note: note.trim() || null })
    setSelected(null)
    setNote('')
  }

  const last14 = []
  for (let i = 13; i >= 0; i--) {
    const d = new Date(); d.setDate(d.getDate() - i)
    const ds = d.toDateString()
    const dayEntries = log.filter(e => new Date(e.created_at || e.date).toDateString() === ds)
    const avg = dayEntries.length ? dayEntries.reduce((s, e) => s + (e.level || 0), 0) / dayEntries.length : 0
    last14.push({ date: d, avg, count: dayEntries.length })
  }

  const daysSinceQuit = Math.floor((Date.now() - QUIT_DATE.getTime()) / 86400000)

  return (
    <div style={s.page}>
      <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', ...s.dim, fontSize: 14, paddingTop: 16, display: 'flex', alignItems: 'center', gap: 4 }}>
        <span style={{ transform: 'rotate(180deg)', display: 'inline-block' }}>{Icons.chevron}</span> Back
      </button>
      <div style={{ paddingTop: 12, marginBottom: 24 }}>
        <h1 style={s.greeting}>Energy</h1>
        <p style={s.subtitle}>Track it — watch it come back</p>
      </div>

      {latestToday && (
        <div style={{ ...s.card, textAlign: 'center', marginBottom: 14, padding: '24px 18px' }}>
          <div style={s.label}>RIGHT NOW</div>
          <div style={{ fontSize: 48, marginTop: 8 }}>{latestToday.emoji}</div>
          <div style={{ fontSize: 18, fontWeight: 500, color: '#fff', marginTop: 8 }}>{latestToday.label}</div>
          <div style={{ fontSize: 13, ...s.dim, marginTop: 4 }}>Logged at {fmtTime(latestToday.created_at || latestToday.date)}</div>
        </div>
      )}

      <div style={{ ...s.card, marginBottom: 14 }}>
        <div style={s.label}>HOW'S YOUR ENERGY?</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, marginBottom: 16 }}>
          {levels.map((l, i) => (
            <button key={i} onClick={() => setSelected(i)}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, background: selected === i ? l.color : 'none',
                border: selected === i ? '1px solid rgba(255,255,255,0.15)' : '1px solid transparent',
                borderRadius: 12, padding: '10px 6px', cursor: 'pointer', transition: 'all 0.2s', flex: 1 }}>
              <span style={{ fontSize: 28 }}>{l.emoji}</span>
              <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', fontWeight: 500 }}>{l.label}</span>
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
          <input value={note} onChange={e => setNote(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && logEnergy()}
            placeholder="What's affecting your energy? (optional)" style={{ ...s.input, flex: 1 }} />
          <MicBtn listening={mic.listening} onPress={() => mic.toggle(note)} small />
        </div>
        <button onClick={logEnergy} disabled={selected === null}
          style={{ ...s.btnPrimary, opacity: selected === null ? 0.3 : 1 }}>Log Energy</button>
      </div>

      <div style={{ ...s.card, marginBottom: 14 }}>
        <div style={s.label}>14-DAY TREND</div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 100, marginTop: 8 }}>
          {last14.map((d, i) => (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <div style={{ width: '100%', background: d.avg > 0 ? `rgba(255,255,255,${0.06 + d.avg * 0.04})` : 'rgba(255,255,255,0.03)',
                height: d.avg > 0 ? `${(d.avg / 7) * 80}px` : '4px', borderRadius: 4, transition: 'all 0.3s', minHeight: 4 }} />
              <span style={{ fontSize: 9, ...s.dim }}>{d.date.toLocaleDateString('en-US', { weekday: 'narrow' })}</span>
            </div>
          ))}
        </div>
        {last14.filter(d => d.count > 0).length >= 3 && (() => {
          const withData = last14.filter(d => d.count > 0)
          const firstHalf = withData.slice(0, Math.floor(withData.length / 2))
          const secondHalf = withData.slice(Math.floor(withData.length / 2))
          const avgFirst = firstHalf.reduce((sum, d) => sum + d.avg, 0) / firstHalf.length
          const avgSecond = secondHalf.reduce((sum, d) => sum + d.avg, 0) / secondHalf.length
          const trending = avgSecond > avgFirst ? 'up' : avgSecond < avgFirst ? 'down' : 'steady'
          return (
            <p style={{ fontSize: 13, ...s.dim, marginTop: 12, textAlign: 'center' }}>
              {trending === 'up' ? '📈 Your energy is trending up' : trending === 'down' ? '📉 Hang in there — this is temporary' : '➡️ Holding steady'}
            </p>
          )
        })()}
      </div>

      <div style={{ ...s.card, borderLeft: '2px solid rgba(255,255,255,0.1)', borderRadius: '0 14px 14px 0', marginBottom: 14 }}>
        <div style={s.cardText}>
          <strong style={{ color: '#fff' }}>Low energy is normal right now.</strong> Your brain's dopamine system ran on external input for a long time.
          Natural dopamine production is rebuilding — it typically takes 2-4 weeks for baseline energy to stabilize.
          {daysSinceQuit < 7 && ' You\'re in the hardest week. Every day your mitochondria are recalibrating.'}
          {daysSinceQuit >= 7 && daysSinceQuit < 21 && ' Week by week, your natural energy pathways are strengthening.'}
          {daysSinceQuit >= 21 && ' By now your dopamine receptors are substantially recovered. Keep tracking — you\'ll see the proof.'}
          {' '}Exercise, sunlight, cold water, and protein all accelerate the process.
        </div>
      </div>

      {todayEntries.length > 0 && (
        <div>
          <div style={s.label}>TODAY'S LOG</div>
          {todayEntries.map(e => (
            <div key={e.id} style={{ ...s.card, marginBottom: 6, display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px' }}>
              <span style={{ fontSize: 24 }}>{e.emoji}</span>
              <div style={{ flex: 1 }}>
                <span style={{ fontSize: 14, fontWeight: 500, color: '#fff' }}>{e.label}</span>
                {e.note && <div style={{ fontSize: 13, ...s.dim, marginTop: 2 }}>{e.note}</div>}
              </div>
              <span style={{ fontSize: 12, ...s.dim }}>{fmtTime(e.created_at || e.date)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ============================================================
// JOURNAL
// ============================================================

function JournalPage({ onBack }) {
  const [entries, journalDb] = useSync('journal', 'journal')
  const [text, setText] = useState('')
  const [mood, setMood] = useState(null)
  const [expanded, setExpanded] = useState(null)
  const mic = useSpeech(setText)

  const moods = [
    { emoji: '😢', label: 'Tough' },
    { emoji: '😔', label: 'Low' },
    { emoji: '😐', label: 'Neutral' },
    { emoji: '🙂', label: 'Okay' },
    { emoji: '😊', label: 'Good' },
    { emoji: '🥰', label: 'Great' },
  ]

  const prompts = [
    "What am I feeling right now?",
    "What would I tell myself 30 days from now?",
    "What did I handle well today?",
    "What's one thing I'm proud of?",
    "What's been on my mind?",
    "Describe a moment of clarity you had recently.",
    "What's something you want to let go of?",
    "What does your ideal day look like sober?",
  ]
  const [prompt] = useState(prompts[Math.floor(Math.random() * prompts.length)])

  const save = () => {
    if (!text.trim()) return
    mic.stop()
    const m = mood !== null ? moods[mood] : null
    journalDb.add({ text: text.trim(), mood_emoji: m?.emoji || null, mood_label: m?.label || null })
    setText('')
    setMood(null)
  }

  const del = (id) => {
    if (!confirm('Are you sure you want to delete this entry?')) return
    journalDb.remove(id)
  }

  const grouped = {}
  entries.forEach(e => {
    const d = fmtDate(e.created_at || e.date)
    if (!grouped[d]) grouped[d] = []
    grouped[d].push(e)
  })

  return (
    <div style={s.page}>
      <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', ...s.dim, fontSize: 14, paddingTop: 16, display: 'flex', alignItems: 'center', gap: 4 }}>
        <span style={{ transform: 'rotate(180deg)', display: 'inline-block' }}>{Icons.chevron}</span> Back
      </button>
      <div style={{ paddingTop: 12, marginBottom: 24 }}>
        <h1 style={s.greeting}>Journal</h1>
        <p style={s.subtitle}>Process, release, grow</p>
      </div>

      <div style={{ ...s.card, marginBottom: 14, borderLeft: '2px solid rgba(255,255,255,0.15)', borderRadius: '0 14px 14px 0' }}>
        <p style={{ fontSize: 12, letterSpacing: 2, textTransform: 'uppercase', ...s.dim, marginBottom: 6 }}>Today's prompt</p>
        <p style={{ fontSize: 16, fontWeight: 300, color: 'rgba(255,255,255,0.6)', fontStyle: 'italic', lineHeight: 1.6 }}>
          "{prompt}"
        </p>
      </div>

      <div style={{ ...s.card, marginBottom: 14 }}>
        <textarea value={text} onChange={e => setText(e.target.value)}
          placeholder="Write freely... this is just for you"
          rows={6} style={{ ...s.textarea, minHeight: 140 }} />

        <div style={{ marginTop: 14, marginBottom: 14 }}>
          <p style={{ fontSize: 13, ...s.dim, marginBottom: 8 }}>How are you feeling?</p>
          <div style={{ display: 'flex', gap: 6 }}>
            {moods.map((m, i) => (
              <button key={i} onClick={() => setMood(mood === i ? null : i)}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, flex: 1,
                  background: mood === i ? 'rgba(255,255,255,0.08)' : 'none',
                  border: mood === i ? '1px solid rgba(255,255,255,0.15)' : '1px solid transparent',
                  borderRadius: 10, padding: '10px 4px', cursor: 'pointer', transition: 'all 0.2s' }}>
                <span style={{ fontSize: 26 }}>{m.emoji}</span>
                <span style={{ fontSize: 10, ...s.dim }}>{m.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <MicBtn listening={mic.listening} onPress={() => mic.toggle(text)} />
          <button onClick={save} disabled={!text.trim()}
            style={{ ...s.btnSecondary, opacity: text.trim() ? 1 : 0.3, padding: '14px 28px' }}>Save Entry</button>
        </div>
      </div>

      {entries.length > 0 && (
        <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
          <div style={{ ...s.card, flex: 1, textAlign: 'center', padding: '16px 12px' }}>
            <div style={{ fontSize: 28, fontWeight: 200, color: '#fff' }}>{entries.length}</div>
            <div style={{ fontSize: 12, ...s.dim, marginTop: 4 }}>Entries</div>
          </div>
          <div style={{ ...s.card, flex: 1, textAlign: 'center', padding: '16px 12px' }}>
            <div style={{ fontSize: 28, fontWeight: 200, color: '#fff' }}>{Object.keys(grouped).length}</div>
            <div style={{ fontSize: 12, ...s.dim, marginTop: 4 }}>Days</div>
          </div>
          <div style={{ ...s.card, flex: 1, textAlign: 'center', padding: '16px 12px' }}>
            <div style={{ fontSize: 28, fontWeight: 200, color: '#fff' }}>{entries.reduce((sum, e) => sum + (e.text?.split(/\s+/).length || 0), 0).toLocaleString()}</div>
            <div style={{ fontSize: 12, ...s.dim, marginTop: 4 }}>Words</div>
          </div>
        </div>
      )}

      {Object.keys(grouped).map(date => (
        <div key={date} style={{ marginBottom: 14 }}>
          <div style={s.label}>{date.toUpperCase()}</div>
          {grouped[date].map(e => (
            <div key={e.id} style={{ ...s.card, marginBottom: 6, transition: 'all 0.2s' }}>
              <button onClick={() => setExpanded(expanded === e.id ? null : e.id)}
                style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: expanded === e.id ? 10 : 0 }}>
                  {e.mood_emoji && <span style={{ fontSize: 20 }}>{e.mood_emoji}</span>}
                  <div style={{ flex: 1 }}>
                    <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)' }}>
                      {expanded === e.id ? (e.mood_label || '') : (e.text?.slice(0, 60) + (e.text?.length > 60 ? '...' : ''))}
                    </span>
                  </div>
                  <span style={{ fontSize: 12, ...s.dim }}>{fmtTime(e.created_at || e.date)}</span>
                </div>
              </button>
              {expanded === e.id && (
                <>
                  <div style={{ fontSize: 15, color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>{e.text}</div>
                  <button onClick={() => del(e.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, color: 'rgba(255,255,255,0.15)', marginTop: 10 }}>
                    Delete entry
                  </button>
                </>
              )}
            </div>
          ))}
        </div>
      ))}

      {entries.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px 0', ...s.dim }}>
          <p style={{ fontSize: 15 }}>Your journal is waiting</p>
          <p style={{ fontSize: 13, marginTop: 6, opacity: 0.6 }}>Writing during recovery helps your brain process emotions it numbed for a long time</p>
        </div>
      )}
    </div>
  )
}

// ============================================================
// GIVE IT TO GOD
// ============================================================

const NEVILLE_SURRENDER = [
  "To pray successfully, you must yield to the wish, not to the worry.",
  "Let go and let God. Your Father knoweth what things ye have need of.",
  "The moment you accept the wish fulfilled, the burden is lifted.",
  "Stop wrestling. Assume the feeling of the answered prayer and rest in it.",
  "You do not fight against your problem. You withdraw from it into the feeling of the wish fulfilled.",
  "Be still and know that I am God. Stillness is the surrender.",
  "The prayer of surrender is not giving up — it is giving over.",
  "When you feel it real, you have planted the seed. Now leave the garden.",
  "Your anxiety is you trying to do God's work. Release it. It is not your burden to carry.",
  "Imagination, not willpower, creates. Stop pushing. Start assuming.",
  "The state of fulfilled desire has no anxiety in it. If you are anxious, you have not truly let go.",
  "Go to the end. Dwell in it. Then drop it. The bridge of incidents will form.",
]

function GiveToGodPage({ onBack }) {
  const [released, releasedDb] = useSync('released_worries', 'released_worries')
  const [worry, setWorry] = useState('')
  const [releasing, setReleasing] = useState(false)
  const [releaseQuote, setReleaseQuote] = useState(null)
  const mic = useSpeech(setWorry)

  const release = () => {
    if (!worry.trim()) return
    mic.stop()
    setReleasing(true)
    setReleaseQuote(NEVILLE_SURRENDER[Math.floor(Math.random() * NEVILLE_SURRENDER.length)])
    releasedDb.add({ text: worry.trim() })
    setTimeout(() => {
      setWorry('')
      setTimeout(() => setReleasing(false), 3000)
    }, 500)
  }

  const totalReleased = released.length

  return (
    <div style={s.page}>
      <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', ...s.dim, fontSize: 14, paddingTop: 16, display: 'flex', alignItems: 'center', gap: 4 }}>
        <span style={{ transform: 'rotate(180deg)', display: 'inline-block' }}>{Icons.chevron}</span> Back
      </button>
      <div style={{ paddingTop: 12, marginBottom: 28 }}>
        <h1 style={s.greeting}>Give It to God</h1>
        <p style={s.subtitle}>Release what isn't yours to carry</p>
      </div>

      {/* Release animation */}
      <AnimatePresence>
        {releasing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(13,13,13,0.95)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 40 }}>
            <motion.div
              initial={{ opacity: 1, y: 0 }}
              animate={{ opacity: 0, y: -120, scale: 0.5 }}
              transition={{ duration: 2.5, ease: 'easeOut' }}
              style={{ fontSize: 48, marginBottom: 40 }}>
              ✦
            </motion.div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 1.5 }}
              style={{ fontSize: 22, fontWeight: 300, color: 'rgba(255,255,255,0.7)', textAlign: 'center', lineHeight: 1.7, fontStyle: 'italic', maxWidth: 320 }}>
              Released.
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.8, duration: 1.5 }}
              style={{ fontSize: 15, color: 'rgba(255,255,255,0.35)', textAlign: 'center', lineHeight: 1.7, marginTop: 20, maxWidth: 300 }}>
              "{releaseQuote}"
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.5, duration: 1 }}
              style={{ fontSize: 11, letterSpacing: 3, textTransform: 'uppercase', color: 'rgba(255,255,255,0.2)', marginTop: 16 }}>
              Neville Goddard
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Neville quote */}
      <div style={{ ...s.card, marginBottom: 14, borderLeft: '2px solid rgba(255,255,255,0.15)', borderRadius: '0 16px 16px 0' }}>
        <p style={{ fontSize: 16, fontWeight: 300, color: 'rgba(255,255,255,0.5)', fontStyle: 'italic', lineHeight: 1.7 }}>
          "To pray successfully, you must yield to the wish, not to the worry. The moment you accept the wish fulfilled, the burden is lifted."
        </p>
        <p style={{ fontSize: 11, letterSpacing: 3, textTransform: 'uppercase', ...s.dim, marginTop: 10 }}>Neville Goddard</p>
      </div>

      {/* Write your worry */}
      <div style={{ ...s.card, marginBottom: 14 }}>
        <div style={s.label}>WHAT'S WEIGHING ON YOU?</div>
        <textarea value={worry} onChange={e => setWorry(e.target.value)}
          placeholder="Write it here... then let it go"
          rows={5} style={{ ...s.textarea, minHeight: 120 }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 14 }}>
          <MicBtn listening={mic.listening} onPress={() => mic.toggle(worry)} />
          <button onClick={release} disabled={!worry.trim()}
            style={{ padding: '16px 32px', borderRadius: 999, background: worry.trim() ? 'rgba(255,255,255,0.1)' : 'transparent',
              color: '#fff', fontSize: 17, fontWeight: 500, border: worry.trim() ? '1px solid rgba(255,255,255,0.2)' : '1px solid rgba(255,255,255,0.06)',
              cursor: worry.trim() ? 'pointer' : 'default', transition: 'all 0.3s', opacity: worry.trim() ? 1 : 0.3, letterSpacing: 0.5 }}>
            Release to God
          </button>
        </div>
      </div>

      {/* Counter */}
      {totalReleased > 0 && (
        <div style={{ ...s.card, textAlign: 'center', marginBottom: 14, padding: '28px 20px' }}>
          <div style={{ fontSize: 48, fontWeight: 200, color: '#fff' }}>{totalReleased}</div>
          <div style={{ fontSize: 15, ...s.dim, marginTop: 6 }}>{totalReleased === 1 ? 'worry released' : 'worries released'}</div>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.3)', marginTop: 12, lineHeight: 1.6 }}>
            Every one of these is something you chose not to carry alone.
          </p>
        </div>
      )}

      {/* What surrender means */}
      <div style={{ ...s.card, marginBottom: 14 }}>
        <div style={s.label}>THE PRACTICE</div>
        <div style={{ fontSize: 15, color: 'rgba(255,255,255,0.5)', lineHeight: 1.8 }}>
          <p style={{ marginBottom: 14 }}>Neville taught that worry is praying for what you don't want. Every anxious thought is an act of imagination — just pointed the wrong way.</p>
          <p style={{ marginBottom: 14 }}>When you write your worry and release it, you're doing two things:</p>
          <p style={{ marginBottom: 8, paddingLeft: 16 }}>1. <strong style={{ color: '#fff' }}>Acknowledging it</strong> — not suppressing, not pretending it doesn't exist</p>
          <p style={{ marginBottom: 8, paddingLeft: 16 }}>2. <strong style={{ color: '#fff' }}>Surrendering it</strong> — choosing to trust that your deeper self (God, consciousness, the I AM) is already handling it</p>
          <p style={{ marginTop: 14 }}>The bridge of incidents will form. Your only job is to feel the relief of having let go.</p>
        </div>
      </div>

      {/* Recent releases — no details, just timestamps for privacy */}
      {released.length > 0 && (
        <div>
          <div style={s.label}>RELEASED</div>
          {released.slice(0, 10).map(e => (
            <div key={e.id} style={{ ...s.card, marginBottom: 6, display: 'flex', alignItems: 'center', gap: 12, padding: '14px 18px' }}>
              <span style={{ fontSize: 16, color: 'rgba(255,255,255,0.15)' }}>✦</span>
              <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.3)', fontStyle: 'italic', flex: 1 }}>
                {e.text?.slice(0, 40)}{e.text?.length > 40 ? '...' : ''}
              </span>
              <span style={{ fontSize: 12, ...s.dim }}>{fmtDate(e.created_at || e.date)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ============================================================
// DAILY CHECK-IN (Morning + Night)
// ============================================================

function CheckInPage({ onBack }) {
  const [checkins, checkinDb] = useSync('checkins', 'checkins')
  const today = new Date().toDateString()
  const hour = new Date().getHours()
  const isMorning = hour < 15
  const todayCheckins = checkins.filter(e => new Date(e.created_at || e.date).toDateString() === today)
  const hasMorning = todayCheckins.some(e => e.type === 'morning')
  const hasNight = todayCheckins.some(e => e.type === 'night')

  // Morning state
  const [sleep, setSleep] = useState(null)
  const [energy, setEnergy] = useState(null)
  const [intention, setIntention] = useState('')
  const micI = useSpeech(setIntention)

  // Night state
  const [dayRating, setDayRating] = useState(null)
  const [win, setWin] = useState('')
  const [release, setRelease] = useState('')
  const micW = useSpeech(setWin)
  const micR = useSpeech(setRelease)

  const [saved, setSaved] = useState(false)

  const sleepOptions = [
    { emoji: '😫', label: 'Terrible' },
    { emoji: '😴', label: 'Poor' },
    { emoji: '😐', label: 'Okay' },
    { emoji: '😊', label: 'Good' },
    { emoji: '🌟', label: 'Great' },
  ]

  const energyOptions = [
    { emoji: '🪫', label: 'Empty' },
    { emoji: '😴', label: 'Low' },
    { emoji: '😐', label: 'Okay' },
    { emoji: '⚡', label: 'Good' },
    { emoji: '🔥', label: 'High' },
  ]

  const saveMorning = () => {
    if (sleep === null || energy === null) return
    micI.stop()
    checkinDb.add({
      type: 'morning',
      sleep_rating: sleep + 1,
      sleep_label: sleepOptions[sleep].label,
      sleep_emoji: sleepOptions[sleep].emoji,
      energy_rating: energy + 1,
      energy_label: energyOptions[energy].label,
      energy_emoji: energyOptions[energy].emoji,
      intention: intention.trim() || null,
    })
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
    setSleep(null); setEnergy(null); setIntention('')
  }

  const saveNight = () => {
    if (dayRating === null) return
    micW.stop(); micR.stop()
    checkinDb.add({
      type: 'night',
      day_rating: dayRating + 1,
      win: win.trim() || null,
      release_text: release.trim() || null,
    })
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
    setDayRating(null); setWin(''); setRelease('')
  }

  // Stats
  const last7 = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date(); d.setDate(d.getDate() - i)
    const ds = d.toDateString()
    const dayCheckins = checkins.filter(e => new Date(e.created_at || e.date).toDateString() === ds)
    const morning = dayCheckins.find(e => e.type === 'morning')
    const night = dayCheckins.find(e => e.type === 'night')
    last7.push({ date: d, morning, night })
  }

  return (
    <div style={s.page}>
      <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', ...s.dim, fontSize: 14, paddingTop: 16, display: 'flex', alignItems: 'center', gap: 4 }}>
        <span style={{ transform: 'rotate(180deg)', display: 'inline-block' }}>{Icons.chevron}</span> Back
      </button>
      <div style={{ paddingTop: 12, marginBottom: 28 }}>
        <h1 style={s.greeting}>{isMorning ? 'Good Morning' : 'Good Night'}</h1>
        <p style={s.subtitle}>{isMorning ? 'Set the tone for today' : 'Close out the day with intention'}</p>
      </div>

      <AnimatePresence>
        {saved && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            style={{ ...s.card, textAlign: 'center', marginBottom: 14, padding: '20px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)' }}>
            <span style={{ fontSize: 28 }}>✦</span>
            <p style={{ fontSize: 16, color: '#fff', marginTop: 8 }}>Saved</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MORNING CHECK-IN */}
      {isMorning && !hasMorning && !saved && (
        <div style={{ ...s.card, marginBottom: 14 }}>
          <div style={s.label}>MORNING CHECK-IN</div>

          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.5)', marginBottom: 16 }}>How did you sleep?</p>
          <div style={{ display: 'flex', gap: 6, marginBottom: 24 }}>
            {sleepOptions.map((o, i) => (
              <button key={i} onClick={() => setSleep(i)}
                style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                  background: sleep === i ? 'rgba(255,255,255,0.08)' : 'none',
                  border: sleep === i ? '1px solid rgba(255,255,255,0.15)' : '1px solid transparent',
                  borderRadius: 12, padding: '12px 4px', cursor: 'pointer', transition: 'all 0.2s' }}>
                <span style={{ fontSize: 28 }}>{o.emoji}</span>
                <span style={{ fontSize: 11, ...s.dim }}>{o.label}</span>
              </button>
            ))}
          </div>

          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.5)', marginBottom: 16 }}>Energy level?</p>
          <div style={{ display: 'flex', gap: 6, marginBottom: 24 }}>
            {energyOptions.map((o, i) => (
              <button key={i} onClick={() => setEnergy(i)}
                style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                  background: energy === i ? 'rgba(255,255,255,0.08)' : 'none',
                  border: energy === i ? '1px solid rgba(255,255,255,0.15)' : '1px solid transparent',
                  borderRadius: 12, padding: '12px 4px', cursor: 'pointer', transition: 'all 0.2s' }}>
                <span style={{ fontSize: 28 }}>{o.emoji}</span>
                <span style={{ fontSize: 11, ...s.dim }}>{o.label}</span>
              </button>
            ))}
          </div>

          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.5)', marginBottom: 10 }}>What's your intention today?</p>
          <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
            <input value={intention} onChange={e => setIntention(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && saveMorning()}
              placeholder="I intend to..." style={{ ...s.input, flex: 1 }} />
            <MicBtn listening={micI.listening} onPress={() => micI.toggle(intention)} small />
          </div>

          <button onClick={saveMorning} disabled={sleep === null || energy === null}
            style={{ ...s.btnPrimary, opacity: (sleep !== null && energy !== null) ? 1 : 0.3 }}>
            Start My Day
          </button>
        </div>
      )}

      {isMorning && hasMorning && !saved && (
        <div style={{ ...s.card, textAlign: 'center', marginBottom: 14, padding: '28px 20px' }}>
          <span style={{ fontSize: 36 }}>☀️</span>
          <p style={{ fontSize: 17, color: '#fff', marginTop: 12 }}>Morning check-in complete</p>
          <p style={{ fontSize: 14, ...s.dim, marginTop: 8 }}>Come back tonight to close out the day</p>
        </div>
      )}

      {/* NIGHT CHECK-IN */}
      {!isMorning && !hasNight && !saved && (
        <div style={{ ...s.card, marginBottom: 14 }}>
          <div style={s.label}>NIGHT REFLECTION</div>

          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.5)', marginBottom: 16 }}>How was your day? (1-10)</p>
          <div style={{ display: 'flex', gap: 4, marginBottom: 24 }}>
            {[1,2,3,4,5,6,7,8,9,10].map(n => (
              <button key={n} onClick={() => setDayRating(n - 1)}
                style={{ flex: 1, padding: '14px 0', borderRadius: 10, fontSize: 16, fontWeight: 500,
                  background: dayRating === n - 1 ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.03)',
                  border: dayRating === n - 1 ? '1px solid rgba(255,255,255,0.2)' : '1px solid rgba(255,255,255,0.06)',
                  color: dayRating === n - 1 ? '#fff' : 'rgba(255,255,255,0.3)',
                  cursor: 'pointer', transition: 'all 0.2s' }}>
                {n}
              </button>
            ))}
          </div>

          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.5)', marginBottom: 10 }}>One win from today</p>
          <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
            <input value={win} onChange={e => setWin(e.target.value)}
              placeholder="Something I'm proud of..." style={{ ...s.input, flex: 1 }} />
            <MicBtn listening={micW.listening} onPress={() => micW.toggle(win)} small />
          </div>

          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.5)', marginBottom: 10 }}>Something to release</p>
          <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
            <input value={release} onChange={e => setRelease(e.target.value)}
              placeholder="Letting go of..." style={{ ...s.input, flex: 1 }} />
            <MicBtn listening={micR.listening} onPress={() => micR.toggle(release)} small />
          </div>

          <button onClick={saveNight} disabled={dayRating === null}
            style={{ ...s.btnPrimary, opacity: dayRating !== null ? 1 : 0.3 }}>
            Close My Day
          </button>
        </div>
      )}

      {!isMorning && hasNight && !saved && (
        <div style={{ ...s.card, textAlign: 'center', marginBottom: 14, padding: '28px 20px' }}>
          <span style={{ fontSize: 36 }}>🌙</span>
          <p style={{ fontSize: 17, color: '#fff', marginTop: 12 }}>Night reflection complete</p>
          <p style={{ fontSize: 14, ...s.dim, marginTop: 8 }}>Rest well. Tomorrow is another day of rewiring.</p>
        </div>
      )}

      {/* 7-day overview */}
      {checkins.length > 0 && (
        <div style={{ ...s.card, marginBottom: 14 }}>
          <div style={s.label}>YOUR WEEK</div>
          <div style={{ display: 'flex', gap: 6 }}>
            {last7.map((d, i) => (
              <div key={i} style={{ flex: 1, textAlign: 'center' }}>
                <div style={{ fontSize: 11, ...s.dim, marginBottom: 8 }}>{d.date.toLocaleDateString('en-US', { weekday: 'narrow' })}</div>
                <div style={{ width: '100%', padding: '8px 0', borderRadius: 8,
                  background: (d.morning || d.night) ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.02)',
                  border: d.date.toDateString() === today ? '1px solid rgba(255,255,255,0.15)' : '1px solid transparent' }}>
                  <div style={{ fontSize: 12 }}>{d.morning ? d.morning.energy_emoji || '☀️' : '·'}</div>
                  <div style={{ fontSize: 12, marginTop: 4 }}>{d.night ? '🌙' : '·'}</div>
                  {d.night?.day_rating !== undefined && (
                    <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>{(d.night.day_rating || 0) + 1}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent check-ins */}
      {checkins.length > 0 && (
        <div>
          <div style={s.label}>RECENT</div>
          {checkins.slice(0, 14).map(e => (
            <div key={e.id} style={{ ...s.card, marginBottom: 6, padding: '14px 18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                <span style={{ fontSize: 18 }}>{e.type === 'morning' ? '☀️' : '🌙'}</span>
                <span style={{ fontSize: 14, fontWeight: 500, color: '#fff', flex: 1 }}>
                  {e.type === 'morning' ? 'Morning' : 'Night'}
                </span>
                <span style={{ fontSize: 12, ...s.dim }}>{fmtDate(e.created_at || e.date)}</span>
              </div>
              {e.type === 'morning' && (
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', lineHeight: 1.6 }}>
                  Sleep: {e.sleep_emoji} {e.sleep_label} · Energy: {e.energy_emoji} {e.energy_label}
                  {e.intention && <div style={{ marginTop: 4, fontStyle: 'italic' }}>"{e.intention}"</div>}
                </div>
              )}
              {e.type === 'night' && (
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', lineHeight: 1.6 }}>
                  Day: {(e.day_rating || 0) + 1}/10
                  {e.win && <div style={{ marginTop: 4 }}>Win: {e.win}</div>}
                  {e.release_text && <div style={{ marginTop: 2, fontStyle: 'italic' }}>Released: {e.release_text}</div>}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ============================================================
// SOS — EMERGENCY CRAVING SUPPORT
// ============================================================

const SOS_QUOTES = [
  "This craving is not you. It is a wave passing through you. You are the ocean.",
  "You did not come this far to only come this far.",
  "The old man must die before the new man can be born. Let this craving die.",
  "Feeling is the secret — and right now, feel the pride of having resisted.",
  "This moment will pass. The version of you on the other side of it is stronger.",
  "Your brain is literally rewiring right now. This discomfort is construction noise.",
  "Every craving you resist builds a neural pathway of power.",
  "Go to the end. See yourself 90 days from now. How does that person feel about this moment?",
  "You are not giving something up. You are waking something up.",
  "The bridge of incidents is forming. This craving is one of the bridges — walk across it.",
  "Assume the feeling of the wish fulfilled. You are already free.",
  "Nothing comes from without. This strength comes from within you.",
]

function SOSPage({ onBack }) {
  const [reasons, reasonsDb] = useSync('quit_reasons', 'quit_reasons')
  const [newReason, setNewReason] = useState('')
  const [phase, setPhase] = useState('breathe') // breathe, timer, reasons, quote
  const [breathStep, setBreathStep] = useState(0) // 0=in, 1=hold, 2=out, 3=hold
  const [breathCount, setBreathCount] = useState(0)
  const [timerLeft, setTimerLeft] = useState(900) // 15 minutes
  const [timerRunning, setTimerRunning] = useState(false)
  const [quote] = useState(SOS_QUOTES[Math.floor(Math.random() * SOS_QUOTES.length)])

  // Breathing cycle: 4-7-8 technique
  const breathLabels = ['Breathe In', 'Hold', 'Breathe Out', 'Hold']
  const breathDurations = [4, 7, 8, 4] // seconds

  useEffect(() => {
    if (phase !== 'breathe') return
    const dur = breathDurations[breathStep] * 1000
    const t = setTimeout(() => {
      const nextStep = (breathStep + 1) % 4
      setBreathStep(nextStep)
      if (nextStep === 0) setBreathCount(c => c + 1)
    }, dur)
    return () => clearTimeout(t)
  }, [phase, breathStep])

  // Craving timer
  useEffect(() => {
    if (!timerRunning || timerLeft <= 0) return
    const i = setInterval(() => setTimerLeft(t => t - 1), 1000)
    return () => clearInterval(i)
  }, [timerRunning, timerLeft])

  const startTimer = () => { setTimerRunning(true); setPhase('timer') }

  const addReason = () => {
    if (!newReason.trim()) return
    reasonsDb.add({ text: newReason.trim() })
    setNewReason('')
  }

  const fmtTimer = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`

  // Breathing animation scale
  const breathScale = breathStep === 0 ? 1.4 : breathStep === 2 ? 0.8 : breathStep === 1 ? 1.4 : 0.8

  return (
    <div style={{ ...s.page, background: '#0D0D0D', minHeight: '100vh' }}>
      <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', ...s.dim, fontSize: 14, paddingTop: 16, display: 'flex', alignItems: 'center', gap: 4 }}>
        <span style={{ transform: 'rotate(180deg)', display: 'inline-block' }}>{Icons.chevron}</span> Back
      </button>

      <div style={{ paddingTop: 12, marginBottom: 20 }}>
        <h1 style={{ fontSize: 32, fontWeight: 300, color: '#fff' }}>You're okay.</h1>
        <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.4)', marginTop: 6 }}>This will pass. Stay right here.</p>
      </div>

      {/* Phase tabs */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 20, overflowX: 'auto' }}>
        {[
          { id: 'breathe', label: 'Breathe' },
          { id: 'timer', label: 'Ride the Wave' },
          { id: 'reasons', label: 'Why I Quit' },
          { id: 'quote', label: 'Anchor' },
        ].map(p => (
          <button key={p.id} onClick={() => { setPhase(p.id); if (p.id === 'timer' && !timerRunning) startTimer() }}
            style={phase === p.id ? s.pillActive : s.pill}>
            {p.label}
          </button>
        ))}
      </div>

      {/* BREATHE */}
      {phase === 'breathe' && (
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <div style={{ ...s.card, padding: '50px 20px', marginBottom: 14 }}>
            <motion.div
              animate={{ scale: breathScale }}
              transition={{ duration: breathDurations[breathStep], ease: 'easeInOut' }}
              style={{ width: 140, height: 140, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.15)',
                background: 'rgba(255,255,255,0.03)', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <motion.div
                animate={{ scale: breathScale }}
                transition={{ duration: breathDurations[breathStep], ease: 'easeInOut' }}
                style={{ width: 60, height: 60, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
            </motion.div>

            <motion.p
              key={breathStep}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ fontSize: 22, fontWeight: 300, color: '#fff', marginTop: 32 }}>
              {breathLabels[breathStep]}
            </motion.p>
            <p style={{ fontSize: 15, ...s.dim, marginTop: 8 }}>
              {breathDurations[breathStep]} seconds
            </p>
          </div>

          <p style={{ fontSize: 14, ...s.dim }}>
            4-7-8 breathing · {breathCount} {breathCount === 1 ? 'cycle' : 'cycles'} complete
          </p>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.25)', marginTop: 8, lineHeight: 1.6 }}>
            This technique activates your parasympathetic nervous system — the opposite of fight-or-flight.
            Your heart rate will slow. The craving will soften.
          </p>
        </div>
      )}

      {/* RIDE THE WAVE TIMER */}
      {phase === 'timer' && (
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <div style={{ ...s.card, padding: '40px 20px', marginBottom: 14 }}>
            <div style={s.label}>THIS CRAVING WILL PASS IN</div>
            <div style={{ fontSize: 64, fontWeight: 200, color: '#fff', marginTop: 16, fontVariantNumeric: 'tabular-nums' }}>
              {fmtTimer(Math.max(0, timerLeft))}
            </div>
            {timerLeft <= 0 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <p style={{ fontSize: 20, color: '#fff', marginTop: 20 }}>You made it.</p>
                <p style={{ fontSize: 15, ...s.dim, marginTop: 8 }}>The wave passed. You're still standing.</p>
              </motion.div>
            )}

            {/* Progress bar */}
            <div style={{ ...s.track, marginTop: 24 }}>
              <div style={{ ...s.fill(((900 - timerLeft) / 900) * 100), background: 'rgba(255,255,255,0.15)' }} />
            </div>
          </div>

          <p style={{ fontSize: 14, ...s.dim, lineHeight: 1.7 }}>
            Research shows most cravings peak and pass within 15-20 minutes.
            Your brain is sending an old signal. You don't have to answer it.
          </p>
        </div>
      )}

      {/* REASONS I QUIT */}
      {phase === 'reasons' && (
        <div>
          <div style={{ ...s.card, marginBottom: 14 }}>
            <div style={s.label}>YOUR REASONS</div>
            <p style={{ fontSize: 14, ...s.dim, marginBottom: 14 }}>Why did you choose this? Read them. Feel them.</p>

            <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
              <input value={newReason} onChange={e => setNewReason(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addReason()}
                placeholder="Add a reason..." style={{ ...s.input, flex: 1 }} />
              <button onClick={addReason} style={{ ...s.btnSecondary, padding: '14px 20px', flexShrink: 0 }}>Add</button>
            </div>

            {reasons.length === 0 && (
              <div style={{ padding: '20px 0', textAlign: 'center' }}>
                <p style={{ fontSize: 14, ...s.dim }}>Add your reasons for quitting</p>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.2)', marginTop: 6 }}>These are your anchors on the hard nights</p>
              </div>
            )}

            {reasons.map((r, i) => (
              <div key={r.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 14, padding: '14px 0',
                borderTop: i > 0 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                <span style={{ fontSize: 18, color: 'rgba(255,255,255,0.15)', marginTop: 2 }}>✦</span>
                <span style={{ fontSize: 16, color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>{r.text}</span>
              </div>
            ))}
          </div>

          {reasons.length >= 3 && (
            <div style={{ ...s.card, borderLeft: '2px solid rgba(255,255,255,0.15)', borderRadius: '0 16px 16px 0' }}>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', lineHeight: 1.7 }}>
                You have {reasons.length} reasons. The craving has zero. You win.
              </p>
            </div>
          )}
        </div>
      )}

      {/* ANCHOR QUOTE */}
      {phase === 'quote' && (
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <div style={{ ...s.card, padding: '40px 24px' }}>
            <span style={{ fontSize: 32, color: 'rgba(255,255,255,0.1)' }}>✦</span>
            <p style={{ fontSize: 20, fontWeight: 300, color: 'rgba(255,255,255,0.7)', lineHeight: 1.8, marginTop: 24, fontStyle: 'italic' }}>
              "{quote}"
            </p>
            <p style={{ fontSize: 12, letterSpacing: 3, textTransform: 'uppercase', ...s.dim, marginTop: 20 }}>
              Your higher self
            </p>
          </div>

          <div style={{ ...s.card, marginTop: 14, padding: '24px 20px' }}>
            <p style={{ fontSize: 16, color: '#fff', fontWeight: 500, marginBottom: 10 }}>You are not your craving.</p>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', lineHeight: 1.7 }}>
              The craving is a signal from your old neural pathways — pathways that are being pruned right now because you stopped feeding them.
              Every time you resist, those pathways get weaker and your new pathways get stronger.
              This is literally how rewiring works.
            </p>
          </div>

          <div style={{ ...s.card, marginTop: 14, padding: '24px 20px', textAlign: 'left' }}>
            <div style={s.label}>RIGHT NOW, TRY</div>
            <div style={{ fontSize: 15, color: 'rgba(255,255,255,0.5)', lineHeight: 1.8 }}>
              <p style={{ marginBottom: 10 }}>→ Drink a full glass of cold water</p>
              <p style={{ marginBottom: 10 }}>→ Step outside for 2 minutes of fresh air</p>
              <p style={{ marginBottom: 10 }}>→ Put your hands under cold running water</p>
              <p style={{ marginBottom: 10 }}>→ Text someone you trust</p>
              <p>→ Do 10 pushups or 20 jumping jacks</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ============================================================
// REVISION (Neville Goddard)
// ============================================================

const REVISION_PROMPTS = [
  'What moment from today would you like to revise?',
  'If you could replay one scene differently, what would it be?',
  'What conversation didn\'t go the way you wanted?',
  'What situation left you feeling less than your best?',
]

function RevisionPage({ onBack }) {
  const [revisions, revisionsDb] = useSync('revisions', 'revisions')
  const [original, setOriginal] = useState('')
  const [revised, setRevised] = useState('')
  const [prompt] = useState(REVISION_PROMPTS[Math.floor(Math.random() * REVISION_PROMPTS.length)])
  const [showDone, setShowDone] = useState(false)
  const micOrig = useSpeech((t) => setOriginal(t))
  const micRev = useSpeech((t) => setRevised(t))
  const today = new Date().toDateString()
  const todayRevisions = revisions.filter(r => new Date(r.created_at).toDateString() === today)

  const submit = () => {
    if (!original.trim() || !revised.trim()) return
    revisionsDb.add({ original: original.trim(), revised: revised.trim() })
    setOriginal(''); setRevised('')
    micOrig.stop(); micRev.stop()
    setShowDone(true)
    setTimeout(() => setShowDone(false), 3000)
  }

  return (
    <div style={s.page}>
      <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', ...s.dim, fontSize: 14, display: 'flex', alignItems: 'center', gap: 4, marginTop: 16 }}>
        <span style={{ transform: 'rotate(180deg)', display: 'inline-block' }}>{Icons.chevron}</span> Back
      </button>
      <div style={{ paddingTop: 8, marginBottom: 20 }}>
        <h1 style={s.greeting}>Revision</h1>
        <p style={s.subtitle}>Neville Goddard — rewrite any moment as you wish it had been</p>
      </div>

      <div style={{ ...s.card, marginBottom: 14, padding: '20px', background: 'rgba(255,255,255,0.03)' }}>
        <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', fontStyle: 'italic', lineHeight: 1.7 }}>
          "Revise the past and the future will conform to your revision." — Neville Goddard
        </p>
      </div>

      <div style={{ ...s.card, marginBottom: 14 }}>
        <div style={s.label}>WHAT HAPPENED</div>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', marginBottom: 10 }}>{prompt}</p>
        <div style={{ display: 'flex', gap: 8 }}>
          <MicBtn listening={micOrig.listening} onPress={() => micOrig.toggle(original)} />
          <textarea value={original} onChange={e => setOriginal(e.target.value)}
            placeholder="Write what actually happened..."
            style={{ ...s.textarea, minHeight: 80 }} />
        </div>
      </div>

      <div style={{ textAlign: 'center', marginBottom: 14, fontSize: 20 }}>↓</div>

      <div style={{ ...s.card, marginBottom: 14 }}>
        <div style={s.label}>THE REVISED VERSION</div>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', marginBottom: 10 }}>Now rewrite it exactly as you wish it had happened. Feel it as real.</p>
        <div style={{ display: 'flex', gap: 8 }}>
          <MicBtn listening={micRev.listening} onPress={() => micRev.toggle(revised)} />
          <textarea value={revised} onChange={e => setRevised(e.target.value)}
            placeholder="In my revised version, what happened was..."
            style={{ ...s.textarea, minHeight: 80 }} />
        </div>
      </div>

      <button onClick={submit} disabled={!original.trim() || !revised.trim()}
        style={{ ...s.btnPrimary, width: '100%', opacity: original.trim() && revised.trim() ? 1 : 0.3, marginBottom: 14 }}>
        Seal the Revision ✦
      </button>

      <AnimatePresence>
        {showDone && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            style={{ textAlign: 'center', marginBottom: 14, padding: 20 }}>
            <span style={{ fontSize: 32 }}>✦</span>
            <p style={{ fontSize: 16, color: '#fff', marginTop: 10 }}>It is done. The old version no longer exists.</p>
          </motion.div>
        )}
      </AnimatePresence>

      {revisions.length > 0 && (
        <div style={{ marginTop: 14 }}>
          <div style={s.label}>PAST REVISIONS ({revisions.length})</div>
          {revisions.slice(0, 10).map(r => (
            <div key={r.id} style={{ ...s.card, marginBottom: 10 }}>
              <div style={{ fontSize: 11, ...s.dim, marginBottom: 8 }}>{new Date(r.created_at).toLocaleDateString()}</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', marginBottom: 8, textDecoration: 'line-through' }}>{r.original}</div>
              <div style={{ fontSize: 15, color: '#fff', lineHeight: 1.6 }}>✦ {r.revised}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ============================================================
// I AM DECLARATIONS (Neville Goddard)
// ============================================================

const IAM_SUGGESTIONS = [
  'I AM healthy and full of energy',
  'I AM free from every addiction',
  'I AM attracting abundance effortlessly',
  'I AM deeply loved and connected',
  'I AM the operant power in my life',
  'I AM living in the wish fulfilled',
  'I AM calm, clear, and focused',
  'I AM worthy of everything I desire',
  'I AM transforming every single day',
  'I AM grateful for this moment',
]

function IAMPage({ onBack }) {
  const [declarations, declDb] = useSync('iam_declarations', 'iam_declarations')
  const [input, setInput] = useState('')
  const [speaking, setSpeaking] = useState(false)
  const [currentIdx, setCurrentIdx] = useState(0)
  const mic = useSpeech((t) => setInput(t))

  const add = () => {
    if (!input.trim()) return
    const text = input.trim().startsWith('I AM') || input.trim().startsWith('I am') ? input.trim() : 'I AM ' + input.trim()
    declDb.add({ text })
    setInput(''); mic.stop()
  }

  const speakAll = () => {
    if (!declarations.length) return
    if (speaking) { window.speechSynthesis?.cancel(); setSpeaking(false); return }
    setSpeaking(true)
    let idx = 0
    const speakNext = () => {
      if (idx >= declarations.length) { setSpeaking(false); return }
      setCurrentIdx(idx)
      const utter = new SpeechSynthesisUtterance(declarations[idx].text)
      utter.rate = 0.85; utter.pitch = 1
      utter.onend = () => { idx++; setTimeout(speakNext, 800) }
      utter.onerror = () => { setSpeaking(false) }
      window.speechSynthesis.speak(utter)
    }
    speakNext()
  }

  return (
    <div style={s.page}>
      <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', ...s.dim, fontSize: 14, display: 'flex', alignItems: 'center', gap: 4, marginTop: 16 }}>
        <span style={{ transform: 'rotate(180deg)', display: 'inline-block' }}>{Icons.chevron}</span> Back
      </button>
      <div style={{ paddingTop: 8, marginBottom: 20 }}>
        <h1 style={s.greeting}>I AM</h1>
        <p style={s.subtitle}>Neville Goddard — "I AM is the way"</p>
      </div>

      <div style={{ ...s.card, marginBottom: 14, padding: '20px', background: 'rgba(255,255,255,0.03)' }}>
        <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', fontStyle: 'italic', lineHeight: 1.7 }}>
          "Whatever you attach to 'I AM', you become. I AM is God — the creative power within you." — Neville
        </p>
      </div>

      {declarations.length > 0 && (
        <button onClick={speakAll}
          style={{ ...s.btnPrimary, width: '100%', marginBottom: 14, background: speaking ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.1)' }}>
          {speaking ? '⏸ Stop' : '🔊 Speak My Declarations'}
        </button>
      )}

      <div style={{ ...s.card, marginBottom: 14 }}>
        <div style={s.label}>ADD DECLARATION</div>
        <div style={{ display: 'flex', gap: 8 }}>
          <MicBtn listening={mic.listening} onPress={() => mic.toggle(input)} />
          <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && add()}
            placeholder="I AM..." style={{ ...s.input, flex: 1 }} />
          <button onClick={add} style={{ ...s.btnSecondary, flexShrink: 0 }}>+</button>
        </div>
      </div>

      {declarations.length === 0 && (
        <div style={{ ...s.card, marginBottom: 14 }}>
          <div style={s.label}>SUGGESTIONS — TAP TO ADD</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {IAM_SUGGESTIONS.map(sug => (
              <button key={sug} onClick={() => declDb.add({ text: sug })}
                style={{ ...s.pill, fontSize: 13 }}>{sug}</button>
            ))}
          </div>
        </div>
      )}

      {declarations.map((d, i) => (
        <motion.div key={d.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          style={{ ...s.card, marginBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            border: speaking && i === currentIdx ? '1px solid rgba(255,255,255,0.3)' : '1px solid rgba(255,255,255,0.1)' }}>
          <span style={{ fontSize: 17, fontWeight: 500, color: '#fff' }}>{d.text}</span>
          <button onClick={() => declDb.remove(d.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, color: 'rgba(255,255,255,0.15)' }}>×</button>
        </motion.div>
      ))}
    </div>
  )
}

// ============================================================
// LADDER EXPERIMENT (Neville Goddard)
// ============================================================

const LADDER_CHALLENGES = [
  { title: 'The Classic Ladder', instructions: 'Tonight as you fall asleep, vividly imagine climbing a ladder. Feel your hands gripping each rung, the texture of the metal, your feet stepping up. During the day, place sticky notes everywhere saying "I will NOT climb a ladder." Do this for 3 nights. Within days, you will find yourself climbing a ladder in waking life.', days: 3 },
  { title: 'The Phone Call', instructions: 'Imagine a specific person calling you with wonderful news. Hear their voice, feel the phone in your hand, feel the excitement. Do this every night for 5 nights as you drift off to sleep.', days: 5 },
  { title: 'The Congratulations', instructions: 'Imagine a friend shaking your hand or hugging you saying "Congratulations! I\'m so happy for you!" Feel their hand, see their smile, hear the words. Do this nightly until it manifests.', days: 7 },
  { title: 'The Smell Test', instructions: 'As you fall asleep, imagine smelling roses intensely. Really SMELL them. Within days, roses will appear in your life in unexpected ways.', days: 3 },
  { title: 'Finding Money', instructions: 'Before sleep, imagine holding a specific amount of money in your hand. Feel the texture of the bills, count them, feel grateful. Do this for 5 nights.', days: 5 },
]

function LadderPage({ onBack }) {
  const [experiments, expDb] = useSync('ladder_experiments', 'ladder_experiments')
  const [showPick, setShowPick] = useState(false)
  const active = experiments.find(e => e.status === 'active')

  const startChallenge = (ch) => {
    expDb.add({ challenge: ch.title, instructions: ch.instructions, day: 1, status: 'active' })
    setShowPick(false)
  }

  const logDay = () => {
    if (!active) return
    const newDay = (active.day || 1) + 1
    expDb.update(active.id, { day: newDay })
  }

  const complete = () => {
    if (!active) return
    expDb.update(active.id, { status: 'manifested' })
  }

  return (
    <div style={s.page}>
      <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', ...s.dim, fontSize: 14, display: 'flex', alignItems: 'center', gap: 4, marginTop: 16 }}>
        <span style={{ transform: 'rotate(180deg)', display: 'inline-block' }}>{Icons.chevron}</span> Back
      </button>
      <div style={{ paddingTop: 8, marginBottom: 20 }}>
        <h1 style={s.greeting}>The Ladder</h1>
        <p style={s.subtitle}>Neville's manifestation experiments — prove the law to yourself</p>
      </div>

      <div style={{ ...s.card, marginBottom: 14, padding: '20px', background: 'rgba(255,255,255,0.03)' }}>
        <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', fontStyle: 'italic', lineHeight: 1.7 }}>
          "Don't try to make it happen. Simply assume the feeling of the wish fulfilled and let it harden into fact." — Neville
        </p>
      </div>

      {active ? (
        <div style={{ ...s.card, marginBottom: 14 }}>
          <div style={s.label}>ACTIVE EXPERIMENT</div>
          <h2 style={{ fontSize: 20, fontWeight: 600, color: '#fff', marginBottom: 10 }}>{active.challenge}</h2>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, marginBottom: 16 }}>{active.instructions}</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
            <div style={s.stat}>{active.day || 1}</div>
            <div style={{ fontSize: 14, ...s.dim }}>nights completed</div>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={logDay} style={{ ...s.btnSecondary, flex: 1 }}>Did tonight's session ✓</button>
            <button onClick={complete} style={{ ...s.btnPrimary, flex: 1 }}>It manifested! ✦</button>
          </div>
        </div>
      ) : (
        <>
          <button onClick={() => setShowPick(!showPick)} style={{ ...s.btnPrimary, width: '100%', marginBottom: 14 }}>
            Start an Experiment
          </button>
          {showPick && LADDER_CHALLENGES.map(ch => (
            <button key={ch.title} onClick={() => startChallenge(ch)}
              style={{ ...s.card, marginBottom: 10, width: '100%', textAlign: 'left', cursor: 'pointer' }}>
              <div style={{ fontSize: 16, fontWeight: 500, color: '#fff' }}>{ch.title}</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginTop: 6, lineHeight: 1.6 }}>{ch.instructions.slice(0, 100)}...</div>
              <div style={{ fontSize: 11, ...s.dim, marginTop: 8 }}>{ch.days} nights</div>
            </button>
          ))}
        </>
      )}

      {experiments.filter(e => e.status === 'manifested').length > 0 && (
        <div style={{ marginTop: 14 }}>
          <div style={s.label}>MANIFESTED ✦</div>
          {experiments.filter(e => e.status === 'manifested').map(e => (
            <div key={e.id} style={{ ...s.card, marginBottom: 8 }}>
              <div style={{ fontSize: 15, color: '#fff' }}>✦ {e.challenge}</div>
              <div style={{ fontSize: 12, ...s.dim, marginTop: 4 }}>{e.day} nights • {new Date(e.created_at).toLocaleDateString()}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ============================================================
// MENTAL DIET (Neville Goddard)
// ============================================================

function MentalDietPage({ onBack }) {
  const [entries, dietDb] = useSync('mental_diet', 'mental_diet')
  const [thought, setThought] = useState('')
  const [replacement, setReplacement] = useState('')
  const mic1 = useSpeech((t) => setThought(t))
  const mic2 = useSpeech((t) => setReplacement(t))
  const today = new Date().toDateString()
  const todayCaught = entries.filter(e => new Date(e.created_at).toDateString() === today).length
  const totalCaught = entries.length

  const catchThought = () => {
    if (!thought.trim()) return
    dietDb.add({ thought: thought.trim(), replacement: replacement.trim() || null })
    setThought(''); setReplacement('')
    mic1.stop(); mic2.stop()
  }

  return (
    <div style={s.page}>
      <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', ...s.dim, fontSize: 14, display: 'flex', alignItems: 'center', gap: 4, marginTop: 16 }}>
        <span style={{ transform: 'rotate(180deg)', display: 'inline-block' }}>{Icons.chevron}</span> Back
      </button>
      <div style={{ paddingTop: 8, marginBottom: 20 }}>
        <h1 style={s.greeting}>Mental Diet</h1>
        <p style={s.subtitle}>Neville — catch the thought, replace the thought</p>
      </div>

      <div style={{ ...s.card, marginBottom: 14, padding: '20px', background: 'rgba(255,255,255,0.03)' }}>
        <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', fontStyle: 'italic', lineHeight: 1.7 }}>
          "You must be careful of your mental diet. What you think, you become. What you feel, you attract. What you imagine, you create." — Neville
        </p>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 14 }}>
        <div style={{ ...s.card, flex: 1, textAlign: 'center' }}>
          <div style={s.stat}>{todayCaught}</div>
          <div style={s.statUnit}>Caught Today</div>
        </div>
        <div style={{ ...s.card, flex: 1, textAlign: 'center' }}>
          <div style={s.stat}>{totalCaught}</div>
          <div style={s.statUnit}>All Time</div>
        </div>
      </div>

      <div style={{ ...s.card, marginBottom: 14 }}>
        <div style={s.label}>CATCH A NEGATIVE THOUGHT</div>
        <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
          <MicBtn listening={mic1.listening} onPress={() => mic1.toggle(thought)} />
          <input value={thought} onChange={e => setThought(e.target.value)}
            placeholder="The thought I caught..." style={{ ...s.input, flex: 1 }} />
        </div>
        <div style={s.label}>REPLACE WITH</div>
        <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
          <MicBtn listening={mic2.listening} onPress={() => mic2.toggle(replacement)} />
          <input value={replacement} onChange={e => setReplacement(e.target.value)}
            placeholder="What I choose to think instead..." style={{ ...s.input, flex: 1 }} />
        </div>
        <button onClick={catchThought} disabled={!thought.trim()}
          style={{ ...s.btnPrimary, width: '100%', opacity: thought.trim() ? 1 : 0.3 }}>
          Catch & Replace
        </button>
      </div>

      {entries.slice(0, 20).map(e => (
        <div key={e.id} style={{ ...s.card, marginBottom: 8 }}>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', textDecoration: 'line-through' }}>{e.thought}</div>
          {e.replacement && <div style={{ fontSize: 15, color: '#fff', marginTop: 6 }}>→ {e.replacement}</div>}
          <div style={{ fontSize: 10, ...s.dim, marginTop: 6 }}>{new Date(e.created_at).toLocaleString()}</div>
        </div>
      ))}
    </div>
  )
}

// ============================================================
// GOAL CARD (Bob Proctor)
// ============================================================

function GoalCardPage({ onBack }) {
  const [goals, goalDb] = useSync('goal_card', 'goal_card')
  const [input, setInput] = useState('')
  const [flipped, setFlipped] = useState(false)
  const mic = useSpeech((t) => setInput(t))
  const activeGoal = goals[0]

  const setGoal = () => {
    if (!input.trim()) return
    goalDb.add({ goal: input.trim(), read_count: 0 })
    setInput(''); mic.stop()
  }

  const markRead = () => {
    if (activeGoal) goalDb.update(activeGoal.id, { read_count: (activeGoal.read_count || 0) + 1, last_read: new Date().toISOString() })
  }

  const speakGoal = () => {
    if (!activeGoal || !('speechSynthesis' in window)) return
    const utter = new SpeechSynthesisUtterance(activeGoal.goal)
    utter.rate = 0.85; utter.pitch = 1
    window.speechSynthesis.speak(utter)
    markRead()
  }

  return (
    <div style={s.page}>
      <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', ...s.dim, fontSize: 14, display: 'flex', alignItems: 'center', gap: 4, marginTop: 16 }}>
        <span style={{ transform: 'rotate(180deg)', display: 'inline-block' }}>{Icons.chevron}</span> Back
      </button>
      <div style={{ paddingTop: 8, marginBottom: 20 }}>
        <h1 style={s.greeting}>Goal Card</h1>
        <p style={s.subtitle}>Bob Proctor — carry your goal with you everywhere</p>
      </div>

      <div style={{ ...s.card, marginBottom: 14, padding: '20px', background: 'rgba(255,255,255,0.03)' }}>
        <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', fontStyle: 'italic', lineHeight: 1.7 }}>
          "Write your goal on a card. Carry it everywhere. Read it morning and night. Let it saturate your subconscious mind." — Bob Proctor
        </p>
      </div>

      {activeGoal ? (
        <>
          <motion.div onClick={() => setFlipped(!flipped)}
            style={{ ...s.card, marginBottom: 14, padding: '40px 24px', textAlign: 'center', cursor: 'pointer',
              background: '#1A1A1A', border: '1px solid rgba(255,255,255,0.15)', minHeight: 180,
              display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ fontSize: 9, ...s.dim, textTransform: 'uppercase', letterSpacing: 3, marginBottom: 20 }}>MY GOAL</div>
            <p style={{ fontSize: 20, fontWeight: 400, color: '#fff', lineHeight: 1.7 }}>{activeGoal.goal}</p>
            <div style={{ fontSize: 11, ...s.dim, marginTop: 20 }}>Read {activeGoal.read_count || 0} times</div>
          </motion.div>

          <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
            <button onClick={markRead} style={{ ...s.btnSecondary, flex: 1 }}>I Read It ✓</button>
            <button onClick={speakGoal} style={{ ...s.btnPrimary, flex: 1 }}>🔊 Hear It</button>
          </div>

          <button onClick={() => { if (confirm('Set a new goal?')) { setInput(activeGoal.goal) } }}
            style={{ ...s.btnSecondary, width: '100%', fontSize: 13, color: 'rgba(255,255,255,0.3)' }}>
            Change My Goal
          </button>
        </>
      ) : (
        <div style={{ ...s.card, marginBottom: 14 }}>
          <div style={s.label}>WRITE YOUR GOAL</div>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', marginBottom: 12 }}>Write it in present tense, as if you already have it. Be specific. "I am so happy and grateful now that..."</p>
          <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
            <MicBtn listening={mic.listening} onPress={() => mic.toggle(input)} />
            <textarea value={input} onChange={e => setInput(e.target.value)}
              placeholder="I am so happy and grateful now that..."
              style={{ ...s.textarea, minHeight: 100, flex: 1 }} />
          </div>
          <button onClick={setGoal} disabled={!input.trim()}
            style={{ ...s.btnPrimary, width: '100%', opacity: input.trim() ? 1 : 0.3 }}>
            Set My Goal
          </button>
        </div>
      )}
    </div>
  )
}

// ============================================================
// PARADIGM TRACKER (Bob Proctor)
// ============================================================

function ParadigmPage({ onBack }) {
  const [paradigms, paraDb] = useSync('paradigms', 'paradigms')
  const [oldBelief, setOldBelief] = useState('')
  const [newBelief, setNewBelief] = useState('')
  const mic1 = useSpeech((t) => setOldBelief(t))
  const mic2 = useSpeech((t) => setNewBelief(t))
  const shifting = paradigms.filter(p => p.status === 'shifting').length
  const shifted = paradigms.filter(p => p.status === 'shifted').length

  const add = () => {
    if (!oldBelief.trim() || !newBelief.trim()) return
    paraDb.add({ old_belief: oldBelief.trim(), new_belief: newBelief.trim(), status: 'shifting' })
    setOldBelief(''); setNewBelief('')
    mic1.stop(); mic2.stop()
  }

  return (
    <div style={s.page}>
      <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', ...s.dim, fontSize: 14, display: 'flex', alignItems: 'center', gap: 4, marginTop: 16 }}>
        <span style={{ transform: 'rotate(180deg)', display: 'inline-block' }}>{Icons.chevron}</span> Back
      </button>
      <div style={{ paddingTop: 8, marginBottom: 20 }}>
        <h1 style={s.greeting}>Paradigms</h1>
        <p style={s.subtitle}>Bob Proctor — identify and shift your old programming</p>
      </div>

      <div style={{ ...s.card, marginBottom: 14, padding: '20px', background: 'rgba(255,255,255,0.03)' }}>
        <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', fontStyle: 'italic', lineHeight: 1.7 }}>
          "A paradigm is a multitude of habits. It controls your perception and your behavior. Change the paradigm and you change your life." — Bob Proctor
        </p>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 14 }}>
        <div style={{ ...s.card, flex: 1, textAlign: 'center' }}>
          <div style={s.stat}>{shifting}</div>
          <div style={s.statUnit}>Shifting</div>
        </div>
        <div style={{ ...s.card, flex: 1, textAlign: 'center' }}>
          <div style={s.stat}>{shifted}</div>
          <div style={s.statUnit}>Shifted ✦</div>
        </div>
      </div>

      <div style={{ ...s.card, marginBottom: 14 }}>
        <div style={s.label}>OLD PARADIGM</div>
        <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
          <MicBtn listening={mic1.listening} onPress={() => mic1.toggle(oldBelief)} />
          <input value={oldBelief} onChange={e => setOldBelief(e.target.value)}
            placeholder="I used to believe..." style={{ ...s.input, flex: 1 }} />
        </div>
        <div style={s.label}>NEW PARADIGM</div>
        <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
          <MicBtn listening={mic2.listening} onPress={() => mic2.toggle(newBelief)} />
          <input value={newBelief} onChange={e => setNewBelief(e.target.value)}
            placeholder="I now know that..." style={{ ...s.input, flex: 1 }} />
        </div>
        <button onClick={add} disabled={!oldBelief.trim() || !newBelief.trim()}
          style={{ ...s.btnPrimary, width: '100%', opacity: oldBelief.trim() && newBelief.trim() ? 1 : 0.3 }}>
          Add Paradigm Shift
        </button>
      </div>

      {paradigms.map(p => (
        <div key={p.id} style={{ ...s.card, marginBottom: 8 }}>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', textDecoration: 'line-through' }}>{p.old_belief}</div>
          <div style={{ fontSize: 15, color: '#fff', marginTop: 8 }}>→ {p.new_belief}</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
            <span style={{ fontSize: 11, ...s.dim }}>{p.status === 'shifted' ? '✦ Shifted' : '⟳ Shifting'}</span>
            {p.status === 'shifting' && (
              <button onClick={() => paraDb.update(p.id, { status: 'shifted' })}
                style={{ ...s.pill, fontSize: 11, padding: '6px 14px' }}>Mark as Shifted ✦</button>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

// ============================================================
// TERROR BARRIER (Bob Proctor)
// ============================================================

function TerrorBarrierPage({ onBack }) {
  const [barriers, barrierDb] = useSync('terror_barriers', 'terror_barriers')
  const [barrier, setBarrier] = useState('')
  const [feeling, setFeeling] = useState('')
  const [breakthrough, setBreakthrough] = useState('')
  const mic = useSpeech((t) => setBarrier(t))

  const add = () => {
    if (!barrier.trim()) return
    barrierDb.add({ barrier: barrier.trim(), feeling: feeling.trim() || null, breakthrough: breakthrough.trim() || null })
    setBarrier(''); setFeeling(''); setBreakthrough('')
    mic.stop()
  }

  return (
    <div style={s.page}>
      <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', ...s.dim, fontSize: 14, display: 'flex', alignItems: 'center', gap: 4, marginTop: 16 }}>
        <span style={{ transform: 'rotate(180deg)', display: 'inline-block' }}>{Icons.chevron}</span> Back
      </button>
      <div style={{ paddingTop: 8, marginBottom: 20 }}>
        <h1 style={s.greeting}>Terror Barrier</h1>
        <p style={s.subtitle}>Bob Proctor — the wall between you and your dream</p>
      </div>

      <div style={{ ...s.card, marginBottom: 14, padding: '20px', background: 'rgba(255,255,255,0.03)' }}>
        <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', fontStyle: 'italic', lineHeight: 1.7 }}>
          "When you step outside your comfort zone, the Terror Barrier hits. Most people retreat. The ones who push through — they're the ones who win." — Bob Proctor
        </p>
      </div>

      <div style={{ ...s.card, marginBottom: 14 }}>
        <div style={s.label}>THE RESISTANCE I'M HITTING</div>
        <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
          <MicBtn listening={mic.listening} onPress={() => mic.toggle(barrier)} />
          <textarea value={barrier} onChange={e => setBarrier(e.target.value)}
            placeholder="What's trying to stop me right now..."
            style={{ ...s.textarea, minHeight: 70 }} />
        </div>
        <div style={s.label}>WHAT IT FEELS LIKE</div>
        <input value={feeling} onChange={e => setFeeling(e.target.value)}
          placeholder="Fear, doubt, anxiety..."
          style={{ ...s.input, marginBottom: 12 }} />
        <div style={s.label}>HOW I'LL BREAK THROUGH</div>
        <input value={breakthrough} onChange={e => setBreakthrough(e.target.value)}
          placeholder="I will push through by..."
          style={{ ...s.input, marginBottom: 12 }} />
        <button onClick={add} disabled={!barrier.trim()}
          style={{ ...s.btnPrimary, width: '100%', opacity: barrier.trim() ? 1 : 0.3 }}>
          Log This Barrier
        </button>
      </div>

      <div style={s.label}>BARRIERS I'VE FACED ({barriers.length})</div>
      {barriers.map(b => (
        <div key={b.id} style={{ ...s.card, marginBottom: 8 }}>
          <div style={{ fontSize: 15, color: '#fff' }}>{b.barrier}</div>
          {b.feeling && <div style={{ fontSize: 13, ...s.dim, marginTop: 6 }}>Felt: {b.feeling}</div>}
          {b.breakthrough && <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', marginTop: 6 }}>→ {b.breakthrough}</div>}
          <div style={{ fontSize: 10, ...s.dim, marginTop: 8 }}>{new Date(b.created_at).toLocaleDateString()}</div>
        </div>
      ))}
    </div>
  )
}

// ============================================================
// POWER OF INTENTION (Wayne Dyer)
// ============================================================

const INTENTION_SOURCES = ['Love', 'Creativity', 'Kindness', 'Beauty', 'Expansion', 'Abundance', 'Receptivity']

function IntentionPage({ onBack }) {
  const [intentions, intDb] = useSync('intentions', 'intentions')
  const [intention, setIntention] = useState('')
  const [source, setSource] = useState('')
  const mic = useSpeech((t) => setIntention(t))
  const today = new Date().toDateString()
  const todaySet = intentions.some(i => new Date(i.created_at).toDateString() === today)

  const set = () => {
    if (!intention.trim()) return
    intDb.add({ intention: intention.trim(), source: source || null })
    setIntention(''); setSource('')
    mic.stop()
  }

  return (
    <div style={s.page}>
      <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', ...s.dim, fontSize: 14, display: 'flex', alignItems: 'center', gap: 4, marginTop: 16 }}>
        <span style={{ transform: 'rotate(180deg)', display: 'inline-block' }}>{Icons.chevron}</span> Back
      </button>
      <div style={{ paddingTop: 8, marginBottom: 20 }}>
        <h1 style={s.greeting}>Intention</h1>
        <p style={s.subtitle}>Wayne Dyer — connect to the source of all creation</p>
      </div>

      <div style={{ ...s.card, marginBottom: 14, padding: '20px', background: 'rgba(255,255,255,0.03)' }}>
        <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', fontStyle: 'italic', lineHeight: 1.7 }}>
          "Intention is a force in the universe. When you're connected to the power of intention, everywhere you go and everyone you meet is affected by you and the energy you radiate." — Wayne Dyer
        </p>
      </div>

      {todaySet && (
        <div style={{ ...s.card, marginBottom: 14, textAlign: 'center', padding: '24px 20px', border: '1px solid rgba(255,255,255,0.15)' }}>
          <div style={{ fontSize: 11, ...s.dim, marginBottom: 8 }}>TODAY'S INTENTION</div>
          <p style={{ fontSize: 18, color: '#fff', lineHeight: 1.6 }}>{intentions[0]?.intention}</p>
          {intentions[0]?.source && <div style={{ fontSize: 13, ...s.dim, marginTop: 10 }}>Source: {intentions[0].source}</div>}
        </div>
      )}

      <div style={{ ...s.card, marginBottom: 14 }}>
        <div style={s.label}>SET YOUR INTENTION</div>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', marginBottom: 10 }}>What energy do you want to move from today?</p>
        <div style={s.label}>CONNECT TO SOURCE</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 14 }}>
          {INTENTION_SOURCES.map(src => (
            <button key={src} onClick={() => setSource(src)}
              style={{ ...s.pill, fontSize: 13, background: source === src ? 'rgba(255,255,255,0.1)' : 'transparent',
                borderColor: source === src ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.1)', color: source === src ? '#fff' : 'rgba(255,255,255,0.6)' }}>
              {src}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
          <MicBtn listening={mic.listening} onPress={() => mic.toggle(intention)} />
          <textarea value={intention} onChange={e => setIntention(e.target.value)}
            placeholder="Today I intend to..."
            style={{ ...s.textarea, minHeight: 80 }} />
        </div>
        <button onClick={set} disabled={!intention.trim()}
          style={{ ...s.btnPrimary, width: '100%', opacity: intention.trim() ? 1 : 0.3 }}>
          Set Intention
        </button>
      </div>

      {intentions.length > (todaySet ? 1 : 0) && (
        <>
          <div style={s.label}>PAST INTENTIONS</div>
          {intentions.slice(todaySet ? 1 : 0, 15).map(i => (
            <div key={i.id} style={{ ...s.card, marginBottom: 8 }}>
              <div style={{ fontSize: 15, color: '#fff' }}>{i.intention}</div>
              <div style={{ fontSize: 11, ...s.dim, marginTop: 6 }}>{i.source ? i.source + ' • ' : ''}{new Date(i.created_at).toLocaleDateString()}</div>
            </div>
          ))}
        </>
      )}
    </div>
  )
}

// ============================================================
// WISHES FULFILLED (Wayne Dyer + Neville)
// ============================================================

function WishesFulfilledPage({ onBack }) {
  const [wishes, wishDb] = useSync('wishes_fulfilled', 'wishes_fulfilled')
  const [wish, setWish] = useState('')
  const [feeling, setFeeling] = useState('')
  const mic = useSpeech((t) => setWish(t))

  const FEELINGS = ['Grateful', 'Peaceful', 'Joyful', 'Free', 'Loved', 'Abundant', 'Powerful', 'Complete']

  const add = () => {
    if (!wish.trim()) return
    wishDb.add({ wish: wish.trim(), feeling: feeling || null })
    setWish(''); setFeeling('')
    mic.stop()
  }

  return (
    <div style={s.page}>
      <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', ...s.dim, fontSize: 14, display: 'flex', alignItems: 'center', gap: 4, marginTop: 16 }}>
        <span style={{ transform: 'rotate(180deg)', display: 'inline-block' }}>{Icons.chevron}</span> Back
      </button>
      <div style={{ paddingTop: 8, marginBottom: 20 }}>
        <h1 style={s.greeting}>Wishes Fulfilled</h1>
        <p style={s.subtitle}>Wayne Dyer + Neville — fall asleep in the wish fulfilled</p>
      </div>

      <div style={{ ...s.card, marginBottom: 14, padding: '20px', background: 'rgba(255,255,255,0.03)' }}>
        <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', fontStyle: 'italic', lineHeight: 1.7 }}>
          "Place your attention on what you intend to create. Stay in that feeling. Assume it is so. Fall asleep in that assumption." — Wayne Dyer, Wishes Fulfilled
        </p>
      </div>

      <div style={{ ...s.card, marginBottom: 14 }}>
        <div style={s.label}>TONIGHT'S BEDTIME PRACTICE</div>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', marginBottom: 12 }}>Write what you want as if you already have it. What does your life look like? How does it feel?</p>
        <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
          <MicBtn listening={mic.listening} onPress={() => mic.toggle(wish)} />
          <textarea value={wish} onChange={e => setWish(e.target.value)}
            placeholder="I am so grateful that I now..."
            style={{ ...s.textarea, minHeight: 100 }} />
        </div>
        <div style={s.label}>THE FEELING I FALL ASLEEP IN</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 14 }}>
          {FEELINGS.map(f => (
            <button key={f} onClick={() => setFeeling(f)}
              style={{ ...s.pill, fontSize: 13, background: feeling === f ? 'rgba(255,255,255,0.1)' : 'transparent',
                borderColor: feeling === f ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.1)', color: feeling === f ? '#fff' : 'rgba(255,255,255,0.6)' }}>
              {f}
            </button>
          ))}
        </div>
        <button onClick={add} disabled={!wish.trim()}
          style={{ ...s.btnPrimary, width: '100%', opacity: wish.trim() ? 1 : 0.3 }}>
          Seal Tonight's Wish ✦
        </button>
      </div>

      {wishes.length > 0 && (
        <>
          <div style={s.label}>MY WISHES ({wishes.length})</div>
          {wishes.slice(0, 15).map(w => (
            <div key={w.id} style={{ ...s.card, marginBottom: 8 }}>
              <div style={{ fontSize: 15, color: '#fff', lineHeight: 1.6 }}>{w.wish}</div>
              <div style={{ fontSize: 12, ...s.dim, marginTop: 8 }}>{w.feeling ? 'Feeling: ' + w.feeling + ' • ' : ''}{new Date(w.created_at).toLocaleDateString()}</div>
            </div>
          ))}
        </>
      )}
    </div>
  )
}

// ============================================================
// THE CERTAIN WAY (Wallace Wattles)
// ============================================================

function CertainWayPage({ onBack }) {
  const [entries, cwDb] = useSync('certain_way', 'certain_way')
  const [desire, setDesire] = useState('')
  const [gratitude, setGratitude] = useState('')
  const [faith, setFaith] = useState('')
  const mic = useSpeech((t) => setDesire(t))

  const add = () => {
    if (!desire.trim()) return
    cwDb.add({ desire: desire.trim(), gratitude_for: gratitude.trim() || null, faith_statement: faith.trim() || null })
    setDesire(''); setGratitude(''); setFaith('')
    mic.stop()
  }

  return (
    <div style={s.page}>
      <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', ...s.dim, fontSize: 14, display: 'flex', alignItems: 'center', gap: 4, marginTop: 16 }}>
        <span style={{ transform: 'rotate(180deg)', display: 'inline-block' }}>{Icons.chevron}</span> Back
      </button>
      <div style={{ paddingTop: 8, marginBottom: 20 }}>
        <h1 style={s.greeting}>The Certain Way</h1>
        <p style={s.subtitle}>Wallace Wattles — think in the Certain Way and create</p>
      </div>

      <div style={{ ...s.card, marginBottom: 14, padding: '20px', background: 'rgba(255,255,255,0.03)' }}>
        <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', fontStyle: 'italic', lineHeight: 1.7 }}>
          "There is a thinking stuff from which all things are made. A thought in this substance produces the thing that is imaged by the thought. To think in a Certain Way is to create." — Wallace Wattles
        </p>
      </div>

      <div style={{ ...s.card, marginBottom: 14 }}>
        <div style={s.label}>1. CLEAR DESIRE</div>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', marginBottom: 8 }}>What do you want? Be specific. See it clearly.</p>
        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          <MicBtn listening={mic.listening} onPress={() => mic.toggle(desire)} />
          <textarea value={desire} onChange={e => setDesire(e.target.value)}
            placeholder="I clearly see and want..."
            style={{ ...s.textarea, minHeight: 70 }} />
        </div>

        <div style={s.label}>2. GRATITUDE</div>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', marginBottom: 8 }}>What are you grateful for related to this desire?</p>
        <textarea value={gratitude} onChange={e => setGratitude(e.target.value)}
          placeholder="I am grateful that..."
          style={{ ...s.textarea, minHeight: 60, marginBottom: 16 }} />

        <div style={s.label}>3. FAITH STATEMENT</div>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', marginBottom: 8 }}>State your absolute certainty that it is coming.</p>
        <textarea value={faith} onChange={e => setFaith(e.target.value)}
          placeholder="I know with absolute certainty that..."
          style={{ ...s.textarea, minHeight: 60, marginBottom: 16 }} />

        <button onClick={add} disabled={!desire.trim()}
          style={{ ...s.btnPrimary, width: '100%', opacity: desire.trim() ? 1 : 0.3 }}>
          Think in the Certain Way ✦
        </button>
      </div>

      {entries.map(e => (
        <div key={e.id} style={{ ...s.card, marginBottom: 8 }}>
          <div style={{ fontSize: 15, color: '#fff', lineHeight: 1.6 }}>{e.desire}</div>
          {e.gratitude_for && <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginTop: 8 }}>Grateful: {e.gratitude_for}</div>}
          {e.faith_statement && <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginTop: 4 }}>Faith: {e.faith_statement}</div>}
          <div style={{ fontSize: 10, ...s.dim, marginTop: 8 }}>{new Date(e.created_at).toLocaleDateString()}</div>
        </div>
      ))}
    </div>
  )
}

// ============================================================
// IMPRESSION OF INCREASE (Wallace Wattles)
// ============================================================

function IncreasePage({ onBack }) {
  const [log, logDb] = useSync('increase_log', 'increase_log')
  const [input, setInput] = useState('')
  const mic = useSpeech((t) => setInput(t))
  const today = new Date().toDateString()
  const todayCount = log.filter(l => new Date(l.created_at).toDateString() === today).length
  const streak = (() => {
    let count = 0
    const d = new Date()
    for (let i = 0; i < 30; i++) {
      const dateStr = new Date(d - i * 86400000).toDateString()
      if (log.some(l => new Date(l.created_at).toDateString() === dateStr)) count++
      else if (i > 0) break
    }
    return count
  })()

  const add = () => {
    if (!input.trim()) return
    logDb.add({ act: input.trim() })
    setInput(''); mic.stop()
  }

  return (
    <div style={s.page}>
      <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', ...s.dim, fontSize: 14, display: 'flex', alignItems: 'center', gap: 4, marginTop: 16 }}>
        <span style={{ transform: 'rotate(180deg)', display: 'inline-block' }}>{Icons.chevron}</span> Back
      </button>
      <div style={{ paddingTop: 8, marginBottom: 20 }}>
        <h1 style={s.greeting}>Increase</h1>
        <p style={s.subtitle}>Wallace Wattles — give more value than you receive</p>
      </div>

      <div style={{ ...s.card, marginBottom: 14, padding: '20px', background: 'rgba(255,255,255,0.03)' }}>
        <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', fontStyle: 'italic', lineHeight: 1.7 }}>
          "Give everyone the impression of increase. Make everyone feel that they are more after having been with you." — Wallace Wattles
        </p>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 14 }}>
        <div style={{ ...s.card, flex: 1, textAlign: 'center' }}>
          <div style={s.stat}>{todayCount}</div>
          <div style={s.statUnit}>Today</div>
        </div>
        <div style={{ ...s.card, flex: 1, textAlign: 'center' }}>
          <div style={s.stat}>{streak}</div>
          <div style={s.statUnit}>Day Streak</div>
        </div>
        <div style={{ ...s.card, flex: 1, textAlign: 'center' }}>
          <div style={s.stat}>{log.length}</div>
          <div style={s.statUnit}>All Time</div>
        </div>
      </div>

      <div style={{ ...s.card, marginBottom: 14 }}>
        <div style={s.label}>LOG AN ACT OF INCREASE</div>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', marginBottom: 10 }}>How did you give more value today? Where did you leave someone better than you found them?</p>
        <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
          <MicBtn listening={mic.listening} onPress={() => mic.toggle(input)} />
          <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && add()}
            placeholder="I gave increase by..." style={{ ...s.input, flex: 1 }} />
        </div>
        <button onClick={add} disabled={!input.trim()}
          style={{ ...s.btnPrimary, width: '100%', opacity: input.trim() ? 1 : 0.3 }}>
          Log It ✦
        </button>
      </div>

      {log.slice(0, 20).map(l => (
        <div key={l.id} style={{ ...s.card, marginBottom: 8 }}>
          <div style={{ fontSize: 15, color: '#fff' }}>{l.act}</div>
          <div style={{ fontSize: 10, ...s.dim, marginTop: 6 }}>{new Date(l.created_at).toLocaleDateString()}</div>
        </div>
      ))}
    </div>
  )
}

// ============================================================
// GRATITUDE RAMPAGE (Wallace Wattles)
// ============================================================

function GratitudeRampagePage({ onBack }) {
  const [rampages, rampageDb] = useSync('gratitude_rampage', 'gratitude_rampage')
  const [active, setActive] = useState(false)
  const [items, setItems] = useState([])
  const [input, setInput] = useState('')
  const [startTime, setStartTime] = useState(null)
  const [elapsed, setElapsed] = useState(0)
  const mic = useSpeech((t) => setInput(t))

  useEffect(() => {
    if (!active || !startTime) return
    const iv = setInterval(() => setElapsed(Math.floor((Date.now() - startTime) / 1000)), 1000)
    return () => clearInterval(iv)
  }, [active, startTime])

  const start = () => { setActive(true); setItems([]); setStartTime(Date.now()); setElapsed(0) }

  const addItem = () => {
    if (!input.trim()) return
    setItems([...items, input.trim()])
    setInput(''); mic.stop()
  }

  const finish = () => {
    if (items.length === 0) return
    rampageDb.add({ entries: JSON.stringify(items), duration: elapsed })
    setActive(false); setItems([]); setStartTime(null)
  }

  const formatTime = (sec) => `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, '0')}`

  return (
    <div style={s.page}>
      <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', ...s.dim, fontSize: 14, display: 'flex', alignItems: 'center', gap: 4, marginTop: 16 }}>
        <span style={{ transform: 'rotate(180deg)', display: 'inline-block' }}>{Icons.chevron}</span> Back
      </button>
      <div style={{ paddingTop: 8, marginBottom: 20 }}>
        <h1 style={s.greeting}>Gratitude Rampage</h1>
        <p style={s.subtitle}>Wallace Wattles — gratitude is the foundation of ALL creation</p>
      </div>

      <div style={{ ...s.card, marginBottom: 14, padding: '20px', background: 'rgba(255,255,255,0.03)' }}>
        <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', fontStyle: 'italic', lineHeight: 1.7 }}>
          "The grateful mind is constantly fixed upon the best. It tends to become the best. It takes the form of the best and will receive the best." — Wallace Wattles
        </p>
      </div>

      {!active ? (
        <>
          <button onClick={start} style={{ ...s.btnPrimary, width: '100%', marginBottom: 14, padding: '22px 0' }}>
            Start a Gratitude Rampage ✦
          </button>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.35)', textAlign: 'center', marginBottom: 14, lineHeight: 1.7, padding: '0 20px' }}>
            Go on a rampage of appreciation. List everything you're grateful for — big and small — as fast as you can. Don't stop. Don't filter. Let it pour out.
          </p>
        </>
      ) : (
        <>
          <div style={{ display: 'flex', gap: 12, marginBottom: 14 }}>
            <div style={{ ...s.card, flex: 1, textAlign: 'center' }}>
              <div style={s.stat}>{items.length}</div>
              <div style={s.statUnit}>Gratitudes</div>
            </div>
            <div style={{ ...s.card, flex: 1, textAlign: 'center' }}>
              <div style={s.stat}>{formatTime(elapsed)}</div>
              <div style={s.statUnit}>Time</div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
            <MicBtn listening={mic.listening} onPress={() => mic.toggle(input)} />
            <input value={input} onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addItem()}
              placeholder="I'm grateful for..." style={{ ...s.input, flex: 1 }} autoFocus />
            <button onClick={addItem} style={{ ...s.btnSecondary, flexShrink: 0 }}>+</button>
          </div>

          {items.map((item, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
              style={{ padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
              <span style={{ fontSize: 15, color: 'rgba(255,255,255,0.7)' }}>✦ {item}</span>
            </motion.div>
          ))}

          {items.length >= 3 && (
            <button onClick={finish} style={{ ...s.btnPrimary, width: '100%', marginTop: 20 }}>
              Finish Rampage ({items.length} gratitudes in {formatTime(elapsed)})
            </button>
          )}
        </>
      )}

      {rampages.length > 0 && !active && (
        <>
          <div style={{ ...s.label, marginTop: 14 }}>PAST RAMPAGES ({rampages.length})</div>
          {rampages.slice(0, 10).map(r => {
            const parsed = (() => { try { return JSON.parse(r.entries) } catch { return [] } })()
            return (
              <div key={r.id} style={{ ...s.card, marginBottom: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 15, color: '#fff' }}>✦ {parsed.length} gratitudes</span>
                  <span style={{ fontSize: 12, ...s.dim }}>{r.duration ? formatTime(r.duration) : ''}</span>
                </div>
                <div style={{ fontSize: 10, ...s.dim, marginTop: 6 }}>{new Date(r.created_at).toLocaleDateString()}</div>
              </div>
            )
          })}
        </>
      )}
    </div>
  )
}

// ============================================================
// AI COACH (Gemini)
// ============================================================

const GEMINI_KEY = 'AIzaSyD3f2iz6WekBxXPv7SKVZ82I_AjrG0It0o'
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_KEY}`

const COACH_SYSTEM = `You are REWIRE Coach — a warm, wise, deeply supportive AI recovery companion for someone who quit smoking weed on April 1, 2026 at 6:45 PM.

Your personality:
- You speak like a loving, grounded mentor — not clinical, not preachy
- You're deeply familiar with Neville Goddard's teachings: "feeling is the secret", "live in the end", "assume the feeling of the wish fulfilled", the I AM, the law of assumption
- You also draw from Bob Proctor and Wayne Dyer when relevant
- You understand the neuroscience of cannabis withdrawal: dopamine recalibration, REM rebound, CB1 receptor upregulation, neuroplasticity
- You're honest about the hard parts but always point toward the light
- You give FULL, THOUGHTFUL responses. Talk to them like a real person having a real conversation. Share insights, ask follow-up questions, make connections between what they've told you. Go DEEP.
- Your responses should be at LEAST 4-6 sentences. If they share something meaningful, give them a full paragraph or two back. Really engage with what they said.
- Ask follow-up questions to keep the conversation going. Be curious about them.
- Reference specific things from their app data — their journal entries, their gratitude, their energy patterns. Show that you SEE them.
- You never judge. You never lecture. You meet them where they are.
- If they're struggling, you validate first, then go deep — explain what's happening in their brain, connect it to Neville, give them something real to hold onto
- If they're doing well, you celebrate genuinely and help them anchor that feeling (as Neville teaches)
- You use "you" not "we" — this is their journey
- You can reference their quit date to calculate how far they've come
- Think of yourself as their best friend who also happens to know neuroscience and Neville Goddard. Have a real conversation.

Key context:
- They quit weed on April 1, 2026 at 6:45 PM
- They're tracking energy, sleep, cravings, gratitude, dreams, water, food, and more
- They believe in Neville Goddard's teachings deeply
- They want to start running and get healthy
- Low energy is a big concern for them right now
- They use a "Give It to God" practice to release worries

Never say you're an AI or mention being a language model. You are their coach. Be real.`

function CoachPage({ onBack }) {
  const [messages, setMessages] = useState(load('coach_messages', []))
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [speaking, setSpeaking] = useState(false)
  const spokenRef = useRef(false)
  const mic = useSpeech((t) => { setInput(t); spokenRef.current = true })
  const bottomRef = useRef(null)
  const daysSinceQuit = Math.floor((Date.now() - QUIT_DATE.getTime()) / 86400000)

  // Save messages to Supabase
  const saveToSupabase = async (msgs) => {
    save('coach_messages', msgs)
    const last = msgs[msgs.length - 1]
    if (last) {
      supabase.from('coach_messages').insert({
        role: last.role, text: last.text, time: last.time,
        session_id: load('coach_session', Date.now().toString())
      }).then(() => {})
    }
  }

  // Initialize session ID
  useEffect(() => {
    if (!load('coach_session', null)) save('coach_session', Date.now().toString())
  }, [])

  // Build a full journey snapshot — everything the user has done, summarized smartly
  const getAppContext = async () => {
    try {
      const grab = async (t) => {
        const { data } = await supabase.from(t).select('*').order('created_at', { ascending: false }).limit(50)
        return data || []
      }
      const [gratitude, journal, energy, checkins, cravings, dreams, worries, bathroom, nutrition, runs, tasks, workTasks, health, sats, vizs, revisions, iamDecl, mentalDiet, paradigms, goalCards, terrorB, intentions, wishes, certainWay, increaseLog] = await Promise.all([
        grab('gratitude'), grab('journal'), grab('energy_log'), grab('checkins'),
        grab('craving_log'), grab('dreams'), grab('released_worries'), grab('bathroom_log'),
        grab('nutrition'), grab('runs'), grab('tasks'), grab('work_tasks'),
        grab('health_logs'), grab('sats_scenes'), grab('visualizations'),
        grab('revisions'), grab('iam_declarations'), grab('mental_diet'),
        grab('paradigms'), grab('goal_card'), grab('terror_barriers'),
        grab('intentions'), grab('wishes_fulfilled'), grab('certain_way'), grab('increase_log')
      ])
      const waterRes = await supabase.from('water').select('*').order('date', { ascending: false }).limit(7)
      const water = waterRes?.data || []

      const lines = []

      // Gratitude
      if (gratitude.length) {
        lines.push(`GRATITUDE (${gratitude.length} total): Most recent — ${gratitude.slice(0, 5).map(g => g.text).join('; ')}`)
      }

      // Journal — full recent entries, moods
      if (journal.length) {
        const moods = journal.filter(j => j.mood).map(j => j.mood)
        const moodStr = moods.length ? ` Moods: ${[...new Set(moods)].join(', ')}.` : ''
        lines.push(`JOURNAL (${journal.length} entries):${moodStr}`)
        journal.slice(0, 3).forEach(j => {
          lines.push(`  "${j.entry || j.text || j.content}" (${new Date(j.created_at).toLocaleDateString()}${j.mood ? ', ' + j.mood : ''})`)
        })
      }

      // Energy
      if (energy.length) {
        const levels = energy.slice(0, 7).map(e => e.level).filter(Boolean)
        lines.push(`ENERGY (${energy.length} logs): Recent levels — ${levels.join(', ')}`)
      }

      // Check-ins
      if (checkins.length) {
        const recent = checkins[0]
        let ciStr = `CHECK-INS (${checkins.length} total): Latest`
        if (recent.rating) ciStr += ` rated day ${recent.rating}/10`
        if (recent.intention) ciStr += `, intention: "${recent.intention}"`
        if (recent.win) ciStr += `, win: "${recent.win}"`
        if (recent.release) ciStr += `, releasing: "${recent.release}"`
        if (recent.energy) ciStr += `, energy: ${recent.energy}`
        if (recent.sleep) ciStr += `, sleep: ${recent.sleep}`
        lines.push(ciStr)
      }

      // Cravings
      if (cravings.length) {
        const resisted = cravings.filter(c => c.resisted !== false).length
        lines.push(`CRAVINGS: ${cravings.length} logged, ${resisted} resisted. Recent notes: ${cravings.slice(0, 3).map(c => c.note || c.text || c.trigger || 'no note').join('; ')}`)
      }

      // Dreams
      if (dreams.length) {
        lines.push(`DREAMS (${dreams.length}): ${dreams.slice(0, 3).map(d => `"${(d.text || d.entry || d.content || '').slice(0, 100)}"`).join('; ')}`)
      }

      // Surrendered worries
      if (worries.length) {
        lines.push(`SURRENDERED TO GOD (${worries.length}): ${worries.slice(0, 5).map(w => w.text || w.worry || w.content).join('; ')}`)
      }

      // Water
      if (water.length) {
        lines.push(`WATER: ${water.map(w => `${w.date}: ${w.glasses} glasses`).join(', ')}`)
      }

      // Bathroom
      if (bathroom.length) {
        lines.push(`BATHROOM: ${bathroom.length} entries logged`)
      }

      // Nutrition
      if (nutrition.length) {
        lines.push(`NUTRITION (${nutrition.length}): ${nutrition.slice(0, 3).map(n => n.text || n.meal || n.entry || '').join('; ')}`)
      }

      // Runs
      if (runs.length) {
        lines.push(`RUNS (${runs.length}): ${runs.slice(0, 3).map(r => `${r.distance ? r.distance + ' mi' : ''} ${r.duration ? r.duration + ' min' : ''}`).join('; ')}`)
      }

      // Tasks
      if (tasks.length) {
        const done = tasks.filter(t => t.done).length
        lines.push(`TASKS: ${done}/${tasks.length} completed`)
      }

      // Work tasks
      if (workTasks.length) {
        const done = workTasks.filter(t => t.done).length
        lines.push(`WORK TASKS: ${done}/${workTasks.length} completed. Recent: ${workTasks.slice(0, 3).map(t => `${t.text}${t.done ? ' ✓' : ''}`).join(', ')}`)
      }

      // Health
      if (health.length) {
        lines.push(`HEALTH LOGS (${health.length}): ${health.slice(0, 2).map(h => `${h.mood || ''} energy:${h.energy || ''} sleep:${h.sleep || ''}`).join('; ')}`)
      }

      // SATS
      if (sats.length) {
        lines.push(`SATS SCENES (${sats.length}): ${sats.slice(0, 2).map(s => `"${(s.scene || s.text || '').slice(0, 80)}"`).join('; ')}`)
      }

      // Visualizations
      if (vizs.length) {
        lines.push(`VISUALIZATIONS (${vizs.length}): ${vizs.slice(0, 2).map(v => `"${(v.text || v.scene || v.content || '').slice(0, 80)}"`).join('; ')}`)
      }

      // Revisions (Neville)
      if (revisions.length) {
        lines.push(`REVISIONS (${revisions.length}): ${revisions.slice(0, 2).map(r => `Original: "${(r.original || '').slice(0, 60)}" → Revised: "${(r.revised || '').slice(0, 60)}"`).join('; ')}`)
      }

      // I AM Declarations
      if (iamDecl.length) {
        lines.push(`I AM DECLARATIONS (${iamDecl.length}): ${iamDecl.map(d => d.text).join('; ')}`)
      }

      // Mental Diet
      if (mentalDiet.length) {
        lines.push(`MENTAL DIET (${mentalDiet.length} thoughts caught): ${mentalDiet.slice(0, 3).map(m => `"${m.thought}" → "${m.replacement || 'no replacement'}"`).join('; ')}`)
      }

      // Paradigms
      if (paradigms.length) {
        const shifted = paradigms.filter(p => p.status === 'shifted').length
        lines.push(`PARADIGMS (${paradigms.length}, ${shifted} shifted): ${paradigms.slice(0, 3).map(p => `"${p.old_belief}" → "${p.new_belief}" (${p.status})`).join('; ')}`)
      }

      // Goal Card
      if (goalCards.length) {
        lines.push(`GOAL CARD: "${goalCards[0].goal}" (read ${goalCards[0].read_count || 0} times)`)
      }

      // Terror Barriers
      if (terrorB.length) {
        lines.push(`TERROR BARRIERS (${terrorB.length}): ${terrorB.slice(0, 2).map(t => `"${t.barrier}"${t.breakthrough ? ' → ' + t.breakthrough : ''}`).join('; ')}`)
      }

      // Intentions (Wayne Dyer)
      if (intentions.length) {
        lines.push(`INTENTIONS (${intentions.length}): Latest: "${intentions[0].intention}"${intentions[0].source ? ' (Source: ' + intentions[0].source + ')' : ''}`)
      }

      // Wishes Fulfilled
      if (wishes.length) {
        lines.push(`WISHES FULFILLED (${wishes.length}): ${wishes.slice(0, 2).map(w => `"${(w.wish || '').slice(0, 80)}" feeling: ${w.feeling || 'unset'}`).join('; ')}`)
      }

      // The Certain Way
      if (certainWay.length) {
        lines.push(`CERTAIN WAY (${certainWay.length}): ${certainWay.slice(0, 2).map(c => `Desire: "${(c.desire || '').slice(0, 60)}"`).join('; ')}`)
      }

      // Impression of Increase
      if (increaseLog.length) {
        lines.push(`IMPRESSION OF INCREASE (${increaseLog.length} acts): ${increaseLog.slice(0, 3).map(i => i.act).join('; ')}`)
      }

      return lines.join('\n')
    } catch (e) {
      console.error('Context fetch error:', e)
      return ''
    }
  }

  const speak = (text) => {
    if (!('speechSynthesis' in window)) return
    window.speechSynthesis.cancel()
    const utter = new SpeechSynthesisUtterance(text)
    utter.rate = 0.95
    utter.pitch = 1
    utter.onstart = () => setSpeaking(true)
    utter.onend = () => setSpeaking(false)
    utter.onerror = () => setSpeaking(false)
    window.speechSynthesis.speak(utter)
  }

  const stopSpeaking = () => { window.speechSynthesis?.cancel(); setSpeaking(false) }

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const send = async () => {
    if (!input.trim() || loading) return
    const wasSpoken = spokenRef.current
    spokenRef.current = false
    mic.stop()
    stopSpeaking()
    const userMsg = { role: 'user', text: input.trim(), time: Date.now() }
    const updated = [...messages, userMsg]
    setMessages(updated)
    saveToSupabase(updated)
    setInput('')
    setLoading(true)

    try {
      // Fetch all app data for context
      const appContext = await getAppContext()
      const contextBlock = appContext ? `\n\n--- USER'S RECENT APP ACTIVITY ---${appContext}\n--- END ACTIVITY ---\n\nUse this data to personalize your responses. Reference specific things they've written, patterns you notice, and their progress. Don't list it back — weave it naturally into your coaching.` : ''

      // Send last 20 messages for good conversation memory
      const recentMsgs = updated.slice(-20)

      const systemText = COACH_SYSTEM + contextBlock + '\n\nThe user is on Day ' + daysSinceQuit + ' of their recovery. Current time: ' + new Date().toLocaleString()

      const contents = recentMsgs.map(m => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.text }]
      }))

      const res = await fetch(GEMINI_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: systemText }] },
          contents,
          generationConfig: { maxOutputTokens: 2000, temperature: 0.85 }
        })
      })

      const data = await res.json()
      if (data?.error) console.error('Gemini error:', data.error)
      const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'I\'m here with you. Tell me more about what you\'re feeling.'

      const coachMsg = { role: 'coach', text: reply, time: Date.now() }
      const final = [...updated, coachMsg]
      setMessages(final)
      saveToSupabase(final)

      // Only speak back if user used voice
      if (wasSpoken) speak(reply)
    } catch (err) {
      const errMsg = { role: 'coach', text: 'I\'m having trouble connecting right now. But I\'m still here — try again in a moment.', time: Date.now() }
      const final = [...updated, errMsg]
      setMessages(final)
      saveToSupabase(final)
    }

    setLoading(false)
  }

  // Stop speaking on unmount
  useEffect(() => () => { window.speechSynthesis?.cancel() }, [])

  const clearChat = () => {
    if (!confirm('Clear all messages and start fresh?')) return
    stopSpeaking()
    setMessages([])
    save('coach_messages', [])
    // Start a new session
    const newSession = Date.now().toString()
    save('coach_session', newSession)
  }

  return (
    <div style={{ ...s.page, display: 'flex', flexDirection: 'column', minHeight: '100vh', paddingBottom: 0 }}>
      <div style={{ flexShrink: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 16 }}>
          <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', ...s.dim, fontSize: 14, display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ transform: 'rotate(180deg)', display: 'inline-block' }}>{Icons.chevron}</span> Back
          </button>
          {messages.length > 0 && (
            <button onClick={clearChat} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, color: 'rgba(255,255,255,0.15)' }}>Clear</button>
          )}
        </div>
        <div style={{ paddingTop: 8, marginBottom: 16 }}>
          <h1 style={s.greeting}>Coach</h1>
          <p style={s.subtitle}>Your recovery companion — powered by Neville</p>
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 16 }}>
        {messages.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <span style={{ fontSize: 40 }}>✦</span>
            <p style={{ fontSize: 17, color: '#fff', marginTop: 16 }}>Hey. I'm here.</p>
            <p style={{ fontSize: 14, ...s.dim, marginTop: 10, lineHeight: 1.7 }}>
              Tell me how you're feeling, what you're struggling with, or what you need right now.
              I know Neville's teachings, I understand what your brain is going through, and I'm not going anywhere.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', marginTop: 20 }}>
              {['I\'m having a craving', 'I can\'t sleep', 'I have no energy', 'I\'m feeling anxious', 'Tell me about day ' + daysSinceQuit].map(q => (
                <button key={q} onClick={() => { setInput(q) }}
                  style={{ ...s.pill, fontSize: 13, padding: '10px 16px' }}>{q}</button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m, i) => (
          <div key={i} style={{ marginBottom: 12, display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
            <div style={{
              maxWidth: '85%', padding: '14px 18px', borderRadius: 16,
              background: m.role === 'user' ? 'rgba(255,255,255,0.1)' : '#1A1A1A',
              border: m.role === 'user' ? '1px solid rgba(255,255,255,0.15)' : '1px solid rgba(255,255,255,0.08)',
              borderBottomRightRadius: m.role === 'user' ? 4 : 16,
              borderBottomLeftRadius: m.role === 'user' ? 16 : 4,
            }}>
              <p style={{ fontSize: 15, color: m.role === 'user' ? '#fff' : 'rgba(255,255,255,0.7)', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
                {m.text}
              </p>
              <p style={{ fontSize: 10, ...s.dim, marginTop: 6, textAlign: m.role === 'user' ? 'right' : 'left' }}>
                {new Date(m.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}

        {loading && (
          <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: 12 }}>
            <div style={{ padding: '14px 18px', borderRadius: 16, background: '#1A1A1A', border: '1px solid rgba(255,255,255,0.08)', borderBottomLeftRadius: 4 }}>
              <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.5, repeat: Infinity }}>
                <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)' }}>thinking...</span>
              </motion.div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Speaking indicator */}
      {speaking && (
        <button onClick={stopSpeaking}
          style={{ flexShrink: 0, width: '100%', padding: '10px', background: 'rgba(255,255,255,0.04)',
            border: 'none', borderTop: '1px solid rgba(255,255,255,0.06)', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          <motion.span animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.5, repeat: Infinity }}
            style={{ fontSize: 14 }}>{Icons.volume}</motion.span>
          <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>Speaking... tap to stop</span>
        </button>
      )}

      {/* Input */}
      <div style={{ flexShrink: 0, padding: '12px 0 max(12px, env(safe-area-inset-bottom))', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ display: 'flex', gap: 8 }}>
          <MicBtn listening={mic.listening} onPress={() => { stopSpeaking(); mic.toggle(input) }} />
          <input value={input} onChange={e => { setInput(e.target.value); spokenRef.current = false }}
            onKeyDown={e => e.key === 'Enter' && send()}
            placeholder="Talk to your coach..."
            style={{ ...s.input, flex: 1 }} />
          <button onClick={send} disabled={!input.trim() || loading}
            style={{ ...s.btnSecondary, padding: '14px 20px', opacity: input.trim() && !loading ? 1 : 0.3, flexShrink: 0 }}>
            {Icons.send}
          </button>
        </div>
      </div>
    </div>
  )
}
