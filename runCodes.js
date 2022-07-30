import {WebArtino} from "https://cdn1.webartino.namishkumar.in/webartino.js";
export class nkplCompiler {
    constructor(codes, resultWriter) {
      this.codes = codes
      this.resultWriter = resultWriter;
    }
    tokenize() {
      const length = this.codes.length
      let pos = 0
      let line = 1;
      let column = 0;
      let tokens = []
      const BUILT_IN_KEYWORDS = ["write", "find", "vary", "import", "export", "modify", "Write", "Find", "Vary", "Import", "Export", "Modify", "showNkplDetails()", "sqrt", "Sqrt", "cbrt", "Cbrt", "printS", "PrintS", "#", "for", "For", "equals", "getVar", "getVary", ";", "function", "{", "}"];
      const varChars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_()#N;{}'
      while (pos < length) {
        let currentChar = this.codes[pos]
        if (currentChar === " ") {
          pos++
          column++
          continue
        }else if(currentChar === "\n"){
            line++
            column = 0;
            pos++
            continue
        } else if (currentChar === '"') {
          let res = ""
          pos++
          column++
          while (this.codes[pos] !== '"' && this.codes[pos] !== '\n' && pos < length) {
            res += this.codes[pos]
            pos++
          }
          if (this.codes[pos] !== '"') {
            return {
              error: `Incomplete String at line ${line}:${pos}`
            }
          }
          pos++
          tokens.push({
            type: "string",
            value: res
          })
        } else if (currentChar === "'") {
          let res = ""
          pos++
          while (this.codes[pos] !== '"' && this.codes[pos] !== '\n' && pos < length) {
            res += this.codes[pos]
            pos++
          }
          if (this.codes[pos] !== '"') {
            return {
              error: `Incomplete String at line ${line}:${pos}!`
            };
          }
          pos++
          tokens.push({
            type: "string",
            value: res
          })
        } 
        else if (varChars.includes(currentChar)) {
          let res = currentChar
          pos++
          while (varChars.includes(this.codes[pos]) && pos < length) {
            res += this.codes[pos]
            pos++
          }
          if (!BUILT_IN_KEYWORDS.includes(res)) {
            pos++
            column++
          }
          tokens.push({
            type: BUILT_IN_KEYWORDS.includes(res) ? "keyword" : "keyword_custom",
            value: res
          })
        }else if (currentChar === '='){
          pos++
          column++
          tokens.push({
            type: "operator",
            value: "eq"
          })
        } else {
          return {
            error: `Unexpected character ${this.codes[pos]} at line ${line}:${pos}`
          }
        }
      }
      return {
        error: false,
        tokens
      }
    }
    
    compile() {
      const {
        tokens,
        error
      } = this.tokenize()
      if (error) {
        return document.getElementById(this.resultWriter).innerHTML = `<span class="error">${error}`;
      }
      let localSystemVariables = [];
      this.parse(tokens);
      }
      parse(tokens) {
            const nLength = tokens.length;
            let position = 0;
            const vars = {}
            while (position < nLength) {
               const token = tokens[position];
               if(token.type === "keyword" && token.value === "write") {
                let isVar = tokens[position + 1].type === "keyword_custom";
                 const valueIsString = tokens[position + 1].type === "string";
                 if(!valueIsString && !isVar) {
                   if(!token[position + 1]) {
                    document.getElementById(this.resultWriter).innerHTML = "";
                    return document.getElementById(this.resultWriter).innerHTML = `<span class="error">Unexpected end of line! write method expects string and variables only!</span>`;
                   }
                   document.getElementById(this.resultWriter).innerHTML = "";
                   return document.getElementById(this.resultWriter).innerHTML = `<span class="error">Unexpected token ${tokens[position + 1].type}</span>`;
                 }
                 if(isVar) {
                    if(!tokens[position + 1].value in vars) {
                        document.getElementById(this.resultWriter).innerHTML = "";
                      return document.getElementById(this.resultWriter).innerHTML = `<span class="error">NKPL Variable Error: The requested variable ${tokens[position + 1].value} is not defined!</span>`
                    }
                    document.getElementById(this.resultWriter).innerHTML = vars[tokens[position + 1].value];
                 }else{
    
                 }
                 document.getElementById(this.resultWriter).innerHTML = tokens[position + 1].value;
                 position += 2
               }else if(token.type === "keyword" && token.value === "vary") {
                 const isCustomKeyWord = tokens[position + 1] && tokens[position + 1].type === "keyword_custom";
                 if(!isCustomKeyWord) {
                  if(!tokens[position + 1]) {
                    return console.log("Unexpected end of line! Expected a variable name!");
                  }
                  return console.log(`Unexpected token ${tokens[position + 1].type}! Expected a variable name`)
                 }
                 const varyName = tokens[position + 1].value;
                 getBuidlsd();
                 const isEqualSign = tokens[position + 2] && tokens[position + 2].type === "operator" && tokens[position + 2].value === "eq";
                 if(!isEqualSign) {
                  if(!tokens[position + 2]) {
                    return console.log("Unexpected end of line, expected '=' sign after variable name!")
                  }
                  return console.log(`Unexpected token ${tokens[position + 2].type}! expected '=' sign after variable name!`)
                 }
  
                 const isString = tokens[position + 3] && tokens[position + 3].type === "string"; 
                 if(!isString) {
                  if(!tokens[position + 3]) {
                    return console.log("Unexpected end of line! Expected String!");
                  }
                  return console.log(`Unexpected token ${tokens[position + 3].type}! Expected String!`)
                 }
              if(varyName in vars) {
                return console.log(`NKPL Variable Error:- Variable ${varyName} already exists!`);
              }
              vars[varyName] = tokens[position + 3].value;
              console.log(vars[0]);
              position+= 4;
               }
               position++
            }
      }
    }
WebArtino.whenClicked(WebArtino.byId("runCode1"), function whenClicked() {
    const codes = `write "Hello World";`;
    new nkplCompiler(codes, "result1").compile();
});
WebArtino.whenClicked(WebArtino.byId("runCode2"), function whenClicked() {
    const codes = String(document.getElementById("codeEditor1").value);
    new nkplCompiler(codes, "result2").compile();
});