# AVOLITE --- Master Project Documentation

## 1. Project Definition

**AVOLITE** is an intelligent RF sensing, smart-scanning and
direction-finding system concept. It combines RF environment simulation,
emitter modelling, receiver modelling, digital signal processing, signal
detection, Angle of Arrival (AoA) estimation, environment-state
estimation, AI/ML prediction and adaptive scan scheduling.

The central idea is:

> **Observe → Process → Detect → Estimate → Predict → Decide → Scan
> Again**

AVOLITE should be treated as one complete closed-loop system rather than
as an isolated AI model or isolated RF receiver.

------------------------------------------------------------------------

## 2. What AVOLITE Does

At a high level the system:

1.  Creates or receives an RF environment.
2.  Models one or more emitters.
3.  Applies propagation effects.
4.  Receives signals through an antenna or antenna array.
5.  Models the RF receiver and ADC.
6.  Processes digital samples using DSP.
7.  Detects signal activity.
8.  Extracts useful signal features.
9.  Estimates Angle of Arrival when multi-channel information is
    available.
10. Builds a history of observations.
11. Estimates the current RF environment.
12. Uses AI/ML to predict activity or priority.
13. Selects the next scan target.
14. Reconfigures the receiver.
15. Repeats the process.
16. Logs and evaluates performance.

------------------------------------------------------------------------

# 3. Why It Is Used

A conventional fixed frequency sweep may spend equal time across a large
frequency space even when some areas are much more informative than
others.

Realistic RF environments can contain:

-   persistent signals
-   periodic signals
-   intermittent signals
-   burst transmissions
-   frequency-agile signals
-   staggered activity
-   communication-like activity
-   noise
-   interference
-   fading
-   multipath

AVOLITE attempts to make scanning adaptive.

Instead of asking only:

> "Is there RF energy here?"

it can ask:

> "What was observed, where did it come from, what is likely to happen
> next, and where should the receiver look next?"

------------------------------------------------------------------------

# 4. Complete Architecture

``` text
RF ENVIRONMENT
      ↓
EMITTER MANAGER
      ↓
PROPAGATION
      ↓
ANTENNA / ANTENNA ARRAY
      ↓
RF RECEIVER
      ↓
ADC / SAMPLING
      ↓
DIGITAL DOWN CONVERSION
      ↓
FILTERING / DSP
      ↓
FFT / SPECTRAL ANALYSIS
      ↓
DETECTION / CFAR
      ↓
FEATURE / PDW EXTRACTION
      ↓
┌───────────────┬────────────────┐
│               │                │
AOA             ENVIRONMENT      │
ESTIMATION      ESTIMATION       │
│               │                │
└───────────────┴───────┬────────┘
                        ↓
                    AI / ML
                        ↓
              PREDICTION + UNCERTAINTY
                        ↓
                SMART SCHEDULER
                        ↓
               RECEIVER CONTROL
                        ↓
                    RECEIVER
                        ↺
```

The key architectural property is the feedback loop:

``` text
Sense → Understand → Predict → Decide → Reconfigure → Sense
```

------------------------------------------------------------------------

# 5. RF Environment

The RF environment is the simulated world in which AVOLITE operates.

It can contain:

-   emitter locations
-   frequencies
-   bandwidths
-   powers
-   modulation characteristics
-   timing/activity patterns
-   noise
-   interference
-   propagation effects
-   source direction

A useful simulator should eventually support both simple and difficult
scenarios.

------------------------------------------------------------------------

# 6. Emitter Manager

The emitter manager creates and controls simulated signal sources.

Typical parameters include:

``` text
Emitter ID
Frequency
Bandwidth
Power
Modulation
Pulse Width
PRI / Repetition Interval
Duty Cycle
Start Time
Stop Time
Activity Pattern
Frequency Agility
Direction
Range
```

Possible emitter classes:

### E1 --- Persistent

Continuously or almost continuously active.

### E2 --- Periodic

Appears at predictable intervals.

### E3 --- Intermittent

Appears irregularly.

### E4 --- Frequency Agile

Changes frequency according to a defined pattern.

### E5 --- Staggered

Uses changing timing/repetition patterns.

### E6/E7 --- Communication-like

Represents communication activity.

### E8 --- Unknown/New

A signal not previously observed.

These classes are useful for generating AI/scheduler test scenarios.

