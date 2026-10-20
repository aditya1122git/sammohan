import React, { useState, useEffect, useMemo } from 'react';
import { geoMercator, geoPath, geoCentroid } from 'd3-geo';

interface DistrictFeature {
  type: string;
  properties: {
    DISTRICT: string;
    dt_code?: string;
  };
  geometry: any;
}

interface GeoData {
  type: string;
  features: DistrictFeature[];
}

const CANVAS_SIZE = 440;
const CENTER_COORD = CANVAS_SIZE / 2;
const PATNA_HQ = 'Patna';

const DIVISIONS: Record<string, string[]> = {
  Patna: ['Nalanda', 'Bhojpur', 'Buxar', 'Rohtas', 'Kaimur (Bhabua)'],
  Gaya: ['Jehanabad', 'Arwal', 'Nawada', 'Aurangabad'],
  Muzaffarpur: ['Purba Champaran', 'Pashchim Champaran', 'Sitamarhi', 'Sheohar', 'Vaishali'],
  Saran: ['Siwan', 'Gopalganj'],
  Darbhanga: ['Madhubani', 'Samastipur'],
  Saharsa: ['Supaul', 'Madhepura'],
  Purnia: ['Araria', 'Kishanganj', 'Katihar'],
  Bhagalpur: ['Banka'],
  Munger: ['Jamui', 'Khagaria', 'Lakhisarai', 'Sheikhpura', 'Begusarai'],
};

const EXCLUDED = new Set(['Chatra']);

// Quadratic Bezier Curve Generator
function quadCurve([x1, y1]: [number, number], [x2, y2]: [number, number], curvature: number): string {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const cx = (x1 + x2) / 2 - dy * curvature;
  const cy = (y1 + y2) / 2 + dx * curvature;
  return `M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`;
}

// 24-Spoke Rotating Ashoka Chakra
const ChakraWheel: React.FC = () => {
  const spokes = useMemo(() => Array.from({ length: 24 }, (_, i) => i * 15), []);
  const spokeD = 'M 0,18.5 0.4,7 C 0.4,7 0,2 0,2 0,2 -0.4,7 -0.4,7 L 0,18.5 z';

  return (
    <g className="chakra-wheel" fill="#e8eeff" opacity="0.32">
      <path
        fillRule="evenodd"
        d="M 0,-20 A 20,20 0 1 1 0,20 A 20,20 0 1 1 0,-20 Z M 0,-18.5 A 18.5,18.5 0 1 0 0,18.5 A 18.5,18.5 0 1 0 0,-18.5 Z"
      />
      <circle r="3.5" />
      {spokes.map((deg) => (
        <g key={deg} transform={`rotate(${deg})`}>
          <path d={spokeD} />
          <circle r="0.7" transform="rotate(7.5) translate(0 18.5)" />
        </g>
      ))}
    </g>
  );
};

// Animated Neural Comet Pulse
const CometPath: React.FC<{ d: string; className: string; color: string; delay?: number }> = ({
  d,
  className,
  color,
  delay = 0,
}) => (
  <g className={className} style={{ animationDelay: `${delay}s` }}>
    <path d={d} pathLength="1" className="comet comet-glow" stroke={color} />
    <path d={d} pathLength="1" className="comet comet-core" />
  </g>
);

