// Bilingual privacy notice (Thailand PDPA, B.E. 2562).
// "[EMAIL]" and "[PHONE]" are placeholders — replace them from site config at render time.

import type { Block } from "./types";

type PrivacyLocaleContent = {
  title: string;
  /** ISO date of the last revision */
  updated: string;
  blocks: Block[];
};

export const privacy: { th: PrivacyLocaleContent; en: PrivacyLocaleContent } = {
  th: {
    title: "ประกาศความเป็นส่วนตัว",
    updated: "2026-10-20",
    blocks: [
      {
        type: "p",
        text: "ประกาศฉบับนี้อธิบายอย่างตรงไปตรงมาว่าเว็บไซต์นี้เก็บข้อมูลอะไรของคุณ นำไปใช้ทำอะไร เก็บไว้นานแค่ไหน และคุณมีสิทธิอะไรบ้าง ถ้ามีข้อสงสัย ถามได้เสมอค่ะ",
      },

      { type: "h2", text: "เราเป็นใคร" },
      {
        type: "p",
        text: "เว็บไซต์นี้ดูแลโดยเมย์ ตัวแทนประกันชีวิตและที่ปรึกษาทางการเงินที่ได้รับใบอนุญาตในประเทศไทย ตามพระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562 (PDPA) เมย์เป็น \"ผู้ควบคุมข้อมูลส่วนบุคคล\" สำหรับข้อมูลที่คุณให้ไว้ผ่านเว็บไซต์นี้",
      },
      {
        type: "p",
        text: "เมย์เป็นตัวแทนของเอไอเอ ประเทศไทย แต่เว็บไซต์นี้เป็นของเมย์เอง เอไอเอจะได้รับข้อมูลของคุณก็ต่อเมื่อคุณตัดสินใจยื่นใบคำขอเอาประกันเท่านั้น และตั้งแต่จุดนั้น นโยบายความเป็นส่วนตัวของเอไอเอจะมีผลใช้บังคับด้วย",
      },

      { type: "h2", text: "ข้อมูลที่เราเก็บ" },
      {
        type: "p",
        text: "เราเก็บเฉพาะข้อมูลที่คุณเลือกให้ไว้ บวกกับข้อมูลทางเทคนิคเล็กน้อยที่เบราว์เซอร์ของคุณส่งมาโดยอัตโนมัติ",
      },
      {
        type: "ul",
        items: [
          "ข้อมูลติดต่อ: ชื่อ อีเมล เบอร์โทรศัพท์ หรือ LINE ID",
          "คำตอบในเครื่องมือวางแผน: ช่วงชีวิต ช่วงรายได้ ข้อมูลครอบครัว และสิ่งอื่นที่คุณเลือกกรอกเอง",
          "ข้อความแชท: สิ่งที่คุณพิมพ์คุยกับผู้ช่วย AI บนเว็บไซต์",
          "ข้อมูลทางเทคนิค: หมายเลข IP ประเภทเบราว์เซอร์และอุปกรณ์ หน้าที่เข้าชม และเวลาที่เข้าชม",
        ],
      },
      {
        type: "p",
        text: "กรุณาอย่ากรอกข้อมูลอ่อนไหว เช่น เลขบัตรประชาชน หรือประวัติการรักษา ในส่วนใดของเว็บไซต์ รวมถึงช่องแชท หากเราจำเป็นต้องใช้ข้อมูลประเภทนี้ (เช่น ตอนยื่นใบคำขอ) เราจะขอจากคุณโดยตรงและอธิบายเหตุผลให้ทราบ",
      },

      { type: "h2", text: "เราใช้ข้อมูลเพื่ออะไร และอาศัยฐานทางกฎหมายใด" },
      {
        type: "ul",
        items: [
          "เพื่อตอบคำถามของคุณ (ฐาน: การดำเนินการตามคำขอของคุณก่อนเข้าทำสัญญา และประโยชน์โดยชอบด้วยกฎหมายของเราในการตอบกลับคุณ)",
          "เพื่อจัดทำการวิเคราะห์เฉพาะบุคคลเมื่อคุณร้องขอ (ฐาน: การดำเนินการตามคำขอของคุณ)",
          "เพื่อส่งคู่มือหรือผลลัพธ์จากเครื่องมือที่คุณขอ (ฐาน: การดำเนินการตามคำขอของคุณ)",
          "เพื่อส่งข่าวสารที่เป็นประโยชน์เป็นครั้งคราว (ฐาน: ความยินยอมของคุณเท่านั้น ซึ่งถอนได้ทุกเมื่อ และทุกข้อความจะมีช่องทางให้ยกเลิกรับ)",
          "เพื่อให้เว็บไซต์ทำงานได้และปลอดภัย (ฐาน: ประโยชน์โดยชอบด้วยกฎหมายของเรา)",
        ],
      },

      { type: "h2", text: "เราเก็บข้อมูลไว้นานแค่ไหน" },
      {
        type: "p",
        text: "เราเก็บข้อมูลของคุณไว้เท่าที่จำเป็นตามวัตถุประสงค์ที่เก็บมาเท่านั้น โดยทั่วไปไม่เกิน 2 ปีนับจากการติดต่อครั้งสุดท้าย หลังจากนั้นข้อมูลจะถูกลบหรือทำให้ไม่สามารถระบุตัวตนได้",
      },
      {
        type: "p",
        text: "หากมีการออกกรมธรรม์ ข้อมูลที่เกี่ยวข้องจะถูกเก็บไว้ตามระยะเวลาที่หลักเกณฑ์การกำกับดูแลธุรกิจประกันภัยกำหนด ซึ่งอาจนานกว่านั้น",
      },

      { type: "h2", text: "เราแบ่งปันข้อมูลให้ใครบ้าง" },
      {
        type: "p",
        text: "เราไม่ขายข้อมูลของคุณ และจะเปิดเผยให้เฉพาะ:",
      },
      {
        type: "ul",
        items: [
          "เอไอเอ ประเทศไทย เฉพาะเมื่อคุณตัดสินใจยื่นใบคำขอเอาประกัน เพื่อดำเนินการตามใบคำขอนั้น",
          "ผู้ให้บริการโฮสติ้งและบริการส่งอีเมล ซึ่งทำหน้าที่เป็นผู้ประมวลผลข้อมูลตามคำสั่งของเรา และไม่สามารถนำข้อมูลของคุณไปใช้เพื่อวัตถุประสงค์ของตนเองได้",
          "ผู้ให้บริการโมเดล AI ที่อยู่เบื้องหลังช่องแชท ข้อความของคุณจะถูกส่งไปเพื่อสร้างคำตอบ นี่คือเหตุผลที่เราขอให้คุณไม่พิมพ์เลขบัตรประชาชนหรือประวัติการรักษาลงในแชท",
          "หน่วยงานราชการ เมื่อกฎหมายกำหนดให้ต้องเปิดเผย",
        ],
      },
      {
        type: "p",
        text: "ผู้ให้บริการบางรายอยู่นอกประเทศไทย ในกรณีนั้นเราจะดูแลให้มีมาตรการคุ้มครองที่เหมาะสมตามที่ PDPA กำหนด",
      },

      { type: "h2", text: "สิทธิของคุณ" },
      {
        type: "p",
        text: "ตาม PDPA คุณมีสิทธิดังนี้:",
      },
      {
        type: "ul",
        items: [
          "ขอเข้าถึงและขอรับสำเนาข้อมูลของคุณ",
          "ขอแก้ไขข้อมูลที่ไม่ถูกต้องหรือไม่ครบถ้วน",
          "ขอให้ลบข้อมูล หรือทำให้ข้อมูลไม่สามารถระบุตัวตนได้",
          "ขอให้ระงับการใช้ข้อมูลในบางกรณี",
          "ขอรับข้อมูลในรูปแบบที่โอนย้ายได้ ในกรณีที่ข้อมูลถูกเก็บโดยอัตโนมัติโดยอาศัยความยินยอมหรือสัญญา",
          "คัดค้านการประมวลผลที่อาศัยฐานประโยชน์โดยชอบด้วยกฎหมาย และคัดค้านการตลาดแบบตรงได้ทุกกรณี",
          "ถอนความยินยอมได้ทุกเมื่อ โดยไม่กระทบการประมวลผลที่ทำไปก่อนหน้า",
          "ร้องเรียนต่อคณะกรรมการคุ้มครองข้อมูลส่วนบุคคล ผ่านสำนักงานคณะกรรมการคุ้มครองข้อมูลส่วนบุคคล (สคส.) หากเห็นว่าเราจัดการข้อมูลของคุณไม่ถูกต้อง",
        ],
      },
      {
        type: "p",
        text: "หากต้องการใช้สิทธิข้อใด ติดต่อเราตามช่องทางด้านล่าง เราจะตอบกลับภายใน 30 วัน และอาจขอให้คุณยืนยันตัวตนก่อน",
      },

      { type: "h2", text: "ผู้เยาว์" },
      {
        type: "p",
        text: "เว็บไซต์นี้มีไว้สำหรับผู้ใหญ่ หากคุณกรอกข้อมูลเกี่ยวกับบุตรในเครื่องมือวางแผน ถือว่าคุณกรอกในฐานะบิดามารดาหรือผู้ปกครองตามกฎหมาย",
      },

      { type: "h2", text: "ความปลอดภัยของข้อมูล" },
      {
        type: "p",
        text: "เราใช้มาตรการทางเทคนิคและการจัดการที่เหมาะสมเพื่อปกป้องข้อมูลของคุณ เช่น การเชื่อมต่อแบบเข้ารหัส และการจำกัดการเข้าถึงเฉพาะผู้ที่จำเป็น",
      },

      { type: "h2", text: "การเปลี่ยนแปลงประกาศฉบับนี้" },
      {
        type: "p",
        text: "เราอาจปรับปรุงประกาศฉบับนี้เป็นครั้งคราว วันที่ด้านบนแสดงเวอร์ชันล่าสุด และหากมีการเปลี่ยนแปลงที่สำคัญ เราจะแจ้งให้ทราบอย่างชัดเจนบนเว็บไซต์",
      },

      { type: "h2", text: "ติดต่อเรา" },
      {
        type: "ul",
        items: [
          "ผู้ควบคุมข้อมูลส่วนบุคคล: เมย์",
          "อีเมล: [EMAIL]",
          "โทรศัพท์ / LINE: [PHONE]",
        ],
      },
    ],
  },

  en: {
    title: "Privacy notice",
    updated: "2026-10-20",
    blocks: [
      {
        type: "p",
        text: "This notice explains, in plain language, what this website collects about you, why, how long it is kept and what your rights are. If anything is unclear, just ask.",
      },

      { type: "h2", text: "Who we are" },
      {
        type: "p",
        text: "This website is run by May, a licensed insurance and financial advisor in Thailand. Under the Personal Data Protection Act B.E. 2562 (PDPA), she is the \"data controller\" for the information you share here.",
      },
      {
        type: "p",
        text: "May is an advisor for AIA Thailand, but this website is her own. AIA receives your data only if you go ahead with an application, and from then on AIA's own privacy policy also applies.",
      },

      { type: "h2", text: "What we collect" },
      {
        type: "p",
        text: "We collect only what you choose to give us, plus a little technical data your browser sends automatically.",
      },
      {
        type: "ul",
        items: [
          "Contact details: your name, email address, phone number or LINE ID.",
          "Answers to the planning tools: your life stage, income range, family details and anything else you choose to enter.",
          "Chat messages: what you type to the AI assistant on this site.",
          "Technical data: IP address, browser and device type, pages visited and time of visit.",
        ],
      },
      {
        type: "p",
        text: "Please do not enter sensitive data, such as ID card numbers or medical records, anywhere on the site, including the chat. If we ever need it (for an application, say), we will ask you directly and explain why.",
      },

      { type: "h2", text: "Why we use it, and our legal basis" },
      {
        type: "ul",
        items: [
          "To respond to your enquiries. Basis: taking steps at your request before a contract, and our legitimate interest in replying.",
          "To prepare a personalised review when you ask for one. Basis: taking steps at your request.",
          "To send you the guide or tool results you asked for. Basis: taking steps at your request.",
          "To send occasional useful updates. Basis: your consent only, which you can withdraw at any time; every message includes a way to opt out.",
          "To keep the site working, safe and secure. Basis: our legitimate interest.",
        ],
      },

      { type: "h2", text: "How long we keep it" },
      {
        type: "p",
        text: "We keep your data only as long as needed for its purpose: as a rule, no longer than 2 years after our last contact. After that it is deleted or anonymised.",
      },
      {
        type: "p",
        text: "If a policy is issued, the related records are kept for as long as insurance regulation requires, which can be longer.",
      },

      { type: "h2", text: "Who we share it with" },
      {
        type: "p",
        text: "We never sell your data. We share it only with:",
      },
      {
        type: "ul",
        items: [
          "AIA Thailand, only when you proceed with an application, so that it can be processed.",
          "Hosting and email service providers. They act as data processors on our instructions and cannot use your data for their own purposes.",
          "The AI model provider behind the chat feature. Your messages are sent to it to generate replies, which is why we ask you not to type ID numbers or medical records into the chat.",
          "Public authorities, where the law requires us to.",
        ],
      },
      {
        type: "p",
        text: "Some of these providers are outside Thailand. In that case, we make sure appropriate safeguards are in place, as the PDPA requires.",
      },

      { type: "h2", text: "Your rights" },
      {
        type: "p",
        text: "Under the PDPA you have the right to:",
      },
      {
        type: "ul",
        items: [
          "Access your data and ask for a copy.",
          "Correct data that is inaccurate or incomplete.",
          "Delete your data, or ask us to anonymise it.",
          "Restrict how we use it in certain cases.",
          "Receive your data in a portable format, where it was collected automatically on the basis of consent or a contract.",
          "Object to processing based on legitimate interest, and to any direct marketing.",
          "Withdraw consent at any time, without affecting what was done before.",
          "Complain to the Personal Data Protection Committee (PDPC) if you believe we have mishandled your data.",
        ],
      },
      {
        type: "p",
        text: "To use any of these rights, contact us below. We will respond within 30 days, and may ask you to confirm your identity first.",
      },

      { type: "h2", text: "Children" },
      {
        type: "p",
        text: "This site is for adults. If you enter details about your children in a planning tool, you do so as their parent or legal guardian.",
      },

      { type: "h2", text: "Security" },
      {
        type: "p",
        text: "We protect your data with reasonable technical and organisational measures, such as encrypted connections and limiting access to the people who need it.",
      },

      { type: "h2", text: "Changes to this notice" },
      {
        type: "p",
        text: "We may update this notice from time to time; the date at the top shows the latest version, and we will flag any significant change on the site.",
      },

      { type: "h2", text: "Contact" },
      {
        type: "ul",
        items: [
          "Data controller: May",
          "Email: [EMAIL]",
          "Phone / LINE: [PHONE]",
        ],
      },
    ],
  },
};
