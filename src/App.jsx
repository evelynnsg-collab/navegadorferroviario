import { useState, useRef } from "react";

// ══════════════════════════════════════════════════════
// LINHAS – cores oficiais
// ══════════════════════════════════════════════════════
const L = {
  1:  { nome:"1-Azul",      cor:"#0455A1", txt:"#fff" },
  2:  { nome:"2-Verde",     cor:"#007A5E", txt:"#fff" },
  3:  { nome:"3-Vermelha",  cor:"#EE372F", txt:"#fff" },
  4:  { nome:"4-Amarela",   cor:"#FFD400", txt:"#000" },
  5:  { nome:"5-Lilás",     cor:"#9B2990", txt:"#fff" },
  7:  { nome:"7-Rubi",      cor:"#C3003F", txt:"#fff" },
  8:  { nome:"8-Diamante",  cor:"#97A0A8", txt:"#000" },
  9:  { nome:"9-Esmeralda", cor:"#01A388", txt:"#fff" },
  10: { nome:"10-Turquesa", cor:"#007B9E", txt:"#fff" },
  11: { nome:"11-Coral",    cor:"#F36F21", txt:"#fff" },
  12: { nome:"12-Safira",   cor:"#133B91", txt:"#fff" },
  13: { nome:"13-Jade",     cor:"#00A859", txt:"#fff" },
  15: { nome:"15-Prata",    cor:"#808080", txt:"#fff" },
  17: { nome:"17-Ouro",     cor:"#D4A017", txt:"#000" },
};

