scrollCallbacks
===============
*(Requires jQuery or Zepto, 0.7kB minified)*  

Run callbacks as elements are scrolled into the viewport.  

.add()
------ 
*Register an array of callbacks*
```javascript
scrollCallbacks.add(callbacks [, throttleDur]);
```  
> *callbacks*  
> An array of objects  
> `[{el: DOM element, margin: Number, callback: Function}, ...]`  
> NOTE: elements must be added in vertical display order!

>> `margin` is the distance below the viewport edge that will fire the callback (can be a negative value).  

> *throttleDur*  
> Optionally specify how often to run tests when scrolling (defaults to 250ms).  

```javascript
//EXAMPLE
scrollCallbacks.add([
	{
		el: $("#area1"),
		margin: 0,
		callback: function(){
			console.log("Area1 onscreen");
		}
	},
	{
		el: $("#area2"),
		margin: 0,
		callback: function(){
			console.log("Area2 onscreen");
		}
	}
], 100); //Throttle duration
```

If the same params will be used for many elements, it may be easiest to create them in a loop as below:

```javascript
//EXAMPLE
var callbacks = [];

$('.avatar').each(function(i, el){
	callbacks.push({
		el: el,
		margin: 100,
		callback: function(){
			$(el).addClass("load");
		}
	})
});
scrollCallbacks.add(callbacks);
```

*NOTE:*  
The namespace where `scrollCallbacks` is attached should be supplied as the second argument of the wrapping iife (the final parentheses at the end of the file).   
If no namespace is provided then `scrollCallbacks` will be added to `window`.