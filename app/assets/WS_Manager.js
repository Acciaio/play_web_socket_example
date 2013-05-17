var WS_Manager = 
	function() {
	  this.input = 
	  	{
		  address: "",
		  onopen : function() {},
	  	  onmessage : function(msg) {},
		  onclosed : function() {}
	  	}
	  
	  this.id = "ws_manager"
	  
	  this.wsSocket = null
	  this.hangOutCheck = null
	  
	  this.pong = JSON.stringify({
		    "pong" : true
		  })
}

WS_Manager.prototype = {
		
	init : function() {
		console.log("indirizzo "+this.input.address)
		
	  try {
	   	this.wsSocket =
	   		window['MozWebSocket'] ? 
	   				new MozWebSocket(this.input.address) : 
	   				new	WebSocket(this.input.address)
	   		;
	    	
	    var me = this;
	    var dummy_socket = this.wsSocket;
	   	this.wsSocket.onopen =
	   		function() {
	   			console.log("Connection opened ...");
	   			me.hangOutCheck = setTimeout(function(){dummy_socket.close()},1000)
	   			me.input.onopen.call();
	  		};
	    this.wsSocket.onmessage = 
	    	function (event) {
	     		if (event.data.error) {
	    	 		console.log("ws data error")
	    	 	this.close()
	   	      	return
	     		}

	     		var msg = jQuery.parseJSON(event.data);

	     		if (msg.ping != undefined) {
	     			if ($("#__placeholder_"+me.id).length > 0) {
	     				try {
	     					clearTimeout(me.hangOutCheck);
	     				} catch(err) {}
	     			  	me.hangOutCheck  = 
	     			  		setTimeout(function(){
	     			  		console.log("Connection lost");
	     			  		dummy_socket.close()},1000)
	     				this.send(me.pong);
	     			}
	     			else {
	     				this.close();
	     			}
	     		} else {
	     			me.input.onmessage.call(me,msg);
	     		}
	    	};
	    this.wsSocket.onclose = 
	    	function() { 
	        	console.log("Connection is closed...");
	        	
	        	me.input.onclose.call();
	        	
	        	if ($("#__placeholder_"+me.id).length > 0)	
	        		setTimeout(function(){me.init()},500);	
	     	};
	    } catch (err) {
	    	console.log(err);
	    	console.log("cannot connect to ws");
	    }
	  
	},
	 
	 send: function(msg) {
		 this.wsSocket.send(JSON.stringify(msg));
	 }
		 
}