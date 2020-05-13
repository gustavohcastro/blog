import React, {Component} from 'react';
import {withRouter } from 'react-router-dom';

import firebase from '../../firebase';
import './register.css'

class Register extends Component{

    constructor(props){
        super(props);
        this.state = {
            name : '',
            email : '',
            password : ''
        };
        this.register = this.register.bind(this);
        this.onRegister = this.onRegister.bind(this);
    }
    register(e){
        e.preventDefault();
        this.onRegister();
        
    }
 
    onRegister = async () => {
        try{
            const {name, email, password} = this.state;
            
            await firebase.register(email, password, name);
            this.props.history.replace('/dashboard')
        }catch(error){
            alert(error.message)
        }   
    }
    render(){
        return(
            <div>
                <h1 className="register-h1">Novo usuário</h1>
                <form id="register" onSubmit={this.register}> 
                    <label> Nome : </label> <br/>
                    <input placeholder="Nome Completo" type="text" value={this.state.name} autoFocus onChange={ (e)=> {
                    this.setState({name : e.target.value})}}/><br/>
                  
                    <label> Email : </label> <br/>
                    <input placeholder="teste@teste.com" type="text" value={this.state.email} autoFocus autoComplete="off" onChange={ (e)=> {
                    this.setState({email : e.target.value})}}/><br/>
                    
                    <label> Senha : </label> <br/>
                    <input placeholder="*******" type="password" value={this.state.password} autoFocus onChange={ (e)=> {
                    this.setState({password : e.target.value})}}/><br/>

                    <button type='submit'>Cadastrar</button>
                </form>
            </div>
        )
    }
}

export default withRouter(Register)