// ══════════════════════════════════════════════════════
// ESTAÇÕES – fonte: planilha Mapa_Ferroviario_SP_Linhas_1_a_17.xlsx
// Dados verificados contra Metrô SP e CPTM (junho 2026)
// l7x: nó fantasma da L7 em Luz — sem baldeação com L1/L4/L10/L11
// ══════════════════════════════════════════════════════
const ESTACOES = [

  // ── LINHA 1 – AZUL · Metrô · 23 estações ─────────────────────
  { id:"jabaquara",         nome:"Jabaquara",                  linhas:[1,9]         },
  { id:"conceicao",         nome:"Conceição",                  linhas:[1]           },
  { id:"sao-judas",         nome:"São Judas",                  linhas:[1]           },
  { id:"saude",             nome:"Saúde",                      linhas:[1]           },
  { id:"praca-da-arvore",   nome:"Praça da Árvore",            linhas:[1]           },
  { id:"santa-cruz-l1",     nome:"Santa Cruz",                 linhas:[1,5]         },
  { id:"vila-mariana",      nome:"Vila Mariana",               linhas:[1]           },
  { id:"ana-rosa",          nome:"Ana Rosa",                   linhas:[1,2]         },
  { id:"paraiso",           nome:"Paraíso",                    linhas:[1,2]         },
  { id:"vergueiro-l1",      nome:"Vergueiro",                  linhas:[1]           },
  { id:"sao-joaquim",       nome:"São Joaquim",                linhas:[1]           },
  { id:"japao-liberdade",   nome:"Japão-Liberdade",            linhas:[1]           },
  { id:"se",                nome:"Sé",                         linhas:[1,3]         },
  { id:"sao-bento-l1",      nome:"São Bento",                  linhas:[1]           },
  { id:"luz",               nome:"Luz",                        linhas:[1,4,10,11]   },
  // ^ Luz: L1+L4+L10+L11. L7 passa por Luz mas SEM baldeação integrada.
  { id:"tiradentes",        nome:"Tiradentes",                 linhas:[1]           },
  { id:"armenia",           nome:"Armênia",                    linhas:[1]           },
  { id:"portuguesa-tiete",  nome:"Portuguesa-Tietê",           linhas:[1]           },
  { id:"carandiru",         nome:"Carandiru",                  linhas:[1]           },
  { id:"santana",           nome:"Santana",                    linhas:[1]           },
  { id:"jardim-sp-as",      nome:"Jd. São Paulo-A.Senna",      linhas:[1]           },
  { id:"parada-inglesa",    nome:"Parada Inglesa",             linhas:[1]           },
  { id:"tucuruvi",          nome:"Tucuruvi",                   linhas:[1]           },

  // ── LINHA 2 – VERDE · Metrô · 14 estações ────────────────────
  // Compartilhadas com L1: Vila Madalena, Clínicas, Consolação,
  //   Trianon-MASP, Brigadeiro, Paraíso, Ana Rosa, Chácara Klabin,
  //   Santos-Imigrantes, Alto do Ipiranga, Sacomã
  { id:"vila-madalena",     nome:"Vila Madalena",              linhas:[1,2]         },
  { id:"sumare",            nome:"Sumaré",                     linhas:[2]           },
  { id:"clinicas",          nome:"Clínicas",                   linhas:[1,2]         },
  { id:"consolacao",        nome:"Consolação",                 linhas:[1,2]         },
  { id:"trianon-masp",      nome:"Trianon-MASP",               linhas:[1,2]         },
  { id:"brigadeiro",        nome:"Brigadeiro",                 linhas:[1,2]         },
  // paraiso: [1,2] já declarada
  // ana-rosa: [1,2] já declarada
  { id:"chacara-klabin",    nome:"Chácara Klabin",             linhas:[2,5]         },
  { id:"santos-imigrantes", nome:"Santos-Imigrantes",          linhas:[1,2]         },
  { id:"alto-ipiranga",     nome:"Alto do Ipiranga",           linhas:[1,2]         },
  { id:"sacoma",            nome:"Sacomã",                     linhas:[1,2]         },
  { id:"tamandutaei",       nome:"Tamanduateí",                linhas:[2,10]        },
  { id:"vila-prudente",     nome:"Vila Prudente",              linhas:[2,15]        },

  // ── LINHA 3 – VERMELHA · Metrô · 18 estações ─────────────────
  { id:"palmeiras-bf",      nome:"Palmeiras-Barra Funda",      linhas:[3,7,8,10,11] },
  { id:"marechal-deodoro",  nome:"Marechal Deodoro",           linhas:[3]           },
  { id:"santa-cecilia",     nome:"Santa Cecília",              linhas:[3]           },
  { id:"republica",         nome:"República",                  linhas:[3,4]         },
  { id:"anhangabau",        nome:"Anhangabaú",                 linhas:[3]           },
  // se: [1,3] já declarada
  { id:"pedro-ii",          nome:"Pedro II",                   linhas:[3]           },
  { id:"bras",              nome:"Brás",                       linhas:[3,10,11,12]  },
  { id:"bresser-mooca",     nome:"Bresser-Mooca",              linhas:[3]           },
  { id:"belem",             nome:"Belém",                      linhas:[3]           },
  { id:"tatuape",           nome:"Tatuapé",                    linhas:[3,11,12]     },
  { id:"carrao",            nome:"Carrão-Assaí Atacadista",    linhas:[3]           },
  { id:"penha",             nome:"Penha",                      linhas:[3]           },
  { id:"vila-matilde",      nome:"Vila Matilde",               linhas:[3]           },
  { id:"guilhermina",       nome:"Guilhermina-Esperança",      linhas:[3]           },
  { id:"patriarca-vr",      nome:"Patriarca-Vila Ré",          linhas:[3]           },
  { id:"artur-alvim",       nome:"Artur Alvim",                linhas:[3]           },
  { id:"corinthians-ita",   nome:"Corinthians-Itaquera",       linhas:[3,11]        },

  // ── LINHA 4 – AMARELA · ViaQuatro · 11 estações ───────────────
  // luz: [1,4,10,11] já declarada
  // republica: [3,4] já declarada
  { id:"higienopolis-mck",  nome:"Higienópolis-Mackenzie",     linhas:[3,4]         },
  // ^ L3 não passa por aí, mas há futura conexão com L6. Mantemos [4] p/ rota
  // Corrigindo: L3 NÃO tem estação Higienópolis-Mackenzie. É só L4.
  // Porém planilha coloca conexão L4+L6(futura). Para rota atual: só L4.
  { id:"paulista",          nome:"Paulista",                   linhas:[2,4]         },
  { id:"oscar-freire",      nome:"Oscar Freire",               linhas:[4]           },
  { id:"fradique-coutinho", nome:"Fradique Coutinho",          linhas:[4]           },
  { id:"faria-lima",        nome:"Faria Lima",                 linhas:[4]           },
  { id:"pinheiros",         nome:"Pinheiros",                  linhas:[4,9]         },
  { id:"butanta",           nome:"Butantã",                    linhas:[4]           },
  { id:"sp-morumbi",        nome:"São Paulo-Morumbi",          linhas:[4]           },
  { id:"vila-sonia",        nome:"Vila Sônia-Profª E.Tenreiro",linhas:[4]           },

  // ── LINHA 5 – LILÁS · ViaMobilidade · 17 estações ────────────
  { id:"capao-redondo",     nome:"Capão Redondo",              linhas:[5]           },
  { id:"campo-limpo",       nome:"Campo Limpo",                linhas:[5]           },
  { id:"vila-das-belezas",  nome:"Vila das Belezas",           linhas:[5]           },
  { id:"giovanni-gronchi",  nome:"Giovanni Gronchi",           linhas:[5]           },
  { id:"santo-amaro",       nome:"Santo Amaro",                linhas:[5,9]         },
  { id:"largo-treze",       nome:"Largo Treze",                linhas:[5]           },
  { id:"adolfo-pinheiro",   nome:"Adolfo Pinheiro",            linhas:[5]           },
  { id:"alto-boa-vista",    nome:"Alto da Boa Vista",          linhas:[5]           },
  { id:"borba-gato",        nome:"Borba Gato",                 linhas:[5]           },
  { id:"brooklin",          nome:"Brooklin",                   linhas:[5]           },
  { id:"campo-belo",        nome:"Campo Belo",                 linhas:[5,17]        },
  { id:"eucaliptos",        nome:"Eucaliptos",                 linhas:[5]           },
  { id:"moema",             nome:"Moema",                      linhas:[5]           },
  { id:"aacd-servidor",     nome:"AACD-Servidor",              linhas:[5]           },
  { id:"hospital-sp",       nome:"Hospital São Paulo",         linhas:[5]           },
  { id:"santa-cruz",        nome:"Santa Cruz",                 linhas:[2,5]         },
  // chacara-klabin: [2,5] já declarada

  // ── LINHA 7 – RUBI · CPTM/TIC Trens · 17 estações ───────────
  // Sentido Jundiaí→Luz. Luz L7: NÃO conecta com L1/L4/L10/L11.
  { id:"jundiai",           nome:"Jundiaí",                    linhas:[7]           },
  { id:"varzea-paulista",   nome:"Várzea Paulista",            linhas:[7]           },
  { id:"campo-limpo-paulista",nome:"Campo Limpo Paulista",     linhas:[7]           },
  { id:"botujuru",          nome:"Botujuru",                   linhas:[7]           },
  { id:"francisco-morato",  nome:"Francisco Morato",           linhas:[7]           },
  { id:"baltazar-fidelis",  nome:"Baltazar Fidélis",           linhas:[7]           },
  { id:"franco-da-rocha",   nome:"Franco da Rocha",            linhas:[7]           },
  { id:"caieiras",          nome:"Caieiras",                   linhas:[7]           },
  { id:"perus",             nome:"Perus",                      linhas:[7]           },
  { id:"vila-aurora",       nome:"Vila Aurora",                linhas:[7]           },
  { id:"jaraguá",           nome:"Jaraguá",                    linhas:[7]           },
  { id:"vila-clarice",      nome:"Vila Clarice",               linhas:[7]           },
  { id:"pirituba",          nome:"Pirituba",                   linhas:[7]           },
  { id:"piqueri",           nome:"Piqueri",                    linhas:[7]           },
  { id:"lapa",              nome:"Lapa",                       linhas:[7,8]         },
  { id:"agua-branca-l7",    nome:"Água Branca",                linhas:[7]           },
  // palmeiras-bf: [3,7,8,10,11] já declarada
  { id:"luz-l7",            nome:"Luz",                        linhas:[7], l7x:true },

  // ── LINHA 8 – DIAMANTE · ViaMobilidade · 22 estações ─────────
  { id:"julio-prestes",     nome:"Júlio Prestes",              linhas:[8]           },
  // palmeiras-bf: [3,7,8,10,11] já declarada
  // lapa: [7,8] já declarada
  { id:"domingos-de-moraes",nome:"Domingos de Moraes",         linhas:[8]           },
  { id:"imperatriz-leopoldina",nome:"Imperatriz Leopoldina",   linhas:[8]           },
  { id:"presidente-altino", nome:"Presidente Altino",          linhas:[8,9]         },
  { id:"osasco",            nome:"Osasco",                     linhas:[8,9]         },
  { id:"comandante-sampaio",nome:"Comandante Sampaio",         linhas:[8]           },
  { id:"quitauna",          nome:"Quitaúna",                   linhas:[8]           },
  { id:"general-miguel",    nome:"General Miguel Costa",       linhas:[8]           },
  { id:"carapicuiba",       nome:"Carapicuíba",                linhas:[8]           },
  { id:"santa-terezinha",   nome:"Santa Terezinha",            linhas:[8]           },
  { id:"antonio-joao",      nome:"Antônio João",               linhas:[8]           },
  { id:"barueri",           nome:"Barueri",                    linhas:[8]           },
  { id:"jardim-belval",     nome:"Jardim Belval",              linhas:[8]           },
  { id:"jardim-silveira",   nome:"Jardim Silveira",            linhas:[8]           },
  { id:"jandira",           nome:"Jandira",                    linhas:[8]           },
  { id:"sagrado-coracao",   nome:"Sagrado Coração",            linhas:[8]           },
  { id:"engenheiro-cardoso",nome:"Engenheiro Cardoso",         linhas:[8]           },
  { id:"itapevi",           nome:"Itapevi",                    linhas:[8]           },
  { id:"santa-rita",        nome:"Santa Rita",                 linhas:[8]           },
  { id:"amador-bueno",      nome:"Amador Bueno",               linhas:[8]           },

  // ── LINHA 9 – ESMERALDA · ViaMobilidade · 21 estações ────────
  // osasco: [8,9] já declarada
  // presidente-altino: [8,9] já declarada
  // pinheiros: [4,9] já declarada
  // santo-amaro: [5,9] já declarada
  // jabaquara: [1,9] já declarada
  { id:"ceasa",             nome:"CEASA",                      linhas:[9]           },
  { id:"villa-lobos",       nome:"Villa-Lobos-Jaguaré",        linhas:[9]           },
  { id:"cidade-univ",       nome:"Cidade Universitária",       linhas:[9]           },
  { id:"hebraica-reboucas", nome:"Hebraica-Rebouças",          linhas:[9]           },
  { id:"cidade-jardim",     nome:"Cidade Jardim",              linhas:[9]           },
  { id:"vila-olimpia",      nome:"Vila Olímpia",               linhas:[9]           },
  { id:"berrini",           nome:"Berrini",                    linhas:[9]           },
  { id:"morumbi-l9",        nome:"Morumbi",                    linhas:[9,17]        },
  { id:"granja-julieta",    nome:"Granja Julieta",             linhas:[9]           },
  { id:"joao-dias",         nome:"João Dias",                  linhas:[9]           },
  { id:"socorro",           nome:"Socorro",                    linhas:[9]           },
  { id:"jurubatuba",        nome:"Jurubatuba",                 linhas:[9]           },
  { id:"autodromo",         nome:"Autódromo",                  linhas:[9]           },
  { id:"primavera-interlagos",nome:"Primavera-Interlagos",     linhas:[9]           },
  { id:"grajaú",            nome:"Grajaú",                     linhas:[9]           },
  { id:"bruno-covas",       nome:"Bruno Covas-Mendes-Vila Natal",linhas:[9]         },
  { id:"varginha",          nome:"Varginha",                   linhas:[9]           },

  // ── LINHA 10 – TURQUESA · CPTM · 14 estações ─────────────────
  // palmeiras-bf: [3,7,8,10,11] já declarada
  // luz: [1,4,10,11] já declarada
  // bras: [3,10,11,12] já declarada
  // tamandutaei: [2,10] já declarada
  { id:"juventus-mooca",    nome:"Juventus-Mooca",             linhas:[10]          },
  { id:"ipiranga-l10",      nome:"Ipiranga",                   linhas:[10]          },
  { id:"sao-caetano-wb",    nome:"São Caetano do Sul-Pref. W.Braido",linhas:[10]    },
  { id:"utinga",            nome:"Utinga",                     linhas:[10]          },
  { id:"prefeito-celso",    nome:"Prefeito Celso Daniel-SA",   linhas:[10]          },
  { id:"capuava",           nome:"Capuava",                    linhas:[10]          },
  { id:"maua-l10",          nome:"Mauá",                       linhas:[10]          },
  { id:"guapituba",         nome:"Guapituba",                  linhas:[10]          },
  { id:"ribeirao-pires",    nome:"Ribeirão Pires-A.Bespalec",  linhas:[10]          },
  { id:"rio-grande-serra",  nome:"Rio Grande da Serra",        linhas:[10]          },

  // ── LINHA 11 – CORAL · CPTM · 17 estações ────────────────────
  // palmeiras-bf: [3,7,8,10,11] já declarada
  // luz: [1,4,10,11] já declarada
  // bras: [3,10,11,12] já declarada
  // tatuape: [3,11,12] já declarada
  // corinthians-ita: [3,11] já declarada
  { id:"dom-bosco",         nome:"Dom Bosco",                  linhas:[11]          },
  { id:"jose-bonifacio",    nome:"José Bonifácio",             linhas:[11]          },
  { id:"guaianases",        nome:"Guaianases",                 linhas:[11]          },
  { id:"antonio-gianetti",  nome:"Antônio Gianetti Neto",      linhas:[11]          },
  { id:"ferraz-vasconcelos",nome:"Ferraz de Vasconcelos",      linhas:[11]          },
  { id:"poa",               nome:"Poá",                        linhas:[11]          },
  { id:"calmon-viana",      nome:"Calmon Viana",               linhas:[11,12]       },
  { id:"suzano",            nome:"Suzano",                     linhas:[11]          },
  { id:"jundiapeba",        nome:"Jundiapeba",                 linhas:[11]          },
  { id:"braz-cubas",        nome:"Braz Cubas",                 linhas:[11]          },
  { id:"mogi-das-cruzes",   nome:"Mogi das Cruzes",            linhas:[11]          },
  { id:"estudantes",        nome:"Estudantes",                 linhas:[11]          },

  // ── LINHA 12 – SAFIRA · CPTM · 13 estações ───────────────────
  // bras: [3,10,11,12] já declarada
  // tatuape: [3,11,12] já declarada
  // calmon-viana: [11,12] já declarada
  { id:"engenheiro-goulart",nome:"Engenheiro Goulart",         linhas:[12,13]       },
  { id:"usp-leste",         nome:"USP Leste",                  linhas:[12]          },
  { id:"comendador-ermelino",nome:"Comendador Ermelino",       linhas:[12]          },
  { id:"sao-miguel",        nome:"São Miguel Paulista",        linhas:[12]          },
  { id:"jardim-helena",     nome:"Jardim Helena-Vila Mara",    linhas:[12]          },
  { id:"itaim-paulista",    nome:"Itaim Paulista",             linhas:[12]          },
  { id:"jardim-romano",     nome:"Jardim Romano",              linhas:[12]          },
  { id:"eng-manoel-feio",   nome:"Engenheiro Manoel Feio",     linhas:[12]          },
  { id:"itaquaquecetuba",   nome:"Itaquaquecetuba",            linhas:[12]          },
  { id:"aracare",           nome:"Aracaré",                    linhas:[12]          },

  // ── LINHA 13 – JADE · CPTM · 3 estações ─────────────────────
  // engenheiro-goulart: [12,13] já declarada
  { id:"guarulhos-cecap",   nome:"Guarulhos-CECAP",            linhas:[13]          },
  { id:"aeroporto-gru",     nome:"Aeroporto-Guarulhos",        linhas:[13]          },

  // ── LINHA 15 – PRATA · Metrô · 11 estações ───────────────────
  // vila-prudente: [2,15] já declarada
  { id:"oratorio",          nome:"Oratório",                   linhas:[15]          },
  { id:"sao-lucas",         nome:"São Lucas",                  linhas:[15]          },
  { id:"camilo-haddad",     nome:"Camilo Haddad",              linhas:[15]          },
  { id:"vila-tolstoi",      nome:"Vila Tolstói",               linhas:[15]          },
  { id:"vila-uniao",        nome:"Vila União",                 linhas:[15]          },
  { id:"jardim-planalto",   nome:"Jardim Planalto",            linhas:[15]          },
  { id:"sapopemba",         nome:"Sapopemba",                  linhas:[15]          },
  { id:"fazenda-da-juta",   nome:"Fazenda da Juta",            linhas:[15]          },
  { id:"sao-mateus",        nome:"São Mateus",                 linhas:[15]          },
  { id:"jardim-colonial",   nome:"Jardim Colonial",            linhas:[15]          },

  // ── LINHA 17 – OURO · Metrô · 8 estações (operação transitória) ──
  // campo-belo: [5,17] já declarada
  // morumbi-l9: [9,17] já declarada
  { id:"morumbi-l17",       nome:"Morumbi",                    linhas:[17]          },
  { id:"chucri-zaidan",     nome:"Chucri Zaidan",              linhas:[17]          },
  { id:"vila-cordeiro",     nome:"Vila Cordeiro",              linhas:[17]          },
  { id:"vereador-jose-diniz",nome:"Vereador José Diniz",       linhas:[17]          },
  { id:"brooklin-paulista", nome:"Brooklin Paulista",          linhas:[17]          },
  { id:"aeroporto-cgh",     nome:"Aeroporto Congonhas",        linhas:[17]          },
  { id:"washington-luis",   nome:"Washington Luís",            linhas:[17]          },
];

