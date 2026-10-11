import fs from 'node:fs';
import path from 'node:path';

const photoData = {
  // Argentina
  "Argentina1.jpg": {
    dest: "Argentina",
    country: "Buenos Aires, Argentina",
    spot: "Arquitetura & Avenidas Portenhas",
    desc: "A elegância clássica das fachadas históricas e o charme das esquinas de Buenos Aires.",
    coords: "34° 36' S, 58° 22' W",
    cam: "Principal • 24mm",
    exp: "f/1.78 • 1/800s • ISO 50"
  },

  // Chile
  "Chile01.jpg": {
    dest: "Chile",
    country: "San Pedro de Atacama, Chile",
    spot: "Dunas do Atacama & Vulcões",
    desc: "Vastidão dourada encontrando a cordilheira sob a atmosfera mais límpida do mundo.",
    coords: "23° 51' S, 68° 14' W",
    cam: "Principal • 24mm",
    exp: "f/1.78 • 1/2000s • ISO 50"
  },
  "chile2.jpg": {
    dest: "Chile",
    country: "Deserto do Atacama, Chile",
    spot: "Valle de la Luna",
    desc: "Cânions escavados pelo vento e camadas brilhantes de sal mineral.",
    coords: "22° 55' S, 68° 17' W",
    cam: "Ultra-Wide • 13mm",
    exp: "f/2.2 • 1/1200s • ISO 64"
  },
  "chile3.jpg": {
    dest: "Chile",
    country: "Antofagasta, Chile",
    spot: "Salar de Atacama & Lagoas",
    desc: "Espelhos d'água altiplânicos refletindo as cristas andinas.",
    coords: "23° 30' S, 68° 15' W",
    cam: "Telefoto • 77mm",
    exp: "f/2.8 • 1/1600s • ISO 40"
  },
  "chile4.jpg": {
    dest: "Chile",
    country: "Cordilheira dos Andes, Chile",
    spot: "Passo dos Andes",
    desc: "Curvas sinuosas cortando as encostas rochosas em alta altitude.",
    coords: "23° 05' S, 67° 45' W",
    cam: "Principal • 24mm",
    exp: "f/1.78 • 1/2500s • ISO 50"
  },
  "chile6.jpg": {
    dest: "Chile",
    country: "San Pedro de Atacama, Chile",
    spot: "Pôr do Sol no Deserto",
    desc: "Tons de fogo e violeta tingindo o horizonte ao entardecer.",
    coords: "22° 54' S, 68° 11' W",
    cam: "Retrato • 48mm",
    exp: "f/1.78 • 1/640s • ISO 100"
  },
  "chile8.jpg": {
    dest: "Chile",
    country: "Vale da Morte, Chile",
    spot: "Garganta do Diabo & Cordilheira de Sal",
    desc: "Labirinto natural de argila avermelhada e formações rochosas imponentes.",
    coords: "22° 53' S, 68° 13' W",
    cam: "Ultra-Wide • 13mm",
    exp: "f/2.2 • 1/1500s • ISO 50"
  },
  "chile10.jpg": {
    dest: "Chile",
    country: "Geysers del Tatio, Chile",
    spot: "Campo Geotérmico a 4.300m",
    desc: "Colunas de vapor térmico cortando o frio congelante da madrugada andina.",
    coords: "22° 20' S, 68° 01' W",
    cam: "Principal • 24mm",
    exp: "f/1.78 • 1/1000s • ISO 80"
  },
  "chile11.jpg": {
    dest: "Chile",
    country: "Fronteira Chile-Bolívia",
    spot: "Cone Perfeito do Licancabur",
    desc: "A silhueta mística do vulcão sagrado dominando a paisagem desértica.",
    coords: "22° 50' S, 67° 53' W",
    cam: "Telefoto • 77mm",
    exp: "f/2.8 • 1/2000s • ISO 40"
  },
  "chile12.jpg": {
    dest: "Chile",
    country: "Lagunas Altiplânicas, Chile",
    spot: "Laguna Miscanti & Miñiques",
    desc: "Azul profundo contrastando com a palha brava e as montanhas vulcânicas.",
    coords: "23° 44' S, 67° 46' W",
    cam: "Principal • 24mm",
    exp: "f/1.78 • 1/1600s • ISO 50"
  },
  "chile13.jpg": {
    dest: "Chile",
    country: "Vale de Jeré, Chile",
    spot: "Oásis Verdejante em Toconao",
    desc: "Águas de degelo criando um vale fértil e surpreendente em meio à aridez.",
    coords: "23° 11' S, 67° 59' W",
    cam: "Principal • 24mm",
    exp: "f/1.78 • 1/800s • ISO 64"
  },
  "chile14.jpg": {
    dest: "Chile",
    country: "Salar de Tara, Chile",
    spot: "Monjes de la Pacana",
    desc: "Pilares vulcânicos milenares erguendo-se como sentinelas de pedra.",
    coords: "23° 02' S, 67° 35' W",
    cam: "Ultra-Wide • 13mm",
    exp: "f/2.2 • 1/1800s • ISO 50"
  },
  "chile15.jpg": {
    dest: "Chile",
    country: "Mirante de Kari, Chile",
    spot: "Pedra do Coyote",
    desc: "Precipício com vista vertiginosa para o mar de areia do deserto.",
    coords: "22° 54' S, 68° 14' W",
    cam: "Retrato • 48mm",
    exp: "f/1.78 • 1/1200s • ISO 50"
  },
  "chile16.jpg": {
    dest: "Chile",
    country: "Rota 27 Chilenas, Chile",
    spot: "A Rota Solitária do Altiplano",
    desc: "Asfalto infinito guiando viajantes através do silêncio da puna andina.",
    coords: "23° 07' S, 67° 51' W",
    cam: "Principal • 24mm",
    exp: "f/1.78 • 1/2200s • ISO 40"
  },
  "chile18.jpg": {
    dest: "Chile",
    country: "Cordilheira Domeyko, Chile",
    spot: "Vale do Arco-Íris",
    desc: "Encostas com faixas multicoloridas de minerais, argila branca e rocha verde.",
    coords: "22° 42' S, 68° 21' W",
    cam: "Principal • 24mm",
    exp: "f/1.78 • 1/900s • ISO 64"
  },
  "chile20.jpg": {
    dest: "Chile",
    country: "Salar de Aguas Calientes, Chile",
    spot: "Piedras Rojas",
    desc: "Rochas vermelhas polidas beirando águas turquesa a 4.000 metros de altitude.",
    coords: "23° 55' S, 67° 42' W",
    cam: "Ultra-Wide • 13mm",
    exp: "f/2.2 • 1/2400s • ISO 50"
  },
  "chile21.jpg": {
    dest: "Chile",
    country: "San Pedro de Atacama, Chile",
    spot: "Madrugada Estrelada no Deserto",
    desc: "Luz matinal revelando as texturas intocadas do deserto mais seco do planeta.",
    coords: "22° 55' S, 68° 12' W",
    cam: "Principal • 24mm",
    exp: "f/1.78 • 1/500s • ISO 125"
  },

  // Rio de Janeiro
  "rj1.jpg": {
    dest: "Rio",
    country: "Rio de Janeiro, Brasil",
    spot: "Cristo Redentor & Baía de Guanabara",
    desc: "A imensidão da Cidade Maravilhosa abraçada pela Baía e montanhas de granito.",
    coords: "22° 57' S, 43° 12' W",
    cam: "Principal • 24mm",
    exp: "f/1.78 • 1/1400s • ISO 50"
  },
  "rj2.jpg": {
    dest: "Rio",
    country: "Rio de Janeiro, Brasil",
    spot: "Orla de Copacabana & Ondas",
    desc: "O icônico calçadão de pedras portuguesas e a energia contagiante da praia.",
    coords: "22° 58' S, 43° 11' W",
    cam: "Ultra-Wide • 13mm",
    exp: "f/2.2 • 1/2000s • ISO 64"
  },
  "rj3.jpg": {
    dest: "Rio",
    country: "Urca, Rio de Janeiro",
    spot: "Pão de Açúcar ao Entardecer",
    desc: "Os bondinhos cruzando o céu dourado entre os morros da Urca.",
    coords: "22° 56' S, 43° 09' W",
    cam: "Telefoto • 77mm",
    exp: "f/2.8 • 1/800s • ISO 80"
  },
  "rj4.jpg": {
    dest: "Rio",
    country: "Ipanema, Rio de Janeiro",
    spot: "Morro Dois Irmãos & Posto 9",
    desc: "A silhueta marcante dos Dois Irmãos emoldurando o fim de tarde em Ipanema.",
    coords: "22° 59' S, 43° 12' W",
    cam: "Principal • 24mm",
    exp: "f/1.78 • 1/1100s • ISO 50"
  },
  "rj5.jpg": {
    dest: "Rio",
    country: "Santa Teresa, Rio de Janeiro",
    spot: "Mirante Dona Marta",
    desc: "A vista mais privilegiada do Rio de Janeiro entre a floresta e o mar.",
    coords: "22° 56' S, 43° 11' W",
    cam: "Ultra-Wide • 13mm",
    exp: "f/2.2 • 1/1600s • ISO 50"
  },
  "rj11.jpg": {
    dest: "Rio",
    country: "Centro, Rio de Janeiro",
    spot: "Arcos da Lapa & Bohemia",
    desc: "O aqueduto colonial iluminado no coração da noite carioca.",
    coords: "22° 54' S, 43° 10' W",
    cam: "Modo Noturno • 24mm",
    exp: "f/1.78 • 1/50s • ISO 250"
  },
  "rj12.jpg": {
    dest: "Rio",
    country: "Jardim Botânico, Rio de Janeiro",
    spot: "Parque Lage & Mata Atlântica",
    desc: "O palacete histórico cercado pela floresta tropical aos pés do Corcovado.",
    coords: "22° 57' S, 43° 12' W",
    cam: "Principal • 24mm",
    exp: "f/1.78 • 1/400s • ISO 100"
  },
  "rj15.jpg": {
    dest: "Rio",
    country: "Arpoador, Rio de Janeiro",
    spot: "Pôr do Sol na Pedra do Arpoador",
    desc: "A tradição carioca de aplaudir o sol se pondo atrás das montanhas.",
    coords: "22° 59' S, 43° 11' W",
    cam: "Telefoto • 77mm",
    exp: "f/2.8 • 1/650s • ISO 80"
  },
  "rj20.jpg": {
    dest: "Rio",
    country: "Maracanã, Rio de Janeiro",
    spot: "Templo do Futebol Maracanã",
    desc: "O caldeirão de emoções onde a história do futebol mundial foi escrita.",
    coords: "22° 54' S, 43° 13' W",
    cam: "Principal • 24mm",
    exp: "f/1.78 • 1/500s • ISO 125"
  },
  "Rj21.jpg": {
    dest: "Rio",
    country: "Rio de Janeiro, Brasil",
    spot: "Horizonte do Atlântico & Costões",
    desc: "O mar aberto batendo nas encostas rochosas da costa carioca.",
    coords: "22° 59' S, 43° 13' W",
    cam: "Principal • 24mm",
    exp: "f/1.78 • 1/1300s • ISO 50"
  },

  // London
  "London1.jpg": {
    dest: "London",
    country: "Londres, Reino Unido",
    spot: "Westminster & Big Ben",
    desc: "A silhueta gótica e a grandiosidade histórica às margens do Rio Tâmisa.",
    coords: "51° 30' N, 0° 07' W",
    cam: "Principal • 24mm",
    exp: "f/1.78 • 1/500s • ISO 80"
  },
  "London2.jpg": {
    dest: "London",
    country: "Londres, Reino Unido",
    spot: "Tower Bridge Panorâmica",
    desc: "A icônica ponte basculante vitoriana cruzando o coração de Londres.",
    coords: "51° 30' N, 0° 04' W",
    cam: "Ultra-Wide • 13mm",
    exp: "f/2.2 • 1/800s • ISO 64"
  },
  "London 3.jpg": {
    dest: "London",
    country: "Londres, Reino Unido",
    spot: "Ruas & Arquitetura de Soho",
    desc: "A energia vibrante dos becos londrinos com tijolos clássicos e cafés.",
    coords: "51° 30' N, 0° 08' W",
    cam: "Principal • 24mm",
    exp: "f/1.78 • 1/320s • ISO 125"
  },
  "London4.jpg": {
    dest: "London",
    country: "Londres, Reino Unido",
    spot: "Parques Reais & Outono",
    desc: "Caminhadas tranquilas em Hyde Park sob copas douradas de árvores centenárias.",
    coords: "51° 30' N, 0° 10' W",
    cam: "Telefoto • 77mm",
    exp: "f/2.8 • 1/400s • ISO 100"
  },
  "London5.jpg": {
    dest: "London",
    country: "Londres, Reino Unido",
    spot: "Millennium Bridge & St. Paul's",
    desc: "Passarela contemporânea de aço alinhada com a cúpula histórica da catedral.",
    coords: "51° 30' N, 0° 05' W",
    cam: "Principal • 24mm",
    exp: "f/1.78 • 1/1000s • ISO 50"
  },
  "London6.jpg": {
    dest: "London",
    country: "Londres, Reino Unido",
    spot: "Covent Garden & Iluminação",
    desc: "A elegância dos teatros e mercados de rua iluminados à noite.",
    coords: "51° 30' N, 0° 07' W",
    cam: "Modo Noturno • 24mm",
    exp: "f/1.78 • 1/60s • ISO 320"
  },
  "London7.jpg": {
    dest: "London",
    country: "Londres, Reino Unido",
    spot: "Notting Hill & Casas Coloridas",
    desc: "Charme residencial com fachadas em tons pastéis e ruas arborizadas.",
    coords: "51° 30' N, 0° 12' W",
    cam: "Principal • 24mm",
    exp: "f/1.78 • 1/750s • ISO 64"
  },
  "London8.jpg": {
    dest: "London",
    country: "Londres, Reino Unido",
    spot: "British Museum • Great Court",
    desc: "Teto envidraçado de geometria deslumbrante abraçando o pátio central.",
    coords: "51° 31' N, 0° 07' W",
    cam: "Ultra-Wide • 13mm",
    exp: "f/2.2 • 1/250s • ISO 200"
  },
  "London9.jpg": {
    dest: "London",
    country: "Londres, Reino Unido",
    spot: "Canais de Camden Town",
    desc: "Reflexos nas águas do canal e o clima alternativo de Camden Lock.",
    coords: "51° 32' N, 0° 08' W",
    cam: "Principal • 24mm",
    exp: "f/1.78 • 1/450s • ISO 100"
  },
  "London10.jpg": {
    dest: "London",
    country: "Londres, Reino Unido",
    spot: "Crepúsculo no South Bank",
    desc: "O perfil de arranha-céus e edifícios históricos refletido nas marés do Tâmisa.",
    coords: "51° 30' N, 0° 06' W",
    cam: "Telefoto • 77mm",
    exp: "f/2.8 • 1/120s • ISO 250"
  },
  "london15.jpg": {
    dest: "London",
    country: "Londres, Reino Unido",
    spot: "Palácio de Buckingham",
    desc: "A residência real com seus portões dourados e guardas cerimoniais.",
    coords: "51° 30' N, 0° 08' W",
    cam: "Principal • 24mm",
    exp: "f/1.78 • 1/900s • ISO 50"
  },
  "london16.jpg": {
    dest: "London",
    country: "Londres, Reino Unido",
    spot: "Trafalgar Square & Leões",
    desc: "O ponto de encontro central de Londres em frente à National Gallery.",
    coords: "51° 30' N, 0° 07' W",
    cam: "Ultra-Wide • 13mm",
    exp: "f/2.2 • 1/640s • ISO 80"
  },
  "london18.jpg": {
    dest: "London",
    country: "Londres, Reino Unido",
    spot: "Piccadilly Circus & Painéis",
    desc: "O cruzamento mais pulsante de Londres com letreiros luminosos e estátua de Eros.",
    coords: "51° 30' N, 0° 08' W",
    cam: "Principal • 24mm",
    exp: "f/1.78 • 1/200s • ISO 160"
  },
  "london20.jpg": {
    dest: "London",
    country: "Londres, Reino Unido",
    spot: "Cabines Telefônicas Vermelhas",
    desc: "O símbolo britânico atemporal contrastando com as fachadas de pedra cinza.",
    coords: "51° 30' N, 0° 07' W",
    cam: "Retrato • 48mm",
    exp: "f/1.78 • 1/400s • ISO 100"
  },
  "london21.jpg": {
    dest: "London",
    country: "Londres, Reino Unido",
    spot: "London Eye & Roda Gigante",
    desc: "Cápsulas futuristas sobrevoando as curvas do Tâmisa.",
    coords: "51° 30' N, 0° 07' W",
    cam: "Telefoto • 77mm",
    exp: "f/2.8 • 1/1000s • ISO 64"
  },
  "london22.jpg": {
    dest: "London",
    country: "Londres, Reino Unido",
    spot: "St. James's Park & Jardins",
    desc: "Natureza bem cuidada com vista para as torres do Horse Guards.",
    coords: "51° 30' N, 0° 07' W",
    cam: "Principal • 24mm",
    exp: "f/1.78 • 1/550s • ISO 64"
  },
  "london23.jpg": {
    dest: "London",
    country: "Londres, Reino Unido",
    spot: "Kensington Palace & Árvores",
    desc: "Arquitetura real de tijolos vermelhos e jardins floridos da nobreza.",
    coords: "51° 30' N, 0° 11' W",
    cam: "Principal • 24mm",
    exp: "f/1.78 • 1/700s • ISO 50"
  },
  "london24.jpg": {
    dest: "London",
    country: "Londres, Reino Unido",
    spot: "Sky Garden & Terraço Verde",
    desc: "Vista espetacular de 360 graus do topo de um dos edifícios mais altos da City.",
    coords: "51° 30' N, 0° 05' W",
    cam: "Ultra-Wide • 13mm",
    exp: "f/2.2 • 1/350s • ISO 125"
  },
  "london25.jpg": {
    dest: "London",
    country: "Londres, Reino Unido",
    spot: "Leadenhall Market",
    desc: "Mercado coberto vitoriano com ferragens ornamentadas e tetos pintados.",
    coords: "51° 30' N, 0° 05' W",
    cam: "Principal • 24mm",
    exp: "f/1.78 • 1/150s • ISO 200"
  },
  "london26.jpg": {
    dest: "London",
    country: "Londres, Reino Unido",
    spot: "Borough Market & Aromas",
    desc: "O mercado gastronômico mais antigo e famoso aos pés da London Bridge.",
    coords: "51° 30' N, 0° 05' W",
    cam: "Principal • 24mm",
    exp: "f/1.78 • 1/250s • ISO 160"
  },
  "london28.jpg": {
    dest: "London",
    country: "Londres, Reino Unido",
    spot: "The Shard & Céu Nublado",
    desc: "A pirâmide de vidro de Renzo Piano apontando para o céu londrino.",
    coords: "51° 30' N, 0° 05' W",
    cam: "Telefoto • 77mm",
    exp: "f/2.8 • 1/1200s • ISO 50"
  },
  "london29.jpg": {
    dest: "London",
    country: "Londres, Reino Unido",
    spot: "Estação de Metrô Underground",
    desc: "A identidade visual do metrô mais antigo do mundo em plena atividade.",
    coords: "51° 31' N, 0° 09' W",
    cam: "Principal • 24mm",
    exp: "f/1.78 • 1/100s • ISO 250"
  },
  "london30.jpg": {
    dest: "London",
    country: "Londres, Reino Unido",
    spot: "Regent Street & Curva Imperial",
    desc: "Elegância neoclássica em uma das avenidas de compras mais famosas do mundo.",
    coords: "51° 30' N, 0° 08' W",
    cam: "Ultra-Wide • 13mm",
    exp: "f/2.2 • 1/500s • ISO 80"
  },
  "london31.jpg": {
    dest: "London",
    country: "Londres, Reino Unido",
    spot: "Carnaby Street & Cultura Pop",
    desc: "A rua que definiu o estilo 'Swinging London' nos anos 60.",
    coords: "51° 30' N, 0° 08' W",
    cam: "Principal • 24mm",
    exp: "f/1.78 • 1/300s • ISO 100"
  },
  "london32.jpg": {
    dest: "London",
    country: "Londres, Reino Unido",
    spot: "Tate Modern & Sala das Turbinas",
    desc: "Antiga usina elétrica convertida em meca da arte moderna e contemporânea.",
    coords: "51° 30' N, 0° 05' W",
    cam: "Ultra-Wide • 13mm",
    exp: "f/2.2 • 1/120s • ISO 200"
  },
  "london34.jpg": {
    dest: "London",
    country: "Londres, Reino Unido",
    spot: "Shakespeare's Globe",
    desc: "Reconstrução fiel do teatro elisabetano de madeira às margens do Tâmisa.",
    coords: "51° 30' N, 0° 05' W",
    cam: "Principal • 24mm",
    exp: "f/1.78 • 1/400s • ISO 80"
  },
  "london36.jpg": {
    dest: "London",
    country: "Londres, Reino Unido",
    spot: "Observatório Real de Greenwich",
    desc: "A linha do Meridiano Zero dividindo os hemisférios ocidental e oriental.",
    coords: "51° 28' N, 0° 00' E",
    cam: "Telefoto • 77mm",
    exp: "f/2.8 • 1/900s • ISO 50"
  },
  "london39.jpg": {
    dest: "London",
    country: "Londres, Reino Unido",
    spot: "Pub Tradicional em Covent Garden",
    desc: "Fachadas de madeira entalhada e flores suspensas servindo cervejas locais.",
    coords: "51° 30' N, 0° 07' W",
    cam: "Retrato • 48mm",
    exp: "f/1.78 • 1/180s • ISO 160"
  },
  "london40.jpg": {
    dest: "London",
    country: "Londres, Reino Unido",
    spot: "Oxford Street & Movimento",
    desc: "Ônibus vermelhos de dois andares cruzando a artéria mais movimentada.",
    coords: "51° 30' N, 0° 09' W",
    cam: "Principal • 24mm",
    exp: "f/1.78 • 1/600s • ISO 64"
  },
  "london41.jpg": {
    dest: "London",
    country: "Londres, Reino Unido",
    spot: "King's Cross & Teto Arquitetônico",
    desc: "A malha de aço em forma de funil que revitalizou a estação ferroviária.",
    coords: "51° 31' N, 0° 07' W",
    cam: "Ultra-Wide • 13mm",
    exp: "f/2.2 • 1/250s • ISO 160"
  },
  "london45.jpg": {
    dest: "London",
    country: "Londres, Reino Unido",
    spot: "Harrods & Fachada de Luxo",
    desc: "A opulência em terracota e milhares de luzes acesas em Knightsbridge.",
    coords: "51° 29' N, 0° 09' W",
    cam: "Principal • 24mm",
    exp: "f/1.78 • 1/150s • ISO 200"
  },
  "london48.jpg": {
    dest: "London",
    country: "Londres, Reino Unido",
    spot: "Natural History Museum",
    desc: "A 'Catedral da Natureza' com sua monumental fachada românica em terracota.",
    coords: "51° 29' N, 0° 10' W",
    cam: "Principal • 24mm",
    exp: "f/1.78 • 1/450s • ISO 80"
  },
  "london49.jpg": {
    dest: "London",
    country: "Londres, Reino Unido",
    spot: "Victoria and Albert Museum",
    desc: "O santuário do design e da arte com seus pátios internos serenos.",
    coords: "51° 29' N, 0° 10' W",
    cam: "Ultra-Wide • 13mm",
    exp: "f/2.2 • 1/320s • ISO 100"
  },
  "london51.jpg": {
    dest: "London",
    country: "Londres, Reino Unido",
    spot: "Canary Wharf & Arranha-Céus",
    desc: "O centro financeiro ultramoderno refletindo nas docas de East London.",
    coords: "51° 30' N, 0° 01' W",
    cam: "Telefoto • 77mm",
    exp: "f/2.8 • 1/1200s • ISO 50"
  },
  "london54.jpg": {
    dest: "London",
    country: "Londres, Reino Unido",
    spot: "Richmond Park & Veados Selvagens",
    desc: "O maior parque real com colinas onduladas e carvalhos seculares.",
    coords: "51° 26' N, 0° 16' W",
    cam: "Telefoto • 77mm",
    exp: "f/2.8 • 1/500s • ISO 80"
  },
  "london56.jpg": {
    dest: "London",
    country: "Londres, Reino Unido",
    spot: "Albert Embankment ao Anoitecer",
    desc: "Caminho iluminado às margens do rio com brisa suave e passos tranquilos.",
    coords: "51° 29' N, 0° 07' W",
    cam: "Modo Noturno • 24mm",
    exp: "f/1.78 • 1/45s • ISO 320"
  },
  "london57.jpg": {
    dest: "London",
    country: "Londres, Reino Unido",
    spot: "Luzes Noturnas sobre Londres",
    desc: "A metrópole adormecendo com pontes e monumentos reluzindo no espelho d'água.",
    coords: "51° 30' N, 0° 05' W",
    cam: "Principal • 24mm",
    exp: "f/1.78 • 1/80s • ISO 250"
  },

  // São Paulo (SPFC)
  "SPFC1.jpg": {
    dest: "SPFC",
    country: "São Paulo, Brasil",
    spot: "Estádio Cícero Pompeu de Toledo (Morumbis)",
    desc: "A festa inconfundível da torcida tricolor, fumaça vermelha, branca e preta vibrando nas arquibancadas.",
    coords: "23° 36' S, 46° 43' W",
    cam: "Vertical 9:16 • 24mm",
    exp: "f/1.78 • 1/500s • ISO 160"
  }
};

