import type { DestinationKey } from "./types";

export type EventKind = "launch" | "landing" | "operation" | "ending";

export interface TimelineEvent {
  /** ISO-ish sortable date */
  at: string;
  date: string;
  year: number;
  title: string;
  detail: string;
  kind: EventKind;
  destination: DestinationKey;
  missionId?: string;
}

export const TIMELINE: TimelineEvent[] = [
  {
    at: "1966-06-02",
    date: "2 Jun 1966",
    year: 1966,
    title: "Surveyor 1 makes the first U.S. soft landing",
    detail: "It proves the lunar surface can take the weight of a spacecraft.",
    kind: "landing",
    destination: "moon",
    missionId: "surveyor",
  },
  {
    at: "1967-04-20",
    date: "20 Apr 1967",
    year: 1967,
    title: "Surveyor 3 lands in Oceanus Procellarum",
    detail: "Two weeks of observations, then silence as the lunar night falls.",
    kind: "landing",
    destination: "moon",
    missionId: "surveyor",
  },
  {
    at: "1969-07-20",
    date: "20 Jul 1969",
    year: 1969,
    title: "Apollo 11 lands at Tranquility Base",
    detail: "Eagle's descent stage becomes the first human structure left on another world.",
    kind: "landing",
    destination: "moon",
    missionId: "apollo-lunar-modules",
  },
  {
    at: "1969-11-19",
    date: "19 Nov 1969",
    year: 1969,
    title: "Apollo 12 deploys the first ALSEP",
    detail: "A nuclear-powered geophysics station begins reporting from the Moon.",
    kind: "operation",
    destination: "moon",
    missionId: "alsep",
  },
  {
    at: "1971-07-30",
    date: "30 Jul 1971",
    year: 1971,
    title: "Apollo 15 lands with the first Lunar Roving Vehicle",
    detail: "Mobility turns a walking mission into a geological expedition.",
    kind: "landing",
    destination: "moon",
    missionId: "lunar-roving-vehicles",
  },
  {
    at: "1972-12-11",
    date: "11 Dec 1972",
    year: 1972,
    title: "Apollo 17 lands at Taurus–Littrow",
    detail: "The last crewed landing on the Moon, and the third rover left parked.",
    kind: "landing",
    destination: "moon",
    missionId: "lunar-roving-vehicles",
  },
  {
    at: "1976-07-20",
    date: "20 Jul 1976",
    year: 1976,
    title: "Viking 1 lands in Chryse Planitia",
    detail: "The first image ever taken from the surface of Mars.",
    kind: "landing",
    destination: "mars",
    missionId: "viking",
  },
  {
    at: "1976-09-03",
    date: "3 Sep 1976",
    year: 1976,
    title: "Viking 2 lands in Utopia Planitia",
    detail: "A second surface laboratory, near the edge of the polar cap.",
    kind: "landing",
    destination: "mars",
    missionId: "viking",
  },
  {
    at: "1977-09-30",
    date: "30 Sep 1977",
    year: 1977,
    title: "The ALSEP network is switched off",
    detail: "Five lunar stations go quiet after eight years and a trillion bits of science.",
    kind: "ending",
    destination: "moon",
    missionId: "alsep",
  },
  {
    at: "1980-04-11",
    date: "11 Apr 1980",
    year: 1980,
    title: "Viking 2 lander ends",
    detail: "Battery failure closes the second surface station.",
    kind: "ending",
    destination: "mars",
    missionId: "viking",
  },
  {
    at: "1982-11-11",
    date: "11 Nov 1982",
    year: 1982,
    title: "Viking 1 lander stops operating",
    detail: "A faulty command ends the mission that took the first pictures from Mars.",
    kind: "ending",
    destination: "mars",
    missionId: "viking",
  },
  {
    at: "1997-07-04",
    date: "4 Jul 1997",
    year: 1997,
    title: "Mars Pathfinder lands with Sojourner",
    detail: "Airbags deliver the first rover to another planet.",
    kind: "landing",
    destination: "mars",
    missionId: "sojourner",
  },
  {
    at: "1997-09-27",
    date: "27 Sep 1997",
    year: 1997,
    title: "Pathfinder's final data",
    detail: "Contact is lost after 83 sols; the cause is never confirmed.",
    kind: "ending",
    destination: "mars",
    missionId: "sojourner",
  },
  {
    at: "2001-02-12",
    date: "12 Feb 2001",
    year: 2001,
    title: "NEAR Shoemaker lands on Eros",
    detail: "The first controlled descent to an asteroid surface.",
    kind: "landing",
    destination: "beyond",
    missionId: "near-shoemaker",
  },
  {
    at: "2001-02-28",
    date: "28 Feb 2001",
    year: 2001,
    title: "NEAR Shoemaker falls silent",
    detail: "Ten days of bonus surface data, then the cold ends it.",
    kind: "ending",
    destination: "beyond",
    missionId: "near-shoemaker",
  },
  {
    at: "2003-01-23",
    date: "23 Jan 2003",
    year: 2003,
    title: "Pioneer 10's last signal",
    detail: "A faint transmission from 12.2 billion km away.",
    kind: "ending",
    destination: "beyond",
    missionId: "pioneer",
  },
  {
    at: "2004-01-04",
    date: "4 Jan 2004",
    year: 2004,
    title: "Spirit lands in Gusev Crater",
    detail: "A 90-sol mission that will last six years.",
    kind: "landing",
    destination: "mars",
    missionId: "spirit-opportunity",
  },
  {
    at: "2004-01-25",
    date: "25 Jan 2004",
    year: 2004,
    title: "Opportunity lands in Meridiani Planum",
    detail: "Its twin is on the far side of the planet; both will find water evidence.",
    kind: "landing",
    destination: "mars",
    missionId: "spirit-opportunity",
  },
  {
    at: "2008-05-25",
    date: "25 May 2008",
    year: 2008,
    title: "Phoenix lands in the Martian Arctic",
    detail: "It will confirm water ice within centimetres of the surface.",
    kind: "landing",
    destination: "mars",
    missionId: "phoenix-insight",
  },
  {
    at: "2008-11-02",
    date: "2 Nov 2008",
    year: 2008,
    title: "Phoenix sends its last signal",
    detail: "Winter darkness ends the mission; the lander is later seen frost-damaged.",
    kind: "ending",
    destination: "mars",
    missionId: "phoenix-insight",
  },
  {
    at: "2010-03-22",
    date: "22 Mar 2010",
    year: 2010,
    title: "Spirit's last contact",
    detail: "Stuck in soft soil and unable to angle its panels for winter.",
    kind: "ending",
    destination: "mars",
    missionId: "spirit-opportunity",
  },
  {
    at: "2015-03-06",
    date: "6 Mar 2015",
    year: 2015,
    title: "Dawn arrives at Ceres",
    detail: "The first spacecraft to orbit a dwarf planet.",
    kind: "operation",
    destination: "beyond",
    missionId: "dawn",
  },
  {
    at: "2018-06-10",
    date: "10 Jun 2018",
    year: 2018,
    title: "Opportunity falls silent",
    detail: "A planet-wide dust storm blocks the Sun for months.",
    kind: "ending",
    destination: "mars",
    missionId: "spirit-opportunity",
  },
  {
    at: "2018-10-30",
    date: "30 Oct 2018",
    year: 2018,
    title: "Kepler is retired",
    detail: "Out of fuel after nine years and more than 2,600 planet discoveries.",
    kind: "ending",
    destination: "beyond",
    missionId: "kepler",
  },
  {
    at: "2018-11-01",
    date: "1 Nov 2018",
    year: 2018,
    title: "Dawn's mission concludes",
    detail: "Hydrazine exhausted; the spacecraft stays in orbit around Ceres.",
    kind: "ending",
    destination: "beyond",
    missionId: "dawn",
  },
  {
    at: "2018-11-26",
    date: "26 Nov 2018",
    year: 2018,
    title: "InSight lands in Elysium Planitia",
    detail: "The first seismometer placed on another planet.",
    kind: "landing",
    destination: "mars",
    missionId: "phoenix-insight",
  },
  {
    at: "2021-04-19",
    date: "19 Apr 2021",
    year: 2021,
    title: "Ingenuity's first flight",
    detail: "Powered, controlled flight on another world, for the first time.",
    kind: "operation",
    destination: "mars",
    missionId: "ingenuity",
  },
  {
    at: "2022-12-15",
    date: "15 Dec 2022",
    year: 2022,
    title: "InSight's last contact",
    detail: "Dust on the solar arrays leaves too little power to run the heaters.",
    kind: "ending",
    destination: "mars",
    missionId: "phoenix-insight",
  },
  {
    at: "2024-01-25",
    date: "25 Jan 2024",
    year: 2024,
    title: "Ingenuity's mission ends",
    detail: "Rotor damage from a hard landing on Flight 72 grounds the helicopter.",
    kind: "ending",
    destination: "mars",
    missionId: "ingenuity",
  },
];

