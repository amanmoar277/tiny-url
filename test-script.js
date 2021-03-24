const fetch = require("node-fetch");

for(let i = 0; i < 3000; i++) {
    fetch("http://localhost:5000/api/encode", { 
      
        // Adding method type 
        method: "POST", 
        
        // Adding body or contents to send 
        body: JSON.stringify({ 
            "url": `https://www.youtube.com/${i}`
        }), 
        
        // Adding headers to the request 
        headers: { 
            "Content-type": "application/json; charset=UTF-8"
        } 
    }) 
    console.log(i)
}
