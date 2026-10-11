import { DataAPIClient } from '@datastax/astra-db-ts';

const client = new DataAPIClient(process.env.ASTRA_DB_APPLICATION_TOKEN!);

export const db = client.db(process.env.ASTRA_DB_API_ENDPOINT!, {
  keyspace: process.env.ASTRA_DB_NAMESPACE ?? 'default_keyspace',
});

// Collection helpers
export const collections = {
  profiles: () => db.collection('profiles'),
  providers: () => db.collection('providers'),
  tasks: () => db.collection('tasks'),
  ratings: () => db.collection('ratings'),
  payments: () => db.collection('payments'),
  conversations: () => db.collection('conversations'),
  messages: () => db.collection('messages'),
  notifications: () => db.collection('notifications'),
  task_locations: () => db.collection('task_locations'),
};
