import content from './generated/content.js';
import {settings as localSettings} from './local/settings.js';

export const settings = {...localSettings, ...content.settings};