export const SankalpMap: React.FC<{
  language?: 'hi' | 'en';
  districtCounts?: Record<string, number>;
  onSelectDistrict?: (districtName: string) => void;
}> = ({ language = 'hi', districtCounts, onSelectDistrict }) => {
  const [geoData, setGeoData] = useState<GeoData | null>(() => {
    if (typeof window !== 'undefined' && (window as any).SANKALP_BIHAR_DISTRICTS) {
      return (window as any).SANKALP_BIHAR_DISTRICTS;
    }
    return null;
  });
  const [hoveredDistrict, setHoveredDistrict] = useState<string | null>(null);

  useEffect(() => {
    if (!geoData) {
      // If not on window, fetch directly
      fetch('/gis/bihar-districts.js')
        .then((res) => res.text())
        .then((code) => {
          try {
            const jsonText = code.substring(code.indexOf('{'), code.lastIndexOf('}') + 1);
            const parsed = JSON.parse(jsonText);
            setGeoData(parsed);
          } catch (e) {
            console.warn('Failed to parse bihar-districts.js', e);
          }
        })
        .catch(() => {});
    }
  }, [geoData]);

  // Compute Projection, Paths, Centroids, and Neural Flow Comets
  const mapStructure = useMemo(() => {
    if (!geoData) return null;

    const filteredFeatures = (geoData.features || []).filter(
      (f) => !EXCLUDED.has(f.properties?.DISTRICT)
    );

    const featureCollection = {
      type: 'FeatureCollection',
      features: filteredFeatures,
    };

    // Fit projection exactly in 440x440 canvas
    const projection = geoMercator().fitExtent(
      [
        [22, 88],
        [CANVAS_SIZE - 22, CANVAS_SIZE - 92],
      ],
      featureCollection as any
    );

    const pathGenerator = geoPath().projection(projection);

    const centroids: Record<string, [number, number]> = {};
    filteredFeatures.forEach((f) => {
      const name = f.properties.DISTRICT;
      const c = projection(geoCentroid(f as any));
      if (c) centroids[name] = c;
    });

    const patnaCoord = centroids[PATNA_HQ] || [CENTER_COORD, CENTER_COORD];

    // Compute comets from Patna to division HQs, and from divisions to districts
    const axons: Array<{ hq: string; d: string; at: [number, number] }> = [];
    const branches: Array<{ district: string; direct: boolean; d: string; at: [number, number] }> = [];

    Object.entries(DIVISIONS).forEach(([hq, dists], idx) => {
      if (hq !== PATNA_HQ && centroids[hq]) {
        axons.push({
          hq,
          d: quadCurve(patnaCoord, centroids[hq], idx % 2 === 0 ? 0.16 : -0.16),
          at: centroids[hq],
        });
      }

      dists.forEach((dName, dIdx) => {
        if (!centroids[dName]) return;
        const isDirect = hq === PATNA_HQ;
        const origin = centroids[hq] || patnaCoord;
        branches.push({
          district: dName,
          direct: isDirect,
          d: quadCurve(origin, centroids[dName], dIdx % 2 === 0 ? 0.24 : -0.24),
          at: centroids[dName],
        });
      });
    });

    return {
      features: filteredFeatures,
      path: pathGenerator,
      centroids,
      patna: patnaCoord,
      axons,
      branches,
    };
  }, [geoData]);

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[320px] sm:max-w-[460px] flex items-center justify-center select-none overflow-hidden rounded-3xl">
      <svg
        viewBox={`0 0 ${CANVAS_SIZE} ${CANVAS_SIZE}`}
        className="w-full h-full drop-shadow-[0_15px_30px_rgba(0,0,0,0.45)] overflow-hidden"
      >
        <defs>
          <radialGradient id="patnaGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#f59e0b" stopOpacity="1" />
            <stop offset="60%" stopColor="#d97706" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#b45309" stopOpacity="0" />
          </radialGradient>
          <filter id="mapShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="2" dy="5" stdDeviation="4" floodColor="#000" floodOpacity="0.4" />
          </filter>
        </defs>

        {/* 1. Rotating Background 24-spoke Ashoka Chakra Wheel */}
        <ChakraWheel />

        {/* 2. Bihar 38 District Boundaries */}
        {mapStructure && (
          <g filter="url(#mapShadow)">
            {mapStructure.features.map((feature, i) => {
              const dName = feature.properties.DISTRICT;
              const isHovered = hoveredDistrict === dName;
              const isPatna = dName === PATNA_HQ;
              const pathD = mapStructure.path(feature as any) || '';

              return (
                <path
                  key={dName || i}
                  d={pathD}
                  className="transition-all duration-200 cursor-pointer"
                  fill={
                    isHovered
                      ? '#3b82f6'
                      : isPatna
                      ? '#556b2f'
                      : '#607274'
                  }
                  fillOpacity={isHovered ? 0.95 : 0.72}
                  stroke={isHovered ? '#ffffff' : '#9ca3af'}
                  strokeWidth={isHovered ? 1.5 : 0.65}
                  onMouseEnter={() => setHoveredDistrict(dName)}
                  onMouseLeave={() => setHoveredDistrict(null)}
                  onClick={() => onSelectDistrict && onSelectDistrict(dName)}
                />
              );
            })}
          </g>
        )}

        {/* 3. Outward & Inward Flowing Axon Comets */}
        {mapStructure && (
          <g>
            {mapStructure.axons.map((axon, idx) => (
              <CometPath
                key={`axon-${axon.hq}`}
                d={axon.d}
                className="out-axon"
                color="#facc15"
                delay={(idx * 0.35) % 3}
              />
            ))}

            {mapStructure.branches.map((branch, idx) => (
              <CometPath
                key={`branch-${branch.district}`}
                d={branch.d}
                className={branch.direct ? 'out-direct' : 'out-branch branch-comet'}
                color={branch.direct ? '#38bdf8' : '#fb923c'}
                delay={(idx * 0.25) % 4}
              />
            ))}
          </g>
        )}

        {/* 4. District Centroid Dots */}
        {mapStructure &&
          Object.entries(mapStructure.centroids).map(([name, [cx, cy]]) => {
            const isPatna = name === PATNA_HQ;
            if (isPatna) return null;
            return (
              <circle
                key={`dot-${name}`}
                cx={cx}
                cy={cy}
                r="2.2"
                fill="#ffffff"
                stroke="#18327b"
                strokeWidth="0.8"
                className="pointer-events-none opacity-85"
              />
            );
          })}

        {/* 5. Central Pulsing Patna Beacon */}
        {mapStructure && (
          <g transform={`translate(${mapStructure.patna[0]}, ${mapStructure.patna[1]})`}>
            {/* Outer Soma Flare Ring */}
            <circle
              r="14"
              fill="none"
              stroke="#fbbf24"
              strokeWidth="1.5"
              className="soma-flare opacity-70"
            />
            {/* Middle Glow Circle */}
            <circle r="7.5" fill="url(#patnaGlow)" />
            {/* Core Golden Beacon */}
            <circle r="3.2" fill="#fffdf2" />
          </g>
        )}
      </svg>

      {/* Floating Hover Badge */}
      {hoveredDistrict && (
        <div className="absolute top-2 left-2 z-10 bg-slate-900/95 text-white backdrop-blur-md px-3.5 py-2 rounded-xl border border-amber-400/50 text-xs shadow-2xl animate-fadeIn pointer-events-none">
          <div className="font-extrabold text-amber-300 text-sm leading-tight">{hoveredDistrict}</div>
          <div className="text-[11px] font-semibold text-sky-200 mt-0.5">
            {districtCounts && districtCounts[hoveredDistrict] !== undefined
              ? (language === 'hi' ? `${districtCounts[hoveredDistrict]} परियोजनाएँ / घोषणाएँ` : `${districtCounts[hoveredDistrict]} Active Projects`)
              : (language === 'hi' ? 'प्रशासनिक जिला, बिहार' : 'Administrative District, Bihar')}
          </div>
        </div>
      )}

      {/* Map Subtitle Caption */}
      <div className="hidden sm:block absolute -bottom-2 right-4 bg-black/40 backdrop-blur-sm text-white/90 text-[11px] px-3 py-1 rounded-full border border-white/10 font-medium whitespace-nowrap">
        {language === 'hi'
          ? 'पटना से सभी प्रमंडलों और 38 जिलों तक सूचना का प्रवाह'
          : 'Data flow from Patna to all divisions & 38 districts'}
      </div>
      <div className="sm:hidden absolute -bottom-4 inset-x-2 text-center bg-black/60 backdrop-blur-sm text-white/90 text-[10px] px-2 py-0.5 rounded-full border border-white/10">
        {language === 'hi'
          ? 'पटना से सभी प्रमंडलों तक सूचना प्रवाह'
          : 'Data flow from Patna across Bihar'}
      </div>
    </div>
  );
};
