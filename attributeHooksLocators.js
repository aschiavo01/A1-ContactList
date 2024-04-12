//*[contains(@class, 'x-test-hook-36')]//*[contains(@class, 'x-test-hook-37') and contains(text(),'val')]

console.log("Selenium: attribute-hooks-locators.js loaded.")
//debugger;


const hookPrefix = 'x-test-hook-';
const templatePrefix = 'x-test-tpl-';
const regExpLiteral = /.\d$/;
hook_h = 'h\\d';
const hookRegex = new RegExp(`^..............(?:(?:${hookPrefix})|(?:${templatePrefix}))\\d+$`);

class RegExp1 extends RegExp {
  [Symbol.split](str, limit) {
    const result = RegExp.prototype[Symbol.split].call(this, str, limit);
    return result.map(x => `(${x})`);
  }
}

/*
 * Utility function: Encode XPath attribute value.
 */
 
 
LocatorBuilders.prototype.attributeValue = function(value) {
    if (value.indexOf("'") < 0) {
        return "'" + value + "'";
    } else if (value.indexOf('"') < 0) {
        return '"' + value + '"';
    } else {
        var result = 'concat(';
        var part = "";
        while (true) {
            var apos = value.indexOf("'");
            var quot = value.indexOf('"');
            if (apos < 0) {
                result += "'" + value + "'";
                break;
            } else if (quot < 0) {
                result += '"' + value + '"';
                break;
            } else if (quot < apos) {
                part = value.substring(0, apos);
                result += "'" + part + "'";
                value = value.substring(part.length);
            } else {
                part = value.substring(0, quot);
                result += '"' + part + '"';
                value = value.substring(part.length);
            }
            result += ',';
        }
        result += ')';
        return result;
    }
};

/**
 * Ritorna la stessa stringa di input aggiungendo "x:" come prefisso se il documento
 * e' di tipo XHTML
 * @param {*} name 
 * @returns 
 */
LocatorBuilders.prototype.xpathHtmlElement = function(name) {
    if (this.window.document.contentType == 'application/xhtml+xml') {
        // "x:" prefix is required when testing XHTML pages
        return "x:" + name;
    } else {
        return name;
    }
};

/**
 * Ritorna un path univoco rispetto al padre contenitore:
 * - aggiunge "/" come prefisso
 * - se sono presenti altri nodi a partire dallo stesso antenato allora deriva l'indice da assegnare
 * @param {*} current 
 * @returns la stringa di input aggiungendo il prefisso "/". Se sono presenti altri nodi allo stesso livello, concatena "[index+1]"
 */
LocatorBuilders.prototype.relativeXPathFromParent = function(current) {
    var index = this.getNodeNbr(current);
	
    var currentPath = '/' + this.xpathHtmlElement(current.nodeName.toLowerCase());
  
	if (index > 0) {
        currentPath += '[' + (index + 1) + ']';
		
	}
	
    return currentPath;
};


/**
 * Restituisce il numero di elementi che condividono lo stesso padre. 
 * @param {*} current 
 * @returns indice
 */
LocatorBuilders.prototype.getNodeNbr = function(current) {
    var childNodes = current.parentNode.childNodes;
    var total = 0;
    var index = -1;
    for (var i = 0; i < childNodes.length; i++) {
        var child = childNodes[i];
        if (child.nodeName == current.nodeName) {
            if (child == current) {
                index = total;
            }
            total++;
        }
    }
    return index;
};

/**
 * Verifica la presenza di elementi identificativi di stile presenti sull'input:
 * - se possiede un id, allora questo viene identificato come #id
 * - se possiede il class, allora viene formata una stringa identificativa proveniente dal contenuto del campo
 *   sostituendo gli spazi bianchi con il carattere "."
 * - se possiede qualsiasi altro identificatore di stile, utilizza il formato nodeName[attr="value"]
 * - se non possiede un identificatore di stile allora:
 *      1. se l'algoritmo ne individua l'indice tra i nodi fratelli allora ritorna il selettore nodeName:nth-of-type(n)
 *      2. altrimenti restituisce il nodeName del nodo.
 * @param {*} e 
 * @returns identificativo creato con uno tra gli elementi di stile del nodo
 */
LocatorBuilders.prototype.getCSSSubPath = function(e) {
    var css_attributes = ['id', 'name', 'class', 'type', 'alt', 'title', 'value'];
    for (var i = 0; i < css_attributes.length; i++) {
        var attr = css_attributes[i];
        var value = e.getAttribute(attr);
        if (value) {
            if (attr == 'id')
                return '#' + value;
            if (attr == 'class')
                return e.nodeName.toLowerCase() + '.' + value.replace(/\s+/g, ".").replace("..", ".");
            return e.nodeName.toLowerCase() + '[' + attr + '="' + value + '"]';
        }
    }
    if (this.getNodeNbr(e))
        return e.nodeName.toLowerCase() + ':nth-of-type(' + this.getNodeNbr(e) + ')';
    else
        return e.nodeName.toLowerCase();
};


/**
 * Verifica se e' possibile costruire una stringa xpath per "e" piu' precisa di quella fornita in input,
 * altrimenti ritorna il valore della variabile "xpath".
 * @param {*} xpath 
 * @param {*} e 
 * @returns un xpath identificativo di "e".
 */
