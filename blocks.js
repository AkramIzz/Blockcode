let blocks = (function namespace() {
   function create(name, value, contents) {
      let item = _elem('div',
         {'class': 'block', draggable: true, 'data-name': name},
         [name]
      );
      
      if (value !== undefined && value !== null) {
         item.appendChild(_elem('input', {type: 'number', value: value}))
      }

      if (Array.isArray(contents)) {
         item.appendChild(
            _elem('div', {'class': 'container'}, contents.map(function(block){
               return create.apply(null, block);
         })));
      } else if (typeof contents === 'string') {
         item.appendChild(document.createTextNode(contents));
      }

      return item;
   }

   function _elem(name, attributes, children) {
      let element = document.createElement(name);
      for (key in attributes) {
         element.setAttribute(key, attributes[key]);
      }
      for (i in children) {
         if (children[i] !== undefined && children[i] !== null)
            element.append(children[i]);
      }
      return element;
   }

   // returns child blocks from container block or null
   function contents(block) {
      let container = block.querySelector('.container');
      return container ? [].slice.call(container.children) : null;
   }

   // returns numerical value of input block or null
   function value(block) {
      let input = block.querySelector('input');
      return input ? Number(input.value) : null;
   }

   // returns the units of input block or null
   function units(block) {
      if (block.childNodes.length > 1
      && block.lastChild.nodeType === Node.TEXT_NODE
      && block.lastChild.textContent) {
         return block.lastChild.textContent;
      } else {
         return null;
      }
   }
   
   // returns a structure for serialization using json
   function script(block) {
      let res = [block.dataset.name];
      let value = value(block);
      let contents = contents(block);
      let units = units(block);
      if (value !== null) res.push(value);
      if (contents !== null) res.push(contents.map(res));
      if (units !== null) res.push(units);
      return res;
   }

   function runBlocks(blocks) {
      blocks.forEach(function(block) { trigger('run', block); });
   }

   function trigger(name, target){
      target.dispatchEvent(new CustomEvent(name, {bubbles: true, cancelable: false}));
   };

   return {create, contents, value, units, script, runBlocks, trigger};
})();