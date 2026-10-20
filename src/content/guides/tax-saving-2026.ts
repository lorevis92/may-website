import type { Guide } from "../types";

const guide: Guide = {
  slug: "tax-saving-2026",
  icon: "receipt",
  order: 3,
  updated: "2026-10-20",
  relatedTool: "tax",

  th: {
    title: "ลดหย่อนภาษีปลายปีด้วยประกัน (ปีภาษี 2569)",
    subtitle:
      "เล่าแบบเพื่อนคุยกัน ว่าประกันแบบไหนลดหย่อนได้เท่าไหร่ ประหยัดได้จริงกี่บาท และกับดักที่คนพลาดกันทุกเดือนธันวาคม",
    readingMinutes: 6,
    summary: [
      "เบี้ยประกันชีวิตของตัวเองลดหย่อนได้สูงสุด 100,000 บาท แต่กรมธรรม์ต้องคุ้มครองตั้งแต่ 10 ปีขึ้นไป และเบี้ยประกันสุขภาพ (ไม่เกิน 25,000 บาท) นับรวมอยู่ในวงเงินก้อนเดียวกัน",
      "ประกันบำนาญลดหย่อนได้อีกก้อน 15% ของรายได้ สูงสุด 200,000 บาท โดยเมื่อรวมกับ PVD/RMF/SSF/กอช./กบข. แล้วต้องไม่เกิน 500,000 บาท",
      "พนักงานรายได้ 900,000 บาทต่อปีที่ซื้อเบี้ยเข้าเกณฑ์ 200,000 บาท ประหยัดภาษีได้ราว 30,000 บาท (15% ของเบี้ย) ตัวเลขจริงขึ้นกับค่าลดหย่อนอื่นที่มีอยู่แล้ว",
      "กรมธรรม์ต้องออกและจ่ายเบี้ยภายในปี ต้องยินยอมให้บริษัทส่งข้อมูลให้สรรพากร และจำไว้ว่าภาษีคือของแถม ความคุ้มครองคือเหตุผลจริง",
    ],
    blocks: [
      {
        type: "p",
        text: "ทุกปีพอเข้าเดือนพฤศจิกายน โทรศัพท์ของเมย์จะดังถี่ขึ้นเป็นพิเศษค่ะ ส่วนใหญ่ขึ้นต้นเหมือนกันหมด “เมย์ ปีนี้ยังไม่ได้ซื้ออะไรลดหย่อนเลย ทำยังไงดี”",
      },
      {
        type: "p",
        text: "เมย์เข้าใจดีค่ะ เพราะเมื่อก่อนเมย์ก็เคยวิ่งซื้อทุกอย่างในสองสัปดาห์สุดท้ายของปีเหมือนกัน วันนี้เลยอยากเล่าแบบเพื่อนคุยกันหน้าแก้วกาแฟ ว่าประกันช่วยเรื่องภาษีตรงไหน และตรงไหนที่คนมักสะดุด",
      },
      { type: "h2", text: "ค่าลดหย่อนทำงานยังไง (ฉบับสั้น)" },
      {
        type: "p",
        text: "ก่อนอื่นต้องเข้าใจก่อนนะคะว่า ค่าลดหย่อนไม่ใช่เงินที่รัฐคืนให้เราเต็มจำนวน แต่เป็นตัวเลขที่หักออกจากรายได้ก่อนคำนวณภาษีค่ะ",
      },
      {
        type: "p",
        text: "ภาษีเงินได้บุคคลธรรมดาของไทยเป็นแบบขั้นบันได เงินได้สุทธิ 150,000 บาทแรกไม่เสียภาษี ส่วนถัดไปเสีย 5% แล้วไต่ขึ้นเป็น 10%, 15%, 20%, 25%, 30% จนถึง 35% สำหรับส่วนที่เกิน 5 ล้านบาท",
      },
      {
        type: "p",
        text: "ดังนั้นค่าลดหย่อน 1 บาท ช่วยประหยัดภาษีได้เท่ากับอัตราขั้นบนสุดที่เราโดนอยู่ คนที่อยู่ขั้น 20% ประหยัดได้ 20 สตางค์ต่อบาท คนที่อยู่ขั้น 5% ได้ 5 สตางค์ นี่คือเหตุผลที่ “ซื้อแล้วลดได้เท่าไหร่” มีคำตอบไม่เหมือนกันในแต่ละคนค่ะ",
      },
      { type: "h2", text: "ประกันแต่ละแบบ ลดหย่อนได้เท่าไหร่" },
      {
        type: "p",
        text: "เมย์ชอบมองเป็น “กล่อง” ค่ะ แต่ละกล่องมีฝาปิดของตัวเอง และบางกล่องซ้อนอยู่ในกล่องใหญ่อีกที นี่คือกฎของกรมสรรพากรสำหรับปีภาษี 2569 นะคะ",
      },
      {
        type: "table",
        headers: ["กล่องลดหย่อน", "เพดานสูงสุด", "เงื่อนไขที่ต้องจำ"],
        rows: [
          [
            "ประกันชีวิตของตัวเอง",
            "100,000 บาท",
            "กรมธรรม์คุ้มครอง 10 ปีขึ้นไป ทำกับบริษัทประกันในไทย",
          ],
          [
            "ประกันสุขภาพของตัวเอง",
            "25,000 บาท",
            "นับรวมอยู่ในกล่องประกันชีวิต รวมกันแล้วต้องไม่เกิน 100,000 บาท",
          ],
          [
            "ประกันสุขภาพของพ่อแม่",
            "15,000 บาท",
            "พ่อแม่มีรายได้ไม่เกิน 30,000 บาทต่อปี",
          ],
          [
            "ประกันชีวิตของคู่สมรสที่ไม่มีรายได้",
            "10,000 บาท",
            "คู่สมรสต้องไม่มีเงินได้ในปีภาษีนั้น",
          ],
          [
            "ประกันชีวิตแบบบำนาญ",
            "15% ของรายได้ สูงสุด 200,000 บาท",
            "รวมกับกองทุนสำรองเลี้ยงชีพ (PVD), RMF, SSF, กอช. และ กบข. แล้วไม่เกิน 500,000 บาท",
          ],
        ],
      },
      { type: "h3", text: "กฎพิเศษของประกันบำนาญที่หลายคนไม่รู้" },
      {
        type: "p",
        text: "ถ้าปีนี้คุณยังใช้กล่องประกันชีวิต 100,000 บาทไม่เต็ม เบี้ยประกันบำนาญสามารถเข้าไปเติมกล่องนั้นให้เต็มก่อนได้ค่ะ ส่วนที่เหลือค่อยไปใช้สิทธิในกล่องบำนาญ 200,000 บาท ดังนั้นคนที่มีประกันบำนาญอย่างเดียวก็ยังได้ประโยชน์จากทั้งสองกล่องนะคะ",
      },
      { type: "h2", text: "ตัวอย่างจริง: พนักงานประจำรายได้ 900,000 บาทต่อปี" },
      {
        type: "p",
        text: "สมมติว่าคุณเป็นพนักงานบริษัท รายได้ปีละ 900,000 บาท ก่อนจะซื้ออะไรเพิ่ม คุณมีค่าลดหย่อนพื้นฐานอยู่แล้ว คือค่าใช้จ่ายเหมา 50% (สูงสุด 100,000 บาท) ค่าลดหย่อนส่วนตัว 60,000 บาท และประกันสังคมประมาณ 10,500 บาท เงินได้สุทธิจึงอยู่ราวๆ 729,500 บาท ซึ่งตกอยู่ในขั้น 500,001–750,000 บาท เสียภาษี 15% คิดเป็นภาษีประมาณ 61,925 บาทค่ะ",
      },
      {
        type: "p",
        text: "ทีนี้เดือนธันวาคมนี้คุณตัดสินใจทำสองอย่าง",
      },
      {
        type: "ul",
        items: [
          "ซื้อประกันชีวิตแบบสะสมทรัพย์ที่คุ้มครองเกิน 10 ปี เบี้ยปีละ 100,000 บาท ใช้กล่องประกันชีวิตเต็มพอดี",
          "ซื้อประกันบำนาญ เบี้ยปีละ 100,000 บาท ซึ่งไม่เกิน 15% ของรายได้ (900,000 × 15% = 135,000 บาท) และไม่เกินเพดาน 200,000 บาท",
        ],
      },
      {
        type: "p",
        text: "ค่าลดหย่อนเพิ่มขึ้น 200,000 บาท เงินได้สุทธิลดลงเหลือประมาณ 529,500 บาท ซึ่งยังอยู่ในขั้น 15% เหมือนเดิม ภาษีจึงลดลงเหลือประมาณ 31,925 บาท",
      },
      {
        type: "p",
        text: "ประหยัดได้ประมาณ 30,000 บาท หรือก็คือ 200,000 × 15% นั่นเองค่ะ",
      },
      {
        type: "p",
        text: "หลักการที่อยากให้จำคือ เงินที่ประหยัดได้ = อัตราภาษีขั้นบนสุดของคุณ × เบี้ยที่ลดหย่อนได้ ถ้าเงินได้สุทธิเกิน 750,000 บาท อัตรานั้นจะเป็น 20% และถ้าเกิน 1 ล้านบาทจะเป็น 25% เมย์ใช้คำว่า “ประมาณ” เพราะค่าลดหย่อนอื่นที่คุณอาจมี เช่น กองทุนสำรองเลี้ยงชีพ บุตร หรือดอกเบี้ยบ้าน จะเปลี่ยนตัวเลขนี้ไปอีกนิดหน่อย เครื่องมือคำนวณภาษีในเว็บนี้ช่วยคำนวณจากข้อมูลทั้งหมดของคุณได้ค่ะ",
      },
      {
        type: "note",
        title: "เมย์คิดว่า",
        text: "ลูกค้าคนหนึ่งเคยบอกเมย์ว่า “เหมือนได้ส่วนลด 15% ตอนซื้อของที่ยังไงก็ต้องซื้ออยู่แล้ว” เมย์ชอบมุมมองนี้มากค่ะ ส่วนลดเป็นเรื่องดี แต่ของชิ้นนั้นต้องเป็นของที่เราอยากได้จริงๆ ก่อนนะคะ",
      },
      { type: "h2", text: "ขั้นตอนที่ต้องทำจริง ไม่ใช่แค่จ่ายเบี้ย" },
      {
        type: "ol",
        items: [
          "แจ้งบริษัทประกันว่าคุณต้องการใช้สิทธิลดหย่อน และให้ความยินยอมส่งข้อมูลเบี้ยไปยังกรมสรรพากร ทุกวันนี้สรรพากรใช้ข้อมูลที่บริษัทส่งตรงเป็นหลัก ถ้าไม่ได้ยินยอม ข้อมูลจะไม่ขึ้นในระบบค่ะ",
          "กรมธรรม์ต้องออกเล่มและชำระเบี้ยภายในปีภาษี คือภายในวันที่ 31 ธันวาคม ถ้าสมัครวันสุดท้ายแต่กรมธรรม์ออกเดือนมกราคม จะนับเป็นของปีหน้านะคะ",
          "เก็บหนังสือรับรองการชำระเบี้ยไว้ แม้ข้อมูลจะส่งอัตโนมัติ แต่ถ้าสรรพากรขอดูเอกสาร คุณจะได้มีให้ทันที",
          "ยื่นแบบ ภ.ง.ด.90 หรือ 91 ภายในสิ้นเดือนมีนาคมของปีถัดไป ยื่นออนไลน์ได้เวลาเพิ่มอีกประมาณหนึ่งสัปดาห์ถึงต้นเดือนเมษายน แต่อย่ารอวันสุดท้ายเลยค่ะ ระบบมักช้าช่วงนั้น",
        ],
      },
      { type: "h2", text: "กับดักที่เมย์เห็นทุกปี" },
      {
        type: "ul",
        items: [
          "ซื้อกรมธรรม์ที่คุ้มครองไม่ถึง 10 ปี เบี้ยก้อนนั้นเอาเข้ากล่องประกันชีวิตไม่ได้เลย แม้จะเป็นประกันชีวิตก็ตาม",
          "ลืมเพดานรวม เช่น ประกันสุขภาพ 25,000 บวกประกันชีวิต 100,000 ได้แค่ 100,000 ไม่ใช่ 125,000 หรือมีกองทุนสำรองเลี้ยงชีพกับ RMF เยอะอยู่แล้วจนเบี้ยบำนาญไปชนเพดาน 500,000",
          "ซื้อเพราะภาษีอย่างเดียว โดยไม่ดูว่าระยะเวลาจ่ายเบี้ย ความคุ้มครอง และเงินที่ต้องผูกไว้หลายปี เหมาะกับชีวิตตัวเองไหม พอปีที่สองจ่ายไม่ไหว ก็เสียทั้งสิทธิและเสียทั้งเงินค่ะ",
          "สมัครช้าเกินไป ปลายธันวาคมบริษัทประกันยังต้องตรวจสุขภาพและพิจารณารับประกัน บางเคสออกกรมธรรม์ไม่ทันปีค่ะ",
        ],
      },
      {
        type: "note",
        title: "เมย์เล่าให้ฟัง",
        text: "มีปีหนึ่งลูกค้าโทรมาวันที่ 29 ธันวาคม อยากทำประกันบำนาญให้ทันปีนั้น แต่ต้องตรวจสุขภาพก่อน สุดท้ายกรมธรรม์ออกกลางเดือนมกราคม สิทธิเลยไปตกปีถัดไปค่ะ ตั้งแต่นั้นเมย์เลยชวนทุกคนคุยเรื่องนี้ตั้งแต่เดือนตุลาคมแทน",
      },
      { type: "h2", text: "ภาษีคือของแถม ไม่ใช่เหตุผล" },
      {
        type: "p",
        text: "นี่คือสิ่งที่เมย์พูดกับลูกค้าทุกคนค่ะ การลดหย่อนภาษีเป็นผลพลอยได้ที่ดีมาก แต่เหตุผลที่เราทำประกันคือความคุ้มครองของคนที่เรารัก และเงินออมที่ค่อยๆ เติบโตไปตามเวลา",
      },
      {
        type: "p",
        text: "ถ้ากรมธรรม์ที่ซื้อตอบโจทย์ชีวิตอยู่แล้ว ภาษีที่ประหยัดได้ก็เป็นโบนัสที่น่าชื่นใจ แต่ถ้าซื้อแค่เพราะกลัวเสียสิทธิ มันมักกลายเป็นภาระในปีถัดๆ ไปค่ะ",
      },
      {
        type: "p",
        text: "ถ้าอยากรู้ว่ากล่องไหนของคุณยังว่างอยู่ และแบบประกันไหนเหมาะกับช่วงชีวิตตอนนี้ เล่าให้เมย์ฟังได้นะคะ เรามาดูด้วยกันแบบไม่รีบค่ะ",
      },
      {
        type: "disclaimer",
        text: "บทความนี้เป็นข้อมูลทั่วไปตามกฎของกรมสรรพากรสำหรับปีภาษี 2569 ไม่ใช่คำแนะนำด้านภาษี การเงิน หรือกฎหมายเฉพาะบุคคล ตัวเลขที่ประหยัดได้จริงขึ้นอยู่กับรายได้และค่าลดหย่อนทั้งหมดของแต่ละคน ก่อนตัดสินใจ กรุณาปรึกษาเมย์หรือที่ปรึกษาที่มีใบอนุญาตนะคะ",
      },
    ],
  },

  en: {
    title: "Year-end tax saving with insurance (tax year 2026)",
    subtitle:
      "A friend's guide to which premiums are deductible, how much you might really save, and the traps people fall into every December",
    readingMinutes: 6,
    summary: [
      "Your own life insurance premiums are deductible up to ฿100,000, but only if the policy runs 10 years or more; your own health premiums (up to ฿25,000) sit inside that same ฿100,000.",
      "Pension life insurance adds a separate bucket: 15% of income, max ฿200,000, and the combined total with PVD/RMF/SSF/NSF/GPF cannot exceed ฿500,000.",
      "An employee earning ฿900,000 a year who adds ฿200,000 of qualifying premiums saves roughly ฿30,000 in tax (15% of the premium); the exact figure depends on the other allowances they already have.",
      "The policy must be issued and paid within the year, you must consent to the insurer reporting it, and tax is the bonus, not the reason to buy.",
    ],
    blocks: [
      {
        type: "p",
        text: "Every year, once November arrives, my phone gets noticeably busier. Most calls open the same way: “May, I haven't bought anything for tax yet. What do I do?”",
      },
      {
        type: "p",
        text: "I used to be that person myself, scrambling through the last two weeks of December. So let me explain it the way I would to a friend over coffee: where insurance helps with tax, and where people usually trip.",
      },
      { type: "h2", text: "How a deduction actually works (the short version)" },
      {
        type: "p",
        text: "First, a deduction is not money the government hands back to you. It is an amount subtracted from your income before your tax is calculated.",
      },
      {
        type: "p",
        text: "Thai personal income tax is a staircase: the first ฿150,000 of net income is exempt, the next slice is taxed at 5%, and it climbs through 10%, 15%, 20%, 25% and 30% to 35% above ฿5 million.",
      },
      {
        type: "p",
        text: "So one baht of deduction saves you one baht multiplied by the top rate you pay: 20 satang on the 20% step, 5 satang on the 5% step. That is why “how much will I save?” has a different answer for everyone.",
      },
      { type: "h2", text: "The buckets and their lids" },
      {
        type: "p",
        text: "I picture each deduction as a box with its own lid, and some boxes sit inside bigger ones. These are the Revenue Department rules for tax year 2026.",
      },
      {
        type: "table",
        headers: ["Deduction bucket", "Maximum", "The condition to remember"],
        rows: [
          [
            "Your own life insurance",
            "฿100,000",
            "Policy term of 10 years or more, with an insurer in Thailand",
          ],
          [
            "Your own health insurance",
            "฿25,000",
            "Counted inside the ฿100,000 life bucket, not on top of it",
          ],
          [
            "Your parents' health insurance",
            "฿15,000",
            "Each parent's income must be ฿30,000 a year or less",
          ],
          [
            "Life insurance for a spouse with no income",
            "฿10,000",
            "Your spouse must have no assessable income that year",
          ],
          [
            "Pension life insurance",
            "15% of income, up to ฿200,000",
            "Combined with PVD/RMF/SSF/NSF/GPF, the total cannot exceed ฿500,000",
          ],
        ],
      },
      { type: "h3", text: "The pension rule most people have never heard of" },
      {
        type: "p",
        text: "If you have not filled your ฿100,000 life bucket this year, pension premiums can top it up first; only the remainder goes into the separate ฿200,000 pension bucket. So someone who owns only a pension plan still benefits from both.",
      },
      { type: "h2", text: "A worked example: a salaried employee earning ฿900,000" },
      {
        type: "p",
        text: "Say you are an employee earning ฿900,000 a year. Before you buy anything, you already have the basic deductions: the 50% expense deduction (capped at ฿100,000), the ฿60,000 personal allowance and about ฿10,500 of social security. That leaves taxable income of roughly ฿729,500, which sits in the ฿500,001–750,000 band taxed at 15%, and a tax bill of about ฿61,925.",
      },
      {
        type: "p",
        text: "Now, this December, you do two things.",
      },
      {
        type: "ul",
        items: [
          "Take out a life and savings plan with a term longer than 10 years, paying ฿100,000 a year. That fills the life bucket exactly.",
          "Take out a pension plan, also ฿100,000 a year. That is within 15% of your income (900,000 × 15% = ฿135,000) and under the ฿200,000 cap.",
        ],
      },
      {
        type: "p",
        text: "That is ฿200,000 of new deductions. Your taxable income drops to about ฿529,500, still inside the 15% band, and your tax falls to about ฿31,925.",
      },
      {
        type: "p",
        text: "The saving is roughly ฿30,000, which is simply 200,000 × 15%.",
      },
      {
        type: "p",
        text: "The rule to remember: what you save equals your top tax rate multiplied by the deductible premium. Above ฿750,000 of taxable income that rate is 20%; above ฿1 million, 25%. I say “roughly” because other allowances, such as a provident fund, children or home loan interest, shift the figure a little; the tax tool on this site works it out from your full picture.",
      },
      {
        type: "note",
        title: "May's thought",
        text: "A client once told me it felt like “getting 15% off something I was going to buy anyway”. I love that way of looking at it. A discount is wonderful, but only on something you actually wanted in the first place.",
      },
      { type: "h2", text: "The practical steps, not just paying the premium" },
      {
        type: "ol",
        items: [
          "Tell your insurer you want to claim the deduction and consent to your premium data being sent to the Revenue Department. The Revenue Department relies on what insurers report directly; without your consent, nothing appears in the system.",
          "The policy must be issued and the premium paid within the tax year, by 31 December. Apply on the last day and get a policy dated January, and it counts for next year.",
          "Keep the premium certificate your insurer sends you. The data goes over automatically, but if the Revenue Department asks for evidence, you will have it.",
          "File your return (form PND 90 or 91) by the end of March the following year; filing online gives you about an extra week, into early April. Don't leave it to the last day, the system crawls then.",
        ],
      },
      { type: "h2", text: "The traps I see every year" },
      {
        type: "ul",
        items: [
          "A policy with a term under 10 years: those premiums cannot go into the life bucket at all, even though it is life insurance.",
          "Forgetting the combined caps: ฿25,000 of health plus ฿100,000 of life is ฿100,000 in total, not ฿125,000, and a large provident fund and RMF balance can push a pension premium into the ฿500,000 ceiling.",
          "Buying purely for tax, without checking that the premium term, the cover and the years your money is committed suit your life. When year two is a struggle, you lose both the benefit and the money.",
          "Leaving it too late. In late December insurers still need health checks and underwriting, and some policies cannot be issued before the year ends.",
        ],
      },
      {
        type: "note",
        title: "A story from May",
        text: "One year a client rang me on 29 December wanting a pension plan for that tax year, but a health check came first. The policy was issued in mid-January, so the deduction slipped into the following year. Since then I start this conversation with everyone in October.",
      },
      { type: "h2", text: "Tax is the bonus, not the reason" },
      {
        type: "p",
        text: "Here is what I say to every client. The tax saving is a lovely by-product, but the reason we buy insurance is to protect the people we love and to build savings that grow quietly over time.",
      },
      {
        type: "p",
        text: "If the plan already answers a real need, the tax you save is a happy bonus. If you are buying only out of fear of losing the deduction, it usually becomes a burden in the years that follow.",
      },
      {
        type: "p",
        text: "If you would like to know which of your buckets still have room, and which kind of plan fits where you are in life, tell me about your situation and we will look at it together, with no rush.",
      },
      {
        type: "disclaimer",
        text: "This article is general information based on the Revenue Department rules for tax year 2026, not personalised tax, financial or legal advice. What you actually save depends on your full income and all your other allowances. Before deciding, please talk to me or to any licensed advisor.",
      },
    ],
  },
};

export default guide;
