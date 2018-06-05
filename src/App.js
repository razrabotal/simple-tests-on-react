import React, { Component } from 'react';
import './App.css';
import Question from './components/Question';

class App extends Component{
	constructor(props){
		super(props);
    this.currentIteration = this.currentIteration.bind(this)
    
		this.state = { 
      dataCounter: 1,
      lol : props.prueba.questions,
      results: props.prueba.results,
      current: 1,
      points: 0,     
      list: [],
      showList: []
    };
	} 
  
  componentDidMount() {
    this.setState({
      list: [...this.state.lol]
    })
  }
  
  reload() {
    this.setState({
      points: 0,
      current: 1,
      dataCounter: this.state.dataCounter + 1
    });
  }
  
  currentIteration(e, correct) {
    e.preventDefault();
   
    if(correct) {
       this.setState({
        points: this.state.points + 1
        })
      }

      this.setState({
        current: this.state.current + 1,
      })
  }
  
  addToList(id) {
    var element = this.state.lol[id];

    this.setState({
        list: [element, ...this.state.list]
    });
    
    console.log(this.state.list);
  }

   render() {
     var showList = this.state.list.map((que,index) => {
          if(this.state.current >= que.id) {
             return <Question 
                key={`${this.state.dataCounter}_${index}`} 
                selected={false} 
                next2={que} 
                cur={this.state.current} 
                iteration={this.currentIteration}
                length={this.state.lol.length}
               />;
          }
          return null;
      });
     
     var showResultText = (() => {
       if(this.state.results) {
         for(var i of this.state.results) {
           if(i.points <= this.state.points) {
             return i.text;
           }
         }
       }
       return '';
     })();
     
     var showFinal = (this.state.current === this.state.lol.length+1) ? 
         <div className="q-result">
           <p>Вы набрали баллов: {this.state.points}</p>
           <p className="q-result-text">{showResultText}</p>
         </div> : '';
     
     var showProgress = (this.state.current > this.state.list.length) ? 
         <div className="q-reload" onClick={e => this.reload(e)}>
           <div className="refresh icon"></div>
         </div> : '';
    
    return (
      <div>    

        <div className="q-main-title">
          <h1 className="q-main-title-h1">{this.props.prueba.title}</h1>
          <p className="q-main-title-p">{this.props.prueba.descr}</p>
        </div>

        <div className="q-container">

          { showList }

          <div className="q-final">
            { showFinal }
            <div>{ showProgress }</div>
          </div>    
          
        </div>
      </div>
    );
   }
}

export default App;