======== v 1.0.0 Banshee Groups Release Pre-Alpha ========

Pending Features:
  - Add socket for notifications
  - Add periodic cleaning routines (Server)
  - Add error log capability

Pending Enhancements:
  - "Autocomplete" for username in admin and user search

/--  DAY COUNTDOWN  --/

Days until deadline: 14

//--- FINISHED ROUTES ---//

*Users*
  - Create User: ✔
  - Login Phone: ✔
  - Login Standard: ✔
  - Get User Profile: ✔
  - Update User Profile: ✔
  - Search Username: ✔
  - Ban User: ✔
  - Unban User: ✔
  - Update User Password: ✔
  - Delete User: ✔
  - Promote User: ✔
  - Search users by priviledges: ✔

*Boards*
  - Create Board: ✔
  - Get Board: ✔
  - Board List: ✔
  - Edit Board: ✔
  - Delete Board: ✔
  - List New Boards: ✔
  - Change Board Image: ✔

*Threads*
  - Get Thread: ✔
  - Post Thread: ✔
  - Get Hot Threads: ✔
  - Get New Threads: ✔
  - Get Board's Deleted threads: ✔
  - Get Deleted threads overall: ✔
  - Kill Thread: ✔
  - Search Thread: ✔
  - First X Hot Threads Overall: ✔
  - First X New Threads Overall: ✔

*Replies*
  - Get replies (With subReplies): ✔
  - Get replies (No subReplies): ✔
  - Get reply (No subReplies): ✔
  - Get reply (With subReplies): ✔
  - Get replies (Limited SubReplies): ✔
  - Reply to Thread: ✔
  - Reply To Reply: ✔
  - Reply To SubReply: ✔
  - Update Reply Visibility: ✔
  - Delete SubReply: ✔

*Requests*
  - Get Info Request: ✔
  - Check User's Info Access: ✔
  - Send Info Request: ✔
  - User's Sent Requests: ✔
  - User's Received Requests: ✔
  - Deny All Requests: ✔
  - Get Friends: ✔
  - Get Foes: ✔
  - Kill Reply: ✔
  - Kill SubReply: ✔

*Admins*
  - Appoint New Admin: ✔
  - Search for Admin (by name): ✔
  - Get Admins Appointed by X User: ✔
  - Admin List Last Resolution: ✔
  - Admin List # Resolutions: ✔
  - Admin List of Board: ✔
  - Get Admin Info: ✔
  - Admin List of Division: ✔
  - Admin List By Name: ✔
  - Update Admin's Board: ✔
  - Update Admin's Priviledges: ✔
  - Delete Admin: ✔

*Issues*
  - Post an Issue: ✔
  - Get Issue: ✔
  - Get Corresponding Issues: ✔
  - Get Issues in Division: ✔
  - Get Issues in Board: ✔
  - Get Issues by Board and Division: ✔
  - Resolve an Issue: ✔

*Notifications*
  - Get Notification: ✔
  - Get Unseen Notifications: ✔
  - Create Notification: ✔
  - Mark Notifications as Seen: ✔
  - Mark Notification as Seen: ✔
  - Get Latest Notifications: ✔
  - Delete Notification: ✔
  - Empty Notification Bin: ✔

======== v 1.0.1 Release Alpha UdeG Fork ========

Features:
  - Add code and settings for UdeG only registration

Enhancements:
  - Add code for push notifications (Google & Apple)
  - Add account recovery route (Uses cellphone)

Patches;
  - Translate messages to Spanish?

ToDo:
  - Start developing user mobile app & admin mobile app
  - Setup server, buy domain, etc.
  - Publish apps

======== v 1.1.0 Banshee Groups Alpha Release ========

Enhancements:
  - Everything MUST be done with Promises now for better error handling and reduced CALLBACK HELL
  - Code MUST adhere to ES6 standards
  - Separate notifications and requests from users.js
  - Separate replies from threads.js

Patches:
  - Change poster schema in reply.js to e.g poster_name -> name
  - Change contact_info in user model to 'networks'
  - Change "board" to "groups" overall in the system
  - Change "thread" to "post" overall in the system

New Features:
  - Users can create and admin their own boards (Just X per user)
  - Replies can be ordered by engagement ranking
  - User can follow boards
  - Boards can be ranked (based on people following them maybe?)
  - Boards can have tags
  - Threads can have tags

======== v 2.0.0 Second Major Release ========

Enhancements:
  - Bottlenecks MUST be reduced

Patches:
  - Amp up system limits

New Features:
  - Users can listen to boards
  - Users can have an archive of selected engaging threads or replies they liked
  - User account can have cellphone number or email if you want the ability to recover
    but it's not obligatory, account can be registered with reCAPTCHA but it ain't recoverable
    until user provides that info
  - Has default Desktop Frontend
  - Now SubReply's have text excerpt so people can know what the reply is about
  - User gets notifications of threads he contributed to recently
  - Ability to *@* _mention_ someone in a comment and notify them
  - Notifications have thumbnail field to display on app instead of icon
  - Change username field in /models/user to 'handle' to emulate @handle
  - You can now post up to 5 media files per Thread
  - Boards can now become private and accessible by *invitation only system*
  - System will now notify user if there are any _engaging_ threads in the boards he follows
  - System will now notify user if there are any _popular_ boards emerging
  - System will have a "popular tags" list
  - Private Messaging Sub-System
  - Board Admins may only blacklist people from their boards
