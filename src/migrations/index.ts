import * as migration_20261021_131250_baseline from './20261021_131250_baseline';
import * as migration_20261021_131332_add_blog_sidebar_cta from './20261021_131332_add_blog_sidebar_cta';
import * as migration_20261022_104325_add_home_journal_newsletter from './20261022_104325_add_home_journal_newsletter';
import * as migration_20261024_110306_add_event_popup from './20261024_110306_add_event_popup';
import * as migration_20261024_110911_add_event_popup_eyebrow from './20261024_110911_add_event_popup_eyebrow';
import * as migration_20261024_111629_add_event_popup_cooldown from './20261024_111629_add_event_popup_cooldown';
import * as migration_20261104_131628_add_fragments_unveiling_label from './20261104_131628_add_fragments_unveiling_label';
import * as migration_20261105_084432_add_founders_shared_image from './20261105_084432_add_founders_shared_image';

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
    name: '20261024_110306_add_event_popup',
  },
  {
    up: migration_20261024_110911_add_event_popup_eyebrow.up,
    down: migration_20261024_110911_add_event_popup_eyebrow.down,
    name: '20261024_110911_add_event_popup_eyebrow',
  },
  {
    up: migration_20261024_111629_add_event_popup_cooldown.up,
    down: migration_20261024_111629_add_event_popup_cooldown.down,
    name: '20261024_111629_add_event_popup_cooldown',
  },
  {
    up: migration_20261104_131628_add_fragments_unveiling_label.up,
    down: migration_20261104_131628_add_fragments_unveiling_label.down,
    name: '20261104_131628_add_fragments_unveiling_label',
  },
  {
    up: migration_20261105_084432_add_founders_shared_image.up,
    down: migration_20261105_084432_add_founders_shared_image.down,
    name: '20261105_084432_add_founders_shared_image'
  },
];
