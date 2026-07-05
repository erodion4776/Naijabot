import { TriggerType, ConditionType, ActionType, Rule } from './types';
import { prisma } from '../database/prisma/client';
import { eventBus } from '../events/EventBus';
import { BotEvent, EventType } from '../events/types';
import { WorkflowEngine } from './WorkflowEngine';

export class RuleEngine {
  private workflowEngine = new WorkflowEngine();

  constructor() {
    this.setupListeners();
  }

  private setupListeners() {
    // Listen to all events and check rules
    Object.values(EventType).forEach((type) => {
      eventBus.on(type as EventType, this.checkRules.bind(this));
    });
  }

  private async checkRules(event: BotEvent) {
    const rules = await prisma.rule.findMany({
      where: {
        enabled: true,
        trigger: event.type,
      },
      orderBy: { priority: 'desc' },
    });

    for (const rule of rules) {
      if (this.evaluateConditions(rule, event)) {
        await this.workflowEngine.run(rule.actions as any, event);
      }
    }
  }

  private evaluateConditions(rule: Rule, event: BotEvent): boolean {
    // Logic to evaluate conditions from JSON
    return true; // Simplified for now
  }
}
