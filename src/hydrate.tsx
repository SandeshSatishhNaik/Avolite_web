import {hydrateRoot} from 'react-dom/client';
import {Cutaway,StageExplorer,RouterWalkthrough,ScanDemo,FailureExplorer,HumanReview,RoleSelector} from './components/Widgets';
import {RecordingPlayer} from './components/RecordingPlayer';
const components={cutaway:Cutaway,stages:StageExplorer,router:RouterWalkthrough,scan:ScanDemo,failures:FailureExplorer,review:HumanReview,roles:RoleSelector,recording:RecordingPlayer};
document.querySelectorAll<HTMLElement>('[data-widget]').forEach(node=>{const Component=components[node.dataset.widget as keyof typeof components];if(Component)hydrateRoot(node,<Component/>)});
