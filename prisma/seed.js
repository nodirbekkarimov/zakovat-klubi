const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database with ALL real tournament Zakovat questions...');

  await prisma.userAnswer.deleteMany();
  await prisma.userAchievement.deleteMany();
  await prisma.achievement.deleteMany();
  await prisma.question.deleteMany();
  await prisma.category.deleteMany();
  await prisma.dailyChallenge.deleteMany();
  await prisma.user.deleteMany();

  const catHistory = await prisma.category.create({
    data: {
      name: 'Tarix va Madaniyat',
      slug: 'tarix',
      icon: 'Landmark',
      description: 'Tarixiy voqealar, imperiyalar va jahon sivilizatsiyasi.',
    },
  });

  const catScience = await prisma.category.create({
    data: {
      name: 'Ilm-fan va Texnologiya',
      slug: 'fan-texnika',
      icon: 'Atom',
      description: 'Fizika, kimyo, koinot va kashfiyotlar.',
    },
  });

  const catLit = await prisma.category.create({
    data: {
      name: 'Adabiyot va San\'at',
      slug: 'adabiyot',
      icon: 'BookOpen',
      description: 'She\'riyat, nasr, kinomatografiya va teatr.',
    },
  });

  const catLogic = await prisma.category.create({
    data: {
      name: 'Mantiq va Topishmoqlar',
      slug: 'mantiq',
      icon: 'BrainCircuit',
      description: 'Turnir zakovat savollari va mantiqiy ilmoqlar.',
    },
  });

  const catGeo = await prisma.category.create({
    data: {
      name: 'Geografiya va Olam',
      slug: 'geografiya',
      icon: 'Globe',
      description: 'Mamlakatlar, poytaxtlar, urf-odatlar va dunyo mo‘jizalari.',
    },
  });

  const achievements = [
    { key: 'FIRST_WIN', name: "Birinchi G'alaba", description: "Birinchi zakovat savoliga to'g'ri javob berdingiz.", icon: 'Trophy', xpBonus: 100 },
    { key: 'STREAK_5', name: "Olovli Seriya", description: "Ketma-ket 5 kun davomida o'yinda qatnashdingiz.", icon: 'Flame', xpBonus: 250 },
    { key: 'PERFECT_SCORE', name: "Mukammal Aql", description: "O'yinda 100% natija bilan g'olib bo'ldingiz.", icon: 'Zap', xpBonus: 300 },
    { key: 'SPEED_DEMON', name: "Yashin Tezligi", description: "Savolga 10 soniyadan kam vaqtda to'g'ri javob berdingiz.", icon: 'Timer', xpBonus: 200 },
    { key: 'SCHOLAR', name: "Zakovat Allomasi", description: "Jami 50 ta savolga to'g'ri javob berdingiz.", icon: 'GraduationCap', xpBonus: 500 },
  ];

  for (const ach of achievements) {
    await prisma.achievement.create({ data: ach });
  }

  const hashedPassword = await bcrypt.hash('admin123', 10);
  await prisma.user.create({
    data: {
      name: 'Zakovat Administrator',
      email: 'admin@zakovat.uz',
      password: hashedPassword,
      role: 'ADMIN',
      level: 25,
      xp: 15400,
      streak: 12,
      maxStreak: 15,
      totalGames: 45,
      correctAnswers: 210,
    },
  });

  const userPassword = await bcrypt.hash('user123', 10);
  await prisma.user.create({
    data: {
      name: 'Alisher Navoiy',
      email: 'user@zakovat.uz',
      password: userPassword,
      role: 'USER',
      level: 8,
      xp: 3200,
      streak: 4,
      maxStreak: 6,
      totalGames: 18,
      correctAnswers: 64,
    },
  });

  const defaultHints = JSON.stringify(["Mantiqiy o'ylang va savol matniga e'tibor bering.", "Muallif ishorasi va kalit so'zlarga diqqat qiling."]);

  const questionsData = [
    {
      text: "Midzaru, Kikadzaru va Ivadzaru ismli maymunlar tasvirlangan 3 maymun rasmini barchangiz bilasiz. Biri ko'rmaydi, biri eshitmaydi, biri gapirmaydi. Karikaturalardan birida to'rtinchi maymun ham tasvirlangan bo'lib, unda yuqoridagi xususiyatlarning barchasi jamlangan: hech narsani ko'rmaydi, hech narsani eshitmaydi, hech narsani gapirmaydi. Diqqat savol: To'rtinchi maymun nima bilan tasvirlangan?",
      answer: "Telefon",
      acceptableAnswers: JSON.stringify(["Smartfon", "Telefon bilan", "Mobil telefon"]),
      keywords: JSON.stringify(["telefon", "smartfon"]),
      difficulty: "MEDIUM",
      categoryId: catLogic.id,
      hints: defaultHints,
      explanation: "Umid qilamizki, oramizda to'rtinchi maymunchalar yo'q! Telefon tutgan maymun atrofni ko'rmaydi ham, eshitmaydi ham.",
      source: "Zakovat Paket - 1-savol",
    },
    {
      text: "Kalamush va sichqonlar turli sohalarda zarar keltirishadi. Ular tomonidan turli manbalar yaroqsiz holga keltirilavergach, zarar hajmini kamaytirish maqsadida UNI o'ylab topishgan. 2001-yilda ilk bora nashr etilgan bestseller asar nomida ham UNI ko'rish mumkin. Bu asar muallifini yozib bering!",
      answer: "O'tkir Hoshimov",
      acceptableAnswers: JSON.stringify(["Utkir Hoshimov", "O.Hoshimov", "Hoshimov"]),
      keywords: JSON.stringify(["hoshimov", "o'tkir"]),
      difficulty: "HARD",
      categoryId: catLit.id,
      hints: defaultHints,
      explanation: "U - daftar hoshiyasi. Sichqonlar kitob va daftarlarning chetini kemirib tashlagan bo'sh hoshiyalar qoldirilgan. 2001-yilda 'Daftar hoshiyasidagi bitiklar' asarini O'tkir Hoshimov yozgan.",
      source: "Zakovat Paket - 2-savol",
    },
    {
      text: "1979-yilda Germaniyaning Lego zavodida g'ayrioddiy bir an'ana paydo bo'ldi. Zavodda 25 yildan ortiq ishlaganlarga kichik hajmli qog'oz Lego o'yinchoqlari berila boshlandi. Marko Poloning yozishicha, butun dunyo odamlari oltin talvasasida yurgan bir paytda bu xalq BU ISHNI (Oltinni qog'ozga almashtirish) qilgan. Diqqat savol: O'sha xalqni yozib bering!",
      answer: "Xitoyliklar",
      acceptableAnswers: JSON.stringify(["Xitoy", "Xitoy xalqi"]),
      keywords: JSON.stringify(["xitoy", "xitoyliklar"]),
      difficulty: "HARD",
      categoryId: catHistory.id,
      hints: defaultHints,
      explanation: "Lego zavodida oltindan yasalgan bo'laklar beriladi. Xitoyliklar esa pul sifatida oltinni qog'oz pulga almashtirishgan.",
      source: "Zakovat Paket - 3-savol",
    },
    {
      text: "Tarqatma material: U Qo'ziqorin qirolligiga qirolicha Pichni izlab yo'lga chiqadi. Qirolichani yovuz Bouzer 8-qal'aga qamab qo'ygan. Davron Ergashev klipida ham bu obraz aks etgan. Bu qahramonning ismi nima?",
      answer: "Mario",
      acceptableAnswers: JSON.stringify(["Super Mario"]),
      keywords: JSON.stringify(["mario"]),
      difficulty: "EASY",
      categoryId: catLit.id,
      hints: defaultHints,
      explanation: "Super Mario Bros o'yini syujeti. Qo'shiqchi Davron Ergashev 'Mario' klipida ushbu rolni ijro etgan.",
      source: "Zakovat Paket - 4-savol",
    },
    {
      text: "Afsonaga ko'ra, uch sayyoh yo'lda uchrashib qolibdi. Birida go'sht va un, birida suv va tova, birida sabzavotlar bor edi. Masalliqlarni jamlash orqali ilk bora U tayyorlangan. 'Subyektiv' ko'rsatuvining firibgar biznes-trenerlarga bag'ishlangan sonida Jamshidxon Ziyoxonov qulog'ida U bilan tasvirlangan. UNI yozib bering!",
      answer: "Lag'mon",
      acceptableAnswers: JSON.stringify(["Lagmon", "Lag'mon taomi"]),
      keywords: JSON.stringify(["lag'mon", "lagmon"]),
      difficulty: "MEDIUM",
      categoryId: catHistory.id,
      hints: defaultHints,
      explanation: "Subyektivda biznes-trenerlarning 'quloqqa lag'mon osish' ishiga ishora qilingan.",
      source: "Zakovat Paket - 5-savol",
    },
    {
      text: "2001-yilda Niyozov davrida Turkmanistonda BU ISHNI QILISH uchun 50 ming dollar to'lash shart edi. Muhammad Yusuf o'z she'rida agar o'zbek qizini topa olmasa, shu ishni qilishini aytgan va buni Oxunjon Madaliyev kuylagan. Diqqat savol: BU ISHNI QILISH nima?",
      answer: "Turkman qizga uylanish",
      acceptableAnswers: JSON.stringify(["Turkmanistondan qiz olish", "Turkman qiziga uylanish"]),
      keywords: JSON.stringify(["turkman", "uylanish"]),
      difficulty: "HARD",
      categoryId: catHistory.id,
      hints: defaultHints,
      explanation: "Oxunjon Madaliyev 'Turkman qizga uylanaman' qo'shig'ini kuylagan.",
      source: "Zakovat Paket - 6-savol",
    },
    {
      text: "Bu davlatning shiori 'Tanindrazana, Fahafahana, Fandrosoana' bo'lib, o'zbekchasi 'Vatan, Ozodlik, Taraqqiyot'. Sevimli ichimligi ranunampangu, sobiq prezidenti Mark Ravalumanana. Diqqat savol: Bu davlat nomi va poytaxtini yozib bering!",
      answer: "Madagaskar; Antananarivu",
      acceptableAnswers: JSON.stringify(["Madagaskar Antananarivu", "Madagaskar, Antananarivo"]),
      keywords: JSON.stringify(["madagaskar", "antananarivu"]),
      difficulty: "HARD",
      categoryId: catGeo.id,
      hints: defaultHints,
      explanation: "Madagaskar davlati va uning poytaxti Antananarivu.",
      source: "Zakovat Paket - 7-savol",
    },
    {
      text: "Erkin Vohidovning 'Kelajakka maktub' she'ridan: Ivan Vasilyevich o'g'lini temir aso bilan urib farzand qoniga qo'lini bo'yaydi. She'r davomida bundan yarim asr ilgari yuz bergan otaning farzandi uchun o'z hayotini fido qilgan teskari voqea eslanadi. Diqqat savol: O'sha teskari voqeaning ikki qatnashchisi kimlar?",
      answer: "Bobur va Humoyun",
      acceptableAnswers: JSON.stringify(["Zahiriddin Muhammad Bobur va Humoyun", "Bobur, Humoyun"]),
      keywords: JSON.stringify(["bobur", "humoyun"]),
      difficulty: "MEDIUM",
      categoryId: catLit.id,
      hints: defaultHints,
      explanation: "Bobur Mirzo betob o'g'li Humoyun uchun Allohdan uning jonini o'ziga berishni so'rab, o'z hayotini fido qilgan.",
      source: "Zakovat Paket - 8-savol",
    },
    {
      text: "O'zbek urf-odatlariga ko'ra, sovchilikka borganda kuyovning onasi yonida doimo yana bir ayol (xolasi, ammasi yoki qo'shnisi) bo'lishi shart. Diqqat savol: Onalar nimadan qochish maqsadida o'z yoniga yana bir ayolni qo'shib olishadi?",
      answer: "O'z o'g'lini maqtamaslik uchun",
      acceptableAnswers: JSON.stringify(["O'g'lini o'zi maqtamaslik uchun", "O'z o'g'lini maqtash odobsizlik bo'lgani uchun"]),
      keywords: JSON.stringify(["maqtamaslik", "o'g'lini"]),
      difficulty: "EASY",
      categoryId: catLogic.id,
      hints: defaultHints,
      explanation: "O'zbek odobiga ko'ra o'z o'g'lini maqtash uyat hisoblanadi, shuning uchun yigitning fazilatlarini hamroh ayol aytib beradi.",
      source: "Zakovat Paket - 9-savol",
    },
    {
      text: "King-Kong filmining so'ngida: 'It wasn't the airplanes. It was _ killed _.' iborasi aytiladi. Tushirib qoldirilgan 2 so'zni qo'shsak, 1991-yilgi mashhur multfilm nomi kelib chiqadi. O'sha multfilmni o'zbek tilida yozib bering!",
      answer: "Sohibjamol va Maxluq",
      acceptableAnswers: JSON.stringify(["Beauty and the Beast", "Sohibjamol va maxluq"]),
      keywords: JSON.stringify(["sohibjamol", "maxluq"]),
      difficulty: "MEDIUM",
      categoryId: catLit.id,
      hints: defaultHints,
      explanation: "Tushirib qoldirilgan so'zlar 'Beauty' va 'Beast' - 'Sohibjamol va Maxluq' multfilmi.",
      source: "Zakovat Paket - 10-savol",
    },
    {
      text: "Bu inson miloddan avvalgi 100-yilda dunyoga kelgan, 55 yil umr ko'rgan. Har bir fakt oxiridagi so'zlar jamlansa ('kelgan', 'ko'rgan', 'qozongan'), uning mashhur iqtibosi o'qiladi. Bu inson kim?",
      answer: "Gay Yuliy Sezar",
      acceptableAnswers: JSON.stringify(["Yuliy Sezar", "Sezar", "Julius Caesar"]),
      keywords: JSON.stringify(["sezar", "yuliy"]),
      difficulty: "MEDIUM",
      categoryId: catHistory.id,
      hints: defaultHints,
      explanation: "Gay Yuliy Sezarning mashhur iborasi: 'Keldim, ko'rdim, g'alaba qildim' (Veni, vidi, vici).",
      source: "Zakovat Paket - 11-savol",
    },
    {
      text: "Abdulloh ibn Ma'sudning poyabzallarini o'g'irlab ketishganda u kishi: 'Allohim! Agar u muhtoj bo'lsa, olgan narsasiga baraka bergin. Agar muhtoj bo'lmasa, shuni uning uchun [...] gunoh qilgin' deb duo qiladi. Qaysi so'z tushirib qoldirilgan?",
      answer: "Oxirgi",
      acceptableAnswers: JSON.stringify(["So'nggi", "Oxirgi gunoh"]),
      keywords: JSON.stringify(["oxirgi", "so'nggi"]),
      difficulty: "HARD",
      categoryId: catLogic.id,
      hints: defaultHints,
      explanation: "Sahoba Abdulloh ibn Ma'sud: 'Agar muhtoj bo'lmasa, shuni uning uchun oxirgi gunoh qilgin (boshqa gunoh qilmasin)' deb duo qilgan.",
      source: "Zakovat Paket - 12-savol",
    },
    {
      text: "G'oyaviy bosimlar sabab bu shoirning 'Men kimga suyangayman, birinchi muhabbatim' misralari bor asariga 'Partiyaga suyan, boshqa narsaga emas' deb ruxsat berishmagan. Bu inson kim va asari nima?",
      answer: "Abdulla Oripov; Birinchi muhabbatim",
      acceptableAnswers: JSON.stringify(["Abdulla Oripov Birinchi muhabbatim", "Oripov Birinchi muhabbatim"]),
      keywords: JSON.stringify(["oripov", "muhabbatim"]),
      difficulty: "HARD",
      categoryId: catLit.id,
      hints: defaultHints,
      explanation: "Abdulla Oripovning 'Birinchi muhabbatim' she'ri sovet senzurasi tomonidan tanqid qilingan.",
      source: "Zakovat Paket - 13-savol",
    },
    {
      text: "Hazil savol: Hamdam bobo Titanik kemasi cho'kishini oldindan aytib qayta-qayta gapiravergani uchun odamlar bezor bo'lib boboni U yerdan haydab yuborishgan. U yer qayer?",
      answer: "Kinoteatr",
      acceptableAnswers: JSON.stringify(["Kino zali", "Kino"]),
      keywords: JSON.stringify(["kinoteatr", "kino"]),
      difficulty: "EASY",
      categoryId: catLogic.id,
      hints: defaultHints,
      explanation: "Bobo Titanik filmini kinoteatrda spoyler berib aytgan.",
      source: "Zakovat Paket - 14-savol",
    },
    {
      text: "Nyu-Jersida 2022-yilda Mel ismli sug'ur o'lib qolgach, Nota bene kanali admini 'Butun Amerika vahimada, nahotki endi bahor qaytmasa' deb 1970-yilda nashr etilgan asarga ishora qiladi. Asar nomini yozib bering!",
      answer: "Bahor qaytmaydi",
      acceptableAnswers: JSON.stringify(["Bahor qaytmaydi qissasi"]),
      keywords: JSON.stringify(["bahor", "qaytmaydi"]),
      difficulty: "MEDIUM",
      categoryId: catLit.id,
      hints: defaultHints,
      explanation: "O'tkir Hoshimovning 'Bahor qaytmaydi' qissasiga ishora qilingan.",
      source: "Zakovat Paket - 15-savol",
    },
    {
      text: "2015-yilgi Ridli Skott filmida bosh qahramon Mark: 'Men maqtanchoq emasman-u, lekin men bu sayyorada eng yaxshi botanikman' deydi. Film nomini yozib bering!",
      answer: "Marslik",
      acceptableAnswers: JSON.stringify(["The Martian", "Mars tutquni"]),
      keywords: JSON.stringify(["marslik", "martian"]),
      difficulty: "EASY",
      categoryId: catLit.id,
      hints: defaultHints,
      explanation: "Marslik (The Martian) filmida Mark Uotni Marsda kartoshka yetishtirgan.",
      source: "Zakovat Paket - 16-savol",
    },
    {
      text: "Duniya Kamacho ismli suzuvchi qiz Daun sindromiga qaramay yuzlab medallarni qo'lga kiritgan. Uning avtobiografiyasida qaysi yevropalikning familiyasi 4 marta uchraydi?",
      answer: "Ginnes",
      acceptableAnswers: JSON.stringify(["Guinness", "Artur Ginnes"]),
      keywords: JSON.stringify(["ginnes", "guinness"]),
      difficulty: "MEDIUM",
      categoryId: catGeo.id,
      hints: defaultHints,
      explanation: "4 ta suzish yo'nalishi bo'yicha Ginnes rekordlar kitobiga kiritilgan.",
      source: "Zakovat Paket - 17-savol",
    },
    {
      text: "Asqad Muxtor iqtibosidan: 'Uyqu qochganda tunchiroq ostidagi daftarga tasodifiy fikrlarni yozib qo'ydim. Daftarimni [T]undaliklar deb atadim.' Iqtibosda almashtirilgan bitta jarangsiz undoshni yozib bering!",
      answer: "T",
      acceptableAnswers: JSON.stringify(["T harfi", "T undoshi"]),
      keywords: JSON.stringify(["t"]),
      difficulty: "EASY",
      categoryId: catLit.id,
      hints: defaultHints,
      explanation: "Asqad Muxtor asari tunda yozilgani uchun 'Tundaliklar' deb nomlangan.",
      source: "Zakovat Paket - 18-savol",
    },
    {
      text: "Parkent - baland shahar, Piskent - yigirma uylik shahar. Toshkent viloyatidagi qaysi shahar nomini tadqiqotchilar 'Chinliklar shahri' (Chinonkant) ma'nosiga ega deyishadi?",
      answer: "Chinoz",
      acceptableAnswers: JSON.stringify(["Chinoz shahri"]),
      keywords: JSON.stringify(["chinoz"]),
      difficulty: "MEDIUM",
      categoryId: catGeo.id,
      hints: defaultHints,
      explanation: "Chinoz shahri dastlab Chinonkant deb atalgan.",
      source: "Zakovat Paket - 19-savol",
    },
    {
      text: "Asqad Muxtor o'zbek xalqining inqilob qilib, shariatga qarshi borib, oxirida peshonasi devorga urilganda iymonga qaytishini Rembrandtning qaysi mashhur rasmi qahramoniga qiyoslagan?",
      answer: "Adashgan o'g'ilning qaytishi",
      acceptableAnswers: JSON.stringify(["Adashgan o'g'il", "Return of the Prodigal Son"]),
      keywords: JSON.stringify(["adashgan", "o'g'ilning"]),
      difficulty: "HARD",
      categoryId: catLit.id,
      hints: defaultHints,
      explanation: "Rembrandtning 'Adashgan o'g'ilning qaytishi' kartinasidagi tavba qilgan o'g'il obraziga qiyoslangan.",
      source: "Zakovat Paket - 20-savol",
    },
    {
      text: "Qoraqalpoq to'y odatlarida sovchi ayollar mehmonlar uyiga suv to'la idish bilan kirishadi va 'Agar pul bermasangiz, ustingizdan suv to'kamiz' deb hazillashishadi. Bu suv to'la idish nima uchun kerak?",
      answer: "Qo'rqitish uchun",
      acceptableAnswers: JSON.stringify(["Tahdid qilish uchun", "Qorqitish uchun"]),
      keywords: JSON.stringify(["qo'rqitish", "tahdid"]),
      difficulty: "EASY",
      categoryId: catLogic.id,
      hints: defaultHints,
      explanation: "Sovchilar pul undirish uchun suv bilan tahdid va hazil qilishgan.",
      source: "Zakovat Paket - 21-savol",
    },
    {
      text: "2018-yilgacha imtihonlar 1 kunda o'tkazilgan. Bir filmda ona o'z qizining tuflisini teshib, poshna orasiga shpargalka joylaydi. Bu film nomini Rim siyosatchisi ismi qatnashgan IKKITA so'z bilan yozib bering!",
      answer: "Birinchi avgust",
      acceptableAnswers: JSON.stringify(["1-avgust", "1 avgust"]),
      keywords: JSON.stringify(["birinchi", "avgust"]),
      difficulty: "MEDIUM",
      categoryId: catLit.id,
      hints: defaultHints,
      explanation: "Abduvohid G'aniyevning '1-avgust' filmi. Avgust - Rim imperatori Avgust nomi.",
      source: "Zakovat Paket - 22-savol",
    },
    {
      text: "Duplet: 1. Uning uzun burnidan kelib chiqib Anchylorhynchus Pinocchio nomi berilgan. Bu qahramon kim? 2. Yelkasidagi bukrini deb u 1831-yilgi Gyugo asari qahramoni sharafiga nomlangan. Qahramon kim?",
      answer: "Pinokkio va Kvazimodo",
      acceptableAnswers: JSON.stringify(["Pinokkio, Kvazimodo", "Pinocchio va Quasimodo"]),
      keywords: JSON.stringify(["pinokkio", "kvazimodo"]),
      difficulty: "HARD",
      categoryId: catLit.id,
      hints: defaultHints,
      explanation: "1-savol: Pinokkio (uzun burun). 2-savol: Kvazimodo (Parijdagi Bibi Maryam ibodatxonasi bukrisi).",
      source: "Zakovat Paket - 23-savol",
    },
    {
      text: "'Umid' nomli drabbl: '...Biz boshqa hech qachon uchrashmaymiz! Boshqa hech qachon ko'zlarimiz ko'zlarimizga tushmaydi...' Drabblni bir so'z bilan yakunlang!",
      answer: "Ko'rishguncha",
      acceptableAnswers: JSON.stringify(["Korishguncha", "Ko'rishguncha!"]),
      keywords: JSON.stringify(["ko'rishguncha", "korishguncha"]),
      difficulty: "EASY",
      categoryId: catLit.id,
      hints: defaultHints,
      explanation: "Hikoya nomi 'Umid' bo'lgani uchun, ular yana ko'rishish umidida 'Ko'rishguncha' deb xayrlashadi.",
      source: "Zakovat Paket - 24-savol",
    },
    {
      text: "1934-yilda Rimda tug'ilgan va Oskar laureati bo'lgan ushbu ayol ('Sofi Loren') o'zbek filmida personaj kimning qizi deb taxmin qilingan?",
      answer: "Shermat qorovulning",
      acceptableAnswers: JSON.stringify(["Shermat qorovul", "Shermat ning qizi"]),
      keywords: JSON.stringify(["shermat", "qorovulning"]),
      difficulty: "MEDIUM",
      categoryId: catLit.id,
      hints: defaultHints,
      explanation: "'Chinor ostidagi duel' filmida Sofi Lorenni Shermat qorovulning qizi deb hazillashishadi.",
      source: "Zakovat Paket - 25-savol",
    },
    {
      text: "Qrim urushida fransuz va turk askarlarining sovuqdan omon qolishiga sabab bo'lgan, inglizlarda yo'qligi uchun ularning o'limiga sabab bo'lgan buyumni 1048-yilgi shoir taxallusi bildiradi. Buyum nima?",
      answer: "Chodir",
      acceptableAnswers: JSON.stringify(["Chodirlar", "Palatka"]),
      keywords: JSON.stringify(["chodir", "palatka"]),
      difficulty: "HARD",
      categoryId: catHistory.id,
      hints: defaultHints,
      explanation: "Umar Hayyom taxallusi 'chodir tikuvchi' degan ma'noni beradi.",
      source: "Zakovat Paket - 26-savol",
    },
    {
      text: "Oslodagi qirollik parkida beshinchi darajali tenglamalarni yenggan 1802-yilgi matematik haykali bor. Nobel mukofoti matematiklarga berilmagani uchun uning nomida mukofot ta'sis etilgan. Inson nomini yozib bering!",
      answer: "Abel",
      acceptableAnswers: JSON.stringify(["Abel mukofoti", "Nils Henrik Abel"]),
      keywords: JSON.stringify(["abel"]),
      difficulty: "HARD",
      categoryId: catScience.id,
      hints: defaultHints,
      explanation: "Nils Henrik Abel sharafiga ta'sis etilgan Abel mukofoti (Matematika Nobeli).",
      source: "Zakovat Paket - 27-savol",
    },
    {
      text: "Jorj Oruellning '1984' antiutopiyasidagi qahramon nomi bilan ataladigan va inson erkinliklarini buzgan davlatlarga beriladigan salbiy mukofot nomi nima?",
      answer: "Katta og'a",
      acceptableAnswers: JSON.stringify(["Katta aka", "Big Brother"]),
      keywords: JSON.stringify(["katta", "og'a", "aka"]),
      difficulty: "MEDIUM",
      categoryId: catLit.id,
      hints: defaultHints,
      explanation: "Jorj Oruellning '1984' asaridagi 'Katta aka / Katta og'a' (Big Brother) mukofoti.",
      source: "Zakovat Paket - 28-savol",
    },
    {
      text: "G'arbdagi barlarda 'Pianinochini otmang, u qo'lidan kelganicha chaladi' yozuvi osilgan. Bir latifada kovboy kelib pianinochi yo'qligini ko'radi. Sababini so'raganda u [...] ekan deyishadi. Qaysi so'z tushirib qoldirilgan?",
      answer: "Savodsiz",
      acceptableAnswers: JSON.stringify(["O'qishni bilmaydigan", "Oqishni bilmaydigan"]),
      keywords: JSON.stringify(["savodsiz", "o'qishni"]),
      difficulty: "EASY",
      categoryId: catLogic.id,
      hints: defaultHints,
      explanation: "Latifaga ko'ra, kecha kelgan kovboy savodsiz bo'lib yozuvni o'qiy olmagan va pianinochini otib qo'ygan.",
      source: "Zakovat Paket - 29-savol",
    },
    {
      text: "Karolina Morache 1999-yilda Italiyaning Viterbeze klubiga murabbiy etib tayinlanib tarixga muhrlangan. Uning tarixga kirishiga sabab nima?",
      answer: "Erkaklar jamoasiga murabbiy bo'lgan ilk ayol",
      acceptableAnswers: JSON.stringify(["Erkaklar jamoasiga ayol murabbiy", "Erkaklar futboliga ilk ayol murabbiy"]),
      keywords: JSON.stringify(["erkaklar", "murabbiy", "ayol"]),
      difficulty: "HARD",
      categoryId: catHistory.id,
      hints: defaultHints,
      explanation: "U erkaklar professional futbol jamoasiga bosh murabbiy bo'lgan dunyodagi birinchi ayoldir.",
      source: "Zakovat Paket - 30-savol",
    }
  ];

  for (const q of questionsData) {
    await prisma.question.create({ data: q });
  }

  console.log(`Successfully seeded ${questionsData.length} authentic tournament Zakovat questions!`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
