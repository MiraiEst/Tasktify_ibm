// Simple client-side user identity using localStorage
// In a real app this would come from an auth provider (NextAuth, Clerk, etc.)

const USER_KEY = 'tasktify_user_id';

export function getUserId(): string {
  if (typeof window === 'undefined') return 'guest';
  let id = localStorage.getItem(USER_KEY);
  if (!id) {
    id = `user-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    localStorage.setItem(USER_KEY, id);
  }
  return id;
}
