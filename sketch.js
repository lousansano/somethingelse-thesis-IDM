// somethingelse by Louis Sansano
// IDM @ NYU Thesis Project, Fall 2025
// Media is mostly demo content, presented for academic purposes only

siteState = 'homeScreen'

//user poster arrays

let posterPositions = []
let postersuser = []
let posterAudio = []      // Parallel array: p5.SoundFile for each poster
let posterAlbumArt = []   // Parallel array: p5.Image album art for each poster
let posterAudioNames = [] // Parallel array: audio filename strings
let posterMetadata = []   // Parallel array: metadata {title, description} for each poster
let currentPosterAudio = null // Track currently playing poster audio

// location page poster arrays
let postersLocation = []
let locationPosterAudio = []
let locationPosterAlbumArt = []
let locationPosterAudioNames = []
let locationPosterMetadata = []
let locationposterPositions = []

// file uploading for band page

let bandUploadedImages = []
let isHighlighted = false;
let basePosterImage = null;
let draggingDecorativeImage = null;
let selectedDecorativeImage = null;
let resizingHandle = null; // 'topLeft', 'topRight', 'bottomLeft', 'bottomRight'
let resizeStartW, resizeStartH, resizeStartMouseX, resizeStartMouseY;

// Artist page audio upload
let artistAudioFile = null;
let artistAlbumArt = null;
let isArtistMusicZoneHighlighted = false;
let isArtistAudioPlaying = false;
let artistAudioFileName = '';

// Artist poster metadata inputs
let posterTitleInput;
let posterDescriptionInput;
let posterDescriptionEditor; // Quill editor instance
let posterSongInfoInput;

// Demo poster pre-loaded assets
let demoPosterAudio;
let demoPosterAlbumArt;

// Comment system
let commentInput;
let commentNameInput;
let commentSubmitButton;

// Description display for zoomed poster view
let descriptionDisplay;

// Format toolbar toggle
let formatToggleButton;
let quillToolbar;
let visibleToolbar; // The cloned toolbar that's actually visible
let toolbarVisible = false; // Track toolbar visibility state

// Customization UI elements
let backgroundUploadButton;
let nameBarColorPicker;
let albumArtColorPicker;
let songNameColorPicker;

//user mode poster highlighting 

let posterMode = {
  active: false,
  posterID: null,
  fadeIn: 0
}

//user mode poster zooming

let zoomLevel = 1.0;
let minZoom = 1.0;
let maxZoom = 3.0;
let panX = 0;
let panY = 0;
let isDragging = false;
let dragStartX, dragStartY;
let blockMouseInteraction = false;

// re-arrange posters on user page

let draggingPoster = null;
let draggingLocationPoster = null;
let dragOffsetX = 0;
let dragOffsetY = 0;

// user mode music playback
isuserPlayback = false
currentuserTrack = 0

// User page customization
let userCustomBackground = null; // Custom background image for user page
let userNameBarColor = { r: 255, g: 255, b: 255, a: 255 }; // Color for name bar backing
let userAlbumArtBackingColor = { r: 255, g: 255, b: 255, a: 200 }; // Color for album art backing
let userSongNameBackingColor = { r: 255, g: 255, b: 255, a: 220 }; // Color for song name backing
let customizePanelVisible = false; // Track if customize panel is open
let userDecorativeGifs = []; // Decorative GIFs on user page
let selectedUserGif = null; // Currently selected/dragging GIF
let draggingUserGif = false; // Track if dragging a GIF
let resizingUserGif = null; // Track which resize handle is being used for user page GIFs

function preload(){
firstscreen = loadImage('/art/screen_backgrounds/LandingPage.png')
landingscreen = loadImage ('/art/screen_backgrounds/LandingPage.png')
logintypescreen = loadImage ('/art/screen_backgrounds/LoginPage.png')
locationscreen = loadImage('/art/screen_backgrounds/LocationPage.png')
artistpagescreen = loadImage ('/art/screen_backgrounds/ArtistUploadPage_minimal.png')

artistimportwindow = loadImage ('/art/windows/import_dialog.png')
artistplayerwindow = loadImage('/art/windows/mplayer_playhead_band.png')
artistposterwindow = loadImage('/art/windows/bandposter_edit.png')
artistdropzoneicon = loadImage('/art/windows/import_dialog.png')
artistmusiczonewindow = loadImage('/art/windows/winxp_window.png')

userpagescreen = loadImage('/art/screen_backgrounds/ListenerPage.png')
userpagescreenclean = loadImage('/art/screen_backgrounds/ListenerPage.png')

xpcloseicon = loadImage('/art/icons/closebutton.png')

// Load demo poster audio and album art
testposter1 = loadImage('/art/posters/testposter1.png')
loadSound('/music/demosongs/Red Alert - Basement Jaxx.mp3', s => { testposter1Audio = s; }, () => { testposter1Audio = null; })
testposter1AlbumArt = loadImage('/art/albumart/remedy.jpg')

testposter2 = loadImage('/art/posters/testposter2.png')
loadSound('/music/demosongs/Believe In Me - Lord Michael.mp3', s => { testposter2Audio = s; }, () => { testposter2Audio = null; })
testposter2AlbumArt = loadImage('/art/albumart/believeinme.jpg')

testposter3 = loadImage('/art/posters/testposter3.png')
loadSound('/music/demosongs/Dont Sweat The Technique - Eric B and Rakim.mp3', s => { testposter3Audio = s; }, () => { testposter3Audio = null; })
testposter3AlbumArt = loadImage('/art/albumart/dontsweat.jpg')

testposter4 = loadImage('/art/posters/testposter4.jpg')
loadSound('/music/demosongs/Chime - Orbital.mp3', s => { testposter4Audio = s; }, () => { testposter4Audio = null; })
testposter4AlbumArt = loadImage('/art/albumart/chimeorbital.jpeg')


// load location posters
locationPoster1 = loadImage('/art/posters/locationposters/locationposter1.png')
loadSound('/music/locationaudio/Judith - A Perfect Circle.mp3', s => { locationPoster1audio = s; }, () => { locationPoster1audio = null; })
locationPoster1AlbumArt = loadImage('/art/albumart/merdenoms-apc.jpg')

locationPoster2 = loadImage('/art/posters/locationposters/locationposter2.png')
loadSound('/music/locationaudio/Sexx Laws - Beck.mp3', s => { locationPoster2audio = s; }, () => { locationPoster2audio = null; })
locationPoster2AlbumArt = loadImage('/art/albumart/midnitevultures-beck.jpg')

locationPoster3 = loadImage('/art/posters/locationposters/locationposter3.jpg')
loadSound('/music/locationaudio/The Day I Went Away - Sleater-Kinney.mp3', s => { locationPoster3audio = s; }, () => { locationPoster3audio = null; })
locationPoster3AlbumArt = loadImage('/art/albumart/sleaterkinney.jpg')

locationPoster4 = loadImage('/art/posters/locationposters/locationposter4.jpg')
loadSound('/music/locationaudio/Dramamine - Modest Mouse.mp3', s => { locationPoster4audio = s; }, () => { locationPoster4audio = null; })
locationPoster4AlbumArt = loadImage('/art/albumart/modestmouse.jpg')

locationPoster5 = loadImage('/art/posters/locationposters/locationposter5.jpg')
loadSound('/music/locationaudio/Out Of Control - The Chemical Brothers.mp3', s => { locationPoster5audio = s; }, () => { locationPoster5audio = null; })
locationPoster5AlbumArt = loadImage('/art/albumart/surrender.jpg')

locationPoster6 = loadImage('/art/posters/locationposters/locationposter6.jpg')
loadSound('/music/locationaudio/Breathe - The Prodigy.mp3', s => { locationPoster6audio = s; }, () => { locationPoster6audio = null; })
locationPoster6AlbumArt = loadImage('/art/albumart/fatoftheland.jpg')

locationPoster7 = loadImage('/art/posters/locationposters/locationposter7.jpg')
loadSound('/music/locationaudio/Break Stuff - Limp Bizkit.mp3', s => { locationPoster7audio = s; }, () => { locationPoster7audio = null; })
locationPoster7AlbumArt = loadImage('/art/albumart/limpb.jpg')

soundFormats('mp3')

//fonts
italicBoldSFFont = loadFont('/fonts/SFProText_BoldItalic.otf')
italicHeavySFont = loadFont("/fonts/SFProText_HeavyItalic.otf")
highlightpagetitlefont = loadFont('/fonts/HelveticaNeueBoldItalic.otf')
posterinfoFont = loadFont("/fonts/SF-Pro-Display-MediumItalic.otf") 
BoldSFFont = loadFont('/fonts/SF-Pro-Display-Bold.otf')
sfblackFont = loadFont('/fonts/SF-Pro-Text-Black.otf')

}

// Helper function to draw expanded bold text (simulates SF Pro Expanded Bold)
function drawExpandedBoldText(txt, x, y, expandAmount = 1.25) {
  push();
  scale(expandAmount, 1); // Horizontally stretch text
  text(txt, x / expandAmount, y); // Adjust x position to compensate for scale
  pop();
}

// Helper function to get contrasting text color (black or white) based on background
function getContrastColor(bgColor) {
  // Calculate relative luminance using WCAG formula
  let r = bgColor.r / 255;
  let g = bgColor.g / 255;
  let b = bgColor.b / 255;

  // Apply gamma correction
  r = r <= 0.03928 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4);
  g = g <= 0.03928 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4);
  b = b <= 0.03928 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4);

  // Calculate luminance
  let luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;

  // Return white for dark backgrounds, black for light backgrounds
  return luminance > 0.5 ? color(0, 0, 0) : color(255, 255, 255);
}

// function usermusicplaylistSetup(){
//   for (let i = 0; i < userPlaylist.length; i++)
//   //scan folder
//   userPlaylist.push()
// }

