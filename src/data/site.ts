import weddingOutdoor from "@/assets/wedding-outdoor.jpg";
import weddingIndoor from "@/assets/wedding-indoor.jpg";
import bridalPortrait from "@/assets/bridal-portrait.jpg";
import fashionPortrait from "@/assets/fashion-portrait.jpg";
import graduationPortrait from "@/assets/graduation-portrait.jpg";
import chefPortrait from "@/assets/chef-portrait.jpg";
import lifestylePortrait from "@/assets/lifestyle-portrait.jpg";
import redSuitPink from "@/assets/red-suit-pink.jpg";
import fashionJewelry from "@/assets/fashion-jewelry.jpg";
import mysteryHat from "@/assets/mystery-hat.jpg";

export type Collection = {
  id: string;
  title: string;
  category: string;
  count: number;
  descriptor: string;
  image: string;
  featured?: boolean;
};

export const collections: Collection[] = [
  { id: "weddings", title: "Weddings", category: "Weddings", count: 128, descriptor: "Vows, tears and golden light — preserved forever.", image: weddingOutdoor, featured: true },
  { id: "portraits", title: "Portraits", category: "Portraits", count: 94, descriptor: "Character studies lit with intention.", image: fashionPortrait },
  { id: "graduations", title: "Graduations", category: "Graduations", count: 61, descriptor: "Milestones worth framing.", image: graduationPortrait },
  { id: "lifestyle", title: "Lifestyle", category: "Lifestyle", count: 47, descriptor: "Everyday elegance, quietly observed.", image: lifestylePortrait },
  { id: "commercial", title: "Commercial", category: "Commercial", count: 38, descriptor: "Product and brand imagery with appetite.", image: chefPortrait },
  { id: "fashion", title: "Fashion", category: "Fashion", count: 52, descriptor: "Editorial motion, couture stillness.", image: redSuitPink },
  { id: "events", title: "Events", category: "Events", count: 73, descriptor: "Atmosphere captured as it happens.", image: weddingIndoor },
  { id: "bridal", title: "Bridal", category: "Bridal", count: 44, descriptor: "The quiet hour before the celebration.", image: bridalPortrait },
  { id: "documentary", title: "Documentary", category: "Documentary", count: 21, descriptor: "Truthful frames, patiently earned.", image: mysteryHat },
  { id: "campaigns", title: "Campaigns", category: "Commercial", count: 29, descriptor: "Luxury accessories, sculpted in light.", image: fashionJewelry },
];

export const services = [
  { id: "wedding-photography", title: "Wedding Photography", price: "From $1,200", image: weddingOutdoor, description: "Full-day documentary coverage with editorial direction.", includes: ["Two photographers", "10-hour coverage", "Private online gallery"], deliverables: "500+ retouched images in 3 weeks" },
  { id: "wedding-films", title: "Wedding Films", price: "From $1,800", image: weddingIndoor, description: "Cinematic films that let the day breathe again.", includes: ["4K multi-cam", "Licensed score", "Highlight + feature cut"], deliverables: "6-min highlight film + 30-min feature" },
  { id: "portrait-sessions", title: "Portrait Sessions", price: "From $280", image: bridalPortrait, description: "Studio or location portraiture, crafted around you.", includes: ["90-minute session", "Styling guidance", "Two locations"], deliverables: "35 retouched portraits in 7 days" },
  { id: "graduation", title: "Graduation Sessions", price: "From $220", image: graduationPortrait, description: "Celebrate the milestone with timeless frames.", includes: ["60-minute session", "Family group frames", "Campus locations"], deliverables: "30 retouched images in 5 days" },
  { id: "commercial", title: "Commercial Campaigns", price: "From $950", image: chefPortrait, description: "Brand imagery built for launch-day impact.", includes: ["Creative direction", "Studio lighting", "Usage licensing"], deliverables: "Campaign set + social crops" },
  { id: "music-video", title: "Music Video Production", price: "From $2,400", image: redSuitPink, description: "Concept-to-colour-grade music films.", includes: ["Treatment & storyboard", "Cinema camera package", "Colour grading"], deliverables: "Master film + vertical cutdowns" },
];

export const testimonials = [
  { id: 1, name: "Amara & Kwame", service: "Wedding Film", rating: 5, image: weddingOutdoor, quote: "They didn't just record our wedding — they authored it. Watching the film feels like standing in that garden again." },
  { id: 2, name: "Sandrine I.", service: "Editorial Portrait", rating: 5, image: fashionPortrait, quote: "The most considered portrait session I've experienced. Every frame felt intentional, never rushed." },
  { id: 3, name: "Kigali Roast Co.", service: "Commercial Campaign", rating: 5, image: chefPortrait, quote: "Our launch imagery outperformed everything we'd shot before. Craft you can see in the numbers." },
];

export const statistics = [
  { value: "500+", label: "Projects Delivered" },
  { value: "7+", label: "Years of Craft" },
  { value: "98%", label: "Client Satisfaction" },
  { value: "12", label: "Creative Awards" },
];

export const faqs = [
  { q: "How far in advance should I book?", a: "For weddings we recommend six to nine months. Portrait and commercial sessions can usually be scheduled within two to three weeks." },
  { q: "Do you travel outside Kigali?", a: "Yes. We shoot across Rwanda, East Africa and internationally. Travel and accommodation are quoted transparently per project." },
  { q: "What is included in a wedding package?", a: "Pre-wedding consultation, full-day coverage, a second shooter, a private online gallery and a fully retouched collection delivered within three weeks." },
  { q: "How long does delivery take?", a: "Portraits in 5–7 days, weddings in 3 weeks, and cinematic films in 4–6 weeks. Express delivery is available on request." },
  { q: "Can I request both photography and videography?", a: "Absolutely — our combined studio packages are the most requested, and they are priced as one coordinated production." },
  { q: "Do you offer commercial licensing?", a: "Yes. Campaign, print and broadcast licences are tailored to your usage territory and duration." },
];
