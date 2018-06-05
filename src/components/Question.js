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
            {item.text}
          </div>
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
        
        <div className="q-list">
          { qList }
        </div>
        <div className="q-comment">{this.state.comment}</div>
      </div>
    );
   }
}

export default Question;