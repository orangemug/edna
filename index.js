/**
 * A small library that will add style to your page, fabolous darling!
 */
function Edna() {
  this.uid = 0;
  this.rules = [];
  this.node;
}

/**
 * Add rules to your stylesheet
 */
Edna.prototype.add = function() {
  var selector, rules, a = arguments;
  var id, outRefs = [];

  var startIdx = this.rules.length;

  if(a.length > 1) {
    selector = a[0];
    rules    = a[1];
  } else {
    selector = "";
    rules    = a[0];
  }

  if(typeof(rules) === "string") {
    id = this.uid++;
    this.rules.push({
      uid: id,
      selector: selector,
      rules: rules
    });
    outRefs.push(id);
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
      var id = this.uid++;
      this.rules.push({
        uid: id,
        selector: k,
        rules: v.join(";")
      });
      outRefs.push(id);
    }
  }

  if(this.node) {
    this._addRules(startIdx);
  }

  return outRefs;
};

Edna.prototype.remove = function(refs) {
  var isArr = refs instanceof Array;
  var offset = 0;

  this.rules = this.rules.filter(function(rule,idx) {
    if(isArr) {
      ret = refs.indexOf(rule.uid) < 0;
    } else {
      ret = refs !== rule.uid;
    }

    if(this.node && !ret) {
      this.node.sheet.deleteRule(idx-offset);
      offset++;
    }

    return ret;
  }, this);

  // Have we removed anything?
  return (offset > 0);
};

/**
 * Add the stylesheet to the `<head>`
 *
 * @param {String} className to add to the resulting stylesheet node
 */
Edna.prototype.append = function(className) {
  // We are already in the DOM
  if(this.node) {
    return false;
  }

  var i, style, sheet;

  // Create the node
  var head  = document.getElementsByTagName('head')[0];
  var node  = document.createElement('style');
  node.type = 'text/css';
  node.className = className
  head.appendChild(node);

  // Get the CSSStyleSheet.
  this.node = node;

  this._addRules();
  return true;
}

Edna.prototype._addRules = function(fromIdx) {
  fromIdx = fromIdx || 0;
  var rules = this.rules;
  var sheet = this.node.sheet;

  for(len=rules.length; fromIdx<len; fromIdx++) {
    style = rules[fromIdx];
    if(sheet.addRule) {
      sheet.addRule(style.selector, style.rules);
    } else {
      sheet.insertRule(style.selector, style.rules);
    }
  }
}

/**
 * Remove the stylesheet from the `<head>`
 */
Edna.prototype.destroy = function() {
  if(!this.node) return false;
  this.node.parentNode.removeChild(this.node);
  this.node = null;
  return true;
}

module.exports = Edna;
