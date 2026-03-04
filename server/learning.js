console.log("1. start")

setTimeout(()=>{
console.log("2. Timeout")
},0)

Promise.resolve().then(
    ()=>{
        console.log("3. promise")
    }
)

console.log("4. end")


const http = require("http")

console.log("start")

const app = http.createServer((req,res)=>{
    console.log(req.url);

    if(req.url === '/'){
         res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Home Route" }));
     } 
  else if (req.url === "/about") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "About Route" }));
  } 
  else {
    res.writeHead(404);
    res.end("Not Found");
  }
});

app.listen(5000,()=>{
    console.log("server is running on port - 5000")
});
