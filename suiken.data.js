$(function(){
  Suiken = {};
  Suiken.SIZE = 480;
  Suiken.EN_SIZE = Suiken.SIZE / 2;
  Suiken.en = [
    { x : Suiken.EN_SIZE, y : Suiken.EN_SIZE, radius : Suiken.EN_SIZE,     color : '#333', layer : 1 },
    { x : Suiken.EN_SIZE, y : Suiken.EN_SIZE, radius : Suiken.EN_SIZE/1.5, color : '#444', layer : 2 },
    { x : Suiken.EN_SIZE, y : Suiken.EN_SIZE, radius : Suiken.EN_SIZE/3,   color : '#555', layer : 3 },
  ];
  Suiken.CONSONANT
  Suiken.TEXT    = [];
  Suiken.TEXT[0] = ['あ','か','さ','た','な','は','ま','や','ら','わ'];
  Suiken.TEXT[1] = ['あ','い','う','え','お'];
  Suiken.TEXT[2] = [];
  Suiken.key = [
    {
      config : { diff : 25, color : '#ccc', font : '60px Arial', radius : Suiken.en[0].radius * 0.85 },
      list   : []
    },
    {
      config : { diff : 25, color : '#ccc', font : '60px Arial', radius : Suiken.en[1].radius * 0.75 },
      list   : []
    },
    {
      config : { diff : 25, color : '#ccc', font : '60px Arial', radius : Suiken.en[2].radius * 0.65 },
      list   : []
    }
  ];
  for(var layer=0;layer<Suiken.key.length;layer++){
    $.each(Suiken.TEXT[layer], function(index, text){
      var angle = 90 + (index * 360 / Suiken.TEXT[layer].length);
      if(angle > 360) angle = angle - 360;
      Suiken.key[layer].list.push({ text : text, angle : angle });
    });
  }
  Suiken.Table = [
    ['あ','い','う','え','お'],
    ['か','き','く','け','こ'],
    ['さ','し','す','せ','そ'],
    ['た','ち','つ','て','と'],
    ['な','に','ぬ','ね','の'],
    ['は','ひ','ふ','へ','ほ'],
    ['ま','み','む','め','も'],
    ['や','ぃ','ゆ','ぇ','よ'],
    ['ら','り','る','れ','ろ'],
    ['わ','い','を','え','ん']
  ];
});
