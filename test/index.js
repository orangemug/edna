var test = require('tape');
var Edna = require("../");

test('append should add to stylesheet to DOM', function (t) {
  var node, sheet = new Edna();
  sheet.append();
  node = sheet.sheet.ownerNode;
  t.ok(document.head.contains(node));
  t.end();
});

test('remove should remove stylesheet from the DOM', function (t) {
  var sheet = new Edna();
  sheet.append();

  // Grab reference to original node
  var node = sheet.sheet.ownerNode;
  sheet.remove();

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
  sheet.add({
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

  t.end();
});
