import weddingOutdoor from "@/assets/wedding-outdoor.jpg";
import weddingIndoor from "@/assets/wedding-indoor.jpg";
import bridalPortrait from "@/assets/bridal-portrait.jpg";
import graduationPortrait from "@/assets/graduation-portrait.jpg";
import chefPortrait from "@/assets/chef-portrait.jpg";
import fashionPortrait from "@/assets/fashion-portrait.jpg";
import fashionJewelry from "@/assets/fashion-jewelry.jpg";
import redSuitPink from "@/assets/red-suit-pink.jpg";
import redDressRose from "@/assets/red-dress-rose.jpg";
import lifestylePortrait from "@/assets/lifestyle-portrait.jpg";
import blueHatFashion from "@/assets/blue-hat-fashion.jpg";
import mysteryHat from "@/assets/mystery-hat.jpg";

export type Experience = {
  id: string;
  name: string;
  description: string;
  image: string;
  cta: string;
  includesLabel: string;
  includes: string[];
  duration: string;
  deliverables: string[];
  workflow: string[];
  gallery: string[];
  price: number;
  featured?: boolean;
};

export const experiences: Experience[] = [
  {
    id: "weddings",
    name: "Weddings",
    description:
      "Capture your wedding through timeless photography and cinematic storytelling.",
    image: weddingOutdoor,
    cta: "Book Wedding",
    includesLabel: "What's Included",
    includes: [
      "Wedding Photography",
      "Wedding Films",
      "Drone Coverage (optional)",
      "Full Day Coverage",
    ],
    duration: "8 – 12 hours",
    deliverables: [
      "400+ retouched photographs",
      "Cinematic highlight film (4–6 min)",
      "Private online gallery",
      "Print-ready master files",
    ],
    workflow: [
      "Discovery call & moodboard",
      "Timeline and location scout",
      "Wedding day coverage",
      "Grading, edit & delivery",
    ],
    gallery: [weddingOutdoor, weddingIndoor, bridalPortrait],
    price: 1200,
  },
  {
    id: "portraits",
    name: "Portraits",
    description:
      "Professional portraits designed for people, families and personal brands.",
    image: bridalPortrait,
    cta: "Book Portrait Session",
    includesLabel: "What's Included",
    includes: [
      "Individual Portraits",
      "Couples",
      "Families",
      "Graduation Portraits",
      "Fashion Portraits",
    ],
    duration: "90 minutes",
    deliverables: [
      "30 retouched portraits",
      "Styling & posing direction",
      "Studio or location setup",
      "Digital gallery in 5 days",
    ],
    workflow: [
      "Style consultation",
      "Location or studio prep",
      "Guided portrait session",
      "Retouch & delivery",
    ],
    gallery: [bridalPortrait, graduationPortrait, lifestylePortrait],
    price: 280,
  },
  {
    id: "events",
    name: "Events",
    description:
      "Professional coverage for celebrations and unforgettable occasions.",
    image: weddingIndoor,
    cta: "Book Event",
    includesLabel: "Examples",
    includes: [
      "Birthdays",
      "Conferences",
      "Church Events",
      "Concerts",
      "Corporate Events",
      "Community Events",
    ],
    duration: "3 – 6 hours",
    deliverables: [
      "Full event photo set",
      "Optional recap film",
      "Same-week preview selects",
      "Social-ready crops",
    ],
    workflow: [
      "Brief & run-of-show review",
      "On-site setup",
      "Documentary coverage",
      "Edit & fast delivery",
    ],
    gallery: [weddingIndoor, redDressRose, chefPortrait],
    price: 480,
  },
  {
    id: "commercial",
    name: "Commercial",
    description: "Creative visual content built for businesses and brands.",
    image: chefPortrait,
    cta: "Book Commercial Shoot",
    includesLabel: "What's Included",
    includes: [
      "Product Photography",
      "Food Photography",
      "Corporate Branding",
      "Real Estate",
      "Advertising",
    ],
    duration: "Half day",
    deliverables: [
      "Campaign-ready image set",
      "Art direction & set styling",
      "Licensed usage rights",
      "Web & print exports",
    ],
    workflow: [
      "Creative brief",
      "Shot list & art direction",
      "Production day",
      "Retouch & handover",
    ],
    gallery: [chefPortrait, fashionJewelry, fashionPortrait],
    price: 950,
  },
  {
    id: "videography",
    name: "Videography",
    description: "Cinematic productions crafted to tell compelling stories.",
    image: redSuitPink,
    cta: "Book Video Project",
    includesLabel: "What's Included",
    includes: [
      "Music Videos",
      "Commercial Films",
      "Event Films",
      "Interviews",
      "Documentaries",
    ],
    duration: "4 – 8 hours",
    deliverables: [
      "Graded master film",
      "Vertical social cutdowns",
      "Licensed score & sound mix",
      "Behind-the-scenes stills",
    ],
    workflow: [
      "Concept & treatment",
      "Pre-production planning",
      "Shoot days",
      "Edit, grade & sound",
    ],
    gallery: [redSuitPink, blueHatFashion, mysteryHat],
    price: 350,
  },
  {
    id: "custom",
    name: "Custom Experience",
    description:
      "Don't see exactly what you're looking for? Every story is unique. Tell us your vision and we'll create a personalized photography or videography experience designed specifically for you.",
    image: "",
    cta: "Start Planning",
    includesLabel: "Examples",
    includes: [
      "Destination Shoots",
      "Creative Campaigns",
      "Fashion Editorials",
      "Travel Projects",
      "Studio Concepts",
      "Surprise Proposals",
      "Multi-day Productions",
    ],
    duration: "Tailored to your project",
    deliverables: [
      "Bespoke creative treatment",
      "Dedicated production team",
      "Custom deliverable package",
      "Ongoing creative direction",
    ],
    workflow: [
      "Vision consultation",
      "Bespoke proposal",
      "Production",
      "Curated delivery",
    ],
    gallery: [],
    price: 0,
    featured: true,
  },
];

export const timeSlots = ["09:00", "10:30", "12:00", "14:00", "16:30", "18:00"];

export const projectTypes = [
  "Destination Shoot",
  "Creative Campaign",
  "Fashion Editorial",
  "Travel Project",
  "Studio Concept",
  "Surprise Proposal",
  "Multi-day Production",
  "Something Else",
];

export const budgetRanges = [
  "Under $500",
  "$500 – $1,500",
  "$1,500 – $5,000",
  "$5,000 +",
  "Prefer to discuss",
];

export const mediumOptions = ["Photography", "Videography", "Both"];
