/* Content for the Iron Dome of India site. Figures are approximate public data. */

export const LAYERS = [
  {
    id: 'bmd', tab: 'BMD', label: 'BMD', name: 'Ballistic Missile Defence', color: '#f97316',
    range: 'Exo- & endo-atmospheric',
    threats: ['Ballistic missiles'],
    systems: ['PAD / AAD (Phase I)', 'AD-1 / AD-2 (Phase II)', 'Swordfish long-range tracking radar'],
    desc: 'The outermost and highest tier. Phase I interceptors were built against ballistic missiles of roughly 2,000 km range, hitting them either above the atmosphere (PAD) or inside it (AAD). Phase II is aimed at longer-range, ~5,000 km-class missiles.'
  },
  {
    id: 'long', tab: 'Long range', label: 'LONG', name: 'Long-range air defence', color: '#ff9933',
    range: '~100–400 km',
    threats: ['Fighter aircraft', 'AWACS & tankers', 'Cruise missiles', 'Some ballistic missiles'],
    systems: ['S-400 Triumf ("Sudarshan Chakra")', 'Project Kusha (in development)'],
    desc: 'Pushes the engagement zone deep into hostile airspace, so enemy fighters and support aircraft have to stay far back. The Air Force credited the S-400 with long-range kills during Operation Sindoor in May 2025.'
  },
  {
    id: 'medium', tab: 'Medium', label: 'MEDIUM', name: 'Medium-range air defence', color: '#facc15',
    range: '~30–100 km',
    threats: ['Fighters', 'Helicopters', 'Cruise missiles', 'Large drones'],
    systems: ['MRSAM / Barak-8', 'Akash-NG (in trials)'],
    desc: 'Area defence for air bases, cities and naval fleets. MRSAM was co-developed by DRDO and Israel Aerospace Industries and is used by all three services.'
  },
  {
    id: 'short', tab: 'Short', label: 'SHORT', name: 'Short-range air defence', color: '#38bdf8',
    range: '~8–30 km',
    threats: ['Aircraft', 'Helicopters', 'Cruise missiles', 'Drones'],
    systems: ['Akash / Akash Prime', 'QRSAM', 'SPYDER'],
    desc: 'Mobile batteries that move with army formations and guard vital points. The indigenous Akash saw heavy use against incoming drones and missiles in May 2025.'
  },
  {
    id: 'vshort', tab: 'Very short', label: 'V-SHORT', name: 'Very short range & counter-drone', color: '#22c55e',
    range: '0–8 km',
    threats: ['Drones & swarms', 'Loitering munitions', 'Low-flying helicopters'],
    systems: ['VSHORADS', 'L70 / ZU-23 / Shilka guns', 'Igla-S', 'D4 anti-drone system', 'High-power laser (DEW)'],
    desc: 'The last line of defence. Cheap, fast-firing guns, shoulder-fired missiles, jammers and lasers can kill cheap drones without spending expensive missiles on them.'
  },
  {
    id: 'c2', tab: 'Command & control', label: 'C2', name: 'Command & control: the brain', color: '#818cf8',
    range: 'Nationwide network',
    threats: ['Coordinates every tier'],
    systems: ['IACCS (Air Force)', 'Akashteer (Army)', 'Arudhra & Rohini radars'],
    desc: 'Sensors and shooters are only as good as the network linking them. IACCS and Akashteer fuse radar tracks into one air picture and hand each threat to the best-suited weapon.'
  }
];
export const LAYER_BY_ID = Object.fromEntries(LAYERS.map(l => [l.id, l]));