function buttonSetup(){
  homegobutton = createButton('')
  homegobutton.style('width', '520px')
  homegobutton.style('height', '250px')
  homegobutton.style('font-size', '20px')
  homegobutton.style('background-color', 'transparent')
  homegobutton.style('border', 'none')
  homegobutton.style('cursor', 'pointer')
  homegobutton.position(70,420)
  homegobutton.mousePressed(entersitePressed)
  homegobutton.hide()

  loginnavbutton = createButton('')
  loginnavbutton.style('width', '155px')
  loginnavbutton.style('height', '55px')
  loginnavbutton.style('font-size', '20px')
  loginnavbutton.style('background-color','transparent')
  loginnavbutton.style('border', 'none')
  loginnavbutton.style('cursor', 'pointer')
  loginnavbutton.position(360,20)
  loginnavbutton.mousePressed(loginnavPressed)
  loginnavbutton.hide()

  randomnavbutton = createButton('')
  randomnavbutton.style('width', '210px')
  randomnavbutton.style('height', '55px')
  randomnavbutton.style('font-size', '20px')
  randomnavbutton.style('background-color', 'transparent')
  randomnavbutton.style('border', 'none')
  randomnavbutton.style('cursor', 'pointer')
  randomnavbutton.style('z-index', '10')
  randomnavbutton.position(580,20)
  randomnavbutton.mousePressed(randomnavPressed)
  randomnavbutton.hide()

  locationnavbutton = createButton('')
  locationnavbutton.style('width', '225px')
  locationnavbutton.style('height', '55px')
  locationnavbutton.style('font-size', '20px')
  locationnavbutton.style('background-color', 'transparent')
  locationnavbutton.style('border', 'none')
  locationnavbutton.style('cursor', 'pointer')
  locationnavbutton.style('z-index', '10')
  locationnavbutton.position(850,20)
  locationnavbutton.mousePressed(locationnavPressed)
  locationnavbutton.hide()



  makemusicloginbutton = createButton('')
  makemusicloginbutton.style('padding', '20px')
  makemusicloginbutton.style('width', '875px')
  makemusicloginbutton.style('height', '160px')
  makemusicloginbutton.style('font-size', '20px')
  makemusicloginbutton.style('background-color', 'transparent')
  makemusicloginbutton.style('border', 'none')
  makemusicloginbutton.style('cursor', 'pointer')
  makemusicloginbutton.position(280,300)
  makemusicloginbutton.mousePressed(makemusicPressed)
  makemusicloginbutton.hide()

  listenmusicloginbutton = createButton('')
  //listenmusicloginbutton.style('padding', '20px')
  listenmusicloginbutton.style('font-size', '20px')
  listenmusicloginbutton.style('width', '533px')
  listenmusicloginbutton.style('height', '140px')
  listenmusicloginbutton.style('background-color', 'transparent')
  listenmusicloginbutton.style('border', 'none')
  listenmusicloginbutton.style('cursor', 'pointer')
  listenmusicloginbutton.position(455,640)
  listenmusicloginbutton.mousePressed(listenmusicPressed)
  listenmusicloginbutton.hide()



  artistmusicplaybutton = createButton('Play')
  artistmusicplaybutton.style('padding', '15px')
  artistmusicplaybutton.style('font-size', '15px')
  artistmusicplaybutton.mousePressed(artistMusicPlay)
  artistmusicplaybutton.position(1085,900)
  artistmusicplaybutton.hide()

  artistmusicstopbutton = createButton('Stop')
  artistmusicstopbutton.style('padding', '15px')
  artistmusicstopbutton.style('font-size', '15px')
  artistmusicstopbutton.mousePressed(artistMusicStop)
  artistmusicstopbutton.position(1185,900)
  artistmusicstopbutton.hide()



  usermusicplaybutton = createButton('')
  //usermusicplaybutton.style('padding', '15px')
  usermusicplaybutton.style('width', '180px')
  usermusicplaybutton.style('height', '75px')
  usermusicplaybutton.style('font-size', '15px')
  usermusicplaybutton.style('background-color', 'transparent')
  usermusicplaybutton.style('border', 'none')
  usermusicplaybutton.style('cursor', 'pointer')
  usermusicplaybutton.position(240,950)
  usermusicplaybutton.mousePressed(usermusicPlay)
  usermusicplaybutton.hide()

  usermusicpausebutton = createButton('')
  //sermusicpausebutton.style('padding', '15px')
  usermusicpausebutton.style('width', '180px')
  usermusicpausebutton.style('height', '75px')
  usermusicpausebutton.style('font-size', '15px')
  usermusicpausebutton.style('background-color', 'transparent')
  usermusicpausebutton.style('border', 'none')
  usermusicpausebutton.style('cursor', 'pointer')
  usermusicpausebutton.position(62,950)
  usermusicpausebutton.mousePressed(usermusicPause)
  usermusicpausebutton.hide()

  usermusicpreviousbutton = createButton('')
  //usermusicpreviousbutton.style('padding', '15px')
  usermusicpreviousbutton.style('width', '180px')
  usermusicpreviousbutton.style('height', '46px')
  usermusicpreviousbutton.style('font-size', '15px')
  usermusicpreviousbutton.style('background-color', 'transparent')
  usermusicpreviousbutton.style('border', 'none')
  usermusicpreviousbutton.style('cursor', 'pointer')
  usermusicpreviousbutton.position(62,875)
  usermusicpreviousbutton.mousePressed(usermusicPrevious)
  usermusicpreviousbutton.hide()

  usermusicnextbutton = createButton('')
  //usermusicnextbutton.style('padding', '15px')
  usermusicnextbutton.style('width', '180px')
  usermusicnextbutton.style('height', '46px')
  usermusicnextbutton.style('font-size', '15px')
  usermusicnextbutton.style('background-color', 'transparent')
  usermusicnextbutton.style('border', 'none')
  usermusicnextbutton.style('cursor', 'pointer')
  usermusicnextbutton.position(240,875)
  usermusicnextbutton.mousePressed(usermusicNext)
  usermusicnextbutton.hide()

  usercustomizebutton = createButton('customize')
  usercustomizebutton.style('width', '180px')
  usercustomizebutton.style('height', '60px')
  usercustomizebutton.style('font-family', 'SF Pro Text')
  usercustomizebutton.style('font-style', 'italic')
  usercustomizebutton.style('font-weight', '900')
  usercustomizebutton.style('font-size', '18px')
  usercustomizebutton.style('background-color', 'black')
  usercustomizebutton.style('color', 'white')
  usercustomizebutton.style('border-radius', '10px')
  usercustomizebutton.style('border', 'none')
  usercustomizebutton.style('cursor', 'pointer')
  usercustomizebutton.position(50,25)
  usercustomizebutton.mousePressed(toggleCustomizePanel)
  usercustomizebutton.hide()

  // Customization panel elements
  // Background upload button
  backgroundUploadButton = createFileInput(handleBackgroundUpload)
  backgroundUploadButton.position(250, 190)
  backgroundUploadButton.style('font-size', '12px')
  backgroundUploadButton.style('color', 'transparent')
  backgroundUploadButton.style('width', '100px')
  backgroundUploadButton.hide()

  // Color picker for name bar
  nameBarColorPicker = createColorPicker(color(255, 255, 255))
  nameBarColorPicker.position(250, 233)
  nameBarColorPicker.style('width', '60px')
  nameBarColorPicker.style('height', '35px')
  nameBarColorPicker.input(() => {
    let c = nameBarColorPicker.color()
    userNameBarColor = { r: red(c), g: green(c), b: blue(c), a: 255 }
    saveUserCustomization()
  })
  nameBarColorPicker.hide()

  // Color picker for album art backing
  albumArtColorPicker = createColorPicker(color(255, 255, 255))
  albumArtColorPicker.position(250, 288)
  albumArtColorPicker.style('width', '60px')
  albumArtColorPicker.style('height', '35px')
  albumArtColorPicker.input(() => {
    let c = albumArtColorPicker.color()
    userAlbumArtBackingColor = { r: red(c), g: green(c), b: blue(c), a: 200 }
    saveUserCustomization()
  })
  albumArtColorPicker.hide()

  // Color picker for song name backing
  songNameColorPicker = createColorPicker(color(255, 255, 255))
  songNameColorPicker.position(250, 343)
  songNameColorPicker.style('width', '60px')
  songNameColorPicker.style('height', '35px')
  songNameColorPicker.input(() => {
    let c = songNameColorPicker.color()
    userSongNameBackingColor = { r: red(c), g: green(c), b: blue(c), a: 220 }
    saveUserCustomization()
  })
  songNameColorPicker.hide()

  // GIF/image upload button for decorative elements on user page
  gifUploadButton = createFileInput(handleGifUpload)
  gifUploadButton.position(250, 405)
  gifUploadButton.style('font-size', '12px')
  gifUploadButton.style('color', 'transparent')
  gifUploadButton.style('width', '100px')
  gifUploadButton.attribute('accept', 'image/gif,image/png,image/jpeg')
  gifUploadButton.hide()

  posterzoomedplaybutton = createButton('Play')
  posterzoomedplaybutton.style('width', '80px')
  posterzoomedplaybutton.style('height', '30px')
  posterzoomedplaybutton.style('background-color', 'rgb(100, 200, 100)')
  posterzoomedplaybutton.style('color', 'white')
  posterzoomedplaybutton.style('border', '2px solid white')
  posterzoomedplaybutton.style('border-radius', '5px')
  posterzoomedplaybutton.style('font-size', '14px')
  posterzoomedplaybutton.style('cursor', 'pointer')
  posterzoomedplaybutton.mousePressed(togglePosterAudio)
  posterzoomedplaybutton.hide()

  posterzoomedsavebutton = createButton('Save')
  posterzoomedsavebutton.style('width', '120px')
  posterzoomedsavebutton.style('height', '45px')
  posterzoomedsavebutton.style('background-color', 'rgb(100, 150, 250)')
  posterzoomedsavebutton.style('color', 'white')
  posterzoomedsavebutton.style('border', '2px solid white')
  posterzoomedsavebutton.style('border-radius', '5px')
  posterzoomedsavebutton.style('font-size', '18px')
  posterzoomedsavebutton.style('cursor', 'pointer')
  posterzoomedsavebutton.mousePressed(savePosterToUser)
  posterzoomedsavebutton.hide()

  exportposterbutton = createButton('Save Poster')
  exportposterbutton.style('padding', '15px 25px')
  exportposterbutton.style('font-size', '18px')
  exportposterbutton.style('background-color', '#4CAF50')
  exportposterbutton.style('color', 'white')
  exportposterbutton.style('border', 'none')
  exportposterbutton.style('border-radius', '5px')
  exportposterbutton.style('cursor', 'pointer')
  exportposterbutton.position(50, 975)
  exportposterbutton.mousePressed(exportPosterToJPG)
  exportposterbutton.hide()

  // Poster metadata inputs
  posterTitleInput = createInput('');
  posterTitleInput.position(620, 125);
  posterTitleInput.size(390, 75);
  posterTitleInput.style('font-family', 'SF Pro Text')
  posterTitleInput.style('font-weight', '900')
  posterTitleInput.style('font-size', '32px')
  posterTitleInput.style('text-align', 'right')
  posterTitleInput.style('resize', 'none')
  posterTitleInput.style('min-width', '390px')
  posterTitleInput.style('box-sizing', 'border-box')
  posterTitleInput.style('padding', '10px 20px')
  posterTitleInput.style('padding-right', '20px')
  posterTitleInput.attribute('placeholder', 'Artist Name Here');
  posterTitleInput.input(() => {
    // Calculate width based on content
    let tempSpan = createElement('span');
    tempSpan.style('font-size', '32px');
    tempSpan.style('visibility', 'hidden');
    tempSpan.style('position', 'absolute');
    tempSpan.html(posterTitleInput.value() || posterTitleInput.attribute('placeholder'));
    document.body.appendChild(tempSpan.elt);
    let textWidth = tempSpan.elt.offsetWidth + 60; // Add extra padding for left/right margins
    tempSpan.remove();

    // Set minimum width
    let newWidth = max(390, min(750, textWidth));
    let widthDiff = newWidth - 390;

    // Expand to the left by adjusting position
    posterTitleInput.position(620 - widthDiff, 125);
    posterTitleInput.size(newWidth, 75);
  });
  posterTitleInput.hide();

  // Create container div for Quill editor
  posterDescriptionInput = createDiv('');
  posterDescriptionInput.id('description-editor');
  posterDescriptionInput.position(925, 265);
  posterDescriptionInput.size(475, 315);
  posterDescriptionInput.style('border', '10px solid rgb(51, 51, 51)');
  posterDescriptionInput.style('border-radius', '20px');
  posterDescriptionInput.style('background', 'white');
  posterDescriptionInput.hide();

  // Initialize Quill editor when the container is shown
  // This will be done when the artist screen is first displayed

  posterSongInfoInput = createInput('');
  posterSongInfoInput.position(963, 975);
  posterSongInfoInput.size(390, 35);
  posterSongInfoInput.style('font-size', '15px')
  posterSongInfoInput.style('padding', '3px 7px')
  posterSongInfoInput.attribute('placeholder', 'Song Title and Info');
  posterSongInfoInput.hide();

  // Comment input (for zoomed poster view)
  commentNameInput = createInput('');
  commentNameInput.position(1070, 810);
  commentNameInput.size(310, 30);
  commentNameInput.attribute('placeholder', 'Your name (optional)');
  commentNameInput.hide();

  commentInput = createInput('');
  commentInput.position(1070, 850);
  commentInput.size(310, 30);
  commentInput.attribute('placeholder', 'Add a comment...');
  commentInput.hide();

  commentSubmitButton = createButton('Post');
  commentSubmitButton.position(1080, 900);
  commentSubmitButton.size(295, 40);
  commentSubmitButton.style('font-size', '19px')
  commentSubmitButton.mousePressed(addComment);
  commentSubmitButton.hide();

  // Description display (for showing rich text in zoomed poster view)
  descriptionDisplay = createDiv('');
  descriptionDisplay.position(70, 220);
  descriptionDisplay.size(360, 460);
  descriptionDisplay.style('font-family', 'Arial, sans-serif');
  descriptionDisplay.style('font-size', '16px');
  descriptionDisplay.style('color', '#000000');
  descriptionDisplay.style('overflow-y', 'auto');
  descriptionDisplay.style('padding', '5px');
  descriptionDisplay.style('pointer-events', 'auto');
  descriptionDisplay.style('z-index', '1000');
  descriptionDisplay.hide();

  // Add event listener for links in description display using mousedown for better capture
  descriptionDisplay.elt.addEventListener('mousedown', function(e) {
    console.log('Mousedown detected on:', e.target.tagName, e.target);
    if (e.target.tagName === 'A') {
      e.preventDefault();
      e.stopPropagation();
      console.log('Opening link:', e.target.href);
      window.open(e.target.href, '_blank', 'noopener,noreferrer');
      return false;
    }
  }, true);

  // Format toggle button (for showing/hiding Quill toolbar)
  formatToggleButton = createButton('format');
  formatToggleButton.position(1125, 585);  // Centered below description editor
  formatToggleButton.size(110, 45);
  formatToggleButton.style('font-family', 'SF Pro Text')
  formatToggleButton.style('font-style', 'italic')
  formatToggleButton.style('font-weight', '900')
  formatToggleButton.style('font-size', '18px');
  formatToggleButton.style('background-color', 'black')
  formatToggleButton.style('color', 'white')
  formatToggleButton.style('border-radius', '10px')
  formatToggleButton.style('border', 'none')
  formatToggleButton.style('cursor', 'pointer');
  formatToggleButton.mousePressed(toggleFormatToolbar);
  formatToggleButton.hide();

}

function entersitePressed(){
  if (siteState === 'homeScreen'){
    siteState = 'logintypeScreen'
  }
}

function loginnavPressed(){
  // Stop any playing music on user page
  if (isuserPlayback && posterAudio[currentuserTrack]) {
    posterAudio[currentuserTrack].stop();
    isuserPlayback = false;
  }

  siteState = 'logintypeScreen';
}

function randomnavPressed(){
  // Switch to random poster screen
  siteState = 'randomPosterScreen'

  // Select a random poster from available location posters
  if (postersLocation.length > 0) {
    let randomIndex = floor(random(postersLocation.length))

    // Activate poster mode with random poster
    posterMode.active = true
    posterMode.posterID = randomIndex
    posterMode.fadeIn = 0 // Start fade in animation

    // Auto-play audio if available
    if (locationPosterAudio[randomIndex]) {
      playLocationPosterAudio(randomIndex)
    }
  }
}

function locationnavPressed(){
  siteState = 'locationScreen'
}

function makemusicPressed(){
  if (siteState = 'logintypeScreen'){
    siteState = 'artistScreen'
  }
}

function listenmusicPressed(){
  if (siteState = 'logintypeScreen'){
    siteState = 'userScreen'
  }
}

function loadLocationPosters(){

  locationposterPositions = []

  postersLocation = [locationPoster1, locationPoster2, locationPoster3, locationPoster4, locationPoster5, locationPoster6, locationPoster7]

  locationPosterAudio = [locationPoster1audio, locationPoster2audio, locationPoster3audio, locationPoster4audio, locationPoster5audio, locationPoster6audio, locationPoster7audio]
  locationPosterAlbumArt = [locationPoster1AlbumArt, locationPoster2AlbumArt, locationPoster3AlbumArt, locationPoster4AlbumArt, locationPoster5AlbumArt, locationPoster6AlbumArt, locationPoster7AlbumArt]
  locationPosterAudioNames = [
    'Judith - A Perfect Circle.mp3',
    'Sexx Laws - Beck.mp3',
    'The Day I Went Away - Sleater-Kinney.mp3',
    'Dramamine - Modest Mouse.mp3',
    'Out Of Control - The Chemical Brothers.mp3',
    'Breathe - The Prodigy.mp3',
    'Break Stuff - Limp Bizkit.mp3'
  ]
  locationPosterMetadata = [
    {
      artistName: 'A Perfect Circle',
      description: '<p><span style="font-size: 48px;"><strong>APC LIVE</strong> @ AERIAL THEATER</span></p><p><span style="font-size: 36px;">w/ SUNNA</span></p><p><span style="font-size: 24px;">TICKETS VIA TICKETMASTER AND 713 629 3770 </span></p>',
      songInfo: 'Judith',
      comments: []
    },
    {
      artistName: 'Beck',
      description: '<p><span style="font-size: 28px; color: rgb(41, 105, 176);"><strong>The Midnight Vultures Tour 2000</strong></span></p><p><span style="font-size: 24px;"><em>Santa Barbara Bowl May 4th</em></span></p><p><span style="font-size: 24px;"><em>Greek Theater May 5/6</em></span></p><p><span style="font-size: 24px;"><a href="https://www.beck.com/" target="_blank" rel="noopener noreferrer">beck.com</a></span></p>',
      songInfo: 'Sexx Laws',
      comments: []
    },
    {
      artistName: 'Sleater-Kinney',
      description: `
      <p style="margin: 0; line-height: 1.2;"><span style="font-size: 36px; color: rgb(235, 107, 86);">Sleater-Kinney @ The Commodore Ballroom</span></p>
      <p style="margin: 5px 0;"><span style="font-size: 24px;">Liquid Adeline // MC Kia // Pepper Sands</span></p>
      <p style="margin: 0;"><span style="font-size: 24px;">SATURDAY, SEPTEMBER 2nd</span></p>
      `,
      songInfo: 'The Day I Went Away',
      comments: []
    },
    {
      artistName: 'Modest Mouse',
      description: '<p><span style="font-size: 48px; background-color: rgb(71, 85, 119); color: rgb(255, 255, 255);"><em>The Moon &amp; Antarctica</em>&nbsp;</span><span style="font-size: 36px; background-color: rgb(71, 85, 119); color: rgb(255, 255, 255);">out now on Epic</span></p><p><span style="font-size: 18px;">&quot;For at least a few months, the world can stop waiting for Radiohead&apos;s next album, and start wondering how in the hell Modest Mouse will ever top the monumental, ground-breaking, hypnotic, sublime The Moon &amp; Antarctica&quot; - <em>Pitchfork</em> Brent DiCrescenzo </span></p>',
      songInfo: 'Dramamine',
      comments: []
    },
    {
      artistName: 'The Chemical Brothers',
      description: `
    <p style="margin: 0; line-height: 1.1;">
      <span style="font-size: 48px; font-weight: bold; background-color: rgb(226, 80, 65); color: rgba(255, 255, 255, 1); padding: 0 5px;">
        &nbsp;THE CHEMICAL BROTHERS&nbsp;
      </span>
    </p>
    <p style="margin: 5px 0 0 0; line-height: 1.1;">
      <span style="font-size: 36px; color: rgb(226, 80, 65); font-weight: bold;">
        &nbsp;UNDERWORLD&nbsp;
      </span>
    </p>
    <p style="margin: 0; line-height: 1.1;">
      <span style="font-size: 30px; color: rgb(226, 80, 65); font-weight: bold;">
        &nbsp;DJ SHADOW&nbsp;
      </span>
    </p>
    <p style="margin: 15px 0 0 0;">
      <span style="font-size: 19px;">FRIDAY OCTOBER 4TH</span>
    </p>
    <p style="margin: 0;">
      <span style="font-size: 19px;"><em>BILL GRAHAM CIVIC</em></span>
    </p>
    <p style="margin: 0;">
      <span style="font-size: 20px;">
        <a href="https://www.thechemicalbrothers.com" style="color: inherit; text-decoration: underline;">
          <em>visit https://thechemicalbrothers.com</em>
        </a>
      </span>
    </p>
  `,
      songInfo: 'Out Of Control',
      comments: []
    },
    {
      artistName: 'The Prodigy',
      description: `
    <p style="margin: 0; line-height: 1;">
      <span style="font-size: 60px; background-color: rgb(184, 49, 47); color: rgb(247, 218, 100); padding: 0 5px;">
        THE PRODIGY
      </span>
    </p>
    <p style="margin: 5px 0 15px 0; line-height: 1.2;">
      <span style="font-size: 24px; background-color: rgb(184, 49, 47); color: rgb(247, 218, 100); padding: 0 5px;">
        Manic Street Preachers, Kula Shaker, Foo Fighters and more
      </span>
    </p>
    <p style="margin: 0;">
      <span style="font-size: 30px; background-color: rgb(0, 0, 0); color: rgb(255, 255, 255); padding: 0 5px;">
        SEMPLE STADIUM SUNDAY August 24th
      </span>
    </p>
  `,
      songInfo: 'Breathe',
      comments: []
    },
    {
      artistName: 'Limp Bizkit',
      description: `
    <p style="margin: 0; line-height: 1.1;">
      <span style="font-size: 36px; font-weight: bold; background-color: rgb(97, 189, 109); color: rgb(0, 0, 0); padding: 0 5px;">
        the ANGER MANAGEMENT tour
      </span>
    </p>
    <p style="margin: 10px 0 0 0; line-height: 1;">
      <span style="font-size: 48px; font-weight: bold;">
        LIMP BIZKIT
      </span>
    </p>
    <p style="margin: 0; line-height: 1;">
      <span style="font-size: 48px; font-weight: bold;">
        EMINEM
      </span>
    </p>
    <p style="margin: 5px 0 0 0; line-height: 1.2;">
      <span style="font-size: 26px;">
        Papa Roach, xzibit
      </span>
    </p>
    <p style="margin: 15px 0 0 0;">
      <span style="font-size: 19px;">
        tickets @ sfx.com
      </span>
    </p>
  `,
      songInfo: 'Break Stuff',
      comments: []
    }
  ]

   // Load any exported posters from localStorage
 let exportedPosters = getItem('exportedPosters');
 if (exportedPosters && exportedPosters.length > 0) {
   for (let dataURL of exportedPosters) {
     loadImage(dataURL, img => {
       postersLocation.push(img);
       // Add position for this poster
       let maxH = 500;
       let aspectRatio = img.width / img.height;
       let w = maxH * aspectRatio;
       locationposterPositions.push({
         x: random(510, 1200),
         y: random(200, 450),
         w: w,
         h: maxH,
         z: locationposterPositions.length
       });
     });
   }
 }

   for (let i = 0; i < postersLocation.length; i++){
   let poster = postersLocation[i];
   let maxH = 500;
   let aspectRatio = poster.width / poster.height;
   let w = maxH * aspectRatio;

   locationposterPositions.push({
     x: random(510, 1200),
     y: random(200, 450),
     w: w,  // Calculated based on aspect ratio
     h: maxH,
     z: i
   });
 }

}


