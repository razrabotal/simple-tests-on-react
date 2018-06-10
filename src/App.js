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

    var calcPercent = Math.round(this.state.points / this.state.lol.length * 100);
     
    const maxOffset = 31;
    var offsetForAnimation = maxOffset - Math.round(maxOffset * calcPercent / 100);
    var styles = {
      animation: "circle" + offsetForAnimation + " 2s forwards"
    };

    var showFinal = (this.state.current === this.state.lol.length+1) ? 
        <div className="q-result">

          <div className="q-result-circle">
            <svg xmlns="http://www.w3.org/2000/svg" class="svg-result svg-result--background" viewBox="0 0 10.61 10.61"><path d="M5.31.5A4.81,4.81,0,1,1,.5,5.31,4.81,4.81,0,0,1,5.31.5"/></svg>  
            <svg xmlns="http://www.w3.org/2000/svg" style={styles} class="svg-result" viewBox="0 0 10.61 10.61"><path d="M5.31.5A4.81,4.81,0,1,1,.5,5.31,4.81,4.81,0,0,1,5.31.5"/></svg>
          
            <div className="q-result-counts">
              { this.state.points }/{ this.state.lol.length }
            </div>  
            <div className="q-result-percent">
              { calcPercent }%
          </div> 
          </div>

                
          
          <p className="q-result-text">
            {showResultText} 
          </p>
        </div> : '';
     
    var showReload = (this.state.current > this.state.list.length) ? 
         <div className="q-reload" onClick={e => this.reload(e)}>
           <svg xmlns="http://www.w3.org/2000/svg" className="reload-icon" viewBox="0 0 8.88 7.57"><path d="M5.09.5A3.28,3.28,0,1,1,2.34,2"/><polyline points="0.19 2.88 2.34 1.99 3.48 3.78"/></svg>
         </div> : '';
    
    var showCircles = () => { 
      let mass = [];
      for(let i = 1; i <= this.state.list.length-this.state.current; i++) {
        mass = [...mass, <div className="q-title-number q-title-number--list">{this.state.current + i}</div>];
      } 
      return <div className="q-circles"> { mass } </div>;
    };

    return (
      <div>    

        <div className="q-main-title">
          <h1 className="q-main-title-h1">{this.props.prueba.title}</h1>
          <p className="q-main-title-p">{this.props.prueba.descr}</p>
        </div>

        <div className="q-container">

          { showList }

          { showCircles() }
 
          <div className="q-final">
            { showFinal }
            <div>{ showReload }</div>
          </div>    
          
        </div>
      </div>
    );
   }
}

export default App;