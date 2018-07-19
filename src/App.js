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
      showList: [],
      gettedRes: [],
      onVote: false,
      userAnswers: []
    };

  } 
  
  parseResultsString(str) {  
    let array = str.split(";");
    for(let i = 0; i < array.length; i++) {
      array[i] = array[i].split(",").map(item => parseInt(item,10));
    } 
    return array;
  }
  

  componentDidMount() {
    this.setState({
      list: [...this.state.lol]
    })

  
    if(this.props.prueba.qkey) {
      let qkey = this.props.prueba.qkey;
      fetch(`http://taras.top/svalka/test.php?qkey=${qkey}`)
      .then(response => response.json())
      .then(data => { 
        if(data[0]) {     
           this.setState({ gettedRes: this.parseResultsString(data[0].result) }) 
          }
        });
        
      let initialResult = [];
      for(let item of this.state.lol) {
        var temprray = [];
        for(let itemitem of item.an) {
          if(itemitem) {
            temprray.push(0);
          }
        }
        initialResult.push(temprray.join(","));
      }
      initialResult = initialResult.join(";");

      this.setState({ 
        gettedRes: this.parseResultsString(initialResult) 
      });

      if(this.state.gettedRes === [] ) {
        fetch(`http://taras.top/svalka/test.php?qkey=${qkey}&result=${initialResult}`, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          }
        })
      }
    }

  }
  
  reload() {
    this.setState({
      points: 0,
      current: 1,
      dataCounter: this.state.dataCounter + 1,
      userAnswers: []
    });
  }
  
  nextQue = () => {
    this.setState({
      current: this.state.current + 1,
      onVote: false
    });
  }

  currentIteration(e, correct, index, statistics) {
    e.preventDefault();
   
    if(correct) {
       this.setState({
        points: this.state.points + 1,
        userAnswers: [...this.state.userAnswers, 'yes']
      })
    } else {
      this.setState({
        userAnswers: [...this.state.userAnswers, 'no']
      })
    }

    this.setState({
      current: this.state.current + 1,
      onVote: false
    });

    // this.setState({
    //   onVote: true
    // });
    
    let gettedRes = this.state.gettedRes;
    gettedRes[index] = statistics;

    let finalRes = [];
    for(let item of gettedRes) {
      finalRes.push(item.join(","));
    }
    finalRes = finalRes.join(";");

    if(this.props.prueba.qkey) {
      let qkey = this.props.prueba.qkey;
      fetch(`http://taras.top/svalka/test.php?qkey=${qkey}&result=${finalRes}`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      })
    }
  }
  
  addToList(id) {
    var element = this.state.lol[id];

    this.setState({
        list: [element, ...this.state.list]
    });
    
    console.log(this.state.list);
  }

   render() {
     var showList = this.state.list.slice(0).reverse().map((que,index) => {
          if(this.state.current >= +que.id) {
             return <Question 
                key={`${this.state.dataCounter}_${index}`} 
                index={index}
                selected={false} 
                next2={que} 
                cur={this.state.current} 
                iteration={this.currentIteration}
                length={this.state.lol.length}
                statistics={this.state.gettedRes[index]}
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
     
    const maxOffset = 30;
    var offsetForAnimation = maxOffset - Math.round(maxOffset * calcPercent / 100);
    var styles = {
      animation: "circle" + offsetForAnimation + " 2s forwards"
    };

    var showNext = () => (this.state.onVote) ? <div className="q-next" onClick={this.nextQue}><span></span></div> : "";

   
    var showReload = (this.state.current > this.state.list.length) ? 
         <div className="q-reload" onClick={e => this.reload(e)}>
           <svg xmlns="http://www.w3.org/2000/svg" className="reload-icon" viewBox="0 0 8.88 7.57"><path d="M5.09.5A3.28,3.28,0,1,1,2.34,2"/><polyline points="0.19 2.88 2.34 1.99 3.48 3.78"/></svg>
         </div> : '';
    
    // var showCircles = () => { 
    //   let mass = [];
    //   for(let i = 1; i <= this.state.list.length-this.state.current; i++) {
    //     mass = [...mass, <div className="q-title-number q-title-number--list"></div>];
    //   } 
    //   return <div className="q-circles"> { mass } </div>;
    // };

    var showCircles = () => { 
      let mass = [];



      for(let i = 0; i <= this.state.list.length - 1; i++) {
        if(this.state.userAnswers[i] === 'yes') {
          mass = [...mass, <div className="q-circle-ok"></div>];
        } else if(this.state.userAnswers[i] === 'no') {
          mass = [...mass, <div className="q-circle-no"></div>];
        } else if(this.state.current - 1 === i) {
          mass = [...mass, <div className="q-circle-current"></div>];
        }
        else{
          mass = [...mass, <div className="q-circle-null"></div>];
        }
      } 
      return <div className="q-circles"> { mass } </div>;

      // let mass = [];
      // for(let i = 1; i <= this.state.list.length-this.state.current; i++) {
      //   mass = [...mass, <div className="q-title-number q-title-number--list"></div>];
      // } 
      // return <div className="q-circles"> { mass } </div>;
    };

    var showTitle = () => (this.state.current === 1 || true) ?
    <div className="q-main-title">
      <h1 className="q-main-title-h1">{this.props.prueba.title}</h1>
      <p className="q-main-title-p">{this.props.prueba.descr}</p>
    </div> : "";

    var showFinal = (this.state.current === this.state.lol.length+1) ? <div className="q-final">
    <div className="q-result">

      <div className="q-result-circle">
        <svg xmlns="http://www.w3.org/2000/svg" className="svg-result svg-result--background" viewBox="0 0 10.55 10.55"><path d="M5.27.5A4.77,4.77,0,1,1,.5,5.27,4.77,4.77,0,0,1,5.27.5"/></svg>
        <svg xmlns="http://www.w3.org/2000/svg" style={styles} className="svg-result" viewBox="0 0 10.55 10.55"><path d="M5.27.5A4.77,4.77,0,1,1,.5,5.27,4.77,4.77,0,0,1,5.27.5"/></svg>
        {/* <svg xmlns="http://www.w3.org/2000/svg" className="svg-result svg-result--background" viewBox="0 0 10.61 10.61"><path d="M5.31.5A4.81,4.81,0,1,1,.5,5.31,4.81,4.81,0,0,1,5.31.5"/></svg>  
        <svg xmlns="http://www.w3.org/2000/svg" style={styles} className="svg-result" viewBox="0 0 10.61 10.61"><path d="M5.31.5A4.81,4.81,0,1,1,.5,5.31,4.81,4.81,0,0,1,5.31.5"/></svg>
      */}
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
    </div>
    <div className="q-reload-icon">{ showReload }</div>
    </div> : '';



    return (
      <div>    

        
        { showTitle() }

  
            { showCircles() }



            <div className="q-container">

            { showFinal }
            

            

              <div className="q-question-list">
                
               
                { showList }
                
              </div>

              
          </div>    

             { showNext() }       
            </div>    
             
          
        
    );
   }
}

export default App;