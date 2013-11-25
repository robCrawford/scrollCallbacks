window.scrollCallbacks = (function(window, document, undefined){
"use strict";

	function add(pendingCallbacks){
	//Initialise
		var debounceTimerId;

		function runCallbacks(){
		//Run callback for elements that are on screen
			var visibleElIndex = (function() {
			//Binary search
			//Returns index of element at viewport edge, or last element within viewport
				var low = 0,
					high = pendingCallbacks.length,
					lastOnscreenElIndex;

				while (low < high) {
					var i = parseInt((low + high) / 2, 10), //Get middle entry
						cbParams = pendingCallbacks[i],
						elPosStatus = getElPosStatus(cbParams.el, cbParams.margin); //Get position status

					if (elPosStatus === -1){
						//console.log( i, "is above the fold" ); 
						lastOnscreenElIndex = i; //Keep for when all elements are onscreen
						low = i + 1; // Element bottom above win bottom, move low to this index
					}
					else if (elPosStatus === 1){
						//console.log(i, "is below the fold" ); 
						high = i; // Element top below win bottom, move high to this index
					}
					else{
						//console.log(i, "straddles the fold" );
						return i; //Straddles edge, return index
					}
				}
				//console.log( "No pending el at edge");
				//if(lastOnscreenElIndex)console.log(lastOnscreenElIndex, "was last pending onscreen" ); 
				return lastOnscreenElIndex; //No elements at edge - return last el that is onscreen if any
			})();

			//Run callbacks for visible elements
			if(visibleElIndex !== undefined){
				for(var i=visibleElIndex; i>=0; i--){
					//console.log( "Running callback for", i, "(removed from pendingCallbacks)" ); 
					pendingCallbacks[i].callback(); 
					pendingCallbacks.splice(i, 1);
					if(!pendingCallbacks.length){
						//console.log( "pendingCallbacks empty - removing event handler" ); 
						$(window).unbind("scroll.scrollCallbacks", debounceRunCallbacks);
					}
				}
			}
		}

		function debounceRunCallbacks(){
		//Debounce calls to runCallbacks()
			if(debounceTimerId)clearTimeout(debounceTimerId);
			debounceTimerId = setTimeout(runCallbacks, 100);
		}

		//Init
		runCallbacks();
		$(window).bind("scroll.scrollCallbacks", debounceRunCallbacks);
	}
		
	/*
	  Utils
	*/
	function getElPosStatus(el, margin){
	//Get status of element position
	//-1 above fold, 0 straddles fold, 1 below fold
		var posData = $(el).offset(),
			elTop = posData.top,
			elBottom = posData.top + posData.height,
			winTop = $(window).scrollTop(),
			winBottom = winTop + $(window).height() + (margin || 0);

		if(elBottom <= winBottom)return -1;
		else if(elTop > winBottom)return 1;
		else return 0;
	}

	return {
		add: add
	}
	
})(window, document);