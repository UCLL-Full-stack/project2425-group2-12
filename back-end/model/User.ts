export class User {
  user_id: string;
  name: string;
  email: string;
  password: string;
  role: 'captain' | 'player';

  constructor(
    user_id: string,
    name: string,
    email: string,
    password: string,
    role: 'captain' | 'player'
  ) {
    if (!user_id) throw new Error("User ID is required");
    if (!name) throw new Error("Name is required");
    if (!email || !this.isValidEmail(email)) throw new Error("Valid email is required");
    if (!password) throw new Error("Password is required");
    if (!role) throw new Error("Role is required");

    this.user_id = user_id;
    this.name = name;
    this.email = email;
    this.password = password;
    this.role = role;
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
