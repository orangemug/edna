var assert = require("assert");
var Edna = require("../");

describe("Edna", function() {
  it('append should add to stylesheet to DOM', function() {
    var node, sheet = new Edna();
    sheet.append();
    node = sheet.node.sheet.ownerNode;
    assert(document.head.contains(node));
  });

  it('destroy should remove stylesheet from the DOM', function() {
    var sheet = new Edna();
    sheet.append();

    // Grab reference to original node
    var node = sheet.node;
    sheet.destroy();

    // Test the node no longer exists in the DOM
    assert(!document.head.contains(node));
    assert(!sheet.node);
  });

  it('can add rules as string', function() {
    var r, sheet = new Edna();
    sheet.add("body", "background-color: orange; color: white;");
    sheet.append();

    r = sheet.node.sheet.cssRules[0];
    assert.equal(r.selectorText, "body");
    assert.equal(r.style.backgroundColor, "orange");
    assert.equal(r.style.color, "white");
  });

  it('can add rules as object', function() {
    var r, nodeSheet, sheet = new Edna();
    sheet.add("body", {
      "background-color": "orange",
      "color": "white"
    });
    sheet.append();

    r = sheet.node.sheet.cssRules[0];
    assert.equal(r.selectorText, "body");
    assert.equal(r.style.backgroundColor, "orange");
    assert.equal(r.style.color, "white");
  });

  it('can add rules as nested object', function() {
    var r, nodeSheet, sheet = new Edna();
    var refs = sheet.add({
      "body": {
        "background-color": "orange",
        "header": {
          "h1": {
            "color": "white"
          },
          "background-color": "blue"
        },
        "color": "white"
      }
    });
    sheet.append();

    nodeSheet = sheet.node.sheet;

    r = nodeSheet.cssRules[0];
    assert.equal(r.selectorText, "body");
    assert.equal(r.style.backgroundColor, "orange");
    assert.equal(r.style.color, "white");

    r = nodeSheet.cssRules[1];
    assert.equal(r.selectorText, "body header h1");
    assert.equal(r.style.color, "white");

    r = nodeSheet.cssRules[2];
    assert.equal(r.selectorText, "body header");
    assert.equal(r.style.backgroundColor, "blue");

    assert.equal(refs[0], 0);
    assert.equal(refs[1], 1);
    assert.equal(refs[2], 2);
  });

  it('can destroy rules added as nested object', function() {
    var r, nodeSheet, sheet = new Edna();

    sheet.add({
      ".test": {"color": "red"}
    });

    var refs = sheet.add({
      "body": {
        "background-color": "orange",
        "header": {
          "h1": {
            "color": "white"
          },
          "background-color": "blue"
        },
        "color": "white"
      }
    });

    sheet.add({
      ".test": {"color": "blue"}
    });

    sheet.append();
    sheet.remove(refs);

    nodeSheet = sheet.node.sheet;

    assert.equal(sheet.rules.length, 2);
    assert.equal(nodeSheet.cssRules.length, 2);

    assert.equal(nodeSheet.cssRules[0].cssText, ".test { color: red; }");
    assert.equal(nodeSheet.cssRules[1].cssText, ".test { color: blue; }");
  });

  it('can destroy rules added as plain text', function() {
    var r, sheet = new Edna();
    var refs = sheet.add("body", "color: blue;");

    sheet.add({
      ".test": {"color": "blue"}
    })

    sheet.remove(refs);

    assert.equal(sheet.rules.length, 1);
  });

  it('multiple removes', function() {
    var r, nodeSheet, sheet = new Edna();
    var refsA = sheet.add("body", "color: red;");
    var refsB = sheet.add("body", "color: green;");
    var refsC = sheet.add("body", "color: blue;");

    sheet.append();
    nodeSheet = sheet.node.sheet;

    sheet.remove(refsB);
    assert.equal(sheet.rules.length, 2);
    assert.equal(nodeSheet.cssRules.length, 2);
    assert.equal(nodeSheet.cssRules[0].cssText, "body { color: red; }");
    assert.equal(nodeSheet.cssRules[1].cssText, "body { color: blue; }");

    sheet.add("body", "color: black;");
    sheet.add("body", "color: yellow;");

    sheet.remove(refsC);
    assert.equal(sheet.rules.length, 3);
    assert.equal(nodeSheet.cssRules.length, 3);
    assert.equal(nodeSheet.cssRules[0].cssText, "body { color: red; }");
    assert.equal(nodeSheet.cssRules[1].cssText, "body { color: black; }");
    assert.equal(nodeSheet.cssRules[2].cssText, "body { color: yellow; }");

  });

  it('can remove ref as single value', function() {
    var r, sheet = new Edna();
    var refs = sheet.add("body", "color: blue;");

    sheet.add({
      ".test": {"color": "blue"}
    })

    sheet.remove(refs[0]);

    assert.equal(sheet.rules.length, 1);
  });

  it('#append returns true when not yet added to DOM', function() {
    var sheet = new Edna();
    sheet.add("body", "color: blue;");
    var ret = sheet.append();
    assert.equal(ret, true);
  });

  it('#append returns false when already added to DOM', function() {
    var sheet = new Edna();
    sheet.add("body", "color: blue;");
    sheet.append();
    var ret = sheet.append();
    assert.equal(ret, false);
  });

  it('#destroy returns true when already added to DOM', function() {
    var sheet = new Edna();
    sheet.add("body", "color: blue;");
    sheet.append();
    var ret = sheet.destroy();
    assert.equal(ret, true);
  });

  it('#destroy returns false when not yet added to DOM', function() {
    var sheet = new Edna();
    sheet.add("body", "color: blue;");
    var ret = sheet.destroy();
    assert.equal(ret, false);
  });

  it('#clear removes all rules and returns true', function() {
    var ret, nodeSheet, sheet = new Edna();
    sheet.add("h1", "color: red;");
    sheet.add("h2", "color: green;");
    sheet.add("h3", "color: blue;");
    sheet.append();

    nodeSheet = sheet.node.sheet;

    ret = sheet.clear();
    assert.equal(sheet.rules.length, 0);
    assert.equal(nodeSheet.cssRules.length, 0);
    assert.equal(ret, true);
  });

  it('#clear with no rules returns false', function() {
    var ret, sheet = new Edna();
    ret = sheet.clear();
    assert.equal(ret, false);
  });
});