export const LEGACY_THEMES = [
  {
    kicker: "01 — The data outlived the hardware",
    title: "Silence is not the end of a mission",
    body:
      "A spacecraft stops transmitting; its measurements keep working. Apollo's seismometers produced a lunar interior model still used today. Kepler's photometry is still being re-mined for planets nobody had looked for. InSight's seismic catalogue remains the only record of the interior of another planet.",
    points: [
      "ALSEP data underpinned the modern picture of the lunar interior.",
      "Kepler's archive is still the basis for new exoplanet research.",
      "InSight's 1,319 marsquakes remain a unique dataset.",
    ],
  },
  {
    kicker: "02 — Lessons written by endings",
    title: "Every failure became a design rule",
    body:
      "Dust killed Opportunity, Phoenix and InSight; later missions carry dust-tolerant arrays and wind-clearing strategies. Two failed reaction wheels forced Kepler's improvised K2 mission, which taught engineers how to stabilise a telescope with sunlight. Ingenuity's final navigation failure is now a documented case study for flying on other worlds.",
    points: [
      "Dust and power budgets are now designed against measured Martian weather.",
      "K2 proved a spacecraft can be re-purposed after a hardware failure.",
      "Ingenuity's accident report informs the next generation of Mars rotorcraft.",
    ],
  },
  {
    kicker: "03 — Technologies that became infrastructure",
    title: "What these machines left behind on Earth",
    body:
      "Ion propulsion, airbag landing, rocker-bogie suspension, autonomous navigation, radiation-hardened electronics and deep-space communications all matured on these missions. The retroreflectors left by Apollo are still used for lunar laser ranging — precision tests of gravity that need no power at all.",
    points: [
      "Dawn proved ion propulsion for long-duration interplanetary flight.",
      "Pathfinder's airbags and rover suspension shaped every Mars rover since.",
      "Apollo's reflectors still measure the Earth–Moon distance.",
    ],
  },
  {
    kicker: "04 — Heritage, not junk",
    title: "Why we treat the sites with care",
    body:
      "Apollo landing sites are recognised as heritage locations, and later orbiters are used to monitor them. Nothing at Tranquility Base is rubbish: it is the physical record of the first time humans walked on another world. Calling that 'abandoned' would be a category error — the hardware stayed by design, and the missions succeeded.",
    points: [
      "Lunar orbiters image the Apollo sites to track their condition.",
      "Landing sites are treated as protected heritage, not salvage.",
      "The distinction between 'left' and 'lost' matters scientifically.",
    ],
  },
];

