# learndev-js-firebase-chat

Taken from: https://codelabs.developers.google.com/codelabs/firebase-web/index.html?index=..%2F..%2Findex#0

The following will develop a chat client using firebase, using the following firebase components:
* Sync data using the Firebase Realtime Database and Cloud Storage.
* Authenticate your users using Firebase Auth.
* Deploy your web app on Firebase static hosting.
* Send notifications with Firebase Cloud Messaging.

We need
* IDE/Text editor
* npm - which typically comes with node.js
* A console
* A browser (e.g. Chrome)

Get the sample code from Github: git clone https://github.com/firebase/friendlychat

Copy the web-start folder into your own project folder

### Create project
In the Firebase console click on CREATE NEW PROJECT and call it FriendlyChat.

### Enable Google Auth
To let users sign-in on the web app we'll use Google auth which needs to be enabled.

In the Firebase Console open the Authentication section > SIGN IN METHOD tab,  you need to enable the Google Sign-in Provider and click SAVE. This will allow users to sign-in the Web app with their Google accounts.
Note: I also added Email/Password providers

### Install the Firebase Command Line Interface
The Firebase Command Line Interface (CLI) will allow you to serve your web apps locally and deploy your web app to Firebase hosting.
To install the CLI run the following npm Command
```
npm -g install firebase-tools
```
To verify that the CLI has been installed correctly open a console and run:
```
firebase version
```
Make sure the Firebase version is above 3.3.0

Authorize the Firebase CLI by running:
```
firebase login
```
Make sure you are in the web-start directory then set up the Firebase CLI to use your Firebase Project:
```
firebase use --add
```
Then select your Project ID and follow the instructions.
Note: I set the alias to chat.

### Run the starter app
Now that you have imported and configured your project you are ready to run the app for the first time. Open a console at the web-start folder and run firebase serve:
```
firebase serve
```
This command should display this in the console:
```
Listening at http://localhost:5000
```
The web app should now be served from http://localhost:5000 open it. The app cannot do anything right now but with your help it will soon! We only have laid out the UI for you so far.

### User Sign-in
#### Initialize Firebase Auth
The Firebase SDK should be ready to use since you have imported and initialized it in the index.html file. In this application we'll be using the Firebase Realtime Database, Cloud Storage for Firebase and Firebase Authentication. Modify the FriendlyChat.prototype.initFirebase function in the scripts/main.js file so that it sets some shortcuts to the Firebase SDK features and initiates auth:
##### main.js
```js
// Sets up shortcuts to Firebase features and initiate firebase auth.
FriendlyChat.prototype.initFirebase = function() {
  // Shortcuts to Firebase SDK features.
  this.auth = firebase.auth();
  this.database = firebase.database();
  this.storage = firebase.storage();
  // Initiates Firebase auth and listen to auth state changes.
  this.auth.onAuthStateChanged(this.onAuthStateChanged.bind(this));
};
```

#### Authorize Firebase with Google
When the user clicks the Sign in with Google button the FriendlyChat.prototype.signIn function gets triggered (this was already set up for you!). At this point we want to authorize Firebase using Google as the Identity Provider. We'll sign in using a popup (Several other methods are available). Change the FriendlyChat.prototype.signIn function with:

##### main.js
```js
// Signs-in Friendly Chat.
FriendlyChat.prototype.signIn = function() {
  // Sign in Firebase using popup auth and Google as the identity provider.
  var provider = new firebase.auth.GoogleAuthProvider();
  this.auth.signInWithPopup(provider);
};
```

The FriendlyChat.prototype.signOut function is triggered when the user clicks the Sign out button. Add the following line to make sure we sign out of Firebase:
##### main.js
```js
// Sign out of Firebase.
this.auth.signOut();
```

We want to display the signed-in user's profile pic and name in the top bar. Earlier we've set up the FriendlyChat.prototype.onAuthStateChanged function to trigger when the auth state changes. This function gets passed a Firebase User object when triggered. Change the two lines with a TODO to read the user's profile pic and name:

