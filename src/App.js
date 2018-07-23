import React, { Component } from 'react';
import './App.css';
import Question from './components/Question/Question';
import Results from './components/Results';


class App extends Component{
	constructor(props){
		super(props);
    this.currentIteration = this.currentIteration.bind(this);
    this.reload = this.reload.bind(this)

		this.state = { 
      mainInfo: {
        title: '',
        desrc: ''
      },
      questions: [],
      questionListDisplay: "SINGLE",
      dataCounter: 1,    
      results: [],
      current: 1,
      points: 0,     
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
  
  createInitialResults() {
    let initialResult = [];
    for(let item of this.state.questions) {
      let tempArray = [];
      for(let itemitem of item.an) {
        if(itemitem) {
          tempArray.push(0);
        }
      }
      initialResult.push(tempArray.join(","));
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
    if(this.props.data) {
      const data = this.props.data;

      this.setState({
        questions: (data.hasOwnProperty("questions")) && this.props.data.questions,
        results: (data.hasOwnProperty("results")) && this.props.data.results,
        mainInfo: {
          title: (data.hasOwnProperty("title")) && this.props.data.title,
          descr: (data.hasOwnProperty("descr")) && this.props.data.descr
        }
      })

      this.getResults();
    }
  }

  getResults() {
    if(this.props.data.hasOwnProperty("qkey")) {
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
   
    this.setState((correct) ? {
      points: this.state.points + 1,
      userAnswers: [...this.state.userAnswers, 'yes']
    } : {
      userAnswers: [...this.state.userAnswers, 'no']
    });

    this.voteFinalStep();
    this.wtitingResults(index, statistics);
  }
  
  howRenderList(current, id, option) {
    switch( this.state.questionListDisplay ) {
      case "LIST_REVERSE": return current >= id;
      case "SINGLE": return current === id;
      default: return 0;
    }
  }

  render() {
     const showList = this.state.questions.slice(0).reverse().map((question,index) => {
          if(this.howRenderList(this.state.current, +question.id, this.state.questionListDisplay)) {
             return <Question 
                key={`${this.state.dataCounter}_${index}`} 
                index={index}
                question={question} 
                iteration={this.currentIteration}
                statistics={this.state.gettedRes[index]}
               />;
          }
          return null;
      });
     
    const Next = () => this.state.onVote ? (
      <div className="q-next" onClick={this.nextQue}>
        <span className="q-next__button">
          <span className="q-next__arrow"></span>
        </span>
      </div>) : '';

    const Circles = () => { 
      let mass = [];
      for( let i of this.state.questions.keys()) {
        mass.push( <div key={i}> {
          (this.state.userAnswers[i] === 'yes') ? 
            <div className="q-circle-ok"></div> :
          (this.state.userAnswers[i] === 'no') ? 
            <div className="q-circle-no"></div> :
          (this.state.current - 1 === i) ? 
            <div className="q-circle-current"></div> :
            <div className="q-circle-null"></div>}
          </div>
        )
      }
      return <div className="q-circles"> { mass } </div>;
    };

    const Title = () => <div className="q-main-title">
        <h1 className="q-main-title-h1">{this.state.mainInfo.title}</h1>
        <p className="q-main-title-p">{this.state.mainInfo.descr}</p>
      </div>;

    const Final = () => (this.state.current === this.state.questions.length + 1) ? 
      <Results reload={this.reload} {...this.state}/> : '';

    return (
      <div>    
        <Title/>
        <Circles/>
        <div className="q-container">
          <Final/>
          <div className="q-question-list">
            { showList }
          </div>
        </div>    
        <Next/>       
      </div>
      );
   }
}

export default App;