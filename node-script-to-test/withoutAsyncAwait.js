const fetch = require("node-fetch");

const promiseArray = [];
for(let i = 0; i < 10; i++) {
    const pendingPromise = fetch("http://localhost:5000/api/encode", { 
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

    promiseArray.push(pendingPromise)
}
const urls = Promise.all(promiseArray).then(result => Promise.all(result.map(x => x.json())))
.then(jsonResponse => Promise.all(jsonResponse.map(x => x.url)));

console.log(urls);
