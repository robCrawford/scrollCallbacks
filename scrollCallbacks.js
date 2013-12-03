/*
  Run callbacks when elements are scrolled into the viewport
  NOTE: array supplied to add() must already be in vertical display order

  Data format:
  `[{el: DOM element, margin: Number, callback: Function}, ...]`  
  `margin` is the distance below the viewport edge that will fire the callback.

  EXAMPLE
  -------
	var avatarEls = Array.prototype.slice.call(document.querySelectorAll('.avatar')),
		elCallbacks = [];

	for(var i=0,len=avatarEls.length;i<len;i++){
		(function(el){
			elCallbacks.push({
				el: el,
				margin: 100,
				callback: function(){
					el.src = img.avatar;
				}
			})
		})(avatarEls[i]);
	};

	scrollCallbacks.add(elCallbacks);
*/
(function(window, document, namespace, undefined){
"use strict";

	function add(pendingCallbacks){
	//Initialise
		var throttleTimestamp = 0,
			debounceTimer;

		function runCallbacks(){
		//Run callback for elements that are on screen
			var visibleElIndex = (function() {
			//Binary search returns index of element at viewport edge, or last element within viewport
				var low = 0,
					high = pendingCallbacks.length,
					lastOnscreenElIndex;

				while (low < high) {
					var i = parseInt((low + high) / 2, 10), //Get middle entry
						cbParams = pendingCallbacks[i],
						elPosStatus = getElPosStatus(cbParams.el, cbParams.margin); //Get position status

					if (elPosStatus === -1){
						lastOnscreenElIndex = i; //Keep for when all elements are onscreen
						low = i + 1; // Element bottom above win bottom, move low to this index
					}
					else if (elPosStatus === 1){
						high = i; // Element top below win bottom, move high to this index
					}
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
						$(window).unbind("scroll.scrollCallbacks", throttleRunCallbacks);
					}
				}
			}
		}

		function throttleRunCallbacks(){
		//Throttle calls to runCallbacks() with debounced final call
			clearTimeout(debounceTimer);
			if(+new Date - throttleTimestamp > 250){
				runCallbacks();
				throttleTimestamp = +new Date;
			}
			else{
				debounceTimer = setTimeout(function(){
					runCallbacks();
					throttleTimestamp = +new Date;
				}, 250);
			}
		}

		//Init
		runCallbacks();
		$(window).bind("scroll.scrollCallbacks", throttleRunCallbacks);
	}
		
	/*
	  Utils
	*/
	function getElPosStatus(el, margin){
	//Get status of element position
	//-1 above fold, 0 crosses fold, 1 below fold
		var posData = $(el).offset(),
			elTop = posData.top,
			elBottom = posData.top + posData.height,
			winTop = $(window).scrollTop(),
			winBottom = winTop + $(window).height() + (margin || 0);

		if(elBottom <= winBottom)return -1;
		else if(elTop > winBottom)return 1;
		else return 0;
	}

	//Add to namespace
	(namespace || window).scrollCallbacks = {
		add: add
	}
	
})(window, document);