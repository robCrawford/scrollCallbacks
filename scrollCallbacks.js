/*
  Run callbacks when elements are scrolled into the viewport
  NOTE: array supplied to add() must already be in vertical display order

  Data format:
  `[{el: DOM element, margin: Number, callback: Function}, ...]`  
  `margin` is the distance below the viewport edge that will fire the callback.
*/
(function(window, document, namespace, undefined){
"use strict";

	var appName = "scrollCallbacks";

	function add(pendingCallbacks, throttleDur){
	//Initialise
		var throttleTimestamp = 0,
			debounceTimer;

		//Allow single entry
		if(!pendingCallbacks.length)pendingCallbacks = [pendingCallbacks];

		function runCallbacks(){
		//Run callback for elements that are on screen
			var visibleElIndex = (function(){
			//Binary search returns index of element at viewport edge, or last element within viewport
				var low = 0,
					high = pendingCallbacks.length,
					lastOnscreenElIndex;

				while (low < high) {
					var i = parseInt((low + high) / 2, 10), //Get middle entry
						cbParams = pendingCallbacks[i],
						elPosStatus = getElPosStatus(cbParams.el, cbParams.margin); //Get position status

					if(elPosStatus < 0){
						lastOnscreenElIndex = i; //Keep for when all elements are onscreen
						low = i + 1; // Element bottom above win bottom, move low to this index
					}
					else if(elPosStatus > 0)high = i; // Element top below win bottom, move high to this index
					else return i; //Crosses edge, return index
				}
				return lastOnscreenElIndex; //No elements at edge - return last el that is onscreen if any
			})();

			//Run callbacks for visible elements
			if(visibleElIndex !== undefined){
				for(var i=visibleElIndex; i>=0; i--){
					pendingCallbacks[i].callback(); 
					pendingCallbacks.splice(i, 1);
					if(!pendingCallbacks.length){
						$(window).unbind("scroll." + appName, throttleRunCallbacks);
					}
				}
			}
		}

		function throttleRunCallbacks(){
		//Throttle calls to runCallbacks() with debounced final call
			var dur = throttleDur || 250;
			clearTimeout(debounceTimer);
			if(+new Date - throttleTimestamp > dur){
				runCallbacks();
				throttleTimestamp = +new Date;
			}
			else{
				debounceTimer = setTimeout(function(){
					runCallbacks();
					throttleTimestamp = +new Date;
				}, dur);
			}
		}

		//Init
		runCallbacks();
		$(window).bind("scroll." + appName, throttleRunCallbacks);
	}

	/*
	  Utils
	*/
	function getElPosStatus(el, margin){
	//Get status of element position
	//-1 above fold, 0 crosses fold, 1 below fold
		if(!el)throw new Error(appName + " element " + el);
		var posData = $(el).offset(),
			elTop = posData.top,
			elBottom = posData.top + posData.height,
			winTop = $(window).scrollTop(),
			winBottom = winTop + $(window).height() + (margin || 0);

		if(elBottom <= winBottom)return -1;
		else if(elTop > winBottom)return 1;
		else return 0;
	}

	function kill(){
	//Remove all scroll events
		return !!$(window).unbind("scroll." + appName);
	}

	//Add to namespace
	(namespace || window)[appName] = {
		add: add,
		kill: kill
	}

})(window, document);