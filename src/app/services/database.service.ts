import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  constructor(private firestore: AngularFirestore) { }

  async agregarUsuario(user: any, coleccion: string) {
    try {
      // Crear una referencia al documento, usando el uid del usuario como ID del documento
      const userDocRef = this.firestore.collection(coleccion).doc(user.id); 

      // Guardar el documento en Firestore
      await userDocRef.set({ ...user });

      console.log('Usuario agregado exitosamente con ID:', user.id);
    } catch (error) {
      console.error('Error al agregar el usuario:', error);
    }
  }

  async agregarDocumento(data: any, coleccion: string) {
    try {

      const id = this.firestore.createId();

      data.id = id;

      const docRef = this.firestore
        .collection(coleccion)
        .doc(id);

      await docRef.set({
        ...data
      });

      console.log(`${coleccion} agregado correctamente con ID:`, id);

      return id;

    } catch (error) {

      console.error(`Error al agregar en ${coleccion}:`, error);

      throw error;
    }
  }

  traerUsuario(user: string){
    const collectionUsuarios = this.firestore.collection(user);
    const observable = collectionUsuarios.valueChanges();
    return observable;
  }

  traerColeccion<T>(coleccion: string) {

    return this.firestore
      .collection<T>(coleccion)
      .valueChanges();
  }

  modificarDocumento(doc: any, coleccion: string){
    const collectionRef = this.firestore.collection(coleccion);
    const documento = collectionRef.doc(doc.id);
    documento.update({... doc});
  }

  eliminarDocumento(doc: any, coleccion: string){
    const collectionRef = this.firestore.collection(coleccion);
    const documento = collectionRef.doc(doc.id);
    documento.delete();
  }

  async obtenerDocumentoPorId(id: string, coleccion: string): Promise<any> {
    try {
      const collectionRef = this.firestore.collection(coleccion, ref => ref.where('id', '==', id));
      // Ejecuta la consulta
      const querySnapshot = await collectionRef.get().toPromise(); 
      
      if (querySnapshot && !querySnapshot.empty) {
        // Obtengo el primer documento que coincide
        const docSnap = querySnapshot.docs[0]; 
  
        // Obtengo los datos del documento 
        const data: any = docSnap.data();
  
        console.log('Usuario encontrado:', data['name']);
        return data; 
      } else {
        console.log('No se encontró el usuario con el UID proporcionado.');
        return null;
      }
    } catch (error) {
      console.error('Error obteniendo el usuario:', error);
      return null;
    }
  }
  
}
