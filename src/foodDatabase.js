// Indian food database — calories and macros per standard serving
// gramsPerServing = weight of that serving in grams (or ml for liquids)

export const FOODS = [

  // ═══════════════════════════════════════════════════════════
  // BREAKFAST
  // ═══════════════════════════════════════════════════════════
  { id:"idli",              name:"Idli",                    serving:"2 pieces",       gramsPerServing:130,  cal:136, protein:4,   carbs:28,  fat:0.4, fiber:1.2, sugar:0.5, sodium:280  },
  { id:"dosa",              name:"Dosa",                    serving:"1 dosa",         gramsPerServing:150,  cal:168, protein:4,   carbs:30,  fat:3.7, fiber:1.5, sugar:0.5, sodium:320  },
  { id:"masala_dosa",       name:"Masala Dosa",             serving:"1 dosa",         gramsPerServing:220,  cal:230, protein:5,   carbs:38,  fat:6,   fiber:2.5, sugar:1,   sodium:450  },
  { id:"rava_dosa",         name:"Rava Dosa",               serving:"1 dosa",         gramsPerServing:140,  cal:190, protein:4,   carbs:32,  fat:6,   fiber:1,   sugar:0.5, sodium:380  },
  { id:"onion_dosa",        name:"Onion Dosa",              serving:"1 dosa",         gramsPerServing:160,  cal:200, protein:4,   carbs:33,  fat:6,   fiber:1.5, sugar:1,   sodium:370  },
  { id:"uttapam",           name:"Uttapam",                 serving:"1 piece",        gramsPerServing:180,  cal:200, protein:6,   carbs:34,  fat:4,   fiber:2,   sugar:2,   sodium:360  },
  { id:"upma",              name:"Upma",                    serving:"1 cup",          gramsPerServing:180,  cal:200, protein:5,   carbs:33,  fat:5,   fiber:2,   sugar:2,   sodium:380  },
  { id:"poha",              name:"Poha",                    serving:"1 cup",          gramsPerServing:160,  cal:180, protein:4,   carbs:35,  fat:3,   fiber:2,   sugar:2,   sodium:260  },
  { id:"sabudana_khichdi",  name:"Sabudana Khichdi",        serving:"1 cup",          gramsPerServing:180,  cal:280, protein:4,   carbs:52,  fat:7,   fiber:1,   sugar:2,   sodium:220  },
  { id:"pesarattu",         name:"Pesarattu",               serving:"2 pieces",       gramsPerServing:160,  cal:180, protein:9,   carbs:28,  fat:3,   fiber:3,   sugar:1,   sodium:280  },
  { id:"appam",             name:"Appam",                   serving:"2 pieces",       gramsPerServing:120,  cal:160, protein:3,   carbs:32,  fat:2,   fiber:1,   sugar:1,   sodium:200  },
  { id:"puttu",             name:"Puttu",                   serving:"1 serving",      gramsPerServing:150,  cal:180, protein:4,   carbs:36,  fat:2,   fiber:2,   sugar:1,   sodium:120  },
  { id:"idiyappam",         name:"Idiyappam",               serving:"3 pieces",       gramsPerServing:120,  cal:150, protein:3,   carbs:30,  fat:1,   fiber:1,   sugar:0.5, sodium:100  },
  { id:"pongal",            name:"Pongal (Ven)",            serving:"1 cup",          gramsPerServing:200,  cal:250, protein:8,   carbs:38,  fat:8,   fiber:2,   sugar:1,   sodium:320  },
  { id:"sweet_pongal",      name:"Sweet Pongal (Sakkarai)", serving:"1 cup",          gramsPerServing:180,  cal:280, protein:5,   carbs:50,  fat:7,   fiber:1.5, sugar:22,  sodium:80   },
  { id:"paratha",           name:"Paratha",                 serving:"1 paratha",      gramsPerServing:100,  cal:260, protein:5,   carbs:36,  fat:10,  fiber:2,   sugar:1,   sodium:310  },
  { id:"aloo_paratha",      name:"Aloo Paratha",            serving:"1 paratha",      gramsPerServing:140,  cal:310, protein:6,   carbs:48,  fat:10,  fiber:3,   sugar:1.5, sodium:370  },
  { id:"gobi_paratha",      name:"Gobi Paratha",            serving:"1 paratha",      gramsPerServing:140,  cal:290, protein:6,   carbs:44,  fat:10,  fiber:3,   sugar:1.5, sodium:340  },
  { id:"mooli_paratha",     name:"Mooli Paratha",           serving:"1 paratha",      gramsPerServing:130,  cal:270, protein:5,   carbs:42,  fat:9,   fiber:3,   sugar:1.5, sodium:320  },
  { id:"paneer_paratha",    name:"Paneer Paratha",          serving:"1 paratha",      gramsPerServing:150,  cal:340, protein:12,  carbs:40,  fat:14,  fiber:2,   sugar:1,   sodium:380  },
  { id:"methi_paratha",     name:"Methi Paratha",           serving:"1 paratha",      gramsPerServing:100,  cal:250, protein:5,   carbs:34,  fat:10,  fiber:3,   sugar:0.5, sodium:290  },
  { id:"lachha_paratha",    name:"Lachha Paratha",          serving:"1 paratha",      gramsPerServing:90,   cal:270, protein:5,   carbs:36,  fat:12,  fiber:1.5, sugar:0.5, sodium:280  },
  { id:"stuffed_paratha",   name:"Stuffed Paratha",         serving:"1 paratha",      gramsPerServing:130,  cal:290, protein:7,   carbs:42,  fat:10,  fiber:3,   sugar:1.5, sodium:350  },
  { id:"puri",              name:"Puri",                    serving:"2 puris",        gramsPerServing:80,   cal:260, protein:4,   carbs:32,  fat:13,  fiber:1.5, sugar:0.5, sodium:200  },
  { id:"bhatura",           name:"Bhatura",                 serving:"1 piece",        gramsPerServing:90,   cal:300, protein:6,   carbs:44,  fat:11,  fiber:1.5, sugar:1,   sodium:380  },
  { id:"besan_chilla",      name:"Besan Chilla",            serving:"1 chilla",       gramsPerServing:90,   cal:120, protein:6,   carbs:16,  fat:3,   fiber:2.5, sugar:1,   sodium:220  },
  { id:"moong_chilla",      name:"Moong Dal Chilla",        serving:"2 pieces",       gramsPerServing:140,  cal:150, protein:9,   carbs:20,  fat:3,   fiber:3,   sugar:1,   sodium:240  },
  { id:"oats_porridge",     name:"Oats Porridge",           serving:"1 bowl",         gramsPerServing:200,  cal:150, protein:5,   carbs:27,  fat:3,   fiber:4,   sugar:1,   sodium:80   },
  { id:"bread",             name:"Bread",                   serving:"2 slices",       gramsPerServing:60,   cal:130, protein:4,   carbs:25,  fat:1.5, fiber:1.5, sugar:3,   sodium:280  },
  { id:"bread_butter",      name:"Bread with Butter",       serving:"2 slices",       gramsPerServing:70,   cal:210, protein:4,   carbs:25,  fat:10,  fiber:1.5, sugar:3,   sodium:360  },
  { id:"roti",              name:"Roti / Chapati",          serving:"1 roti",         gramsPerServing:40,   cal:104, protein:3,   carbs:20,  fat:1.5, fiber:2,   sugar:0.5, sodium:120  },
  { id:"missi_roti",        name:"Missi Roti",              serving:"1 roti",         gramsPerServing:55,   cal:140, protein:5,   carbs:22,  fat:4,   fiber:3,   sugar:0.5, sodium:160  },
  { id:"bajra_roti",        name:"Bajra Roti",              serving:"1 roti",         gramsPerServing:50,   cal:130, protein:3.5, carbs:24,  fat:2,   fiber:3.5, sugar:0.5, sodium:80   },
  { id:"jowar_roti",        name:"Jowar Roti",              serving:"1 roti",         gramsPerServing:50,   cal:120, protein:3,   carbs:23,  fat:1.5, fiber:3,   sugar:0.5, sodium:60   },
  { id:"makki_roti",        name:"Makki Ki Roti",           serving:"1 roti",         gramsPerServing:60,   cal:140, protein:3,   carbs:26,  fat:3,   fiber:3,   sugar:1,   sodium:80   },
  { id:"thepla",            name:"Thepla",                  serving:"1 thepla",       gramsPerServing:60,   cal:150, protein:4,   carbs:22,  fat:5,   fiber:2,   sugar:1,   sodium:200  },
  { id:"naan",              name:"Naan",                    serving:"1 piece",        gramsPerServing:90,   cal:260, protein:7,   carbs:45,  fat:5,   fiber:1.5, sugar:2,   sodium:480  },
  { id:"garlic_naan",       name:"Garlic Naan",             serving:"1 piece",        gramsPerServing:95,   cal:290, protein:7,   carbs:46,  fat:8,   fiber:1.5, sugar:2,   sodium:520  },
  { id:"tandoori_roti",     name:"Tandoori Roti",           serving:"1 piece",        gramsPerServing:60,   cal:140, protein:4,   carbs:28,  fat:1.5, fiber:2,   sugar:0.5, sodium:250  },
  { id:"kulcha",            name:"Kulcha",                  serving:"1 piece",        gramsPerServing:85,   cal:240, protein:6,   carbs:42,  fat:5,   fiber:1.5, sugar:2,   sodium:440  },
  { id:"rumali_roti",       name:"Rumali Roti",             serving:"1 piece",        gramsPerServing:50,   cal:130, protein:3.5, carbs:24,  fat:2.5, fiber:1,   sugar:0.5, sodium:200  },
  { id:"akki_roti",         name:"Akki Roti",               serving:"1 piece",        gramsPerServing:80,   cal:170, protein:3,   carbs:32,  fat:4,   fiber:1.5, sugar:1,   sodium:160  },
  { id:"kerala_parotta",    name:"Kerala Parotta",          serving:"2 pieces",       gramsPerServing:130,  cal:300, protein:6,   carbs:48,  fat:9,   fiber:1.5, sugar:1,   sodium:420  },
  { id:"luchi",             name:"Luchi",                   serving:"2 pieces",       gramsPerServing:80,   cal:260, protein:4,   carbs:34,  fat:12,  fiber:1,   sugar:0.5, sodium:180  },
  { id:"misal_pav",         name:"Misal Pav",               serving:"1 plate",        gramsPerServing:280,  cal:380, protein:14,  carbs:56,  fat:10,  fiber:8,   sugar:5,   sodium:720  },
  { id:"kanda_poha",        name:"Kanda Poha",              serving:"1 cup",          gramsPerServing:170,  cal:190, protein:4,   carbs:36,  fat:4,   fiber:2.5, sugar:2.5, sodium:280  },

  // ═══════════════════════════════════════════════════════════
  // RICE DISHES
  // ═══════════════════════════════════════════════════════════
  { id:"steamed_rice",      name:"Steamed Rice",            serving:"1 cup cooked",   gramsPerServing:195,  cal:206, protein:4,   carbs:45,  fat:0.4, fiber:0.6, sugar:0,   sodium:2    },
  { id:"jeera_rice",        name:"Jeera Rice",              serving:"1 cup",          gramsPerServing:200,  cal:250, protein:4,   carbs:47,  fat:5,   fiber:0.8, sugar:0,   sodium:180  },
  { id:"ghee_rice",         name:"Ghee Rice",               serving:"1 cup",          gramsPerServing:200,  cal:290, protein:4,   carbs:47,  fat:9,   fiber:0.5, sugar:0,   sodium:160  },
  { id:"biryani_chicken",   name:"Chicken Biryani",         serving:"1 plate",        gramsPerServing:350,  cal:490, protein:28,  carbs:55,  fat:16,  fiber:2,   sugar:4,   sodium:820  },
  { id:"biryani_veg",       name:"Veg Biryani",             serving:"1 plate",        gramsPerServing:320,  cal:350, protein:8,   carbs:60,  fat:8,   fiber:3,   sugar:4,   sodium:680  },
  { id:"biryani_mutton",    name:"Mutton Biryani",          serving:"1 plate",        gramsPerServing:370,  cal:530, protein:30,  carbs:55,  fat:20,  fiber:2,   sugar:4,   sodium:900  },
  { id:"biryani_egg",       name:"Egg Biryani",             serving:"1 plate",        gramsPerServing:330,  cal:420, protein:18,  carbs:56,  fat:13,  fiber:2,   sugar:4,   sodium:780  },
  { id:"biryani_prawn",     name:"Prawn Biryani",           serving:"1 plate",        gramsPerServing:340,  cal:460, protein:24,  carbs:56,  fat:14,  fiber:2,   sugar:4,   sodium:860  },
  { id:"hyderabadi_biryani",name:"Hyderabadi Biryani",      serving:"1 plate",        gramsPerServing:380,  cal:540, protein:30,  carbs:58,  fat:20,  fiber:2,   sugar:4,   sodium:950  },
  { id:"pulao",             name:"Veg Pulao",               serving:"1 cup",          gramsPerServing:200,  cal:220, protein:5,   carbs:40,  fat:5,   fiber:2,   sugar:2,   sodium:420  },
  { id:"matar_pulao",       name:"Matar Pulao",             serving:"1 cup",          gramsPerServing:200,  cal:230, protein:6,   carbs:42,  fat:5,   fiber:3,   sugar:2,   sodium:380  },
  { id:"curd_rice",         name:"Curd Rice",               serving:"1 cup",          gramsPerServing:220,  cal:180, protein:6,   carbs:30,  fat:4,   fiber:0.5, sugar:3,   sodium:200  },
  { id:"lemon_rice",        name:"Lemon Rice",              serving:"1 cup",          gramsPerServing:190,  cal:230, protein:4,   carbs:44,  fat:5,   fiber:1,   sugar:1,   sodium:320  },
  { id:"tamarind_rice",     name:"Tamarind Rice (Puliyodarai)", serving:"1 cup",      gramsPerServing:190,  cal:260, protein:4,   carbs:46,  fat:7,   fiber:2,   sugar:3,   sodium:480  },
  { id:"coconut_rice",      name:"Coconut Rice",            serving:"1 cup",          gramsPerServing:190,  cal:280, protein:4,   carbs:44,  fat:9,   fiber:1.5, sugar:1,   sodium:200  },
  { id:"tomato_rice",       name:"Tomato Rice",             serving:"1 cup",          gramsPerServing:190,  cal:230, protein:4,   carbs:43,  fat:5,   fiber:1.5, sugar:4,   sodium:360  },
  { id:"fried_rice",        name:"Veg Fried Rice",          serving:"1 cup",          gramsPerServing:200,  cal:260, protein:6,   carbs:44,  fat:7,   fiber:2,   sugar:3,   sodium:560  },
  { id:"chicken_fried_rice",name:"Chicken Fried Rice",      serving:"1 cup",          gramsPerServing:210,  cal:310, protein:14,  carbs:42,  fat:9,   fiber:2,   sugar:3,   sodium:680  },
  { id:"khichdi",           name:"Khichdi",                 serving:"1 cup",          gramsPerServing:220,  cal:190, protein:8,   carbs:32,  fat:4,   fiber:3,   sugar:1,   sodium:280  },
  { id:"bisibelebath",      name:"Bisibelebath",            serving:"1 cup",          gramsPerServing:220,  cal:220, protein:8,   carbs:36,  fat:5,   fiber:4,   sugar:2,   sodium:480  },
  { id:"sambar_rice",       name:"Sambar Rice",             serving:"1 cup",          gramsPerServing:220,  cal:200, protein:7,   carbs:36,  fat:3,   fiber:3,   sugar:2,   sodium:460  },
  { id:"vangi_bath",        name:"Vangi Bath",              serving:"1 cup",          gramsPerServing:200,  cal:240, protein:5,   carbs:42,  fat:6,   fiber:3,   sugar:3,   sodium:400  },

  // ═══════════════════════════════════════════════════════════
  // DAL & LENTILS
  // ═══════════════════════════════════════════════════════════
  { id:"dal_tadka",         name:"Dal Tadka",               serving:"1 bowl",         gramsPerServing:200,  cal:180, protein:10,  carbs:25,  fat:5,   fiber:6,   sugar:2,   sodium:460  },
  { id:"dal_makhani",       name:"Dal Makhani",             serving:"1 bowl",         gramsPerServing:220,  cal:280, protein:12,  carbs:30,  fat:12,  fiber:7,   sugar:3,   sodium:580  },
  { id:"dal_fry",           name:"Dal Fry",                 serving:"1 bowl",         gramsPerServing:200,  cal:200, protein:11,  carbs:26,  fat:6,   fiber:6,   sugar:2,   sodium:480  },
  { id:"moong_dal",         name:"Moong Dal",               serving:"1 bowl",         gramsPerServing:200,  cal:160, protein:10,  carbs:22,  fat:3,   fiber:5,   sugar:1.5, sodium:380  },
  { id:"masoor_dal",        name:"Masoor Dal",              serving:"1 bowl",         gramsPerServing:200,  cal:170, protein:11,  carbs:24,  fat:3,   fiber:7,   sugar:2,   sodium:400  },
  { id:"chana_dal",         name:"Chana Dal",               serving:"1 bowl",         gramsPerServing:200,  cal:200, protein:12,  carbs:28,  fat:4,   fiber:8,   sugar:2,   sodium:360  },
  { id:"urad_dal",          name:"Urad Dal",                serving:"1 bowl",         gramsPerServing:200,  cal:190, protein:12,  carbs:26,  fat:3.5, fiber:6,   sugar:1.5, sodium:400  },
  { id:"arhar_dal",         name:"Arhar / Toor Dal",        serving:"1 bowl",         gramsPerServing:200,  cal:175, protein:10,  carbs:26,  fat:3,   fiber:5,   sugar:2,   sodium:380  },
  { id:"panchmel_dal",      name:"Panchmel Dal",            serving:"1 bowl",         gramsPerServing:200,  cal:200, protein:12,  carbs:28,  fat:5,   fiber:7,   sugar:2,   sodium:440  },
  { id:"varan",             name:"Varan (Maharashtrian Dal)",serving:"1 bowl",         gramsPerServing:200,  cal:170, protein:10,  carbs:24,  fat:3,   fiber:5,   sugar:2,   sodium:360  },
  { id:"dal_baati",         name:"Dal Baati",               serving:"2 baati+dal",    gramsPerServing:280,  cal:580, protein:16,  carbs:80,  fat:22,  fiber:7,   sugar:3,   sodium:680  },
  { id:"sambar",            name:"Sambar",                  serving:"1 bowl",         gramsPerServing:200,  cal:100, protein:5,   carbs:16,  fat:2,   fiber:4,   sugar:3,   sodium:480  },
  { id:"rasam",             name:"Rasam",                   serving:"1 bowl",         gramsPerServing:200,  cal:60,  protein:2,   carbs:10,  fat:1,   fiber:1,   sugar:2,   sodium:420  },
  { id:"kadhi",             name:"Kadhi",                   serving:"1 bowl",         gramsPerServing:200,  cal:140, protein:5,   carbs:16,  fat:6,   fiber:1,   sugar:4,   sodium:380  },
  { id:"gujarati_kadhi",    name:"Gujarati Kadhi",          serving:"1 bowl",         gramsPerServing:200,  cal:120, protein:4,   carbs:14,  fat:5,   fiber:0.5, sugar:6,   sodium:300  },

  // ═══════════════════════════════════════════════════════════
  // VEG CURRIES
  // ═══════════════════════════════════════════════════════════
  { id:"rajma",             name:"Rajma",                   serving:"1 bowl",         gramsPerServing:220,  cal:220, protein:12,  carbs:35,  fat:4,   fiber:8,   sugar:2,   sodium:420  },
  { id:"chole",             name:"Chole / Chana Masala",    serving:"1 bowl",         gramsPerServing:220,  cal:240, protein:12,  carbs:36,  fat:7,   fiber:9,   sugar:4,   sodium:480  },
  { id:"kala_chana",        name:"Kala Chana",              serving:"1 bowl",         gramsPerServing:220,  cal:230, protein:13,  carbs:34,  fat:5,   fiber:9,   sugar:2,   sodium:420  },
  { id:"palak_paneer",      name:"Palak Paneer",            serving:"1 bowl",         gramsPerServing:220,  cal:310, protein:14,  carbs:12,  fat:22,  fiber:4,   sugar:3,   sodium:520  },
  { id:"paneer_butter_masala", name:"Paneer Butter Masala", serving:"1 bowl",         gramsPerServing:230,  cal:380, protein:15,  carbs:18,  fat:28,  fiber:3,   sugar:8,   sodium:680  },
  { id:"kadai_paneer",      name:"Kadai Paneer",            serving:"1 bowl",         gramsPerServing:220,  cal:340, protein:15,  carbs:16,  fat:24,  fiber:3,   sugar:5,   sodium:580  },
  { id:"paneer_tikka_masala",name:"Paneer Tikka Masala",    serving:"1 bowl",         gramsPerServing:230,  cal:360, protein:16,  carbs:16,  fat:26,  fiber:3,   sugar:6,   sodium:620  },
  { id:"shahi_paneer",      name:"Shahi Paneer",            serving:"1 bowl",         gramsPerServing:220,  cal:350, protein:14,  carbs:16,  fat:26,  fiber:2,   sugar:6,   sodium:600  },
  { id:"paneer_bhurji",     name:"Paneer Bhurji",           serving:"1 bowl",         gramsPerServing:180,  cal:320, protein:18,  carbs:10,  fat:24,  fiber:2,   sugar:3,   sodium:480  },
  { id:"matar_paneer",      name:"Matar Paneer",            serving:"1 bowl",         gramsPerServing:220,  cal:280, protein:13,  carbs:20,  fat:18,  fiber:4,   sugar:4,   sodium:480  },
  { id:"malai_kofta",       name:"Malai Kofta",             serving:"4 pieces+gravy", gramsPerServing:280,  cal:420, protein:12,  carbs:28,  fat:30,  fiber:3,   sugar:8,   sodium:620  },
  { id:"navratan_korma",    name:"Navratan Korma",          serving:"1 bowl",         gramsPerServing:250,  cal:360, protein:9,   carbs:30,  fat:22,  fiber:4,   sugar:8,   sodium:540  },
  { id:"aloo_matar",        name:"Aloo Matar",              serving:"1 bowl",         gramsPerServing:200,  cal:200, protein:6,   carbs:30,  fat:7,   fiber:5,   sugar:3,   sodium:380  },
  { id:"aloo_gobi",         name:"Aloo Gobi",               serving:"1 bowl",         gramsPerServing:200,  cal:180, protein:4,   carbs:26,  fat:7,   fiber:4,   sugar:3,   sodium:340  },
  { id:"dum_aloo",          name:"Dum Aloo",                serving:"1 bowl",         gramsPerServing:220,  cal:250, protein:5,   carbs:34,  fat:10,  fiber:4,   sugar:4,   sodium:480  },
  { id:"aloo_methi",        name:"Aloo Methi",              serving:"1 bowl",         gramsPerServing:200,  cal:190, protein:5,   carbs:26,  fat:8,   fiber:4,   sugar:2,   sodium:320  },
  { id:"baingan_bharta",    name:"Baingan Bharta",          serving:"1 bowl",         gramsPerServing:180,  cal:130, protein:3,   carbs:14,  fat:7,   fiber:4,   sugar:5,   sodium:320  },
  { id:"bharli_vangi",      name:"Bharli Vangi",            serving:"1 bowl",         gramsPerServing:200,  cal:200, protein:5,   carbs:20,  fat:11,  fiber:5,   sugar:5,   sodium:380  },
  { id:"bhindi_masala",     name:"Bhindi Masala",           serving:"1 bowl",         gramsPerServing:180,  cal:150, protein:3,   carbs:16,  fat:8,   fiber:5,   sugar:3,   sodium:290  },
  { id:"mix_veg",           name:"Mix Veg Curry",           serving:"1 bowl",         gramsPerServing:200,  cal:170, protein:5,   carbs:22,  fat:7,   fiber:5,   sugar:4,   sodium:360  },
  { id:"veg_kolhapuri",     name:"Veg Kolhapuri",           serving:"1 bowl",         gramsPerServing:220,  cal:210, protein:7,   carbs:24,  fat:10,  fiber:5,   sugar:4,   sodium:480  },
  { id:"saag",              name:"Saag",                    serving:"1 bowl",         gramsPerServing:200,  cal:140, protein:5,   carbs:12,  fat:8,   fiber:5,   sugar:3,   sodium:340  },
  { id:"sarson_ka_saag",    name:"Sarson Ka Saag",          serving:"1 bowl",         gramsPerServing:200,  cal:160, protein:5,   carbs:14,  fat:9,   fiber:5,   sugar:3,   sodium:360  },
  { id:"ker_sangri",        name:"Ker Sangri",              serving:"1 bowl",         gramsPerServing:180,  cal:160, protein:4,   carbs:18,  fat:8,   fiber:6,   sugar:3,   sodium:380  },
  { id:"gatte_ki_sabzi",    name:"Gatte Ki Sabzi",          serving:"1 bowl",         gramsPerServing:220,  cal:280, protein:10,  carbs:30,  fat:13,  fiber:4,   sugar:3,   sodium:480  },
  { id:"undhiyu",           name:"Undhiyu",                 serving:"1 bowl",         gramsPerServing:250,  cal:280, protein:8,   carbs:32,  fat:14,  fiber:7,   sugar:5,   sodium:520  },
  { id:"kothimbir_vadi",    name:"Kothimbir Vadi",          serving:"4 pieces",       gramsPerServing:120,  cal:200, protein:6,   carbs:28,  fat:7,   fiber:3,   sugar:1,   sodium:380  },
  { id:"handvo",            name:"Handvo",                  serving:"2 slices",       gramsPerServing:140,  cal:200, protein:7,   carbs:28,  fat:7,   fiber:3,   sugar:2,   sodium:360  },
  { id:"veg_stew",          name:"Veg Stew (Kerala)",       serving:"1 bowl",         gramsPerServing:250,  cal:180, protein:4,   carbs:20,  fat:9,   fiber:4,   sugar:5,   sodium:320  },

  // ═══════════════════════════════════════════════════════════
  // CHICKEN & EGG
  // ═══════════════════════════════════════════════════════════
  { id:"chicken_curry",     name:"Chicken Curry",           serving:"1 bowl",         gramsPerServing:250,  cal:300, protein:28,  carbs:8,   fat:16,  fiber:1,   sugar:3,   sodium:620  },
  { id:"butter_chicken",    name:"Butter Chicken",          serving:"1 bowl",         gramsPerServing:250,  cal:370, protein:28,  carbs:14,  fat:22,  fiber:1,   sugar:8,   sodium:740  },
  { id:"kadai_chicken",     name:"Kadai Chicken",           serving:"1 bowl",         gramsPerServing:250,  cal:320, protein:28,  carbs:10,  fat:18,  fiber:2,   sugar:4,   sodium:680  },
  { id:"chicken_masala",    name:"Chicken Masala",          serving:"1 bowl",         gramsPerServing:250,  cal:310, protein:28,  carbs:9,   fat:17,  fiber:1.5, sugar:3,   sodium:660  },
  { id:"chicken_do_pyaza",  name:"Chicken Do Pyaza",        serving:"1 bowl",         gramsPerServing:250,  cal:290, protein:26,  carbs:12,  fat:15,  fiber:2,   sugar:5,   sodium:620  },
  { id:"achari_chicken",    name:"Achari Chicken",          serving:"1 bowl",         gramsPerServing:250,  cal:300, protein:27,  carbs:10,  fat:17,  fiber:1.5, sugar:3,   sodium:720  },
  { id:"methi_chicken",     name:"Methi Chicken",           serving:"1 bowl",         gramsPerServing:250,  cal:280, protein:27,  carbs:9,   fat:15,  fiber:2.5, sugar:2,   sodium:580  },
  { id:"chicken_korma",     name:"Chicken Korma",           serving:"1 bowl",         gramsPerServing:250,  cal:380, protein:28,  carbs:12,  fat:24,  fiber:1,   sugar:5,   sodium:660  },
  { id:"chettinad_chicken", name:"Chettinad Chicken",       serving:"1 bowl",         gramsPerServing:250,  cal:330, protein:28,  carbs:8,   fat:20,  fiber:2,   sugar:3,   sodium:700  },
  { id:"chicken_tikka",     name:"Chicken Tikka",           serving:"6 pieces",       gramsPerServing:180,  cal:250, protein:30,  carbs:5,   fat:12,  fiber:0.5, sugar:2,   sodium:580  },
  { id:"tandoori_chicken",  name:"Tandoori Chicken",        serving:"2 pieces",       gramsPerServing:200,  cal:280, protein:32,  carbs:6,   fat:14,  fiber:0.5, sugar:2,   sodium:640  },
  { id:"chicken_65",        name:"Chicken 65",              serving:"6 pieces",       gramsPerServing:180,  cal:290, protein:24,  carbs:12,  fat:16,  fiber:0.5, sugar:2,   sodium:680  },
  { id:"seekh_kebab",       name:"Seekh Kebab",             serving:"3 pieces",       gramsPerServing:150,  cal:270, protein:22,  carbs:8,   fat:16,  fiber:1,   sugar:2,   sodium:560  },
  { id:"galouti_kebab",     name:"Galouti Kebab",           serving:"3 pieces",       gramsPerServing:150,  cal:310, protein:20,  carbs:12,  fat:20,  fiber:1,   sugar:2,   sodium:580  },
  { id:"shammi_kebab",      name:"Shammi Kebab",            serving:"3 pieces",       gramsPerServing:150,  cal:290, protein:20,  carbs:14,  fat:17,  fiber:2,   sugar:2,   sodium:540  },
  { id:"reshmi_kebab",      name:"Reshmi Kebab",            serving:"3 pieces",       gramsPerServing:150,  cal:300, protein:24,  carbs:6,   fat:20,  fiber:0.5, sugar:2,   sodium:520  },
  { id:"hara_bhara_kebab",  name:"Hara Bhara Kebab",        serving:"3 pieces",       gramsPerServing:150,  cal:200, protein:7,   carbs:26,  fat:8,   fiber:4,   sugar:2,   sodium:380  },
  { id:"chicken_roll",      name:"Chicken Roll / Kathi Roll",serving:"1 roll",        gramsPerServing:180,  cal:350, protein:20,  carbs:40,  fat:12,  fiber:2,   sugar:3,   sodium:560  },
  { id:"chicken_shawarma",  name:"Chicken Shawarma",        serving:"1 wrap",         gramsPerServing:220,  cal:400, protein:24,  carbs:44,  fat:14,  fiber:2,   sugar:4,   sodium:720  },
  { id:"egg_curry",         name:"Egg Curry",               serving:"2 eggs+gravy",   gramsPerServing:220,  cal:240, protein:14,  carbs:10,  fat:16,  fiber:1,   sugar:3,   sodium:520  },
  { id:"egg_bhurji",        name:"Egg Bhurji",              serving:"2 eggs",         gramsPerServing:120,  cal:220, protein:14,  carbs:5,   fat:16,  fiber:0.5, sugar:2,   sodium:380  },
  { id:"omelette",          name:"Omelette",                serving:"2 eggs",         gramsPerServing:100,  cal:190, protein:13,  carbs:2,   fat:14,  fiber:0,   sugar:0.5, sodium:340  },
  { id:"boiled_egg",        name:"Boiled Egg",              serving:"1 egg",          gramsPerServing:50,   cal:78,  protein:6,   carbs:0.6, fat:5,   fiber:0,   sugar:0.5, sodium:62   },
  { id:"anda_paratha",      name:"Anda Paratha",            serving:"1 paratha",      gramsPerServing:150,  cal:320, protein:12,  carbs:38,  fat:14,  fiber:2,   sugar:1,   sodium:420  },

  // ═══════════════════════════════════════════════════════════
  // MUTTON & SEAFOOD
  // ═══════════════════════════════════════════════════════════
  { id:"mutton_curry",      name:"Mutton Curry",            serving:"1 bowl",         gramsPerServing:250,  cal:380, protein:30,  carbs:6,   fat:26,  fiber:1,   sugar:3,   sodium:720  },
  { id:"rogan_josh",        name:"Rogan Josh",              serving:"1 bowl",         gramsPerServing:250,  cal:400, protein:30,  carbs:8,   fat:28,  fiber:1.5, sugar:3,   sodium:740  },
  { id:"keema",             name:"Keema",                   serving:"1 bowl",         gramsPerServing:220,  cal:350, protein:28,  carbs:8,   fat:22,  fiber:1,   sugar:3,   sodium:680  },
  { id:"laal_maas",         name:"Laal Maas",               serving:"1 bowl",         gramsPerServing:250,  cal:420, protein:30,  carbs:8,   fat:30,  fiber:1.5, sugar:3,   sodium:760  },
  { id:"nihari",            name:"Nihari",                  serving:"1 bowl",         gramsPerServing:280,  cal:450, protein:32,  carbs:12,  fat:30,  fiber:2,   sugar:4,   sodium:820  },
  { id:"haleem",            name:"Haleem",                  serving:"1 bowl",         gramsPerServing:280,  cal:380, protein:28,  carbs:28,  fat:16,  fiber:4,   sugar:3,   sodium:760  },
  { id:"paya",              name:"Paya (Trotters Curry)",   serving:"1 bowl",         gramsPerServing:280,  cal:320, protein:26,  carbs:8,   fat:20,  fiber:1,   sugar:2,   sodium:700  },
  { id:"keema_matar",       name:"Keema Matar",             serving:"1 bowl",         gramsPerServing:220,  cal:360, protein:28,  carbs:14,  fat:22,  fiber:3,   sugar:3,   sodium:680  },
  { id:"fish_curry",        name:"Fish Curry",              serving:"1 bowl",         gramsPerServing:250,  cal:230, protein:24,  carbs:8,   fat:11,  fiber:1,   sugar:3,   sodium:560  },
  { id:"kerala_fish_curry", name:"Kerala Fish Curry",       serving:"1 bowl",         gramsPerServing:250,  cal:260, protein:24,  carbs:8,   fat:14,  fiber:1.5, sugar:3,   sodium:580  },
  { id:"goan_fish_curry",   name:"Goan Fish Curry",         serving:"1 bowl",         gramsPerServing:250,  cal:270, protein:24,  carbs:10,  fat:14,  fiber:1.5, sugar:4,   sodium:600  },
  { id:"fish_fry",          name:"Fish Fry",                serving:"2 pieces",       gramsPerServing:160,  cal:240, protein:24,  carbs:8,   fat:13,  fiber:0.5, sugar:1,   sodium:520  },
  { id:"prawn_curry",       name:"Prawn Curry",             serving:"1 bowl",         gramsPerServing:250,  cal:240, protein:22,  carbs:8,   fat:13,  fiber:1,   sugar:3,   sodium:680  },
  { id:"prawn_masala",      name:"Prawn Masala",            serving:"1 bowl",         gramsPerServing:250,  cal:260, protein:22,  carbs:10,  fat:14,  fiber:1,   sugar:3,   sodium:700  },
  { id:"machher_jhol",      name:"Machher Jhol",            serving:"1 bowl",         gramsPerServing:250,  cal:220, protein:22,  carbs:8,   fat:11,  fiber:1,   sugar:3,   sodium:540  },
  { id:"shorshe_ilish",     name:"Shorshe Ilish",           serving:"1 piece+gravy",  gramsPerServing:200,  cal:280, protein:22,  carbs:6,   fat:18,  fiber:1,   sugar:2,   sodium:480  },
  { id:"crab_curry",        name:"Crab Curry",              serving:"1 bowl",         gramsPerServing:250,  cal:220, protein:20,  carbs:8,   fat:12,  fiber:1,   sugar:3,   sodium:680  },

  // ═══════════════════════════════════════════════════════════
  // SNACKS & STREET FOOD
  // ═══════════════════════════════════════════════════════════
  { id:"samosa",            name:"Samosa",                  serving:"1 piece",        gramsPerServing:80,   cal:130, protein:2,   carbs:16,  fat:6,   fiber:1.5, sugar:1,   sodium:280  },
  { id:"vada_pav",          name:"Vada Pav",                serving:"1 piece",        gramsPerServing:130,  cal:290, protein:6,   carbs:44,  fat:10,  fiber:2,   sugar:3,   sodium:480  },
  { id:"batata_vada",       name:"Batata Vada",             serving:"2 pieces",       gramsPerServing:120,  cal:230, protein:4,   carbs:32,  fat:10,  fiber:2,   sugar:2,   sodium:380  },
  { id:"pav_bhaji",         name:"Pav Bhaji",               serving:"2 pav+bhaji",    gramsPerServing:300,  cal:380, protein:10,  carbs:58,  fat:12,  fiber:5,   sugar:6,   sodium:760  },
  { id:"dabeli",            name:"Dabeli",                  serving:"1 piece",        gramsPerServing:120,  cal:260, protein:6,   carbs:40,  fat:8,   fiber:2,   sugar:5,   sodium:440  },
  { id:"pani_puri",         name:"Pani Puri",               serving:"6 pieces",       gramsPerServing:120,  cal:120, protein:2,   carbs:22,  fat:3,   fiber:1.5, sugar:2,   sodium:340  },
  { id:"dahi_puri",         name:"Dahi Puri",               serving:"6 pieces",       gramsPerServing:180,  cal:200, protein:5,   carbs:30,  fat:6,   fiber:2,   sugar:6,   sodium:380  },
  { id:"papdi_chaat",       name:"Papdi Chaat",             serving:"1 plate",        gramsPerServing:180,  cal:250, protein:6,   carbs:36,  fat:8,   fiber:3,   sugar:8,   sodium:520  },
  { id:"dahi_bhalla",       name:"Dahi Bhalla",             serving:"2 pieces",       gramsPerServing:200,  cal:230, protein:8,   carbs:34,  fat:7,   fiber:3,   sugar:10,  sodium:480  },
  { id:"raj_kachori",       name:"Raj Kachori",             serving:"1 piece",        gramsPerServing:200,  cal:320, protein:9,   carbs:44,  fat:12,  fiber:4,   sugar:8,   sodium:580  },
  { id:"bhel_puri",         name:"Bhel Puri",               serving:"1 plate",        gramsPerServing:150,  cal:180, protein:4,   carbs:32,  fat:4,   fiber:2,   sugar:4,   sodium:420  },
  { id:"sev_puri",          name:"Sev Puri",                serving:"1 plate",        gramsPerServing:150,  cal:200, protein:4,   carbs:30,  fat:7,   fiber:2,   sugar:5,   sodium:460  },
  { id:"aloo_tikki",        name:"Aloo Tikki",              serving:"2 pieces",       gramsPerServing:150,  cal:220, protein:4,   carbs:32,  fat:8,   fiber:2.5, sugar:1,   sodium:360  },
  { id:"aloo_tikki_chaat",  name:"Aloo Tikki Chaat",        serving:"1 plate",        gramsPerServing:220,  cal:290, protein:7,   carbs:42,  fat:10,  fiber:3,   sugar:6,   sodium:560  },
  { id:"pakora",            name:"Pakora / Bhajia",         serving:"4 pieces",       gramsPerServing:120,  cal:200, protein:5,   carbs:22,  fat:10,  fiber:2,   sugar:1,   sodium:300  },
  { id:"onion_pakora",      name:"Onion Pakora",            serving:"4 pieces",       gramsPerServing:100,  cal:180, protein:4,   carbs:20,  fat:9,   fiber:2,   sugar:2,   sodium:280  },
  { id:"paneer_pakora",     name:"Paneer Pakora",           serving:"4 pieces",       gramsPerServing:130,  cal:250, protein:10,  carbs:18,  fat:16,  fiber:1.5, sugar:1,   sodium:360  },
  { id:"dhokla",            name:"Dhokla",                  serving:"3 pieces",       gramsPerServing:120,  cal:120, protein:5,   carbs:20,  fat:2,   fiber:1.5, sugar:3,   sodium:380  },
  { id:"khandvi",           name:"Khandvi",                 serving:"6 pieces",       gramsPerServing:120,  cal:140, protein:6,   carbs:18,  fat:4,   fiber:2,   sugar:3,   sodium:360  },
  { id:"fafda_gathiya",     name:"Fafda Gathiya",           serving:"1 plate",        gramsPerServing:80,   cal:240, protein:7,   carbs:30,  fat:11,  fiber:2,   sugar:1,   sodium:340  },
  { id:"kachori",           name:"Kachori",                 serving:"1 piece",        gramsPerServing:80,   cal:180, protein:4,   carbs:22,  fat:8,   fiber:2,   sugar:1,   sodium:280  },
  { id:"medu_vada",         name:"Medu Vada",               serving:"2 pieces",       gramsPerServing:120,  cal:180, protein:6,   carbs:22,  fat:8,   fiber:2,   sugar:0.5, sodium:320  },
  { id:"murukku",           name:"Murukku",                 serving:"4 pieces",       gramsPerServing:40,   cal:180, protein:3,   carbs:24,  fat:8,   fiber:1.5, sugar:0.5, sodium:260  },
  { id:"chakli",            name:"Chakli",                  serving:"4 pieces",       gramsPerServing:40,   cal:190, protein:3,   carbs:25,  fat:9,   fiber:1.5, sugar:0.5, sodium:240  },
  { id:"mathri",            name:"Mathri",                  serving:"3 pieces",       gramsPerServing:40,   cal:185, protein:3,   carbs:22,  fat:9,   fiber:1,   sugar:0.5, sodium:200  },
  { id:"bhujia",            name:"Aloo Bhujia / Sev",       serving:"1 handful",      gramsPerServing:30,   cal:140, protein:3,   carbs:18,  fat:7,   fiber:1,   sugar:0.5, sodium:260  },
  { id:"momos_veg",         name:"Veg Momos",               serving:"6 pieces",       gramsPerServing:180,  cal:200, protein:6,   carbs:34,  fat:4,   fiber:2,   sugar:2,   sodium:480  },
  { id:"momos_chicken",     name:"Chicken Momos",           serving:"6 pieces",       gramsPerServing:180,  cal:240, protein:14,  carbs:30,  fat:6,   fiber:1.5, sugar:2,   sodium:520  },
  { id:"egg_roll",          name:"Egg Roll",                serving:"1 roll",         gramsPerServing:180,  cal:300, protein:12,  carbs:36,  fat:12,  fiber:2,   sugar:3,   sodium:520  },
  { id:"masala_peanuts",    name:"Masala Peanuts",          serving:"1 handful",      gramsPerServing:30,   cal:160, protein:6,   carbs:10,  fat:11,  fiber:2,   sugar:1,   sodium:220  },
  { id:"chivda",            name:"Chivda",                  serving:"1 cup",          gramsPerServing:40,   cal:170, protein:4,   carbs:24,  fat:6,   fiber:2,   sugar:2,   sodium:280  },
  { id:"kadala_curry",      name:"Kadala Curry",            serving:"1 bowl",         gramsPerServing:220,  cal:240, protein:12,  carbs:34,  fat:8,   fiber:8,   sugar:3,   sodium:460  },

  // ═══════════════════════════════════════════════════════════
  // DRINKS & BEVERAGES
  // ═══════════════════════════════════════════════════════════
  { id:"chai",              name:"Chai (Milk Tea)",         serving:"1 cup",          gramsPerServing:150,  cal:60,  protein:2,   carbs:8,   fat:2,   fiber:0,   sugar:7,   sodium:40   },
  { id:"masala_chai",       name:"Masala Chai",             serving:"1 cup",          gramsPerServing:150,  cal:70,  protein:2,   carbs:10,  fat:2,   fiber:0,   sugar:8,   sodium:45   },
  { id:"black_tea",         name:"Black Tea",               serving:"1 cup",          gramsPerServing:150,  cal:5,   protein:0,   carbs:1,   fat:0,   fiber:0,   sugar:0,   sodium:5    },
  { id:"green_tea",         name:"Green Tea",               serving:"1 cup",          gramsPerServing:150,  cal:2,   protein:0,   carbs:0.4, fat:0,   fiber:0,   sugar:0,   sodium:2    },
  { id:"kahwa",             name:"Kashmiri Kahwa",          serving:"1 cup",          gramsPerServing:150,  cal:25,  protein:0.5, carbs:5,   fat:0.5, fiber:0,   sugar:4,   sodium:5    },
  { id:"filter_coffee",     name:"Filter Coffee",           serving:"1 cup",          gramsPerServing:150,  cal:65,  protein:2.5, carbs:8,   fat:2.5, fiber:0,   sugar:7,   sodium:45   },
  { id:"coffee",            name:"Coffee with Milk",        serving:"1 cup",          gramsPerServing:150,  cal:55,  protein:2,   carbs:7,   fat:2,   fiber:0,   sugar:6,   sodium:35   },
  { id:"black_coffee",      name:"Black Coffee",            serving:"1 cup",          gramsPerServing:150,  cal:5,   protein:0,   carbs:1,   fat:0,   fiber:0,   sugar:0,   sodium:5    },
  { id:"cold_coffee",       name:"Cold Coffee",             serving:"1 glass",        gramsPerServing:300,  cal:200, protein:6,   carbs:28,  fat:7,   fiber:0,   sugar:24,  sodium:100  },
  { id:"lassi",             name:"Lassi (Sweet)",           serving:"1 glass",        gramsPerServing:250,  cal:180, protein:6,   carbs:28,  fat:5,   fiber:0,   sugar:24,  sodium:80   },
  { id:"lassi_salt",        name:"Lassi (Salted)",          serving:"1 glass",        gramsPerServing:250,  cal:100, protein:6,   carbs:10,  fat:4,   fiber:0,   sugar:8,   sodium:320  },
  { id:"buttermilk",        name:"Buttermilk / Chaas",      serving:"1 glass",        gramsPerServing:250,  cal:50,  protein:3,   carbs:5,   fat:1,   fiber:0,   sugar:4,   sodium:180  },
  { id:"mango_lassi",       name:"Mango Lassi",             serving:"1 glass",        gramsPerServing:280,  cal:220, protein:5,   carbs:38,  fat:5,   fiber:1,   sugar:32,  sodium:80   },
  { id:"coconut_water",     name:"Coconut Water",           serving:"1 glass",        gramsPerServing:240,  cal:46,  protein:2,   carbs:9,   fat:0.5, fiber:0,   sugar:9,   sodium:252  },
  { id:"nimbu_pani",        name:"Nimbu Pani",              serving:"1 glass",        gramsPerServing:250,  cal:30,  protein:0,   carbs:8,   fat:0,   fiber:0,   sugar:7,   sodium:180  },
  { id:"aam_panna",         name:"Aam Panna",               serving:"1 glass",        gramsPerServing:250,  cal:80,  protein:0.5, carbs:20,  fat:0,   fiber:0.5, sugar:16,  sodium:280  },
  { id:"jaljeera",          name:"Jaljeera",                serving:"1 glass",        gramsPerServing:250,  cal:35,  protein:0.5, carbs:8,   fat:0.5, fiber:0.5, sugar:5,   sodium:380  },
  { id:"thandai",           name:"Thandai",                 serving:"1 glass",        gramsPerServing:280,  cal:220, protein:7,   carbs:28,  fat:9,   fiber:1,   sugar:22,  sodium:80   },
  { id:"rose_sharbat",      name:"Rose Sharbat",            serving:"1 glass",        gramsPerServing:250,  cal:90,  protein:0,   carbs:22,  fat:0,   fiber:0,   sugar:22,  sodium:10   },
  { id:"sugarcane_juice",   name:"Sugarcane Juice",         serving:"1 glass",        gramsPerServing:240,  cal:112, protein:0.4, carbs:28,  fat:0.2, fiber:0,   sugar:26,  sodium:20   },
  { id:"mango_shake",       name:"Mango Milkshake",         serving:"1 glass",        gramsPerServing:300,  cal:260, protein:6,   carbs:44,  fat:7,   fiber:1,   sugar:38,  sodium:80   },
  { id:"banana_shake",      name:"Banana Milkshake",        serving:"1 glass",        gramsPerServing:300,  cal:240, protein:6,   carbs:40,  fat:6,   fiber:1.5, sugar:30,  sodium:80   },
  { id:"golden_milk",       name:"Turmeric Milk (Haldi Doodh)", serving:"1 cup",      gramsPerServing:240,  cal:140, protein:7,   carbs:14,  fat:7,   fiber:0,   sugar:12,  sodium:95   },
  { id:"milk",              name:"Milk (Full Fat)",         serving:"1 glass",        gramsPerServing:240,  cal:150, protein:8,   carbs:12,  fat:8,   fiber:0,   sugar:12,  sodium:105  },
  { id:"milk_skim",         name:"Milk (Skimmed)",          serving:"1 glass",        gramsPerServing:240,  cal:90,  protein:8,   carbs:12,  fat:0.5, fiber:0,   sugar:12,  sodium:105  },
  { id:"horlicks",          name:"Horlicks / Bournvita",    serving:"1 cup",          gramsPerServing:240,  cal:160, protein:6,   carbs:26,  fat:4,   fiber:0,   sugar:18,  sodium:120  },

  // ═══════════════════════════════════════════════════════════
  // DAIRY
  // ═══════════════════════════════════════════════════════════
  { id:"paneer",            name:"Paneer",                  serving:"100g",           gramsPerServing:100,  cal:265, protein:18,  carbs:4,   fat:20,  fiber:0,   sugar:2,   sodium:30   },
  { id:"curd",              name:"Curd / Dahi",             serving:"1 cup",          gramsPerServing:245,  cal:100, protein:6,   carbs:8,   fat:4,   fiber:0,   sugar:8,   sodium:80   },
  { id:"ghee",              name:"Ghee",                    serving:"1 tsp",          gramsPerServing:5,    cal:45,  protein:0,   carbs:0,   fat:5,   fiber:0,   sugar:0,   sodium:0    },
  { id:"butter",            name:"Butter",                  serving:"1 tsp",          gramsPerServing:5,    cal:35,  protein:0,   carbs:0,   fat:4,   fiber:0,   sugar:0,   sodium:30   },
  { id:"cream",             name:"Fresh Cream",             serving:"1 tbsp",         gramsPerServing:15,   cal:52,  protein:0.3, carbs:0.4, fat:5.5, fiber:0,   sugar:0.4, sodium:6    },
  { id:"khoya",             name:"Khoya / Mawa",            serving:"50g",            gramsPerServing:50,   cal:170, protein:7,   carbs:13,  fat:10,  fiber:0,   sugar:12,  sodium:70   },
  { id:"mishti_doi",        name:"Mishti Doi",              serving:"1 cup",          gramsPerServing:200,  cal:180, protein:5,   carbs:30,  fat:5,   fiber:0,   sugar:28,  sodium:70   },
  { id:"shrikhand",         name:"Shrikhand",               serving:"1 cup",          gramsPerServing:150,  cal:280, protein:8,   carbs:40,  fat:9,   fiber:0,   sugar:36,  sodium:80   },

  // ═══════════════════════════════════════════════════════════
  // SWEETS & DESSERTS
  // ═══════════════════════════════════════════════════════════
  { id:"gulab_jamun",       name:"Gulab Jamun",             serving:"2 pieces",       gramsPerServing:120,  cal:250, protein:4,   carbs:40,  fat:8,   fiber:0.5, sugar:35,  sodium:120  },
  { id:"kala_jamun",        name:"Kala Jamun",              serving:"2 pieces",       gramsPerServing:120,  cal:260, protein:4,   carbs:42,  fat:8,   fiber:0.5, sugar:36,  sodium:120  },
  { id:"jalebi",            name:"Jalebi",                  serving:"3 pieces",       gramsPerServing:80,   cal:220, protein:2,   carbs:45,  fat:4,   fiber:0,   sugar:38,  sodium:80   },
  { id:"rasgulla",          name:"Rasgulla",                serving:"2 pieces",       gramsPerServing:120,  cal:150, protein:4,   carbs:28,  fat:2,   fiber:0,   sugar:24,  sodium:60   },
  { id:"rasmalai",          name:"Rasmalai",                serving:"2 pieces",       gramsPerServing:150,  cal:200, protein:6,   carbs:28,  fat:7,   fiber:0,   sugar:24,  sodium:80   },
  { id:"chomchom",          name:"Chomchom",                serving:"2 pieces",       gramsPerServing:120,  cal:180, protein:4,   carbs:30,  fat:5,   fiber:0,   sugar:26,  sodium:70   },
  { id:"sandesh",           name:"Sandesh",                 serving:"2 pieces",       gramsPerServing:80,   cal:180, protein:6,   carbs:24,  fat:6,   fiber:0,   sugar:20,  sodium:50   },
  { id:"kalakand",          name:"Kalakand",                serving:"1 piece",        gramsPerServing:60,   cal:170, protein:5,   carbs:24,  fat:6,   fiber:0,   sugar:20,  sodium:60   },
  { id:"mysore_pak",        name:"Mysore Pak",              serving:"1 piece",        gramsPerServing:40,   cal:190, protein:3,   carbs:22,  fat:10,  fiber:1,   sugar:16,  sodium:40   },
  { id:"kheer",             name:"Kheer",                   serving:"1 bowl",         gramsPerServing:200,  cal:250, protein:6,   carbs:40,  fat:7,   fiber:0.5, sugar:30,  sodium:100  },
  { id:"gajar_halwa",       name:"Gajar Ka Halwa",          serving:"1 bowl",         gramsPerServing:150,  cal:290, protein:5,   carbs:42,  fat:12,  fiber:3,   sugar:30,  sodium:80   },
  { id:"sooji_halwa",       name:"Sooji Halwa",             serving:"1 bowl",         gramsPerServing:150,  cal:320, protein:4,   carbs:50,  fat:12,  fiber:1,   sugar:28,  sodium:80   },
  { id:"moong_halwa",       name:"Moong Dal Halwa",         serving:"1 bowl",         gramsPerServing:150,  cal:380, protein:8,   carbs:48,  fat:18,  fiber:3,   sugar:30,  sodium:80   },
  { id:"besan_ladoo",       name:"Besan Ladoo",             serving:"1 piece",        gramsPerServing:50,   cal:170, protein:4,   carbs:22,  fat:8,   fiber:1,   sugar:14,  sodium:40   },
  { id:"motichoor_ladoo",   name:"Motichoor Ladoo",         serving:"1 piece",        gramsPerServing:40,   cal:155, protein:2,   carbs:24,  fat:6,   fiber:0.5, sugar:18,  sodium:40   },
  { id:"barfi",             name:"Barfi",                   serving:"1 piece",        gramsPerServing:40,   cal:150, protein:3,   carbs:22,  fat:6,   fiber:0,   sugar:18,  sodium:30   },
  { id:"kaju_katli",        name:"Kaju Katli",              serving:"2 pieces",       gramsPerServing:40,   cal:200, protein:4,   carbs:28,  fat:9,   fiber:0.5, sugar:22,  sodium:20   },
  { id:"peda",              name:"Peda",                    serving:"2 pieces",       gramsPerServing:60,   cal:200, protein:4,   carbs:30,  fat:7,   fiber:0,   sugar:26,  sodium:50   },
  { id:"halwa_sooji",       name:"Halwa",                   serving:"1 bowl",         gramsPerServing:150,  cal:320, protein:4,   carbs:50,  fat:12,  fiber:1,   sugar:28,  sodium:80   },
  { id:"kulfi",             name:"Kulfi",                   serving:"1 stick",        gramsPerServing:80,   cal:140, protein:3,   carbs:18,  fat:6,   fiber:0,   sugar:16,  sodium:60   },
  { id:"mango_kulfi",       name:"Mango Kulfi",             serving:"1 stick",        gramsPerServing:80,   cal:150, protein:3,   carbs:20,  fat:6,   fiber:0.5, sugar:18,  sodium:55   },
  { id:"rabdi",             name:"Rabdi",                   serving:"1 bowl",         gramsPerServing:150,  cal:260, protein:7,   carbs:32,  fat:12,  fiber:0,   sugar:28,  sodium:80   },
  { id:"phirni",            name:"Phirni",                  serving:"1 bowl",         gramsPerServing:150,  cal:200, protein:5,   carbs:32,  fat:6,   fiber:0.5, sugar:26,  sodium:70   },
  { id:"sheer_khurma",      name:"Sheer Khurma",            serving:"1 bowl",         gramsPerServing:200,  cal:350, protein:8,   carbs:46,  fat:15,  fiber:2,   sugar:36,  sodium:100  },
  { id:"sevaiyan",          name:"Sevaiyan (Sweet Vermicelli)", serving:"1 bowl",     gramsPerServing:180,  cal:280, protein:6,   carbs:42,  fat:9,   fiber:1.5, sugar:22,  sodium:80   },
  { id:"malpua",            name:"Malpua",                  serving:"2 pieces",       gramsPerServing:120,  cal:300, protein:5,   carbs:44,  fat:12,  fiber:1,   sugar:28,  sodium:120  },
  { id:"puran_poli",        name:"Puran Poli",              serving:"1 piece",        gramsPerServing:100,  cal:260, protein:6,   carbs:44,  fat:7,   fiber:3,   sugar:20,  sodium:100  },
  { id:"modak",             name:"Modak",                   serving:"2 pieces",       gramsPerServing:100,  cal:200, protein:3,   carbs:34,  fat:6,   fiber:2,   sugar:16,  sodium:60   },
  { id:"basundi",           name:"Basundi",                 serving:"1 bowl",         gramsPerServing:150,  cal:240, protein:7,   carbs:30,  fat:10,  fiber:0,   sugar:26,  sodium:80   },
  { id:"ice_cream",         name:"Ice Cream (Vanilla)",     serving:"1 scoop",        gramsPerServing:65,   cal:137, protein:2.3, carbs:16,  fat:7,   fiber:0,   sugar:14,  sodium:53   },

  // ═══════════════════════════════════════════════════════════
  // FRUITS
  // ═══════════════════════════════════════════════════════════
  { id:"banana",            name:"Banana",                  serving:"1 medium",       gramsPerServing:118,  cal:89,  protein:1,   carbs:23,  fat:0.3, fiber:2.6, sugar:12,  sodium:1    },
  { id:"apple",             name:"Apple",                   serving:"1 medium",       gramsPerServing:182,  cal:72,  protein:0.4, carbs:19,  fat:0.2, fiber:3.3, sugar:14,  sodium:1    },
  { id:"mango",             name:"Mango",                   serving:"1 cup sliced",   gramsPerServing:165,  cal:99,  protein:1.4, carbs:25,  fat:0.6, fiber:2.6, sugar:22,  sodium:2    },
  { id:"orange",            name:"Orange",                  serving:"1 medium",       gramsPerServing:131,  cal:62,  protein:1.2, carbs:15,  fat:0.2, fiber:3.1, sugar:12,  sodium:0    },
  { id:"grapes",            name:"Grapes",                  serving:"1 cup",          gramsPerServing:151,  cal:104, protein:1,   carbs:27,  fat:0.2, fiber:1.4, sugar:23,  sodium:3    },
  { id:"watermelon",        name:"Watermelon",              serving:"2 cups",         gramsPerServing:280,  cal:85,  protein:1.7, carbs:21,  fat:0.4, fiber:1.1, sugar:17,  sodium:3    },
  { id:"papaya",            name:"Papaya",                  serving:"1 cup",          gramsPerServing:145,  cal:55,  protein:0.9, carbs:14,  fat:0.2, fiber:2.5, sugar:8,   sodium:4    },
  { id:"guava",             name:"Guava",                   serving:"1 medium",       gramsPerServing:100,  cal:68,  protein:2.6, carbs:14,  fat:1,   fiber:5.4, sugar:9,   sodium:2    },
  { id:"pomegranate",       name:"Pomegranate",             serving:"1 cup seeds",    gramsPerServing:174,  cal:144, protein:2.9, carbs:32,  fat:2,   fiber:7,   sugar:24,  sodium:5    },
  { id:"pineapple",         name:"Pineapple",               serving:"1 cup",          gramsPerServing:165,  cal:82,  protein:0.9, carbs:22,  fat:0.2, fiber:2.3, sugar:16,  sodium:2    },
  { id:"chikoo",            name:"Chikoo / Sapodilla",      serving:"1 medium",       gramsPerServing:100,  cal:83,  protein:0.4, carbs:20,  fat:1.1, fiber:5.3, sugar:13,  sodium:12   },
  { id:"sitaphal",          name:"Sitaphal / Custard Apple",serving:"1 medium",       gramsPerServing:100,  cal:94,  protein:2.1, carbs:23,  fat:0.3, fiber:4.4, sugar:17,  sodium:4    },
  { id:"jackfruit",         name:"Jackfruit",               serving:"1 cup",          gramsPerServing:165,  cal:155, protein:2.8, carbs:40,  fat:0.5, fiber:2.5, sugar:32,  sodium:3    },
  { id:"lychee",            name:"Lychee",                  serving:"10 pieces",      gramsPerServing:100,  cal:66,  protein:0.8, carbs:17,  fat:0.4, fiber:1.3, sugar:15,  sodium:1    },
  { id:"dates",             name:"Dates (Khajoor)",         serving:"3 pieces",       gramsPerServing:24,   cal:66,  protein:0.4, carbs:18,  fat:0,   fiber:1.6, sugar:16,  sodium:0    },

  // ═══════════════════════════════════════════════════════════
  // SALADS, SIDES & CONDIMENTS
  // ═══════════════════════════════════════════════════════════
  { id:"raita",             name:"Raita",                   serving:"1 bowl",         gramsPerServing:150,  cal:70,  protein:3,   carbs:7,   fat:3,   fiber:0.5, sugar:5,   sodium:200  },
  { id:"boondi_raita",      name:"Boondi Raita",            serving:"1 bowl",         gramsPerServing:150,  cal:110, protein:3,   carbs:12,  fat:5,   fiber:0.5, sugar:5,   sodium:260  },
  { id:"papad",             name:"Papad (roasted)",         serving:"1 piece",        gramsPerServing:10,   cal:35,  protein:2,   carbs:6,   fat:0.5, fiber:0.5, sugar:0,   sodium:190  },
  { id:"pickle",            name:"Pickle / Achar",          serving:"1 tsp",          gramsPerServing:10,   cal:20,  protein:0,   carbs:2,   fat:1.5, fiber:0.5, sugar:0.5, sodium:380  },
  { id:"chutney",           name:"Chutney (Coconut/Mint)",  serving:"2 tbsp",         gramsPerServing:30,   cal:30,  protein:1,   carbs:4,   fat:1,   fiber:1,   sugar:2,   sodium:120  },
  { id:"tomato_chutney",    name:"Tomato Chutney",          serving:"2 tbsp",         gramsPerServing:30,   cal:25,  protein:0.5, carbs:4,   fat:0.5, fiber:1,   sugar:2,   sodium:180  },
  { id:"tamarind_chutney",  name:"Tamarind Chutney",        serving:"1 tbsp",         gramsPerServing:15,   cal:40,  protein:0.3, carbs:10,  fat:0,   fiber:0.5, sugar:8,   sodium:140  },
  { id:"green_chutney",     name:"Green Chutney (Coriander)",serving:"1 tbsp",        gramsPerServing:15,   cal:15,  protein:0.5, carbs:2,   fat:0.5, fiber:0.5, sugar:0.5, sodium:80   },
  { id:"kachumber",         name:"Kachumber Salad",         serving:"1 bowl",         gramsPerServing:150,  cal:40,  protein:1.5, carbs:8,   fat:0.5, fiber:2.5, sugar:4,   sodium:120  },
  { id:"onion_salad",       name:"Onion Salad",             serving:"1 small bowl",   gramsPerServing:80,   cal:32,  protein:0.8, carbs:7,   fat:0.1, fiber:1.4, sugar:3,   sodium:3    },

  // ═══════════════════════════════════════════════════════════
  // FAST FOOD & OTHER
  // ═══════════════════════════════════════════════════════════
  { id:"maggi",             name:"Maggi Noodles",           serving:"1 packet",       gramsPerServing:70,   cal:310, protein:7,   carbs:44,  fat:12,  fiber:1.5, sugar:2,   sodium:1040 },
  { id:"pizza_slice",       name:"Pizza Slice",             serving:"1 slice",        gramsPerServing:107,  cal:280, protein:12,  carbs:34,  fat:10,  fiber:2,   sugar:4,   sodium:640  },
  { id:"burger",            name:"Veg Burger",              serving:"1 burger",       gramsPerServing:180,  cal:310, protein:8,   carbs:44,  fat:11,  fiber:3,   sugar:6,   sodium:680  },
  { id:"burger_chicken",    name:"Chicken Burger",          serving:"1 burger",       gramsPerServing:200,  cal:380, protein:22,  carbs:40,  fat:14,  fiber:2,   sugar:6,   sodium:780  },
  { id:"paneer_sandwich",   name:"Paneer Sandwich",         serving:"1 sandwich",     gramsPerServing:180,  cal:330, protein:12,  carbs:42,  fat:12,  fiber:2,   sugar:4,   sodium:580  },
  { id:"veg_sandwich",      name:"Veg Sandwich",            serving:"1 sandwich",     gramsPerServing:150,  cal:240, protein:7,   carbs:38,  fat:7,   fiber:3,   sugar:4,   sodium:520  },
  { id:"frankies",          name:"Veg Frankie",             serving:"1 roll",         gramsPerServing:180,  cal:310, protein:8,   carbs:46,  fat:10,  fiber:3,   sugar:3,   sodium:580  },

  // ═══════════════════════════════════════════════════════════
  // NUTS, SEEDS & OILS
  // ═══════════════════════════════════════════════════════════
  { id:"almonds",           name:"Almonds",                 serving:"10 pieces",      gramsPerServing:14,   cal:82,  protein:3,   carbs:3,   fat:7,   fiber:1.7, sugar:0.7, sodium:0    },
  { id:"cashews",           name:"Cashews",                 serving:"10 pieces",      gramsPerServing:15,   cal:88,  protein:2.3, carbs:5,   fat:7,   fiber:0.3, sugar:1,   sodium:2    },
  { id:"peanuts",           name:"Peanuts (roasted)",       serving:"1 handful",      gramsPerServing:30,   cal:170, protein:7,   carbs:5,   fat:14,  fiber:2.4, sugar:1,   sodium:5    },
  { id:"walnuts",           name:"Walnuts",                 serving:"5 halves",       gramsPerServing:15,   cal:98,  protein:2.3, carbs:2,   fat:10,  fiber:1,   sugar:0.4, sodium:0    },
  { id:"coconut",           name:"Coconut (fresh)",         serving:"1 tbsp",         gramsPerServing:15,   cal:50,  protein:0.5, carbs:2,   fat:5,   fiber:1.3, sugar:1,   sodium:3    },
  { id:"sesame_seeds",      name:"Sesame Seeds (til)",      serving:"1 tbsp",         gramsPerServing:9,    cal:52,  protein:1.6, carbs:2,   fat:4.5, fiber:1,   sugar:0,   sodium:1    },
  { id:"flaxseeds",         name:"Flaxseeds (alsi)",        serving:"1 tbsp",         gramsPerServing:10,   cal:55,  protein:1.9, carbs:3,   fat:4.3, fiber:2.8, sugar:0.2, sodium:3    },
  { id:"coconut_oil",       name:"Coconut Oil",             serving:"1 tsp",          gramsPerServing:5,    cal:45,  protein:0,   carbs:0,   fat:5,   fiber:0,   sugar:0,   sodium:0    },
  { id:"mustard_oil",       name:"Mustard Oil",             serving:"1 tsp",          gramsPerServing:5,    cal:45,  protein:0,   carbs:0,   fat:5,   fiber:0,   sugar:0,   sodium:0    },
  { id:"olive_oil",         name:"Olive Oil",               serving:"1 tsp",          gramsPerServing:5,    cal:44,  protein:0,   carbs:0,   fat:5,   fiber:0,   sugar:0,   sodium:0    },

  // ═══════════════════════════════════════════════════════════
  // RAW INGREDIENTS (useful for recipe builder)
  // ═══════════════════════════════════════════════════════════
  { id:"raw_chicken",       name:"Chicken (raw)",           serving:"100g",           gramsPerServing:100,  cal:165, protein:31,  carbs:0,   fat:3.6, fiber:0,   sugar:0,   sodium:74   },
  { id:"raw_mutton",        name:"Mutton (raw)",            serving:"100g",           gramsPerServing:100,  cal:194, protein:26,  carbs:0,   fat:10,  fiber:0,   sugar:0,   sodium:72   },
  { id:"raw_fish",          name:"Fish (raw)",              serving:"100g",           gramsPerServing:100,  cal:128, protein:20,  carbs:0,   fat:5,   fiber:0,   sugar:0,   sodium:64   },
  { id:"raw_prawn",         name:"Prawn / Shrimp (raw)",    serving:"100g",           gramsPerServing:100,  cal:99,  protein:20,  carbs:0.9, fat:0.3, fiber:0,   sugar:0,   sodium:111  },
  { id:"raw_paneer",        name:"Paneer (raw)",            serving:"100g",           gramsPerServing:100,  cal:265, protein:18,  carbs:4,   fat:20,  fiber:0,   sugar:2,   sodium:30   },
  { id:"raw_potato",        name:"Potato (raw, boiled)",    serving:"1 medium",       gramsPerServing:150,  cal:116, protein:2.5, carbs:26,  fat:0.1, fiber:2.4, sugar:1.4, sodium:8    },
  { id:"raw_onion",         name:"Onion",                   serving:"1 medium",       gramsPerServing:110,  cal:44,  protein:1.2, carbs:10,  fat:0.1, fiber:1.9, sugar:4.7, sodium:4    },
  { id:"raw_tomato",        name:"Tomato",                  serving:"1 medium",       gramsPerServing:123,  cal:22,  protein:1.1, carbs:4.8, fat:0.2, fiber:1.5, sugar:3.2, sodium:6    },
  { id:"raw_spinach",       name:"Spinach (palak)",         serving:"1 cup",          gramsPerServing:30,   cal:7,   protein:0.9, carbs:1.1, fat:0.1, fiber:0.7, sugar:0.1, sodium:24   },
  { id:"raw_carrot",        name:"Carrot (gajar)",          serving:"1 medium",       gramsPerServing:61,   cal:25,  protein:0.6, carbs:6,   fat:0.1, fiber:1.7, sugar:2.9, sodium:42   },
  { id:"raw_cauliflower",   name:"Cauliflower (gobi)",      serving:"1 cup",          gramsPerServing:100,  cal:25,  protein:2,   carbs:5,   fat:0.3, fiber:2,   sugar:2,   sodium:30   },
  { id:"raw_peas",          name:"Peas (matar, fresh)",     serving:"1 cup",          gramsPerServing:145,  cal:117, protein:8,   carbs:21,  fat:0.6, fiber:7.4, sugar:8,   sodium:7    },
  { id:"raw_eggplant",      name:"Eggplant (baingan)",      serving:"1 cup",          gramsPerServing:82,   cal:20,  protein:0.8, carbs:4.8, fat:0.2, fiber:2.5, sugar:2.9, sodium:2    },
  { id:"raw_okra",          name:"Okra (bhindi)",           serving:"1 cup",          gramsPerServing:100,  cal:33,  protein:2,   carbs:7,   fat:0.2, fiber:3.2, sugar:1.5, sodium:7    },
  { id:"raw_capsicum",      name:"Capsicum (shimla mirch)", serving:"1 medium",       gramsPerServing:119,  cal:31,  protein:1,   carbs:7,   fat:0.3, fiber:2.5, sugar:3.5, sodium:4    },
  { id:"raw_ginger",        name:"Ginger",                  serving:"1 tsp grated",   gramsPerServing:5,    cal:2,   protein:0,   carbs:0.4, fat:0,   fiber:0,   sugar:0,   sodium:0    },
  { id:"raw_garlic",        name:"Garlic",                  serving:"2 cloves",       gramsPerServing:6,    cal:9,   protein:0.4, carbs:2,   fat:0,   fiber:0.1, sugar:0.1, sodium:1    },
  { id:"chana_raw",         name:"Chickpeas (chana, cooked)",serving:"1 cup",         gramsPerServing:164,  cal:269, protein:15,  carbs:45,  fat:4.2, fiber:12.5,sugar:7.9, sodium:11   },
  { id:"rajma_raw",         name:"Kidney Beans (cooked)",   serving:"1 cup",          gramsPerServing:177,  cal:225, protein:15,  carbs:40,  fat:0.9, fiber:13.1,sugar:0.6, sodium:2    },
  { id:"moong_raw",         name:"Moong Dal (cooked)",      serving:"1 cup",          gramsPerServing:202,  cal:212, protein:14,  carbs:38,  fat:0.8, fiber:15.4,sugar:4,   sodium:4    },
  { id:"raw_oats",          name:"Oats (raw)",              serving:"1/2 cup",        gramsPerServing:40,   cal:154, protein:5.4, carbs:27,  fat:2.6, fiber:4,   sugar:0.8, sodium:2    },
  { id:"whole_wheat_flour", name:"Whole Wheat Flour (atta)",serving:"100g",           gramsPerServing:100,  cal:340, protein:13,  carbs:69,  fat:2.5, fiber:10,  sugar:0.5, sodium:2    },
  { id:"maida",             name:"Maida (Refined Flour)",   serving:"100g",           gramsPerServing:100,  cal:360, protein:10,  carbs:75,  fat:1,   fiber:2.5, sugar:0.5, sodium:2    },
  { id:"besan_raw",         name:"Besan (Gram Flour)",      serving:"100g",           gramsPerServing:100,  cal:387, protein:22,  carbs:58,  fat:6,   fiber:11,  sugar:8,   sodium:64   },
  { id:"basmati_rice_raw",  name:"Basmati Rice (raw)",      serving:"100g",           gramsPerServing:100,  cal:349, protein:7,   carbs:77,  fat:0.5, fiber:1.4, sugar:0,   sodium:4    },
  { id:"sugar",             name:"Sugar",                   serving:"1 tsp",          gramsPerServing:4,    cal:16,  protein:0,   carbs:4,   fat:0,   fiber:0,   sugar:4,   sodium:0    },
  { id:"jaggery",           name:"Jaggery (Gur)",           serving:"1 tsp",          gramsPerServing:5,    cal:19,  protein:0,   carbs:5,   fat:0,   fiber:0,   sugar:4.8, sodium:3    },
  { id:"honey",             name:"Honey",                   serving:"1 tsp",          gramsPerServing:7,    cal:21,  protein:0,   carbs:6,   fat:0,   fiber:0,   sugar:5.8, sodium:0    },
];

