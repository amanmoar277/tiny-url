
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
        // setTimeout(() => {}, 2000)

        // console.log(i)
    }
    const result = await Promise.all(promiseArray);

    const jsonResponse = await Promise.all(result.map(x => x.json()));
    const urls = await Promise.all(jsonResponse.map(x => x.url));
    // console.log(urls)

    await decode(urls);

}

async function decode(urls){
    const promiseArray = [];
    urls = urls.map(url => url.replace('https://tiny-url-service.com/', 'http://localhost:5000/'))
    console.log(urls)
    urls.forEach(url => {
        // console.log(url)
        const pendingPromise = fetch(url, { 
            // Adding method type 
            method: "GET", 
            
            // Adding headers to the request 
            headers: { 
                "Content-type": "application/json; charset=UTF-8"
            } 
        }).catch(e => console.log('Hi'))
    
        promiseArray.push(pendingPromise)
        // setTimeout(() => {}, 2000)

        // console.log(url)
    })
    const result = await Promise.all(promiseArray);

    // const jsonResponse = await Promise.all(result.map(x => x.json()));
    // const urlss = await Promise.all(jsonResponse.map(x => x.status_code));

    console.log(result)
    return result.map(x => x.status);
}

const resolvedPromises = encode()
// console.log(resolvedPromises)