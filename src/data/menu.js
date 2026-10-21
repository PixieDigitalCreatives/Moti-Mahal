// Menu content. Prices for Butter Chicken, Dal Makhani, Tandoori Roti, Mutton Rogan Josh,
// Chicken Biryani and Paneer Tikka Masala come from the current website; every other
// item, price, composition, spice level and pairing is placeholder copy to confirm
// with the restaurant.
export const categories = [
  {
    id: 'tandoor',
    title: 'From the Tandoor',
    blurb: 'Clay ovens fired with charcoal from noon till close. Marinated overnight, roasted to order.',
    image: '/images/tandoori-chicken.webp',
    cover: '/images/tandoor-skewers.webp',
    items: [
      { name: 'Tandoori Chicken', price: '₹340 / ₹620', desc: 'Half or full bird in yoghurt, Kashmiri chilli and garam masala, charred over coals.', diet: 'nonveg', tag: 'House original', image: '/images/tandoori-chicken.webp', ingredients: ['Chicken on the bone', 'Hung curd', 'Kashmiri chilli', 'Ginger & garlic', 'Mustard oil', 'Lime'], spice: 2, pairs: 'Butter Naan' },
      { name: 'Chicken Tikka', price: '₹360', desc: 'Boneless thigh, hung-curd marinade, smoky edges and a squeeze of lime.', diet: 'nonveg', image: '/images/chicken-tikka.webp', ingredients: ['Chicken thigh', 'Hung curd', 'Ajwain', 'Kashmiri chilli', 'Chaat masala', 'Lime'], spice: 2, pairs: 'Masala Chaas' },
      { name: 'Mutton Seekh Kebab', price: '₹380', desc: 'Hand-minced lamb with green chilli and ginger, pressed onto skewers.', diet: 'nonveg', image: '/images/seekh-kebab.webp', ingredients: ['Minced lamb', 'Green chilli', 'Fresh ginger', 'Coriander', 'Roasted cumin', 'Charcoal smoke'], spice: 2, pairs: 'Lachha Paratha' },
      { name: 'Afghani Malai Chicken', price: '₹380', desc: 'Cream, cashew and white pepper — mellow, rich and gently charred.', diet: 'nonveg', image: '/images/malai-chicken.webp', ingredients: ['Chicken', 'Fresh cream', 'Cashew paste', 'Processed cheese', 'White pepper', 'Green cardamom'], spice: 1, pairs: 'Garlic Naan' },
      { name: 'Paneer Tikka', price: '₹320', desc: 'Cottage cheese, peppers and onion in a tandoori marinade.', diet: 'veg', image: '/images/paneer-tikka.webp', ingredients: ['Cottage cheese', 'Bell peppers', 'Onion', 'Hung curd', 'Kashmiri chilli', 'Kasuri methi'], spice: 1, pairs: 'Fresh Lime Soda' },
      { name: 'Tandoori Soya Chaap', price: '₹280', desc: 'Delhi street favourite, finished with butter and chaat masala.', diet: 'veg', image: '/images/soya-chaap.webp', ingredients: ['Soya chaap', 'Tandoori masala', 'Hung curd', 'White butter', 'Chaat masala', 'Lime'], spice: 2, pairs: 'Sweet / Salted Lassi' },
    ],
  },
  {
    id: 'curries',
    title: 'Curries & Classics',
    blurb: 'Gravies built slowly — onions browned with patience, spices ground every morning, finished with white butter.',
    image: '/images/butter-chicken.webp',
    cover: '/images/butter-chicken-smoke.webp',
    items: [
      { name: 'Butter Chicken', price: '₹380', desc: 'Tandoor-roasted chicken folded into a velvet tomato, butter & fenugreek gravy.', diet: 'nonveg', tag: 'Signature', image: '/images/butter-chicken.webp', ingredients: ['Tandoori chicken', 'Tomato', 'White butter', 'Fresh cream', 'Kasuri methi', 'Honey'], spice: 1, pairs: 'Butter Naan' },
      { name: 'Mutton Rogan Josh', price: '₹450', desc: 'Kashmiri-style lamb braised with fennel, ginger and the warmth of red chilli.', diet: 'nonveg', image: '/images/rogan-josh.webp', ingredients: ['Lamb on the bone', 'Kashmiri chilli', 'Fennel', 'Dry ginger', 'Yoghurt', 'Ratan jot'], spice: 2, pairs: 'Jeera Rice' },
      { name: 'Kadhai Chicken', price: '₹360', desc: 'Tossed in an iron kadhai with peppers, tomato and coarse coriander.', diet: 'nonveg', image: '/images/mutton-curry.webp', ingredients: ['Chicken', 'Bell peppers', 'Tomato', 'Crushed coriander', 'Dried red chilli', 'Fresh ginger'], spice: 3, pairs: 'Lachha Paratha' },
      { name: 'Paneer Tikka Masala', price: '₹310', desc: 'Charred cottage-cheese tikka in a smoky, spiced onion-tomato masala.', diet: 'veg', image: '/images/copper-handis.webp', ingredients: ['Paneer tikka', 'Onion-tomato masala', 'Butter', 'Cream', 'Garam masala', 'Kasuri methi'], spice: 2, pairs: 'Garlic Naan' },
      { name: 'Shahi Paneer', price: '₹300', desc: 'A royal cashew and cream gravy, perfumed with green cardamom.', diet: 'veg', image: '/images/shahi-paneer.webp', ingredients: ['Cottage cheese', 'Cashew', 'Cream', 'Green cardamom', 'Saffron', 'Mace'], spice: 0, pairs: 'Butter Naan' },
      { name: 'Dal Makhani', price: '₹280', desc: 'Black lentils simmered overnight on low coals, finished with butter & cream.', diet: 'veg', tag: 'Signature', image: '/images/dal-makhani.webp', ingredients: ['Whole black urad', 'Rajma', 'White butter', 'Cream', 'Tomato', 'Overnight coals'], spice: 1, pairs: 'Tandoori Roti' },
      { name: 'Dal Tadka', price: '₹220', desc: 'Yellow lentils tempered with cumin, garlic and dried red chilli.', diet: 'veg', image: '/images/dal-tadka.webp', ingredients: ['Yellow lentils', 'Cumin', 'Garlic', 'Dried red chilli', 'Ghee', 'Coriander'], spice: 1, pairs: 'Jeera Rice' },
    ],
  },
  {
    id: 'biryani',
    title: 'Biryani & Rice',
    blurb: 'Long-grain basmati, saffron and whole spice, sealed with dough and slow-steamed — dum, the patient way.',
    image: '/images/biryani.webp',
    cover: '/images/thali-spread.webp',
    items: [
      { name: 'Chicken Biryani', price: '₹320', desc: 'Long-grain basmati layered with saffron & whole spices, sealed and dum-cooked.', diet: 'nonveg', tag: 'Dum-cooked', image: '/images/biryani.webp', ingredients: ['Basmati rice', 'Chicken', 'Saffron', 'Fried onions', 'Mint', 'Whole spices'], spice: 2, pairs: 'Masala Chaas' },
      { name: 'Mutton Biryani', price: '₹420', desc: 'Tender lamb on the bone, caramelised onions and mint.', diet: 'nonveg', image: '/images/biryani-plate.webp', ingredients: ['Basmati rice', 'Lamb on the bone', 'Caramelised onions', 'Mint', 'Saffron milk', 'Kewra'], spice: 2, pairs: 'Masala Chaas' },
      { name: 'Veg Dum Biryani', price: '₹260', desc: 'Garden vegetables, paneer and fried onions, slow-steamed with saffron.', diet: 'veg', image: '/images/veg-biryani.webp', ingredients: ['Basmati rice', 'Seasonal vegetables', 'Paneer', 'Fried onions', 'Saffron', 'Mint'], spice: 1, pairs: 'Sweet / Salted Lassi' },
      { name: 'Jeera Rice', price: '₹160', desc: 'Basmati tempered with cumin and ghee.', diet: 'veg', image: '/images/jeera-rice.webp', ingredients: ['Aged basmati', 'Cumin', 'Ghee', 'Bay leaf'], spice: 0, pairs: 'Dal Makhani' },
    ],
  },
  {
    id: 'breads',
    title: 'Breads',
    blurb: 'Slapped onto the walls of the tandoor and pulled out blistered, golden and smoky.',
    image: '/images/naan.webp',
    cover: '/images/flames.webp',
    items: [
      { name: 'Tandoori Roti', price: '₹40', desc: 'Fresh from the clay oven, golden and smoky.', diet: 'veg', image: '/images/naan.webp', ingredients: ['Whole-wheat flour', 'Water', 'Salt', 'Clay-oven heat'], spice: 0, pairs: 'Dal Makhani' },
      { name: 'Butter Naan', price: '₹70', desc: 'Soft, leavened and brushed with butter.', diet: 'veg', image: '/images/naan-slate.webp', ingredients: ['Refined flour', 'Yoghurt', 'Milk', 'White butter'], spice: 0, pairs: 'Butter Chicken' },
      { name: 'Garlic Naan', price: '₹90', desc: 'Chopped garlic and coriander pressed into the dough.', diet: 'veg', image: '/images/garlic-naan.webp', ingredients: ['Refined flour', 'Chopped garlic', 'Coriander', 'Butter'], spice: 0, pairs: 'Paneer Tikka Masala' },
      { name: 'Lachha Paratha', price: '₹80', desc: 'Layered, flaky whole-wheat bread.', diet: 'veg', image: '/images/lachha-paratha.webp', ingredients: ['Whole-wheat flour', 'Ghee', 'Salt', 'Hand-folded layers'], spice: 0, pairs: 'Kadhai Chicken' },
      { name: 'Amritsari Kulcha', price: '₹120', desc: 'Stuffed with spiced potato, crisp on the outside.', diet: 'veg', image: '/images/kulcha.webp', ingredients: ['Refined flour', 'Spiced potato', 'Onion', 'Coriander', 'Butter'], spice: 1, pairs: 'Dal Makhani' },
    ],
  },
  {
    id: 'desserts',
    title: 'Desserts',
    blurb: 'A sweet ending, the old-fashioned way.',
    image: '/images/gulab-jamun.webp',
    cover: '/images/royal-ambience.webp',
    items: [
      { name: 'Gulab Jamun', price: '₹120', desc: 'Warm milk dumplings soaked in rose and cardamom syrup.', diet: 'veg', image: '/images/gulab-jamun.webp', ingredients: ['Khoya', 'Rose syrup', 'Green cardamom', 'Saffron', 'Pistachio'], spice: 0, pairs: 'Masala Chai' },
      { name: 'Phirni', price: '₹140', desc: 'Ground-rice pudding set in clay, with pistachio and saffron.', diet: 'veg', image: '/images/phirni.webp', ingredients: ['Ground rice', 'Full-cream milk', 'Saffron', 'Pistachio', 'Rose water'], spice: 0, pairs: 'Masala Chai' },
      { name: 'Kulfi Falooda', price: '₹160', desc: 'Dense malai kulfi with vermicelli, basil seeds and rose.', diet: 'veg', image: '/images/kulfi.webp', ingredients: ['Malai kulfi', 'Falooda vermicelli', 'Basil seeds', 'Rose syrup', 'Pistachio'], spice: 0, pairs: 'Fresh Lime Soda' },
    ],
  },
  {
    id: 'drinks',
    title: 'Beverages',
    blurb: 'Cooling, classic and made to order.',
    image: '/images/lassi.webp',
    cover: '/images/marble-arches.webp',
    items: [
      { name: 'Sweet / Salted Lassi', price: '₹120', desc: 'Thick churned yoghurt, served chilled.', diet: 'veg', image: '/images/lassi.webp', ingredients: ['Churned yoghurt', 'Sugar or rock salt', 'Green cardamom', 'Malai'], spice: 0, pairs: 'Tandoori Chicken' },
      { name: 'Masala Chaas', price: '₹80', desc: 'Spiced buttermilk with roasted cumin and mint.', diet: 'veg', image: '/images/chaas.webp', ingredients: ['Buttermilk', 'Roasted cumin', 'Mint', 'Black salt', 'Ginger'], spice: 0, pairs: 'Chicken Biryani' },
      { name: 'Fresh Lime Soda', price: '₹100', desc: 'Sweet, salted or mixed.', diet: 'veg', image: '/images/lime-soda.webp', ingredients: ['Fresh lime', 'Soda', 'Sugar syrup', 'Black salt'], spice: 0, pairs: 'Paneer Tikka' },
      { name: 'Masala Chai', price: '₹60', desc: 'Brewed with ginger and cardamom.', diet: 'veg', image: '/images/masala-chai.webp', ingredients: ['Assam tea', 'Milk', 'Fresh ginger', 'Green cardamom', 'Clove'], spice: 0, pairs: 'Gulab Jamun' },
    ],
  },
];