// Voice/text aliases
export const ALIASES = {
  "chapati":"roti","phulka":"roti","rice":"steamed_rice","plain rice":"steamed_rice",
  "white rice":"steamed_rice","dal":"dal_tadka","lentils":"dal_tadka","chana":"chole",
  "chickpeas":"chole","kidney beans":"rajma","tea":"chai","milk tea":"chai",
  "egg":"boiled_egg","eggs":"boiled_egg","dahi":"curd","yogurt":"curd","yoghurt":"curd",
  "noodles":"maggi","instant noodles":"maggi","lemon water":"nimbu_pani","nimbu water":"nimbu_pani",
  "saag":"sarson_ka_saag","makhani":"paneer_butter_masala","korma":"chicken_korma",
  "kebab":"seekh_kebab","paneer":"paneer","kheer":"kheer","biryani":"biryani_chicken",
  "aloo":"raw_potato","onion":"raw_onion","tomato":"raw_tomato","garlic":"raw_garlic",
  "ginger":"raw_ginger","atta":"whole_wheat_flour","halwa":"sooji_halwa",
};

export function searchFood(query, customRecipes = []) {
  if (!query) return [];
  const q = query.toLowerCase().trim();

  const aliasId = ALIASES[q];
  if (aliasId) {
    const food = FOODS.find(f => f.id === aliasId);
    if (food) return [food];
  }

  const allFoods = [...customRecipes, ...FOODS];
  return allFoods
    .map(f => {
      const name = f.name.toLowerCase();
      if (name === q) return { food: f, score: 100 };
      if (name.startsWith(q)) return { food: f, score: 80 };
      if (name.includes(q)) return { food: f, score: 60 };
      const words = q.split(" ").filter(w => w.length > 2);
      const matched = words.filter(w => name.includes(w)).length;
      if (matched > 0) return { food: f, score: matched * 20 };
      return { food: f, score: 0 };
    })
    .filter(r => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 6)
    .map(r => r.food);
}