function posterPositionsUserpage(){
 posterPositions = []

 // Start with test posters
 postersuser = [testposter1, testposter2, testposter3, testposter4]

 // Initialize parallel arrays with all test poster data
 posterAudio = [testposter1Audio, testposter2Audio, testposter3Audio, testposter4Audio];
 posterAlbumArt = [testposter1AlbumArt, testposter2AlbumArt, testposter3AlbumArt, testposter4AlbumArt];
 posterAudioNames = [
   'Red Alert - Basement Jaxx.mp3',
   'Believe In Me - Lord Michael.mp3',
   'Dont Sweat The Technique - Eric B. & Rakim.mp3',
   'Chime (Edit) - Orbital.mp3'
 ];
 posterMetadata = [
   {
     artistName: 'Basement Jaxx',
     description: '<p><span style="color: #00ffff; font-size: 32px;"><strong>TWILO</strong></span></p><p style="font-size: 24px;"><strong><em>530 W 27th St.</em></strong></p><p style="font-size: 24px;"><span style="color: #ff0000;"><strong><em>$12 BEFORE 12:30A FOR MEMBERS $15 after</em></strong></span></p>',
     songInfo: 'Red Alert',
     comments: []
   },
   {
     artistName: 'Lord Michael',
     description: '<p><span style="font-size: 48px;"><em><strong><span style="color: rgb(184, 49, 47);">HELLRAISER</span></strong></em></span><span style="font-size: 30px;"><em><strong><span style="color: rgb(184, 49, 47);"> @ THE TUNNEL ALL NITE SUNDAY</span></strong></em></span></p><p><br></p><p><span style="font-size: 30px;"><span style="color: rgb(250, 197, 28);"><strong>DISCO 2000</strong></span></span><span style="font-size: 28px;"><span style="color: rgb(250, 197, 28);"> WEDNESDAYS</span> <span style="color: rgb(97, 189, 109);">@ LIMELIGHT OPEN BAR 10-12A HOST - MICHEAL ALIG</span></span></p>',
     songInfo: 'Believe In Me',
     comments: []
   },
   {
     artistName: 'Eric B. & Rakim',
     description: '<p><span style="font-size: 60px;"><em>DONT SWEAT THE TECHNIQUE </em><u>OUT NOW ON MCA RECORDS</u></span></p>',
     songInfo: 'Dont Sweat the Technique',
     comments: []
   },
   {
     artistName: 'Orbital',
     description: '<p><strong><span style="font-size: 60px;"><u>ORBITAL LIVE 1996&nbsp;</u></span></strong></p><p><span style="font-size: 20px;">VISIT <a data-fr-linked="true" href="https://www.orbitalofficial.com" target="_blank" rel="noopener noreferrer">https://www.orbitalofficial.com</a> <span style="background-color: rgb(44, 130, 201);">ORBITAL DOT COM</span></span></p>',
     songInfo: 'Chime (Edit)',
     comments: []
   }
 ];

 // Create initial positions for test posters
 for (let i = 0; i < postersuser.length; i++){
   let poster = postersuser[i];
   let maxH = 500;
   let aspectRatio = poster.width / poster.height;
   let w = maxH * aspectRatio;

   posterPositions.push({
     x: random(510, 1200),
     y: random(450, 200),
     w: w,  // Calculated based on aspect ratio
     h: maxH,
     z: i
   });
 }
}

function setup() {

  createCanvas(1440, 1080);

  buttonSetup()
  posterPositionsUserpage(); // Initialize test posters and audio arrays FIRST
  loadLocationPosters(); // Initialize location page posters
  loadUploadedImages(); // Load saved decorative images from localStorage
  loadBasePosterImage(); // Load saved base poster image from localStorage
  loadArtistAudio(); // Load artist audio metadata from localStorage
  loadArtistAlbumArt(); // Load artist album art from localStorage
  loadUserCustomization(); // Load user page customization from localStorage
  loadUserGifs(); // Load user page decorative GIFs from localStorage

  // Initialize IndexedDB asynchronously (non-blocking) - AFTER posterPositionsUserpage
  initDB().then(() => {
    console.log('IndexedDB initialized');
    // Load saved posters after DB is ready - this will append to the arrays
    loadSavedPosters();
  }).catch(err => {
    console.error('IndexedDB initialization failed:', err);
  });

  let canvas = select('canvas');
  canvas.drop(handleFileDrop); // Changed to handle both images and audio
  canvas.dragOver(handleDragOver);
  canvas.dragLeave(handleDragLeave);

  console.log(posterPositions)

}
function draw() {
  //console.log("X:", mouseX, "Y:", mouseY);
  if (siteState === 'homeScreen'){
    homeScreenDraw();
  } else if (siteState === 'landingScreen'){
    landingScreeenDraw();
  } else if (siteState === 'logintypeScreen'){
    loginScreentypeDraw()
  } else if (siteState === 'artistScreen'){
    artistpageDraw()
  } else if (siteState === 'userScreen'){
    userpageDraw()
  } else if (siteState === 'randomPosterScreen'){
    randomPosterDraw()
  } else if (siteState === 'locationScreen'){
    locationScreenDraw()
  }
  
}

function homeScreenDraw(){
  homegobutton.show()
  posterDescriptionInput.hide()
  posterTitleInput.hide()
  posterSongInfoInput.hide()
  formatToggleButton.hide()
  usercustomizebutton.hide()
  closeCustomizePanel()
  // Ensure toolbar is hidden when leaving artist page
  if (quillToolbar) quillToolbar.style.display = 'none';
image(firstscreen,0,0)
}

function landingScreeenDraw(){
  homegobutton.hide()
  loginnavbutton.show()
  randomnavbutton.show()
  posterDescriptionInput.hide()
  posterTitleInput.hide()
  posterSongInfoInput.hide()
  formatToggleButton.hide()
  usercustomizebutton.hide()
  closeCustomizePanel()
  image(landingscreen,0,0)
}

function loginScreentypeDraw(){
  homegobutton.hide()
  loginnavbutton.show()
  randomnavbutton.show()
  locationnavbutton.show()
  makemusicloginbutton.show()
  listenmusicloginbutton.show()
  exportposterbutton.hide()
  artistmusicplaybutton.hide()
  artistmusicstopbutton.hide()
  exportposterbutton.hide()
  usermusicplaybutton.hide()
  usermusicpausebutton.hide()
  usermusicpreviousbutton.hide()
  usermusicnextbutton.hide()
  posterzoomedplaybutton.hide()
  posterTitleInput.hide()
  posterDescriptionInput.hide()
  posterSongInfoInput.hide()
  formatToggleButton.hide()
  usercustomizebutton.hide()
  closeCustomizePanel()


image(logintypescreen,0,0)
}

function artistpageDraw(){
  makemusicloginbutton.hide()
  listenmusicloginbutton.hide()
  usermusicplaybutton.hide()
  usermusicpausebutton.hide()
  usermusicpreviousbutton.hide()
  usermusicnextbutton.hide()
  posterzoomedplaybutton.hide()
  artistmusicplaybutton.hide()
  artistmusicstopbutton.hide()
  posterSongInfoInput.hide()
  homegobutton.hide()
  usercustomizebutton.hide()
  closeCustomizePanel()

  // Show poster metadata inputs
  posterTitleInput.show()
  posterDescriptionInput.show()
  formatToggleButton.show()

  // Initialize Quill editor if not already initialized
  if (!posterDescriptionEditor) {
    posterDescriptionEditor = new Quill('#description-editor', {
      theme: 'snow',
      placeholder: 'Description and links...',
      modules: {
        toolbar: [
          ['bold', 'italic', 'underline'],
          [{ 'size': ['small', false, 'large', 'huge'] }],
          [{ 'color': [] }, { 'background': [] }],
          [{ 'align': [] }],
          ['link'],
          ['clean']
        ]
      }
    });

    // Limit content to what fits in the visible area
    const maxLength = 2000; // Character limit
    posterDescriptionEditor.on('text-change', function(delta, oldDelta, source) {
      if (posterDescriptionEditor.getLength() > maxLength) {
        posterDescriptionEditor.deleteText(maxLength, posterDescriptionEditor.getLength());
      }
    });

    // Get reference to toolbar and set it up
    setTimeout(() => {
      quillToolbar = document.querySelector('.ql-toolbar.ql-snow');
      //console.log('Quill toolbar element:', quillToolbar);

      if (quillToolbar) {
        // Move toolbar to body to ensure it's not affected by any parent container
        document.body.appendChild(quillToolbar);

        // Try multiple methods to hide it
        quillToolbar.style.setProperty('display', 'none', 'important');
        quillToolbar.style.visibility = 'hidden';
        quillToolbar.classList.add('toolbar-hidden');

        // Add title attributes to help identify buttons
        const colorBtn = quillToolbar.querySelector('.ql-color');
        const bgBtn = quillToolbar.querySelector('.ql-background');
        const sizeBtn = quillToolbar.querySelector('.ql-size');

        if (colorBtn) colorBtn.setAttribute('title', 'Text Color');
        if (bgBtn) bgBtn.setAttribute('title', 'Background Color');
        if (sizeBtn) sizeBtn.setAttribute('title', 'Text Size');
      } else {
        console.error('Toolbar NOT found!');
      }
    }, 300);
  } else {
    // If editor already exists, make sure we have toolbar reference and it's hidden
    if (!quillToolbar) {
      quillToolbar = document.querySelector('.ql-toolbar.ql-snow');
    }
    if (quillToolbar) {
      quillToolbar.style.setProperty('display', 'none', 'important');
      formatToggleButton.html('Format');
    }
  }


  // Show or hide export button based on whether we have a base image
  if (basePosterImage !== null) {
    exportposterbutton.show()
  } else {
    exportposterbutton.hide()
  }

  image(artistpagescreen,0,0)

  //image(artistimportwindow,950,180)

  // Music zone drop area
  push()
  fill(255, 255, 255, 200)
  stroke(51)
  strokeWeight(10)
  rect(955,640,425,425, 20)
  pop()


  // // description and links background
  // push()
  // fill(255, 255, 255, 200)
  // stroke(51)
  // strokeWeight(6)
  // rect(955,175,425,400)
  // pop()

  // poster drop zone rect
  push()
  fill(255, 255, 255, 200) // White background with slight transparency
  stroke(51)
  strokeWeight(12)
  rect(245,240,640,810,20)
  pop()


  // Show instruction or draw base image
  if (basePosterImage === null) {
    // No base image yet - show instruction
    push()
    noStroke()
    fill(0) // Black text for better visibility
    textSize(30)
    textFont(italicBoldSFFont)
    textAlign(CENTER, CENTER)
    text('Drag and drop base image first!', 565, 612)
    text('(Vertical orientation recommended)', 565, 650)
    pop()
  } else {
    // Draw base image centered in poster rect
    push()
    let centerX = basePosterImage.x + 640/2 - basePosterImage.w/2;
    let centerY = basePosterImage.y + 810/2 - basePosterImage.h/2;
    image(basePosterImage.img, centerX, centerY, basePosterImage.w, basePosterImage.h);
    pop()

    // Draw delete button for base image
    push()
    fill(255, 0, 0, 150);
    noStroke();
    rect(255, 250, 80, 30, 5);
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(14);
    text('Delete', 295, 265);
    pop()
  }

  // click zone creator
  // poster/stuff uploading

  // Drop zone highlight
  if (isHighlighted) {
    fill(200, 200, 255, 100);
    noStroke();
    rect(245, 240, 640, 810);
    fill(0);
    textAlign(CENTER, CENTER);
    textSize(30);
    if (basePosterImage === null) {
      text('Drop base image here!', 565, 545);
    } else {
      push()
      fill(255, 204, 204, 150);
      rect(245, 240, 640, 810);
      pop()

      push()
      fill(0)
      textSize(35)
      text('Drop decorative images here!', 565, 645);
      pop()
    }
  }

  // Draw decorative images with z-ordering
  if (basePosterImage !== null && bandUploadedImages.length > 0) {
    let sortedIndices = [...Array(bandUploadedImages.length).keys()].sort((a, b) => {
      return bandUploadedImages[a].z - bandUploadedImages[b].z;
    });

    for (let i of sortedIndices) {
      let item = bandUploadedImages[i];
      image(item.img, item.x, item.y, item.w, item.h);
    }
  }

  // Draw resize handles on selected decorative image
  if (selectedDecorativeImage !== null && bandUploadedImages[selectedDecorativeImage]) {
    let item = bandUploadedImages[selectedDecorativeImage];
    let handleSize = 12;

    // Draw selection border
    push();
    stroke(0, 150, 255);
    strokeWeight(2);
    noFill();
    rect(item.x, item.y, item.w, item.h);
    pop();

    // Draw corner handles
    push();
    fill(255);
    stroke(0, 150, 255);
    strokeWeight(2);

    // Top-left handle
    rect(item.x - handleSize/2, item.y - handleSize/2, handleSize, handleSize);

    // Top-right handle
    rect(item.x + item.w - handleSize/2, item.y - handleSize/2, handleSize, handleSize);

    // Bottom-left handle
    rect(item.x - handleSize/2, item.y + item.h - handleSize/2, handleSize, handleSize);

    // Bottom-right handle
    rect(item.x + item.w - handleSize/2, item.y + item.h - handleSize/2, handleSize, handleSize);
    pop();
  }

  // Music Zone UI (updated to match rect at 955,640,425,425)
  let musicZoneX = 955;
  let musicZoneY = 640;
  let musicZoneW = 425;
  let musicZoneH = 425;
  let musicZoneCenterX = musicZoneX + musicZoneW / 2;
  let musicZoneCenterY = musicZoneY + musicZoneH / 2;

  push();
  textAlign(CENTER, CENTER);
  fill(0);

  if (artistAudioFile === null) {
    // No audio uploaded yet
    push()
    textFont(posterinfoFont)
    textSize(28);
    text('Drag and drop an MP3 here!', musicZoneCenterX, musicZoneCenterY - 20);
    //textSize(18);
    //text('in .mp3 please.', musicZoneCenterX, musicZoneCenterY + 10);
  } else if (artistAlbumArt === null) {
    // Audio uploaded, waiting for album art
    textSize(20);
    text('Drag and drop song art here!', musicZoneCenterX, musicZoneCenterY - 40);
    pop()
    push()
    let strokeInset = 5; // Half of strokeWeight(10)
    fill(255, 255, 255, 250); // More opaque white background for better visibility
    noStroke();
    rect(musicZoneX + strokeInset, musicZoneY + musicZoneH - 45,
         musicZoneW - strokeInset * 2, 40, 0, 0, 15, 15); // Rounded bottom corners, inset to show border
    fill(0);
    textAlign(CENTER, CENTER);
    textSize(20);
    text(artistAudioFileName, musicZoneCenterX, musicZoneY + musicZoneH - 25);
    pop()
  } else {
    // Both audio and album art uploaded
    artistmusicstopbutton.show()
    artistmusicplaybutton.show()
    posterSongInfoInput.show()

    // Clip album art to rounded corners (inset by half stroke width to show full border)
    push();
    drawingContext.save();
    drawingContext.beginPath();
    let strokeInset = 5; // Half of strokeWeight(10)
    drawingContext.roundRect(musicZoneX + strokeInset, musicZoneY + strokeInset,
                             musicZoneW - strokeInset * 2, musicZoneH - strokeInset * 2, 15);
    drawingContext.clip();
    // Fill the entire music zone with album art
    image(artistAlbumArt, musicZoneX + strokeInset, musicZoneY + strokeInset,
          musicZoneW - strokeInset * 2, musicZoneH - strokeInset * 2);
    drawingContext.restore();
    pop();

    // Draw delete all button
    push();
    fill(255, 0, 0, 150);
    noStroke();
    rect(musicZoneX + 10, musicZoneY + 10, 80, 30, 5);
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(14);
    text('Delete All', musicZoneX + 50, musicZoneY + 25);
    pop();

    // Draw delete album art only button
    push();
    fill(255, 100, 0, 150);
    noStroke();
    rect(musicZoneX + 100, musicZoneY + 10, 100, 30, 5);
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(14);
    text('Delete Art', musicZoneX + 150, musicZoneY + 25);
    pop();
  }
  pop();

  // Music zone highlight when dragging over
  if (isArtistMusicZoneHighlighted) {
    push();
    drawingContext.save();
    drawingContext.beginPath();
    let strokeInset = 5; // Half of strokeWeight(10)
    drawingContext.roundRect(musicZoneX + strokeInset, musicZoneY + strokeInset,
                             musicZoneW - strokeInset * 2, musicZoneH - strokeInset * 2, 15);
    drawingContext.clip();
    fill(200, 255, 200, 100);
    noStroke();
    rect(musicZoneX + strokeInset, musicZoneY + strokeInset,
         musicZoneW - strokeInset * 2, musicZoneH - strokeInset * 2);
    drawingContext.restore();
    pop();
  }

}