##### main.js
```js
// Triggers when the auth state change for instance when the user signs-in or signs-out.
FriendlyChat.prototype.onAuthStateChanged = function(user) {
  if (user) {
    // Get profile pic and user's name from the Firebase user object.
    var profilePicUrl = user.photoURL;
    var userName = user.displayName;

    ...
  }
}  
```

We display an error message if the users tries to send messages when the user is not signed-in. To detect if the user is actually signed-in add these few lines to the top of the FriendlyChat.prototype.checkSignedInWithMessage function where the TODO is located:

##### main.js
```js
// Returns true if user is signed-in. Otherwise false and displays a message.
FriendlyChat.prototype.checkSignedInWithMessage = function() {
  // Return true if the user is signed in Firebase
  if (this.auth.currentUser) {
    return true;
  }

  ...
}  
```

#### Test Signing-in to the app
* Reload your app if it is still being served or run firebase serve on the command line to start serving the app from http://localhost:5000 and open it in your browser.
* Sign-In using the Sign In button
* After Signing in the profile pic and name of the user should be displayed:


### Read Messages
#### Import Messages
In your project in Firebase console visit the Database section on the left navigation bar. On this page you will see the data that is stored in your Firebase Realtime Database.

In the overflow menu of the Database select Import JSON. Browse to the initial_messages.json file at the root of the repository, select it then click the Import button. This will replace any data currently in your database.
Note: The file is at the base of the GIT repository not in the web-start folder.
If you can't find it, the json is here:
```json
{
  "messages" : {
    "-K2ib4H77rj0LYewF7dP" : {
      "text" : "Hello",
      "name" : "anonymous"
    },
    "-K2ib5JHRbbL0NrztUfO" : {
      "text" : "How are you",
      "name" : "anonymous"
    },
    "-K2ib62mjHh34CAUbide" : {
      "text" : "I am fine",
      "name" : "anonymous"
    }
  }
}

```

You could also edit the database manually, using the green + and red x to add and remove items manually or use the Firebase CLI with this command:
```
firebase database:set / ../initial_messages.json
```
After importing the JSON file your database should contain the following elements:
```
friendlychat-12345/
    messages/
        -K2ib4H77rj0LYewF7dP/
            text: "Hello"
            name: "anonymous"
        -K2ib5JHRbbL0NrztUfO/
            text: "How are you"
            name: "anonymous"
        -K2ib62mjHh34CAUbide/
            text: "I am fine"
            name: "anonymous"
```
These are a few sample chat messages to get us started with reading from the Database.

#### Synchronize Messages
To synchronize messages on the app we'll need to add listeners that triggers when changes are made to the data and then create a UI element that show new messages.

Add code that listens to newly added messages to the app's UI. To do this modify the FriendlyChat.prototype.loadMessages function. This is where we'll register the listeners that listens to changes made to the data. We'll only display the last 12 messages of the chat to avoid displaying a very long history on load.

##### main.js
```js
// Loads chat messages history and listens for upcoming ones.
FriendlyChat.prototype.loadMessages = function() {
  // Reference to the /messages/ database path.
  this.messagesRef = this.database.ref('messages');
  // Make sure we remove all previous listeners.
  this.messagesRef.off();

  // Loads the last 12 messages and listen for new ones.
  var setMessage = function(data) {
    var val = data.val();
    this.displayMessage(data.key, val.name, val.text, val.photoUrl, val.imageUrl);
  }.bind(this);
  this.messagesRef.limitToLast(12).on('child_added', setMessage);
  this.messagesRef.limitToLast(12).on('child_changed', setMessage);
};
```

#### Test Message Sync
* Reload your app if it is still being served or run firebase serve on the command line to start serving the app from http://localhost:5000 and open it in your browser.
* The sample messages we imported earlier into the database should be displayed in the Friendly-Chat UI (see below). You can also manually add new messages directly from the Database section of the Firebase console. Congratulations, you are reading real-time database entries in your app!










