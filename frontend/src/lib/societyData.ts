// Master Plan Society Data - Exact High-Definition Model matching spacer.land SpDemo layout

export interface SocietyPlot {
  id: number;
  plotNumber: number;
  name: string;
  zone: 'RESIDENTIAL' | 'COMMERCIAL' | 'VILLA_ESTATE' | 'CORNER_PRIME';
  zoneLabel: string;
  areaSqFt: number;
  areaSqM: number;
  areaM2Text: string;
  areaFt2Text: string;
  dimensions: string;
  dimTop?: string;
  dimBottom?: string;
  dimLeft?: string;
  dimRight?: string;
  facing: 'North' | 'South' | 'East' | 'West' | 'North-East' | 'North-West';
  roadWidth: string;
  price: number;
  status: 'AVAILABLE' | 'BOOKED' | 'RESERVED';
  description: string;
  // Precise vector coordinates in 1920 x 912 space
  x: number;
  y: number;
  w: number;
  h: number;
  rotation?: number;
}

export interface SpecialZone {
  id: string;
  name: string;
  zone: string;
  area: string;
  description: string;
  status: string;
  road: string;
  polygon: string;
  labelX: number;
  labelY: number;
}

export const PROJECT_DETAILS = {
  name: 'DEMO PROJECT',
  tagline: 'Interactive Master Plan & Smart Plot Viewer',
  developer: 'Spacer Township Infra Ltd.',
  location: 'Sector 42, Darapura Boulevard Avenue',
  totalPlots: 191,
  availablePlots: 142,
  bookedPlots: 35,
  reservedPlots: 14,
  totalArea: '125 Acres',
  acres: '125 Acres',
  masterRoadWidth: '12 MT. WIDE ROAD',
  reraNumber: 'PR/GJ/VADODARA/PADRA/RAA09876/010126',
  phone: '+91 98765 43210',
  whatsappNumber: '919876543210',
  googleMapsUrl: 'https://maps.google.com/?q=Darapura,Vadodara',
  amenities: [
    { title: 'Clubhouse & Swimming Pool', desc: 'Luxury modern clubhouse with glass pavilion and infinity pool' },
    { title: 'Landscaped Central Park', desc: 'Lush green township common plot with children play arena' },
    { title: '12m & 9m Asphalt Avenues', desc: 'Wide internal roads with underground concealed drainage' },
    { title: '24/7 Security & CCTV', desc: 'Gated society entrance with RFID access and surveillance' },
  ],
  landmarks: [
    { name: 'Shri Chetan Hanumanji Mandir', distance: '0.4 km', time: '2 mins' },
    { name: 'Balaji Hanumanji Temple', distance: '1.2 km', time: '4 mins' },
    { name: 'Vadodara - Padra State Highway', distance: '2.5 km', time: '6 mins' },
    { name: 'Darapura Cross Roads', distance: '0.8 km', time: '3 mins' },
  ],
  gallery: [
    { title: 'Grand Entrance Boulevard', subtitle: '12 MT. wide palm-lined avenue', src: '/satellite_clean.png', category: 'Infrastructure' },
    { title: 'Clubhouse & Pool Pavilion', subtitle: 'Modern glass architecture with infinity swimming pool', src: '/satellite_clean.png', category: 'Amenities' },
    { title: 'Lush Green Common Plot', subtitle: 'Central landscaped township garden and play park', src: '/satellite_clean.png', category: 'Parks' },
  ],
};

export const SPECIAL_ZONES: SpecialZone[] = [
  {
    id: 'COMMON_PLOT',
    name: 'COMMON PLOT',
    zone: 'COMMON',
    area: '19,500 sq.ft',
    description: 'Central landscaped township garden, children play park, outdoor gym and community gazebo.',
    status: 'COMMUNITY AMENITY',
    road: '7.5 MT. ROAD',
    polygon: '1040,520 1175,520 1175,710 1040,710',
    labelX: 1107,
    labelY: 615,
  },
  {
    id: 'CLUBHOUSE',
    name: 'CLUBHOUSE & POOL',
    zone: 'AMENITY',
    area: '9,200 sq.ft',
    description: 'Luxury modern clubhouse with glass pavilion architecture, infinity pool, fitness center and party lawn.',
    status: 'COMPLETED & OPERATIONAL',
    road: 'INTERNAL PROMENADE',
    polygon: '1095,112 1170,112 1170,240 1095,240',
    labelX: 1132,
    labelY: 176,
  },
];