function userpageDraw(){
  makemusicloginbutton.hide()
  listenmusicloginbutton.hide()
  exportposterbutton.hide()
  commentInput.hide()
  commentSubmitButton.hide()
  posterzoomedsavebutton.hide()
  homegobutton.hide()
  commentNameInput.hide();
  posterDescriptionInput.hide()
  posterTitleInput.hide()
  posterSongInfoInput.hide()
  formatToggleButton.hide()

  // Show customize button only when not in poster zoom mode
  if (!posterMode.active) {
    usercustomizebutton.show()
  }

  // Hide poster zoom buttons by default (shown only in poster mode)
  if (!posterMode.active) {
    posterzoomedplaybutton.hide()
    descriptionDisplay.hide()
  }

  background(232,232,232)

  //custom background layer (if set)
  if (userCustomBackground) {
    image(userCustomBackground, 0, 0, width, height) // Draw custom background behind everything
  }

  // Draw decorative GIFs (above background, below posters)
  if (userDecorativeGifs.length > 0) {
    // Sort by z-index to maintain layering
    let sortedIndices = [...Array(userDecorativeGifs.length).keys()].sort((a, b) => {
      return userDecorativeGifs[a].z - userDecorativeGifs[b].z;
    });

    for (let i of sortedIndices) {
      let item = userDecorativeGifs[i];
      image(item.img, item.x, item.y, item.w, item.h);
    }
  }

  //static backround elements (transparent UI - always draw on top)
  image(userpagescreenclean, 0, 0)

  //backing for name bar
  push()
  fill(userNameBarColor.r, userNameBarColor.g, userNameBarColor.b, userNameBarColor.a)
  noStroke()
  rect(0, 120, 1050, 125, 0, 15, 15, 0) // Starts at left edge, extends past username, rounded right corners
  pop()

  //user name
  push()
  textFont(BoldSFFont)
  textSize(70)
  fill(getContrastColor(userNameBarColor)) // Dynamic text color based on background
  textAlign(LEFT, BASELINE)
  drawExpandedBoldText("Listener's", 600, 205, 1.25)
  pop()

  // info text 1

    push()
    resetMatrix() // Reset any transformations
    noStroke()
    fill(getContrastColor(userNameBarColor)) // Dynamic text color based on name bar background
    textSize(45)
    textFont(italicHeavySFont)
    textAlign(LEFT, BASELINE)
    //text('New York', 160, 400)
    text(postersuser.length + ' Saves', 155, 200)
    pop()

    // MUSIC PLAYER

    // Display current track's album art from poster arrays
    if (posterAlbumArt[currentuserTrack]) {
      //backing for album art
      push()
      fill(userAlbumArtBackingColor.r, userAlbumArtBackingColor.g, userAlbumArtBackingColor.b, userAlbumArtBackingColor.a)
      noStroke()
      rect(72.5, 492.5, 345, 345, 12) // Centered around album art (300x300 at 95,515)
      pop()

      //backing for song name
      push()
      fill(userSongNameBackingColor.r, userSongNameBackingColor.g, userSongNameBackingColor.b, userSongNameBackingColor.a)
      noStroke()
      rect(72.5, 395, 345, 80, 8) // Centered around song title text at x=245
      pop()

      image(posterAlbumArt[currentuserTrack], 95, 515, 300, 300)

      // Display song title over album art
      push()
      fill(getContrastColor(userSongNameBackingColor)) // Dynamic text color based on background
      textAlign(CENTER, CENTER)
      textFont(sfblackFont)
      let songDisplay = '"' + (posterMetadata[currentuserTrack]?.songInfo || posterAudioNames[currentuserTrack] || 'Unknown Track') + '"'

      // Dynamically resize text to fit within the backing rectangle
      let maxWidth = 345 - 20 // Rectangle width minus padding
      let maxHeight = 80 - 20 // Rectangle height minus padding
      let fontSize = 45
      textSize(fontSize)

      // Reduce font size until text fits
      while ((textWidth(songDisplay) > maxWidth || fontSize > maxHeight) && fontSize > 10) {
        fontSize -= 1
        textSize(fontSize)
      }

      // Center on the backing rectangle: x = 72.5 + 345/2 = 245, y = 395 + 80/2 = 435
      text(songDisplay, 245, 430)
      pop()
    }

    //image(multibuttonuser, 110,860, 400,200)

    usermusicplaybutton.show()
    usermusicpausebutton.show()
    usermusicpreviousbutton.show()
    usermusicnextbutton.show()

    // Draw all posters (after static elements so they can cover them when dragged)
    // Create array of indices based on actual poster count
    let indices = [];
    for (let i = 0; i < postersuser.length && i < posterPositions.length; i++) {
      indices.push(i);
    }

    // Sort by z-order
    let sortedIndices = indices.sort((a, b) => {
      return posterPositions[a].z - posterPositions[b].z;
    });

    // Draw all posters
    push()
    for (let i of sortedIndices) {
      let posterPos = posterPositions[i];
      if (postersuser[i]) {
        image(postersuser[i], posterPos.x, posterPos.y, posterPos.w, posterPos.h);
      }
    }
    pop()

    // Draw resize handles for selected GIF
    if (selectedUserGif !== null && userDecorativeGifs[selectedUserGif] && !posterMode.active) {
      let item = userDecorativeGifs[selectedUserGif];
      let handleSize = 12;

      push();
      fill(255);
      stroke(0);
      strokeWeight(2);

      // Draw corner handles
      // Bottom-right
      rect(item.x + item.w - handleSize/2, item.y + item.h - handleSize/2, handleSize, handleSize);
      // Bottom-left
      rect(item.x - handleSize/2, item.y + item.h - handleSize/2, handleSize, handleSize);
      // Top-right
      rect(item.x + item.w - handleSize/2, item.y - handleSize/2, handleSize, handleSize);
      // Top-left
      rect(item.x - handleSize/2, item.y - handleSize/2, handleSize, handleSize);

      // Draw selection border
      noFill();
      stroke(0, 150, 255);
      strokeWeight(2);
      rect(item.x, item.y, item.w, item.h);
      pop();
    }

    // add controls for resizing here! h/w
    if (posterMode.active) {
      loginnavbutton.hide()
      randomnavbutton.hide()
      locationnavbutton.hide()
      usermusicplaybutton.hide()
      usermusicpausebutton.hide()
      usermusicpreviousbutton.hide()
      usermusicnextbutton.hide()
    posterMode.fadeIn = lerp(posterMode.fadeIn, 1, 0.15);
    
    // Semi-transparent background
    fill(0, 0, 0, 200 * posterMode.fadeIn);
    rect(0, 0, width, height);
    
    // Zoomed poster
    push();
    translate(width/2, height/2);
    scale(posterMode.fadeIn); // Scale animation

    //zoom/pan
    translate(panX, panY);
    scale(zoomLevel);

    imageMode(CENTER);

    let poster = postersuser[posterMode.posterID];

    // Safety check - if poster failed to load, close zoom mode
    if (!poster) {
      console.error('Poster failed to load, closing zoom mode');
      posterMode.active = false;
      descriptionDisplay.hide();
      if (siteState === 'userScreen') {
        usercustomizebutton.show();
      }
      return;
    }

    let maxzoommodeWidth = 750;
    let maxzoommodeHeight = 1100;
    let aspectRatio = poster.width / poster.height;

    let displayWidth, displayHeight;
    

    if (aspectRatio > maxzoommodeWidth / maxzoommodeHeight) {
    // Image is wider - fit to width
    displayWidth = maxzoommodeWidth;
    displayHeight = maxzoommodeWidth / aspectRatio;
    } else {
    // Image is taller - fit to height
    displayHeight = maxzoommodeHeight;
    displayWidth = maxzoommodeHeight * aspectRatio;
    }

    image(poster, 0, 0, displayWidth, displayHeight);

    pop();
    
    // Close button
    push()
    image (xpcloseicon, 50,50, 75, 75)
    pop()

    //band info section (links and text only)

    // artist name and subtitle (top panel)
    push()
    if (posterMetadata[posterMode.posterID]) {
      let artistName = posterMetadata[posterMode.posterID].artistName || 'Untitled';

      // Calculate text width and adjust size if needed
      textFont(highlightpagetitlefont)
      let fontSize = 45;
      textSize(fontSize);
      let nameWidth = textWidth(artistName);

      // Maximum width available (canvas width minus padding for close button and margins)
      let maxWidth = 1440 - 200 - 100; // Leave space for close button (150px) and margins

      // Shrink text if it's too wide
      while (nameWidth > maxWidth - 40 && fontSize > 20) {
        fontSize -= 2;
        textSize(fontSize);
        nameWidth = textWidth(artistName);
      }

      // Calculate panel width based on text (with padding)
      let panelWidth = min(max(450, nameWidth + 80), maxWidth);
      let panelX = (1440 - panelWidth) / 2; // Center the panel

      // Draw background panel
      fill(255,255,255, 200)
      rect(panelX, 20, panelWidth, 100)

      // Draw text
      fill(0)
      textSize(fontSize)
      textAlign(CENTER, CENTER)
      text(artistName, 1440 / 2, 70)
    }
    pop()

    // description/links panel (left panel)
    push()
    fill(255,255,255, 200)
    rect(50,200,400,500)
    pop()

    // Display rich text description using HTML element
    if (posterMetadata[posterMode.posterID]) {
      descriptionDisplay.html(posterMetadata[posterMode.posterID].description || '');
      descriptionDisplay.show();
    } else {
      descriptionDisplay.hide();
    }

    // comments section
    push()
    fill(255,255,255, 200)
    rect(1050,350,350,600)

    // Display comments
    if (posterMetadata[posterMode.posterID] && posterMetadata[posterMode.posterID].comments) {
      fill(0)
      textFont(posterinfoFont)
      textSize(14)
      textAlign(LEFT, TOP)

      let yOffset = 370;
      let comments = posterMetadata[posterMode.posterID].comments;

      // Show most recent comments (last 10)
      let startIdx = max(0, comments.length - 10);
      for (let i = startIdx; i < comments.length; i++) {
        let comment = comments[i];
        if (yOffset < 900) {  // Stay within panel bounds
          // Username and timestamp
          fill(100)
          textSize(14)
          text(comment.username + ' • ' + new Date(comment.timestamp).toLocaleDateString(), 1070, yOffset)
          yOffset += 20;

          // Comment text
          fill(0)
          textSize(16)
          text(comment.text, 1070, yOffset, 310, 60)
          yOffset += 60;
        }
      }
    }
    pop()

    // Show comment input when in poster mode
    if (posterMode.active) {
      commentNameInput.show();
      commentInput.show();
      commentSubmitButton.show();
    } else {
      commentNameInput.hide();
      commentInput.hide();
      commentSubmitButton.hide();
      descriptionDisplay.hide();
    }

    // Mini player (only show if poster has audio)
    if (posterAudio[posterMode.posterID] && posterAlbumArt[posterMode.posterID]) {
      let playerY = height - 150;
      let playerX = width / 2;

      // Background panel
      push();
      fill(0, 0, 0, 180);
      stroke(255, 255, 255, 200);
      strokeWeight(2);
      rectMode(CENTER);
      rect(playerX, playerY, 400, 120, 10);
      pop();

      // Album art thumbnail
      push();
      imageMode(CENTER);
      image(posterAlbumArt[posterMode.posterID], playerX - 130, playerY, 80, 80);
      pop();

      // Song info text
      push();
      fill(255);
      textFont(posterinfoFont);
      textAlign(LEFT, CENTER);
      textSize(20);
      let songDisplay = posterMetadata[posterMode.posterID]?.songInfo || posterAudioNames[posterMode.posterID] || 'Unknown Track';
      text(songDisplay, playerX - 80, playerY - 20);
      pop();

      // Update button text and position
      if (currentPosterAudio && currentPosterAudio.isPlaying()) {
        posterzoomedplaybutton.html('Pause');
      } else {
        posterzoomedplaybutton.html('Play');
      }
      posterzoomedplaybutton.position(playerX - 40, playerY + 20);
      posterzoomedplaybutton.show();
    } else {
      posterzoomedplaybutton.hide();
    }

  } else {
    posterMode.fadeIn = lerp(posterMode.fadeIn, 0, 0.15);
    loginnavbutton.show()
    randomnavbutton.show()
    locationnavbutton.show()
    posterzoomedplaybutton.hide()
  }

  // Customization panel (drawn last so it's on top of everything)
  if (customizePanelVisible) {
    push()
    resetMatrix() // Reset any transformations
    rectMode(CORNER)
    // Draw panel background
    fill(220, 220, 220) // Light gray
    stroke(0) // Black border
    strokeWeight(3)
    rect(40, 130, 330, 320, 10) // Panel with rounded corners (increased height for GIF upload)

    // Draw panel text
    fill(0) // Black text
    noStroke()
    textAlign(LEFT,CENTER)
    textSize(20)
    textFont(BoldSFFont)
    text('Customize!', 60, 160)

    textSize(14)
    text('Background Image:', 60, 200)
    text('Name Bar Color:', 60, 250)
    text('Album Art Color:', 60, 305)
    text('Song Name Color:', 60, 360)
    text('Add Decorations:', 60, 415)
    pop()
  }
  }

