scrollCallbacks
===============

Run callbacks when elements are scrolled into the viewport.  
NOTE: array supplied to add() must already be in vertical display order.  

**METHODS**  
`scrollCallbacks.add(paramsArray, throttleDur);`  
*Register an array of element/calback data*  

> *paramsArray:*  
> An array of objects in format: `[{el: DOM element, margin: Number, callback: Function}, ...]`  
> `margin` is the distance below the viewport edge that will fire the callback (can be a negative value).

> *throttleDur*
> Optionally specify how often to run tests when scrolling (defaults to 250ms).

```javascript

//EXAMPLE
var elCallbacks = [];

$('.avatar').each(function(i, el){
	elCallbacks.push({
		el: el,
		margin: 100,
		callback: function(){
			$(el).addClass("load");
		}
	})
});
scrollCallbacks.add(elCallbacks);
```

*NOTE:*  
The namespace where `scrollCallbacks` is attached should be supplied as the second argument of the wrapping iife (the final parentheses at the end of the file).   
If no namespace is provided then `scrollCallbacks` will be added to `window`.