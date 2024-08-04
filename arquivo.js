const {createHash} = require("crypto")
function generateHash(text) {
    const hash = createHash("sha256");
  
    hash.update(text);
    const hashGerada = hash.digest("hex");
  
    return hashGerada;
  }
console.log(generateHash("12345"))