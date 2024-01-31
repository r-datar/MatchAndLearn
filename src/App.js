import { useReducer } from 'react';
import Tiles from './components/Tiles'

import './styles.css'
import left_pool from './data/left_data.json'
import right_pool from './data/right_data.json'
import { type } from '@testing-library/user-event/dist/type';

 var  max_rounds = 0, left_display=[], right_display=[], right_display_temp = []
 var  max_tiles_to_show = 0, first_display = 0

 
 
export const ACTIONS = {
  LEFTPRESS: 'left-press',
  RIGHTPRESS: 'right-press',
  PRESS : 'press',
}  


function getMatchedCount(){
	let j = 0,matchedCount = 0
	
	for (j=0; j < left_display.length; j++) {
			if(left_display[j].active === false) {
				matchedCount++
			}
			
	} // for ends
	
	return matchedCount
}


function setLeftPress(state,value) {
	state.leftPress = value
	return state.leftPress
}

function setRightPress(state,value) {
	state.rightPress = value
	return state.rightPress
}

function setClickCount(state,value,type) {
	
	if(state.clickCount === 2) {
		state.clickCount = 1
		reset_display(null)
		if (type === ACTIONS.LEFTPRESS) { 
			setLeftPress(state,value)
			setRightPress(state,0)
		}
		else if (type === ACTIONS.RIGHTPRESS) {
			setRightPress(state,value)
			setLeftPress(state,0)
		}
		
	}
	else {
		state.clickCount = state.clickCount + 1
	}
	return state.clickCount
}


function reducer(state, {type, payload}) {

  reset_display(null)
  switch(type) {
  	
  	case ACTIONS.LEFTPRESS:
  	//console.log(payload.value)
  	
  	//First click? rerender
  	if(setClickCount(state,payload.value,type) === 1) {
  		//console.log('first click')
  		return {
  			...state,
  			leftPress : setLeftPress(state,payload.value),
  	    	result : evaluate_first_click(state),						
  		}
  	}
  	else {
  		if(state.leftPress !== 0) {
  			//two right clicks in a row
  			reset_display('clicked')
  		}
  		//evaluate and rerender
  		return {
  			...state,
  			leftPress : setLeftPress(state,payload.value),
  	    	result : evaluate(state),						
  		}	
  	}
  	
  	
  	case ACTIONS.RIGHTPRESS:
  	//console.log('rght',state.rightPress)
  	
  	if(setClickCount(state,payload.value,type) === 1) {
  		
  		return {
  			...state,
  			rightPress : setRightPress(state,payload.value),
  	    	result : evaluate_first_click(state),						
  		}
  	}
  	else {
  		if(state.rightPress !== 0) {
  			//two right clicks in a row
  			reset_display('clicked')
  		}
	  	return {
	  		...state,
	  		rightPress : setRightPress(state,payload.value),
	  	    result : evaluate(state),						
	  	}
  	}
  	
     
	default:
	break;
  }
  
}  

function evaluate_first_click(state) {
	  	update_display(state,'clicked')
		return true	  	
}

function evaluate(state) {
  //console.log('In evaluate state',state)	
  
  //Only evaluate if both sides available
  if (state.leftPress !== 0 && state.rightPress !== 0) {
  
  	if (state.leftPress === state.rightPress) {
		//Matched
		//update the left and right arrays with button as inactive
		update_display(state,false)		
    	return true	
    } // if right = left ends
    else {
		//No match
		//update the tiles to red and mark the array as null
    	update_display(state,null) 
 		return false
 	}
  }// non zero left right ends
  return false
} // function ends

function update_display(state,status){
	let j = 0
	for (j=0; j < left_display.length; j++) {
		//console.log(left_display[j].value)
		if(left_display[j].value === state.leftPress) {
			left_display[j].active = status
			break;
		}
			
	} // for ends
		
	for (j=0; j < right_display.length; j++) {
		if(right_display[j].value === state.rightPress) {
			right_display[j].active = status
			break;
		}
	} // for ends	
	
	setLeftPress(state,0)
	setRightPress(state,0)
	//console.log('After update display',state, right_display, left_display)			
}

