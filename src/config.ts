export interface WeddingConfig {
  brideName: string;
  groomName: string;
  weddingDate: string; // ISO date string for countdown timer
  venueName: string;
  venueAddress: string;
  venueGoogleMapsUrl: string;
  rsvpEndpoint: string; // Endpoint to send RSVP details or mock
  crawlTitle: string;
  crawlSubtitle: string;
  crawlParagraphs: string[];
  audioUrl?: string; // Optional custom background track (MP3)
}

export const weddingConfig: WeddingConfig = {
  brideName: "Seraphina",
  groomName: "Aurelius",
  weddingDate: "2027-09-18T16:00:00Z", // Countdown to September 18, 2027
  venueName: "The Starlight Pavilion",
  venueAddress: "777 Celestial Ridge Road, Nebula Valley, CA 90210",
  venueGoogleMapsUrl: "https://maps.google.com/?q=Starlight+Pavilion+Los+Angeles",
  rsvpEndpoint: "/api/rsvp",
  crawlTitle: "Episode I",
  crawlSubtitle: "TWO SOULS, ONE GALAXY",
  crawlParagraphs: [
    "It is a time of cosmic alignment. In a vast galaxy of billions of stars, two wandering orbits have crossed, drawn together by an undeniable gravitational pull.",
    "For years, Seraphina and Aurelius have braved the far reaches of space together, sharing adventures, laughter, and an unbreakable bond that spans the light-years.",
    "Now, they prepare to embark on their greatest expedition yet—the union of their systems. A lifetime voyage of partnership, love, and co-creation.",
    "Together with their families, they invite you to join them as they pledge their vows and ignite their warp drives into forever...",
  ],
  // AudioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3", // Fallback URL
};
