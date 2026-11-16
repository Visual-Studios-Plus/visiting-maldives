/*
 * Map coordinates [lat, lng] of islands: from the government island register at atollsofmaldives.gov.mv
 * (fetched 2026-11-16), with English Wikipedia as a fallback. Used to centre
 * island maps, place resorts on them and find nearby islands.
 */
export const ISLAND_COORDS: Record<string, Record<string, [number, number]>> = {
  "haa-alif": {
    "Baarah": [
      6.81056,
      73.20861
    ],
    "Filladhoo": [
      6.87667,
      73.22917
    ],
    "Ihavandhoo": [
      6.95306,
      72.92611
    ],
    "Kelaa": [
      6.95444,
      73.21611
    ],
    "Maarandhoo": [
      6.8525,
      72.98389
    ],
    "Mulhadhoo": [
      7.01194,
      72.99806
    ],
    "Muraidhoo": [
      6.83778,
      73.16694
    ],
    "Thakandhoo": [
      6.84389,
      72.99528
    ],
    "Thuraakunu": [
      7.10389,
      72.89917
    ],
    "Uligamu": [
      7.08194,
      72.92722
    ],
    "Utheemu": [
      6.83472,
      73.1125
    ],
    "Vashafaru": [
      6.8975,
      73.16083
    ],
    "Alidhoo": [
      6.84861,
      73.15194
    ],
    "Alidhuffaru Finolhu": [
      6.86083,
      73.10444
    ],
    "Beenaafushi": [
      6.92833,
      73.13639
    ],
    "Berinmadhoo": [
      7.04722,
      72.97111
    ],
    "Dhapparuhuraa": [
      6.91528,
      73.21111
    ],
    "Dhigufaruhuraa": [
      6.92528,
      72.96972
    ],
    "Gaafushi": [
      6.85194,
      73.0575
    ],
    "Gaamathikulhudhoo": [
      7.03917,
      72.98444
    ],
    "Gallandhoo": [
      6.94667,
      72.98306
    ],
    "Govvaafushi": [
      7.0125,
      72.91917
    ],
    "Hathifushi": [
      7.02,
      72.83028
    ],
    "Huvahandhoo": [
      6.95889,
      72.905
    ],
    "Innafinolhu": [
      7.07361,
      72.81111
    ],
    "Kandaalifinolhu": [
      6.92667,
      73.13056
    ],
    "Kudafinolhu": [
      6.98944,
      72.88333
    ],
    "Maafahi": [
      6.82833,
      73.15639
    ],
    "Maafinolhu": [
      7.00222,
      72.86222
    ],
    "Maarandhoofarufinolhu": [
      6.82889,
      72.97194
    ],
    "Madulu": [
      7.05472,
      72.95306
    ],
    "Matheerah": [
      7.0275,
      72.81889
    ],
    "Medhafushi": [
      7.01056,
      72.93389
    ],
    "Mulidhoo": [
      6.83611,
      73.01111
    ],
    "Naridhoo": [
      6.895,
      73.12667
    ],
    "Ungulifinolhu": [
      6.97111,
      72.90139
    ],
    "Vangaaru": [
      7.09306,
      72.87806
    ],
    "Velifinolhu": [
      6.99417,
      72.87444
    ],
    "Dhonakulhi": [
      6.84306,
      73.05139
    ],
    "Manafaru": [
      6.99694,
      72.93972
    ]
  },
  "haa-dhaalu": {
    "Finey": [
      6.74583,
      73.05306
    ],
    "Hanimaadhoo": [
      6.75611,
      73.17306
    ],
    "Hirimaradhoo": [
      6.72472,
      73.02389
    ],
    "Kulhudhuffushi": [
      6.62333,
      73.06972
    ],
    "Kumundhoo": [
      6.57194,
      73.05222
    ],
    "Kunburudhoo": [
      6.65806,
      73.02722
    ],
    "Kurinbee": [
      6.66528,
      72.99639
    ],
    "Makunudhoo": [
      6.40944,
      72.705
    ],
    "Naivaadhoo": [
      6.74667,
      72.93472
    ],
    "Nellaidhoo": [
      6.71472,
      72.94667
    ],
    "Neykurendhoo": [
      6.54222,
      72.98028
    ],
    "Nolhivaramu": [
      6.66222,
      73.08194
    ],
    "Nolhivaranfaru": [
      6.69694,
      73.12
    ],
    "Vaikaradhoo": [
      6.54944,
      72.95306
    ],
    "Dhipparufushi": [
      6.31889,
      72.64056
    ],
    "Faridhoo": [
      6.78472,
      73.05389
    ],
    "Fenboahuraa": [
      6.39639,
      72.69444
    ],
    "Hirinaidhoo": [
      6.70167,
      72.94806
    ],
    "Hondaidhoo": [
      6.76972,
      73.08722
    ],
    "Innafushi": [
      6.40889,
      72.64528
    ],
    "Kanamana": [
      6.705,
      72.89917
    ],
    "Kattalafushi": [
      6.56667,
      72.98306
    ],
    "Keylakunu": [
      6.6025,
      73.00889
    ],
    "Kudamuraidhoo": [
      6.64278,
      72.92
    ],
    "Kuredhigadu": [
      6.67861,
      73.105
    ],
    "Maavaidhoo": [
      6.51528,
      73.05361
    ],
    "Ruffushi": [
      6.75861,
      72.93889
    ],
    "Theefaridhoo": [
      6.74028,
      73.03333
    ],
    "Vaikaramuraidhoo": [
      6.54056,
      72.89806
    ],
    "Veligandu": [
      6.75444,
      72.93833
    ],
    "View Details": [
      6.31889,
      72.64056
    ],
    "Kudafarufasgandu": [
      6.71194,
      72.925
    ],
    "Muiri": [
      6.65806,
      72.93639
    ],
    "Naagoashi": [
      6.66972,
      72.90222
    ],
    "Hondaafushi": [
      6.77806,
      73.12139
    ]
  },
  "shaviyani": {
    "Bileiyfahi": [
      6.33806,
      72.975
    ],
    "Feevah": [
      6.34889,
      73.20917
    ],
    "Feydhoo": [
      6.36056,
      73.04861
    ],
    "Foakaidhoo": [
      6.32639,
      73.14917
    ],
    "Funadhoo": [
      6.14917,
      73.29028
    ],
    "Goidhoo": [
      6.43,
      72.92972
    ],
    "Kanditheemu": [
      6.44028,
      72.91639
    ],
    "Komandoo": [
      6.05389,
      73.05417
    ],
    "Lhaimagu": [
      6.16389,
      73.25139
    ],
    "Maaungoodhoo": [
      6.03667,
      73.28361
    ],
    "Maroshi": [
      6.20944,
      73.06111
    ],
    "Milandhoo": [
      6.28611,
      73.24444
    ],
    "Narudhoo": [
      6.26417,
      73.21778
    ],
    "Noomaraa": [
      6.43389,
      73.06889
    ],
    "Bis Alhaahuraa": [
      6.155,
      73.2925
    ],
    "Boduhuraa": [
      6.07167,
      73.04389
    ],
    "Bolissafaru": [
      5.98083,
      73.11083
    ],
    "Dhigurah": [
      6.02944,
      73.06861
    ],
    "Dholhiyadhookudarah": [
      5.99,
      73.22417
    ],
    "Dhonvelihuraa": [
      6.18417,
      73.29861
    ],
    "Ekasdhoo": [
      6.07083,
      73.28444
    ],
    "Eriadhoo": [
      6.10389,
      73.28694
    ],
    "Farukolhu": [
      6.19167,
      73.2975
    ],
    "Firubaidhoo": [
      6.11417,
      73.2275
    ],
    "Gallaidhoo": [
      5.96889,
      73.12444
    ],
    "Gonaafarufinolhu": [
      6.46556,
      72.89889
    ],
    "Horubadhoo": [
      6.18778,
      73.24528
    ],
    "Hurasfaru": [
      6.13972,
      73.03722
    ],
    "Kakaa Eriyadhoo": [
      6.47778,
      72.90222
    ],
    "Keekimini": [
      6.00722,
      73.11167
    ],
    "Kudadhoo": [
      6.43583,
      72.90722
    ],
    "Kudafarufinolhu": [
      6.06444,
      73.04444
    ],
    "Maakandoodhoo": [
      6.23472,
      73.26722
    ],
    "Madidhoo": [
      6.3025,
      73.10889
    ],
    "Madikurehdhoo": [
      6.28417,
      73.15083
    ],
    "Mairah": [
      6.01917,
      73.08778
    ],
    "Mathi Komandoo": [
      6.05694,
      73.04583
    ],
    "Medhukunburudhoo": [
      6.19694,
      73.03
    ],
    "Medhurah": [
      6.02306,
      73.07889
    ],
    "Migoodhoo": [
      6.22861,
      73.24111
    ],
    "Naainfaru": [
      6.20306,
      72.99861
    ],
    "Naalaahuraa": [
      6.12778,
      73.03639
    ],
    "Nalandhoo": [
      6.32444,
      73.22889
    ],
    "Narurinbudhoo": [
      6.27917,
      73.19556
    ],
    "Neyo": [
      6.45,
      73.05972
    ],
    "Ragganduhuraa": [
      6.11194,
      73.03833
    ],
    "View Details": [
      6.33806,
      72.975
    ],
    "Dholhiyadhoo": [
      5.99444,
      73.21111
    ],
    "Fushifaru": [
      6.39528,
      72.92583
    ],
    "Gaakoshibi": [
      6.28639,
      73.01194
    ],
    "Kanbaalifaru": [
      6.12361,
      73.25556
    ],
    "Kudalhaimendhoo": [
      6.015,
      73.29556
    ],
    "Naainfarufinolhu": [
      6.20306,
      72.99861
    ],
    "Vagaru": [
      6.08944,
      73.20389
    ]
  },
  "noonu": {
    "Fohdhoo": [
      5.74333,
      73.21583
    ],
    "Henbadhoo": [
      5.96722,
      73.39278
    ],
    "Holhudhoo": [
      5.75472,
      73.26278
    ],
    "Kendhikulhudhoo": [
      5.95222,
      73.41583
    ],
    "Kudafari": [
      5.8825,
      73.4
    ],
    "Landhoo": [
      5.88139,
      73.46611
    ],
    "Lhohi": [
      5.81611,
      73.3775
    ],
    "Maafaru": [
      5.83361,
      73.48111
    ],
    "Maalhendhoo": [
      5.90194,
      73.45611
    ],
    "Magoodhoo": [
      5.77639,
      73.36222
    ],
    "Manadhoo": [
      5.76556,
      73.41056
    ],
    "Miladhoo": [
      5.79056,
      73.3625
    ],
    "Velidhoo": [
      5.66389,
      73.27417
    ],
    "Aarah": [
      5.69861,
      73.41139
    ],
    "Bandaidhidhdhoo": [
      5.68528,
      73.2575
    ],
    "Bodulhaimendhoo": [
      6,
      73.30278
    ],
    "Bomasdhoo": [
      5.9725,
      73.34556
    ],
    "Burehifasdhoo": [
      5.96528,
      73.36806
    ],
    "Dheefuram": [
      5.8875,
      73.31806
    ],
    "Dhekenanfaru": [
      5.92,
      73.15639
    ],
    "Dhelibe Ruh Elhihuraa": [
      5.80722,
      73.45667
    ],
    "Dhonaeri Kandoodhoo": [
      5.64611,
      73.32917
    ],
    "Farumuli": [
      5.86472,
      73.47528
    ],
    "Felivaru": [
      5.83556,
      73.30611
    ],
    "Fohdhipparu": [
      5.75361,
      73.20833
    ],
    "Goanbilivaadhoo": [
      5.8225,
      73.38722
    ],
    "Holhumeedhoo": [
      5.75111,
      73.24917
    ],
    "Hulhuhdhoo": [
      5.815,
      73.31861
    ],
    "Inguraidhoo": [
      5.79694,
      73.34444
    ],
    "Kaalhugemendhoo": [
      5.78722,
      73.35389
    ],
    "Kafa Komandoo": [
      5.96194,
      73.38611
    ],
    "Kalaidhoo": [
      5.98333,
      73.32333
    ],
    "Kandinmaahuraa": [
      5.8575,
      73.48028
    ],
    "Kudarah": [
      5.83278,
      73.31389
    ],
    "Kuramaadhoo": [
      5.87306,
      73.14361
    ],
    "Maafunafaru": [
      5.86083,
      73.36611
    ],
    "Maakurehdhoo": [
      5.69639,
      73.31167
    ],
    "Maavahdhoo": [
      5.81472,
      73.32611
    ],
    "Minaavaru": [
      5.76833,
      73.34333
    ],
    "Orimasvaru": [
      5.86306,
      73.20667
    ],
    "Orivarukudarah": [
      5.80083,
      73.29361
    ],
    "Raalhulaakolhu": [
      5.68667,
      73.40444
    ],
    "Thanburudhoo": [
      5.71639,
      73.23444
    ],
    "Tholhendhoo": [
      5.92056,
      73.43639
    ],
    "Vavathi": [
      5.79611,
      73.22722
    ],
    "View Details": [
      5.68528,
      73.2575
    ],
    "Vihafarufinolhu": [
      5.68139,
      73.27972
    ],
    "Bodufushi": [
      5.69861,
      73.41139
    ],
    "Dhigurah": [
      5.73222,
      73.35917
    ],
    "Ehdhuffaru Mairah": [
      5.69528,
      73.40833
    ],
    "Ekulhivaru": [
      5.94972,
      73.30694
    ],
    "Fushivelavaru": [
      5.83083,
      73.20917
    ],
    "Huivani": [
      5.91333,
      73.31556
    ],
    "Huvandhumaavattaru": [
      5.845,
      73.445
    ],
    "Karinma": [
      5.65889,
      73.37222
    ],
    "Karinmavattaru": [
      5.67,
      73.38694
    ],
    "Kendhivaru": [
      5.85194,
      73.33611
    ],
    "Kudafunafaru": [
      5.88528,
      73.37778
    ],
    "Kudafushi": [
      5.70306,
      73.41278
    ],
    "Kunnumala": [
      5.95278,
      73.13306
    ],
    "Kuredhivaru": [
      5.875,
      73.34306
    ],
    "Loafaru": [
      5.78556,
      73.27583
    ],
    "Maakanaafushi": [
      5.72778,
      73.41611
    ],
    "Maavelavaru": [
      5.80528,
      73.17139
    ],
    "Medhafushi": [
      5.74417,
      73.32389
    ],
    "Medhufaru": [
      5.71333,
      73.41472
    ],
    "Orivaru": [
      5.80194,
      73.2975
    ],
    "Raafushi": [
      5.64778,
      73.29861
    ],
    "Randheli": [
      5.69167,
      73.34056
    ],
    "Thanburudhuffushi": [
      5.70889,
      73.24139
    ],
    "Thoshigandukolhu": [
      5.73278,
      73.41333
    ]
  },
  "raa": {
    "Alifushi": [
      5.96722,
      72.95333
    ],
    "Angolhitheemu": [
      5.7925,
      73.00639
    ],
    "Dhuvaafaru": [
      5.62861,
      73.04167
    ],
    "Fainu": [
      5.46333,
      73.03444
    ],
    "Hulhudhuffaaru": [
      5.76194,
      73.01222
    ],
    "Inguraidhoo": [
      5.47694,
      73.03639
    ],
    "Innamaadhoo": [
      5.54944,
      73.04417
    ],
    "Kinolhas": [
      5.44833,
      73.02889
    ],
    "Maakurathu": [
      5.60583,
      73.04389
    ],
    "Meedhoo": [
      5.45806,
      72.95472
    ],
    "Rasgetheemu": [
      5.8075,
      73.00306
    ],
    "Rasmaadhoo": [
      5.56278,
      73.04361
    ],
    "Ungoofaaru": [
      5.66806,
      73.03
    ],
    "Vaadhoo": [
      5.85639,
      72.99139
    ],
    "Arilundhoo": [
      5.66,
      72.9575
    ],
    "Bodufarufinolhu": [
      5.52972,
      72.80472
    ],
    "Boduhaiykodi": [
      5.60972,
      72.96944
    ],
    "Boduhuraa": [
      5.41722,
      73.0225
    ],
    "Dhoragali": [
      5.49472,
      72.99778
    ],
    "Dheburidheythereyvaadhoo": [
      5.40056,
      72.99083
    ],
    "Dhinnaafushi": [
      5.58917,
      72.83333
    ],
    "Dhuvaafaruhuraa": [
      5.63972,
      73.04167
    ],
    "Fenfushi": [
      5.38194,
      72.90194
    ],
    "Giraavaru": [
      5.58833,
      72.86111
    ],
    "Goyyafaru": [
      5.56472,
      72.92722
    ],
    "Hiraveri": [
      5.57167,
      72.86917
    ],
    "Hulhudhoo": [
      5.73861,
      73.01889
    ],
    "Ifuru": [
      5.70722,
      73.02417
    ],
    "Kudakurathu": [
      5.58361,
      73.04444
    ],
    "Kudalhosgiri": [
      5.60167,
      72.91417
    ],
    "Kudathulhaadhoo": [
      5.40722,
      72.89861
    ],
    "Kukulhudhoo": [
      5.45889,
      72.87083
    ],
    "Kuroshigiri": [
      5.51361,
      72.85
    ],
    "Lhaanbugali": [
      5.55194,
      72.87694
    ],
    "Lhohi": [
      5.46139,
      72.885
    ],
    "Lundhufushi": [
      5.64389,
      72.98667
    ],
    "Maamunagaufinolhu": [
      5.36944,
      72.87583
    ],
    "Maanenfushi": [
      5.7525,
      72.96111
    ],
    "Maashigiri": [
      5.51389,
      72.82667
    ],
    "Madivaafaru": [
      5.60806,
      72.98944
    ],
    "Mahidhoo": [
      5.5375,
      72.94389
    ],
    "Mullaafushi": [
      5.52,
      72.90722
    ],
    "Neyo": [
      5.4925,
      73.03861
    ],
    "Thaavathaa": [
      5.48444,
      72.97556
    ],
    "Ufulandhoo": [
      5.46417,
      72.91333
    ],
    "Ungulu": [
      5.69056,
      73.02611
    ],
    "Uthurumaafaru": [
      5.66972,
      72.84556
    ],
    "Vaffushihuraa": [
      5.6425,
      72.83972
    ],
    "Vandhoo": [
      5.53167,
      73.04167
    ],
    "Veyvah": [
      5.76667,
      72.89306
    ],
    "Muravandhoo": [
      5.6075,
      72.95222
    ],
    "Bodufushi": [
      5.5075,
      72.96861
    ],
    "Fasmendhoo": [
      5.49417,
      72.88139
    ],
    "Aarah": [
      5.44694,
      72.94111
    ],
    "Dhigali": [
      5.475,
      72.95333
    ],
    "Huruvalhi": [
      5.39194,
      72.97889
    ],
    "Kothaifaru": [
      5.52528,
      72.84278
    ],
    "Kudafushi": [
      5.51056,
      72.98028
    ],
    "Furaveri": [
      5.44028,
      72.90806
    ],
    "Meedhupparu": [
      5.45583,
      72.97972
    ]
  },
  "baa": {
    "Dharavandhoo": [
      5.15778,
      73.13028
    ],
    "Dhonfanu": [
      5.1875,
      73.12278
    ],
    "Eydhafushi": [
      5.10333,
      73.07
    ],
    "Fehendhoo": [
      4.88139,
      72.96972
    ],
    "Fulhadhoo": [
      4.88472,
      72.93278
    ],
    "Goidhoo": [
      4.87278,
      72.99889
    ],
    "Hithaadhoo": [
      5.00694,
      72.92278
    ],
    "Kamadhoo": [
      5.28167,
      73.13667
    ],
    "Kendhoo": [
      5.27528,
      73.01028
    ],
    "Kihaadhoo": [
      5.215,
      73.125
    ],
    "Kudarikilu": [
      5.30028,
      73.07083
    ],
    "Maalhos": [
      5.13444,
      73.10778
    ],
    "Thulhaadhoo": [
      5.02306,
      72.83972
    ],
    "Ahivaffushi": [
      5.22833,
      72.85694
    ],
    "Aidhoo": [
      5.18694,
      73.16333
    ],
    "Anhenunfushi": [
      5.34194,
      72.96861
    ],
    "Bathalaa": [
      5.35333,
      73.06861
    ],
    "Bodufinolhu": [
      5.00778,
      72.85722
    ],
    "Boifushi": [
      5.2975,
      72.99361
    ],
    "Dhandhoo": [
      5.23556,
      73.16833
    ],
    "Dhigufaruvinagandu": [
      5.35222,
      72.99028
    ],
    "Enboodhoo": [
      5.06389,
      72.85583
    ],
    "Funadhoo": [
      5.27444,
      73.03306
    ],
    "Gaagandufaruhuraa": [
      5.36917,
      73.06083
    ],
    "Gemendhoo": [
      5.27528,
      73.01972
    ],
    "Hanifaru": [
      5.1825,
      73.13278
    ],
    "Hibalhidhoo": [
      5.14111,
      73.11472
    ],
    "Hirundhoo": [
      5.21694,
      73.15333
    ],
    "Hulhudhoo": [
      5.27472,
      73.025
    ],
    "Innafushi": [
      4.8775,
      72.87861
    ],
    "Keyodhoo": [
      5.27667,
      72.99583
    ],
    "Kudadhoo": [
      5.02861,
      72.99139
    ],
    "Maaddoo": [
      5.09278,
      73.0625
    ],
    "Maamaduvvari": [
      5.00889,
      72.94167
    ],
    "Maarikilu": [
      5.33472,
      72.9525
    ],
    "Madhirivaadhoo": [
      5.26861,
      73.16083
    ],
    "Mendhoo": [
      5.175,
      72.99528
    ],
    "Muthaafushi": [
      5.07806,
      72.87722
    ],
    "Nibiligaa": [
      5.17417,
      72.94417
    ],
    "Olhugiri": [
      5.00111,
      72.90583
    ],
    "Thiladhoo": [
      5.26222,
      73.155
    ],
    "Ufuligiri": [
      5.01694,
      72.97028
    ],
    "Undoodhoo": [
      5.27444,
      73.04222
    ],
    "Voavah": [
      5.31667,
      73.0775
    ],
    "Kunfunadhoo": [
      5.11222,
      73.07722
    ],
    "Landaa Giraavaru": [
      5.28611,
      73.11194
    ],
    "Kihavah Huravalhi": [
      5.29583,
      73.05667
    ],
    "Milaidhoo": [
      5.26694,
      73.12806
    ],
    "Vakkaru": [
      5.13361,
      72.91
    ],
    "Horubadhoo": [
      5.16306,
      73.05333
    ],
    "Finolhas": [
      5.23361,
      73.11361
    ],
    "Kanufushi": [
      5.01139,
      72.95139
    ],
    "Miriandhoo": [
      5.06306,
      73.03083
    ],
    "Fares": [
      5.23222,
      72.87722
    ]
  },
  "lhaviyani": {
    "Hinnavaru": [
      5.49194,
      73.41222
    ],
    "Kurendhoo": [
      5.33389,
      73.46361
    ],
    "Maafilaafushi": [
      5.3625,
      73.41611
    ],
    "Naifaru": [
      5.44444,
      73.365
    ],
    "Olhuvelifushi": [
      5.27806,
      73.60639
    ],
    "Aligaa": [
      5.24389,
      73.51639
    ],
    "Boamandhipparu Huraagandu": [
      5.49833,
      73.51056
    ],
    "Bodugaahuraa": [
      5.33222,
      73.65722
    ],
    "Dhashugiri Finolhu": [
      5.42111,
      73.42611
    ],
    "Dhihdhoo": [
      5.37611,
      73.38222
    ],
    "Dhirunbaahuraa": [
      5.35389,
      73.65833
    ],
    "Faadhoo": [
      5.43139,
      73.63028
    ],
    "Faadhoohuraagandu": [
      5.43556,
      73.62
    ],
    "Fainu Aadhanhuraa": [
      5.35833,
      73.65778
    ],
    "Fehigili": [
      5.5575,
      73.48139
    ],
    "Felivaru": [
      5.47694,
      73.38583
    ],
    "Fushifaru": [
      5.49083,
      73.51528
    ],
    "Gaaerifaru": [
      5.485,
      73.40361
    ],
    "Govvaafushi": [
      5.35722,
      73.65861
    ],
    "Hiriyaadhoo": [
      5.4125,
      73.64389
    ],
    "Kalhumanjehuraa": [
      5.55444,
      73.48278
    ],
    "Lhohi": [
      5.32139,
      73.47278
    ],
    "Lhossalafushi": [
      5.3075,
      73.48278
    ],
    "Maakoa": [
      5.35722,
      73.43028
    ],
    "Madivaru": [
      5.45889,
      73.37028
    ],
    "Maduvvari": [
      5.28472,
      73.50194
    ],
    "Maidhoo": [
      5.3975,
      73.64861
    ],
    "Mas Leggihuraa": [
      5.54361,
      73.50083
    ],
    "Medhafushi": [
      5.35556,
      73.42667
    ],
    "Meedhaahuraa": [
      5.36917,
      73.4075
    ],
    "Meyyafushi": [
      5.44111,
      73.60806
    ],
    "Ookolhufinolhu": [
      5.28167,
      73.6225
    ],
    "Rathuruh-huraa": [
      5.4025,
      73.64861
    ],
    "Sellhifushi": [
      5.42306,
      73.64
    ],
    "Varihuraa": [
      5.30333,
      73.48806
    ],
    "Vavvaru": [
      5.4175,
      73.35417
    ],
    "Veligandu": [
      5.52833,
      73.4375
    ],
    "View Details": [
      5.24389,
      73.51639
    ],
    "Vihafarufinolhu": [
      5.45556,
      73.58222
    ],
    "Bodufinolhu": [
      5.26917,
      73.57111
    ],
    "Dheruffinolhu": [
      5.32417,
      73.64722
    ],
    "Dhiffushi": [
      5.38667,
      73.64917
    ],
    "Hudhufushi": [
      5.36222,
      73.65361
    ],
    "Huravalhi": [
      5.52083,
      73.44167
    ],
    "Innahuraa": [
      5.35028,
      73.65417
    ],
    "Kanifushi": [
      5.36389,
      73.3325
    ],
    "Kanuhuraa": [
      5.5325,
      73.50639
    ],
    "Komandoo": [
      5.49333,
      73.42417
    ],
    "Kudadhoo": [
      5.5025,
      73.43389
    ],
    "Kurehdhoo": [
      5.54972,
      73.46583
    ],
    "Maabinhuraaa": [
      5.33694,
      73.65194
    ],
    "Madhiriguraidhoo": [
      5.46917,
      73.56
    ],
    "Medha Adihuraa": [
      5.54083,
      73.50278
    ],
    "Thilamaafushi": [
      5.27306,
      73.58694
    ],
    "Veyvah": [
      5.425,
      73.36111
    ]
  },
  "male": {
    "Dhiffushi": [
      4.44194,
      73.71361
    ],
    "Gaafaru": [
      4.73583,
      73.5
    ],
    "Gulhi": [
      3.99028,
      73.50889
    ],
    "Guraidhoo": [
      3.90056,
      73.46806
    ],
    "Himmafushi": [
      4.30917,
      73.57083
    ],
    "Huraa": [
      4.33361,
      73.60083
    ],
    "Hulhumalé": [
      4.21222,
      73.54028
    ],
    "Kaashidhoo": [
      4.95556,
      73.46111
    ],
    "Maafushi": [
      3.94056,
      73.48944
    ],
    "Malé": [
      4.17528,
      73.50889
    ],
    "Thulusdhoo": [
      4.37389,
      73.65083
    ],
    "Aarah": [
      4.23,
      73.49444
    ],
    "Boduhuraa": [
      3.96722,
      73.50528
    ],
    "Dhoonidhoo": [
      4.19694,
      73.51361
    ],
    "Feydhoofinolhu": [
      4.21389,
      73.48556
    ],
    "Girifushi": [
      4.31833,
      73.57833
    ],
    "Huraagandu": [
      4.36611,
      73.62222
    ],
    "Kalhuhuraa": [
      4.00944,
      73.37278
    ],
    "Kudabandos": [
      4.26361,
      73.49972
    ],
    "Kudafinolhu": [
      3.865,
      73.45833
    ],
    "Lhosfushi": [
      3.89694,
      73.46972
    ],
    "Maadhoo": [
      3.87083,
      73.45861
    ],
    "Madivaru": [
      4.50056,
      73.36806
    ],
    "Makunufushi": [
      3.91778,
      73.46972
    ],
    "Rasfari": [
      4.39444,
      73.35139
    ],
    "Thanburudhoo": [
      4.31528,
      73.58417
    ],
    "Thilafushi": [
      4.18333,
      73.44556
    ],
    "Vaagali": [
      3.94833,
      73.35611
    ],
    "Vabboahuraa": [
      4.31917,
      73.59611
    ],
    "Veliganduhuraa": [
      3.97139,
      73.50639
    ],
    "Baros": [
      4.28472,
      73.42722
    ],
    "Vihamanaafushi": [
      4.22667,
      73.51972
    ],
    "Lankanfushi": [
      4.29472,
      73.55806
    ],
    "Lankanfinolhu": [
      4.285,
      73.55361
    ],
    "Bodubandos": [
      4.26944,
      73.49139
    ],
    "Boduhithi": [
      4.43028,
      73.38444
    ],
    "Biyaadhoo": [
      3.92194,
      73.45639
    ],
    "Bolifushi": [
      4.09583,
      73.40139
    ],
    "Dhigufinolhu": [
      3.97222,
      73.50222
    ],
    "Enboodhoo": [
      4.08389,
      73.51194
    ],
    "Enboodhoofinolhu": [
      4.10306,
      73.52528
    ],
    "Giraavaru": [
      4.20028,
      73.41278
    ],
    "Helengeli": [
      4.63444,
      73.56333
    ],
    "Henbadhoo": [
      4.48139,
      73.39306
    ],
    "Ihuru": [
      4.30667,
      73.41583
    ],
    "Kagi": [
      4.67694,
      73.50083
    ],
    "Kandoomaafushi": [
      3.90333,
      73.47333
    ],
    "Kanifinolhu": [
      4.34333,
      73.60806
    ],
    "Kuda Huraa": [
      4.32806,
      73.5975
    ],
    "Kudahithi": [
      4.41694,
      73.38
    ],
    "Lhohifushi": [
      4.35056,
      73.61806
    ],
    "Medhufinolhu": [
      4.51389,
      73.36917
    ],
    "Meerufenfushi": [
      4.45361,
      73.71667
    ],
    "Olhuveli": [
      3.85028,
      73.455
    ],
    "Ran-naalhi": [
      3.90306,
      73.3575
    ],
    "Thulhaagiri": [
      4.31139,
      73.48722
    ],
    "Vaadhoo": [
      4.12389,
      73.45722
    ],
    "Vabbinfaru": [
      4.30972,
      73.42389
    ],
    "Velassaru": [
      4.12139,
      73.43694
    ],
    "Akirifushi": [
      4.6375,
      73.40056
    ]
  },
  "alif-alif": {
    "Bodufolhudhoo": [
      4.18528,
      72.77306
    ],
    "Feridhoo": [
      4.05083,
      72.72528
    ],
    "Himendhoo": [
      3.92083,
      72.74389
    ],
    "Maalhos": [
      3.98694,
      72.71972
    ],
    "Mathiveri": [
      4.19167,
      72.74611
    ],
    "Rasdhoo": [
      4.26278,
      72.99194
    ],
    "Thoddoo": [
      4.43889,
      72.95861
    ],
    "Ukulhas": [
      4.21472,
      72.86389
    ],
    "Dhinnolhufinolhu": [
      4.13833,
      72.73306
    ],
    "Fusfinolhu": [
      4.01833,
      72.95833
    ],
    "Fushi": [
      4.21556,
      72.88361
    ],
    "Gaagandu": [
      4.23278,
      72.865
    ],
    "Madivaru": [
      4.26528,
      73
    ],
    "Madivarufinolhu": [
      4.26861,
      73
    ],
    "Mathivereefinolhu": [
      4.185,
      72.75056
    ],
    "Velidhoodhigga Falhu": [
      4.16278,
      72.80333
    ],
    "View Details": [
      3.94333,
      72.88028
    ],
    "Vihamaafaru": [
      4.12194,
      72.74639
    ],
    "Alikoirah": [
      3.94333,
      72.88028
    ],
    "Etheremadivaru": [
      4.11861,
      72.93778
    ],
    "Gaathafushi": [
      4.02333,
      72.81056
    ],
    "Kandholhudoo": [
      4.0025,
      72.88139
    ],
    "Maagau": [
      3.98889,
      72.95694
    ],
    "Maayafushi": [
      4.07361,
      72.8875
    ],
    "Madoogali": [
      4.09583,
      72.75278
    ],
    "Mushimasmigili": [
      3.95889,
      72.91306
    ],
    "Velidhoo": [
      4.19472,
      72.81833
    ],
    "Kuramathi": [
      4.25917,
      72.97917
    ],
    "Halaveli": [
      4.03806,
      72.91917
    ],
    "Fesdhoo": [
      4.00667,
      72.81083
    ],
    "Veligandu": [
      4.29889,
      73.01139
    ],
    "Kudafolhudhoo": [
      4.18111,
      72.76694
    ],
    "Gangehi": [
      4.22,
      72.755
    ],
    "Bathalaa": [
      4.07028,
      72.94528
    ],
    "Ellaidhoo": [
      4.00611,
      72.94889
    ]
  },
  "alif-dhaal": {
    "Dhangethi": [
      3.6075,
      72.95528
    ],
    "Dhigurah": [
      3.53056,
      72.92583
    ],
    "Dhihdhoo": [
      3.48306,
      72.8775
    ],
    "Fenfushi": [
      3.48917,
      72.78361
    ],
    "Hangnaameedhoo": [
      3.84917,
      72.955
    ],
    "Kunburudhoo": [
      3.77556,
      72.925
    ],
    "Mahibadhoo": [
      3.75694,
      72.96917
    ],
    "Mandhoo": [
      3.69778,
      72.70944
    ],
    "Omadhoo": [
      3.79139,
      72.96194
    ],
    "Ariyadhoo": [
      3.475,
      72.85472
    ],
    "Athulivaru Finolhu": [
      3.64806,
      72.95583
    ],
    "Bulhalohi": [
      3.73889,
      72.73167
    ],
    "Dhiggiri": [
      3.85861,
      72.915
    ],
    "Enboodhoo": [
      3.815,
      72.75222
    ],
    "Finolhu": [
      3.55556,
      72.86806
    ],
    "Fushidhigga": [
      3.7575,
      72.77056
    ],
    "Hiyafushi": [
      3.47917,
      72.87028
    ],
    "Hukurudhoo": [
      3.57028,
      72.71861
    ],
    "Hurasdhoo": [
      3.66667,
      72.77472
    ],
    "Kalhahandhihuraa": [
      3.79806,
      72.71056
    ],
    "Kudadhoo": [
      3.47889,
      72.87194
    ],
    "Lonuboi": [
      3.60306,
      72.90056
    ],
    "Theluveligaa": [
      3.67,
      72.9025
    ],
    "View Details": [
      3.6525,
      72.82167
    ],
    "Angaagau": [
      3.6525,
      72.82167
    ],
    "Bodufinolhu": [
      3.49417,
      72.76111
    ],
    "Bodukaashihuraa": [
      3.87583,
      72.95472
    ],
    "Dhiffushi": [
      3.475,
      72.82472
    ],
    "Dhihdhoofinolhu": [
      3.49833,
      72.89611
    ],
    "Heenfaru": [
      3.81944,
      72.82861
    ],
    "Huruelhi": [
      3.54389,
      72.71944
    ],
    "Innafushi": [
      3.79722,
      72.73222
    ],
    "Kudarah": [
      3.57389,
      72.91056
    ],
    "Rahdhiggaa": [
      3.7575,
      72.77083
    ],
    "Rangaleefinolhu": [
      3.61611,
      72.71639
    ],
    "Rangali": [
      3.61778,
      72.72306
    ],
    "Tholhifushi": [
      3.48472,
      72.79
    ],
    "Thundufushi": [
      3.78611,
      72.73083
    ],
    "Vilingilivaru": [
      3.61889,
      72.955
    ],
    "Nalaguraidhoo": [
      3.48333,
      72.80139
    ],
    "Huvahendhoo": [
      3.65361,
      72.95361
    ],
    "Moofushi": [
      3.88472,
      72.72778
    ],
    "Machchafushi": [
      3.59361,
      72.88333
    ],
    "Maafushivaru": [
      3.60778,
      72.90028
    ],
    "Mirihi": [
      3.61917,
      72.78028
    ],
    "Vilamendhoo": [
      3.63361,
      72.95889
    ],
    "Athurugau": [
      3.88694,
      72.81611
    ],
    "Vakarufalhi": [
      3.57833,
      72.90194
    ]
  },
  "vaavu": {
    "Felidhoo": [
      3.47167,
      73.54722
    ],
    "Fulidhoo": [
      3.68028,
      73.41583
    ],
    "Keyodhoo": [
      3.46194,
      73.55
    ],
    "Rakeedhoo": [
      3.31472,
      73.46972
    ],
    "Thinadhoo": [
      3.4875,
      73.53806
    ],
    "Aarah": [
      3.49917,
      73.52917
    ],
    "Anbaraa": [
      3.37222,
      73.43944
    ],
    "Bodumohoraa": [
      3.34306,
      73.52111
    ],
    "Hulhidhoo": [
      3.49333,
      73.53278
    ],
    "Kuda-anbaraa": [
      3.42694,
      73.42472
    ],
    "Ruhhurihuraa": [
      3.36111,
      73.5
    ],
    "Thunduhuraa": [
      3.3425,
      73.50639
    ],
    "Vashugiri": [
      3.63028,
      73.3775
    ],
    "Vattaru": [
      3.22111,
      73.42639
    ],
    "Dhiggiri": [
      3.645,
      73.48722
    ],
    "Kunaavashi": [
      3.63639,
      73.36472
    ]
  },
  "meemu": {
    "Dhiggaru": [
      3.11167,
      73.56556
    ],
    "Kolhufushi": [
      2.77972,
      73.42528
    ],
    "Maduvvari": [
      3.105,
      73.57278
    ],
    "Mulah": [
      2.94667,
      73.58472
    ],
    "Muli": [
      2.92083,
      73.58111
    ],
    "Naalaafushi": [
      2.895,
      73.57722
    ],
    "Raiymandhoo": [
      3.08972,
      73.63889
    ],
    "Veyvah": [
      2.95611,
      73.6
    ],
    "Boahuraa": [
      2.92583,
      73.58556
    ],
    "Dhihthundi": [
      2.76583,
      73.42111
    ],
    "Erruh-huraa": [
      3.06972,
      73.64194
    ],
    "Fenfuraaveli": [
      2.78861,
      73.4275
    ],
    "Gaakurali": [
      2.78,
      73.37222
    ],
    "Gongalihuraa": [
      2.85389,
      73.55083
    ],
    "Hudhuveli": [
      3.03667,
      73.61944
    ],
    "Hurasveli": [
      3.01889,
      73.61806
    ],
    "Kuradhigandu": [
      2.77389,
      73.3725
    ],
    "Maahuraa": [
      2.79306,
      73.42833
    ],
    "Maalhaveli": [
      2.90444,
      73.57889
    ],
    "Raabandhihuraa": [
      3.09194,
      73.38861
    ],
    "Thuvaru": [
      2.89806,
      73.37917
    ],
    "View Details": [
      2.92583,
      73.58556
    ],
    "Dhekunuboduveli": [
      2.82528,
      73.45194
    ],
    "Gasveli": [
      2.83,
      73.45833
    ],
    "Hakuraahuraa": [
      2.85389,
      73.53861
    ],
    "Kekuraalhuveli": [
      2.85194,
      73.53472
    ],
    "Kuda Usfushi": [
      2.81833,
      73.44361
    ],
    "Maa Usfushi": [
      2.80389,
      73.43361
    ],
    "Madifushi": [
      3.08111,
      73.63944
    ],
    "Medhufushi": [
      2.88611,
      73.57556
    ],
    "Seedheehuraa": [
      2.85778,
      73.55778
    ],
    "Seedheehuraa Veligandu": [
      2.85944,
      73.55417
    ],
    "Uthuruboduveli": [
      3.02528,
      73.61833
    ],
    "Uthurugaseveli": [
      3.03111,
      73.61889
    ]
  },
  "faafu": {
    "Bileiydhoo": [
      3.11806,
      72.98417
    ],
    "Dharanboodhoo": [
      3.06278,
      72.92611
    ],
    "Feeali": [
      3.26972,
      73.00222
    ],
    "Magoodhoo": [
      3.07833,
      72.96389
    ],
    "Nilandhoo": [
      3.05583,
      72.88944
    ],
    "Dhiguvarufinolhu": [
      3.24667,
      73.02528
    ],
    "Faanumaahuraa": [
      3.21333,
      72.98194
    ],
    "Jinnathugau": [
      3.20028,
      72.99806
    ],
    "Kandumoonufushi": [
      3.31583,
      72.89778
    ],
    "Kudafari Finolhu": [
      3.22111,
      73.03167
    ],
    "Madivaruhuraa": [
      3.26667,
      73.01056
    ],
    "Magoodhoo Bodufinolhu": [
      3.07389,
      72.95417
    ],
    "Makunueri": [
      3.25833,
      72.92861
    ],
    "View Details": [
      3.13889,
      73.00833
    ],
    "Vilingilivaru Finolhu": [
      3.27417,
      72.99861
    ],
    "Adhangau": [
      3.13889,
      73.00833
    ],
    "Enbulufushi": [
      3.13444,
      73.01833
    ],
    "Filitheyo": [
      3.21306,
      73.03694
    ],
    "Himithi": [
      3.25472,
      72.81917
    ],
    "Maafushi": [
      3.24333,
      72.97861
    ],
    "Minimasgali": [
      3.24278,
      72.83556
    ]
  },
  "dhaalu": {
    "Bandidhoo": [
      2.93639,
      72.99028
    ],
    "Hulhudheli": [
      2.85833,
      72.84583
    ],
    "Kudahuvadhoo": [
      2.67111,
      72.89389
    ],
    "Maaenboodhoo": [
      2.69556,
      72.96306
    ],
    "Meedhoo": [
      2.99806,
      73.00639
    ],
    "Rinbudhoo": [
      2.92417,
      72.89528
    ],
    "Vaanee": [
      2.72528,
      73.00278
    ],
    "Aarah": [
      2.92278,
      72.96111
    ],
    "Angalhaidhoo": [
      2.74167,
      73.01861
    ],
    "Ayyakaloahuraa": [
      2.79389,
      73.02556
    ],
    "Boarikifinolhu": [
      2.92333,
      72.97111
    ],
    "Bodufushi": [
      2.70278,
      72.8475
    ],
    "Bulhalafushi": [
      2.80639,
      73.02611
    ],
    "Dhebaidhoo": [
      2.79056,
      73.02556
    ],
    "Fenfushi": [
      2.80361,
      73.02611
    ],
    "Fenmeeruhuraa": [
      2.78722,
      73.02528
    ],
    "Gemendhoo": [
      2.80111,
      73.02583
    ],
    "Hudhufusheefinolhu": [
      2.89361,
      72.90472
    ],
    "Hulhuvehi": [
      2.85639,
      73.025
    ],
    "Issari": [
      2.70639,
      72.9825
    ],
    "Kanneifaru": [
      2.92389,
      73.02694
    ],
    "Lhohi": [
      2.95694,
      72.98556
    ],
    "Maalefaru": [
      2.88194,
      73.02556
    ],
    "Minimasgali": [
      2.75028,
      72.88722
    ],
    "Olhufushi": [
      2.81361,
      73.02639
    ],
    "Thabanlhaidhoo": [
      2.79778,
      73.02528
    ],
    "Thilabolhufushi": [
      2.75528,
      73.02222
    ],
    "Thinhuraa": [
      2.76667,
      73.02389
    ],
    "Uhdhoo": [
      2.97028,
      72.99056
    ],
    "Valla": [
      2.70444,
      72.8825
    ],
    "Vallalhohi": [
      2.73056,
      72.88778
    ],
    "View Details": [
      2.93278,
      72.96056
    ],
    "Aluvifushi": [
      2.93278,
      72.96056
    ],
    "Dhoores": [
      2.91722,
      72.88389
    ],
    "Enboodhoofushi": [
      2.6775,
      72.92778
    ],
    "Faandhoo": [
      2.9625,
      72.94639
    ],
    "Hiriyafushi": [
      2.71167,
      72.98778
    ],
    "Kandinmaa": [
      2.7325,
      73.01139
    ],
    "Kedhigandu": [
      2.69583,
      72.85139
    ],
    "Kiraidhoo": [
      2.78028,
      73.025
    ],
    "Maadheli": [
      2.88417,
      72.83722
    ],
    "Maafushi": [
      2.68806,
      72.85917
    ],
    "Maagau": [
      2.94778,
      72.91417
    ],
    "Meedhuffushi": [
      3.00333,
      73.00056
    ],
    "Olhuveli": [
      2.68194,
      72.93417
    ],
    "Velavaru": [
      2.97972,
      73.01556
    ],
    "Vommuli": [
      2.91139,
      72.86583
    ]
  },
  "thaa": {
    "Burunee": [
      2.55889,
      73.10667
    ],
    "Dhiyamigili": [
      2.33917,
      73.33694
    ],
    "Gaadhiffushi": [
      2.25222,
      73.21278
    ],
    "Guraidhoo": [
      2.325,
      73.31917
    ],
    "Hirilandhoo": [
      2.27083,
      72.93167
    ],
    "Kandoodhoo": [
      2.32083,
      72.91639
    ],
    "Kinbidhoo": [
      2.16806,
      73.06583
    ],
    "Madifushi": [
      2.35667,
      73.35472
    ],
    "Omadhoo": [
      2.1675,
      73.02361
    ],
    "Vandhoo": [
      2.29139,
      72.94167
    ],
    "Veymandoo": [
      2.18667,
      73.095
    ],
    "Vilufushi": [
      2.50306,
      73.30833
    ],
    "Bodufinolhu": [
      2.31556,
      73.30528
    ],
    "Bodurehaa": [
      2.2675,
      73.22917
    ],
    "Dhonanfushi": [
      2.48972,
      73.31472
    ],
    "Dhururehaa": [
      2.16861,
      73.01194
    ],
    "Ekuruffushi": [
      2.26556,
      73.22639
    ],
    "Fenfushi": [
      2.29139,
      73.26972
    ],
    "Fenmeerufushi": [
      2.27056,
      73.23306
    ],
    "Fondhoo": [
      2.31472,
      72.98278
    ],
    "Fonidhaani": [
      2.30083,
      73.28472
    ],
    "Funaddu": [
      2.19806,
      73.12861
    ],
    "Fushi": [
      2.19278,
      72.96861
    ],
    "Gaathurehaa": [
      2.17028,
      73.01556
    ],
    "Hathifushi": [
      2.28722,
      73.26306
    ],
    "Hikandhihohi": [
      2.52056,
      73.22667
    ],
    "Hiriyanfushi": [
      2.21167,
      73.14944
    ],
    "Hondelifushi": [
      2.49472,
      73.3125
    ],
    "Hulhiyanfushi": [
      2.25861,
      73.21806
    ],
    "Kaaddoo": [
      2.28167,
      73.25444
    ],
    "Kafidhoo": [
      2.32694,
      72.96167
    ],
    "Kakolhas": [
      2.31528,
      72.94389
    ],
    "Kalhufahalafushi": [
      2.40639,
      73.36056
    ],
    "Kandufushi": [
      2.53139,
      72.9875
    ],
    "Kani": [
      2.18944,
      72.97333
    ],
    "Kolafushi": [
      2.26389,
      73.22333
    ],
    "Kolhufushi": [
      2.36472,
      73.36333
    ],
    "Kudadhoo": [
      2.30889,
      72.95139
    ],
    "Kudakaaddoo": [
      2.28528,
      73.25917
    ],
    "Kudakinbidhoo": [
      2.16417,
      73.06278
    ],
    "Kuredhifushi": [
      2.1675,
      73.03389
    ],
    "Mathidhoo": [
      2.34611,
      73.34278
    ],
    "Medhafushi": [
      2.34306,
      73.34083
    ],
    "Olhudhiyafushi": [
      2.27194,
      73.23583
    ],
    "Olhufushi": [
      2.36583,
      72.90861
    ],
    "Olhufushifinolhu": [
      2.37139,
      72.90833
    ],
    "Rihaamaafushi": [
      2.28917,
      73.26639
    ],
    "Ufuriyaa": [
      2.36111,
      73.36167
    ],
    "Usfushi": [
      2.24611,
      73.20444
    ],
    "Vanbadhi": [
      2.18694,
      72.97556
    ],
    "View Details": [
      2.31556,
      73.30528
    ],
    "Dhiffushi": [
      2.515,
      73.23222
    ],
    "Elaa": [
      2.17111,
      73.07972
    ],
    "Gaalee": [
      2.5475,
      73.15417
    ],
    "Kalhudheyfushi": [
      2.29444,
      73.27667
    ],
    "Kanimeedhoo": [
      2.195,
      73.11139
    ],
    "Kurandhuvaru": [
      2.53917,
      73.17583
    ],
    "Lhavaddoo": [
      2.30556,
      73.29111
    ],
    "Maagulhi": [
      2.53806,
      73.17944
    ],
    "Maalefushi": [
      2.31028,
      73.29806
    ],
    "Olhugiri": [
      2.50583,
      73.25611
    ],
    "Ruhthibirah": [
      2.16806,
      73.05278
    ]
  },
  "laamu": {
    "Dhanbidhoo": [
      2.09444,
      73.545
    ],
    "Fonadhoo": [
      1.83333,
      73.50056
    ],
    "Gan": [
      1.91861,
      73.54194
    ],
    "Hithadhoo": [
      1.79694,
      73.38833
    ],
    "Isdhoo": [
      2.11833,
      73.56722
    ],
    "Kalhaidhoo": [
      1.98778,
      73.53667
    ],
    "Kunahandhoo": [
      1.78278,
      73.36806
    ],
    "Maabaidhoo": [
      2.02889,
      73.5325
    ],
    "Maamendhoo": [
      1.81694,
      73.38944
    ],
    "Maavah": [
      1.88556,
      73.24306
    ],
    "Mundoo": [
      2.01194,
      73.53417
    ],
    "Aarahaa": [
      1.82889,
      73.27444
    ],
    "Athahendha": [
      1.82806,
      73.27389
    ],
    "Bodufenrahaa": [
      1.8275,
      73.27111
    ],
    "Bodufinolhu": [
      2.02778,
      73.37222
    ],
    "Boduhuraa": [
      1.80056,
      73.29444
    ],
    "Bodumaabulhali": [
      1.84917,
      73.25556
    ],
    "Bodumahigulhi": [
      1.78667,
      73.32611
    ],
    "Bokaiyfushi": [
      1.99861,
      73.53472
    ],
    "Burrahaa": [
      1.82694,
      73.27778
    ],
    "Dhekunuvinagandu": [
      1.8175,
      73.27917
    ],
    "Dhonberahaa": [
      2.07111,
      73.53583
    ],
    "Enberahaa": [
      1.84194,
      73.2575
    ],
    "Fenboahuraa": [
      2.06417,
      73.53806
    ],
    "Fenboarahaa": [
      1.81,
      73.28556
    ],
    "Fushi": [
      2.04944,
      73.53194
    ],
    "Gaadhoo": [
      1.82056,
      73.45111
    ],
    "Guraidhoo": [
      1.90778,
      73.25472
    ],
    "Haiythoshi": [
      1.84194,
      73.25833
    ],
    "Hanhushi": [
      1.95139,
      73.26167
    ],
    "Hedha": [
      1.82194,
      73.27417
    ],
    "Hikandhirahaa": [
      2.05806,
      73.53639
    ],
    "Holhurahaa": [
      2.06833,
      73.53889
    ],
    "Hulhisdhoo": [
      1.785,
      73.3875
    ],
    "Hulhiyandhoo": [
      2.08056,
      73.54139
    ],
    "Kahdhoo": [
      1.85972,
      73.52139
    ],
    "Kalhurahaa": [
      1.84444,
      73.25667
    ],
    "Kandaru": [
      2.06056,
      73.53639
    ],
    "Kanuhuraa": [
      2.04556,
      73.53222
    ],
    "Kashidhoo": [
      1.91917,
      73.25333
    ],
    "Kokurahaa": [
      1.85417,
      73.25472
    ],
    "Kuda Munyafushi": [
      1.99139,
      73.3125
    ],
    "Kudafenrehaa": [
      1.80944,
      73.28889
    ],
    "Kudafushi": [
      1.78861,
      73.33194
    ],
    "Kudamaabulhali": [
      1.84722,
      73.25278
    ],
    "Kudarah": [
      2.06472,
      73.53667
    ],
    "Kudaveshi": [
      1.82444,
      73.28194
    ],
    "Kuredhirehaa": [
      1.78056,
      73.35361
    ],
    "Maafushi": [
      1.79167,
      73.33333
    ],
    "Maakalhuveli": [
      1.78889,
      73.34
    ],
    "Maandhoo": [
      1.87361,
      73.52806
    ],
    "Maaveshi": [
      1.83306,
      73.27139
    ],
    "Medhu Vinagandu": [
      1.81667,
      73.27778
    ],
    "Mendhoo": [
      1.78667,
      73.38139
    ],
    "Olhutholhu": [
      1.78806,
      73.35167
    ],
    "Rahaa": [
      2.05556,
      73.53444
    ],
    "Thathunrahaa": [
      1.83083,
      73.26833
    ],
    "Thunburi": [
      2.07472,
      73.54
    ],
    "Uthuru Vinagandu": [
      1.81778,
      73.27778
    ],
    "Uvadhevifushi": [
      1.97889,
      73.53694
    ],
    "Veligandufinolhu": [
      1.82917,
      73.40806
    ],
    "View Details": [
      1.82889,
      73.27444
    ],
    "Baresdhoo": [
      1.96778,
      73.53972
    ],
    "Bodu Mungnafushi": [
      1.98889,
      73.30833
    ],
    "Fares": [
      1.79972,
      73.30083
    ],
    "Fonagaadhoo": [
      2.11528,
      73.54222
    ],
    "Gahagandufinolhu": [
      1.95194,
      73.54
    ],
    "Hulhimendhoo": [
      1.82194,
      73.39444
    ],
    "Kudafares": [
      1.79667,
      73.30028
    ],
    "Mahakanfushi": [
      1.95889,
      73.54028
    ],
    "Olhuveli": [
      1.81583,
      73.40639
    ],
    "Vadinolhu": [
      2.0175,
      73.35889
    ]
  },
  "gaafu-alif": {
    "Dhaandhoo": [
      0.62083,
      73.46194
    ],
    "Dhevvadhoo": [
      0.55694,
      73.24222
    ],
    "Gemanafushi": [
      0.4425,
      73.56833
    ],
    "Kanduhulhudhoo": [
      0.35083,
      73.53972
    ],
    "Kolamaafushi": [
      0.83778,
      73.18417
    ],
    "Kondey": [
      0.49861,
      73.54889
    ],
    "Maamendhoo": [
      0.71389,
      73.43917
    ],
    "Nilandhoo": [
      0.63611,
      73.44639
    ],
    "Vilingili": [
      0.75417,
      73.43472
    ],
    "Araigaththaa": [
      0.45194,
      73.535
    ],
    "Baavanadhoo": [
      0.52139,
      73.53972
    ],
    "Baberahutta": [
      0.84278,
      73.17972
    ],
    "Beyrumauddoo": [
      0.79472,
      73.225
    ],
    "Bihurehaa": [
      0.42194,
      73.57083
    ],
    "Boadduvaa": [
      0.70583,
      73.33056
    ],
    "Bodubondeyyaa": [
      0.40972,
      73.5675
    ],
    "Bodufinolhu": [
      0.80139,
      73.42306
    ],
    "Bodufuttaa": [
      0.85472,
      73.40306
    ],
    "Boduhuraa": [
      0.41222,
      73.57167
    ],
    "Dhevvaamaagala": [
      0.57083,
      73.19167
    ],
    "Dhevvalaabadhoo": [
      0.60444,
      73.30944
    ],
    "Dhigudhoo": [
      0.54278,
      73.53444
    ],
    "Dhiyadhoo": [
      0.47833,
      73.55694
    ],
    "Falhuverrahaa": [
      0.76278,
      73.43472
    ],
    "Fenehutta": [
      0.71389,
      73.285
    ],
    "Fenrehaa": [
      0.42028,
      73.57083
    ],
    "Fulangi": [
      0.68444,
      73.20194
    ],
    "Fulhadhoo": [
      0.87417,
      73.25556
    ],
    "Funadhoo": [
      0.56222,
      73.52583
    ],
    "Funadhooviligillaa": [
      0.56944,
      73.52
    ],
    "Galandhoo": [
      0.53,
      73.53694
    ],
    "Hagedhoo": [
      0.53278,
      73.31083
    ],
    "Hagevilla": [
      0.68833,
      73.26667
    ],
    "Hithaadhoo": [
      0.84861,
      73.24222
    ],
    "Hithaadhoogalaa": [
      0.82611,
      73.25194
    ],
    "Hulhimendhoo": [
      0.70333,
      73.44
    ],
    "Hurendhoo": [
      0.84667,
      73.2075
    ],
    "Idhimaa": [
      0.4075,
      73.56972
    ],
    "Innarehaa": [
      0.37944,
      73.55639
    ],
    "Kalhehuttaa": [
      0.84833,
      73.17861
    ],
    "Kaludirehaa": [
      0.43417,
      73.56917
    ],
    "Kanduvilingili": [
      0.86611,
      73.19028
    ],
    "Kendheraa": [
      0.72667,
      73.285
    ],
    "Kisserahaa": [
      0.64972,
      73.13528
    ],
    "Kodagehuttaa": [
      0.84083,
      73.18111
    ],
    "Kodahuttaa": [
      0.6775,
      73.43917
    ],
    "Kodeyvilingili": [
      0.51333,
      73.54222
    ],
    "Kooddoo": [
      0.73306,
      73.43333
    ],
    "Kudalafari": [
      0.89667,
      73.34972
    ],
    "Kudhebondeyyaa": [
      0.41583,
      73.5725
    ],
    "Kunbumaafushi": [
      0.37444,
      73.55139
    ],
    "Lhossaa": [
      0.81972,
      73.20167
    ],
    "Maadhigavara": [
      0.67167,
      73.28333
    ],
    "Maafehelaa": [
      0.37944,
      73.55278
    ],
    "Maagihuttaa": [
      0.84556,
      73.17944
    ],
    "Maakanaarataa": [
      0.81194,
      73.20694
    ],
    "Maanaagalaa": [
      0.88528,
      73.33611
    ],
    "Maarehaa": [
      0.46139,
      73.56389
    ],
    "Mahthidhoo": [
      0.66944,
      73.36778
    ],
    "Mahthurehaa": [
      0.36833,
      73.55278
    ],
    "Medharehaa": [
      0.36333,
      73.54528
    ],
    "Medhehuttaa": [
      0.46667,
      73.56167
    ],
    "Medhuburiyaa": [
      0.3725,
      73.55333
    ],
    "Melaimu": [
      0.8575,
      73.17917
    ],
    "Minimessa": [
      0.54111,
      73.12389
    ],
    "Munandhuvaa": [
      0.59528,
      73.50083
    ],
    "Odegallaa": [
      0.6625,
      73.41833
    ],
    "Raaverrehaa": [
      0.7675,
      73.42889
    ],
    "Ribidhoo": [
      0.8725,
      73.24472
    ],
    "View Details": [
      0.45194,
      73.535
    ],
    "Villigalaa": [
      0.51861,
      73.21639
    ],
    "Bakeththaa": [
      0.38083,
      73.49778
    ],
    "Dhigurah": [
      0.68972,
      73.44111
    ],
    "Falhumaafushi": [
      0.67139,
      73.43833
    ],
    "Funamauddaa": [
      0.53361,
      73.19
    ],
    "Handahaa": [
      0.50528,
      73.45389
    ],
    "Hinaamaagalaa": [
      0.62944,
      73.34528
    ],
    "Hirihuttaa": [
      0.54028,
      73.34611
    ],
    "Kerehdhoo": [
      0.65861,
      73.43861
    ],
    "Kodeymatheelaabadhoo": [
      0.50556,
      73.49833
    ],
    "Maamutaa": [
      0.84611,
      73.40806
    ],
    "Maarandhoo": [
      0.85361,
      73.20917
    ],
    "Mahahdhoo": [
      0.58389,
      73.51306
    ],
    "Meradhoo": [
      0.58667,
      73.09333
    ],
    "Vodamulaa": [
      0.60361,
      73.48694
    ]
  },
  "gaafu-dhaalu": {
    "Faresmaathodaa": [
      0.19944,
      73.18694
    ],
    "Fiyoari": [
      0.22139,
      73.13639
    ],
    "Gahdhoo": [
      0.28889,
      73.45583
    ],
    "Hoandehdoo": [
      0.44417,
      73.00306
    ],
    "Madaveli": [
      0.45861,
      72.99833
    ],
    "Nadellaa": [
      0.29333,
      73.04028
    ],
    "Rathafandhoo": [
      0.2525,
      73.10444
    ],
    "Thinadhoo": [
      0.53056,
      72.99639
    ],
    "Vaadhoo": [
      0.22722,
      73.27361
    ],
    "Aakiraahuttaa": [
      0.26389,
      73.09222
    ],
    "Anhenrehaa": [
      0.4025,
      73.005
    ],
    "Athihuttaa": [
      0.27972,
      73.0625
    ],
    "Bandefodiyaa": [
      0.28139,
      73.06056
    ],
    "Baulhagallaa": [
      0.49472,
      73.17222
    ],
    "Beeraahuttaa": [
      0.28028,
      73.06083
    ],
    "Bodehutta": [
      0.29917,
      73.04028
    ],
    "Bodurehaa": [
      0.38361,
      73.01556
    ],
    "Dhatekeraanahutta": [
      0.39639,
      73.00778
    ],
    "Dhatemulaidhoo": [
      0.30972,
      73.02667
    ],
    "Dhekaamba": [
      0.37361,
      73.0225
    ],
    "Dherukerehaa": [
      0.24583,
      73.11194
    ],
    "Dhigelaabadhuvaa": [
      0.22,
      73.15444
    ],
    "Dhigurehaa": [
      0.42139,
      73.00472
    ],
    "Dhimmanaa": [
      0.45,
      72.99778
    ],
    "Dhiyanigilla": [
      0.30167,
      73.02861
    ],
    "Dhoonirehaa": [
      0.19472,
      73.19444
    ],
    "Ehivakaa": [
      0.28694,
      73.05444
    ],
    "Ekelondaa": [
      0.20778,
      73.17528
    ],
    "Ekurukaarataa": [
      0.23889,
      73.11972
    ],
    "Faahuttaa": [
      0.24694,
      73.10972
    ],
    "Faanahuttaa": [
      0.29972,
      73.40389
    ],
    "Faathiyehutta": [
      0.26917,
      73.19417
    ],
    "Faredhoo": [
      0.40139,
      73.00472
    ],
    "Farehulhedhoo": [
      0.32833,
      73.4975
    ],
    "Fatefandhuvaa": [
      0.30639,
      73.0275
    ],
    "Femunaidhoo": [
      0.23722,
      73.12222
    ],
    "Fenevenehuttaa": [
      0.26222,
      73.09444
    ],
    "Gan": [
      0.27722,
      73.4325
    ],
    "Golhaallaa": [
      0.32056,
      73.48639
    ],
    "Gosi": [
      0.51028,
      73.1475
    ],
    "Haadhuvaa": [
      0.23889,
      73.12194
    ],
    "Hadaadhoo": [
      0.19361,
      73.19194
    ],
    "Hakandhoo": [
      0.29917,
      73.03222
    ],
    "Haveyyarataa": [
      0.2975,
      73.03639
    ],
    "Havodigalaa": [
      0.52278,
      73.07417
    ],
    "Hevaahulhadhoo": [
      0.30083,
      73.03083
    ],
    "Hoothodeyaa": [
      0.20278,
      73.18167
    ],
    "Hulhuvaarulaa": [
      0.32722,
      73.48667
    ],
    "Hunigondirehaa": [
      0.435,
      73.00222
    ],
    "Kaadehdhoo": [
      0.48722,
      72.99361
    ],
    "Kaafarataa": [
      0.30833,
      73.02583
    ],
    "Kaalhehuttaa - Farehu Falhuthere": [
      0.19333,
      73.21361
    ],
    "Kaalhehuttaa - Fiyoari Falhuthere": [
      0.22694,
      73.13111
    ],
    "Kaashihulhudhoo": [
      0.39528,
      73.00778
    ],
    "Kadevaareha": [
      0.42806,
      73.00361
    ],
    "Kafena": [
      0.51694,
      72.99306
    ],
    "Kalhahigillaa": [
      0.29667,
      73.03389
    ],
    "Kalhahuttaa": [
      0.325,
      73.02583
    ],
    "Kalhehamalaa": [
      0.3175,
      73.48222
    ],
    "Kalherehaa": [
      0.25361,
      73.33
    ],
    "Kanandhuvaa": [
      0.27222,
      73.06861
    ],
    "Kandahalagalaa": [
      0.225,
      73.21667
    ],
    "Kandahdhoo": [
      0.19444,
      73.19083
    ],
    "Kannigillaa": [
      0.44889,
      72.99833
    ],
    "Kelaihuttaa": [
      0.20417,
      73.17944
    ],
    "Keramihthaa": [
      0.39056,
      73.01278
    ],
    "Kodaanahutta": [
      0.3325,
      73.49778
    ],
    "Kodahutigalaa, Maahutigalaa, Maaodagalaa": [
      0.28861,
      73.20083
    ],
    "Kodedhoo": [
      0.41306,
      73.00528
    ],
    "Koderataa": [
      0.36778,
      73.02528
    ],
    "Kudhebeerahutta": [
      0.28222,
      73.06167
    ],
    "Kudhefalaa": [
      0.34278,
      73.02611
    ],
    "Kudhehaadhuvaa": [
      0.24,
      73.12111
    ],
    "Kudhehulhehdhoo": [
      0.45194,
      72.99944
    ],
    "Kudhelifadhoo": [
      0.38611,
      73.0125
    ],
    "Kudhemaaneidhoo": [
      0.25806,
      73.09917
    ],
    "Kudhemathaidhuvaa": [
      0.30583,
      73.02944
    ],
    "Kudherataa": [
      0.50056,
      72.98944
    ],
    "Kurikeymaahutta": [
      0.28917,
      73.05
    ],
    "Laihaa": [
      0.25167,
      73.34111
    ],
    "Lifadhoo": [
      0.39306,
      73.00889
    ],
    "Lonudhoo": [
      0.30833,
      73.41306
    ],
    "Maadhuva": [
      0.27028,
      73.07556
    ],
    "Maaehivakaa": [
      0.28611,
      73.05694
    ],
    "Maagalaa": [
      0.36917,
      73.37917
    ],
    "Maagonderehaa": [
      0.50639,
      72.99056
    ],
    "Maallaarehaa": [
      0.4925,
      72.98806
    ],
    "Maarehaa": [
      0.19083,
      73.20056
    ],
    "Maavaarulu": [
      0.33639,
      73.50972
    ],
    "Mathaidhuvaa": [
      0.31,
      73.02556
    ],
    "Mathihutta": [
      0.25556,
      73.34056
    ],
    "Mathikeranahuttaa": [
      0.40028,
      73.00583
    ],
    "Meehunthibenehuttaa": [
      0.26056,
      73.09611
    ],
    "Menthandhuvaa": [
      0.32444,
      73.49139
    ],
    "Meregihutaa": [
      0.26917,
      73.08111
    ],
    "Meyragillaa": [
      0.24167,
      73.1175
    ],
    "Mudhimaahutta": [
      0.25333,
      73.34722
    ],
    "Neimaahutta": [
      0.32889,
      73.02556
    ],
    "Odagallaa": [
      0.31944,
      73.38056
    ],
    "Oinigilla": [
      0.27583,
      73.06472
    ],
    "Olhimuttaa": [
      0.34056,
      73.02667
    ],
    "Olhurataa": [
      0.31306,
      73.02472
    ],
    "Raabadaafehiratta": [
      0.23556,
      73.12333
    ],
    "Rahadhuvaa": [
      0.49667,
      72.98972
    ],
    "Rondaadhuvaa": [
      0.34694,
      73.46389
    ],
    "Thelehuttaa": [
      0.28806,
      73.05278
    ],
    "Uhehuttaa": [
      0.20917,
      73.17083
    ],
    "Ukurihuttaa": [
      0.2325,
      73.12611
    ],
    "Ulegalaa": [
      0.39806,
      73.36972
    ],
    "Vaireyaadhuvaa": [
      0.28833,
      73.33722
    ],
    "Velagalaa": [
      0.3575,
      73.32
    ],
    "Veraaviligillaa": [
      0.3125,
      73.44861
    ],
    "View Details": [
      0.28139,
      73.06056
    ],
    "Vilingillaa": [
      0.22944,
      73.12944
    ],
    "Boduhuttaa": [
      0.19444,
      73.21861
    ],
    "Farukolhuhuttaa": [
      0.19583,
      73.22667
    ],
    "Fereythavilligilla": [
      0.37194,
      73.02389
    ],
    "Gazeeraa": [
      0.26667,
      73.37667
    ],
    "Havoddaa": [
      0.54,
      73.095
    ],
    "Kaashidhoo": [
      0.33472,
      73.43639
    ],
    "Kodegalaa": [
      0.36778,
      73.39139
    ],
    "Konottaa": [
      0.4625,
      73.15444
    ],
    "Lonudhoohuttaa": [
      0.30167,
      73.41667
    ],
    "Maguhdhuvaa": [
      0.27722,
      73.35667
    ],
    "Thinahuttaa": [
      0.35972,
      73.02583
    ],
    "Vatavarrehaa": [
      0.25611,
      73.29639
    ]
  },
  "fuvahmulah": {
    "Fuvahmulah": [
      -0.29556,
      73.42472
    ],
    "View Details": [
      -0.29556,
      73.42472
    ]
  },
  "addu": {
    "Feydhoo": [
      -0.68194,
      73.13528
    ],
    "Hithadhoo": [
      -0.60667,
      73.08917
    ],
    "Hulhudhoo": [
      -0.59306,
      73.22833
    ],
    "Maradhoo": [
      -0.66556,
      73.11889
    ],
    "Maradhoo-Feydhoo": [
      -0.67361,
      73.12583
    ],
    "Meedhoo": [
      -0.58333,
      73.22972
    ],
    "Bodu Hajara": [
      -0.6775,
      73.12333
    ],
    "Gaukendi": [
      -0.64917,
      73.10694
    ],
    "Hikahera": [
      -0.57972,
      73.22139
    ],
    "Kedevaahera": [
      -0.57722,
      73.2075
    ],
    "Koahera": [
      -0.58694,
      73.08833
    ],
    "Maahera": [
      -0.595,
      73.09028
    ],
    "Mulikede": [
      -0.65944,
      73.21639
    ],
    "Savaaheli": [
      -0.68083,
      73.12611
    ],
    "Ismehela Hera": [
      -0.57722,
      73.2125
    ],
    "Gan": [
      -0.69444,
      73.15528
    ]
  }
};
