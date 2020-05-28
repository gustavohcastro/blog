import React, {Component} from 'react';
import {Link, withRouter} from 'react-router-dom';

import firebase from '../../firebase';
import './new.css';

class New extends Component{
    constructor(props){
        super(props);

        this.state = {
            titulo : '',
            imagem : null,
            url : '',
            descricao : '',
            alert : '',
            progress : 0
        };

        this.cadastrar = this.cadastrar.bind(this);
        this.handleFile = this.handleFile.bind(this);
        this.handleUpload = this.handleUpload.bind(this);

    }

    componentDidMount(){
        if (!firebase.getCurrent()){
            this.props.history.replace('/login');
            return null;
        }

      
    }
    cadastrar = async(e) =>{
        e.preventDefault();

        if(this.state.titulo !== '' && 
            this.state.url !== '' &&
            this.state.imagem !== null && 
            this.state.url !== '' && 
            this.state.descricao !== ''){
            let posts = firebase.app.ref('posts');
            let chave = posts.push().key;
            await posts.child(chave).set({
                titulo : this.state.titulo,
                imagem : this.state.url,
                descricao : this.state.descricao,
                autor : localStorage.name
            })
            this.props.history.push('/dashboard')
        }else{
           this.setState({alert : 'Preencha todos os campos!'})
        }
    }

   handleFile = async (e) => {
       if(e.target.files[0]) {
            const image = e.target.files[0];

            if (image.type === 'image/png' || image.type === 'image/jpeg'){
                await this.setState({imagem : image})
                this.handleUpload();
            }else{
                alert("Envie uma imagem PNG ou JPEG");
                this.setState({image : null})
                return null;
            }
       }
       
    }
    handleUpload = async() => {
        const {imagem} = this.state;
        const currentUid = firebase.getCurrentUid();
        const uploadTaks = firebase.storage.ref(`images/${currentUid}/${imagem.name}`).put(imagem);

        await uploadTaks.on('state_changed', 
        (snapshot) => {
            //progesso
            const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
            this.setState({progress : progress})
        },
        (error) =>{
            //error
            console.log(error);
        },
        ()=>{
            //success
            firebase.storage.ref(`images/${currentUid}`)
            .child(imagem.name).getDownloadURL()
            .then( url => {
                this.setState({url : url})
            })
           
        })
    }
    render() {
        return(
            <div>
                <header id="new">
                    <Link to="/dashboard">Voltar</Link>
                </header>
                <form onSubmit={this.cadastrar} id="new-post">
                    <span>{this.state.alert}</span>
                    <label>Título</label><br/>
                    <input type='text' placeholder="Título do Post" autoFocus value={this.state.titulo}
                    onChange={(e) => {this.setState({titulo : e.target.value})}}/><br/>

                    <label>Imagem de Capa</label><br/>
                    <input type='file' onChange={this.handleFile}/><br/>
                    {this.state.url !== '' ?
                        <img src={this.state.url} width="250" height="150" alt="Capa do Post" />
                        :
                        <progress value={this.state.progress} max="100" />
                    }
                   
                    <label>Descrição</label><br/>
                    <textarea type='text' placeholder="Descrição" value={this.state.descricao}
                    onChange={(e) => {this.setState({descricao : e.target.value})}}/><br/>

                    <button type="submit">Cadastrar</button>
                </form>
            </div>
        )
    }
}

export default withRouter(New);