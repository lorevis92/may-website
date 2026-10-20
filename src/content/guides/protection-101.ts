import type { Guide } from "../types";

const guide: Guide = {
  slug: "protection-101",
  icon: "shield",
  order: 1,
  updated: "2026-10-20",
  relatedTool: "coverage",

  th: {
    title: "ประกัน 101 สำหรับครอบครัวไทย",
    subtitle:
      "ประกันชีวิต ประกันสุขภาพ และประกันโรคร้ายแรง ทำหน้าที่คนละอย่าง มาดูกันว่าควรเริ่มจากตัวไหน และซ้อนกันยังไงถึงไม่จ่ายเกินจำเป็น",
    readingMinutes: 6,
    summary: [
      "ประกันสุขภาพปกป้องเงินเก็บจากค่าโรงพยาบาล ประกันชีวิตปกป้องคนที่พึ่งพารายได้ของคุณ ประกันโรคร้ายแรงปกป้องรายได้ระหว่างพักรักษาตัว สามอย่างนี้ใช้แทนกันไม่ได้นะคะ",
      "เรียงลำดับให้ถูก: สุขภาพก่อน ตามด้วยประกันชีวิตที่คำนวณจากคนที่คุณต้องดูแล แล้วค่อยเติมเงินก้อนจากประกันโรคร้ายแรง",
      "สูตรคิดทุนประกันชีวิตแบบง่าย: รายได้ต่อปี × จำนวนปีที่อยากให้ครอบครัวมีต่อ + หนี้สิน + ค่าเรียนลูก − เงินเก็บ − ทุนประกันที่มีอยู่แล้ว",
      "ประกันกลุ่มจากที่ทำงานคือของแถม ไม่ใช่แผนหลัก เพราะหมดทันทีที่ออกจากงาน และวงเงินมักจะน้อย",
    ],
    blocks: [
      {
        type: "p",
        text: "ถ้าเมย์ได้นั่งจิบกาแฟคุยกับคุณพ่อคุณแม่มือใหม่ทุกคนสักยี่สิบนาที เมย์จะเล่าเรื่องนี้ให้ฟังค่ะ ไม่ใช่การขายของ แต่เป็นสิ่งที่เมย์อยากให้มีใครมาบอกครอบครัวของเมย์ตั้งแต่เนิ่น ๆ",
      },
      {
        type: "p",
        text: "คนส่วนใหญ่ที่เมย์เจอมีประกันอยู่แล้วบ้างค่ะ ปัญหาคือแต่ละฉบับไม่ได้ต่อกันเป็นภาพเดียว เลยจ่ายเงินไปกับสิ่งที่ไม่ค่อยจำเป็น ส่วนความเสี่ยงที่จะทำให้ครอบครัวล้มจริง ๆ กลับยังเปิดโล่งอยู่",
      },
      { type: "h2", text: "ประกันสามแบบ สามหน้าที่" },
      {
        type: "p",
        text: "ประกันไม่ใช่สินค้าชิ้นเดียวค่ะ แต่เป็นคำตอบของคำถามสามข้อที่ต่างกัน",
      },
      {
        type: "ul",
        items: [
          "ประกันสุขภาพ ตอบคำถามว่า ถ้าป่วยหรือเกิดอุบัติเหตุ ใครจะจ่ายค่าโรงพยาบาล",
          "ประกันชีวิต ตอบคำถามว่า ถ้าวันหนึ่งไม่มีเราแล้ว ใครจะดูแลค่าใช้จ่ายของครอบครัว",
          "ประกันโรคร้ายแรง ตอบคำถามว่า ถ้าเรายังอยู่แต่ทำงานไม่ได้เป็นปีสองปี ใครจะจ่ายค่าใช้จ่ายในชีวิตของเรา",
        ],
      },
      {
        type: "p",
        text: "ประกันชีวิตทุนสูง ๆ ช่วยเรื่องค่าโรงพยาบาลไม่ได้เลย ประกันสุขภาพดี ๆ จ่ายค่ารักษาให้ แต่ไม่ได้ผ่อนบ้านให้ระหว่างที่คุณพักรักษาตัว แต่ละตัวมีหน้าที่ของตัวเองค่ะ",
      },
      {
        type: "table",
        headers: ["ประเภทความคุ้มครอง", "จ่ายอะไร", "จ่ายเมื่อไหร่", "ใครต้องมีมากที่สุด"],
        rows: [
          [
            "ประกันสุขภาพ",
            "ค่าห้อง ค่าผ่าตัด ค่าแพทย์ ค่ายา (ตามวงเงินของแผน)",
            "ทุกครั้งที่เข้ารักษา ตราบเท่าที่กรมธรรม์ยังมีผล",
            "ทุกคน ตั้งแต่เด็กจนถึงวัยเกษียณ เป็นตัวแรกที่ควรมี",
          ],
          [
            "ประกันชีวิต",
            "เงินก้อนให้คนที่คุณระบุชื่อไว้",
            "ครั้งเดียว เมื่อผู้เอาประกันจากไประหว่างสัญญา",
            "คนที่มีคนต้องดูแลหรือมีหนี้ เช่น พ่อแม่ เสาหลักของบ้าน คนที่ผ่อนบ้านอยู่",
          ],
          [
            "ประกันโรคร้ายแรง",
            "เงินก้อนให้ตัวคุณเอง เอาไปใช้อะไรก็ได้",
            "ครั้งเดียว เมื่อตรวจพบโรคร้ายแรงตามที่ระบุ เช่น มะเร็ง หัวใจ หลอดเลือดสมอง",
            "คนวัยทำงานที่ครอบครัวพึ่งพารายได้ของเขา",
          ],
        ],
      },
      { type: "h2", text: "ซ้อนกันให้ถูกลำดับ" },
      {
        type: "p",
        text: "เวลางบจำกัด ซึ่งส่วนใหญ่ก็จำกัดค่ะ ลำดับสำคัญกว่ายี่ห้อมาก เมย์สร้างความคุ้มครองเป็นสามชั้น และเริ่มจากชั้นล่างสุดก่อนเสมอ",
      },
      {
        type: "ol",
        items: [
          "สุขภาพก่อน การนอนโรงพยาบาลเอกชนครั้งใหญ่ครั้งเดียวอาจมีค่าใช้จ่ายหลายแสนบาท นี่คือความเสี่ยงที่เกิดบ่อยที่สุดและกินเงินเก็บเร็วที่สุด",
          "ตามด้วยประกันชีวิต ที่คำนวณจากสิ่งที่ครอบครัวต้องใช้จริง ไม่ใช่ตัวเลขกลม ๆ ถ้ายังไม่มีใครพึ่งพารายได้ของคุณ ชั้นนี้เล็กได้ค่ะ",
          "แล้วค่อยเติมเงินก้อนจากประกันโรคร้ายแรง มองว่าเป็นการคุ้มครองรายได้ เงินก้อนนี้ช่วยผ่อนบ้าน จ่ายค่าเทอม และค่าดูแล ระหว่างที่คุณหยุดงานเพื่อรักษาตัว",
        ],
      },
      {
        type: "note",
        title: "เมย์ขอเล่าหน่อยนะคะ",
        text: "เมย์เคยคุยกับครอบครัวหนึ่งที่มีประกันสะสมทรัพย์สามฉบับ แต่ไม่มีประกันสุขภาพเลย พอภรรยาต้องผ่าตัด ไม่มีฉบับไหนช่วยได้ค่ะ สุดท้ายเราแก้กันได้ แต่เมย์นึกถึงครอบครัวนี้ทุกครั้งที่มีคนถามว่าควรซื้ออะไรก่อน",
      },
      { type: "h2", text: "ครอบครัวหนึ่งต้องมีทุนประกันชีวิตเท่าไหร่" },
      {
        type: "p",
        text: "ไม่มีตัวเลขวิเศษค่ะ แต่มีวิธีคิดง่าย ๆ ที่เมย์ใช้แทบทุกครั้งในการคุยครั้งแรก คือบวกสิ่งที่ครอบครัวจะต้องใช้ แล้วลบสิ่งที่ครอบครัวมีอยู่แล้ว",
      },
      {
        type: "ul",
        items: [
          "รายได้ที่ต้องมาแทน: ครอบครัวต้องใช้รายได้ของคุณต่อไปอีกกี่ปี หลายบ้านเลือก 10 ปี หรือจนกว่าลูกคนเล็กจะเรียนจบ",
          "บวกหนี้สิน: ค่าผ่อนบ้าน ผ่อนรถ และหนี้อื่น ๆ ที่ไม่ได้หายไปพร้อมกับคุณ",
          "บวกค่าเรียนของลูก: ประมาณการคร่าว ๆ ของการศึกษาที่คุณอยากให้ลูกได้รับ",
          "ลบเงินเก็บและเงินลงทุนที่ครอบครัวหยิบมาใช้ได้จริง",
          "ลบทุนประกันชีวิตที่มีอยู่แล้ว รวมถึงประกันกลุ่มจากที่ทำงาน",
        ],
      },
      {
        type: "p",
        text: "ลองสมมติครอบครัวหนึ่ง: เงินเดือน 40,000 บาท เป็นเวลา 10 ปี เท่ากับ 4.8 ล้าน บวกหนี้บ้าน 2 ล้าน และค่าเรียนลูกสองคน 1.5 ล้าน ลบเงินเก็บ 500,000 และทุนประกันที่มีอยู่ 1 ล้าน ส่วนที่ยังขาดคือประมาณ 6.8 ล้านบาท ฟังดูเยอะ จนกว่าจะนึกออกว่าเงินก้อนนี้มีไว้เพื่ออะไร",
      },
      {
        type: "p",
        text: "เครื่องมือคำนวณทุนประกันในเว็บนี้คิดสูตรนี้ให้ฟรีค่ะ ลองใส่ตัวเลขของคุณเองดู ใช้เวลาแค่สองนาที แต่หลายคนบอกว่าเห็นภาพชัดขึ้นมาก",
      },
      { type: "h2", text: "ทำไมประกันกลุ่มจากที่ทำงานถึงไม่พอ" },
      {
        type: "p",
        text: "ประกันกลุ่มจากที่ทำงานเป็นสวัสดิการที่ดีมากค่ะ และเมย์นับรวมเสมอ แต่เมย์ไม่เคยให้ลูกค้าพึ่งประกันกลุ่มอย่างเดียว ด้วยเหตุผลสามข้อ",
      },
      {
        type: "ul",
        items: [
          "มันหมดทันทีที่คุณออกจากงาน ไม่ว่าจะลาออก ถูกเลิกจ้าง หรือเกษียณ ซึ่งมักเป็นช่วงที่อายุมากขึ้นและทำประกันใหม่ยากขึ้นพอดี",
          "วงเงินมักจะน้อย ค่าห้องที่ตามราคาโรงพยาบาลเอกชนไม่ทัน และทุนชีวิตแค่หนึ่งถึงสองเท่าของเงินเดือนทั้งปี",
          "คุณควบคุมไม่ได้ นายจ้างเปลี่ยนแผนหรือลดผลประโยชน์ตอนต่ออายุได้ และคุณมักจะรู้ทีหลัง",
        ],
      },
      {
        type: "note",
        text: "ลองมองประกันกลุ่มเหมือนร่มที่โรงแรมให้ยืมค่ะ ดีมากตอนที่ยังพักอยู่ แต่ไม่ใช่สิ่งที่เราจะวางแผนรับมือหน้าฝนทั้งฤดูด้วย",
      },
      { type: "h2", text: "5 ข้อผิดพลาดที่เมย์เจอบ่อยที่สุด" },
      {
        type: "ol",
        items: [
          "ซื้อประกันสะสมทรัพย์ก่อนจะมีประกันสุขภาพ เพราะคิดว่าอย่างน้อยก็ได้เงินคืน แต่เงินคืนนั้นช่วยอะไรไม่ได้มากเมื่อเจอบิลโรงพยาบาล",
          "ทำประกันให้ลูกเต็มที่ แต่พ่อแม่แทบไม่มีเลย ถ้าเสาหลักล้ม กรมธรรม์ของลูกจ่ายค่าเช่าบ้านแทนไม่ได้นะคะ",
          "เลือกทุนประกันชีวิตจากตัวเลขกลม ๆ แทนที่จะคิดจากสิ่งที่ครอบครัวต้องใช้จริง",
          "ปล่อยกรมธรรม์ขาดอายุหลังเดือนที่เงินตึง แล้วกลับมาซื้อใหม่ในราคาเดิมไม่ได้ เพราะมีโรคประจำตัวเพิ่มขึ้นมา",
          "ไม่เคยบอกครอบครัวว่ามีประกันอะไรบ้าง กรมธรรม์ที่ไม่มีใครรู้ และผู้รับประโยชน์ที่ไม่เคยอัปเดต ช่วยใครไม่ได้เลยค่ะ",
        ],
      },
      { type: "h2", text: "คำถามที่ควรถามตัวแทนทุกคน รวมถึงเมย์ด้วย" },
      {
        type: "ul",
        items: [
          "แผนนี้ไม่คุ้มครองอะไรบ้าง ขอให้อธิบายข้อยกเว้นและระยะรอคอยเป็นภาษาง่าย ๆ",
          "เบี้ยจะเปลี่ยนยังไงเมื่อเราอายุมากขึ้น และแผนนี้รับรองการต่ออายุไหม",
          "ถ้าหยุดจ่ายสักพัก เราจะเสียอะไรบ้าง",
          "แผนนี้ต่อกับความคุ้มครองที่เรามีอยู่แล้วยังไง รวมถึงประกันกลุ่มจากที่ทำงาน",
          "คุณมีใบอนุญาตไหม และได้ค่าตอบแทนต่างกันไหมตามสิ่งที่เราเลือก ตัวแทนที่ซื่อสัตย์จะไม่รังเกียจคำถามนี้ค่ะ",
        ],
      },
      {
        type: "note",
        text: "เมย์ชอบนะคะเวลาลูกค้าถามแบบนี้ เพราะแปลว่าเขาเข้าใจแล้วว่านี่คือแผนของเขา ไม่ใช่แผนของเมย์",
      },
      { type: "h2", text: "เริ่มตรงไหนดี" },
      {
        type: "p",
        text: "ถ้าอ่านแล้วรู้สึกว่าเยอะ ลองเริ่มจากคำถามเดียวค่ะ ถ้าเดือนหน้าเกิดอะไรขึ้นกับเรา บิลใบไหนจะทำให้ครอบครัวล้มก่อน คุ้มครองบิลใบนั้นก่อน แล้วค่อยไปใบถัดไป",
      },
      {
        type: "p",
        text: "ถ้าคุณอยากคุย เล่าให้เมย์ฟังนิดหน่อยนะคะ ว่าครอบครัวเป็นยังไง มีอะไรอยู่แล้วบ้าง แล้วเรามาดูด้วยกัน ไม่มีการกดดัน แค่ให้เห็นภาพชัดขึ้นค่ะ",
      },
      {
        type: "disclaimer",
        text: "เนื้อหาในคู่มือนี้เป็นข้อมูลทั่วไป ไม่ใช่คำแนะนำทางการเงิน กฎหมาย หรือภาษีเฉพาะบุคคล รายละเอียดความคุ้มครองและเงื่อนไขแตกต่างกันไปตามแต่ละแผนและบริษัทประกัน และไม่มีส่วนใดเป็นการรับประกัน ก่อนตัดสินใจ อยากให้คุณคุยกับเมย์หรือตัวแทนที่มีใบอนุญาตคนไหนก็ได้เกี่ยวกับสถานการณ์ของคุณเองนะคะ",
      },
    ],
  },

  en: {
    title: "Protection 101 for Thai families",
    subtitle:
      "Life, health and critical-illness cover each do a different job. Here is how to layer them, in the right order, without overpaying.",
    readingMinutes: 6,
    summary: [
      "Health cover protects your savings from hospital bills, life cover protects the people who depend on your income, and critical-illness cover protects your income while you recover. They are not interchangeable.",
      "Build in order: health first, then life cover sized to your dependents, then a critical-illness lump sum.",
      "Quick life-cover estimate: years of income to replace + debts + children's education − savings − cover you already have.",
      "Employer group insurance is a bonus, not a plan: it ends the day you leave, and the caps are usually low.",
    ],
    blocks: [
      {
        type: "p",
        text: "If I could sit down with every new parent for twenty minutes over coffee, this is what I would say. Not a sales pitch, just the things I wish someone had told my own family earlier.",
      },
      {
        type: "p",
        text: "Most people I meet already have some insurance. The problem is that the pieces do not fit together, so they pay for the wrong thing and stay exposed to the risk that would actually break them.",
      },
      { type: "h2", text: "Three covers, three different jobs" },
      {
        type: "p",
        text: "Insurance is not one product. It is three answers to three different questions.",
      },
      {
        type: "ul",
        items: [
          "Health insurance answers: who pays the hospital if I get sick or have an accident?",
          "Life insurance answers: who pays the bills for my family if I am no longer here?",
          "Critical-illness cover answers: who pays for my life while I am alive but cannot work for a year or two?",
        ],
      },
      {
        type: "p",
        text: "A big life policy does nothing for a hospital bill. A great health plan pays the hospital but not your mortgage while you recover. Each has its own job.",
      },
      {
        type: "table",
        headers: ["Cover type", "What it pays", "When it pays", "Who needs it most"],
        rows: [
          [
            "Health insurance",
            "Hospital room, surgery, doctors, medicines (up to the plan limits)",
            "Each time you are treated, while the plan is in force",
            "Everyone, from children to retirees. The first thing to buy.",
          ],
          [
            "Life insurance",
            "A lump sum to the people you name",
            "Once, if you pass away during the policy term",
            "Anyone with dependents or debts: parents, main earners, anyone with a home loan",
          ],
          [
            "Critical-illness cover",
            "A lump sum to you, to spend as you choose",
            "Once, on diagnosis of a listed serious illness such as cancer, heart attack or stroke",
            "Working-age adults whose household relies on their income",
          ],
        ],
      },
      { type: "h2", text: "Layer them in the right order" },
      {
        type: "p",
        text: "When the budget is limited, and it usually is, the order matters more than the brand. I build protection in three layers, bottom first.",
      },
      {
        type: "ol",
        items: [
          "Health first. A single serious stay in a private hospital can run into the hundreds of thousands of baht. It is the risk most likely to happen and the quickest to empty your savings.",
          "Then life cover, sized to your dependents: an amount worked out from what your family would actually need, not a round number. If nobody depends on your income, this layer can be small.",
          "Then a critical-illness lump sum. Think of it as income protection: it pays the mortgage, the school fees and the extra care while you take time off to get well.",
        ],
      },
      {
        type: "note",
        title: "A note from May",
        text: "I once sat with a family who had three savings policies and no health plan at all. When the wife needed surgery, none of it helped. We fixed it, but I think of them every time someone asks what to buy first.",
      },
      { type: "h2", text: "How much life cover does a family need?" },
      {
        type: "p",
        text: "There is no magic number, but there is a simple method I use in almost every first conversation: add up what your family would need, then subtract what they already have.",
      },
      {
        type: "ul",
        items: [
          "Years of income to replace: how long would your family need your income to live roughly as they do now? Many parents choose 10 years, or until the youngest finishes school.",
          "Plus debts: home loan, car loan, anything that would not disappear with you.",
          "Plus children's education: a rough total for the schooling you want them to have.",
          "Minus savings and investments your family could actually use.",
          "Minus life cover you already hold, including group cover from work.",
        ],
      },
      {
        type: "p",
        text: "For an imaginary family: ten years of a ฿40,000 monthly salary is ฿4.8 million; add a ฿2 million home loan and ฿1.5 million for two children's education; subtract ฿500,000 in savings and ฿1 million of existing cover. The gap is about ฿6.8 million. It feels big until you remember what it is for.",
      },
      {
        type: "p",
        text: "The free coverage calculator on this site does exactly this sum. Run it with your own numbers; it takes two minutes and is often eye-opening.",
      },
      { type: "h2", text: "Why your employer's group insurance is not enough" },
      {
        type: "p",
        text: "Group insurance from work is a lovely benefit, and I always count it. But I never let a client rely on it alone, for three reasons.",
      },
      {
        type: "ul",
        items: [
          "It stops the day you leave, whether you resign, are laid off or retire, which is often exactly when you are older and harder to insure.",
          "The caps are usually low: a room allowance that no longer matches private hospital prices, and a life benefit of one or two years' salary.",
          "You do not control it. Your employer can change the plan or trim the benefits at renewal, and you find out afterwards.",
        ],
      },
      {
        type: "note",
        text: "Think of group insurance as the umbrella the hotel lends you. Wonderful while you are staying there. Not something to plan your whole rainy season around.",
      },
      { type: "h2", text: "The 5 mistakes I see most often" },
      {
        type: "ol",
        items: [
          "Buying savings or endowment plans before any health cover, because at least you get the money back. That is small comfort against a hospital bill.",
          "Insuring the children generously and the parents hardly at all. If the earner falls, the children's policies cannot pay the rent.",
          "Choosing life cover by a round number instead of by what the family actually needs.",
          "Letting a policy lapse after a tight month, then being unable to buy it back at the same price because of a new health condition.",
          "Never telling the family what exists. A policy nobody knows about, with a beneficiary nobody updated, helps no one.",
        ],
      },
      { type: "h2", text: "Questions to ask any advisor, including me" },
      {
        type: "ul",
        items: [
          "What does this plan not cover? Ask for the exclusions and waiting periods in plain language.",
          "What happens to my premium as I get older, and is renewal guaranteed?",
          "If I stop paying for a while, what exactly do I lose?",
          "How does this fit with the cover I already have, including from work?",
          "Are you licensed, and are you paid differently depending on what I choose? An honest advisor will not mind.",
        ],
      },
      {
        type: "note",
        text: "I actually enjoy these questions. A client who asks them has understood that this is their plan, not mine.",
      },
      { type: "h2", text: "Where to start" },
      {
        type: "p",
        text: "If this feels like a lot, start with one question: if something happened to me next month, which bill would break my family first? Cover that bill. Then the next one.",
      },
      {
        type: "p",
        text: "If you would like, tell me a little about your situation, your family and what you already have, and we will look at it together. No pressure, just a clearer picture.",
      },
      {
        type: "disclaimer",
        text: "This guide is general information, not personalised financial, legal or tax advice. Product features, limits and conditions vary by plan and insurer, and nothing here is a guarantee. Before you decide, please talk to me or to any licensed advisor about your own circumstances.",
      },
    ],
  },
};

export default guide;
