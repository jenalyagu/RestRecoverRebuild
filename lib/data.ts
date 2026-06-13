// All RestRecoverRebuild content data

export const PHASES = [
  { id: "p1", name: "The Fourth Trimester", range: "Weeks 0–8", tagline: "Survive and heal", color: "#FDDDE6", tc: "#E0457B", weeks: 8 },
  { id: "p2", name: "The Settling Phase", range: "Months 3–6", tagline: "Find your rhythm", color: "#D4F5E2", tc: "#0E7A47", weeks: 12 },
  { id: "p3", name: "The Discovery Phase", range: "Months 6–9", tagline: "Grow together", color: "#EDE8FF", tc: "#3D1F9E", weeks: 12 },
  { id: "p4", name: "The Emergence Phase", range: "Months 9–12", tagline: "Become yourself again", color: "#D0F5F0", tc: "#006B5E", weeks: 13 },
] as const;

export type PhaseId = "p1" | "p2" | "p3" | "p4";

export interface JourneyWeek {
  n: number;
  title: string;
  body: string;
  physical: string;
  emotional: string;
  feeding: string;
}

export const JOURNEY_DATA: Record<PhaseId, JourneyWeek[]> = {
  p1: [
    { n: 1, title: "Rest & Recover", body: "Your only job is to feed your baby and heal. Sleep when baby sleeps — this is medicine.", physical: "Heavy bleeding (lochia) is normal. Ice packs for perineal soreness. Sitz baths 2–3x daily.", emotional: "Baby blues peak around day 3–5. Hormonal and normal. Lasts past 2 weeks? Talk to your provider.", feeding: "Colostrum gives way to milk around day 3–5. Expect cluster feeding." },
    { n: 2, title: "Finding Footing", body: "You may feel a bit more human. Bleeding lightens. Short walks are okay if cleared.", physical: "Bleeding becomes pinkish/brownish. Stitches dissolving. C-section moms: keep incision dry.", emotional: "Intense love AND intense anxiety can coexist. Both are real.", feeding: "Milk supply establishing. Watch for engorgement." },
    { n: 3, title: "Settling In", body: "A rhythm starts to emerge. Follow the baby, not the clock.", physical: "Most soreness improving. Continued fatigue is still normal.", emotional: "Isolation can creep in here. Text a friend. A short walk can shift your whole day.", feeding: "Growth spurts likely. Baby may seem hungry constantly. Temporary." },
    { n: 4, title: "Growth Spurt Season", body: "Baby feeding constantly doesn't mean low supply — it's building supply.", physical: "You may feel more mobile. Avoid lifting heavier than your baby.", emotional: "Postpartum anxiety shows up here for many moms. You are not alone.", feeding: "Cluster feeding is demand-building. Feed on demand." },
    { n: 5, title: "Emerging", body: "You're nearly halfway through the fourth trimester. Small joys are returning.", physical: "Light stretching and gentle walks feel good for most.", emotional: "If dark thoughts or numbness persist, please talk to your OB or midwife.", feeding: "Feeding may feel more efficient now." },
    { n: 6, title: "6-Week Check-In", body: "Your 6-week postpartum visit is this week. Advocate for yourself.", physical: "Provider clears you for exercise and intimacy — but YOUR timeline matters.", emotional: "Screen for PPD at this visit. Be honest. There's no wrong answer.", feeding: "Consider a lactation consultant if anything feels off." },
    { n: 7, title: "Building Back", body: "Gentle return to movement. Core reconnection. Pelvic floor therapy is highly recommended.", physical: "Any leaking with coughing or sneezing is common but not something you have to live with.", emotional: "Returning to parts of your pre-baby identity — even in small ways — matters.", feeding: "Fed is the foundation — however you're feeding, you're doing it right." },
    { n: 8, title: "Reflecting & Resetting", body: "8 weeks in. You've survived sleepless nights, body changes, emotional earthquakes. You are stronger than you know.", physical: "Pelvic floor PT referral if not already seen.", emotional: "It's okay if you don't love this stage. Ambivalence does not equal bad motherhood.", feeding: "You've established your feeding rhythm — honor it, adjust it, trust it." },
  ],
  p2: [
    { n: 1, title: "The 3-Month Turn", body: "Something shifts around 3 months. Baby smiles, coos, starts to feel like a little person.", physical: "Postpartum hair loss often peaks now. Normal — it will stop.", emotional: "The acute crisis phase is easing. But loneliness and identity questions are just beginning.", feeding: "If breastfeeding, supply is established. Either way — you did it." },
    { n: 2, title: "Sleep Regressions Begin", body: "The 4-month sleep regression is real and it's brutal. Baby's sleep architecture is changing permanently.", physical: "Gentle core work and walking are your foundation.", emotional: "Sleep deprivation at this stage can look like depression. Advocate for yourself.", feeding: "Growth spurts mean cluster feeding again." },
    { n: 3, title: "Returning to the World", body: "You may be returning to work, social life, or just leaving the house more. All of it is a transition.", physical: "Cleared for most exercise. Start slow — pelvic floor first, always.", emotional: "Mom guilt arrives in full force around this stage. Name it, examine it.", feeding: "Pumping at work is logistically intense. Give yourself grace." },
    { n: 4, title: "Finding Your People", body: "Isolation is one of the biggest risk factors for postpartum depression. Connection is medicine.", physical: "Postpartum body changes are ongoing. Treat it with patience.", emotional: "Postpartum rage is real, common, and treatable.", feeding: "Bottle introduction if not already done." },
    { n: 5, title: "The Identity Shift", body: "Who are you now? You are allowed to grieve your old self and love your new one simultaneously.", physical: "Energy is slowly returning.", emotional: "Matrescence — the psychological birth of a mother — is one of the least discussed major life transitions.", feeding: "Around 5 months, some babies show signs of readiness for solids. Not yet — but soon." },
    { n: 6, title: "Half a Year", body: "6 months. Half a year. Baby is sitting, laughing, grabbing. You are still standing.", physical: "If you haven't seen a pelvic floor PT yet — now is the time.", emotional: "Month 6 is a natural checkpoint. How are you really doing?", feeding: "Solids may begin around 6 months with provider guidance." },
  ],
  p3: [
    { n: 1, title: "Sitting Up, Opening Up", body: "Baby is sitting independently. So are you.", physical: "Core strength is returning. Running is on the table with PT clearance.", emotional: "Couples often hit a wall around month 7. Time to tend the relationship.", feeding: "Solids in full swing. Iron-rich foods are critical now." },
    { n: 2, title: "Crawling Toward Everything", body: "Mobility changes everything — for baby and for you. Baby-proofing is not optional.", physical: "Your energy may feel more like your pre-pregnancy self.", emotional: "Anxiety often spikes again when baby starts moving. Channel it, don't let it paralyze.", feeding: "Three meals a day, two snacks. Gagging is normal; choking is not." },
    { n: 3, title: "Separation Anxiety Begins", body: "Baby cries when you leave the room. This is healthy attachment.", physical: "Establish a consistent movement practice that you actually enjoy.", emotional: "Your mental health at 8 months matters as much as it did at 8 weeks.", feeding: "Finger foods, sippy cups, family meals." },
    { n: 4, title: "The 9-Month Leap", body: "Cognitive explosion. Baby understands object permanence.", physical: "This body grew, birthed, and fed a human.", emotional: "Month 9 often brings a second wave of identity clarity.", feeding: "Baby is eating more variety. Follow their lead." },
  ],
  p4: [
    { n: 1, title: "Pulling Up, Standing Tall", body: "Baby is pulling to stand. You are both finding your footing.", physical: "Strength training, running, yoga — your body is yours again.", emotional: "The one-year mark brings reflection. Grief and pride often arrive together.", feeding: "Transition to whole milk beginning around 12 months with pediatrician guidance." },
    { n: 2, title: "First Words", body: "'Mama.' The first time you hear it directed at you is a moment you will never forget.", physical: "Sleep may still be disrupted. Prioritize it when you can without guilt.", emotional: "Postpartum depression can appear or persist well into the first year. You are not 'too late' to get help.", feeding: "Eating together, even imperfectly, builds lifelong relationship with food." },
    { n: 3, title: "Walking Into the World", body: "First steps. Everything changes again.", physical: "Build a sustainable fitness routine you love.", emotional: "Reassess your relationship. What do you need? What does your partner need?", feeding: "Whole foods, family table, lots of mess. The chaos is connection." },
    { n: 4, title: "The First Birthday", body: "You did it. 365 days. You grew a human, survived the hardest transition of your life.", physical: "Your body at 12 months postpartum is a completely different story than at 6 weeks. Celebrate it.", emotional: "Grief for the baby stage that's ending is real. So is excitement for what's next.", feeding: "Baby is now a toddler at the table. The first year of feeding is complete." },
  ],
};

