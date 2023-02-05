import { PrismaClient } from "@prisma/client";
import { RanksHelper } from "../src/helpers/ranks.helper";

const prisma = new PrismaClient();

async function main() {
  await createRanks();
  await createChannels();
  await createUsersAndStories();
}

async function createUsersAndStories() {
  const haveUsers = await prisma.users.count();

  if (haveUsers) {
    console.log({ message: "O banco já está populado com os Usuários e Histórias!" });
    return;
  }

  const ranks = await prisma.ranks.findMany();
  const channelAventura = await prisma.channels.findFirst({ where: { name: "Aventura" } });
  const channelTerror = await prisma.channels.findFirst({ where: { name: "Terror" } });
  const channelRomance = await prisma.channels.findFirst({ where: { name: "Romance" } });

  await prisma.users.create({
    data: {
      username: "rick",
      avatar: "https://static.tvtropes.org/pmwiki/pub/images/abcb6534_7913_4eb1_a7a5_62b081ebc628.png",
      email: "rick@email.com",
      password: "rick@semmorty",
      rankId: ranks[5].id,
      about: "Sempre gostei de contar histórias para o Morty.",
      Stories: {
        createMany: {
          data: [
            {
              title: "Uma visita leonina",
              body: "[por Breno Brito] Em um mundo parecido com o nosso, há um país com a mesma cara que o nosso e, em sua maioria, os mesmos problemas. A vital diferença é de que nesse mundo se enfrentava um terrível problema a mais. Havia naquelas paragens uma “epidemia” de ataques de leões. Muitos diziam não saber o porquê dos ataques ocorrerem, e o pior, preferiam ignorar que maioria dos ataques ocorriam em casa. Os leões pareciam se materializar entre as famílias, inclusive as ditas ajustadas, e fazer vítimas mortais. Quando não resultava em morte, os ataques deixavam as vítimas marcadas e traumatizadas pelo resto da vida. O pior, havia um modus operandi aos leões, uma predileção por crianças e mulheres.",
              channelId: channelAventura?.id || 1,
            },
            {
              title: "Através da chuva",
              body: `[por Adele Lazarin] Para onde ir quando não se tem ninguém?
              Lisa girou a maçaneta e correu para fora de casa com um único pensamento em mente: fugir. Não sabia aonde devia ir, apenas que precisava fugir. Deixou a porta aberta e pulou o último degrau da escadinha que conduzia ao jardim, caindo em uma poça de lama criada pela chuva e sujando as galochas vermelhas.
              Olhou por apenas um segundo para as botas feitas de borracha e decidiu que estar impecavelmente limpa não era tão importante assim. Um pouco de lama lhe caía bem. Outro segundo e já estava com a sombrinha nos ombros, quase tão grande quanto seu corpo miúdo, a cor berrante combinando com as galochas.`,
              channelId: channelAventura?.id || 1,
            },
            {
              title: "Um levante na noite",
              body: `[por Tiara Gonçalves] Havia uma goteira no abrigo. Uma goteira insistente que, mesmo após a tempestade ter se dissipado, persistia. Itta contava as gotas que caíam e agradecia internamente por aquela ser a única goteira. Nas últimas chuvas, o teto quase cedera e tiveram que passar muito tempo substituindo a madeira velha, que cobria o local abafado sem janelas e com portas reforçadas. Seu abrigo e prisão nos últimos três anos.
              Ela rolou no chão de terra batida, procurando uma posição menos desconfortável. O dia fora longo. Os capatazes os fizeram trabalhar além do horário, pareciam ter pressa em extrair os minérios. Muita pressa.`,
              channelId: channelAventura?.id || 1,
            },
          ],
        },
      },
    },
  });

  await prisma.users.create({
    data: {
      username: "jeffinho",
      avatar: "https://static.tvtropes.org/pmwiki/pub/images/img_9017.JPG",
      email: "jefftthekiller@email.com",
      password: "gotosleep",
      rankId: ranks[4].id,
      about: "Minhas vítimas sempre adoraram minhas histórias :)",
      Stories: {
        createMany: {
          data: [
            {
              title: "A cachorra que vê espíritos",
              body: `[por Victória Koehler] Minha cachorra tem uma mania muito feia de arranhar a porta do quarto no meio da noite. Um dia ela não parava de arranhar a porta de jeito nenhum. Depois de chamar ela umas cinco vezes, joguei um travesseiro na porta pra fazer ela parar. Aí foi quando ela latiu. Do meu lado. Ela tava do meu lado o tempo todo`,
              channelId: channelTerror?.id || 1,
            },
            {
              title: "Vultos descendo do teto",
              body: `[por Alba Eres] Quando eu era pequena, toda noite quando as luzes eram apagadas e eu ia dormir, dois vultos desciam do teto na entrada do quarto. Andavam calmamente até minha cama e cada um ficava de um lado da minha cabeceira, me olhando. Eu cobria a cabeça com o cobertor. Até que um dia tive coragem de contar pra minha mãe. Ela colocou um abajur e me disse para rezar e pedir para eles irem embora. Até hoje durmo com um abajur acesso`,
              channelId: channelTerror?.id || 1,
            },
            {
              title: "Cafuné de espírito",
              body: `[por Ernami] Meu pai morreu em 1996, eu tinha então 10 anos e meu irmão, 12. Dormíamos num beliche no quarto, ele na cama de cima e eu na debaixo. Numa noite, acordei no meio da madrugada com alguém fazendo um cafuné na minha cabeça. Achei que era meu irmão. Voltei a dormir, voltou o cafuné. Levantei da cama e briguei com meu irmão, que roncava tranquilamente. Voltei a deitar e o cafuné veio pela terceira vez. Nunca rezei tanto na minha vida. Rezei até o raiar do sol`,
              channelId: channelTerror?.id || 1,
            },
          ],
        },
      },
    },
  });

  await prisma.users.create({
    data: {
      username: "gabi",
      avatar:
        "https://img.freepik.com/fotos-gratis/3d-rendem-de-uma-arvore-assustador-de-encontro-a-uma-lua_1048-2912.jpg?",
      email: "gabi@email.com",
      password: "gabizinha123",
      rankId: ranks[3].id,
      about: "Amo histórias <3",
      Stories: {
        createMany: {
          data: [
            {
              title: "Destinos cruzados",
              body: `[por Gabriela Echelon] Meu pai conheceu a minha mãe no dia em que ela nasceu. A avó dele era a parteira e ajudou a trazer a minha mãe ao mundo. Meu pai estava na casa da avó na hora que ela foi chamada pra fazer o parto. Como ela não podia deixar ele sozinho, ela selou um cavalo, colocou ele na garupa e foi até a casa onde minha mãe nasceu.
              Meu pai até hoje conta que lembra de ouvir o choro quando ela nasceu. Na adolescência eles começaram a namorar, ficaram casados por 10 anos até que perdemos a minha mãe pra um aneurisma. Hoje, 18 anos depois, quando alguém pergunta pro meu pai se ele não vai arrumar uma namorada, ele responde que não e que o amor da vida dele foi só um e não tem outra que caiba no lugar da minha mãe`,
              channelId: channelRomance?.id || 1,
            },
          ],
        },
      },
    },
  });

  console.log({
    inserted: { usersCreated: 3, storiesCreated: 7 },
  });
}