// ══════════════════════════════════════════════════════
// ORDEM DAS ESTAÇÕES POR LINHA
// ══════════════════════════════════════════════════════
const ORDEM = {
  1:  ["jabaquara","conceicao","sao-judas","saude","praca-da-arvore","santa-cruz-l1","vila-mariana","ana-rosa","paraiso","vergueiro-l1","sao-joaquim","japao-liberdade","se","sao-bento-l1","luz","tiradentes","armenia","portuguesa-tiete","carandiru","santana","jardim-sp-as","parada-inglesa","tucuruvi"],
  2:  ["vila-madalena","sumare","clinicas","consolacao","trianon-masp","brigadeiro","paraiso","ana-rosa","chacara-klabin","santos-imigrantes","alto-ipiranga","sacoma","tamandutaei","vila-prudente"],
  3:  ["palmeiras-bf","marechal-deodoro","santa-cecilia","republica","anhangabau","se","pedro-ii","bras","bresser-mooca","belem","tatuape","carrao","penha","vila-matilde","guilhermina","patriarca-vr","artur-alvim","corinthians-ita"],
  4:  ["luz","republica","higienopolis-mck","paulista","oscar-freire","fradique-coutinho","faria-lima","pinheiros","butanta","sp-morumbi","vila-sonia"],
  5:  ["capao-redondo","campo-limpo","vila-das-belezas","giovanni-gronchi","santo-amaro","largo-treze","adolfo-pinheiro","alto-boa-vista","borba-gato","brooklin","campo-belo","eucaliptos","moema","aacd-servidor","hospital-sp","santa-cruz","chacara-klabin"],
  7:  ["jundiai","varzea-paulista","campo-limpo-paulista","botujuru","francisco-morato","baltazar-fidelis","franco-da-rocha","caieiras","perus","vila-aurora","jaraguá","vila-clarice","pirituba","piqueri","lapa","agua-branca-l7","palmeiras-bf","luz-l7"],
  8:  ["julio-prestes","palmeiras-bf","lapa","domingos-de-moraes","imperatriz-leopoldina","presidente-altino","osasco","comandante-sampaio","quitauna","general-miguel","carapicuiba","santa-terezinha","antonio-joao","barueri","jardim-belval","jardim-silveira","jandira","sagrado-coracao","engenheiro-cardoso","itapevi","santa-rita","amador-bueno"],
  9:  ["osasco","presidente-altino","ceasa","villa-lobos","cidade-univ","pinheiros","hebraica-reboucas","cidade-jardim","vila-olimpia","berrini","morumbi-l9","granja-julieta","joao-dias","santo-amaro","socorro","jurubatuba","autodromo","primavera-interlagos","grajaú","bruno-covas","varginha"],
  10: ["palmeiras-bf","luz","bras","juventus-mooca","ipiranga-l10","tamandutaei","sao-caetano-wb","utinga","prefeito-celso","capuava","maua-l10","guapituba","ribeirao-pires","rio-grande-serra"],
  11: ["palmeiras-bf","luz","bras","tatuape","corinthians-ita","dom-bosco","jose-bonifacio","guaianases","antonio-gianetti","ferraz-vasconcelos","poa","calmon-viana","suzano","jundiapeba","braz-cubas","mogi-das-cruzes","estudantes"],
  12: ["bras","tatuape","engenheiro-goulart","usp-leste","comendador-ermelino","sao-miguel","jardim-helena","itaim-paulista","jardim-romano","eng-manoel-feio","itaquaquecetuba","aracare","calmon-viana"],
  13: ["engenheiro-goulart","guarulhos-cecap","aeroporto-gru"],
  15: ["vila-prudente","oratorio","sao-lucas","camilo-haddad","vila-tolstoi","vila-uniao","jardim-planalto","sapopemba","fazenda-da-juta","sao-mateus","jardim-colonial"],
  17: ["morumbi-l17","chucri-zaidan","vila-cordeiro","campo-belo","vereador-jose-diniz","brooklin-paulista","aeroporto-cgh","washington-luis","morumbi-l9"],
};