// Ler arquivos reais na pasta
const memoriesDir = "C:\\Users\\gugu_\\OneDrive\\Imagens\\memories";
const allFiles = fs.readdirSync(memoriesDir).filter(f => /\.(jpg|jpeg|png|webp|avif)$/i.test(f)).sort();

const catalog = allFiles.map((filename, idx) => {
  const existing = photoData[filename];
  if (existing) {
    return {
      id: `photo-${idx + 1}`,
      file: filename,
      ...existing
    };
  }

  // fallback para novos arquivos que o usuário venha a adicionar
  return {
    id: `photo-${idx + 1}`,
    file: filename,
    dest: filename.toLowerCase().includes("chile") ? "Chile" : 
          filename.toLowerCase().includes("london") ? "London" : 
          filename.toLowerCase().includes("rj") ? "Rio" : 
          filename.toLowerCase().includes("argentina") ? "Argentina" : "SPFC",
    country: "Viagens • Memórias",
    spot: path.parse(filename).name,
    desc: "Registro fotográfico capturado em alta resolução durante a viagem.",
    coords: "00° 00' N, 00° 00' W",
    cam: "Câmera Retrato • 24mm",
    exp: "f/1.78 • 1/500s • ISO 100"
  };
});

console.log(`Catálogo gerado com ${catalog.length} fotos!`);
fs.writeFileSync(path.join(process.cwd(), 'catalog.json'), JSON.stringify(catalog, null, 2), 'utf-8');
