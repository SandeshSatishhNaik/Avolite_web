// Qualitative architecture copy from the approved experience spec and architecture report.
export const stages = [
 {name:'Observe',purpose:'Listen before deciding.',input:'Receiver observations',output:'Signal observations for processing',detail:'The proposed ES receiver observes signals within its current configuration. Integrated receiver evidence is pending.',href:'/system/#inputs'},
 {name:'Process',purpose:'Turn observations into usable features.',input:'Observed signal',output:'Processed signal features',detail:'Range-Doppler processing is demonstrated in the radar DSP testbed. It does not validate an integrated ES receiver.',href:'/evidence/#figures'},
 {name:'Detect',purpose:'Find candidates worth examining.',input:'Processed observations',output:'Candidate detections',detail:'CA-CFAR exports support radar detection on a synthetic scenario. ES detection still needs its own validation.',href:'/evidence/#run'},
 {name:'Estimate',purpose:'Describe what the receiver sees.',input:'Candidate observations',output:'Feature and direction estimates',detail:'Angle-of-arrival estimation must be checked against a known reference direction. No AoA result is claimed here.',href:'/evidence/#pending'},
 {name:'Predict',purpose:'Ask what might happen next.',input:'Cluster history and selected skills',output:'A prediction, with its evidence',detail:'The proposed router selects temporal, relational or spatial models. Prediction remains distinct from the next receiver action.',href:'/system/#routing'},
 {name:'Decide',purpose:'Choose the next sensing action.',input:'Predictions and current evidence',output:'Proposed scan configuration',detail:'The designed decision layer balances exploration and exploitation. High-impact changes require human review.',href:'/system/#review'},
 {name:'Scan again',purpose:'Close the loop with a new observation.',input:'Selected receiver configuration',output:'A new observation to compare',detail:'A fresh observation is checked against the prediction. Disagreement calls for deeper analysis, not silent acceptance.',href:'/system/#loop'}
];
export const failures = [
 ['Wrong cluster chosen','Second-stage evidence and confidence checks','Reconsider the cluster and request review.','A labelled cluster-assignment evaluation.'],
 ['Wrong skills chosen','Escalation and model-disagreement monitoring','Select additional analysis skills.','Controlled skill-selection ablations.'],
 ['Model drift','Compare predictions with verified outcomes','Escalate to a conservative path.','Versioned evaluation across changing scenarios.'],
 ['Unknown signal','Check against known cluster profiles','Propose a new cluster for human review.','Novel-signal cases with recorded review decisions.'],
 ['Prediction error','Compare the next observation with the prediction','Trigger deeper analysis.','A closed-loop prediction-error trace.'],
 ['Uncertain decision','Check decision evidence before configuration changes','Use a conservative fallback or human review.','Uncertain-input and fallback tests.'],
 ['Interface failure','Check receiver-control acknowledgement','Report the error and use a safe configuration.','Fault-injection tests before hardware control.']
];
export const milestones = [
 ['Radar DSP foundation','SIMULATED','Radar detection exports available.','Reproduce the pinned run and preserve its source trace.'],
 ['ES scene and receiver integration','PLANNED','Integrated evidence pending.','Demonstrate receiver observations for the intended emitter scene.'],
 ['Angle-of-arrival validation','PLANNED','Direction estimates pending.','Compare estimated direction with known reference directions.'],
 ['Fixed-sweep baseline','PLANNED','Intercept metrics pending.','Measure a fixed sweep on a defined scene and sensing budget.'],
 ['Learned scheduler','DESIGNED','Architecture documented.','Run model and routing ablations with accuracy and cost measures.'],
 ['Closed-loop comparison','DESIGNED','Adaptive comparison pending.','Compare the scheduler and baseline under matching conditions.'],
 ['Receiver hardware','PLANNED','Future engineering path.','Validate interfaces and safe states before supervised hardware trials.']
] as const;
export const ablations=['SSM baseline','Add relational GNN','Test spatial-temporal ST-GNN','Combine specialist models','Add conditional ensemble','Add skill and model routing','Add the decision loop'];
