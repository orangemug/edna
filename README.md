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

Append the stylesheet to the `<head>`.

    edna.append();

You can also provide an `optional-class-name` that will get added to the DOM element

    edna.append("optional-class-name");

You can remove it from the DOM at anytime.

    edna.remove();


## Credit
This has the same API as <https://github.com/airportyh/barber>, with the aim to be simplier/smaller.


## License
MIT