export const SYSTEMS = [
  { name: 'S-400 Triumf', layers: ['long', 'bmd'], origin: 'Russia · Indian Air Force', range: 'Up to ~400 km', status: ['op', 'Operational'],
    desc: 'India\'s most capable long-range SAM, deployed as "Sudarshan Chakra". Five squadrons were ordered in 2018 and deliveries began in December 2021. Several interceptor types let one battery engage aircraft, cruise and ballistic missiles.' },
  { name: 'Project Kusha', layers: ['long'], origin: 'India · DRDO', range: '~150–350 km (planned)', status: ['dev', 'In development'],
    desc: 'An indigenous long-range SAM with three interceptor sizes planned. It would give India a home-built S-400-class layer that it can mass-produce and upgrade itself.' },
  { name: 'PAD / AAD (BMD Phase I)', layers: ['bmd'], origin: 'India · DRDO', range: 'Exo- & endo-atmospheric', status: ['test', 'Flight-tested'],
    desc: 'A two-tier shield against ~2,000 km-class ballistic missiles. Prithvi Air Defence intercepts above the atmosphere and Advanced Air Defence intercepts lower down, both cued by the Swordfish radar.' },
  { name: 'AD-1 / AD-2 (BMD Phase II)', layers: ['bmd'], origin: 'India · DRDO', range: '~5,000 km-class threats', status: ['test', 'In trials'],
    desc: 'Next-generation interceptors for intermediate-range ballistic missiles. AD-1 made its maiden flight test in November 2022.' },
  { name: 'MRSAM (Barak-8)', layers: ['medium'], origin: 'India–Israel · DRDO & IAI', range: '~70 km', status: ['op', 'Operational'],
    desc: 'An all-weather medium-range SAM used by the Army, Navy and Air Force. Its active radar seeker allows several simultaneous engagements against fighters, helicopters, cruise missiles and drones.' },
  { name: 'Akash-NG', layers: ['medium'], origin: 'India · DRDO', range: '~70 km', status: ['test', 'In trials'],
    desc: 'The next-generation Akash, with a lighter canister launcher, an active RF seeker and roughly double the reach of the original.' },
  { name: 'Akash / Akash Prime', layers: ['short'], origin: 'India · DRDO & BEL', range: '~25–30 km', status: ['op', 'Operational'],
    desc: 'An indigenous mobile SAM in Army and Air Force service. It was widely credited with intercepts during Operation Sindoor in May 2025.' },
  { name: 'QRSAM', layers: ['short'], origin: 'India · DRDO', range: '~25–30 km', status: ['test', 'In trials'],
    desc: 'Quick Reaction SAM, built to travel with armoured columns, search and track on the move, and fire within seconds. One of the three weapons in IADWS.' },
  { name: 'IADWS', layers: ['short', 'vshort'], origin: 'India · DRDO', range: 'Layered, up to ~30 km', status: ['test', 'Flight-tested'],
    desc: 'Integrated Air Defence Weapon System: QRSAM, VSHORADS and a high-power laser under one centralised command. First flight-tested in August 2025, it is seen as an early building block of Sudarshan Chakra.' },
  { name: 'VSHORADS', layers: ['vshort'], origin: 'India · DRDO', range: '~6 km', status: ['test', 'In trials'],
    desc: 'A shoulder-fired missile with an imaging infrared seeker, used against low-flying aircraft, helicopters and drones.' },
  { name: 'Laser DEW', layers: ['vshort'], origin: 'India · DRDO', range: 'A few km', status: ['test', 'Demonstrated'],
    desc: 'A 30 kW-class high-energy laser that DRDO demonstrated in 2025 by burning down fixed-wing drones and a swarm. Each shot costs almost nothing compared with a missile.' },
  { name: 'D4 anti-drone system', layers: ['vshort'], origin: 'India · DRDO', range: 'Detect, jam & destroy', status: ['op', 'Deployed'],
    desc: 'Drone Detect, Deter & Destroy: radar, RF sensors and electro-optics combined with jamming and a laser kill option to deal with hostile drones.' },
  { name: 'Air-defence guns', layers: ['vshort'], origin: 'Upgraded legacy systems', range: '~2–4 km', status: ['op', 'Operational'],
    desc: 'Upgraded L70 40 mm guns, ZU-23 twin cannons and Shilka self-propelled guns. Old, but very cheap per shot, which matters against large numbers of small drones.' },
  { name: 'IACCS', layers: ['c2'], origin: 'India · IAF & BEL', range: 'Nationwide network', status: ['op', 'Operational'],
    desc: 'The Integrated Air Command and Control System links military and civil radars with shooters to give one automated air picture and faster decisions.' },
  { name: 'Akashteer', layers: ['c2'], origin: 'India · Army & BEL', range: 'Army-wide network', status: ['op', 'Operational'],
    desc: 'The Indian Army\'s automated air-defence control and reporting system. It fuses sensor data and cues the right gun or missile unit, and was widely praised after Operation Sindoor.' }
];