async function createRanks() {
  const haveRanks = await prisma.ranks.count();

  if (haveRanks) {
    console.log({ message: "O banco já está populado com os Ranks!" });
    return;
  }

  const insertedRanks = await prisma.ranks.createMany({
    data: [
      RanksHelper.LEVEL_1,
      RanksHelper.LEVEL_2,
      RanksHelper.LEVEL_3,
      RanksHelper.LEVEL_4,
      RanksHelper.LEVEL_5,
      RanksHelper.LEVEL_6,
      RanksHelper.LEVEL_7,
    ],
  });

  console.log({
    inserted: { ranksCreated: insertedRanks.count },
  });
}

async function createChannels() {
  const haveChannels = await prisma.channels.count();

  if (haveChannels) {
    console.log({ message: "O banco já está populado com os Canais!" });
    return;
  }

  const insertedChannels = await prisma.channels.createMany({
    data: [
      {
        name: "Terror",
        background:
          "https://static.vecteezy.com/ti/fotos-gratis/p3/6307115-conceito-de-filme-de-terror-gratis-foto.jpg",
      },
      {
        name: "Romance",
        background: "https://thumbs.dreamstime.com/b/romance-na-praia-19342830.jpg",
      },
      {
        name: "Aventura",
        background:
          "https://foradazonadeconforto.com/wp-content/uploads/2019/09/Viagens-de-aventura-pelo-mundo-e1568488207333.jpg",
      },
      {
        name: "Policial",
        background: "https://360compliance.com.br/wp-content/uploads/2022/04/290bc190-e606-11ea-869e-d31b12be49e9.jpeg",
      },
      {
        name: "Infantil",
        background: "https://i.ytimg.com/vi/A3Do-egcj0c/maxresdefault.jpg",
      },
    ],
  });

  console.log({
    inserted: { channelsCreated: insertedChannels.count },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
