import React from 'react';
import './Question.css';

class Question extends React.Component{
	constructor(props){
		super(props);
      
		this.state = { 
      comment: '',
      selectItem: '',
      selected: false,
      showPercent: false,
      onVote: false
    };
	}
  
  onChanged(e, comment, correct, id) {    
    if(this.state.selected === false) {
      this.setState({
        selected: true,
        selectItem: id,
        comment: comment,
        showPercent: true
      });

      // id начинается не с 0
      id = id - 1;
      
      let statistics = this.props.statistics || [];
      statistics[id] = +statistics[id] + 1;   
      this.props.iteration(e, correct, this.props.index, statistics);
    }

  }

  setQuestionClasses() {
    let def = "q-question";

    switch( this.props.questionListDisplay ) {
      case "LIST_REVERSE": return `${def} q-question-list-anim`;
      case "SINGLE": return `${def} q-question-single-anim`;
      default: return def;
    }
  }

  render() {
    const statistics = this.props.statistics || [];
     
    const getStatistics = index => {
      const sum = statistics.reduce((a,b) => +a + +b, 0 );
      return this.state.showPercent ? 
        { "width": Math.round((statistics[index] || 0) / sum * 100) + "%" } : {};
    }

    const Comment = () => (this.state.comment) ? 
      <div className="q-comment">{this.state.comment}</div> : '';

    const qList = this.props.question.an.map( (item,index) => {

      const classesButton = `
              q-button 
              ${ this.state.selected && 'q-select' }`;

      const classesLi = `
              q-list-item 
              ${ this.state.selectItem === item.id && 'q-user-select' } 
              ${ (this.state.selected && item.correct) && 'q-true' }`;
            
      return <li key={index} className={classesLi}> 
        <div 
          className={classesButton} 
          onClick={e => this.onChanged(e, item.comment, item.correct, item.id)}>
            
          <svg className="check-mark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 5.86 6.29">
            <path d="M.3,3.73,2.67,5.47A17.73,17.73,0,0,1,5.47.31"/>
          </svg>

          <span className="q-button-text">
            {item.text}
          </span>
            
          <span className="q-statistics" style={ getStatistics(index) }></span>
        </div>
      </li>; 
     });
    
    const QueImg = () => ( this.props.question.img) ? 
      <div className="que-container-right">
        <div className="q-img">
          <img alt="" src={this.props.question.img}/>
        </div>
      </div> : '';
      
    const QuestionText = () => (
      <div className="q-top">
        <div className="q-title"> 
          {this.props.question.q} 
        </div>
      </div>);

    return (
      <div className={this.setQuestionClasses()}>
        <div className="que-container">
          <div className="que-container-left">
            <QuestionText/>   
            <div className="q-list">
              { qList }
            </div> 
            <Comment/>
          </div>        
          <QueImg/>
        </div>
      </div>
    );
   }
}

export default Question;