------------------------------------------------------------------------

# 7. Propagation

The propagation layer converts an emitted signal into a received signal.

Conceptually:

``` text
Transmitted Signal
      ↓
Path Loss
      ↓
Fading
      ↓
Doppler
      ↓
Multipath
      ↓
Noise / Interference
      ↓
Received Signal
```

The first implementation can be simple, for example path loss plus
controlled noise. Later versions can introduce fading, Doppler and
multipath.

------------------------------------------------------------------------

# 8. Antenna and Antenna Array

The antenna converts the electromagnetic field into received signal
channels.

For AoA, multiple spatially separated elements are useful:

``` text
Incoming Wavefront
       ↓
 ┌─────┬─────┬─────┬─────┐
 │ A1  │ A2  │ A3  │ A4  │
 └─────┴─────┴─────┴─────┘
       ↓
Multiple Receiver Channels
```

The same signal reaches different elements with different phase/time
relationships. That spatial information can be used to estimate
direction.

------------------------------------------------------------------------

# 9. Receiver

A conceptual receiver chain is:

``` text
Antenna
  ↓
LNA
  ↓
RF Band-Pass Filter
  ↓
Mixer + Local Oscillator
  ↓
IF Filter
  ↓
Variable Gain
  ↓
ADC
```

Potential configurable parameters:

``` text
LO Frequency
RF Filter Bandwidth
IF Bandwidth
LNA Gain
VGA Gain
Sampling Rate
ADC Resolution
Dwell Time
Channel
Beam / Sector
```

The simulation does not need to reproduce every physical circuit detail
if the signal-level effects are represented correctly.

------------------------------------------------------------------------

# 10. ADC and Sampling

The ADC converts the receiver output into digital samples.

Important parameters:

-   sampling rate
-   quantization resolution
-   dynamic range
-   input range

The simulation must respect sampling requirements to avoid unrealistic
aliasing.

------------------------------------------------------------------------

# 11. Digital Down Conversion

A DDC stage can move the desired signal toward baseband:

``` text
ADC Samples
   ↓
Digital Mixer
   ↓
Low-Pass Filter
   ↓
Decimation
   ↓
Baseband Samples
```

This can reduce computational load while retaining useful information.

------------------------------------------------------------------------

# 12. Digital Signal Processing

The DSP pipeline turns raw samples into useful information.

Typical chain:

``` text
Raw Samples
   ↓
DC Removal
   ↓
Filtering
   ↓
Windowing
   ↓
FFT
   ↓
Spectral Analysis
   ↓
Detection
   ↓
Feature Extraction
```

DSP should remain separate from AI. DSP provides measured observations;
AI interprets patterns and makes predictions.

------------------------------------------------------------------------

# 13. FFT

The Fast Fourier Transform converts a time-domain sequence into
frequency-domain information.

The spectrum can show:

-   frequency
-   magnitude
-   signal peaks
-   occupied bandwidth
-   noise floor

The dashboard can visualize this as a live spectrum.

------------------------------------------------------------------------

# 14. Signal Detection

Detection asks whether useful signal activity exists above the
background.

A basic detector can use:

``` text
Signal > Threshold → Detection
Signal ≤ Threshold → No Detection
```

A more adaptive detector can use CFAR.

------------------------------------------------------------------------

# 15. CFAR

CFAR means **Constant False Alarm Rate**.

Conceptually:

``` text
Estimate Local Background
        ↓
Calculate Adaptive Threshold
        ↓
Compare Test Cell
        ↓
Detection / No Detection
```

This is useful when the background noise/interference level changes.

------------------------------------------------------------------------

# 16. Feature Extraction

A detected signal can be converted into an observation record.

Potential fields:

``` text
Timestamp
Frequency
Power
SNR
Bandwidth
Pulse Width
PRI
Time of Arrival
AoA
Detection Confidence
Channel
Receiver Configuration
```

The exact fields should follow the implemented model.

------------------------------------------------------------------------

# 17. PDW / Observation Concept

A Pulse Descriptor Word or equivalent observation record is a compact
representation of a detected event.

Conceptually:

``` text
Observation
├── Time
├── Frequency
├── Pulse Width
├── Power
├── PRI information
├── AoA
└── Quality indicators
```

The system can store these observations as its history.

------------------------------------------------------------------------

# 18. Angle of Arrival