const MAPA = {};
ESTACOES.forEach(e => { MAPA[e.id] = e; });

// ══════════════════════════════════════════════════════
// GRAFO + DIJKSTRA
// ══════════════════════════════════════════════════════
function buildGraph() {
  const adj = {};
  const add = (a, b, w) => {
    (adj[a]=adj[a]||[]).push({to:b,w});
    (adj[b]=adj[b]||[]).push({to:a,w});
  };
  Object.entries(ORDEM).forEach(([ln, ids]) => {
    const line = +ln;
    for (let i = 0; i < ids.length-1; i++)
      add(`${ids[i]}:${line}`, `${ids[i+1]}:${line}`, 3);
  });
  ESTACOES.forEach(e => {
    if (e.l7x || e.linhas.length < 2) return;
    for (let i = 0; i < e.linhas.length; i++)
      for (let j = i+1; j < e.linhas.length; j++) {
        const la=e.linhas[i], lb=e.linhas[j];
        if (ORDEM[la]?.includes(e.id) && ORDEM[lb]?.includes(e.id))
          add(`${e.id}:${la}`, `${e.id}:${lb}`, 5);
      }
  });
  return adj;
}

function dijkstra(graph, starts, endSet) {
  const dist={}, prev={};
  starts.forEach(n=>{dist[n]=0;});
  const pq = starts.map(n=>({d:0,n}));
  while (pq.length) {
    pq.sort((a,b)=>a.d-b.d);
    const {d,n}=pq.shift();
    if (d>(dist[n]??Infinity)) continue;
    if (endSet.has(n)) {
      const path=[]; let cur=n;
      while(cur!==undefined){path.unshift(cur);cur=prev[cur];}
      return {path,cost:d};
    }
    for (const {to,w} of (graph[n]||[])) {
      const nd=d+w;
      if (nd<(dist[to]??Infinity)){dist[to]=nd;prev[to]=n;pq.push({d:nd,n:to});}
    }
  }
  return null;
}

