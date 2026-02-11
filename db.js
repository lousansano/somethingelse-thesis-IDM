// IndexedDB wrapper for Poster Music App
// Handles storage of posters with audio, album art, and artist workspace data

let db = null;

// Initialize IndexedDB
async function initDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('PosterMusicApp', 2); // Increment version for new object store

    request.onerror = () => {
      console.error('IndexedDB failed to open');
      reject(request.error);
    };

    request.onsuccess = () => {
      db = request.result;
      console.log('IndexedDB opened successfully');
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      db = event.target.result;

      // Create posters object store
      if (!db.objectStoreNames.contains('posters')) {
        const posterStore = db.createObjectStore('posters', {
          keyPath: 'id',
          autoIncrement: true
        });
        console.log('Created posters object store');
      }

      // Create artistData object store
      if (!db.objectStoreNames.contains('artistData')) {
        const artistStore = db.createObjectStore('artistData', {
          keyPath: 'key'
        });
        console.log('Created artistData object store');
      }

      // Create userCustomization object store for backgrounds and decorative GIFs
      if (!db.objectStoreNames.contains('userCustomization')) {
        const userStore = db.createObjectStore('userCustomization', {
          keyPath: 'key'
        });
        console.log('Created userCustomization object store');
      }
    };
  });
}

// Save a poster with all its data
async function savePoster(imageBlob, width, height, audioBlob, audioFileName, albumArtBlob, metadata) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['posters'], 'readwrite');
    const store = transaction.objectStore('posters');

    const posterData = {
      imageBlob: imageBlob,
      width: width,
      height: height,
      audioBlob: audioBlob,
      audioFileName: audioFileName,
      albumArtBlob: albumArtBlob,
      metadata: metadata || { artistName: '', description: '', songInfo: '', comments: [] },
      createdAt: Date.now()
    };

    const request = store.add(posterData);

    request.onsuccess = () => {
      console.log('Poster saved with ID:', request.result);
      resolve(request.result);
    };

    request.onerror = () => {
      console.error('Error saving poster:', request.error);
      console.error('Full error details:', request.error);
      reject(request.error);
    };
  });
}

// Load all posters
async function loadAllPosters() {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['posters'], 'readonly');
    const store = transaction.objectStore('posters');
    const request = store.getAll();

    request.onsuccess = () => {
      console.log('Loaded', request.result.length, 'posters from IndexedDB');
      resolve(request.result);
    };

    request.onerror = () => {
      console.error('Error loading posters:', request.error);
      reject(request.error);
    };
  });
}

// Delete a poster by ID
async function deletePoster(id) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['posters'], 'readwrite');
    const store = transaction.objectStore('posters');
    const request = store.delete(id);

    request.onsuccess = () => {
      console.log('Poster deleted:', id);
      resolve();
    };

    request.onerror = () => {
      console.error('Error deleting poster:', request.error);
      reject(request.error);
    };
  });
}

// Save artist workspace data (base poster or decorative images)
async function saveArtistData(key, data) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['artistData'], 'readwrite');
    const store = transaction.objectStore('artistData');

    const artistData = {
      key: key,
      data: data
    };

    const request = store.put(artistData);

    request.onsuccess = () => {
      console.log('Artist data saved:', key);
      resolve();
    };

    request.onerror = () => {
      console.error('Error saving artist data:', request.error);
      reject(request.error);
    };
  });
}

// Load artist workspace data
async function loadArtistData(key) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['artistData'], 'readonly');
    const store = transaction.objectStore('artistData');
    const request = store.get(key);

    request.onsuccess = () => {
      if (request.result) {
        console.log('Artist data loaded:', key);
        resolve(request.result.data);
      } else {
        resolve(null);
      }
    };

    request.onerror = () => {
      console.error('Error loading artist data:', request.error);
      reject(request.error);
    };
  });
}

// Clear all artist workspace data
async function clearArtistData() {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['artistData'], 'readwrite');
    const store = transaction.objectStore('artistData');
    const request = store.clear();

    request.onsuccess = () => {
      console.log('All artist data cleared');
      resolve();
    };

    request.onerror = () => {
      console.error('Error clearing artist data:', request.error);
      reject(request.error);
    };
  });
}

// Clear all saved posters from IndexedDB
async function clearAllPosters() {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['posters'], 'readwrite');
    const store = transaction.objectStore('posters');
    const request = store.clear();

    request.onsuccess = () => {
      console.log('All posters cleared from IndexedDB');
      resolve();
    };

    request.onerror = () => {
      console.error('Error clearing posters:', request.error);
      reject(request.error);
    };
  });
}

// Clear everything - posters and artist data
async function clearAllData() {
  await clearAllPosters();
  await clearArtistData();
  await clearUserCustomization();
  console.log('All data cleared from IndexedDB');
}