AoA answers:

> **From what direction did the signal arrive?**

For an antenna array, the incoming wave reaches different elements with
different relative phase/time.

For a simple geometry, a path difference can be represented as:

``` text
Δd = d sin(θ)
```

and phase difference as:

``` text
Δφ = 2πΔd / λ
```

where:

-   `d` = antenna spacing
-   `θ` = arrival angle
-   `λ` = wavelength
-   `Δφ` = relative phase difference

The exact equation depends on the antenna geometry and angle convention.

------------------------------------------------------------------------

# 19. AoA Processing Pipeline

``` text
Channel 1 ──┐
Channel 2 ──┤
Channel 3 ──┼→ Synchronization
Channel 4 ──┘
                 ↓
             Filtering
                 ↓
        Phase / Time Difference
                 ↓
          Spatial Response
                 ↓
             Peak Search
                 ↓
                AoA
```

------------------------------------------------------------------------

# 20. Spatial Response

One robust way to visualize AoA is to evaluate candidate directions.

For example:

``` text
θ = -90° ... +90°
```

For each candidate angle, calculate a spatial response.

Then:

``` text
Estimated AoA =
angle corresponding to maximum response
```

Conceptual plot:

``` text
Response
  ^
  |
  |                    /  |                   /    |                  /      |_________________/______\________> Angle
                       ↑
                  Dominant Peak
```

The website/dashboard should show this because it makes the AoA decision
understandable.

------------------------------------------------------------------------

# 21. AoA Accuracy Factors

AoA accuracy depends on:

-   antenna geometry
-   antenna spacing
-   wavelength
-   channel synchronization
-   phase calibration
-   amplitude mismatch
-   SNR
-   noise
-   interference
-   multipath
-   bandwidth
-   sampling rate
-   algorithm
-   array geometry

AoA therefore needs systematic validation across multiple source angles
and signal conditions.

------------------------------------------------------------------------

# 22. Synchronization and Calibration

For phase-based AoA, channel synchronization is critical.

Conceptually:

``` text
Channel 1 ──┐
Channel 2 ──┤
Channel 3 ──┼→ Synchronization → AoA
Channel 4 ──┘
```

Calibration may be needed for:

-   phase offsets
-   channel delays
-   amplitude mismatch
-   cable differences
-   antenna differences

------------------------------------------------------------------------

# 23. RF Environment Estimator

The environment estimator converts observations into higher-level state.

Potential quantities:

``` text
Noise Floor
SNR
Interference Level
Spectral Occupancy
Signal Density
Signal Stability
Frequency Activity
Detection Rate
```

Example dashboard fields can be:

``` text
Noise Floor       -92 dBm
Average SNR        14 dB
Occupied Band      35%
Interference      Moderate
Signal Stability   High
```

These are illustrative UI values only until generated by the real
simulation.

------------------------------------------------------------------------

# 24. AI / ML Layer

AI should not replace DSP.

The division should be:

``` text
DSP:
"What did we observe?"

AI:
"What might happen next and what deserves attention?"
```

Possible AI inputs:

``` text
Frequency
Power
SNR
Bandwidth
PRI
Pulse Width
AoA
Detection history
Frequency history
Detection count
Noise floor
Interference
Time since last observation
Previous scan decisions
```

Possible outputs:

``` text
Activity Probability
Priority
Predicted State
Uncertainty
Next-scan recommendation
```

The exact target must be defined before model training.

------------------------------------------------------------------------

# 25. Historical Memory

Smart scanning requires history.

Example:

``` text
Time   Frequency   SNR   Detection   AoA
------------------------------------------
10:01  2400 MHz    18dB     YES       32°
10:02  2450 MHz     5dB     NO         -
10:03  2400 MHz    16dB     YES       31°
```

History allows the system to learn recurring behaviour.

------------------------------------------------------------------------

# 26. Ground Truth vs Observation

This distinction is essential.

The simulator can know:

``` text
True Frequency
True Angle
True Emitter State
True Power
True Activity
```

The AI should normally receive only:

``` text
Measured Frequency
Measured Power
Measured SNR
Estimated AoA
Detection History
Other Receiver Features
```

Ground truth should be used for evaluation, not leaked into the
prediction model.

------------------------------------------------------------------------

# 27. Smart Scan Scheduler

The scheduler decides what to scan next.

