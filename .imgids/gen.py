# -*- coding: utf-8 -*-
import json, io, os
HERE = os.path.dirname(__file__)
OUT  = os.path.join(HERE, "..", "js", "data.js")

# merge all image-id maps
imgs = {}
for fn in ["rurales","naturaleza","bienestar","tradicional_metro","aventura_parques","incentivos","finca"]:
    d = json.load(open(os.path.join(HERE, fn+".json"), encoding="utf-8"))
    for k,v in d.items():
        imgs[k] = v

CATS = [
    ("all",          "Todas","All","Toutes","Alle","Todas"),
    ("tradicionales","Clásicos","Classic","Classiques","Klassiker","Clássicos"),
    ("naturaleza",   "Naturaleza","Nature","Nature","Natur","Natureza"),
    ("rurales",      "Rurales","Rural","Rurales","Ländlich","Rurais"),
    ("bienestar",    "Bienestar","Wellness","Bien-être","Wellness","Bem-estar"),
    ("aventura",     "Aventura","Adventure","Aventure","Abenteuer","Aventura"),
    ("parques",      "Parques","Theme Parks","Parcs","Freizeitparks","Parques"),
    ("metropolitano","Ciudades","Cities","Villes","Städte","Cidades"),
    ("incentivos",   "Alto Valor","Premium","Premium","Premium","Alto Valor"),
]

