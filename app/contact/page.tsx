import type { Metadata } from "next";
import ContactContent from "./ContactContent";

export const metadata: Metadata = {
  title: "Contact Us - MiniTeach | 联系我们",
  description: "Contact MiniTeach for professional child companion service support. Scan WeChat QR code to add customer service. | 联系MiniTeach获取专业的儿童陪伴服务支持，扫描微信二维码添加客服",
};

export default function ContactPage() {
  return <ContactContent />;
}