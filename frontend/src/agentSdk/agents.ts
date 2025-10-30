import { type ZodSchema } from 'zod';

type TriggerEvent =
    | {
          type: 'async';
          name: string;
          description: string;
      }
    | {
          type: 'sync';
          name: string;
          description: string;
          outputSchema: ZodSchema;
      };

export type AgentConfig = {
    id: string;
    name: string;
    description: string;
    triggerEvents: TriggerEvent[];
    config: {
        appId: string;
        accountId: string;
        widgetKey: string;
    };
};
export const AGENT_CONFIGS: AgentConfig[] = [
    {
        id: '833aa20d-fbac-4594-85f7-b174496033f4',
        name: 'Slack Reminder Agent',
        description: 'An agent to manage and send reminders in Slack.',
        triggerEvents: [
            {
                type: 'async',
                name: 'reminder_created',
                description:
                    'When the user creates a reminder with text and datetime, the details are sent to the agent to schedule the reminder in Slack.'
            }
        ],
        config: {
            appId: 'sagar-test',
            accountId: '03eb9ecc-c83e-4471-a489-9ae04ba4c012',
            widgetKey: '3hM6TZxBPiMSKE2eCqY2YXwL5bnVR8WkMfQnG4qL'
        }
    }
];
