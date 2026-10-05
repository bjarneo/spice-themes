// Palette source for all spice themes. Each theme has a night variant and a
// day variant. The table below sets the character of each spice. The math
// under it turns that into 2 complete Omarchy palettes, and it raises or
// lowers the lightness of each color until it reaches its contrast target.

// Fields of each theme:
//   latin    botanical name. Blends have none.
//   part     part of the plant
//   origin   country or region where the spice comes from
//   notes    3 flavor notes
//   heat     0 to 5
//   shu      Scoville range of a chili, as text
//   whole    the whole spice for the photos: its form, its size in cm and
//            its colors. tools/photo.html has one shape for each form.
//   ground   color of the ground spice
//   grind    0 for a fine powder, 1 for a coarse grind with specks
//   word     'pieces' spells the wordmark in whole pieces. 'stencil' sifts the
//            ground spice through a wordmark stencil.
//   mix      parts of a blend, as [spice name or whole spice, weight, size]
//   bg       night background as OKLCH [lightness, chroma, hue]
//   accent   signature color as [hue, chroma, night lightness]
//   second   second color for borders and drawings, same form as accent
//   chroma   chroma of the 6 ANSI hues
//   warm     0 to 1. Pulls the cool ANSI hues to the warm side and lowers their chroma.

const CATEGORIES = {
  seeds: 'Seeds',
  peppers: 'Peppercorns',
  chilies: 'Chilies',
  roots: 'Barks and roots',
  flowers: 'Flowers, buds and leaves',
  fruits: 'Fruits and pods',
  resins: 'Resins',
  blends: 'Blends',
};

// The whole forms. Each one returns { form, size, color, color2, ... }.
// size is the length of 1 piece in cm. The options set the shape:
//   berry   wrinkle, ribs, tail, elong, mode: plain kidney crown tri pores papery sticky
//   seed    w, flat, curve, ridges, stalk, wrinkle, mode: spindle angular box teardrop flat
//   pod     w, curve, segments, mode: cardamom black vanilla tamarind selim
//   quill   r, layers, thick, mode: cinnamon cassia stick
//   chili   r, wrinkle, curve, stem, mode: long wide round lantern short
//   flake   mode: chili grain slice rind peel mace herb chunk nori
//   rhizome rings, mode: ginger finger ringed taproot stout chunk
//   thread  mode: saffron safflower
//   bud     mode: lavender rose
//   tear    mode: clear lump
// gloss (0 to 1), sss (light through the piece) and bloom (a dusty coat)
// apply to every form.
const form = name => (size, color, color2, o = {}) => ({ form: name, size, color, color2, ...o });
const berry = form('berry'), seed = form('seed'), pod = form('pod'), star = form('star');
const quill = form('quill'), clove = form('clove'), chili = form('chili'), flake = form('flake');
const rhizome = form('rhizome'), nutmeg = form('nutmeg'), thread = form('thread'), bud = form('bud');
const calyx = form('calyx'), tear = form('tear'), leaf = form('leaf'), husk = form('husk'), catkin = form('catkin');