function randomPosterDraw(){
  // Hide all other screen buttons
  makemusicloginbutton.hide()
  listenmusicloginbutton.hide()
  exportposterbutton.hide()
  commentInput.hide()
  commentSubmitButton.hide()
  usermusicplaybutton.hide()
  usermusicpausebutton.hide()
  usermusicpreviousbutton.hide()
  usermusicnextbutton.hide()
  artistmusicplaybutton.hide()
  artistmusicstopbutton.hide()
  usercustomizebutton.hide()
  closeCustomizePanel()
  posterTitleInput.hide()
  posterDescriptionInput.hide()
  posterSongInfoInput.hide()
  homegobutton.hide()
  commentNameInput.hide();
  formatToggleButton.hide()

  // Show all nav buttons (hide only when zoomed in on poster)
  loginnavbutton.show()
  randomnavbutton.show()
  locationnavbutton.show()

  if (posterMode.active) {
    loginnavbutton.hide()
    randomnavbutton.hide()
    locationnavbutton.hide()
  }

  // Draw your custom background here (placeholder for now)
  background(30, 30, 40) // Dark background - replace with your image later

  // Draw the zoomed poster if active
  if (posterMode.active) {
    posterMode.fadeIn = lerp(posterMode.fadeIn, 1, 0.15);

    // Semi-transparent overlay
    fill(0, 0, 0, 200 * posterMode.fadeIn);
    rect(0, 0, width, height);

    // Zoomed poster
    push();
    translate(width/2, height/2);
    scale(posterMode.fadeIn);

    //zoom/pan
    translate(panX, panY);
    scale(zoomLevel);

    imageMode(CENTER);

    let poster = postersLocation[posterMode.posterID];

    if (!poster) {
      console.error('Poster failed to load');
      posterMode.active = false;
      descriptionDisplay.hide();
      if (siteState === 'userScreen') {
        usercustomizebutton.show();
      }
      return;
    }

    let maxzoommodeWidth = 750;
    let maxzoommodeHeight = 1100;
    let aspectRatio = poster.width / poster.height;

    let displayWidth, displayHeight;

    if (aspectRatio > maxzoommodeWidth / maxzoommodeHeight) {
      displayWidth = maxzoommodeWidth;
      displayHeight = maxzoommodeWidth / aspectRatio;
    } else {
      displayHeight = maxzoommodeHeight;
      displayWidth = maxzoommodeHeight * aspectRatio;
    }

    image(poster, 0, 0, displayWidth, displayHeight);

    pop();

    // Close button
    push()
    image(xpcloseicon, 50, 50, 75, 75)
    pop()

    // Artist name panel (top)
    push()
    if (locationPosterMetadata[posterMode.posterID]) {
      let artistName = locationPosterMetadata[posterMode.posterID].artistName || 'Untitled';

      // Calculate text width and adjust size if needed
      textFont(highlightpagetitlefont)
      let fontSize = 45;
      textSize(fontSize);
      let nameWidth = textWidth(artistName);

      // Maximum width available (canvas width minus padding for close button and margins)
      let maxWidth = 1440 - 200 - 100; // Leave space for close button (150px) and margins

      // Shrink text if it's too wide
      while (nameWidth > maxWidth - 40 && fontSize > 20) {
        fontSize -= 2;
        textSize(fontSize);
        nameWidth = textWidth(artistName);
      }

      // Calculate panel width based on text (with padding)
      let panelWidth = min(max(450, nameWidth + 80), maxWidth);
      let panelX = (1440 - panelWidth) / 2; // Center the panel

      // Draw background panel
      fill(255, 255, 255, 200)
      rect(panelX, 20, panelWidth, 100)

      // Draw text
      fill(0)
      textSize(fontSize)
      textAlign(CENTER, CENTER)
      text(artistName, 1440 / 2, 70)
    }
    pop()

    // Description/links panel (left)
    push()
    fill(255, 255, 255, 200)
    rect(50, 200, 400, 500)
    pop()

    // Display rich text description using HTML element
    if (locationPosterMetadata[posterMode.posterID]) {
      descriptionDisplay.html(locationPosterMetadata[posterMode.posterID].description || '');
      descriptionDisplay.show();
    } else {
      descriptionDisplay.hide();
    }

    // Comments section (right)
    push()
    fill(255, 255, 255, 200)
    rect(1050, 350, 350, 600)

    if (locationPosterMetadata[posterMode.posterID] && locationPosterMetadata[posterMode.posterID].comments) {
      fill(0)
      textFont(posterinfoFont)
      textSize(14)
      textAlign(LEFT, TOP)

      let yOffset = 370;
      let comments = locationPosterMetadata[posterMode.posterID].comments;

      let startIdx = max(0, comments.length - 10);
      for (let i = startIdx; i < comments.length; i++) {
        let comment = comments[i];
        if (yOffset < 900) {
          fill(100)
          textSize(14)
          text(comment.username + ' • ' + new Date(comment.timestamp).toLocaleDateString(), 1070, yOffset)
          yOffset += 20;

          fill(0)
          textSize(16)
          text(comment.text, 1070, yOffset, 310, 60)
          yOffset += 60;
        }
      }
    }
    pop()

    // Show comment input
    commentNameInput.show();
    commentInput.show();
    commentSubmitButton.show();

    // Save button (bottom left, always visible when viewing poster)
    posterzoomedsavebutton.position(50, height - 80);
    posterzoomedsavebutton.show();

    // Mini player (only show if poster has audio)
    if (locationPosterAudio[posterMode.posterID] && locationPosterAlbumArt[posterMode.posterID]) {
      let playerY = height - 150;
      let playerX = width / 2;

      // Background panel
      push();
      fill(0, 0, 0, 180);
      stroke(255, 255, 255, 200);
      strokeWeight(2);
      rectMode(CENTER);
      rect(playerX, playerY, 400, 120, 10);
      pop();

      // Album art thumbnail
      push();
      imageMode(CENTER);
      image(locationPosterAlbumArt[posterMode.posterID], playerX - 130, playerY, 80, 80);
      pop();

      // Song info text
      push();
      fill(255);
      textFont(posterinfoFont);
      textAlign(LEFT, CENTER);
      textSize(20);
      let songDisplay = locationPosterMetadata[posterMode.posterID]?.songInfo || locationPosterAudioNames[posterMode.posterID] || 'Unknown Track';
      text(songDisplay, playerX - 80, playerY - 20);
      pop();

      // Update button text and position
      if (currentPosterAudio && currentPosterAudio.isPlaying()) {
        posterzoomedplaybutton.html('Pause');
      } else {
        posterzoomedplaybutton.html('Play');
      }
      posterzoomedplaybutton.position(playerX - 40, playerY + 20);
      posterzoomedplaybutton.show();
    } else {
      posterzoomedplaybutton.hide();
    }

  } else {
    posterMode.fadeIn = lerp(posterMode.fadeIn, 0, 0.15);
    posterzoomedplaybutton.hide()
    posterzoomedsavebutton.hide()
    commentInput.hide();
    commentSubmitButton.hide();
  }
}

function locationScreenDraw(){
  homegobutton.hide()
  loginnavbutton.show()
  randomnavbutton.show()
  locationnavbutton.show()
  makemusicloginbutton.hide()
  listenmusicloginbutton.hide()
  exportposterbutton.hide()
  artistmusicplaybutton.hide()
  artistmusicstopbutton.hide()
  usermusicplaybutton.hide()
  usermusicpausebutton.hide()
  usermusicpreviousbutton.hide()
  usermusicnextbutton.hide()
  usercustomizebutton.hide()
  closeCustomizePanel()
  posterTitleInput.hide()
  posterDescriptionInput.hide()
  posterSongInfoInput.hide()
  commentNameInput.hide();
  formatToggleButton.hide()


  // Hide poster zoom buttons by default (shown only in poster mode)
  if (!posterMode.active) {
    posterzoomedplaybutton.hide()
    posterzoomedsavebutton.hide()
    commentInput.hide()
    commentSubmitButton.hide()
    descriptionDisplay.hide()
  }

  image(locationscreen,0,0)

  // Create array of indices based on actual poster count
  let indices = [];
  for (let i = 0; i < postersLocation.length && i < locationposterPositions.length; i++) {
    indices.push(i);
  }

  // Sort by z-order
  let sortedIndices = indices.sort((a, b) => {
    return locationposterPositions[a].z - locationposterPositions[b].z;
  });

  // Draw all location posters
  push()
  for (let i of sortedIndices) {
    let posterPos = locationposterPositions[i];
    if (postersLocation[i]) {
      image(postersLocation[i], posterPos.x, posterPos.y, posterPos.w, posterPos.h);
    }
  }
  pop()

  // Poster zoom mode
  if (posterMode.active) {
    loginnavbutton.hide()
    randomnavbutton.hide()
    locationnavbutton.hide()

    posterMode.fadeIn = lerp(posterMode.fadeIn, 1, 0.15);

    // Semi-transparent background
    fill(0, 0, 0, 200 * posterMode.fadeIn);
    rect(0, 0, width, height);

    // Zoomed poster
    push();
    translate(width/2, height/2);
    scale(posterMode.fadeIn);

    //zoom/pan
    translate(panX, panY);
    scale(zoomLevel);

    imageMode(CENTER);

    let poster = postersLocation[posterMode.posterID];

    if (!poster) {
      console.error('Poster failed to load');
      posterMode.active = false;
      descriptionDisplay.hide();
      if (siteState === 'userScreen') {
        usercustomizebutton.show();
      }
      return;
    }

    let maxzoommodeWidth = 750;
    let maxzoommodeHeight = 1100;
    let aspectRatio = poster.width / poster.height;

    let displayWidth, displayHeight;

    if (aspectRatio > maxzoommodeWidth / maxzoommodeHeight) {
      displayWidth = maxzoommodeWidth;
      displayHeight = maxzoommodeWidth / aspectRatio;
    } else {
      displayHeight = maxzoommodeHeight;
      displayWidth = maxzoommodeHeight * aspectRatio;
    }

    image(poster, 0, 0, displayWidth, displayHeight);

    pop();

    // Close button
    push()
    image(xpcloseicon, 50, 50, 75, 75)
    pop()

    // Artist name panel (top)
    push()
    if (locationPosterMetadata[posterMode.posterID]) {
      let artistName = locationPosterMetadata[posterMode.posterID].artistName || 'Untitled';

      // Calculate text width and adjust size if needed
      textFont(highlightpagetitlefont)
      let fontSize = 45;
      textSize(fontSize);
      let nameWidth = textWidth(artistName);

      // Maximum width available (canvas width minus padding for close button and margins)
      let maxWidth = 1440 - 200 - 100; // Leave space for close button (150px) and margins

      // Shrink text if it's too wide
      while (nameWidth > maxWidth - 40 && fontSize > 20) {
        fontSize -= 2;
        textSize(fontSize);
        nameWidth = textWidth(artistName);
      }

      // Calculate panel width based on text (with padding)
      let panelWidth = min(max(450, nameWidth + 80), maxWidth);
      let panelX = (1440 - panelWidth) / 2; // Center the panel

      // Draw background panel
      fill(255, 255, 255, 200)
      rect(panelX, 20, panelWidth, 100)

      // Draw text
      fill(0)
      textSize(fontSize)
      textAlign(CENTER, CENTER)
      text(artistName, 1440 / 2, 70)
    }
    pop()

    // description/links panel (left panel)
    push()
    fill(255,255,255, 200)
    rect(50,200,400,500)
    pop()

    // Display rich text description using HTML element
    if (locationPosterMetadata[posterMode.posterID]) {
      descriptionDisplay.html(locationPosterMetadata[posterMode.posterID].description || '');
      descriptionDisplay.show();
    } else {
      descriptionDisplay.hide();
    }

    // comments section
    push()
    fill(255,255,255, 200)
    rect(1050, 350, 350, 600)

    if (locationPosterMetadata[posterMode.posterID] && locationPosterMetadata[posterMode.posterID].comments) {
      fill(0)
      textFont(posterinfoFont)
      textSize(14)
      textAlign(LEFT, TOP)

      let yOffset = 370;
      let comments = locationPosterMetadata[posterMode.posterID].comments;

      let startIdx = max(0, comments.length - 10);
      for (let i = startIdx; i < comments.length; i++) {
        let comment = comments[i];
        if (yOffset < 900) {
          fill(100)
          textSize(14)
          text(comment.username + ' • ' + new Date(comment.timestamp).toLocaleDateString(), 1070, yOffset)
          yOffset += 20;

          fill(0)
          textSize(16)
          text(comment.text, 1070, yOffset, 310, 60)
          yOffset += 60;
        }
      }
    }
    pop()

    // Show comment input
    commentNameInput.show();
    commentInput.show();
    commentSubmitButton.show();

    // Save button (bottom left, always visible when viewing poster)
    posterzoomedsavebutton.position(50, height - 80);
    posterzoomedsavebutton.show();

    // Mini player (only show if poster has audio)
    if (locationPosterAudio[posterMode.posterID] && locationPosterAlbumArt[posterMode.posterID]) {
      let playerY = height - 150;
      let playerX = width / 2;

      // Background panel
      push();
      fill(0, 0, 0, 180);
      stroke(255, 255, 255, 200);
      strokeWeight(2);
      rectMode(CENTER);
      rect(playerX, playerY, 400, 120, 10);
      pop();

      // Album art thumbnail
      push();
      imageMode(CENTER);
      image(locationPosterAlbumArt[posterMode.posterID], playerX - 130, playerY, 80, 80);
      pop();

      // Song info text
      push();
      fill(255);
      textFont(posterinfoFont);
      textAlign(LEFT, CENTER);
      textSize(20);
      let songDisplay = locationPosterMetadata[posterMode.posterID]?.songInfo || locationPosterAudioNames[posterMode.posterID] || 'Unknown Track';
      text(songDisplay, playerX - 80, playerY - 20);
      pop();

      // Update button text and position
      if (currentPosterAudio && currentPosterAudio.isPlaying()) {
        posterzoomedplaybutton.html('Pause');
      } else {
        posterzoomedplaybutton.html('Play');
      }
      posterzoomedplaybutton.position(playerX - 40, playerY + 20);
      posterzoomedplaybutton.show();
    } else {
      posterzoomedplaybutton.hide();
    }

  } else {
    posterMode.fadeIn = lerp(posterMode.fadeIn, 0, 0.15);
    loginnavbutton.show()
    randomnavbutton.show()
    locationnavbutton.show()
    posterzoomedplaybutton.hide()
    posterzoomedsavebutton.hide()
    commentInput.hide()
    commentSubmitButton.hide()
  }

}


