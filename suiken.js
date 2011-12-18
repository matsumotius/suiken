$(function(){
  Suiken.smartphone = false;
  Suiken.Event = function(){
    this.events = {};
  };
  Suiken.Event.prototype.on = function(name, callback){
    if(false == name in this.events) this.events[name] = [];
    this.events[name].push(callback);
  };
  Suiken.Event.prototype.emit = function(name, message){
    if(false == name in this.events) return;
    $.each(this.events[name], function(index, callback){ callback(message); });
  };
  Suiken.Manager = function(target, canvas, options){
    this.target = target;
    this.canvas = canvas;
    this.input  = new Suiken.Input(target, canvas, options);
    this.input.set_event();
    this.view   = new Suiken.View(target, canvas, options);
    this.view.render();
    this.view.set_event();

    this.touchkey = [-1, -1, -1];
    var that = this;
    this.view.on('touchkeychange', function(message){
      var layer = message.layer;
      if(layer >= that.touchkey.length || layer < 0) return;
      that.touchkey[layer] = message.key;
    });
    this.view.on('layerchange', function(message){
      var layer = message.layer;
      if(layer.from == 0 && layer.to == 1){
        that.input.emit('key', { type : 'consonant', key : that.touchkey[layer.from] });
      }
      if(layer.from == 1 && layer.to == 0){
        that.input.emit('key', { type : 'vowel', key : that.touchkey[layer.from] });
      }
    });
    this.input.on('text', function(message){
      that.emit('input', message);
    });
  };
  Suiken.Manager.prototype = new Suiken.Event();
  Suiken.View = function(target, canvas, otpions){
    this.target  = target;
    this.canvas  = canvas;
    this.count   = 0;
    this.context = this.canvas.getContext('2d');
    this.suggest = [
      { index : -1, color : '#000' },
      { index : -1, color : '#000' }
    ];
    this.current = { layer : -1 };
    this.en      = [
      $(this.target).en(Suiken.en[0]),
      $(this.target).en(Suiken.en[1]),
      $(this.target).en(Suiken.en[2])
    ];
  };
  Suiken.View.prototype = new Suiken.Event();
  Suiken.View.prototype.set_event = function(){
    var that = this;
    $.each(this.en, function(layer, en){
      en.on('touchmove', function(e){
        if(layer == 2) return;
        var angle = en.get_angle({ x : e.pageX, y : e.pageY });
        if(angle < 0) angle = 360 - Math.abs(angle);
        var result = that.find_key(layer, angle);
        if(result.index != that.suggest[layer].index){
          that.emit('touchkeychange', { layer : layer, key : result.key });
          that.highlight(layer, result.index);
        }
        if(layer != that.current.layer){
          var message = { 
            key   : result.key,
            layer : { from : that.current.layer, to : layer }
          };
          that.emit('layerchange', message);
          that.current.layer = layer;
        }
      });
    });
  };
  Suiken.View.prototype.render = function(){
    this.set_key();
  };
  Suiken.View.prototype.set_key = function(){
    var that = this;
    $.each(Suiken.key, function(layer, keys){
      var angle = parseInt(360 / keys.list.length);
      that.en[layer].to_pie(keys.list.length, -angle);
      that.render_key(layer);
    });
  };
  Suiken.View.prototype.render_key = function(layer){
    var that = this;
    var radian_from = function(angle){ return angle * Math.PI / 180; };
    var config = Suiken.key[layer].config;
    $.each(Suiken.key[layer].list, function(index, key){
      that.en[layer].set_text({
        x     : config.radius * Math.cos(radian_from(key.angle)) - config.diff,
        y     : config.radius * Math.sin(radian_from(key.angle)) - config.diff,
        font  : config.font,
        color : config.color,
        value : key.text
      });
    }); 
  };
  Suiken.View.prototype.highlight = function(layer, index){
    var suggest = this.suggest[layer];
    if(index < 0 || suggest.index >= Suiken.key[layer].list.length) return;
    if(suggest.index > -1 && suggest.index != index){
      this.en[layer].set_pie_color(suggest.index, Suiken.en[layer].color);
    }
    this.en[layer].set_pie_color(index, suggest.color);
    this.suggest[layer].index = index;
  };
  Suiken.View.prototype.refresh = function(layer){
    for(var i=0;i<Suiken.en[layer].list.length;i++){
      this.en[layer].set_pie_color(i, Suiken.en[layer].color);
    }
  };
  Suiken.View.prototype.find_key = function(layer, angle){
    // todo: 360-0度の境目に文字が跨いでるときの調整をしてない
    var angle_per_key = 360 / Suiken.key[layer].list.length;
    var result = { index : -1, key : null };
    $.each(Suiken.key[layer].list, function(index, key){
      if(Math.abs(key.angle - angle) * 2 > angle_per_key) return;
      result = { index : index, key : key };
    });
    return result;
  };
  Suiken.Input = function(){
    this.consonant = null;
    this.vowel     = null;
    this.__defineSetter__('vowel', function(key){
      if(this.consonant == null) return key;
      var consonant = Suiken.TEXT[0].indexOf(this.consonant.text);
      var vowel     = Suiken.TEXT[1].indexOf(key.text);
      this.emit('text', { value : Suiken.Table[consonant][vowel] });
      return key;
    });
  };
  Suiken.Input.prototype = new Suiken.Event();
  Suiken.Input.prototype.set_event = function(){
    var that = this;
    this.on('key', function(message){
      that[message.type] = message.key;
    });
  };
  $.fn.suiken = function(options){
    var index = $('canvas').index(this);
    if(index < 0) return;
    return new Suiken.Manager(this, $('canvas')[index], options);
  };
});