export function calcMacros(food, { quantity = 1, grams = null }) {
  const multiplier = grams != null ? grams / food.gramsPerServing : quantity;
  return {
    cal:     Math.round(food.cal     * multiplier),
    protein: Math.round(food.protein * multiplier * 10) / 10,
    carbs:   Math.round(food.carbs   * multiplier * 10) / 10,
    fat:     Math.round(food.fat     * multiplier * 10) / 10,
    fiber:   Math.round((food.fiber  || 0) * multiplier * 10) / 10,
    sugar:   Math.round((food.sugar  || 0) * multiplier * 10) / 10,
    sodium:  Math.round((food.sodium || 0) * multiplier),
  };
}

export function getMealTypeByTime() {
  const h = new Date().getHours();
  if (h >= 5  && h < 11) return "breakfast";
  if (h >= 11 && h < 16) return "lunch";
  if (h >= 16 && h < 19) return "snack";
  return "dinner";
}

export function parseMealTypeFromText(text) {
  const t = text.toLowerCase();
  if (t.includes("breakfast") || t.includes("morning")) return "breakfast";
  if (t.includes("lunch")     || t.includes("afternoon")) return "lunch";
  if (t.includes("dinner")    || t.includes("supper") || t.includes("night")) return "dinner";
  if (t.includes("snack")     || t.includes("evening")) return "snack";
  return null;
}

export function parseAmountFromText(text) {
  const t = text.toLowerCase();
  const gramMatch = t.match(/(\d+(?:\.\d+)?)\s*(?:grams?|gm|g)\b/);
  if (gramMatch) return { quantity: 1, grams: parseFloat(gramMatch[1]) };
  const mlMatch = t.match(/(\d+(?:\.\d+)?)\s*(?:ml|milliliter)/);
  if (mlMatch) return { quantity: 1, grams: parseFloat(mlMatch[1]) };
  if (t.includes("half") || t.includes("0.5")) return { quantity: 0.5, grams: null };
  if (t.includes("quarter") || t.includes("1/4")) return { quantity: 0.25, grams: null };
  const numMatch = t.match(/\b([2-9]|10)\b/);
  if (numMatch) return { quantity: parseInt(numMatch[1]), grams: null };
  if (t.includes("two"))   return { quantity: 2, grams: null };
  if (t.includes("three")) return { quantity: 3, grams: null };
  if (t.includes("four"))  return { quantity: 4, grams: null };
  return { quantity: 1, grams: null };
}