const TABLE = [
  // Seeds
  ['Cumin', 'seeds', 'Long, ridged seeds with a warm, earthy taste. Cooks toast them in oil at the start of a curry or a chili.', {
    latin: 'Cuminum cyminum', part: 'Seed', origin: 'Eastern Mediterranean to South Asia', notes: ['earthy', 'warm', 'nutty'], heat: 0,
    whole: seed(.55, '#8a6a40', '#bba476', { w: .26, flat: .9, curve: .12, ridges: 9, stalk: .06 }), ground: '#7c5c35', grind: .3,
    bg: [.17, .03, 70], accent: [75, .12], second: [45, .1], chroma: .11, warm: .55 }],
  ['Caraway', 'seeds', 'Curved, dark seeds with pale ridges and a sharp, anise-like taste. They flavor rye bread, sauerkraut and aquavit.', {
    latin: 'Carum carvi', part: 'Seed', origin: 'Europe and Western Asia', notes: ['anise', 'earthy', 'peppery'], heat: 0,
    whole: seed(.5, '#4a3322', '#a88d68', { w: .2, flat: .9, curve: .4, ridges: 5 }), ground: '#5a4330', grind: .3,
    bg: [.155, .022, 25], accent: [55, .08, .8], second: [110, .08], chroma: .1, warm: .5 }],
  ['Fennel Seed', 'seeds', 'Green, ridged seeds with a sweet licorice taste. They flavor Italian sausage, and in India people chew them after a meal.', {
    latin: 'Foeniculum vulgare', part: 'Seed', origin: 'Mediterranean', notes: ['sweet', 'licorice', 'fresh'], heat: 0,
    whole: seed(.65, '#8f9455', '#c9c48f', { w: .3, flat: .85, curve: .18, ridges: 5 }), ground: '#9d9763', grind: .3,
    bg: [.18, .03, 112], accent: [110, .11], second: [80, .08], chroma: .1, warm: .35 }],
  ['Anise Seed', 'seeds', 'Small, grey-green seeds with a strong licorice taste. They flavor ouzo, pastis and anise cookies.', {
    latin: 'Pimpinella anisum', part: 'Seed', origin: 'Eastern Mediterranean', notes: ['licorice', 'sweet', 'warm'], heat: 0,
    whole: seed(.4, '#8a8664', '#b7b291', { w: .42, flat: .9, curve: .06, ridges: 8, stalk: .25 }), ground: '#9a9372', grind: .3,
    bg: [.17, .016, 150], accent: [100, .07, .84], second: [320, .08], chroma: .1, warm: .3 }],
  ['Coriander Seed', 'seeds', 'Round, ribbed seeds with a citrus and floral taste. They are the dried fruit of the cilantro plant.', {
    latin: 'Coriandrum sativum', part: 'Seed', origin: 'Mediterranean and the Middle East', notes: ['citrus', 'floral', 'warm'], heat: 0,
    whole: berry(.42, '#bf9a62', '#9c7a48', { ribs: 10, wrinkle: .1, mode: 'crown' }), ground: '#a8875c', grind: .4,
    bg: [.18, .028, 58], accent: [94, .11], second: [140, .09], chroma: .11, warm: .45 }],
  ['Dill Seed', 'seeds', 'Flat, oval seeds with a pale edge. They give dill pickles their sharp taste.', {
    latin: 'Anethum graveolens', part: 'Seed', origin: 'Eastern Mediterranean and Western Asia', notes: ['grassy', 'sharp', 'caraway'], heat: 0,
    whole: seed(.42, '#5d4a32', '#c2ae84', { w: .55, flat: .32, ridges: 3, mode: 'flat' }), ground: '#6f5a3f', grind: .3,
    bg: [.165, .02, 165], accent: [80, .07, .82], second: [150, .09], chroma: .1, warm: .3 }],
  ['Celery Seed', 'seeds', 'Very small seeds with a strong, bitter celery taste. A pinch flavors coleslaw, potato salad and a Bloody Mary.', {
    latin: 'Apium graveolens', part: 'Seed', origin: 'Mediterranean', notes: ['grassy', 'bitter', 'savory'], heat: 0,
    whole: seed(.16, '#6a5838', '#9a8a62', { w: .55, ridges: 5 }), ground: '#766546', grind: .3,
    bg: [.16, .026, 128], accent: [125, .1], second: [70, .07], chroma: .1, warm: .35 }],
  ['Ajwain', 'seeds', 'Small, striped seeds with a strong thyme taste. Indian cooks fry them in ghee for breads, pakoras and dals.', {
    latin: 'Trachyspermum ammi', part: 'Seed', origin: 'Eastern Mediterranean and India', notes: ['thyme', 'pungent', 'bitter'], heat: 0,
    whole: seed(.22, '#8b765a', '#bba987', { w: .5, ridges: 5, curve: .1 }), ground: '#8d7a5c', grind: .3,
    bg: [.17, .014, 95], accent: [92, .06, .82], second: [145, .09], chroma: .1, warm: .4 }],
  ['Nigella', 'seeds', 'Small, black, angular seeds with an onion and pepper taste. They go on naan and into the Bengali blend panch phoron.', {
    latin: 'Nigella sativa', part: 'Seed', origin: 'Southwest Asia', notes: ['onion', 'peppery', 'bitter'], heat: 0,
    whole: seed(.3, '#1a1816', '#3a3632', { w: .6, mode: 'angular', wrinkle: .5, gloss: .1 }), ground: '#2c2724', grind: .4,
    bg: [.13, .008, 255], accent: [255, .03, .86], second: [95, .09], chroma: .1, warm: .2 }],
  ['Fenugreek', 'seeds', 'Hard, small, yellow-brown seeds shaped like boxes. They taste bitter when raw and like maple syrup when toasted.', {
    latin: 'Trigonella foenum-graecum', part: 'Seed', origin: 'Mediterranean and Western Asia', notes: ['bitter', 'maple', 'nutty'], heat: 0,
    whole: seed(.36, '#b07a2e', '#86561c', { w: .62, flat: .7, mode: 'box', gloss: .35 }), ground: '#c69a42', grind: .3,
    bg: [.18, .036, 82], accent: [80, .14], second: [132, .08], chroma: .12, warm: .5 }],
  ['Yellow Mustard Seed', 'seeds', 'Small, pale yellow seeds with a mild heat. They are the base of mild yellow mustard.', {
    latin: 'Sinapis alba', part: 'Seed', origin: 'Mediterranean', notes: ['tangy', 'mild', 'sharp'], heat: 1,
    whole: berry(.2, '#d8b45e', '#bf9a48', { wrinkle: .05 }), ground: '#e0c05a', grind: .2,
    bg: [.18, .032, 98], accent: [96, .14, .86], second: [40, .1], chroma: .12, warm: .45 }],
  ['Brown Mustard Seed', 'seeds', 'Very small, reddish-brown seeds. They pop in hot oil in Indian cooking and give Dijon mustard its heat.', {
    latin: 'Brassica juncea', part: 'Seed', origin: 'Himalayan foothills and India', notes: ['sharp', 'nutty', 'pungent'], heat: 2,
    whole: berry(.15, '#5a321e', '#7a4a2e', { wrinkle: .15 }), ground: '#8a6a3c', grind: .3,
    bg: [.16, .03, 38], accent: [45, .1], second: [100, .11], chroma: .11, warm: .55 }],
  ['White Sesame', 'seeds', 'Flat, cream-white seeds with a nutty taste. Toasted, they go on buns and sushi. Ground, they become tahini.', {
    latin: 'Sesamum indicum', part: 'Seed', origin: 'Africa and India', notes: ['nutty', 'sweet', 'toasty'], heat: 0,
    whole: seed(.32, '#e8dbbd', '#d2bf96', { w: .58, flat: .32, mode: 'teardrop' }), ground: '#d6c19b', grind: .2,
    bg: [.2, .018, 75], accent: [85, .05, .9], second: [55, .09], chroma: .09, warm: .45 }],
  ['Black Sesame', 'seeds', 'Black sesame seeds have a stronger, more bitter taste than white ones. In East Asia they flavor desserts, soups and ice cream.', {
    latin: 'Sesamum indicum', part: 'Seed', origin: 'Africa and India', notes: ['nutty', 'earthy', 'bitter'], heat: 0,
    whole: seed(.32, '#1c1919', '#3a3434', { w: .58, flat: .32, mode: 'teardrop', gloss: .5 }), ground: '#3a3533', grind: .3,
    bg: [.125, .006, 300], accent: [80, .04, .9], second: [20, .09], chroma: .09, warm: .3 }],
  ['Poppy Seed', 'seeds', 'Tiny, blue-grey seeds with a mild, nutty taste. They fill strudels and cakes and go on bagels.', {
    latin: 'Papaver somniferum', part: 'Seed', origin: 'Eastern Mediterranean', notes: ['nutty', 'sweet', 'mild'], heat: 0,
    whole: berry(.11, '#4c5466', '#6a7284', { mode: 'kidney', wrinkle: .3 }), ground: '#5a5f6e', grind: .2,
    bg: [.17, .022, 255], accent: [250, .06, .82], second: [25, .14], chroma: .11, warm: .1 }],
  ['Annatto', 'seeds', 'Hard, brick-red seeds from a tropical shrub. They give a red-orange color to achiote paste, cheddar cheese and rice.', {
    latin: 'Bixa orellana', part: 'Seed', origin: 'Tropical Americas', notes: ['earthy', 'peppery', 'nutty'], heat: 0,
    whole: seed(.28, '#a0301c', '#c24a22', { w: .75, mode: 'angular', wrinkle: .3 }), ground: '#c4461f', grind: .2,
    bg: [.16, .042, 36], accent: [42, .16], second: [140, .07], chroma: .13, warm: .5 }],
  ['Mahleb', 'seeds', 'The kernel inside the pit of a wild cherry. It gives a bitter almond and cherry taste to Greek and Middle Eastern breads.', {
    latin: 'Prunus mahaleb', part: 'Seed kernel', origin: 'Middle East and the Mediterranean', notes: ['bitter almond', 'cherry', 'floral'], heat: 0,
    whole: seed(.36, '#d4b688', '#b8956a', { w: .62, flat: .55, mode: 'teardrop' }), ground: '#cfb487', grind: .2,
    bg: [.19, .022, 60], accent: [78, .07, .86], second: [12, .11], chroma: .1, warm: .45 }],
  ['Wattleseed', 'seeds', 'Roasted seeds of the Australian wattle tree. They taste of coffee, chocolate and hazelnut.', {
    latin: 'Acacia victoriae', part: 'Seed', origin: 'Australia', notes: ['coffee', 'chocolate', 'hazelnut'], heat: 0,
    whole: seed(.36, '#3c2617', '#5c3e26', { w: .65, flat: .5, mode: 'teardrop', gloss: .55 }), ground: '#4a3221', grind: .3,
    bg: [.15, .026, 50], accent: [62, .09], second: [100, .12], chroma: .11, warm: .5 }],
  ['Kala Jeera', 'seeds', 'Thin, dark, curved seeds, also called black cumin. They taste sweeter and smokier than cumin and flavor Kashmiri rice dishes.', {
    latin: 'Bunium persicum', part: 'Seed', origin: 'Central Asia, Iran and Kashmir', notes: ['smoky', 'earthy', 'sweet'], heat: 0,
    whole: seed(.5, '#2e241b', '#5a4a38', { w: .18, curve: .35, ridges: 5 }), ground: '#3f3428', grind: .3,
    bg: [.14, .014, 60], accent: [70, .06, .8], second: [30, .09], chroma: .1, warm: .5 }],
  ['Tonka Bean', 'seeds', 'Wrinkled black seeds that smell of vanilla, almond and cherry. Pastry chefs in Europe grate them like nutmeg.', {
    latin: 'Dipteryx odorata', part: 'Seed', origin: 'Northern South America', notes: ['vanilla', 'almond', 'cherry'], heat: 0,
    whole: seed(2.6, '#1c140f', '#3a2a1e', { w: .36, flat: .55, curve: .1, mode: 'teardrop', wrinkle: 1, gloss: .4 }), ground: '#5a4636', grind: .4,
    bg: [.135, .02, 30], accent: [82, .06, .9], second: [15, .1], chroma: .1, warm: .5 }],

  // Peppercorns
  ['Black Pepper', 'peppers', 'The dried, unripe fruit of a climbing vine. It is the most traded spice in the world.', {
    latin: 'Piper nigrum', part: 'Fruit', origin: 'Malabar Coast, India', notes: ['sharp', 'woody', 'piney'], heat: 2,
    whole: berry(.45, '#2a211b', '#54432f', { wrinkle: .75 }), ground: '#3e352b', grind: .9,
    bg: [.13, .008, 65], accent: [58, .08], second: [150, .08], chroma: .1, warm: .4 }],
  ['White Pepper', 'peppers', 'Ripe peppercorns soaked to remove the skin. They give heat to pale sauces and have an earthy, musky smell.', {
    latin: 'Piper nigrum', part: 'Seed', origin: 'India and Southeast Asia', notes: ['earthy', 'musky', 'hot'], heat: 2,
    whole: berry(.4, '#d3c4a4', '#b49f78', { wrinkle: .12 }), ground: '#dacdb0', grind: .3,
    bg: [.2, .01, 90], accent: [85, .03, .9], second: [60, .07], chroma: .08, warm: .4 }],
  ['Green Peppercorn', 'peppers', 'Unripe peppercorns dried at a low heat, so they stay green. They taste milder and fresher than black pepper.', {
    latin: 'Piper nigrum', part: 'Fruit', origin: 'India', notes: ['fresh', 'bright', 'herbal'], heat: 1,
    whole: berry(.42, '#66763a', '#8d9a58', { wrinkle: .6 }), ground: '#7d8a4c', grind: .5,
    bg: [.16, .032, 132], accent: [126, .12], second: [92, .08], chroma: .11, warm: .3 }],
  ['Pink Peppercorn', 'peppers', 'Papery pink berries from a South American tree. They are not true pepper, and they taste sweet, fruity and of pine.', {
    latin: 'Schinus terebinthifolia', part: 'Fruit', origin: 'South America', notes: ['sweet', 'resinous', 'fruity'], heat: 1,
    whole: berry(.45, '#bf4658', '#6e1c2c', { wrinkle: .3, mode: 'papery', gloss: .4, sss: .5 }), ground: '#b45a68', grind: .4,
    bg: [.17, .036, 5], accent: [5, .13], second: [72, .08], chroma: .12, warm: .2 }],
  ['Long Pepper', 'peppers', 'Small spikes packed with tiny fruits. It is hotter and sweeter than black pepper and was common in ancient Rome.', {
    latin: 'Piper longum', part: 'Fruit spike', origin: 'India', notes: ['hot', 'sweet', 'earthy'], heat: 3,
    whole: catkin(3.2, '#3a3128', '#665645', { r: .13 }), ground: '#5a4c3e', grind: .6,
    bg: [.15, .015, 230], accent: [68, .07, .8], second: [28, .11], chroma: .1, warm: .4 }],
  ['Cubeb', 'peppers', 'Peppercorns with a short tail, from Java. They taste of pine and allspice with a bitter finish.', {
    latin: 'Piper cubeba', part: 'Fruit', origin: 'Java, Indonesia', notes: ['piney', 'peppery', 'bitter'], heat: 2,
    whole: berry(.45, '#3a2a20', '#5a4838', { wrinkle: .6, tail: .9 }), ground: '#4d3e31', grind: .7,
    bg: [.13, .016, 170], accent: [58, .09], second: [150, .1], chroma: .11, warm: .4 }],
  ['Sichuan Pepper', 'peppers', 'Split, red husks from a prickly ash tree. They make the mouth tingle and go numb.', {
    latin: 'Zanthoxylum bungeanum', part: 'Fruit husk', origin: 'Sichuan, China', notes: ['citrus', 'numbing', 'woody'], heat: 2,
    whole: husk(.45, '#9a3a24', '#c99a7a', { seeds: .15 }), ground: '#8a4c36', grind: .5,
    bg: [.13, .036, 0], accent: [32, .15], second: [130, .12], chroma: .13, warm: .4 }],
  ['Sansho', 'peppers', 'The Japanese prickly ash. Its ground husks have a lemony, numbing taste and go on grilled eel.', {
    latin: 'Zanthoxylum piperitum', part: 'Fruit husk', origin: 'Japan', notes: ['lemon', 'numbing', 'bright'], heat: 1,
    whole: husk(.38, '#6d6a3a', '#bcb48a', { seeds: .25 }), ground: '#8e8a50', grind: .3, word: 'stencil',
    bg: [.16, .03, 112], accent: [108, .12], second: [60, .08], chroma: .11, warm: .3 }],
  ['Grains of Paradise', 'peppers', 'Small, glossy, red-brown seeds from the ginger family. They taste of pepper with notes of citrus and cardamom.', {
    latin: 'Aframomum melegueta', part: 'Seed', origin: 'West Africa', notes: ['peppery', 'citrus', 'floral'], heat: 2,
    whole: seed(.3, '#6a3020', '#8c4a2c', { w: .8, mode: 'angular', gloss: .6 }), ground: '#6f4b36', grind: .5,
    bg: [.15, .028, 75], accent: [32, .13], second: [95, .12], chroma: .12, warm: .45 }],
  ['Tasmanian Pepperberry', 'peppers', 'Shiny, black-purple berries from a Tasmanian shrub. A sweet, fruity taste comes first, then a slow heat.', {
    latin: 'Tasmannia lanceolata', part: 'Fruit', origin: 'Tasmania, Australia', notes: ['hot', 'fruity', 'juniper'], heat: 3,
    whole: berry(.45, '#1f1420', '#4a2a48', { wrinkle: .85, gloss: .7 }), ground: '#4a2a42', grind: .4,
    bg: [.13, .03, 322], accent: [322, .12], second: [150, .08], chroma: .12, warm: .2 }],
  ['Grains of Selim', 'peppers', 'Thin, knobbly pods from a West African tree. Cooks smoke them for soups and for Senegalese café Touba.', {
    latin: 'Xylopia aethiopica', part: 'Fruit pod', origin: 'West Africa', notes: ['musky', 'smoky', 'bitter'], heat: 1,
    whole: pod(3.5, '#2e2016', '#4e3a28', { w: .075, mode: 'selim', segments: 7, curve: .35 }), ground: '#4a3a2c', grind: .5,
    bg: [.14, .018, 45], accent: [48, .08], second: [200, .06], chroma: .1, warm: .5 }],

  // Chilies
  ['Cayenne', 'chilies', 'Thin, red chilies, usually sold ground. The powder gives a clean heat to sauces, eggs and Cajun food.', {
    latin: 'Capsicum annuum', part: 'Fruit', origin: 'Central and South America', notes: ['hot', 'sharp', 'fruity'], heat: 4, shu: '30,000–50,000',
    whole: chili(8, '#b3241a', '#6b5a2a', { r: .075, wrinkle: .45, curve: .3, gloss: .55 }), ground: '#c0331f', grind: .2, word: 'stencil',
    bg: [.14, .012, 40], accent: [30, .18], second: [70, .1], chroma: .13, warm: .45 }],
  ['Sweet Paprika', 'chilies', 'Ground, dried sweet peppers with a fruity taste and a bright red color. It is the main flavor of Hungarian goulash.', {
    latin: 'Capsicum annuum', part: 'Fruit', origin: 'Hungary and Spain', notes: ['sweet', 'fruity', 'mild'], heat: 0, shu: '100–500',
    whole: chili(10, '#a6221c', '#6b5a2a', { r: .16, wrinkle: .6, gloss: .35 }), ground: '#c23b22', grind: .1, word: 'stencil',
    bg: [.165, .045, 30], accent: [32, .16], second: [145, .09], chroma: .13, warm: .45 }],
  ['Smoked Paprika', 'chilies', 'Peppers dried over oak smoke in La Vera, Spain, then ground. It gives chorizo its smoky taste.', {
    latin: 'Capsicum annuum', part: 'Fruit', origin: 'La Vera, Spain', notes: ['smoky', 'sweet', 'earthy'], heat: 1, shu: '100–1,000',
    whole: chili(9, '#7b1f16', '#5a4a26', { r: .17, wrinkle: .65, gloss: .25 }), ground: '#8e2b1a', grind: .1, word: 'stencil',
    bg: [.14, .034, 40], accent: [36, .13], second: [65, .06, .78], chroma: .12, warm: .55 }],
  ['Chipotle', 'chilies', 'Ripe jalapeños dried in smoke until they are brown and leathery. They taste of smoke, tobacco and chocolate.', {
    latin: 'Capsicum annuum', part: 'Fruit', origin: 'Mexico', notes: ['smoky', 'sweet', 'earthy'], heat: 3, shu: '2,500–8,000',
    whole: chili(6, '#5c3a28', '#6b5a2a', { r: .19, wrinkle: 1, mode: 'short', gloss: .15 }), ground: '#6e3b27', grind: .3,
    bg: [.15, .026, 55], accent: [52, .1], second: [25, .12], chroma: .11, warm: .55 }],
  ['Ancho', 'chilies', 'Dried poblano peppers. They are wide, dark and wrinkled, and their sweet, raisin taste is a base for mole sauces.', {
    latin: 'Capsicum annuum', part: 'Fruit', origin: 'Puebla, Mexico', notes: ['raisin', 'sweet', 'mild'], heat: 1, shu: '1,000–2,000',
    whole: chili(10, '#4c1a12', '#3a3418', { r: .26, wrinkle: .85, mode: 'wide', gloss: .6 }), ground: '#5c2519', grind: .3,
    bg: [.13, .03, 18], accent: [20, .1, .74], second: [72, .08], chroma: .11, warm: .55 }],
  ['Guajillo', 'chilies', 'Long, smooth, glossy chilies with a tangy, berry taste. They color and flavor many Mexican salsas and stews.', {
    latin: 'Capsicum annuum', part: 'Fruit', origin: 'Mexico', notes: ['berry', 'tangy', 'tea'], heat: 2, shu: '2,500–5,000',
    whole: chili(12, '#781612', '#5a4a26', { r: .11, wrinkle: .25, gloss: .85 }), ground: '#8f2a1c', grind: .3,
    bg: [.145, .042, 22], accent: [22, .15], second: [88, .08], chroma: .12, warm: .5 }],
  ['Pasilla', 'chilies', 'Long, wrinkled, almost black chilies. The name means little raisin, and they taste of dried fruit and cocoa.', {
    latin: 'Capsicum annuum', part: 'Fruit', origin: 'Mexico', notes: ['raisin', 'cocoa', 'earthy'], heat: 2, shu: '1,000–2,500',
    whole: chili(15, '#1e1214', '#4a3a22', { r: .07, wrinkle: .9, gloss: .5 }), ground: '#3a2420', grind: .3,
    bg: [.12, .014, 10], accent: [18, .08, .74], second: [55, .08], chroma: .1, warm: .5 }],
  ['Chile de Árbol', 'chilies', 'Thin, bright red chilies that keep their color when dried. They give a clean, strong heat to salsas and chili oils.', {
    latin: 'Capsicum annuum', part: 'Fruit', origin: 'Mexico', notes: ['hot', 'grassy', 'nutty'], heat: 4, shu: '15,000–30,000',
    whole: chili(6.5, '#c22a1a', '#7a6a32', { r: .065, wrinkle: .2, curve: .2, gloss: .75, stem: .5 }), ground: '#c43a20', grind: .3,
    bg: [.15, .036, 32], accent: [30, .18], second: [140, .12], chroma: .14, warm: .4 }],
  ['Kashmiri Chili', 'chilies', 'Wrinkled, deep red chilies with a mild heat. They give rogan josh and tandoori chicken their red color.', {
    latin: 'Capsicum annuum', part: 'Fruit', origin: 'Kashmir, India', notes: ['fruity', 'mild', 'earthy'], heat: 1, shu: '1,000–2,000',
    whole: chili(8, '#981a1a', '#5a4a26', { r: .12, wrinkle: .9, gloss: .35 }), ground: '#b52b22', grind: .2,
    bg: [.15, .04, 355], accent: [16, .16, .7], second: [86, .1], chroma: .13, warm: .4 }],
  ["Bird's Eye Chili", 'chilies', 'Small, thin chilies with a strong heat. They are common in Thai, Vietnamese and Indonesian food.', {
    latin: 'Capsicum annuum', part: 'Fruit', origin: 'Southeast Asia', notes: ['hot', 'sharp', 'fruity'], heat: 4, shu: '50,000–100,000',
    whole: chili(3.5, '#b81e18', '#6a7a32', { r: .09, wrinkle: .3, gloss: .6, stem: .45 }), ground: '#c02a1c', grind: .3,
    bg: [.15, .03, 150], accent: [28, .17], second: [145, .13], chroma: .14, warm: .3 }],
  ['Habanero', 'chilies', 'Lantern-shaped, orange chilies with a fruity, floral smell. They are among the hottest common chilies.', {
    latin: 'Capsicum chinense', part: 'Fruit', origin: 'Yucatán, Mexico and the Caribbean', notes: ['fruity', 'floral', 'very hot'], heat: 5, shu: '100,000–350,000',
    whole: chili(4.2, '#d8641c', '#6a6a2a', { r: .38, wrinkle: .8, mode: 'lantern', gloss: .5 }), ground: '#d06b2b', grind: .3,
    bg: [.16, .046, 52], accent: [56, .17], second: [130, .1], chroma: .14, warm: .4 }],
  ['Ghost Pepper', 'chilies', 'Bhut jolokia from Northeast India. In 2007 it was the hottest chili in the world, at more than 1 million Scoville units.', {
    latin: 'Capsicum chinense', part: 'Fruit', origin: 'Northeast India', notes: ['smoky', 'fruity', 'extreme heat'], heat: 5, shu: '855,000–1,041,000',
    whole: chili(6, '#9c1c14', '#5a5226', { r: .17, wrinkle: 1, gloss: .4 }), ground: '#a8291d', grind: .3,
    bg: [.125, .03, 300], accent: [25, .16], second: [300, .09], chroma: .14, warm: .3 }],
  ['Cascabel', 'chilies', 'Small, round chilies. The loose seeds rattle inside, and the name means little bell.', {
    latin: 'Capsicum annuum', part: 'Fruit', origin: 'Mexico', notes: ['nutty', 'woody', 'smoky'], heat: 2, shu: '1,000–3,000',
    whole: chili(3.6, '#6a1e16', '#5a4a26', { r: .45, wrinkle: .3, mode: 'round', gloss: .7 }), ground: '#7c2b1f', grind: .3,
    bg: [.15, .034, 34], accent: [30, .12], second: [86, .08], chroma: .12, warm: .5 }],
  ['Aleppo Pepper', 'chilies', 'Coarse, oily, deep red flakes with a moderate heat. They taste fruity, like sun-dried tomato.', {
    latin: 'Capsicum annuum', part: 'Fruit', origin: 'Aleppo, Syria and southern Turkey', notes: ['fruity', 'tangy', 'oily'], heat: 2, shu: 'about 10,000',
    whole: flake(.5, '#8c2017', '#d4a050', { mode: 'chili', gloss: .5 }), ground: '#9a2c1e', grind: .8,
    bg: [.15, .026, 62], accent: [18, .14], second: [85, .08], chroma: .12, warm: .45 }],
  ['Urfa Biber', 'chilies', 'Turkish chilies dried in the sun by day and wrapped at night, so they turn purple-black. The flakes taste of raisins and smoke.', {
    latin: 'Capsicum annuum', part: 'Fruit', origin: 'Şanlıurfa, Turkey', notes: ['smoky', 'raisin', 'chocolate'], heat: 2, shu: 'about 7,500',
    whole: flake(.5, '#2b1012', '#5a2a24', { mode: 'chili', gloss: .65 }), ground: '#3f1819', grind: .8,
    bg: [.12, .022, 25], accent: [355, .1, .76], second: [55, .08], chroma: .11, warm: .45 }],
  ['Gochugaru', 'chilies', 'Korean chili flakes, dried in the sun and without seeds. They give kimchi its red color and a sweet, mild heat.', {
    latin: 'Capsicum annuum', part: 'Fruit', origin: 'Korea', notes: ['sweet', 'smoky', 'fruity'], heat: 2, shu: '4,000–8,000',
    whole: flake(.35, '#c42a1c', '#c42a1c', { mode: 'chili', seeds: 0, gloss: .25 }), ground: '#c83a24', grind: .7,
    bg: [.15, .036, 250], accent: [30, .17], second: [140, .08], chroma: .14, warm: .3 }],
  ['Espelette Pepper', 'chilies', 'A Basque chili with a protected name. Villages dry it on strings on house walls, and the powder has a mild, fruity heat.', {
    latin: 'Capsicum annuum', part: 'Fruit', origin: 'Basque Country, France', notes: ['fruity', 'sweet', 'gentle heat'], heat: 2, shu: 'about 4,000',
    whole: chili(8, '#c1321e', '#5a5a26', { r: .11, wrinkle: .5, gloss: .55 }), ground: '#c8552a', grind: .15, word: 'stencil',
    bg: [.16, .03, 150], accent: [40, .15], second: [150, .1], chroma: .13, warm: .35 }],
  ['Ají Amarillo', 'chilies', 'The yellow chili of Peru, with a fruity heat. Dried, it is called ají mirasol and flavors many Peruvian sauces.', {
    latin: 'Capsicum baccatum', part: 'Fruit', origin: 'Peru', notes: ['fruity', 'bright', 'hot'], heat: 3, shu: '30,000–50,000',
    whole: chili(10, '#d27e1e', '#6a6a2a', { r: .1, wrinkle: .6, gloss: .55 }), ground: '#df9a2c', grind: .2,
    bg: [.16, .03, 292], accent: [70, .16], second: [30, .12], chroma: .13, warm: .35 }],

  // Barks and roots
  ['Ceylon Cinnamon', 'roots', 'Thin layers of inner bark rolled into soft, brittle quills. It is true cinnamon, sweeter and milder than cassia.', {
    latin: 'Cinnamomum verum', part: 'Inner bark', origin: 'Sri Lanka', notes: ['sweet', 'delicate', 'citrus'], heat: 0,
    whole: quill(9, '#b38049', '#8c5c32', { r: .055, layers: 6, thick: .006, mode: 'cinnamon' }), ground: '#a8713c', grind: .1,
    bg: [.18, .036, 58], accent: [60, .11], second: [35, .09], chroma: .11, warm: .55 }],
  ['Cassia', 'roots', 'Thick, hard rolls of bark. Most cinnamon sold in North America is cassia, with a stronger and hotter taste.', {
    latin: 'Cinnamomum cassia', part: 'Bark', origin: 'Southern China', notes: ['strong', 'sweet', 'spicy'], heat: 1,
    whole: quill(9, '#7a3f22', '#5a2c17', { r: .07, layers: 1.6, thick: .013, mode: 'cassia' }), ground: '#8a4b29', grind: .1,
    bg: [.15, .04, 42], accent: [42, .13], second: [70, .08], chroma: .12, warm: .55 }],
  ['Ginger', 'roots', 'Dried pieces of the ginger rhizome. Its warm, pungent taste is in gingerbread, ginger beer and curries.', {
    latin: 'Zingiber officinale', part: 'Rhizome', origin: 'Maritime Southeast Asia', notes: ['pungent', 'warm', 'citrus'], heat: 2,
    whole: rhizome(6, '#c7a679', '#e6d19f', { mode: 'ginger' }), ground: '#d6b98a', grind: .1,
    bg: [.19, .03, 84], accent: [86, .12], second: [55, .1], chroma: .11, warm: .45 }],
  ['Turmeric', 'roots', 'A rhizome with a bright orange inside. Ground turmeric gives curry its yellow color and an earthy, bitter taste.', {
    latin: 'Curcuma longa', part: 'Rhizome', origin: 'South Asia', notes: ['earthy', 'bitter', 'peppery'], heat: 0,
    whole: rhizome(5, '#8a5a28', '#e08912', { mode: 'finger', rings: .5 }), ground: '#e3a21b', grind: .05,
    bg: [.17, .046, 68], accent: [75, .17], second: [40, .1], chroma: .14, warm: .45 }],
  ['Galangal', 'roots', 'A firm, ringed rhizome related to ginger. It tastes of pine and citrus and is a key flavor of Thai tom kha soup.', {
    latin: 'Alpinia galanga', part: 'Rhizome', origin: 'Southeast Asia', notes: ['piney', 'citrus', 'peppery'], heat: 1,
    whole: rhizome(7, '#c99b7c', '#efdab6', { mode: 'ginger', rings: 1 }), ground: '#c9a984', grind: .15,
    bg: [.18, .028, 30], accent: [28, .09, .8], second: [95, .08], chroma: .11, warm: .4 }],
  ['Licorice Root', 'roots', 'Woody root sticks with a yellow inside. Its glycyrrhizin is 30 to 50 times sweeter than sugar.', {
    latin: 'Glycyrrhiza glabra', part: 'Root', origin: 'Southern Europe and Western Asia', notes: ['sweet', 'anise', 'bitter'], heat: 0,
    whole: quill(10, '#6a4a2a', '#d8b85a', { r: .045, mode: 'stick' }), ground: '#c9a866', grind: .2,
    bg: [.15, .024, 60], accent: [92, .12], second: [45, .08], chroma: .11, warm: .5 }],
  ['Orris Root', 'roots', 'The dried rhizome of the iris. It smells of violets and is a rare part of ras el hanout and of gin.', {
    latin: 'Iris pallida', part: 'Rhizome', origin: 'Tuscany, Italy', notes: ['violet', 'floral', 'earthy'], heat: 0,
    whole: rhizome(3.5, '#ddd0b2', '#efe5cc', { mode: 'chunk' }), ground: '#e6dcc6', grind: .1,
    bg: [.17, .022, 298], accent: [295, .1], second: [85, .05, .88], chroma: .11, warm: .2 }],
  ['Horseradish', 'roots', 'A white root with a sharp heat that rises to the nose. Dried and ground, it makes a fast horseradish sauce.', {
    latin: 'Armoracia rusticana', part: 'Root', origin: 'Southeastern Europe and Western Asia', notes: ['sharp', 'pungent', 'mustard'], heat: 3,
    whole: rhizome(15, '#c6b08a', '#f2ead6', { mode: 'taproot' }), ground: '#ece2c7', grind: .1, word: 'stencil',
    bg: [.19, .014, 105], accent: [100, .04, .9], second: [135, .09], chroma: .09, warm: .35 }],
  ['Wasabi', 'roots', 'A green rhizome from Japanese mountain streams. Real wasabi is rare, so most wasabi powder is horseradish and mustard with a green color.', {
    latin: 'Eutrema japonicum', part: 'Rhizome', origin: 'Japan', notes: ['sharp', 'sweet', 'green'], heat: 3,
    whole: rhizome(10, '#6a8848', '#a9c47b', { mode: 'stout' }), ground: '#b5c98b', grind: .05, word: 'stencil',
    bg: [.15, .036, 142], accent: [130, .13], second: [92, .05, .88], chroma: .12, warm: .2 }],

  // Flowers, buds and leaves
  ['Saffron', 'flowers', 'The red stigmas of a crocus, picked by hand. About 150 flowers make 1 gram, so it is the most expensive spice.', {
    latin: 'Crocus sativus', part: 'Stigma', origin: 'Iran and the Eastern Mediterranean', notes: ['honey', 'hay', 'floral'], heat: 0,
    whole: thread(2.5, '#b8200e', '#e8a228', { mode: 'saffron', sss: .6 }), ground: '#d4661b', grind: .1,
    bg: [.15, .046, 38], accent: [40, .17], second: [300, .1], chroma: .14, warm: .4 }],
  ['Clove', 'flowers', 'Dried flower buds shaped like small nails. Their strong, numbing taste flavors ham, mulled wine and garam masala.', {
    latin: 'Syzygium aromaticum', part: 'Flower bud', origin: 'Maluku Islands, Indonesia', notes: ['warm', 'sweet', 'numbing'], heat: 1,
    whole: clove(1.5, '#4a2a1a', '#7a4a2a'), ground: '#5a3b27', grind: .2,
    bg: [.14, .03, 36], accent: [45, .1], second: [12, .1], chroma: .11, warm: .55 }],
  ['Lavender', 'flowers', 'Dried buds of English lavender. A little gives a floral taste to herbes de Provence, honey and shortbread.', {
    latin: 'Lavandula angustifolia', part: 'Flower bud', origin: 'Mediterranean', notes: ['floral', 'camphor', 'sweet'], heat: 0,
    whole: bud(.6, '#665a8c', '#8c80ae', { mode: 'lavender' }), ground: '#7a6f98', grind: .3,
    bg: [.17, .036, 295], accent: [295, .12], second: [140, .06], chroma: .12, warm: .2 }],
  ['Rose', 'flowers', 'Dried buds and petals of the damask rose. They flavor Persian rice, ras el hanout and Turkish delight.', {
    latin: 'Rosa × damascena', part: 'Flower', origin: 'Iran and the Middle East', notes: ['floral', 'sweet', 'fruity'], heat: 0,
    whole: bud(1.6, '#b4465a', '#6b8a4c', { mode: 'rose', sss: .4 }), ground: '#c46c7b', grind: .3,
    bg: [.17, .034, 355], accent: [358, .12], second: [145, .07], chroma: .12, warm: .2 }],
  ['Hibiscus', 'flowers', 'Dried, deep red calyxes of the roselle plant. They make tart, red drinks such as bissap and agua de jamaica.', {
    latin: 'Hibiscus sabdariffa', part: 'Calyx', origin: 'West Africa', notes: ['tart', 'cranberry', 'floral'], heat: 0,
    whole: calyx(2.6, '#6c0f24', '#9a1d3b', { sss: .4, gloss: .5 }), ground: '#8a1b31', grind: .3,
    bg: [.14, .05, 8], accent: [10, .16], second: [330, .1], chroma: .14, warm: .25 }],
  ['Safflower', 'flowers', 'Orange-red florets with a mild taste. Cooks use them for color, and some sellers call them false saffron.', {
    latin: 'Carthamus tinctorius', part: 'Floret', origin: 'Western Asia', notes: ['earthy', 'floral', 'mild'], heat: 0,
    whole: thread(1.6, '#df741c', '#f2b12c', { mode: 'safflower', sss: .5 }), ground: '#df8a2c', grind: .2,
    bg: [.17, .04, 58], accent: [55, .16], second: [95, .12], chroma: .13, warm: .4 }],
  ['Bay Leaf', 'flowers', 'Dried leaves of the bay laurel. Cooks simmer a leaf or 2 in soups and stews, then remove them before serving.', {
    latin: 'Laurus nobilis', part: 'Leaf', origin: 'Mediterranean', notes: ['herbal', 'floral', 'bitter'], heat: 0,
    whole: leaf(7, '#86955a', '#b9c08b', { w: .32, curl: .3 }), ground: '#9aa36b', grind: .3, word: 'stencil',
    bg: [.17, .026, 120], accent: [115, .09], second: [72, .06], chroma: .1, warm: .35 }],
  ['Fennel Pollen', 'flowers', 'Pollen from wild fennel flowers, collected by hand. Its sweet taste of licorice and honey is strong, so cooks use a pinch.', {
    latin: 'Foeniculum vulgare', part: 'Pollen', origin: 'Tuscany, Italy', notes: ['licorice', 'honey', 'citrus'], heat: 0,
    whole: null, mix: [['Fennel Seed', 1]], ground: '#bea43c', grind: .05, word: 'stencil',
    bg: [.18, .036, 100], accent: [100, .14], second: [130, .08], chroma: .12, warm: .35 }],

  // Fruits and pods
  ['Green Cardamom', 'fruits', 'Small, green, three-sided pods full of black seeds. They flavor chai, Nordic buns and Arabic coffee.', {
    latin: 'Elettaria cardamomum', part: 'Fruit pod', origin: 'Western Ghats, India', notes: ['citrus', 'eucalyptus', 'floral'], heat: 0,
    whole: pod(1.4, '#8a9a50', '#b7be7c', { w: .5, mode: 'cardamom' }), ground: '#7a6a4a', grind: .4,
    bg: [.16, .036, 140], accent: [135, .12], second: [92, .07, .86], chroma: .12, warm: .25 }],
  ['Black Cardamom', 'fruits', 'Large, wrinkled pods dried over open fires. They give a smoky, camphor taste to biryani and pho.', {
    latin: 'Amomum subulatum', part: 'Fruit pod', origin: 'Eastern Himalayas', notes: ['smoky', 'camphor', 'earthy'], heat: 0,
    whole: pod(3.5, '#2e221b', '#4e3b2f', { w: .45, mode: 'black' }), ground: '#4a3a30', grind: .4,
    bg: [.13, .02, 200], accent: [45, .08], second: [180, .07], chroma: .1, warm: .4 }],
  ['Vanilla', 'fruits', 'The cured pods of an orchid. Curing takes months, and it is the second most expensive spice after saffron.', {
    latin: 'Vanilla planifolia', part: 'Fruit pod', origin: 'Mexico', notes: ['sweet', 'creamy', 'floral'], heat: 0,
    whole: pod(17, '#1d130d', '#3a2618', { w: .05, mode: 'vanilla', gloss: .85 }), ground: '#3a2b21', grind: .3, word: 'stencil',
    bg: [.14, .018, 62], accent: [86, .06, .9], second: [50, .09], chroma: .1, warm: .5 }],
  ['Star Anise', 'fruits', 'Star-shaped fruits with 8 points, each with a glossy seed. It is a main flavor of pho and Chinese five-spice.', {
    latin: 'Illicium verum', part: 'Fruit', origin: 'Southern China and Vietnam', notes: ['licorice', 'sweet', 'warm'], heat: 0,
    whole: star(3, '#6a381f', '#b0703c'), ground: '#6e4631', grind: .3,
    bg: [.15, .036, 46], accent: [50, .12], second: [320, .07], chroma: .12, warm: .5 }],
  ['Allspice', 'fruits', 'Dried berries from Jamaica. They taste like clove, cinnamon and nutmeg together.', {
    latin: 'Pimenta dioica', part: 'Fruit', origin: 'Jamaica and Central America', notes: ['clove', 'cinnamon', 'nutmeg'], heat: 0,
    whole: berry(.7, '#5a3220', '#7a4a2e', { wrinkle: .3, mode: 'crown' }), ground: '#6a4431', grind: .3,
    bg: [.15, .03, 30], accent: [40, .1], second: [142, .1], chroma: .12, warm: .5 }],
  ['Juniper', 'fruits', 'Blue-black berries with a dusty bloom. They give gin its pine taste and season game and sauerkraut.', {
    latin: 'Juniperus communis', part: 'Seed cone', origin: 'Northern Europe', notes: ['pine', 'citrus', 'resin'], heat: 0,
    whole: berry(.75, '#272238', '#5a6890', { wrinkle: .2, mode: 'tri', bloom: .7 }), ground: '#3b3349', grind: .4,
    bg: [.14, .03, 272], accent: [265, .1], second: [150, .08], chroma: .12, warm: .15 }],
  ['Sumac', 'fruits', "Ground, dried berries with a tart, lemony taste. It goes on fattoush, kebabs and onions, and it is part of za'atar.", {
    latin: 'Rhus coriaria', part: 'Fruit', origin: 'Middle East', notes: ['tart', 'lemon', 'fruity'], heat: 0,
    whole: flake(.22, '#7a1b2b', '#a8333c', { mode: 'grain' }), ground: '#7e2031', grind: .7, word: 'stencil',
    bg: [.14, .046, 4], accent: [10, .14], second: [85, .06], chroma: .13, warm: .3 }],
  ['Tamarind', 'fruits', 'Brown pods with a sticky, sour-sweet pulp. It gives the sour taste to pad thai, Worcestershire sauce and many chutneys.', {
    latin: 'Tamarindus indica', part: 'Fruit pod', origin: 'Tropical Africa', notes: ['sour', 'sweet', 'fruity'], heat: 0,
    whole: pod(12, '#8c5c35', '#4a2a1a', { w: .16, mode: 'tamarind', segments: 5, curve: .3 }), ground: '#5c3121', grind: .3,
    bg: [.16, .03, 52], accent: [58, .1], second: [80, .1], chroma: .11, warm: .55 }],
  ['Amchur', 'fruits', 'Slices of unripe green mango, dried and ground. It gives a sour, fruity taste to chaat, chutneys and samosa fillings.', {
    latin: 'Mangifera indica', part: 'Fruit', origin: 'India', notes: ['sour', 'fruity', 'tangy'], heat: 0,
    whole: flake(4, '#c7a66a', '#a7874a', { mode: 'slice' }), ground: '#d7bf8b', grind: .1, word: 'stencil',
    bg: [.19, .03, 92], accent: [90, .1], second: [140, .1], chroma: .11, warm: .4 }],
  ['Dried Lime', 'fruits', 'Whole limes boiled in brine and dried in the sun until they are hollow. They give a sour, earthy taste to Persian and Gulf stews.', {
    latin: 'Citrus aurantiifolia', part: 'Fruit', origin: 'Oman and the Persian Gulf', notes: ['sour', 'earthy', 'fermented'], heat: 0,
    whole: berry(4, '#6c4c2c', '#2a1e14', { wrinkle: .35, mode: 'pores' }), ground: '#7a5b3b', grind: .4, word: 'stencil',
    bg: [.16, .026, 75], accent: [78, .09], second: [125, .11], chroma: .11, warm: .4 }],
  ['Nutmeg', 'fruits', 'The seed of a tropical evergreen tree. Grate it fresh into béchamel, eggnog and mashed potatoes.', {
    latin: 'Myristica fragrans', part: 'Seed', origin: 'Banda Islands, Indonesia', notes: ['warm', 'sweet', 'nutty'], heat: 0,
    whole: nutmeg(2.8, '#6a4a33', '#a37c5b', { mace: .25 }), ground: '#8a6a4b', grind: .2,
    bg: [.16, .025, 58], accent: [62, .09], second: [35, .14], chroma: .11, warm: .5 }],
  ['Mace', 'fruits', 'The lacy red cover around the nutmeg seed. Dried, it turns orange and tastes like a lighter, sharper nutmeg.', {
    latin: 'Myristica fragrans', part: 'Aril', origin: 'Banda Islands, Indonesia', notes: ['warm', 'peppery', 'citrus'], heat: 0,
    whole: flake(3, '#d06f1c', '#b55019', { mode: 'mace', sss: .4 }), ground: '#c98b3b', grind: .2,
    bg: [.16, .046, 46], accent: [50, .16], second: [25, .12], chroma: .13, warm: .45 }],
  ['Anardana', 'fruits', 'Dried seeds of wild pomegranates. They give a sour, fruity taste to Punjabi chole and chutneys.', {
    latin: 'Punica granatum', part: 'Seed', origin: 'India and Iran', notes: ['sour', 'fruity', 'tangy'], heat: 0,
    whole: berry(.55, '#5a1420', '#8a2a35', { wrinkle: .5, mode: 'sticky', elong: 1.3, gloss: .7, sss: .3 }), ground: '#6b2a2f', grind: .5,
    bg: [.13, .04, 12], accent: [12, .13], second: [70, .08], chroma: .12, warm: .35 }],
  ['Chenpi', 'fruits', 'Sun-dried tangerine peel that people age for years. It flavors Cantonese soups, braises and sweet red bean soup.', {
    latin: 'Citrus reticulata', part: 'Fruit peel', origin: 'Guangdong, China', notes: ['bitter', 'sweet', 'citrus'], heat: 0,
    whole: flake(5, '#a8541c', '#e2c592', { mode: 'peel' }), ground: '#c07a3b', grind: .3, word: 'stencil',
    bg: [.16, .04, 56], accent: [62, .15], second: [90, .06, .86], chroma: .13, warm: .45 }],
  ['Barberry', 'fruits', 'Small, tart, red berries called zereshk in Iran. Cooks fry them with butter and sugar for jeweled rice.', {
    latin: 'Berberis vulgaris', part: 'Fruit', origin: 'Iran', notes: ['sour', 'tart', 'fruity'], heat: 0,
    whole: berry(.55, '#a8121e', '#d03a3e', { elong: 1.7, wrinkle: .45, gloss: .6, sss: .35 }), ground: '#a83141', grind: .4,
    bg: [.15, .03, 112], accent: [22, .17], second: [85, .12], chroma: .14, warm: .35 }],
  ['Kokum', 'fruits', 'The dried, purple-black rind of a fruit from the Konkan coast of India. It gives a sour taste and a pink color to fish curries.', {
    latin: 'Garcinia indica', part: 'Fruit rind', origin: 'Konkan coast, India', notes: ['sour', 'fruity', 'sweet'], heat: 0,
    whole: flake(5, '#2b0f1b', '#5c1b33', { mode: 'rind', gloss: .45 }), ground: '#4a1a2a', grind: .3, word: 'stencil',
    bg: [.12, .034, 342], accent: [350, .12], second: [70, .06], chroma: .12, warm: .3 }],

  // Resins
  ['Asafoetida', 'resins', 'The dried resin of a giant fennel. Raw, it has a strong smell, but fried in oil it tastes of onion and garlic.', {
    latin: 'Ferula assa-foetida', part: 'Resin', origin: 'Iran and Afghanistan', notes: ['sulfur', 'onion', 'garlic'], heat: 0,
    whole: tear(1.6, '#8a5a2b', '#c9a061', { mode: 'lump' }), ground: '#e2c97b', grind: .05, word: 'stencil',
    bg: [.155, .028, 100], accent: [88, .12], second: [40, .1], chroma: .12, warm: .45 }],
  ['Mastic', 'resins', 'Pale resin tears from trees on the Greek island of Chios. Ground mastic gives a pine taste to breads, ice cream and liqueur.', {
    latin: 'Pistacia lentiscus', part: 'Resin', origin: 'Chios, Greece', notes: ['pine', 'cedar', 'fresh'], heat: 0,
    whole: tear(.8, '#e3cf7e', '#f2ead0', { mode: 'clear', sss: 1, gloss: .8 }), ground: '#efe7c9', grind: .1,
    bg: [.19, .02, 180], accent: [100, .08, .9], second: [178, .08], chroma: .1, warm: .25 }],

  // Blends
  ['Garam Masala', 'blends', 'A warm North Indian blend of toasted cardamom, cinnamon, clove, cumin, coriander and black pepper. Cooks add it near the end.', {
    part: 'Blend', origin: 'North India', notes: ['warm', 'sweet', 'aromatic'], heat: 1,
    mix: [['Green Cardamom', 2], ['Cassia', 1, 3], ['Clove', 2], ['Cumin', 3], ['Coriander Seed', 3], ['Black Pepper', 3]], ground: '#6b4a2f', grind: .2,
    bg: [.15, .03, 48], accent: [55, .11], second: [140, .08], chroma: .11, warm: .55 }],
  ['Ras el Hanout', 'blends', 'The name is Arabic for head of the shop, the best blend of a spice seller. It can hold more than 20 spices, often with rose petals.', {
    part: 'Blend', origin: 'Morocco', notes: ['warm', 'floral', 'complex'], heat: 1,
    mix: [['Cumin', 2], ['Coriander Seed', 2], ['Rose', 1], ['Cassia', 1, 3], ['Green Cardamom', 1], ['Allspice', 1]], ground: '#9a5b2f', grind: .2,
    bg: [.16, .04, 40], accent: [46, .13], second: [355, .1], chroma: .12, warm: .5 }],
  ["Za'atar", 'blends', "A Levantine blend of dried wild thyme, sumac and toasted sesame. People eat it on bread with olive oil.", {
    part: 'Blend', origin: 'The Levant', notes: ['herbal', 'tangy', 'nutty'], heat: 0,
    mix: [[flake(.18, '#5f6a34', '#7c8646', { mode: 'herb', label: 'Wild thyme' }), 4], ['Sumac', 2], ['White Sesame', 2]], coarse: true, ground: '#6e6c3a', grind: 1,
    bg: [.16, .03, 118], accent: [116, .1], second: [10, .12], chroma: .11, warm: .35 }],
  ['Berbere', 'blends', 'A hot, red Ethiopian blend of chili, fenugreek, ginger and korarima. It is the base of the chicken stew doro wat.', {
    part: 'Blend', origin: 'Ethiopia and Eritrea', notes: ['hot', 'earthy', 'sweet'], heat: 3,
    mix: [['Kashmiri Chili', 2, 4], ['Fenugreek', 2], ['Black Cardamom', 1], ['Clove', 1], ['Ginger', 1, 2.5]], ground: '#9a2b1b', grind: .2,
    bg: [.17, .032, 62], accent: [34, .15], second: [140, .1], chroma: .13, warm: .45 }],
  ['Chinese Five-Spice', 'blends', 'Star anise, clove, cassia, Sichuan pepper and fennel seed. It seasons roast pork, duck and red-braised dishes.', {
    part: 'Blend', origin: 'China', notes: ['licorice', 'sweet', 'warm'], heat: 1,
    mix: [['Star Anise', 1], ['Clove', 2], ['Cassia', 1, 3], ['Sichuan Pepper', 2], ['Fennel Seed', 3]], ground: '#7a4b33', grind: .2,
    bg: [.15, .03, 30], accent: [42, .11], second: [70, .09], chroma: .11, warm: .5 }],
  ['Curry Powder', 'blends', 'A British blend based on Indian spice mixes. Turmeric makes it yellow, and coriander, cumin and fenugreek give the taste.', {
    part: 'Blend', origin: 'Britain and India', notes: ['earthy', 'warm', 'savory'], heat: 2,
    mix: [['Turmeric', 1, 3], ['Coriander Seed', 3], ['Cumin', 3], ['Fenugreek', 2], ['Cayenne', 1, 4]], ground: '#c9931f', grind: .1,
    bg: [.17, .046, 84], accent: [85, .16], second: [40, .1], chroma: .13, warm: .45 }],
  ['Shichimi Togarashi', 'blends', 'A Japanese blend of 7 flavors: chili, sansho, orange peel, sesame, hemp seed, ginger and nori. People shake it on noodles and grilled meat.', {
    part: 'Blend', origin: 'Japan', notes: ['hot', 'citrus', 'nutty'], heat: 3,
    mix: [[flake(.35, '#b9301e', '#d35a2a', { mode: 'chili', label: 'Chili flakes' }), 4], ['Black Sesame', 1], ['White Sesame', 1], [flake(.3, '#c56a1f', '#e2b26a', { mode: 'peel', label: 'Orange peel' }), 1], [flake(.35, '#1e2a1e', '#2e3a2a', { mode: 'nori', gloss: .4, label: 'Nori' }), 1]], coarse: true, ground: '#b9311f', grind: 1,
    bg: [.13, .015, 165], accent: [30, .16], second: [62, .14], chroma: .13, warm: .35 }],
  ['Baharat', 'blends', 'Baharat means spices in Arabic. This blend of black pepper, allspice, cinnamon and clove seasons lamb, rice and soups.', {
    part: 'Blend', origin: 'Middle East', notes: ['warm', 'peppery', 'sweet'], heat: 1,
    mix: [['Black Pepper', 3], ['Allspice', 2], ['Cassia', 1, 3], ['Clove', 2]], ground: '#5b3b29', grind: .2,
    bg: [.165, .02, 70], accent: [48, .1], second: [25, .1], chroma: .11, warm: .55 }],
  ['Dukkah', 'blends', 'An Egyptian mix of crushed, toasted nuts with sesame, coriander and cumin. People dip bread in olive oil, then in dukkah.', {
    part: 'Blend', origin: 'Egypt', notes: ['nutty', 'toasty', 'earthy'], heat: 0,
    mix: [[flake(.45, '#b88a52', '#e2c9a0', { mode: 'chunk', label: 'Hazelnuts' }), 3], ['White Sesame', 2], ['Coriander Seed', 2], ['Cumin', 1]], coarse: true, ground: '#a27b4b', grind: 1,
    bg: [.17, .03, 72], accent: [76, .09], second: [142, .07], chroma: .11, warm: .5 }],
  ['Panch Phoron', 'blends', 'A Bengali mix of 5 whole seeds: fenugreek, nigella, cumin, mustard and fennel. The seeds pop in hot oil at the start of a dish.', {
    part: 'Blend', origin: 'Bengal', notes: ['bitter', 'sweet', 'pungent'], heat: 0,
    mix: [['Fenugreek', 1], ['Nigella', 1], ['Cumin', 1], ['Brown Mustard Seed', 1], ['Fennel Seed', 1]], coarse: true, ground: '#7a6a4b', grind: .8,
    bg: [.15, .026, 86], accent: [86, .1], second: [138, .08], chroma: .11, warm: .45 }],
  ['Quatre Épices', 'blends', 'French for four spices: pepper, nutmeg, ginger and clove. Butchers use it in pâtés, sausages and terrines.', {
    part: 'Blend', origin: 'France', notes: ['peppery', 'warm', 'sweet'], heat: 1,
    mix: [['White Pepper', 3], ['Nutmeg', 1], ['Ginger', 1, 2.5], ['Clove', 2]], ground: '#7b6b59', grind: .2,
    bg: [.17, .014, 230], accent: [62, .06, .82], second: [25, .08], chroma: .1, warm: .45 }],
  ['Advieh', 'blends', 'A Persian blend of rose petals, cinnamon, cardamom and cumin. It flavors rice dishes and stews.', {
    part: 'Blend', origin: 'Iran', notes: ['floral', 'warm', 'sweet'], heat: 0,
    mix: [['Rose', 2], ['Ceylon Cinnamon', 1, 3], ['Green Cardamom', 2], ['Cumin', 2]], ground: '#a8795b', grind: .2,
    bg: [.16, .03, 14], accent: [10, .1, .78], second: [72, .08], chroma: .11, warm: .4 }],
  ['Chaat Masala', 'blends', 'A tangy Indian blend of dried mango, cumin and black salt, which smells of sulfur. It goes on fruit, salads and street food.', {
    part: 'Blend', origin: 'India', notes: ['tangy', 'salty', 'funky'], heat: 1,
    mix: [['Amchur', 1, 2.5], ['Cumin', 3], ['Coriander Seed', 2], ['Black Pepper', 2]], ground: '#a38b5c', grind: .2,
    bg: [.16, .026, 102], accent: [96, .1], second: [330, .08], chroma: .11, warm: .4 }],
  ['Hawaij', 'blends', 'A Yemeni blend of cumin, black pepper, turmeric and cardamom for soups. A sweet version with ginger goes into coffee.', {
    part: 'Blend', origin: 'Yemen', notes: ['earthy', 'warm', 'peppery'], heat: 1,
    mix: [['Cumin', 3], ['Black Pepper', 2], ['Turmeric', 1, 3], ['Green Cardamom', 2]], ground: '#b38b3c', grind: .2,
    bg: [.155, .026, 18], accent: [82, .14], second: [45, .1], chroma: .12, warm: .5 }],
  ['Jerk Seasoning', 'blends', 'A hot Jamaican blend of allspice and Scotch bonnet chili with thyme. It seasons chicken and pork, grilled over pimento wood.', {
    part: 'Blend', origin: 'Jamaica', notes: ['hot', 'warm', 'herbal'], heat: 4,
    mix: [['Allspice', 3], ['Habanero', 1], ['Black Pepper', 2], ['Nutmeg', 1]], ground: '#6b3b23', grind: .3,
    bg: [.14, .036, 160], accent: [40, .12], second: [145, .12], chroma: .13, warm: .35 }],
  ['Mulling Spices', 'blends', 'Whole cinnamon, clove, star anise, allspice and orange peel. They steep in hot wine or cider for mulled wine and glögg.', {
    part: 'Blend', origin: 'Northern Europe', notes: ['warm', 'sweet', 'citrus'], heat: 0,
    mix: [['Ceylon Cinnamon', 1, 3.2], ['Clove', 3], ['Star Anise', 2], ['Allspice', 3], ['Chenpi', 1, 2.6]], coarse: true, ground: '#7a4b2d', grind: .3,
    bg: [.135, .042, 18], accent: [56, .14], second: [18, .12], chroma: .12, warm: .5 }],
];