Possible decisions:

``` text
Frequency
Dwell Time
Bandwidth
Receiver Gain
Sector / Beam
Scan Priority
```

Conceptual decision:

``` text
Predicted Activity
      +
Historical Importance
      +
Uncertainty
      +
Detection Value
      -
Scan Cost
      ↓
Priority
```

This is a design concept; the final equation should be chosen and
validated experimentally.

------------------------------------------------------------------------

# 28. Exploration vs Exploitation

The scheduler must balance:

### Exploitation

Spend more scan time on promising regions.

### Exploration

Continue checking less-known regions so new signals can be discovered.

Conceptually:

``` text
Exploration ↔ Exploitation
```

A scheduler that only exploits known activity can miss new emitters. A
scheduler that only explores behaves like a conventional scanner.

------------------------------------------------------------------------

# 29. Receiver Reconfiguration

The scheduler can produce a configuration such as:

``` text
Frequency: 2435 MHz
Bandwidth: 10 MHz
Dwell: 20 ms
Gain: Medium
Sector: 45°
```

The receiver executes it and produces a new observation.

------------------------------------------------------------------------

# 30. Complete Smart-Scan Loop

``` text
Previous Scan
      ↓
Observation
      ↓
Feature Extraction
      ↓
Environment State
      ↓
AI Prediction
      ↓
Uncertainty
      ↓
Scheduler
      ↓
Next Scan
      ↓
New Observation
      ↺
```

This feedback loop is the main intelligent-system concept.

------------------------------------------------------------------------

# 31. MATLAB Role

MATLAB is suitable for:

-   emitter generation
-   RF simulation
-   propagation modelling
-   receiver modelling
-   antenna modelling
-   DSP
-   FFT
-   detection
-   AoA
-   plots
-   validation
-   batch experiments
-   result export

------------------------------------------------------------------------

# 32. Simulink Role

A recommended top-level Simulink model is:

``` text
AVOLITE_MODEL
│
├── RF Environment
├── Emitter Manager
├── Propagation
├── Antenna
├── Receiver
├── ADC
├── DSP
├── Detection
├── AoA
├── Environment Estimator
├── AI Interface
├── Smart Scheduler
├── Receiver Controller
└── Logging
```

Simulink is particularly useful for showing the system as connected
blocks and for experimenting with timing/dataflow.

------------------------------------------------------------------------

# 33. Python Role

Python can handle the AI/ML layer:

``` text
MATLAB / Simulink
       ↓
Observations
       ↓
Export / Interface
       ↓
Python
       ↓
Feature Builder
       ↓
ML Model
       ↓
Prediction
       ↓
Scheduler
       ↓
MATLAB / Simulink
```

Possible interfaces include MAT files, CSV, JSON, MATLAB-Python
integration, sockets or APIs depending on the final architecture.

------------------------------------------------------------------------

# 34. Recommended Development Strategy

Start offline before attempting a live MATLAB↔Python loop.

``` text
MATLAB Simulation
      ↓
Generate Dataset
      ↓
Python Training
      ↓
Validate Model
      ↓
Python Inference
      ↓
Integrate
      ↓
Closed Loop
```

This makes debugging much easier.

------------------------------------------------------------------------

# 35. Dataset

A useful dataset should vary:

``` text
Emitter Count
Frequency
Power
SNR
Noise
Interference
Activity Pattern
Source Angle
Dwell
Detection History
Time
```

For supervised learning, define labels explicitly.

------------------------------------------------------------------------

# 36. Simulation Modes

## Mode 1 --- Basic

One emitter, clean signal.

## Mode 2 --- Noise

Controlled noise/SNR variation.

## Mode 3 --- Multiple Emitters

Several simultaneous signals.

## Mode 4 --- Intermittent

Signals appear/disappear.

## Mode 5 --- Frequency Agile

Emitter changes frequency.

## Mode 6 --- Interference

Competing signals.

## Mode 7 --- AoA

Known source direction and multiple antenna channels.

## Mode 8 --- Full Closed Loop

RF + DSP + AoA + AI + scheduler.

------------------------------------------------------------------------

# 37. Recommended Test Cases

