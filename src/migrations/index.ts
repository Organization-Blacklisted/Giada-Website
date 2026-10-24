import * as migration_20261021_131250_baseline from './20261021_131250_baseline';
import * as migration_20261021_131332_add_blog_sidebar_cta from './20261021_131332_add_blog_sidebar_cta';
import * as migration_20261022_104325_add_home_journal_newsletter from './20261022_104325_add_home_journal_newsletter';
import * as migration_20261024_110306_add_event_popup from './20261024_110306_add_event_popup';

export const migrations = [
  {
    up: migration_20261021_131250_baseline.up,
    down: migration_20261021_131250_baseline.down,
    name: '20261021_131250_baseline',
  },
  {
    up: migration_20261021_131332_add_blog_sidebar_cta.up,
    down: migration_20261021_131332_add_blog_sidebar_cta.down,
    name: '20261021_131332_add_blog_sidebar_cta',
  },
  {
    up: migration_20261022_104325_add_home_journal_newsletter.up,
    down: migration_20261022_104325_add_home_journal_newsletter.down,
    name: '20261022_104325_add_home_journal_newsletter',
  },
  {
    up: migration_20261024_110306_add_event_popup.up,
    down: migration_20261024_110306_add_event_popup.down,
    name: '20261024_110306_add_event_popup'
  },
];
