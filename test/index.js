var test = require('tape');
var Edna = require("../");

test('append should add to stylesheet to DOM', function (t) {
  var node, sheet = new Edna();
  sheet.append();
  node = sheet.sheet.ownerNode;
  t.ok(document.head.contains(node));
  t.end();
});

test('destroy should remove stylesheet from the DOM', function (t) {
  var sheet = new Edna();
  sheet.append();

  // Grab reference to original node
  var node = sheet.sheet.ownerNode;
  sheet.destroy();

  // Test the node no longer exists in the DOM
  t.notOk(document.head.contains(node));
  t.notOk(sheet.sheet);

  t.end();
});

test('can add rules as string', function (t) {
  var r, sheet = new Edna();
  sheet.add("body", "background-color: orange; color: white;");
  sheet.append();

  r = sheet.sheet.rules[0];
  t.equal(r.selectorText, "body");
  t.equal(r.style.backgroundColor, "orange");
  t.equal(r.style.color, "white");

  t.end();
});

test('can add rules as object', function (t) {
  var r, sheet = new Edna();
  sheet.add("body", {
    "background-color": "orange",
    "color": "white"
  });
  sheet.append();

  r = sheet.sheet.rules[0];
  t.equal(r.selectorText, "body");
  t.equal(r.style.backgroundColor, "orange");
  t.equal(r.style.color, "white");

  t.end();
});

test('can add rules as nested object', function (t) {
  var r, sheet = new Edna();
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

  r = sheet.sheet.rules[0];
  t.equal(r.selectorText, "body");
  t.equal(r.style.backgroundColor, "orange");
  t.equal(r.style.color, "white");

  r = sheet.sheet.rules[1];
  t.equal(r.selectorText, "body header h1");
  t.equal(r.style.color, "white");

  r = sheet.sheet.rules[2];
  t.equal(r.selectorText, "body header");
  t.equal(r.style.backgroundColor, "blue");

  t.equal(refs[0], 0);
  t.equal(refs[1], 1);
  t.equal(refs[2], 2);

  t.end();
});

test('can destroy rules added as nested object', function (t) {
  var r, sheet = new Edna();

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

  t.equal(sheet.rules.length, 2);
  t.equal(sheet.sheet.rules.length, 2);

  t.equal(sheet.sheet.rules[0].cssText, ".test { color: red; }");
  t.equal(sheet.sheet.rules[1].cssText, ".test { color: blue; }");

  t.end();
});

test('can destroy rules added as plain text', function (t) {
  var r, sheet = new Edna();
  var refs = sheet.add("body", "color: blue;");

  sheet.add({
    ".test": {"color": "blue"}
  })

  sheet.remove(refs);

  t.equal(sheet.rules.length, 1);
  t.end();
});

test('multiple removes', function (t) {
  var r, sheet = new Edna();
  var refsA = sheet.add("body", "color: red;");
  var refsB = sheet.add("body", "color: green;");
  var refsC = sheet.add("body", "color: blue;");

  sheet.append();

  sheet.remove(refsB);
  t.equal(sheet.rules.length, 2);
  t.equal(sheet.sheet.rules.length, 2);
  t.equal(sheet.sheet.rules[0].cssText, "body { color: red; }");
  t.equal(sheet.sheet.rules[1].cssText, "body { color: blue; }");

  sheet.add("body", "color: black;");
  sheet.add("body", "color: yellow;");

  sheet.remove(refsC);
  t.equal(sheet.rules.length, 3);
  t.equal(sheet.sheet.rules.length, 3);
  t.equal(sheet.sheet.rules[0].cssText, "body { color: red; }");
  t.equal(sheet.sheet.rules[1].cssText, "body { color: black; }");
  t.equal(sheet.sheet.rules[2].cssText, "body { color: yellow; }");

  t.end();
});

