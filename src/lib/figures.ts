// Registry of the MATLAB exports mirrored from the pinned upstream commit (scenario A only).
// Not imported by data.ts or any node test: it imports .png files, which only Vite can resolve.
// Alt text names the plot type and axes and carries no numbers; numbers live in tagged tables.
import type { ImageMetadata } from 'astro';

// Lazy glob: only figures a page renders are loaded, so unused PNGs never ship (no .png in dist).
const IMAGES = import.meta.glob<{ default: ImageMetadata }>('../assets/repo/**/*.png');

type Figure = { alt: string; title: string; status: 'SIMULATED'; path: string };

const P = '04_MATLAB/DSP/';
const CP = `${P}SARRS_Results/CFAR_Performance/`;
const TA = `${P}SARRS_Results/CFAR_Threshold_Analysis/`;

export const FIGURES = {
  errors: {
    alt: 'Two bar charts on a white background. The top chart shows range estimation error in metres for each of the five targets, with bars above and below zero. The bottom chart shows velocity estimation error in metres per second for each target.',
    title: 'Range and velocity estimation error per target',
    status: 'SIMULATED',
    path: `${CP}Range_Velocity_Errors.png`,
  },
  'detection-map': {
    alt: 'Binary CA-CFAR detection map with range in metres on the horizontal axis and velocity in metres per second on the vertical axis. Five small white blocks on a black field mark the detected targets.',
    title: 'CA-CFAR binary detection map',
    status: 'SIMULATED',
    path: `${CP}CFAR_Detection_Map.png`,
  },
  'expected-range': {
    alt: 'Line chart of range in metres against target number. A solid blue line with circles shows expected range and a dashed red line with crosses shows CA-CFAR detected range. The two lines almost overlap.',
    title: 'Expected and detected range per target',
    status: 'SIMULATED',
    path: `${CP}Expected_vs_Detected_Range.png`,
  },
  'expected-velocity': {
    alt: 'Line chart of velocity in metres per second against target number. A solid blue line with circles shows expected velocity and a dashed red line with crosses shows CA-CFAR detected velocity. The two lines almost overlap.',
    title: 'Expected and detected velocity per target',
    status: 'SIMULATED',
    path: `${CP}Expected_vs_Detected_Velocity.png`,
  },
  'rd-original': {
    alt: 'Range-Doppler map in decibels with range on the horizontal axis and velocity on the vertical axis. Five bright yellow spots stand out from a teal and blue noise floor.',
    title: 'Original range-Doppler map',
    status: 'SIMULATED',
    path: `${TA}01_Original_Range_Doppler_Map.png`,
  },
  'cfar-threshold': {
    alt: 'CA-CFAR adaptive threshold map in decibels with range and velocity axes. A green-yellow plane has five brighter rectangles, one around each target, inside a dark blue border where no threshold is computed.',
    title: 'CA-CFAR adaptive threshold map',
    status: 'SIMULATED',
    path: `${TA}02_CFAR_Threshold_Map.png`,
  },
  'cfar-detection': {
    alt: 'Binary CA-CFAR detection map with range and velocity axes. Five small yellow blocks on a dark blue field mark the detected targets.',
    title: 'CA-CFAR detection map',
    status: 'SIMULATED',
    path: `${TA}03_CFAR_Detection_Map.png`,
  },
  'cfar-complete': {
    alt: 'Three panels side by side, each with range and velocity axes: the range-Doppler map with five bright targets, the adaptive CFAR threshold with a bright rectangle around each target, and the CFAR detection output with five small yellow detections.',
    title: 'Range-Doppler map, adaptive threshold and detection output',
    status: 'SIMULATED',
    path: `${TA}04_CFAR_Complete_Analysis.png`,
  },
  'final-radar': {
    alt: 'Two panels side by side. On the left, a simulated range-Doppler map with white circles with target labels at the expected targets. On the right, the CA-CFAR detection map with red crosses with detection labels at the detected targets.',
    title: 'Expected targets and CA-CFAR detections',
    status: 'SIMULATED',
    path: `${TA}FINAL_DEMONSTRATION/SARRS_Final_Radar_CA_CFAR_Result.png`,
  },
  'rd-annotated': {
    alt: 'Five-target range-Doppler map in decibels. Red crosses with target labels mark the five simulated targets on a teal noise floor, with range in metres on the horizontal axis and velocity in metres per second on the vertical axis.',
    title: 'Annotated five-target range-Doppler map',
    status: 'SIMULATED',
    path: `${P}FiveTarget_RangeDoppler_Map_Annotated.png`,
  },
} satisfies Record<string, Figure>;

export type FigureId = keyof typeof FIGURES;

export async function loadImage(id: FigureId): Promise<ImageMetadata> {
  const load = IMAGES[`../assets/repo/${FIGURES[id].path}`];
  if (!load) throw new Error(`figures: no image file for ${id}`);
  return (await load()).default;
}
