/* ==========================================================================
   Espontáneos Travel — Tours & Gallery data (multilingual)
   NOTE: Prices and copy are representative placeholders for Quindío / Coffee
   Region experiences. Replace with your real tours, prices and Drive photos.
   Image keywords feed a reliable placeholder CDN; swap `img` for real files
   in assets/img/ when ready (e.g. img: "local:coffee-pijao.jpg").
   ========================================================================== */

const CATEGORIES = [
  { id: "all",         es:"Todas",        en:"All",          fr:"Toutes",        de:"Alle",          pt:"Todas" },
  { id: "cafe",        es:"Café",         en:"Coffee",       fr:"Café",          de:"Kaffee",        pt:"Café" },
  { id: "naturaleza",  es:"Naturaleza",   en:"Nature",       fr:"Nature",        de:"Natur",         pt:"Natureza" },
  { id: "cultura",     es:"Cultura",      en:"Culture",      fr:"Culture",       de:"Kultur",        pt:"Cultura" },
  { id: "aventura",    es:"Aventura",     en:"Adventure",    fr:"Aventure",      de:"Abenteuer",     pt:"Aventura" },
  { id: "comunitario", es:"Comunitario",  en:"Community",    fr:"Communautaire", de:"Gemeinschaft",  pt:"Comunitário" },
  { id: "sinbarreras", es:"Sin barreras", en:"Barrier-free", fr:"Sans barrières",de:"Barrierefrei",  pt:"Sem barreiras" }
];

