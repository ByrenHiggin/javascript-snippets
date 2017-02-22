var pr = new Promise(function(resolve, reject){
    setTimeout(function(){
        resolve(Math.random()); //Yay! Everything went well!
    }, 2000);
}).then(function(result){
	document.getElementById("results").innerText = 'processing - ' + result.toString();
	var nested = new Promise(function(resolve, reject){
    	setTimeout(function(){
        resolve(Math.random()); //Yay! Everything went well!
    	}, 2000);
	}).then(function(result){
    document.getElementById("results").innerText = 'processed - ' + result.toString();
  });
});
