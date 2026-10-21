import * as migration_20261021_131250_baseline from './20261021_131250_baseline';
import * as migration_20261021_131332_add_blog_sidebar_cta from './20261021_131332_add_blog_sidebar_cta';

export const migrations = [
  {
    up: migration_20261021_131250_baseline.up,
    down: migration_20261021_131250_baseline.down,
    name: '20261021_131250_baseline',
  },
  {
    up: migration_20261021_131332_add_blog_sidebar_cta.up,
    down: migration_20261021_131332_add_blog_sidebar_cta.down,
    name: '20261021_131332_add_blog_sidebar_cta'
  },
];