function reset_display(status) {
	let j = 0
	for (j=0; j < left_display.length; j++) {
		//console.log(left_display[j].value)
		if(left_display[j].active === status) {
			left_display[j].active = 'true'
		}
		if(right_display[j].active === status) {
			right_display[j].active = 'true'
		}
		
	} // for ends
	//console.log('Nulls nulled', left_display)
	
}

function checkRenderDisplay() {
	// console.log(Number(process.env.REACT_APP_MAX_ROUNDS))
	if(max_rounds < Number(process.env.REACT_APP_MAX_ROUNDS)) {
		if(getMatchedCount() === 0) {
			if(first_display === 0) {
				first_display = 1
				return true
			}			
		}
		else if (getMatchedCount() === Number(process.env.REACT_APP_MAX_MATCH))
		{
			//console.log('All matched')
			max_rounds += 1
			return true	
		}
	}
	else {
		if (getMatchedCount() === Number(process.env.REACT_APP_MAX_MATCH)) {
			return false
		}
	}
	return false 
}

function App() {

  const [state, dispatch] = useReducer(reducer,{result:null,leftPress:0,rightPress:0,clickCount:0})
  
  let i=0,j=0,index = 0,counter=0 , len_rhs_display = 0,objj, continue_play = false
    
  continue_play = checkRenderDisplay()
  //// console.log('check render',continue_play)
  if(max_rounds === Number(process.env.REACT_APP_MAX_ROUNDS)) 
  {
  	// console.log('YOU WIN! GAME OVER!!')
  	return (<h1 style={{'textAlign': 'center'}}>YOU WIN! GAME OVER!!</h1>)
  	
  }	
  else {
  	if(continue_play) 
  	{
		//// console.log('We continue')
		max_tiles_to_show = Number(process.env.REACT_APP_MAX_MATCH)
		for(counter=0;  counter < max_tiles_to_show; ) {
			// 7 is the length of state array atm so get any number bet 0 and 6
			index  = Math.floor( Math.random() * 7)
			objj = left_pool[index]
			if (left_pool[index].active === 'true' && !left_display.includes(objj)) {
				left_display[i] = left_pool[index]
				right_display_temp[i] = right_pool[index]
				counter++	 
				i++	
			}
		} // for ends

		len_rhs_display = right_display_temp.length

		for (j=0;j<len_rhs_display;) {
			index  = Math.floor( Math.random() * 3)
			//console.log('scr index:',index)
			objj = right_display_temp[index]
			if (!right_display.includes(objj)) {
		
				right_display[j] = right_display_temp[index]
				j++
			}		
		}// for ends	
  	}//if continue play ends
  	//console.log(left_display, right_display)
  
  	return (
  		<div className="top-level">
			<div className="message">
				<h2>Match and Learn</h2>
				Match the left and right columns	
			</div>
    	<table className="table-left">
    		<tbody>
        	{
          	
           		left_display.map((tile,text) => (
					<tr key={text}> 
					<td>					

						<Tiles value={tile.value} display_text={tile.text} 
							   action="left-press" dispatch={dispatch}  active={tile.active} />

					</td>  
					
				 </tr>
				))
        
        	}
    	</tbody>    
   		</table>
    	<table  className="table-right">
    		<tbody>
    	    {
         
        		right_display.map((tile,text) => (
    				<tr key={text}> 
        			<td>

    		     		<Tiles value={tile.value} display_text={tile.text} 
    		      		 action="right-press" dispatch={dispatch}  active={tile.active} />

    		    	</td>  
    		    </tr>
        		))
   
    		} 
    		</tbody>    
    	</table>
    </div>
   		
  );
 } //else ends 
}


export default App;
