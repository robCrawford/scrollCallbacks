scrollCallbacks
===============

Run callbacks when elements are scrolled into the viewport  
NOTE: array supplied to add() must already be in vertical display order  

METHODS
-------
**Register an array of element/calback data**
`scrollCallbacks.add(Array);`

*Data format:*  
`[{el: DOM element, margin: Number, callback: Function}, ...]`  
`margin` is the distance below the viewport edge that will fire the callback.


```javascript

//EXAMPLE
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
```

*NOTE:*  
The namespace where `scrollCallbacks` is attached should be supplied as the second argument of the wrapping iife (the final parentheses at the end of the file).   
If no namespace is provided then `scrollCallbacks` will be added to `window`.