### Send Messages
#### Implement Message Sending
In this section you will add the ability for users to send messages. The code snippet below is triggered upon clicks on the SEND button and pushes a message object with the contents of the message field to the Firebase database. The push() method adds an automatically generated key to the pushed object's path. These keys are sequential which ensures that the new messages will be added to the end of the list. Update the FriendlyChat.prototype.saveMessage function with:

##### main.js
```js
// Saves a new message on the Firebase DB.
FriendlyChat.prototype.saveMessage = function(e) {
  e.preventDefault();
  // Check that the user entered a message and is signed in.
  if (this.messageInput.value && this.checkSignedInWithMessage()) {
    var currentUser = this.auth.currentUser;
    // Add a new message entry to the Firebase Database.
    this.messagesRef.push({
      name: currentUser.displayName,
      text: this.messageInput.value,
      photoUrl: currentUser.photoURL || '/images/profile_placeholder.png'
    }).then(function() {
      // Clear message text field and SEND button state.
      FriendlyChat.resetMaterialTextfield(this.messageInput);
      this.toggleButton();
    }.bind(this)).catch(function(error) {
      console.error('Error writing new message to Firebase Database', error);
    });
  }
};
```

#### Test Sending Messages
* Reload your app if it is still being served or run firebase serve on the command line to start serving the app from http://localhost:5000 and open it in your browser.
* After signing-in, enter a message and hit the send button, the new message should be visible in the app UI and in the Firebase console with your user photo and name:









### Send Images

We'll now add a feature that shares images by uploading them to Cloud Storage. Cloud Storage for Firebase is a file/blob storage service.

#### Save images to Cloud Storage
We have already added for you a button that triggers a file picker dialog. After selecting a file the FriendlyChat.prototype.saveImageMessage function is triggered and you can get a reference to the selected file. Now we'll add code that:

* Creates a "placeholder" chat message with a temporary loading image into the chat feed.
* Upload the file to Cloud Storage to the path: /<uid>/<postId>/<file_name>
* Update the chat message with the newly uploaded file's Cloud Storage URI in lieu of the temporary loading image.

Add the following at the bottom of the FriendlyChat.prototype.saveImageMessage function where the TODO is located:

##### main.js
```js
// Saves the a new message containing an image URI in Firebase.
// This first saves the image in Cloud Storage.
FriendlyChat.prototype.saveImageMessage = function(event) {

  ...

  // Check if the user is signed-in
  if (this.checkSignedInWithMessage()) {

    // We add a message with a loading icon that will get updated with the shared image.
    var currentUser = this.auth.currentUser;
    this.messagesRef.push({
      name: currentUser.displayName,
      imageUrl: FriendlyChat.LOADING_IMAGE_URL,
      photoUrl: currentUser.photoURL || '/images/profile_placeholder.png'
    }).then(function(data) {

      // Upload the image to Cloud Storage.
      var filePath = currentUser.uid + '/' + data.key + '/' + file.name;
      return this.storage.ref(filePath).put(file).then(function(snapshot) {

        // Get the file's Storage URI and update the chat message placeholder.
        var fullPath = snapshot.metadata.fullPath;
        return data.update({imageUrl: this.storage.ref(fullPath).toString()});
      }.bind(this));
    }.bind(this)).catch(function(error) {
      console.error('There was an error uploading a file to Cloud Storage:', error);
    });
  }
};
```

#### Display images from Cloud Storage
In the chat messages we saved the Cloud Storage reference of the images. These are of the form ```gs://<bucket>/<uid>/<postId>/<file_name>```.
To display these images we need to query Cloud Storage for a URL.

To do this replace the `FriendlyChat.prototype.setImageUrl` function content with:

