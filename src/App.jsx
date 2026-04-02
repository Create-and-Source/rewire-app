import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Brain, Moon, Droplets, Heart, Image, Music, Timer,
  Sparkles, Mic, Plus, ChevronRight,
  Play, Pause, RotateCcw, Check, Trash2,
  Quote, Eye, Zap, TrendingUp, Volume2,
  VolumeX, Sun, Cloud, Wind, Waves, Salad, Edit3,
  MessageCircle, Send, Bot, User, Home, Leaf
} from 'lucide-react'

// ============================================================
// CONSTANTS & DATA
// ============================================================

const QUIT_DATE = new Date('2026-04-01T18:45:00')

const NEVILLE_QUOTES = [
  { text: "Assume the feeling of the wish fulfilled.", source: "Neville Goddard" },
  { text: "Imagination is the only reality.", source: "Neville Goddard" },
  { text: "Change your conception of yourself and you will automatically change the world in which you live.", source: "Neville Goddard" },
  { text: "Live in the end. Act as though it were impossible to fail.", source: "Neville Goddard" },
  { text: "An awakened imagination works with a purpose. It creates and conserves the desirable, and transforms or destroys the undesirable.", source: "Neville Goddard" },
  { text: "To reach a higher level of being, you must assume a higher concept of yourself.", source: "Neville Goddard" },
  { text: "Dare to believe in the reality of your assumption and watch the world play its part relative to its fulfillment.", source: "Neville Goddard" },
  { text: "The world is yourself pushed out. Ask yourself what you are projecting.", source: "Neville Goddard" },
  { text: "Feeling is the secret.", source: "Neville Goddard" },
  { text: "Man's chief delusion is his conviction that there are causes other than his own state of consciousness.", source: "Neville Goddard" },
  { text: "Health, wealth, beauty, and genius are not created; they are only manifested by the arrangement of your mind.", source: "Neville Goddard" },
  { text: "Your imagination is you yourself, and the world as your imagination sees it is the real world.", source: "Neville Goddard" },
  { text: "Nothing comes from without. All things come from within.", source: "Neville Goddard" },
  { text: "The present moment is all that exists. Your point of power is now.", source: "Neville Goddard" },
  { text: "Stop trying to change the world since it is only the mirror. Man's attempt to change the world by force is as fruitless as breaking a mirror in the hope of changing his face.", source: "Neville Goddard" },
  { text: "Prayer is the art of assuming the feeling of being and having that which you want.", source: "Neville Goddard" },
  { text: "You are already that which you want to be, and your refusal to believe this is the only reason you do not see it.", source: "Neville Goddard" },
  { text: "If you judge after appearances, you will continue to be enslaved by them.", source: "Neville Goddard" },
]

const NEURAL_MILESTONES = [
  { hours: 0, title: "The Decision", description: "You chose yourself. CB1 receptors begin their journey back to baseline. Your brain is already starting to listen differently.", icon: "🌱" },
  { hours: 6, title: "THC Metabolism Shifts", description: "Your liver is actively processing stored THC. Endocannabinoid system begins recalibrating. Your natural reward system is waking up.", icon: "⚡" },
  { hours: 12, title: "First Sleep Cycle", description: "Your first sober sleep. REM rebound may cause vivid dreams — your brain is remembering how to dream. This is healing.", icon: "🌙" },
  { hours: 24, title: "Day 1 Complete", description: "CB1 receptor upregulation begins. Your brain is literally growing new receptor sites. Dopamine pathways start resensitizing.", icon: "🌟" },
  { hours: 48, title: "48 Hours", description: "Cannabinoid receptors are measurably recovering. You may feel emotions more intensely — that's your emotional brain coming back online.", icon: "💫" },
  { hours: 72, title: "72 Hours", description: "THC blood levels dropping significantly. Appetite signals normalizing. Your prefrontal cortex is strengthening its connections.", icon: "🧠" },
  { hours: 168, title: "One Week", description: "REM sleep architecture rebuilding. Dream recall increasing. Memory consolidation improving. Your hippocampus is celebrating.", icon: "🌊" },
  { hours: 336, title: "Two Weeks", description: "CB1 receptor density approaching normal in cortical regions. Verbal memory improving. Attention span lengthening. You're thinking clearer.", icon: "🔮" },
  { hours: 504, title: "Three Weeks", description: "Withdrawal symptoms fading. Natural endocannabinoid (anandamide) production stabilizing. Your body is making its own bliss molecules again.", icon: "✨" },
  { hours: 720, title: "One Month", description: "Significant cognitive recovery. Working memory sharper. Executive function strengthening. Neural pruning of unused THC pathways accelerating.", icon: "🏔️" },
  { hours: 1440, title: "Two Months", description: "Emotional regulation markedly improved. Stress response recalibrated. Neuroplasticity gains visible in daily life — learning faster, adapting quicker.", icon: "🦋" },
  { hours: 2160, title: "Three Months", description: "CB1 receptors fully normalized in most brain regions. Dream life rich and meaningful. Motivation and drive from natural dopamine. You are rewired.", icon: "🌸" },
  { hours: 4320, title: "Six Months", description: "Full endocannabinoid system recovery. Deep structural changes in white matter integrity. Your brain's wiring is genuinely different than it was.", icon: "🌺" },
  { hours: 8760, title: "One Year", description: "Complete neural rewiring. New default pathways established. Your brain has built an entirely new architecture of clarity, presence, and power.", icon: "👑" },
]

