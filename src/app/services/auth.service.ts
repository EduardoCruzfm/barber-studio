import { Injectable } from '@angular/core';
import { Auth,signInWithEmailAndPassword, onAuthStateChanged,createUserWithEmailAndPassword, sendEmailVerification , User, UserCredential, signOut} from '@angular/fire/auth';
import { BehaviorSubject } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private userLoggedInSubject = new BehaviorSubject<boolean>(false);
  private userEmailSubject = new BehaviorSubject<string | null>(null);

  userLoggedIn$ = this.userLoggedInSubject.asObservable();
  userEmail$ = this.userEmailSubject.asObservable();

    constructor(private auth: Auth) {
    this.checkAuthState();
  }

  // Verifica el estado de autenticación del usuario
  private checkAuthState() {

    onAuthStateChanged(this.auth, (user: User | null) => {
      const isLoggedIn = !!user;
      const email = user ? user.email : null;
      console.log('Usuario autenticado:', isLoggedIn, 'Email:', email); // test
      this.userLoggedInSubject.next(isLoggedIn); // Actualiza el estado de autenticación
      this.userEmailSubject.next(email); // Actualiza el correo del usuario
    });
  }

  // Método para obtener el estado del usuario logueado directamente
  isLoggedIn(): boolean {
    return this.userLoggedInSubject.value;
  }

  // Método para iniciar sesión 
  login(email: string, password: string): Promise<UserCredential> {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  // Método para registrar usuario
  register(email: string, password: string) {
    return createUserWithEmailAndPassword(this.auth, email, password);
  }

  // Método para cerrar sesión
  logout(): Promise<void> {
    return signOut(this.auth);
  }

   // Devuelve el usuario actual
   getCurrentUser(): User | null {
    return this.auth.currentUser; 
  }
 
}
