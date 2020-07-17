# jQuery Countdown Timer
Timestamp based countdown timer to ensure accurate countdowns.

Kind of surprised I needed to build this; had trouble finding a jQuery (or
Vanilla JS) library that allowed me to instantiate a countdown timer and have it
be based on the initial timestamp (rather than decrementing
seconds/milliseconds, since that doesn't work well with idle tabs).

### Inclusion
``` javascript
<script src="/path/to/vendor/jQuery-CountdownTimer/extend.js"></script>
<script src="/path/to/vendor/jQuery-CountdownTimer/Base.js"></script>
<script src="/path/to/vendor/jQuery-CountdownTimer/CountdownTimer.js"></script>
```

### Example
``` javascript
var countdownTimer = new CountdownTimer(),
    $elements = jQuery('.copy');
countdownTimer.setDuration(5);
countdownTimer.setDurationRemainingElements($elements);
```

### Events
- `complete`
- `tick`
- `pause`
- `restart`
- `start`
- `stop`
- `unpause`

### More details
I was running into a situation whereby I couldn't depend on a `setInterval` call
to decrement a timer by 1-second each second.

Going deeper into it, I found out that this is a common situation that arrises
from Chrome (and presumably, other browsers) prioritizing tabs and either
delaying or not running interval functions at all.

[Here's a post](https://stackoverflow.com/questions/5927284/how-can-i-make-setinterval-also-work-when-a-tab-is-inactive-in-chrome)
from someone who ran into it as well.

So.. I needed to have a countdown timer work based on timestamps so that when
an inactive tab was refocused again, the timer would properly represent how much
time is left.

I added in some bells and whistles for formatting and a bunch of events to make
it easier to deal with pausing, unpausing, etc etc.