# tour: (id, cat, name, es_summary, en_summary, imgkey, fallback_kw)
T = [
 # --- Tradicionales ---
 ("finca","tradicionales","Finca Cafetera · Tour del Café",
  "De la semilla a la taza en una finca tradicional, con cata de café de origen.",
  "From seed to cup on a traditional farm, with an origin coffee tasting.","finca","coffee,farm,colombia"),
 ("cocorasalento","tradicionales","Valle de Cocora y Salento",
  "Las palmas de cera más altas del mundo y el pueblo más colorido del Quindío.",
  "The world's tallest wax palms and the most colourful town in Quindío.","cocorasalento","cocora,salento,colombia"),
 ("fulldayfcs","tradicionales","Full Day: Filandia, Cocora y Salento",
  "Lo mejor del Quindío en un día: Filandia, Valle de Cocora y Salento.",
  "The best of Quindío in one day: Filandia, Cocora Valley and Salento.","fulldayfcs","filandia,colombia,valley"),
 ("filandia","tradicionales","Tour Filandia",
  "El pueblo patrimonio, su mirador y los maestros del tejido en bejuco.",
  "The heritage town, its viewpoint and the master basket-weavers.","filandia","filandia,colombia,colonial"),
 ("cordillera","tradicionales","Fullday Cordillera: Córdoba, Pijao y Buenavista",
  "Ruta por tres pueblos cordilleranos y un mirador de café inolvidable.",
  "Three mountain towns and an unforgettable coffee viewpoint.","cordillera","pijao,colombia,mountains"),
 ("compartidocs","tradicionales","Tour Compartido: Cocora y Salento",
  "Tour en grupo compartido al Valle de Cocora y Salento, cómodo y económico.",
  "A shared group tour to Cocora Valley and Salento, comfortable and affordable.","compartidocs","cocora,palm,colombia"),
 # --- Naturaleza ---
 ("cocoraacaime","naturaleza","Valle de Cocora · Acaime, Casa de los Colibríes",
  "Trek al Valle de Cocora y Acaime, refugio de colibríes entre palmas gigantes.",
  "Trek to Cocora Valley and Acaime, a hummingbird refuge among giant palms.","cocoraacaime","cocora,hummingbird,colombia"),
 ("aves","naturaleza","Avistamiento de Aves",
  "Colombia, #1 del mundo en aves: tucanes, tángaras y decenas de colibríes.",
  "Colombia, world #1 for birds: toucans, tanagers and dozens of hummingbirds.","aves","hummingbird,birdwatching,colombia"),
 ("palmacera","naturaleza","Palma de Cera en Bosque Altoandino",
  "Camina entre palmas de cera, el árbol nacional, en el bosque de niebla.",
  "Walk among wax palms, the national tree, in the high-Andean cloud forest.","palmacera","wax,palm,colombia,forest"),
 ("orquideas","naturaleza","Un Mundo de Orquídeas",
  "Recorre jardines y bosques tras las orquídeas más bellas del trópico.",
  "Explore gardens and forests in search of the tropics' most beautiful orchids.","orquideas","orchid,flower,colombia"),
 ("ranas","naturaleza","Ranas y Anfibios · Nocturno",
  "Experiencia nocturna guiada para descubrir ranas y anfibios del bosque húmedo.",
  "A guided night experience discovering frogs and amphibians of the rainforest.","ranas","frog,amphibian,rainforest"),
 ("trekreservas","naturaleza","Trek en Reservas Naturales",
  "Senderismo por reservas naturales privadas, biodiversidad y paisajes intactos.",
  "Hiking through private nature reserves, biodiversity and untouched landscapes.","trekreservas","andes,hiking,forest,colombia"),
 ("cocoraacaime2","naturaleza","La Carbonera · Santuario de la Palma de Cera",
  "El bosque de palma de cera más grande del mundo, un santuario natural único.",
  "The world's largest wax-palm forest, a unique natural sanctuary.","carbonera","wax,palm,forest,colombia"),
 ("paramo","naturaleza","Senderismo en el Páramo",
  "Asciende a un ecosistema único, el páramo andino, fábrica de agua de los Andes.",
  "Climb to a unique ecosystem, the Andean páramo, water factory of the Andes.","paramo","paramo,andes,colombia"),
 # --- Rurales ---
 ("campesino","rurales","Campesino por un Día",
  "Vive la jornada rural: ordeño, huerta, fogón de leña y tradiciones del campo.",
  "Live rural life: milking, the garden, wood-fire cooking and country traditions.","campesino","farm,countryside,colombia"),
 ("cacao","rurales","Tour de Cacao",
  "Del grano a la barra: cultivo, cosecha y chocolate artesanal con familias cacaoteras.",
  "From bean to bar: growing, harvest and artisanal chocolate with cacao families.","cacao","cacao,chocolate,colombia"),
 ("cana","rurales","Tour de Caña y Trapiche",
  "El dulce arte de la caña: del corte al trapiche tradicional y la panela.",
  "The sweet craft of cane: from cutting to the traditional mill and panela.","cana","sugarcane,trapiche,colombia"),
 ("abejas","rurales","Tour de Abejas",
  "El mundo de las abejas, la miel y la polinización en manos de apicultores locales.",
  "The world of bees, honey and pollination with local beekeepers.","abejas","bees,honey,beekeeping"),
 ("frutas","rurales","Tour de las Frutas",
  "Descubre y degusta las frutas exóticas del trópico colombiano directo de la huerta.",
  "Discover and taste the exotic fruits of tropical Colombia straight from the orchard.","frutas","tropical,fruit,colombia"),
 ("platano","rurales","Tour del Plátano",
  "Conoce un cultivo insignia del campo: siembra, cosecha y cocina del plátano.",
  "Meet a signature crop: planting, harvest and cooking with plantain.","platano","plantain,farm,colombia"),
 # --- Bienestar ---
 ("termales","bienestar","Aguas Termales",
  "Relájate en aguas termales (Santa Rosa, San Vicente, El Otoño o Tierra Viva).",
  "Relax in hot springs (Santa Rosa, San Vicente, El Otoño or Tierra Viva).","termales","hot,springs,thermal,nature"),
 ("conexion","bienestar","Conexión Total: Bienestar y Energía",
  "Un día para reconectar: naturaleza, movimiento y energía renovada.",
  "A day to reconnect: nature, movement and renewed energy.","conexion","wellness,nature,meditation"),
 ("yoga","bienestar","Sesión de Yoga Personalizada",
  "Yoga a tu medida en entornos naturales del Paisaje Cafetero.",
  "Tailored yoga in the natural settings of the Coffee Landscape.","yoga","yoga,nature,wellness"),
 ("senderovida","bienestar","Sendero de la Vida · Conexión Interior",
  "Caminata consciente por senderos de bosque para el bienestar y la introspección.",
  "A mindful walk along forest trails for wellbeing and introspection.","senderovida","forest,trail,mindfulness"),
 ("equino","bienestar","Equinoterapia · Coach Asistido",
  "Bienestar y autoconocimiento guiados con el acompañamiento de caballos.",
  "Wellbeing and self-discovery guided with the support of horses.","equino","horse,therapy,nature"),
 ("rituales","bienestar","Rituales de Bienestar Holístico",
  "Rituales holísticos para equilibrar cuerpo, mente y espíritu.",
  "Holistic rituals to balance body, mind and spirit.","rituales","wellness,ritual,candles"),
 ("respiracion","bienestar","Respiración Consciente e Inmersión en Hielo",
  "Técnicas de respiración e inmersión en frío para vitalidad y resiliencia.",
  "Breathwork and cold immersion for vitality and resilience.","respiracion","ice,bath,breathing,wellness"),
 # --- Aventura ---
 ("parapente","aventura","Parapente",
  "Vuela en parapente y contempla el Paisaje Cafetero desde el cielo.",
  "Soar by paraglider and admire the Coffee Landscape from the sky.","parapente","paragliding,mountains,colombia"),
 ("cabalgatamaria","aventura","Cabalgata Río y Montaña · La María",
  "Cabalgata entre río y montaña por paisajes del Quindío rural.",
  "A horseback ride between river and mountain through rural Quindío.","cabalgatamaria","horseback,river,mountain"),
 ("cabalgatadeluxe","aventura","Cabalgata Deluxe en la Cordillera",
  "Cabalgata premium por la cordillera, con paisajes de altura y detalles especiales.",
  "A premium mountain ride with high-altitude scenery and special touches.","cabalgatadeluxe","horse,mountain,andes"),
 ("paratrike","aventura","Paratrike",
  "Vuelo en paratrike, la aventura aérea motorizada para todos.",
  "A paratrike flight, motorised aerial adventure for everyone.","paratrike","paramotor,flight,sky"),
 # --- Parques ---
 ("parquecafe","parques","Parque del Café",
  "El parque temático insignia del Eje Cafetero: cultura, atracciones y café.",
  "The Coffee Region's flagship theme park: culture, rides and coffee.","parquecafe","amusement,park,coffee,colombia"),
 ("panaca","parques","Panaca",
  "El parque de naturaleza y agropecuaria más grande: animales y shows.",
  "The largest agricultural nature park: animals and live shows.","panaca","farm,animals,park"),
 ("recuca","parques","Recuca",
  "Vive la cultura cafetera de forma interactiva: vístete y recolecta café.",
  "Live coffee culture interactively: dress up and harvest coffee.","recuca","coffee,culture,colombia"),
 ("ukumari","parques","Bioparque Ukumarí",
  "Uno de los bioparques más modernos de Latinoamérica, fauna de varios continentes.",
  "One of Latin America's most modern bio-parks, wildlife from several continents.","ukumari","zoo,wildlife,park"),
 ("arrieros","parques","Parque de los Arrieros",
  "Tradición arriera, humor y cultura paisa en un parque temático único.",
  "Muleteer tradition, humour and 'paisa' culture in a unique theme park.","arrieros","colombia,culture,park,horse"),
 ("botanico","parques","Jardín Botánico del Quindío",
  "Mariposario y bosque: biodiversidad del Quindío en un jardín vivo.",
  "Butterfly house and forest: Quindío's biodiversity in a living garden.","botanico","butterfly,botanical,garden"),
 ("laberinto","parques","Laberinto Mil Caminos",
  "Diversión en familia en un gran laberinto verde de mil caminos.",
  "Family fun in a great green maze of a thousand paths.","laberinto","maze,green,garden"),
 # --- Metropolitano ---
 ("armenia","metropolitano","City Tour Armenia",
  "Recorre la capital del Quindío: historia, parques y cultura cuyabra.",
  "Explore Quindío's capital: history, parks and local culture.","armenia","armenia,colombia,city"),
 ("cuyabro","metropolitano","Arte Cuyabro y Café de Origen · Armenia",
  "Arte local y café de origen en un recorrido urbano con sabor cuyabro.",
  "Local art and origin coffee on an urban tour with authentic flavour.","cuyabro","street,art,coffee,city"),
 ("cartago","metropolitano","Cartago · Los Mejores Bordados",
  "Turismo comunitario en Cartago, cuna de los mejores bordados de Colombia.",
  "Community tourism in Cartago, home of Colombia's finest embroidery.","cartago","embroidery,handcraft,colombia"),
 ("pereira","metropolitano","City Tour Pereira",
  "Descubre la 'Perla del Otún': miradores, cultura y vida urbana cafetera.",
  "Discover the 'Pearl of the Otún': viewpoints, culture and coffee-city life.","pereira","pereira,colombia,city"),
 ("manizales","metropolitano","City Tour Manizales",
  "Catedral, teleférico y arquitectura de montaña de la ciudad de puertas abiertas.",
  "Cathedral, cable car and mountain architecture of this welcoming city.","manizales","manizales,colombia,city"),
 # --- Incentivos / Alto valor ---
 ("catacafe","incentivos","Cata de Café Especial",
  "Cata profesional de cafés especiales con un barista experto.",
  "A professional specialty-coffee cupping with an expert barista.","catacafe","coffee,cupping,barista"),
 ("gastronomica","incentivos","Colombia en un Plato",
  "Experiencia gastronómica que recorre los sabores de Colombia.",
  "A culinary experience through the flavours of Colombia.","gastronomica","colombian,food,gastronomy"),
 ("cajaviajera","incentivos","La Caja Viajera del Café",
  "Experiencia sensorial e itinerante alrededor del café de origen.",
  "A sensory, traveling experience around origin coffee.","cajaviajera","coffee,tasting,experience"),
 ("cataquesos","incentivos","Cata de Quesos Madurados de Origen",
  "Degustación guiada de quesos madurados de origen colombiano.",
  "A guided tasting of Colombian origin matured cheeses.","cataquesos","cheese,tasting,gourmet"),
 ("catacocteles","incentivos","Cata de Cócteles de Autor",
  "Mixología de autor con destilados e insumos locales.",
  "Signature mixology with local spirits and ingredients.","catacocteles","cocktail,mixology,bar"),
 ("greenteam","incentivos","Green Team Retreat",
  "Retiro corporativo sostenible: naturaleza, equipo y propósito.",
  "A sustainable corporate retreat: nature, team and purpose.","greenteam","team,retreat,nature"),
 ("artesanos","incentivos","Experiencia con Artesanos Locales",
  "Encuentro con artesanos locales y sus oficios tradicionales.",
  "Meet local artisans and their traditional crafts.","artesanos","artisan,handcraft,colombia"),
 ("siembra","incentivos","Dejando Huella · Siembra de Árboles",
  "Siembra árboles en reserva natural y deja una huella positiva.",
  "Plant trees in a nature reserve and leave a positive mark.","siembra","tree,planting,reforestation"),
 ("tallerrespiracion","incentivos","Taller de Respiración Consciente",
  "Taller guiado de respiración consciente para grupos y equipos.",
  "A guided conscious-breathing workshop for groups and teams.","tallerrespiracion","breathing,workshop,wellness"),
 ("rodizio","incentivos","Rodizio Gaucho Brasil",
  "Experiencia gastronómica estilo rodizio gaucho brasileño.",
  "A Brazilian gaucho-style rodizio dining experience.","rodizio","barbecue,meat,dining"),
 ("alimentacion","incentivos","Alimentación Consciente",
  "Una experiencia de alimentación consciente y saludable.",
  "A mindful, healthy eating experience.","alimentacion","healthy,food,mindful"),
]