// Generate all master plan plots with razor-sharp vector coordinates matching spacer.land SpDemo
export function generateSocietyPlots(): SocietyPlot[] {
  const plots: SocietyPlot[] = [];

  // ==========================================
  // 1. TOP HORIZONTAL SECTION (Plots 59-66 above Road 1)
  // ==========================================
  const topRowPlots = [
    { num: 59, x: 928, w: 20 },
    { num: 60, x: 949, w: 20 },
    { num: 61, x: 970, w: 20 },
    { num: 62, x: 991, w: 20 },
    { num: 63, x: 1012, w: 20 },
    { num: 64, x: 1033, w: 20 },
    { num: 65, x: 1054, w: 20 },
    { num: 66, x: 1075, w: 20 },
  ];
  topRowPlots.forEach((p, idx) => {
    plots.push({
      id: p.num,
      plotNumber: p.num,
      name: `Plot #${p.num}`,
      zone: 'RESIDENTIAL',
      zoneLabel: 'North Amenity Row',
      areaSqFt: 1800,
      areaSqM: 167.2,
      areaM2Text: '167.2 m²',
      areaFt2Text: '1,800.0 ft²',
      dimensions: '30 ft x 60 ft',
      dimTop: '18.28 m',
      dimBottom: '18.28 m',
      dimLeft: '9.14 m',
      dimRight: '9.14 m',
      facing: 'North',
      roadWidth: '7.5 MT. WIDE ROAD',
      price: 3960000,
      status: p.num % 5 === 0 ? 'BOOKED' : 'AVAILABLE',
      description: 'North-facing residential parcel near the grand clubhouse and swimming pool.',
      x: p.x,
      y: 112,
      w: p.w,
      h: 26,
    });
  });

  // ==========================================
  // 2. CENTRAL BLOCK 1 (Plots 74-69 and 75-82)
  // ==========================================
  const block1Top = [
    { num: 74, x: 928, w: 26 },
    { num: 73, x: 955, w: 26 },
    { num: 72, x: 982, w: 26 },
    { num: 71, x: 1009, w: 26 },
    { num: 70, x: 1036, w: 26 },
    { num: 69, x: 1063, w: 26 },
  ];
  block1Top.forEach((p) => {
    plots.push({
      id: p.num,
      plotNumber: p.num,
      name: `Plot #${p.num}`,
      zone: 'RESIDENTIAL',
      zoneLabel: 'Clubhouse View Block',
      areaSqFt: 1950,
      areaSqM: 181.2,
      areaM2Text: '181.2 m²',
      areaFt2Text: '1,950.0 ft²',
      dimensions: '30 ft x 65 ft',
      dimTop: '19.81 m',
      dimBottom: '19.81 m',
      dimLeft: '9.14 m',
      dimRight: '9.14 m',
      facing: 'South',
      roadWidth: '7.5 MT. WIDE ROAD',
      price: 4290000,
      status: 'AVAILABLE',
      description: 'Prime villa plot directly fronting 7.5 MT. wide internal lane.',
      x: p.x,
      y: 154,
      w: p.w,
      h: 27,
    });
  });

  const block1Bottom = [
    { num: 75, x: 928, w: 20 },
    { num: 76, x: 949, w: 20 },
    { num: 77, x: 970, w: 20 },
    { num: 78, x: 991, w: 20 },
    { num: 79, x: 1012, w: 20 },
    { num: 80, x: 1033, w: 20 },
    { num: 81, x: 1054, w: 20 },
    { num: 82, x: 1075, w: 20 },
  ];
  block1Bottom.forEach((p) => {
    plots.push({
      id: p.num,
      plotNumber: p.num,
      name: `Plot #${p.num}`,
      zone: 'RESIDENTIAL',
      zoneLabel: 'Clubhouse View Block',
      areaSqFt: 1800,
      areaSqM: 167.2,
      areaM2Text: '167.2 m²',
      areaFt2Text: '1,800.0 ft²',
      dimensions: '30 ft x 60 ft',
      dimTop: '18.28 m',
      dimBottom: '18.28 m',
      dimLeft: '9.14 m',
      dimRight: '9.14 m',
      facing: 'North',
      roadWidth: '7.5 MT. WIDE ROAD',
      price: 3960000,
      status: p.num % 4 === 0 ? 'RESERVED' : 'AVAILABLE',
      description: 'North-facing residential plot along wide avenue.',
      x: p.x,
      y: 183,
      w: p.w,
      h: 27,
    });
  });

  // ==========================================
  // 3. CENTRAL BLOCK 2 (Plots 90-83 and 91-98)
  // ==========================================
  const block2Top = [
    { num: 90, x: 928, w: 20 },
    { num: 89, x: 949, w: 20 },
    { num: 88, x: 970, w: 20 },
    { num: 87, x: 991, w: 20 },
    { num: 86, x: 1012, w: 20 },
    { num: 85, x: 1033, w: 20 },
    { num: 84, x: 1054, w: 20 },
    { num: 83, x: 1075, w: 20 },
  ];
  block2Top.forEach((p) => {
    plots.push({
      id: p.num,
      plotNumber: p.num,
      name: `Plot #${p.num}`,
      zone: 'RESIDENTIAL',
      zoneLabel: 'Central Promenade Block',
      areaSqFt: 1800,
      areaSqM: 167.2,
      areaM2Text: '167.2 m²',
      areaFt2Text: '1,800.0 ft²',
      dimensions: '30 ft x 60 ft',
      dimTop: '18.28 m',
      dimBottom: '18.28 m',
      dimLeft: '9.14 m',
      dimRight: '9.14 m',
      facing: 'South',
      roadWidth: '7.5 MT. WIDE ROAD',
      price: 3960000,
      status: 'AVAILABLE',
      description: 'Spacious rectangular plot with east-west ventilation.',
      x: p.x,
      y: 228,
      w: p.w,
      h: 27,
    });
  });

  const block2Bottom = [
    { num: 91, x: 928, w: 20 },
    { num: 92, x: 949, w: 20 },
    { num: 93, x: 970, w: 20 },
    { num: 94, x: 991, w: 20 },
    { num: 95, x: 1012, w: 20 },
    { num: 96, x: 1033, w: 20 },
    { num: 97, x: 1054, w: 20 },
    { num: 98, x: 1075, w: 20 },
  ];
  block2Bottom.forEach((p) => {
    plots.push({
      id: p.num,
      plotNumber: p.num,
      name: `Plot #${p.num}`,
      zone: 'RESIDENTIAL',
      zoneLabel: 'Central Promenade Block',
      areaSqFt: 1800,
      areaSqM: 167.2,
      areaM2Text: '167.2 m²',
      areaFt2Text: '1,800.0 ft²',
      dimensions: '30 ft x 60 ft',
      dimTop: '18.28 m',
      dimBottom: '18.28 m',
      dimLeft: '9.14 m',
      dimRight: '9.14 m',
      facing: 'North',
      roadWidth: '7.5 MT. WIDE ROAD',
      price: 3960000,
      status: 'AVAILABLE',
      description: 'Direct road access plot ideal for standard family duplex.',
      x: p.x,
      y: 257,
      w: p.w,
      h: 27,
    });
  });

  // ==========================================
  // 4. CENTRAL BLOCK 3 (Plots 106-99 and 107-111)
  // ==========================================
  const block3Top = [
    { num: 106, x: 928, w: 21 },
    { num: 105, x: 950, w: 21 },
    { num: 104, x: 972, w: 21 },
    { num: 103, x: 994, w: 21 },
    { num: 102, x: 1016, w: 21 },
    { num: 101, x: 1038, w: 21 },
    { num: 100, x: 1060, w: 21 },
    { num: 99, x: 1082, w: 21 },
  ];
  block3Top.forEach((p) => {
    plots.push({
      id: p.num,
      plotNumber: p.num,
      name: `Plot #${p.num}`,
      zone: 'RESIDENTIAL',
      zoneLabel: 'Midtown Avenue',
      areaSqFt: 1850,
      areaSqM: 171.9,
      areaM2Text: '171.9 m²',
      areaFt2Text: '1,850.0 ft²',
      dimensions: '30 ft x 61 ft',
      dimTop: '18.59 m',
      dimBottom: '18.59 m',
      dimLeft: '9.14 m',
      dimRight: '9.14 m',
      facing: 'South',
      roadWidth: '7.5 MT. WIDE ROAD',
      price: 4070000,
      status: 'AVAILABLE',
      description: 'Excellent residential plot located close to inner garden access.',
      x: p.x,
      y: 302,
      w: p.w,
      h: 29,
    });
  });

  const block3Bottom = [
    { num: 107, x: 928, w: 29 },
    { num: 108, x: 958, w: 29 },
    { num: 109, x: 988, w: 29 },
    { num: 110, x: 1018, w: 29 },
    { num: 111, x: 1048, w: 29 },
  ];
  block3Bottom.forEach((p) => {
    plots.push({
      id: p.num,
      plotNumber: p.num,
      name: `Plot #${p.num}`,
      zone: 'RESIDENTIAL',
      zoneLabel: 'Midtown Avenue',
      areaSqFt: 2100,
      areaSqM: 195.1,
      areaM2Text: '195.1 m²',
      areaFt2Text: '2,100.0 ft²',
      dimensions: '35 ft x 60 ft',
      dimTop: '18.28 m',
      dimBottom: '18.28 m',
      dimLeft: '10.66 m',
      dimRight: '10.66 m',
      facing: 'North',
      roadWidth: '7.5 MT. WIDE ROAD',
      price: 4620000,
      status: 'AVAILABLE',
      description: 'Generously proportioned villa parcel.',
      x: p.x,
      y: 333,
      w: p.w,
      h: 31,
    });
  });

  // ==========================================
  // 5. CENTRAL BLOCK 4 (Plots 116-112)
  // ==========================================
  const block4 = [
    { num: 116, x: 928, w: 24 },
    { num: 115, x: 953, w: 24 },
    { num: 114, x: 978, w: 24 },
    { num: 113, x: 1003, w: 24 },
    { num: 112, x: 1028, w: 24 },
  ];
  block4.forEach((p) => {
    plots.push({
      id: p.num,
      plotNumber: p.num,
      name: `Plot #${p.num}`,
      zone: 'RESIDENTIAL',
      zoneLabel: 'Midtown Avenue',
      areaSqFt: 2000,
      areaSqM: 185.8,
      areaM2Text: '185.8 m²',
      areaFt2Text: '2,000.0 ft²',
      dimensions: '32 ft x 62 ft',
      dimTop: '18.89 m',
      dimBottom: '18.89 m',
      dimLeft: '9.75 m',
      dimRight: '9.75 m',
      facing: 'South',
      roadWidth: '7.5 MT. WIDE ROAD',
      price: 4400000,
      status: 'AVAILABLE',
      description: 'Quiet enclave plot fronting asphalt road.',
      x: p.x,
      y: 382,
      w: p.w,
      h: 32,
    });
  });

  // ==========================================
  // 6. LOWER BLOCK (Plots 121-117 and 122-127) - Directly across from Plot 176..179
  // ==========================================
  const block5Top = [
    { num: 121, x: 932, w: 26 },
    { num: 120, x: 959, w: 26 },
    { num: 119, x: 986, w: 26 },
    { num: 118, x: 1013, w: 26 },
    { num: 117, x: 1040, w: 28 },
  ];
  block5Top.forEach((p) => {
    plots.push({
      id: p.num,
      plotNumber: p.num,
      name: `Plot #${p.num}`,
      zone: 'RESIDENTIAL',
      zoneLabel: 'South Garden Enclave',
      areaSqFt: 2200,
      areaSqM: 204.4,
      areaM2Text: '204.4 m²',
      areaFt2Text: '2,200.0 ft²',
      dimensions: '35 ft x 63 ft',
      dimTop: '19.20 m',
      dimBottom: '19.20 m',
      dimLeft: '10.66 m',
      dimRight: '10.66 m',
      facing: 'South',
      roadWidth: '7.5 MT. WIDE ROAD',
      price: 4840000,
      status: 'AVAILABLE',
      description: 'Desirable plot situated immediately adjacent to Common Plot park greenery.',
      x: p.x,
      y: 432,
      w: p.w,
      h: 32,
    });
  });

  const block5Bottom = [
    { num: 122, x: 932, w: 22 },
    { num: 123, x: 955, w: 22 },
    { num: 124, x: 978, w: 22 },
    { num: 125, x: 1001, w: 22 },
    { num: 126, x: 1024, w: 22 },
    { num: 127, x: 1047, w: 24 },
  ];
  block5Bottom.forEach((p) => {
    plots.push({
      id: p.num,
      plotNumber: p.num,
      name: `Plot #${p.num}`,
      zone: 'RESIDENTIAL',
      zoneLabel: 'South Garden Enclave',
      areaSqFt: 1850,
      areaSqM: 171.9,
      areaM2Text: '171.9 m²',
      areaFt2Text: '1,850.0 ft²',
      dimensions: '30 ft x 61 ft',
      dimTop: '18.59 m',
      dimBottom: '18.59 m',
      dimLeft: '9.14 m',
      dimRight: '9.14 m',
      facing: 'North',
      roadWidth: '7.5 MT. WIDE ROAD',
      price: 4070000,
      status: 'AVAILABLE',
      description: 'North-facing parcel fronting internal road.',
      x: p.x,
      y: 466,
      w: p.w,
      h: 32,
    });
  });

  // ==========================================
  // 7. BOTTOM ROW (Plots 187, 188, 189, 190, 191) - Across from Plot 180
  // ==========================================
  const bottomRowPlots = [
    { num: 187, x: 932, w: 21 },
    { num: 188, x: 1054, w: 21 },
    { num: 189, x: 1076, w: 21 },
    { num: 190, x: 1098, w: 21 },
    { num: 191, x: 1120, w: 21 },
  ];
  // Spread across 932..1035
  const actualBottom = [
    { num: 187, x: 932, w: 21 },
    { num: 188, x: 954, w: 21 },
    { num: 189, x: 976, w: 21 },
    { num: 190, x: 998, w: 21 },
    { num: 191, x: 1020, w: 21 },
  ];
  actualBottom.forEach((p) => {
    plots.push({
      id: p.num,
      plotNumber: p.num,
      name: `Plot #${p.num}`,
      zone: 'RESIDENTIAL',
      zoneLabel: 'Parkside Avenue',
      areaSqFt: 1900,
      areaSqM: 176.5,
      areaM2Text: '176.5 m²',
      areaFt2Text: '1,900.0 ft²',
      dimensions: '30 ft x 63 ft',
      dimTop: '19.20 m',
      dimBottom: '19.20 m',
      dimLeft: '9.14 m',
      dimRight: '9.14 m',
      facing: 'North',
      roadWidth: '7.5 MT. WIDE ROAD',
      price: 4180000,
      status: 'AVAILABLE',
      description: 'Park-fronting parcel located directly across from Common Plot.',
      x: p.x,
      y: 520,
      w: p.w,
      h: 36,
    });
  });

  // Plot 186 & 185 below 187..191
  plots.push({
    id: 186,
    plotNumber: 186,
    name: 'Plot #186',
    zone: 'RESIDENTIAL',
    zoneLabel: 'Common Park Frontage',
    areaSqFt: 3500,
    areaSqM: 325.1,
    areaM2Text: '325.1 m²',
    areaFt2Text: '3,500.0 ft²',
    dimensions: '50 ft x 70 ft',
    dimTop: '21.33 m',
    dimBottom: '21.33 m',
    dimLeft: '15.24 m',
    dimRight: '15.24 m',
    facing: 'West',
    roadWidth: '9 MT. WIDE ROAD',
    price: 7700000,
    status: 'AVAILABLE',
    description: 'Expansive estate plot directly bordering the central Common Plot garden.',
    x: 932,
    y: 560,
    w: 109,
    h: 40,
  });

  plots.push({
    id: 185,
    plotNumber: 185,
    name: 'Plot #185',
    zone: 'RESIDENTIAL',
    zoneLabel: 'Common Park Frontage',
    areaSqFt: 3800,
    areaSqM: 353.0,
    areaM2Text: '353.0 m²',
    areaFt2Text: '3,800.0 ft²',
    dimensions: '50 ft x 76 ft',
    dimTop: '23.16 m',
    dimBottom: '23.16 m',
    dimLeft: '15.24 m',
    dimRight: '15.24 m',
    facing: 'West',
    roadWidth: '9 MT. WIDE ROAD',
    price: 8360000,
    status: 'AVAILABLE',
    description: 'Grand luxury villa plot facing the lush landscaped township green.',
    x: 932,
    y: 604,
    w: 109,
    h: 44,
  });

  // ==========================================
  // 8. LEFT COLUMN 1 (Avenue along 12 MT. WIDE ROAD)
  // ==========================================

  // --- Upper Left (Plots 154 - 149) ---
  const upperLeft = [
    { num: 154, y: 112 },
    { num: 153, y: 128 },
    { num: 152, y: 144 },
    { num: 151, y: 160 },
    { num: 150, y: 176 },
    { num: 149, y: 192 },
  ];
  upperLeft.forEach((p) => {
    plots.push({
      id: p.num,
      plotNumber: p.num,
      name: `Plot #${p.num}`,
      zone: 'RESIDENTIAL',
      zoneLabel: 'West 12m Boulevard',
      areaSqFt: 1800,
      areaSqM: 167.2,
      areaM2Text: '167.2 m²',
      areaFt2Text: '1,800.0 ft²',
      dimensions: '30 ft x 60 ft',
      dimTop: '18.28 m',
      dimBottom: '18.28 m',
      dimLeft: '9.14 m',
      dimRight: '9.14 m',
      facing: 'East',
      roadWidth: '12 MT. WIDE ROAD',
      price: 3960000,
      status: p.num % 3 === 0 ? 'BOOKED' : 'AVAILABLE',
      description: 'Prime villa plot directly fronting the wide 12m boulevard.',
      x: 826,
      y: p.y,
      w: 36,
      h: 15,
    });
  });

  // --- Upper Left Inner (Plots 155 - 159) ---
  const upperLeftInner = [
    { num: 155, y: 128 },
    { num: 156, y: 144 },
    { num: 157, y: 160 },
    { num: 158, y: 176 },
    { num: 159, y: 192 },
  ];
  upperLeftInner.forEach((p) => {
    plots.push({
      id: p.num,
      plotNumber: p.num,
      name: `Plot #${p.num}`,
      zone: 'RESIDENTIAL',
      zoneLabel: 'West Internal Lane',
      areaSqFt: 1750,
      areaSqM: 162.6,
      areaM2Text: '162.6 m²',
      areaFt2Text: '1,750.0 ft²',
      dimensions: '30 ft x 58 ft',
      dimTop: '17.68 m',
      dimBottom: '17.68 m',
      dimLeft: '9.14 m',
      dimRight: '9.14 m',
      facing: 'West',
      roadWidth: '9.00 MT. WIDE ROAD',
      price: 3675000,
      status: 'AVAILABLE',
      description: 'Quiet inner lane villa plot with morning orientation.',
      x: 864,
      y: p.y,
      w: 36,
      h: 15,
    });
  });

  // --- Middle Left Outer (Plots 160 - 169) ---
  const middleLeftOuter = [
    { num: 160, y: 226 },
    { num: 161, y: 242 },
    { num: 162, y: 258 },
    { num: 163, y: 274 },
    { num: 164, y: 290 },
    { num: 165, y: 306 },
    { num: 166, y: 322 },
    { num: 167, y: 338 },
    { num: 168, y: 354 },
    { num: 169, y: 370 },
  ];
  middleLeftOuter.forEach((p) => {
    plots.push({
      id: p.num,
      plotNumber: p.num,
      name: `Plot #${p.num}`,
      zone: 'RESIDENTIAL',
      zoneLabel: 'West 12m Boulevard',
      areaSqFt: 1850,
      areaSqM: 171.9,
      areaM2Text: '171.9 m²',
      areaFt2Text: '1,850.0 ft²',
      dimensions: '30 ft x 61 ft',
      dimTop: '18.59 m',
      dimBottom: '18.59 m',
      dimLeft: '9.14 m',
      dimRight: '9.14 m',
      facing: 'East',
      roadWidth: '12 MT. WIDE ROAD',
      price: 4070000,
      status: p.num % 4 === 0 ? 'RESERVED' : 'AVAILABLE',
      description: 'Direct road access plot with grand frontage.',
      x: 826,
      y: p.y,
      w: 36,
      h: 15,
    });
  });

  // --- Middle Left Inner (Plots 147 - 139) ---
  const middleLeftInner = [
    { num: 147, y: 226 },
    { num: 148, y: 242 },
    { num: 146, y: 258 },
    { num: 145, y: 274 },
    { num: 144, y: 290 },
    { num: 143, y: 306 },
    { num: 142, y: 322 },
    { num: 141, y: 338 },
    { num: 140, y: 354 },
    { num: 139, y: 370 },
  ];
  middleLeftInner.forEach((p) => {
    plots.push({
      id: p.num,
      plotNumber: p.num,
      name: `Plot #${p.num}`,
      zone: 'RESIDENTIAL',
      zoneLabel: 'Central Internal Row',
      areaSqFt: 1750,
      areaSqM: 162.6,
      areaM2Text: '162.6 m²',
      areaFt2Text: '1,750.0 ft²',
      dimensions: '30 ft x 58 ft',
      dimTop: '17.68 m',
      dimBottom: '17.68 m',
      dimLeft: '9.14 m',
      dimRight: '9.14 m',
      facing: 'West',
      roadWidth: '9.00 MT. WIDE ROAD',
      price: 3675000,
      status: 'AVAILABLE',
      description: 'Ideal duplex residential plot located along peaceful inner residential lanes.',
      x: 864,
      y: p.y,
      w: 36,
      h: 15,
    });
  });

  // --- Lower Left Outer (Plots 170 - 179) ---
  const lowerLeftOuter = [
    { num: 170, y: 406 },
    { num: 171, y: 422 },
    { num: 172, y: 438 },
    { num: 173, y: 454 },
    { num: 174, y: 470 },
    { num: 175, y: 486 },
    { num: 176, y: 502 },
    { num: 177, y: 518 },
    { num: 178, y: 534 },
    { num: 179, y: 550 },
  ];
  lowerLeftOuter.forEach((p) => {
    plots.push({
      id: p.num,
      plotNumber: p.num,
      name: `Plot #${p.num}`,
      zone: 'RESIDENTIAL',
      zoneLabel: 'West 12m Boulevard',
      areaSqFt: 1900,
      areaSqM: 176.5,
      areaM2Text: '176.5 m²',
      areaFt2Text: '1,900.0 ft²',
      dimensions: '30 ft x 63 ft',
      dimTop: '19.20 m',
      dimBottom: '19.20 m',
      dimLeft: '9.14 m',
      dimRight: '9.14 m',
      facing: 'East',
      roadWidth: '12 MT. WIDE ROAD',
      price: 4180000,
      status: 'AVAILABLE',
      description: 'Grand boulevard facing plot directly north of Plot 180.',
      x: 826,
      y: p.y,
      w: 36,
      h: 15,
    });
  });

  // --- Lower Left Inner (Plots 134 - 128) ---
  const lowerLeftInner = [
    { num: 134, y: 454 },
    { num: 133, y: 470 },
    { num: 132, y: 486 },
    { num: 131, y: 502 },
    { num: 130, y: 518 },
    { num: 129, y: 534 },
    { num: 128, y: 550 },
  ];
  lowerLeftInner.forEach((p) => {
    plots.push({
      id: p.num,
      plotNumber: p.num,
      name: `Plot #${p.num}`,
      zone: 'RESIDENTIAL',
      zoneLabel: 'Central Internal Row',
      areaSqFt: 1750,
      areaSqM: 162.6,
      areaM2Text: '162.6 m²',
      areaFt2Text: '1,750.0 ft²',
      dimensions: '30 ft x 58 ft',
      dimTop: '17.68 m',
      dimBottom: '17.68 m',
      dimLeft: '9.14 m',
      dimRight: '9.14 m',
      facing: 'West',
      roadWidth: '9.00 MT. WIDE ROAD',
      price: 3675000,
      status: 'AVAILABLE',
      description: 'Inner row plot directly above Plot 180 beside Plot 179.',
      x: 864,
      y: p.y,
      w: 36,
      h: 15,
    });
  });

  // ==========================================
  // PLOT 180 (THE STAR PLOT - EXACT SPECS FROM SCREENSHOT 3)
  // Spans across both Column 1 and Column 2 under 179 & 128
  // ==========================================
  plots.push({
    id: 180,
    plotNumber: 180,
    name: 'Plot #180',
    zone: 'VILLA_ESTATE',
    zoneLabel: 'Boulevard Corner Estate',
    areaSqFt: 3653.22,
    areaSqM: 339.4,
    areaM2Text: '339.4 m²',
    areaFt2Text: '3,653.22 ft²',
    dimensions: '27.85 m x 12.21 m',
    dimTop: '27.85 m',
    dimBottom: '27.85 m',
    dimLeft: '12.21 m',
    dimRight: '12.81 m',
    facing: 'East',
    roadWidth: '12 MT. WIDE ROAD',
    price: 8037000,
    status: 'AVAILABLE',
    description:
      'Signature oversized residential villa plot with dual road frontage on 12 MT. and 9 MT. avenues. Ready for custom duplex villa construction.',
    x: 826,
    y: 568,
    w: 74, // spans both columns (826 to 900)
    h: 34,
  });

  // Plots 181, 182, 183, 184 below Plot 180
  plots.push({
    id: 181,
    plotNumber: 181,
    name: 'Plot #181',
    zone: 'VILLA_ESTATE',
    zoneLabel: 'Boulevard Estate Row',
    areaSqFt: 3400,
    areaSqM: 315.8,
    areaM2Text: '315.8 m²',
    areaFt2Text: '3,400.0 ft²',
    dimensions: '27.85 m x 11.34 m',
    dimTop: '27.85 m',
    dimBottom: '27.85 m',
    dimLeft: '11.34 m',
    dimRight: '11.34 m',
    facing: 'East',
    roadWidth: '12 MT. WIDE ROAD',
    price: 7480000,
    status: 'AVAILABLE',
    description: 'Spacious villa parcel immediately south of Plot 180 with excellent cross-ventilation.',
    x: 826,
    y: 604,
    w: 74,
    h: 34,
  });

  plots.push({
    id: 182,
    plotNumber: 182,
    name: 'Plot #182',
    zone: 'VILLA_ESTATE',
    zoneLabel: 'Boulevard Estate Row',
    areaSqFt: 3400,
    areaSqM: 315.8,
    areaM2Text: '315.8 m²',
    areaFt2Text: '3,400.0 ft²',
    dimensions: '27.85 m x 11.34 m',
    dimTop: '27.85 m',
    dimBottom: '27.85 m',
    dimLeft: '11.34 m',
    dimRight: '11.34 m',
    facing: 'East',
    roadWidth: '12 MT. WIDE ROAD',
    price: 7480000,
    status: 'AVAILABLE',
    description: 'Prime villa parcel on 12m boulevard.',
    x: 826,
    y: 640,
    w: 74,
    h: 34,
  });

  plots.push({
    id: 183,
    plotNumber: 183,
    name: 'Plot #183',
    zone: 'VILLA_ESTATE',
    zoneLabel: 'Boulevard Estate Row',
    areaSqFt: 3350,
    areaSqM: 311.2,
    areaM2Text: '311.2 m²',
    areaFt2Text: '3,350.0 ft²',
    dimensions: '27.85 m x 11.18 m',
    dimTop: '27.85 m',
    dimBottom: '27.85 m',
    dimLeft: '11.18 m',
    dimRight: '11.18 m',
    facing: 'East',
    roadWidth: '12 MT. WIDE ROAD',
    price: 7370000,
    status: 'AVAILABLE',
    description: 'South corner villa plot along main avenue.',
    x: 826,
    y: 676,
    w: 74,
    h: 34,
  });

  plots.push({
    id: 184,
    plotNumber: 184,
    name: 'Plot #184',
    zone: 'VILLA_ESTATE',
    zoneLabel: 'South Terminal Villa',
    areaSqFt: 3350,
    areaSqM: 311.2,
    areaM2Text: '311.2 m²',
    areaFt2Text: '3,350.0 ft²',
    dimensions: '27.85 m x 11.18 m',
    dimTop: '27.85 m',
    dimBottom: '27.85 m',
    dimLeft: '11.18 m',
    dimRight: '11.18 m',
    facing: 'East',
    roadWidth: '12 MT. WIDE ROAD',
    price: 7370000,
    status: 'AVAILABLE',
    description: 'Southernmost terminal estate plot.',
    x: 826,
    y: 712,
    w: 74,
    h: 34,
  });

  return plots;
}
