const displayEl = document.getElementById('display');

let expr = '';

function setDisplay(v){
    displayEl.value = v;
}

function resetIfError(){
    if(displayEl.value === 'Error'){
        expr = '';
        setDisplay('0');
    }
}

function appendValue(val){
    resetIfError();
    if(expr.length > 80) return;
  
    if(val === '.'){
        const last = getLastToken();
        if(last && last.includes('.')) return;
        if(!last || /[+\-*/]$/.test(expr)) val = '0.';
    }
   
    if(/[+\-*/]/.test(val)){
        if(!expr && val !== '-') return; 
        if(/[+\-*/]$/.test(expr)){
            
            expr = expr.slice(0,-1) + val;
            setDisplay(expr);
            return;
        }
    }
    expr += val;
    setDisplay(expr || '0');
}

function getLastToken(){
    if(!expr) return '';
    const m = expr.match(/(-?\d*\.?\d+|\D)$/);
    return m ? m[0] : '';
}

function clearAll(){ expr = ''; setDisplay('0'); }

function backspace(){
    if(displayEl.value === 'Error'){ clearAll(); return }
    expr = expr.slice(0,-1);
    setDisplay(expr || '0');
}

function applyPercent(){
    
    const m = expr.match(/(-?\d*\.?\d+)$/);
    if(!m) return;
    const num = parseFloat(m[0]);
    const replaced = String(num / 100);
    expr = expr.slice(0, -m[0].length) + replaced;
    setDisplay(expr);
}

function toggleSign(){
    
    const m = expr.match(/(-?\d*\.?\d+)$/);
    if(!m) {
       
        if(!expr) { expr = '0'; setDisplay(expr); }
        return;
    }
    const last = m[0];
    if(last.startsWith('-')){
        const replaced = last.slice(1);
        expr = expr.slice(0, -last.length) + replaced;
    } else {
        expr = expr.slice(0, -last.length) + '-' + last;
    }
    setDisplay(expr);
}

function safeEvaluate(input){
  
    const tokens = [];
    const re = /\s*([0-9]*\.?[0-9]+|[+\-*/()])\s*/g;
    let m;
    while((m = re.exec(input)) !== null){
        tokens.push(m[1]);
    }
    if(tokens.length === 0) throw new Error('Empty');

    
    const tokens2 = [];
    for(let i=0;i<tokens.length;i++){
        const t = tokens[i];
        if(t === '-' && (i===0 || ['+','-','*','/','('].includes(tokens[i-1]))){
          
            const next = tokens[i+1];
            if(next && /[0-9]/.test(next)){
                tokens2.push(String(-parseFloat(next)));
                i++; 
                continue;
            } else {
                tokens2.push('-');
            }
        } else {
            tokens2.push(t);
        }
    }

    
    const out = [];
    const ops = [];
    const prec = {'+':1,'-':1,'*':2,'/':2};
    for(const tok of tokens2){
        if(/^[0-9]/.test(tok)) out.push(tok);
        else if(['+','-','*','/'].includes(tok)){
            while(ops.length && ['+','-','*','/'].includes(ops[ops.length-1]) && prec[ops[ops.length-1]] >= prec[tok]){
                out.push(ops.pop());
            }
            ops.push(tok);
        } else if(tok === '('){ ops.push(tok);
        } else if(tok === ')'){
            while(ops.length && ops[ops.length-1] !== '(') out.push(ops.pop());
            if(ops.length && ops[ops.length-1] === '(') ops.pop();
            else throw new Error('Mismatched parentheses');
        } else {
            throw new Error('Invalid token');
        }
    }
    while(ops.length){ const o = ops.pop(); if(o === '(' || o === ')') throw new Error('Mismatched parentheses'); out.push(o); }

  
    const stack = [];
    for(const t of out){
        if(/^[0-9\-\.]/.test(t) && !['+','-','*','/'].includes(t)) stack.push(parseFloat(t));
        else {
            const b = stack.pop(); const a = stack.pop();
            if(a === undefined || b === undefined) throw new Error('Invalid expression');
            let r;
            switch(t){
                case '+': r = a + b; break;
                case '-': r = a - b; break;
                case '*': r = a * b; break;
                case '/': if(b === 0) throw new Error('Division by zero'); r = a / b; break;
                default: throw new Error('Unknown op');
            }
            stack.push(r);
        }
    }
    if(stack.length !== 1) throw new Error('Invalid expression');
    return stack[0];
}

function calculate(){
    try{
        if(!expr) return;
       
        const normalized = expr.replace(/×/g,'*').replace(/÷/g,'/').replace(/−/g,'-');
        const result = safeEvaluate(normalized);
        const pretty = (Math.abs(result) < 1e12) ? Number(result.toPrecision(12)).toString() : String(result);
        expr = pretty;
        setDisplay(pretty);
    }catch(e){
        setDisplay('Error');
        expr = '';
    }
}


document.addEventListener('click', (ev)=>{
    const btn = ev.target.closest('button');
    if(!btn) return;
    const val = btn.dataset.value;
    const action = btn.dataset.action;
    if(val !== undefined){ appendValue(val); }
    else if(action){
        switch(action){
            case 'clear': clearAll(); break;
            case 'percent': applyPercent(); break;
            case 'sign': toggleSign(); break;
            case 'backspace': backspace(); break;
            case 'equals': calculate(); break;
            case 'add': appendValue('+'); break;
            case 'subtract': appendValue('-'); break;
            case 'multiply': appendValue('*'); break;
            case 'divide': appendValue('/'); break;
        }
    }
});


document.addEventListener('keydown', (ev)=>{
    if(ev.key === 'Enter') { ev.preventDefault(); calculate(); }
    else if(ev.key === 'Backspace'){ ev.preventDefault(); backspace(); }
    else if(ev.key === 'Escape'){ ev.preventDefault(); clearAll(); }
    else if(/[0-9.]/.test(ev.key)){ ev.preventDefault(); appendValue(ev.key); }
    else if(/^[+\-*/]$/.test(ev.key)){ ev.preventDefault(); appendValue(ev.key); }
    else if(ev.key === 'x' || ev.key === 'X'){ ev.preventDefault(); appendValue('*'); }
    else if(ev.key === '%'){ ev.preventDefault(); applyPercent(); }
    else if(ev.key === 's' || ev.key === 'S'){ ev.preventDefault(); toggleSign(); }
});


clearAll();