# FR / DE / PT summaries per tour id
TR = {
 "finca":("De la graine à la tasse dans une ferme traditionnelle, avec dégustation de café d'origine.","Vom Samen zur Tasse auf einer traditionellen Finca, mit Verkostung von Ursprungskaffee.","Da semente à xícara numa fazenda tradicional, com degustação de café de origem."),
 "cocorasalento":("Les plus hauts palmiers à cire du monde et le village le plus coloré du Quindío.","Die höchsten Wachspalmen der Welt und das bunteste Dorf Quindíos.","As palmeiras de cera mais altas do mundo e o vilarejo mais colorido do Quindío."),
 "fulldayfcs":("Le meilleur du Quindío en une journée : Filandia, vallée de Cocora et Salento.","Das Beste von Quindío an einem Tag: Filandia, Cocora-Tal und Salento.","O melhor do Quindío em um dia: Filandia, Vale de Cocora e Salento."),
 "filandia":("Le village patrimonial, son belvédère et les maîtres vanniers.","Das historische Dorf, sein Aussichtspunkt und die Korbflechtmeister.","O vilarejo patrimônio, seu mirante e os mestres da cestaria."),
 "cordillera":("Trois villages de montagne et un belvédère de café inoubliable.","Drei Bergdörfer und ein unvergesslicher Kaffee-Aussichtspunkt.","Três vilarejos da cordilheira e um mirante de café inesquecível."),
 "compartidocs":("Tour en groupe partagé vers la vallée de Cocora et Salento, confortable et économique.","Geteilte Gruppentour ins Cocora-Tal und nach Salento, komfortabel und günstig.","Tour em grupo compartilhado ao Vale de Cocora e Salento, confortável e econômico."),
 "cocoraacaime":("Trek dans la vallée de Cocora et Acaime, refuge de colibris parmi les palmiers géants.","Trek ins Cocora-Tal und nach Acaime, Kolibri-Refugium zwischen Riesenpalmen.","Trek ao Vale de Cocora e Acaime, refúgio de beija-flores entre palmeiras gigantes."),
 "aves":("La Colombie, n°1 mondial des oiseaux : toucans, tangaras et des dizaines de colibris.","Kolumbien, Nr. 1 der Vogelwelt: Tukane, Tangaren und Dutzende Kolibris.","A Colômbia, nº 1 do mundo em aves: tucanos, saíras e dezenas de beija-flores."),
 "palmacera":("Marchez parmi les palmiers à cire, arbre national, dans la forêt de nuages andine.","Wandern Sie zwischen Wachspalmen, dem Nationalbaum, im Anden-Nebelwald.","Caminhe entre palmeiras de cera, a árvore nacional, na floresta de névoa andina."),
 "orquideas":("Parcourez jardins et forêts à la recherche des plus belles orchidées du tropique.","Entdecken Sie Gärten und Wälder auf der Suche nach den schönsten Orchideen der Tropen.","Percorra jardins e florestas atrás das orquídeas mais belas do trópico."),
 "ranas":("Expérience nocturne guidée pour découvrir grenouilles et amphibiens de la forêt humide.","Geführtes Nacht-Erlebnis zu Fröschen und Amphibien des Regenwaldes.","Experiência noturna guiada para descobrir rãs e anfíbios da mata úmida."),
 "trekreservas":("Randonnée dans des réserves naturelles privées, biodiversité et paysages intacts.","Wanderung durch private Naturreservate, Biodiversität und unberührte Landschaften.","Caminhada por reservas naturais privadas, biodiversidade e paisagens intactas."),
 "cocoraacaime2":("La plus grande forêt de palmiers à cire du monde, un sanctuaire naturel unique.","Der größte Wachspalmenwald der Welt, ein einzigartiges Naturheiligtum.","A maior floresta de palmeiras de cera do mundo, um santuário natural único."),
 "paramo":("Montez vers un écosystème unique, le páramo andin, château d'eau des Andes.","Aufstieg zum einzigartigen Páramo, dem Wasserspeicher der Anden.","Suba a um ecossistema único, o páramo andino, fábrica de água dos Andes."),
 "campesino":("Vivez la journée rurale : traite, potager, feu de bois et traditions paysannes.","Erleben Sie den Landtag: Melken, Garten, Holzfeuer und bäuerliche Traditionen.","Viva o dia rural: ordenha, horta, fogão a lenha e tradições camponesas."),
 "cacao":("De la fève à la tablette : culture, récolte et chocolat artisanal avec les familles.","Von der Bohne zur Tafel: Anbau, Ernte und handwerkliche Schokolade mit Familien.","Do grão à barra: cultivo, colheita e chocolate artesanal com as famílias."),
 "cana":("L'art sucré de la canne : de la coupe au moulin traditionnel et à la panela.","Die süße Kunst des Zuckerrohrs: vom Schnitt zur Mühle und zur Panela.","A doce arte da cana: do corte ao engenho tradicional e à rapadura."),
 "abejas":("Le monde des abeilles, du miel et de la pollinisation avec des apiculteurs locaux.","Die Welt der Bienen, des Honigs und der Bestäubung mit lokalen Imkern.","O mundo das abelhas, do mel e da polinização com apicultores locais."),
 "frutas":("Découvrez et dégustez les fruits exotiques du tropique colombien, du verger à l'assiette.","Entdecken und probieren Sie die exotischen Früchte der kolumbianischen Tropen, direkt vom Garten.","Descubra e deguste as frutas exóticas do trópico colombiano direto do pomar."),
 "platano":("Découvrez une culture emblématique : semis, récolte et cuisine de la banane plantain.","Lernen Sie eine typische Kulturpflanze kennen: Anbau, Ernte und Kochen mit Kochbanane.","Conheça um cultivo emblemático: plantio, colheita e cozinha da banana-da-terra."),
 "termales":("Détendez-vous dans les sources thermales (Santa Rosa, San Vicente, El Otoño ou Tierra Viva).","Entspannen Sie in heißen Quellen (Santa Rosa, San Vicente, El Otoño oder Tierra Viva).","Relaxe nas águas termais (Santa Rosa, San Vicente, El Otoño ou Tierra Viva)."),
 "conexion":("Une journée pour se reconnecter : nature, mouvement et énergie renouvelée.","Ein Tag zum Auftanken: Natur, Bewegung und neue Energie.","Um dia para reconectar: natureza, movimento e energia renovada."),
 "yoga":("Yoga sur mesure dans les cadres naturels du Paysage du Café.","Individuelles Yoga in der Natur der Kaffeelandschaft.","Yoga sob medida nos cenários naturais da Paisagem Cafeeira."),
 "senderovida":("Marche consciente sur des sentiers forestiers, pour le bien-être et l'introspection.","Achtsamer Waldspaziergang für Wohlbefinden und Selbstreflexion.","Caminhada consciente por trilhas de floresta, para bem-estar e introspecção."),
 "equino":("Bien-être et connaissance de soi avec l'accompagnement des chevaux.","Wohlbefinden und Selbsterkenntnis mit Unterstützung von Pferden.","Bem-estar e autoconhecimento com o acompanhamento de cavalos."),
 "rituales":("Rituels holistiques pour équilibrer corps, esprit et âme.","Ganzheitliche Rituale für die Balance von Körper, Geist und Seele.","Rituais holísticos para equilibrar corpo, mente e espírito."),
 "respiracion":("Techniques de respiration et immersion dans le froid pour la vitalité et la résilience.","Atemtechniken und Kälteimmersion für Vitalität und Resilienz.","Técnicas de respiração e imersão no frio para vitalidade e resiliência."),
 "parapente":("Envolez-vous en parapente et admirez le Paysage du Café depuis le ciel.","Fliegen Sie mit dem Gleitschirm und bewundern Sie die Kaffeelandschaft von oben.","Voe de parapente e contemple a Paisagem Cafeeira do alto."),
 "cabalgatamaria":("Balade à cheval entre rivière et montagne à travers le Quindío rural.","Ausritt zwischen Fluss und Berg durch das ländliche Quindío.","Cavalgada entre rio e montanha pelas paisagens do Quindío rural."),
 "cabalgatadeluxe":("Balade à cheval premium en cordillère, panoramas d'altitude et attentions particulières.","Premium-Ausritt in der Kordillere mit Höhenpanoramen und besonderen Extras.","Cavalgada premium pela cordilheira, paisagens de altitude e detalhes especiais."),
 "paratrike":("Vol en paratrike, l'aventure aérienne motorisée pour tous.","Paratrike-Flug, das motorisierte Luftabenteuer für alle.","Voo de paratrike, a aventura aérea motorizada para todos."),
 "parquecafe":("Le parc à thème emblématique de la Région du Café : culture, attractions et café.","Der bekannteste Themenpark der Kaffeeregion: Kultur, Attraktionen und Kaffee.","O parque temático emblema da Região Cafeeira: cultura, atrações e café."),
 "panaca":("Le plus grand parc de nature et d'agriculture : animaux et spectacles.","Der größte Natur- und Agrarpark: Tiere und Shows.","O maior parque de natureza e agropecuária: animais e shows."),
 "recuca":("Vivez la culture du café de façon interactive : costumes et récolte du café.","Erleben Sie die Kaffeekultur interaktiv: verkleiden und Kaffee ernten.","Viva a cultura cafeeira de forma interativa: vista-se e colha café."),
 "ukumari":("L'un des bio-parcs les plus modernes d'Amérique latine, faune de plusieurs continents.","Einer der modernsten Bioparks Lateinamerikas, Tierwelt mehrerer Kontinente.","Um dos bioparques mais modernos da América Latina, fauna de vários continentes."),
 "arrieros":("Tradition des muletiers, humour et culture paisa dans un parc à thème unique.","Maultiertreiber-Tradition, Humor und Paisa-Kultur in einem einzigartigen Themenpark.","Tradição dos arrieiros, humor e cultura paisa num parque temático único."),
 "botanico":("Serre à papillons et forêt : la biodiversité du Quindío dans un jardin vivant.","Schmetterlingshaus und Wald: Quindíos Biodiversität in einem lebendigen Garten.","Borboletário e floresta: a biodiversidade do Quindío num jardim vivo."),
 "laberinto":("Du plaisir en famille dans un grand labyrinthe vert aux mille chemins.","Familienspaß in einem großen grünen Labyrinth mit tausend Wegen.","Diversão em família num grande labirinto verde de mil caminhos."),
 "armenia":("Découvrez la capitale du Quindío : histoire, parcs et culture locale.","Entdecken Sie Quindíos Hauptstadt: Geschichte, Parks und lokale Kultur.","Conheça a capital do Quindío: história, parques e cultura local."),
 "cuyabro":("Art local et café d'origine lors d'un circuit urbain au goût authentique.","Lokale Kunst und Ursprungskaffee auf einer Stadttour mit echtem Flair.","Arte local e café de origem num passeio urbano com sabor autêntico."),
 "cartago":("Tourisme communautaire à Cartago, berceau des plus belles broderies de Colombie.","Gemeinschaftstourismus in Cartago, Heimat der schönsten Stickereien Kolumbiens.","Turismo comunitário em Cartago, berço dos melhores bordados da Colômbia."),
 "pereira":("Découvrez la « Perle de l'Otún » : belvédères, culture et vie urbaine du café.","Entdecken Sie die Perle des Otún: Aussichtspunkte, Kultur und Kaffee-Stadtleben.","Descubra a 'Pérola do Otún': mirantes, cultura e vida urbana cafeeira."),
 "manizales":("Cathédrale, téléphérique et architecture de montagne de la ville accueillante.","Kathedrale, Seilbahn und Bergarchitektur der gastfreundlichen Stadt.","Catedral, teleférico e arquitetura de montanha da cidade acolhedora."),
 "catacafe":("Dégustation professionnelle de cafés de spécialité avec un barista expert.","Professionelle Verkostung von Spezialitätenkaffee mit einem erfahrenen Barista.","Degustação profissional de cafés especiais com um barista experiente."),
 "gastronomica":("Une expérience gastronomique à travers les saveurs de la Colombie.","Ein kulinarisches Erlebnis durch die Aromen Kolumbiens.","Uma experiência gastronômica pelos sabores da Colômbia."),
 "cajaviajera":("Une expérience sensorielle et itinérante autour du café d'origine.","Ein sinnliches, reisendes Erlebnis rund um Ursprungskaffee.","Uma experiência sensorial e itinerante em torno do café de origem."),
 "cataquesos":("Dégustation guidée de fromages affinés d'origine colombienne.","Geführte Verkostung gereifter Käse kolumbianischen Ursprungs.","Degustação guiada de queijos maturados de origem colombiana."),
 "catacocteles":("Mixologie d'auteur avec spiritueux et ingrédients locaux.","Signature-Mixologie mit lokalen Spirituosen und Zutaten.","Mixologia autoral com destilados e insumos locais."),
 "greenteam":("Une retraite d'entreprise durable : nature, équipe et sens.","Ein nachhaltiges Firmen-Retreat: Natur, Team und Sinn.","Um retiro corporativo sustentável: natureza, equipe e propósito."),
 "artesanos":("Rencontre avec des artisans locaux et leurs métiers traditionnels.","Begegnung mit lokalen Kunsthandwerkern und ihren traditionellen Handwerken.","Encontro com artesãos locais e seus ofícios tradicionais."),
 "siembra":("Plantez des arbres dans une réserve naturelle et laissez une empreinte positive.","Pflanzen Sie Bäume in einem Naturreservat und hinterlassen Sie positive Spuren.","Plante árvores numa reserva natural e deixe uma marca positiva."),
 "tallerrespiracion":("Atelier guidé de respiration consciente pour groupes et équipes.","Geführter Workshop für bewusstes Atmen für Gruppen und Teams.","Oficina guiada de respiração consciente para grupos e equipes."),
 "rodizio":("Une expérience gastronomique de type rodizio gaucho brésilien.","Ein kulinarisches Erlebnis im Stil eines brasilianischen Gaucho-Rodízio.","Uma experiência gastronômica estilo rodízio gaúcho brasileiro."),
 "alimentacion":("Une expérience d'alimentation consciente et saine.","Ein Erlebnis bewusster, gesunder Ernährung.","Uma experiência de alimentação consciente e saudável."),
}