export const MILESTONES: Record<PhaseId, { month: string; milestones: string[] }[]> = {
  p1: [
    { month: "1 month", milestones: ["Lifts head briefly during tummy time", "Focuses on faces 8–12 inches away", "Responds to sound", "Makes small cooing sounds"] },
    { month: "2 months", milestones: ["First social smile", "Coos and gurgles", "Holds head up more steadily", "Bats at dangling objects"] },
  ],
  p2: [
    { month: "3 months", milestones: ["Laughs out loud", "Reaches for objects", "Recognizes familiar faces", "May begin rolling"] },
    { month: "4 months", milestones: ["Rolls from tummy to back", "Babbles expressively", "Brings hands to mouth"] },
    { month: "5 months", milestones: ["Sits with support", "Transfers objects hand to hand", "Responds to name"] },
    { month: "6 months", milestones: ["Sits without support briefly", "Babbles with consonants (ba, ma, da)", "Recognizes own name"] },
  ],
  p3: [
    { month: "7 months", milestones: ["Sits independently", "Starts crawling or scooting", "Object permanence developing"] },
    { month: "8 months", milestones: ["Pulls to standing", "Separation anxiety peaks", "Plays peekaboo"] },
    { month: "9 months", milestones: ["Cruises along furniture", "Points at objects", "First words may emerge"] },
  ],
  p4: [
    { month: "10 months", milestones: ["May take first steps", "Says 1–2 words with meaning", "Waves bye-bye"] },
    { month: "11 months", milestones: ["Stands alone briefly", "Vocabulary of 2–4 words", "Strong preferences emerging"] },
    { month: "12 months", milestones: ["Walking (or very close)", "2–5 words", "Points to ask for things"] },
  ],
};