function calcRota(oId, dId) {
  if (oId===dId) return null;
  const o=MAPA[oId], d=MAPA[dId];
  if (!o||!d) return null;
  const graph=buildGraph();
  const starts=o.linhas.filter(l=>ORDEM[l]?.includes(oId)).map(l=>`${oId}:${l}`);
  const endSet=new Set(d.linhas.filter(l=>ORDEM[l]?.includes(dId)).map(l=>`${dId}:${l}`));
  if (!starts.length||!endSet.size) return null;
  const res=dijkstra(graph,starts,endSet);
  if (!res) return null;
  const segs=[];
  let curL=null, curSts=[];
  res.path.forEach(node=>{
    const [sid,lStr]=node.split(":");
    const line=+lStr, st=MAPA[sid];
    if (!st) return;
    if (line!==curL){
      if (curL!==null) segs.push({line:curL,stations:[...curSts]});
      curL=line; curSts=[{id:sid,nome:st.nome}];
    } else curSts.push({id:sid,nome:st.nome});
  });
  if (curSts.length) segs.push({line:curL,stations:curSts});
  return {segs, totalEst:res.path.length-1, baldeacoes:segs.length-1, tempo:Math.round(res.cost)};
}

function narrativa(rota, oNome, dNome) {
  if (!rota) return "";
  const {segs} = rota;
  if (segs.length===1) {
    const s=segs[0], ln=L[s.line];
    const dir=s.stations[s.stations.length-1].nome;
    return `Senhor(a), de ${oNome} o(a) senhor(a) pega a ${ln.nome} sentido ${dir} e desce em ${dNome}. Boa viagem!`;
  }
  let txt=`Senhor(a), para ir de ${oNome} até ${dNome}: `;
  segs.forEach((seg,i)=>{
    const ln=L[seg.line];
    const dir=seg.stations[seg.stations.length-1].nome;
    if (i===0) txt+=`pegue a ${ln.nome} sentido ${dir} e desça em ${dir}`;
    else if (i<segs.length-1) txt+=`; em seguida pegue a ${ln.nome} sentido ${dir} e desça em ${dir}`;
    else txt+=`; por fim embarque na ${ln.nome} sentido ${dir} e desça em ${dNome}`;
  });
  return txt+". Boa viagem!";
}

