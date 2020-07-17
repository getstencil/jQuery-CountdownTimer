# jQuery Countdown Timer
Timestamp based countdown timer to ensure accurate countdowns.

Kind of surprised I needed to build this; had trouble finding a jQuery (or
Vanilla JS) library that allowed me to instantiate a countdown timer and have it
be based on the initial timestamp (rather than decrementing
seconds/milliseconds, since that doesn't work well with idle tabs).

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
