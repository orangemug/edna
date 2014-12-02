# Edna [![Build Status](https://travis-ci.org/orangemug/edna.svg?branch=master)](https://travis-ci.org/orangemug/edna)
A small library that will add style to your page fabolous darling!


## Usage
Create a stylesheet

    var sheet = new Edna();

Add some styles in various ways, string or object

    sheet.add(".selector", "color: white"});
    sheet.add(".selector", {
      "background-color": "orange"
    });

Or even deep nest the rules into an object

    sheet.add({
      "body": {
        "background-color": "orange"
        "h1": {
          "color": "white"
        }
      }
    });

Both the above return references to the rules added so you can remove them again.

    var refs = sheet.add({"body": {"color": "orange"}});
    sheet.remove(refs);
    // => true - if there was anything removed.

Clear all rules

    sheet.clear();

Append the stylesheet to the `<head>`.

    sheet.append();
    // => true - if added to DOM

You can remove it from the DOM at anytime.

    sheet.destroy();
    // => true - if removed from DOM


## Credit
This has a simular API to <https://github.com/airportyh/barber>, with the aim to be simplier/smaller (and hence also do less).


## License
MIT

