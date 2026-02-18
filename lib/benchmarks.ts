// Position benchmarks by division level
// Data represents average starter profiles at each level
// Sources: NCAA averages, recruiting service composites

export interface PositionBenchmark {
  position: string
  label: string
  divisions: {
    [key: string]: {
      heightMin: number  // inches
      heightMax: number  // inches
      weightMin: number  // lbs
      weightMax: number  // lbs
      fortyMin: number   // 40-yard dash seconds
      fortyMax: number
      gpaMin: number
      gpaAvg: number
    }
  }
}

export const POSITION_BENCHMARKS: PositionBenchmark[] = [
  {
    position: 'QB',
    label: 'Quarterback',
    divisions: {
      FBS: { heightMin: 73, heightMax: 77, weightMin: 200, weightMax: 230, fortyMin: 4.5, fortyMax: 4.9, gpaMin: 2.5, gpaAvg: 3.1 },
      FCS: { heightMin: 72, heightMax: 76, weightMin: 190, weightMax: 225, fortyMin: 4.55, fortyMax: 5.0, gpaMin: 2.3, gpaAvg: 2.9 },
      D2:  { heightMin: 71, heightMax: 75, weightMin: 185, weightMax: 220, fortyMin: 4.6, fortyMax: 5.1, gpaMin: 2.2, gpaAvg: 2.8 },
      D3:  { heightMin: 70, heightMax: 75, weightMin: 180, weightMax: 215, fortyMin: 4.65, fortyMax: 5.2, gpaMin: 2.5, gpaAvg: 3.0 },
      NAIA:{ heightMin: 70, heightMax: 75, weightMin: 175, weightMax: 215, fortyMin: 4.6, fortyMax: 5.2, gpaMin: 2.0, gpaAvg: 2.7 },
      JUCO:{ heightMin: 70, heightMax: 76, weightMin: 180, weightMax: 220, fortyMin: 4.55, fortyMax: 5.1, gpaMin: 2.0, gpaAvg: 2.5 },
    },
  },
  {
    position: 'RB',
    label: 'Running Back',
    divisions: {
      FBS: { heightMin: 69, heightMax: 73, weightMin: 195, weightMax: 225, fortyMin: 4.35, fortyMax: 4.6, gpaMin: 2.5, gpaAvg: 2.9 },
      FCS: { heightMin: 68, heightMax: 72, weightMin: 185, weightMax: 215, fortyMin: 4.4, fortyMax: 4.7, gpaMin: 2.3, gpaAvg: 2.8 },
      D2:  { heightMin: 67, heightMax: 72, weightMin: 180, weightMax: 210, fortyMin: 4.45, fortyMax: 4.75, gpaMin: 2.2, gpaAvg: 2.7 },
      D3:  { heightMin: 67, heightMax: 71, weightMin: 175, weightMax: 205, fortyMin: 4.5, fortyMax: 4.85, gpaMin: 2.5, gpaAvg: 3.0 },
      NAIA:{ heightMin: 67, heightMax: 71, weightMin: 175, weightMax: 205, fortyMin: 4.45, fortyMax: 4.8, gpaMin: 2.0, gpaAvg: 2.6 },
      JUCO:{ heightMin: 67, heightMax: 72, weightMin: 180, weightMax: 215, fortyMin: 4.4, fortyMax: 4.75, gpaMin: 2.0, gpaAvg: 2.5 },
    },
  },
  {
    position: 'WR',
    label: 'Wide Receiver',
    divisions: {
      FBS: { heightMin: 70, heightMax: 75, weightMin: 180, weightMax: 210, fortyMin: 4.35, fortyMax: 4.6, gpaMin: 2.5, gpaAvg: 2.9 },
      FCS: { heightMin: 69, heightMax: 74, weightMin: 175, weightMax: 205, fortyMin: 4.4, fortyMax: 4.65, gpaMin: 2.3, gpaAvg: 2.8 },
      D2:  { heightMin: 69, heightMax: 73, weightMin: 170, weightMax: 200, fortyMin: 4.45, fortyMax: 4.7, gpaMin: 2.2, gpaAvg: 2.7 },
      D3:  { heightMin: 68, heightMax: 73, weightMin: 165, weightMax: 195, fortyMin: 4.5, fortyMax: 4.8, gpaMin: 2.5, gpaAvg: 3.0 },
      NAIA:{ heightMin: 68, heightMax: 73, weightMin: 165, weightMax: 195, fortyMin: 4.45, fortyMax: 4.75, gpaMin: 2.0, gpaAvg: 2.6 },
      JUCO:{ heightMin: 68, heightMax: 74, weightMin: 170, weightMax: 205, fortyMin: 4.4, fortyMax: 4.7, gpaMin: 2.0, gpaAvg: 2.5 },
    },
  },
  {
    position: 'TE',
    label: 'Tight End',
    divisions: {
      FBS: { heightMin: 74, heightMax: 78, weightMin: 230, weightMax: 260, fortyMin: 4.55, fortyMax: 4.85, gpaMin: 2.5, gpaAvg: 2.9 },
      FCS: { heightMin: 73, heightMax: 77, weightMin: 220, weightMax: 250, fortyMin: 4.6, fortyMax: 4.9, gpaMin: 2.3, gpaAvg: 2.8 },
      D2:  { heightMin: 73, heightMax: 76, weightMin: 215, weightMax: 245, fortyMin: 4.65, fortyMax: 4.95, gpaMin: 2.2, gpaAvg: 2.7 },
      D3:  { heightMin: 72, heightMax: 76, weightMin: 210, weightMax: 240, fortyMin: 4.7, fortyMax: 5.0, gpaMin: 2.5, gpaAvg: 3.0 },
      NAIA:{ heightMin: 72, heightMax: 76, weightMin: 210, weightMax: 240, fortyMin: 4.65, fortyMax: 5.0, gpaMin: 2.0, gpaAvg: 2.6 },
      JUCO:{ heightMin: 72, heightMax: 77, weightMin: 215, weightMax: 250, fortyMin: 4.6, fortyMax: 4.95, gpaMin: 2.0, gpaAvg: 2.5 },
    },
  },
  {
    position: 'OL',
    label: 'Offensive Line',
    divisions: {
      FBS: { heightMin: 75, heightMax: 79, weightMin: 290, weightMax: 330, fortyMin: 5.0, fortyMax: 5.4, gpaMin: 2.5, gpaAvg: 2.9 },
      FCS: { heightMin: 74, heightMax: 78, weightMin: 275, weightMax: 315, fortyMin: 5.05, fortyMax: 5.45, gpaMin: 2.3, gpaAvg: 2.8 },
      D2:  { heightMin: 73, heightMax: 77, weightMin: 265, weightMax: 305, fortyMin: 5.1, fortyMax: 5.5, gpaMin: 2.2, gpaAvg: 2.7 },
      D3:  { heightMin: 72, heightMax: 77, weightMin: 255, weightMax: 295, fortyMin: 5.15, fortyMax: 5.6, gpaMin: 2.5, gpaAvg: 3.0 },
      NAIA:{ heightMin: 72, heightMax: 77, weightMin: 255, weightMax: 300, fortyMin: 5.1, fortyMax: 5.5, gpaMin: 2.0, gpaAvg: 2.6 },
      JUCO:{ heightMin: 73, heightMax: 78, weightMin: 270, weightMax: 310, fortyMin: 5.05, fortyMax: 5.45, gpaMin: 2.0, gpaAvg: 2.5 },
    },
  },
  {
    position: 'DL',
    label: 'Defensive Line',
    divisions: {
      FBS: { heightMin: 74, heightMax: 78, weightMin: 270, weightMax: 310, fortyMin: 4.7, fortyMax: 5.1, gpaMin: 2.5, gpaAvg: 2.9 },
      FCS: { heightMin: 73, heightMax: 77, weightMin: 255, weightMax: 295, fortyMin: 4.75, fortyMax: 5.15, gpaMin: 2.3, gpaAvg: 2.8 },
      D2:  { heightMin: 72, heightMax: 76, weightMin: 245, weightMax: 285, fortyMin: 4.8, fortyMax: 5.2, gpaMin: 2.2, gpaAvg: 2.7 },
      D3:  { heightMin: 72, heightMax: 76, weightMin: 235, weightMax: 275, fortyMin: 4.85, fortyMax: 5.3, gpaMin: 2.5, gpaAvg: 3.0 },
      NAIA:{ heightMin: 72, heightMax: 76, weightMin: 235, weightMax: 280, fortyMin: 4.8, fortyMax: 5.25, gpaMin: 2.0, gpaAvg: 2.6 },
      JUCO:{ heightMin: 72, heightMax: 77, weightMin: 250, weightMax: 290, fortyMin: 4.75, fortyMax: 5.15, gpaMin: 2.0, gpaAvg: 2.5 },
    },
  },
  {
    position: 'LB',
    label: 'Linebacker',
    divisions: {
      FBS: { heightMin: 72, heightMax: 75, weightMin: 225, weightMax: 250, fortyMin: 4.5, fortyMax: 4.8, gpaMin: 2.5, gpaAvg: 2.9 },
      FCS: { heightMin: 71, heightMax: 74, weightMin: 215, weightMax: 240, fortyMin: 4.55, fortyMax: 4.85, gpaMin: 2.3, gpaAvg: 2.8 },
      D2:  { heightMin: 70, heightMax: 74, weightMin: 210, weightMax: 235, fortyMin: 4.6, fortyMax: 4.9, gpaMin: 2.2, gpaAvg: 2.7 },
      D3:  { heightMin: 70, heightMax: 73, weightMin: 205, weightMax: 230, fortyMin: 4.65, fortyMax: 4.95, gpaMin: 2.5, gpaAvg: 3.0 },
      NAIA:{ heightMin: 70, heightMax: 74, weightMin: 205, weightMax: 235, fortyMin: 4.6, fortyMax: 4.9, gpaMin: 2.0, gpaAvg: 2.6 },
      JUCO:{ heightMin: 70, heightMax: 74, weightMin: 210, weightMax: 240, fortyMin: 4.55, fortyMax: 4.85, gpaMin: 2.0, gpaAvg: 2.5 },
    },
  },
  {
    position: 'CB',
    label: 'Cornerback',
    divisions: {
      FBS: { heightMin: 69, heightMax: 73, weightMin: 180, weightMax: 200, fortyMin: 4.35, fortyMax: 4.55, gpaMin: 2.5, gpaAvg: 2.9 },
      FCS: { heightMin: 69, heightMax: 72, weightMin: 175, weightMax: 195, fortyMin: 4.4, fortyMax: 4.6, gpaMin: 2.3, gpaAvg: 2.8 },
      D2:  { heightMin: 68, heightMax: 72, weightMin: 170, weightMax: 190, fortyMin: 4.45, fortyMax: 4.65, gpaMin: 2.2, gpaAvg: 2.7 },
      D3:  { heightMin: 68, heightMax: 72, weightMin: 165, weightMax: 185, fortyMin: 4.5, fortyMax: 4.7, gpaMin: 2.5, gpaAvg: 3.0 },
      NAIA:{ heightMin: 68, heightMax: 72, weightMin: 165, weightMax: 190, fortyMin: 4.45, fortyMax: 4.65, gpaMin: 2.0, gpaAvg: 2.6 },
      JUCO:{ heightMin: 68, heightMax: 72, weightMin: 170, weightMax: 195, fortyMin: 4.4, fortyMax: 4.6, gpaMin: 2.0, gpaAvg: 2.5 },
    },
  },
  {
    position: 'S',
    label: 'Safety',
    divisions: {
      FBS: { heightMin: 70, heightMax: 74, weightMin: 195, weightMax: 215, fortyMin: 4.4, fortyMax: 4.6, gpaMin: 2.5, gpaAvg: 2.9 },
      FCS: { heightMin: 70, heightMax: 73, weightMin: 190, weightMax: 210, fortyMin: 4.45, fortyMax: 4.65, gpaMin: 2.3, gpaAvg: 2.8 },
      D2:  { heightMin: 69, heightMax: 73, weightMin: 185, weightMax: 205, fortyMin: 4.5, fortyMax: 4.7, gpaMin: 2.2, gpaAvg: 2.7 },
      D3:  { heightMin: 69, heightMax: 72, weightMin: 180, weightMax: 200, fortyMin: 4.55, fortyMax: 4.75, gpaMin: 2.5, gpaAvg: 3.0 },
      NAIA:{ heightMin: 69, heightMax: 73, weightMin: 180, weightMax: 205, fortyMin: 4.5, fortyMax: 4.7, gpaMin: 2.0, gpaAvg: 2.6 },
      JUCO:{ heightMin: 69, heightMax: 73, weightMin: 185, weightMax: 210, fortyMin: 4.45, fortyMax: 4.65, gpaMin: 2.0, gpaAvg: 2.5 },
    },
  },
  {
    position: 'K',
    label: 'Kicker',
    divisions: {
      FBS: { heightMin: 69, heightMax: 74, weightMin: 170, weightMax: 200, fortyMin: 4.7, fortyMax: 5.2, gpaMin: 2.5, gpaAvg: 3.2 },
      FCS: { heightMin: 68, heightMax: 73, weightMin: 165, weightMax: 195, fortyMin: 4.75, fortyMax: 5.3, gpaMin: 2.3, gpaAvg: 3.0 },
      D2:  { heightMin: 68, heightMax: 73, weightMin: 165, weightMax: 195, fortyMin: 4.8, fortyMax: 5.3, gpaMin: 2.2, gpaAvg: 2.9 },
      D3:  { heightMin: 67, heightMax: 73, weightMin: 160, weightMax: 190, fortyMin: 4.85, fortyMax: 5.4, gpaMin: 2.5, gpaAvg: 3.1 },
      NAIA:{ heightMin: 67, heightMax: 73, weightMin: 160, weightMax: 190, fortyMin: 4.8, fortyMax: 5.3, gpaMin: 2.0, gpaAvg: 2.8 },
      JUCO:{ heightMin: 67, heightMax: 73, weightMin: 160, weightMax: 195, fortyMin: 4.75, fortyMax: 5.3, gpaMin: 2.0, gpaAvg: 2.6 },
    },
  },
  {
    position: 'P',
    label: 'Punter',
    divisions: {
      FBS: { heightMin: 70, heightMax: 75, weightMin: 185, weightMax: 215, fortyMin: 4.7, fortyMax: 5.2, gpaMin: 2.5, gpaAvg: 3.2 },
      FCS: { heightMin: 69, heightMax: 74, weightMin: 180, weightMax: 210, fortyMin: 4.75, fortyMax: 5.3, gpaMin: 2.3, gpaAvg: 3.0 },
      D2:  { heightMin: 69, heightMax: 74, weightMin: 180, weightMax: 210, fortyMin: 4.8, fortyMax: 5.3, gpaMin: 2.2, gpaAvg: 2.9 },
      D3:  { heightMin: 68, heightMax: 74, weightMin: 175, weightMax: 205, fortyMin: 4.85, fortyMax: 5.4, gpaMin: 2.5, gpaAvg: 3.1 },
      NAIA:{ heightMin: 68, heightMax: 74, weightMin: 175, weightMax: 205, fortyMin: 4.8, fortyMax: 5.3, gpaMin: 2.0, gpaAvg: 2.8 },
      JUCO:{ heightMin: 68, heightMax: 74, weightMin: 175, weightMax: 210, fortyMin: 4.75, fortyMax: 5.3, gpaMin: 2.0, gpaAvg: 2.6 },
    },
  },
  {
    position: 'ATH',
    label: 'Athlete',
    divisions: {
      FBS: { heightMin: 70, heightMax: 75, weightMin: 185, weightMax: 215, fortyMin: 4.4, fortyMax: 4.7, gpaMin: 2.5, gpaAvg: 2.9 },
      FCS: { heightMin: 69, heightMax: 74, weightMin: 180, weightMax: 210, fortyMin: 4.45, fortyMax: 4.75, gpaMin: 2.3, gpaAvg: 2.8 },
      D2:  { heightMin: 69, heightMax: 73, weightMin: 175, weightMax: 205, fortyMin: 4.5, fortyMax: 4.8, gpaMin: 2.2, gpaAvg: 2.7 },
      D3:  { heightMin: 68, heightMax: 73, weightMin: 170, weightMax: 200, fortyMin: 4.55, fortyMax: 4.85, gpaMin: 2.5, gpaAvg: 3.0 },
      NAIA:{ heightMin: 68, heightMax: 73, weightMin: 170, weightMax: 200, fortyMin: 4.5, fortyMax: 4.8, gpaMin: 2.0, gpaAvg: 2.6 },
      JUCO:{ heightMin: 68, heightMax: 74, weightMin: 175, weightMax: 205, fortyMin: 4.45, fortyMax: 4.75, gpaMin: 2.0, gpaAvg: 2.5 },
    },
  },
]

