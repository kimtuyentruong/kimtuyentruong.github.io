/* IRONVERT Athletic Club — shared JS: demo data, header/footer, site search, saved state (localStorage)
   Edit the demo data in the "DEMO DATA" section below: classes, locations, trainers, schedule, plans, posts. */
(function(){
'use strict';
var KEY='ironvert:v1';
var body=document.body,ROOT=body.getAttribute('data-root')||'./',PAGE=body.getAttribute('data-page')||'home';
function $(s,c){return (c||document).querySelector(s)}
function $$(s,c){return Array.prototype.slice.call((c||document).querySelectorAll(s))}
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function fold(s){return String(s).normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase()}
/* currency: change the symbol / locale here */
function money(n){return '$'+Math.round(n).toLocaleString('en-US')}
/* 24h "18:30" -> "6:30 PM" (schedule data is stored in 24h so it sorts correctly) */
function tm(t){var p=String(t).split(':'),h=+p[0],ap=h<12?'AM':'PM';h=h%12||12;return h+':'+p[1]+' '+ap}
/* same, as HTML with a smaller AM/PM (used where the time is displayed large) */
function tmH(t){var p=String(t).split(':'),h=+p[0],ap=h<12?'AM':'PM';h=h%12||12;return h+':'+p[1]+'<small class="ampm">'+ap+'</small>'}
function nb(s){return String(s).replace(/ /g,' ')}
var store={
 all:function(){try{return JSON.parse(localStorage.getItem(KEY))||{}}catch(e){return {}}},
 get:function(k,d){var a=store.all();return a[k]===undefined?d:a[k]},
 set:function(k,v){try{var a=store.all();a[k]=v;localStorage.setItem(KEY,JSON.stringify(a))}catch(e){}}
};
/* images: placeholders live in assets/img/placeholders/<name>.jpg — replace the files (same names) with your photos */
/* live demo only: real photos (Unsplash) instead of the bundled placeholders */
var DEMO_IMG={"hero-home": "https://images.unsplash.com/photo-1517438322307-e67111335449?auto=format&w=2400&q=85", "hero-kickboxing": "https://images.unsplash.com/photo-1599058917212-d750089bc07e?auto=format&w=2400&q=85", "home-hiit-portrait": "https://images.unsplash.com/photo-1518310383802-640c2de311b2?auto=format&w=2400&q=85", "class-gym": "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&w=2400&q=85", "class-kickboxing": "https://images.unsplash.com/photo-1517438322307-e67111335449?auto=format&w=2400&q=85", "class-muay-thai": "https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?auto=format&w=2400&q=85", "class-boxing": "https://images.unsplash.com/photo-1583473848882-f9a5bc7fd2ee?auto=format&w=2400&q=85", "class-yoga": "https://images.unsplash.com/photo-1588286840104-8957b019727f?auto=format&w=2400&q=85", "class-pilates": "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&w=2400&q=85", "class-hiit": "https://images.unsplash.com/photo-1518310383802-640c2de311b2?auto=format&w=2400&q=85", "class-cycling": "https://images.unsplash.com/photo-1520877880798-5ee004e3f11e?auto=format&w=2400&q=85", "class-functional": "https://images.unsplash.com/photo-1533681904393-9ab6eee7e408?auto=format&w=2400&q=85", "class-swim": "https://images.unsplash.com/photo-1576610616656-d3aa5d1f4534?auto=format&w=2400&q=85", "class-pt": "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&w=2400&q=85", "location-downtown": "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&w=2400&q=85", "location-riverside": "https://images.unsplash.com/photo-1637666062717-1c6bcfa4a4df?auto=format&w=2400&q=85", "location-northgate": "https://images.unsplash.com/photo-1593079831268-3381b0db4a77?auto=format&w=2400&q=85", "coach-marcus": "https://images.unsplash.com/photo-1579758629938-03607ccdbaba?auto=format&w=2400&q=85", "coach-olivia": "https://images.unsplash.com/photo-1552196563-55cd4e45efb3?auto=format&w=2400&q=85", "coach-daniel": "https://images.unsplash.com/photo-1611672585731-fa10603fb9e0?auto=format&w=2400&q=85", "coach-sofia": "https://images.unsplash.com/photo-1594381898411-846e7d193883?auto=format&w=2400&q=85", "coach-jade": "https://images.unsplash.com/photo-1590556409324-aa1d726e5c3c?auto=format&w=2400&q=85", "coach-emma": "https://images.unsplash.com/photo-1571388208497-71bedc66e932?auto=format&w=2400&q=85", "coach-ryan": "https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?auto=format&w=2400&q=85", "coach-leo": "https://images.unsplash.com/photo-1597452485669-2c7bb5fef90d?auto=format&w=2400&q=85", "coach-nathan": "https://images.unsplash.com/photo-1530822847156-5df684ec5ee1?auto=format&w=2400&q=85", "coach-mia": "https://images.unsplash.com/photo-1609899537878-88d5ba429bdb?auto=format&w=2400&q=85", "post-habits": "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&w=2400&q=85", "post-reformer": "https://images.unsplash.com/photo-1599447421416-3414500d18a5?auto=format&w=2400&q=85", "post-nutrition": "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&w=2400&q=85", "gallery-gym-floor": "https://images.unsplash.com/photo-1623874514711-0f321325f318?auto=format&w=2400&q=85", "gallery-swimmer": "https://images.unsplash.com/photo-1530549387789-4c1017266635?auto=format&w=2400&q=85", "gallery-break": "https://images.unsplash.com/photo-1590556409324-aa1d726e5c3c?auto=format&w=2400&q=85", "article-hero": "https://images.unsplash.com/photo-1590556409324-aa1d726e5c3c?auto=format&w=2400&q=85", "article-gloves": "https://images.unsplash.com/photo-1583473848882-f9a5bc7fd2ee?auto=format&w=2400&q=85"};
function img(name){return DEMO_IMG[name]||ROOT+'assets/img/placeholders/'+name+'.jpg'}

/* ---------- DEMO DATA ---------- */
var D={};
D.groups={'strength':'Strength','combat':'Combat Sports','mind-body':'Yoga & Pilates','cardio':'Cardio & HIIT','recovery':'Swim & Recovery','personal':'1:1 Coaching'};
D.locs=[
 {id:'downtown',n:'IRONVERT Downtown',s:'Downtown',ward:'Downtown District, Your City',addr:'123 Main Street',area:'26,000 sq ft',floors:4,pool:true,park:'Validated parking in the garage next door, bike racks at the entrance',ph:'location-downtown',am:['4-lane pool','Dry sauna','Steam room','Fight room with ring','Reformer studio','Keypad lockers','Towel service','Bike racks'],note:'Our flagship: four floors in the heart of downtown, with a boxing ring and a rooftop pool.'},
 {id:'riverside',n:'IRONVERT Riverside',s:'Riverside',ward:'Riverside, Your City',addr:'456 Riverside Ave',area:'33,000 sq ft',floors:3,pool:true,park:'Free on-site parking lot and bike racks',ph:'location-riverside',am:['6-lane pool','Dry sauna','Cold plunge','Fight room','Cycling studio','Outdoor functional zone','Keypad lockers','Free parking'],note:'Our largest campus, with an outdoor functional zone and free parking. Weekday evenings are the busiest.'},
 {id:'northgate',n:'IRONVERT Northgate',s:'Northgate',ward:'Northgate, Your City',addr:'789 Northgate Blvd',area:'19,000 sq ft',floors:3,pool:false,park:'Street parking and bike racks',ph:'location-northgate',am:['Dry sauna','Fight room','Yoga & Pilates studio','Cycling studio','Keypad lockers','Towel service','Bike racks'],note:'Our newest club. No pool yet; dry sauna and a bright yoga studio with big windows.'}
];
D.disc=[
 {id:'gym',n:'Gym & Strength',g:'strength',int:3,dur:'Open gym or 60 min',lv:'All levels',ph:'class-gym',pos:'50% 50%',d:'Free weights, machines and a coached Strength Lab. Weekly programs for beginners included.',locs:['downtown','riverside','northgate'],k:'weights dumbbells barbell machines muscle strength lifting'},
 {id:'kickboxing',n:'Kickboxing',g:'combat',int:4,dur:'60 min',lv:'All levels',ph:'class-kickboxing',pos:'50% 35%',d:'Punches, kicks and combos on pads. Three levels; beginners learn technique before the high-intensity rounds.',locs:['downtown','riverside','northgate'],k:'martial arts punch kick gloves pads',url:'kickboxing/'},
 {id:'muay-thai',n:'Muay Thai',g:'combat',int:5,dur:'75 min',lv:'Some experience',ph:'class-muay-thai',pos:'50% 50%',d:'Knees, elbows and clinch work. For members with martial arts experience or who have finished Kickboxing Level 1.',locs:['downtown','northgate'],k:'muay thai martial arts knees elbows clinch'},
 {id:'boxing',n:'Boxing',g:'combat',int:4,dur:'60 min',lv:'All levels',ph:'class-boxing',pos:'50% 60%',d:'Footwork, defense and punch combinations. Light technique sessions for beginners and heavy-bag rounds for regulars.',locs:['downtown','riverside'],k:'boxing punch heavy bag'},
 {id:'yoga',n:'Yoga',g:'mind-body',int:2,dur:'60–75 min',lv:'All levels',ph:'class-yoga',pos:'50% 50%',d:'Hatha, Vinyasa and Yin. Early classes stay quiet and calm; evening classes focus on unwinding after work.',locs:['downtown','riverside','northgate'],k:'yoga hatha vinyasa yin stretch breathing'},
 {id:'pilates',n:'Pilates',g:'mind-body',int:2,dur:'50 min',lv:'All levels',ph:'class-pilates',pos:'50% 50%',d:'Mat Pilates and small-group Reformer, capped at 8. Core strength, posture and breath control.',locs:['downtown','riverside','northgate'],k:'pilates reformer core back posture'},
 {id:'hiit',n:'HIIT Circuit',g:'cardio',int:5,dur:'45 min',lv:'Some experience',ph:'class-hiit',pos:'50% 40%',d:'Station-based intervals with on-screen timers. Coaches offer an easier option for every move.',locs:['downtown','riverside','northgate'],k:'hiit cardio fat burn circuit intervals'},
 {id:'cycling',n:'Indoor Cycling',g:'cardio',int:4,dur:'45 min',lv:'All levels',ph:'class-cycling',pos:'50% 40%',d:'Rhythm-based indoor cycling; you control the resistance. Dark room, beat-synced lights, 30 bikes.',locs:['downtown','riverside','northgate'],k:'cycling spin bike indoor'},
 {id:'functional',n:'Functional & Mobility',g:'strength',int:3,dur:'50 min',lv:'All levels',ph:'class-functional',pos:'50% 50%',d:'Sled pushes, kettlebells, battle ropes and joint mobility. Ideal if you sit at a desk all day.',locs:['riverside','downtown','northgate'],k:'functional kettlebell mobility flexibility'},
 {id:'swim',n:'Swim & Recovery',g:'recovery',int:2,dur:'Open swim or 45 min',lv:'All levels',ph:'class-swim',pos:'50% 50%',d:'Indoor pool, adult swim lessons, dry sauna, steam room and cold plunge (varies by location).',locs:['downtown','riverside'],k:'swim pool sauna steam recovery cold plunge'},
 {id:'pt',n:'1:1 Personal Training',g:'personal',int:3,dur:'60 min',lv:'Tailored to you',ph:'class-pt',pos:'50% 40%',d:'Your own coach builds a program around your goals, tracks your progress and adjusts it every four weeks.',locs:['downtown','riverside','northgate'],k:'pt personal trainer coach one on one'}
];
D.coaches=[
 {id:'marcus',n:'Marcus Reed',role:'Head of Combat Sports',sp:['kickboxing','muay-thai','boxing'],loc:'downtown',yrs:9,ph:'coach-marcus',pos:'50% 25%',cert:['National Kickboxing Coach (sample)','Sports First Aid (sample)'],q:'Technique first, speed later. Nobody jumps into the hard rounds on day one.',bio:'Competed in amateur kickboxing for six years before coaching. Writes the combat curriculum for all three clubs.'},
 {id:'olivia',n:'Olivia Hart',role:'Yoga Coach',sp:['yoga','pilates'],loc:'downtown',yrs:7,ph:'coach-olivia',pos:'50% 30%',cert:['RYT 500 (sample)','Mat Pilates (sample)'],q:'Slow the breath down and the body starts to open up.',bio:'Teaches Hatha and Yin, with a focus on early-morning classes and desk-worker stretch sessions.'},
 {id:'daniel',n:'Daniel Brooks',role:'Head Personal Trainer – Strength',sp:['gym','functional','pt'],loc:'downtown',yrs:8,ph:'coach-daniel',pos:'50% 30%',cert:['NASM-CPT (sample)','Sports Nutrition Basics (sample)'],q:'Three sessions a week, every week, beats seven sessions once and then quitting.',bio:'Builds strength programs for beginners and for members returning after minor injuries (alongside their doctor’s advice).'},
 {id:'sofia',n:'Sofia Martinez',role:'Cycling & HIIT Coach',sp:['cycling','hiit'],loc:'downtown',yrs:5,ph:'coach-sofia',pos:'50% 25%',cert:['Indoor Cycling Instructor (sample)','ACE Group Fitness (sample)'],q:'The music is loud, but the resistance is yours. Ride your own ride.',bio:'Leads themed playlist rides and keeps the pace steady so first-timers can follow along.'},
 {id:'jade',n:'Jade Collins',role:'Boxing Coach',sp:['boxing','kickboxing','hiit'],loc:'riverside',yrs:6,ph:'coach-jade',pos:'40% 30%',cert:['Amateur Boxing Coach (sample)','ACE-CPT (sample)'],q:'Hitting pads is one of the most honest stress relievers there is.',bio:'Runs the evening Boxing and Kickboxing classes at Riverside, including a women-only class.'},
 {id:'emma',n:'Emma Lawson',role:'Pilates Coach',sp:['pilates','yoga'],loc:'riverside',yrs:6,ph:'coach-emma',pos:'50% 30%',cert:['Comprehensive Reformer Pilates (sample)'],q:'Pilates doesn’t need to be fast. It needs to be precise and consistent.',bio:'Teaches small-group Reformer with a focus on posture and lower-back health for people who sit a lot.'},
 {id:'ryan',n:'Ryan Foster',role:'Swim Coach',sp:['swim','functional'],loc:'riverside',yrs:10,ph:'coach-ryan',pos:'50% 35%',cert:['Swim Instructor (sample)','Lifeguard Certification (sample)'],q:'Swimming is a life skill first, and a workout second.',bio:'Takes adults from not swimming at all to 400 m of continuous freestyle, and oversees pool safety.'},
 {id:'leo',n:'Leo Kim',role:'Functional Coach',sp:['functional','hiit','cycling','gym'],loc:'riverside',yrs:5,ph:'coach-leo',pos:'50% 30%',cert:['Kettlebell Level 1 (sample)','Mobility Coach (sample)'],q:'A strong body is one that carries groceries, lifts kids and takes the stairs pain-free.',bio:'Runs the outdoor functional zone with workouts built around everyday movement.'},
 {id:'nathan',n:'Nathan Cole',role:'Combat & Strength Coach',sp:['muay-thai','kickboxing','gym','functional'],loc:'northgate',yrs:7,ph:'coach-nathan',pos:'50% 30%',cert:['Muay Thai Coach (sample)','NSCA-CPT (sample)'],q:'Keep your distance, keep your balance, then think about power.',bio:'Leads combat classes and the weight floor at Northgate, with amateur Muay Thai fight experience.'},
 {id:'mia',n:'Mia Turner',role:'Yoga & Pilates Coach',sp:['yoga','pilates'],loc:'northgate',yrs:5,ph:'coach-mia',pos:'50% 30%',cert:['RYT 200 (sample)','Mat & Reformer Pilates (sample)'],q:'Every session is a meeting with yourself.',bio:'Teaches Vinyasa and Pilates at Northgate, including a lunchtime stretch class for office workers.'}
];
/* schedule: [class id, weekdays (0 = Monday … 6 = Sunday), start time 24h, location, coach, room, capacity] */
var T=[
 ['kickboxing',[0,2,4],'06:00','downtown','marcus','Fight Room',20],['kickboxing',[1,3],'18:30','downtown','marcus','Fight Room',20],
 ['kickboxing',[0,3,5],'19:00','riverside','jade','Fight Room',18],['kickboxing',[1,4,6],'18:00','northgate','nathan','Fight Room',16],
 ['muay-thai',[1,3],'19:30','downtown','marcus','Ring',14],['muay-thai',[0,2],'19:30','northgate','nathan','Fight Room',14],
 ['boxing',[0,2,4],'18:30','riverside','jade','Fight Room',18],['boxing',[5],'09:00','downtown','marcus','Ring',16],
 ['yoga',[0,2,4],'06:15','downtown','olivia','Yoga Studio',24],['yoga',[1,3],'19:00','downtown','olivia','Yoga Studio',24],
 ['yoga',[5,6],'08:00','riverside','emma','Yoga Studio',22],['yoga',[0,2,4],'12:00','northgate','mia','Yoga Studio',20],['yoga',[1,3,6],'19:00','northgate','mia','Yoga Studio',20],
 ['pilates',[1,3,5],'07:00','riverside','emma','Reformer Studio',8],['pilates',[0,2,4],'17:30','riverside','emma','Reformer Studio',8],
 ['pilates',[1,4],'12:15','downtown','olivia','Reformer Studio',8],['pilates',[2,5],'18:00','northgate','mia','Yoga Studio',12],
 ['hiit',[0,2,4],'17:30','downtown','sofia','Studio 1',22],['hiit',[1,3,5],'06:30','riverside','leo','Outdoor Zone',20],['hiit',[1,3],'06:30','northgate','nathan','Studio',18],['hiit',[6],'09:00','riverside','jade','Studio 1',22],
 ['cycling',[1,3,5],'18:00','downtown','sofia','Cycling Studio',30],['cycling',[0,4],'06:00','downtown','sofia','Cycling Studio',30],['cycling',[0,2,4],'19:00','riverside','leo','Cycling Studio',30],['cycling',[5],'17:00','northgate','nathan','Cycling Studio',24],
 ['functional',[0,2,4],'07:00','riverside','leo','Outdoor Zone',16],['functional',[1,3],'17:30','downtown','daniel','Strength Lab',16],['functional',[2,6],'08:00','northgate','nathan','Studio',16],
 ['gym',[0,1,2,3,4],'18:00','downtown','daniel','Strength Lab',12],['gym',[5],'08:30','riverside','leo','Weight Floor',12],['gym',[1,3],'17:00','northgate','nathan','Weight Floor',12],
 ['swim',[1,3,5],'06:00','riverside','ryan','Pool',10],['swim',[0,2,6],'19:00','downtown','ryan','Rooftop Pool',10]
];
D.days=['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
D.dshort=['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
function hash(s){var h=7;for(var i=0;i<s.length;i++)h=(h*31+s.charCodeAt(i))%9973;return h}
D.sessions=[];
T.forEach(function(t){t[1].forEach(function(day){var id=t[0]+'-'+day+'-'+t[2].replace(':','')+'-'+t[3];var bk=Math.min(t[6],Math.round(t[6]*(.35+(hash(id)%60)/100)));D.sessions.push({id:id,disc:t[0],day:day,time:t[2],loc:t[3],coach:t[4],room:t[5],cap:t[6],bk:bk})})});
D.sessions.sort(function(a,b){return a.day-b.day||a.time.localeCompare(b.time)});
/* membership plans: m = monthly price in USD (sample) */
D.plans=[
 {id:'base',n:'Base',m:49,for:'Open gym and cardio at one home club of your choice.',f:['Weights, machines and cardio','1 home club','1 coach orientation session','Booking app'],x:['Group classes','Pool and sauna','Monthly PT sessions']},
 {id:'core',n:'Core',m:89,hot:true,for:'Every group class at all three clubs: combat, yoga, cycling, HIIT.',f:['Everything in Base','Unlimited group classes','All 3 clubs','Book 7 days ahead','2 InBody scans per quarter'],x:['Pool and sauna','Monthly PT sessions']},
 {id:'elite',n:'Elite',m:159,for:'The full package: pool, sauna, monthly PT and a private locker.',f:['Everything in Core','Pool, sauna and cold plunge','4 PT sessions per month','Private locker and towels','Book 14 days ahead','Bring 1 guest per month'],x:[]}
];
D.terms=[{m:1,off:0,l:'1 month'},{m:3,off:.05,l:'3 months'},{m:6,off:.1,l:'6 months'},{m:12,off:.18,l:'12 months'}];
D.addons=[
 {id:'pt10',n:'10-session 1:1 PT pack',d:'Use within 3 months, any trainer',p:650,once:true},
 {id:'ref8',n:'8-class Reformer pack',d:'For Base/Core; Elite already includes 4 per month',p:180,once:true},
 {id:'locker',n:'Private locker',d:'Leave your gear overnight, your own code',p:15,once:false},
 {id:'nutri',n:'Nutrition coaching',d:'2 sessions with a nutrition coach (sample)',p:120,once:true}
];
D.posts=[
 {id:'first-week-kickboxing',t:'Your First Week of Kickboxing: 7 Things to Know Before You Glove Up',c:'Combat Sports',dt:'November 12, 2026',min:8,ph:'class-kickboxing',ex:'What to bring, what to eat beforehand, how to wrap your hands, and why you don’t need to hit hard on day one.',full:true},
 {id:'three-sessions-a-week',t:'Three Sessions a Week: Staying Consistent When Life Gets Busy',c:'Habits',dt:'November 5, 2026',min:6,ph:'post-habits',ex:'Plan around morning, lunch and evening slots, and lean on 45-minute classes during your busiest weeks.'},
 {id:'reformer-vs-mat',t:'Reformer vs. Mat Pilates: What’s the Difference?',c:'Yoga & Pilates',dt:'October 29, 2026',min:5,ph:'post-reformer',ex:'Same roots, very different feel. How to choose based on your goals and budget.'},
 {id:'eat-before-evening',t:'What to Eat Before an After-Work Workout',c:'Nutrition',dt:'October 22, 2026',min:4,ph:'post-nutrition',ex:'A light snack 60–90 minutes before, enough water, and what to skip. General information only.'},
 {id:'sauna-cold-plunge',t:'Sauna and Cold Plunge: How to Use Them Safely',c:'Recovery',dt:'October 15, 2026',min:5,ph:'class-swim',ex:'How long each round should last, staying hydrated, and who should check with a doctor first.'},
 {id:'first-cycling-class',t:'Your First Cycling Class: Setting Up Your Bike',c:'Cardio',dt:'October 8, 2026',min:4,ph:'class-cycling',ex:'Seat height, handlebar reach and how to dial in resistance without straining your knees.'}
];
D.pages=[
 {id:'home',u:'',n:'Home'},
 {id:'classes',u:'classes/',n:'Classes',d:'11 disciplines, filter by type and intensity',nav:1},
 {id:'schedule',u:'schedule/',n:'Schedule',d:'Weekly timetable at 3 clubs, book ahead',nav:1},
 {id:'membership',u:'membership/',n:'Membership',d:'Compare plans, price by term, policies',nav:1},
 {id:'trainers',u:'trainers/',n:'Trainers',d:'10 coaches, filter by discipline and club',nav:1},
 {id:'locations',u:'locations/',n:'Locations',d:'3 clubs, floor plans, amenities',nav:1},
 {id:'tools',u:'tools/',n:'Tools',d:'BMI, daily calories, class-finder quiz',nav:1},
 {id:'blog',u:'blog/',n:'Blog',d:'Articles on training and recovery',nav:1},
 {id:'kickboxing',u:'kickboxing/',n:'Kickboxing',d:'Class detail: 3-level path, 60-minute session'},
 {id:'free-trial',u:'free-trial/',n:'Free Trial',d:'4 steps, instant confirmation code'}
];
D.disc.forEach(function(x){x.url=x.url||('classes/#'+x.id)});
D.loc=function(id){return D.locs.filter(function(l){return l.id===id})[0]};
D.d=function(id){return D.disc.filter(function(l){return l.id===id})[0]};
D.coach=function(id){return D.coaches.filter(function(l){return l.id===id})[0]};
D.sess=function(id){return D.sessions.filter(function(l){return l.id===id})[0]};
D.today=(new Date().getDay()+6)%7;

/* ---------- SVG icons ---------- */
var IC={
 go:'<path d="M5 12h14M13 6l6 6-6 6"/>',ur:'<path d="M7 17 17 7M8 7h9v9"/>',search:'<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',menu:'<path d="M4 7h16M4 12h16M4 17h10"/>',x:'<path d="M6 6l12 12M18 6 6 18"/>',
 check:'<path d="m5 12 4.5 4.5L19 7"/>',clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',pin:'<path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
 user:'<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',users:'<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 4.5a3.5 3.5 0 0 1 0 7M18 14a6.5 6.5 0 0 1 3.5 6"/>',
 bolt:'<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>',cal:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',star:'<path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1 6.2L12 17.3 6.5 20.2l1-6.2L3 9.6l6.2-.9z"/>',
 db:'<path d="M6.5 6.5v11M17.5 6.5v11M3 9v6M21 9v6M6.5 12h11"/>',glove:'<path d="M7 11V6a3 3 0 0 1 3-3h5a4 4 0 0 1 4 4v6a6 6 0 0 1-6 6H9a2 2 0 0 1-2-2v-1"/><path d="M7 11a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2M7 21h8M11 8h6"/>',
 lotus:'<path d="M12 20c-4 0-8-2-9-6 3 0 6 1 9 4 3-3 6-4 9-4-1 4-5 6-9 6z"/><path d="M12 18c-2-2-3-5-3-8 1 1 2.2 1.8 3 3 .8-1.2 2-2 3-3 0 3-1 6-3 8zM12 4c1.5 1.5 2 3.5 2 5"/>',
 bike:'<circle cx="6" cy="17" r="3.5"/><circle cx="18" cy="17" r="3.5"/><path d="M6 17l4-8h5l3 8M10 9 8 5H6M15 9l-3 8"/>',wave:'<path d="M2 15c2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2 2.5 2 5 2M2 20c2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2 2.5 2 5 2"/><circle cx="15" cy="6" r="2"/><path d="m6 11 4-4 3 3"/>',
 timer:'<circle cx="12" cy="13" r="8"/><path d="M12 9v4l2.5 2.5M9 2h6"/>',shield:'<path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6z"/><path d="m8.5 12 2.5 2.5 4.5-4.5"/>',info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.5"/>',
 alert:'<path d="M12 3 2 20h20z"/><path d="M12 10v4M12 17v.5"/>',plus:'<path d="M12 5v14M5 12h14"/>',trash:'<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>',
 phone:'<path d="M5 3h4l2 5-2.5 1.5a11 11 0 0 0 6 6L16 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 5a2 2 0 0 1 2-2z"/>',mail:'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
 fb:'<path d="M14 21v-8h3l.5-3.5H14V7.5c0-1 .4-1.8 1.9-1.8H18V2.6c-.4 0-1.6-.1-3-.1-3 0-4.6 1.8-4.6 4.9v2.1H7.5V13h2.9v8"/>',ig:'<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><path d="M17.5 6.5v.01"/>',
 yt:'<rect x="2.5" y="5.5" width="19" height="13" rx="4"/><path d="m10 9 5 3-5 3z"/>',tt:'<path d="M14 3v11.5a3.5 3.5 0 1 1-3.5-3.5M14 3c.5 2.5 2.5 4.5 5 4.8"/>',
 towel:'<path d="M5 4h11a3 3 0 0 1 3 3v13H8V7a3 3 0 0 0-3-3zm0 0a3 3 0 0 0-3 3v3h6"/><path d="M11 14h5"/>',lock:'<rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3M12 14.5v2"/>',
 steam:'<path d="M8 3c-1.5 2 1.5 3 0 5M12 3c-1.5 2 1.5 3 0 5M16 3c-1.5 2 1.5 3 0 5"/><path d="M3 12h18v3a6 6 0 0 1-6 6H9a6 6 0 0 1-6-6z"/>',car:'<path d="M5 17h14v-5l-2-5H7l-2 5zM5 17v2M19 17v2M5 12h14"/><circle cx="8" cy="14.5" r="1"/><circle cx="16" cy="14.5" r="1"/>',
 drop:'<path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z"/>',target:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5"/>',book:'<path d="M4 4h6a3 3 0 0 1 3 3v13a2 2 0 0 0-2-2H4zM20 4h-6a3 3 0 0 0-3 3v13a2 2 0 0 1 2-2h7z"/>',
 up:'<path d="M12 19V5M6 11l6-6 6 6"/>',card:'<rect x="2.5" y="5" width="19" height="14" rx="2"/><path d="M2.5 10h19M6 15h4"/>',calc:'<rect x="5" y="2.5" width="14" height="19" rx="2"/><path d="M8 6.5h8M8 11h.01M12 11h.01M16 11h.01M8 14.5h.01M12 14.5h.01M16 14.5v3.5M8 18h4"/>',
 help:'<circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6v.6M12 17v.5"/>',map:'<path d="m3 6 6-2 6 2 6-2v14l-6 2-6-2-6 2z"/><path d="M9 4v14M15 6v14"/>',
 news:'<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 8h10M7 12h10M7 16h6"/>',heart:'<path d="M12 20s-8-5-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 9c0 6-8 11-8 11z"/>',
 apple:'<path d="M12 7c-1.5-1-5-1.5-6.5 1.5S5 16 7.5 19c1.5 1.8 3 1.5 4.5.8 1.5.7 3 1 4.5-.8 2.5-3 2.5-8.5 1-10.5S13.5 6 12 7zM12 7c0-2 1-3.5 3-4"/>',
 run:'<circle cx="14" cy="4.5" r="2"/><path d="m6 21 4-6 3 2v5M8 11l2-4 4 1 3 3 3 1M10 7 6 9l-1 3"/>',body:'<circle cx="12" cy="4.5" r="2"/><path d="M5 9h14M12 9v6M9 21l3-6 3 6"/>'
};
var spr='<svg width="0" height="0" style="position:absolute" aria-hidden="true">'+Object.keys(IC).map(function(k){return '<symbol id="i-'+k+'" viewBox="0 0 24 24">'+IC[k]+'</symbol>'}).join('')+'</svg>';
body.insertAdjacentHTML('afterbegin',spr);
function ico(k,c){return '<svg class="ico'+(c?' '+c:'')+'" aria-hidden="true"><use href="#i-'+k+'"/></svg>'}

/* ---------- header / footer ---------- */
var LOGO='<svg viewBox="0 0 40 40" aria-hidden="true"><rect width="40" height="40" rx="6" fill="#B8F23A"/><path d="M9 29 17 11h5l-8 18zM19 29l8-18h5l-8 18z" fill="#0A0D06"/></svg>';
var navActive=PAGE==='kickboxing'?'classes':PAGE;
var holds=store.get('holds',[]);
var navHtml=D.pages.filter(function(p){return p.nav}).map(function(p){return '<'+'a href="'+ROOT+p.u+'"'+(p.id===navActive?' aria-current="page"':'')+'>'+nb(p.n)+'</a>'}).join('');
var hdr=document.getElementById('site-header');
if(hdr){hdr.outerHTML='<header class="hdr" id="hdr"><div class="wrap">'+
 '<'+'a class="logo" href="'+ROOT+'" aria-label="IRONVERT Athletic Club, back to home">'+LOGO+'<span><b>Ironvert</b><small>Athletic Club</small></span></a>'+
 '<nav class="nav" aria-label="Main menu">'+navHtml+'</nav>'+
 '<div class="hdr-tools"><button class="ibtn" type="button" id="openSearch" aria-label="Search the site (press /)">'+ico('search')+'</button>'+
 '<'+'a class="ibtn" href="'+ROOT+'schedule/#my-bookings" aria-label="My booked classes">'+ico('cal')+'<span class="cnt" id="holdCnt"'+(holds.length?'':' hidden')+'>'+holds.length+'</span></a>'+
 '<'+'a class="btn btn-lime btn-s hdr-cta" href="'+ROOT+'free-trial/"'+(PAGE==='free-trial'?' aria-current="page"':'')+'>Free&nbsp;Trial&nbsp;Class</a>'+
 '<button class="ibtn burger" type="button" id="burger" aria-label="Open menu" aria-expanded="false" aria-controls="mnav">'+ico('menu')+'</button></div></div></header>'+
 '<div class="mnav" id="mnav" role="dialog" aria-modal="true" aria-label="Menu"><ol>'+
 D.pages.filter(function(p){return p.nav}).map(function(p){return '<li><'+'a href="'+ROOT+p.u+'"'+(p.id===navActive?' aria-current="page"':'')+'>'+p.n+'</a></li>'}).join('')+
 '</ol><'+'a class="btn btn-lime" href="'+ROOT+'free-trial/">Book a Free&nbsp;Trial '+ico('go','go')+'</a><p class="note" style="margin-top:20px">Call (555)&nbsp;010-0000 · Open 5&nbsp;AM–10&nbsp;PM</p></div>';}
var ftr=document.getElementById('site-footer');
if(ftr){ftr.outerHTML='<footer class="ftr"><div class="wrap"><div class="ftr-top">'+
 '<div><'+'a class="logo" href="'+ROOT+'">'+LOGO+'<span><b>Ironvert</b><small>Athletic Club</small></span></a><p style="margin:18px 0 0;max-width:34ch">A full-service athletic club: gym, combat sports, yoga, Pilates, cycling and swim. One membership, all three&nbsp;clubs.</p>'+
 '<div class="soc"><a href="#" aria-label="Facebook">'+ico('fb')+'</a><a href="#" aria-label="Instagram">'+ico('ig')+'</a><a href="#" aria-label="YouTube">'+ico('yt')+'</a><a href="#" aria-label="TikTok">'+ico('tt')+'</a></div></div>'+
 '<div><h3>Sitemap</h3><ul>'+D.pages.map(function(p){return '<li><'+'a href="'+ROOT+p.u+'">'+p.n+'</a></li>'}).join('')+'</ul></div>'+
 '<div><h3>Opening Hours</h3><dl class="hours"><dt>Mon–Fri</dt><dd>5&nbsp;AM–10&nbsp;PM</dd><dt>Sat</dt><dd>6&nbsp;AM–9&nbsp;PM</dd><dt>Sun &amp; holidays</dt><dd>6&nbsp;AM–8&nbsp;PM</dd></dl>'+
 '<h3 style="margin-top:28px">Contact</h3><ul><li><a href="tel:+15550100000">'+ico('phone','s')+' (555)&nbsp;010-0000</a></li><li><a href="mailto:hello@example.com">'+ico('mail','s')+' hello@example.com</a></li></ul></div>'+
 '<div><h3>Locations</h3><ul>'+D.locs.map(function(l){return '<li><'+'a href="'+ROOT+'locations/#'+l.id+'"><b style="color:var(--ink);font-weight:600">'+l.s+'</b><br><span class="muted small">'+l.addr+', '+l.ward+'</span></a></li>'}).join('')+'</ul>'+
 '<div class="fmap" aria-hidden="true"><svg viewBox="0 0 320 180"><rect width="320" height="180" fill="#0D100D"/><path d="M0 120C60 100 90 140 150 118S250 70 320 92" stroke="#1B3A26" stroke-width="14" fill="none"/><path d="M40 0v180M120 0v180M200 0v180M280 0v180M0 40h320M0 90h320M0 140h320" stroke="#1B201B"/><circle cx="110" cy="96" r="6" fill="#B8F23A"/><circle cx="190" cy="70" r="6" fill="#B8F23A"/><text x="122" y="100" fill="#9AA597" font-size="11" font-family="Inter">Downtown</text><text x="202" y="74" fill="#9AA597" font-size="11" font-family="Inter">Riverside</text></svg></div></div>'+
 '</div><div class="big" aria-hidden="true">Ironvert</div>'+
 '<div class="ftr-bot"><span>© IRONVERT Athletic Club. Demo content: brand name, prices, staff, certifications, schedule, reviews and images are for illustration only.</span><span>If you have a heart condition, high blood pressure, joint problems or are pregnant, check with your doctor before starting a new exercise program.</span></div></div></footer>';}

/* ---------- keep short words and key phrases together in headings and buttons ---------- */
var GLUE=['free trial','personal training','group class','group classes','athletic club','strength lab','first class','one membership','three clubs','all three','every week','per week','a week','sq ft'];
var SHORT=/(^|[\s ])(&|a|an|the|of|to|in|on|at|by|for|and|or|with|your|our|my|per|is|be|no|not|it|as|vs\.) /gi;
function glue(el){var w=document.createTreeWalker(el,4),n,a=[];while(n=w.nextNode())a.push(n);a.forEach(function(n){var t=n.nodeValue;GLUE.forEach(function(g){var re=new RegExp(g.replace(/ /g,'[  ]'),'gi');t=t.replace(re,function(m){return m.replace(/ /g,' ')})});for(var k=0;k<3;k++)t=t.replace(SHORT,function(m,a,b){return a+b+' '});n.nodeValue=t})}
function glueAll(root){$$('h1,h2,h3,.btn,.lnk',root||document).forEach(glue)}
glueAll();

/* ---------- mobile menu ---------- */
var burger=$('#burger'),mnav=$('#mnav'),hdrEl=$('#hdr');
function setMenu(o){if(!mnav)return;mnav.classList.toggle('open',o);burger.setAttribute('aria-expanded',o);burger.setAttribute('aria-label',o?'Close menu':'Open menu');burger.innerHTML=ico(o?'x':'menu');body.classList.toggle('lock',o);if(o){var f=$('a',mnav);f&&f.focus()}}
if(burger)burger.addEventListener('click',function(){setMenu(!mnav.classList.contains('open'))});
if(mnav)mnav.addEventListener('click',function(e){if(e.target.closest('a'))setMenu(false)});
window.addEventListener('resize',function(){if(innerWidth>1140&&mnav&&mnav.classList.contains('open'))setMenu(false)});

/* ---------- scroll: header state, back-to-top ---------- */
body.insertAdjacentHTML('beforeend','<button class="totop" id="totop" type="button" aria-label="Back to top">'+ico('up')+'</button><div class="toast" id="toast" role="status" aria-live="polite"></div>');
var totop=$('#totop');totop.addEventListener('click',function(){window.scrollTo({top:0,behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'auto':'smooth'})});
var ticking=false;
function onScroll(){var y=window.pageYOffset;if(hdrEl)hdrEl.classList.toggle('scrolled',y>8);totop.classList.toggle('show',y>window.innerHeight*1.2);ticking=false}
window.addEventListener('scroll',function(){if(!ticking){ticking=true;requestAnimationFrame(onScroll)}},{passive:true});onScroll();

/* ---------- toast ---------- */
var tt;function toast(m){var t=$('#toast');t.textContent=m;t.classList.add('show');clearTimeout(tt);tt=setTimeout(function(){t.classList.remove('show')},2600)}

/* ---------- reveal on scroll + count-up numbers ---------- */
function fmtN(n,dec){return n.toLocaleString('en-US',{minimumFractionDigits:dec,maximumFractionDigits:dec})}
function countUp(el){var to=parseFloat(el.getAttribute('data-count')),dec=(el.getAttribute('data-count').split('.')[1]||'').length,t0=null,suf=el.getAttribute('data-suf')||'';
 if(matchMedia('(prefers-reduced-motion:reduce)').matches){el.textContent=fmtN(to,dec)+suf;return}
 function f(t){if(!t0)t0=t;var p=Math.min(1,(t-t0)/1100),e=1-Math.pow(1-p,3);el.textContent=fmtN(to*e,dec)+suf;if(p<1)requestAnimationFrame(f)}requestAnimationFrame(f)}
function reveal(root){var els=$$('.rv:not(.in),[data-count]:not(.counted)',root||document);
 if(!('IntersectionObserver' in window)){els.forEach(function(e){e.classList.add('in');if(e.hasAttribute('data-count')){e.classList.add('counted');countUp(e)}});return}
 var io=new IntersectionObserver(function(en){en.forEach(function(x){if(x.isIntersecting){var e=x.target;e.classList.add('in');if(e.hasAttribute('data-count')&&!e.classList.contains('counted')){e.classList.add('counted');countUp(e)}io.unobserve(e)}})},{rootMargin:'0px 0px -6% 0px'});
 els.forEach(function(e){io.observe(e)})}
reveal();

/* ---------- site search ---------- */
var IDX=[];
D.pages.forEach(function(p){IDX.push({k:'Page',t:p.n,s:p.d||'IRONVERT home page',u:ROOT+p.u})});
D.disc.forEach(function(x){IDX.push({k:'Class',t:x.n,s:D.groups[x.g]+' · '+x.dur,u:ROOT+x.url,x:x.k+' '+x.d})});
D.coaches.forEach(function(c){IDX.push({k:'Coach',t:c.n,s:c.role+' · '+D.loc(c.loc).s,u:ROOT+'trainers/#'+c.id,x:c.sp.map(function(s){return D.d(s).n}).join(' ')})});
D.locs.forEach(function(l){IDX.push({k:'Club',t:l.n,s:l.ward,u:ROOT+'locations/#'+l.id,x:l.am.join(' ')})});
D.posts.forEach(function(p){IDX.push({k:'Article',t:p.t,s:p.c+' · '+p.dt,u:ROOT+'blog/'+(p.full?'':'#'+p.id),x:p.ex})});
D.plans.forEach(function(p){IDX.push({k:'Plan',t:p.n+' plan',s:money(p.m)+'/month',u:ROOT+'membership/#plan-'+p.id,x:p.f.join(' ')})});
body.insertAdjacentHTML('beforeend','<div class="srch" id="srch" role="dialog" aria-modal="true" aria-label="Search"><div class="wrap"><div class="srch-top">'+ico('search','l')+'<label class="vh" for="sq">Search classes, trainers, clubs and articles</label><input id="sq" type="search" placeholder="Search classes, coaches, clubs…" autocomplete="off"><button class="ibtn" type="button" id="closeSearch" aria-label="Close search">'+ico('x')+'</button></div><p class="note" id="sqn" style="margin-top:12px">Popular searches:</p><div class="srch-sug" id="sqs"></div><ul class="srch-res" id="sqr"></ul></div></div>');
var srch=$('#srch'),sq=$('#sq'),sqr=$('#sqr');
['kickboxing','yoga','pool','reformer','cycling','PT','Northgate','muay'].forEach(function(s){var b=document.createElement('button');b.type='button';b.className='chip';b.textContent=s;b.addEventListener('click',function(){sq.value=s;doSearch()});$('#sqs').appendChild(b)});
function doSearch(){var q=fold(sq.value.trim());if(!q){sqr.innerHTML='';$('#sqn').textContent='Popular searches:';return}
 var terms=q.split(/\s+/),r=IDX.map(function(it){var h=fold(it.t+' '+it.s+' '+(it.x||'')),ht=fold(it.t),sc=0;terms.forEach(function(w){if(ht.indexOf(w)>-1)sc+=3;else if(h.indexOf(w)>-1)sc+=1;else sc-=99});return {it:it,sc:sc}}).filter(function(x){return x.sc>0}).sort(function(a,b){return b.sc-a.sc}).slice(0,12);
 $('#sqn').textContent=r.length?r.length+(r.length===1?' result':' results'):'No results. Try another word, like "yoga" or "swim".';
 sqr.innerHTML=r.map(function(x){return '<li><'+'a href="'+x.it.u+'"><span class="k">'+esc(x.it.k)+'</span><span><b>'+esc(x.it.t)+'</b><span>'+esc(x.it.s)+'</span></span>'+ico('go')+'</a></li>'}).join('')}
sq.addEventListener('input',doSearch);
var lastFocus;
function openSearch(){lastFocus=document.activeElement;srch.classList.add('open');body.classList.add('lock');setTimeout(function(){sq.focus()},30)}
function closeSearch(){srch.classList.remove('open');if(!(mnav&&mnav.classList.contains('open')))body.classList.remove('lock');lastFocus&&lastFocus.focus&&lastFocus.focus()}
$('#openSearch')&&$('#openSearch').addEventListener('click',openSearch);
$('#closeSearch').addEventListener('click',closeSearch);
sqr.addEventListener('click',function(e){if(e.target.closest('a'))closeSearch()});
document.addEventListener('keydown',function(e){
 if(e.key==='Escape'){if(srch.classList.contains('open'))closeSearch();else if(mnav&&mnav.classList.contains('open')){setMenu(false);burger.focus()}}
 if(e.key==='/'&&!/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)&&!srch.classList.contains('open')){e.preventDefault();openSearch()}
});

/* ---------- class bookings (shared) ---------- */
function setHolds(h){holds=h;store.set('holds',h);var c=$('#holdCnt');if(c){c.textContent=h.length;c.hidden=!h.length}}

/* ---------- export ---------- */
window.IV={D:D,$:$,$$:$$,esc:esc,fold:fold,money:money,tm:tm,tmH:tmH,nb:nb,store:store,img:img,ico:ico,toast:toast,reveal:reveal,glue:glueAll,ROOT:ROOT,
 holds:function(){return holds.slice()},setHolds:setHolds};
})();
