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

def esc(s): return s.replace("\\","\\\\").replace('"','\\"')

tours_js = []
gallery_ids = []
for (tid,cat,name,es,en,key,fb) in T:
    arr = imgs.get(key, [])
    arr = [a for a in arr if a and len(a) > 20][:10]
    imgs_js = ",".join('"%s"'%a for a in arr)
    cover_fb = '"%s"'%fb
    tours_js.append(
      '  { id:"%s", cat:"%s", name:"%s", fb:%s, imgs:[%s], sum:{ es:"%s", en:"%s" } }'
      % (tid, cat, esc(name), cover_fb, imgs_js, esc(es), esc(en)))
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
