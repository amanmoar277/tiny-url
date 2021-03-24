const fetch = require("node-fetch");

async function encode(){
    const resultArray = [];
    for(let i = 0; i < 10; i++) {
        const data = await fetch("http://localhost:5000/api/encode", { 
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
    
        resultArray.push(data);
    }

    const jsonResponse = await Promise.all(resultArray.map(x => x.json()));
    const urls = await Promise.all(jsonResponse.map(x => x.url));
    console.log(urls);
    
    return urls;
}

async function decode(urls){
    // const resultArray = [];
    const modifiedUrls = urls.map(url => url.replace('https://tiny-url-service.com/', 'http://localhost:5000/'))
    const resultArray = await Promise.all(modifiedUrls.map( url => 
        fetch(url+'', { 
            // Adding method type 
            method: "GET", 
            
            // Adding headers to the request 
            headers: { 
                "Content-type": "application/json; charset=UTF-8"
            } 
        })
    ))

    const result = await Promise.all(resultArray);
    result.map(async x => {
        try {
            const json = await x.json()
            console.log('Not Redirected for -> ' + x.url)
        } catch (e) {
            console.log('Redirected for -> ' + x.url)
        }
    })
}

async function main() {
    const startEncode = (new Date()).getTime();
    const urls = await encode();
    const endEncode = (new Date()).getTime();
    console.log(`Time taken by encoding -> ${endEncode - startEncode} ms`);

    const startDecode = (new Date()).getTime();
    await decode(urls);
    const endDecode = (new Date()).getTime();
    console.log(`Time taken by decoding -> ${endDecode - startDecode} ms`);
}

main();