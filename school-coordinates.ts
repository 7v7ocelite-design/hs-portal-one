// data/school-coordinates.ts
// Copy this file EXACTLY into your project

export interface SchoolCoordinate {
  name: string
  lat: number
  lng: number
  division: 'FBS' | 'FCS' | 'D2'
  conference: string
  city: string
  state: string
}

export const schoolCoordinates: SchoolCoordinate[] = [
  // ============================================
  // FBS SCHOOLS (85 schools)
  // ============================================

  // SEC (16)
  { name: 'Alabama', lat: 33.2084, lng: -87.5503, division: 'FBS', conference: 'SEC', city: 'Tuscaloosa', state: 'AL' },
  { name: 'Arkansas', lat: 36.0686, lng: -94.1748, division: 'FBS', conference: 'SEC', city: 'Fayetteville', state: 'AR' },
  { name: 'Auburn', lat: 32.6026, lng: -85.4897, division: 'FBS', conference: 'SEC', city: 'Auburn', state: 'AL' },
  { name: 'Florida', lat: 29.6499, lng: -82.3486, division: 'FBS', conference: 'SEC', city: 'Gainesville', state: 'FL' },
  { name: 'Georgia', lat: 33.9500, lng: -83.3733, division: 'FBS', conference: 'SEC', city: 'Athens', state: 'GA' },
  { name: 'Kentucky', lat: 38.0317, lng: -84.5040, division: 'FBS', conference: 'SEC', city: 'Lexington', state: 'KY' },
  { name: 'LSU', lat: 30.4122, lng: -91.1839, division: 'FBS', conference: 'SEC', city: 'Baton Rouge', state: 'LA' },
  { name: 'Mississippi State', lat: 33.4552, lng: -88.7903, division: 'FBS', conference: 'SEC', city: 'Starkville', state: 'MS' },
  { name: 'Missouri', lat: 38.9404, lng: -92.3277, division: 'FBS', conference: 'SEC', city: 'Columbia', state: 'MO' },
  { name: 'Oklahoma', lat: 35.2058, lng: -97.4452, division: 'FBS', conference: 'SEC', city: 'Norman', state: 'OK' },
  { name: 'Ole Miss', lat: 34.3648, lng: -89.5385, division: 'FBS', conference: 'SEC', city: 'Oxford', state: 'MS' },
  { name: 'South Carolina', lat: 34.0007, lng: -81.0348, division: 'FBS', conference: 'SEC', city: 'Columbia', state: 'SC' },
  { name: 'Tennessee', lat: 35.9550, lng: -83.9300, division: 'FBS', conference: 'SEC', city: 'Knoxville', state: 'TN' },
  { name: 'Texas', lat: 30.2849, lng: -97.7341, division: 'FBS', conference: 'SEC', city: 'Austin', state: 'TX' },
  { name: 'Texas A&M', lat: 30.6187, lng: -96.3365, division: 'FBS', conference: 'SEC', city: 'College Station', state: 'TX' },
  { name: 'Vanderbilt', lat: 36.1447, lng: -86.8027, division: 'FBS', conference: 'SEC', city: 'Nashville', state: 'TN' },

  // Big Ten (18)
  { name: 'Illinois', lat: 40.1020, lng: -88.2272, division: 'FBS', conference: 'Big Ten', city: 'Champaign', state: 'IL' },
  { name: 'Indiana', lat: 39.1682, lng: -86.5230, division: 'FBS', conference: 'Big Ten', city: 'Bloomington', state: 'IN' },
  { name: 'Iowa', lat: 41.6611, lng: -91.5302, division: 'FBS', conference: 'Big Ten', city: 'Iowa City', state: 'IA' },
  { name: 'Maryland', lat: 38.9897, lng: -76.9378, division: 'FBS', conference: 'Big Ten', city: 'College Park', state: 'MD' },
  { name: 'Michigan', lat: 42.2681, lng: -83.7506, division: 'FBS', conference: 'Big Ten', city: 'Ann Arbor', state: 'MI' },
  { name: 'Michigan State', lat: 42.7251, lng: -84.4791, division: 'FBS', conference: 'Big Ten', city: 'East Lansing', state: 'MI' },
  { name: 'Minnesota', lat: 44.9740, lng: -93.2277, division: 'FBS', conference: 'Big Ten', city: 'Minneapolis', state: 'MN' },
  { name: 'Nebraska', lat: 40.8202, lng: -96.7005, division: 'FBS', conference: 'Big Ten', city: 'Lincoln', state: 'NE' },
  { name: 'Northwestern', lat: 42.0565, lng: -87.6753, division: 'FBS', conference: 'Big Ten', city: 'Evanston', state: 'IL' },
  { name: 'Ohio State', lat: 40.0061, lng: -83.0282, division: 'FBS', conference: 'Big Ten', city: 'Columbus', state: 'OH' },
  { name: 'Oregon', lat: 44.0582, lng: -123.0691, division: 'FBS', conference: 'Big Ten', city: 'Eugene', state: 'OR' },
  { name: 'Penn State', lat: 40.7982, lng: -77.8599, division: 'FBS', conference: 'Big Ten', city: 'State College', state: 'PA' },
  { name: 'Purdue', lat: 40.4237, lng: -86.9212, division: 'FBS', conference: 'Big Ten', city: 'West Lafayette', state: 'IN' },
  { name: 'Rutgers', lat: 40.5008, lng: -74.4474, division: 'FBS', conference: 'Big Ten', city: 'Piscataway', state: 'NJ' },
  { name: 'UCLA', lat: 34.1614, lng: -118.1675, division: 'FBS', conference: 'Big Ten', city: 'Los Angeles', state: 'CA' },
  { name: 'USC', lat: 34.0224, lng: -118.2851, division: 'FBS', conference: 'Big Ten', city: 'Los Angeles', state: 'CA' },
  { name: 'Washington', lat: 47.6553, lng: -122.3035, division: 'FBS', conference: 'Big Ten', city: 'Seattle', state: 'WA' },
  { name: 'Wisconsin', lat: 43.0766, lng: -89.4125, division: 'FBS', conference: 'Big Ten', city: 'Madison', state: 'WI' },

  // Big 12 (16)
  { name: 'Arizona', lat: 32.2319, lng: -110.9501, division: 'FBS', conference: 'Big 12', city: 'Tucson', state: 'AZ' },
  { name: 'Arizona State', lat: 33.4255, lng: -111.9400, division: 'FBS', conference: 'Big 12', city: 'Tempe', state: 'AZ' },
  { name: 'Baylor', lat: 31.5586, lng: -97.1189, division: 'FBS', conference: 'Big 12', city: 'Waco', state: 'TX' },
  { name: 'BYU', lat: 40.2518, lng: -111.6493, division: 'FBS', conference: 'Big 12', city: 'Provo', state: 'UT' },
  { name: 'Cincinnati', lat: 39.1329, lng: -84.5150, division: 'FBS', conference: 'Big 12', city: 'Cincinnati', state: 'OH' },
  { name: 'Colorado', lat: 40.0076, lng: -105.2659, division: 'FBS', conference: 'Big 12', city: 'Boulder', state: 'CO' },
  { name: 'Houston', lat: 29.7199, lng: -95.3422, division: 'FBS', conference: 'Big 12', city: 'Houston', state: 'TX' },
  { name: 'Iowa State', lat: 42.0266, lng: -93.6465, division: 'FBS', conference: 'Big 12', city: 'Ames', state: 'IA' },
  { name: 'Kansas', lat: 38.9543, lng: -95.2558, division: 'FBS', conference: 'Big 12', city: 'Lawrence', state: 'KS' },
  { name: 'Kansas State', lat: 39.1974, lng: -96.5847, division: 'FBS', conference: 'Big 12', city: 'Manhattan', state: 'KS' },
  { name: 'Oklahoma State', lat: 36.1263, lng: -97.0694, division: 'FBS', conference: 'Big 12', city: 'Stillwater', state: 'OK' },
  { name: 'TCU', lat: 32.7096, lng: -97.3628, division: 'FBS', conference: 'Big 12', city: 'Fort Worth', state: 'TX' },
  { name: 'Texas Tech', lat: 33.5843, lng: -101.8783, division: 'FBS', conference: 'Big 12', city: 'Lubbock', state: 'TX' },
  { name: 'UCF', lat: 28.6024, lng: -81.2001, division: 'FBS', conference: 'Big 12', city: 'Orlando', state: 'FL' },
  { name: 'Utah', lat: 40.7649, lng: -111.8421, division: 'FBS', conference: 'Big 12', city: 'Salt Lake City', state: 'UT' },
  { name: 'West Virginia', lat: 39.6480, lng: -79.9714, division: 'FBS', conference: 'Big 12', city: 'Morgantown', state: 'WV' },

  // ACC (17)
  { name: 'Boston College', lat: 42.3355, lng: -71.1685, division: 'FBS', conference: 'ACC', city: 'Chestnut Hill', state: 'MA' },
  { name: 'California', lat: 37.8719, lng: -122.2585, division: 'FBS', conference: 'ACC', city: 'Berkeley', state: 'CA' },
  { name: 'Clemson', lat: 34.6834, lng: -82.8374, division: 'FBS', conference: 'ACC', city: 'Clemson', state: 'SC' },
  { name: 'Duke', lat: 36.0014, lng: -78.9382, division: 'FBS', conference: 'ACC', city: 'Durham', state: 'NC' },
  { name: 'Florida State', lat: 30.4419, lng: -84.2985, division: 'FBS', conference: 'ACC', city: 'Tallahassee', state: 'FL' },
  { name: 'Georgia Tech', lat: 33.7756, lng: -84.3963, division: 'FBS', conference: 'ACC', city: 'Atlanta', state: 'GA' },
  { name: 'Louisville', lat: 38.2165, lng: -85.7585, division: 'FBS', conference: 'ACC', city: 'Louisville', state: 'KY' },
  { name: 'Miami', lat: 25.7145, lng: -80.2788, division: 'FBS', conference: 'ACC', city: 'Coral Gables', state: 'FL' },
  { name: 'NC State', lat: 35.7872, lng: -78.6705, division: 'FBS', conference: 'ACC', city: 'Raleigh', state: 'NC' },
  { name: 'North Carolina', lat: 35.9049, lng: -79.0469, division: 'FBS', conference: 'ACC', city: 'Chapel Hill', state: 'NC' },
  { name: 'Pittsburgh', lat: 40.4443, lng: -79.9608, division: 'FBS', conference: 'ACC', city: 'Pittsburgh', state: 'PA' },
  { name: 'SMU', lat: 32.8431, lng: -96.7850, division: 'FBS', conference: 'ACC', city: 'Dallas', state: 'TX' },
  { name: 'Stanford', lat: 37.4346, lng: -122.1609, division: 'FBS', conference: 'ACC', city: 'Stanford', state: 'CA' },
  { name: 'Syracuse', lat: 43.0392, lng: -76.1351, division: 'FBS', conference: 'ACC', city: 'Syracuse', state: 'NY' },
  { name: 'Virginia', lat: 38.0336, lng: -78.5080, division: 'FBS', conference: 'ACC', city: 'Charlottesville', state: 'VA' },
  { name: 'Virginia Tech', lat: 37.2296, lng: -80.4139, division: 'FBS', conference: 'ACC', city: 'Blacksburg', state: 'VA' },
  { name: 'Wake Forest', lat: 36.1340, lng: -80.2795, division: 'FBS', conference: 'ACC', city: 'Winston-Salem', state: 'NC' },

  // Group of 5: American (8)
  { name: 'Army', lat: 41.3915, lng: -73.9560, division: 'FBS', conference: 'American', city: 'West Point', state: 'NY' },
  { name: 'Charlotte', lat: 35.3082, lng: -80.7334, division: 'FBS', conference: 'American', city: 'Charlotte', state: 'NC' },
  { name: 'East Carolina', lat: 35.6085, lng: -77.3664, division: 'FBS', conference: 'American', city: 'Greenville', state: 'NC' },
  { name: 'FAU', lat: 26.3713, lng: -80.1016, division: 'FBS', conference: 'American', city: 'Boca Raton', state: 'FL' },
  { name: 'Memphis', lat: 35.1175, lng: -89.9372, division: 'FBS', conference: 'American', city: 'Memphis', state: 'TN' },
  { name: 'Navy', lat: 38.9866, lng: -76.4859, division: 'FBS', conference: 'American', city: 'Annapolis', state: 'MD' },
  { name: 'North Texas', lat: 33.2148, lng: -97.1331, division: 'FBS', conference: 'American', city: 'Denton', state: 'TX' },
  { name: 'Rice', lat: 29.7174, lng: -95.4018, division: 'FBS', conference: 'American', city: 'Houston', state: 'TX' },
  { name: 'South Florida', lat: 28.0587, lng: -82.4139, division: 'FBS', conference: 'American', city: 'Tampa', state: 'FL' },
  { name: 'Temple', lat: 39.9812, lng: -75.1554, division: 'FBS', conference: 'American', city: 'Philadelphia', state: 'PA' },
  { name: 'Tulane', lat: 29.9398, lng: -90.1208, division: 'FBS', conference: 'American', city: 'New Orleans', state: 'LA' },
  { name: 'Tulsa', lat: 36.1511, lng: -95.9446, division: 'FBS', conference: 'American', city: 'Tulsa', state: 'OK' },
  { name: 'UAB', lat: 33.5021, lng: -86.7988, division: 'FBS', conference: 'American', city: 'Birmingham', state: 'AL' },
  { name: 'UTSA', lat: 29.5843, lng: -98.6199, division: 'FBS', conference: 'American', city: 'San Antonio', state: 'TX' },

  // ============================================
  // FCS SCHOOLS (110 schools)
  // ============================================

  // Big Sky (14)
  { name: 'Cal Poly', lat: 35.3050, lng: -120.6625, division: 'FCS', conference: 'Big Sky', city: 'San Luis Obispo', state: 'CA' },
  { name: 'Eastern Washington', lat: 47.4912, lng: -117.5824, division: 'FCS', conference: 'Big Sky', city: 'Cheney', state: 'WA' },
  { name: 'Idaho', lat: 46.7256, lng: -117.0145, division: 'FCS', conference: 'Big Sky', city: 'Moscow', state: 'ID' },
  { name: 'Idaho State', lat: 42.8621, lng: -112.4344, division: 'FCS', conference: 'Big Sky', city: 'Pocatello', state: 'ID' },
  { name: 'Montana', lat: 46.8625, lng: -113.9847, division: 'FCS', conference: 'Big Sky', city: 'Missoula', state: 'MT' },
  { name: 'Montana State', lat: 45.6676, lng: -111.0555, division: 'FCS', conference: 'Big Sky', city: 'Bozeman', state: 'MT' },
  { name: 'Northern Arizona', lat: 35.1894, lng: -111.6533, division: 'FCS', conference: 'Big Sky', city: 'Flagstaff', state: 'AZ' },
  { name: 'Northern Colorado', lat: 40.4064, lng: -104.6970, division: 'FCS', conference: 'Big Sky', city: 'Greeley', state: 'CO' },
  { name: 'Portland State', lat: 45.5118, lng: -122.6850, division: 'FCS', conference: 'Big Sky', city: 'Portland', state: 'OR' },
  { name: 'Sacramento State', lat: 38.5616, lng: -121.4240, division: 'FCS', conference: 'Big Sky', city: 'Sacramento', state: 'CA' },
  { name: 'UC Davis', lat: 38.5382, lng: -121.7617, division: 'FCS', conference: 'Big Sky', city: 'Davis', state: 'CA' },
  { name: 'Weber State', lat: 41.1918, lng: -111.9346, division: 'FCS', conference: 'Big Sky', city: 'Ogden', state: 'UT' },

  // CAA (14)
  { name: 'Albany', lat: 42.6864, lng: -73.8240, division: 'FCS', conference: 'CAA', city: 'Albany', state: 'NY' },
  { name: 'Campbell', lat: 35.4174, lng: -78.8534, division: 'FCS', conference: 'CAA', city: 'Buies Creek', state: 'NC' },
  { name: 'Delaware', lat: 39.6837, lng: -75.7497, division: 'FCS', conference: 'CAA', city: 'Newark', state: 'DE' },
  { name: 'Elon', lat: 36.1029, lng: -79.5028, division: 'FCS', conference: 'CAA', city: 'Elon', state: 'NC' },
  { name: 'Hampton', lat: 37.0224, lng: -76.3374, division: 'FCS', conference: 'CAA', city: 'Hampton', state: 'VA' },
  { name: 'Maine', lat: 44.9012, lng: -68.6719, division: 'FCS', conference: 'CAA', city: 'Orono', state: 'ME' },
  { name: 'Monmouth', lat: 40.2774, lng: -74.0046, division: 'FCS', conference: 'CAA', city: 'West Long Branch', state: 'NJ' },
  { name: 'New Hampshire', lat: 43.1348, lng: -70.9358, division: 'FCS', conference: 'CAA', city: 'Durham', state: 'NH' },
  { name: 'North Carolina A&T', lat: 36.0726, lng: -79.7716, division: 'FCS', conference: 'CAA', city: 'Greensboro', state: 'NC' },
  { name: 'Rhode Island', lat: 41.4865, lng: -71.5301, division: 'FCS', conference: 'CAA', city: 'Kingston', state: 'RI' },
  { name: 'Richmond', lat: 37.5741, lng: -77.5400, division: 'FCS', conference: 'CAA', city: 'Richmond', state: 'VA' },
  { name: 'Stony Brook', lat: 40.9126, lng: -73.1235, division: 'FCS', conference: 'CAA', city: 'Stony Brook', state: 'NY' },
  { name: 'Towson', lat: 39.3948, lng: -76.6087, division: 'FCS', conference: 'CAA', city: 'Towson', state: 'MD' },
  { name: 'Villanova', lat: 40.0357, lng: -75.3378, division: 'FCS', conference: 'CAA', city: 'Villanova', state: 'PA' },
  { name: 'William & Mary', lat: 37.2707, lng: -76.7139, division: 'FCS', conference: 'CAA', city: 'Williamsburg', state: 'VA' },

  // MVFC (11)
  { name: 'Illinois State', lat: 40.5114, lng: -88.9883, division: 'FCS', conference: 'MVFC', city: 'Normal', state: 'IL' },
  { name: 'Indiana State', lat: 39.4658, lng: -87.4142, division: 'FCS', conference: 'MVFC', city: 'Terre Haute', state: 'IN' },
  { name: 'Missouri State', lat: 37.2090, lng: -93.2923, division: 'FCS', conference: 'MVFC', city: 'Springfield', state: 'MO' },
  { name: 'North Dakota', lat: 47.9253, lng: -97.0329, division: 'FCS', conference: 'MVFC', city: 'Grand Forks', state: 'ND' },
  { name: 'North Dakota State', lat: 46.8973, lng: -96.8023, division: 'FCS', conference: 'MVFC', city: 'Fargo', state: 'ND' },
  { name: 'Northern Iowa', lat: 42.5133, lng: -92.4611, division: 'FCS', conference: 'MVFC', city: 'Cedar Falls', state: 'IA' },
  { name: 'South Dakota', lat: 42.7876, lng: -96.9269, division: 'FCS', conference: 'MVFC', city: 'Vermillion', state: 'SD' },
  { name: 'South Dakota State', lat: 44.3114, lng: -96.7984, division: 'FCS', conference: 'MVFC', city: 'Brookings', state: 'SD' },
  { name: 'Southern Illinois', lat: 37.7136, lng: -89.2163, division: 'FCS', conference: 'MVFC', city: 'Carbondale', state: 'IL' },
  { name: 'Western Illinois', lat: 40.4761, lng: -90.6813, division: 'FCS', conference: 'MVFC', city: 'Macomb', state: 'IL' },
  { name: 'Youngstown State', lat: 41.1067, lng: -80.6456, division: 'FCS', conference: 'MVFC', city: 'Youngstown', state: 'OH' },

  // Big South-OVC (10)
  { name: 'Bryant', lat: 41.8471, lng: -71.4545, division: 'FCS', conference: 'Big South-OVC', city: 'Smithfield', state: 'RI' },
  { name: 'Charleston Southern', lat: 32.9707, lng: -80.0636, division: 'FCS', conference: 'Big South-OVC', city: 'Charleston', state: 'SC' },
  { name: 'Eastern Illinois', lat: 39.4783, lng: -88.1765, division: 'FCS', conference: 'Big South-OVC', city: 'Charleston', state: 'IL' },
  { name: 'Gardner-Webb', lat: 35.2329, lng: -81.5857, division: 'FCS', conference: 'Big South-OVC', city: 'Boiling Springs', state: 'NC' },
  { name: 'Lindenwood', lat: 38.7895, lng: -90.3877, division: 'FCS', conference: 'Big South-OVC', city: 'St. Charles', state: 'MO' },
  { name: 'Robert Morris', lat: 40.5182, lng: -80.1713, division: 'FCS', conference: 'Big South-OVC', city: 'Moon Township', state: 'PA' },
  { name: 'Southeast Missouri State', lat: 37.3109, lng: -89.5379, division: 'FCS', conference: 'Big South-OVC', city: 'Cape Girardeau', state: 'MO' },
  { name: 'Tennessee State', lat: 36.1676, lng: -86.8317, division: 'FCS', conference: 'Big South-OVC', city: 'Nashville', state: 'TN' },
  { name: 'Tennessee Tech', lat: 36.1766, lng: -85.5085, division: 'FCS', conference: 'Big South-OVC', city: 'Cookeville', state: 'TN' },
  { name: 'UT Martin', lat: 36.3420, lng: -88.8509, division: 'FCS', conference: 'Big South-OVC', city: 'Martin', state: 'TN' },

  // Southland (9)
  { name: 'Houston Christian', lat: 29.7858, lng: -95.5407, division: 'FCS', conference: 'Southland', city: 'Houston', state: 'TX' },
  { name: 'Incarnate Word', lat: 29.4655, lng: -98.4675, division: 'FCS', conference: 'Southland', city: 'San Antonio', state: 'TX' },
  { name: 'Lamar', lat: 30.0613, lng: -94.0885, division: 'FCS', conference: 'Southland', city: 'Beaumont', state: 'TX' },
  { name: 'McNeese', lat: 30.2049, lng: -93.2174, division: 'FCS', conference: 'Southland', city: 'Lake Charles', state: 'LA' },
  { name: 'Nicholls', lat: 29.7871, lng: -90.8224, division: 'FCS', conference: 'Southland', city: 'Thibodaux', state: 'LA' },
  { name: 'Northwestern State', lat: 31.7628, lng: -93.1065, division: 'FCS', conference: 'Southland', city: 'Natchitoches', state: 'LA' },
  { name: 'Southeastern Louisiana', lat: 30.5170, lng: -90.4623, division: 'FCS', conference: 'Southland', city: 'Hammond', state: 'LA' },
  { name: 'Stephen F. Austin', lat: 31.6041, lng: -94.6480, division: 'FCS', conference: 'Southland', city: 'Nacogdoches', state: 'TX' },
  { name: 'Texas A&M-Commerce', lat: 33.2279, lng: -95.9132, division: 'FCS', conference: 'Southland', city: 'Commerce', state: 'TX' },

  // Ivy League (8)
  { name: 'Brown', lat: 41.8268, lng: -71.4025, division: 'FCS', conference: 'Ivy League', city: 'Providence', state: 'RI' },
  { name: 'Columbia', lat: 40.8075, lng: -73.9626, division: 'FCS', conference: 'Ivy League', city: 'New York', state: 'NY' },
  { name: 'Cornell', lat: 42.4534, lng: -76.4735, division: 'FCS', conference: 'Ivy League', city: 'Ithaca', state: 'NY' },
  { name: 'Dartmouth', lat: 43.7044, lng: -72.2887, division: 'FCS', conference: 'Ivy League', city: 'Hanover', state: 'NH' },
  { name: 'Harvard', lat: 42.3770, lng: -71.1167, division: 'FCS', conference: 'Ivy League', city: 'Cambridge', state: 'MA' },
  { name: 'Penn', lat: 39.9522, lng: -75.1932, division: 'FCS', conference: 'Ivy League', city: 'Philadelphia', state: 'PA' },
  { name: 'Princeton', lat: 40.3440, lng: -74.6514, division: 'FCS', conference: 'Ivy League', city: 'Princeton', state: 'NJ' },
  { name: 'Yale', lat: 41.3163, lng: -72.9223, division: 'FCS', conference: 'Ivy League', city: 'New Haven', state: 'CT' },

  // Patriot League (7)
  { name: 'Bucknell', lat: 40.9546, lng: -76.8826, division: 'FCS', conference: 'Patriot League', city: 'Lewisburg', state: 'PA' },
  { name: 'Colgate', lat: 42.8168, lng: -75.5374, division: 'FCS', conference: 'Patriot League', city: 'Hamilton', state: 'NY' },
  { name: 'Fordham', lat: 40.8614, lng: -73.8855, division: 'FCS', conference: 'Patriot League', city: 'Bronx', state: 'NY' },
  { name: 'Georgetown', lat: 38.9076, lng: -77.0723, division: 'FCS', conference: 'Patriot League', city: 'Washington', state: 'DC' },
  { name: 'Holy Cross', lat: 42.2366, lng: -71.8081, division: 'FCS', conference: 'Patriot League', city: 'Worcester', state: 'MA' },
  { name: 'Lafayette', lat: 40.6977, lng: -75.2090, division: 'FCS', conference: 'Patriot League', city: 'Easton', state: 'PA' },
  { name: 'Lehigh', lat: 40.6051, lng: -75.3779, division: 'FCS', conference: 'Patriot League', city: 'Bethlehem', state: 'PA' },

  // SWAC (12)
  { name: 'Alabama A&M', lat: 34.7834, lng: -86.5686, division: 'FCS', conference: 'SWAC', city: 'Huntsville', state: 'AL' },
  { name: 'Alabama State', lat: 32.3643, lng: -86.2956, division: 'FCS', conference: 'SWAC', city: 'Montgomery', state: 'AL' },
  { name: 'Alcorn State', lat: 31.8770, lng: -91.0496, division: 'FCS', conference: 'SWAC', city: 'Lorman', state: 'MS' },
  { name: 'Arkansas-Pine Bluff', lat: 34.2286, lng: -92.0015, division: 'FCS', conference: 'SWAC', city: 'Pine Bluff', state: 'AR' },
  { name: 'Bethune-Cookman', lat: 29.1945, lng: -81.0495, division: 'FCS', conference: 'SWAC', city: 'Daytona Beach', state: 'FL' },
  { name: 'Florida A&M', lat: 30.4249, lng: -84.2838, division: 'FCS', conference: 'SWAC', city: 'Tallahassee', state: 'FL' },
  { name: 'Grambling State', lat: 32.5263, lng: -92.7143, division: 'FCS', conference: 'SWAC', city: 'Grambling', state: 'LA' },
  { name: 'Jackson State', lat: 32.2988, lng: -90.2048, division: 'FCS', conference: 'SWAC', city: 'Jackson', state: 'MS' },
  { name: 'Mississippi Valley State', lat: 33.4932, lng: -90.3132, division: 'FCS', conference: 'SWAC', city: 'Itta Bena', state: 'MS' },
  { name: 'Prairie View A&M', lat: 30.0936, lng: -95.9874, division: 'FCS', conference: 'SWAC', city: 'Prairie View', state: 'TX' },
  { name: 'Southern', lat: 30.5248, lng: -91.1871, division: 'FCS', conference: 'SWAC', city: 'Baton Rouge', state: 'LA' },
  { name: 'Texas Southern', lat: 29.7226, lng: -95.3567, division: 'FCS', conference: 'SWAC', city: 'Houston', state: 'TX' },

  // Pioneer League (10)
  { name: 'Butler', lat: 39.8407, lng: -86.1696, division: 'FCS', conference: 'Pioneer League', city: 'Indianapolis', state: 'IN' },
  { name: 'Davidson', lat: 35.5004, lng: -80.8434, division: 'FCS', conference: 'Pioneer League', city: 'Davidson', state: 'NC' },
  { name: 'Dayton', lat: 39.7402, lng: -84.1797, division: 'FCS', conference: 'Pioneer League', city: 'Dayton', state: 'OH' },
  { name: 'Drake', lat: 41.6037, lng: -93.6518, division: 'FCS', conference: 'Pioneer League', city: 'Des Moines', state: 'IA' },
  { name: 'Marist', lat: 41.7276, lng: -73.9355, division: 'FCS', conference: 'Pioneer League', city: 'Poughkeepsie', state: 'NY' },
  { name: 'Morehead State', lat: 38.1867, lng: -83.4324, division: 'FCS', conference: 'Pioneer League', city: 'Morehead', state: 'KY' },
  { name: 'Presbyterian', lat: 34.1858, lng: -81.8810, division: 'FCS', conference: 'Pioneer League', city: 'Clinton', state: 'SC' },
  { name: 'San Diego', lat: 32.7711, lng: -117.1928, division: 'FCS', conference: 'Pioneer League', city: 'San Diego', state: 'CA' },
  { name: 'Stetson', lat: 29.0381, lng: -81.3049, division: 'FCS', conference: 'Pioneer League', city: 'DeLand', state: 'FL' },
  { name: 'Valparaiso', lat: 41.4652, lng: -87.0446, division: 'FCS', conference: 'Pioneer League', city: 'Valparaiso', state: 'IN' },

  // ============================================
  // D2 SCHOOLS (125 schools)
  // ============================================

  // GLIAC (13)
  { name: 'Davenport', lat: 42.9399, lng: -85.6042, division: 'D2', conference: 'GLIAC', city: 'Grand Rapids', state: 'MI' },
  { name: 'Ferris State', lat: 43.5921, lng: -85.4918, division: 'D2', conference: 'GLIAC', city: 'Big Rapids', state: 'MI' },
  { name: 'Grand Valley State', lat: 42.9634, lng: -85.8903, division: 'D2', conference: 'GLIAC', city: 'Allendale', state: 'MI' },
  { name: 'Michigan Tech', lat: 47.1211, lng: -88.5694, division: 'D2', conference: 'GLIAC', city: 'Houghton', state: 'MI' },
  { name: 'Northern Michigan', lat: 46.5575, lng: -87.4023, division: 'D2', conference: 'GLIAC', city: 'Marquette', state: 'MI' },
  { name: 'Northwood', lat: 43.6045, lng: -84.2300, division: 'D2', conference: 'GLIAC', city: 'Midland', state: 'MI' },
  { name: 'Saginaw Valley State', lat: 43.5162, lng: -83.9593, division: 'D2', conference: 'GLIAC', city: 'University Center', state: 'MI' },
  { name: 'Wayne State (MI)', lat: 42.3586, lng: -83.0676, division: 'D2', conference: 'GLIAC', city: 'Detroit', state: 'MI' },
  { name: 'Wisconsin-Parkside', lat: 42.5932, lng: -87.8508, division: 'D2', conference: 'GLIAC', city: 'Kenosha', state: 'WI' },

  // GLVC (10)
  { name: 'Indianapolis', lat: 39.7860, lng: -86.1840, division: 'D2', conference: 'GLVC', city: 'Indianapolis', state: 'IN' },
  { name: 'McKendree', lat: 38.6184, lng: -89.9853, division: 'D2', conference: 'GLVC', city: 'Lebanon', state: 'IL' },
  { name: 'Maryville', lat: 38.7234, lng: -90.3782, division: 'D2', conference: 'GLVC', city: 'St. Louis', state: 'MO' },
  { name: 'Missouri S&T', lat: 37.9518, lng: -91.7725, division: 'D2', conference: 'GLVC', city: 'Rolla', state: 'MO' },
  { name: 'Southwest Baptist', lat: 37.0134, lng: -93.3982, division: 'D2', conference: 'GLVC', city: 'Bolivar', state: 'MO' },
  { name: 'Truman State', lat: 40.1907, lng: -92.5830, division: 'D2', conference: 'GLVC', city: 'Kirksville', state: 'MO' },
  { name: 'William Jewell', lat: 39.3103, lng: -94.4252, division: 'D2', conference: 'GLVC', city: 'Liberty', state: 'MO' },

  // GAC (12)
  { name: 'Arkansas Tech', lat: 35.2904, lng: -93.1346, division: 'D2', conference: 'GAC', city: 'Russellville', state: 'AR' },
  { name: 'East Central', lat: 34.7604, lng: -96.6740, division: 'D2', conference: 'GAC', city: 'Ada', state: 'OK' },
  { name: 'Harding', lat: 35.2457, lng: -91.7346, division: 'D2', conference: 'GAC', city: 'Searcy', state: 'AR' },
  { name: 'Henderson State', lat: 34.1129, lng: -93.0559, division: 'D2', conference: 'GAC', city: 'Arkadelphia', state: 'AR' },
  { name: 'Northwestern Oklahoma', lat: 36.7093, lng: -99.0045, division: 'D2', conference: 'GAC', city: 'Alva', state: 'OK' },
  { name: 'Oklahoma Baptist', lat: 35.2159, lng: -97.4411, division: 'D2', conference: 'GAC', city: 'Shawnee', state: 'OK' },
  { name: 'Ouachita Baptist', lat: 34.1189, lng: -93.0564, division: 'D2', conference: 'GAC', city: 'Arkadelphia', state: 'AR' },
  { name: 'Southeastern Oklahoma', lat: 34.0256, lng: -94.7666, division: 'D2', conference: 'GAC', city: 'Durant', state: 'OK' },
  { name: 'Southern Arkansas', lat: 33.2110, lng: -93.2232, division: 'D2', conference: 'GAC', city: 'Magnolia', state: 'AR' },
  { name: 'Southern Nazarene', lat: 35.3696, lng: -97.5195, division: 'D2', conference: 'GAC', city: 'Bethany', state: 'OK' },
  { name: 'Southwestern Oklahoma', lat: 35.3943, lng: -99.3931, division: 'D2', conference: 'GAC', city: 'Weatherford', state: 'OK' },

  // LSC (14)
  { name: 'Angelo State', lat: 31.4471, lng: -100.4518, division: 'D2', conference: 'LSC', city: 'San Angelo', state: 'TX' },
  { name: 'Eastern New Mexico', lat: 34.1803, lng: -103.3344, division: 'D2', conference: 'LSC', city: 'Portales', state: 'NM' },
  { name: 'Midwestern State', lat: 33.8788, lng: -98.5127, division: 'D2', conference: 'LSC', city: 'Wichita Falls', state: 'TX' },
  { name: 'Simon Fraser', lat: 49.2781, lng: -122.9199, division: 'D2', conference: 'LSC', city: 'Burnaby', state: 'BC' },
  { name: 'Texas A&M-Kingsville', lat: 27.5158, lng: -97.8803, division: 'D2', conference: 'LSC', city: 'Kingsville', state: 'TX' },
  { name: 'Texas-Permian Basin', lat: 31.9091, lng: -102.3395, division: 'D2', conference: 'LSC', city: 'Odessa', state: 'TX' },
  { name: 'UT Tyler', lat: 32.3191, lng: -95.2510, division: 'D2', conference: 'LSC', city: 'Tyler', state: 'TX' },
  { name: 'West Texas A&M', lat: 34.9830, lng: -101.9200, division: 'D2', conference: 'LSC', city: 'Canyon', state: 'TX' },
  { name: 'Western New Mexico', lat: 32.7759, lng: -108.2811, division: 'D2', conference: 'LSC', city: 'Silver City', state: 'NM' },
  { name: 'Western Oregon', lat: 44.8512, lng: -123.2268, division: 'D2', conference: 'LSC', city: 'Monmouth', state: 'OR' },

  // PSAC (18)
  { name: 'Bloomsburg', lat: 41.0045, lng: -76.4549, division: 'D2', conference: 'PSAC', city: 'Bloomsburg', state: 'PA' },
  { name: 'California (PA)', lat: 40.0634, lng: -79.8934, division: 'D2', conference: 'PSAC', city: 'California', state: 'PA' },
  { name: 'Clarion', lat: 41.2145, lng: -79.3828, division: 'D2', conference: 'PSAC', city: 'Clarion', state: 'PA' },
  { name: 'East Stroudsburg', lat: 40.9979, lng: -75.1799, division: 'D2', conference: 'PSAC', city: 'East Stroudsburg', state: 'PA' },
  { name: 'Edinboro', lat: 41.8748, lng: -80.1334, division: 'D2', conference: 'PSAC', city: 'Edinboro', state: 'PA' },
  { name: 'Gannon', lat: 42.1292, lng: -80.0851, division: 'D2', conference: 'PSAC', city: 'Erie', state: 'PA' },
  { name: 'IUP', lat: 40.6184, lng: -79.1528, division: 'D2', conference: 'PSAC', city: 'Indiana', state: 'PA' },
  { name: 'Kutztown', lat: 40.5090, lng: -75.7849, division: 'D2', conference: 'PSAC', city: 'Kutztown', state: 'PA' },
  { name: 'Lock Haven', lat: 41.1348, lng: -77.4567, division: 'D2', conference: 'PSAC', city: 'Lock Haven', state: 'PA' },
  { name: 'Mercyhurst', lat: 42.0959, lng: -80.0907, division: 'D2', conference: 'PSAC', city: 'Erie', state: 'PA' },
  { name: 'Millersville', lat: 39.9973, lng: -76.3534, division: 'D2', conference: 'PSAC', city: 'Millersville', state: 'PA' },
  { name: 'Seton Hill', lat: 40.2404, lng: -79.5408, division: 'D2', conference: 'PSAC', city: 'Greensburg', state: 'PA' },
  { name: 'Shepherd', lat: 39.4362, lng: -77.8030, division: 'D2', conference: 'PSAC', city: 'Shepherdstown', state: 'WV' },
  { name: 'Shippensburg', lat: 40.0512, lng: -77.5218, division: 'D2', conference: 'PSAC', city: 'Shippensburg', state: 'PA' },
  { name: 'Slippery Rock', lat: 41.0648, lng: -80.0565, division: 'D2', conference: 'PSAC', city: 'Slippery Rock', state: 'PA' },
  { name: 'West Chester', lat: 39.9512, lng: -75.6018, division: 'D2', conference: 'PSAC', city: 'West Chester', state: 'PA' },

  // SAC (10)
  { name: 'Anderson', lat: 34.5234, lng: -82.7101, division: 'D2', conference: 'SAC', city: 'Anderson', state: 'SC' },
  { name: 'Carson-Newman', lat: 36.1241, lng: -83.4808, division: 'D2', conference: 'SAC', city: 'Jefferson City', state: 'TN' },
  { name: 'Catawba', lat: 35.7015, lng: -80.4604, division: 'D2', conference: 'SAC', city: 'Salisbury', state: 'NC' },
  { name: 'Emory & Henry', lat: 36.7554, lng: -81.8368, division: 'D2', conference: 'SAC', city: 'Emory', state: 'VA' },
  { name: 'Lenoir-Rhyne', lat: 35.7407, lng: -81.3346, division: 'D2', conference: 'SAC', city: 'Hickory', state: 'NC' },
  { name: 'Mars Hill', lat: 35.8267, lng: -82.5490, division: 'D2', conference: 'SAC', city: 'Mars Hill', state: 'NC' },
  { name: 'Newberry', lat: 34.2746, lng: -81.6151, division: 'D2', conference: 'SAC', city: 'Newberry', state: 'SC' },
  { name: 'Tusculum', lat: 36.1740, lng: -82.7571, division: 'D2', conference: 'SAC', city: 'Greeneville', state: 'TN' },
  { name: 'Wingate', lat: 35.0090, lng: -80.4396, division: 'D2', conference: 'SAC', city: 'Wingate', state: 'NC' },

  // GSC (14)
  { name: 'Delta State', lat: 33.3935, lng: -90.7279, division: 'D2', conference: 'GSC', city: 'Cleveland', state: 'MS' },
  { name: 'Florida Tech', lat: 28.0660, lng: -80.6227, division: 'D2', conference: 'GSC', city: 'Melbourne', state: 'FL' },
  { name: 'Mississippi College', lat: 32.3527, lng: -90.1498, division: 'D2', conference: 'GSC', city: 'Clinton', state: 'MS' },
  { name: 'North Greenville', lat: 35.0637, lng: -82.4171, division: 'D2', conference: 'GSC', city: 'Tigerville', state: 'SC' },
  { name: 'Shorter', lat: 34.2798, lng: -85.1677, division: 'D2', conference: 'GSC', city: 'Rome', state: 'GA' },
  { name: 'Valdosta State', lat: 30.8474, lng: -83.2890, division: 'D2', conference: 'GSC', city: 'Valdosta', state: 'GA' },
  { name: 'West Alabama', lat: 32.6355, lng: -88.1881, division: 'D2', conference: 'GSC', city: 'Livingston', state: 'AL' },
  { name: 'West Florida', lat: 30.5470, lng: -87.2186, division: 'D2', conference: 'GSC', city: 'Pensacola', state: 'FL' },
  { name: 'West Georgia', lat: 33.5829, lng: -85.0867, division: 'D2', conference: 'GSC', city: 'Carrollton', state: 'GA' },

  // NE10 (10)
  { name: 'Assumption', lat: 42.2890, lng: -71.7968, division: 'D2', conference: 'NE10', city: 'Worcester', state: 'MA' },
  { name: 'Bentley', lat: 42.3876, lng: -71.2217, division: 'D2', conference: 'NE10', city: 'Waltham', state: 'MA' },
  { name: 'New Haven', lat: 41.2920, lng: -72.9654, division: 'D2', conference: 'NE10', city: 'West Haven', state: 'CT' },
  { name: 'Pace', lat: 41.0401, lng: -73.7010, division: 'D2', conference: 'NE10', city: 'Pleasantville', state: 'NY' },
  { name: 'Saint Anselm', lat: 42.9918, lng: -71.4624, division: 'D2', conference: 'NE10', city: 'Manchester', state: 'NH' },
  { name: 'Southern Connecticut State', lat: 41.3332, lng: -72.9501, division: 'D2', conference: 'NE10', city: 'New Haven', state: 'CT' },
  { name: 'Stonehill', lat: 42.1065, lng: -71.1043, division: 'D2', conference: 'NE10', city: 'Easton', state: 'MA' },

  // RMAC (12)
  { name: 'Adams State', lat: 37.4676, lng: -105.8670, division: 'D2', conference: 'RMAC', city: 'Alamosa', state: 'CO' },
  { name: 'Black Hills State', lat: 44.3745, lng: -103.7382, division: 'D2', conference: 'RMAC', city: 'Spearfish', state: 'SD' },
  { name: 'Chadron State', lat: 42.8275, lng: -103.0001, division: 'D2', conference: 'RMAC', city: 'Chadron', state: 'NE' },
  { name: 'Colorado Mesa', lat: 39.0828, lng: -108.5507, division: 'D2', conference: 'RMAC', city: 'Grand Junction', state: 'CO' },
  { name: 'Colorado Mines', lat: 39.7486, lng: -105.2222, division: 'D2', conference: 'RMAC', city: 'Golden', state: 'CO' },
  { name: 'Colorado State-Pueblo', lat: 38.2854, lng: -104.6091, division: 'D2', conference: 'RMAC', city: 'Pueblo', state: 'CO' },
  { name: 'Fort Lewis', lat: 37.2753, lng: -107.8801, division: 'D2', conference: 'RMAC', city: 'Durango', state: 'CO' },
  { name: 'New Mexico Highlands', lat: 35.6050, lng: -105.2210, division: 'D2', conference: 'RMAC', city: 'Las Vegas', state: 'NM' },
  { name: 'South Dakota Mines', lat: 44.0698, lng: -103.2068, division: 'D2', conference: 'RMAC', city: 'Rapid City', state: 'SD' },
  { name: 'Western Colorado', lat: 38.5335, lng: -106.9253, division: 'D2', conference: 'RMAC', city: 'Gunnison', state: 'CO' },
]

// Helper function to get schools by division
export function getSchoolsByDivision(division: 'FBS' | 'FCS' | 'D2'): SchoolCoordinate[] {
  return schoolCoordinates.filter(school => school.division === division)
}

// Helper function to get schools by conference
export function getSchoolsByConference(conference: string): SchoolCoordinate[] {
  return schoolCoordinates.filter(school => school.conference === conference)
}

// Helper function to get schools by state
export function getSchoolsByState(state: string): SchoolCoordinate[] {
  return schoolCoordinates.filter(school => school.state === state)
}

// Get all unique conferences
export function getAllConferences(): string[] {
  return [...new Set(schoolCoordinates.map(school => school.conference))].sort()
}

// Summary
export const schoolCounts = {
  FBS: schoolCoordinates.filter(s => s.division === 'FBS').length,
  FCS: schoolCoordinates.filter(s => s.division === 'FCS').length,
  D2: schoolCoordinates.filter(s => s.division === 'D2').length,
  total: schoolCoordinates.length,
}
