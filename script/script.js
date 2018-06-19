
var 
	form = document.forms[0],
	wrapper = document.querySelector('.wrapper'),
	nameField = document.querySelector('#pairs-field'),
	xmlWrapper = document.querySelector('.xml-wrapper'),
	pairsList = document.querySelector('.pairs-container'),
	listWrapper = document.querySelector('.list-wrapper');

//********************* BUTTONS************************

var addButton = document.querySelector('.add'),
	nameSortButton = document.querySelector('#sort-name'),
	valueSortButton = document.querySelector('#sort-value'),
	deleteButton = document.querySelector('#delete'),
	xmlButton = document.querySelector('#xml'),
	closeButton = document.querySelector('#close');

// ****************************************************

var pairsArray = []; // array with objects which contain name and value for "sort"
	
var regExp = /^([a-zA-Z0-9]+)$/; //n

form.onsubmit = function(){
	return false;
}
pairsList.addEventListener('click',function(event){
	var target = event.target;
	if(target.tagName != 'LI') return;

	toggleSelect(target);
	


});

addButton.addEventListener('click', function(event){
	
	var str = nameField.value;
	nameField.value = '';
	
	var separetorPosition = str.indexOf('=');

	var name = str.substring(0, separetorPosition),
	 	value = str.substring(separetorPosition + 1);

	if(regExp.test(name) && regExp.test(value)){
		var li = document.createElement('li');
		li.innerHTML = str;
		pairsList.appendChild(li);
		pairsLiArray.push(li);

		pairsArray.push({
			name: name,
			value: value,
		});
		nameField.focus();
	}else{
		return false;
	};	
});

var pairsLiArray = [],
	sortedArray = [];

nameSortButton.addEventListener('click', function(event){
	if(pairsArray.length == 0){
		return false;
	};
	

	pairsArray.sort(nameCompare);
	pairsList.innerHTML = '';
	pairsArray.forEach(function(item, i, array){
		var li = document.createElement('li');
		li.innerHTML = item.name + '=' + item.value;
		pairsList.appendChild(li);
		sortedArray.push(li);

	})
	
});

valueSortButton.addEventListener('click', function(event){
	if(pairsArray.length == 0){
		return false;
	};
	pairsArray.sort(valueCompare);
	pairsList.innerHTML = '';
	pairsArray.forEach(function(item, i, array){
		var li = document.createElement('li');
		li.innerHTML = item.name + '=' + item.value;
		pairsList.appendChild(li);
	})
	
});



deleteButton.addEventListener('click', function(event){
	var nonSelectedPairs = [];
	var ulLength = pairsList.children.length;
	for (var i = 0; i < ulLength; i++){
		if(!pairsList.children[i].classList.contains('toggle-select')){
			nonSelectedPairs.push(pairsList.children[i]); //unchosen items
		};
	};
	pairsList.innerHTML = '';
	for(var i = 0; i < nonSelectedPairs.length; i++){
		nonSelectedPairs[i] = getNameValue(nonSelectedPairs[i]);
	};
	
	pairsArray = nonSelectedPairs.slice(0);
	pairsArray.forEach(function(item){
		
		var li = document.createElement('li');
		li.innerHTML = item.name +'='+item.value;
		pairsList.appendChild(li);
	});

	



});

var xmlDiv = document.createElement('div');

xmlButton.addEventListener('click', function(event){
	xmlWrapper.classList.add('visible');
	wrapper.classList.add('unvisible');
	
	xml_formatted = formatXml(createXML(pairsList));
	xml_escaped = xml_formatted.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/ /g, '&nbsp;').replace(/\n/g,'<br />');
	xmlDiv.innerHTML = xml_escaped;
	xmlWrapper.appendChild(xmlDiv);
	
});

closeButton.addEventListener('click', function(event){
	xmlWrapper.classList.remove('visible');
	wrapper.classList.remove('unvisible');
	wrapper.classList.add('visible');
})



// FUNCTIONS
function nameCompare(elemA, elemB){
	return elemA.name > elemB.name;
}

function valueCompare(elemA, elemB){
	return elemA.value > elemB.value;
}

function toggleSelect(node){
	node.classList.toggle('toggle-select');
	
};


function createXML(parentElem){ // parentNode is UL
	var UL = document.createElement('List'),
		LI = document.createElement('Elem'),
		NAME = document.createElement('Name'),
		VALUE = document.createElement('Value');
	
	
			

	var i = 0;
	while( i < parentElem.children.length){
		var LI = document.createElement('Elem');
		if(parentElem.children){
			UL.appendChild(LI);
			if(getNameValue(parentElem.children[i]).name && getNameValue(parentElem.children[i]).value){
				var NAME = document.createElement('Name'),
					VALUE = document.createElement('Value');
				LI.appendChild(NAME);
				NAME.innerHTML = getNameValue(parentElem.children[i]).name;
				LI.appendChild(VALUE);
				VALUE.innerHTML = getNameValue(parentElem.children[i]).value;
				i++;
			};
		};
		
	};
	
		
	var xml = '<?xml version="1.1" encoding="UTF-8" ?>\n';
		xml += UL.outerHTML;
		return xml;
		
};


function getNameValue(node){ // node is li
		var separetorPosition = node.innerText.indexOf('='),
			name = node.innerText.slice(0, separetorPosition),
			value = node.innerText.slice(separetorPosition + 1);
		return {
			name: name,
			value: value,
		};
};


//formate XML for pretty view

function formatXml(xml) {
    var formatted = '';
    var reg = /(>)(<)(\/*)/g;
    xml = xml.replace(reg, '$1\r\n$2$3');
    var pad = 0;
    jQuery.each(xml.split('\r\n'), function(index, node) {
        var indent = 0;
        if (node.match( /.+<\/\w[^>]*>$/ )) {
            indent = 0;
        } else if (node.match( /^<\/\w/ )) {
            if (pad != 0) {
                pad -= 1;
            }
        } else if (node.match( /^<\w[^>]*[^\/]>.*$/ )) {
            indent = 1;
        } else {
            indent = 0;
        }

        var padding = '';
        for (var i = 0; i < pad; i++) {
            padding += '  ';
        }

        formatted += padding + node + '\r\n';
        pad += indent;
    });

    return formatted;
}