const FOOD_BENEFITS = {
  broccoli: { nutrients: "Vitamin C, K, Folate, Sulforaphane", benefits: "Protects brain cells from oxidative stress. Sulforaphane crosses the blood-brain barrier and supports neurogenesis — literally helping your brain grow new neurons as it rewires.", color: "#4a7c3f" },
  salmon: { nutrients: "Omega-3 (DHA/EPA), B12, Selenium", benefits: "DHA is the primary structural fat in your brain. Omega-3s reduce neuroinflammation and support the myelin sheaths forming around your new neural pathways.", color: "#e87461" },
  blueberries: { nutrients: "Anthocyanins, Vitamin C, K, Manganese", benefits: "Anthocyanins accumulate in brain regions responsible for memory and learning. They improve signal transmission between neurons — making your rewired connections faster.", color: "#4a5899" },
  spinach: { nutrients: "Iron, Folate, Magnesium, Vitamin K", benefits: "Folate supports serotonin and dopamine production — exactly what your brain needs as it rebuilds natural reward pathways. Magnesium calms the nervous system.", color: "#2d6a4f" },
  avocado: { nutrients: "Healthy Fats, Potassium, Folate, Vitamin E", benefits: "Monounsaturated fats support the integrity of brain cell membranes. Vitamin E protects neurons from oxidative damage during recovery.", color: "#5a7247" },
  eggs: { nutrients: "Choline, B12, Protein, Vitamin D", benefits: "Choline is essential for acetylcholine — the neurotransmitter of memory and learning. Your brain craves this as it rebuilds memory pathways.", color: "#e8c547" },
  walnuts: { nutrients: "Omega-3 (ALA), Polyphenols, Vitamin E", benefits: "The only tree nut with significant omega-3s. Polyphenols reduce brain inflammation. Even shaped like a brain — nature's hint.", color: "#8b6914" },
  turmeric: { nutrients: "Curcumin, Iron, Manganese", benefits: "Curcumin boosts BDNF (Brain-Derived Neurotrophic Factor), which is like fertilizer for your neurons. Directly supports the neuroplasticity driving your recovery.", color: "#d4930d" },
  "dark chocolate": { nutrients: "Flavonoids, Iron, Magnesium", benefits: "Flavonoids increase blood flow to the brain and promote neurogenesis. The small caffeine content supports alertness without overstimulation.", color: "#3d1c02" },
  "sweet potato": { nutrients: "Beta-Carotene, Vitamin C, B6, Fiber", benefits: "Complex carbs provide steady glucose to your brain (it uses 20% of your energy). B6 supports serotonin and melatonin production for better sleep.", color: "#c76e2a" },
  "green tea": { nutrients: "L-Theanine, EGCG, Caffeine", benefits: "L-Theanine promotes alpha brain waves — the state of calm focus. EGCG is neuroprotective. The perfect replacement ritual for your brain.", color: "#5a8c4a" },
  water: { nutrients: "H2O, Minerals", benefits: "Your brain is 73% water. Even 2% dehydration impairs attention and memory. Proper hydration supports every neural process happening in your recovery.", color: "#4a9ec7" },
  banana: { nutrients: "Potassium, B6, Vitamin C, Tryptophan", benefits: "Tryptophan converts to serotonin — your natural mood stabilizer. B6 helps your brain produce dopamine and norepinephrine for motivation.", color: "#e8d44d" },
  almonds: { nutrients: "Vitamin E, Magnesium, Protein, Riboflavin", benefits: "Vitamin E is the brain's primary fat-soluble antioxidant. Magnesium supports 300+ enzyme reactions including neurotransmitter production.", color: "#c4956a" },
  kale: { nutrients: "Lutein, Vitamin K, Beta-Carotene, Folate", benefits: "Lutein accumulates in the brain and slows cognitive decline. Vitamin K supports the formation of sphingolipids — fats that insulate your neurons.", color: "#3d6b35" },
  lemon: { nutrients: "Vitamin C, Citric Acid, Flavonoids", benefits: "Vitamin C is required for dopamine synthesis. Adding lemon to water is a double win — hydration plus neurotransmitter support.", color: "#e8d44d" },
  ginger: { nutrients: "Gingerol, Vitamin B6, Magnesium", benefits: "Anti-inflammatory compounds cross the blood-brain barrier. Supports digestion and reduces nausea that can come with detox.", color: "#c4a335" },
  oatmeal: { nutrients: "Beta-Glucan, Iron, B Vitamins, Fiber", benefits: "Slow-release energy keeps your brain fueled steadily. B vitamins support myelin production — the insulation on your neural pathways.", color: "#c4a87a" },
  yogurt: { nutrients: "Probiotics, Calcium, B12, Protein", benefits: "Gut bacteria produce 90% of your serotonin. Probiotics strengthen the gut-brain axis, directly supporting mood stability during recovery.", color: "#f0ede6" },
  "chicken breast": { nutrients: "Protein, B6, Niacin, Selenium", benefits: "Complete protein provides all amino acids for neurotransmitter production. B6 is critical for converting tryptophan to serotonin.", color: "#d4b896" },
  rice: { nutrients: "Carbohydrates, Manganese, B Vitamins", benefits: "Clean fuel for your brain. Manganese supports antioxidant enzymes that protect neurons during the rewiring process.", color: "#f0ede6" },
  "olive oil": { nutrients: "Oleic Acid, Polyphenols, Vitamin E", benefits: "Oleic acid maintains the integrity of myelin — the coating that makes neural signals travel fast. Polyphenols are neuroprotective.", color: "#8b9a3a" },
  carrots: { nutrients: "Beta-Carotene, Fiber, Vitamin K, Biotin", benefits: "Beta-carotene converts to Vitamin A, which supports neuroplasticity — the exact process your brain is using to form new pathways.", color: "#e87830" },
  beets: { nutrients: "Nitrates, Folate, Manganese, Potassium", benefits: "Nitrates increase blood flow to the brain, especially the prefrontal cortex — improving decision-making and impulse control.", color: "#8b1a4a" },
  sardines: { nutrients: "Omega-3, Calcium, B12, Vitamin D", benefits: "Packed with DHA for brain structure and B12 for nerve function. One of the most brain-dense foods on earth.", color: "#7a8896" },
  chicken: { nutrients: "Protein, B6, Niacin, Selenium", benefits: "Complete protein provides all amino acids for neurotransmitter production. B6 is critical for converting tryptophan to serotonin.", color: "#d4b896" },
  steak: { nutrients: "Iron, B12, Zinc, Protein", benefits: "Heme iron is the most bioavailable form — critical for oxygen transport to your brain. B12 supports nerve function and myelin production.", color: "#8b3a3a" },
  beef: { nutrients: "Iron, B12, Zinc, Protein", benefits: "Heme iron is the most bioavailable form — critical for oxygen transport to your brain. B12 supports nerve function and myelin production.", color: "#8b3a3a" },
  mushrooms: { nutrients: "Ergothioneine, B Vitamins, Selenium", benefits: "Ergothioneine is a powerful neuroprotective antioxidant. Lion's mane mushrooms specifically promote nerve growth factor (NGF) production.", color: "#8b7355" },
  strawberries: { nutrients: "Vitamin C, Anthocyanins, Folate, Manganese", benefits: "Rich in anthocyanins that protect brain cells. Vitamin C supports dopamine synthesis — helping your natural reward system recover.", color: "#c73e3e" },
  oranges: { nutrients: "Vitamin C, Folate, Potassium, Thiamine", benefits: "One orange provides your daily Vitamin C — essential for preventing mental decline and supporting neurotransmitter production.", color: "#e87830" },
  apple: { nutrients: "Quercetin, Fiber, Vitamin C", benefits: "Quercetin protects brain cells from oxidative damage. The act of biting and chewing stimulates blood flow to the brain.", color: "#c73e3e" },
  tomato: { nutrients: "Lycopene, Vitamin C, Potassium", benefits: "Lycopene is a powerful antioxidant that protects brain cells. It may help prevent the kind of cell damage linked to cognitive decline.", color: "#c73e3e" },
  cucumber: { nutrients: "Water, Vitamin K, Silica", benefits: "92% water for hydration. Silica supports connective tissue health. A perfect brain-hydrating snack.", color: "#4a7c3f" },
  peanut_butter: { nutrients: "Healthy Fats, Protein, Niacin, Magnesium", benefits: "Niacin helps with brain function and may reduce cognitive decline. Healthy fats support brain cell membrane integrity.", color: "#8b6914" },
  "peanut butter": { nutrients: "Healthy Fats, Protein, Niacin, Magnesium", benefits: "Niacin helps with brain function and may reduce cognitive decline. Healthy fats support brain cell membrane integrity.", color: "#8b6914" },
  coffee: { nutrients: "Caffeine, Antioxidants, Niacin", benefits: "Caffeine blocks adenosine receptors, increasing alertness. Rich in antioxidants that protect brain cells. Moderation is key during recovery.", color: "#3d1c02" },
  salad: { nutrients: "Various Vitamins, Fiber, Water", benefits: "Mixed greens provide a symphony of brain-supporting nutrients. The variety ensures multiple pathways of neural support.", color: "#2d6a4f" },
  soup: { nutrients: "Hydration, Electrolytes, Various Nutrients", benefits: "Warm broths are deeply nourishing — hydrating, mineral-rich, and easy to digest. Your gut-brain axis appreciates the gentleness.", color: "#c4a87a" },
  smoothie: { nutrients: "Blended Fruits/Vegetables, Fiber", benefits: "A delivery system for concentrated brain nutrition. Blending breaks down cell walls for maximum nutrient absorption.", color: "#4a5899" },
}

const TIMER_SOUNDS = [
  { id: 'rain', name: 'Gentle Rain', icon: Cloud, freq: [200, 400, 600] },
  { id: 'ocean', name: 'Ocean Waves', icon: Waves, freq: [150, 300, 450] },
  { id: 'wind', name: 'Soft Wind', icon: Wind, freq: [100, 250, 380] },
  { id: 'bowl', name: 'Singing Bowl', icon: Sun, freq: [256, 384, 512] },
  { id: 'forest', name: 'Forest', icon: Leaf, freq: [180, 320, 500] },
]