# Real Colombian / topical photos (Wikimedia Commons, CC — see CREDITS.md) for folders empty in Drive
FB_URL = {
 "paramo":       "local:paramo.jpg",
 "arrieros":     "local:quimbaya.jpg",
 "botanico":     "local:botanico.jpg",
 "laberinto":    "local:laberinto.jpg",
 "catacocteles": "local:cocteles.jpg",
 "cartago":      "local:cartago.jpg",
 "pereira":      "local:pereira.jpg",
 "manizales":    "local:manizales.jpg",
}

# Iconic wax-palm (palma de cera) cover photos from Wikimedia Commons (CC) for the two palm experiences
COVER_URL = {
 "cocoraacaime2": "local:palma1.jpg",
 "palmacera":     "local:palma2.jpg",
}

def esc(s): return s.replace("\\","\\\\").replace('"','\\"')

tours_js = []
gallery_ids = []
for (tid,cat,name,es,en,key,fb) in T:
    arr = imgs.get(key, [])
    arr = [a for a in arr if a and len(a) > 20][:10]
    REORDER = {"termales":1, "abejas":4, "frutas":2, "platano":1, "cocorasalento":6, "fulldayfcs":2}
    if tid in REORDER and 0 <= REORDER[tid] < len(arr):
        arr.insert(0, arr.pop(REORDER[tid]))
    BORROW = {"cocoraacaime2": "palmacera"}  # La Carbonera = bosque de palma de cera
    if not arr and tid in BORROW:
        arr = [a for a in imgs.get(BORROW[tid], []) if a and len(a) > 20][:6]
    imgs_js = ",".join('"%s"'%a for a in arr)
    fb_final = FB_URL[tid] if (not arr and tid in FB_URL) else fb
    cover_fb = '"%s"'%esc(fb_final)
    fr, de, pt = TR.get(tid, ("", "", ""))
    cover_js = (', cover:"%s"' % esc(COVER_URL[tid])) if tid in COVER_URL else ""
    tours_js.append(
      '  { id:"%s", cat:"%s", name:"%s", fb:%s%s, imgs:[%s], sum:{ es:"%s", en:"%s", fr:"%s", de:"%s", pt:"%s" } }'
      % (tid, cat, esc(name), cover_fb, cover_js, imgs_js, esc(es), esc(en), esc(fr), esc(de), esc(pt)))
    if arr:
        gallery_ids.append((arr[0], name))

