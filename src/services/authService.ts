// Simplified authentication service for demo purposes
// In a real app, this would connect to a backend API

interface User {
  id: string;
  username: string;
  name: string;
  email: string;
  password?: string; // Made optional with ? since not all User objects need it
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
}

// Mock user data for demo
const MOCK_USERS: User[] = [
  {
    id: '1',
    username: 'merveeksi',
    name: 'Merve Eksi',
    email: 'merve@example.com',
    password: '123merve123!!',
  },
  {
    id: '2',
    username: 'alpgiray',
    name: 'Alp Giray',
    email: 'alp@example.com',
    password: '123giray123!!',
  },
];

// Get user from local storage
const getUserFromStorage = (): User | null => {
  if (typeof window === 'undefined') return null;
  
  const userJson = localStorage.getItem('user');
  return userJson ? JSON.parse(userJson) : null;
};

// Save user to local storage
const saveUserToStorage = (user: User): void => {
  if (typeof window === 'undefined') return;
  
  localStorage.setItem('user', JSON.stringify(user));
};

// Remove user from local storage
const removeUserFromStorage = (): void => {
  if (typeof window === 'undefined') return;
  
  localStorage.removeItem('user');
};

// Login function (mock implementation)
export const login = async (credentials: LoginCredentials): Promise<User> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // In a real app, this would validate credentials against a backend
  // For demo, we'll just return a successful login if email matches
  const user = MOCK_USERS.find(u => u.email === credentials.email);
  
  if (!user) {
    throw new Error('Kullanıcı adı veya şifre hatalı');
  }
  
  // Save to localStorage
  saveUserToStorage(user);
  
  return user;
};

// Register function (mock implementation)
export const register = async (credentials: RegisterCredentials): Promise<User> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Check if user already exists
  if (MOCK_USERS.some(u => u.email === credentials.email)) {
    throw new Error('Bu e-posta adresi zaten kullanılıyor');
  }
  
  // Create new user (in a real app, this would be done on the backend)
  const newUser: User = {
    id: `${MOCK_USERS.length + 1}`,
    username: credentials.email.split('@')[0],
    name: credentials.name,
    email: credentials.email,
  };
  
  // Add to mock users (in a real app, this would be saved in the database)
  MOCK_USERS.push(newUser);
  
  // Save to localStorage
  saveUserToStorage(newUser);
  
  return newUser;
};

// Logout function
export const logout = (): void => {
  removeUserFromStorage();
};

// Get current user
export const getCurrentUser = (): User | null => {
  return getUserFromStorage();
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  return getUserFromStorage() !== null;
}; 