const BRAIN_ARTICLES = [
  {
    title: "How Your CB1 Receptors Are Healing",
    content: "Cannabis floods your brain's CB1 receptors with external cannabinoids, causing them to downregulate — your brain literally removes receptor sites because they're overwhelmed. When you quit, these receptors begin upregulating within 48 hours. By 4 weeks, brain imaging shows CB1 receptor density returning to levels seen in people who've never used cannabis. Your brain is rebuilding its ability to feel pleasure, motivation, and calm from its own endocannabinoids — anandamide (the \"bliss molecule\") and 2-AG. Every day sober, you're growing back what was dimmed.",
    icon: "🧬"
  },
  {
    title: "REM Rebound: Why Your Dreams Are So Vivid",
    content: "THC suppresses REM sleep — the phase where you dream, process emotions, and consolidate memories. When you quit, your brain has a backlog of processing to do. It enters \"REM rebound\" — dramatically increasing dream intensity and duration. Those vivid, wild, sometimes unsettling dreams? That's your brain clearing the queue. It's processing emotions, memories, and experiences it couldn't access while you were using. This is healing. Your dream journal entries are literally your brain's repair log. REM rebound typically peaks at 2-3 weeks and settles into rich, meaningful dreaming by month 2.",
    icon: "🌙"
  },
  {
    title: "Neuroplasticity: Your Brain's Superpower",
    content: "Neuroplasticity is your brain's ability to rewire itself — forming new connections and pathways. Cannabis use reduces neuroplasticity over time, but quitting triggers a recovery surge. Your brain becomes hungry to learn, adapt, and grow. The first 90 days are a critical window of enhanced plasticity. Every new habit you build, every visualization you practice, every gratitude entry you write is physically sculpting your neural architecture. Neville Goddard's teachings align perfectly with neuroscience here: when you 'live in the end,' you're literally creating neural pathways for the reality you're stepping into.",
    icon: "🧠"
  },
  {
    title: "Dopamine Recovery: Finding Natural Joy",
    content: "Cannabis creates an artificial dopamine surge that your brain adapts to by reducing its natural dopamine production and receptor sensitivity. When you quit, there's a temporary deficit — things might feel flat or unmotivating. This is normal and temporary. Your dopamine system begins recalibrating within days. By week 2-3, you'll start noticing natural pleasures becoming more vivid — food tastes better, music hits different, sunsets stop you in your tracks. By month 2-3, your baseline dopamine levels and receptor sensitivity are markedly improved. You're not losing pleasure — you're recovering the full spectrum of it.",
    icon: "⚡"
  },
  {
    title: "The Prefrontal Cortex: Decision-Making Returns",
    content: "Your prefrontal cortex — the CEO of your brain — is one of the last regions to recover from chronic cannabis use. It handles decision-making, impulse control, planning, and emotional regulation. THC specifically impairs this region's function. Recovery here takes 1-3 months but the gains are profound: clearer thinking, better follow-through, stronger willpower, more nuanced emotional responses. You'll notice you're responding to situations rather than reacting to them. This is executive function coming back online.",
    icon: "🎯"
  },
  {
    title: "The Endocannabinoid System: Your Body's Balance Keeper",
    content: "Your endocannabinoid system (ECS) regulates mood, sleep, appetite, pain, immune function, and memory. It produces its own cannabinoids — anandamide and 2-AG — to maintain homeostasis. External THC overwhelms and disrupts this delicate system. When you quit, your ECS recalibrates. Anandamide production normalizes — this is literally called the 'bliss molecule' because it produces feelings of well-being and happiness naturally. Your body knows how to create its own peace. You're not giving something up — you're letting your body remember how to produce its own version, which is smoother, more sustainable, and more in tune with who you really are.",
    icon: "🌿"
  },
]

// ============================================================
// HELPER FUNCTIONS
// ============================================================

const getTimeSince = () => {
  const now = new Date()
  const diff = now - QUIT_DATE
  if (diff < 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, totalHours: 0 }
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((diff % (1000 * 60)) / 1000)
  const totalHours = diff / (1000 * 60 * 60)
  return { days, hours, minutes, seconds, totalHours }
}

const getCurrentMilestone = (totalHours) => {
  let current = NEURAL_MILESTONES[0]
  let next = NEURAL_MILESTONES[1]
  for (let i = 0; i < NEURAL_MILESTONES.length; i++) {
    if (totalHours >= NEURAL_MILESTONES[i].hours) {
      current = NEURAL_MILESTONES[i]
      next = NEURAL_MILESTONES[i + 1] || null
    }
  }
  return { current, next }
}

const getRandomQuote = () => NEVILLE_QUOTES[Math.floor(Math.random() * NEVILLE_QUOTES.length)]

const loadData = (key, fallback) => {
  try {
    const d = localStorage.getItem(`rewire_${key}`)
    return d ? JSON.parse(d) : fallback
  } catch { return fallback }
}

const saveData = (key, data) => {
  localStorage.setItem(`rewire_${key}`, JSON.stringify(data))
}

const formatDate = (d) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
const formatTime = (d) => new Date(d).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })

const findFoodBenefits = (input) => {
  const lower = input.toLowerCase().trim()
  for (const [food, data] of Object.entries(FOOD_BENEFITS)) {
    if (lower.includes(food)) return { food, ...data }
  }
  return null
}

// ============================================================
// AUDIO CONTEXT FOR MEDITATION SOUNDS
// ============================================================

class AmbientSound {
  constructor() {
    this.ctx = null
    this.nodes = []
    this.playing = false
  }

  start(frequencies) {
    if (this.playing) this.stop()
    this.ctx = new (window.AudioContext || window.webkitAudioContext)()
    const masterGain = this.ctx.createGain()
    masterGain.gain.value = 0.08
    masterGain.connect(this.ctx.destination)

    frequencies.forEach((freq, i) => {
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()
      osc.type = 'sine'
      osc.frequency.value = freq
      gain.gain.value = 0.3 - (i * 0.08)
      osc.connect(gain)
      gain.connect(masterGain)
      osc.start()

      const lfo = this.ctx.createOscillator()
      const lfoGain = this.ctx.createGain()
      lfo.frequency.value = 0.1 + (i * 0.05)
      lfoGain.gain.value = freq * 0.02
      lfo.connect(lfoGain)
      lfoGain.connect(osc.frequency)
      lfo.start()

      this.nodes.push(osc, lfo)
    })
    this.playing = true
  }

  stop() {
    this.nodes.forEach(n => { try { n.stop() } catch(e) {} })
    this.nodes = []
    if (this.ctx) { try { this.ctx.close() } catch(e) {} }
    this.ctx = null
    this.playing = false
  }
}

const ambientSound = new AmbientSound()

// ============================================================
// MAIN APP
// ============================================================

export default function App() {
  const [page, setPage] = useState('home')
  const [time, setTime] = useState(getTimeSince())
  const [quote, setQuote] = useState(getRandomQuote())
  const [visionImages, setVisionImages] = useState(loadData('vision_images', []))
  const [bgImageIndex, setBgImageIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => setTime(getTimeSince()), 1000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => setQuote(getRandomQuote()), 60000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (visionImages.length === 0) return
    const interval = setInterval(() => {
      setBgImageIndex(i => (i + 1) % visionImages.length)
    }, 15000)
    return () => clearInterval(interval)
  }, [visionImages.length])

  const currentBgImage = visionImages.length > 0 ? visionImages[bgImageIndex]?.url : null

  const pages = {
    home: { icon: Home, label: 'Home' },
    brain: { icon: Brain, label: 'Brain' },
    dreams: { icon: Moon, label: 'Dreams' },
    nutrition: { icon: Salad, label: 'Nourish' },
    water: { icon: Droplets, label: 'Water' },
    gratitude: { icon: Heart, label: 'Gratitude' },
    vision: { icon: Image, label: 'Vision' },
    visualize: { icon: Eye, label: 'Visualize' },
    timer: { icon: Timer, label: 'Timer' },
    health: { icon: TrendingUp, label: 'Health' },
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Rotating Vision Board Background */}
      <AnimatePresence>
        {currentBgImage && (
          <motion.div
            key={bgImageIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.06 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 3 }}
            className="fixed inset-0 bg-cover bg-center pointer-events-none z-0"
            style={{ backgroundImage: `url(${currentBgImage})` }}
          />
        )}
      </AnimatePresence>

      {/* Ambient gradient */}
      <div className="fixed inset-0 pointer-events-none z-0"
        style={{ background: 'radial-gradient(ellipse at 30% 20%, rgba(201,168,76,0.04) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(100,80,160,0.03) 0%, transparent 50%)' }}
      />

      {/* Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-white/5" style={{ borderRadius: '20px 20px 0 0' }}>
        <div className="flex justify-around items-center px-2 py-2 max-w-lg mx-auto">
          {Object.entries(pages).map(([key, { icon: Icon, label }]) => (
            <button
              key={key}
              onClick={() => setPage(key)}
              className={`flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl transition-all ${
                page === key ? 'text-[#c9a84c]' : 'text-white/30 hover:text-white/50'
              }`}
            >
              <Icon size={18} />
              <span className="text-[10px] font-medium">{label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Neville Quote Bar */}
      <div className="fixed top-0 left-0 right-0 z-40 glass border-b border-white/5">
        <div className="max-w-lg mx-auto px-4 py-2.5 flex items-center gap-2">
          <Quote size={12} className="text-[#c9a84c] shrink-0" />
          <p className="text-[11px] text-white/50 italic serif leading-tight truncate">
            "{quote.text}"
          </p>
        </div>
      </div>

      {/* Page Content */}
      <main className="relative z-10 pt-12 pb-20 min-h-screen">
        <AnimatePresence mode="wait">
          <motion.div
            key={page}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {page === 'home' && <HomePage time={time} quote={quote} visionImages={visionImages} />}
            {page === 'brain' && <BrainPage time={time} />}
            {page === 'dreams' && <DreamsPage />}
            {page === 'nutrition' && <NutritionPage />}
            {page === 'water' && <WaterPage />}
            {page === 'gratitude' && <GratitudePage />}
            {page === 'vision' && <VisionBoardPage images={visionImages} setImages={setVisionImages} />}
            {page === 'visualize' && <VisualizePage />}
            {page === 'timer' && <TimerPage />}
            {page === 'health' && <HealthPage />}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  )
}