export const HEADLINE_STATS = [
  { value: "13", label: "mission records" },
  { value: "6", label: "destinations" },
  { value: "58", label: "years of hardware" },
  { value: "1,319", label: "marsquakes recorded" },
];

export const SOURCE_GROUPS = [
  {
    title: "NSSDCA — NASA Space Science Data Coordinated Archive",
    note: "The primary reference for spacecraft identity, launch data, mission history and final status.",
    links: [
      { label: "NSSDCA home", url: "https://nssdc.gsfc.nasa.gov/" },
      {
        label: "Apollo 11 Lunar Module (1969-059C)",
        url: "https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1969-059C",
      },
      {
        label: "Apollo 15 Lunar Roving Vehicle (1971-063C)",
        url: "https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1971-063C",
      },
      {
        label: "Apollo 11 EASEP (1969-099C)",
        url: "https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1969-099C",
      },
      { label: "The Apollo Lunar Roving Vehicle", url: "https://nssdc.gsfc.nasa.gov/planetary/lunar/apollo_lrv.html" },
      { label: "Viking Project information", url: "https://nssdc.gsfc.nasa.gov/planetary/viking.html" },
      { label: "Mars Pathfinder Project information", url: "https://nssdc.gsfc.nasa.gov/planetary/mesur.html" },
    ],
  },
  {
    title: "NASA Science — mission pages",
    note: "Mission objectives, key dates and end-of-mission reporting.",
    links: [
      { label: "Surveyor 3", url: "https://science.nasa.gov/mission/surveyor-3/" },
      { label: "Mars Pathfinder", url: "https://science.nasa.gov/mission/mars-pathfinder/" },
      {
        label: "Spirit and Opportunity",
        url: "https://science.nasa.gov/mission/mars-exploration-rovers-spirit-and-opportunity/",
      },
      { label: "Viking 1", url: "https://science.nasa.gov/mission/viking-1/" },
      { label: "InSight", url: "https://science.nasa.gov/mission/insight/" },
      { label: "Dawn", url: "https://science.nasa.gov/mission/dawn/" },
      { label: "NEAR Shoemaker", url: "https://science.nasa.gov/mission/near-shoemaker/" },
      { label: "Pioneer 10", url: "https://science.nasa.gov/mission/pioneer-10/" },
      { label: "Pioneer 11", url: "https://science.nasa.gov/mission/pioneer-11/" },
      {
        label: "Ingenuity Mars Helicopter",
        url: "https://science.nasa.gov/mission/mars-2020-perseverance/ingenuity-mars-helicopter/",
      },
      { label: "Kepler / K2", url: "https://science.nasa.gov/mission/kepler/" },
    ],
  },
  {
    title: "NASA mission status and end-of-mission announcements",
    note: "Used to confirm final contact dates and the declared reason a mission ended.",
    links: [
      {
        label: "InSight retired, December 2022",
        url: "https://www.nasa.gov/press-release/nasa-retires-insight-mars-lander-mission-after-years-of-science/",
      },
      {
        label: "Dawn mission ends, November 2018",
        url: "https://www.nasa.gov/news-release/nasas-dawn-mission-to-asteroid-belt-comes-to-end/",
      },
      {
        label: "Kepler retired, October 2018",
        url: "https://www.jpl.nasa.gov/news/nasa-retires-kepler-space-telescope/",
      },
      {
        label: "Opportunity mission complete, February 2019",
        url: "https://www.nasa.gov/news-release/nasas-record-setting-opportunity-rover-mission-on-mars-comes-to-end/",
      },
      {
        label: "Ingenuity mission ends, January 2024",
        url: "https://www.nasa.gov/news-release/after-three-years-on-mars-nasas-ingenuity-helicopter-mission-ends/",
      },
      {
        label: "Ingenuity accident investigation, December 2024",
        url: "https://www.nasa.gov/missions/mars-2020-perseverance/ingenuity-helicopter/nasa-performs-first-aircraft-accident-investigation-on-another-world/",
      },
    ],
  },
  {
    title: "Imagery",
    note: "Every photograph on this site is an official NASA or JPL image, retrieved from the NASA Image and Video Library. Individual credits appear on each image.",
    links: [
      { label: "NASA Image and Video Library", url: "https://images.nasa.gov/" },
      { label: "NASA Science", url: "https://science.nasa.gov/" },
      { label: "NASA/JPL", url: "https://www.jpl.nasa.gov/" },
      { label: "NASA Solar System Exploration", url: "https://science.nasa.gov/solar-system/" },
    ],
  },
];

export const RESEARCH_NOTE =
  "Mission dates, statuses and final conditions were cross-checked against NSSDCA records and NASA mission pages before publication. Where an exact figure is disputed between NASA sources (for example the Apollo 17 rover distance), the NSSDCA value is used and the source is named. Approximate landing coordinates are shown as approximate.";
