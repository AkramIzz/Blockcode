let interpreter = (function namespace() {
   let menu = document.querySelector('.menu');
   let script = document.querySelector('.script');
   let scriptRegistry = {};
   let scriptDirty = false;

   function runSoon() { scriptDirty = true; }

   function run() {
      if (scriptDirty) {
         scriptDirty = false;
         blocks.trigger('beforeRun', script);
         let blocksList = [].slice.call(document.querySelectorAll('.script > .block'));
         blocks.runBlocks(blocksList);
         blocks.trigger('afterRun', script);
      } else {
         blocks.trigger('everyFrame', script);
      }
      requestAnimationFrame(run);
   }
   requestAnimationFrame(run);

   function runEach(event) {
      let element = event.target;
      if (!util.matches(element, '.script .block')) return;
      if (element.dataset.name === 'Define block') return;

      element.classList.add('running');
      scriptRegistry[element.dataset.name](element);
      element.classList.remove('running');
   }

   function menuItem(name, fn, value, units) {
      let item = blocks.create(name, value, units);
      scriptRegistry[name] = fn;
      menu.appendChild(item);
      return item;
   }

   script.addEventListener('run', runEach, false);
	script.addEventListener('change', runSoon, false);
   script.addEventListener('keyup', runSoon, false);
   document.addEventListener('drop', runSoon, false);
   
   return { runSoon, run, runEach, menuItem };
})();