function mousePressed() {
  // Block mouse interaction if flag is set (e.g., after alert dialog)
  if (blockMouseInteraction) {
    blockMouseInteraction = false;
    return;
  }

  // Allow clicks on description display to pass through (for links)
  if (descriptionDisplay && descriptionDisplay.elt.style.display !== 'none') {
    let descX = 70;
    let descY = 220;
    let descW = 360;
    let descH = 460;
    if (mouseX > descX && mouseX < descX + descW &&
        mouseY > descY && mouseY < descY + descH) {
      console.log('Click on description area - allowing event to pass through');
      return; // Let the HTML element handle it
    }
  }

 if (siteState === 'userScreen' || siteState === 'randomPosterScreen' || siteState === 'locationScreen') {
    if (posterMode.active) {
      // Check if close button was clicked
      let closeX = 50;
      let closeY = 50;
      let closeWidth = 100;
      let closeHeight = 100;

      if (mouseX > closeX && mouseX < closeX + closeWidth &&
          mouseY > closeY && mouseY < closeY + closeHeight) {
        // Close button clicked
        posterMode.active = false;
        descriptionDisplay.hide();
        stopPosterAudio();
        resetZoom();

        // If in random poster screen, go back to user screen
        if (siteState === 'randomPosterScreen') {
          siteState = 'userScreen';
        }

        // Show customize button if on user screen
        if (siteState === 'userScreen') {
          usercustomizebutton.show();
        }
        return;
      }

      // Start dragging for pan
      isDragging = true;
      dragStartX = mouseX - panX;
      dragStartY = mouseY - panY;
    } else {
      // Check for GIF clicks on user screen (only when not in poster mode)
      if (siteState === 'userScreen' && userDecorativeGifs.length > 0) {
        let handleSize = 12;

        // First check if clicking on resize handles of selected GIF
        if (selectedUserGif !== null && userDecorativeGifs[selectedUserGif]) {
          let item = userDecorativeGifs[selectedUserGif];

          // Check bottom-right handle
          if (mouseX > item.x + item.w - handleSize && mouseX < item.x + item.w + handleSize &&
              mouseY > item.y + item.h - handleSize && mouseY < item.y + item.h + handleSize) {
            resizingUserGif = 'bottomRight';
            resizeStartMouseX = mouseX;
            resizeStartMouseY = mouseY;
            resizeStartW = item.w;
            resizeStartH = item.h;
            return;
          }
          // Check bottom-left handle
          if (mouseX > item.x - handleSize && mouseX < item.x + handleSize &&
              mouseY > item.y + item.h - handleSize && mouseY < item.y + item.h + handleSize) {
            resizingUserGif = 'bottomLeft';
            resizeStartMouseX = mouseX;
            resizeStartMouseY = mouseY;
            resizeStartW = item.w;
            resizeStartH = item.h;
            return;
          }
          // Check top-right handle
          if (mouseX > item.x + item.w - handleSize && mouseX < item.x + item.w + handleSize &&
              mouseY > item.y - handleSize && mouseY < item.y + handleSize) {
            resizingUserGif = 'topRight';
            resizeStartMouseX = mouseX;
            resizeStartMouseY = mouseY;
            resizeStartW = item.w;
            resizeStartH = item.h;
            return;
          }
          // Check top-left handle
          if (mouseX > item.x - handleSize && mouseX < item.x + handleSize &&
              mouseY > item.y - handleSize && mouseY < item.y + handleSize) {
            resizingUserGif = 'topLeft';
            resizeStartMouseX = mouseX;
            resizeStartMouseY = mouseY;
            resizeStartW = item.w;
            resizeStartH = item.h;
            return;
          }
        }

        // Check in reverse z-order (top to bottom) for GIF selection
        let sortedIndices = [...Array(userDecorativeGifs.length).keys()].sort((a, b) => {
          return userDecorativeGifs[b].z - userDecorativeGifs[a].z;
        });

        for (let i of sortedIndices) {
          let item = userDecorativeGifs[i];
          if (mouseX > item.x && mouseX < item.x + item.w &&
              mouseY > item.y && mouseY < item.y + item.h) {

            // Right-click to delete
            if (mouseButton === RIGHT) {
              userDecorativeGifs.splice(i, 1);
              saveUserGifs();
              selectedUserGif = null;
              return; // Don't check posters
            }

            // Left-click to select and drag
            selectedUserGif = i;
            draggingUserGif = true;
            dragOffsetX = mouseX - item.x;
            dragOffsetY = mouseY - item.y;

            // Bring to front
            let maxZ = Math.max(...userDecorativeGifs.map(g => g.z));
            userDecorativeGifs[i].z = maxZ + 1;
            return; // Don't check posters if we clicked a GIF
          }
        }

        // Clicked outside any GIF - deselect
        selectedUserGif = null;
      }

      // Check poster clicks
      if (siteState === 'locationScreen') {
        // Location screen: check location posters
        for (let i = 0; i < postersLocation.length; i++) {
          let pos = locationposterPositions[i];
          if (pos && mouseX > pos.x && mouseX < pos.x + pos.w &&
              mouseY > pos.y && mouseY < pos.y + pos.h) {
            // Bring to front
            let maxZ = Math.max(...locationposterPositions.map(p => p.z));
            locationposterPositions[i].z = maxZ + 1;
            // Start dragging this location poster
            draggingLocationPoster = i;
            dragOffsetX = mouseX - pos.x;
            dragOffsetY = mouseY - pos.y;
            break;
          }
        }
      } else {
        // User screen or random screen: check user posters
        for (let i = 0; i < postersuser.length; i++) {
          let pos = posterPositions[i];
          if (pos && mouseX > pos.x && mouseX < pos.x + pos.w &&
              mouseY > pos.y && mouseY < pos.y + pos.h) {
            // Bring to front
            let maxZ = Math.max(...posterPositions.map(p => p.z));
            posterPositions[i].z = maxZ + 1;
            // Start dragging this poster (only on user screen)
            if (siteState === 'userScreen') {
              draggingPoster = i;
              dragOffsetX = mouseX - pos.x;
              dragOffsetY = mouseY - pos.y;
            }
            break;
          }
        }
      }
    }
  } else if (siteState === 'artistScreen') {
    // Check if delete button was clicked for artist audio/album art
    if (artistAudioFile !== null && artistAlbumArt !== null) {
      let musicZoneX = 955;
      let musicZoneY = 640;

      // Check "Delete All" button
      if (mouseX > musicZoneX + 10 && mouseX < musicZoneX + 90 &&
          mouseY > musicZoneY + 10 && mouseY < musicZoneY + 40) {
        // Delete artist audio and album art
        if (artistAudioFile) {
          artistAudioFile.stop();
        }
        artistAudioFile = null;
        artistAlbumArt = null;
        artistAudioFileName = '';
        isArtistAudioPlaying = false;
        localStorage.removeItem('artistAudioData');
        localStorage.removeItem('artistAlbumArt');
        console.log('Artist audio and album art deleted');
        return;
      }

      // Check "Delete Art" button (only remove album art)
      if (mouseX > musicZoneX + 100 && mouseX < musicZoneX + 200 &&
          mouseY > musicZoneY + 10 && mouseY < musicZoneY + 40) {
        // Delete only album art, keep audio
        artistAlbumArt = null;
        localStorage.removeItem('artistAlbumArt');
        console.log('Artist album art deleted');
        return;
      }
    }

    // Check if delete button was clicked for base image
    if (basePosterImage !== null) {
      if (mouseX > 255 && mouseX < 335 && mouseY > 250 && mouseY < 280) {
        // Delete base image
        basePosterImage = null;
        localStorage.removeItem('basePosterImage');
        // Also clear decorative images
        bandUploadedImages = [];
        localStorage.removeItem('bandUploadedImages');
        return;
      }
    }

    // Handle clicking on decorative images on artist screen
    if (basePosterImage !== null && bandUploadedImages.length > 0) {
      let handleSize = 12;
      let clickedOnHandle = false;

      // First check if clicking on a resize handle of selected image
      if (selectedDecorativeImage !== null && bandUploadedImages[selectedDecorativeImage]) {
        let item = bandUploadedImages[selectedDecorativeImage];

        // Check each corner handle
        if (mouseX > item.x - handleSize/2 && mouseX < item.x + handleSize/2 &&
            mouseY > item.y - handleSize/2 && mouseY < item.y + handleSize/2) {
          // Top-left handle
          resizingHandle = 'topLeft';
          clickedOnHandle = true;
        } else if (mouseX > item.x + item.w - handleSize/2 && mouseX < item.x + item.w + handleSize/2 &&
                   mouseY > item.y - handleSize/2 && mouseY < item.y + handleSize/2) {
          // Top-right handle
          resizingHandle = 'topRight';
          clickedOnHandle = true;
        } else if (mouseX > item.x - handleSize/2 && mouseX < item.x + handleSize/2 &&
                   mouseY > item.y + item.h - handleSize/2 && mouseY < item.y + item.h + handleSize/2) {
          // Bottom-left handle
          resizingHandle = 'bottomLeft';
          clickedOnHandle = true;
        } else if (mouseX > item.x + item.w - handleSize/2 && mouseX < item.x + item.w + handleSize/2 &&
                   mouseY > item.y + item.h - handleSize/2 && mouseY < item.y + item.h + handleSize/2) {
          // Bottom-right handle
          resizingHandle = 'bottomRight';
          clickedOnHandle = true;
        }

        if (clickedOnHandle) {
          resizeStartW = item.w;
          resizeStartH = item.h;
          resizeStartMouseX = mouseX;
          resizeStartMouseY = mouseY;
          return;
        }
      }

      // If not clicking on handle, check if clicking on an image
      let clickedOnImage = false;
      let sortedIndices = [...Array(bandUploadedImages.length).keys()].sort((a, b) => {
        return bandUploadedImages[b].z - bandUploadedImages[a].z;
      });

      for (let i of sortedIndices) {
        let item = bandUploadedImages[i];
        if (mouseX > item.x && mouseX < item.x + item.w &&
            mouseY > item.y && mouseY < item.y + item.h) {
          // Bring to front
          let maxZ = Math.max(...bandUploadedImages.map(img => img.z));
          bandUploadedImages[i].z = maxZ + 1;
          // Select and start dragging this decorative image
          selectedDecorativeImage = i;
          draggingDecorativeImage = i;
          dragOffsetX = mouseX - item.x;
          dragOffsetY = mouseY - item.y;
          clickedOnImage = true;
          break;
        }
      }

      // If clicked outside all images, deselect
      if (!clickedOnImage && !clickedOnHandle) {
        selectedDecorativeImage = null;
      }
    } else {
      // No images, clear selection
      selectedDecorativeImage = null;
    }
  }
}

function mouseWheel(event) {
  // Only zoom when poster is showing
  if (posterMode.active) {
    let zoomSensitivity = 0.1;
    zoomLevel -= event.delta * 0.001 * zoomSensitivity;
    zoomLevel = constrain(zoomLevel, minZoom, maxZoom);
    return false; // Prevent default scrolling
  }
}

function mouseDragged() {
 if (siteState === 'userScreen' || siteState === 'randomPosterScreen' || siteState === 'locationScreen') {
    if (posterMode.active && isDragging) {
      // Pan zoomed poster
      panX = mouseX - dragStartX;
      panY = mouseY - dragStartY;
    } else if (resizingUserGif !== null && selectedUserGif !== null && siteState === 'userScreen') {
      // Resize the selected GIF on user screen
      let item = userDecorativeGifs[selectedUserGif];
      let deltaX = mouseX - resizeStartMouseX;
      let deltaY = mouseY - resizeStartMouseY;
      let minSize = 30; // Minimum width/height

      if (resizingUserGif === 'bottomRight') {
        let newW = resizeStartW + deltaX;
        let newH = resizeStartH + deltaY;
        let avgScale = (newW / resizeStartW + newH / resizeStartH) / 2;
        newW = resizeStartW * avgScale;
        newH = resizeStartH * avgScale;

        if (newW > minSize && newH > minSize) {
          item.w = newW;
          item.h = newH;
        }
      } else if (resizingUserGif === 'bottomLeft') {
        let newW = resizeStartW - deltaX;
        let newH = resizeStartH + deltaY;
        let avgScale = (newW / resizeStartW + newH / resizeStartH) / 2;
        newW = resizeStartW * avgScale;
        newH = resizeStartH * avgScale;

        if (newW > minSize && newH > minSize) {
          let newX = item.x + (resizeStartW - newW);
          item.x = newX;
          item.w = newW;
          item.h = newH;
        }
      } else if (resizingUserGif === 'topRight') {
        let newW = resizeStartW + deltaX;
        let newH = resizeStartH - deltaY;
        let avgScale = (newW / resizeStartW + newH / resizeStartH) / 2;
        newW = resizeStartW * avgScale;
        newH = resizeStartH * avgScale;

        if (newW > minSize && newH > minSize) {
          let newY = item.y + (resizeStartH - newH);
          item.y = newY;
          item.w = newW;
          item.h = newH;
        }
      } else if (resizingUserGif === 'topLeft') {
        let newW = resizeStartW - deltaX;
        let newH = resizeStartH - deltaY;
        let avgScale = (newW / resizeStartW + newH / resizeStartH) / 2;
        newW = resizeStartW * avgScale;
        newH = resizeStartH * avgScale;

        if (newW > minSize && newH > minSize) {
          let newX = item.x + (resizeStartW - newW);
          let newY = item.y + (resizeStartH - newH);
          item.x = newX;
          item.y = newY;
          item.w = newW;
          item.h = newH;
        }
      }
    } else if (draggingUserGif && selectedUserGif !== null && siteState === 'userScreen') {
      // Move GIF position on user screen
      userDecorativeGifs[selectedUserGif].x = mouseX - dragOffsetX;
      userDecorativeGifs[selectedUserGif].y = mouseY - dragOffsetY;
    } else if (draggingPoster !== null && siteState === 'userScreen') {
      // Move poster position (only in user screen)
      let newX = mouseX - dragOffsetX;
      let posterW = posterPositions[draggingPoster].w;
      posterPositions[draggingPoster].x = constrain(newX, 0, 1440 - posterW);
      posterPositions[draggingPoster].y = mouseY - dragOffsetY;
    } else if (draggingLocationPoster !== null && siteState === 'locationScreen') {
      // Move location poster position
      let newX = mouseX - dragOffsetX;
      let posterW = locationposterPositions[draggingLocationPoster].w;
      locationposterPositions[draggingLocationPoster].x = constrain(newX, 0, 1440 - posterW);
      locationposterPositions[draggingLocationPoster].y = mouseY - dragOffsetY;
    }
  } else if (siteState === 'artistScreen') {
    if (resizingHandle !== null && selectedDecorativeImage !== null) {
      // Resize the selected image
      let item = bandUploadedImages[selectedDecorativeImage];
      let deltaX = mouseX - resizeStartMouseX;
      let deltaY = mouseY - resizeStartMouseY;
      let minSize = 30; // Minimum width/height

      if (resizingHandle === 'bottomRight') {
        // Resize from bottom-right corner (most intuitive)
        let newW = resizeStartW + deltaX;
        let newH = resizeStartH + deltaY;

        // Maintain aspect ratio
        let avgScale = (newW / resizeStartW + newH / resizeStartH) / 2;
        newW = resizeStartW * avgScale;
        newH = resizeStartH * avgScale;

        // Apply minimum size
        if (newW > minSize && newH > minSize) {
          // Check bounds
          if (item.x + newW <= 850 && item.y + newH <= 1050) {
            item.w = newW;
            item.h = newH;
          }
        }
      } else if (resizingHandle === 'bottomLeft') {
        // Resize from bottom-left corner
        let newW = resizeStartW - deltaX;
        let newH = resizeStartH + deltaY;

        let avgScale = (newW / resizeStartW + newH / resizeStartH) / 2;
        newW = resizeStartW * avgScale;
        newH = resizeStartH * avgScale;

        if (newW > minSize && newH > minSize) {
          let newX = item.x + (resizeStartW - newW);
          if (newX >= 200 && item.y + newH <= 1050) {
            item.x = newX;
            item.w = newW;
            item.h = newH;
          }
        }
      } else if (resizingHandle === 'topRight') {
        // Resize from top-right corner
        let newW = resizeStartW + deltaX;
        let newH = resizeStartH - deltaY;

        let avgScale = (newW / resizeStartW + newH / resizeStartH) / 2;
        newW = resizeStartW * avgScale;
        newH = resizeStartH * avgScale;

        if (newW > minSize && newH > minSize) {
          let newY = item.y + (resizeStartH - newH);
          if (item.x + newW <= 850 && newY >= 175) {
            item.y = newY;
            item.w = newW;
            item.h = newH;
          }
        }
      } else if (resizingHandle === 'topLeft') {
        // Resize from top-left corner
        let newW = resizeStartW - deltaX;
        let newH = resizeStartH - deltaY;

        let avgScale = (newW / resizeStartW + newH / resizeStartH) / 2;
        newW = resizeStartW * avgScale;
        newH = resizeStartH * avgScale;

        if (newW > minSize && newH > minSize) {
          let newX = item.x + (resizeStartW - newW);
          let newY = item.y + (resizeStartH - newH);
          if (newX >= 200 && newY >= 175) {
            item.x = newX;
            item.y = newY;
            item.w = newW;
            item.h = newH;
          }
        }
      }
    } else if (draggingDecorativeImage !== null) {
      // Move decorative image, constrained to poster bounds
      let newX = mouseX - dragOffsetX;
      let newY = mouseY - dragOffsetY;

      // Constrain to poster rect (245, 240, 640, 810)
      let item = bandUploadedImages[draggingDecorativeImage];
      newX = constrain(newX, 245, 885 - item.w);
      newY = constrain(newY, 240, 1050 - item.h);

      bandUploadedImages[draggingDecorativeImage].x = newX;
      bandUploadedImages[draggingDecorativeImage].y = newY;
    }
  }
}

