// back-end/test/model/User.test.ts

import { User } from '../../model/User';

describe('User Model', () => {
  it('should create a new User', () => {
    const user = new User('1', 'John Doe', 'john@example.com', 'password123', 'captain');
    expect(user).toBeInstanceOf(User);
    expect(user.name).toBe('John Doe');
    expect(user.role).toBe('captain');
  });
});