// ============================================================
// HOME PAGE
// ============================================================

function HomePage({ time, quote }) {
  const { current, next } = getCurrentMilestone(time.totalHours)
  const progress = next
    ? ((time.totalHours - current.hours) / (next.hours - current.hours)) * 100
    : 100

  return (
    <div className="max-w-lg mx-auto px-4 space-y-6">
      <div className="text-center pt-6">
        <h1 className="text-4xl font-black tracking-tight mb-1">REWIRE</h1>
        <p className="text-white/40 text-sm">Your neural pathways are rebuilding</p>
      </div>

      {/* Timer */}
      <div className="glass glow-gold p-6 text-center">
        <p className="text-[#c9a84c] text-xs font-semibold tracking-widest uppercase mb-4">Time Reclaimed</p>
        <div className="flex justify-center gap-4">
          {[
            { val: time.days, label: 'Days' },
            { val: time.hours, label: 'Hours' },
            { val: time.minutes, label: 'Min' },
            { val: time.seconds, label: 'Sec' },
          ].map(({ val, label }) => (
            <div key={label}>
              <div className="text-3xl font-black tabular-nums text-white">{String(val).padStart(2, '0')}</div>
              <div className="text-[10px] text-white/40 uppercase tracking-wider mt-1">{label}</div>
            </div>
          ))}
        </div>
        <div className="mt-4 text-white/30 text-xs">Since April 1, 2026 at 6:45 PM</div>
      </div>

      {/* Current Milestone */}
      <div className="glass p-5">
        <div className="flex items-start gap-3">
          <span className="text-2xl">{current.icon}</span>
          <div className="flex-1">
            <h3 className="font-bold text-white text-sm">{current.title}</h3>
            <p className="text-white/50 text-xs mt-1 leading-relaxed">{current.description}</p>
          </div>
        </div>
        {next && (
          <div className="mt-4">
            <div className="flex justify-between text-[10px] text-white/30 mb-1.5">
              <span>Current</span>
              <span>Next: {next.title}</span>
            </div>
            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ background: 'linear-gradient(90deg, #c9a84c, #e8d44d)' }}
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(progress, 100)}%` }}
                transition={{ duration: 1 }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Neville Featured Quote */}
      <div className="glass p-5 text-center">
        <Quote size={20} className="text-[#c9a84c] mx-auto mb-3" />
        <p className="serif text-lg italic text-white/80 leading-relaxed">"{quote.text}"</p>
        <p className="text-[#c9a84c] text-xs mt-3 tracking-wider">— {quote.source}</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { icon: Brain, label: 'Neurons\nRebuilding', value: Math.min(99, Math.floor(time.totalHours / 87.6)) + '%' },
          { icon: Moon, label: 'REM Sleep\nRecovery', value: Math.min(100, Math.floor(time.totalHours / 43.8)) + '%' },
          { icon: Zap, label: 'Dopamine\nBalance', value: Math.min(100, Math.floor(time.totalHours / 72)) + '%' },
        ].map(({ icon: Icon, label, value }) => (
          <div key={label} className="glass p-3 text-center">
            <Icon size={16} className="text-[#c9a84c] mx-auto mb-1.5" />
            <div className="text-lg font-bold text-white">{value}</div>
            <div className="text-[9px] text-white/30 whitespace-pre-line leading-tight mt-0.5">{label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ============================================================
// BRAIN PAGE
// ============================================================

function BrainPage({ time }) {
  const [expandedArticle, setExpandedArticle] = useState(null)
  const { current } = getCurrentMilestone(time.totalHours)

  return (
    <div className="max-w-lg mx-auto px-4 space-y-5">
      <div className="pt-4">
        <h2 className="text-2xl font-black">Your Brain Right Now</h2>
        <p className="text-white/40 text-sm mt-1">Understanding what's happening inside</p>
      </div>

      <div className="glass glow-gold p-5">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-3xl">{current.icon}</span>
          <div>
            <h3 className="font-bold text-white">{current.title}</h3>
            <p className="text-[#c9a84c] text-xs">{Math.floor(time.totalHours)} hours into recovery</p>
          </div>
        </div>
        <p className="text-white/60 text-sm leading-relaxed">{current.description}</p>
      </div>

      <div>
        <h3 className="font-bold text-sm mb-3 text-white/70">Recovery Timeline</h3>
        <div className="space-y-1">
          {NEURAL_MILESTONES.map((m, i) => {
            const reached = time.totalHours >= m.hours
            return (
              <div key={i} className={`flex items-center gap-3 p-3 rounded-xl transition-all ${reached ? 'glass' : 'opacity-40'}`}>
                <span className="text-lg">{m.icon}</span>
                <div className="flex-1">
                  <span className="text-xs font-semibold text-white">{m.title}</span>
                  {reached && <p className="text-[10px] text-white/40 mt-0.5">{m.description.slice(0, 80)}...</p>}
                </div>
                {reached && <Check size={14} className="text-[#c9a84c]" />}
              </div>
            )
          })}
        </div>
      </div>

      <div>
        <h3 className="font-bold text-sm mb-3 text-white/70">Deep Reads</h3>
        <div className="space-y-3">
          {BRAIN_ARTICLES.map((article, i) => (
            <div key={i} className="glass overflow-hidden">
              <button
                onClick={() => setExpandedArticle(expandedArticle === i ? null : i)}
                className="w-full p-4 flex items-center gap-3 text-left"
              >
                <span className="text-xl">{article.icon}</span>
                <span className="text-sm font-semibold text-white flex-1">{article.title}</span>
                <ChevronRight size={14} className={`text-white/30 transition-transform ${expandedArticle === i ? 'rotate-90' : ''}`} />
              </button>
              <AnimatePresence>
                {expandedArticle === i && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: 'auto' }}
                    exit={{ height: 0 }}
                    className="overflow-hidden"
                  >
                    <p className="px-4 pb-4 text-white/50 text-xs leading-relaxed">{article.content}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ============================================================
// DREAMS PAGE
// ============================================================

function DreamsPage() {
  const [dreams, setDreams] = useState(loadData('dreams', []))
  const [input, setInput] = useState('')
  const [chatMode, setChatMode] = useState(false)
  const [chatMessages, setChatMessages] = useState(loadData('dream_chats', []))
  const [chatInput, setChatInput] = useState('')

  const addDream = () => {
    if (!input.trim()) return
    const dream = { id: Date.now(), text: input, date: new Date().toISOString() }
    const updated = [dream, ...dreams]
    setDreams(updated)
    saveData('dreams', updated)
    setInput('')
  }

  const deleteDream = (id) => {
    if (!window.confirm('Are you sure you want to delete this dream?')) return
    const updated = dreams.filter(d => d.id !== id)
    setDreams(updated)
    saveData('dreams', updated)
  }

  const sendChat = () => {
    if (!chatInput.trim()) return
    const userMsg = { role: 'user', text: chatInput, time: new Date().toISOString() }
    const dreamCount = dreams.length
    const responses = [
      `That's beautiful. Your subconscious is communicating with you — this is exactly the kind of dream processing that happens during REM rebound. Your brain is integrating experiences it couldn't process before. You've logged ${dreamCount} dreams so far, and each one is a window into your healing.`,
      `I hear you. Dreams like this often emerge in the first weeks of recovery as your REM sleep architecture rebuilds. The vividness is a sign of healing — your brain is finally able to access these deeper layers of processing. Neville would say this dream is showing you a state you're moving toward.`,
      `This is your brain's way of processing and releasing. During cannabis use, REM is suppressed — now it's flooding back with everything it needs to work through. The fact that you remember this so clearly means your memory consolidation pathways are strengthening. That's real, measurable progress.`,
      `What you're describing sounds like your subconscious is reorganizing. Think of it as your brain defragmenting — sorting through old files, making new connections, building the neural architecture for who you're becoming. As Neville said, "Imagination is the beginning of creation."`,
      `I love that you're tracking this. Dream journaling during recovery is one of the most powerful things you can do — it strengthens the bridge between your conscious and subconscious mind. Each entry makes that bridge stronger. You have ${dreamCount} entries now — that's ${dreamCount} conversations with your deeper self.`,
    ]
    const aiMsg = {
      role: 'ai',
      text: responses[Math.floor(Math.random() * responses.length)],
      time: new Date().toISOString()
    }
    const updated = [...chatMessages, userMsg, aiMsg]
    setChatMessages(updated)
    saveData('dream_chats', updated)
    setChatInput('')
  }

  return (
    <div className="max-w-lg mx-auto px-4 space-y-5">
      <div className="pt-4 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black">Dream Journal</h2>
          <p className="text-white/40 text-sm mt-1">Your brain is learning to dream again</p>
        </div>
        <button
          onClick={() => setChatMode(!chatMode)}
          className={`p-2.5 rounded-xl transition-all ${chatMode ? 'bg-[#c9a84c]/20 text-[#c9a84c]' : 'glass text-white/40'}`}
        >
          <MessageCircle size={18} />
        </button>
      </div>

      {chatMode ? (
        <div className="glass p-4 space-y-4" style={{ minHeight: '60vh' }}>
          <div className="flex items-center gap-2 pb-3 border-b border-white/5">
            <Bot size={16} className="text-[#c9a84c]" />
            <span className="text-sm font-semibold text-white">Dream Companion</span>
          </div>
          <div className="space-y-3 overflow-y-auto" style={{ maxHeight: '50vh' }}>
            <div className="flex gap-2">
              <Bot size={14} className="text-[#c9a84c] mt-1 shrink-0" />
              <div className="glass p-3 text-xs text-white/60 leading-relaxed">
                Tell me about your dreams. I remember everything you share with me, and I'm here to help you understand what your brain is processing. Your REM sleep is rebuilding — these dreams are meaningful.
              </div>
            </div>
            {chatMessages.map((msg, i) => (
              <div key={i} className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                {msg.role === 'ai' && <Bot size={14} className="text-[#c9a84c] mt-1 shrink-0" />}
                <div className={`p-3 rounded-2xl text-xs leading-relaxed max-w-[80%] ${
                  msg.role === 'user' ? 'bg-[#c9a84c]/20 text-white/80' : 'glass text-white/60'
                }`}>
                  {msg.text}
                </div>
                {msg.role === 'user' && <User size={14} className="text-white/30 mt-1 shrink-0" />}
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              value={chatInput}
              onChange={e => setChatInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendChat()}
              placeholder="Tell me about your dream..."
              className="flex-1 text-sm rounded-xl"
            />
            <button onClick={sendChat} className="p-3 bg-[#c9a84c]/20 rounded-xl text-[#c9a84c]">
              <Send size={16} />
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="glass p-4">
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Describe your dream... every detail matters as your REM sleep rebuilds..."
              rows={4}
              className="w-full resize-none bg-transparent border-none text-sm"
            />
            <div className="flex justify-between items-center mt-3">
              <span className="text-[10px] text-white/20">{dreams.length} dreams recorded</span>
              <button onClick={addDream} className="px-4 py-2 bg-[#c9a84c] text-black text-xs font-semibold rounded-xl">
                Save Dream
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {dreams.map(dream => (
              <div key={dream.id} className="glass p-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="text-[10px] text-[#c9a84c]">{formatDate(dream.date)} at {formatTime(dream.date)}</div>
                  <button onClick={() => deleteDream(dream.id)} className="text-white/20 hover:text-red-400">
                    <Trash2 size={12} />
                  </button>
                </div>
                <p className="text-white/60 text-sm leading-relaxed">{dream.text}</p>
              </div>
            ))}
          </div>

          {dreams.length === 0 && (
            <div className="text-center py-12 text-white/20">
              <Moon size={32} className="mx-auto mb-3" />
              <p className="text-sm">Your dream journal is waiting</p>
              <p className="text-xs mt-1">As REM rebound kicks in, your dreams will become vivid and meaningful</p>
            </div>
          )}
        </>
      )}
    </div>
  )
}

// ============================================================
// NUTRITION PAGE
// ============================================================

function NutritionPage() {
  const [entries, setEntries] = useState(loadData('nutrition', []))
  const [input, setInput] = useState('')
  const [foundFood, setFoundFood] = useState(null)
  const [showResult, setShowResult] = useState(false)

  const logFood = () => {
    if (!input.trim()) return
    const found = findFoodBenefits(input)
    const entry = { id: Date.now(), text: input, date: new Date().toISOString(), food: found }
    const updated = [entry, ...entries]
    setEntries(updated)
    saveData('nutrition', updated)
    setFoundFood(found)
    setShowResult(true)
    setInput('')
    setTimeout(() => setShowResult(false), 10000)
  }

  const quickLog = (food, data) => {
    setFoundFood({ food, ...data })
    setShowResult(true)
    const entry = { id: Date.now(), text: food, date: new Date().toISOString(), food: { food, ...data } }
    const updated = [entry, ...entries]
    setEntries(updated)
    saveData('nutrition', updated)
    setTimeout(() => setShowResult(false), 10000)
  }

  return (
    <div className="max-w-lg mx-auto px-4 space-y-5">
      <div className="pt-4">
        <h2 className="text-2xl font-black">Nourish</h2>
        <p className="text-white/40 text-sm mt-1">Feed your brain what it needs to rebuild</p>
      </div>

      <div className="glass p-4 border-l-2 border-[#c9a84c]">
        <p className="serif italic text-white/50 text-sm">"Health is not created; it is only manifested by the arrangement of your mind — and what you feed it."</p>
        <p className="text-[10px] text-[#c9a84c] mt-1">— Adapted from Neville Goddard</p>
      </div>

      <div className="glass p-4">
        <p className="text-xs text-white/40 mb-2">What did you eat or drink?</p>
        <div className="flex gap-2">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && logFood()}
            placeholder="I had broccoli and salmon..."
            className="flex-1 text-sm"
          />
          <button onClick={logFood} className="px-4 py-2 bg-[#c9a84c] text-black text-xs font-semibold rounded-xl shrink-0">
            Log
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showResult && foundFood && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="glass glow-gold p-5"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 rounded-full" style={{ background: foundFood.color }} />
              <h3 className="font-bold text-white text-sm capitalize">{foundFood.food}</h3>
              <Sparkles size={14} className="text-[#c9a84c]" />
            </div>
            <p className="text-[#c9a84c] text-xs mb-2">{foundFood.nutrients}</p>
            <p className="text-white/60 text-xs leading-relaxed">{foundFood.benefits}</p>
          </motion.div>
        )}
        {showResult && !foundFood && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="glass p-4 text-center">
            <p className="text-white/40 text-xs">Logged! Try typing a specific food like "broccoli" or "salmon" and I'll tell you exactly how it's helping your brain rebuild.</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div>
        <h3 className="font-bold text-sm mb-3 text-white/70">Top Brain Recovery Foods</h3>
        <div className="grid grid-cols-4 gap-2">
          {Object.entries(FOOD_BENEFITS).slice(0, 16).map(([food, data]) => (
            <button
              key={food}
              onClick={() => quickLog(food, data)}
              className="glass p-2 text-center hover:border-[#c9a84c]/30 transition-all"
            >
              <div className="w-4 h-4 rounded-full mx-auto mb-1" style={{ background: data.color }} />
              <span className="text-[9px] text-white/50 capitalize">{food}</span>
            </button>
          ))}
        </div>
      </div>

      {entries.length > 0 && (
        <div>
          <h3 className="font-bold text-sm mb-3 text-white/70">Today's Nourishment</h3>
          <div className="space-y-2">
            {entries.slice(0, 10).map(entry => (
              <div key={entry.id} className="glass p-3 flex items-center gap-3">
                {entry.food && <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: entry.food.color }} />}
                <div className="flex-1">
                  <span className="text-xs text-white/70 capitalize">{entry.text}</span>
                  <span className="text-[10px] text-white/20 ml-2">{formatTime(entry.date)}</span>
                </div>
                {entry.food && <Sparkles size={10} className="text-[#c9a84c]" />}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ============================================================
// WATER TRACKER
// ============================================================

function WaterPage() {
  const today = new Date().toDateString()
  const [glasses, setGlasses] = useState(loadData(`water_${today}`, 0))
  const [history, setHistory] = useState(loadData('water_history', []))
  const goal = 8

  const addWater = () => {
    const newCount = glasses + 1
    setGlasses(newCount)
    saveData(`water_${today}`, newCount)
    const hist = history.filter(h => h.date !== today)
    hist.unshift({ date: today, glasses: newCount })
    setHistory(hist.slice(0, 30))
    saveData('water_history', hist.slice(0, 30))
  }

  const removeWater = () => {
    if (glasses <= 0) return
    const newCount = glasses - 1
    setGlasses(newCount)
    saveData(`water_${today}`, newCount)
  }

  const pct = Math.min(100, (glasses / goal) * 100)

  return (
    <div className="max-w-lg mx-auto px-4 space-y-5">
      <div className="pt-4">
        <h2 className="text-2xl font-black">Hydrate</h2>
        <p className="text-white/40 text-sm mt-1">Your brain is 73% water — it needs this</p>
      </div>

      <div className="glass glow-gold p-6 text-center">
        <div className="relative w-32 h-32 mx-auto mb-4">
          <svg viewBox="0 0 100 100" className="transform -rotate-90">
            <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
            <circle cx="50" cy="50" r="45" fill="none" stroke="#4a9ec7" strokeWidth="8"
              strokeDasharray={`${pct * 2.83} ${283 - pct * 2.83}`}
              strokeLinecap="round" className="transition-all duration-500"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <Droplets size={20} className="text-[#4a9ec7] mb-1" />
            <span className="text-2xl font-black text-white">{glasses}</span>
            <span className="text-[10px] text-white/30">of {goal} glasses</span>
          </div>
        </div>

        <div className="flex justify-center gap-3">
          <button onClick={removeWater} className="p-3 glass rounded-xl text-white/30 hover:text-white/50">
            <RotateCcw size={16} />
          </button>
          <button onClick={addWater} className="px-8 py-3 bg-[#4a9ec7]/20 border border-[#4a9ec7]/30 rounded-xl text-[#4a9ec7] font-semibold text-sm hover:bg-[#4a9ec7]/30 transition-all">
            <Plus size={16} className="inline mr-1" /> Add Glass
          </button>
        </div>

        {glasses >= goal && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-4 text-[#c9a84c] text-xs font-semibold"
          >
            Goal reached! Your neurons are hydrated and happy.
          </motion.div>
        )}
      </div>

      <div className="glass p-4 border-l-2 border-[#4a9ec7]">
        <p className="text-white/50 text-xs leading-relaxed">
          <strong className="text-white">During recovery,</strong> proper hydration is critical. Water supports the enzymatic processes that clear THC metabolites, cushions your brain during neuroplastic changes, and maintains the electrical signaling between your rebuilding neurons. Every glass is an act of care for your brain.
        </p>
      </div>

      {history.length > 1 && (
        <div>
          <h3 className="font-bold text-sm mb-3 text-white/70">This Week</h3>
          <div className="flex gap-2">
            {history.slice(0, 7).map((h, i) => (
              <div key={i} className="flex-1 glass p-2 text-center">
                <div className="text-xs font-bold text-white">{h.glasses}</div>
                <div className="text-[8px] text-white/20">{new Date(h.date).toLocaleDateString('en-US', { weekday: 'short' })}</div>
                <div className={`w-1.5 h-1.5 rounded-full mx-auto mt-1 ${h.glasses >= goal ? 'bg-[#4a9ec7]' : 'bg-white/10'}`} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ============================================================
// GRATITUDE JOURNAL
// ============================================================

function GratitudePage() {
  const [entries, setEntries] = useState(loadData('gratitude', []))
  const [input, setInput] = useState('')

  const addEntry = () => {
    if (!input.trim()) return
    const entry = { id: Date.now(), text: input, date: new Date().toISOString() }
    const updated = [entry, ...entries]
    setEntries(updated)
    saveData('gratitude', updated)
    setInput('')
  }

  const deleteEntry = (id) => {
    if (!window.confirm('Are you sure you want to delete this?')) return
    const updated = entries.filter(e => e.id !== id)
    setEntries(updated)
    saveData('gratitude', updated)
  }

  return (
    <div className="max-w-lg mx-auto px-4 space-y-5">
      <div className="pt-4">
        <h2 className="text-2xl font-black">Gratitude</h2>
        <p className="text-white/40 text-sm mt-1">Rewire your brain toward abundance</p>
      </div>

      <div className="glass p-4 border-l-2 border-[#c9a84c]">
        <p className="serif italic text-white/50 text-sm">"Assume the feeling of the wish fulfilled. Gratitude is the bridge between what you have and what you desire."</p>
        <p className="text-[10px] text-[#c9a84c] mt-1">— Neville Goddard</p>
      </div>

      <div className="glass p-4">
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); addEntry() } }}
          placeholder="I am grateful for..."
          rows={3}
          className="w-full resize-none bg-transparent border-none text-sm"
        />
        <div className="flex justify-between items-center mt-2">
          <span className="text-[10px] text-white/20">{entries.length} moments of gratitude</span>
          <button onClick={addEntry} className="px-4 py-2 bg-[#c9a84c] text-black text-xs font-semibold rounded-xl">
            Give Thanks
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {entries.map(entry => (
          <div key={entry.id} className="glass p-4">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2">
                <Heart size={12} className="text-[#c9a84c]" />
                <span className="text-[10px] text-white/30">{formatDate(entry.date)}</span>
              </div>
              <button onClick={() => deleteEntry(entry.id)} className="text-white/15 hover:text-red-400">
                <Trash2 size={12} />
              </button>
            </div>
            <p className="text-white/60 text-sm leading-relaxed">{entry.text}</p>
          </div>
        ))}
      </div>

      {entries.length === 0 && (
        <div className="text-center py-12 text-white/20">
          <Heart size={32} className="mx-auto mb-3" />
          <p className="text-sm">Start your gratitude practice</p>
          <p className="text-xs mt-1">Gratitude physically rewires neural pathways toward positivity</p>
        </div>
      )}
    </div>
  )
}

// ============================================================
// VISION BOARD
// ============================================================

function VisionBoardPage({ images, setImages }) {
  const fileInput = useRef(null)

  const addImage = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const img = { id: Date.now(), url: ev.target.result, name: file.name, date: new Date().toISOString(), affirmation: '' }
      const updated = [...images, img]
      setImages(updated)
      saveData('vision_images', updated)
    }
    reader.readAsDataURL(file)
  }

  const removeImage = (id) => {
    if (!window.confirm('Are you sure you want to remove this from your vision board?')) return
    const updated = images.filter(i => i.id !== id)
    setImages(updated)
    saveData('vision_images', updated)
  }

  const updateAffirmation = (id, text) => {
    const updated = images.map(i => i.id === id ? { ...i, affirmation: text } : i)
    setImages(updated)
    saveData('vision_images', updated)
  }

  return (
    <div className="max-w-lg mx-auto px-4 space-y-5">
      <div className="pt-4">
        <h2 className="text-2xl font-black">Vision Board</h2>
        <p className="text-white/40 text-sm mt-1">See it, feel it, become it — these images rotate throughout the app</p>
      </div>

      <div className="glass p-4 border-l-2 border-[#c9a84c]">
        <p className="serif italic text-white/50 text-sm">"Dare to believe in the reality of your assumption and watch the world play its part relative to its fulfillment."</p>
        <p className="text-[10px] text-[#c9a84c] mt-1">— Neville Goddard</p>
      </div>

      <button
        onClick={() => fileInput.current?.click()}
        className="w-full glass p-6 text-center hover:border-[#c9a84c]/30 transition-all"
      >
        <Plus size={24} className="mx-auto mb-2 text-[#c9a84c]" />
        <p className="text-white/50 text-sm">Add to your vision board</p>
        <p className="text-white/20 text-xs mt-1">These images will gently rotate throughout the app</p>
      </button>
      <input ref={fileInput} type="file" accept="image/*" onChange={addImage} className="hidden" />

      <div className="grid grid-cols-2 gap-3">
        {images.map(img => (
          <div key={img.id} className="glass overflow-hidden group relative">
            <img src={img.url} alt="" className="w-full h-40 object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
              <button onClick={() => removeImage(img.id)} className="text-white/60 hover:text-red-400">
                <Trash2 size={14} />
              </button>
            </div>
            <div className="p-2">
              <input
                value={img.affirmation}
                onChange={e => updateAffirmation(img.id, e.target.value)}
                placeholder="Add an affirmation..."
                className="w-full text-[10px] bg-transparent border-none p-0 text-white/40"
              />
            </div>
          </div>
        ))}
      </div>

      {images.length === 0 && (
        <div className="text-center py-12 text-white/20">
          <Image size={32} className="mx-auto mb-3" />
          <p className="text-sm">Your vision board is empty</p>
          <p className="text-xs mt-1">Add images of what you're manifesting — they'll gently rotate as your app background</p>
        </div>
      )}
    </div>
  )
}

// ============================================================
// VISUALIZATION PAGE
// ============================================================

function VisualizePage() {
  const [visualizations, setVisualizations] = useState(loadData('visualizations', []))
  const [input, setInput] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const recognitionRef = useRef(null)

  const startRecording = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('Speech recognition not supported in this browser')
      return
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    recognitionRef.current = new SpeechRecognition()
    recognitionRef.current.continuous = true
    recognitionRef.current.interimResults = true
    recognitionRef.current.onresult = (event) => {
      let transcript = ''
      for (let i = 0; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript
      }
      setInput(transcript)
    }
    recognitionRef.current.start()
    setIsRecording(true)
  }

  const stopRecording = () => {
    recognitionRef.current?.stop()
    setIsRecording(false)
  }

  const saveVisualization = () => {
    if (!input.trim()) return
    const viz = { id: Date.now(), text: input, date: new Date().toISOString(), type: isRecording ? 'spoken' : 'written' }
    const updated = [viz, ...visualizations]
    setVisualizations(updated)
    saveData('visualizations', updated)
    setInput('')
  }

  const deleteViz = (id) => {
    if (!window.confirm('Are you sure you want to delete this visualization?')) return
    const updated = visualizations.filter(v => v.id !== id)
    setVisualizations(updated)
    saveData('visualizations', updated)
  }

  return (
    <div className="max-w-lg mx-auto px-4 space-y-5">
      <div className="pt-4">
        <h2 className="text-2xl font-black">Visualize</h2>
        <p className="text-white/40 text-sm mt-1">Live in the end — feel it real</p>
      </div>

      <div className="glass glow-gold p-5">
        <Eye size={20} className="text-[#c9a84c] mb-3" />
        <h3 className="font-bold text-white text-sm mb-2">The SATS Technique</h3>
        <p className="text-white/50 text-xs leading-relaxed">
          Neville's "State Akin To Sleep" method: As you drift to sleep, create a short scene that implies your wish is fulfilled.
          Feel it as real. Loop it. The feeling is the secret — not the words, not the images, but the <em>feeling</em> of already having it.
          Write your scene below, or speak it aloud. Then close your eyes and <strong>live in the end</strong>.
        </p>
      </div>

      <div className="glass p-4">
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Write your visualization scene... Describe it in present tense as if it's already real. What do you see? What do you hear? How does it feel?"
          rows={5}
          className="w-full resize-none bg-transparent border-none text-sm"
        />
        <div className="flex justify-between items-center mt-3">
          <button
            onClick={isRecording ? stopRecording : startRecording}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs transition-all ${
              isRecording ? 'bg-red-500/20 text-red-400 animate-pulse' : 'glass text-white/40'
            }`}
          >
            <Mic size={14} />
            {isRecording ? 'Stop Recording' : 'Speak It'}
          </button>
          <button onClick={saveVisualization} className="px-4 py-2 bg-[#c9a84c] text-black text-xs font-semibold rounded-xl">
            Save Scene
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {visualizations.map(viz => (
          <div key={viz.id} className="glass p-4">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2">
                {viz.type === 'spoken' ? <Mic size={12} className="text-[#c9a84c]" /> : <Edit3 size={12} className="text-[#c9a84c]" />}
                <span className="text-[10px] text-white/30">{formatDate(viz.date)}</span>
              </div>
              <button onClick={() => deleteViz(viz.id)} className="text-white/15 hover:text-red-400">
                <Trash2 size={12} />
              </button>
            </div>
            <p className="text-white/60 text-sm leading-relaxed italic">"{viz.text}"</p>
          </div>
        ))}
      </div>

      {visualizations.length === 0 && (
        <div className="text-center py-12 text-white/20">
          <Eye size={32} className="mx-auto mb-3" />
          <p className="text-sm">Write your first visualization</p>
          <p className="text-xs mt-1">"Assume the feeling of the wish fulfilled"</p>
        </div>
      )}
    </div>
  )
}

// ============================================================
// MEDITATION TIMER
// ============================================================

function TimerPage() {
  const [duration, setDuration] = useState(10)
  const [remaining, setRemaining] = useState(null)
  const [isRunning, setIsRunning] = useState(false)
  const [selectedSound, setSelectedSound] = useState(TIMER_SOUNDS[0])
  const [soundOn, setSoundOn] = useState(true)
  const intervalRef = useRef(null)

  const startTimer = () => {
    setRemaining(duration * 60)
    setIsRunning(true)
    if (soundOn) ambientSound.start(selectedSound.freq)
  }

  const pauseTimer = () => {
    setIsRunning(false)
    ambientSound.stop()
  }

  const resetTimer = () => {
    setIsRunning(false)
    setRemaining(null)
    ambientSound.stop()
    clearInterval(intervalRef.current)
  }

  useEffect(() => {
    if (!isRunning || remaining === null) return
    intervalRef.current = setInterval(() => {
      setRemaining(prev => {
        if (prev <= 1) {
          setIsRunning(false)
          ambientSound.stop()
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(intervalRef.current)
  }, [isRunning])

  useEffect(() => {
    return () => ambientSound.stop()
  }, [])

  const mins = remaining !== null ? Math.floor(remaining / 60) : duration
  const secs = remaining !== null ? remaining % 60 : 0
  const pct = remaining !== null ? ((duration * 60 - remaining) / (duration * 60)) * 100 : 0

  return (
    <div className="max-w-lg mx-auto px-4 space-y-5">
      <div className="pt-4">
        <h2 className="text-2xl font-black">Meditation Timer</h2>
        <p className="text-white/40 text-sm mt-1">Enter the silence — SATS practice</p>
      </div>

      <div className="glass p-4 border-l-2 border-[#c9a84c]">
        <p className="serif italic text-white/50 text-sm">"Go within and shut the door. In the silence, assume the feeling of the wish fulfilled."</p>
        <p className="text-[10px] text-[#c9a84c] mt-1">— Neville Goddard</p>
      </div>

      <div className="glass glow-gold p-8 text-center">
        <div className="relative w-48 h-48 mx-auto mb-6">
          <svg viewBox="0 0 100 100" className="transform -rotate-90">
            <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="4" />
            <circle cx="50" cy="50" r="45" fill="none" stroke="#c9a84c" strokeWidth="4"
              strokeDasharray={`${pct * 2.83} ${283 - pct * 2.83}`}
              strokeLinecap="round" className="transition-all duration-1000"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-black tabular-nums text-white">
              {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
            </span>
            {remaining === 0 && (
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[#c9a84c] text-xs mt-2">
                Namaste
              </motion.span>
            )}
          </div>
        </div>

        <div className="flex justify-center gap-3">
          {!isRunning && remaining === null && (
            <button onClick={startTimer} className="px-8 py-3 bg-[#c9a84c] text-black font-semibold text-sm rounded-xl">
              <Play size={16} className="inline mr-2" /> Begin
            </button>
          )}
          {isRunning && (
            <button onClick={pauseTimer} className="px-6 py-3 glass text-white/60 text-sm rounded-xl">
              <Pause size={16} className="inline mr-2" /> Pause
            </button>
          )}
          {!isRunning && remaining !== null && remaining > 0 && (
            <button onClick={() => { setIsRunning(true); if (soundOn) ambientSound.start(selectedSound.freq) }}
              className="px-6 py-3 bg-[#c9a84c] text-black font-semibold text-sm rounded-xl">
              <Play size={16} className="inline mr-2" /> Resume
            </button>
          )}
          {remaining !== null && (
            <button onClick={resetTimer} className="px-4 py-3 glass text-white/30 text-sm rounded-xl">
              <RotateCcw size={16} />
            </button>
          )}
        </div>
      </div>

      {remaining === null && (
        <div>
          <h3 className="font-bold text-sm mb-3 text-white/70">Duration</h3>
          <div className="flex gap-2">
            {[5, 10, 15, 20, 30, 45, 60].map(min => (
              <button
                key={min}
                onClick={() => setDuration(min)}
                className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all ${
                  duration === min ? 'bg-[#c9a84c]/20 text-[#c9a84c] border border-[#c9a84c]/30' : 'glass text-white/30'
                }`}
              >
                {min}m
              </button>
            ))}
          </div>
        </div>
      )}

      <div>
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-bold text-sm text-white/70">Ambient Sound</h3>
          <button onClick={() => { setSoundOn(!soundOn); if (soundOn) ambientSound.stop() }}
            className={`p-2 rounded-xl ${soundOn ? 'text-[#c9a84c]' : 'text-white/20'}`}>
            {soundOn ? <Volume2 size={16} /> : <VolumeX size={16} />}
          </button>
        </div>
        <div className="grid grid-cols-5 gap-2">
          {TIMER_SOUNDS.map(sound => {
            const Icon = sound.icon
            return (
              <button
                key={sound.id}
                onClick={() => setSelectedSound(sound)}
                className={`p-3 rounded-xl text-center transition-all ${
                  selectedSound.id === sound.id ? 'bg-[#c9a84c]/20 border border-[#c9a84c]/30 text-[#c9a84c]' : 'glass text-white/30'
                }`}
              >
                <Icon size={16} className="mx-auto mb-1" />
                <span className="text-[9px]">{sound.name}</span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ============================================================
// HEALTH PAGE
// ============================================================

function HealthPage() {
  const [logs, setLogs] = useState(loadData('health_logs', []))
  const [mood, setMood] = useState(null)
  const [energy, setEnergy] = useState(null)
  const [sleep, setSleep] = useState('')
  const [notes, setNotes] = useState('')

  const logHealth = () => {
    const entry = { id: Date.now(), date: new Date().toISOString(), mood, energy, sleep: sleep ? parseFloat(sleep) : null, notes }
    const updated = [entry, ...logs]
    setLogs(updated)
    saveData('health_logs', updated)
    setMood(null); setEnergy(null); setSleep(''); setNotes('')
  }

  const moods = [
    { val: 1, emoji: '😔', label: 'Low' },
    { val: 2, emoji: '😐', label: 'Meh' },
    { val: 3, emoji: '🙂', label: 'Good' },
    { val: 4, emoji: '😊', label: 'Great' },
    { val: 5, emoji: '🤩', label: 'Amazing' },
  ]

  const energies = [
    { val: 1, label: 'Drained' },
    { val: 2, label: 'Low' },
    { val: 3, label: 'Steady' },
    { val: 4, label: 'Energized' },
    { val: 5, label: 'Electric' },
  ]

  return (
    <div className="max-w-lg mx-auto px-4 space-y-5">
      <div className="pt-4">
        <h2 className="text-2xl font-black">Health</h2>
        <p className="text-white/40 text-sm mt-1">Track your recovery in body and mind</p>
      </div>

      {/* Wearable Connection */}
      <div className="glass p-4">
        <h3 className="font-bold text-sm text-white mb-3">Connect Wearable</h3>
        <div className="grid grid-cols-2 gap-3">
          <button className="glass p-4 text-center hover:border-[#c9a84c]/30 transition-all">
            <div className="text-2xl mb-1">⌚</div>
            <span className="text-xs text-white/50">Apple Watch</span>
            <div className="text-[9px] text-[#c9a84c] mt-1">Coming Soon</div>
          </button>
          <button className="glass p-4 text-center hover:border-[#c9a84c]/30 transition-all">
            <div className="text-2xl mb-1">🟢</div>
            <span className="text-xs text-white/50">WHOOP</span>
            <div className="text-[9px] text-[#c9a84c] mt-1">Coming Soon</div>
          </button>
        </div>
        <p className="text-[10px] text-white/20 mt-3 text-center">Wearable integrations will sync your HRV, recovery score, sleep stages, and activity data</p>
      </div>

      {/* Spotify */}
      <div className="glass p-4">
        <div className="flex items-center gap-3">
          <Music size={20} className="text-[#1DB954]" />
          <div className="flex-1">
            <h3 className="font-bold text-sm text-white">Spotify</h3>
            <p className="text-xs text-white/40">Connect your saved episodes & playlists</p>
          </div>
          <button className="px-3 py-1.5 bg-[#1DB954]/20 border border-[#1DB954]/30 rounded-xl text-[#1DB954] text-xs font-semibold">
            Connect
          </button>
        </div>
      </div>

      {/* Daily Check-in */}
      <div className="glass p-5">
        <h3 className="font-bold text-sm text-white mb-4">Daily Check-in</h3>

        <div className="mb-4">
          <p className="text-xs text-white/40 mb-2">How are you feeling?</p>
          <div className="flex gap-2">
            {moods.map(m => (
              <button
                key={m.val}
                onClick={() => setMood(m.val)}
                className={`flex-1 py-2 rounded-xl text-center transition-all ${
                  mood === m.val ? 'bg-[#c9a84c]/20 border border-[#c9a84c]/30' : 'glass'
                }`}
              >
                <span className="text-lg">{m.emoji}</span>
                <div className="text-[9px] text-white/30 mt-0.5">{m.label}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <p className="text-xs text-white/40 mb-2">Energy level?</p>
          <div className="flex gap-2">
            {energies.map(e => (
              <button
                key={e.val}
                onClick={() => setEnergy(e.val)}
                className={`flex-1 py-2 rounded-xl text-center text-[10px] transition-all ${
                  energy === e.val ? 'bg-[#c9a84c]/20 border border-[#c9a84c]/30 text-[#c9a84c]' : 'glass text-white/30'
                }`}
              >
                {e.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <p className="text-xs text-white/40 mb-2">Hours of sleep last night</p>
          <input type="number" value={sleep} onChange={e => setSleep(e.target.value)} placeholder="7.5" step="0.5" className="w-full text-sm" />
        </div>

        <div className="mb-4">
          <p className="text-xs text-white/40 mb-2">Notes</p>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="How is your body feeling today? Any withdrawal symptoms? Cravings?"
            rows={3}
            className="w-full resize-none bg-transparent border-none text-sm"
          />
        </div>

        <button onClick={logHealth} className="w-full py-3 bg-[#c9a84c] text-black font-semibold text-sm rounded-xl">
          Log Check-in
        </button>
      </div>

      {logs.length > 0 && (
        <div>
          <h3 className="font-bold text-sm mb-3 text-white/70">Recent Check-ins</h3>
          <div className="space-y-2">
            {logs.slice(0, 7).map(log => (
              <div key={log.id} className="glass p-3 flex items-center gap-3">
                <span className="text-lg">{moods.find(m => m.val === log.mood)?.emoji || '📝'}</span>
                <div className="flex-1">
                  <div className="text-xs text-white/60">{formatDate(log.date)}</div>
                  {log.notes && <p className="text-[10px] text-white/30 mt-0.5 truncate">{log.notes}</p>}
                </div>
                <div className="text-right">
                  {log.sleep && <div className="text-xs text-white/40">{log.sleep}h sleep</div>}
                  <div className="text-[9px] text-white/20">{energies.find(e => e.val === log.energy)?.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
