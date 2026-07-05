import { BotEvent } from '../events/types';
import { ActionType } from './types';

export class WorkflowEngine {
  async run(actions: { type: ActionType; params: any }[], event: BotEvent) {
    for (const action of actions) {
      await this.executeAction(action, event);
    }
  }

  private async executeAction(action: { type: ActionType; params: any }, event: BotEvent) {
    // Action execution logic
    console.log(`Executing action: ${action.type}`);
  }
}
