export const DASHBOARD_URL='https://avolite-dashboard.vercel.app/';
export const RECORDING={
 view:'https://drive.google.com/file/d/1Zvi3vxh7ekWwGCZ82BJpV-mZNKCBcU5w/view',
 preview:'https://drive.google.com/file/d/1Zvi3vxh7ekWwGCZ82BJpV-mZNKCBcU5w/preview',
 folder:'https://drive.google.com/drive/folders/1425VEBKi62fiwWE3uAeuUvp-6D4p_FDf',
 name:'Avolite_Dashboard_vids.mp4',
};
export const DASHBOARD_CAPTURES=[
 {id:'smart-scan',title:'Smart Scan',description:'The prototype places the current observation, proposed next observation and receiver configuration together.'},
 {id:'surveillance',title:'Surveillance',description:'The prototype brings the simulated scene and receiver status into one operator view.'},
 {id:'unknown-signals',title:'Unknown signals',description:'The investigation view separates an unfamiliar observation, historical matches and operator admission.'},
];
// Sampled scenes, not inferred chapter boundaries or engineering measurements.
export const RECORDING_SCENES=[
 {time:30,label:'00:30',title:'Surveillance scene'},
 {time:90,label:'01:30',title:'RF processing'},
 {time:150,label:'02:30',title:'Unknown-signal review'},
 {time:210,label:'03:30',title:'History and memory'},
 {time:270,label:'04:30',title:'Signal intelligence'},
];
