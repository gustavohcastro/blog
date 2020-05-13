import app from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';


let firebaseConfig = {
    apiKey: "AIzaSyAsytaLYrtCVTfmo2A7z-pEPPDghJU5udk",
    authDomain: "reactapp-92bf6.firebaseapp.com",
    databaseURL: "https://reactapp-92bf6.firebaseio.com",
    projectId: "reactapp-92bf6",
    storageBucket: "reactapp-92bf6.appspot.com",
    messagingSenderId: "226444739195",
    appId: "1:226444739195:web:9aae0c99a3144f3a3b58de",
    measurementId: "G-50W857YTZD"
}


class Firebase{
    constructor(){
        app.initializeApp(firebaseConfig);

        //Referenciando a databse para acessar em outros locais
        this.app = app.database();
    }

    login(email, password){
        return app.auth().signInWithEmailAndPassword(email, password)
    }
    logout(){
        return app.auth().signOut();
    }
    async register(email, password, name){
        await app.auth().createUserWithEmailAndPassword(email, password);

        const uid = app.auth().currentUser.uid;

        return app.database().ref('usuarios').child(uid).set({
            name : name
        })
    }
    isInitialized(){
        return new Promise(resolve => {
            app.auth().onAuthStateChanged(resolve);
        })
    }

    getCurrent(){
        return app.auth().currentUser && app.auth().currentUser.email
    }
    async getUserName(callback){
        if(!app.auth().currentUser){
            return null;
        }
        const uid = app.auth().currentUser.uid;
        await app.database().ref('usuarios').child(uid).once('value').then(callback);
        }

}

export default new Firebase();