# gallery: spread across categories, max ~18
seen=set(); gal=[]
for gid,nm in gallery_ids:
    gal.append((gid,nm))
gal = gal[:18]
gallery_js = ",\n".join('  { id:"%s", cap:"%s" }'%(g,esc(n)) for g,n in gal)

cats_js = ",\n".join('  { id:"%s", es:"%s", en:"%s", fr:"%s", de:"%s", pt:"%s" }'%c for c in CATS)

extra = {
 "es":{"card_quote":"Cotiza tu plan","card_photos":"fotos","loc_region":"Eje Cafetero, Quindío",
   "modal_gallery":"Galería de la experiencia","modal_tagline":"Diseñamos esta experiencia a tu medida: fechas, ritmo, transporte y opción de turismo accesible. Cotiza sin compromiso.",
   "inc1":"Guía local certificado","inc2":"Transporte según el plan","inc3":"Experiencia y entradas indicadas","inc4":"Acompañamiento Espontáneos Travel","inc5":"Opción de turismo accesible"},
 "en":{"card_quote":"Get a quote","card_photos":"photos","loc_region":"Coffee Region, Quindío",
   "modal_gallery":"Experience gallery","modal_tagline":"We tailor this experience to you: dates, pace, transport and an accessible-tourism option. Get a free quote.",
   "inc1":"Certified local guide","inc2":"Transport as per plan","inc3":"Experience & listed entrances","inc4":"Espontáneos Travel support","inc5":"Accessible-tourism option"},
 "fr":{"card_quote":"Devis gratuit","card_photos":"photos","loc_region":"Région du Café, Quindío",
   "modal_gallery":"Galerie de l'expérience","modal_tagline":"Nous adaptons cette expérience : dates, rythme, transport et option de tourisme accessible. Devis sans engagement.",
   "inc1":"Guide local certifié","inc2":"Transport selon le programme","inc3":"Expérience et entrées indiquées","inc4":"Accompagnement Espontáneos Travel","inc5":"Option de tourisme accessible"},
 "de":{"card_quote":"Angebot anfordern","card_photos":"Fotos","loc_region":"Kaffeeregion, Quindío",
   "modal_gallery":"Erlebnis-Galerie","modal_tagline":"Wir gestalten dieses Erlebnis individuell: Termine, Tempo, Transport und barrierefreie Option. Kostenloses Angebot.",
   "inc1":"Zertifizierter lokaler Guide","inc2":"Transport laut Programm","inc3":"Erlebnis & genannte Eintritte","inc4":"Espontáneos-Travel-Begleitung","inc5":"Barrierefreie Option"},
 "pt":{"card_quote":"Solicite orçamento","card_photos":"fotos","loc_region":"Região Cafeeira, Quindío",
   "modal_gallery":"Galeria da experiência","modal_tagline":"Desenhamos esta experiência sob medida: datas, ritmo, transporte e opção de turismo acessível. Cotação sem compromisso.",
   "inc1":"Guia local certificado","inc2":"Transporte conforme o plano","inc3":"Experiência e entradas indicadas","inc4":"Acompanhamento Espontáneos Travel","inc5":"Opção de turismo acessível"},
}

out = io.StringIO()
out.write("/* GENERATED from Drive portfolio — real categories, tours & photos.\n")
out.write("   Photos hotlinked from Google Drive by file ID (lh3). Edit via .imgids/gen.py */\n\n")
out.write("const CATEGORIES = [\n"+cats_js+"\n];\n\n")
out.write("const TOURS = [\n"+",\n".join(tours_js)+"\n];\n\n")
out.write("const GALLERY = [\n"+gallery_js+"\n];\n\n")
out.write("const I18N_EXTRA = "+json.dumps(extra, ensure_ascii=False)+";\n")
open(OUT,"w",encoding="utf-8").write(out.getvalue())
print("wrote", OUT, "tours=", len(T), "withphotos=", sum(1 for t in T if imgs.get(t[5])), "gallery=", len(gal))
