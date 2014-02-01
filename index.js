/**
 * A small library that will add style to your page, fabolous darling!
 */
function Edna() {
  this.rules = [];
  this.sheet;
}

/**
 * Add rules to your stylesheet
 */
Edna.prototype.add = function() {
  var selector, rules, a = arguments;
  if(a.length > 1) {
    selector = a[0];
    rules    = a[1];
  } else {
    selector = "";
    rules    = a[0];
  }

  if(typeof(rules) === "string") {
    this.rules.push({
      selector: selector,
      rules: rules
    });
  } else {
    var extractLeafRules = function(rules, rslt, keys) {
      for(var k in rules) {
        if(rules.hasOwnProperty(k)) {
          v = rules[k];
          if(typeof(v) === "string") {
            rslt[keys] = rslt[keys] || [];
            rslt[keys].push(k+":"+v);
          } else {
            extractLeafRules(v, rslt, keys+" "+k);
          }
        }
      }
    }

    var rslt = {};
    extractLeafRules(rules, rslt, selector);

    for(var k in rslt) {
      var v = rslt[k];
      this.rules.push({
        selector: k,
        rules: v.join(";")
      });
    }
  }
  return this;
};

/**
 * Add the stylesheet to the `<head>`
 *
 * @param {String} className to add to the resulting stylesheet node
 */
Edna.prototype.append = function(className) {
  var i, style, sheet;
  var rules = this.rules;

  // Create the node
  var head  = document.getElementsByTagName('head')[0];
  var node  = document.createElement('style');
  node.type = 'text/css';
  node.className = className
  head.appendChild(node);

  // Get the CSSStyleSheet.
  this.sheet = sheet = node.sheet;

  for(i=0, len=rules.length; i<len; i++) {
    style = rules[i];
    if(sheet.addRule) {
      sheet.addRule(style.selector, style.rules);
    } else {
      sheet.insertRule(style.selector, style.rules);
    }
  }
  return this;
}

/**
 * Remove the stylesheet from the `<head>`
 */
Edna.prototype.remove = function() {
  if(!this.sheet.ownerNode) return;
  var sheetNode = this.sheet.ownerNode;
  sheetNode.parentNode.removeChild(sheetNode);
  this.sheet = null;
  return this;
}

module.exports = Edna;
