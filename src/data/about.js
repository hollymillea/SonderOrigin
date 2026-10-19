import content from './generated/content.js';
import {about as localAbout} from './local/about.js';

export const about = content.about ?? localAbout;
