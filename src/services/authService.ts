import { User, RegisterData, LoginData } from "../types";
import { storage, STORAGE_KEYS } from "../utils/storage";
import {
  generateId,
  delay,
  hashPassword,
  verifyPassword,
  generateToken,
  verifyToken,
  initializeDemoData,
} from "./mockData";

const generateVerificationCode = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

class AuthService {
  // Register new user
  async register(data: RegisterData): Promise<User> {
    await delay();

    // Get existing users
    const users: (User & { password: string })[] =
      storage.get("fintrack_users") || [];

    // Check if email already exists
    const existingUser = users.find((u) => u.email === data.email);
    if (existingUser) {
      throw new Error("Email already registered");
    }

    const verificationCode = generateVerificationCode();

    // Create new user
    const newUser: User & { password: string } = {
      id: generateId(),
      name: data.name,
      email: data.email,
      password: hashPassword(data.password),
      createdAt: new Date().toISOString(),
      verified: false,
      verificationCode,
    };

    // Save user
    users.push(newUser);
    storage.set("fintrack_users", users);

    // Initialize empty data for new user (demo only)
    initializeDemoData();

    const { password, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  }

  // Login user
  async login(data: LoginData): Promise<{ user: User; token: string }> {
    await delay();

    // Get existing users
    const users: (User & { password: string })[] =
      storage.get("fintrack_users") || [];

    // Find user by email
    const user = users.find((u) => u.email === data.email);
    if (!user) {
      throw new Error("Invalid email or password");
    }

    // Verify password
    if (!verifyPassword(data.password, user.password)) {
      throw new Error("Invalid email or password");
    }

    if (!user.verified) {
      throw new Error(
        "Email not verified. Please verify your email before logging in.",
      );
    }

    // Generate token
    const token = generateToken(user.id);

    // Return user without password
    const { password, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, token };
  }

  // Verify email with OTP code
  async verifyEmail(email: string, code: string): Promise<void> {
    await delay(200);

    const users: (User & { password?: string; verificationCode?: string })[] =
      storage.get("fintrack_users") || [];

    const user = users.find((u) => u.email === email);
    if (!user) {
      throw new Error("Email not found");
    }

    if (user.verified) {
      throw new Error("Email already verified");
    }

    if (user.verificationCode !== code) {
      throw new Error("Invalid verification code");
    }

    const updatedUser = {
      ...user,
      verified: true,
      verificationCode: undefined,
    };

    const updatedUsers = users.map((u) => (u.id === user.id ? updatedUser : u));
    storage.set("fintrack_users", updatedUsers);
  }

  // Get current user profile
  async getProfile(): Promise<User> {
    await delay(200);

    const token = storage.get<string>(STORAGE_KEYS.TOKEN);
    if (!token) {
      throw new Error("Not authenticated");
    }

    const payload = verifyToken(token);
    if (!payload) {
      throw new Error("Invalid or expired token");
    }

    const users: (User & { password?: string })[] =
      storage.get("fintrack_users") || [];
    const user = users.find((u) => u.id === payload.userId);

    if (!user) {
      throw new Error("User not found");
    }

    // Return user without password
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  // Logout user
  async logout(): Promise<void> {
    await delay(200);
    storage.remove(STORAGE_KEYS.TOKEN);
    storage.remove(STORAGE_KEYS.USER);
  }

  // Delete the current user account
  async deleteAccount(): Promise<void> {
    await delay(200);
    const token = storage.get<string>(STORAGE_KEYS.TOKEN);
    if (!token) {
      throw new Error("Not authenticated");
    }

    const payload = verifyToken(token);
    if (!payload) {
      throw new Error("Invalid or expired token");
    }

    const users: (User & { password?: string })[] =
      storage.get("fintrack_users") || [];
    const updatedUsers = users.filter((u) => u.id !== payload.userId);

    if (updatedUsers.length === users.length) {
      throw new Error("User not found");
    }

    storage.set("fintrack_users", updatedUsers);
    storage.remove(STORAGE_KEYS.TOKEN);
    storage.remove(STORAGE_KEYS.USER);
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    const token = storage.get<string>(STORAGE_KEYS.TOKEN);
    if (!token) return false;

    const payload = verifyToken(token);
    return payload !== null;
  }

  // Get current user ID from token
  getCurrentUserId(): string | null {
    const token = storage.get<string>(STORAGE_KEYS.TOKEN);
    if (!token) return null;

    const payload = verifyToken(token);
    return payload?.userId || null;
  }
}

export const authService = new AuthService();