// Sample depth chart data for seeded schools
export interface DepthChartPlayer {
  position: string
  depth: number  // 1 = starter, 2 = backup, 3 = third string
  name: string
  number: number
  year: string   // FR, SO, JR, SR
  height: string // e.g. "6'3"
  weight: number
  hometown: string
}

export interface SchoolDepthChart {
  school: string
  division: string
  conference: string
  lastUpdated: string
  roster: DepthChartPlayer[]
}

export const SAMPLE_DEPTH_CHARTS: SchoolDepthChart[] = [
  {
    school: 'University of Alabama',
    division: 'FBS',
    conference: 'SEC',
    lastUpdated: '2026-02-01',
    roster: [
      { position: 'QB', depth: 1, name: 'Jalen Milroe', number: 4, year: 'SR', height: "6'2", weight: 215, hometown: 'Katy, TX' },
      { position: 'QB', depth: 2, name: 'Ty Simpson', number: 15, year: 'JR', height: "6'1", weight: 200, hometown: 'Martin, TN' },
      { position: 'RB', depth: 1, name: 'Jam Miller', number: 26, year: 'SR', height: "5'11", weight: 210, hometown: 'Gainesville, GA' },
      { position: 'RB', depth: 2, name: 'Justice Haynes', number: 22, year: 'SO', height: "5'11", weight: 205, hometown: 'Roswell, GA' },
      { position: 'WR', depth: 1, name: 'Ryan Williams', number: 2, year: 'SO', height: "6'0", weight: 185, hometown: 'Saraland, AL' },
      { position: 'WR', depth: 1, name: 'Cole Adams', number: 8, year: 'JR', height: "6'1", weight: 190, hometown: 'Mobile, AL' },
      { position: 'TE', depth: 1, name: 'CJ Dippre', number: 81, year: 'SR', height: "6'5", weight: 252, hometown: 'Scranton, PA' },
      { position: 'OL', depth: 1, name: 'Tyler Booker', number: 52, year: 'JR', height: "6'5", weight: 325, hometown: 'New Haven, CT' },
      { position: 'OL', depth: 1, name: 'Parker Brailsford', number: 71, year: 'JR', height: "6'5", weight: 310, hometown: 'Bountiful, UT' },
      { position: 'DL', depth: 1, name: 'LT Overton', number: 18, year: 'SO', height: "6'5", weight: 275, hometown: 'Duncanville, TX' },
      { position: 'DL', depth: 1, name: 'Que Robinson', number: 0, year: 'JR', height: "6'4", weight: 265, hometown: 'Detroit, MI' },
      { position: 'LB', depth: 1, name: 'Deontae Lawson', number: 32, year: 'SR', height: "6'2", weight: 240, hometown: 'Mobile, AL' },
      { position: 'LB', depth: 2, name: 'Jihaad Campbell', number: 13, year: 'JR', height: "6'3", weight: 230, hometown: 'Sicklerville, NJ' },
      { position: 'CB', depth: 1, name: 'Kool-Aid McKinstry', number: 1, year: 'SR', height: "6'1", weight: 195, hometown: 'Birmingham, AL' },
      { position: 'CB', depth: 2, name: 'Domani Jackson', number: 24, year: 'JR', height: "6'1", weight: 190, hometown: 'Santa Ana, CA' },
      { position: 'S', depth: 1, name: 'Malachi Moore', number: 13, year: 'SR', height: "6'0", weight: 200, hometown: 'Trussville, AL' },
    ],
  },
  {
    school: 'Ohio State University',
    division: 'FBS',
    conference: 'Big Ten',
    lastUpdated: '2026-02-01',
    roster: [
      { position: 'QB', depth: 1, name: 'Will Howard', number: 18, year: 'SR', height: "6'4", weight: 230, hometown: 'Downingtown, PA' },
      { position: 'QB', depth: 2, name: 'Devin Brown', number: 33, year: 'JR', height: "6'3", weight: 210, hometown: 'Draper, UT' },
      { position: 'RB', depth: 1, name: 'Quinshon Judkins', number: 1, year: 'JR', height: "5'11", weight: 210, hometown: 'Pike Road, AL' },
      { position: 'RB', depth: 2, name: 'TreVeyon Henderson', number: 32, year: 'SR', height: "5'10", weight: 210, hometown: 'Hopewell, VA' },
      { position: 'WR', depth: 1, name: 'Emeka Egbuka', number: 2, year: 'SR', height: "6'1", weight: 205, hometown: 'Steilacoom, WA' },
      { position: 'WR', depth: 1, name: 'Carnell Tate', number: 17, year: 'SO', height: "6'2", weight: 190, hometown: 'Chicago, IL' },
      { position: 'TE', depth: 1, name: 'Gee Scott Jr', number: 88, year: 'SR', height: "6'3", weight: 240, hometown: 'Seattle, WA' },
      { position: 'OL', depth: 1, name: 'Donovan Jackson', number: 74, year: 'SR', height: "6'4", weight: 315, hometown: 'Bellaire, TX' },
      { position: 'DL', depth: 1, name: 'Jack Sawyer', number: 33, year: 'SR', height: "6'5", weight: 265, hometown: 'Pickerington, OH' },
      { position: 'DL', depth: 1, name: 'JT Tuimoloau', number: 44, year: 'SR', height: "6'4", weight: 270, hometown: 'Edgewood, WA' },
      { position: 'LB', depth: 1, name: 'Cody Simon', number: 30, year: 'SR', height: "6'2", weight: 235, hometown: 'Jersey City, NJ' },
      { position: 'CB', depth: 1, name: 'Denzel Burke', number: 29, year: 'SR', height: "6'1", weight: 192, hometown: 'Scottsdale, AZ' },
      { position: 'S', depth: 1, name: 'Lathan Ransom', number: 8, year: 'SR', height: "6'1", weight: 210, hometown: 'Tucson, AZ' },
    ],
  },
  {
    school: 'University of Georgia',
    division: 'FBS',
    conference: 'SEC',
    lastUpdated: '2026-02-01',
    roster: [
      { position: 'QB', depth: 1, name: 'Carson Beck', number: 15, year: 'SR', height: "6'4", weight: 225, hometown: 'Jacksonville, FL' },
      { position: 'RB', depth: 1, name: 'Trevor Etienne', number: 1, year: 'JR', height: "5'10", weight: 210, hometown: 'Jennings, LA' },
      { position: 'WR', depth: 1, name: 'Dillon Bell', number: 86, year: 'JR', height: "6'1", weight: 200, hometown: 'Valdosta, GA' },
      { position: 'WR', depth: 1, name: 'Dom Lovett', number: 7, year: 'JR', height: "5'10", weight: 180, hometown: 'East St. Louis, IL' },
      { position: 'TE', depth: 1, name: 'Oscar Delp', number: 4, year: 'JR', height: "6'5", weight: 245, hometown: 'Cumming, GA' },
      { position: 'OL', depth: 1, name: 'Tate Ratledge', number: 69, year: 'SR', height: "6'6", weight: 320, hometown: 'Rome, GA' },
      { position: 'DL', depth: 1, name: 'Mykel Williams', number: 13, year: 'JR', height: "6'5", weight: 265, hometown: 'Columbus, GA' },
      { position: 'LB', depth: 1, name: 'Smael Mondon', number: 2, year: 'SR', height: "6'3", weight: 230, hometown: 'Dallas, GA' },
      { position: 'CB', depth: 1, name: 'Daylen Everette', number: 6, year: 'SO', height: "6'1", weight: 185, hometown: 'Norfolk, VA' },
      { position: 'S', depth: 1, name: 'Dan Jackson', number: 47, year: 'SR', height: "6'1", weight: 205, hometown: 'Cedartown, GA' },
    ],
  },
]