export const DEFAULT_VILLAGE_TASKS = [
  { id: 1, task: "Drop off a ready-to-eat meal", category: "Food" },
  { id: 2, task: "Pick up groceries (shared list)", category: "Food" },
  { id: 3, task: "Hold baby so mom can sleep", category: "Baby" },
  { id: 4, task: "Do a load of laundry", category: "Home" },
  { id: 5, task: "Wash dishes or run dishwasher", category: "Home" },
  { id: 6, task: "Walk the dog / handle pet care", category: "Home" },
  { id: 7, task: "Run a specific errand", category: "Errand" },
  { id: 8, task: "Take older sibling(s) for an outing", category: "Family" },
  { id: 9, task: "Sit with mom (no agenda, just presence)", category: "Emotional" },
  { id: 10, task: "Make a phone call/appointment on her behalf", category: "Admin" },
];

export const MARKETPLACE_DEALS = [
  { id: "m1", phase: ["p1"], category: "Spa & Wellness", title: "Prenatal & Postnatal Massage", vendor: "Zeel", desc: "On-demand massage therapists come to you.", badge: "20% off first session", badgeColor: "#F9EEF0", badgeText: "#C47A8A", forTag: "For mom", price: "From $99", url: "https://www.zeel.com/" },
  { id: "m2", phase: ["p1"], category: "Spa & Wellness", title: "Postpartum Recovery Gift Box", vendor: "Frida Mom", desc: "Ice maxi pads, perineal foam, disposable underwear.", badge: "Village favorite", badgeColor: "#EEEDFE", badgeText: "#3C3489", forTag: "Gift from village", price: "$42", url: "https://fridamom.com/" },
  { id: "m3", phase: ["p1", "p2", "p3", "p4"], category: "Meal Delivery", title: "Factor Prepared Meals", vendor: "Factor", desc: "Chef-crafted, dietitian-approved ready meals. Heat and eat in 2 minutes.", badge: "$120 off first 4 weeks", badgeColor: "#EAF3DE", badgeText: "#3B6D11", forTag: "For mom", price: "From $11/meal", url: "https://www.factor75.com/" },
  { id: "m4", phase: ["p1", "p2"], category: "Lactation & Feeding", title: "Elvie Stride Breast Pump", vendor: "Elvie", desc: "Hands-free, hospital-grade wearable pump.", badge: "FSA/HSA eligible", badgeColor: "#FAEEDA", badgeText: "#633806", forTag: "For mom", price: "$299", url: "https://www.elvie.com/" },
  { id: "m5", phase: ["p1", "p2", "p3", "p4"], category: "Mental Health", title: "BetterHelp Online Therapy", vendor: "BetterHelp", desc: "Licensed therapist matched to you.", badge: "First month 20% off", badgeColor: "#EEEDFE", badgeText: "#3C3489", forTag: "For mom", price: "$60–$100/wk", url: "https://www.betterhelp.com/" },
  { id: "m6", phase: ["p1", "p2", "p3", "p4"], category: "Mental Health", title: "Calm App Subscription", vendor: "Calm", desc: "Guided meditations, sleep stories, and breathing exercises.", badge: "40% off annual", badgeColor: "#EEEDFE", badgeText: "#3C3489", forTag: "For mom", price: "$35/yr", url: "https://www.calm.com/" },
  { id: "m7", phase: ["p1", "p2", "p3", "p4"], category: "Baby Gear", title: "Hatch Rest+ Sound Machine", vendor: "Hatch", desc: "Smart sound machine, night light, and time-to-rise.", badge: "$20 off", badgeColor: "#E1F5EE", badgeText: "#085041", forTag: "For baby", price: "$80", url: "https://www.hatch.co/" },
  { id: "m8", phase: ["p1", "p2"], category: "Baby Gear", title: "Solly Baby Wrap", vendor: "Solly Baby", desc: "Lightweight stretchy wrap for hands-free babywearing.", badge: "Free shipping", badgeColor: "#E1F5EE", badgeText: "#085041", forTag: "For mom + baby", price: "$72", url: "https://sollybaby.com/" },
  { id: "m9", phase: ["p2"], category: "Returning to Work", title: "Medela Pump In Style", vendor: "Medela", desc: "Hospital-grade double electric pump.", badge: "FSA/HSA eligible", badgeColor: "#FAEEDA", badgeText: "#633806", forTag: "For mom", price: "$199", url: "https://www.medela.com/" },
  { id: "m10", phase: ["p2", "p3"], category: "Postpartum Fitness", title: "Every Mother Core Program", vendor: "Every Mother", desc: "Evidence-based postpartum core + pelvic floor program.", badge: "2 weeks free", badgeColor: "#EAF3DE", badgeText: "#3B6D11", forTag: "For mom", price: "$27/mo", url: "https://every-mother.com/" },
  { id: "m11", phase: ["p2", "p3"], category: "Starting Solids", title: "Solid Starts App", vendor: "Solid Starts", desc: "Evidence-based first foods guide with 1,000+ foods.", badge: "Free + premium", badgeColor: "#EAF3DE", badgeText: "#3B6D11", forTag: "For baby", price: "Free–$9.99", url: "https://solidstarts.com/" },
  { id: "m12", phase: ["p2", "p3", "p4"], category: "Mom Identity", title: "The Matrescence Book", vendor: "Lucy Jones", desc: "The definitive book on the psychological transformation of becoming a mother.", badge: "Must-read", badgeColor: "#EEEDFE", badgeText: "#3C3489", forTag: "For mom", price: "$18", url: "https://www.amazon.com/Matrescence-Lucy-Jones/dp/0593537947" },
  { id: "m13", phase: ["p1", "p2", "p3", "p4"], category: "Home Services", title: "Handy Home Cleaning", vendor: "Handy", desc: "Book a professional home cleaner in minutes.", badge: "$30 off first clean", badgeColor: "#FAEEDA", badgeText: "#633806", forTag: "Gift from village", price: "From $89", url: "https://www.handy.com/" },
];