export const FILTERS = [
  ['all', 'All'],
  ['bmd', 'BMD'],
  ['long', 'Long range'],
  ['medium', 'Medium'],
  ['short', 'Short'],
  ['vshort', 'Very short & C-UAS'],
  ['c2', 'Command & control']
];

export const TIMELINE = [
  { date: 'Nov 2006', title: 'First ballistic missile intercept',
    text: 'DRDO\'s Prithvi Air Defence (PAD) interceptor destroys a target missile above the atmosphere, putting India among a small group of countries with BMD capability.' },
  { date: 'Dec 2007', title: 'Advanced Air Defence test',
    text: 'The endo-atmospheric AAD interceptor completes the two-tier Phase I BMD concept.' },
  { date: '2014–15', title: 'Akash enters service',
    text: 'The indigenous Akash surface-to-air missile is inducted by the Air Force and the Army.' },
  { date: 'Oct 2018', title: 'S-400 deal signed',
    text: 'India orders five S-400 Triumf squadrons from Russia in a deal worth about US$5.4 billion.' },
  { date: 'Dec 2021', title: 'First S-400 arrives',
    text: 'Deliveries begin. The Air Force later deploys the system under the name "Sudarshan Chakra".' },
  { date: 'Nov 2022', title: 'BMD Phase II flies',
    text: 'The AD-1 interceptor, designed for longer-range ballistic missiles, makes its maiden flight test.' },
  { date: 'May 2025', title: 'Operation Sindoor',
    text: 'During the India–Pakistan hostilities of 7–10 May, layered air defences, networked through Akashteer and IACCS, face waves of drones and missiles in the shield\'s biggest real-world test so far.' },
  { date: '15 Aug 2025', title: 'Mission Sudarshan Chakra announced',
    text: 'In his Independence Day address, the Prime Minister announces a national security shield to protect strategic, civilian and religious sites nationwide.' },
  { date: '23 Aug 2025', title: 'IADWS maiden test',
    text: 'DRDO flight-tests the Integrated Air Defence Weapon System off the Odisha coast, combining QRSAM, VSHORADS and a high-power laser under one command.' },
  { date: '2035', title: 'Target: nationwide coverage', future: true,
    text: 'The goal is for the shield to cover all important sites across the country, with indigenous long-range systems such as Project Kusha filling the outer tiers.' }
];

// [row label, Iron Dome, India's shield]
export const COMPARISON = [
  ['What it is', 'A single short-range interceptor system', 'A national, multi-layered architecture ("system of systems")'],
  ['Main threats', 'Rockets, artillery shells, mortars, some drones', 'Ballistic & cruise missiles, aircraft, drones and swarms'],
  ['Engagement range', '~4–70 km', 'From a few km (guns, lasers) out to ~400 km (S-400), plus exo-atmospheric BMD'],
  ['Area to protect', '~22,000 km²', '~3.3 million km², two land fronts and a long coastline'],
  ['Origin', 'Rafael (Israel), with US co-funding', 'Mostly indigenous (DRDO, BEL), plus Russian & Israeli partners'],
  ['Status', 'Operational since 2011', 'Core layers operational; nationwide cover targeted by 2035']
];
