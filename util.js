let util = (function namespace() {
   let matches = null;
   if (document.body.matches) {
      matches = function matches(elem, selector) { return elem.matches(selector); };
   } else if(document.body.mozMatchesSelector) {
      matches = function matches(elem, selector) { return elem.mozMatchesSelector(selector); };
   } else if (document.body.webkitMatchesSelector) {
      matches = function matches(elem, selector) { return elem.webkitMatchesSelector(selector); };
   } else if (document.body.msMatchesSelector) {
      matches = function matches(elem, selector) { return elem.msMatchesSelector(selector); };
   } else if(document.body.oMatchesSelector) {
      matches = function matches(elem, selector) { return elem.oMatchesSelector(selector); };
   } else {
      throw Error("No matches function available");
   }

   return {matches};
})();