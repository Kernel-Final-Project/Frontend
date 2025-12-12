import { Mail, Phone, MapPin } from "lucide-react";

const footerLinks = {
  company: [
    { label: "회사소개", href: "#" },
    { label: "조직도", href: "#" },
    { label: "연혁", href: "#" },
    { label: "채용", href: "#" },
  ],
  service: [
    { label: "솔루션", href: "#" },
    { label: "기술지원", href: "#" },
    { label: "파트너", href: "#" },
    { label: "FAQ", href: "#" },
  ],
  support: [
    { label: "고객센터", href: "#" },
    { label: "이용약관", href: "#" },
    { label: "개인정보처리방침", href: "#" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-foreground text-primary-foreground">
      <div className="container py-12 lg:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {/* Logo & Info */}
          <div className="col-span-2 lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">O</span>
              </div>
              <span className="font-bold text-lg">OCP</span>
            </div>
            <p className="text-primary-foreground/70 text-sm mb-6 max-w-xs">
              AI 기술과 자동화로 비즈니스 혁신을 선도하는 기업
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-primary-foreground/70">
                <MapPin className="w-4 h-4" />
                <span>서울특별시 강남구 테헤란로 123</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-primary-foreground/70">
                <Phone className="w-4 h-4" />
                <span>02-1234-5678</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-primary-foreground/70">
                <Mail className="w-4 h-4" />
                <span>contact@ocp.com</span>
              </div>
            </div>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold mb-4">회사</h4>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Service */}
          <div>
            <h4 className="font-semibold mb-4">서비스</h4>
            <ul className="space-y-2">
              {footerLinks.service.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold mb-4">고객지원</h4>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-primary-foreground/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-primary-foreground/50">
            © 2024 OCP. All rights reserved.
          </p>
          <div className="flex gap-4">
            <a
              href="#"
              className="text-xs text-primary-foreground/50 hover:text-primary-foreground transition-colors"
            >
              이용약관
            </a>
            <a
              href="#"
              className="text-xs text-primary-foreground/50 hover:text-primary-foreground transition-colors"
            >
              개인정보처리방침
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