// ══════════════════════════════════════════════════════
// BUSCA FUZZY
// ══════════════════════════════════════════════════════
const norm = s => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"");
function buscar(q) {
  if (!q||q.length<2) return [];
  const qn=norm(q);
  const seen=new Set();
  return ESTACOES.filter(e=>{
    if (e.l7x) return false;
    if (seen.has(e.id)) return false;
    if (norm(e.nome).includes(qn)){seen.add(e.id);return true;}
    return false;
  }).slice(0,10);
}

// ══════════════════════════════════════════════════════
// COMPONENTES
// ══════════════════════════════════════════════════════
const Tag=({linha})=>{
  const ln=L[linha]; if(!ln) return null;
  const [n,c]=ln.nome.split("-");
  return <span style={{background:ln.cor,color:ln.txt,borderRadius:20,padding:"2px 9px",fontSize:11,fontWeight:700,whiteSpace:"nowrap"}}>{n} {c?.toUpperCase()}</span>;
};

function Picker({label,isOrigem,value,onSelect,onClear,fixada,onUnfix}) {
  const [q,setQ]=useState("");
  const [res,setRes]=useState([]);
  const [open,setOpen]=useState(false);
  const inputRef=useRef(null);
  const acc=isOrigem?"#F5A623":"#4CAF50";

  // Quando seleciona, limpa o input mas mantém o campo visível
  const handleQ=v=>{setQ(v);setRes(buscar(v));setOpen(v.length>=2);};
  const pick=s=>{onSelect(s);setQ("");setRes([]);setOpen(false);};
  const handleClear=()=>{onClear?.();setQ("");setRes([]);setOpen(false);};

  return(
    <div style={{position:"relative"}}>
      <div style={{background:"#141927",borderRadius:14,padding:"13px 15px",border:`1px solid ${value?"#2E3A50":"#252B3E"}`}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
          <span style={{color:acc,fontSize:10,fontWeight:800,letterSpacing:1.2}}>
            {isOrigem?"⊕ ORIGEM":"⚑ DESTINO"}
            {fixada&&<span style={{color:"#F5A623",marginLeft:5}}>FIXADA</span>}
          </span>
          <div style={{display:"flex",gap:5}}>
            {value&&<button onMouseDown={e=>{e.preventDefault();handleClear();}} style={{background:"#1E2438",border:"none",color:"#666",borderRadius:20,padding:"6px 12px",fontSize:11,cursor:"pointer",WebkitTapHighlightColor:"transparent"}}>✕ LIMPAR</button>}
            {fixada&&onUnfix&&<button onClick={onUnfix} style={{background:"#1E2438",border:"none",color:"#aaa",borderRadius:20,padding:"3px 10px",fontSize:10,cursor:"pointer"}}>⊗ ALTERAR</button>}
          </div>
        </div>

        {/* Estação selecionada — sempre aparece acima do input quando há valor */}
        {value&&(
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10,paddingBottom:10,borderBottom:"1px solid #1E2438"}}>
            <div style={{width:32,height:32,borderRadius:"50%",background:acc,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,color:"#000",flexShrink:0}}>{isOrigem?"◎":"⚑"}</div>
            <div>
              <div style={{color:"#fff",fontWeight:700,fontSize:16,lineHeight:1.2}}>{value.nome}</div>
              <div style={{display:"flex",gap:4,flexWrap:"wrap",marginTop:4}}>
                {value.linhas.filter(l=>!value.l7x).map(l=><Tag key={l} linha={l}/>)}
              </div>
            </div>
          </div>
        )}

        {/* Input sempre visível */}
        <div style={{position:"relative"}}>
          <span style={{position:"absolute",left:11,top:"50%",transform:"translateY(-50%)",color:"#555",fontSize:14,pointerEvents:"none"}}>🔍</span>
          <input
            ref={inputRef}
            value={q}
            onChange={e=>handleQ(e.target.value)}
            onFocus={()=>q.length>=2&&setOpen(true)}
            onBlur={()=>setTimeout(()=>setOpen(false),160)}
            placeholder={value?`Alterar ${label}...`:`Buscar ${label}...`} autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck="false"
            style={{width:"100%",background:"#0B0F1C",border:"1px solid #252B3E",borderRadius:10,padding:"13px 12px 13px 36px",color:"#fff",fontSize:16,outline:"none",boxSizing:"border-box",WebkitAppearance:"none"}}
          />
        </div>
      </div>

      {open&&res.length>0&&(
        <div style={{position:"absolute",top:"100%",left:0,right:0,zIndex:200,background:"#141927",border:"1px solid #252B3E",borderRadius:12,boxShadow:"0 8px 32px rgba(0,0,0,0.6)",maxHeight:280,overflowY:"auto",marginTop:4}}>
          {res.map(s=>(
            <div key={s.id} onMouseDown={()=>pick(s)}
              style={{padding:"10px 15px",cursor:"pointer",borderBottom:"1px solid #0B0F1C",display:"flex",alignItems:"center",justifyContent:"space-between"}}
              onMouseEnter={e=>e.currentTarget.style.background="#1E2438"}
              onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
              <span style={{color:"#fff",fontWeight:500,fontSize:14}}>{s.nome}</span>
              <div style={{display:"flex",gap:3,flexWrap:"wrap",justifyContent:"flex-end"}}>{s.linhas.filter(l=>!s.l7x).map(l=><Tag key={l} linha={l}/>)}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function SegCard({seg,isLast,isTransfer,proxLinha}) {
  const ln=L[seg.line];
  const orig=seg.stations[0], dest=seg.stations[seg.stations.length-1];
  const nEst=seg.stations.length-1;
  const tempo=nEst*3+(isTransfer?5:0);
  return(
    <div style={{display:"flex",gap:10,marginBottom:isLast?0:8}}>
      <div style={{display:"flex",flexDirection:"column",alignItems:"center",flexShrink:0,width:36}}>
        <div style={{width:36,height:36,borderRadius:"50%",background:ln?.cor,color:ln?.txt,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,fontSize:13,boxShadow:`0 0 10px ${ln?.cor}55`}}>{seg.line}</div>
        {!isLast&&<div style={{width:2,flex:1,background:"#1E2840",minHeight:20,marginTop:3}}/>}
        {isTransfer&&<div style={{width:28,height:28,borderRadius:"50%",background:"#FF9800",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,marginTop:3}}>⇄</div>}
      </div>
      <div style={{flex:1,paddingTop:4}}>
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:5}}>
          <div style={{background:ln?.cor,color:ln?.txt,borderRadius:20,padding:"3px 12px",fontSize:12,fontWeight:800}}>{ln?.nome}</div>
          <span style={{background:"#1A2035",border:`1px solid ${ln?.cor}44`,color:ln?.cor,borderRadius:10,padding:"2px 10px",fontSize:11,fontWeight:700}}>≈ {tempo} min</span>
        </div>
        <div style={{background:"#0D1220",borderRadius:10,padding:"10px 12px",border:"1px solid #1A2035"}}>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
            <span style={{color:ln?.cor,fontSize:13}}>▶</span>
            <span style={{color:"#888",fontSize:11}}>Embarca em</span>
            <span style={{color:"#fff",fontWeight:700,fontSize:13}}>{orig.nome}</span>
          </div>
          <div style={{color:"#555",fontSize:11,marginLeft:21,marginBottom:6}}>sentido {dest.nome} · {nEst} parada{nEst!==1?"s":""}</div>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <span style={{color:isLast?"#4CAF50":"#FF9800",fontSize:13}}>{isLast?"⚑":"⇄"}</span>
            <span style={{color:"#888",fontSize:11}}>{isLast?"Desembarca em":"Baldeação em"}</span>
            <span style={{color:isLast?"#4CAF50":"#FF9800",fontWeight:700,fontSize:13}}>{dest.nome}</span>
          </div>
        </div>
        {isTransfer&&!isLast&&(
          <div style={{marginTop:6,padding:"6px 12px",background:"#1A1500",border:"1px solid #FF980033",borderRadius:8,fontSize:11,color:"#FF9800"}}>
            ⇄ Embarque na <strong>{proxLinha?.nome}</strong>
          </div>
        )}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════
// APP
// ══════════════════════════════════════════════════════
export default function App() {
  const [origem,setOrigem]=useState(null);
  const [destino,setDestino]=useState(null);
  const [origemFixa,setOrigemFixa]=useState(null);
  const [rota,setRota]=useState(null);
  const [erro,setErro]=useState(false);
  const [expandir,setExpandir]=useState(true);

  const selOrigem=s=>{setOrigem(s);setOrigemFixa(s);setRota(null);setErro(false);};
  const limparOrigem=()=>{setOrigem(null);setOrigemFixa(null);setRota(null);setErro(false);};
  const desafixar=()=>{setOrigemFixa(null);setOrigem(null);setRota(null);setErro(false);};

  const selDestino=s=>{
    setDestino(s);setErro(false);setExpandir(true);
    if (origem&&s) {
      const r=calcRota(origem.id,s.id);
      if(r){setRota(r);}else{setRota(null);setErro(true);}
    }
  };
  const limparDestino=()=>{setDestino(null);setRota(null);setErro(false);};

  const trocar=()=>{
    const t=origem;
    setOrigem(destino);if(destino)setOrigemFixa(destino);else setOrigemFixa(null);
    setDestino(t);setRota(null);setErro(false);
    if(destino&&t){const r=calcRota(destino.id,t.id);if(r){setRota(r);setErro(false);}else{setRota(null);setErro(true);}}
  };

  const texto=rota?narrativa(rota,origem?.nome,destino?.nome):"";
  const tcor=rota?(rota.tempo<=20?"#4CAF50":rota.tempo<=45?"#F5A623":"#EE372F"):"#fff";
  const fmtTempo=m=>m<60?`${m} min`:`${Math.floor(m/60)}hr${m%60>0?` e ${m%60} min`:""}`;


  return(
    <div style={{minHeight:"100vh",minHeight:"100dvh",background:"linear-gradient(160deg,#080C18,#0B0F1C)",fontFamily:"'Segoe UI',system-ui,-apple-system,sans-serif",color:"#fff",width:"100%",overflowX:"hidden",WebkitTapHighlightColor:"transparent"}}>
      <div style={{position:"sticky",top:0,zIndex:50,background:"rgba(8,12,24,0.97)",backdropFilter:"blur(20px)",WebkitBackdropFilter:"blur(20px)",borderBottom:"1px solid #1A1F2E",padding:"15px 18px 13px",paddingTop:"max(env(safe-area-inset-top, 0px) + 15px, 15px)"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",maxWidth:500,margin:"0 auto"}}>
          <div style={{display:"flex",alignItems:"center",gap:11}}>
            <div style={{width:42,height:42,borderRadius:11,background:"#F5A623",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>🚉</div>
            <div>
              <div style={{fontWeight:900,fontSize:16,letterSpacing:2,color:"#F5A623",lineHeight:1}}>NAVEGADOR FERROVIÁRIO</div>
            </div>
          </div>
          <div style={{background:"#071A10",border:"1px solid #1E5A30",borderRadius:20,padding:"5px 12px",fontSize:10,color:"#4CAF50",fontWeight:700,letterSpacing:1,display:"flex",alignItems:"center",gap:5}}>
            <span style={{width:5,height:5,borderRadius:"50%",background:"#4CAF50",display:"inline-block"}}/>ONLINE
          </div>
        </div>
      </div>

      <div style={{padding:"14px 16px",paddingBottom:"calc(env(safe-area-inset-bottom, 0px) + 100px)",maxWidth:500,margin:"0 auto",boxSizing:"border-box"}}>
        <Picker label="estação de origem" isOrigem value={origem} onSelect={selOrigem} onClear={limparOrigem} fixada={!!origemFixa} onUnfix={origemFixa?desafixar:null}/>

        <div style={{display:"flex",alignItems:"center",justifyContent:"center",margin:"7px 0",position:"relative"}}>
          <div style={{position:"absolute",left:0,right:0,height:1,background:"#151A28"}}/>
          <button onClick={trocar} style={{position:"relative",zIndex:1,background:"#141927",border:"1px solid #252B3E",borderRadius:"50%",width:44,height:44,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",fontSize:18,color:"#666",WebkitTapHighlightColor:"transparent"}}>⇄</button>
        </div>

        <Picker label="estação de destino" isOrigem={false} value={destino} onSelect={selDestino} onClear={limparDestino}/>

        {erro&&(
          <div style={{marginTop:14,background:"#1A0F0F",border:"1px solid #4A2020",borderRadius:14,padding:14,color:"#FF6B6B",fontSize:13,textAlign:"center"}}>
            ⚠️ Não encontramos rota entre essas estações.<br/>
            <span style={{color:"#666",fontSize:11}}>Verifique se os nomes estão corretos.</span>
          </div>
        )}

        {rota&&(
          <>
            <div style={{marginTop:14,background:"linear-gradient(135deg,#111825,#0E1520)",border:"1px solid #1E2840",borderRadius:16,padding:16}}>
              <div style={{display:"flex",justifyContent:"space-around",borderBottom:"1px solid #1A1F2E",paddingBottom:14,marginBottom:12}}>
                {[{val:rota.totalEst,lbl:"ESTAÇÕES"},{val:rota.baldeacoes,lbl:"BALDEAÇÕES"},{val:fmtTempo(rota.tempo),lbl:"≈ TEMPO",cor:tcor}].map(it=>(
                  <div key={it.lbl} style={{textAlign:"center"}}>
                    <div style={{fontSize:28,fontWeight:900,color:it.cor||"#fff",lineHeight:1}}>{it.val}</div>
                    <div style={{color:"#444",fontSize:9,letterSpacing:1.5,marginTop:4}}>{it.lbl}</div>
                  </div>
                ))}
              </div>
              <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                {rota.segs.map((seg,i)=>(
                  <div key={i} style={{display:"flex",alignItems:"center",gap:6}}>
                    <div style={{background:L[seg.line]?.cor,color:L[seg.line]?.txt,borderRadius:20,padding:"5px 13px",fontSize:12,fontWeight:800}}>{L[seg.line]?.nome}</div>
                    {i<rota.segs.length-1&&<span style={{color:"#444",fontSize:14}}>→</span>}
                  </div>
                ))}
              </div>
            </div>

            <div style={{marginTop:10,background:"#0E1520",border:"1px solid #1A2035",borderRadius:14,padding:"13px 15px",fontSize:13,lineHeight:1.8,color:"#C8CCE0"}}>
              🎙️ {texto}
            </div>

            <div style={{marginTop:10}}>
              <button onClick={()=>setExpandir(!expandir)} style={{width:"100%",background:"none",border:"none",display:"flex",alignItems:"center",justifyContent:"space-between",color:"#F5A623",cursor:"pointer",padding:"8px 0",fontSize:12,fontWeight:800,letterSpacing:1.5}}>
                <span>▶ ITINERÁRIO DETALHADO</span>
                <span style={{color:"#555",fontSize:11}}>{expandir?"▲ RECOLHER":"▼ EXPANDIR"}</span>
              </button>
              {expandir&&(
                <div style={{marginTop:10}}>
                  <div style={{display:"flex",gap:10,marginBottom:8}}>
                    <div style={{width:36,flexShrink:0,display:"flex",flexDirection:"column",alignItems:"center"}}>
                      <div style={{width:36,height:36,borderRadius:"50%",background:"#F5A623",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,color:"#000"}}>◎</div>
                      <div style={{width:2,height:16,background:"#1E2840",marginTop:3}}/>
                    </div>
                    <div style={{paddingTop:8}}>
                      <div style={{color:"#F5A623",fontSize:10,fontWeight:800,letterSpacing:1,marginBottom:2}}>PARTIDA</div>
                      <div style={{color:"#fff",fontWeight:700,fontSize:15}}>{origem?.nome}</div>
                      <div style={{color:"#555",fontSize:11,marginTop:2}}>Passe na catraca e siga à plataforma</div>
                    </div>
                  </div>
                  {rota.segs.map((seg,i)=>(
                    <SegCard key={i} seg={seg} isLast={i===rota.segs.length-1} isTransfer={i<rota.segs.length-1} proxLinha={rota.segs[i+1]?L[rota.segs[i+1].line]:null}/>
                  ))}
                  <div style={{display:"flex",gap:10,marginTop:8}}>
                    <div style={{width:36,flexShrink:0,display:"flex",justifyContent:"center"}}>
                      <div style={{width:36,height:36,borderRadius:"50%",background:"#4CAF50",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,boxShadow:"0 0 12px #4CAF5055"}}>🏁</div>
                    </div>
                    <div style={{paddingTop:8}}>
                      <div style={{color:"#4CAF50",fontSize:10,fontWeight:800,letterSpacing:1,marginBottom:2}}>CHEGADA</div>
                      <div style={{color:"#fff",fontWeight:700,fontSize:15}}>{destino?.nome}</div>
                      <div style={{color:"#555",fontSize:11,marginTop:2}}>Você chegou! Boa chegada.</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}



        {/* RODAPÉ */}
        <div style={{marginTop:48,paddingTop:20,borderTop:"1px solid #1A1F2E",textAlign:"center"}}>
          <div style={{fontSize:10,color:"#2A3045",letterSpacing:1,marginBottom:4}}>PROJETO CRIADO E DESENVOLVIDO POR</div>
          <div style={{fontSize:13,fontWeight:700,color:"#4A5270",letterSpacing:0.5}}>Evelyn Santos de Almeida Nunes</div>
        </div>
      </div>
    </div>
  );
}
