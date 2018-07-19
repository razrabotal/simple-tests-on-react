import React, { Component } from 'react';
import './App.css';
import Question from './components/Question';
import Results from './components/Results';


class App extends Component{
	constructor(props){
		super(props);
    this.currentIteration = this.currentIteration.bind(this);
    this.reload = this.reload.bind(this)

		this.state = { 
      questions: props.data.questions,

      dataCounter: 1,    
      results: props.data.results,
      current: 1,
      points: 0,     
      list: [],
      showList: [],
      gettedRes: [],
      onVote: false,
      userAnswers: [],

      questionListDisplay: "SINGLE"
    };

  } 
  
  parseResultsString(str) {  
    let array = str.split(";");
    for(let i = 0; i < array.length; i++) {
      array[i] = array[i].split(",").map(item => parseInt(item,10));
    } 
    return array;
  }
  
  createInitialResults() {
    let initialResult = [];
    for(let item of this.state.questions) {
      var temprray = [];
      for(let itemitem of item.an) {
        if(itemitem) {
          temprray.push(0);
        }
      }
      initialResult.push(temprray.join(","));
    }
    initialResult = initialResult.join(";");

    return initialResult;
  }

  setInitialState(qkey) {
    let init = this.createInitialResults();
    
    this.setState({ 
      gettedRes: this.parseResultsString( init ) 
    });
    
    fetch(`http://taras.top/svalka/test.php?qkey=${qkey}&result=${init}`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    })
  }

  componentDidMount() {
    this.setState({
      list: [...this.state.questions]
    })

    if(this.props.data.qkey) {
      let qkey = this.props.data.qkey;

      fetch(`http://taras.top/svalka/test.php?qkey=${qkey}`)
        .then(response => response.json())
        .then(data => { 
          if(data[0]) {     
            this.setState({ gettedRes: this.parseResultsString(data[0].result) }) 
          } else {
            this.setInitialState(qkey);
          }
        });
    }
  }
  
  reload(dataCounter) {
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

  // This method to Display next question or to Display button with arrow (next) 
  voteFinalStep() {
    switch( this.state.questionListDisplay ) {
      case "LIST_REVERSE": {
        this.setState({
          current: this.state.current + 1,
          onVote: false
        });
        break;
      }
      case "SINGLE": {
        this.setState({
          onVote: true
        });
        break;
      }
      default: {}
    }
  }

  wtitingResults(index, statistics) {
    let gettedRes = this.state.gettedRes;
    gettedRes[index] = statistics;

    let finalRes = [];
    for(let item of gettedRes) {
      finalRes.push(item.join(","));
    }
    finalRes = finalRes.join(";");

    if(this.props.data.qkey) {
      let qkey = this.props.data.qkey;
      fetch(`http://taras.top/svalka/test.php?qkey=${qkey}&result=${finalRes}`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      })
    }
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

    this.voteFinalStep();
    this.wtitingResults(index, statistics);
  }
  
  // addToList(id) {
  //   var element = this.state.questions[id];

  //   this.setState({
  //       list: [element, ...this.state.list]
  //   });
    
  //   console.log(this.state.list);
  // }

  optionForRenderQuestionsList(current, id, option) {
    switch( this.state.questionListDisplay ) {
      case "LIST_REVERSE": return current >= id;
      case "SINGLE": return current === id;
      default: return 0;
    }
  }

  render() {
     var showList = this.state.list.slice(0).reverse().map((que,index) => {
          if(this.optionForRenderQuestionsList(this.state.current, +que.id, this.state.questionListDisplay)) {
             return <Question 
                key={`${this.state.dataCounter}_${index}`} 
                index={index}
                selected={false} 
                next2={que} 
                cur={this.state.current} 
                iteration={this.currentIteration}
                length={this.state.questions.length}
                statistics={this.state.gettedRes[index]}
                questionListDisplay = {this.state.questionListDisplay}
                // nextQue={this.nextQue}
               />;
          }
          return null;
      });
     




  var showNext = () => this.state.onVote && (
    <div className="q-next" onClick={this.nextQue}>
      <span className="q-next__button">
        <span className="q-next__arrow"></span>
      </span>
    </div>);

   

    
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
      <h1 className="q-main-title-h1">{this.props.data.title}</h1>
      <p className="q-main-title-p">{this.props.data.descr}</p>
    </div> : "";


    const showFinal = (this.state.current === this.state.questions.length + 1) && <Results reload={this.reload} {...this.state}/>;



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