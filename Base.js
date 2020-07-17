
/**
 * Base
 * 
 * @extends Class
 */
window.Base = Class.extend({

    /**
     * Properties
     * 
     */

    /**
     * _data
     * 
     * @access  protected
     * @var     Object (default: {})
     */
    _data: {},

    /**
     * _string
     * 
     * @access  protected
     * @var     String (default: 'Base')
     */
    _string: 'Base',

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
        this._data = {};
    },

    /**
     * get
     * 
     * @access  public
     * @param   String key
     * @return  mixed
     */
    get: function(key) {
        var data = this._data,
            value = data[key];
        return value;
    },

    /**
     * on
     * 
     * Proxy for jQuery on method.
     * 
     * @access  public
     * @return  void
     */
    on: function() {
        $(this).on.apply($(this), $(arguments).toArray());
    },

    /**
     * once
     * 
     * Proxy for jQuery one method.
     * 
     * @access  public
     * @return  void
     */
    once: function() {
        $(this).one.apply($(this), $(arguments).toArray());
    },

    /**
     * toString
     * 
     * @access  public
     * @return  String
     */
    toString: function() {
        var string = this._string;
        return string;
    },

    /**
     * triggerHandler
     * 
     * @access  public
     * @return  void
     */
    triggerHandler: function() {
        $(this).triggerHandler.apply($(this), $(arguments).toArray());
    }
});
