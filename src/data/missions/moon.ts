import type { Mission } from "../types";

export const MOON_MISSIONS: Mission[] = [
  {
    id: "apollo-lunar-modules",
    number: "01",
    title: "Apollo Lunar Modules",
    subtitle: "The half that stayed behind",
    destination: "moon",
    destinationLabel: "The Moon",
    type: ["Crewed lander"],
    agency: "NASA",
    launched: "1969 — 1972",
    ended: "Last landing, 11 December 1972",
    status: "left-in-place",
    fate: "Six descent stages remain on the surface",
    location: "Six landing sites across the lunar nearside",
    coordinates: {
      lat: 0.67,
      lon: 23.47,
      label: "Apollo 11, Tranquility Base",
      approximate: true,
      body: "Moon",
    },
    heroImage: "apollo11-lm",
    heroAlt:
      "Apollo 11 astronauts inside the Lunar Module during the lunar surface telecast",
    gallery: ["apollo11-lm", "apollo11-surface", "tranquility", "apollo12-surface"],
    tagline: "Built in two halves. Only one of them ever left.",
    summary:
      "The Lunar Module was the first spacecraft designed to fly nowhere but down. Its descent stage carried the engine, the legs and the supplies; its ascent stage carried the crew home. When the ascent stage lifted off, the descent stage became a launch pad — and then a monument.",
    body: [
      "Between July 1969 and December 1972, six crews flew a Lunar Module down to the surface and six flew one back up. The spacecraft was purpose-built for that single descent: a descent stage with the main engine, landing gear, batteries and storage, and an ascent stage with the crew cabin, its own engine and just enough propellant to reach orbit.",
      "Only the ascent stage was ever meant to leave. Once the crew had transferred to the command module, it was jettisoned — and on later missions deliberately steered into the Moon so that its impact could be recorded by the seismometers the crews had left behind.",
      "What remains is the other half: about six descent stages, sitting exactly where they landed, plus the flags, experiment packages, tools and footprints around them. Nothing was abandoned in the sense of being forgotten mid-task. The hardware stayed because that was the plan.",
    ],
    facts: [
      { label: "First landing", value: "20 July 1969, Apollo 11" },
      { label: "Crewed landings", value: "Six: 11, 12, 14, 15, 16, 17" },
      { label: "People who walked", value: "12" },
      { label: "Descent stages on the Moon", value: "Six" },
      { label: "Apollo 13", value: "No landing; LM served as a lifeboat" },
    ],
    milestones: [
      { date: "20 Jul 1969", label: "Eagle lands", detail: "Tranquility Base, Mare Tranquillitatis." },
      { date: "19 Nov 1969", label: "Intrepid lands", detail: "Oceanus Procellarum, near Surveyor 3." },
      { date: "05 Feb 1971", label: "Antares lands", detail: "Fra Mauro formation." },
      { date: "30 Jul 1971", label: "Falcon lands", detail: "Hadley–Apennine, with the first lunar rover." },
      { date: "20 Apr 1972", label: "Orion lands", detail: "Descartes Highlands." },
      { date: "11 Dec 1972", label: "Challenger lands", detail: "Taurus–Littrow; the last crewed landing to date." },
    ],
    hardware: [
      {
        name: "Descent stage",
        role: "Main engine, propellant, landing legs, storage bays, and the platform the crew launched from.",
        now: "Remains at each landing site.",
      },
      {
        name: "Ascent stage",
        role: "Crew cabin and the engine that returned the crew to lunar orbit.",
        now: "Jettisoned after docking; later stages were deliberately crashed into the Moon.",
      },
      {
        name: "Landing gear",
        role: "Four legs with contact probes that told the crew when to cut the engine.",
        now: "Still deployed, still holding the descent stage off the surface.",
      },
    ],
    achievements: [
      "First and only crewed landings on another world.",
      "Returned 382 kg of lunar samples across the programme.",
      "Left a seismic network and laser reflectors that kept producing science for decades.",
    ],
    finalCondition:
      "The descent stages remain in place and are periodically imaged from lunar orbit. Their ascent stages are gone — jettisoned, and in several cases deliberately impacted. Apollo 13's Lunar Module, Aquarius, never landed and burned up in Earth's atmosphere after bringing its crew home.",
    sources: [
      {
        label: "NSSDCA — Apollo 11 Lunar Module / 1969-059C",
        url: "https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1969-059C",
      },
      { label: "NASA — The Apollo Program", url: "https://www.nasa.gov/the-apollo-program/" },
    ],
  },
  {
    id: "lunar-roving-vehicles",
    number: "02",
    title: "Lunar Roving Vehicles",
    subtitle: "Three cars, still parked",
    destination: "moon",
    destinationLabel: "The Moon",
    type: ["Rover"],
    agency: "NASA",
    launched: "1971 — 1972",
    ended: "Last driven 14 December 1972",
    status: "left-in-place",
    fate: "All three remain where they were parked",
    location: "Hadley–Apennine, Descartes, Taurus–Littrow",
    coordinates: {
      lat: 20.19,
      lon: 30.77,
      label: "Apollo 17 rover, Taurus–Littrow",
      approximate: true,
      body: "Moon",
    },
    heroImage: "lrv",
    heroAlt:
      "Close-up of the Lunar Roving Vehicle at the Apollo 17 Taurus–Littrow landing site",
    gallery: ["lrv", "lrv-apollo15", "apollo11-surface"],
    tagline: "On the Moon, a car is a scientific instrument.",
    summary:
      "Three electric rovers turned a walking mission into a driving one. Apollo 15, 16 and 17 crews covered ground their predecessors could only look at, and every rover was left parked beside its lander when the crew went home.",
    body: [
      "The Lunar Roving Vehicle was folded into a wedge on the side of the descent stage and unfolded on the surface. It weighed about 210 kg on Earth and carried two astronauts, their tools, cameras and samples across terrain no wheeled vehicle had ever crossed.",
      "The difference was not comfort, it was reach. Apollo 11's crew walked a few hundred metres from the lander; with a rover, later crews ranged several kilometres and brought back samples from geologically distinct sites. Each rover made three traverses, one per day of the mission.",
      "All three are still there, parked roughly where the astronauts left them, within sight of their descent stages. Their batteries are long dead. Their tracks are still sharp in the regolith, because nothing on the Moon has blown them away.",
    ],
    facts: [
      { label: "Rovers driven", value: "Three — Apollo 15, 16, 17" },
      { label: "Apollo 15 distance", value: "27.8 km in 3 h 02 min" },
      { label: "Apollo 16 distance", value: "26.7 km in 3 h 26 min" },
      { label: "Apollo 17 distance", value: "35.9 km in 4 h 26 min" },
      { label: "Mass", value: "210 kg (Earth weight)" },
    ],
    milestones: [
      { date: "31 Jul 1971", label: "First drive", detail: "Apollo 15's rover is deployed at Hadley–Apennine." },
      { date: "21 Apr 1972", label: "Descartes traverses", detail: "Apollo 16 covers 26.7 km across the highlands." },
      { date: "11 Dec 1972", label: "Taurus–Littrow", detail: "Apollo 17 drives 35.9 km — the longest lunar road trip." },
    ],
    hardware: [
      {
        name: "Chassis and fold",
        role: "An aluminium frame that folded into a 1.5 m wedge for the journey to the Moon.",
        now: "Deployed and parked at all three sites.",
      },
      {
        name: "Wire-mesh wheels",
        role: "Flexible woven-metal wheels with titanium treads, built to grip dust without a pneumatic tyre.",
        now: "Still bearing the vehicle's weight.",
      },
      {
        name: "Navigation system",
        role: "A bearing and distance unit plus a sun-shadow device to track position without GPS.",
        now: "Powerless since the mission ended.",
      },
    ],
    achievements: [
      "Extended crewed surface range from hundreds of metres to several kilometres.",
      "Enabled sampling at sites chosen for geology rather than walkability.",
      "Left a set of tracks that remain visible from lunar orbit.",
    ],
    finalCondition:
      "All three rovers remain on the lunar surface near their landing sites. They lost power when their batteries were depleted after the crews departed, and they have not moved since.",
    sources: [
      {
        label: "NSSDCA — Apollo 15 Lunar Roving Vehicle / 1971-063C",
        url: "https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1971-063C",
      },
      { label: "NSSDCA — The Apollo Lunar Roving Vehicle", url: "https://nssdc.gsfc.nasa.gov/planetary/lunar/apollo_lrv.html" },
    ],
  },
  {
    id: "alsep",
    number: "03",
    title: "ALSEP Scientific Packages",
    subtitle: "Five laboratories that outlived their missions",
    destination: "moon",
    destinationLabel: "The Moon",
    type: ["Surface instruments"],
    agency: "NASA",
    launched: "1969 — 1972",
    ended: "Switched off 30 September 1977",
    status: "retired",
    fate: "Network shut down; the retroreflectors still answer",
    location: "Five stations at Apollo 12, 14, 15, 16 and 17 sites",
    coordinates: {
      lat: -3.01,
      lon: -23.42,
      label: "Apollo 12 ALSEP station",
      approximate: true,
      body: "Moon",
    },
    heroImage: "alsep",
    heroAlt:
      "Panorama of Apollo 16 commander John Young working at the Lunar Roving Vehicle before deploying the ALSEP",
    gallery: ["alsep", "apollo11-surface", "lunar-surface"],
    tagline: "The Moon kept reporting back for eight years.",
    summary:
      "Each Apollo landing from 12 onward left behind a powered station of geophysical instruments. They detected moonquakes, measured the solar wind, and listened to the seismic signature of the ascent stages crashing back down — until NASA switched the whole network off in 1977.",
    body: [
      "The Apollo Lunar Surface Experiments Package was a collection of instruments deployed by the crew and connected to a central station powered by a radioisotope thermoelectric generator. A passive seismometer listened for moonquakes. A magnetometer measured a magnetic field almost nobody expected. Ion detectors and dust detectors sampled the environment directly.",
      "Apollo 11 carried a smaller precursor, the Early Apollo Scientific Experiments Package, which was solar-powered and lasted about three weeks. From Apollo 12 the stations were nuclear-powered and designed for a year; several ran for up to eight.",
      "On 30 September 1977, with funding for the support teams gone, the five stations were shut down. By then they had received more than 153,000 commands and returned over a trillion bits of data. Almost everything they measured still underpins lunar science.",
    ],
    facts: [
      { label: "ALSEP stations", value: "Five — Apollo 12, 14, 15, 16, 17" },
      { label: "Precursor package", value: "EASEP, Apollo 11 (solar powered)" },
      { label: "Power", value: "Radioisotope thermoelectric generator" },
      { label: "Shut down", value: "30 September 1977" },
      { label: "Data returned", value: "More than a trillion bits" },
    ],
    milestones: [
      { date: "19 Nov 1969", label: "First ALSEP deployed", detail: "Apollo 12, Oceanus Procellarum." },
      { date: "05 Feb 1971", label: "Apollo 14 station online", detail: "Fra Mauro." },
      { date: "30 Sep 1977", label: "Network shut down", detail: "All five stations switched off for good." },
    ],
    hardware: [
      {
        name: "Passive Seismic Experiment",
        role: "Detected moonquakes, meteoroid impacts and the deliberate crashes of spent ascent stages.",
        now: "Silent since 1977; data still in use.",
      },
      {
        name: "Laser Ranging Retroreflector",
        role: "A corner-cube array that bounces laser pulses straight back to Earth, measuring the Moon's distance.",
        now: "Still in use — the only ALSEP-era experiment still operating.",
        active: true,
      },
      {
        name: "Suprathermal Ion Detector",
        role: "Sampled charged particles near the surface and measured the lunar electric environment.",
        now: "Powered down with the network.",
      },
      {
        name: "Central station and RTG",
        role: "Collected instrument data and radioed it to Earth using heat from decaying plutonium.",
        now: "Shut down; the transmitters later served as navigation beacons for a while.",
      },
    ],
    achievements: [
      "Established that the Moon has deep moonquakes and a layered interior.",
      "Measured the lunar surface environment continuously across a full solar cycle.",
      "The retroreflectors still support lunar laser ranging more than fifty years on.",
    ],
    finalCondition:
      "The instrument packages remain on the surface. Their electronics were switched off in 1977 and cannot be restarted. The retroreflector arrays need no power at all, and observatories on Earth still range against them.",
    sources: [
      {
        label: "NSSDCA — Apollo 11 EASEP / 1969-099C",
        url: "https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1969-099C",
      },
      { label: "NASA — Apollo Lunar Surface Experiments Package overview", url: "https://www.nasa.gov/history/alsj/" },
    ],
  },
  {
    id: "surveyor",
    number: "04",
    title: "Surveyor Landers",
    subtitle: "The robots that proved the ground was solid",
    destination: "moon",
    destinationLabel: "The Moon",
    type: ["Robotic lander"],
    agency: "NASA",
    launched: "1966 — 1968",
    ended: "Surveyor 3 last contact, 4 May 1967",
    status: "left-in-place",
    fate: "Surveyor 3 rests where Apollo 12 found it",
    location: "Oceanus Procellarum (Surveyor 3) and four other sites",
    coordinates: {
      lat: -3.0,
      lon: -23.4,
      label: "Surveyor 3, Oceanus Procellarum",
      approximate: true,
      body: "Moon",
    },
    heroImage: "surveyor3",
    heroAlt:
      "Apollo 12 image of the Surveyor III spacecraft, which landed on the Moon in April 1967",
    gallery: ["surveyor3", "moon-footprint", "lunar-surface"],
    tagline: "Before anyone could land, something had to land first.",
    summary:
      "Seven Surveyor spacecraft were sent to the Moon to test soft landing and to answer a blunt engineering question: would a crewed lander sink? Five made it down. Two years later, Apollo 12 landed 180 metres from Surveyor 3 and walked over to inspect it.",
    body: [
      "Surveyor was the rehearsal. Each spacecraft had to slow itself from interplanetary speed to a gentle touchdown, then send back pictures of the surface and data on whether the regolith could bear weight. Surveyors 1, 3, 5, 6 and 7 succeeded; Surveyors 2 and 4 failed before landing.",
      "Surveyor 3 touched down in Oceanus Procellarum on 20 April 1967, returned images and soil data, and fell silent on 4 May as the lunar night began. Its mission was over in two weeks.",
      "In November 1969, Apollo 12's crew set down close enough to walk to it. They photographed the lander, cut away pieces of its camera and scoop, and brought them home — the only hardware ever returned from another world after being left there.",
    ],
    facts: [
      { label: "Launched", value: "Seven spacecraft, 1966 — 1968" },
      { label: "Soft landings", value: "Five" },
      { label: "Surveyor 3 landing", value: "20 April 1967" },
      { label: "Surveyor 3 last contact", value: "4 May 1967" },
      { label: "Revisited by", value: "Apollo 12, November 1969" },
    ],
    milestones: [
      { date: "02 Jun 1966", label: "Surveyor 1 lands", detail: "First U.S. soft landing on the Moon." },
      { date: "20 Apr 1967", label: "Surveyor 3 lands", detail: "Oceanus Procellarum." },
      { date: "19 Nov 1969", label: "Apollo 12 visits", detail: "Conrad and Bean walk to Surveyor 3 and collect parts." },
    ],
    hardware: [
      {
        name: "Three-legged lander bus",
        role: "Carried the retro-rockets, radar altimeter and the descent engine that made a soft landing possible.",
        now: "Surveyor 3 remains standing in Oceanus Procellarum.",
      },
      {
        name: "Television camera",
        role: "Returned the first close images of the lunar surface from ground level.",
        now: "Surveyor 3's camera was removed by Apollo 12 and returned to Earth.",
      },
      {
        name: "Soil mechanics surface sampler",
        role: "Scooped and pressed lunar soil to measure bearing strength.",
        now: "Surveyor 3's scoop was also returned for study.",
      },
    ],
    achievements: [
      "Demonstrated that soft landing on the Moon was achievable.",
      "Showed the regolith could support a crewed lander.",
      "Provided the first ground-level photographs of the lunar surface.",
    ],
    finalCondition:
      "The landers that succeeded remain on the Moon. Surveyor 3 is the only one visited by humans; its camera and scoop are on Earth, and the rest of the spacecraft is still where Apollo 12 found it.",
    sources: [
      { label: "NASA Science — Surveyor 3", url: "https://science.nasa.gov/mission/surveyor-3/" },
      { label: "NASA — Apollo 12: The Pinpoint Mission", url: "https://www.nasa.gov/missions/apollo/apollo-12-the-pinpoint-mission/" },
    ],
  },
];
