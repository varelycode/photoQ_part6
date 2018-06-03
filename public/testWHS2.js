// Global; will be replaced by a call to the server! 
var photoURLArray = 
[
 { url: "http://lotus.idav.ucdavis.edu/public/ecs162/UNESCO/A%20Torre%20Manuelina.jpg"},
 { url: "http://lotus.idav.ucdavis.edu/public/ecs162/UNESCO/Uluru%20sunset1141.jpg" },
 { url: "http://lotus.idav.ucdavis.edu/public/ecs162/UNESCO/Sejong tomb 1.jpg"},
 { url: "http://lotus.idav.ucdavis.edu/public/ecs162/UNESCO/Serra%20da%20Capivara%20-%20Painting%207.JPG"},
 { url: "http://lotus.idav.ucdavis.edu/public/ecs162/UNESCO/Royal%20Palace%2c%20Rabat.jpg"},
 { url: "http://lotus.idav.ucdavis.edu/public/ecs162/UNESCO/Red%20pencil%20urchin%20-%20Papahnaumokukea.jpg"}
 ];

/*
var photos = [
{src: "http://lotus.idav.ucdavis.edu/public/ecs162/UNESCO/A%20Torre%20Manuelina.jpg", width: 574, height: 381 },
{src: "http://lotus.idav.ucdavis.edu/public/ecs162/UNESCO/Uluru%20sunset1141.jpg", width: 500 , height: 334 },
{src: "http://lotus.idav.ucdavis.edu/public/ecs162/UNESCO/Sejong tomb 1.jpg", width: 574, height: 430},
{src: "http://lotus.idav.ucdavis.edu/public/ecs162/UNESCO/Serra%20da%20Capivara%20-%20Painting%207.JPG", width: 574, height: 430},
{src: "http://lotus.idav.ucdavis.edu/public/ecs162/UNESCO/Royal%20Palace%2c%20Rabat.jpg", width: 574, height: 410},
{src: "http://lotus.idav.ucdavis.edu/public/ecs162/UNESCO/Red%20pencil%20urchin%20-%20Papahnaumokukea.jpg", width: 574 , height: 382 }
];
*/

var columns = 2;
var onSearch = false;
var onMobile = false;

var photos = [];
const photoURL = "http://lotus.idav.ucdavis.edu/public/ecs162/UNESCO/";

/* Finally, we actually run some code */

const reactContainer = document.getElementById("react");



function reqListener() {
	
	var objList = JSON.parse(this.responseText);
	//console.log(objList);
	console.log("File names:")
	for(var i=0; i<objList.length; i++) {
		console.log(objList[i].fileName);
		objList[i].src = objList[i].fileName;
		console.log(objList[i].src);
	}

	photos = objList;

	if(photos.length > 0)
		document.getElementById("no-search").style.display = "none";	
	ReactDOM.render(React.createElement(App),reactContainer);

	console.log(objList);

	//App.setState({columns:1})
	
	/*var photoURL = this.responseText;
	var display = document.getElementById("photoImg");
	display.src = photoURL;*/
}

// Called when the user pushes the "submit" button 
function photoByNumber() {

	var numList = document.getElementById("search-input").value;
	numList = numList.trim();
	numList = numList.replace(/,/g, "+"); // separate by commas
	console.log(numList);
	
	//ReactDOM.render(React.createElement(App),reactContainer);

	if (numList != NaN) {
		onSearch = true;
		var oReq = new XMLHttpRequest();
		var URL = "query?numList=" + numList;

		oReq.open("GET", URL);
		oReq.addEventListener("load", reqListener);
		oReq.send();

		/*
		var photoURL = photoURLArray[photoNum].url;
		var display = document.getElementById("photoImg");
		display.src = photoURL;
		*/
	}
	
	var W = window.innerWidth;
	if(W<=500){
		document.getElementById("search-left").style.display = "none";
		document.getElementById("search-input").style.visibility = "visible";
		columns = 1;
	}
	else{
		document.getElementById("search-left").style.display = "flex";
	}

}


// A react component for a tag
class Tag extends React.Component {

    render () {
	return React.createElement('p',  // type
	    { className: 'tagText'}, // properties
	   this.props.text);  // contents
    }
};


// A react component for controls on an image tile
class TileControl extends React.Component {

    render () {
	// remember input vars in closure
        var _selected = this.props.selected;
        var _src = this.props.src;
        // parse image src for photo name
	var photoName = _src.split("/").pop();
	photoName = photoName.split('%20').join(' ');

        return ( React.createElement('div', 
 	 {className: _selected ? 'selectedControls' : 'normalControls'},  
         // div contents - so far only one tag
              React.createElement(Tag,
		 { text: photoName })
	    )// createElement div
	)// return
    } // render
};


// A react component for an image tile
class ImageTile extends React.Component {

    render() {
	// onClick function needs to remember these as a closure
	var _onClick = this.props.onClick;
	var _index = this.props.index;
	var _photo = this.props.photo;
	var _selected = _photo.selected; // this one is just for readability

	return (
	    React.createElement('div', 
	        {style: {margin: this.props.margin, width: _photo.width},
			 className: 'tile',
                         onClick: function onClick(e) {
			    console.log("tile onclick");
			    // call Gallery's onclick
			    return _onClick (e, 
					     { index: _index, photo: _photo }) 
				}
		 }, // end of props of div
		 // contents of div - the Controls and an Image
		React.createElement(TileControl,
		    {selected: _selected, 
		     src: _photo.src}),
		React.createElement('img',
		    {className: _selected ? 'selected' : 'normal', 
                     src: _photo.src, 
		     width: _photo.width, 
                     height: _photo.height
			    })
				)//createElement div
	); // return
    } // render
} // class



// The react component for the whole image gallery
// Most of the code for this is in the included library
class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = { photos: photos };
    this.selectTile = this.selectTile.bind(this);
  }

  selectTile(event, obj) {
    console.log("in onclick!", obj);
    let photos = this.state.photos;
    photos[obj.index].selected = !photos[obj.index].selected;
    this.setState({ photos: photos });
  }

  render() {
  	console.log(this.state.width);
    return (
       React.createElement( Gallery, {photos: photos,
       	   columns: columns, 
		   onClick: this.selectTile, 
		   ImageComponent: ImageTile} )
	    );
  }

}



window.onresize = function(){
	if(window.innerWidth>500) {
		document.getElementById("search-left").style.display = "flex";
		if(columns == 1) {
			columns = 2;
			ReactDOM.render(React.createElement(App),reactContainer);
		}
	} else {
		if(onSearch) {
			document.getElementById("search-left").style.display = "none";
			document.getElementById("search-input").style.visibility = "visible";
		}
		if(columns == 2) {
			columns = 1;
			ReactDOM.render(React.createElement(App),reactContainer);
		}
	}
}