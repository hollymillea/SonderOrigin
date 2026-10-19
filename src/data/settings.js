import content from './generated/content.js';
import {settings as localSettings} from './local/settings.js';

// The showreel never falls back to the local one: with Sanity content but no
// showreel URL set there, the site has no showreel
export const settings = content.settings
  ? {...localSettings, ...content.settings, showreelUrl: content.settings.showreelUrl}
  : localSettings;
