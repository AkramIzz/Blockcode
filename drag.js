let drag = (function namespace() {
   let dragTarget = null;
   let dragType = null;
   let scriptsBlocks = [];

   function start(event) {
      if (!util.matches(event.target, '.block')) return;
      if (util.matches(event.target, '.menu .block')) {
         dragType = 'menu';
      } else {
         dragType = 'script';
      }

      dragTarget = event.target;
      event.target.classList.add('dragging');
      scriptBlocks = [].slice.call(
         document.querySelectorAll('.script .block:not(.dragging)')
      );

      // firefox requires this
      event.dataTransfer.setData('text/html', event.target.outerHTML);

      if (util.matches(event.target, '.menu .block')) {
         event.dataTransfer.effectAllowed = 'copy';
      } else {
         event.dataTransfer.effectAllowed = 'move';
      }
   }

   function over(event) {
      if (!util.matches(event.target,
            '.menu, .menu *, .script, .script *, .content'))
         return;

      if (event.preventDefault) event.preventDefault();
      
      if (dragType == 'menu') {
         event.dataTransfer.dropEffect = 'copy';
      } else {
         event.dataTransfer.dropEffect = 'move';
      }
      return false;
   }

   function drop(event) {
      if (!util.matches(event.target,
            '.menu, .menu *, .script, .script *'))
         return;

      let dropTarget = _closest(
         event.target,
         '.script .container, .script .block, .menu, .script'
      );
      let dropType = 'script';
      if (util.matches(dropTarget, '.menu'))
         dropType = 'menu';
      
      if (event.stopPropagation)
         event.stopPropagation();
      
      if (dragType === 'script' && dropType === 'menu') {
         _trigger('blockRemoved', dragTarget.parentElement, dragTarget);
         dragTarget.parentElement.removeChild(dragTarget);
      } 
      else if (dragType === 'script' && dropType === 'script') {
         if (util.matches(dropTarget, '.block')) { // insert after
            dropTarget.parentElement.insertBefore(dragTarget, dropTarget.nextSibling);
         } else { // insert inside the container block
            dropTarget.insertBefore(dragTarget, dropTarget.firstChildElement);
         }
         _trigger('blockMoved', dropTarget, dragTarget);
      }
      else if (dragType === 'menu' && dropType === 'script') {
         let newNode = dragTarget.cloneNode(true);
         newNode.classList.remove('dragging');
         if (util.matches(dropTarget, '.block')) { // insert after
            dropTarget.parentElement.insertBefore(newNode, dropTarget.nextSibling);
         } else { // insert inside the container block
            dropTarget.insertBefore(newNode, dropTarget.firstChildElement);
         }
         _trigger('blockAdded', dropTarget, newNode);
      }
   }

   function _trigger(name, target, source) {
      
   }

   function _closest(elem, selector) {
      while (elem) {
         if (util.matches(elem, selector)) return elem;
         elem = elem.parentElement;
      }
      return null;
   }

   function end(event) {
      _findAndRemoveClass('dragging');
      _findAndRemoveClass('over');
      _findAndRemoveClass('next');
   }

   function _findAndRemoveClass(klass) {
      let elem = document.querySelector('.' + klass);
      if (elem) elem.classList.remove(klass);
   }

   document.addEventListener('dragstart', start, false);
   document.addEventListener('dragover', over, false);
   document.addEventListener('drop', drop, false); 
   document.addEventListener('dragend', end, false);

   return {start, over, drop, end};
})();