const fetch = require("node-fetch");

async function encode(){
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
    const result = await Promise.all(promiseArray);

    const jsonResponse = await Promise.all(result.map(x => x.json()));
    const urls = await Promise.all(jsonResponse.map(x => x.url));
    console.log(urls);
    
    return urls;
}

async function decode(urls){
    const promiseArray = [];
    urls = urls.map(url => url.replace('https://tiny-url-service.com/', 'http://localhost:5000/'))
    urls.forEach(url => {
        const pendingPromise = fetch(url+'', { 
            // Adding method type 
            method: "GET", 
            
            // Adding headers to the request 
            headers: { 
                "Content-type": "application/json; charset=UTF-8"
            } 
        }).catch(e => console.log('Hi'))
    
        promiseArray.push(pendingPromise)
    })
    const result = await Promise.all(promiseArray);

    result.forEach(async x => {
        try {
            const json = await x.json()
            console.log('Not Redirected for -> ' + x.url)
        } catch (e) {
            console.log('Redirected for -> ' + x.url)
        }
    })
}

async function main() {
    const urls = await encode();
    await decode(urls);
}

main();