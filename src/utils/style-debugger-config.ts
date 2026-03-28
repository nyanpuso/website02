export interface DebugTarget {
    selector: string;
    props: string[];
    logMode?: 'instant' | 'queued';
}

export const debugTargets: DebugTarget[] = [
    { selector: '#slider-wrapper', props: ['display','visibility','opacity'], logMode: 'instant' },
    { selector: '#slider-wrapper', props: ['zIndex','width','height'], logMode: 'queued' },
    { selector: '#main-content', props: ['display'], logMode: 'instant' },
    { selector: '#main-content', props: ['opacity'], logMode: 'queued' },
];