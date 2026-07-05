import { logger } from '../../logger';
import { eventBus } from '../../events/EventBus';
import { EventType } from '../../events/types';

export interface Plugin {
  name: string;
  run: () => Promise<void>;
}

export class PluginManager {
  private plugins: Plugin[] = [];

  register(plugin: Plugin) {
    this.plugins.push(plugin);
    eventBus.emit(EventType.PLUGIN_TOGGLED, { pluginName: plugin.name, enabled: true });
    logger.info({ plugin: plugin.name }, 'Registered new plugin');
  }

  async runAll() {
    for (const plugin of this.plugins) {
      try {
        await plugin.run();
      } catch (error) {
        logger.error({ error, plugin: plugin.name }, 'Plugin execution failed');
      }
    }
  }
}
