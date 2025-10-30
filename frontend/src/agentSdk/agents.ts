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
        name: 'Slack Reminder Agentt',
        description: 'An agent to manage and send reminders in Slack.k',
        triggerEvents: [
            {
                type: 'async',
                name: 'reminder textarea',
                description:
                    'When the user enters a reminder in the reminder text area and selects a date and time, the details are sent to the agent to create the reminder.'
            }
        ],
        config: {
            appId: 'sagar-test',
            accountId: '03eb9ecc-c83e-4471-a489-9ae04ba4c012',
            widgetKey: '3hM6TZxBPiMSKE2eCqY2YXwL5bnVR8WkMfQnG4qL'
        }
    }
];