LocatorBuilders.prototype.preciseXPath = function(xpath, e) {
    //only create more precise xpath if needed
    if (this.findElement(xpath) != e) {
        var result = e.ownerDocument.evaluate(xpath, e.ownerDocument, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        //skip first element (result:0 xpath index:1)
        for (var i = 0, len = result.snapshotLength; i < len; i++) {
            var newPath = 'xpath=(' + xpath + ')[' + (i + 1) + ']';
            if (this.findElement(newPath) == e) {
                return newPath;
            }
        }
    }
    return xpath;
}

/**
 * Percorre a ritroso l'albero dei nodi a partire dal corrente finche' non si giunge al nodo radice.
 * Se l'elemento corrente ha un hook associato allora:
 * - se il locator e' null || ha fratelli || e' un template || e' in un template:
 *      1. assegna al locatore l'hook corrente + indice e concatenando l'hook precedente
 * @param {*} builder 
 * @returns 
 */
function myLocatorBuilder(builder) {

    return (elem) => {
        let locator = null;
        let templateRootParent = false;

        while (elem !== document) {
            let hookName = getAttributeHook(elem);
            if (hookName) {

                // boolean: sta all'interno di un template ?
                const templateRoot = hookName.indexOf(templatePrefix) >= 0;
                const siblings = getAllSiblings(elem, sameHookFilter(hookName));

                const index = siblings.length > 1 ? siblings.indexOf(elem) + 1 : 0;
                
                //first loop (target element) or more siblings found
                if (!locator || siblings.length > 1 || templateRoot || templateRootParent) { 
                    locator = builder.elementLocator(hookName, index) + (locator || '');
                    templateRootParent = !!templateRoot;
                }
            }
            elem = elem.parentNode;
        }
        return builder.prefix + locator;
    }
}

LocatorBuilders.prototype.myLocatorBuilder = function(builder) {
    return (elem) => {
        let locator = null;
        let templateRootParent = false;

        while (elem !== document) {
            let hookName = getAttributeHook(elem);
            if (hookName) {

                // boolean: sta all'interno di un template ?
                const templateRoot = hookName.indexOf(templatePrefix) >= 0;
                const siblings = getAllSiblings(elem, sameHookFilter(hookName));

                const index = siblings.length > 1 ? siblings.indexOf(elem) + 1 : 0;
                
                //first loop (target element) or more siblings found
                if (!locator || siblings.length > 1 || templateRoot || templateRootParent) { 
                    locator = builder.elementLocator(hookName, index) + (locator || '');
                    templateRootParent = !!templateRoot;
                }
            }
            elem = elem.parentNode;
        }
        return builder.prefix + locator;
    }
}

/**
 * Percorre a ritroso l'albero dei nodi a partire dal corrente finche' non si giunge al nodo radice.
 * Restituisce un locator assoluto nel seguente modo:
 * - ad ogni iterazione verifica se il locatore che deriva da "relativeXPathFromParent" non contiene numero.
 *      Se non li contiene, allora concatena [1]
 * Concluso il ciclo, verifica se con la funzione "findElement" applicata all'xpath creato corrisponde l'oggetto di input.
 * Se si, ritorna tale xpath, altrimenti ritorna "null".
 */
LocatorBuilders.add('myXPathAbsolute', function(e, opt_contextNode) {
   	
	//crea xpath assoluto
	let i = 0;
	var path = '';
    var current = e;
   	while (current != document){	
		var currentPath;
		currentPath = this.relativeXPathFromParent(current);
		if (!containsNumbers(currentPath)){
			currentPath = currentPath+'[1]'
		}
		path = currentPath + path;
		
        var locator = '/' + path;
		current = current.parentNode;
    }
	if (e == this.findElement(locator)){
		console.log('Locator_Abs: ', locator);
		return locator;
	}
	return null;
});

/**
 * Robula utilizza in primo luogo l'xpath assoluto per poi derivare xpath alternativi per ogni locatore relativo
 * contenuto nella stringa dell'xpath assoluto.
 * Con "get_L_num" si ottiene una lista degli elementi che compongono l'xpath assoluto.
 * Per ogni elemento ricavato:
 * - applica una o piu' trasformazioni (tra le 4 definire per Robula)
 * - verifica per ogni sotto-elemento appartenente all'elemento dell'xpath assoluto se identifica un path univoco per l'input "e".
 *      Se identifica un path univoco e inizia dalla radice e non ha nessun elemento null, 
 *      allora viene ritornato tale sotto-elemento come locatore, altrimenti 
 *      viene inserito nella lista dei locatori da ispezionare
 * Trasformazioni:
 *  1. Sempre applicata se w inizia con "//*". Sostituisce il carattere * con un nome di tag specifico.
 *  2. Applicata se w non inizia con "//*". Aggiunge uno o più vincoli ad un tag già presente nell'xpath condierando
 * 		solo alcuni tag presi in esame e solo alcune coppie di chiave-valore.
 *  3. Applicata se w non inizia con "//*". Aggiunge l'indice della posizione dell'elemento.
 *  4. Applicata sempre. Estende l'xpath aggiungendo un carattere jolly "*".
 * Pseudocodice: https://ieeexplore.ieee.org/mediastore_new/IEEE/content/media/6982004/6983760/6983884/6983884-fig-3-source-large.gif
 */
LocatorBuilders.add('Robula', function(e, opt_contextNode) {
        
	try{
	console.log("[ROBULA] **START**");		
	console.log("[ROBULA] e: ", e);
	//variables for the list of attributes
	L_attr = [];
	var attr_temp = new Map([]);
	
	//variables for ROBULA
	var current = e;
	var path = '';
    var L = []; //xpath absolute list 
	var robula_loc = ''; //XPath res 
	var p = ['//*']; //starting point 
	var temp = []; //array of temp locators
	var N = 0; 
	
	
	//**BEGINNING ABSOLUTE XPATH AND ATTRIBUTE LIST CONSTRUCTION**
	while (current != document){ 	
		
		attr_temp = new Map([]);
		var currentPath;
		
		currentPath = this.relativeXPathFromParent(current);		
		if(!containsNumbers(currentPath)){
			currentPath = currentPath+'[1]';
		}
		path = currentPath + path;
		var locator = '/' + path;	 //abs_path
		
		for (var i = 0, l = current.attributes.length; i < l; ++i){					
			
			//Of the single current node I save all the <Attribute,Value> pairs.
			attr_temp.set( [ current.attributes[i].name ] , [ current.attributes[i].value ] );
		}
		
		L_attr.push(attr_temp);
		current = current.parentNode;
	}

	abs_path = locator;
	console.log('[ROBULA] abs_path: ', abs_path); ////html/body/app-root/table/tr[4]/td[2]
	console.log('[ROBULA]L_attr: ', L_attr);
	//**BEGINNING ABSOLUTE XPATH AND ATTRIBUTE LIST CONSTRUCTION**
	
	console.log('[ROBULA] myFindElement: ', myFindElement(abs_path))
	
	
	
	
	//**START CONSTRUCTION ARRAY PATH L **	

	L_num = get_L_num(abs_path); 
	console.log('[ROBULA] L_num: ', L_num); //['td[2]', 'tr[4]', 'table[1]', 'app-root[1]', 'body', 'html']
	

	for(let i = 0; i< L_num.length; i++){
		if(L_num[i].match(hook_h)){
			L.push(L_num[i]);
		}else{
			L.push(L_num[i].replace(/[^a-zA-Z- ]/g, '')); //L
		}
	}
	
	//after a fix there is no longer a need to discriminate  between L and L_num
	//to avoid changing the following sections we simply set L = L_num
	L = L_num;
	console.log('[ROBULA] L: ', L); // L=["p", "div", "app-root", "body", "html"]
	//**END CONSTRUCTION ARRAY PATH L **	

   
	//**START LOOP ROBULA **
	//till i not found the locators
	while (robula_loc == '' && N<100000){ //N<VALUE is not part of robula it was put just to avoid infinite loops, robula should finish in few iterations
	
		console.log('[ROBULA] N: ', N);		
		console.log('[ROBULA] p: ', p); //list of temp locators
		console.log('[ROBULA] b_Len_p: ', p.length);
		console.log('[ROBULA] a_Len_p: ', p.length);
		console.log(p);
		
		w = p.shift(); //pick the element at the top (in the first iteration it is the starting point //* 
		temp = []; //array of intermediate locators generated at the current step
		console.log('[ROBULA] elem_c: ', w);
		//N = 0;
		if(w.startsWith("//*")){
		
			//trasformazione 1 // //*/td --> //tr/td
			temp.push(transf1(w,L));
		}else{
						
			//trasformazione 2 //tr/td -> //tr[@id='val']/td			
			temp.push(transf2(w,L_attr)); 
			temp = temp.flat();					
			//trasformazione 3 //tr/td -> //tr[2]/td			
			temp.push(transf3(w,L_num));
			
		}		
		//trasformazione 4  //tr/td --> //*/tr/td
		temp.push(transf4(w,L)); 
		console.log("[ROBULA] temp: ", temp);
		for(let i = 0; i<temp.length;i++){
			
			
			if(XPathResCount(temp[i]) == 1){ //If the locator is unique
				
				console.log('[ROBULA] Locatore unico: ', temp[i]);
				res = myFindElement(temp[i]);
				if(res == e){
				console.log('[ROBULA] ok sono uguali');
				robula_loc = temp[i];
				break;
				}
				
			}else if (XPathResCount(temp[i]) > 1 && XPathResCount(temp[i]) != 0 && !temp[i].startsWith("//*/*")) {
				
				//add in list only if the locator is not unique, does not start with //*/* and is not null/undefined
				console.log('[ROBULA] Locatore NON unico: ', temp[i]);
				if(temp[i] != null && temp[i] != undefined){
				p.push(temp[i]);
				}
			}
		}
		
		N++;
	}//**END LOOP ROBULA **
	
	
	console.log('[ROBULA] finito loop');
	console.log('[ROBULA] ROBULA_LOC: ', robula_loc);
	return robula_loc;
	}catch(error){
		
		console.log('[ROBULA] debug: ', error);
	}
		
});

/**
 * myXpathRel identifica in primo luogo l'xpath assoluto per poi derivare il primo xpath relativo da quello assoluto.
 * Costruito l'xpath assoluto, salva in (abs, L_num, L e L_base) i valori formattati come nell'esempio:
 *      abs=		//html/body/app-root/table/tr[4]/td[2]
 *      L_num=	['td[2]', 'tr[4]', 'table[1]', 'app-root[1]', 'body', 'html']
 *      L=		["td", "tr", "table","app-root", "body", "html"]
 *      L_base =	['//td', '//tr/td[2]', '//table/tr[4]/td[2]', '//app-root/table[1]/tr[4]/td[2]', '//body/app-root[1]/table[1]/tr[4]/td[2]', '//html/body/app-root[1]/table[1]/tr[4]/td[2]']
 * Dopo aver ricavato l' xpath assoluto verifica se una sola volta if(primo == 1) se:
 *  - concantenando L_base[N] e [normalize-space()='"+primo_text+"'] si ottiene un xpath che identifica l'elemento.
 * 
 * L_attr e' una mappa che associa ad ogni elemento del path assoluto una mappa. 
 * la mappa di secondo livello contiene le coppie nome-valore di ogni attributo associato all'elemento considerato.
 * Per accedera a tutti gli attributi di un singolo elemento si accede con "L_attr[calcolaN(c_elem)-1]".
 * 
 * Se l'xpath composto a partire dal primo elemento non identifica univocamente l'elemento, allora iterativamente:
 * - Per ogni elemento del path assoluto si accede alla mappa degli attirubuti con "L_attr[calcolaN(c_elem)-1]",
 * - Per ogni attributo si genera un xpath relativo e se rispetta il seguente vincolo allora viene inserito in "temp" 
 *   per essere poi esaminato. Vincolo:
 *      !t.includes('href') && !t.includes('style') && !t.includes('ng-') && !t.includes('@ng-') && !t.includes('@_ng') && !t.includes(hookPrefix) && !t.includes(templatePrefix)
 *   Finito di costruire gli xpath relativi ad un singolo elemento dell'xpath originario assoluto, verifica se 
 *   esiste almeno un xpath generato che rappresenti univocamente l'elemento "e"; se si termina.
 */
LocatorBuilders.add('myXpathRel', function(e, opt_contextNode) {
        
	try{
	console.log("[REL] **START**");		
	console.log("[REL] e: ", e);	
	L_attr = []; //variables for the list of attributes
	var attr_temp = new Map([]);
	
	
	var current = e;
	var path = '';
	var locator = '';
    var L = []; //xpath absolute list 
	var relative_loc = ''; //XPath res 
	var temp = [];//array of temp locators
	var N = 0; 
		
	//**BEGINNING ABSOLUTE XPATH AND ATTRIBUTE LIST CONSTRUCTION**
	while (current != document ){	
		
		attr_temp = new Map([]);
		var currentPath;
		
		currentPath = this.relativeXPathFromParent(current);		
		path = currentPath + path;			
		var locator = '/' + path;	
		
		for (var i = 0, l = current.attributes.length; i < l; ++i){					
			
			//Of the single current node I save all the <Attribute,Value> pairs
			attr_temp.set( [ current.attributes[i].name ] , [ current.attributes[i].value ] );
		}
		
		L_attr.push(attr_temp);
		current = current.parentNode;
	}
	
	abs_path = locator;	
	console.log('[REL] abs_path: ', abs_path); ////html/body/app-root/table/tr[4]/td[2]
	console.log('[REL] L_attr: ', L_attr);
	//**BEGINNING ABSOLUTE XPATH AND ATTRIBUTE LIST CONSTRUCTION**
	
	
	//**START CONSTRUCTION ARRAY PATH L **	
	L_num = get_L_num(abs_path); 
	console.log('[REL] L_num: ', L_num); //['td[2]', 'tr[4]', 'table[1]', 'app-root[1]', 'body', 'html']
	
   		for(let i = 0; i< L_num.length; i++){
		if(L_num[i].match(hook_h)){
			L.push(L_num[i]);
		}else{
			L.push(L_num[i].replace(/[^a-zA-Z- ]/g, '')); //genero L
		}
	}
	//after a fix there is no longer a need to discriminate  between L and L_num
	//to avoid changing the following sections we simply set L = L_num
	L = L_num;
	console.log('[REL] L: ', L); // L=["p", "div", "app-root", "body", "html"]
	//**END CONSTRUCTION ARRAY PATH L **
	
	// abs=		//html/body/app-root/table/tr[4]/td[2]
	// L_num=	['td[2]', 'tr[4]', 'table[1]', 'app-root[1]', 'body', 'html']
	// L=		["td", "tr", "table","app-root", "body", "html"]
	// L_base =	['//td', '//tr/td[2]', '//table/tr[4]/td[2]', '//app-root/table[1]/tr[4]/td[2]', '//body/app-root[1]/table[1]/tr[4]/td[2]', '//html/body/app-root[1]/table[1]/tr[4]/td[2]']
	
	
	L_base = get_L_base(L,L_num);
	console.log('[REL] L_base :', L_base); //genero array degli xpath 
   	
	N = 0;
	primo = 1;
	let current_path = '//';
	//till i not found the locators
	while(relative_loc == '' && N<L.length){
		
		temp= [];
		c_elem = L_base[N]; //pick the element at the top
		console.log('[REL] c_elem: ', c_elem);
		
		if(primo == 1){
			
			primo = 0;
			primo_text = e.innerText;
			// //td[normalize-space()='Phone:']
			loc_primo = c_elem+"[normalize-space()='"+primo_text+"']"
			console.log('[REL] loc_primo: ',loc_primo);
			res1 = myFindElement(loc_primo);
			if(res1 == e){
				
				relative_loc = loc_primo;
				console.log('[REL] ok sono uguali');
				console.log('[REL] finito loop');
				console.log('[REL] RELATIVE LOC: ', relative_loc);
				return relative_loc;
			}
			
		}
		
		a = L_attr[calcolaN(c_elem)-1];
		console.log('[REL] a: ', a );
		console.log('[REL] a_size:', a.size);
		for(let k = 0, v = a.size; k<v; k++){
			t = '';
			// The key at the desidered index
			var key = Array.from(a.keys())[k];  // return name of the attribute
			// The value of the item at desidered index
			var val1 = a.get(key);  //ritorna il valore dell'attributo
			s_attr = "[@"+key+"='"+val1+"']"; //bulding the string 
			b = mySlicer(c_elem);
			b[0]=b[0]+s_attr; //insert attribute in the Xpath
			for(let k = 0, v = b.length; k < v; k++){
				t+= '/'+b[k] //re-build of the xpath
			}
			
			t='/'+t;
			if(!t.includes('href') && !t.includes('style') && !t.includes('ng-') && !t.includes('@ng-') && !t.includes('@_ng') && !t.includes(hookPrefix) && !t.includes(templatePrefix)){
				console.log('[REL] XPATH REL: ',t);
				temp.push(t); 
			}
		}
		
		console.log('[REL] lista_temp: ', temp);
		for(i = 0, v = temp.length; i<v; i++){ //check of the xpath
			
			if(XPathResCount(temp[i]) == 1){ // if the locator is unique
				console.log('[REL] Locatore unico: ', temp[i]);
				res = myFindElement(temp[i]);
					if(res == e){
						console.log('[REL] ok sono uguali');
						relative_loc = temp[i];
				}
			
			}
		}
		
		//if I haven't found a locator, I increase the XPath of one level-> \tr --> \tr\td
		N++;
	}
	
	console.log('[REL] finito loop');
	console.log('[REL] RELATIVE LOC: ', relative_loc);
	return relative_loc;
	
	}catch(error){
		
		console.log('debug: ', error);
	}
		
});

LocatorBuilders.prototype.myXpathRel = function(e, opt_contextNode) {
	try{
	console.log("[REL] **START**");		
	console.log("[REL] e: ", e);	
	L_attr = []; //variables for the list of attributes
	var attr_temp = new Map([]);
	
	
	var current = e;
	var path = '';
	var locator = '';
    var L = []; //xpath absolute list 
	var relative_loc = ''; //XPath res 
	var temp = [];//array of temp locators
	var N = 0; 
		
	//**BEGINNING ABSOLUTE XPATH AND ATTRIBUTE LIST CONSTRUCTION**
	while (current != document ){	
		
		attr_temp = new Map([]);
		var currentPath;
		
		currentPath = this.relativeXPathFromParent(current);		
		path = currentPath + path;			
		var locator = '/' + path;	
		
		for (var i = 0, l = current.attributes.length; i < l; ++i){					
			
			//Of the single current node I save all the <Attribute,Value> pairs
			attr_temp.set( [ current.attributes[i].name ] , [ current.attributes[i].value ] );
		}
		
		L_attr.push(attr_temp);
		current = current.parentNode;
	}
	
	abs_path = locator;	
	console.log('[REL] abs_path: ', abs_path); ////html/body/app-root/table/tr[4]/td[2]
	console.log('[REL] L_attr: ', L_attr);
	//**BEGINNING ABSOLUTE XPATH AND ATTRIBUTE LIST CONSTRUCTION**
	
	
	//**START CONSTRUCTION ARRAY PATH L **	
	L_num = get_L_num(abs_path); 
	console.log('[REL] L_num: ', L_num); //['td[2]', 'tr[4]', 'table[1]', 'app-root[1]', 'body', 'html']
	
   		for(let i = 0; i< L_num.length; i++){
		if(L_num[i].match(hook_h)){
			L.push(L_num[i]);
		}else{
			L.push(L_num[i].replace(/[^a-zA-Z- ]/g, '')); //genero L
		}
	}
	//after a fix there is no longer a need to discriminate  between L and L_num
	//to avoid changing the following sections we simply set L = L_num
	L = L_num;
	console.log('[REL] L: ', L); // L=["p", "div", "app-root", "body", "html"]
	//**END CONSTRUCTION ARRAY PATH L **
	
	// abs=		//html/body/app-root/table/tr[4]/td[2]
	// L_num=	['td[2]', 'tr[4]', 'table[1]', 'app-root[1]', 'body', 'html']
	// L=		["td", "tr", "table","app-root", "body", "html"]
	// L_base =	['//td', '//tr/td[2]', '//table/tr[4]/td[2]', '//app-root/table[1]/tr[4]/td[2]', '//body/app-root[1]/table[1]/tr[4]/td[2]', '//html/body/app-root[1]/table[1]/tr[4]/td[2]']
	
	
	L_base = get_L_base(L,L_num);
	console.log('[REL] L_base :', L_base); //genero array degli xpath 
   	
	N = 0;
	primo = 1;
	let current_path = '//';
	//till i not found the locators
	while(relative_loc == '' && N<L.length){
		
		temp= [];
		c_elem = L_base[N]; //pick the element at the top
		console.log('[REL] c_elem: ', c_elem);
		
		if(primo == 1){
			
			primo = 0;
			primo_text = e.innerText;
			// //td[normalize-space()='Phone:']
			loc_primo = c_elem+"[normalize-space()='"+primo_text+"']"
			console.log('[REL] loc_primo: ',loc_primo);
			res1 = myFindElement(loc_primo);
			if(res1 == e){
				
				relative_loc = loc_primo;
				console.log('[REL] ok sono uguali');
				console.log('[REL] finito loop');
				console.log('[REL] RELATIVE LOC: ', relative_loc);
				return relative_loc;
			}
			
		}
		
		a = L_attr[calcolaN(c_elem)-1];
		console.log('[REL] a: ', a );
		console.log('[REL] a_size:', a.size);
		for(let k = 0, v = a.size; k<v; k++){
			t = '';
			// The key at the desidered index
			var key = Array.from(a.keys())[k];  // return name of the attribute
			// The value of the item at desidered index
			var val1 = a.get(key);  //ritorna il valore dell'attributo
			s_attr = "[@"+key+"='"+val1+"']"; //bulding the string 
			b = mySlicer(c_elem);
			b[0]=b[0]+s_attr; //insert attribute in the Xpath
			for(let k = 0, v = b.length; k < v; k++){
				t+= '/'+b[k] //re-build of the xpath
			}
			
			t='/'+t;
			if(!t.includes('href') && !t.includes('style') && !t.includes('ng-') && !t.includes('@ng-') && !t.includes('@_ng') && !t.includes(hookPrefix) && !t.includes(templatePrefix)){
				console.log('[REL] XPATH REL: ',t);
				temp.push(t); 
			}
		}
		
		console.log('[REL] lista_temp: ', temp);
		for(i = 0, v = temp.length; i<v; i++){ //check of the xpath
			
			if(XPathResCount(temp[i]) == 1){ // if the locator is unique
				console.log('[REL] Locatore unico: ', temp[i]);
				res = myFindElement(temp[i]);
					if(res == e){
						console.log('[REL] ok sono uguali');
						relative_loc = temp[i];
				}
			
			}
		}
		
		//if I haven't found a locator, I increase the XPath of one level-> \tr --> \tr\td
		N++;
	}
	
	console.log('[REL] finito loop');
	console.log('[REL] RELATIVE LOC: ', relative_loc);
	return relative_loc;
	
	}catch(error){
		
		console.log('debug: ', error);
	}
		
};

const cssBuilders = {
    elementLocator: (hookName, index) => {
        return '[' + hookName + ']' + (index > 0 ? ':nth-of-type(' + index + ')' : '') + ' ';
    },
    prefix: 'css='
}

const xpathBuilders = {
    elementLocator: (hookName, index) => {
        return `//*[@${hookName}]` + (index > 0 ? `[${index}]` : '');
    },
    prefix: ''
}


LocatorBuilders.add('myXPathHook', myLocatorBuilder(xpathBuilders));


LocatorBuilders.add('myXPathHookRelativeTemplate', function(e, opt_contextNode) {
	let locator = null;
	while (e !== document) {
		let hookName = getAttributeHook(e);
		if (hookName) {
			const templateRoot = hookName.indexOf(templatePrefix) >= 0;
			if(templateRoot){
				locator = this.myXpathRel(e) + (locator || '');
				return xpathBuilders.prefix + locator;
			} else {
				const siblings = getAllSiblings(e, sameHookFilter(hookName));
				const index = siblings.length > 1 ? siblings.indexOf(e) + 1 : 0;

				if (!locator || siblings.length > 1) { //first loop (target element) or more siblings found
					locator = xpathBuilders.elementLocator(hookName, index) + (locator || '');
				}
			}
		}
		e = e.parentNode;
	}
	return xpathBuilders.prefix + locator;
}) 

/* not working
LocatorBuilders.add('myXPathHookRelativeTemplateFromParent', function(e, opt_contextNode) {
	let locator = null;
	while (e !== document) {
		let hookName = getAttributeHook(e);
		if (hookName) {
			const templateRoot = hookName.indexOf(templatePrefix) >= 0;
			if(templateRoot){
				locator = this.relativeXPathFromParent(e) + (locator || '');
			} else {
				const siblings = getAllSiblings(e, sameHookFilter(hookName));
				const index = siblings.length > 1 ? siblings.indexOf(e) + 1 : 0;

				if (!locator || siblings.length > 1) { //first loop (target element) or more siblings found
					locator = xpathBuilders.elementLocator(hookName, index) + (locator || '');
				}
			}
		}
		e = e.parentNode;
	}
	const prefix = locator.startsWith("/") ? '/' : '';
	return xpathBuilders.prefix + `${prefix}${locator}`;
}) 
*/

function getRelativePathsFromLocator(locator){
	const relativeLocators = [];
	const parts = locator.split("//*");
	for(let i = 0; i < parts.length; i++){
	  if(parts[i] !== undefined && parts[i] !== null && parts[i] !== ""){
		console.log(parts[i]);
		const selectedChars = locator.lastIndexOf(parts[i]) + parts[i].length;
		relativeLocators[i] = locator.substring(0, selectedChars);
	  }
	}
	return relativeLocators;
}


LocatorBuilders.add('myXPathHookRelativeTemplateFromParentRegex', function(e, opt_contextNode) {
	const filterEmpties = (array) => array?.filter(hook => (hook !== null && hook !== undefined && hook !== ""));

	const locatorXPathHook = this.myLocatorBuilder(xpathBuilders)(e);
	const relativeLocators = filterEmpties(getRelativePathsFromLocator(locatorXPathHook));
	const hooks = filterEmpties(locatorXPathHook.split('//*'));

	let result = '';
	for(let i = 0; i < hooks.length; i++){
		if(hooks[i]?.includes(templatePrefix)){
			const HTMLelement = myFindElement(relativeLocators[i]);
			const xPathRelative = this.relativeXPathFromParent(HTMLelement);
			result = `${result}${xPathRelative}`;
		} else {
			result = `${result}//*${hooks[i]}`;
		}
	}
	const prefix = result.startsWith("/") ? '/' : '';
	return `${prefix}${result}`;
})

//this function I set the order in which I want katalon to return the locators
LocatorBuilders.setPreferredOrder([
	'myXPathHookRelativeTemplate', 
	//'myXPathHookRelativeTemplateFromParent', 
	'myXPathHookRelativeTemplateFromParentRegex',
	'myXPathHook', 
	'myXpathRel',
	'Robula',
	'myXPathAbsolute'
]);

/*
other utility function
*/

function getAttributeHook(elem) {
    for (var i = 0, l = elem.attributes.length; i < l; ++i) {
        let match = elem.attributes[i].name.match(hookRegex);
        if (match) {
            return match[0];
        }
    }
}

// get all sibilings and filter
function getAllSiblings(elem, filter) {
    var siblings = [];
    elem = elem.parentNode.firstChild;
    do {
        if (elem.nodeType === 1) {
            if (!filter || filter(elem)) {
                siblings.push(elem);
            }
        }
    } while ((elem = elem.nextSibling))
    return siblings;
}

function sameHookFilter(hookName) {
    return e => e.hasAttribute(hookName);
}

function containsNumbers(str) {
  return /[0-9]/.test(str);
}

function containsSpecialChar(str){
return /[ `!@#$%^&*()_+\-={};':"\\|,.<>?~]/.test(str);
}

/**
 * Restituisce la profondita' del nodo nell'albero delle dipendenze.
 * @param {*} str 
 * @returns un intero che rappresenta il livello nell'albero
 */
function calcolaN(str) {
	str = str.split(new RegExp('/'));
	str = str.slice(2,);
	str = str.reverse(); 
	return str.length;
}


function mySlicer(str) {
 
	//spliting an XPath 
	//ex w="//tr/td" -> mySlicer(w) = ["tr", "td"]
	str = str.split(new RegExp(/(?<!')\/(?!')/));
	str = str.slice(2,);
	//str = str.reverse(); 
	new_str = unisciStringhe(str,'artist'); //special case for the spotify app
	return new_str;
}

function unisciStringhe(vettore,word) { //unisciString --> in English: mergeString 
	
  // Find the index of the first element that contains the string "hello"  
   index_f = vettore.findIndex((elemento) => elemento.includes(word));

 // If no element containing the string "hello" was found, return the original vector
  if (index_f === -1) {
    return vettore;
  }

 // Merge the element with the string "hello" with the next element
   nuovaStringa = vettore[index_f] + "/" + vettore[index_f + 1];
   
  // Creates a new vector with the new string in place of the original two elements
   nuovoVettore = [...vettore.slice(0, index_f), nuovaStringa, ...vettore.slice(index_f + 2)];

  return nuovoVettore;
}


/**
 * Rimuove tutte le occorrenze del carattere "*" da "L"
 * @param {*} str 
 * @param {*} L 
 * @returns 
 */
function transf1(str, L){
  
	//replace the tag * with the tag of L.get(N)
	// L = [td, tr, div] -> L.get(2) = tr
	// //*/td --> //tr/td
	str = str.replace( '*', L[calcolaN(str)-1] );
	//console.log('w_replace: ', str);

  return str;
}

function transf2(str,L_attr){

	//add the predicate (one at time) of the element L.get(N)
	// to the first node in w 
	// ex. //tr/td -> //tr[@id='val']/td
	let temp = '';
	str1 = [];
	a = L_attr[calcolaN(str)-1];//individuare la Lista_attr che mi serve
	for (let k =1, v = a.size; k<v; k++){
		console.log('[ROBULA_t2] transf2');
		temp='';
		// The key at the desidered index
		var key = Array.from(a.keys())[k];  // ritorna il nome dell'attributo
		test_key = String(key);
		
		if(test_key.includes(hookPrefix) || test_key.includes(templatePrefix)){
			console.log('[ROBULA_t2] TROVATO HOOK: ', key);
			key = null;
		}
		// The value of the item at desidered index
		var val1 = a.get(key);  //ritorna il valore dell'attributo
		console.log('[ROBULA_t2] key: ', key);
		console.log('[ROBULA_t2] value', val1);
		s_attr = "[@"+key+"='"+val1+"']"; //costruisco la stringa
		console.log('[ROBULA_t2] s_attr: ', s_attr);
		b = mySlicer(str); //ritorna: in://tr/td => out:['tr','td']
		console.log('[ROBULA_t2] slicer: ', b); 
		//if(containsSpecialChar(b[0]) || key == null || key.includes('ng-') || key.includes('@ng-') || key.includes('@_ng')){
		if(containsSpecialChar(b[0])){
		console.log('[ROBULA_t2] FOUND: ', b[0], '- ', key);
			//return null;
			key = null;
		}else if(!containsSpecialChar(b[0]) && (key != null) && (val1 != null) && !test_key.includes('ng')  && !test_key.includes('style')  && !test_key.includes('href')) { //se non contiene già un attr AND se ho un attributo e un valore
		
			
			b[0]=b[0]+s_attr; // tr --> tr[@id='val']
			//console.log('b_len: ',  b.length);
			//console.log('b0 ', b[0])
			
			for(let k = 0, v = b.length; k < v; k++){
				temp+= '/'+b[k] //ricostruisco l'XPath
			}	  
			console.log('[ROBULA_t2] temp: ', temp);
			t='/'+temp;
			console.log('[ROBULA_t2] t: ', t);
			str1.push(t);
		}
		
		
	}	
	console.log('[ROBULA_t2] str1: ', str1);
	return str1;
}

function transf3(str,L_num){
	
	//adds the position of the element L.get(N)
	//to the first node in w
	// ex. //tr/td -> //tr[2]/td
	console.log('[ROBULA_t3] transf3: ',str);
	let temp = ''
	a = mySlicer(str);
	//console.log('a: ', a);
	
	if(containsNumbers(L_num[calcolaN(str)-1]) && a.length>1){ //se il node ha una position td[2]
	
		//elem = console.log('elem:', p[0] );
		//console.log(p[L_num[calcolaN(w)-1]]);
		a[0]=L_num[calcolaN(str)-1];
		//console.log('a0: ', a[0]);
		
		for(let k=0; k<a.length; k++){ 			
			temp+= '/'+ a[k]; //ricostruisco la stringa dell'XPath
		}
		str='/'+temp;
		console.log('[ROBULA_t3] str_t3: ', str);
		return str;
	}
	return null;
}

function transf4(str, L){

 // adds //* at the top of w 
 // //tr/td --> //*/tr/td
 console.log('[ROBULA_t4] transf4');
  if(w.startsWith("//*/*") || calcolaN(str) >= L.length ){
      console.log('[ROBULA_t4] ok');
  	return null;
  }else {
  	str = '//*'+str.substring(1,);  
  	console.log('[ROBULA_t4] str_t4: ',str);
	return str;
  }
}

function get_L_num(str){
    
    str = str.split(new RegExp('/'));
    str = str.slice(2,);
    str = str.reverse();
    str = L_num_fix(str);
    
    return str;
}

function L_num_fix(str){
  
  for(let i = 0, v =str.length-2; i< v; i++){
	
	if(!containsNumbers(str[i])){
	  
	  str[i] = str[i]+'[1]';
	  }
  }

  return str;
  
}

function get_L_base(L, L_num){
    
	str=[];
    for(let i = 0, v = L.length; i < v ; i++){
		s_int='';
		for(let k = i-1; k>=0; k--){
        
			s_int+='/'+L_num[k];
        //console.log(i, s_int);
		}
    
    s_ext = '//'+L[i]+s_int;
    str.push(s_ext);
	}
	return str;
}

/**
 * Conta il numero di elementi che un xpath ritorna 
 * @param {*} locator il percorso xpath
 * @returns un contatore intero 
 */
function XPathResCount(locator) {
 	
	locator = 'count('+locator+')';
	const res_count = document.evaluate(locator, document, null, XPathResult.ANY_TYPE, null);
	console.log('This document contains: [', res_count.numberValue, '] elements identified by the locator: ', locator);
	 
	return res_count.numberValue;
}

function myFindElement(locator){
	
	if(XPathResCount(locator) == 1){
		const firstP = document.evaluate(locator, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
		console.log('Found Element:', firstP);
		return firstP;
	}else{
		console.log('Locatore Non Univico');
		return null;
	}
}

function myFindElements(locator){
	
	elem_list = [];
	
	const res = document.evaluate(locator, document, null, XPathResult.ANY_TYPE, null);
	//console.log(locator ,' ' , res);
	
	let curr_elem = res.iterateNext();
	
	while (curr_elem) {
		console.log('myFindElement: ', curr_elem);
		elem_list.push(curr_elem.outerHTML);
		curr_elem = res.iterateNext();
		}
	
	return elem_list;
}