// Signature palettes. Like Osaka Jade or Miasma in Omarchy, these themes fill
// the 6 ANSI slots with the colors of the spice, so a slot can hold a color
// that is not its name: the blue of Turmeric is the orange of its skin.
// Each slot is "hue chroma lightness" in OKLCH, in the order red, green,
// yellow, blue, magenta, cyan. The lightness is for night. The contrast check
// still raises or lowers every color.
const SIGNATURE = {
  'Saffron': '32 .16 .66, 135 .10 .78, 82 .15 .86, 290 .11 .72, 318 .12 .76, 200 .05 .84',
  'Turmeric': '35 .14 .68, 130 .10 .78, 80 .16 .86, 55 .11 .72, 15 .10 .74, 95 .07 .90',
  'Sweet Paprika': '28 .16 .66, 140 .10 .78, 85 .12 .86, 42 .11 .72, 5 .11 .74, 70 .05 .90',
  'Smoked Paprika': '32 .14 .66, 120 .07 .76, 72 .11 .84, 48 .08 .72, 15 .09 .74, 60 .04 .90',
  'Cayenne': '27 .17 .65, 135 .09 .78, 80 .12 .86, 210 .07 .74, 5 .12 .74, 185 .06 .86',
  'Chile de Árbol': '29 .18 .64, 145 .13 .78, 90 .12 .88, 40 .12 .74, 355 .12 .76, 170 .07 .86',
  "Bird's Eye Chili": '28 .18 .65, 150 .14 .78, 95 .13 .88, 240 .08 .74, 340 .12 .76, 185 .08 .86',
  'Habanero': '30 .16 .66, 140 .12 .78, 88 .15 .88, 60 .15 .76, 15 .12 .74, 175 .08 .86',
  'Ghost Pepper': '25 .17 .64, 135 .09 .76, 80 .12 .86, 300 .07 .74, 350 .12 .74, 210 .05 .86',
  'Gochugaru': '30 .17 .66, 140 .10 .78, 90 .11 .88, 250 .08 .74, 0 .11 .76, 190 .07 .86',
  'Urfa Biber': '20 .12 .68, 130 .06 .76, 75 .10 .84, 330 .08 .72, 355 .11 .74, 50 .05 .88',
  'Aleppo Pepper': '22 .15 .66, 125 .08 .78, 85 .12 .86, 35 .09 .72, 5 .10 .74, 75 .05 .90',
  'Ancho': '22 .12 .67, 120 .07 .76, 72 .10 .84, 40 .07 .72, 0 .09 .74, 60 .04 .90',
  'Pasilla': '20 .12 .68, 125 .07 .76, 70 .09 .84, 45 .06 .72, 350 .08 .76, 80 .04 .90',
  'Guajillo': '25 .16 .65, 140 .08 .78, 80 .12 .86, 35 .10 .72, 5 .11 .74, 65 .05 .90',
  'Chipotle': '30 .13 .67, 115 .07 .76, 70 .11 .84, 50 .08 .72, 15 .09 .74, 60 .05 .90',
  'Kashmiri Chili': '22 .16 .65, 145 .09 .78, 85 .13 .87, 300 .07 .74, 355 .11 .76, 200 .05 .86',
  'Ají Amarillo': '32 .15 .66, 135 .11 .78, 80 .16 .86, 60 .14 .76, 10 .11 .74, 165 .07 .86',
  'Pink Peppercorn': '15 .14 .68, 145 .08 .78, 80 .10 .88, 260 .07 .74, 355 .13 .76, 190 .06 .86',
  'Sichuan Pepper': '30 .15 .66, 130 .13 .78, 80 .11 .86, 40 .10 .72, 5 .11 .74, 160 .08 .86',
  'Sansho': '35 .12 .70, 125 .13 .80, 100 .14 .90, 70 .08 .74, 15 .08 .76, 150 .08 .86',
  'Tasmanian Pepperberry': '15 .13 .68, 150 .08 .78, 85 .09 .88, 295 .10 .74, 325 .13 .76, 220 .07 .84',
  'Black Pepper': '30 .12 .70, 145 .08 .78, 80 .10 .86, 60 .05 .74, 10 .07 .76, 100 .03 .86',
  'Green Peppercorn': '30 .12 .70, 130 .13 .78, 105 .13 .88, 80 .07 .74, 15 .08 .76, 150 .07 .86',
  'Lavender': '0 .12 .72, 145 .07 .78, 85 .08 .88, 285 .10 .74, 305 .12 .78, 250 .07 .84',
  'Rose': '5 .14 .70, 145 .08 .78, 85 .09 .88, 330 .09 .74, 355 .13 .78, 180 .05 .86',
  'Hibiscus': '10 .16 .66, 150 .08 .78, 85 .09 .88, 320 .10 .74, 345 .14 .74, 200 .05 .86',
  'Safflower': '30 .15 .66, 130 .10 .78, 90 .15 .88, 55 .15 .76, 15 .11 .74, 180 .06 .86',
  'Juniper': '20 .12 .72, 150 .10 .78, 85 .08 .88, 265 .11 .72, 305 .09 .76, 220 .08 .84',
  'Sumac': '10 .15 .66, 140 .07 .78, 80 .09 .88, 340 .09 .74, 355 .12 .74, 190 .05 .86',
  'Barberry': '22 .17 .65, 145 .10 .78, 85 .13 .88, 300 .07 .74, 5 .13 .74, 185 .06 .86',
  'Kokum': '5 .13 .68, 145 .07 .78, 80 .08 .88, 320 .08 .74, 350 .12 .76, 200 .05 .86',
  'Green Cardamom': '30 .12 .70, 135 .12 .78, 95 .10 .88, 160 .08 .72, 340 .08 .78, 180 .07 .86',
  'Wasabi': '25 .12 .72, 135 .14 .80, 105 .11 .90, 160 .08 .74, 340 .07 .78, 190 .07 .86',
  'Poppy Seed': '25 .16 .66, 145 .08 .78, 85 .08 .88, 255 .09 .74, 330 .08 .78, 220 .07 .84',
  'Nigella': '25 .10 .72, 140 .07 .80, 85 .07 .90, 260 .06 .76, 330 .06 .80, 210 .05 .86',
  'Annatto': '35 .16 .66, 140 .09 .78, 80 .12 .86, 50 .14 .74, 15 .11 .74, 175 .06 .86',
  'Curry Powder': '35 .14 .68, 135 .10 .78, 85 .15 .87, 60 .11 .74, 20 .10 .74, 110 .06 .90',
  'Berbere': '28 .16 .65, 130 .08 .78, 78 .12 .86, 45 .11 .72, 10 .11 .74, 70 .05 .90',
  "Za'atar": '15 .13 .70, 125 .10 .80, 95 .10 .88, 150 .06 .74, 350 .09 .78, 80 .04 .90',
  'Mulling Spices': '20 .14 .66, 140 .08 .78, 80 .12 .86, 55 .13 .76, 355 .12 .74, 30 .05 .90',
  'Mace': '32 .15 .66, 130 .09 .78, 82 .14 .87, 50 .15 .75, 15 .12 .74, 170 .06 .86',
  'Chenpi': '30 .14 .67, 130 .10 .78, 88 .13 .88, 60 .15 .76, 15 .10 .74, 95 .05 .90',
  'Star Anise': '30 .13 .68, 135 .08 .78, 78 .12 .86, 45 .09 .72, 5 .10 .76, 70 .05 .90',
  'Vanilla': '30 .11 .70, 125 .07 .78, 88 .10 .90, 55 .06 .74, 10 .08 .78, 95 .04 .92',
  'Ceylon Cinnamon': '35 .13 .68, 125 .07 .78, 75 .11 .86, 52 .09 .74, 15 .09 .76, 80 .04 .90',
  'Clove': '28 .13 .67, 125 .07 .76, 72 .10 .84, 45 .08 .72, 5 .09 .74, 60 .04 .90',
  'Orris Root': '5 .11 .72, 145 .07 .78, 88 .08 .90, 290 .10 .74, 310 .11 .78, 240 .06 .84',
  'Mastic': '25 .11 .72, 150 .09 .80, 95 .09 .90, 220 .08 .76, 330 .07 .80, 185 .08 .86',
  'Fennel Pollen': '35 .12 .70, 130 .11 .78, 100 .14 .90, 75 .10 .76, 15 .08 .76, 150 .07 .86',
};

