import React, { Component } from 'react';
import './Results.css';


class Results extends Component{
	constructor(props){
    super(props);

    this.state = {

    }
  } 

  render() {
    const calcPercent = Math.round(this.props.points / this.props.questions.length * 100),
      maxOffset = 30,
      offsetForAnimation = maxOffset - Math.round(maxOffset * calcPercent / 100);
    
    const styles = {
      animation: "circle" + offsetForAnimation + " 2s forwards"
    };

    const showResultText = (() => {
      if(this.props.results) {
        for(var i of this.props.results) {
          if(i.points <= this.props.points) {
            return i.text;
          }
        }
      }
      return '';
    })();

    const showReload = (this.props.current > this.props.questions.length) && 
          <div className="q-reload" onClick={ () => this.props.reload() }>
            <svg xmlns="http://www.w3.org/2000/svg" className="reload-icon" viewBox="0 0 8.88 7.57">
              <path d="M5.09.5A3.28,3.28,0,1,1,2.34,2"/>
              <polyline points="0.19 2.88 2.34 1.99 3.48 3.78"/>
            </svg>
          </div>;

    return ( <div className="q-final">
      <div className="q-result">
        <div className="q-result-circle">
          
          <svg xmlns="http://www.w3.org/2000/svg" className="svg-result svg-result--background" viewBox="0 0 10.55 10.55">
            <path d="M5.27.5A4.77,4.77,0,1,1,.5,5.27,4.77,4.77,0,0,1,5.27.5"/>
          </svg>      
          <svg xmlns="http://www.w3.org/2000/svg" style={styles} className="svg-result" viewBox="0 0 10.55 10.55">
            <path d="M5.27.5A4.77,4.77,0,1,1,.5,5.27,4.77,4.77,0,0,1,5.27.5"/>
          </svg>

          <div className="q-result-counts">
            { this.props.points }/{ this.props.questions.length }
          </div>  
          <div className="q-result-percent">
            { calcPercent }%
          </div> 
        </div>    
            
        <p className="q-result-text">
          {showResultText} 
        </p>
      </div>
      
      <div className="q-reload-icon">
        { showReload }
      </div>
    </div>
    );
   }
}

export default Results;