const TOURS = [
  {
    id: "experiencia-cafetera",
    cat: "cafe",
    img: "coffee,plantation,colombia",
    seed: 21,
    priceFrom: 48,
    durationKey: "fullday",
    groupKey: "small",
    t: {
      es: { name:"Experiencia Cafetera de Origen", summary:"De la semilla a la taza en una finca tradicional del Paisaje Cultural Cafetero.",
        desc:"Camina entre cafetales con una familia caficultora, recolecta tu propio grano, descúbre el despulpado, el secado y la tostión artesanal, y cierra con una cata guiada de café de especialidad. Una inmersión auténtica en el oficio que hizo famosa a esta tierra, declarada Patrimonio de la Humanidad por la UNESCO.",
        includes:["Transporte desde Armenia / Salento","Guía caficultor local","Recolección y proceso del café","Cata de café de especialidad","Refrigerio campesino"] },
      en: { name:"Origin Coffee Experience", summary:"From seed to cup on a traditional farm in the Coffee Cultural Landscape.",
        desc:"Walk among coffee bushes with a growing family, pick your own cherries, discover pulping, drying and artisanal roasting, and finish with a guided specialty-coffee tasting. An authentic immersion into the craft that made this UNESCO World Heritage land famous.",
        includes:["Transport from Armenia / Salento","Local coffee-grower guide","Harvest & full coffee process","Specialty coffee cupping","Farm-style snack"] },
      fr: { name:"Expérience Café d'Origine", summary:"De la graine à la tasse dans une ferme traditionnelle du Paysage Culturel du Café.",
        desc:"Marchez parmi les caféiers avec une famille de producteurs, cueillez vos propres cerises, découvrez le dépulpage, le séchage et la torréfaction artisanale, puis terminez par une dégustation guidée de café de spécialité. Une immersion authentique dans ce patrimoine mondial de l'UNESCO.",
        includes:["Transport depuis Armenia / Salento","Guide producteur local","Récolte et processus du café","Dégustation de café de spécialité","Collation paysanne"] },
      de: { name:"Kaffee-Erlebnis am Ursprung", summary:"Vom Samen zur Tasse auf einer traditionellen Finca der Kaffee-Kulturlandschaft.",
        desc:"Wandern Sie mit einer Kaffeebauernfamilie durch die Plantagen, pflücken Sie Ihre eigenen Kirschen, erleben Sie Entpulpen, Trocknen und handwerkliches Rösten und schließen Sie mit einer geführten Spezialitätenkaffee-Verkostung ab. Ein authentisches Eintauchen in dieses UNESCO-Welterbe.",
        includes:["Transport ab Armenia / Salento","Lokaler Kaffeebauer als Guide","Ernte & gesamter Kaffeeprozess","Spezialitätenkaffee-Verkostung","Bäuerlicher Imbiss"] },
      pt: { name:"Experiência Cafeeira de Origem", summary:"Da semente à xícara numa fazenda tradicional da Paisagem Cultural Cafeeira.",
        desc:"Caminhe entre os cafezais com uma família produtora, colha seus próprios grãos, descubra o despolpamento, a secagem e a torra artesanal, e encerre com uma degustação guiada de café especial. Uma imersão autêntica neste Patrimônio Mundial da UNESCO.",
        includes:["Transporte desde Armenia / Salento","Guia cafeicultor local","Colheita e processo do café","Degustação de café especial","Lanche campesino"] }
    }
  },
  {
    id: "valle-cocora",
    cat: "naturaleza",
    img: "cocora,valley,palm,colombia",
    seed: 32,
    priceFrom: 42,
    durationKey: "fullday",
    groupKey: "small",
    t: {
      es: { name:"Valle de Cocora y Palma de Cera", summary:"Caminata entre las palmas de cera más altas del mundo, árbol nacional de Colombia.",
        desc:"Recorre senderos de niebla y verde infinito en el corazón del Parque Nacional Los Nevados. Cruza puentes colgantes, visita el bosque de niebla y contempla la majestuosa palma de cera del Quindío, que supera los 60 metros. Opción de avistamiento de colibríes y almuerzo típico.",
        includes:["Transporte ida y vuelta","Guía naturalista","Entrada a senderos","Avistamiento de colibríes","Almuerzo típico opcional"] },
      en: { name:"Cocora Valley & Wax Palms", summary:"A hike among the tallest wax palms on Earth — Colombia's national tree.",
        desc:"Follow misty trails and endless green in the heart of Los Nevados National Park. Cross hanging bridges, visit the cloud forest and marvel at the towering Quindío wax palm, over 60 metres tall. Optional hummingbird sanctuary and typical lunch.",
        includes:["Round-trip transport","Naturalist guide","Trail entrance fees","Hummingbird watching","Optional typical lunch"] },
      fr: { name:"Vallée de Cocora & Palmiers à Cire", summary:"Randonnée parmi les plus hauts palmiers à cire du monde, arbre national colombien.",
        desc:"Parcourez des sentiers brumeux au cœur du parc national Los Nevados. Traversez des ponts suspendus, visitez la forêt de nuages et admirez le majestueux palmier à cire du Quindío, qui dépasse 60 mètres. Observation de colibris et déjeuner typique en option.",
        includes:["Transport aller-retour","Guide naturaliste","Entrées des sentiers","Observation de colibris","Déjeuner typique en option"] },
      de: { name:"Cocora-Tal & Wachspalmen", summary:"Wanderung zwischen den höchsten Wachspalmen der Welt — Kolumbiens Nationalbaum.",
        desc:"Folgen Sie Nebelpfaden und endlosem Grün im Herzen des Nationalparks Los Nevados. Überqueren Sie Hängebrücken, besuchen Sie den Nebelwald und bestaunen Sie die über 60 Meter hohe Quindío-Wachspalme. Optional Kolibri-Beobachtung und typisches Mittagessen.",
        includes:["Hin- und Rücktransport","Naturkundiger Guide","Eintritt zu den Wegen","Kolibri-Beobachtung","Typisches Mittagessen optional"] },
      pt: { name:"Vale de Cocora & Palmeiras de Cera", summary:"Caminhada entre as palmeiras de cera mais altas do mundo, árvore nacional da Colômbia.",
        desc:"Percorra trilhas de névoa no coração do Parque Nacional Los Nevados. Cruze pontes suspensas, visite a floresta de neblina e admire a majestosa palmeira de cera do Quindío, com mais de 60 metros. Observação de beija-flores e almoço típico opcionais.",
        includes:["Transporte ida e volta","Guia naturalista","Entrada às trilhas","Observação de beija-flores","Almoço típico opcional"] }
    }
  },
  {
    id: "salento-filandia",
    cat: "cultura",
    img: "salento,colombia,colonial,town",
    seed: 44,
    priceFrom: 38,
    durationKey: "fullday",
    groupKey: "medium",
    t: {
      es: { name:"Salento & Filandia Coloniales", summary:"Pueblos patrimonio, balcones de colores, artesanías y miradores de ensueño.",
        desc:"Pasea por las calles empedradas de dos de los pueblos más bellos de Colombia. Fotografía las fachadas multicolores, sube al mirador de Filandia, conoce talleres de artesanos del bejuco y disfruta una trucha al ajillo típica del Quindío.",
        includes:["Transporte entre pueblos","Guía cultural","Visita a talleres artesanales","Mirador panorámico","Degustación típica"] },
      en: { name:"Colonial Salento & Filandia", summary:"Heritage towns, colourful balconies, crafts and dreamlike viewpoints.",
        desc:"Wander the cobbled streets of two of Colombia's most beautiful towns. Photograph the multicoloured façades, climb the Filandia viewpoint, meet traditional basket-weaving artisans and enjoy a classic Quindío garlic trout.",
        includes:["Transport between towns","Cultural guide","Artisan workshop visits","Panoramic viewpoint","Typical food tasting"] },
      fr: { name:"Salento & Filandia Coloniales", summary:"Villages patrimoniaux, balcons colorés, artisanat et points de vue de rêve.",
        desc:"Flânez dans les rues pavées de deux des plus beaux villages de Colombie. Photographiez les façades multicolores, montez au belvédère de Filandia, rencontrez les artisans vanniers et savourez une truite à l'ail typique du Quindío.",
        includes:["Transport entre villages","Guide culturel","Visite d'ateliers d'artisans","Belvédère panoramique","Dégustation typique"] },
      de: { name:"Koloniales Salento & Filandia", summary:"Historische Dörfer, bunte Balkone, Kunsthandwerk und traumhafte Aussichtspunkte.",
        desc:"Schlendern Sie durch die Kopfsteinpflasterstraßen zweier der schönsten Dörfer Kolumbiens. Fotografieren Sie die bunten Fassaden, steigen Sie zum Aussichtspunkt von Filandia, besuchen Sie Korbflechter und genießen Sie eine typische Knoblauch-Forelle aus Quindío.",
        includes:["Transport zwischen den Dörfern","Kulturführer","Besuch von Handwerksateliers","Panorama-Aussichtspunkt","Typische Verkostung"] },
      pt: { name:"Salento & Filandia Coloniais", summary:"Vilarejos patrimônio, sacadas coloridas, artesanato e mirantes de sonho.",
        desc:"Passeie pelas ruas de pedra de dois dos vilarejos mais belos da Colômbia. Fotografe as fachadas multicoloridas, suba ao mirante de Filandia, conheça artesãos do cestaria e saboreie uma truta ao alho típica do Quindío.",
        includes:["Transporte entre vilarejos","Guia cultural","Visita a ateliês artesanais","Mirante panorâmico","Degustação típica"] }
    }
  },
  {
    id: "caminata-paramo",
    cat: "aventura",
    img: "andes,hiking,waterfall,colombia",
    seed: 57,
    priceFrom: 65,
    durationKey: "fullday",
    groupKey: "small",
    t: {
      es: { name:"Senderismo a Cascadas y Páramo", summary:"Aventura de montaña entre cascadas, bosque andino y aire puro de altura.",
        desc:"Una caminata guiada por senderos poco transitados hasta cascadas cristalinas y zonas de páramo. Ideal para quienes buscan naturaleza intacta, fotografía y conexión real con el entorno andino, con un ritmo adaptable a tu condición física.",
        includes:["Guía de montaña certificado","Bastones y equipo básico","Snack energético y agua","Seguro de actividad","Baño en cascada (opcional)"] },
      en: { name:"Waterfalls & Páramo Trek", summary:"A mountain adventure through waterfalls, Andean forest and crisp highland air.",
        desc:"A guided hike along lesser-travelled trails to crystal-clear waterfalls and páramo moorland. Perfect for those seeking untouched nature, photography and a real connection with the Andes, at a pace adapted to your fitness.",
        includes:["Certified mountain guide","Trekking poles & basic gear","Energy snack & water","Activity insurance","Waterfall swim (optional)"] },
      fr: { name:"Randonnée Cascades & Páramo", summary:"Aventure en montagne entre cascades, forêt andine et air pur d'altitude.",
        desc:"Une randonnée guidée sur des sentiers peu fréquentés vers des cascades cristallines et le páramo. Idéale pour la nature intacte, la photographie et une vraie connexion avec les Andes, à un rythme adapté à votre condition.",
        includes:["Guide de montagne certifié","Bâtons et équipement de base","En-cas énergétique et eau","Assurance activité","Baignade en cascade (option)"] },
      de: { name:"Wasserfall- & Páramo-Trek", summary:"Bergabenteuer zwischen Wasserfällen, Andenwald und klarer Höhenluft.",
        desc:"Eine geführte Wanderung auf wenig begangenen Pfaden zu kristallklaren Wasserfällen und Páramo-Hochland. Perfekt für unberührte Natur, Fotografie und echte Verbindung mit den Anden — im Tempo Ihrer Kondition.",
        includes:["Zertifizierter Bergführer","Trekkingstöcke & Basisausrüstung","Energie-Snack & Wasser","Aktivitätsversicherung","Bad am Wasserfall (optional)"] },
      pt: { name:"Trekking a Cachoeiras & Páramo", summary:"Aventura na montanha entre cachoeiras, floresta andina e ar puro de altitude.",
        desc:"Uma caminhada guiada por trilhas pouco movimentadas até cachoeiras cristalinas e o páramo. Ideal para quem busca natureza intacta, fotografia e conexão real com os Andes, em ritmo adaptado ao seu preparo físico.",
        includes:["Guia de montanha certificado","Bastões e equipamento básico","Lanche energético e água","Seguro de atividade","Banho em cachoeira (opcional)"] }
    }
  },
  {
    id: "dia-campesino",
    cat: "comunitario",
    img: "farm,countryside,rural,colombia",
    seed: 68,
    priceFrom: 55,
    durationKey: "fullday",
    groupKey: "family",
    t: {
      es: { name:"Un Día Campesino", summary:"Vive la vida rural: ordeño, huerta, cocina de leña y tradiciones del campo.",
        desc:"Comparte la jornada con una familia campesina del Quindío: participa en el ordeño, cosecha en la huerta orgánica, aprende recetas en fogón de leña y descubre juegos y saberes tradicionales. Turismo comunitario que apoya directamente a la economía local.",
        includes:["Recibimiento con familia anfitriona","Actividades agrícolas guiadas","Clase de cocina tradicional","Almuerzo típico casero","Aporte directo a la comunidad"] },
      en: { name:"A Day as a Campesino", summary:"Live rural life: milking, the garden, wood-fire cooking and country traditions.",
        desc:"Share the day with a Quindío farming family: join the milking, harvest in the organic garden, learn recipes over a wood fire and discover traditional games and know-how. Community tourism that directly supports the local economy.",
        includes:["Welcome with host family","Guided farming activities","Traditional cooking class","Homemade typical lunch","Direct contribution to the community"] },
      fr: { name:"Une Journée de Paysan", summary:"Vivez la vie rurale : traite, potager, cuisine au feu de bois et traditions.",
        desc:"Partagez la journée avec une famille paysanne du Quindío : participez à la traite, récoltez au potager bio, apprenez des recettes au feu de bois et découvrez jeux et savoir-faire traditionnels. Un tourisme communautaire qui soutient l'économie locale.",
        includes:["Accueil par la famille hôte","Activités agricoles guidées","Cours de cuisine traditionnelle","Déjeuner typique maison","Contribution directe à la communauté"] },
      de: { name:"Ein Tag als Campesino", summary:"Erleben Sie das Landleben: Melken, Garten, Feuerküche und Traditionen.",
        desc:"Teilen Sie den Tag mit einer Bauernfamilie aus Quindío: helfen Sie beim Melken, ernten Sie im Biogarten, lernen Sie Rezepte am Holzfeuer und entdecken Sie traditionelle Spiele und Wissen. Gemeinschaftstourismus, der die lokale Wirtschaft direkt unterstützt.",
        includes:["Empfang bei der Gastfamilie","Geführte landwirtschaftliche Aktivitäten","Traditioneller Kochkurs","Hausgemachtes typisches Mittagessen","Direkter Beitrag zur Gemeinschaft"] },
      pt: { name:"Um Dia de Camponês", summary:"Viva a vida rural: ordenha, horta, fogão a lenha e tradições do campo.",
        desc:"Compartilhe o dia com uma família camponesa do Quindío: participe da ordenha, colha na horta orgânica, aprenda receitas no fogão a lenha e descubra jogos e saberes tradicionais. Turismo comunitário que apoia diretamente a economia local.",
        includes:["Recepção com família anfitriã","Atividades agrícolas guiadas","Aula de cozinha tradicional","Almoço típico caseiro","Contribuição direta à comunidade"] }
    }
  },
  {
    id: "turismo-sin-barreras",
    cat: "sinbarreras",
    img: "accessible,nature,path,inclusion",
    seed: 79,
    priceFrom: 50,
    durationKey: "fullday",
    groupKey: "accessible",
    t: {
      es: { name:"Paisaje Cafetero Sin Barreras", summary:"Una experiencia accesible y segura del Paisaje Cultural Cafetero para todas las personas.",
        desc:"Creemos en un turismo sin barreras. Diseñamos esta experiencia con rutas accesibles, apoyo especializado y ritmos flexibles para que personas con movilidad reducida o condiciones particulares disfruten del campo cafetero con autonomía, seguridad y dignidad. Incluye adaptaciones según tus necesidades.",
        includes:["Rutas y accesos adaptados","Transporte accesible","Acompañamiento especializado","Ritmos y paradas flexibles","Planeación según tus necesidades"] },
      en: { name:"Barrier-Free Coffee Landscape", summary:"An accessible, safe experience of the Coffee Cultural Landscape for everyone.",
        desc:"We believe in tourism without barriers. This experience is designed with accessible routes, specialised support and flexible pacing so that people with reduced mobility or particular needs can enjoy the coffee countryside with autonomy, safety and dignity. Adaptations arranged to suit you.",
        includes:["Adapted routes & access","Accessible transport","Specialised assistance","Flexible pace & stops","Planning around your needs"] },
      fr: { name:"Paysage du Café Sans Barrières", summary:"Une expérience accessible et sûre du Paysage Culturel du Café pour tous.",
        desc:"Nous croyons en un tourisme sans barrières. Cette expérience est conçue avec des itinéraires accessibles, un accompagnement spécialisé et un rythme flexible pour que les personnes à mobilité réduite profitent de la campagne caféière en autonomie, sécurité et dignité. Adaptations selon vos besoins.",
        includes:["Itinéraires et accès adaptés","Transport accessible","Accompagnement spécialisé","Rythme et arrêts flexibles","Organisation selon vos besoins"] },
      de: { name:"Barrierefreie Kaffeelandschaft", summary:"Ein barrierefreies, sicheres Erlebnis der Kaffee-Kulturlandschaft für alle.",
        desc:"Wir glauben an Tourismus ohne Barrieren. Dieses Erlebnis bietet barrierefreie Wege, spezialisierte Begleitung und flexibles Tempo, damit Menschen mit eingeschränkter Mobilität die Kaffeelandschaft selbstbestimmt, sicher und würdevoll genießen. Anpassungen nach Ihren Bedürfnissen.",
        includes:["Angepasste Wege & Zugänge","Barrierefreier Transport","Spezialisierte Begleitung","Flexibles Tempo & Pausen","Planung nach Ihren Bedürfnissen"] },
      pt: { name:"Paisagem Cafeeira Sem Barreiras", summary:"Uma experiência acessível e segura da Paisagem Cultural Cafeeira para todos.",
        desc:"Acreditamos no turismo sem barreiras. Esta experiência é desenhada com rotas acessíveis, apoio especializado e ritmo flexível para que pessoas com mobilidade reduzida aproveitem o campo cafeeiro com autonomia, segurança e dignidade. Adaptações conforme suas necessidades.",
        includes:["Rotas e acessos adaptados","Transporte acessível","Acompanhamento especializado","Ritmo e paradas flexíveis","Planejamento conforme suas necessidades"] }
    }
  },
  {
    id: "avistamiento-aves",
    cat: "naturaleza",
    img: "hummingbird,birdwatching,colombia,forest",
    seed: 83,
    priceFrom: 72,
    durationKey: "fullday",
    groupKey: "small",
    t: {
      es: { name:"Avistamiento de Aves del Quindío", summary:"Colombia, el país con más especies de aves del mundo, en su mejor expresión.",
        desc:"Madruga con guías especializados hacia reservas y bosques donde habitan tucanes, barranqueros, tángaras y decenas de colibríes. Una experiencia privilegiada para fotógrafos y amantes de la naturaleza en el país #1 en biodiversidad de aves.",
        includes:["Guía ornitólogo","Préstamo de binoculares","Transporte a reservas","Lista de especies","Desayuno y refrigerio"] },
      en: { name:"Quindío Birdwatching", summary:"Colombia — the world's #1 country for bird species — at its very best.",
        desc:"Rise early with specialised guides toward reserves and forests home to toucans, motmots, tanagers and dozens of hummingbirds. A privileged experience for photographers and nature lovers in the planet's richest country for birdlife.",
        includes:["Ornithologist guide","Binoculars provided","Transport to reserves","Species checklist","Breakfast & snack"] },
      fr: { name:"Observation des Oiseaux du Quindío", summary:"La Colombie, pays n°1 mondial pour les espèces d'oiseaux, à son meilleur.",
        desc:"Levez-vous tôt avec des guides spécialisés vers des réserves abritant toucans, motmots, tangaras et des dizaines de colibris. Une expérience privilégiée pour photographes et amoureux de la nature dans le pays le plus riche en oiseaux.",
        includes:["Guide ornithologue","Jumelles fournies","Transport vers les réserves","Liste d'espèces","Petit-déjeuner et collation"] },
      de: { name:"Vogelbeobachtung in Quindío", summary:"Kolumbien — das artenreichste Vogelland der Welt — von seiner besten Seite.",
        desc:"Starten Sie früh mit Spezialguides zu Reservaten und Wäldern voller Tukane, Motmots, Tangaren und Dutzender Kolibris. Ein besonderes Erlebnis für Fotografen und Naturliebhaber im vogelreichsten Land der Erde.",
        includes:["Ornithologischer Guide","Ferngläser gestellt","Transport zu den Reservaten","Artenliste","Frühstück & Snack"] },
      pt: { name:"Observação de Aves do Quindío", summary:"A Colômbia, país nº 1 em espécies de aves do mundo, no seu melhor.",
        desc:"Acorde cedo com guias especializados rumo a reservas e florestas de tucanos, udus, saíras e dezenas de beija-flores. Uma experiência privilegiada para fotógrafos e amantes da natureza no país mais rico em aves do planeta.",
        includes:["Guia ornitólogo","Binóculos fornecidos","Transporte às reservas","Lista de espécies","Café da manhã e lanche"] }
    }
  },
  {
    id: "ruta-panela",
    cat: "cultura",
    img: "sugarcane,panela,trapiche,colombia",
    seed: 94,
    priceFrom: 40,
    durationKey: "halfday",
    groupKey: "family",
    t: {
      es: { name:"Ruta de la Panela y el Trapiche", summary:"El dulce arte de la caña: del corte al trapiche tradicional de arriería.",
        desc:"Conoce un trapiche tradicional donde la caña de azúcar se transforma en panela como hace generaciones. Participa en el proceso, prueba el guarapo recién exprimido y la melcocha caliente, y conoce una tradición dulce que define la cultura campesina colombiana.",
        includes:["Visita a trapiche tradicional","Participación en el proceso","Degustación de guarapo y melcocha","Guía local","Transporte local"] },
      en: { name:"Panela & Sugar-Mill Route", summary:"The sweet craft of cane — from cutting to the traditional sugar mill.",
        desc:"Visit a traditional 'trapiche' where sugar cane becomes panela just as it has for generations. Join the process, taste freshly pressed cane juice and warm taffy, and discover a sweet tradition at the heart of Colombian rural culture.",
        includes:["Traditional sugar-mill visit","Hands-on in the process","Cane juice & taffy tasting","Local guide","Local transport"] },
      fr: { name:"Route de la Panela & du Moulin", summary:"L'art sucré de la canne : de la coupe au moulin traditionnel.",
        desc:"Découvrez un « trapiche » traditionnel où la canne à sucre devient panela comme depuis des générations. Participez au processus, goûtez le jus de canne fraîchement pressé et la pâte sucrée chaude, une tradition au cœur de la culture rurale colombienne.",
        includes:["Visite d'un moulin traditionnel","Participation au processus","Dégustation de jus de canne","Guide local","Transport local"] },
      de: { name:"Panela- & Zuckermühlen-Route", summary:"Die süße Kunst des Zuckerrohrs — vom Schnitt zur traditionellen Mühle.",
        desc:"Besuchen Sie einen traditionellen «Trapiche», wo Zuckerrohr seit Generationen zu Panela wird. Machen Sie mit, probieren Sie frisch gepressten Zuckerrohrsaft und warme Karamellmasse und entdecken Sie eine süße Tradition der kolumbianischen Landkultur.",
        includes:["Besuch einer traditionellen Mühle","Mitmachen im Prozess","Verkostung von Saft & Karamell","Lokaler Guide","Lokaler Transport"] },
      pt: { name:"Rota da Rapadura e do Engenho", summary:"A doce arte da cana: do corte ao engenho tradicional.",
        desc:"Conheça um 'trapiche' tradicional onde a cana vira rapadura como há gerações. Participe do processo, prove o caldo de cana fresco e a melcocha quente, e descubra uma doce tradição no coração da cultura rural colombiana.",
        includes:["Visita a engenho tradicional","Participação no processo","Degustação de caldo e melcocha","Guia local","Transporte local"] }
    }
  },
  {
    id: "eje-cafetero-3dias",
    cat: "aventura",
    img: "colombia,coffee,landscape,mountains",
    seed: 105,
    priceFrom: 390,
    durationKey: "threedays",
    groupKey: "small",
    t: {
      es: { name:"Gran Eje Cafetero · 3 Días", summary:"El itinerario completo: café, Cocora, pueblos patrimonio y naturaleza.",
        desc:"Tres días para vivir lo mejor de la región: finca cafetera de origen, Valle de Cocora, Salento y Filandia, avistamiento de aves y una noche de turismo comunitario. Alojamiento cálido, gastronomía local y guianza experta en un viaje diseñado para recordar.",
        includes:["2 noches de alojamiento","Todas las experiencias del itinerario","Transporte durante todo el tour","Guía acompañante","Desayunos y almuerzos típicos"] },
      en: { name:"Grand Coffee Region · 3 Days", summary:"The full journey: coffee, Cocora, heritage towns and nature.",
        desc:"Three days to live the best of the region: an origin coffee farm, Cocora Valley, Salento and Filandia, birdwatching and a night of community tourism. Warm lodging, local cuisine and expert guiding in a trip designed to be remembered.",
        includes:["2 nights' accommodation","All experiences in the itinerary","Transport throughout the tour","Accompanying guide","Typical breakfasts & lunches"] },
      fr: { name:"Grand Axe du Café · 3 Jours", summary:"Le circuit complet : café, Cocora, villages patrimoniaux et nature.",
        desc:"Trois jours pour vivre le meilleur de la région : ferme de café d'origine, vallée de Cocora, Salento et Filandia, observation des oiseaux et une nuit de tourisme communautaire. Hébergement chaleureux, cuisine locale et guidage expert.",
        includes:["2 nuits d'hébergement","Toutes les expériences du circuit","Transport pendant tout le tour","Guide accompagnateur","Petits-déjeuners et déjeuners typiques"] },
      de: { name:"Große Kaffeeregion · 3 Tage", summary:"Die komplette Reise: Kaffee, Cocora, historische Dörfer und Natur.",
        desc:"Drei Tage, um das Beste der Region zu erleben: Ursprungs-Kaffeefinca, Cocora-Tal, Salento und Filandia, Vogelbeobachtung und eine Nacht Gemeinschaftstourismus. Herzliche Unterkunft, lokale Küche und fachkundige Führung.",
        includes:["2 Übernachtungen","Alle Erlebnisse des Programms","Transport während der gesamten Tour","Begleitender Guide","Typische Frühstücke & Mittagessen"] },
      pt: { name:"Grande Eixo Cafeeiro · 3 Dias", summary:"O roteiro completo: café, Cocora, vilarejos patrimônio e natureza.",
        desc:"Três dias para viver o melhor da região: fazenda de café de origem, Vale de Cocora, Salento e Filandia, observação de aves e uma noite de turismo comunitário. Hospedagem acolhedora, gastronomia local e guia especializado.",
        includes:["2 noites de hospedagem","Todas as experiências do roteiro","Transporte durante todo o tour","Guia acompanhante","Cafés da manhã e almoços típicos"] }
    }
  }
];