// Helper to format height from total inches
export function formatHeight(totalInches: number): string {
  const feet = Math.floor(totalInches / 12)
  const inches = totalInches % 12
  return `${feet}'${inches}"`
}

// Calculate fit score (0-100) for athlete vs division benchmark
export function calculateFitScore(
  athlete: {
    heightInches: number
    weight: number
    fortyTime?: number
    gpa?: number
  },
  benchmark: {
    heightMin: number
    heightMax: number
    weightMin: number
    weightMax: number
    fortyMin: number
    fortyMax: number
    gpaMin: number
    gpaAvg: number
  }
): { overall: number; height: number; weight: number; speed: number; academics: number } {
  // Height score (0-100)
  let heightScore = 100
  if (athlete.heightInches < benchmark.heightMin) {
    const diff = benchmark.heightMin - athlete.heightInches
    heightScore = Math.max(0, 100 - diff * 20)
  } else if (athlete.heightInches > benchmark.heightMax) {
    const diff = athlete.heightInches - benchmark.heightMax
    heightScore = Math.max(0, 100 - diff * 15)
  }

  // Weight score (0-100)
  let weightScore = 100
  if (athlete.weight < benchmark.weightMin) {
    const diff = benchmark.weightMin - athlete.weight
    weightScore = Math.max(0, 100 - (diff / benchmark.weightMin) * 200)
  } else if (athlete.weight > benchmark.weightMax) {
    const diff = athlete.weight - benchmark.weightMax
    weightScore = Math.max(0, 100 - (diff / benchmark.weightMax) * 200)
  }

  // Speed score (0-100) - lower 40 time is better
  let speedScore = 80 // default if no 40 time
  if (athlete.fortyTime) {
    const midpoint = (benchmark.fortyMin + benchmark.fortyMax) / 2
    if (athlete.fortyTime <= benchmark.fortyMin) {
      speedScore = 100
    } else if (athlete.fortyTime <= midpoint) {
      speedScore = 90
    } else if (athlete.fortyTime <= benchmark.fortyMax) {
      speedScore = 70
    } else {
      const overBy = athlete.fortyTime - benchmark.fortyMax
      speedScore = Math.max(0, 70 - overBy * 100)
    }
  }

  // Academics score (0-100)
  let academicsScore = 80 // default if no GPA
  if (athlete.gpa) {
    if (athlete.gpa >= benchmark.gpaAvg) {
      academicsScore = 100
    } else if (athlete.gpa >= benchmark.gpaMin) {
      const range = benchmark.gpaAvg - benchmark.gpaMin
      const above = athlete.gpa - benchmark.gpaMin
      academicsScore = 60 + (above / range) * 40
    } else {
      const below = benchmark.gpaMin - athlete.gpa
      academicsScore = Math.max(0, 60 - below * 80)
    }
  }

  // Weighted overall: height 25%, weight 25%, speed 30%, academics 20%
  const overall = Math.round(
    heightScore * 0.25 + weightScore * 0.25 + speedScore * 0.30 + academicsScore * 0.20
  )

  return {
    overall,
    height: Math.round(heightScore),
    weight: Math.round(weightScore),
    speed: Math.round(speedScore),
    academics: Math.round(academicsScore),
  }
}
