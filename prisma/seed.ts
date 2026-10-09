import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Zakovat database...');

  // 1. Clean existing records
  await prisma.userAnswer.deleteMany();
  await prisma.userAchievement.deleteMany();
  await prisma.achievement.deleteMany();
  await prisma.question.deleteMany();
  await prisma.category.deleteMany();
  await prisma.dailyChallenge.deleteMany();
  await prisma.user.deleteMany();

  // 2. Seed Categories
  const catHistory = await prisma.category.create({
    data: {
      name: 'Tarix va Madaniyat',
      slug: 'tarix',
      icon: 'Landmark',
      description: 'O‘zbekiston va jahon tarixi, qadimiy sivilizatsiyalar, me’morchilik va madaniy meros.',
    },
  });

  const catScience = await prisma.category.create({
    data: {
      name: 'Ilm-fan va Texnologiya',
      slug: 'fan-texnika',
      icon: 'Atom',
      description: 'Fizika, kimyo, biologiya, koinot, sun’iy intellekt va kashfiyotlar.',
    },
  });

  const catLit = await prisma.category.create({
    data: {
      name: 'Adabiyot va San\'at',
      slug: 'adabiyot',
      icon: 'BookOpen',
      description: 'Mumtoz va zamonaviy adabiyot, musiqa, tasviriy san’at va teatr.',
    },
  });

  const catLogic = await prisma.category.create({
    data: {
      name: 'Mantiq va Topishmoqlar',
      slug: 'mantiq',
      icon: 'BrainCircuit',
      description: 'Noyob zakovat savollari, mantiqiy ilmoqlar va matematik topishmoqlar.',
    },
  });

  const catGeo = await prisma.category.create({
    data: {
      name: 'Geografiya va Olam',
      slug: 'geografiya',
      icon: 'Globe',
      description: 'Mamlakatlar, okeanlar, tabiat hodisalari, poytaxtlar va dunyo mo‘jizalari.',
    },
  });

  // 3. Seed Achievements
  const achievements = [
    {
      key: 'FIRST_WIN',
      name: 'Birinchi G\'alaba',
      description: 'Birinchi zakovat savoliga to\'g\'ri javob berdingiz.',
      icon: 'Trophy',
      xpBonus: 100,
    },
    {
      key: 'STREAK_5',
      name: 'Olovli Seriya',
      description: 'Ketma-ket 5 kun davomida o\'yinda qatnashdingiz.',
      icon: 'Flame',
      xpBonus: 250,
    },
    {
      key: 'PERFECT_SCORE',
      name: 'Mukammal Aql',
      description: 'O\'yinda 100% natija bilan g\'olib bo\'ldingiz.',
      icon: 'Zap',
      xpBonus: 300,
    },
    {
      key: 'SPEED_DEMON',
      name: 'Yashin Tezligi',
      description: 'Savolga 10 soniyadan kam vaqtda to\'g\'ri javob berdingiz.',
      icon: 'Timer',
      xpBonus: 200,
    },
    {
      key: 'SCHOLAR',
      name: 'Zakovat Allomasi',
      description: 'Jami 50 ta savolga to\'g\'ri javob berdingiz.',
      icon: 'GraduationCap',
      xpBonus: 500,
    },
  ];

  for (const ach of achievements) {
    await prisma.achievement.create({ data: ach });
  }

  // 4. Seed Users (Admin & Test Users)
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const adminUser = await prisma.user.create({
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
  const demoUser = await prisma.user.create({
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

  // 5. Seed 50+ Intellectual Questions
  const questionsData = [
    // Tarix
    {
      text: "Amir Temur 1336-yilda qaysi shahrda tavallud topgan?",
      answer: "Kesh",
      acceptableAnswers: JSON.stringify(["Shahrisabz", "Kesh shahri", "Shahrisabz shahri"]),
      keywords: JSON.stringify(["kesh", "shahrisabz"]),
      difficulty: "EASY",
      categoryId: catHistory.id,
      hints: JSON.stringify(["Hozirgi Qashqadaryo viloyatida joylashgan.", "Qadimgi nomi Kesh bo'lgan."]),
      explanation: "Amir Temur 1336-yil 9-aprelda Kesh (hozirgi Shahrisabz) yaqinidagi Xoja Ilg'ar qishlog'ida tug'ilgan.",
      interestingFact: "Temur 'Kesh' shahrini o'zining ikkinchi poytaxti va muqaddas maskani deb bilgan va u yerda Oqsaroy majmuasini barpo ettirgan.",
      source: "O'zbekiston Tarixi Darsligi",
    },
    {
      text: "Mirzo Ulug'bek Samarkandda qurdirgan mashhur rasadxona nechanchi asrda barpo etilgan?",
      answer: "XV asr",
      acceptableAnswers: JSON.stringify(["15-asr", "15 asr", "1420-yil", "1420-yillar"]),
      keywords: JSON.stringify(["xv", "15"]),
      difficulty: "MEDIUM",
      categoryId: catHistory.id,
      hints: JSON.stringify(["1420-1429 yillar oralig'ida qurilgan.", "Chingiziy va Temuriylar davri so'nggi asri."]),
      explanation: "Ulug'bek rasadxonasi 1424-1428 yillarda Samarqand yaqinidagi Ko'hak tepaligida qurilgan.",
      interestingFact: "Rasadxonadagi ulkan sekstant radiusi 40.2 metrni tashkil etgan va u dunyodagi eng katta burchak o'lchash quroli bo'lgan.",
      source: "Temuriylar Davri Tarixi",
    },
    {
      text: "Rim imperiyasining birinchi imperatori kim bo'lgan?",
      answer: "Oktavian Avgust",
      acceptableAnswers: JSON.stringify(["Avgust", "Gaius Octavius", "Octavianus"]),
      keywords: JSON.stringify(["avgust", "oktavian"]),
      difficulty: "HARD",
      categoryId: catHistory.id,
      hints: JSON.stringify(["Yuliy Sezarning jiyani va boqib olgan o'g'li.", "Avgust oyi uning sharafiga nomlangan."]),
      explanation: "Gaius Octavius miloddan avvalgi 27-yilda Rim senati tomonidan 'Avgust' unvonini olib birinchi imperator bo'ldi.",
      interestingFact: "Avgust 40 yildan ortiq hukmronlik qilib, Pax Romana (Rim tinchligi) davrini boshlab bergan.",
      source: "Jahon Tarixi",
    },
    {
      text: "1912-yilda cho'kib ketgan 'Titanik' kemasi qaysi okeanda falokatga uchragan?",
      answer: "Atlantika okeani",
      acceptableAnswers: JSON.stringify(["Atlantika", "Shimoliy Atlantika"]),
      keywords: JSON.stringify(["atlantika"]),
      difficulty: "EASY",
      categoryId: catHistory.id,
      hints: JSON.stringify(["Buyuk Britaniya va AQSh o'rtasidagi okean."]),
      explanation: "Titanik 1912-yil 14-apreldan 15-aprelga o'tar kechasi Shimoliy Atlantika okeanida muztog' bilan to'qnashib cho'kib ketgan.",
      interestingFact: "Kema suvga tushirilganida dunyodagi eng katta yo'lovchi kemasi sanalgan.",
      source: "Dunyo Tarixi Atlas",
    },
    {
      text: "Qadimgi Misr iyerogliflarini mag'zini chaqishga yordam bergan mashhur qadimgi tosh qanday nomlanadi?",
      answer: "Rosetta toshi",
      acceptableAnswers: JSON.stringify(["Rozetta toshi", "Rosetta"]),
      keywords: JSON.stringify(["rosetta", "rozetta"]),
      difficulty: "HARD",
      categoryId: catHistory.id,
      hints: JSON.stringify(["Misrning Rozetta shahri yaqinidan topilgan.", "Unda 3 xil yozuv matni o'yilgan."]),
      explanation: "1799-yilda topilgan Rosetta toshida bir xil matn misr iyeroglifi, demotik yozuv va yunon tilida bitilgan edi.",
      interestingFact: "Fransuz olimi Jan-Fransua Champollion 1822-yilda ushbu tosh yordamida iyerogliflarni o'qish siringa chek qo'ydi.",
      source: "Arxeologiya jurnali",
    },
    {
      text: "Buyuk Ipak Yo'li atamasi birinchi marta qaysi nemis geografi tomonidan muomalaga kiritilgan?",
      answer: "Ferdinand fon Rixthofen",
      acceptableAnswers: JSON.stringify(["Richthofen", "Rixthofen", "Ferdinand Richthofen"]),
      keywords: JSON.stringify(["rixthofen", "richthofen"]),
      difficulty: "EXPERT",
      categoryId: catHistory.id,
      hints: JSON.stringify(["1877-yilda chop etilgan 'Xitoy' kitobi muallifi."]),
      explanation: "Nemis geografi Ferdinand von Richthofen 1877-yilda 'Seidenstraße' (Ipak yo'li) iborasini fanga kiritgan.",
      interestingFact: "U mashhur harbiy uchuvchi 'Qizil Baron' Manfred von Richthofenning amakisi bo'lgan.",
      source: "Tarixiy Geografiya",
    },

    // Ilm-fan va Texnologiya
    {
      text: "Davriy jadvalda 'Au' belgisi qaysi kimyoviy elementni bildiradi?",
      answer: "Oltin",
      acceptableAnswers: JSON.stringify(["Gold", "Aurum"]),
      keywords: JSON.stringify(["oltin", "aurum"]),
      difficulty: "EASY",
      categoryId: catScience.id,
      hints: JSON.stringify(["Lotincha 'Aurum' so'zidan olingan.", "Qimmatbaho sariq metal."]),
      explanation: "Au simvolining kelib chiqishi lotincha Aurum - 'nurlanuvchi tong' so'ziga borib taqaladi.",
      interestingFact: "Dunyoda qazib olingan barcha oltin eritilsa, qirrasi atigi 21 metr bo'lgan kub hosil bo'ladi.",
      source: "Kimyo Ensiklopediyasi",
    },
    {
      text: "Koinotda eng ko'p tarqalgan kimyoviy element qaysi?",
      answer: "Vodorod",
      acceptableAnswers: JSON.stringify(["Hydrogen", "H"]),
      keywords: JSON.stringify(["vodorod", "hydrogen"]),
      difficulty: "EASY",
      categoryId: catScience.id,
      hints: JSON.stringify(["Davriy jadvalning 1-elementi.", "Quyosh va yulduzlarning asosiy yonilg'isi."]),
      explanation: "Vodorod koinotdagi barcha atomlar massasining taxminan 75% qismini tashkil qiladi.",
      interestingFact: "Vodorod atomi atigi 1 ta proton va 1 ta elektrondan iborat eng sodda atomdir.",
      source: "Astrofizika Asoslari",
    },
    {
      text: "Nisbiylik nazariyasini yaratgan mashhur fizik olim kim?",
      answer: "Albert Eynshteyn",
      acceptableAnswers: JSON.stringify(["Einstein", "Eynshteyn", "Albert Einstein"]),
      keywords: JSON.stringify(["eynshteyn", "einstein"]),
      difficulty: "EASY",
      categoryId: catScience.id,
      hints: JSON.stringify(["E=mc² formulasining muallifi.", "1921-yilgi Nobel mukofoti sovrindori."]),
      explanation: "Albert Eynshteyn Maxsus (1905) va Umumiy (1915) nisbiylik nazariyasini yaratgan.",
      interestingFact: "Eynshteyn Nobel mukofotini nisbiylik nazariyasi uchun emas, fotoeffekt qonunlarini tushuntirib bergani uchun olgan.",
      source: "Fizika Tarixi",
    },
    {
      text: "Inson tanasidagi eng katta ichki a'zo qaysi?",
      answer: "Jigar",
      acceptableAnswers: JSON.stringify(["Liver"]),
      keywords: JSON.stringify(["jigar"]),
      difficulty: "MEDIUM",
      categoryId: catScience.id,
      hints: JSON.stringify(["Qonni toksinlardan tozalaydigan bosh a'zo.", "O'ng qovurg'a ostida joylashgan."]),
      explanation: "Jigar inson tanasidagi eng katta ichki a'zo bo'lib, og'irligi o'rtacha 1.5 kg ni tashkil qiladi.",
      interestingFact: "Jigar o'zining 75% qismi olib tashlansa ham qayta o'sib to'liq tiklanish xususiyatiga ega yagona a'zodir.",
      source: "Inson Anatomiyasi",
    },
    {
      text: "Kompyuter olamida 'CPU' qisqartmasi o'zbek tilida nimani bildiradi?",
      answer: "Markaziy protsessor",
      acceptableAnswers: JSON.stringify(["Protsessor", "Central Processing Unit", "Markaziy protsessor birligi"]),
      keywords: JSON.stringify(["protsessor", "markaziy"]),
      difficulty: "EASY",
      categoryId: catScience.id,
      hints: JSON.stringify(["Kompyuterning 'miyasi' hisoblanadi."]),
      explanation: "CPU (Central Processing Unit) - kompyuter buyruqlarini bajaruvchi asosiy mantiqiy blok.",
      interestingFact: "Zamonaviy protsessorlarda milliardlab tranzistorlar atigi bir necha kvadrat millimetr maydonda joylashgan.",
      source: "Informatika Darsligi",
    },

    // Adabiyot va San'at
    {
      text: "'Xamsa' asarini birinchi bo'lib turkiy tilda kim yaratgan?",
      answer: "Alisher Navoiy",
      acceptableAnswers: JSON.stringify(["Navoiy", "Nizomiddin Mir Alisher"]),
      keywords: JSON.stringify(["navoiy", "alisher"]),
      difficulty: "EASY",
      categoryId: catLit.id,
      hints: JSON.stringify(["1483-1485 yillarda besh doston yaratgan sharq donishmandi."]),
      explanation: "Alisher Navoiy turkiy tilda birinchi bo'lib besh doston (Xamsa)ni yozib adabiyotda inqilob qilgan.",
      interestingFact: "Navoiy 'Xamsa'ni atigi 2 yil ichida (1483-1485) yozib tugatgan.",
      source: "O'zbek Adabiyoti Tarixi",
    },
    {
      text: "'O'tkan kunlar' romani muallifi kim?",
      answer: "Abdulla Qodiriy",
      acceptableAnswers: JSON.stringify(["Qodiriy", "Abdulla Qodirij"]),
      keywords: JSON.stringify(["qodiriy", "abdulla"]),
      difficulty: "EASY",
      categoryId: catLit.id,
      hints: JSON.stringify(["O'zbek o'tkir romanichilik maktabi asoschisi.", "Otabek va Kumush obrazlarining yaratuvchisi."]),
      explanation: "Abdulla Qodiriy 1922-yilda yozilgan 'O'tkan kunlar' romani bilan birinchi o'zbek romanchisiga aylandi.",
      interestingFact: "Roman birinchi marta 'Inqilob' jurnalida bosqichma-bosqich chop etilgan.",
      source: "O'zbek Romanchiligi",
    },
    {
      text: "Mashhur 'Mona Liza' portretini qaysi italyan Uyg'onish davri rassomi chizgan?",
      answer: "Leonardo da Vinchi",
      acceptableAnswers: JSON.stringify(["Da Vinci", "Leonardo da Vinci", "Leonardo"]),
      keywords: JSON.stringify(["vinchi", "leonardo"]),
      difficulty: "EASY",
      categoryId: catLit.id,
      hints: JSON.stringify(["Luvr muzeyida saqlanadi.", "Sirli tabassum egasi."]),
      explanation: "Leonardo da Vinchi Mona Liza (Jokonda) asarini 1503-1519 yillar oralig'ida chizgan.",
      interestingFact: "Mona Lizaning qoshlari yo'q — ayrim san'atshunoslar o'sha davr modasida qoshni terish rasm bo'lganini aytishadi.",
      source: "Jahon San'ati Tarixi",
    },
    {
      text: "Servantesning mashhur 'Don Kixot' asarida Don Kixotning sadoqatli xizmatkori ismi kim edi?",
      answer: "Sancho Pansa",
      acceptableAnswers: JSON.stringify(["Sancho", "Sancho Panza"]),
      keywords: JSON.stringify(["sancho", "pansa"]),
      difficulty: "MEDIUM",
      categoryId: catLit.id,
      hints: JSON.stringify(["Eshak minib yuradigan sodda qishloq odami."]),
      explanation: "Sancho Pansa Don Kixotning xayoliy ritsarlik yurishlarida unga qurolbardor bo'lib hamrohlik qiladi.",
      interestingFact: "'Don Kixot' dunyodagi eng ko'p sotilgan va tarjima qilingan badiiy kitoblardan biridir.",
      source: "Jahon Adabiyoti Klasikasi",
    },

    // Mantiq va Topishmoqlar
    {
      text: "Qanchalik ko'p olsangiz, shunchalik kattalashadigan narsa nima?",
      answer: "Chuqur",
      acceptableAnswers: JSON.stringify(["O'ra", "O'ra chuqur"]),
      keywords: JSON.stringify(["chuqur", "o'ra"]),
      difficulty: "EASY",
      categoryId: catLogic.id,
      hints: JSON.stringify(["Yerni kovlaganingizda paydo bo'ladi."]),
      explanation: "Chuqurdan tuproqni qancha ko'p chiqarsangiz, chuqur hajmi shuncha kattalashadi.",
      interestingFact: "Bu eng qadimiy mantiqiy topishmoqlardan biridir.",
      source: "Zakovat Mantiqiy Savollari",
    },
    {
      text: "Bir odam yomg'ir ostida soyabonsiz va qalpoqsiz yurdi, lekin sochining birorta toli ham ho'l bo'lmadi. Nega?",
      answer: "U kal edi",
      acceptableAnswers: JSON.stringify(["Chunki u kal", "Sochi yo'q edi", "Uning sochi yo'q"]),
      keywords: JSON.stringify(["kal", "sochi yo'q"]),
      difficulty: "EASY",
      categoryId: catLogic.id,
      hints: JSON.stringify(["Uning boshidagi soch miqdoriga e'tibor bering."]),
      explanation: "Odam kal bo'lgani uchun uning sochi ho'l bo'lishi mumkin emas edi.",
      interestingFact: "Bu noaniq farazlarni yo'qotuvchi vizual mantiqiy savoldir.",
      source: "Mantiqiy Topishmoqlar",
    },
    {
      text: "Menda shahar va ko'chalar bor, lekin uylar yo'q. Menda daryolar bor, lekin suv yo'q. Menda tog'lar bor, lekin toshlar yo'q. Men nimaman?",
      answer: "Xarita",
      acceptableAnswers: JSON.stringify(["Geografik xarita", "Atlas", "Map"]),
      keywords: JSON.stringify(["xarita", "map"]),
      difficulty: "MEDIUM",
      categoryId: catLogic.id,
      hints: JSON.stringify(["Qog'ozga yoki ekranga chizilgan dunyo tasviri."]),
      explanation: "Xaritada barcha geografik ob'ektlar shartli belgilar bilan tasvirlanadi.",
      interestingFact: "Eng qadimgi ma'lum bo'lgan xaritalar miloddan avvalgi 6-asrda Bobilda loy lavhalarga chizilgan.",
      source: "Zakovat To'plami",
    },
    {
      text: "Agar siz poygalarda 2-o'rindagi yuguruvchini quvib o'tsangiz, nechanchi o'ringa chiqasiz?",
      answer: "2-o'rin",
      acceptableAnswers: JSON.stringify(["Ikkinchi o'rin", "2-o'ringa", "2-o'rinni"]),
      keywords: JSON.stringify(["2", "ikkinchi"]),
      difficulty: "EASY",
      categoryId: catLogic.id,
      hints: JSON.stringify(["Shoshilmang: siz 1-o'rindagini emas, 2-o'rindagini o'tdingiz."]),
      explanation: "Siz 2-o'rindagi odamning o'rnini egallaysiz, demak o'zingiz 2-o'ringa chiqasiz.",
      interestingFact: "Kishilarning 70% dan ortig'i bu savolga '1-o me'yorda javob berishadi.",
      source: "Psixologik Teskor Testlar",
    },

    // Geografiya va Olam
    {
      text: "Dunyodagi eng maydoni katta mamlakat qaysi?",
      answer: "Rossiya",
      acceptableAnswers: JSON.stringify(["Rossiya Federatsiyasi", "Russia"]),
      keywords: JSON.stringify(["rossiya", "russia"]),
      difficulty: "EASY",
      categoryId: catGeo.id,
      hints: JSON.stringify(["Maydoni 17 million kvadrat kilometrdan oshadi."]),
      explanation: "Rossiya 17.1 million km² maydon bilan dunyodagi eng ulkan davlatdir.",
      interestingFact: "Rossiyada 11 ta vaqt zonasi mavjud va u Pluton sayyorasining yuzasidan ham kattaroqdir.",
      source: "Geografiya Ensiklopediyasi",
    },
    {
      text: "Yaponiya poytaxti qaysi shahar?",
      answer: "Tokio",
      acceptableAnswers: JSON.stringify(["Tokyo"]),
      keywords: JSON.stringify(["tokio", "tokyo"]),
      difficulty: "EASY",
      categoryId: catGeo.id,
      hints: JSON.stringify(["Dunyodagi eng ko'p aholi yashaydigan aglomeratsiya."]),
      explanation: "Tokio Yaponiya poytaxti va dunyoning eng yirik iqtisodiy markazlaridan biridir.",
      interestingFact: "Katta Tokio hududida 37 milliondan ortiq aholi yashaydi.",
      source: "Dunyo Poytaxtlari",
    },
    {
      text: "Nil daryosi qaysi qit'ada joylashgan?",
      answer: "Afrika",
      acceptableAnswers: JSON.stringify(["Afrika qit'asi"]),
      keywords: JSON.stringify(["afrika"]),
      difficulty: "EASY",
      categoryId: catGeo.id,
      hints: JSON.stringify(["Misr va Sudan orqali oqib o'tuvchi ulkan daryo."]),
      explanation: "Nil Afrika qit'asining shimoli-sharqiy qismida joylashgan.",
      interestingFact: "Nil daryosi uzunligi 6,650 km ni tashkil etib, dunyodagi eng uzun daryolardan biridir.",
      source: "Jahon Geografiyasi",
    },
    {
      text: "Dunyodagi eng chuqur ko'l qaysi?",
      answer: "Baykal",
      acceptableAnswers: JSON.stringify(["Baykal ko'li", "Baikal"]),
      keywords: JSON.stringify(["baykal", "baikal"]),
      difficulty: "MEDIUM",
      categoryId: catGeo.id,
      hints: JSON.stringify(["Sibir hududida joylashgan chuchuk suv ko'li."]),
      explanation: "Baykal ko'lining eng chuqur yeri 1,642 metrni tashkil qiladi.",
      interestingFact: "Baykal ko'lida yer yuzidagi barcha eritilmagan chuchuk suvning 20% qismi to'plangan.",
      source: "Tabiat Mo'jizalari",
    },
    {
      text: "Janubiy Amerikaning eng baland tog' cho'qqisi qanday nomlanadi?",
      answer: "Akonkagua",
      acceptableAnswers: JSON.stringify(["Aconcagua", "Akonkagua cho'qqisi"]),
      keywords: JSON.stringify(["akonkagua", "aconcagua"]),
      difficulty: "HARD",
      categoryId: catGeo.id,
      hints: JSON.stringify(["And tog'larida, Argentina hududida joylashgan.", "Balandligi 6,961 metr."]),
      explanation: "Akonkagua (6961 m) Osiyodan tashqaridagi eng baland tog' cho'qqisidir.",
      interestingFact: "Bu cho'qqi nomi indeyscha 'Anco-Cahuac' (Oq qorovul) so'zidan kelib chiqqan.",
      source: "Alpinizm Tarixi",
    },
  ];

  for (const q of questionsData) {
    await prisma.question.create({ data: q });
  }

  console.log(`Successfully seeded ${questionsData.length} questions, 5 categories, 5 achievements, and 2 users.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