``` text
TC01 No signal
TC02 One strong signal
TC03 One weak signal
TC04 Multiple signals
TC05 Interference
TC06 Intermittent emitter
TC07 Periodic emitter
TC08 Frequency-agile emitter
TC09 Unknown/new emitter
TC10 AoA at 0°
TC11 Positive AoA
TC12 Negative AoA
TC13 Low-SNR AoA
TC14 Multipath
TC15 Full smart-scan loop
```

------------------------------------------------------------------------

# 38. Validation Metrics

## Detection

``` text
Probability of Detection
False Alarm Rate
Miss Rate
Detection Latency
```

## AoA

``` text
Mean Absolute Error
Maximum Error
RMSE
Angular Bias
Confidence
```

## Smart Scanning

``` text
Time to Discover
Scan Efficiency
Coverage
Missed Activity
Useful Observations
```

## AI

Depending on the task:

``` text
Accuracy
Precision
Recall
F1
MAE
RMSE
Calibration
Inference Latency
```

------------------------------------------------------------------------

# 39. Baseline Comparison

AVOLITE should have a baseline.

A simple baseline is:

``` text
Fixed Sequential Frequency Sweep
```

Compare it against:

``` text
AVOLITE Adaptive Scan
```

Use the same:

-   frequency range
-   emitter scenario
-   scan budget
-   dwell constraints
-   noise/interference
-   starting conditions

Useful system-level comparisons include:

``` text
Time to detect
Detection coverage
Missed activity
Scan efficiency
Computational cost
```

------------------------------------------------------------------------

# 40. AoA Validation

Use known simulated source directions:

``` text
-60°
-45°
-30°
-15°
  0°
+15°
+30°
+45°
+60°
```

For every test:

``` text
Reference Angle
      ↓
Run Simulation
      ↓
Estimated Angle
      ↓
Calculate Error
      ↓
Store Result
```

Basic error:

``` text
Absolute Error = |Reference - Estimated|
```

For circular angle systems, the implementation should also handle
wrap-around correctly.

------------------------------------------------------------------------

# 41. Dashboard

The dashboard is the visualization layer.

Recommended layout:

``` text
┌──────────────────────────────────────────────────────────┐
│ AVOLITE                                  RUNNING ●       │
├──────────────────────────────────────────────────────────┤
│ Current Scan | Frequency | Dwell | AoA | Confidence      │
├──────────────────────────────────────────────────────────┤
│                    SPECTRUM / SCAN MAP                    │
├──────────────────────┬───────────────────────────────────┤
│ Detected Emitters    │ AI / SCHEDULER                    │
│                      │                                   │
│ E1 2400 MHz 32°      │ Next: 2435 MHz                   │
│ E2 2420 MHz 71°      │ Priority: High                  │
│                      │ Prediction: 0.82                 │
├──────────────────────┴───────────────────────────────────┤
│                SPATIAL RESPONSE / AoA                    │
├──────────────────────────────────────────────────────────┤
│ Detection | False Alarm | Scan Efficiency | Latency      │
└──────────────────────────────────────────────────────────┘
```

The dashboard should observe the system, not secretly become part of the
control algorithm.

------------------------------------------------------------------------

# 42. Website

The website explains the engineering system rather than replacing it.

Recommended sections:

``` text
01 Home
02 The Challenge
03 System Architecture
04 Simulation & Results
05 Technology
06 Documentation
07 Motion Storyboard
08 Angle of Arrival
09 End-to-End Signal Flow
10 Validation & Results
11 Implementation Stack
12 Documentation / Handoff
13 Final CTA
```

Visual style:

-   dark navy
-   cyan signal highlights
-   radar rings
-   directional beams
-   spectrum/waveform graphics
-   engineering labels
-   large numerical metrics

------------------------------------------------------------------------

# 43. Website Motion Story

The free Figma-native concept uses:

``` text
SCAN
  ↓
DETECT
  ↓
PROCESS
  ↓
AOA LOCK
```

Suggested transition:

``` text
~1.5 s per state
ease-in-out
continuous scan arc
subtle glow on detection
stronger highlight at AoA lock
```

This can later become real CSS/JavaScript animation.

------------------------------------------------------------------------

# 44. Data Flow to Dashboard

A future production data flow can be:

``` text
MATLAB / Simulink
       ↓
Simulation
       ↓
Export Result
       ↓
JSON / CSV / API
       ↓
Dashboard
       ↓
Spectrum
AoA
Emitter List
Scheduler
Performance
```

Example result object:

