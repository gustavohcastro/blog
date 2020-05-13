import React, {Component} from 'react';
import firebase from '../../firebase';

import './home.css';

class Home extends Component{
    state = {
        posts : []
    }
  
    componentDidMount(){
        
        firebase.app.ref('posts').once('value', (snapshot)  => {
            let state = this.state;
            state.posts = [];

           
            snapshot.forEach((childItem) =>{
                state.posts.push({
                    key: childItem.key,
                    titulo : childItem.val().titulo,
                    imagem : childItem.val().imagem,
                    autor : childItem.val().autor,
                    descricao : childItem.val().descricao
                })
            })
            state.posts.reverse();
            this.setState(state)
            
        })
    }

    render(){
        return(
            <section id="post">
                {this.state.posts.map((post)=>{
                    
                    return(
                        <article key={post.key} >
                            <header>
                                <div className="title">
                                    <strong>{post.titulo}</strong>
                                    <span>{post.autor}</span>
                                </div>
                            </header>
                            <img alt="Capa do post" src={post.imagem}  />
                            <footer>
                                <p>{post.descricao}</p>
                            </footer>
                        </article>
                    )
                })}
            </section>
        )
    }
}
export default Home;
