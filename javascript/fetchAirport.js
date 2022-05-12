const settings = {
    method: 'GET',
    mode: 'no-cors',
    cache: 'default',
  };
  
  
const link = ('https://flydata.avinor.no/XmlFeed.asp?TimeFrom=1&TimeTo=7&airport=BOO');
  
fetch(link, settings)
.then((response) => {
    return response.text();
    // ...
});