``` text
{
  referenceAngle,
  estimatedAngle,
  absoluteError,
  confidence,
  scanAngles,
  spatialResponse,
  frequency,
  snr,
  timestamp
}
```

------------------------------------------------------------------------

# 45. Logging

Every simulation should log:

``` text
Simulation ID
Scenario ID
Timestamp
Receiver Configuration
Frequency
Detection
Power
SNR
AoA
AI Prediction
Scheduler Decision
Ground Truth
```

For reproducibility, also save:

``` text
Random Seed
Model Version
AI Model Version
Configuration Version
```

------------------------------------------------------------------------

# 46. Suggested Repository

``` text
AVOLITE/
│
├── matlab/
│   ├── emitters/
│   ├── propagation/
│   ├── antenna/
│   ├── receiver/
│   ├── dsp/
│   ├── detection/
│   ├── aoa/
│   ├── environment/
│   ├── scheduler/
│   ├── validation/
│   └── utils/
│
├── simulink/
│   ├── top_model/
│   ├── receiver/
│   ├── dsp/
│   ├── aoa/
│   └── control/
│
├── python/
│   ├── data/
│   ├── features/
│   ├── models/
│   ├── training/
│   ├── inference/
│   └── scheduler/
│
├── data/
│   ├── raw/
│   ├── processed/
│   └── results/
│
├── dashboard/
├── website/
├── docs/
├── tests/
└── README.md
```

------------------------------------------------------------------------

# 47. Recommended Build Order

Do not build everything simultaneously.

### Phase 1 --- RF

``` text
Emitter → Propagation → Receiver
```

### Phase 2 --- DSP

``` text
ADC → Filter → FFT → Detection
```

### Phase 3 --- Features

``` text
Detection → Frequency/Power/Timing Features
```

### Phase 4 --- AoA

``` text
Multiple Channels
→ Phase/Time Difference
→ Spatial Response
→ AoA
```

### Phase 5 --- Environment

``` text
Observations → Noise/Interference/State
```

### Phase 6 --- Dataset

``` text
Many Scenarios → Dataset
```

### Phase 7 --- AI

``` text
Train → Validate → Inference
```

### Phase 8 --- Scheduler

``` text
Prediction → Priority → Next Scan
```

### Phase 9 --- Closed Loop

``` text
Scan → AI → Scheduler → Rescan
```

### Phase 10 --- Dashboard

Connect live simulation results to visualization.

------------------------------------------------------------------------

# 48. Minimum Viable AVOLITE

Before implementing the full AI system, get this working:

``` text
Emitter
  ↓
Antenna Array
  ↓
Receiver
  ↓
ADC
  ↓
DSP
  ↓
Detection
  ↓
AoA
  ↓
Reference vs Estimated Angle
  ↓
Error
  ↓
Dashboard
```

Then add:

``` text
History
  ↓
AI
  ↓
Smart Scheduler
  ↓
Closed Loop
```

This is the safest engineering sequence.

------------------------------------------------------------------------

# 49. Common Mistakes

Avoid:

1.  Starting with AI before DSP works.
2.  Feeding ground truth directly to AI.
3.  Showing example numbers as measured results.
4.  Ignoring channel synchronization.
5.  Testing only one SNR.
6.  Testing only one angle.
7.  Having no baseline.
8.  Having no reproducible random seed.
9.  Mixing dashboard and control logic.
10. Building one huge model before validating subsystems.

------------------------------------------------------------------------

# 50. Project Status Rules

Every component should eventually be labelled:

-   **IMPLEMENTED** --- working and tested.
-   **INTEGRATED** --- connected and tested.
-   **PROTOTYPE** --- partial implementation.
-   **PLANNED** --- architecture exists but code is not complete.
-   **EXAMPLE** --- illustrative only.
-   **VALIDATION REQUIRED** --- implementation exists but evidence is
    incomplete.

This prevents presentation material from turning assumptions into fake
experimental results.

------------------------------------------------------------------------

# 51. Definition of Done

``` text
[ ] RF environment works
[ ] Emitter models work
[ ] Propagation works
[ ] Receiver model works
[ ] ADC/sampling is valid
[ ] DSP works
[ ] Detection works
[ ] Features are generated
[ ] AoA works
[ ] Reference-vs-estimate validation works
[ ] Dataset is generated
[ ] AI model is trained/tested
[ ] Scheduler selects next scan
[ ] Closed loop runs
[ ] Baseline comparison exists
[ ] Dashboard displays results
[ ] Results are logged
[ ] Experiments are reproducible
[ ] Documentation is complete
```

