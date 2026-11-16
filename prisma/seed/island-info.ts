/*
 * Facts and a lead photo for inhabited islands, from each island's English Wikipedia article and
 * Wikimedia Commons (fetched 2026-11-16). Photos are credited on the island's page.
 * Islands whose article couldn't be matched safely are left out.
 */
export type IslandFacts = {
  /** Wikipedia article title, for the source link */
  title: string;
  population?: number;
  populationYear?: string;
  areaKm2?: number;
  fromMaleKm?: number;
  direction?: string;
  photo?: { src: string; credit: string; licence: string; source: string };
};

export const ISLAND_FACTS: Record<string, Record<string, IslandFacts>> = {
  "haa-alif": {
    "Baarah": {
      "title": "Baarah",
      "population": 1141,
      "populationYear": "2022"
    },
    "Dhidhdhoo": {
      "title": "Dhidhdhoo",
      "population": 4765,
      "populationYear": "2022"
    },
    "Filladhoo": {
      "title": "Filladhoo",
      "population": 559,
      "populationYear": "2022",
      "areaKm2": 2.49,
      "photo": {
        "src": "https://upload.wikimedia.org/wikipedia/commons/6/66/Filladhoo_school_-_panoramio.jpg",
        "credit": "adam haleem",
        "licence": "CC BY 3.0",
        "source": "https://commons.wikimedia.org/wiki/File:Filladhoo_school_-_panoramio.jpg"
      }
    },
    "Hoarafushi": {
      "title": "Hoarafushi",
      "population": 3613,
      "populationYear": "2025",
      "photo": {
        "src": "https://upload.wikimedia.org/wikipedia/commons/e/ef/Aerial_view_of_Hoarafushi%2C_Haa_Alif_Atoll%2C_Maldives.jpg",
        "credit": "Ahmedidn",
        "licence": "CC0",
        "source": "https://commons.wikimedia.org/wiki/File:Aerial_view_of_Hoarafushi,_Haa_Alif_Atoll,_Maldives.jpg"
      }
    },
    "Ihavandhoo": {
      "title": "Ihavandhoo",
      "population": 3767,
      "populationYear": "2025"
    },
    "Kelaa": {
      "title": "Kelaa (Haa Alif Atoll)",
      "population": 1115,
      "populationYear": "2022",
      "photo": {
        "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/e/eb/Thudee_muli_-_panoramio.jpg/1920px-Thudee_muli_-_panoramio.jpg",
        "credit": "@.IMAD.COM",
        "licence": "CC BY-SA 3.0",
        "source": "https://commons.wikimedia.org/wiki/File:Thudee_muli_-_panoramio.jpg"
      }
    },
    "Maarandhoo": {
      "title": "Maarandhoo (Haa Alif Atoll)",
      "population": 668,
      "populationYear": "2022",
      "photo": {
        "src": "https://upload.wikimedia.org/wikipedia/commons/3/34/Maarandhoo_office1.jpg",
        "credit": "Coimalaa at English Wikipedia",
        "licence": "CC BY-SA 3.0",
        "source": "https://commons.wikimedia.org/wiki/File:Maarandhoo_office1.jpg"
      }
    },
    "Mulhadhoo": {
      "title": "Molhadhoo",
      "population": 286,
      "populationYear": "2022"
    },
    "Muraidhoo": {
      "title": "Muraidhoo",
      "population": 534,
      "populationYear": "2022",
      "photo": {
        "src": "https://upload.wikimedia.org/wikipedia/commons/8/8e/Muraidhoo.jpg",
        "credit": "Andreas Faessler",
        "licence": "CC BY-SA 4.0",
        "source": "https://commons.wikimedia.org/wiki/File:Muraidhoo.jpg"
      }
    },
    "Thakandhoo": {
      "title": "Thakandhoo",
      "population": 279,
      "populationYear": "2022",
      "photo": {
        "src": "https://upload.wikimedia.org/wikipedia/commons/c/ca/Thakandhoo-Aerial~2.jpg",
        "credit": "Zuvaan Masveriyaa",
        "licence": "CC BY 4.0",
        "source": "https://commons.wikimedia.org/wiki/File:Thakandhoo-Aerial~2.jpg"
      }
    },
    "Thuraakunu": {
      "title": "Thuraakunu",
      "population": 427,
      "populationYear": "2022"
    },
    "Uligamu": {
      "title": "Uligan",
      "population": 400,
      "populationYear": "2022"
    },
    "Utheemu": {
      "title": "Utheemu",
      "population": 612,
      "populationYear": "2022",
      "photo": {
        "src": "https://upload.wikimedia.org/wikipedia/commons/5/5a/Utheemu03.jpg",
        "credit": "Andreas Faessler",
        "licence": "CC BY-SA 4.0",
        "source": "https://commons.wikimedia.org/wiki/File:Utheemu03.jpg"
      }
    },
    "Vashafaru": {
      "title": "Vashafaru",
      "population": 476,
      "populationYear": "2022",
      "photo": {
        "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/9/9e/The_White_Sands_of_Vashafaru.jpg/1920px-The_White_Sands_of_Vashafaru.jpg",
        "credit": "Ramyx",
        "licence": "CC BY-SA 3.0",
        "source": "https://commons.wikimedia.org/wiki/File:The_White_Sands_of_Vashafaru.jpg"
      }
    }
  },
  "haa-dhaalu": {
    "Finey": {
      "title": "Finey (Haa Dhaalu Atoll)",
      "population": 409,
      "populationYear": "2022"
    },
    "Hanimaadhoo": {
      "title": "Hanimaadhoo",
      "population": 2664,
      "populationYear": "2022",
      "photo": {
        "src": "https://upload.wikimedia.org/wikipedia/commons/c/c7/Hanimaadhoo_-_beach_01.jpg",
        "credit": "Andreas Faessler",
        "licence": "CC BY-SA 4.0",
        "source": "https://commons.wikimedia.org/wiki/File:Hanimaadhoo_-_beach_01.jpg"
      }
    },
    "Hirimaradhoo": {
      "title": "Hirimaradhoo",
      "population": 293,
      "populationYear": "2022"
    },
    "Kulhudhuffushi": {
      "title": "Kulhudhuffushi",
      "population": 10131,
      "populationYear": "2022"
    },
    "Kumundhoo": {
      "title": "Kumundhoo",
      "population": 997,
      "populationYear": "2022"
    },
    "Kunburudhoo": {
      "title": "Kunburudhoo (Haa Dhaalu Atoll)",
      "populationYear": "2014"
    },
    "Makunudhoo": {
      "title": "Makunudhoo (Haa Dhaalu Atoll)",
      "population": 1265,
      "populationYear": "2022",
      "photo": {
        "src": "https://upload.wikimedia.org/wikipedia/commons/d/d9/Mamakunudhoo_Atoll_%28Landsat%29.JPG",
        "credit": "NASA",
        "licence": "Public domain",
        "source": "https://commons.wikimedia.org/wiki/File:Mamakunudhoo_Atoll_(Landsat).JPG"
      }
    },
    "Naivaadhoo": {
      "title": "Naivaadhoo",
      "population": 495,
      "populationYear": "2022",
      "photo": {
        "src": "https://upload.wikimedia.org/wikipedia/commons/2/2a/Naivaadhoo.jpg",
        "credit": "Eddamrilwan",
        "licence": "CC BY-SA 4.0",
        "source": "https://commons.wikimedia.org/wiki/File:Naivaadhoo.jpg"
      }
    },
    "Nellaidhoo": {
      "title": "Nellaidhoo",
      "population": 1038,
      "populationYear": "2022"
    },
    "Neykurendhoo": {
      "title": "Neykurendhoo",
      "population": 641,
      "populationYear": "2022"
    },
    "Nolhivaranfaru": {
      "title": "Nolhivaranfaru",
      "population": 1254,
      "populationYear": "2022"
    },
    "Vaikaradhoo": {
      "title": "Vaikaradhoo",
      "population": 776,
      "populationYear": "2022"
    }
  },
  "shaviyani": {
    "Feevah": {
      "title": "Feevah",
      "population": 694,
      "populationYear": "2022"
    },
    "Feydhoo": {
      "title": "Feydhoo (Shaviyani Atoll)",
      "population": 1370,
      "populationYear": "2026"
    },
    "Foakaidhoo": {
      "title": "Foakaidhoo",
      "population": 1571,
      "populationYear": "2022"
    },
    "Funadhoo": {
      "title": "Funadhoo (Shaviyani Atoll)",
      "population": 2255,
      "populationYear": "2022"
    },
    "Goidhoo": {
      "title": "Goidhoo (Shaviyani Atoll)",
      "population": 592,
      "populationYear": "2022"
    },
    "Kanditheemu": {
      "title": "Kanditheemu",
      "population": 1094,
      "populationYear": "2014"
    },
    "Komandoo": {
      "title": "Komandoo (Shaviyani Atoll)",
      "population": 921,
      "populationYear": "2022"
    },
    "Lhaimagu": {
      "title": "Lhaimagu",
      "population": 684,
      "populationYear": "2022"
    },
    "Maaungoodhoo": {
      "title": "Maaungoodhoo",
      "population": 944,
      "populationYear": "2022"
    },
    "Maroshi": {
      "title": "Maroshi",
      "population": 479,
      "populationYear": "2022"
    },
    "Milandhoo": {
      "title": "Milandhoo",
      "population": 2094,
      "populationYear": "2022"
    },
    "Narudhoo": {
      "title": "Narudhoo",
      "population": 544,
      "populationYear": "2022"
    },
    "Noomaraa": {
      "title": "Noomaraa",
      "population": 371,
      "populationYear": "2022"
    }
  },
  "noonu": {
    "Henbadhoo": {
      "title": "Henbadhoo",
      "population": 638,
      "populationYear": "2022"
    },
    "Holhudhoo": {
      "title": "Holhudhoo",
      "population": 1428,
      "populationYear": "2022"
    },
    "Kudafari": {
      "title": "Kudafari",
      "population": 628,
      "populationYear": "2022",
      "photo": {
        "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/5f/Kudafari.jpg/1920px-Kudafari.jpg",
        "credit": "Bloo man",
        "licence": "CC BY-SA 4.0",
        "source": "https://commons.wikimedia.org/wiki/File:Kudafari.jpg"
      }
    },
    "Landhoo": {
      "title": "Landhoo",
      "population": 757,
      "populationYear": "2022"
    },
    "Lhohi": {
      "title": "Lhohi (Noonu Atoll)",
      "population": 692,
      "populationYear": "2022"
    },
    "Maafaru": {
      "title": "Maafaru (Noonu Atoll)",
      "population": 919,
      "populationYear": "2022"
    },
    "Maalhendhoo": {
      "title": "Maalhendhoo",
      "population": 724,
      "populationYear": "2022"
    },
    "Magoodhoo": {
      "title": "Magoodhoo (Noonu Atoll)",
      "population": 305,
      "populationYear": "2022"
    },
    "Manadhoo": {
      "title": "Manadhoo",
      "population": 2180,
      "populationYear": "2026"
    },
    "Miladhoo": {
      "title": "Miladhoo",
      "population": 934,
      "populationYear": "2022"
    },
    "Velidhoo": {
      "title": "Velidhoo (Noonu Atoll)",
      "population": 1832,
      "populationYear": "2022"
    }
  },
  "raa": {
    "Alifushi": {
      "title": "Alifushi",
      "population": 3044,
      "populationYear": "2025",
      "areaKm2": 0.31,
      "photo": {
        "src": "https://upload.wikimedia.org/wikipedia/commons/9/9c/Streets_of_alifushi_maldives.jpg",
        "credit": "A robustus",
        "licence": "CC BY-SA 3.0",
        "source": "https://commons.wikimedia.org/wiki/File:Streets_of_alifushi_maldives.jpg"
      }
    },
    "Angolhitheemu": {
      "title": "Angolhitheemu",
      "population": 403,
      "populationYear": "2014"
    },
    "Dhuvaafaru": {
      "title": "Dhuvaafaru",
      "population": 3321,
      "populationYear": "2022",
      "areaKm2": 0.5416
    },
    "Fainu": {
      "title": "Fainu",
      "population": 423,
      "populationYear": "2022"
    },
    "Hulhudhuffaaru": {
      "title": "Hulhudhuffaaru",
      "population": 1228,
      "populationYear": "2022",
      "areaKm2": 0.602
    },
    "Inguraidhoo": {
      "title": "Inguraidhoo",
      "population": 1278,
      "populationYear": "2022",
      "photo": {
        "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d2/Inguraidhoo%2C_Maldives_-_panoramio_%281%29.jpg/1920px-Inguraidhoo%2C_Maldives_-_panoramio_%281%29.jpg",
        "credit": "Samee Shafeeg",
        "licence": "CC BY 3.0",
        "source": "https://commons.wikimedia.org/wiki/File:Inguraidhoo,_Maldives_-_panoramio_(1).jpg"
      }
    },
    "Innamaadhoo": {
      "title": "Innamaadhoo",
      "population": 962,
      "populationYear": "2025"
    },
    "Kinolhas": {
      "title": "Kinolhas",
      "population": 850,
      "populationYear": "2025",
      "areaKm2": 0.537
    },
    "Maakurathu": {
      "title": "Maakurathu",
      "population": 956,
      "populationYear": "2022",
      "areaKm2": 0.5
    },
    "Maduvvaree": {
      "title": "Maduvvari (Raa Atoll)",
      "population": 1760,
      "populationYear": "2022"
    },
    "Meedhoo": {
      "title": "Meedhoo (Raa Atoll)",
      "population": 1872,
      "populationYear": "2022"
    },
    "Rasgetheemu": {
      "title": "Rasgetheemu",
      "population": 537,
      "populationYear": "2022"
    },
    "Rasmaadhoo": {
      "title": "Rasmaadhoo",
      "population": 554,
      "populationYear": "2022",
      "photo": {
        "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e2/Rasmaadhoo%2C_Maldives_-_panoramio.jpg/1920px-Rasmaadhoo%2C_Maldives_-_panoramio.jpg",
        "credit": "Samee Shafeeg",
        "licence": "CC BY 3.0",
        "source": "https://commons.wikimedia.org/wiki/File:Rasmaadhoo,_Maldives_-_panoramio.jpg"
      }
    },
    "Ungoofaaru": {
      "title": "Ungoofaaru",
      "population": 1754,
      "populationYear": "2022",
      "photo": {
        "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/7/72/Raa_Atoll%2C_Maldives_-_panoramio_%2813%29.jpg/1920px-Raa_Atoll%2C_Maldives_-_panoramio_%2813%29.jpg",
        "credit": "Samee Shafeeg",
        "licence": "CC BY 3.0",
        "source": "https://commons.wikimedia.org/wiki/File:Raa_Atoll,_Maldives_-_panoramio_(13).jpg"
      }
    },
    "Vaadhoo": {
      "title": "Vaadhoo (Raa Atoll)",
      "population": 452,
      "populationYear": "2022"
    }
  },
  "baa": {
    "Dharavandhoo": {
      "title": "Dharavandhoo",
      "population": 997,
      "populationYear": "2022",
      "areaKm2": 0.455,
      "photo": {
        "src": "https://upload.wikimedia.org/wikipedia/commons/a/a6/Dharavandhoo_Aerial_View.jpg",
        "credit": "Shiyam ElkCloner",
        "licence": "CC BY-SA 3.0",
        "source": "https://commons.wikimedia.org/wiki/File:Dharavandhoo_Aerial_View.jpg"
      }
    },
    "Dhonfanu": {
      "title": "Dhonfanu",
      "population": 398,
      "populationYear": "2022"
    },
    "Eydhafushi": {
      "title": "Eydhafushi",
      "population": 2581,
      "populationYear": "2022"
    },
    "Fehendhoo": {
      "title": "Fehendhoo",
      "population": 198,
      "populationYear": "2022",
      "areaKm2": 0.206
    },
    "Fulhadhoo": {
      "title": "Fulhadhoo",
      "population": 341,
      "populationYear": "2022",
      "areaKm2": 0.315
    },
    "Goidhoo": {
      "title": "Goidhoo (Baa Atoll)",
      "population": 583,
      "populationYear": "2022",
      "areaKm2": 1.1354,
      "photo": {
        "src": "https://upload.wikimedia.org/wikipedia/commons/2/26/Baa_Goidhoo.jpg",
        "credit": "5061RR",
        "licence": "CC BY-SA 3.0",
        "source": "https://commons.wikimedia.org/wiki/File:Baa_Goidhoo.jpg"
      }
    },
    "Hithaadhoo": {
      "title": "Hithaadhoo (Baa Atoll)",
      "population": 744,
      "populationYear": "2022",
      "areaKm2": 0.392
    },
    "Kamadhoo": {
      "title": "Kamadhoo",
      "population": 552,
      "populationYear": "2014"
    },
    "Kendhoo": {
      "title": "Kendhoo",
      "population": 1002,
      "populationYear": "2022",
      "areaKm2": 0.145
    },
    "Kihaadhoo": {
      "title": "Kihaadhoo",
      "population": 481,
      "populationYear": "2022",
      "areaKm2": 0.265,
      "photo": {
        "src": "https://upload.wikimedia.org/wikipedia/commons/b/b5/Kihaadhooview.jpg",
        "credit": "Nac m",
        "licence": "CC BY 3.0",
        "source": "https://commons.wikimedia.org/wiki/File:Kihaadhooview.jpg"
      }
    },
    "Kudarikilu": {
      "title": "Kudarikilu",
      "population": 557,
      "populationYear": "2022",
      "areaKm2": 0.137
    },
    "Maalhos": {
      "title": "Maalhos (Baa Atoll)",
      "population": 572,
      "populationYear": "2022"
    },
    "Thulhaadhoo": {
      "title": "Thulhaadhoo",
      "population": 1471,
      "populationYear": "2022",
      "photo": {
        "src": "https://upload.wikimedia.org/wikipedia/commons/7/75/Thulhaadhoo_Aerial_View.jpg",
        "credit": "Abdulla ar",
        "licence": "CC BY-SA 3.0",
        "source": "https://commons.wikimedia.org/wiki/File:Thulhaadhoo_Aerial_View.jpg"
      }
    }
  },
  "lhaviyani": {
    "Hinnavaru": {
      "title": "Hinnavaru",
      "population": 2286,
      "populationYear": "2022",
      "areaKm2": 0.5314
    },
    "Kurendhoo": {
      "title": "Kurendhoo",
      "population": 1171,
      "populationYear": "2022",
      "areaKm2": 0.21
    },
    "Maafilaafushi": {
      "title": "Maafilaafushi",
      "population": 42
    },
    "Naifaru": {
      "title": "Naifaru",
      "population": 4832,
      "populationYear": "2022",
      "areaKm2": 0.5553,
      "photo": {
        "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/4/4e/Naifaru_Town.jpg/1920px-Naifaru_Town.jpg",
        "credit": "Haflaa at Wikipedia",
        "licence": "CC BY 4.0",
        "source": "https://commons.wikimedia.org/wiki/File:Naifaru_Town.jpg"
      }
    },
    "Olhuvelifushi": {
      "title": "Olhuvelifushi",
      "population": 703,
      "populationYear": "2022"
    }
  },
  "male": {
    "Dhiffushi": {
      "title": "Dhiffushi (Kaafu Atoll)",
      "population": 1270,
      "populationYear": "2022",
      "photo": {
        "src": "https://upload.wikimedia.org/wikipedia/commons/0/05/Dhifushi_bei_Meeru_im_Nord_Male_Atoll.jpg",
        "credit": "Matthias Rühlemann at de.wikipedia",
        "licence": "Public domain",
        "source": "https://commons.wikimedia.org/wiki/File:Dhifushi_bei_Meeru_im_Nord_Male_Atoll.jpg"
      }
    },
    "Gaafaru": {
      "title": "Gaafaru",
      "population": 1294,
      "populationYear": "2022",
      "photo": {
        "src": "https://upload.wikimedia.org/wikipedia/commons/e/ee/Gaafaru_Atoll_%28Landsat%29.JPG",
        "credit": "NASA",
        "licence": "Public domain",
        "source": "https://commons.wikimedia.org/wiki/File:Gaafaru_Atoll_(Landsat).JPG"
      }
    },
    "Gulhi": {
      "title": "Gulhi",
      "population": 976,
      "populationYear": "2022",
      "photo": {
        "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/8/8b/Gulhi_Island%2C_Maldives.jpg/1920px-Gulhi_Island%2C_Maldives.jpg",
        "credit": "Keduqu",
        "licence": "CC BY-SA 4.0",
        "source": "https://commons.wikimedia.org/wiki/File:Gulhi_Island,_Maldives.jpg"
      }
    },
    "Guraidhoo": {
      "title": "Guraidhoo (Kaafu Atoll)",
      "population": 1743,
      "populationYear": "2022",
      "photo": {
        "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/0/04/Guriadhoo-2019-aerial-view-Luka-Peternel.jpg/1920px-Guriadhoo-2019-aerial-view-Luka-Peternel.jpg",
        "credit": "Luka Peternel",
        "licence": "CC BY-SA 4.0",
        "source": "https://commons.wikimedia.org/wiki/File:Guriadhoo-2019-aerial-view-Luka-Peternel.jpg"
      }
    },
    "Himmafushi": {
      "title": "Himmafushi",
      "population": 2012,
      "populationYear": "2022",
      "photo": {
        "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/2/28/Himmafushi%2C_Jafana_Park.jpg/1920px-Himmafushi%2C_Jafana_Park.jpg",
        "credit": "Iguhussain",
        "licence": "CC BY-SA 3.0",
        "source": "https://commons.wikimedia.org/wiki/File:Himmafushi,_Jafana_Park.jpg"
      }
    },
    "Huraa": {
      "title": "Huraa (Kaafu Atoll)",
      "population": 1654,
      "populationYear": "2022"
    },
    "Hulhumalé": {
      "title": "Hulhumalé",
      "population": 65714,
      "populationYear": "2022",
      "areaKm2": 4,
      "photo": {
        "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/6/6b/Malediven_R%C3%BCckflug_Hulhumale_6.jpg/1920px-Malediven_R%C3%BCckflug_Hulhumale_6.jpg",
        "credit": "Zairon",
        "licence": "CC BY-SA 4.0",
        "source": "https://commons.wikimedia.org/wiki/File:Malediven_R%C3%BCckflug_Hulhumale_6.jpg"
      }
    },
    "Kaashidhoo": {
      "title": "Kaashidhoo (Kaafu Atoll)",
      "population": 2528,
      "populationYear": "2022"
    },
    "Maafushi": {
      "title": "Maafushi (Kaafu Atoll)",
      "population": 4471,
      "populationYear": "2022"
    },
    "Malé": {
      "title": "Malé",
      "population": 211908,
      "populationYear": "2022",
      "areaKm2": 11.22,
      "photo": {
        "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/8/83/Mal%C3%A9.jpg/1920px-Mal%C3%A9.jpg",
        "credit": "Shahee Ilyas",
        "licence": "CC BY-SA 3.0",
        "source": "https://commons.wikimedia.org/wiki/File:Mal%C3%A9.jpg"
      }
    },
    "Thulusdhoo": {
      "title": "Thulusdhoo",
      "population": 1801,
      "populationYear": "2022"
    }
  },
  "alif-alif": {
    "Bodufolhudhoo": {
      "title": "Bodufolhudhoo",
      "population": 704,
      "populationYear": "2022"
    },
    "Feridhoo": {
      "title": "Feridhoo",
      "population": 544,
      "populationYear": "2022",
      "photo": {
        "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/7/70/Alif_Alif_Atoll.jpg/1920px-Alif_Alif_Atoll.jpg",
        "credit": "Unknown",
        "licence": "CC BY-SA 3.0",
        "source": "https://commons.wikimedia.org/wiki/File:Alif_Alif_Atoll.jpg"
      }
    },
    "Maalhos": {
      "title": "Maalhos (Alif Alif Atoll)",
      "population": 516,
      "populationYear": "2022"
    },
    "Mathiveri": {
      "title": "Mathiveri",
      "population": 1106,
      "populationYear": "2026",
      "photo": {
        "src": "https://upload.wikimedia.org/wikipedia/commons/a/ae/Mathiveri.jpg",
        "credit": "Muammar1982",
        "licence": "CC BY-SA 4.0",
        "source": "https://commons.wikimedia.org/wiki/File:Mathiveri.jpg"
      }
    },
    "Rasdhoo": {
      "title": "Ross Atoll"
    },
    "Thoddoo": {
      "title": "Thoddoo",
      "population": 1924,
      "populationYear": "2022"
    },
    "Ukulhas": {
      "title": "Ukulhas",
      "population": 1284,
      "populationYear": "2022",
      "areaKm2": 1,
      "photo": {
        "src": "https://upload.wikimedia.org/wikipedia/commons/2/2c/Dhoani_view_of_Ukulhas.jpg",
        "credit": "Rappey",
        "licence": "CC BY-SA 4.0",
        "source": "https://commons.wikimedia.org/wiki/File:Dhoani_view_of_Ukulhas.jpg"
      }
    }
  },
  "alif-dhaal": {
    "Dhangethi": {
      "title": "Dhangethi",
      "population": 936,
      "populationYear": "2022",
      "areaKm2": 0.245,
      "photo": {
        "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/8/8f/Alif_Dhaal_Atoll.jpg/1920px-Alif_Dhaal_Atoll.jpg",
        "credit": "Unknown",
        "licence": "CC BY-SA 3.0",
        "source": "https://commons.wikimedia.org/wiki/File:Alif_Dhaal_Atoll.jpg"
      }
    },
    "Dhigurah": {
      "title": "Dhigurah (Alif Dhaalu Atoll)",
      "population": 761,
      "populationYear": "2022",
      "photo": {
        "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c1/Dhigurah.jpg/1920px-Dhigurah.jpg",
        "credit": "Syced",
        "licence": "CC BY-SA 3.0",
        "source": "https://commons.wikimedia.org/wiki/File:Dhigurah.jpg"
      }
    },
    "Fenfushi": {
      "title": "Fenfushi",
      "population": 1000,
      "populationYear": "2022",
      "areaKm2": 0.24
    },
    "Hangnaameedhoo": {
      "title": "Hangnaameedhoo",
      "population": 484,
      "populationYear": "2022",
      "photo": {
        "src": "https://upload.wikimedia.org/wikipedia/commons/1/1e/Hangnaameedhoo.jpg",
        "credit": "Ximpepe",
        "licence": "CC BY-SA 4.0",
        "source": "https://commons.wikimedia.org/wiki/File:Hangnaameedhoo.jpg"
      }
    },
    "Kunburudhoo": {
      "title": "Kunburudhoo (Alif Dhaalu Atoll)",
      "population": 509,
      "populationYear": "2022"
    },
    "Maamingili": {
      "title": "Maamigili (Alif Dhaalu Atoll)",
      "population": 2798,
      "populationYear": "2022"
    },
    "Mahibadhoo": {
      "title": "Mahibadhoo",
      "population": 2580,
      "populationYear": "2022",
      "areaKm2": 0.177,
      "photo": {
        "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b3/Mahibadhoo_main_street.jpg/1920px-Mahibadhoo_main_street.jpg",
        "credit": "The original uploader was Noblige at English Wikipedia.",
        "licence": "CC BY-SA 2.5",
        "source": "https://commons.wikimedia.org/wiki/File:Mahibadhoo_main_street.jpg"
      }
    },
    "Mandhoo": {
      "title": "Mandhoo",
      "population": 418,
      "populationYear": "2022"
    },
    "Omadhoo": {
      "title": "Omadhoo (Alif Dhaalu Atoll)",
      "population": 913,
      "populationYear": "2022"
    }
  },
  "vaavu": {
    "Felidhoo": {
      "title": "Felidhoo",
      "population": 620,
      "populationYear": "2022",
      "photo": {
        "src": "https://upload.wikimedia.org/wikipedia/commons/0/09/Felidhoo_2023-11-07_2.jpg",
        "credit": "Z thomas",
        "licence": "CC0",
        "source": "https://commons.wikimedia.org/wiki/File:Felidhoo_2023-11-07_2.jpg"
      }
    },
    "Fulidhoo": {
      "title": "Fulidhoo",
      "population": 400,
      "populationYear": "2022",
      "photo": {
        "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e4/Vaavu_Atoll.png/1920px-Vaavu_Atoll.png",
        "credit": "Unknown",
        "licence": "CC BY-SA 3.0",
        "source": "https://commons.wikimedia.org/wiki/File:Vaavu_Atoll.png"
      }
    },
    "Keyodhoo": {
      "title": "Keyodhoo (Vaavu Atoll)",
      "population": 641,
      "populationYear": "2022",
      "areaKm2": 0.073
    },
    "Rakeedhoo": {
      "title": "Rakeedhoo",
      "population": 76,
      "populationYear": "2022",
      "photo": {
        "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e4/Vaavu_Atoll.png/1920px-Vaavu_Atoll.png",
        "credit": "Unknown",
        "licence": "CC BY-SA 3.0",
        "source": "https://commons.wikimedia.org/wiki/File:Vaavu_Atoll.png"
      }
    },
    "Thinadhoo": {
      "title": "Thinadhoo (Vaavu Atoll)",
      "population": 258,
      "populationYear": "2022"
    }
  },
  "meemu": {
    "Dhiggaru": {
      "title": "Dhiggaru",
      "population": 1099,
      "populationYear": "2022"
    },
    "Kolhufushi": {
      "title": "Kolhufushi (Meemu Atoll)",
      "population": 793,
      "populationYear": "2022"
    },
    "Maduvvari": {
      "title": "Maduvvari (Meemu Atoll)",
      "population": 318,
      "populationYear": "2022"
    },
    "Mulah": {
      "title": "Mulah",
      "population": 1426,
      "populationYear": "2022"
    },
    "Muli": {
      "title": "Muli (Meemu Atoll)",
      "population": 949,
      "populationYear": "2022"
    },
    "Naalaafushi": {
      "title": "Naalaafushi",
      "population": 430,
      "populationYear": "2022"
    },
    "Veyvah": {
      "title": "Veyvah (Meemu Atoll)",
      "population": 304,
      "populationYear": "2022"
    }
  },
  "faafu": {
    "Dharanboodhoo": {
      "title": "Dharanboodhoo",
      "population": 455,
      "populationYear": "2022"
    },
    "Feeali": {
      "title": "Feeali",
      "population": 922,
      "populationYear": "2022"
    },
    "Magoodhoo": {
      "title": "Magoodhoo (Faafu Atoll)",
      "population": 702,
      "populationYear": "2022"
    },
    "Nilandhoo": {
      "title": "Nilandhoo (Faafu Atoll)",
      "population": 1823,
      "populationYear": "2022"
    }
  },
  "dhaalu": {
    "Bandidhoo": {
      "title": "Bandidhoo",
      "population": 629,
      "populationYear": "2022",
      "photo": {
        "src": "https://upload.wikimedia.org/wikipedia/commons/5/51/Dhaalu_Atoll.jpg",
        "credit": "Unknown",
        "licence": "CC BY-SA 3.0",
        "source": "https://commons.wikimedia.org/wiki/File:Dhaalu_Atoll.jpg"
      }
    },
    "Hulhudheli": {
      "title": "Hulhudheli",
      "population": 764,
      "populationYear": "2022"
    },
    "Kudahuvadhoo": {
      "title": "Kudahuvadhoo",
      "population": 3132,
      "populationYear": "2022",
      "photo": {
        "src": "https://upload.wikimedia.org/wikipedia/commons/a/af/Old_mosque_of_kudahuvadhoo.jpg",
        "credit": "a_robustus",
        "licence": "CC BY-SA 3.0",
        "source": "https://commons.wikimedia.org/wiki/File:Old_mosque_of_kudahuvadhoo.jpg"
      }
    },
    "Maaenboodhoo": {
      "title": "Maaenboodhoo",
      "population": 679,
      "populationYear": "2022",
      "photo": {
        "src": "https://upload.wikimedia.org/wikipedia/commons/5/51/Dhaalu_Atoll.jpg",
        "credit": "Unknown",
        "licence": "CC BY-SA 3.0",
        "source": "https://commons.wikimedia.org/wiki/File:Dhaalu_Atoll.jpg"
      }
    },
    "Meedhoo": {
      "title": "Meedhoo (Dhaalu Atoll)",
      "population": 1118,
      "populationYear": "2022"
    },
    "Rinbudhoo": {
      "title": "Rinbudhoo",
      "population": 316,
      "populationYear": "2022",
      "photo": {
        "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/bc/Dh.Rin%27budhoo.jpg/1920px-Dh.Rin%27budhoo.jpg",
        "credit": "Ahmed Niyaz",
        "licence": "CC BY-SA 4.0",
        "source": "https://commons.wikimedia.org/wiki/File:Dh.Rin%27budhoo.jpg"
      }
    },
    "Vaanee": {
      "title": "Vaanee"
    }
  },
  "thaa": {
    "Burunee": {
      "title": "Burunee",
      "population": 414,
      "populationYear": "2022"
    },
    "Gaadhiffushi": {
      "title": "Gaadhiffushi (Thaa Atoll)",
      "population": 317,
      "populationYear": "2022"
    },
    "Guraidhoo": {
      "title": "Guraidhoo (Thaa Atoll)",
      "population": 1293,
      "populationYear": "2022",
      "photo": {
        "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b3/Thaa_Guraidhoo.jpg/1920px-Thaa_Guraidhoo.jpg",
        "credit": "Depperter",
        "licence": "CC BY 3.0",
        "source": "https://commons.wikimedia.org/wiki/File:Thaa_Guraidhoo.jpg"
      }
    },
    "Hirilandhoo": {
      "title": "Hirilandhoo",
      "population": 1146,
      "populationYear": "2022"
    },
    "Kandoodhoo": {
      "title": "Kandoodhoo",
      "population": 456,
      "populationYear": "2022"
    },
    "Kinbidhoo": {
      "title": "Kinbidhoo",
      "population": 768,
      "populationYear": "2014"
    },
    "Madifushi": {
      "title": "Madifushi (Thaa Atoll)",
      "population": 858,
      "populationYear": "2022",
      "areaKm2": 0.52
    },
    "Omadhoo": {
      "title": "Omadhoo (Thaa Atoll)",
      "population": 417,
      "populationYear": "2022",
      "photo": {
        "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/c/cd/Omadhoo_beach.JPG/1920px-Omadhoo_beach.JPG",
        "credit": "Summerhu",
        "licence": "CC BY-SA 4.0",
        "source": "https://commons.wikimedia.org/wiki/File:Omadhoo_beach.JPG"
      }
    },
    "Thimarafushi": {
      "title": "Thimarafushi",
      "population": 1229,
      "populationYear": "2022",
      "areaKm2": 0.62
    },
    "Vandhoo": {
      "title": "Vandhoo",
      "population": 364,
      "populationYear": "2022"
    },
    "Veymandoo": {
      "title": "Veymandoo",
      "population": 1321,
      "populationYear": "2022"
    },
    "Vilufushi": {
      "title": "Vilufushi",
      "population": 1081,
      "populationYear": "2022"
    }
  },
  "laamu": {
    "Dhanbidhoo": {
      "title": "Dhanbidhoo",
      "population": 647,
      "populationYear": "2014"
    },
    "Fonadhoo": {
      "title": "Fonadhoo",
      "population": 2266,
      "populationYear": "2014",
      "areaKm2": 1.68
    },
    "Gan": {
      "title": "Gan (Laamu Atoll)",
      "population": 4815,
      "populationYear": "2022"
    },
    "Hithadhoo": {
      "title": "Hithadhoo (Laamu Atoll)",
      "population": 1108,
      "populationYear": "2022"
    },
    "Isdhoo": {
      "title": "Isdhoo (Laamu Atoll)",
      "population": 929,
      "populationYear": "2022",
      "photo": {
        "src": "https://upload.wikimedia.org/wikipedia/commons/3/3f/Histori_mosque_in_Hadhunmathi_Isdhoo.JPG",
        "credit": "A robustus at English Wikipedia",
        "licence": "CC BY-SA 3.0",
        "source": "https://commons.wikimedia.org/wiki/File:Histori_mosque_in_Hadhunmathi_Isdhoo.JPG"
      }
    },
    "Kalhaidhoo": {
      "title": "Kalhaidhoo"
    },
    "Kunahandhoo": {
      "title": "Kunahandhoo",
      "population": 650,
      "populationYear": "2014"
    },
    "Maabaidhoo": {
      "title": "Maabaidhoo",
      "population": 649,
      "populationYear": "2014"
    },
    "Maamendhoo": {
      "title": "Maamendhoo (Laamu Atoll)",
      "population": 896,
      "populationYear": "2014"
    },
    "Maavah": {
      "title": "Maavah",
      "population": 1379,
      "populationYear": "2022"
    },
    "Mundoo": {
      "title": "Mundoo (Laamu Atoll)",
      "population": 236,
      "populationYear": "2014"
    }
  },
  "gaafu-alif": {
    "Dhaandhoo": {
      "title": "Dhaandhoo",
      "population": 1077,
      "populationYear": "2014",
      "photo": {
        "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/55/Dhoonidhoo01.jpg/1920px-Dhoonidhoo01.jpg",
        "credit": "Adrian.benko",
        "licence": "CC BY-SA 3.0",
        "source": "https://commons.wikimedia.org/wiki/File:Dhoonidhoo01.jpg"
      }
    },
    "Dhevvadhoo": {
      "title": "Dhevvadhoo",
      "population": 584,
      "populationYear": "2014"
    },
    "Gemanafushi": {
      "title": "Gemanafushi",
      "population": 1800,
      "populationYear": "2014"
    },
    "Kanduhulhudhoo": {
      "title": "Kanduhulhudhoo",
      "population": 533,
      "populationYear": "2014"
    },
    "Kolamaafushi": {
      "title": "Kolamaafushi",
      "population": 636,
      "populationYear": "2022"
    },
    "Kondey": {
      "title": "Kondey",
      "population": 272,
      "populationYear": "2014"
    },
    "Maamendhoo": {
      "title": "Maamendhoo (Gaafu Alifu Atoll)",
      "population": 1690,
      "populationYear": "2024"
    },
    "Nilandhoo": {
      "title": "Nilandhoo (Gaafu Alif Atoll)",
      "population": 600,
      "populationYear": "2014"
    },
    "Vilingili": {
      "title": "Villingili (Gaafu Alif Atoll)",
      "population": 8870,
      "populationYear": "2024"
    }
  },
  "gaafu-dhaalu": {
    "Faresmaathodaa": {
      "title": "Fares-Maathodaa",
      "population": 1104,
      "populationYear": "2014",
      "photo": {
        "src": "https://upload.wikimedia.org/wikipedia/commons/b/b6/Isla_Fares-Maathodaa.jpg",
        "credit": "Unknown authorUnknown author",
        "licence": "CC BY 4.0",
        "source": "https://commons.wikimedia.org/wiki/File:Isla_Fares-Maathodaa.jpg"
      }
    },
    "Madaveli": {
      "title": "Madaveli",
      "population": 1219,
      "populationYear": "2022",
      "areaKm2": 0.338
    },
    "Nadellaa": {
      "title": "Nadellaa",
      "population": 581,
      "populationYear": "2022"
    },
    "Rathafandhoo": {
      "title": "Rathafandhoo",
      "population": 431,
      "populationYear": "2022",
      "areaKm2": 0.3716
    },
    "Thinadhoo": {
      "title": "Thinadhoo City",
      "population": 10150,
      "populationYear": "2024",
      "areaKm2": 1.192,
      "photo": {
        "src": "https://upload.wikimedia.org/wikipedia/commons/d/d9/GdhThinadhoo.jpg",
        "credit": "Xumm1du at English Wikipedia",
        "licence": "Public domain",
        "source": "https://commons.wikimedia.org/wiki/File:GdhThinadhoo.jpg"
      }
    },
    "Vaadhoo": {
      "title": "Vaadhoo (Gaafu Dhaalu Atoll)",
      "population": 712,
      "populationYear": "2014",
      "areaKm2": 1.673
    }
  },
  "fuvahmulah": {
    "Fuvahmulah": {
      "title": "Fuvahmulah",
      "population": 14251,
      "populationYear": "2025",
      "areaKm2": 4.94,
      "photo": {
        "src": "https://upload.wikimedia.org/wikipedia/commons/3/32/Fuvahmulah.jpg",
        "credit": "GIS & Mapping Unit, Spatial Planning Section, Department of National Planning, R",
        "licence": "CC BY-SA 3.0",
        "source": "https://commons.wikimedia.org/wiki/File:Fuvahmulah.jpg"
      }
    }
  },
  "addu": {
    "Feydhoo": {
      "title": "Feydhoo (Addu Atoll)",
      "population": 5810,
      "populationYear": "2024",
      "areaKm2": 1.22
    },
    "Hithadhoo": {
      "title": "Hithadhoo"
    },
    "Maradhoo": {
      "title": "Maradhoo",
      "population": 3885,
      "populationYear": "2024",
      "areaKm2": 0.926
    },
    "Maradhoo-Feydhoo": {
      "title": "Maradhoo-Feydhoo",
      "population": 1954,
      "populationYear": "2024",
      "areaKm2": 0.3136
    }
  }
};
