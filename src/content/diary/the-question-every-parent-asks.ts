import type { DiaryEntry } from "../types";

const entry: DiaryEntry = {
  slug: "the-question-every-parent-asks",
  date: "2026-10-02",
  dateline: {
    th: "คืนวันพฤหัส หลังลูกค้าคนสุดท้ายกลับไป",
    en: "Thursday night, after the last client left",
  },
  tags: ["family", "health", "education"],

  th: {
    title: "คำถามที่พ่อแม่ทุกคนถาม",
    excerpt:
      "\"ถ้าเกิดอะไรขึ้นกับเรา ลูกจะโอเคไหม\" เมย์ตอบคำถามนี้ยังไง และทำไมมันถึงเป็นเรื่องของตัวเลขก่อนจะเป็นเรื่องของความรู้สึก",
    blocks: [
      {
        type: "p",
        text: "วันนี้มีคุณแม่ท่านหนึ่งมาคุยกับเมย์หลังเลิกงาน เราคุยเรื่องทั่วไปอยู่พักใหญ่ จนเธอหยุดไปสักครู่ แล้วถามเบาๆ ว่า \"ถ้าเกิดอะไรขึ้นกับเรา ลูกจะโอเคไหมคะ\"",
      },
      {
        type: "p",
        text: "เมย์ได้ยินคำถามนี้บ่อยกว่าคำถามไหนๆ ค่ะ ทั้งจากคุณพ่อและคุณแม่ และแทบทุกครั้งจะถามเบาๆ เหมือนกลัวว่าพูดดังๆ แล้วมันจะกลายเป็นจริง",
      },
      {
        type: "p",
        text: "เมย์ตอบแบบนี้ค่ะ และคำตอบอาจทำให้คุณแปลกใจนิดหน่อย",
      },
      { type: "h2", text: "มันคือโจทย์เลขก่อน แล้วค่อยเป็นเรื่องของหัวใจ" },
      {
        type: "p",
        text: "เมย์รู้ว่าฟังดูแข็งไปหน่อย แต่ทันทีที่เราแปลงความกลัวให้เป็นตัวเลข ความกลัวจะเล็กลง เพราะตัวเลขคือสิ่งที่เราจัดการได้ค่ะ",
      },
      {
        type: "p",
        text: "คำถามที่ว่า \"ลูกจะโอเคไหม\" จริงๆ แล้วแปลว่า \"ถ้าไม่มีรายได้ของเรา บ้านนี้จะมีเงินพอใช้ไปอีกกี่ปี\" และนั่นเป็นสิ่งที่คำนวณได้ค่ะ",
      },
      {
        type: "ul",
        items: [
          "รายได้ที่ต้องทดแทน บ้านควรอยู่ได้แบบเดิมอีกกี่ปี จนกว่าลูกคนเล็กจะดูแลตัวเองได้ คูณรายได้ต่อปีของคุณด้วยจำนวนปีนั้น",
          "หนี้สิน บ้าน รถ หรือภาระอื่นๆ ที่คุณไม่อยากทิ้งไว้ให้คนข้างหลัง",
          "ค่าเรียนของลูก ประมาณคร่าวๆ ต่อคน ตั้งแต่ตอนนี้จนถึงระดับที่คุณตั้งใจไว้",
          "หักออกด้วยสิ่งที่มีอยู่แล้ว เงินเก็บ ประกันที่มีอยู่ สวัสดิการจากที่ทำงาน กองทุนสำรองเลี้ยงชีพ",
        ],
      },
      {
        type: "p",
        text: "ตัวเลขที่เหลือคือช่องว่างค่ะ บางครั้งใหญ่กว่าที่คิด บ่อยครั้งเล็กกว่าที่กลัวมาก แต่พอเห็นมันแล้ว บทสนทนาจะเปลี่ยนจากกังวลเป็นวางแผนทันที",
      },
      {
        type: "note",
        title: "สิ่งที่เมย์สังเกตเห็น",
        text: "ไม่มีใครร้องไห้ตอนเห็นตัวเลขนะคะ ส่วนใหญ่จะถอนหายใจยาวๆ แล้วพูดว่า โอเค แค่นี้เองเหรอ เพราะช่องว่างที่มีชื่อ มันน่ากลัวน้อยกว่าช่องว่างที่ไม่มีชื่อเสมอค่ะ",
      },
      { type: "h2", text: "ก่อนจะคิดถึงอย่างอื่น ขอเรื่องสุขภาพก่อนค่ะ" },
      {
        type: "p",
        text: "เมย์เริ่มตรงนี้กับทุกบ้านค่ะ ความคุ้มครองสุขภาพของคนที่หารายได้ต้องมาก่อนอย่างอื่น",
      },
      {
        type: "p",
        text: "เหตุผลง่ายมากค่ะ การเจ็บป่วยหนักครั้งเดียวที่ไม่มีประกัน กินเงินเก็บทั้งหมดได้ แล้วตามด้วยกองทุนการศึกษาของลูกในไม่กี่สัปดาห์ และเกิดขึ้นบ่อยกว่าเรื่องที่เรากลัวที่สุดมาก ถ้ายังไม่ดูแลเรื่องนี้ เรื่องอื่นก็ยังไม่ปลอดภัยค่ะ",
      },
      { type: "h2", text: "สิ่งเดียวที่เมย์พูดกับพ่อแม่ทุกคน" },
      {
        type: "p",
        text: "แผนการศึกษาของลูกที่มีสิทธิ์ยกเว้นเบี้ยประกันค่ะ พูดง่ายๆ คือ ถ้าผู้ปกครองที่จ่ายเบี้ยเสียชีวิตหรือทุพพลภาพถาวร บริษัทจะดูแลเบี้ยที่เหลือให้ และแผนยังเดินต่อจนครบตามกำหนดเดิม",
      },
      {
        type: "p",
        text: "เมย์ชอบมันเพราะตอบคำถามของคุณแม่ท่านนั้นตรงๆ เลยค่ะ ไม่ว่าจะเกิดอะไรขึ้น ค่าเรียนของลูกยังเดินต่อ เมย์ไม่ได้แนะนำทุกอย่างให้ทุกคน แต่เรื่องนี้เมย์พูดถึงเสมอ",
      },
      { type: "h2", text: "ก้าวแรกเล็กกว่าที่คิดเยอะเลยค่ะ" },
      {
        type: "p",
        text: "ยังไม่ต้องเลือกแบบประกันนะคะ แค่เขียนตัวเลขสี่ตัวข้างบนลงกระดาษ ไม่ต้องตรงเป๊ะ ขอแค่ตรงไปตรงมา คืนนี้คุณแม่ท่านนั้นก็ทำแค่นี้ค่ะ ใช้เวลาสิบนาที",
      },
      {
        type: "p",
        text: "ถ้าคุณอยากเขียนตัวเลขของตัวเองแล้วอยากมีคนช่วยดู ส่งมาให้เมย์ได้นะคะ หรือจะเล่าเรื่องครอบครัวของคุณให้ฟังก่อนก็ได้ค่ะ แล้วเรามาดูไปด้วยกัน",
      },
    ],
  },

  en: {
    title: "The question every parent asks",
    excerpt:
      "\"If something happens to me, will the kids be okay?\" How I answer it, and why it's a maths question before it's an emotional one.",
    blocks: [
      {
        type: "p",
        text: "A mother came to see me after work today. We talked about ordinary things for a while, then she went quiet and asked, softly, \"If something happens to me, will the kids be okay?\"",
      },
      {
        type: "p",
        text: "I hear this question more than any other. From fathers and mothers alike, almost always in a lowered voice, as if saying it out loud might make it real.",
      },
      {
        type: "p",
        text: "Here's how I answer it; it might surprise you.",
      },
      { type: "h2", text: "It's a maths question first, then a heart question" },
      {
        type: "p",
        text: "I know that sounds cold. But the moment we turn a fear into a number, the fear gets smaller. Numbers are things we can do something about.",
      },
      {
        type: "p",
        text: "\"Will the kids be okay?\" really means \"Without my income, how many years could this household keep going?\" And that can be worked out.",
      },
      {
        type: "ul",
        items: [
          "Income to replace. How many years should the household carry on as it is, until the youngest can stand on their own? Multiply your yearly income by that.",
          "Debts. The home loan, the car, anything you wouldn't want to leave to someone else.",
          "Education. A rough figure per child, from now until the level you have in mind.",
          "Minus what you already have. Savings, any existing policies, benefits from your employer, your provident fund.",
        ],
      },
      {
        type: "p",
        text: "What's left is the gap. Sometimes it's bigger than expected; often it's much smaller than feared. Either way, once you can see it, the conversation turns from worrying into planning.",
      },
      {
        type: "note",
        title: "Something I've noticed",
        text: "Nobody cries when they see the number. Most people let out a long breath and say, okay, that's all? A gap with a name on it is always less frightening than one without.",
      },
      { type: "h2", text: "Before anything else: health" },
      {
        type: "p",
        text: "I start here with every family. Health cover for the person earning the income comes before everything else.",
      },
      {
        type: "p",
        text: "The reason is simple. One serious illness without cover can swallow the savings first and the education fund next, within weeks, and it happens far more often than the things we fear most. Until this is handled, nothing else is really safe.",
      },
      { type: "h2", text: "The one thing I always mention to parents" },
      {
        type: "p",
        text: "An education plan for the child with a premium waiver. In plain words: if the parent paying for the plan passes away or becomes permanently disabled, the company takes over the remaining payments and the plan runs to the end as originally intended.",
      },
      {
        type: "p",
        text: "I love it because it answers that mother's question directly: whatever happens, the school fees keep arriving. I don't recommend everything to everyone, but this one I bring up every time.",
      },
      { type: "h2", text: "The first step is smaller than you think" },
      {
        type: "p",
        text: "You don't have to choose a plan yet. Just write the four numbers above on a piece of paper. They don't need to be exact, only honest. That's all the mother did tonight; it took ten minutes.",
      },
      {
        type: "p",
        text: "If you'd like to write down your numbers and have someone look at them with you, send them to me. Or just tell me a little about your family first. We'll work it out together.",
      },
    ],
  },
};

export default entry;
