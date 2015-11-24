# laser
Server for controlling our laser table project.

This serves a webpage that allows multiple users to control a servo-controller laser.

It expects two types of clients: users and the laser driver. Users are served a page that allows them to draw on the screen to set the position of the laser. If more than one client is connected, it randomly selects a client every five seconds and gives them control of the laser until the next random selection. Turns are indicated on the client's screen. The screen also shows dots outlining the path drawn by the active user.  

The server also provides a path for a the laser driver client to continually poll to find the most up-to-date position set by the other clients.
