import React from 'react';

import './Question.css';

class Question extends React.Component{
	constructor(props){
		super(props);
      
		this.state = { 
      que: props.next2,
      site: 'lol',
      comment: '',
      
      selectItem: '',
      selected: this.props.selected,
      showPercent: false
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

      var statistics = this.props.statistics || [];
      statistics[id] = +statistics[id] + 1;
      
      
      this.props.iteration(e, correct, this.props.index, statistics);
    }

  }

 
  render() {
    var that = this;
    var que = this.state.que;

    var statistics = this.props.statistics || [];
     
    var getStatistics = index => {
      var sum = 0;
      for(let item of statistics) {
        sum += +item;
      }
      if(this.state.showPercent) {
        return {
          "width": Math.round((statistics[index] || 0) / sum * 100) + "%"
        }  
      } else {
        return {};
      }  
    }

    var showComment = (id) => (this.state.selectItem === id && this.state.comment) ? 
      <div className="q-comment">{this.state.comment}</div> : '';

    // var showComment = () => (this.state.comment) ? 
    //   <div className="q-comment">{this.state.comment}</div> : '';


    var qList = que.an.map(function(item,index){
   
      var qTrue = that.state.selected && item.correct ? 'q-true' : '',
          qSelect = (that.state.selected) ? 'q-select' : '',
          qUserSelect = that.state.selectItem === item.id ? 'q-user-select' : '';
      
      const classesButton = `q-button ${qSelect}`,
            classesLi = `q-list-item ${qUserSelect} ${qTrue}`;
            
      return <li key={index} className={classesLi}>
          
          <div       
            className={classesButton}
            onClick={e => that.onChanged(e, item.comment, item.correct, item.id)}
          >
            <svg className="check-mark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 5.86 6.29"><path d="M.3,3.73,2.67,5.47A17.73,17.73,0,0,1,5.47.31"/></svg>
            <span className="q-button-text">{item.text} {showComment(item.id)}</span>
            
            <span className="q-statistics" style={ getStatistics(index) }></span>
          </div>
          
      </li>; 
     })
    
    var imgRender = (que.img) ? <div className="q-img"><img alt="" src={que.img}/></div> : '';
      
    var showQuestionText = () => this.state.que.q;
    var showNumberQuestion = () => <div className="q-title-number">{this.state.que.id}</div>;

    

    return (
      <div className="q-question">
           
           {imgRender}
        
        <div className="q-top">

          

          <div className="q-title">
          { showNumberQuestion() }
            { showQuestionText() }
          </div>   
          {/* <div className="q-number">{this.state.que.id}/{this.props.length}</div> */}
        </div>

        
        
        <div className="q-list">
          { qList }
        </div>
        
        {/* {showComment()} */}
        {/* <div className="q-comment">{this.state.comment}</div> */}
      </div>
    );
   }
}

export default Question;
