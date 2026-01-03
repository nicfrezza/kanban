import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import type { User } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from './config';

// Inicializa o app (se ainda não foi inicializado)
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Registrar novo usuário
export const registerUser = async (email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    console.log('Usuário registrado:', userCredential.user.uid);
    return userCredential.user;
  } catch (error: any) {
    console.error('Erro ao registrar:', error);
    throw new Error(getErrorMessage(error.code));
  }
};

// Fazer login
export const loginUser = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log('Usuário logado:', userCredential.user.uid);
    return userCredential.user;
  } catch (error: any) {
    console.error('Erro ao fazer login:', error);
    throw new Error(getErrorMessage(error.code));
  }
};

// Fazer logout
export const logoutUser = async () => {
  try {
    await signOut(auth);
    console.log('Usuário deslogado');
  } catch (error) {
    console.error('Erro ao fazer logout:', error);
    throw error;
  }
};

// Observar mudanças no estado de autenticação
export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

// Obter usuário atual
export const getCurrentUser = () => {
  return auth.currentUser;
};

// Mensagens de erro em português
const getErrorMessage = (errorCode: string): string => {
  const errorMessages: { [key: string]: string } = {
    'auth/email-already-in-use': 'Este email já está em uso',
    'auth/invalid-email': 'Email inválido',
    'auth/operation-not-allowed': 'Operação não permitida',
    'auth/weak-password': 'Senha muito fraca. Use pelo menos 6 caracteres',
    'auth/user-disabled': 'Usuário desabilitado',
    'auth/user-not-found': 'Usuário não encontrado',
    'auth/wrong-password': 'Senha incorreta',
    'auth/too-many-requests': 'Muitas tentativas. Tente novamente mais tarde',
    'auth/network-request-failed': 'Erro de conexão. Verifique sua internet'
  };

  return errorMessages[errorCode] || 'Erro ao autenticar. Tente novamente.';
};

export { auth };