import React, { Component } from 'react';
// import logo from './logo.svg';
import './App.css';

// class App extends Component {
//   render() {
//     return (
//       <div className="App">
//         <header className="App-header">
//           <img src={logo} className="App-logo" alt="logo" />
//           <h1 className="App-title">Welcome to React</h1>
//         </header>
//         <p className="App-intro">
//           To get started, edit <code>src/App.js</code> and save to reload.
//         </p>
//       </div>
//     );
//   }
// }

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
  
  componentWillMount() {
    // console.log(this.ref.innerHTML)
    // console.log(ReactDOM.findDOMNode(this).innerHTML)
  }
  componentDidMount() {
    
    console.log(this.props.prueba)
    // console.log(this.ref.innerHTML)
    
    
//     this.addToList(0); 
    
//     this.setState({
//       showList: [...this.state.showList, <Question next2={this.state.lol[0]} iteration={this.currentIteration}/>]
//     })
    
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
    // var showCurrent = this.state.lol.map((que)=>{
    //       if(this.state.current >= que.id) {
    //          return <Question next2={que} iteration={this.currentIteration}/>;
    //       }
    //       if(this.state.current === this.state.lol.length) {
    //         return <p>Все</p>
    //       }
    //     });
     
//     var qList = (() => {
//       if(this.state.current > this.state.lol.length) {
//         return <p>Все</p>
//       } else {
//         return showCurrent;
//       }  
//     })();
    
     // var showList = this.state.list.map((que)=>{
     //    return <Question next2={que} iteration={this.currentIteration}/>;
     // });
     
     var showList = this.state.list.map((que,index)=>{
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
           <div class="refresh icon"></div>
         </div> : '';
     // <input type="button" className="q-reload" value="По новой" />;
     
     // var showList = this.state.showList;
     
     
    
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
              <p>{ showProgress }</p>
            </div>    
          </div>
        
        
        
          
         </div>
    );
   }
}

class Question extends React.Component{
	constructor(props){
		super(props);
      
		this.state = { 
      que: props.next2,
      site: 'lol',
      comment: '',
      
      selectItem: '',
      selected: this.props.selected
    };
    
	}
  
  onChanged(e, comment, correct, id) { 
    
    if(this.state.selected === false) {
      this.setState({
        selected: true,
        selectItem: id,
        comment: comment
      });
      
      this.props.iteration(e, correct);
    }    
  }
 
   render() {
     

    
     var that = this;
    var que = this.state.que;
    // var iter = this.props.iteration;
     
    var qList = que.an.map(function(item,index){
   
      var qTrue = that.state.selected && item.correct ? 'q-true' : '',
      // qTrue = (that.state.selectItem === item.id && item.correct) ? 'q-true' : '',
          qSelect = (that.state.selected) ? 'q-select' : '',
          qUserSelect = that.state.selectItem === item.id ? 'q-user-select' : '';
      
      const classesButton = `q-button ${qSelect}`,
            classesLi = `q-list-item ${qUserSelect} ${qTrue}`;
    
          
        return <li key={index} className={classesLi}>
          <div       
            className={classesButton}
            onClick={e => that.onChanged(e, item.comment, item.correct, item.id)}
            >{item.text}</div>
        </li>; 
     })
    
    var imgRender = (que.img) ? <div className="q-img"><img alt="" src={que.img}/></div> : '';
      
    return (
      <div className="q-question">
           
        {imgRender}
        
        <div className="q-top">
          <div className="q-title">{this.state.que.q}</div>
          <div className="q-number">{this.state.que.id}/{this.props.length}</div>
        </div>
        
        
        <ul className="q-list">
          { qList }
        </ul>
        <p>{this.state.comment}</p>
      </div>
    );
   }
}





export default App;