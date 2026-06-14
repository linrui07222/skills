import Database from 'better-sqlite3'
import { fileURLToPath } from 'url'
import path from 'path'
import fs from 'fs'
import bcrypt from 'bcryptjs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const dbDir = __dirname
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true })
}

const dbPath = path.join(dbDir, 'linguaverse.db')
const db = new Database(dbPath)

db.pragma('journal_mode = WAL')
db.pragma('foreign_keys = ON')

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    avatar TEXT DEFAULT '',
    level INTEGER DEFAULT 1,
    xp INTEGER DEFAULT 0,
    streak INTEGER DEFAULT 0,
    last_study_date DATE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS courses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    language TEXT NOT NULL CHECK(language IN ('en', 'ja', 'ko')),
    level TEXT NOT NULL CHECK(level IN ('A1', 'A2', 'B1', 'B2', 'C1', 'C2')),
    cover_image TEXT,
    enrolled_count INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS lessons (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    course_id INTEGER NOT NULL REFERENCES courses(id),
    title TEXT NOT NULL,
    type TEXT NOT NULL CHECK(type IN ('vocabulary', 'grammar', 'speaking', 'listening')),
    order_num INTEGER NOT NULL,
    content_json TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS user_progress (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES users(id),
    lesson_id INTEGER NOT NULL REFERENCES lessons(id),
    course_id INTEGER NOT NULL REFERENCES courses(id),
    completed BOOLEAN DEFAULT 0,
    score INTEGER DEFAULT 0,
    time_spent INTEGER DEFAULT 0,
    completed_at DATETIME,
    UNIQUE(user_id, lesson_id)
  );

  CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES users(id),
    content TEXT NOT NULL,
    language TEXT NOT NULL CHECK(language IN ('en', 'ja', 'ko')),
    likes INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS achievements (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    icon TEXT NOT NULL,
    category TEXT NOT NULL,
    target_value INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS user_achievements (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES users(id),
    achievement_id INTEGER NOT NULL REFERENCES achievements(id),
    unlocked BOOLEAN DEFAULT 0,
    progress INTEGER DEFAULT 0,
    unlocked_at DATETIME,
    UNIQUE(user_id, achievement_id)
  );
`)

// Seed data - only insert if tables are empty
const courseCount = db.prepare('SELECT COUNT(*) as count FROM courses').get() as { count: number }
if (courseCount.count === 0) {
  // Insert courses
  const insertCourse = db.prepare(`
    INSERT INTO courses (title, description, language, level, cover_image, enrolled_count)
    VALUES (@title, @description, @language, @level, @coverImage, @enrolledCount)
  `)

  const insertLesson = db.prepare(`
    INSERT INTO lessons (course_id, title, type, order_num, content_json)
    VALUES (@courseId, @title, @type, @orderNum, @contentJson)
  `)

  const insertAchievement = db.prepare(`
    INSERT INTO achievements (title, description, icon, category, target_value)
    VALUES (@title, @description, @icon, @category, @targetValue)
  `)

  const insertPost = db.prepare(`
    INSERT INTO posts (user_id, content, language, likes)
    VALUES (@userId, @content, @language, @likes)
  `)

  const seedTransaction = db.transaction(() => {
    // === Courses ===
    const courses = [
      { title: '英语入门基础', description: '从零开始学习英语，掌握基础词汇和语法', language: 'en', level: 'A1', coverImage: '/courses/en-a1.png', enrolledCount: 1250 },
      { title: '英语日常会话', description: '学习日常英语对话，提升口语交流能力', language: 'en', level: 'A2', coverImage: '/courses/en-a2.png', enrolledCount: 980 },
      { title: '日语五十音入门', description: '学习日语平假名和片假名，打好日语基础', language: 'ja', level: 'A1', coverImage: '/courses/ja-a1.png', enrolledCount: 1100 },
      { title: '日语基础会话', description: '学习日语基本会话表达，应对日常场景', language: 'ja', level: 'A2', coverImage: '/courses/ja-a2.png', enrolledCount: 750 },
      { title: '韩语发音入门', description: '学习韩语字母和发音规则，掌握韩语基础', language: 'ko', level: 'A1', coverImage: '/courses/ko-a1.png', enrolledCount: 890 },
      { title: '韩语基础会话', description: '学习韩语日常对话，了解韩国文化', language: 'ko', level: 'A2', coverImage: '/courses/ko-a2.png', enrolledCount: 620 },
    ]

    const courseIds: number[] = []
    for (const course of courses) {
      const result = insertCourse.run({
        title: course.title,
        description: course.description,
        language: course.language,
        level: course.level,
        coverImage: course.coverImage,
        enrolledCount: course.enrolledCount,
      })
      courseIds.push(Number(result.lastInsertRowid))
    }

    // === Lessons for each course ===
    // Course 1: 英语 A1 - 英语入门基础
    const enA1Lessons = [
      {
        courseId: courseIds[0], title: '基础词汇：问候与介绍', type: 'vocabulary', orderNum: 1,
        contentJson: JSON.stringify({
          words: [
            { word: 'hello', translation: '你好', phonetic: '/həˈloʊ/', example: 'Hello, how are you?' },
            { word: 'goodbye', translation: '再见', phonetic: '/ɡʊdˈbaɪ/', example: 'Goodbye, see you tomorrow!' },
            { word: 'name', translation: '名字', phonetic: '/neɪm/', example: 'My name is Tom.' },
            { word: 'friend', translation: '朋友', phonetic: '/frend/', example: 'She is my best friend.' },
            { word: 'please', translation: '请', phonetic: '/pliːz/', example: 'Please sit down.' },
            { word: 'thank', translation: '感谢', phonetic: '/θæŋk/', example: 'Thank you very much!' },
            { word: 'sorry', translation: '抱歉', phonetic: '/ˈsɑːri/', example: "I'm sorry for being late." },
            { word: 'welcome', translation: '欢迎', phonetic: '/ˈwelkəm/', example: 'Welcome to our school!' },
            { word: 'morning', translation: '早晨', phonetic: '/ˈmɔːrnɪŋ/', example: 'Good morning, everyone!' },
            { word: 'evening', translation: '晚上', phonetic: '/ˈiːvnɪŋ/', example: 'Good evening, how was your day?' },
          ]
        })
      },
      {
        courseId: courseIds[0], title: '基础语法：Be动词与代词', type: 'grammar', orderNum: 2,
        contentJson: JSON.stringify({
          grammarPoints: [
            {
              pattern: 'I am / You are / He is / She is / It is / We are / They are',
              explanation: 'Be动词根据主语不同而变化。I搭配am，you/we/they搭配are，he/she/it搭配is。',
              exercises: [
                { type: 'fill', question: 'I ___ a student.', answer: 'am' },
                { type: 'choice', question: 'She ___ from Japan.', options: ['am', 'is', 'are', 'be'], answer: 'is' },
                { type: 'reorder', question: 'are / We / students', answer: 'We are students' },
              ]
            },
            {
              pattern: 'This is... / That is...',
              explanation: 'This用来指近处的事物，That用来指远处的事物。',
              exercises: [
                { type: 'fill', question: '___ is my book. (这)', answer: 'This' },
                { type: 'choice', question: '___ is a bird over there. (那)', options: ['This', 'That', 'These', 'Those'], answer: 'That' },
                { type: 'reorder', question: 'is / This / pen / a', answer: 'This is a pen' },
              ]
            },
            {
              pattern: 'What is your name? / My name is...',
              explanation: '询问对方名字的常用句型，用What is...提问，My name is...回答。',
              exercises: [
                { type: 'fill', question: 'What ___ your name?', answer: 'is' },
                { type: 'choice', question: 'My name ___ Alice.', options: ['am', 'is', 'are', 'be'], answer: 'is' },
                { type: 'reorder', question: 'your / is / name / What', answer: 'What is your name' },
              ]
            },
          ]
        })
      },
      {
        courseId: courseIds[0], title: '口语跟读：自我介绍', type: 'speaking', orderNum: 3,
        contentJson: JSON.stringify({
          sentences: [
            { sentence: 'Hello, my name is Tom.', translation: '你好，我的名字是汤姆。', phonetic: '/həˈloʊ maɪ neɪm ɪz tɒm/' },
            { sentence: 'I am from China.', translation: '我来自中国。', phonetic: '/aɪ æm frɒm ˈtʃaɪnə/' },
            { sentence: 'Nice to meet you.', translation: '很高兴认识你。', phonetic: '/naɪs tuː miːt juː/' },
            { sentence: 'I am a student.', translation: '我是一名学生。', phonetic: '/aɪ æm ə ˈstjuːdənt/' },
            { sentence: 'How are you today?', translation: '你今天好吗？', phonetic: '/haʊ ɑːr juː təˈdeɪ/' },
          ]
        })
      },
      {
        courseId: courseIds[0], title: '听力练习：日常问候', type: 'listening', orderNum: 4,
        contentJson: JSON.stringify({
          questions: [
            { question: '听到别人说"Good morning"，你应该怎么回答？', options: ['Good night', 'Good morning', 'Goodbye', 'See you'], answer: 'Good morning' },
            { question: '别人问你"How are you?"，以下哪个回答不合适？', options: ["I'm fine, thank you.", "I'm good.", "How are you?", "Goodbye"], answer: 'Goodbye' },
            { question: '"Nice to meet you"通常在什么时候说？', options: ['告别时', '初次见面时', '道歉时', '感谢时'], answer: '初次见面时' },
            { question: '听到"See you later"，最合适的回应是？', options: ['Thank you', 'See you later', 'I\'m sorry', 'Excuse me'], answer: 'See you later' },
            { question: '"What is your name?"是在问什么？', options: ['你的年龄', '你的名字', '你的职业', '你的地址'], answer: '你的名字' },
          ]
        })
      },
    ]

    // Course 2: 英语 A2 - 英语日常会话
    const enA2Lessons = [
      {
        courseId: courseIds[1], title: '日常词汇：购物与饮食', type: 'vocabulary', orderNum: 1,
        contentJson: JSON.stringify({
          words: [
            { word: 'restaurant', translation: '餐厅', phonetic: '/ˈrestrɒnt/', example: "Let's go to a restaurant." },
            { word: 'menu', translation: '菜单', phonetic: '/ˈmenjuː/', example: 'Can I see the menu, please?' },
            { word: 'price', translation: '价格', phonetic: '/praɪs/', example: 'What is the price of this shirt?' },
            { word: 'discount', translation: '折扣', phonetic: '/ˈdɪskaʊnt/', example: 'There is a 20% discount today.' },
            { word: 'order', translation: '点餐', phonetic: '/ˈɔːrdər/', example: 'I would like to order now.' },
            { word: 'delicious', translation: '美味的', phonetic: '/dɪˈlɪʃəs/', example: 'The food is delicious!' },
            { word: 'receipt', translation: '收据', phonetic: '/rɪˈsiːt/', example: 'Could I have the receipt?' },
            { word: 'shopping', translation: '购物', phonetic: '/ˈʃɒpɪŋ/', example: 'I went shopping yesterday.' },
            { word: 'size', translation: '尺码', phonetic: '/saɪz/', example: 'What size do you need?' },
            { word: 'cash', translation: '现金', phonetic: '/kæʃ/', example: 'Do you accept cash?' },
          ]
        })
      },
      {
        courseId: courseIds[1], title: '语法：一般现在时与现在进行时', type: 'grammar', orderNum: 2,
        contentJson: JSON.stringify({
          grammarPoints: [
            {
              pattern: 'I eat breakfast every day. / I am eating breakfast now.',
              explanation: '一般现在时表示习惯性动作，现在进行时表示正在进行的动作。结构：主语+动词原形(第三人称加s) vs 主语+am/is/are+动词ing。',
              exercises: [
                { type: 'fill', question: 'She ___ (read) a book now.', answer: 'is reading' },
                { type: 'choice', question: 'He ___ to work every day.', options: ['go', 'goes', 'going', 'is going'], answer: 'goes' },
                { type: 'reorder', question: 'playing / are / They / soccer', answer: 'They are playing soccer' },
              ]
            },
            {
              pattern: 'Can I help you? / I would like...',
              explanation: '购物和点餐时的常用句型。Can I help you?是服务人员常用问候语，I would like...表示礼貌地提出请求。',
              exercises: [
                { type: 'fill', question: 'I ___ like a cup of coffee, please.', answer: 'would' },
                { type: 'choice', question: '___ I help you?', options: ['Do', 'Can', 'Am', 'Is'], answer: 'Can' },
                { type: 'reorder', question: 'like / would / I / pizza / a', answer: 'I would like a pizza' },
              ]
            },
            {
              pattern: 'How much is...? / It is...',
              explanation: '询问价格的句型。How much is + 单数物品，How much are + 复数物品。',
              exercises: [
                { type: 'fill', question: 'How much ___ this bag?', answer: 'is' },
                { type: 'choice', question: 'How much ___ these shoes?', options: ['is', 'are', 'do', 'does'], answer: 'are' },
                { type: 'reorder', question: 'much / is / How / it', answer: 'How much is it' },
              ]
            },
          ]
        })
      },
      {
        courseId: courseIds[1], title: '口语跟读：餐厅点餐', type: 'speaking', orderNum: 3,
        contentJson: JSON.stringify({
          sentences: [
            { sentence: 'Can I have the menu, please?', translation: '请给我菜单好吗？', phonetic: '/kæn aɪ hæv ðə ˈmenjuː pliːz/' },
            { sentence: 'I would like a glass of water.', translation: '我想要一杯水。', phonetic: '/aɪ wʊd laɪk ə ɡlæs əv ˈwɔːtər/' },
            { sentence: 'Could I have the bill, please?', translation: '请买单。', phonetic: '/kʊd aɪ hæv ðə bɪl pliːz/' },
            { sentence: 'The food was wonderful, thank you.', translation: '食物很棒，谢谢。', phonetic: '/ðə fuːd wɒz ˈwʌndərfəl θæŋk juː/' },
            { sentence: 'Do you have any vegetarian dishes?', translation: '你们有素食菜品吗？', phonetic: '/duː juː hæv ˈeni ˌvedʒəˈteriən ˈdɪʃɪz/' },
          ]
        })
      },
      {
        courseId: courseIds[1], title: '听力练习：购物场景', type: 'listening', orderNum: 4,
        contentJson: JSON.stringify({
          questions: [
            { question: '店员说"Can I help you?"，你想自己看看，应该怎么回答？', options: ["I'm just looking, thanks.", "Yes, I want this.", "No, thank you.", "How much is it?"], answer: "I'm just looking, thanks." },
            { question: '"It\'s on sale"是什么意思？', options: ['已售完', '在打折', '已预订', '新品上市'], answer: '在打折' },
            { question: '收银员问"How would you like to pay?"，以下哪个回答不合适？', options: ['By credit card', 'In cash', 'I am fine', 'By mobile payment'], answer: 'I am fine' },
            { question: '"Keep the change"是什么意思？', options: ['保留零钱', '不用找零了', '换一件', '退货'], answer: '不用找零了' },
            { question: '听到"Size M"，M代表什么？', options: ['Small', 'Medium', 'Large', 'Extra large'], answer: 'Medium' },
          ]
        })
      },
    ]

    // Course 3: 日语 A1 - 日语五十音入门
    const jaA1Lessons = [
      {
        courseId: courseIds[2], title: '基础词汇：日常问候', type: 'vocabulary', orderNum: 1,
        contentJson: JSON.stringify({
          words: [
            { word: 'おはよう', translation: '早上好', phonetic: 'ohayou', example: 'おはようございます。' },
            { word: 'こんにちは', translation: '你好', phonetic: 'konnichiwa', example: 'こんにちは、元気ですか？' },
            { word: 'さようなら', translation: '再见', phonetic: 'sayounara', example: 'さようなら、また明日。' },
            { word: 'ありがとう', translation: '谢谢', phonetic: 'arigatou', example: 'ありがとうございます。' },
            { word: 'すみません', translation: '对不起/打扰了', phonetic: 'sumimasen', example: 'すみません、道を教えてください。' },
            { word: 'はい', translation: '是', phonetic: 'hai', example: 'はい、そうです。' },
            { word: 'いいえ', translation: '不是', phonetic: 'iie', example: 'いいえ、違います。' },
            { word: '名前', translation: '名字', phonetic: 'namae', example: 'お名前は何ですか？' },
            { word: '先生', translation: '老师', phonetic: 'sensei', example: '田中先生は日本語の先生です。' },
            { word: '友達', translation: '朋友', phonetic: 'tomodachi', example: '彼は私の友達です。' },
          ]
        })
      },
      {
        courseId: courseIds[2], title: '基础语法：です/ます体', type: 'grammar', orderNum: 2,
        contentJson: JSON.stringify({
          grammarPoints: [
            {
              pattern: '〜は〜です (A wa B desu)',
              explanation: '最基本的判断句型，相当于"A是B"。は是主题助词，です是礼貌体的判断助动词。',
              exercises: [
                { type: 'fill', question: '私___学生です。', answer: 'は' },
                { type: 'choice', question: 'これは本___。', options: ['は本です', 'が本です', 'を本です', 'に本です'], answer: 'は本です' },
                { type: 'reorder', question: 'です / 日本人 / 田中さん / は', answer: '田中さんは日本人です' },
              ]
            },
            {
              pattern: '〜ます (masu form)',
              explanation: '动词的礼貌体形式。食べる→食べます、飲む→飲みます、行く→行きます。',
              exercises: [
                { type: 'fill', question: '毎日日本語を勉強___。', answer: 'します' },
                { type: 'choice', question: '朝ごはんを___。', options: ['食べます', '食べる', '食べって', '食べいて'], answer: '食べます' },
                { type: 'reorder', question: '学校 / に / 行きます / 毎日', answer: '毎日学校に行きます' },
              ]
            },
            {
              pattern: '〜はどこですか (Where is...?)',
              explanation: '询问地点的句型。どこ表示"哪里"，か是疑问助词。',
              exercises: [
                { type: 'fill', question: 'トイレは___ですか。', answer: 'どこ' },
                { type: 'choice', question: '駅は___ですか。', options: ['だれ', 'どこ', 'なに', 'いつ'], answer: 'どこ' },
                { type: 'reorder', question: 'です / は / どこ / 駅 / か', answer: '駅はどこですか' },
              ]
            },
          ]
        })
      },
      {
        courseId: courseIds[2], title: '口语跟读：自我介绍', type: 'speaking', orderNum: 3,
        contentJson: JSON.stringify({
          sentences: [
            { sentence: 'はじめまして、田中です。', translation: '初次见面，我是田中。', phonetic: 'hajimemashite, tanaka desu' },
            { sentence: '日本語を勉強しています。', translation: '我正在学习日语。', phonetic: 'nihongo o benkyou shite imasu' },
            { sentence: 'よろしくお願いします。', translation: '请多多关照。', phonetic: 'yoroshiku onegaishimasu' },
            { sentence: '私は中国から来ました。', translation: '我来自中国。', phonetic: 'watashi wa chuugoku kara kimashita' },
            { sentence: '日本が好きです。', translation: '我喜欢日本。', phonetic: 'nihon ga suki desu' },
          ]
        })
      },
      {
        courseId: courseIds[2], title: '听力练习：日常寒暄', type: 'listening', orderNum: 4,
        contentJson: JSON.stringify({
          questions: [
            { question: '早上遇到邻居，应该说什么？', options: ['こんにちは', 'おはようございます', 'さようなら', 'すみません'], answer: 'おはようございます' },
            { question: '别人对你说「ありがとう」，你应该怎么回答？', options: ['すみません', 'さようなら', 'どういたしまして', 'おはよう'], answer: 'どういたしまして' },
            { question: '「いってらっしゃい」是什么意思？', options: ['欢迎回来', '我出门了', '您慢走', '晚安'], answer: '您慢走' },
            { question: '在餐厅想叫服务员，应该说什么？', options: ['おはよう', 'すみません', 'さようなら', 'こんにちは'], answer: 'すみません' },
            { question: '「お元気ですか」是在问什么？', options: ['你的名字', '你的年龄', '你好吗', '你在做什么'], answer: '你好吗' },
          ]
        })
      },
    ]

    // Course 4: 日语 A2 - 日语基础会话
    const jaA2Lessons = [
      {
        courseId: courseIds[3], title: '日常词汇：生活与出行', type: 'vocabulary', orderNum: 1,
        contentJson: JSON.stringify({
          words: [
            { word: '電車', translation: '电车', phonetic: 'densha', example: '電車で学校に行きます。' },
            { word: '切符', translation: '车票', phonetic: 'kippu', example: '切符を買いましたか？' },
            { word: '病院', translation: '医院', phonetic: 'byouin', example: '病院へ行かなければなりません。' },
            { word: '薬', translation: '药', phonetic: 'kusuri', example: '薬を飲みましたか？' },
            { word: '天気', translation: '天气', phonetic: 'tenki', example: '今日の天気はいいですね。' },
            { word: '料理', translation: '料理/做菜', phonetic: 'ryouri', example: '日本料理が好きです。' },
            { word: '仕事', translation: '工作', phonetic: 'shigoto', example: '仕事は忙しいです。' },
            { word: '休み', translation: '休息/假期', phonetic: 'yasumi', example: '明日は休みです。' },
            { word: '住所', translation: '住址', phonetic: 'juusho', example: '住所を教えてください。' },
            { word: '電話', translation: '电话', phonetic: 'denwa', example: '電話番号を知っていますか？' },
          ]
        })
      },
      {
        courseId: courseIds[3], title: '语法：て形与过去时', type: 'grammar', orderNum: 2,
        contentJson: JSON.stringify({
          grammarPoints: [
            {
              pattern: '〜てください (Please do...)',
              explanation: 'て形+ください表示礼貌地请求对方做某事。飲む→飲んで、食べる→食べて、書く→書いて。',
              exercises: [
                { type: 'fill', question: 'ここに名前を書いて___。', answer: 'ください' },
                { type: 'choice', question: 'ちょっと待って___。', options: ['ください', 'します', 'あります', 'います'], answer: 'ください' },
                { type: 'reorder', question: 'ください / 教えて / 名前 / を', answer: '名前を教えてください' },
              ]
            },
            {
              pattern: '〜ました / 〜ませんでした (Past tense)',
              explanation: 'ます的过去式是ました，否定过去式是ませんでした。食べます→食べました、行きます→行きました。',
              exercises: [
                { type: 'fill', question: '昨日、映画を見___。', answer: 'ました' },
                { type: 'choice', question: '先週、旅行に___。', options: ['行きました', '行きます', '行って', '行く'], answer: '行きました' },
                { type: 'reorder', question: 'ました / 食べ / 昨日 / ラーメン / を', answer: '昨日ラーメンを食べました' },
              ]
            },
            {
              pattern: '〜たいです (I want to...)',
              explanation: '动词ます形去掉ます+たいです表示想做某事。行きます→行きたいです、食べます→食べたいです。',
              exercises: [
                { type: 'fill', question: '日本へ行___です。', answer: 'きたい' },
                { type: 'choice', question: '何を___たいですか。', options: ['食べ', '食べる', '食べて', '食べた'], answer: '食べ' },
                { type: 'reorder', question: 'たい / です / 行きたい / 日本 / へ', answer: '日本へ行きたいです' },
              ]
            },
          ]
        })
      },
      {
        courseId: courseIds[3], title: '口语跟读：问路与出行', type: 'speaking', orderNum: 3,
        contentJson: JSON.stringify({
          sentences: [
            { sentence: '駅はどこですか。', translation: '车站在哪里？', phonetic: 'eki wa doko desu ka' },
            { sentence: 'この電車は東京に行きますか。', translation: '这趟电车去东京吗？', phonetic: 'kono densha wa toukyou ni ikimasu ka' },
            { sentence: '切符を一枚お願いします。', translation: '请给我一张车票。', phonetic: 'kippu o ichimai onegaishimasu' },
            { sentence: '次の駅で降ります。', translation: '我在下一站下车。', phonetic: 'tsugi no eki de orimasu' },
            { sentence: 'ここから歩いて何分ですか。', translation: '从这里走路要几分钟？', phonetic: 'koko kara aruite nanpun desu ka' },
          ]
        })
      },
      {
        courseId: courseIds[3], title: '听力练习：出行场景', type: 'listening', orderNum: 4,
        contentJson: JSON.stringify({
          questions: [
            { question: '听到「次の駅は新宿です」，接下来会怎样？', options: ['到达新宿站', '离开新宿站', '经过新宿站', '新宿站关闭了'], answer: '到达新宿站' },
            { question: '售票员说「切符をお忘れなく」，是什么意思？', options: ['请买票', '别忘了带车票', '车票已售完', '请出示车票'], answer: '别忘了带车票' },
            { question: '「乗り換え」是什么意思？', options: ['上车', '下车', '换乘', '候车'], answer: '换乘' },
            { question: '听到「終点です」，意味着什么？', options: ['起点站', '终点站', '换乘站', '临时站'], answer: '终点站' },
            { question: '「各駅停車」与「急行」的区别是什么？', options: ['速度相同', '各站停车每站都停，急行只停大站', '急行更慢', '没有区别'], answer: '各站停车每站都停，急行只停大站' },
          ]
        })
      },
    ]

    // Course 5: 韩语 A1 - 韩语发音入门
    const koA1Lessons = [
      {
        courseId: courseIds[4], title: '基础词汇：日常问候', type: 'vocabulary', orderNum: 1,
        contentJson: JSON.stringify({
          words: [
            { word: '안녕하세요', translation: '你好', phonetic: 'annyeonghaseyo', example: '안녕하세요, 만나서 반갑습니다.' },
            { word: '감사합니다', translation: '谢谢', phonetic: 'gamsahamnida', example: '도와주셔서 감사합니다.' },
            { word: '미안합니다', translation: '对不起', phonetic: 'mianhamnida', example: '늦어서 미안합니다.' },
            { word: '네', translation: '是', phonetic: 'ne', example: '네, 맞습니다.' },
            { word: '아니요', translation: '不是', phonetic: 'aniyo', example: '아니요, 괜찮습니다.' },
            { word: '이름', translation: '名字', phonetic: 'ireum', example: '이름이 뭐예요?' },
            { word: '선생님', translation: '老师', phonetic: 'seonsaengnim', example: '선생님, 안녕하세요.' },
            { word: '친구', translation: '朋友', phonetic: 'chingu', example: '이 사람은 제 친구입니다.' },
            { word: '학생', translation: '学生', phonetic: 'haksaeng', example: '저는 학생입니다.' },
            { word: '주세요', translation: '请给我', phonetic: 'juseyo', example: '물 주세요.' },
          ]
        })
      },
      {
        courseId: courseIds[4], title: '基础语法：입니다/습니다', type: 'grammar', orderNum: 2,
        contentJson: JSON.stringify({
          grammarPoints: [
            {
              pattern: 'N입니다 / N이/가 아닙니다',
              explanation: '韩语的判断句型。입니다相当于"是"，이/가 아닙니다相当于"不是"。有收音时用이，无收音时用가。',
              exercises: [
                { type: 'fill', question: '저는 학생___.', answer: '입니다' },
                { type: 'choice', question: '이것은 책___ 아닙니다.', options: ['이', '가', '을', '는'], answer: '이' },
                { type: 'reorder', question: '입니다 / 한국 사람 / 저는', answer: '저는 한국 사람입니다' },
              ]
            },
            {
              pattern: 'N은/는 (Topic particle)',
              explanation: '表示句子主题的助词。有收音后用은，无收音后用는。저는, 이름은, 학생은。',
              exercises: [
                { type: 'fill', question: '저___ 학생입니다.', answer: '는' },
                { type: 'choice', question: '이름__ 뭐예요?', options: ['은', '는', '이', '가'], answer: '은' },
                { type: 'reorder', question: '입니다 / 선생님은 / 한국 사람', answer: '선생님은 한국 사람입니다' },
              ]
            },
            {
              pattern: 'N이/가 N입니다 (Subject + 입니다)',
              explanation: '이/가是主语助词，强调主语本身。有收音后用이，无收音后用가。',
              exercises: [
                { type: 'fill', question: '이것__ 책입니다.', answer: '이' },
                { type: 'choice', question: '저 사람__ 누구예요?', options: ['이', '가', '은', '는'], answer: '이' },
                { type: 'reorder', question: '가 / 학생입니다 / 제가', answer: '제가 학생입니다' },
              ]
            },
          ]
        })
      },
      {
        courseId: courseIds[4], title: '口语跟读：自我介绍', type: 'speaking', orderNum: 3,
        contentJson: JSON.stringify({
          sentences: [
            { sentence: '안녕하세요, 만나서 반갑습니다.', translation: '你好，很高兴认识你。', phonetic: 'annyeonghaseyo, mannaseo bangapseumnida' },
            { sentence: '저는 김민수입니다.', translation: '我是金敏秀。', phonetic: 'jeoneun gimminsuyimnida' },
            { sentence: '중국에서 왔습니다.', translation: '我来自中国。', phonetic: 'jungugeseo watseumnida' },
            { sentence: '한국어를 공부하고 있습니다.', translation: '我正在学习韩语。', phonetic: 'hangugeoreul gongbuhago itseumnida' },
            { sentence: '잘 부탁드립니다.', translation: '请多多关照。', phonetic: 'jal butakdeurimnida' },
          ]
        })
      },
      {
        courseId: courseIds[4], title: '听力练习：日常问候', type: 'listening', orderNum: 4,
        contentJson: JSON.stringify({
          questions: [
            { question: '早上遇到老师，应该说什么？', options: ['안녕하세요', '안녕히 가세요', '감사합니다', '미안합니다'], answer: '안녕하세요' },
            { question: '别人对你说「감사합니다」，你应该怎么回答？', options: ['미안합니다', '천만에요', '안녕하세요', '네'], answer: '천만에요' },
            { question: '「실례합니다」是什么意思？', options: ['谢谢', '对不起', '打扰了', '再见'], answer: '打扰了' },
            { question: '离开时说「안녕히 가세요」，对方应该怎么回答？', options: ['안녕히 가세요', '감사합니다', '미안합니다', '네, 알겠습니다'], answer: '안녕히 가세요' },
            { question: '「반갑습니다」通常在什么时候说？', options: ['告别时', '道歉时', '初次见面时', '感谢时'], answer: '初次见面时' },
          ]
        })
      },
    ]

    // Course 6: 韩语 A2 - 韩语基础会话
    const koA2Lessons = [
      {
        courseId: courseIds[5], title: '日常词汇：饮食与购物', type: 'vocabulary', orderNum: 1,
        contentJson: JSON.stringify({
          words: [
            { word: '음식', translation: '食物', phonetic: 'eumsik', example: '한국 음식을 좋아해요.' },
            { word: '주문', translation: '点餐', phonetic: 'jumun', example: '주문하시겠어요?' },
            { word: '가격', translation: '价格', phonetic: 'gagyeok', example: '가격이 얼마예요?' },
            { word: '할인', translation: '打折', phonetic: 'harin', example: '오늘 할인을 해요.' },
            { word: '맛있다', translation: '好吃', phonetic: 'masitda', example: '이 음식은 정말 맛있어요!' },
            { word: '계산', translation: '结账', phonetic: 'gyesan', example: '계산해 주세요.' },
            { word: '쇼핑', translation: '购物', phonetic: 'syoping', example: '쇼핑하러 가고 싶어요.' },
            { word: '사이즈', translation: '尺码', phonetic: 'saijeu', example: '사이즈가 어떻게 돼요?' },
            { word: '현금', translation: '现金', phonetic: 'hyeongeum', example: '현금으로 낼게요.' },
            { word: '카드', translation: '卡片/卡', phonetic: 'kadeu', example: '카드로 결제해도 돼요?' },
          ]
        })
      },
      {
        courseId: courseIds[5], title: '语法：动词过去时与想要', type: 'grammar', orderNum: 2,
        contentJson: JSON.stringify({
          grammarPoints: [
            {
              pattern: 'V-았/었어요 (Past tense)',
              explanation: '动词过去时态。词干有ㅏ/ㅗ时用-았어요，其他用-었어요。먹다→먹었어요, 가다→갔어요。',
              exercises: [
                { type: 'fill', question: '어제 한국어를 공부___요.', answer: '했어' },
                { type: 'choice', question: '어제 친구를 ___.', options: ['만났어요', '만나요', '만날 거예요', '만나고 싶어요'], answer: '만났어요' },
                { type: 'reorder', question: '먹었어요 / 어제 / 불고기를', answer: '어제 불고기를 먹었어요' },
              ]
            },
            {
              pattern: 'V-고 싶어요 (I want to...)',
              explanation: '表示想做某事。动词词干+고 싶어요。가다→가고 싶어요, 먹다→먹고 싶어요。',
              exercises: [
                { type: 'fill', question: '한국에 가___ 싶어요.', answer: '고' },
                { type: 'choice', question: '뭐 ___ 싶어요?', options: ['먹고', '먹어', '먹은', '먹을'], answer: '먹고' },
                { type: 'reorder', question: '싶어요 / 배우고 / 한국어를', answer: '한국어를 배우고 싶어요' },
              ]
            },
            {
              pattern: 'V-(으)ㄹ 수 있어요/없어요 (Can/Cannot)',
              explanation: '表示能力或可能性。有收音时用-을 수，无收音时用-ㄹ 수。먹다→먹을 수 있어요, 가다→갈 수 있어요。',
              exercises: [
                { type: 'fill', question: '한국어를 말___ 수 있어요.', answer: '할' },
                { type: 'choice', question: '수영을 ___ 수 있어요?', options: ['하', '할', '한', '하여'], answer: '할' },
                { type: 'reorder', question: '없어요 / 갈 / 수 / 내일은', answer: '내일은 갈 수 없어요' },
              ]
            },
          ]
        })
      },
      {
        courseId: courseIds[5], title: '口语跟读：餐厅点餐', type: 'speaking', orderNum: 3,
        contentJson: JSON.stringify({
          sentences: [
            { sentence: '메뉴 좀 보여주세요.', translation: '请给我看看菜单。', phonetic: 'menyu jom boyeojuseyo' },
            { sentence: '불고기 2인분 주세요.', translation: '请给我两人份的烤肉。', phonetic: 'bulgogi iinbun juseyo' },
            { sentence: '맛있게 드세요!', translation: '请慢用！', phonetic: 'masitge deuseyo' },
            { sentence: '계산해 주세요.', translation: '请结账。', phonetic: 'gyesanhae juseyo' },
            { sentence: '정말 맛있었어요!', translation: '真的很好吃！', phonetic: 'jeongmal masisseosseoyo' },
          ]
        })
      },
      {
        courseId: courseIds[5], title: '听力练习：购物场景', type: 'listening', orderNum: 4,
        contentJson: JSON.stringify({
          questions: [
            { question: '店员说「뭐 도와드릴까요?」，是什么意思？', options: ['你要买什么？', '我能帮你吗？', '这个多少钱？', '欢迎光临'], answer: '我能帮你吗？' },
            { question: '「얼마예요?」是在问什么？', options: ['在哪里？', '是谁？', '多少钱？', '什么时候？'], answer: '多少钱？' },
            { question: '听到「카드로 결제할 수 있어요」，是什么意思？', options: ['只能用现金', '可以刷卡', '不能结账', '卡已过期'], answer: '可以刷卡' },
            { question: '「사이즈가 큰 거 있어요?」是什么意思？', options: ['有更便宜的吗？', '有大一号的吗？', '有其他颜色吗？', '有新的吗？'], answer: '有大一号的吗？' },
            { question: '听到「영수증 필요하세요?」，应该怎么回答如果不需要？', options: ['네, 필요해요', '아니요, 괜찮아요', '감사합니다', '미안합니다'], answer: '아니요, 괜찮아요' },
          ]
        })
      },
    ]

    const allLessons = [...enA1Lessons, ...enA2Lessons, ...jaA1Lessons, ...jaA2Lessons, ...koA1Lessons, ...koA2Lessons]
    for (const lesson of allLessons) {
      insertLesson.run({
        courseId: lesson.courseId,
        title: lesson.title,
        type: lesson.type,
        orderNum: lesson.orderNum,
        contentJson: lesson.contentJson,
      })
    }

    // === Achievements ===
    const achievements = [
      { title: '初学者', description: '完成第一节课', icon: '🌱', category: 'learning', targetValue: 1 },
      { title: '坚持不懈', description: '连续学习7天', icon: '🔥', category: 'streak', targetValue: 7 },
      { title: '词汇达人', description: '学习100个单词', icon: '📚', category: 'vocabulary', targetValue: 100 },
      { title: '语法大师', description: '完成20个语法练习', icon: '✏️', category: 'grammar', targetValue: 20 },
      { title: '口语新秀', description: '完成10次口语跟读', icon: '🎤', category: 'speaking', targetValue: 10 },
      { title: '听力高手', description: '完成10次听力训练', icon: '👂', category: 'listening', targetValue: 10 },
      { title: '社区之星', description: '发表5条动态', icon: '⭐', category: 'community', targetValue: 5 },
      { title: '学习达人', description: '获得1000经验值', icon: '🏆', category: 'xp', targetValue: 1000 },
    ]

    for (const achievement of achievements) {
      insertAchievement.run({
        title: achievement.title,
        description: achievement.description,
        icon: achievement.icon,
        category: achievement.category,
        targetValue: achievement.targetValue,
      })
    }

    // === Seed Posts (need a user first - create a demo user) ===
    const demoPasswordHash = bcrypt.hashSync('demo123', 10)
    const demoUserResult = db.prepare(`
      INSERT INTO users (username, email, password_hash, avatar, level, xp, streak)
      VALUES (@username, @email, @passwordHash, @avatar, @level, @xp, @streak)
    `).run({
      username: 'linguabot',
      email: 'bot@linguaverse.com',
      passwordHash: demoPasswordHash,
      avatar: '/avatars/bot.png',
      level: 5,
      xp: 320,
      streak: 3,
    })
    const demoUserId = Number(demoUserResult.lastInsertRowid)

    const posts = [
      { userId: demoUserId, content: '今天学完了日语五十音，感觉平假名还好，片假名有点难记。大家有什么好方法吗？🎌', language: 'ja', likes: 12 },
      { userId: demoUserId, content: 'Just finished my first English A1 lesson! The vocabulary section was really helpful. 🎉', language: 'en', likes: 8 },
      { userId: demoUserId, content: '한국어 발음이 너무 어려워요... 특히 받침 발음이요. 연습하면 나아질까요? 💪', language: 'ko', likes: 15 },
      { userId: demoUserId, content: '连续打卡第三天！坚持就是胜利！大家一起加油吧！🔥', language: 'en', likes: 20 },
      { userId: demoUserId, content: '英語のリスニング問題、正解率が上がってきました！毎日少しずつ練習するのがコツです。🎧', language: 'ja', likes: 9 },
      { userId: demoUserId, content: '推荐一个学韩语的方法：看韩剧的时候跟着读台词，对口语提升很有帮助！📺', language: 'ko', likes: 18 },
      { userId: demoUserId, content: 'Grammar is finally making sense! The pattern exercises really help me understand the structure. ✏️', language: 'en', likes: 6 },
    ]

    for (const post of posts) {
      insertPost.run({
        userId: post.userId,
        content: post.content,
        language: post.language,
        likes: post.likes,
      })
    }
  })

  seedTransaction()
}

export default db
