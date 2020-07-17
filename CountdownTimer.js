
/**
 * CountdownTimer
 * 
 * @see     http://countdownjs.org/
 * @fires   complete
 *          tick
 *          pause
 *          restart
 *          start
 *          stop
 *          unpause
 * @todo    support milliseconds
 * @todo    support days
 * @extends Base
 */
window.CountdownTimer = Base.extend({

    /**
     * Properties
     * 
     */

    /**
     * _$durationRemainingElements
     * 
     * jQuery object referencing the elements that should have their copy
     * updated with the formatted duration remaining (eg. 04:58).
     * 
     * @access  protected
     * @var     null|jQuery (default: null)
     */
    _$durationRemainingElements: null,

    /**
     * _customAttributeLeadingName
     * 
     * The leading name for custom attributes that may be applied to
     * elements manipulated by this library.
     * 
     * @access  protected
     * @var     String (default: 'data-countdowntimer-')
     */
    _customAttributeLeadingName: 'data-countdowntimer-',

    /**
     * _debugMode
     * 
     * Useful for logging out event information
     * 
     * @access  protected
     * @var     Boolean (default: false)
     */
    _debugMode: false,
    // _debugMode: true,

    /**
     * _defaultDurationRemainingFormats
     * 
     * Array of possible formats (and when they should be used as defined by
     * the maxDuration propery) which is set when a format was not
     * explicitly set.
     * 
     * @access  protected
     * @var     Array
     */
    _defaultDurationRemainingFormats: [
        {
            example: '0:59',
            fallback: false,
            format: 'm:ss',
            maxDuration: 60 * 1000
        },
        {
            example: '09:59',
            fallback: false,
            format: 'mm:ss',
            maxDuration: 600 * 1000
        },
        {
            example: '9:59:59',
            fallback: false,
            format: 'h:mm:ss',
            maxDuration: 36000 * 1000
        },
        {
            example: '23:59:59',
            fallback: false,
            format: 'hh:mm:ss',
            maxDuration: 86400 * 1000
        },
        {
            example: '999:59:59',
            fallback: true,
            format: 'hh:mm:ss',
            maxDuration: null
        }
    ],

    /**
     * _duration
     * 
     * The total duration (in milliseconds) that the countdown should run
     * for, before triggering the complete event.
     * 
     * @access  protected
     * @var     null|Number (default: null)
     */
    _duration: null,

    /**
     * _durationRemainingFormat
     * 
     * The format that should be used when displaying the duration remaining
     * copy.
     * 
     * @access  protected
     * @var     null|String (default: null)
     */
    _durationRemainingFormat: null,

    /**
     * _paused
     * 
     * Whether the countdown is currently paused.
     * 
     * @access  protected
     * @var     Boolean (default: false)
     */
    _paused: false,

    /**
     * _pausedPeriods
     * 
     * Keeps track of when the countdown was paused (and unpaused) to ensure
     * proper math.
     * 
     * @access  protected
     * @var     Array (default: [])
     */
    _pausedPeriods: [],

    /**
     * _running
     * 
     * Whether the countdown is currently running.
     * 
     * @access  protected
     * @var     Boolean (default: false)
     */
    _running: false,

    /**
     * _startTimestamp
     * 
     * @access  protected
     * @var     Number|null (default: null)
     */
    _startTimestamp: null,

    /**
     * _string
     * 
     * @access  protected
     * @var     String (default: 'CountdownTimer')
     */
    _string: 'CountdownTimer',

    /**
     * _tickInterval
     * 
     * A reference to the interval that was set up to keep track of the
     * countdown.
     * 
     * @access  protected
     * @var     null|Number (default: null)
     */
    _tickInterval: null,

    /**
     * _tickIntervalDelay
     * 
     * The delay between interval calls, which is used for measuring the
     * time remaining.
     * 
     * @access  protected
     * @var     Number (default: 250)
     */
    _tickIntervalDelay: 250,

    /**
     * Methods
     * 
     */

    /**
     * init
     * 
     * @access  public
     * @return  void
     */
    init: function() {
        this._super();
        this._pausedPeriods = [];
        this._validateBrowser();
    },

    /**
     * _clearTickInterval
     * 
     * @access  protected
     * @return  void
     */
    _clearTickInterval: function() {
        var tickInterval = this._tickInterval;
        clearInterval(tickInterval);
    },

    /**
     * _formatSingularDigit
     * 
     * @access  protected
     * @param   Number number
     * @return  String
     */
    _formatSingularDigit: function(number) {
        var str = number < 10 ? '0' + (number) : number;
        return str;
    },

    /**
     * _getCurrentTimestamp
     * 
     * @access  protected
     * @return  Number
     */
    _getCurrentTimestamp: function() {
        var date = new Date(),
            timestamp = date.getTime();
        return timestamp;
        // timestamp = Math.floor(timestamp / 1000);
        // return timestamp;
    },

    /**
     * _getCustomAttributeName
     * 
     * @access  protected
     * @param   String name
     * @return  String
     */
    _getCustomAttributeName: function(name) {
        name = name.trim();
        name = name.toLowerCase();
        var leading = this._customAttributeLeadingName,
            attributeName = (leading) + (name);
        return attributeName;
    },

    /**
     * _getDurationRemainingFormat
     * 
     * @access  protected
     * @return  String
     */
    _getDurationRemainingFormat: function() {
        if (this._durationRemainingFormat !== null) {
            return this._durationRemainingFormat;
        }
        var duration = this._duration,
            defaultDurationRemainingFormats = this._defaultDurationRemainingFormats,
            fallbackFormat = null;
        for (var index in defaultDurationRemainingFormats) {
            var defaultDurationRemainingFormat = defaultDurationRemainingFormats[index];
            if (defaultDurationRemainingFormat.fallback === true) {
                fallbackFormat = defaultDurationRemainingFormat.format;
                continue;
            }
            if (duration <= defaultDurationRemainingFormat.maxDuration) {
                var format = defaultDurationRemainingFormat.format;
                return format;
            }
        }
        return fallbackFormat;
    },

    /**
     * _getEventHandlerArguments
     * 
     * @access  protected
     * @return  Array
     */
    _getEventHandlerArguments: function() {
        var args = [],
            object = this._getEventHandlerObject();
        args.push(object);
        return args;
    },

    /**
     * _getEventHandlerObject
     * 
     * @access  protected
     * @return  Object
     */
    _getEventHandlerObject: function() {
        var duration = this._duration,
            durationRemaining = this.getDurationRemaining(),
            durationRemainingCopy = this.getDurationRemainingCopy(),
            paused = this._paused,
            running = this._running,
            tickInterval = this._tickInterval,
            object = {};
        object.duration = duration;
        object.durationRemaining = durationRemaining;
        object.durationRemainingCopy = durationRemainingCopy;
        object.paused = paused;
        object.running = running;
        object.tickInterval = tickInterval;
        return object;
    },

    /**
     * _getFormattedDurationRemainingCopy
     * 
     * @access  protected
     * @param   Number hours
     * @param   Number minutes
     * @param   Number seconds
     * @return  String
     */
    _getFormattedDurationRemainingCopy: function(hours, minutes, seconds) {
        hours = Math.max(0, hours);
        minutes = Math.max(0, minutes);
        seconds = Math.max(0, seconds);
        var format = this._getDurationRemainingFormat(),
            copy = format;
        copy = copy.replace('ss', this._formatSingularDigit(seconds));
        copy = copy.replace('s', seconds);
        copy = copy.replace('mm', this._formatSingularDigit(minutes));
        copy = copy.replace('m', minutes);
        copy = copy.replace('hh', this._formatSingularDigit(hours));
        copy = copy.replace('h', hours);
        return copy;
    },

    /**
     * _handleCompleteEvent
     * 
     * @access  protected
     * @return  void
     */
    _handleCompleteEvent: function() {
        this._clearTickInterval();
        this._pausedPeriods = [];
        this._running = false;
        var args = this._getEventHandlerArguments();
        this.triggerHandler('complete', args);
    },

    /**
     * _handleTickEvent
     * 
     * @note    Only triggers the tick event if the copy for the duration
     *          remaining has changed.
     * @access  protected
     * @return  Boolean
     */
    _handleTickEvent: function() {
        if (this._paused === true) {
            return false;
        }
        var copyChanged = this._setDurationRemainingCopy();
        if (copyChanged === true) {
            var args = this._getEventHandlerArguments();
            this.triggerHandler('tick', args);
        }
        if (this.getDurationRemaining() <= 0) {
            this._handleCompleteEvent();
        }
        return true;
    },

    /**
     * _log
     * 
     * @access  protected
     * @param   String msg
     * @return  Boolean
     */
    _log: function(msg) {
        if (window.console === undefined) {
            return false;
        }
        if (window.console.log === undefined) {
            return false;
        }
        window.console.log(msg);
        return true;
    },

    /**
     * _setDurationRemainingCopy
     * 
     * @access  protected
     * @return  Boolean
     */
    _setDurationRemainingCopy: function() {
        var $durationRemainingElements = this._$durationRemainingElements,
            attributeName = this._getCustomAttributeName('durationRemaining'),
            durationRemaining = this.getDurationRemaining(),
            currentDurationRemainingCopy = $durationRemainingElements.first().text(),
            durationRemainingCopy = this.getDurationRemainingCopy();
        $durationRemainingElements.attr(attributeName, durationRemaining);
        if (currentDurationRemainingCopy === durationRemainingCopy) {
            return false;
        }
        $durationRemainingElements.text(durationRemainingCopy);
        return true;
    },

    /**
     * _trackPause
     * 
     * @access  protected
     * @return  void
     */
    _trackPause: function() {
        var pausePeriod = {};
        pausePeriod.start = this._getCurrentTimestamp();
        this._pausedPeriods.push(pausePeriod);
    },

    /**
     * _trackUnpause
     * 
     * @access  protected
     * @return  void
     */
    _trackUnpause: function() {
        var index = this._pausedPeriods.length - 1,
            pausePeriod = this._pausedPeriods[index];
        pausePeriod.stop = this._getCurrentTimestamp();
    },

    /**
     * _validateBrowser
     * 
     * @access  protected
     * @return  Boolean
     */
    _validateBrowser: function() {
        if (window.Function.bind === undefined) {
            this._validBrowser = false;
            var msg = 'CountdownTimer: Your browser is not supported';
            this._log(msg);
            return false;
        }
        this._validBrowser = true;
        return true;
    },

    /**
     * getDurationRemaining
     * 
     * @access  public
     * @return  null|Number
     */
    getDurationRemaining: function() {
        if (this._startTimestamp === null) {
            return null;
        }
        var timestamp = this._getCurrentTimestamp(),
            difference = timestamp - this._startTimestamp,
            durationRemaining = this._duration - difference;
        for (var index in this._pausedPeriods) {
            var pausePeriod = this._pausedPeriods[index],
                start = pausePeriod.start,
                stop = pausePeriod.stop;
            if (stop === undefined) {
                continue;
            }
            durationRemaining += stop - start
        }
        durationRemaining = Math.max(0, durationRemaining);
        return durationRemaining;
    },

    /**
     * getDurationRemainingCopy
     * 
     * @see     https://www.codespeedy.com/convert-seconds-to-hh-mm-ss-format-in-javascript/
     * @access  public
     * @return  String
     */
    getDurationRemainingCopy: function() {
        var durationRemaining = this.getDurationRemaining(),
            seconds = Math.floor(durationRemaining / 1000),
            hours = Math.floor(seconds / 3600),
            seconds = seconds % 3600,
            minutes = Math.floor(seconds / 60),
            seconds = seconds % 60,
            formattedCopy = this._getFormattedDurationRemainingCopy(
                hours,
                minutes,
                seconds
            );
        return formattedCopy;
    },

    /**
     * getValidBrowser
     * 
     * @access  public
     * @return  Boolean
     */
    getValidBrowser: function() {
        var validBrowser = this._validBrowser;
        return validBrowser;
    },

    /**
     * pause
     * 
     * Primary API method which is used to pause a running timer.
     * 
     * @access  public
     * @return  Boolean
     */
    pause: function() {
        if (this._validBrowser === false) {
            return false;
        }
        if (this._paused === true) {
            return false;
        }
        if (this._running === false) {
            return false;
        }
        this._trackPause();
        this._running = this._running;
        this._paused = true;
        var args = this._getEventHandlerArguments();
        this.triggerHandler('pause', args);
        return true;
    },

    /**
     * restart
     * 
     * Primary API method which is used to restart the timer.
     * 
     * @access  public
     * @return  Boolean
     */
    restart: function() {
        if (this._validBrowser === false) {
            return false;
        }
        this._running = false;
        this._paused = false;
        this.start();
        this.triggerHandler('restart', args);
        return true;
    },

    /**
     * start
     * 
     * Primary API method which is used to start the timer (so long as it
     * isn't already running).
     * 
     * @access  public
     * @return  Boolean
     */
    start: function() {
        if (this._validBrowser === false) {
            return false;
        }
        if (this._running === true) {
            return false;
        }
        this._running = true;
        this._paused = false;
        this._startTimestamp = this._getCurrentTimestamp();
        this._setDurationRemainingCopy();
        var handler = this._handleTickEvent.bind(this),
            delay = this._tickIntervalDelay,
            tickInterval = setInterval(handler, delay);
        this._tickInterval = tickInterval;
        var args = this._getEventHandlerArguments();
        this.triggerHandler('start', args);
        return true;
    },

    /**
     * stop
     * 
     * Primary API method which is used to clear the interval (stopping the
     * countdown).
     * 
     * @access  public
     * @return  Boolean
     */
    stop: function() {
        if (this._validBrowser === false) {
            return false;
        }
        this._running = false;
        this._paused = false;
        this._clearTickInterval();
        var args = this._getEventHandlerArguments();
        this.triggerHandler('stop', args);
        return true;
    },

    /**
     * setDuration
     * 
     * @access  public
     * @param   Number seconds
     * @return  void
     */
    setDuration: function(seconds) {
        var milliseconds = seconds * 1000;
        this._duration = milliseconds;
    },

    /**
     * setDurationRemainingElements
     * 
     * @access  public
     * @param   jQuery $elements
     * @return  void
     */
    setDurationRemainingElements: function($elements) {
        this._$durationRemainingElements = $elements;
    },

    /**
     * setDurationRemainingFormat
     * 
     * @access  public
     * @param   String format
     * @return  void
     */
    setDurationRemainingFormat: function(format) {
        this._durationRemainingFormat = format;
    },

    /**
     * triggerHandler
     * 
     * @access  public
     * @return  void
     */
    triggerHandler: function() {
        if (this._debugMode === true) {
            this._log(arguments);
        }
        var arguments = $(arguments).toArray();
        this._super.apply(this, arguments);
    },

    /**
     * unpause
     * 
     * Primary API method which is used to unpause a running timer.
     * 
     * @access  public
     * @return  Boolean
     */
    unpause: function() {
        if (this._validBrowser === false) {
            return false;
        }
        if (this._paused === false) {
            return false;
        }
        if (this._running === false) {
            return false;
        }
        this._trackUnpause();
        this._running = this._running;
        this._paused = false;
        var args = this._getEventHandlerArguments();
        this.triggerHandler('unpause', args);
        return true;
    }
});