------------------------------------------------------------------------

# 52. One-Minute Project Explanation

> **AVOLITE is an intelligent RF scanning and direction-finding system.
> It models an RF environment, receives and processes signals, detects
> activity, extracts signal features, estimates Angle of Arrival using
> multi-channel information, and uses historical observations with AI/ML
> to help decide what the receiver should scan next. The goal is to turn
> a fixed RF sweep into an adaptive closed-loop sensing system.**

------------------------------------------------------------------------

# 53. Five-Minute Technical Explanation

AVOLITE begins with a configurable RF environment containing one or more
simulated emitters. Signals pass through propagation and antenna/channel
models into a configurable receiver. The received samples are digitized
and processed with DSP operations such as filtering and FFT-based
spectral analysis.

A detector identifies activity and creates observations containing
parameters such as frequency, power, timing, SNR and potentially AoA.

For direction finding, multiple antenna channels are processed together.
Relative phase or time information is used to form a spatial response
over candidate directions. The strongest spatial peak becomes the
estimated Angle of Arrival.

The observations are stored as a history. A Python AI/ML layer can use
this history and measured features to predict future activity or assign
scan priorities. A smart scheduler selects the next frequency, dwell or
receiver configuration. The receiver executes that decision and creates
a new observation, closing the loop.

The system should be evaluated against a baseline using detection
performance, discovery time, scan efficiency and AoA accuracy.

------------------------------------------------------------------------

# 54. A-to-Z Glossary

**ADC** --- Analog-to-Digital Converter.

**AI** --- Artificial Intelligence.

**AoA** --- Angle of Arrival.

**Antenna Array** --- Multiple spatially separated antenna elements used
for spatial information.

**AWGN** --- Additive White Gaussian Noise.

**CFAR** --- Constant False Alarm Rate.

**DSP** --- Digital Signal Processing.

**DDC** --- Digital Down Conversion.

**FFT** --- Fast Fourier Transform.

**IF** --- Intermediate Frequency.

**LNA** --- Low Noise Amplifier.

**ML** --- Machine Learning.

**PDW** --- Pulse Descriptor Word / pulse observation representation.

**PRI** --- Pulse Repetition Interval.

**RF** --- Radio Frequency.

**SDR** --- Software Defined Radio.

**SNR** --- Signal-to-Noise Ratio.

**VGA** --- Variable Gain Amplifier.

------------------------------------------------------------------------

# 55. Final Mental Model

Remember AVOLITE as:

``` text
                    AVOLITE
                       │
                       ▼
                RF ENVIRONMENT
                       │
                  EMITTERS
                       │
                  PROPAGATION
                       │
                ANTENNA ARRAY
                       │
                 RF RECEIVER
                       │
                      ADC
                       │
                  DIGITAL DSP
                       │
              FFT / FILTERING
                       │
                   DETECTION
                       │
               FEATURE EXTRACTION
                    │       │
                    │       └──→ AoA
                    │
                    └──────────┐
                               ↓
                     ENVIRONMENT STATE
                               ↓
                            AI / ML
                               ↓
                       PREDICTION
                               ↓
                     SMART SCHEDULER
                               ↓
                     NEXT SCAN DECISION
                               ↓
                     RECEIVER CONTROL
                               │
                               └────→ LOOP
```

The system is best described as:

> **RF sensing + DSP + direction finding + environment understanding +
> AI prediction + smart scanning = closed-loop intelligent RF system.**

------------------------------------------------------------------------

# 56. Immediate Next Engineering Milestone

The first reliable end-to-end prototype should be:

``` text
RF Emitter
    ↓
Antenna Array
    ↓
Receiver
    ↓
ADC
    ↓
DSP
    ↓
Detection
    ↓
AoA
    ↓
Reference vs Estimated Angle
    ↓
Error
    ↓
Dashboard
```

Only after this produces trustworthy results should the following loop
be connected:

``` text
Observation
    ↓
History
    ↓
AI
    ↓
Scheduler
    ↓
Next Scan
```

That approach gives AVOLITE a measurable engineering foundation before
the adaptive intelligence is introduced.
