// data.js
// Random-ish profile generator using seeded lists. Images use Unsplash.
//
// Students: you can swap this out for your own data source later.

export const TAGS = [
  "Coffee", "Hiking", "Movies", "Live Music", "Board Games",
  "Cats", "Dogs", "Traveler", "Foodie", "Tech", "Art",
  "Runner", "Climbing", "Books", "Yoga", "Photography"
];

const FIRST_NAMES = [
  "Alex","Sam","Jordan","Taylor","Casey","Avery","Riley","Morgan","Quinn","Cameron",
  "Jamie","Drew","Parker","Reese","Emerson","Rowan","Shawn","Harper","Skyler","Devon"
];

const CITIES = [
  "Brooklyn","Manhattan","Queens","Jersey City","Hoboken","Astoria",
  "Williamsburg","Bushwick","Harlem","Lower East Side"
];

const JOBS = [
  "Product Designer","Software Engineer","Data Analyst","Barista","Teacher",
  "Photographer","Architect","Chef","Nurse","Marketing Manager","UX Researcher"
];

const BIOS = [
  "Weekend hikes and weekday lattes.",
  "Dog parent. Amateur chef. Karaoke enthusiast.",
  "Trying every taco in the city — for science.",
  "Bookstore browser and movie quote machine.",
  "Gym sometimes, Netflix always.",
  "Looking for the best slice in town.",
  "Will beat you at Mario Kart.",
  "Currently planning the next trip."
];

const sample = (arr) => arr[Math.floor(Math.random() * arr.length)];
const pickTags = () =>
  Array.from(new Set(Array.from({ length: 4 }, () => sample(TAGS))));

const imgFor = (seed) =>
  // Unsplash pics are public placeholders; swap at will.
  `https://images.unsplash.com/photo-${seed}?auto=format&fit=crop&w=1200&q=80`;

const UNSPLASH_SEEDS = [
  "1515462277126-2b47b9fa09e6", // portrait
  "1520975916090-3105956dac38",
  "1519340241574-2cec6aef0c01",
  "1554151228-14d9def656e4",
  "1548142813-c348350df52b",
  "1517841905240-472988babdf9",
  "1535713875002-d1d0cf377fde",
  "1545996124-0501ebae84d0",
  "1524504388940-b1c1722653e1",
  "1531123897727-8f129e1688ce",
];

export function generateProfiles(count = 12) {
  const profiles = [];
  for (let i = 0; i < count; i++) {
    const name = sample(FIRST_NAMES);
    const age = 18 + Math.floor(Math.random() * 22);
    const city = sample(CITIES);
    const title = sample(JOBS);
    const bio = sample(BIOS);
    const tags = pickTags();
    const img = imgFor(sample(UNSPLASH_SEEDS));

    profiles.push({
      id: `p_${i}_${Date.now().toString(36)}`,
      name,
      age,
      city,
      title,
      bio,
      tags,
      img,
    });
  }
  return profiles;
}