const GALLERY = [
  { img:"cocora,palm,colombia",        seed:201, k:"g_cocora" },
  { img:"coffee,beans,roasting",       seed:202, k:"g_coffee" },
  { img:"salento,colombia,street",     seed:203, k:"g_salento" },
  { img:"hummingbird,colombia",        seed:204, k:"g_bird" },
  { img:"waterfall,andes,forest",      seed:205, k:"g_waterfall" },
  { img:"colombia,countryside,farm",   seed:206, k:"g_farm" },
  { img:"jeep,willys,coffee,colombia", seed:207, k:"g_jeep" },
  { img:"andes,mountains,sunset",      seed:208, k:"g_sunset" },
  { img:"colombian,food,trout",        seed:209, k:"g_food" },
  { img:"filandia,viewpoint,colombia", seed:210, k:"g_viewpoint" },
  { img:"horseback,riding,nature",     seed:211, k:"g_horse" },
  { img:"coffee,farmer,harvest",       seed:212, k:"g_farmer" }
];

const GALLERY_CAPS = {
  g_cocora:   { es:"Valle de Cocora", en:"Cocora Valley", fr:"Vallée de Cocora", de:"Cocora-Tal", pt:"Vale de Cocora" },
  g_coffee:   { es:"Café de origen", en:"Origin coffee", fr:"Café d'origine", de:"Ursprungskaffee", pt:"Café de origem" },
  g_salento:  { es:"Calles de Salento", en:"Streets of Salento", fr:"Rues de Salento", de:"Straßen von Salento", pt:"Ruas de Salento" },
  g_bird:     { es:"Colibríes", en:"Hummingbirds", fr:"Colibris", de:"Kolibris", pt:"Beija-flores" },
  g_waterfall:{ es:"Cascadas andinas", en:"Andean waterfalls", fr:"Cascades andines", de:"Anden-Wasserfälle", pt:"Cachoeiras andinas" },
  g_farm:     { es:"Vida campesina", en:"Country life", fr:"Vie paysanne", de:"Landleben", pt:"Vida camponesa" },
  g_jeep:     { es:"Jeep Willys cafetero", en:"Coffee Willys jeep", fr:"Jeep Willys du café", de:"Kaffee-Willys-Jeep", pt:"Jeep Willys cafeeiro" },
  g_sunset:   { es:"Atardecer andino", en:"Andean sunset", fr:"Coucher de soleil andin", de:"Anden-Sonnenuntergang", pt:"Pôr do sol andino" },
  g_food:     { es:"Gastronomía típica", en:"Typical cuisine", fr:"Cuisine typique", de:"Typische Küche", pt:"Gastronomia típica" },
  g_viewpoint:{ es:"Mirador de Filandia", en:"Filandia viewpoint", fr:"Belvédère de Filandia", de:"Aussichtspunkt Filandia", pt:"Mirante de Filandia" },
  g_horse:    { es:"Cabalgatas", en:"Horseback rides", fr:"Balades à cheval", de:"Reitausflüge", pt:"Cavalgadas" },
  g_farmer:   { es:"Manos caficultoras", en:"Coffee-grower hands", fr:"Mains de producteurs", de:"Kaffeebauern-Hände", pt:"Mãos cafeicultoras" }
};