// ---------- color math ----------

function rng(seed) {
  return () => {
    seed |= 0; seed = seed + 0x6D2B79F5 | 0;
    let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

// OKLCH to linear sRGB.
function lin(L, C, h) {
  h *= Math.PI / 180;
  const a = C * Math.cos(h), b = C * Math.sin(h);
  const l = (L + .3963377774 * a + .2158037573 * b) ** 3;
  const m = (L - .1055613458 * a - .0638541728 * b) ** 3;
  const s = (L - .0894841775 * a - 1.291485548 * b) ** 3;
  return [
    4.0767416621 * l - 3.3077115913 * m + .2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - .3413193965 * s,
    -.0041960863 * l - .7034186147 * m + 1.707614701 * s,
  ];
}

// OKLCH to hex. Chroma drops until the color fits in sRGB.
export function oklchHex(L, C, h) {
  let c = C, r = lin(L, c, h);
  while (c > 0 && r.some(v => v < -.001 || v > 1.001)) { c -= .005; r = lin(L, c, h); }
  return '#' + r.map(v => {
    v = Math.min(1, Math.max(0, v));
    v = v <= .0031308 ? 12.92 * v : 1.055 * v ** (1 / 2.4) - .055;
    return Math.round(v * 255).toString(16).padStart(2, '0');
  }).join('');
}

// Hex to OKLCH.
export function hexOklch(hex) {
  const [r, g, b] = [1, 3, 5].map(i => {
    const v = parseInt(hex.slice(i, i + 2), 16) / 255;
    return v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4;
  });
  const l = Math.cbrt(.4122214708 * r + .5363325363 * g + .0514459929 * b);
  const m = Math.cbrt(.2119034982 * r + .6806995451 * g + .1073969566 * b);
  const s = Math.cbrt(.0883024619 * r + .2817188376 * g + .6299787005 * b);
  const L = .2104542553 * l + .7936177850 * m - .0040720468 * s;
  const A = 1.9779984951 * l - 2.4285922050 * m + .4505937099 * s;
  const B = .0259040371 * l + .7827717662 * m - .8086757660 * s;
  return { L, C: Math.hypot(A, B), h: (Math.atan2(B, A) * 180 / Math.PI + 360) % 360 };
}

// Linear sRGB mix, the same math that Omarchy uses for derived shades.
export function mix(a, b, t) {
  const pa = [1, 3, 5].map(i => parseInt(a.slice(i, i + 2), 16));
  const pb = [1, 3, 5].map(i => parseInt(b.slice(i, i + 2), 16));
  return '#' + pa.map((v, i) => Math.floor(v * (1 - t) + pb[i] * t + .5).toString(16).padStart(2, '0')).join('');
}

// WCAG contrast ratio of two hex colors.
export function contrast(a, b) {
  const lum = hex => {
    const [r, g, bl] = [1, 3, 5].map(i => {
      const v = parseInt(hex.slice(i, i + 2), 16) / 255;
      return v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4;
    });
    return .2126 * r + .7152 * g + .0722 * bl;
  };
  const x = lum(a), y = lum(b);
  return (Math.max(x, y) + .05) / (Math.min(x, y) + .05);
}

// The first color at or above lightness L that reaches the target contrast.
function lighten(L, C, h, bg, target) {
  let hex = oklchHex(L, C, h);
  while (contrast(hex, bg) < target && L < 1) { L = Math.min(1, L + .005); hex = oklchHex(L, C, h); }
  return hex;
}

// The first color at or below lightness L that reaches the target contrast.
function darken(L, C, h, bg, target) {
  let hex = oklchHex(L, C, h);
  while (contrast(hex, bg) < target && L > 0) { L = Math.max(0, L - .005); hex = oklchHex(L, C, h); }
  return hex;
}

// Converts names with accents and apostrophes, such as Ají Amarillo or Za'atar,
// to folder names.
export function slugify(name) {
  return name.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[đĐ]/g, 'd').replace(/['’]/g, '')
    .toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

const hueDist = (a, b) => { const d = Math.abs(((a - b) % 360 + 540) % 360 - 180); return d; };
const hueDelta = (from, to) => ((to - from) % 360 + 540) % 360 - 180;

// Yaru icon themes that ship with Omarchy, keyed by OKLCH hue.
const YARU = [
  [15, 'Yaru-red'], [45, 'Yaru'], [85, 'Yaru-yellow'], [115, 'Yaru-olive'],
  [150, 'Yaru-sage'], [200, 'Yaru-prussiangreen'], [255, 'Yaru-blue'],
  [300, 'Yaru-purple'], [345, 'Yaru-magenta'], [375, 'Yaru-red'],
];

function iconTheme(hex) {
  const { h, C } = hexOklch(hex);
  if (C < .03) return 'Yaru';
  let best = YARU[0], dist = Infinity;
  for (const entry of YARU) {
    const d = Math.min(Math.abs(entry[0] - h), Math.abs(entry[0] - (h + 360)));
    if (d < dist) { dist = d; best = entry; }
  }
  return best[1];
}

// ---------- palette generator ----------

// ANSI order: red, green, yellow, blue, magenta, cyan.
const BASE_HUE = [27, 140, 88, 250, 340, 200];
// Night and day start lightness of each hue, before the contrast check.
const NIGHT_L = [.72, .76, .83, .74, .74, .78];
const DAY_L = [.52, .54, .6, .5, .52, .54];
// Contrast targets against the background.
const TARGET = { night: { normal: 5.5, bright: 7.5, muted: 3.8, accent: 6, second: 4.5, fg: 11 }, day: { normal: 4.5, bright: 6, muted: 3.8, accent: 4.5, second: 4, fg: 11 } };

// The 6 hues of a theme. Warm themes move blue, cyan, green and magenta to the
// warm side and lower their chroma. The slot nearest to the accent moves up to
// 20 degrees to the accent hue, so each palette carries its drink color.
// The second color moves another slot up to 12 degrees. Red moves 6 degrees at most.
function ansiHues(t, r) {
  const w = t.warm;
  const h = [24 + 4 * w, 140 - 22 * w, 88 - 8 * w, 250 - 18 * w, 340 + 8 * w, 200 - 14 * w];
  // The table chroma spreads out around .1, so lively drinks differ more from calm ones.
  const chroma = .1 + (t.chroma - .1) * 1.6;
  const c = [1, 1 - .25 * w, 1, 1 - .3 * w, 1 - .15 * w, 1 - .3 * w].map(x => x * chroma);
  // The accent pulls its nearest slot. Then the second color pulls the nearest
  // other slot by less.
  const taken = new Set();
  for (const [hue, C, max] of [[t.accent[0], t.accent[1], 20], [t.second[0], t.second[1], 12]]) {
    let best = -1, bd = 999;
    h.forEach((x, k) => { const d = hueDist(x, hue); if (!taken.has(k) && d < bd) { bd = d; best = k; } });
    if (best < 0 || bd >= 50 || C <= .06) continue;
    taken.add(best);
    // Red stays red, because it marks errors.
    const m = best === 0 ? 6 : max;
    h[best] += Math.max(-m, Math.min(m, hueDelta(h[best], hue) * .7));
    c[best] = Math.max(c[best], Math.min(C, chroma * 1.3));
  }
  return { h: h.map(x => (x + (r() - .5) * 6 + 360) % 360), c };
}

// The 6 slots of a theme as { h, c, night, day }, where night and day are the
// start lightness before the contrast check.
function slots(t, r) {
  if (t.sig) return t.sig.map(([h, c, L]) => ({ h, c, night: L, day: .5 + (L - .74) * .6 }));
  const { h, c } = ansiHues(t, r);
  return h.map((x, k) => ({ h: x, c: c[k], night: NIGHT_L[k], day: DAY_L[k] }));
}

function oklabDistance(a, b) {
  const p = hexOklch(a), q = hexOklch(b);
  const rad = Math.PI / 180;
  return Math.hypot(p.L - q.L, p.C * Math.cos(p.h * rad) - q.C * Math.cos(q.h * rad), p.C * Math.sin(p.h * rad) - q.C * Math.sin(q.h * rad));
}

// Two slots that look the same waste a color. When 2 slots are closer than
// MIN_DISTANCE in OKLab, the later one moves away in lightness: lighter at
// night and darker in the day, which also keeps its contrast.
const MIN_DISTANCE = .06;
function separate(colors, list, step, fit) {
  const out = [...colors];
  for (let j = 1; j < out.length; j++) {
    for (let n = 0; n < 8 && out.slice(0, j).some(x => oklabDistance(x, out[j]) < MIN_DISTANCE); n++) {
      const { L } = hexOklch(out[j]);
      out[j] = fit(Math.min(.96, Math.max(.2, L + step)), list[j].c, list[j].h);
    }
  }
  return out;
}

function nightPalette(t, r) {
  // The table chroma of the background is a little strong for large areas.
  const [bl, bc, bh] = [t.bg[0], t.bg[1] * .8, t.bg[2]];
  const bg = oklchHex(bl, bc, bh);
  const list = slots(t, r);
  const T = TARGET.night;
  const fit = (L, C, h) => lighten(L, C, h, bg, T.normal);
  const normal = separate(list.map(s => fit(s.night, s.c, s.h)), list, .03, fit);
  const bright = list.map((s, k) => lighten(Math.min(.95, hexOklch(normal[k]).L + .07), s.c * .82, s.h, bg, T.bright));
  const fg = lighten(.91, Math.min(bc * .6 + .008, .03), bh, bg, T.fg);
  const ansi = [
    oklchHex(bl + .065, bc * 1.1, bh), ...normal, oklchHex(.84, Math.min(bc * .6 + .01, .03), bh),
    lighten(.55, Math.min(bc + .01, .05), bh, bg, T.muted), ...bright, oklchHex(.975, .01, bh),
  ];
  const accent = lighten(t.accent[2] || .76, t.accent[1], t.accent[0], bg, T.accent);
  const second = lighten(t.second[2] || .72, t.second[1], t.second[0], bg, T.second);
  const orange = orangeFor(normal[0], normal[2], bg, l => lighten(l.L, l.C, l.h, bg, T.normal));
  return {
    ansi, accent, second,
    colors: {
      mode: 'dark', accent, selection: mix(bg, accent, .28), muted: ansi[8],
      background: bg, dark_background: mix(bg, '#000000', .25), darker_background: mix(bg, '#000000', .5), lighter_background: ansi[0],
      foreground: fg, dark_foreground: mix(fg, bg, .38), light_foreground: ansi[7], bright_foreground: ansi[15],
      red: normal[0], yellow: normal[2], orange, green: normal[1], cyan: normal[5], blue: normal[3], magenta: normal[4],
      brown: lighten(.5, .08, 55, bg, 3),
      bright_red: bright[0], bright_yellow: bright[2], bright_green: bright[1], bright_cyan: bright[5], bright_blue: bright[3], bright_magenta: bright[4],
    },
  };
}

// The day background is a cream tone. Warm hues move halfway to the hue of
// cream, so a brown night background does not turn pink in daylight. Cool
// hues stay. Dark spices get a slightly darker cream.
function dayBackground(t) {
  const [, bc, bh] = t.bg;
  const h = bh < 130 || bh > 330 ? bh + hueDelta(bh, 85) * .5 : bh;
  return [.962 - (t.deep ? .012 : 0), Math.min(Math.max(bc * .7, .012), .026), (h + 360) % 360];
}

function dayPalette(t, r) {
  const [dl, dc, dh] = dayBackground(t);
  const bg = oklchHex(dl, dc, dh);
  const list = slots(t, r);
  const T = TARGET.day;
  const fit = (L, C, h) => darken(L, C * 1.08, h, bg, T.normal);
  const normal = separate(list.map(s => fit(s.day, s.c, s.h)), list, -.03, fit);
  const bright = list.map((s, k) => darken(hexOklch(normal[k]).L - .06, s.c * 1.12, s.h, bg, T.bright));
  const fg = darken(.3, Math.min(t.bg[1] * .8 + .01, .04), dh, bg, T.fg);
  const ansi = [
    oklchHex(dl - .055, dc * 1.4, dh), ...normal, oklchHex(.42, Math.min(t.bg[1] * .7 + .01, .035), dh),
    darken(.6, Math.min(t.bg[1] * .7 + .01, .035), dh, bg, T.muted), ...bright, oklchHex(.2, Math.min(t.bg[1] * .6 + .01, .03), dh),
  ];
  const accent = darken(Math.min(t.accent[2] || .55, .55), Math.max(t.accent[1] * 1.1, .06), t.accent[0], bg, T.accent);
  const second = darken(Math.min(t.second[2] || .55, .58), Math.max(t.second[1] * 1.1, .05), t.second[0], bg, T.second);
  const orange = orangeFor(normal[0], normal[2], bg, l => darken(l.L, l.C, l.h, bg, T.normal));
  return {
    ansi, accent, second,
    colors: {
      mode: 'light', accent, selection: mix(bg, accent, .22), muted: ansi[8],
      background: bg, dark_background: oklchHex(dl - .03, dc * 1.2, dh), darker_background: oklchHex(dl - .07, dc * 1.3, dh), lighter_background: ansi[0],
      foreground: fg, dark_foreground: darken(.5, Math.min(dc + .01, .03), dh, bg, 5), light_foreground: ansi[7], bright_foreground: ansi[15],
      red: normal[0], yellow: normal[2], orange, green: normal[1], cyan: normal[5], blue: normal[3], magenta: normal[4],
      brown: darken(.45, .08, 55, bg, 5),
      bright_red: bright[0], bright_yellow: bright[2], bright_green: bright[1], bright_cyan: bright[5], bright_blue: bright[3], bright_magenta: bright[4],
    },
  };
}

// Orange sits between the red and yellow hues of each palette.
function orangeFor(red, yellow, bg, fit) {
  const a = hexOklch(red), b = hexOklch(yellow);
  return fit({ L: (a.L + b.L) / 2, C: (a.C + b.C) / 2, h: a.h + hueDelta(a.h, b.h) / 2 });
}

// Variant order, labels, and the suffix of the installed theme name.
export const VARIANTS = [
  { key: 'night', label: 'Night', suffix: '-night', mode: 'dark' },
  { key: 'day', label: 'Day', suffix: '-day', mode: 'light' },
];

export { CATEGORIES };

// Spices whose whole form is close to black get a slightly darker cream in
// the day, like the dark roasts of the coffee themes.
function luma(hex) { return [1, 3, 5].reduce((a, i, k) => a + [.2126, .7152, .0722][k] * parseInt(hex.slice(i, i + 2), 16) / 255, 0); }

const byName = new Map(TABLE.map(row => [row[0], row[3]]));
// The parts of a blend as whole spices, with their weight and an optional size.
function mixParts(o) {
  return (o.mix || []).map(([what, weight, size]) => {
    const w = typeof what === 'string' ? (byName.get(what).whole || null) : what;
    if (!w) return null;
    return { name: typeof what === 'string' ? what : '', weight, whole: size ? { ...w, size } : w };
  }).filter(Boolean);
}

export const themes = TABLE.map(([name, cat, desc, o], i) => {
  const slug = slugify(name);
  const t = { warm: .4, ...o };
  t.deep = luma(o.whole ? o.whole.color : o.ground) < .06;
  if (SIGNATURE[name]) t.sig = SIGNATURE[name].split(',').map(x => x.trim().split(/\s+/).map(Number));
  const make = (key, build) => {
    const v = VARIANTS.find(x => x.key === key);
    const p = build(t, rng(i * 7919 + 13));
    return { variant: key, label: v.label, install: `${slug}${v.suffix}`, name: `${name} ${v.label}`, ansi: p.ansi, second: p.second, icons: iconTheme(p.accent), colors: p.colors };
  };
  const parts = mixParts(o);
  // A piece longer than 3.6 cm is too large to spell the wordmark, so the
  // ground spice fills a stencil instead.
  const word = o.word || (o.whole && o.whole.size <= 3.6 ? 'pieces' : parts.length && o.coarse ? 'pieces' : 'stencil');
  return {
    index: i + 1, name, slug, cat, category: CATEGORIES[cat], desc,
    latin: t.latin || '', part: t.part, origin: t.origin || '', notes: t.notes, heat: t.heat || 0, shu: t.shu || '',
    whole: o.whole || null, mix: parts, coarse: !!o.coarse, ground: o.ground, grind: o.grind ?? .3, word, deep: t.deep,
    signature: !!t.sig,
    variants: { night: make('night', nightPalette), day: make('day', dayPalette) },
  };
});

export function colorsToml(v) {
  const k = v.colors;
  return `mode = "${k.mode}"

accent = "${k.accent}"
selection = "${k.selection}"
muted = "${k.muted}"

background = "${k.background}"
dark_background = "${k.dark_background}"
darker_background = "${k.darker_background}"
lighter_background = "${k.lighter_background}"

foreground = "${k.foreground}"
dark_foreground = "${k.dark_foreground}"
light_foreground = "${k.light_foreground}"
bright_foreground = "${k.bright_foreground}"

hyprland_active_border = "rgba(${k.accent.slice(1)}ee) rgba(${v.second.slice(1)}ee) 45deg"
hyprland_inactive_border = "rgba(${k.muted.slice(1)}aa)"

red = "${k.red}"
yellow = "${k.yellow}"
orange = "${k.orange}"
green = "${k.green}"
cyan = "${k.cyan}"
blue = "${k.blue}"
magenta = "${k.magenta}"
brown = "${k.brown}"

bright_red = "${k.bright_red}"
bright_yellow = "${k.bright_yellow}"
bright_green = "${k.bright_green}"
bright_cyan = "${k.bright_cyan}"
bright_blue = "${k.bright_blue}"
bright_magenta = "${k.bright_magenta}"
`;
}
