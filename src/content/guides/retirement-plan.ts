import type { Guide } from "../types";

const guide: Guide = {
  slug: "retirement-plan",
  icon: "sunrise",
  order: 2,
  updated: "2026-10-20",
  relatedTool: "retirement",

  th: {
    title: "เกษียณในเมืองไทย: แผนฉบับภาษาคน",
    subtitle:
      "เงินเกษียณสามชั้น วิธีคิดคร่าว ๆ ว่าต้องมีเท่าไหร่ และทำไมการเริ่มก่อน 10 ปีถึงสำคัญกว่าการเลือกสินค้าที่สมบูรณ์แบบ",
    readingMinutes: 7,
    summary: [
      "ประเทศไทยเข้าสู่สังคมสูงวัยแล้ว และคนรุ่นเราจะพึ่งลูกหลานแบบรุ่นพ่อแม่ไม่ได้อีกต่อไป เงินเกษียณต้องเป็นเรื่องที่เราวางแผนเอง",
      "คิดเป็นสามชั้น: สิ่งที่รัฐและนายจ้างให้ เงินออมส่วนตัวที่ได้สิทธิลดหย่อนภาษี (RMF และประกันบำนาญ) และชั้นเติบโตที่มูลค่าขึ้นลงได้",
      "สูตรคร่าว ๆ: ค่าใช้จ่ายต่อเดือน × 12 × จำนวนปีหลังเกษียณ แล้วเผื่อเงินเฟ้อประมาณ 3% ต่อปี ในเว็บนี้มีเครื่องคำนวณให้ค่ะ",
      "ออมเดือนละ 5,000 บาทตั้งแต่อายุ 30 อาจโตเป็นเกือบสองเท่าของคนที่เริ่มตอน 40 และเกือบห้าเท่าของคนที่เริ่มตอน 50 เวลาคือส่วนผสมที่สำคัญที่สุด",
    ],
    blocks: [
      {
        type: "p",
        text: "ในบรรดาเรื่องทั้งหมดที่เมย์ได้คุยกับลูกค้า เรื่องเกษียณคือเรื่องที่เมย์ชอบที่สุดค่ะ เพราะเป็นแผนเดียวที่เวลาทำงานแทนเราได้มากกว่าครึ่ง ถ้าเราเริ่มให้มันทำ ไม่มีศัพท์ยาก ไม่มีสินค้าเจาะจง มีแค่วิธีคิดที่เมย์ใช้เองค่ะ",
      },
      { type: "h2", text: "ทำไมต้องคิดเรื่องนี้ตอนนี้" },
      {
        type: "p",
        text: "ประเทศไทยเข้าสู่สังคมสูงวัยโดยสมบูรณ์แล้วค่ะ คนไทยประมาณหนึ่งในห้ามีอายุ 60 ปีขึ้นไป และสัดส่วนนี้จะโตขึ้นเรื่อย ๆ ขณะที่ครอบครัวเล็กลงทุกที",
      },
      {
        type: "p",
        text: "รุ่นพ่อแม่ของเราอาจพึ่งลูกหลานในวัยชราได้ แต่รุ่นเราคือรุ่นแรกที่ต้องยอมรับว่า ถ้าเราไม่เตรียมเอง จะไม่มีใครเตรียมให้ ไม่ได้จะขู่นะคะ แค่อยากให้เริ่มเร็วกว่าที่รู้สึกว่าควร",
      },
      { type: "h2", text: "เงินเกษียณสามชั้น" },
      {
        type: "p",
        text: "เมย์วาดเป็นบ้านสามชั้นค่ะ แต่ละชั้นมีหน้าที่ต่างกัน และบ้านที่มั่นคงต้องมีครบทั้งสามชั้น",
      },
      { type: "h3", text: "ชั้นที่ 1: สิ่งที่รัฐและนายจ้างให้" },
      {
        type: "ul",
        items: [
          "ประกันสังคม กรณีชราภาพ: ส่งเงินสมทบครบตามเงื่อนไข จะได้บำนาญรายเดือนตลอดชีวิต แต่พูดตรง ๆ ว่าสำหรับคนส่วนใหญ่คือหลักพันบาทต่อเดือน",
          "กองทุนสำรองเลี้ยงชีพ (PVD): ถ้าบริษัทมีให้ ถือเป็นของขวัญค่ะ เพราะนายจ้างสมทบเพิ่มให้ทุกเดือน เมย์แนะนำให้เลือกอัตราสะสมสูงสุดที่บริษัทอนุญาตเสมอ",
          "บำเหน็จบำนาญข้าราชการและ กบข.: ข้าราชการมีชั้นที่ 1 แข็งแรงกว่าคนทั่วไปมาก แต่ก็ยังควรมีชั้นอื่นเสริม",
        ],
      },
      {
        type: "p",
        text: "ชั้นนี้เดินของมันเอง ซึ่งดีค่ะ แต่สำหรับพนักงานเอกชนส่วนใหญ่ ชั้นนี้อย่างเดียวไม่พอให้ใช้ชีวิตแบบที่เราคุ้นเคย",
      },
      { type: "h3", text: "ชั้นที่ 2: เงินออมส่วนตัวที่ได้สิทธิลดหย่อนภาษี" },
      {
        type: "p",
        text: "ชั้นนี้คือชั้นที่คุณควบคุมได้เต็มที่ และรัฐช่วยจ่ายส่วนหนึ่งผ่านการลดหย่อนภาษี",
      },
      {
        type: "ul",
        items: [
          "RMF (กองทุนรวมเพื่อการเลี้ยงชีพ): กองทุนที่ได้สิทธิลดหย่อน เลือกระดับความเสี่ยงได้ตั้งแต่ตราสารหนี้ไปจนถึงหุ้น มูลค่าขึ้นลงตามตลาด",
          "ประกันชีวิตแบบบำนาญ: จ่ายเบี้ยช่วงที่ยังทำงาน แล้วตั้งแต่อายุ 55 หรือ 60 แผนจะจ่ายเงินบำนาญเป็นรายงวดไปจนถึงอายุ 85 หรือนานกว่านั้น จำนวนเงินกำหนดไว้ในสัญญาตั้งแต่วันแรก ไม่ขึ้นกับตลาด",
        ],
      },
      {
        type: "p",
        text: "ประกันบำนาญตอบคำถามที่ RMF ตอบไม่ได้ นั่นคือเดือนนี้เราจะมีเงินใช้แน่ ๆ เท่าไหร่ เมย์มักให้ประกันบำนาญเป็นพื้น ครอบคลุมค่ากิน ค่าน้ำค่าไฟ ค่ายา แล้วให้ชั้นอื่นเติมส่วนที่เหลือค่ะ",
      },
      { type: "h3", text: "ชั้นที่ 3: เงินเติบโต" },
      {
        type: "p",
        text: "ชั้นบนสุดคือเงินที่เราให้โอกาสมันโต เช่น ประกันควบการลงทุน (ยูนิตลิงค์) ที่เบี้ยส่วนหนึ่งถูกนำไปลงทุนในกองทุน หรือกองทุนรวมทั่วไป ชั้นนี้มีศักยภาพมากที่สุดในระยะยาว แต่เมย์ต้องพูดให้ชัดว่ามูลค่าขึ้นได้และลงได้ ไม่มีอะไรรับประกัน และเงินที่ต้องใช้ในห้าปีข้างหน้าไม่ควรอยู่ชั้นนี้ค่ะ",
      },
      {
        type: "note",
        title: "เมย์คิดแบบนี้นะคะ",
        text: "ลูกค้าหลายคนอยากเริ่มจากชั้นบนสุดเพราะฟังดูตื่นเต้น แต่เมย์เคยเห็นคนที่ตลาดตกในปีที่เขาเกษียณพอดี คนที่มีพื้นจากชั้นที่ 2 นอนหลับได้ค่ะ ส่วนคนที่ไม่มี ต้องกลับไปทำงาน",
      },
      { type: "h2", text: "แล้วต้องมีเท่าไหร่" },
      {
        type: "p",
        text: "สูตรคร่าว ๆ คือ ค่าใช้จ่ายต่อเดือนที่อยากมีหลังเกษียณ × 12 × จำนวนปีที่คาดว่าจะมีชีวิตหลังเกษียณ คิดอย่างน้อย 25 ปีนะคะ เพราะคนไทยอายุยืนขึ้นเรื่อย ๆ",
      },
      {
        type: "p",
        text: "สมมติอยากใช้เดือนละ 25,000 บาท: 25,000 × 12 × 25 = 7.5 ล้านบาทในมูลค่าเงินวันนี้ แต่เงินเฟ้อ 3% ต่อปีทำให้ราคาของเพิ่มเป็นสองเท่าทุก ๆ ประมาณ 24 ปี ถ้าคุณจะเกษียณในอีก 25 ปี ตัวเลขจริงจะใกล้ 15 ล้านบาทมากกว่า",
      },
      {
        type: "p",
        text: "ตัวเลขนี้ทำให้หลายคนตกใจ แต่เราไม่ได้ต้องการเงินทั้งก้อนในวันเกษียณ และเงินที่เหลือยังโตต่อระหว่างที่เราทยอยใช้ เครื่องคำนวณเกษียณในเว็บนี้คิดเงินเฟ้อให้เสร็จ ลองใส่ตัวเลขของคุณดูค่ะ",
      },
      { type: "h2", text: "ทำไมเริ่มก่อน 10 ปี สำคัญกว่าเลือกสินค้าที่สมบูรณ์แบบ" },
      {
        type: "p",
        text: "นี่คือตารางที่เมย์วาดบ่อยที่สุด สมมติออมเดือนละ 5,000 บาทจนถึงอายุ 60 ที่อัตราผลตอบแทนสมมติ 4% ต่อปี ทบต้นรายเดือน",
      },
      {
        type: "table",
        headers: ["เริ่มออมตอนอายุ", "จำนวนเดือนที่ออม", "เงินที่ใส่เข้าไปทั้งหมด", "มูลค่าสมมติตอนอายุ 60"],
        rows: [
          ["30", "360", "฿1,800,000", "≈ ฿3,470,000"],
          ["40", "240", "฿1,200,000", "≈ ฿1,834,000"],
          ["50", "120", "฿600,000", "≈ ฿736,000"],
        ],
      },
      {
        type: "p",
        text: "ข้อสมมติเพื่อประกอบภาพเท่านั้น ไม่ใช่ผลตอบแทนของสินค้าใด ๆ: 4% ต่อปี ทบต้นรายเดือน ไม่หักค่าธรรมเนียมและภาษี ผลลัพธ์จริงจะต่างออกไป",
      },
      {
        type: "p",
        text: "คนที่เริ่มตอน 30 ใส่เงินมากกว่าคนที่เริ่มตอน 40 แค่ 600,000 บาท แต่ได้ผลลัพธ์ต่างกันเกือบ 1.6 ล้าน ส่วนต่างนั้นไม่ได้มาจากการเลือกสินค้าเก่ง มาจากเวลาล้วน ๆ ค่ะ",
      },
      {
        type: "note",
        text: "ถ้าคุณลังเลระหว่างสองแผนมาเป็นเดือน เมย์ขอกระซิบว่า แผนที่ดีพอที่เริ่มวันนี้ ชนะแผนที่สมบูรณ์แบบที่เริ่มในอีกสองปี เกือบทุกครั้งค่ะ",
      },
      { type: "h2", text: "สิทธิลดหย่อนภาษีของประกันบำนาญ" },
      {
        type: "p",
        text: "ตรงนี้รัฐช่วยคุณออมค่ะ เบี้ยประกันชีวิตแบบบำนาญลดหย่อนได้สูงสุด 15% ของเงินได้พึงประเมิน แต่ไม่เกิน 200,000 บาทต่อปี",
      },
      {
        type: "ul",
        items: [
          "ยอดนี้นับรวมกับกองทุนสำรองเลี้ยงชีพ RMF กบข. และกองทุนเพื่อการเกษียณอื่น ๆ โดยรวมกันแล้วต้องไม่เกิน 500,000 บาทต่อปี",
          "ถ้าสิทธิลดหย่อนประกันชีวิตทั่วไป (100,000 บาท) ยังใช้ไม่เต็ม เบี้ยประกันบำนาญเติมส่วนนั้นให้เต็มก่อนได้ แล้วส่วนที่เหลือค่อยใช้สิทธิของประกันบำนาญ",
          "ตัวอย่าง: เงินได้ 800,000 บาทต่อปี 15% คือ 120,000 บาท ถ้าอยู่ในฐานภาษี 20% จะประหยัดภาษีได้ประมาณ 24,000 บาทในปีนั้น",
        ],
      },
      {
        type: "p",
        text: "นี่คือกติกาปีภาษี 2569 ค่ะ กฎเปลี่ยนได้ และสถานการณ์แต่ละคนต่างกัน ก่อนยื่นภาษีควรตรวจกับกรมสรรพากรหรือคนที่ดูแลภาษีของคุณอีกครั้งนะคะ",
      },
      { type: "h2", text: "ค่ารักษาพยาบาลหลังเกษียณ" },
      {
        type: "p",
        text: "เรื่องหนึ่งที่เมย์อยากพูดเบา ๆ แต่พูดให้ชัดค่ะ ค่าใช้จ่ายก้อนใหญ่ที่สุดหลังเกษียณของหลายคนไม่ใช่ค่าเที่ยว แต่คือค่ารักษาพยาบาล และเป็นค่าใช้จ่ายที่เราควบคุมได้น้อยที่สุด",
      },
      {
        type: "p",
        text: "ประกันสุขภาพที่ต่ออายุได้ถึงอายุ 85 หรือ 99 ปี ต้องซื้อตอนที่เรายังแข็งแรง เพราะบริษัทประกันตรวจสุขภาพตอนสมัคร ถ้ามีโรคประจำตัวแล้ว อาจถูกยกเว้นโรคนั้นหรือสมัครไม่ได้เลย และเบี้ยจะสูงขึ้นตามอายุ จึงควรเผื่อค่าเบี้ยไว้ในงบหลังเกษียณด้วยค่ะ",
      },
      {
        type: "p",
        text: "แผนรุ่นใหม่หลายแผนมีตัวเลือกแบบมีส่วนร่วมจ่าย (copay) คือเราร่วมจ่ายค่ารักษาส่วนเล็ก ๆ ในแต่ละครั้ง แลกกับเบี้ยที่เบาลง สำหรับหลายครอบครัว นี่คือสิ่งที่ทำให้ความคุ้มครองตลอดชีพอยู่ในงบที่จ่ายไหว",
      },
      { type: "h2", text: "เริ่มจากตรงไหนดี" },
      {
        type: "p",
        text: "สามก้าวเล็ก ๆ ที่ไม่ต้องทำให้เสร็จในเดือนนี้นะคะ: ดูว่าชั้นที่ 1 ของคุณมีอะไรบ้าง และเพิ่มอัตราสะสม PVD ถ้าทำได้ ลองเครื่องคำนวณเกษียณให้เห็นตัวเลขของตัวเอง แล้วเริ่มชั้นที่ 2 ด้วยจำนวนที่สบายใจ แม้จะยังเล็กก็ตาม",
      },
      {
        type: "p",
        text: "ถ้าคุณอยากคุย เล่าให้เมย์ฟังได้นะคะ ว่าตอนนี้อายุเท่าไหร่ มีอะไรอยู่แล้วบ้าง และอยากให้ชีวิตหลังเกษียณเป็นแบบไหน แล้วเรามาดูด้วยกันค่ะ",
      },
      {
        type: "disclaimer",
        text: "เนื้อหาในคู่มือนี้เป็นข้อมูลทั่วไป ไม่ใช่คำแนะนำทางการเงิน กฎหมาย หรือภาษีเฉพาะบุคคล ตัวเลขในตารางเป็นข้อสมมติเพื่อประกอบคำอธิบาย ไม่ใช่ผลตอบแทนหรือการรับประกันของสินค้าใด ๆ มูลค่าของสินค้าที่เชื่อมโยงกับการลงทุนขึ้นลงได้และไม่มีการรับประกัน ก่อนตัดสินใจ อยากให้คุณคุยกับเมย์หรือตัวแทนที่มีใบอนุญาตคนไหนก็ได้เกี่ยวกับสถานการณ์ของคุณเองนะคะ",
      },
    ],
  },

  en: {
    title: "Retirement in Thailand: a plain-language plan",
    subtitle:
      "The three layers of retirement money, a rough way to work out how much you need, and why starting ten years earlier beats picking the perfect product.",
    readingMinutes: 7,
    summary: [
      "Thailand is now an aged society. Our generation cannot lean on our children the way our parents did, so retirement is something we have to plan ourselves.",
      "Think in three layers: what the state and your employer provide, tax-advantaged personal savings (RMF and pension life insurance), and a growth layer whose value can rise and fall.",
      "Rough rule: monthly spending × 12 × years in retirement, then allow for roughly 3% inflation a year. There is a calculator on this site that does it for you.",
      "Saving ฿5,000 a month from age 30 can grow to nearly twice what the same habit started at 40 would reach, and almost five times the result from starting at 50. Time is the main ingredient.",
    ],
    blocks: [
      {
        type: "p",
        text: "Of all my conversations with clients, retirement is my favourite. It is the one plan where time does more than half the work, if we let it start. No jargon, no specific products, just how I think about it.",
      },
      { type: "h2", text: "Why think about this now" },
      {
        type: "p",
        text: "Thailand has officially become an aged society: roughly one in five Thais is now 60 or over, and that share keeps growing while families get smaller.",
      },
      {
        type: "p",
        text: "Our parents could lean on their children in old age. We are the first generation that must accept that if we do not prepare, nobody will do it for us. Not to scare you, only to nudge you to start earlier than feels natural.",
      },
      { type: "h2", text: "The three layers of retirement money" },
      {
        type: "p",
        text: "I draw it as a three-storey house: each floor does a different job, and a sturdy house needs all three.",
      },
      { type: "h3", text: "Layer 1: what the state and your employer provide" },
      {
        type: "ul",
        items: [
          "Social security old-age benefit: contribute long enough and you get a monthly pension for life, though for most people it is a few thousand baht a month.",
          "Provident fund (PVD): if your company offers one, treasure it, because your employer adds money every month. I always suggest the highest contribution rate they allow.",
          "Government pension and the GPF: civil servants have a much stronger layer 1 than most, but still want the other layers on top.",
        ],
      },
      {
        type: "p",
        text: "This layer runs on its own, which is nice. But for most private-sector employees it is not enough to live the way you are used to.",
      },
      { type: "h3", text: "Layer 2: tax-advantaged personal savings" },
      {
        type: "p",
        text: "This is the layer you fully control, and the government pays part of it through tax deductions.",
      },
      {
        type: "ul",
        items: [
          "RMF (Retirement Mutual Fund): a tax-deductible fund where you choose the risk level, from bonds to equities. Its value moves with the markets.",
          "Pension life insurance: you pay premiums while you work, and from age 55 or 60 the plan pays you a regular income until 85 or longer. The amounts are written into the contract from day one and do not depend on the markets.",
        ],
      },
      {
        type: "p",
        text: "Pension plans answer the question RMF cannot: how much will I have for certain this month? I let a pension plan be the floor, covering food, utilities and medicine, and the other layers fill in the rest.",
      },
      { type: "h3", text: "Layer 3: growth" },
      {
        type: "p",
        text: "The top floor is money we give a real chance to grow: unit-linked life insurance, where part of your premium is invested in funds, or ordinary mutual funds. It has the most long-run potential, but the value can go down as well as up, nothing is guaranteed, and money you need within five years does not belong here.",
      },
      {
        type: "note",
        title: "How I think about it",
        text: "Many clients want to start with the top floor because it sounds exciting. But I have seen people retire in the year the market fell. Those with a layer 2 floor slept fine. Those without went back to work.",
      },
      { type: "h2", text: "So how much do I need?" },
      {
        type: "p",
        text: "The rough formula: monthly spending you want in retirement × 12 × years you expect to live after retiring. Count at least 25 years, because Thais are living longer every decade.",
      },
      {
        type: "p",
        text: "Say you want ฿25,000 a month: 25,000 × 12 × 25 = ฿7.5 million in today's money. But 3% inflation doubles prices roughly every 24 years, so if retirement is 25 years away, the real figure is closer to ฿15 million.",
      },
      {
        type: "p",
        text: "That number makes people flinch, but you do not need it all on day one, and what remains keeps growing while you draw it down. The retirement calculator on this site handles the inflation maths; try it with your own numbers.",
      },
      { type: "h2", text: "Why starting ten years earlier beats picking the perfect product" },
      {
        type: "p",
        text: "This is the table I draw most often. Imagine saving ฿5,000 a month until age 60, at an assumed 4% a year compounded monthly.",
      },
      {
        type: "table",
        headers: ["Start saving at age", "Months of saving", "Total paid in", "Illustrative value at 60"],
        rows: [
          ["30", "360", "฿1,800,000", "≈ ฿3,470,000"],
          ["40", "240", "฿1,200,000", "≈ ฿1,834,000"],
          ["50", "120", "฿600,000", "≈ ฿736,000"],
        ],
      },
      {
        type: "p",
        text: "Illustrative assumption only, not a product return: 4% a year, compounded monthly, before fees and tax. Real outcomes will differ.",
      },
      {
        type: "p",
        text: "The person who starts at 30 pays in only ฿600,000 more than the one who starts at 40, yet ends up nearly ฿1.6 million further ahead. That gap comes from time alone, not clever product choice.",
      },
      {
        type: "note",
        text: "If you have been comparing two plans for a month, my quiet confession: a good-enough plan started today beats the perfect plan started in two years, almost every time.",
      },
      { type: "h2", text: "The pension-insurance tax deduction" },
      {
        type: "p",
        text: "Here the government helps you save: pension life insurance premiums are deductible up to 15% of your assessable income, with a maximum of ฿200,000 a year.",
      },
      {
        type: "ul",
        items: [
          "That amount counts towards a combined cap of ฿500,000 a year, shared with your provident fund, RMF, GPF and other retirement funds.",
          "If the general life-insurance deduction (฿100,000) is not used up, pension premiums can fill that bucket first, and the rest goes into the pension bucket.",
          "Example: on an assessable income of ฿800,000, 15% is ฿120,000. In the 20% bracket, that saves roughly ฿24,000 of tax that year.",
        ],
      },
      {
        type: "p",
        text: "These are the tax year 2026 rules. Rules change and situations differ, so before you file, please check with the Revenue Department or whoever handles your taxes.",
      },
      { type: "h2", text: "Health costs in retirement" },
      {
        type: "p",
        text: "One thing I want to say gently but clearly: for many retirees the biggest expense is not travel but medical care, and it is the one you control least.",
      },
      {
        type: "p",
        text: "A health plan that renews to age 85 or 99 must be bought while you are still healthy. Insurers check your health when you apply: an existing condition may be excluded, or the application declined. Premiums also rise with age, so budget for them inside your retirement plan.",
      },
      {
        type: "p",
        text: "Many newer plans offer a copay option: you pay a small share of each claim for a lower premium. For many families, that is what makes lifetime cover affordable.",
      },
      { type: "h2", text: "Where to begin" },
      {
        type: "p",
        text: "Three small steps, not all this month: check what your layer 1 holds and raise your PVD contribution if you can; run the retirement calculator to see your own number; then start layer 2 with an amount that feels comfortable, even if small.",
      },
      {
        type: "p",
        text: "If you would like, tell me how old you are, what you already have, and what kind of life you picture after work, and we will look at it together.",
      },
      {
        type: "disclaimer",
        text: "This guide is general information, not personalised financial, legal or tax advice. The table figures are illustrative assumptions, not the return or a guarantee of any product. Investment-linked values can go down as well as up and are not guaranteed. Before you decide, please talk to me or to any licensed advisor about your own situation.",
      },
    ],
  },
};

export default guide;
