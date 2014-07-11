# Edna
A small library that will add style to your page fabolous darling!

## Usage
Create a stylesheet

    var sheet = new Edna();

Add some styles in various ways, string or object

    sheet.add(".selector", {"background-color": "blue"});
    sheet.add(".selector", {
      "background-color": "orange"
    });

Or even deep nest the rules into an object

    sheet.add({
      "body": {
        "color": "orange"
        "h1": {
          "background-color": "white"
        }
      }
    });

Both the above return references to the rules added so you can remove them again.

    var ref = sheet.add({"body": {"color": "blue"}});
    sheet.remove(ref);

Append the stylesheet to the `<head>`.

    sheet.append();
    // => DOMElement

You can remove it from the DOM at anytime.

    sheet.destroy();
    // => DOMElement


## Credit
This has a simular API to <https://github.com/airportyh/barber>, with the aim to be simplier/smaller (and hence also do less).


## License
MIT

