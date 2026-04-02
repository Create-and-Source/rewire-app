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

  const stop = () => { recRef.current?.stop(); setListening(false) }

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
  greeting: { fontSize: 24, fontWeight: 300, color: '#fff', letterSpacing: -0.5 },
  subtitle: { fontSize: 13, fontWeight: 400, color: 'rgba(255,255,255,0.35)', marginTop: 4 },
  label: { fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 3, color: 'rgba(255,255,255,0.35)', marginBottom: 12 },
  card: { background: '#1A1A1A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 14, padding: '18px 16px' },
  cardTitle: { fontSize: 14, fontWeight: 500, color: '#fff' },
  cardText: { fontSize: 12, fontWeight: 400, color: 'rgba(255,255,255,0.5)', lineHeight: 1.6, marginTop: 6 },
  stat: { fontSize: 28, fontWeight: 300, color: '#fff' },
  statUnit: { fontSize: 11, fontWeight: 400, color: 'rgba(255,255,255,0.35)', marginTop: 2 },
  pillActive: { borderRadius: 999, padding: '8px 16px', fontSize: 12, fontWeight: 500, background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', cursor: 'pointer', transition: 'all 0.2s' },
  pill: { borderRadius: 999, padding: '8px 16px', fontSize: 12, fontWeight: 500, background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', transition: 'all 0.2s' },
  btnPrimary: { width: '100%', padding: '14px 0', borderRadius: 999, background: '#fff', color: '#0D0D0D', fontSize: 13, fontWeight: 600, border: 'none', cursor: 'pointer', letterSpacing: 0.5, transition: 'all 0.2s' },
  btnSecondary: { padding: '10px 20px', borderRadius: 999, background: 'rgba(255,255,255,0.08)', color: '#fff', fontSize: 12, fontWeight: 500, border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', transition: 'all 0.2s' },
  input: { width: '100%', padding: '14px 16px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, color: '#fff', fontSize: 14, outline: 'none', fontFamily: 'Inter' },
  textarea: { width: '100%', padding: '14px 16px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, color: '#fff', fontSize: 14, outline: 'none', fontFamily: 'Inter', resize: 'none', lineHeight: 1.6 },
  dim: { color: 'rgba(255,255,255,0.35)' },
  mid: { color: 'rgba(255,255,255,0.6)' },
  bright: { color: '#fff' },
  track: { height: 2, background: 'rgba(255,255,255,0.06)', borderRadius: 1, overflow: 'hidden', marginTop: 10 },
  fill: (pct) => ({ height: '100%', width: `${pct}%`, background: 'rgba(255,255,255,0.2)', borderRadius: 1, transition: 'width 0.6s ease' }),
  nav: { position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 100, background: 'rgba(13,13,13,0.92)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', borderTop: '1px solid rgba(255,255,255,0.06)' },
  navInner: { maxWidth: 430, margin: '0 auto', display: 'flex', justifyContent: 'space-around', alignItems: 'center', padding: '8px 0 max(8px, env(safe-area-inset-bottom))' },
  navItem: (active) => ({ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, background: 'none', border: 'none', cursor: 'pointer', opacity: active ? 1 : 0.35, transition: 'all 0.2s', padding: '4px 8px' }),
  navLabel: { fontSize: 10, fontWeight: 600, letterSpacing: 0.5, textTransform: 'uppercase', color: '#fff' },
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
            <button key={t.id} onClick={() => setPage(t.id)} style={s.navItem(page === t.id || (t.id === 'more' && ['water','progress','vision','visualize','timer','health','brain','cravings','dreams','nourish','tasks','run'].includes(page)))}>
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
            {page === 'work' && <WorkTimerPage />}
            {page === 'cravings' && <CravingsPage onBack={() => setPage('more')} />}
            {page === 'more' && <MorePage setPage={setPage} />}
            {page === 'water' && <WaterPage onBack={() => setPage('more')} />}
            {page === 'vision' && <VisionPage images={visionImages} setImages={setVisionImages} onBack={() => setPage('more')} />}
            {page === 'visualize' && <VisualizePage onBack={() => setPage('more')} />}
            {page === 'timer' && <TimerPage onBack={() => setPage('more')} />}
            {page === 'health' && <HealthPage onBack={() => setPage('more')} />}
            {page === 'tasks' && <TasksPage onBack={() => setPage('more')} />}
            {page === 'run' && <RunPage onBack={() => setPage('more')} />}
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

  const cravings = cravingLog.filter(e => new Date(e.created_at || e.date).toDateString() === today).length
  const totalResisted = cravingLog.length

  const resistCraving = () => {
    cravingDb.add({ note: null })
    setJustResisted(true); setTimeout(() => setJustResisted(false), 2000)
  }

  const getGreeting = () => {
    const h = new Date().getHours()
    if (h < 12) return 'Good morning'
    if (h < 17) return 'Good afternoon'
    return 'Good evening'
  }

  return (
    <div style={s.page}>
      <div style={{ paddingTop: 20, marginBottom: 28 }}>
        <h1 style={s.greeting}>{getGreeting()}</h1>
        <p style={{ ...s.subtitle, marginTop: 6 }}>This is your journey</p>
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

      {/* Milestone — just the current one, subtle */}
      <div style={{ ...s.card, marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
          <span style={{ fontSize: 20 }}>{cur.icon}</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, fontWeight: 500, color: '#fff' }}>{cur.title}</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', lineHeight: 1.5, marginTop: 4 }}>{cur.description}</div>
          </div>
        </div>
        {nxt && (
          <div style={{ marginTop: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9, ...s.dim, marginBottom: 4 }}>
              <span>Now</span><span>{nxt.title}</span>
            </div>
            <div style={s.track}><div style={s.fill(pct)} /></div>
          </div>
        )}
        <button onClick={() => setPage('brain')} style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', background: 'none', border: 'none', cursor: 'pointer', marginTop: 10, letterSpacing: 1 }}>
          Learn what's happening in your brain →
        </button>
      </div>

      {/* Neville quote card */}
      <div style={{ ...s.card, marginTop: 0, textAlign: 'center', padding: '24px 20px' }}>
        <span style={{ ...s.dim, fontSize: 16 }}>✦</span>
        <p style={{ fontSize: 15, fontWeight: 300, color: 'rgba(255,255,255,0.7)', lineHeight: 1.7, marginTop: 12, fontStyle: 'italic' }}>
          "{quote}"
        </p>
        <p style={{ fontSize: 10, letterSpacing: 3, textTransform: 'uppercase', ...s.dim, marginTop: 12 }}>Neville Goddard</p>
      </div>
    </div>
  )
}

// ============================================================
// BRAIN
// ============================================================

function BrainPage({ time, onBack }) {
  const [expanded, setExpanded] = useState(null)
  const { cur } = getMilestone(time.totalHours)

  return (
    <div style={s.page}>
      <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', ...s.dim, fontSize: 12, paddingTop: 16, display: 'flex', alignItems: 'center', gap: 4 }}>
        <span style={{ transform: 'rotate(180deg)', display: 'inline-block' }}>{Icons.chevron}</span> Back
      </button>
      <div style={{ paddingTop: 12, marginBottom: 24 }}>
        <h1 style={s.greeting}>Your brain right now</h1>
        <p style={s.subtitle}>{Math.floor(time.totalHours)} hours into recovery</p>
      </div>

      <div style={{ ...s.card, marginBottom: 14 }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 10 }}>
          <span style={{ fontSize: 28 }}>{cur.icon}</span>
          <div style={s.cardTitle}>{cur.title}</div>
        </div>
        <div style={s.cardText}>{cur.description}</div>
      </div>

      <div style={{ ...s.label, marginTop: 24 }}>TIMELINE</div>
      {NEURAL_MILESTONES.map((m, i) => {
        const reached = time.totalHours >= m.hours
        return (
          <div key={i} style={{ ...s.card, marginBottom: 6, opacity: reached ? 1 : 0.3, display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px' }}>
            <span style={{ fontSize: 16 }}>{m.icon}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 500, color: '#fff' }}>{m.title}</div>
              {reached && <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', marginTop: 2 }}>{m.description.slice(0, 80)}...</div>}
            </div>
            {reached && <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12 }}>✓</span>}
          </div>
        )
      })}

      <div style={{ ...s.label, marginTop: 24 }}>DEEP READS</div>
      {BRAIN_ARTICLES.map((a, i) => (
        <div key={i} style={{ ...s.card, marginBottom: 8, cursor: 'pointer' }} onClick={() => setExpanded(expanded === i ? null : i)}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ fontSize: 13, fontWeight: 500, color: '#fff' }}>{a.title}</div>
            <span style={{ ...s.dim, fontSize: 12, transform: expanded === i ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }}>›</span>
          </div>
          {expanded === i && <div style={{ ...s.cardText, marginTop: 12 }}>{a.content}</div>}
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
  const items = [
    { id: 'dreams', label: 'Dream Journal', sub: 'Your brain is learning to dream again' },
    { id: 'nourish', label: 'Nourish', sub: 'What food does for your brain' },
    { id: 'run', label: 'Run Tracker', sub: 'GPS tracking, distance, pace' },
    { id: 'cravings', label: 'Craving Tracker', sub: 'Every resist is a win' },
    { id: 'water', label: 'Water Tracker', sub: 'Your brain is 73% water' },
    { id: 'progress', label: 'Progress Photos', sub: 'Watch yourself transform' },
    { id: 'vision', label: 'Vision Board', sub: 'See it, feel it, become it' },
    { id: 'visualize', label: 'Visualize', sub: 'Live in the end' },
    { id: 'timer', label: 'Meditation Timer', sub: 'Enter the silence' },
    { id: 'health', label: 'Health', sub: 'Apple Health + daily check-in' },
    { id: 'tasks', label: 'Tasks', sub: 'Your daily to-dos' },
    { id: 'brain', label: 'Brain Science', sub: 'What\'s happening inside' },
  ]

  return (
    <div style={s.page}>
      <div style={{ paddingTop: 20, marginBottom: 24 }}>
        <h1 style={s.greeting}>Your tools</h1>
        <p style={s.subtitle}>Everything for your journey</p>
      </div>
      {items.map(it => (
        <button key={it.id} onClick={() => setPage(it.id)}
          style={{ ...s.card, marginBottom: 10, width: '100%', textAlign: 'left', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'all 0.2s' }}>
          <div>
            <div style={s.cardTitle}>{it.label}</div>
            <div style={{ fontSize: 11, ...s.dim, marginTop: 4 }}>{it.sub}</div>
          </div>
          <span style={s.dim}>{Icons.chevron}</span>
        </button>
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
    gratDb.add({ text: input }); setInput('')
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

function WorkTimerPage() {
  const today = new Date().toDateString()
  const [sessions, sessionsDb] = useSync('work_sessions', 'work_sessions')
  const [running, setRunning] = useState(load('work_running', false))
  const [startTime, setStartTime] = useState(load('work_start', null))
  const [elapsed, setElapsed] = useState(0)

  const todaySessions = sessions.filter(ss => new Date(ss.end_time || ss.date || ss.created_at).toDateString() === today)
  const todayTotal = todaySessions.reduce((a, ss) => a + ss.duration, 0)

  useEffect(() => {
    if (!running || !startTime) return
    const tick = () => setElapsed(Math.floor((Date.now() - startTime) / 1000))
    tick()
    const i = setInterval(tick, 1000)
    return () => clearInterval(i)
  }, [running, startTime])

  const startWork = () => {
    const now = Date.now()
    setStartTime(now); save('work_start', now)
    setRunning(true); save('work_running', true)
    setElapsed(0)
  }

  const stopWork = () => {
    const duration = Math.floor((Date.now() - startTime) / 1000)
    sessionsDb.add({ start_time: new Date(startTime).toISOString(), end_time: new Date().toISOString(), duration })
    setRunning(false); save('work_running', false)
    setStartTime(null); save('work_start', null)
    setElapsed(0)
  }

  const fmtDur = (secs) => {
    const h = Math.floor(secs / 3600)
    const m = Math.floor((secs % 3600) / 60)
    const sc = secs % 60
    if (h > 0) return `${h}h ${String(m).padStart(2, '0')}m`
    return `${String(m).padStart(2, '0')}:${String(sc).padStart(2, '0')}`
  }

  return (
    <div style={s.page}>
      <div style={{ paddingTop: 20, marginBottom: 28 }}>
        <h1 style={s.greeting}>Focus</h1>
        <p style={s.subtitle}>Track your work sessions throughout the day</p>
      </div>

      <div style={{ ...s.card, textAlign: 'center', padding: '40px 16px', marginBottom: 14 }}>
        <div style={{ ...s.label, marginBottom: 16 }}>{running ? 'WORKING' : 'READY'}</div>

        <div style={{ position: 'relative', width: 160, height: 160, margin: '0 auto 24px' }}>
          <svg viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)' }}>
            <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="3" />
            {running && (
              <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="3"
                strokeDasharray="8 4" strokeLinecap="round">
                <animateTransform attributeName="transform" type="rotate" from="0 50 50" to="360 50 50" dur="10s" repeatCount="indefinite" />
              </circle>
            )}
          </svg>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: 32, fontWeight: 300, color: '#fff', fontVariantNumeric: 'tabular-nums' }}>
              {fmtDur(running ? elapsed : 0)}
            </span>
            <span style={{ fontSize: 10, ...s.dim, marginTop: 6 }}>{running ? 'Current session' : 'Tap to start'}</span>
          </div>
        </div>

        <button onClick={running ? stopWork : startWork}
          style={running ? { ...s.btnSecondary, padding: '14px 40px' } : { ...s.btnPrimary, width: 'auto', padding: '14px 40px', display: 'inline-block' }}>
          {running ? 'Stop' : 'Start Working'}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
        <div style={{ ...s.card, textAlign: 'center', padding: '16px 12px' }}>
          <div style={{ fontSize: 22, fontWeight: 300, color: '#fff' }}>{fmtDur(todayTotal)}</div>
          <div style={{ fontSize: 10, ...s.dim, marginTop: 4, textTransform: 'uppercase', letterSpacing: 1 }}>Today</div>
        </div>
        <div style={{ ...s.card, textAlign: 'center', padding: '16px 12px' }}>
          <div style={{ fontSize: 22, fontWeight: 300, color: '#fff' }}>{todaySessions.length}</div>
          <div style={{ fontSize: 10, ...s.dim, marginTop: 4, textTransform: 'uppercase', letterSpacing: 1 }}>Sessions</div>
        </div>
      </div>

      {todaySessions.length > 0 && (
        <>
          <div style={s.label}>TODAY'S SESSIONS</div>
          {todaySessions.map(ss => (
            <div key={ss.id} style={{ ...s.card, marginBottom: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 14px' }}>
              <div style={{ fontSize: 12, ...s.mid }}>{fmtTime(ss.start_time || ss.startedAt)} — {fmtTime(ss.end_time || ss.date)}</div>
              <div style={{ fontSize: 13, fontWeight: 500, color: '#fff' }}>{fmtDur(ss.duration)}</div>
            </div>
          ))}
        </>
      )}

      <div style={{ ...s.card, marginTop: 14, borderLeft: '2px solid rgba(255,255,255,0.15)', borderRadius: '0 14px 14px 0' }}>
        <p style={{ fontSize: 12, fontStyle: 'italic', color: 'rgba(255,255,255,0.4)', lineHeight: 1.6 }}>
          "An awakened imagination works with a purpose. It creates and conserves the desirable."
        </p>
        <p style={{ fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', ...s.dim, marginTop: 8 }}>Neville Goddard</p>
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
