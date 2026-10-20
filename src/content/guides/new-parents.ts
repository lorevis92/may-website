import type { Guide } from "../types";

const guide: Guide = {
  slug: "new-parents",
  icon: "sprout",
  order: 4,
  updated: "2026-10-20",
  relatedTool: "education",

  th: {
    title: "เช็กลิสต์สำหรับพ่อแม่มือใหม่",
    subtitle:
      "มีลูกแล้วควรจัดการเรื่องไหนก่อนหลัง เมย์เรียงลำดับให้แบบที่อยากให้ใครสักคนบอกเพื่อนสนิทของเมย์ตอนที่เขาเพิ่งเป็นแม่",
    readingMinutes: 6,
    summary: [
      "ปกป้องคนที่ปกป้องลูกก่อน ประกันสุขภาพและประกันชีวิตของพ่อแม่ต้องมาก่อนทุกอย่างที่เป็นชื่อลูก",
      "แผนสุขภาพเด็กส่วนใหญ่รับตั้งแต่ 1 เดือนหรือ 1 ขวบ และมีระยะรอคอย ช่วงเดือนแรกๆ จึงควรมีเงินสำรองไว้",
      "แผนการศึกษาที่มีความคุ้มครองผู้ชำระเบี้ย (payor benefit) จะเดินต่อจนครบกำหนด แม้พ่อหรือแม่ที่จ่ายเบี้ยจะเสียชีวิตหรือทุพพลภาพ",
      "ระบุผู้รับผลประโยชน์ให้ถูกและเขียนพินัยกรรมสั้นๆ แทบไม่มีค่าใช้จ่าย แต่ช่วยคนข้างหลังได้มหาศาล",
    ],
    blocks: [
      {
        type: "p",
        text: "ช่วงที่น้องเพิ่งเกิด ชีวิตจะวุ่นวายแบบที่ไม่มีอะไรเตรียมเราไว้ก่อนเลยค่ะ นอนไม่พอ ของเต็มบ้าน แล้วอยู่ดีๆ ก็มีคนตัวเล็กๆ ที่ทั้งชีวิตของเขาขึ้นอยู่กับเรา",
      },
      {
        type: "p",
        text: "เพื่อนสนิทของเมย์คนหนึ่งเคยโทรมาตอนตีสองระหว่างให้นมลูก แล้วถามว่า “ถ้าเราเป็นอะไรไป ลูกจะอยู่ยังไง” เช็กลิสต์นี้คือคำตอบของเมย์ค่ะ",
      },
      { type: "h2", text: "ลำดับความสำคัญ" },
      {
        type: "p",
        text: "พ่อแม่มือใหม่เกือบทุกคนจะรีบไปทำประกันให้ลูกก่อน เมย์เข้าใจค่ะ แต่ลำดับที่ถูกต้องเป็นแบบนี้นะคะ",
      },
      { type: "h3", text: "1. ประกันสุขภาพของพ่อแม่เอง" },
      {
        type: "p",
        text: "ถ้าคุณป่วยหนักโดยไม่มีประกัน เงินที่เก็บไว้ให้ลูกจะเป็นก้อนแรกที่ถูกดึงมาใช้ ลูกจะปลอดภัยได้ก็ต่อเมื่อคนที่ดูแลเขาปลอดภัยก่อนค่ะ",
      },
      {
        type: "p",
        text: "แผนสุขภาพเหมาจ่ายรุ่นใหม่มักมีตัวเลือก copay คือเราร่วมจ่ายส่วนเล็กๆ ของแต่ละเคลม แลกกับเบี้ยที่เบาลง เหมาะกับครอบครัวที่เพิ่งมีรายจ่ายก้อนใหญ่ค่ะ",
      },
      { type: "h3", text: "2. ประกันชีวิตและคุ้มครองรายได้ จนถึงวันที่ลูกดูแลตัวเองได้" },
      {
        type: "p",
        text: "ประกันชีวิตของพ่อแม่ไม่ใช่เรื่องความตายนะคะ แต่เป็นเรื่อง “รายได้ที่หายไป” ถ้าวันหนึ่งคนหาเงินไม่อยู่แล้ว ใครจะจ่ายค่าเทอม ค่าผ่อนบ้าน ค่ากับข้าว",
      },
      {
        type: "p",
        text: "วิธีคิดง่ายๆ ของเมย์: นับว่าอีกกี่ปีลูกจะยืนด้วยตัวเองได้ (ลูกหนึ่งขวบก็ประมาณ 21 ปี) คูณด้วยค่าใช้จ่ายต่อปีของครอบครัว บวกหนี้ ลบเงินเก็บที่มี ตัวเลขที่ได้คือทุนประกันที่ควรมีโดยประมาณค่ะ",
      },
      {
        type: "p",
        text: "ถ้าทั้งพ่อและแม่ทำงาน ควรมีทั้งคู่ และคนที่อยู่บ้านดูแลลูกเต็มเวลาก็มีมูลค่าเหมือนกัน เพราะถ้าเขาไม่อยู่ ต้องจ้างคนมาทำแทน ประกันชีวิตแบบคุ้มครองระยะเวลา (term) ให้ทุนสูงด้วยเบี้ยที่เบา เหมาะกับช่วงนี้มากค่ะ",
      },
      { type: "h3", text: "3. ประกันสุขภาพของลูก" },
      {
        type: "p",
        text: "เด็กเล็กป่วยบ่อยกว่าที่คิดมาก และค่ารักษาเด็กในโรงพยาบาลเอกชนก็ไม่ได้ถูกเลยค่ะ",
      },
      {
        type: "p",
        text: "แผนสุขภาพส่วนใหญ่ไม่รับทารกแรกเกิดทันที หลายแผนเริ่มรับตั้งแต่ 1 เดือน บางแผนต้องรอถึง 1 ขวบ และทำแล้วก็ยังมีระยะรอคอย มักจะ 30 วันสำหรับการเจ็บป่วยทั่วไป และนานกว่านั้นสำหรับบางโรค",
      },
      {
        type: "p",
        text: "ดังนั้นลองเช็กว่าแพ็กเกจคลอดครอบคลุมน้องถึงเมื่อไหร่ เตรียมเงินสำรองไว้สำหรับช่องว่างตรงนี้ และสมัครให้น้องเร็วเท่าที่แผนรับได้ ก่อนจะมีประวัติเจ็บป่วยค่ะ",
      },
      { type: "h3", text: "4. กองทุนการศึกษา" },
      {
        type: "p",
        text: "พอฐานความคุ้มครองแน่นแล้ว ค่อยมาถึงส่วนที่เมย์ชอบที่สุดค่ะ แผนการศึกษา หรือแผนสะสมทรัพย์ที่ทำไว้เพื่อลูก คือการแบ่งเงินจำนวนเท่าๆ กันทุกปี ให้ไปครบเป็นก้อนตอนลูกถึงวัยเข้ามหาวิทยาลัยพอดี โดยมีวินัยในตัว",
      },
      {
        type: "p",
        text: "สิ่งที่ทำให้ต่างจากการฝากเงินเฉยๆ คือตัวเลือกที่เรียกว่า ความคุ้มครองผู้ชำระเบี้ย (payor benefit) หรือการยกเว้นเบี้ยประกันค่ะ ถ้าพ่อหรือแม่ที่จ่ายเบี้ยเสียชีวิตหรือทุพพลภาพถาวรสิ้นเชิง บริษัทประกันจะยกเว้นเบี้ยที่เหลือทั้งหมด และแผนเดินต่อจนครบกำหนดเหมือนที่วางไว้ทุกประการ",
      },
      {
        type: "p",
        text: "สำหรับเมย์ นี่คือหัวใจของเรื่องนี้เลยค่ะ เงินก้อนที่ลูกจะได้ตอนอายุ 18 ไม่ควรขึ้นอยู่กับว่าพ่อแม่จะอยู่ครบ 18 ปีหรือเปล่า",
      },
      { type: "h3", text: "5. พินัยกรรมฉบับง่าย และผู้รับผลประโยชน์ที่ถูกต้อง" },
      {
        type: "p",
        text: "ข้อนี้ไม่ต้องใช้เงินเลย แต่เป็นข้อที่คนทำน้อยที่สุดค่ะ ลองเช็กว่าผู้รับผลประโยชน์ในกรมธรรม์ทุกฉบับเป็นชื่อปัจจุบันหรือยัง หลายคนยังเป็นชื่อพ่อแม่ตัวเองตั้งแต่สมัยโสด ถ้าจะใส่ชื่อลูกที่ยังเป็นผู้เยาว์ ต้องคิดด้วยว่าใครจะดูแลเงินก้อนนั้นแทนเขาจนบรรลุนิติภาวะ แล้วเขียนไว้ในพินัยกรรมสั้นๆ ที่ระบุผู้ปกครองของลูกด้วย",
      },
      {
        type: "p",
        text: "ปรึกษาทนาย หรือสอบถามที่สำนักงานเขตหรืออำเภอได้นะคะ ใช้เวลาไม่นาน แต่ช่วยให้คนข้างหลังไม่ต้องทะเลาะกันค่ะ",
      },
      {
        type: "note",
        title: "ทำไมเมย์ถึงรักงานส่วนนี้ที่สุด",
        text: "พ่อแม่มือใหม่มักมานั่งคุยกับเมย์พร้อมความกลัวที่พูดออกมาไม่ถูก พอคุยกันจบ สายตาเขาเปลี่ยนค่ะ เหมือนได้วางของหนักลงจากบ่า แล้วอีกหลายปีต่อมา ตอนที่แผนที่เราวางไว้ด้วยกันครบกำหนดในสัปดาห์ที่ลูกเข้ามหาวิทยาลัย เมย์ได้เห็นว่าการตัดสินใจเล็กๆ ในวันที่ยุ่งที่สุดของชีวิตใครสักคน กลายเป็นเรื่องใหญ่ได้ขนาดไหน",
      },
      { type: "h2", text: "ค่าเรียนมหาวิทยาลัยจะเท่าไหร่" },
      {
        type: "p",
        text: "คำถามที่เมย์เจอบ่อยที่สุดคือ “ต้องเก็บเท่าไหร่” ตอบตรงๆ คือขึ้นอยู่กับว่าคุณอยากเปิดประตูบานไหนไว้ให้ลูกค่ะ",
      },
      {
        type: "ul",
        items: [
          "มหาวิทยาลัยรัฐในไทย หลักสูตรปกติ: ค่าเทอมค่อนข้างเบา สี่ปีมักรวมอยู่ในหลักแสน บวกค่าครองชีพถ้าต้องไปเรียนต่างจังหวัด",
          "มหาวิทยาลัยเอกชน หรือหลักสูตรนานาชาติในไทย: แพงกว่าหลายเท่า มักอยู่ในหลักแสนปลายๆ ไปจนถึงหลักล้าน แล้วแต่สาขา",
          "เรียนต่อต่างประเทศ โดยเฉพาะอังกฤษ ออสเตรเลีย หรืออเมริกา: ค่าเทอมบวกค่าครองชีพมักเป็นหลักหลายล้านบาท และยังขึ้นกับค่าเงินอีกด้วย",
        ],
      },
      {
        type: "p",
        text: "แล้วอย่าลืมเงินเฟ้อการศึกษานะคะ ค่าเทอมมีแนวโน้มขึ้นเร็วกว่าเงินเฟ้อทั่วไปมาตลอด แค่ขึ้นปีละไม่กี่เปอร์เซ็นต์ ทบไป 18 ปี ตัวเลขวันนี้อาจเพิ่มขึ้นเกือบเท่าตัว เครื่องมือวางแผนการศึกษาในเว็บนี้จะเอาเส้นทางที่คุณเลือก อายุลูก และอัตราเงินเฟ้อ มาคำนวณคร่าวๆ ว่าควรเก็บปีละเท่าไหร่ค่ะ",
      },
      { type: "h2", text: "ปู่ย่าตายายและญาติๆ ช่วยอะไรได้บ้าง" },
      {
        type: "p",
        text: "ในบ้านไทย คนที่อยากช่วยมีเยอะเสมอค่ะ แค่ไม่รู้ว่าจะช่วยยังไง",
      },
      {
        type: "ul",
        items: [
          "เปลี่ยนของขวัญวันเกิดและแต๊ะเอียเป็นเงินสมทบเข้ากองทุนการศึกษาของหลานปีละครั้ง ทำไปสิบกว่าปีกลายเป็นก้อนใหญ่ได้ค่ะ",
          "บริษัทประกันบางแห่งให้ปู่ย่าตายายเป็นผู้ชำระเบี้ยแผนสะสมทรัพย์ของหลานได้ โดยพ่อแม่ยังเป็นเจ้าของกรมธรรม์",
          "สิ่งที่ช่วยได้มากที่สุดแต่คนนึกไม่ถึง คือท่านมีประกันสุขภาพของตัวเองให้เรียบร้อย เพราะถ้าท่านป่วย คนที่ควักเงินก็คือพ่อแม่ของหลาน และเบี้ยก้อนนั้นยังเอาไปลดหย่อนภาษีได้ด้วย (อ่านต่อในคู่มือเรื่องภาษีของเมย์)",
          "เป็นคนเก็บเรื่องเอกสาร: ใครถือกรมธรรม์ ต้องติดต่อใคร เอกสารอยู่ตรงไหน",
        ],
      },
      { type: "h2", text: "ลูกอายุเท่าไหร่ ควรทำอะไร" },
      {
        type: "table",
        headers: ["ช่วงอายุของลูก", "สิ่งที่ควรทำ"],
        rows: [
          [
            "ก่อนคลอด",
            "ทบทวนประกันสุขภาพและประกันชีวิตของพ่อแม่ทั้งคู่ เช็กว่าแพ็กเกจคลอดครอบคลุมน้องถึงเมื่อไหร่",
          ],
          [
            "แรกเกิด – 1 เดือน",
            "แจ้งเกิด เตรียมเงินสำรองค่ารักษา อัปเดตผู้รับผลประโยชน์",
          ],
          [
            "1 เดือน – 1 ขวบ",
            "สมัครประกันสุขภาพให้น้องทันทีที่แผนรับได้ เขียนพินัยกรรมฉบับง่าย",
          ],
          [
            "1 – 3 ขวบ",
            "เริ่มกองทุนการศึกษาพร้อมความคุ้มครองผู้ชำระเบี้ย ยิ่งเริ่มเร็ว เบี้ยยิ่งเบา",
          ],
          [
            "3 – 12 ขวบ",
            "ทบทวนทุก 2–3 ปี ทั้งทุนประกันชีวิตของพ่อแม่และแผนสุขภาพของน้อง",
          ],
          [
            "13 – 18 ปี",
            "เช็กว่ากองทุนครบกำหนดตรงกับปีที่เข้ามหาวิทยาลัย และบอกลูกว่ามีอะไรอยู่ตรงไหนบ้าง",
          ],
        ],
      },
      { type: "h2", text: "ไม่ต้องทำทั้งหมดในสัปดาห์เดียวนะคะ" },
      {
        type: "p",
        text: "เมย์รู้ว่าอ่านมาถึงตรงนี้อาจรู้สึกว่าเยอะ จัดการข้อ 1 กับข้อ 2 ให้เรียบร้อยก่อน ที่เหลือค่อยๆ เติมไปตามวัยของลูก ถ้าอยากให้เมย์ช่วยเรียงลำดับให้เหมาะกับครอบครัวของคุณ เล่าเรื่องน้องให้ฟังได้นะคะ แล้วเรามาดูด้วยกันค่ะ",
      },
      {
        type: "disclaimer",
        text: "บทความนี้เป็นข้อมูลทั่วไป ไม่ใช่คำแนะนำด้านการเงิน กฎหมาย หรือภาษีเฉพาะบุคคล เงื่อนไขของแต่ละแผน (อายุที่รับ ระยะรอคอย เงื่อนไขความคุ้มครองผู้ชำระเบี้ย) ต่างกันไปตามบริษัทประกัน ก่อนตัดสินใจ กรุณาปรึกษาเมย์หรือที่ปรึกษาที่มีใบอนุญาต และปรึกษาทนายสำหรับเรื่องพินัยกรรมนะคะ",
      },
    ],
  },

  en: {
    title: "The new parents' checklist",
    subtitle:
      "What to sort out first when there's a baby in the house, in the order I'd want a friend to tell me",
    readingMinutes: 6,
    summary: [
      "Protect the protectors first: your own health cover and life/income protection come before anything in the baby's name.",
      "Most child health plans accept babies only from 1 month or 1 year old and have waiting periods, so keep a cash cushion for the early months.",
      "An education plan with a payor benefit (premium waiver) keeps running to maturity even if the paying parent dies or is disabled.",
      "Name your beneficiaries correctly and write a simple will; it costs almost nothing and spares the people you love a lot of pain.",
    ],
    blocks: [
      {
        type: "p",
        text: "When a baby arrives, life turns chaotic in a way nothing prepares you for. No sleep, a house full of things, and suddenly a tiny person whose whole life depends on you.",
      },
      {
        type: "p",
        text: "A close friend once rang me at two in the morning, feeding her newborn: “If something happens to us, what happens to him?” This checklist is my answer.",
      },
      { type: "h2", text: "The order of priorities" },
      {
        type: "p",
        text: "Almost every new parent rushes to insure the baby first. I understand, but the right order looks like this.",
      },
      { type: "h3", text: "1. Your own health cover" },
      {
        type: "p",
        text: "If you fall seriously ill without cover, the money you have been saving for your child is the first thing that gets spent. Your child is only safe when the people looking after them are.",
      },
      {
        type: "p",
        text: "Newer all-inclusive health plans usually offer a copay option: you pay a small share of each claim for a lower premium, which suits a family with a big new expense.",
      },
      { type: "h3", text: "2. Life and income protection until your child is independent" },
      {
        type: "p",
        text: "Life insurance for parents is not about death; it is about the income that disappears. If the earner is suddenly gone, who pays the school fees, the mortgage, the groceries?",
      },
      {
        type: "p",
        text: "My simple sizing: count the years until your child can stand on their own feet (about 21 for a one-year-old), multiply by what your family needs each year, add debts, subtract savings. That is roughly the sum assured you need.",
      },
      {
        type: "p",
        text: "If both parents work, both need cover; a stay-at-home parent has a value too, because replacing them costs money. Term life plans give a high sum assured for a light premium, ideal at this stage.",
      },
      { type: "h3", text: "3. Your child's health plan" },
      {
        type: "p",
        text: "Small children get ill far more often than you expect, and private paediatric care is not cheap.",
      },
      {
        type: "p",
        text: "Most health plans do not accept newborns straight away: many start from 1 month old, some only from 1 year, and waiting periods still apply after that, often 30 days for general illness and longer for certain conditions.",
      },
      {
        type: "p",
        text: "So check how long the delivery package covers the baby, keep a cash cushion for the gap, and enrol as early as the plan allows, before any medical history exists.",
      },
      { type: "h3", text: "4. An education fund" },
      {
        type: "p",
        text: "Once the protection is solid, we get to the part I enjoy most. An education plan, or a savings plan for a child, puts aside a fixed amount every year so that a lump sum arrives at university age, with the discipline built in.",
      },
      {
        type: "p",
        text: "What makes it different from a bank deposit is an option called a payor benefit, or premium waiver. If the parent paying the premiums dies or becomes totally and permanently disabled, the insurer waives all remaining premiums and the plan continues to maturity exactly as planned.",
      },
      {
        type: "p",
        text: "To me, this is the heart of it: the money your child receives at 18 should not depend on whether you are still here for all 18 years.",
      },
      { type: "h3", text: "5. A simple will and the right beneficiaries" },
      {
        type: "p",
        text: "This one costs nothing, and almost nobody does it. Check that the beneficiary on every policy is current; many people still have their own parents named from their single days. If you name a child who is a minor, decide who will manage that money until they come of age, and write it into a short will that also names a guardian.",
      },
      {
        type: "p",
        text: "A lawyer or your district office can help. It does not take long, and it spares the people left behind from arguing.",
      },
      {
        type: "note",
        title: "Why I love this part of my job",
        text: "New parents usually arrive carrying a fear they can't quite say out loud. By the end of our conversation their eyes change, like someone putting down a heavy bag. Years later, when a plan we set up together matures the week a child starts university, I see how a small decision on the busiest day of someone's life became something big.",
      },
      { type: "h2", text: "How much will university cost?" },
      {
        type: "p",
        text: "The question I hear most is “how much?”. Honestly, it depends on which doors you want to keep open.",
      },
      {
        type: "ul",
        items: [
          "Thai public university, regular programme: tuition is relatively light, often a few hundred thousand baht over four years, plus living costs away from home.",
          "Thai private or international programme: typically several times more, often from the high hundreds of thousands to a few million baht, depending on the field.",
          "Overseas, especially the UK, Australia or the US: tuition plus living costs commonly run into several million baht, and the exchange rate adds its own uncertainty.",
        ],
      },
      {
        type: "p",
        text: "Then there is education inflation: tuition has risen faster than general inflation for a long time, and a few percent a year, compounded over 18 years, can nearly double today's figure. The education planner on this site turns your chosen path, your child's age and an inflation rate into a rough yearly savings target.",
      },
      { type: "h2", text: "What grandparents and relatives can do" },
      {
        type: "p",
        text: "In Thai families there are always people who want to help; they just don't know how.",
      },
      {
        type: "ul",
        items: [
          "Turn birthday money and New Year envelopes into a yearly contribution to the education fund; fifteen years of that adds up.",
          "Some insurers let a grandparent be the payor on a grandchild's savings plan while the parents stay the owners.",
          "Least obvious and most helpful: sorting out their own health cover, because if they fall ill, the baby's parents pay. Those premiums are tax-deductible too (see my tax guide).",
          "Be the keeper of the paperwork: who holds the policies, who to call, where the documents are.",
        ],
      },
      { type: "h2", text: "Your child's age and what to do" },
      {
        type: "table",
        headers: ["Child's age", "What to do"],
        rows: [
          [
            "Before birth",
            "Review both parents' health and life cover; check how long the delivery package covers the baby",
          ],
          [
            "0 – 1 month",
            "Register the birth; keep a cash cushion for medical costs; update beneficiaries",
          ],
          [
            "1 month – 1 year",
            "Apply for the child's health plan as soon as it accepts them; write a simple will",
          ],
          [
            "1 – 3 years",
            "Start the education fund with a payor benefit; the earlier, the lighter the premium",
          ],
          [
            "3 – 12 years",
            "Review every 2–3 years: parents' sum assured and the child's health plan",
          ],
          [
            "13 – 18 years",
            "Check the fund matures the year university starts; tell your child what exists and where",
          ],
        ],
      },
      { type: "h2", text: "Don't try to do it all in one week" },
      {
        type: "p",
        text: "I know this may feel like a lot. Get points 1 and 2 right and add the rest as your child grows. If you would like help putting these in order for your family, tell me about your little one and we will look at it together.",
      },
      {
        type: "disclaimer",
        text: "This guide is general information, not personalised financial, legal or tax advice. Plan terms (age limits, waiting periods, payor benefit conditions) vary by insurer. Before deciding, please talk to me or any licensed advisor, and to a lawyer about a will.",
      },
    ],
  },
};

export default guide;
