This is currently in the planning/experimentation/alpha stage. Don't use this.

This tries to solve the problem of getting a PKCS12 secret key backup safely from a desktop computer to a mobile device running Android or iOS. People usually use theit email account, which (in my opinion) is a terrible idea.

The rough idea is: have a TLS-only server in the middle. Connect and authenticate with the desktop browser. Connect and authenticate with the mobile browser. Have some kind of challenge-response mechanism to verify browsers to each other. Enable users to upload/drag files from one browser into the other. Make sure files are never put to permanent storage on the server and only exist there as short as needed. Implement proper limits for size, upload rate etc.

Watch this space for updates :-)
