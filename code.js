let code = (function namespace() {
   function repeat(block) {
      let count = blocks.value(block);
      let children = blocks.contents(block);
      for (let i = 0; i < count; ++i) {
         blocks.runBlocks(children);
      }
   }

   interpreter.menuItem('Repeat', repeat, 10, []);
})();