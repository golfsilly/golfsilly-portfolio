import type { Locale } from "@/i18n/routing";

type PolicySection = {
  title: string;
  paragraphs?: string[];
  items?: string[];
  placeholder?: boolean;
};

type PolicyCopy = {
  label: string;
  title: string;
  intro: string;
  effectiveDate: string;
  sections: PolicySection[];
};

export const policyCopy: Record<
  Locale,
  { privacy: PolicyCopy; cookies: PolicyCopy }
> = {
  en: {
    privacy: {
      label: "PRIVACY / TEMPLATE",
      title: "Privacy, with room for the real details.",
      intro:
        "This template describes the small amount of browser storage used by the portfolio. Replace the highlighted placeholders with the owner, contact, and legal details before publishing.",
      effectiveDate: "Effective date: [add date]",
      sections: [
        {
          title: "Who operates this site",
          paragraphs: [
            "This website is operated by [owner or company name]. For privacy questions, contact [email address].",
          ],
          placeholder: true,
        },
        {
          title: "What this portfolio stores",
          paragraphs: [
            "The portfolio stores a language preference and a consent preference in the browser so the site can remember the choices you make. No analytics, advertising, marketing pixels, or embedded tracking services are active in this version.",
          ],
        },
        {
          title: "Your choices",
          paragraphs: [
            "You can reopen Cookie settings from the footer at any time. You can also clear site data from your browser settings. Clearing the data may make the site ask for your preferences again.",
          ],
        },
        {
          title: "Contact and rights",
          paragraphs: [
            "Add the contact process, response time, and any rights or supervisory authority details that apply to the people who visit this site.",
          ],
          placeholder: true,
        },
      ],
    },
    cookies: {
      label: "COOKIES / TEMPLATE",
      title: "A small, transparent cookie list.",
      intro:
        "Only essential storage is enabled in V1. This page is a template and must be reviewed against the final domain, services, and owner details before publication.",
      effectiveDate: "Effective date: [add date]",
      sections: [
        {
          title: "Essential cookies",
          paragraphs: [
            "These items support language selection, remembering the consent choice, and the basic operation of the site. They are not used to build an advertising profile.",
          ],
          items: [
            "Better Auth session cookie — keeps the site owner signed in to the protected admin area; it expires with the configured session.",
            "NEXT_LOCALE — remembers whether the interface should use Thai or English; up to 1 year.",
            "golfsilly-consent — stores the consent decision for this site; up to 1 year.",
          ],
        },
        {
          title: "Browser storage",
          items: [
            "golfsilly-admin-ui — remembers table density, visible columns, sidebar state, and the preferred editor language for signed-in administrators.",
          ],
          paragraphs: [
            "The theme preference and consent state may also be mirrored in browser localStorage by the client libraries. This data stays in the visitor's browser in offline mode.",
          ],
        },
        {
          title: "Future optional services",
          paragraphs: [
            "If analytics, marketing, embedded media, or other optional services are added later, they must be documented here and loaded only after the matching consent category is granted.",
          ],
        },
        {
          title: "Owner details",
          paragraphs: [
            "Cookie questions: [add email address]. Website owner: [add owner or company name].",
          ],
          placeholder: true,
        },
      ],
    },
  },
  th: {
    privacy: {
      label: "ความเป็นส่วนตัว / TEMPLATE",
      title: "ความเป็นส่วนตัวที่เว้นพื้นที่ไว้เติมรายละเอียดจริง",
      intro:
        "เทมเพลตนี้อธิบาย storage จำนวนเล็กน้อยที่ portfolio ใช้ในเบราว์เซอร์ กรุณาแทนที่ข้อความในวงเล็บด้วยชื่อเจ้าของ อีเมล และรายละเอียดที่ถูกต้องก่อนเผยแพร่",
      effectiveDate: "วันที่มีผล: [กรอกวันที่]",
      sections: [
        {
          title: "ผู้ดูแลเว็บไซต์",
          paragraphs: [
            "เว็บไซต์นี้ดูแลโดย [ชื่อเจ้าของหรือบริษัท] หากมีคำถามเรื่องความเป็นส่วนตัว ติดต่อ [อีเมล]",
          ],
          placeholder: true,
        },
        {
          title: "ข้อมูลที่ portfolio จัดเก็บ",
          paragraphs: [
            "เว็บไซต์จัดเก็บภาษาที่เลือกและตัวเลือกความเป็นส่วนตัวไว้ในเบราว์เซอร์ เพื่อให้จำตัวเลือกของคุณได้ ในเวอร์ชันนี้ยังไม่มี analytics, โฆษณา, marketing pixel หรือบริการติดตามจากภายนอก",
          ],
        },
        {
          title: "การจัดการตัวเลือก",
          paragraphs: [
            "คุณสามารถเปิดการตั้งค่าคุกกี้ได้จาก Footer ทุกเมื่อ หรือเคลียร์ข้อมูลเว็บไซต์จากการตั้งค่าเบราว์เซอร์ การล้างข้อมูลอาจทำให้เว็บไซต์ถามตัวเลือกใหม่อีกครั้ง",
          ],
        },
        {
          title: "ช่องทางติดต่อและสิทธิของคุณ",
          paragraphs: [
            "เติมขั้นตอนการติดต่อ ระยะเวลาตอบกลับ และรายละเอียดสิทธิหรือหน่วยงานที่เกี่ยวข้องกับผู้เข้าชมเว็บไซต์ก่อนเผยแพร่",
          ],
          placeholder: true,
        },
      ],
    },
    cookies: {
      label: "คุกกี้ / TEMPLATE",
      title: "รายการคุกกี้แบบโปร่งใสและมีขนาดเล็ก",
      intro:
        "V1 เปิดใช้เฉพาะ storage ที่จำเป็น หน้านี้เป็นเทมเพลตและต้องตรวจสอบกับโดเมน บริการ และข้อมูลเจ้าของจริงก่อนเผยแพร่",
      effectiveDate: "วันที่มีผล: [กรอกวันที่]",
      sections: [
        {
          title: "คุกกี้ที่จำเป็น",
          paragraphs: [
            "รายการเหล่านี้ช่วยจำภาษา จำตัวเลือกความเป็นส่วนตัว และทำให้เว็บไซต์ทำงานพื้นฐานได้ ไม่ได้ใช้สร้างโปรไฟล์โฆษณา",
          ],
          items: [
            "คุกกี้เซสชัน Better Auth — ใช้ให้เจ้าของเว็บคงสถานะเข้าสู่ระบบในพื้นที่ admin และหมดอายุตามอายุเซสชันที่กำหนด",
            "NEXT_LOCALE — จำว่าควรแสดงภาษาไทยหรืออังกฤษ อายุไม่เกิน 1 ปี",
            "golfsilly-consent — จำตัวเลือก consent ของเว็บไซต์ อายุไม่เกิน 1 ปี",
          ],
        },
        {
          title: "Browser storage",
          items: [
            "golfsilly-admin-ui — จดจำความหนาแน่นตาราง คอลัมน์ สถานะแถบเมนู และภาษาที่ใช้แก้ไขสำหรับผู้ดูแลที่เข้าสู่ระบบ",
          ],
          paragraphs: [
            "ตัวเลือกธีมและ consent อาจถูกเก็บซ้ำใน localStorage โดย client libraries ข้อมูลนี้อยู่ในเบราว์เซอร์ของผู้เข้าชมเมื่อใช้ offline mode",
          ],
        },
        {
          title: "บริการเสริมในอนาคต",
          paragraphs: [
            "หากเพิ่ม analytics, marketing, สื่อฝังตัว หรือบริการเสริมอื่น ต้องบันทึกรายละเอียดไว้ที่หน้านี้ และโหลดเมื่อผู้ใช้ยินยอมหมวดที่เกี่ยวข้องเท่านั้น",
          ],
        },
        {
          title: "ข้อมูลเจ้าของเว็บไซต์",
          paragraphs: [
            "ติดต่อเรื่องคุกกี้: [กรอกอีเมล] เจ้าของเว็บไซต์: [กรอกชื่อเจ้าของหรือบริษัท]",
          ],
          placeholder: true,
        },
      ],
    },
  },
};