function mouseReleased() {
  if (draggingPoster !== null) {
    draggingPoster = null;
  }
  if (draggingLocationPoster !== null) {
    draggingLocationPoster = null;
  }
  if (draggingUserGif || resizingUserGif !== null) {
    // Save GIF positions/sizes when done dragging or resizing
    if (draggingUserGif || resizingUserGif !== null) {
      saveUserGifs();
    }
    draggingUserGif = false;
    resizingUserGif = null;
    // Keep selectedUserGif so handles stay visible
  }
  if (draggingDecorativeImage !== null || resizingHandle !== null) {
    // Save positions and sizes when done dragging or resizing
    saveUploadedImages();
    draggingDecorativeImage = null;
    resizingHandle = null;
  }
  isDragging = false;
}

function doubleClicked() {
  if ((siteState === 'userScreen' || siteState === 'locationScreen') && !posterMode.active) {
    if (siteState === 'locationScreen') {
      // Check which location poster was double-clicked
      for (let i = 0; i < postersLocation.length; i++) {
        let pos = locationposterPositions[i];
        if (pos && mouseX > pos.x && mouseX < pos.x + pos.w &&
            mouseY > pos.y && mouseY < pos.y + pos.h) {

          // Only open if poster loaded successfully
          if (postersLocation[i]) {
            posterMode.active = true;
            posterMode.posterID = i;
            usercustomizebutton.hide();

            // Auto-play audio if available
            if (locationPosterAudio[i]) {
              playLocationPosterAudio(i);
            }
          } else {
            console.error('Cannot open poster - failed to load');
          }
          break;
        }
      }
    } else {
      // User screen: check user posters
      for (let i = 0; i < postersuser.length; i++) {
        let pos = posterPositions[i];
        if (pos && mouseX > pos.x && mouseX < pos.x + pos.w &&
            mouseY > pos.y && mouseY < pos.y + pos.h) {

          // Only open if poster loaded successfully
          if (postersuser[i]) {
            posterMode.active = true;
            posterMode.posterID = i;
            usercustomizebutton.hide();

            // Auto-play audio if available
            if (posterAudio[i]) {
              playPosterAudio(i);
            }
          } else {
            console.error('Cannot open poster - failed to load');
          }
          break;
        }
      }
    }
  }
  return false; // Prevent default behavior
}

function resetZoom() {
  zoomLevel = 1.0;
  panX = 0;
  panY = 0;
}

function handleDragOver() {
  let musicZoneX = 955;
  let musicZoneY = 640;
  let musicZoneW = 425;
  let musicZoneH = 425;

  if (siteState === 'artistScreen' &&
      mouseX > musicZoneX && mouseX < musicZoneX + musicZoneW &&
      mouseY > musicZoneY && mouseY < musicZoneY + musicZoneH) {
    isArtistMusicZoneHighlighted = true;
    isHighlighted = false;
  } else {
    isHighlighted = true;
    isArtistMusicZoneHighlighted = false;
  }
}

function handleDragLeave() {
  isHighlighted = false;
  isArtistMusicZoneHighlighted = false;
}

function handleFileDrop(file) {
  let musicZoneX = 955;
  let musicZoneY = 640;
  let musicZoneW = 425;
  let musicZoneH = 425;

  let inMusicZone = (mouseX > musicZoneX && mouseX < musicZoneX + musicZoneW &&
                     mouseY > musicZoneY && mouseY < musicZoneY + musicZoneH &&
                     siteState === 'artistScreen');

  if (inMusicZone) {
    // Handle music zone drops
    if (file.type === 'audio') {
      // Use the native File object instead of file.data
      loadSound(file.file, sound => {
        artistAudioFile = sound;
        artistAudioFileName = file.name || 'Uploaded Audio';
        saveArtistAudio();
        console.log('Audio file loaded:', artistAudioFileName);
      }, error => {
        console.error('Error loading audio:', error);
        alert('Error loading audio file. Please try a different file.');
      });
      isArtistMusicZoneHighlighted = false;
    } else if (file.type === 'image' && artistAudioFile !== null) {
      loadImage(file.data, img => {
        artistAlbumArt = img;
        saveArtistAlbumArt();
        console.log('Album art loaded');
      });
      isArtistMusicZoneHighlighted = false;
    }
  } else if (file.type === 'image' && siteState === 'artistScreen') {
    // Handle poster zone image drops
    handleImageDrop(file);
  }
}

function handleImageDrop(file) {
  if (file.type === 'image') {
    loadImage(file.data, img => {
      // If no base image, this becomes the base poster
      if (basePosterImage === null) {
        // Calculate dimensions to fit in the poster rect with padding
        let posterWidth = 600;
        let posterHeight = 770;
        let aspectRatio = img.width / img.height;

        let displayW, displayH;
        if (aspectRatio > posterWidth / posterHeight) {
          // Image is wider - fit to width
          displayW = posterWidth;
          displayH = posterWidth / aspectRatio;
        } else {
          // Image is taller - fit to height
          displayH = posterHeight;
          displayW = posterHeight * aspectRatio;
        }

        basePosterImage = {
          img: img,
          x: 245,  // Position to match poster rect
          y: 240,
          w: displayW,
          h: displayH
        };
        saveBasePosterImage();
      } else {
        // Add as a draggable decorative image within poster bounds
        bandUploadedImages.push({
          img: img,
          x: random(220, 750),  // Constrain to poster area (200-850)
          y: random(200, 950),  // Constrain to poster area (175-1050)
          w: 150,
          h: 150,
          z: bandUploadedImages.length
        });
        saveUploadedImages();
      }
      isHighlighted = false;
    });
  }
}

function saveUploadedImages() {
  // Note: This works for small images only
  let imageData = [];
  for (let item of bandUploadedImages) {
    imageData.push({
      data: item.img.canvas.toDataURL(),
      x: item.x,
      y: item.y,
      w: item.w,
      h: item.h,
      z: item.z
    });
  }
  storeItem('bandUploadedImages', imageData);
}

function loadUploadedImages() {
  let saved = getItem('bandUploadedImages');
  if (saved) {
    for (let item of saved) {
      loadImage(item.data, img => {
        bandUploadedImages.push({
          img: img,
          x: item.x,
          y: item.y,
          w: item.w,
          h: item.h,
          z: item.z
        });
      });
    }
  }
}

function saveBasePosterImage() {
  if (basePosterImage !== null) {
    let baseData = {
      data: basePosterImage.img.canvas.toDataURL(),
      x: basePosterImage.x,
      y: basePosterImage.y,
      w: basePosterImage.w,
      h: basePosterImage.h
    };
    storeItem('basePosterImage', baseData);
  }
}

function loadBasePosterImage() {
  let saved = getItem('basePosterImage');
  if (saved) {
    loadImage(saved.data, img => {
      basePosterImage = {
        img: img,
        x: saved.x,
        y: saved.y,
        w: saved.w,
        h: saved.h
      };
    });
  }
}

// Artist audio save/load functions
function saveArtistAudio() {
  if (artistAudioFile !== null) {
    try {
      let audioData = {
        fileName: artistAudioFileName
      };
      storeItem('artistAudioData', audioData);
      console.log('Artist audio metadata saved');
    } catch (e) {
      console.warn('Could not save artist audio to localStorage:', e);
    }
  }
}

function loadArtistAudio() {
  let saved = getItem('artistAudioData');
  if (saved) {
    artistAudioFileName = saved.fileName || '';
    console.log('Artist audio filename loaded:', artistAudioFileName);
  }
}

function saveArtistAlbumArt() {
  if (artistAlbumArt !== null) {
    try {
      let artData = {
        data: artistAlbumArt.canvas.toDataURL(),
        w: artistAlbumArt.width,
        h: artistAlbumArt.height
      };
      storeItem('artistAlbumArt', artData);
      console.log('Artist album art saved');
    } catch (e) {
      console.warn('Could not save album art to localStorage:', e);
    }
  }
}

function loadArtistAlbumArt() {
  let saved = getItem('artistAlbumArt');
  if (saved) {
    loadImage(saved.data, img => {
      artistAlbumArt = img;
      console.log('Artist album art loaded');
    });
  }
}

// Load saved posters from IndexedDB
async function loadSavedPosters() {
  try {
    const savedPosters = await loadAllPosters();
    console.log('Loading', savedPosters.length, 'saved posters');

    if (savedPosters.length === 0) {
      console.log('No saved posters to load');
      return;
    }

    // Load posters one at a time with error handling
    for (let i = 0; i < savedPosters.length; i++) {
      const posterData = savedPosters[i];
      console.log(`Loading poster ${i + 1}/${savedPosters.length}`);

      try {
        // Load poster image
        let imageDataURL = await blobToDataURL(posterData.imageBlob);
        let posterImg = await new Promise((resolve, reject) => {
          setTimeout(() => {
            loadImage(imageDataURL, resolve, (err) => {
              console.error('Failed to load poster image:', err);
              reject(err);
            });
          }, 100); // Small delay to prevent overwhelming browser
        });

        postersuser.push(posterImg);

        // Add position data
        let maxH = 500;
        let aspectRatio = posterData.width / posterData.height;
        let w = maxH * aspectRatio;

        posterPositions.push({
          x: random(510, 1200),
          y: random(200, 450),
          w: w,
          h: maxH,
          z: posterPositions.length
        });

        // Load audio using data URL (more reliable than File object)
        let audioDataURL = await blobToDataURL(posterData.audioBlob);
        let audioSound = await new Promise((resolve) => {
          setTimeout(() => {
            loadSound(audioDataURL, (sound) => {
              resolve(sound);
            }, () => {
              console.warn('Failed to load audio for poster', i + 1, '- audio will not be available');
              resolve(null); // Resolve with null instead of rejecting
            });
          }, 150); // Slightly longer delay for audio
        });

        posterAudio.push(audioSound);
        posterAudioNames.push(posterData.audioFileName);

        // Load album art with delay
        let albumArtDataURL = await blobToDataURL(posterData.albumArtBlob);
        let albumImg = await new Promise((resolve, reject) => {
          setTimeout(() => {
            loadImage(albumArtDataURL, resolve, (err) => {
              console.error('Failed to load album art:', err);
              reject(err);
            });
          }, 100);
        });

        posterAlbumArt.push(albumImg);

        // Load metadata
        posterMetadata.push(posterData.metadata || { artistName: '', description: '', songInfo: '', comments: [] });

        console.log(`Poster ${i + 1} loaded successfully`);

        // Clear data URLs from memory to prevent Safari memory issues
        imageDataURL = null;
        audioDataURL = null;
        albumArtDataURL = null;

      } catch (err) {
        console.error(`Error loading poster ${i + 1}:`, err);
        // Add placeholders to keep arrays in sync
        postersuser.push(null);
        posterAudio.push(null);
        posterAlbumArt.push(null);
        posterAudioNames.push('Error loading');
        posterMetadata.push({ artistName: '', description: '', songInfo: '', comments: [] });
      }
    }

    console.log('Finished loading all posters');
    console.log('Total posters:', postersuser.length);
    console.log('Total audio tracks:', posterAudio.length);
  } catch (error) {
    console.error('Error in loadSavedPosters:', error);
  }
}

// Flatten poster: creates an offscreen canvas with the complete poster
function flattenPoster() {
  if (basePosterImage === null) {
    console.log('No base poster image to flatten');
    return null;
  }

  // Create offscreen graphics buffer with poster dimensions
  let posterWidth = 650;
  let posterHeight = 875;
  let pg = createGraphics(posterWidth, posterHeight);

  // Draw base image centered on the canvas
  pg.push();
  let centerX = posterWidth/2 - basePosterImage.w/2;
  let centerY = posterHeight/2 - basePosterImage.h/2;
  pg.image(basePosterImage.img, centerX, centerY, basePosterImage.w, basePosterImage.h);
  pg.pop();

  // Draw decorative images in z-order
  if (bandUploadedImages.length > 0) {
    let sortedIndices = [...Array(bandUploadedImages.length).keys()].sort((a, b) => {
      return bandUploadedImages[a].z - bandUploadedImages[b].z;
    });

    for (let i of sortedIndices) {
      let item = bandUploadedImages[i];
      // Translate positions from canvas coordinates to poster coordinates
      let relativeX = item.x - 200;
      let relativeY = item.y - 175;
      pg.image(item.img, relativeX, relativeY, item.w, item.h);
    }
  }

  return pg;
}

// Export poster to JPG and add to postersuser array
async function exportPosterToJPG() {
  let flattenedPoster = flattenPoster();

  if (flattenedPoster === null) {
    alert('Cannot export: No poster to export!');
    return;
  }

  // Check that audio and album art exist
  if (!artistAudioFile || !artistAlbumArt) {
    alert('Cannot export: Please upload both audio file and album art first!');
    return;
  }

  // Convert the graphics buffer to an image
  flattenedPoster.loadPixels();

  // Create a p5.Image from the graphics buffer
  let posterImage = createImage(flattenedPoster.width, flattenedPoster.height);
  posterImage.copy(flattenedPoster, 0, 0, flattenedPoster.width, flattenedPoster.height,
                   0, 0, flattenedPoster.width, flattenedPoster.height);

  // Convert poster canvas to Blob
  let posterBlob = await canvasToBlob(flattenedPoster.canvas);

  // Convert audio file to Blob (already a Blob from the File object)
  let audioBlob = artistAudioFile.file;

  // Convert album art to Blob
  // Create a temporary canvas for the album art
  let tempCanvas = document.createElement('canvas');
  tempCanvas.width = artistAlbumArt.width;
  tempCanvas.height = artistAlbumArt.height;
  let tempCtx = tempCanvas.getContext('2d');
  tempCtx.drawImage(artistAlbumArt.canvas, 0, 0);
  let albumArtBlob = await canvasToBlob(tempCanvas);

  // Get metadata from input fields
  let artistName = posterTitleInput.value();
  let description = posterDescriptionEditor ? posterDescriptionEditor.root.innerHTML : '';
  let songInfo = posterSongInfoInput.value();

  // Save to IndexedDB
  try {
    await savePoster(
      posterBlob,
      flattenedPoster.width,
      flattenedPoster.height,
      audioBlob,
      artistAudioFileName,
      albumArtBlob,
      { artistName, description, songInfo }  // Add metadata as 7th parameter
    );

    // Add to location posters array
    postersLocation.push(posterImage);

    // Add audio to parallel arrays
    locationPosterAudio.push(artistAudioFile);
    locationPosterAlbumArt.push(artistAlbumArt);
    locationPosterAudioNames.push(artistAudioFileName);

    // Add metadata to parallel array
    locationPosterMetadata.push({
      artistName: artistName,
      description: description,
      songInfo: songInfo,
      comments: []
    });

    // Add position data for the new poster
    let maxH = 500;
    let aspectRatio = posterImage.width / posterImage.height;
    let w = maxH * aspectRatio;

    locationposterPositions.push({
      x: random(510, 1200),
      y: random(200, 450),
      w: w,
      h: maxH,
      z: locationposterPositions.length
    });

    console.log('Poster exported! Total location posters:', postersLocation.length);
    alert('Poster exported successfully with audio!');

    // Clear artist workspace
    basePosterImage = null;
    bandUploadedImages = [];
    artistAudioFile = null;
    artistAlbumArt = null;
    artistAudioFileName = '';
    posterTitleInput.value('');
    posterDescriptionInput.value('');
    posterSongInfoInput.value('');

    // Clear the Quill editor content
    if (posterDescriptionEditor) {
      posterDescriptionEditor.setText('');
    }

    await clearArtistData();

  } catch (error) {
    console.error('Error exporting poster:', error);
    alert('Error exporting poster. Please try again.');
  }
}

function usermusicPlay(){
  if (posterAudio[currentuserTrack]){
    // Only play if not already playing
    if (!posterAudio[currentuserTrack].isPlaying()) {
      posterAudio[currentuserTrack].play()
      isuserPlayback = true
    }
  }
}

