import {React} from 'react'
import { ACTIONS } from '../App'
  	  	
 
  	
function Tiles({dispatch, value, display_text, action, active}) {
	
	//let  [showWrong,setShowWrong] = useState(true)
	//console.log('Active',display_text, active)		
	var strClasses = 'big', descriptor = ''
	
	if(active === 'true') {
		strClasses = 'big'
	}
	else if(active === 'clicked') {
		strClasses = 'big clicked'
	}
  	else if (active === false){  
     	descriptor = " disabled"
     	strClasses = 'big dim'
      
    }     
   
   	else {
    
   	/*setTimeout(() => {
   	         setShowWrong(false);
   	         
  	}, 1000);*/
  
    //if (showWrong) {
    	strClasses = 'big wrong'	
   //}
 
   } //else
   
   	return (
    	    <button id={display_text} className= {strClasses} disabled={descriptor}
    		    	onClick={() => dispatch({type: action==='left-press'? ACTIONS.LEFTPRESS :  ACTIONS.RIGHTPRESS, payload: {value}})}> {display_text}
        </button>
      ) 
} // function
 
export default Tiles
