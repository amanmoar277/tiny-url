const fetch = require("node-fetch");

const startEncode = (new Date()).getTime();
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

const urlsPromise = Promise.all(promiseArray)
                    .then(result => Promise.all(result.map(x => x.json())))
                    .then(jsonResponse => Promise.all(jsonResponse.map(x => x.url)))
                    .then(urls => console.log(urls) || urls);

// Here is no effect on urlsPromise
urlsPromise.then(_ => {
    const endEncode = (new Date()).getTime();
    console.log(`Time taken by encoding -> ${endEncode - startEncode} ms`);
})


const startDecode = (new Date()).getTime();
urlsPromise.then(urls => {
    const promiseArray = [];
    const modifiedUrls = urls.map(url => url.replace('https://tiny-url-service.com/', 'http://localhost:5000/'))
    modifiedUrls.forEach(url => {
        const pendingPromise = fetch(url+'', { 
            // Adding method type 
            method: "GET", 
            
            // Adding headers to the request 
            headers: { 
                "Content-type": "application/json; charset=UTF-8"
            } 
        }).catch(e => console.log(e))
    
        promiseArray.push(pendingPromise)
    })
    
    Promise.all(promiseArray).then(result => {
        result.forEach(async x => {
            try {
                const json = await x.json()
                console.log('Not Redirected for -> ' + x.url)
            } catch (e) {
                console.log('Redirected for -> ' + x.url)
            }
        })
    }).then(_ => {
        const endDecode = (new Date()).getTime();
        console.log(`Time taken by decoding -> ${endDecode - startDecode} ms`);
    })
})