##### main.js
```js
// Sets the URL of the given img element with the URL of the image stored in Cloud Storage.
FriendlyChat.prototype.setImageUrl = function(imageUri, imgElement) {
  // If the image is a Cloud Storage URI we fetch the URL.
  if (imageUri.startsWith('gs://')) {
    imgElement.src = FriendlyChat.LOADING_IMAGE_URL; // Display a loading image first.
    this.storage.refFromURL(imageUri).getMetadata().then(function(metadata) {
      imgElement.src = metadata.downloadURLs[0];
    });
  } else {
    imgElement.src = imageUri;
  }
};
```

#### Test Sending images
* Reload your app if it is still being served or run firebase serve on the command line to start serving the app from http://localhost:5000 then open it in your browser.
* After signing-in, click the image upload button: and select an image file using the file picker, a new message should be visible in the app UI with your selected image:

The image update didn't initially work. After googling why it was the Storage rules that needed changing.
The rules originally were:
```
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```
But the line ```match /{allPaths=**} {``` needed to be changed to ```match /{userId}/{postId}/{fileName} {```
to give the following:
```
service firebase.storage {
  match /b/{bucket}/o {
    match /{userId}/{postId}/{fileName} {
      allow read, write: if request.auth != null;
    }
  }
}
```
Now if you restart the server, the images can be uploaded.

### Show notifications
TODO
### Database Security Rules [Optional]
TODO
### Storgage Security Rules [Optional]
TODO

### Deploy your app using Firebase static hosting

Firebase comes with a hosting service that will serve your static assets/web app. You deploy your files to Firebase Hosting using the Firebase CLI. Before deploying you need to specify which files will be deployed in your firebase.json file. We have already done this for you because this was required to serve the file for development through this codelab. These settings are specified under the hosting attribute:

##### firebase.json
```
{
  // If you went through the "Realtime Database Security Rules" step.
  "database": {
    "rules": "database-rules.json"
  },
  // If you went through the "Storage Security Rules" step.
  "storage": {
    "rules": "storage.rules"
  },
  "hosting": {
    "public": "./",
    "ignore": [
      "firebase.json",
      "database-rules.json",
      "storage.rules"
    ]
  }
}
```
Remove the top sections as we didn't do the database security rules or the storage rules steps

This gives us the following:
```json
{
  "hosting": {
    "public": "./",
    "ignore": [
      "firebase.json",
      "database-rules.json",
      "storage.rules",
      "functions"
    ],
    "headers": [{
      "source" : "**/*.@(js|html)",
      "headers" : [ {
        "key" : "Cache-Control",
        "value" : "max-age=0"
      } ]
    }]
  }
}
```

This will tell the CLI that we want to deploy all files in the current directory ( "public": "./" ) with the exception of the files listed in the ignore array.

Now deploy your files to Firebase static hosting by running firebase deploy:
```
firebase deploy
```
This is the console output you should see:
```
=== Deploying to 'friendlychat-12345'...

i  deploying database, storage, hosting
✔  database: rules ready to deploy.
i  storage: checking rules for compilation errors...
✔  storage: rules file compiled successfully
i  hosting: preparing ./ directory for upload...
✔  hosting: ./ folder uploaded successfully
✔  hosting: 9 files uploaded successfully
i  starting release process (may take several minutes)...

✔  Deploy complete!

Project Console: https://console.firebase.google.com/project/friendlychat-12345/overview
Hosting URL: https://friendlychat-12345.firebaseapp.com
```

Then simply visit your web app hosted on Firebase Hosting on https://<project-id>.firebaseapp.com or by running firebase open hosting:site.

The Hosting tab in the Firebase console will display useful information such as the history of your deploys with the ability to rollback to previous versions and the ability to set up a custom domain.


### Congratulations
This completes the tutorial

I tested this by going on my phone and adding messages and photos and the web page on my pc updated immediately.
#### What we've covered
* Authorizing Firebase
* Firebase Realtime Database
* Firebase SDK for Cloud Storage
* Firebase Cloud Messaging
* Firebase Static Hosting