// Force database upgrade by deleting and recreating
async function upgradeDatabase() {
  return new Promise((resolve, reject) => {
    console.log('Upgrading database...');

    // Close existing connection
    if (db) {
      db.close();
    }

    // Delete the database
    const deleteRequest = indexedDB.deleteDatabase('PosterMusicApp');

    deleteRequest.onsuccess = async () => {
      console.log('Old database deleted successfully');
      // Reinitialize with new schema
      try {
        await initDB();
        console.log('Database upgraded successfully');
        resolve();
      } catch (error) {
        console.error('Error reinitializing database:', error);
        reject(error);
      }
    };

    deleteRequest.onerror = () => {
      console.error('Error deleting database:', deleteRequest.error);
      reject(deleteRequest.error);
    };

    deleteRequest.onblocked = () => {
      console.warn('Database deletion blocked - close all tabs and try again');
      reject(new Error('Database deletion blocked'));
    };
  });
}

// Helper: Convert canvas to Blob
function canvasToBlob(canvas) {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      resolve(blob);
    }, 'image/jpeg', 0.95);
  });
}

// Helper: Convert Blob to data URL (for loading into p5)
function blobToDataURL(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

// User Customization Storage Functions

// Save user background image
async function saveUserBackground(imageBlob) {
  return new Promise((resolve, reject) => {
    if (!db.objectStoreNames.contains('userCustomization')) {
      console.log('userCustomization object store does not exist yet - please reload the page');
      reject(new Error('Database not upgraded yet'));
      return;
    }

    const transaction = db.transaction(['userCustomization'], 'readwrite');
    const store = transaction.objectStore('userCustomization');

    const data = {
      key: 'userBackground',
      imageBlob: imageBlob,
      timestamp: Date.now()
    };

    const request = store.put(data);

    request.onsuccess = () => {
      console.log('User background saved to IndexedDB');
      resolve();
    };

    request.onerror = () => {
      console.error('Error saving user background:', request.error);
      reject(request.error);
    };
  });
}

// Load user background image
async function loadUserBackground() {
  return new Promise((resolve, reject) => {
    if (!db.objectStoreNames.contains('userCustomization')) {
      console.log('userCustomization object store does not exist yet');
      resolve(null);
      return;
    }

    const transaction = db.transaction(['userCustomization'], 'readonly');
    const store = transaction.objectStore('userCustomization');
    const request = store.get('userBackground');

    request.onsuccess = () => {
      if (request.result && request.result.imageBlob) {
        resolve(request.result.imageBlob);
      } else {
        resolve(null);
      }
    };

    request.onerror = () => {
      console.error('Error loading user background:', request.error);
      reject(request.error);
    };
  });
}

// Save user decorative GIFs
async function saveUserGifsDB(gifsData) {
  return new Promise((resolve, reject) => {
    if (!db.objectStoreNames.contains('userCustomization')) {
      console.log('userCustomization object store does not exist yet - please reload the page');
      reject(new Error('Database not upgraded yet'));
      return;
    }

    const transaction = db.transaction(['userCustomization'], 'readwrite');
    const store = transaction.objectStore('userCustomization');

    const data = {
      key: 'userGifs',
      gifs: gifsData,
      timestamp: Date.now()
    };

    const request = store.put(data);

    request.onsuccess = () => {
      console.log('User GIFs saved to IndexedDB');
      resolve();
    };

    request.onerror = () => {
      console.error('Error saving user GIFs:', request.error);
      reject(request.error);
    };
  });
}

// Load user decorative GIFs
async function loadUserGifsDB() {
  return new Promise((resolve, reject) => {
    if (!db.objectStoreNames.contains('userCustomization')) {
      console.log('userCustomization object store does not exist yet');
      resolve([]);
      return;
    }

    const transaction = db.transaction(['userCustomization'], 'readonly');
    const store = transaction.objectStore('userCustomization');
    const request = store.get('userGifs');

    request.onsuccess = () => {
      if (request.result && request.result.gifs) {
        resolve(request.result.gifs);
      } else {
        resolve([]);
      }
    };

    request.onerror = () => {
      console.error('Error loading user GIFs:', request.error);
      reject(request.error);
    };
  });
}

// Clear user customization data
async function clearUserCustomization() {
  return new Promise((resolve, reject) => {
    // Check if the object store exists before trying to use it
    if (!db.objectStoreNames.contains('userCustomization')) {
      console.log('userCustomization object store does not exist yet - skipping');
      resolve();
      return;
    }

    const transaction = db.transaction(['userCustomization'], 'readwrite');
    const store = transaction.objectStore('userCustomization');
    const request = store.clear();

    request.onsuccess = () => {
      console.log('User customization cleared from IndexedDB');
      resolve();
    };

    request.onerror = () => {
      console.error('Error clearing user customization:', request.error);
      reject(request.error);
    };
  });
}