function usermusicPause(){
  if (posterAudio[currentuserTrack]){
    posterAudio[currentuserTrack].pause()
    isuserPlayback = false
  }
}

function usermusicNext(){
  if (isuserPlayback && posterAudio[currentuserTrack]){
    posterAudio[currentuserTrack].stop()
  }

  // Find next poster with audio
  let startIndex = currentuserTrack
  do {
    currentuserTrack = (currentuserTrack + 1) % postersuser.length
  } while (!posterAudio[currentuserTrack] && currentuserTrack !== startIndex)

  usermusicPlay()
  }

function usermusicPrevious(){
   if (isuserPlayback && posterAudio[currentuserTrack]){
    posterAudio[currentuserTrack].stop()
  }

  // Find previous poster with audio
  let startIndex = currentuserTrack
  do {
    currentuserTrack = (currentuserTrack - 1 + postersuser.length) % postersuser.length
  } while (!posterAudio[currentuserTrack] && currentuserTrack !== startIndex)

  usermusicPlay()
  }

// Artist audio playback functions
function artistMusicPlay(){
  if (artistAudioFile){
    artistAudioFile.play()
    isArtistAudioPlaying = true
  }
}

function artistMusicStop(){
  if (artistAudioFile){
    artistAudioFile.stop()
    isArtistAudioPlaying = false
  }
}

// Format toolbar toggle function
function toggleFormatToolbar() {
  // Get toolbar reference if we don't have it yet
  if (!quillToolbar) {
    quillToolbar = document.querySelector('.ql-toolbar.ql-snow');
  }

  if (!quillToolbar) {
    console.log('Toolbar not found!');
    return;
  }

  // Check if there's an existing visible toolbar in the DOM (from previous session)
  if (!visibleToolbar) {
    visibleToolbar = document.getElementById('visible-toolbar');
  }

  // If old toolbar exists, remove it so we can recreate with new position
  if (visibleToolbar) {
    visibleToolbar.remove();
    visibleToolbar = null;
  }

  // Create visible toolbar
  if (!visibleToolbar && quillToolbar) {
    visibleToolbar = document.createElement('div');
    visibleToolbar.id = 'visible-toolbar';
    visibleToolbar.className = 'ql-toolbar ql-snow';
    visibleToolbar.innerHTML = quillToolbar.innerHTML;
    visibleToolbar.style.position = 'fixed';
    visibleToolbar.style.left = '935px';
    visibleToolbar.style.top = '220px';
    visibleToolbar.style.zIndex = '2147483647';
    visibleToolbar.style.display = 'none';
    visibleToolbar.style.background = '#f3f3f3';
    visibleToolbar.style.borderRadius = '10px';
    visibleToolbar.style.padding = '5px';
    visibleToolbar.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
    visibleToolbar.style.border = '1px solid #ccc';
    document.body.appendChild(visibleToolbar);

    // Set up click handlers for the toolbar buttons
    const buttons = visibleToolbar.querySelectorAll('button');
    buttons.forEach(button => {
      button.addEventListener('click', function(e) {
        // Trigger the same action on the original hidden toolbar
        const originalButton = quillToolbar.querySelector(`button.${button.className.replace(/ /g, '.')}`);
        if (originalButton) {
          originalButton.click();
        }
      });
    });

    // Set up handlers for picker dropdowns (size, color, alignment, etc.)
    const pickers = visibleToolbar.querySelectorAll('.ql-picker');
    pickers.forEach(picker => {
      const label = picker.querySelector('.ql-picker-label');
      if (label) {
        label.addEventListener('click', function(e) {
          e.stopPropagation();
          // Toggle expanded state on the visible picker
          if (picker.classList.contains('ql-expanded')) {
            picker.classList.remove('ql-expanded');
          } else {
            // Close all other pickers first
            visibleToolbar.querySelectorAll('.ql-picker').forEach(p => {
              p.classList.remove('ql-expanded');
            });
            picker.classList.add('ql-expanded');
          }
        });
      }

      // Set up handlers for picker options
      const options = picker.querySelectorAll('.ql-picker-item');
      options.forEach(option => {
        option.addEventListener('click', function(e) {
          e.stopPropagation();

          // Find corresponding option in original toolbar
          const pickerClasses = Array.from(picker.classList).filter(c => c !== 'ql-picker' && c !== 'ql-expanded').join('.');
          const originalPicker = quillToolbar.querySelector(`.ql-picker.${pickerClasses}`);

          if (originalPicker) {
            const optionValue = option.getAttribute('data-value');
            let originalOption;
            if (optionValue) {
              originalOption = originalPicker.querySelector(`.ql-picker-item[data-value="${optionValue}"]`);
            } else {
              // For items without data-value, match by index
              const items = Array.from(picker.querySelectorAll('.ql-picker-item'));
              const index = items.indexOf(option);
              const originalItems = originalPicker.querySelectorAll('.ql-picker-item');
              originalOption = originalItems[index];
            }
            if (originalOption) {
              originalOption.click();
              picker.classList.remove('ql-expanded');
            }
          }
        });
      });
    });
  }

  // Toggle visibility
  if (visibleToolbar) {
    visibleToolbar.style.left = '935px';
    visibleToolbar.style.top = '655px';

    toolbarVisible = !toolbarVisible;
    if (toolbarVisible) {
      visibleToolbar.style.display = 'block';
      formatToggleButton.html('hide format');
    } else {
      visibleToolbar.style.display = 'none';
      formatToggleButton.html('format');
    }
  }
}

// User page customization functions
function toggleCustomizePanel() {
  customizePanelVisible = !customizePanelVisible;

  if (customizePanelVisible) {
    backgroundUploadButton.show();
    nameBarColorPicker.show();
    albumArtColorPicker.show();
    songNameColorPicker.show();
    gifUploadButton.show();
  } else {
    backgroundUploadButton.hide();
    nameBarColorPicker.hide();
    albumArtColorPicker.hide();
    songNameColorPicker.hide();
    gifUploadButton.hide();
  }
}

function closeCustomizePanel() {
  if (customizePanelVisible) {
    customizePanelVisible = false;
    backgroundUploadButton.hide();
    nameBarColorPicker.hide();
    albumArtColorPicker.hide();
    songNameColorPicker.hide();
    gifUploadButton.hide();
  }
}

function handleBackgroundUpload(file) {
  if (file.type === 'image') {
    loadImage(file.data, async img => {
      userCustomBackground = img;

      // Convert to blob and save to IndexedDB instead of localStorage
      let tempCanvas = document.createElement('canvas');
      tempCanvas.width = img.width;
      tempCanvas.height = img.height;
      let tempCtx = tempCanvas.getContext('2d');
      tempCtx.drawImage(img.canvas, 0, 0);

      try {
        let blob = await canvasToBlob(tempCanvas);
        await saveUserBackground(blob);
        console.log('Background saved to IndexedDB');
      } catch (error) {
        console.error('Error saving background:', error);
        if (error.message === 'Database not upgraded yet') {
          alert('Database needs to be upgraded. Please reload the page (Cmd+R or Ctrl+R) and try again.');
        } else {
          alert('Error saving background image');
        }
      }

      // Still save color settings to localStorage (small data)
      saveUserCustomization();
    });
  }
}

function handleGifUpload(file) {
  if (file.type === 'image') {
    loadImage(file.data, async img => {
      // Add GIF/image to user page decorative elements
      let gifData = {
        img: img,
        x: random(500, 1200),  // Random position on user page
        y: random(200, 800),
        w: 150,  // Default width
        h: 150,  // Default height
        z: userDecorativeGifs.length  // Z-index for layering
      };

      userDecorativeGifs.push(gifData);
      await saveUserGifs();
    });
  }
}

function saveUserCustomization() {
  // Background image is now saved to IndexedDB in handleBackgroundUpload
  // Only save color settings to localStorage (small data)
  storeItem('userNameBarColor', JSON.stringify(userNameBarColor));
  storeItem('userAlbumArtBackingColor', JSON.stringify(userAlbumArtBackingColor));
  storeItem('userSongNameBackingColor', JSON.stringify(userSongNameBackingColor));
}

async function loadUserCustomization() {
  // Load background image from IndexedDB
  try {
    let bgBlob = await loadUserBackground();
    if (bgBlob) {
      let dataURL = await blobToDataURL(bgBlob);
      loadImage(dataURL, img => {
        userCustomBackground = img;
      });
    }
  } catch (error) {
    console.error('Error loading background from IndexedDB:', error);
  }

  // Load color settings from localStorage
  let nameBarData = getItem('userNameBarColor');
  if (nameBarData) {
    userNameBarColor = JSON.parse(nameBarData);
    nameBarColorPicker.value(color(userNameBarColor.r, userNameBarColor.g, userNameBarColor.b));
  }

  let albumArtData = getItem('userAlbumArtBackingColor');
  if (albumArtData) {
    userAlbumArtBackingColor = JSON.parse(albumArtData);
    albumArtColorPicker.value(color(userAlbumArtBackingColor.r, userAlbumArtBackingColor.g, userAlbumArtBackingColor.b));
  }

  let songNameData = getItem('userSongNameBackingColor');
  if (songNameData) {
    userSongNameBackingColor = JSON.parse(songNameData);
    songNameColorPicker.value(color(userSongNameBackingColor.r, userSongNameBackingColor.g, userSongNameBackingColor.b));
  }
}

async function saveUserGifs() {
  try {
    let gifData = [];
    for (let item of userDecorativeGifs) {
      // Convert each GIF to a blob
      let tempCanvas = document.createElement('canvas');
      tempCanvas.width = item.img.width;
      tempCanvas.height = item.img.height;
      let tempCtx = tempCanvas.getContext('2d');
      tempCtx.drawImage(item.img.canvas, 0, 0);

      let blob = await canvasToBlob(tempCanvas);

      gifData.push({
        blob: blob,
        x: item.x,
        y: item.y,
        w: item.w,
        h: item.h,
        z: item.z
      });
    }

    await saveUserGifsDB(gifData);
    console.log('GIFs saved to IndexedDB');
  } catch (error) {
    console.error('Error saving GIFs:', error);
  }
}

async function loadUserGifs() {
  try {
    let saved = await loadUserGifsDB();
    if (saved && saved.length > 0) {
      for (let item of saved) {
        let dataURL = await blobToDataURL(item.blob);
        loadImage(dataURL, img => {
          userDecorativeGifs.push({
            img: img,
            x: item.x,
            y: item.y,
            w: item.w,
            h: item.h,
            z: item.z
          });
        });
      }
      console.log('Loaded', saved.length, 'GIFs from IndexedDB');
    }
  } catch (error) {
    console.error('Error loading GIFs:', error);
  }
}

// Comment system functions
function addComment() {
  if (!posterMode.active) return;

  let commentText = commentInput.value().trim();
  if (commentText === '') return;

  // Get name from input, default to 'Anonymous' if empty
  let userName = commentNameInput.value().trim();
  if (userName === '') {
    userName = 'Anonymous';
  }

  // Create comment object
  let newComment = {
    id: Date.now(),
    username: userName,
    text: commentText,
    timestamp: Date.now()
  };

  // Determine which metadata array to use based on current page
  let metadataArray;
  if (siteState === 'locationScreen') {
    metadataArray = locationPosterMetadata;
  } else {
    metadataArray = posterMetadata;
  }

  // Ensure metadata exists for this poster
  if (!metadataArray[posterMode.posterID]) {
    metadataArray[posterMode.posterID] = {
      title: '',
      artistName: '',
      description: '',
      comments: []
    };
  }

  // Add comment to metadata
  if (!metadataArray[posterMode.posterID].comments) {
    metadataArray[posterMode.posterID].comments = [];
  }
  metadataArray[posterMode.posterID].comments.push(newComment);

  // Clear inputs
  commentInput.value('');
  commentNameInput.value('');

  // Update poster in IndexedDB
  updatePosterInDB(posterMode.posterID);

  console.log('Comment added:', newComment);
}

async function updatePosterInDB(posterIndex) {
  // For posters loaded from IndexedDB, we need to update them
  // This requires getting the poster ID from IndexedDB
  // For now, comments will persist in memory during the session
  // and will be saved when the poster is re-exported
  console.log('Poster updated in memory. Comments will persist during session.');
}

// Save poster to user's collection
function savePosterToUser() {
  // Stop dragging and disable interactions temporarily
  draggingLocationPoster = null;
  draggingPoster = null;
  isDragging = false;

  if (!posterMode.active || posterMode.posterID === null) {
    console.log('No poster to save');
    return;
  }

  let posterIndex = posterMode.posterID;
  let poster, audio, albumArt, audioName, metadata;

  // Get poster data based on current screen
  if (siteState === 'locationScreen' || siteState === 'randomPosterScreen') {
    poster = postersLocation[posterIndex];
    audio = locationPosterAudio[posterIndex];
    albumArt = locationPosterAlbumArt[posterIndex];
    audioName = locationPosterAudioNames[posterIndex];
    metadata = locationPosterMetadata[posterIndex];
  } else {
    // User screen
    poster = postersuser[posterIndex];
    audio = posterAudio[posterIndex];
    albumArt = posterAlbumArt[posterIndex];
    audioName = posterAudioNames[posterIndex];
    metadata = posterMetadata[posterIndex];
  }

  // Check if this poster is already in the user's collection
  let alreadySaved = postersuser.includes(poster);

  if (alreadySaved) {
    blockMouseInteraction = true;
    alert('This poster is already in your collection!');
    return;
  }

  // Add to arrays
  postersuser.push(poster);
  posterAudio.push(audio);
  posterAlbumArt.push(albumArt);
  posterAudioNames.push(audioName);
  posterMetadata.push(metadata);

  // Add position for the new poster
  let maxH = 500;
  let aspectRatio = poster.width / poster.height;
  let w = maxH * aspectRatio;

  posterPositions.push({
    x: random(510, 1200),
    y: random(200, 450),
    w: w,
    h: maxH,
    z: posterPositions.length
  });

  console.log('Poster saved to collection!');
  blockMouseInteraction = true;
  alert('Poster saved to your collection!');
}

// Poster audio playback functions
function playPosterAudio(index) {
  // Stop any currently playing poster audio
  if (currentPosterAudio !== null && currentPosterAudio.isPlaying()) {
    currentPosterAudio.stop();
  }

  // Stop main user music player (if it exists and is playing)
  if (posterAudio[currentuserTrack] && posterAudio[currentuserTrack].isPlaying()) {
    posterAudio[currentuserTrack].stop();
  }

  // Play the poster's audio
  if (posterAudio[index]) {
    posterAudio[index].play();
    currentPosterAudio = posterAudio[index];
  }
}

function stopPosterAudio() {
  if (currentPosterAudio !== null) {
    if (currentPosterAudio.isPlaying()) {
      currentPosterAudio.stop();
    }
    currentPosterAudio = null;
  }
}

function pausePosterAudio() {
  if (currentPosterAudio !== null && currentPosterAudio.isPlaying()) {
    currentPosterAudio.pause();
  }
}

function togglePosterAudio() {
  // If no audio is set, try to play the current poster's audio
  if (currentPosterAudio === null && posterMode.active) {
    if (siteState === 'locationScreen' && locationPosterAudio[posterMode.posterID]) {
      playLocationPosterAudio(posterMode.posterID);
    } else if (posterAudio[posterMode.posterID]) {
      playPosterAudio(posterMode.posterID);
    }
  } else if (currentPosterAudio !== null) {
    if (currentPosterAudio.isPlaying()) {
      currentPosterAudio.pause();
    } else {
      currentPosterAudio.play();
    }
  }
}

// Location poster audio playback function
function playLocationPosterAudio(index) {
  // Stop any currently playing poster audio
  if (currentPosterAudio !== null && currentPosterAudio.isPlaying()) {
    currentPosterAudio.stop();
  }

  // Stop main user music player (if it exists and is playing)
  if (posterAudio[currentuserTrack] && posterAudio[currentuserTrack].isPlaying()) {
    posterAudio[currentuserTrack].stop();
  }

  // Play the location poster's audio
  if (locationPosterAudio[index]) {
    locationPosterAudio[index].play();
    currentPosterAudio = locationPosterAudio[index];
  }
}